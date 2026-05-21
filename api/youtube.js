const { json, getSupabase, slugify, log, requireStaff } = require('../lib/_lib');

function getPlaylistId(url=''){
  const v=String(url||'').trim();
  const m=v.match(/[?&]list=([^&]+)/)||v.match(/playlist\?list=([^&]+)/);
  return m?m[1]:v;
}
function cleanTitle(t=''){
  return String(t)
    .replace(/\|.*$/,'')
    .replace(/\bTürkçe\s+Altyazılı\b/ig,'')
    .replace(/\bFULL\b|\bTÜM\s+BÖLÜMLER\b/ig,'')
    .replace(/\bBölüm\s*\d+\b/ig,'')
    .replace(/\s+/g,' ')
    .trim();
}

function canonicalSeriesName(value='', title=''){
  let x=String(value||title||'').trim();
  if(!x) return 'Tekil Oyun';
  x=x.replace(/[’`´]/g,"'").replace(/\s+/g,' ');
  x=x.replace(/\b(Türkçe\s+Altyazılı|Türkçe\s+Dublajlı|Full|Tüm\s+Bölümler|Final|DLC|Remake|Remaster|Coop|%100)\b/ig,'').trim();
  const rules=[
    [/assassin'?s\s+creed/i,"Assassin's Creed"], [/a\s+plague\s+tale/i,'A Plague Tale'], [/resident\s+evil/i,'Resident Evil'], [/silent\s+hill/i,'Silent Hill'], [/half[-\s]?life|black\s+mesa/i,'Half-Life'], [/dead\s+island/i,'Dead Island'], [/dead\s+space/i,'Dead Space'], [/the\s+last\s+of\s+us/i,'The Last of Us'], [/tomb\s+raider/i,'Tomb Raider'], [/god\s+of\s+war/i,'God of War'], [/uncharted/i,'Uncharted'], [/metro\s+(2033|last\s+light|exodus)?/i,'Metro'], [/batman\s+arkham/i,'Batman Arkham'], [/call\s+of\s+duty/i,'Call of Duty'], [/battlefield/i,'Battlefield'], [/crysis/i,'Crysis'], [/far\s+cry/i,'Far Cry'], [/bioshock/i,'BioShock'], [/dark\s+souls/i,'Dark Souls'], [/mafia/i,'Mafia'], [/max\s+payne/i,'Max Payne'], [/watch\s+dogs/i,'Watch Dogs'], [/alan\s+wake/i,'Alan Wake'], [/little\s+nightmares/i,'Little Nightmares'], [/life\s+is\s+strange/i,'Life is Strange']
  ];
  for(const [re,name] of rules) if(re.test(x)) return name;
  const before=x.split(/[:\-–—]/).map(a=>a.trim()).filter(Boolean)[0]||x;
  return before.replace(/\s+(I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|[0-9]+)\b.*$/i,'').trim()||x;
}

function guessSeries(title=''){
  return canonicalSeriesName(cleanTitle(title), title);
}

function shouldSkipPlaylistTitle(title=''){
  const raw=String(title||'').replace(/[’`´]/g,"'").replace(/\s+/g,' ').trim();
  const cleaned=cleanTitle(raw).replace(/\s+/g,' ').trim();
  if(!cleaned) return true;
  // Seri koleksiyon listeleri oyun değildir; örn. "Assassin's Creed Serisi" sadece başlık/koleksiyon listesi olabilir.
  // Ama "Assassin's Creed 2", "Assassin's Creed Origins", "Assassin's Creed 3 The Tyranny..." gibi oyun/DLC listeleri çekilir.
  if(/\b(tüm\s+seri|seri\s+tamamı|serisi|series|koleksiyon|collection)\b\s*$/i.test(cleaned)){
    const hasGameMarker=/\b(1|2|3|4|5|6|7|8|9|0|I|II|III|IV|V|Origins|Odyssey|Valhalla|Mirage|Unity|Syndicate|Revelations|Brotherhood|Black\s+Flag|Rogue|Liberation|DLC|Remake|Remaster)\b/i.test(cleaned);
    if(!hasGameMarker) return true;
  }
  const canon=canonicalSeriesName(cleaned, cleaned);
  if(canon && cleaned.toLocaleLowerCase('tr-TR') === (canon+' Serisi').toLocaleLowerCase('tr-TR')) return true;
  return false;
}
function normalizeChannel(input=''){
  let v=String(input||'@HayatimizOyunn').trim();
  try{
    if(/^https?:\/\//i.test(v)){
      const u=new URL(v);
      const p=u.pathname.replace(/^\/+|\/+$/g,'');
      if(p.startsWith('@'))return{handle:p};
      const seg=p.split('/');
      if(seg[0]==='channel'&&seg[1])return{id:seg[1]};
      if((seg[0]==='c'||seg[0]==='user')&&seg[1])return{query:seg[1]};
    }
  }catch{}
  if(v.startsWith('@'))return{handle:v};
  if(/^UC[\w-]{20,}$/i.test(v))return{id:v};
  return{handle:'@'+v.replace(/^@/,'')};
}
async function ytFetch(url){
  const r=await fetch(url,{headers:{accept:'application/json'}});
  const text=await r.text();
  let j;
  try{j=JSON.parse(text)}catch{throw new Error('YouTube API JSON dönmedi. API key, kota veya Vercel loglarını kontrol et. HTTP '+r.status)}
  if(!r.ok||j.error)throw new Error(j.error?.message||`YouTube API hatası: HTTP ${r.status}`);
  return j;
}
async function getChannelId(key,input){
  const n=normalizeChannel(input);
  if(n.id)return n.id;
  if(n.handle){
    const handle=n.handle.startsWith('@')?n.handle:'@'+n.handle;
    for(const h of [handle,handle.replace(/^@/,'')]){
      try{
        const ch=await ytFetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails&forHandle=${encodeURIComponent(h)}&key=${key}`);
        if(ch.items?.[0])return ch.items[0].id;
      }catch{}
    }
    n.query=handle.replace('@','');
  }
  const q=n.query||String(input||'HayatimizOyunn').replace(/^@/,'');
  const sr=await ytFetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&maxResults=1&q=${encodeURIComponent(q)}&key=${key}`);
  const id=sr.items?.[0]?.snippet?.channelId||sr.items?.[0]?.id?.channelId;
  if(!id)throw new Error('YouTube kanalı bulunamadı. Kanal linki veya @handle kontrol et.');
  return id;
}
function wantedLimit(v,def=10000){
  const all=String(v||'all').toLowerCase()==='all'||Number(v)===0||!Number.isFinite(Number(v));
  return all?def:Math.max(1,Number(v));
}
async function playlistEpisodes(key,playlistId,maxEpisodes='all'){
  const hardMax=wantedLimit(maxEpisodes,10000);
  let pageToken='',items=[];
  do{
    const left=Math.max(1,Math.min(50,hardMax-items.length));
    const j=await ytFetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${left}&playlistId=${playlistId}&key=${key}${pageToken?`&pageToken=${pageToken}`:''}`);
    items.push(...(j.items||[]));
    pageToken=j.nextPageToken||'';
  }while(pageToken&&items.length<hardMax);
  return items.map((it,i)=>({
    no:i+1,
    title:it.snippet.title,
    videoId:it.snippet.resourceId&&it.snippet.resourceId.videoId,
    thumbnail:it.snippet.thumbnails?.maxres?.url||it.snippet.thumbnails?.high?.url||it.snippet.thumbnails?.medium?.url||it.snippet.thumbnails?.default?.url||'',
    url:`https://www.youtube.com/watch?v=${it.snippet.resourceId&&it.snippet.resourceId.videoId}`,
    publishedAt:it.snippet.publishedAt||''
  })).filter(x=>x.videoId&&!/private|deleted|silindi|gizli/i.test(x.title));
}
async function getPlaylistMeta(key,id){
  const j=await ytFetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id=${encodeURIComponent(id)}&key=${key}`);
  const p=j.items?.[0];
  if(!p)throw new Error('Playlist bulunamadı.');
  return p;
}
async function getPlaylistsByOwner(key,channelId,maxPlaylists='all'){
  const hardMax=wantedLimit(maxPlaylists,10000);
  let pageToken='',items=[];
  do{
    const left=Math.max(1,Math.min(50,hardMax-items.length));
    const j=await ytFetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&maxResults=${left}&channelId=${channelId}&key=${key}${pageToken?`&pageToken=${pageToken}`:''}`);
    items.push(...(j.items||[]));
    pageToken=j.nextPageToken||'';
  }while(pageToken&&items.length<hardMax);
  return items;
}
async function getPlaylistsBySearch(key,channelId,maxPlaylists='all'){
  const hardMax=wantedLimit(maxPlaylists,500);
  let pageToken='',items=[];
  do{
    const left=Math.max(1,Math.min(50,hardMax-items.length));
    const j=await ytFetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=playlist&order=date&maxResults=${left}&channelId=${channelId}&key=${key}${pageToken?`&pageToken=${pageToken}`:''}`);
    const ids=(j.items||[]).map(x=>x.id?.playlistId).filter(Boolean);
    if(ids.length){
      const detail=await ytFetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id=${ids.map(encodeURIComponent).join(',')}&key=${key}`);
      items.push(...(detail.items||[]));
    }
    pageToken=j.nextPageToken||'';
  }while(pageToken&&items.length<hardMax);
  return items;
}
async function getPlaylists(key,channelId,maxPlaylists='all'){
  const hardMax=wantedLimit(maxPlaylists,10000);
  const map=new Map();
  const add=p=>{
    if(!p?.id)return;
    const title=p.snippet?.title||'';
    const count=p.contentDetails?.itemCount||0;
    if(count<=0)return;
    if(/private|deleted|silindi|gizli/i.test(title))return;
    if(shouldSkipPlaylistTitle(title))return;
    map.set(p.id,p);
  };
  const owned=await getPlaylistsByOwner(key,channelId,hardMax);
  owned.forEach(add);
  // Bazı kanallarda YouTube API playlists.list her public listeyi döndürmeyebiliyor.
  // Bu yüzden search.list type=playlist ile ikinci tarama yapıp eksikleri birleştiriyoruz.
  try{(await getPlaylistsBySearch(key,channelId,hardMax)).forEach(add)}catch{}
  return [...map.values()].sort((a,b)=>new Date(a.snippet?.publishedAt||0)-new Date(b.snippet?.publishedAt||0));
}
function makeStory(title, no=0){
  const clean = String(title||'Bu bölüm').replace(/\s+/g,' ').trim();
  return no ? `${clean}: Serinin ${no}. bölümünde hikaye akışı, keşifler ve önemli anlar kısa şekilde izleyiciye aktarılır.` : `${clean}, kanal arşivindeki bölümleri sırayla izlenebilen bir oyun hikaye serisidir. Bölümler oyun ilerleyişini, önemli sahneleri ve hikaye akışını takip edecek şekilde listelenir.`;
}
function enrichEpisodes(episodes,title){
  return (episodes||[]).map((e,i)=>({...e, story:e.story||makeStory(e.title||title,i+1)}));
}

function cleanRawgSearchTitle(title=''){
  return String(title||'')
    .replace(/[’`´]/g,"'")
    .replace(/\b(Türkçe|Turkce|Altyazılı|Altyazili|Dublajlı|Dublajli|DLC|Final|Bölüm|Bolum|Part|Episode|Gameplay|Oynanış|Full|HD|4K)\b/gi,' ')
    .replace(/[|#\[\]{}()]/g,' ')
    .replace(/\s+/g,' ')
    .trim()
    .slice(0,90);
}
function ytFmtDate(v){
  if(!v)return'';
  const d=new Date(String(v).includes('T')?v:v+'T00:00:00');
  if(Number.isNaN(d.getTime()))return'';
  return d.toLocaleDateString('tr-TR',{day:'2-digit',month:'2-digit',year:'numeric'});
}
function mapGenre(name=''){
  const d={Action:'Aksiyon',Adventure:'Macera',RPG:'RPG',Shooter:'Nişancı',Puzzle:'Bulmaca',Racing:'Yarış',Sports:'Spor',Strategy:'Strateji',Simulation:'Simülasyon',Platformer:'Platform',Fighting:'Dövüş',Indie:'Bağımsız',Arcade:'Arcade',Casual:'Gündelik'};
  return d[name]||name;
}
async function rawgMainGameInfo(title=''){
  const key=process.env.RAWG_API_KEY;
  if(!key)return{};
  const q=cleanRawgSearchTitle(title);
  if(!q)return{};
  try{
    const url=`https://api.rawg.io/api/games?key=${encodeURIComponent(key)}&search=${encodeURIComponent(q)}&page_size=1&search_precise=true`;
    const r=await fetch(url,{headers:{'Accept-Language':'tr-TR,tr;q=0.9,en;q=0.8'}});
    const j=await r.json();
    const g=j.results&&j.results[0];
    if(!g)return{};
    return{
      cover:g.background_image||'',
      release_date:ytFmtDate(g.released||''),
      genre:(g.genres||[]).map(x=>mapGenre(x.name)).filter(Boolean).slice(0,4).join(', '),
      rawg_id:String(g.id||'')
    };
  }catch{return{};}
}

async function gameFromPlaylist(p,episodes){
  const title=cleanTitle(p.snippet.title)||'YouTube Oyunu';
  const enriched=enrichEpisodes(episodes,title);
  const rawg=await rawgMainGameInfo(title);
  return{
    title,
    slug:slugify(title),
    series:guessSeries(title),
    status:'Devam Ediyor',
    type:'Ana Oyun',
    genre:rawg.genre||'Oyun',
    tags:['Türkçe Altyazılı'],
    description:makeStory(title,0),
    // Fix 7: Kanal/playlist thumbnail kapak olarak kullanılmaz. Oyun ana görseli RAWG üzerinden çekilir.
    cover:rawg.cover||'',
    release_date:rawg.release_date||(p.snippet.publishedAt?new Date(p.snippet.publishedAt).toLocaleDateString('tr-TR',{day:'2-digit',month:'2-digit',year:'numeric'}):''),
    rawg_id:rawg.rawg_id||'',
    playlist_url:`https://www.youtube.com/playlist?list=${p.id}`,
    youtube_playlist_id:p.id,
    order_no:0,
    episodes: enriched
  };
}

const YT_GAME_DB_COLUMNS = new Set([
  'id','title','slug','series','status','type','release_date','upcoming_start','genre','tags',
  'description','cover','playlist_url','youtube_playlist_id','rawg_id','order_no','episodes',
  'canon','created_at','updated_at'
]);
function sanitizeGameForDb(game = {}) {
  const src = { ...(game || {}) };
  if (!src.cover && src.thumbnail) src.cover = src.thumbnail;
  const out = {};
  for (const [key, value] of Object.entries(src)) {
    if (YT_GAME_DB_COLUMNS.has(key)) out[key] = value;
  }
  return out;
}

async function saveGame(req,pid,key,maxEpisodes='all'){
  if(!(await requireStaff(req,'Editör')))throw new Error('Bu işlem için yetkili kullanıcıyla giriş gerekli.');
  const p=await getPlaylistMeta(key,pid);
  if(shouldSkipPlaylistTitle(p.snippet?.title||'')) throw new Error('Bu oynatma listesi seri/koleksiyon başlığı olduğu için oyun olarak eklenmedi: '+(p.snippet?.title||pid));
  const episodes=await playlistEpisodes(key,pid,maxEpisodes);
  if(!episodes.length)throw new Error('Playlistte public bölüm yok.');
  const g=await gameFromPlaylist(p,episodes);
  const s=getSupabase();
  const {error}=await s.from('games').upsert(sanitizeGameForDb(g),{onConflict:'slug'});
  if(error)throw error;
  await log('YouTube playlist oyun olarak eklendi',`${g.title} - ${episodes.length} bölüm`,req);
  return{game:g,episodes:episodes.length,saved:1};
}
module.exports=async function handler(req,res){
  try{
    const key=process.env.YOUTUBE_API_KEY;
    if(!key)return json(res,400,{ok:false,message:'YOUTUBE_API_KEY Vercel Environment Variables içine eklenmemiş.'});
    const q=req.query||{};
    if(q.channel){
      const channelId=await getChannelId(key,q.channel);
      const playlists=await getPlaylists(key,channelId,q.limit||'all');
      const list=playlists.map((p,idx)=>({
        index:idx+1,
        id:p.id,
        title:cleanTitle(p.snippet.title),
        rawTitle:p.snippet.title,
        itemCount:p.contentDetails?.itemCount||0,
        publishedAt:p.snippet.publishedAt||'',
        thumbnail:p.snippet.thumbnails?.high?.url||p.snippet.thumbnails?.medium?.url||''
      }));
      if(q.action==='list'||q.list==='1')return json(res,200,{ok:true,channelId,count:list.length,playlists:list,message:'Public oyun oynatma listeleri listelendi. Seri/koleksiyon başlığı olan listeler filtrelendi.'});
      if(q.save==='1'){
        // Büyük kanallarda 504 yememek için varsayılan batch küçük tutulur.
        // Frontend Fix 2 zaten action=list sonrası hepsini tek tek import eder.
        const start=Math.max(0,Number(q.start||0));
        const batch=Math.max(1,Math.min(10,Number(q.batch||5)));
        const games=[],errors=[];let saved=0;
        for(const p of playlists.slice(start,start+batch)){
          try{const r=await saveGame(req,p.id,key,q.maxEpisodes||'all');games.push(r.game);saved+=r.saved}catch(e){errors.push(`${p.snippet?.title||p.id}: ${e.message}`)}
        }
        return json(res,200,{ok:true,channelId,total:playlists.length,start,batch,nextStart:start+batch<playlists.length?start+batch:null,count:games.length,saved,errors,games,message:'Batch import tamamlandı. Seri/koleksiyon başlığı olan listeler atlandı.'});
      }
      return json(res,200,{ok:true,channelId,count:list.length,playlists:list});
    }
    if(q.importPlaylist){
      const r=await saveGame(req,q.importPlaylist,key,q.maxEpisodes||'all');
      return json(res,200,{ok:true,...r});
    }
    const playlistId=getPlaylistId(q.playlist||'');
    if(!playlistId)return json(res,400,{ok:false,message:'playlist gerekli.'});
    const episodes=await playlistEpisodes(key,playlistId,q.maxEpisodes||'all');
    json(res,200,{ok:true,playlistId,episodes});
  }catch(e){json(res,500,{ok:false,message:e.message});}
};
module.exports.config={maxDuration:60};
