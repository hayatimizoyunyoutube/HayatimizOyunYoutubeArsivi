import crypto from 'crypto';

const STAFF_ROLES = ['kurucu','yonetici','moderator','editor'];
const OWNER_ROLES = ['kurucu','yonetici'];
const FEATURE_CATALOG = [
  { key:'admin_games_add_button', title:'Oyunlar sekmesine Oyun Ekle butonu ekle', group:'Siteye Gelmesi Gerekenler', next:'Oyun düzenleme ve silme butonlarını aktif et', target:'Yönetim Paneli > Oyunlar', description:'Oyun Ekle formunu görünür yapar.' },
  { key:'auto_cover_fetch', title:'Otomatik kapak resmi çekme sistemini aç', group:'Siteye Gelmesi Gerekenler', next:'RAWG kapak eşleştirme için manuel onay ekranı ekle', target:'Yönetim Paneli > Oyunlar', description:'Kapaksız oyunlara otomatik kapak atama butonunu açar.' },
  { key:'update_notes_editor', title:'Güncelleme notu editörünü Supabase site_update_notes tablosuna bağla', group:'Siteye Gelmesi Gerekenler', next:'Güncelleme notlarına sürüm filtresi ve arama ekle', target:'Yönetim Paneli > Güncelleme Notları', description:'Güncelleme notu editörünü açar.' },
  { key:'profile_photo_upload', title:'Profil fotoğrafı yükleme alanı ekle', group:'Siteye Gelmesi Gerekenler', next:'Profil fotoğrafını profile-photos bucket içine yükle', target:'Profilim', description:'Profil fotoğrafını profile-photos Storage bucket içine yükler.' },
  { key:'game_auto_meta_fetch', title:'Oyun adından tür, etiket ve açıklama otomatik çekme', group:'Siteye Gelmesi Gerekenler', next:'Oyun düzenleme formunda otomatik meta yenile butonu ekle', target:'Yönetim Paneli > Oyunlar', description:'Oyun adı yazınca tür, etiket ve kapak önerisi doldurma modülünü açar.' },
  { key:'game_edit_delete_buttons', title:'Oyunları düzenle ve sil butonlarını aktif et', group:'Siteye Gelmesi Gerekenler', next:'Oyun düzenleme ekranına kapak önizleme ve otomatik meta yenile ekle', target:'Yönetim Paneli > Oyunlar', description:'Oyun kartlarına Düzenle/Sil butonlarını açar.' },
  { key:'missing_cover_warning', title:'Oyun kartında eksik kapak sarı uyarısını otomatik göster', group:'Gözden Kaçanlar', next:'Eksik kapakları RAWG kapağıyla eşleştir', target:'Oyun kartları', description:'Kapak eksik uyarısını açar.' },
  { key:'maintenance_message_editor', title:'Bakım modu yazısını panelden düzenleme alanı ekle', group:'Siteye Gelmesi Gerekenler', next:'Bakım moduna tahmini açılış zamanı ekle', target:'Yönetim Paneli > Bakım Modu', description:'Bakım mesajı düzenleme alanını güçlendirir.' }
];

function json(res, status, payload){
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}
function normalizeRole(role){
  const raw = String(role || 'user').trim().toLowerCase();
  const ascii = raw.replace(/ı/g,'i').replace(/İ/g,'i').replace(/ö/g,'o').replace(/ü/g,'u').replace(/ğ/g,'g').replace(/ş/g,'s').replace(/ç/g,'c');
  if(['kurucu','founder','owner','sahip'].includes(ascii)) return 'kurucu';
  if(['yonetici','yönetici','admin','administrator'].includes(ascii)) return 'yonetici';
  if(['moderator','mod','moderatör'].includes(ascii)) return 'moderator';
  if(['editor','editör'].includes(ascii)) return 'editor';
  if(['banned','banli','banlı'].includes(ascii)) return 'banned';
  return 'user';
}
function isStaff(role){ return STAFF_ROLES.includes(normalizeRole(role)); }
function isOwner(role){ return OWNER_ROLES.includes(normalizeRole(role)); }
function signToken(payload){
  const secret = process.env.ADMIN_PASSWORD || process.env.SUPABASE_SERVICE_ROLE_KEY || 'local-secret';
  const body = Buffer.from(JSON.stringify({ ...payload, iat:Date.now() })).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  return `${body}.${sig}`;
}
function verifyToken(token){
  if(!token || !token.includes('.')) return null;
  const secret = process.env.ADMIN_PASSWORD || process.env.SUPABASE_SERVICE_ROLE_KEY || 'local-secret';
  const [body, sig] = token.split('.');
  const expected = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  if(sig !== expected) return null;
  try { return JSON.parse(Buffer.from(body, 'base64url').toString('utf8')); } catch { return null; }
}
function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')){
  const hash = crypto.pbkdf2Sync(String(password), salt, 120000, 32, 'sha256').toString('hex');
  return { salt, hash };
}
function cleanUser(user){
  if(!user) return null;
  const role = normalizeRole(user.role);
  return {
    id:user.id, full_name:user.full_name || '', avatar_url:user.avatar_url || '', email:user.email, role,
    is_active:user.is_active !== false && role !== 'banned',
    banned_at:user.banned_at || null, ban_reason:user.ban_reason || null,
    created_at:user.created_at, updated_at:user.updated_at, last_login_at:user.last_login_at
  };
}
function cleanGame(game){
  if(!game) return null;
  return {
    id:game.id,
    title:game.title || game.name || 'İsimsiz Oyun',
    genre:game.genre || game.category || 'Genel',
    status:game.status || 'Devam Ediyor',
    episode_count:Number(game.episode_count ?? game.eps ?? 0),
    score:Number(game.score ?? 0),
    cover_url:game.cover_url || game.cover || '',
    tags:game.tags || '',
    release_date:game.release_date || game.releaseDate || '',
    rawg_slug:game.rawg_slug || '',
    series_name:game.series_name || '',
    playlist_url:game.playlist_url || '',
    video_url:game.video_url || '',
    episodes:Array.isArray(game.episodes) ? game.episodes : [],
    watched_episode_count:Number(game.watched_episode_count ?? 0),
    series_order:Number(game.series_order ?? 0),
    description:game.description || '',
    created_at:game.created_at,
    updated_at:game.updated_at
  };
}
async function readBody(req){
  let raw = '';
  for await (const chunk of req) raw += chunk;
  if(!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}
function env(){
  const url = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if(!url || !key) throw new Error('Vercel ENV içinde SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY olmalı.');
  return { url, key };
}
async function supabase(path, options = {}){
  const { url, key } = env();
  const fullUrl = `${url}/rest/v1/${path}`;
  const headers = {
    apikey:key,
    Authorization:`Bearer ${key}`,
    'Content-Type':'application/json',
    Prefer: options.headers?.Prefer || 'return=representation',
    ...(options.headers || {})
  };
  const response = await fetch(fullUrl, { ...options, headers });
  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if(!response.ok){
    const message = data?.message || data?.hint || text || `Supabase HTTP ${response.status}`;
    throw new Error(message);
  }
  return data;
}

async function supabaseStorageUpload(bucket, objectPath, buffer, contentType){
  const { url, key } = env();
  const response = await fetch(`${url}/storage/v1/object/${bucket}/${objectPath}`, {
    method:'POST',
    headers:{ apikey:key, Authorization:`Bearer ${key}`, 'Content-Type':contentType || 'application/octet-stream', 'x-upsert':'true' },
    body:buffer
  });
  const text = await response.text();
  if(!response.ok) throw new Error(text || `Storage HTTP ${response.status}`);
  return `${url}/storage/v1/object/public/${bucket}/${objectPath}`;
}

async function getUserByEmail(email){
  const rows = await supabase(`site_users?email=eq.${encodeURIComponent(email)}&limit=1`, { method:'GET' });
  return Array.isArray(rows) ? rows[0] : null;
}
async function getUserById(id){
  const rows = await supabase(`site_users?id=eq.${encodeURIComponent(id)}&limit=1`, { method:'GET' });
  return Array.isArray(rows) ? rows[0] : null;
}
async function requireStaff(token){
  const data = verifyToken(token);
  if(!data || !isStaff(data.role)) throw new Error('Yetkili oturum gerekli.');
  const user = await getUserByEmail(String(data.email || '').toLowerCase()).catch(()=>null);
  if(!user || user.is_active === false || !isStaff(user.role)) throw new Error('Yetki güncel değil. Tekrar giriş yap.');
  return user;
}
async function requireOwner(token){
  const user = await requireStaff(token);
  if(!isOwner(user.role)) throw new Error('Bu işlem için kurucu veya yönetici gerekir.');
  return user;
}
async function ensurePlannerFeature(feature){
  const existing = await supabase(`site_admin_planner?title=eq.${encodeURIComponent(feature.title)}&limit=1`, { method:'GET' }).catch(()=>[]);
  if(!Array.isArray(existing) || !existing.length){
    await supabase('site_admin_planner', { method:'POST', body: JSON.stringify([{ group_name:feature.group, title:feature.title, status:'plan', feature_key:feature.key }]) }).catch(()=>{});
  }
}

async function ho240f31GamesListResilient(){
  const queries = [
    'games?select=id,title,genre,status,episode_count,score,cover_url,tags,release_date,rawg_slug,series_name,playlist_url,video_url,watched_episode_count,series_order,episodes,description,created_at,updated_at&order=created_at.desc',
    'games?select=*&order=created_at.desc',
    'games?select=*&order=title.asc',
    'games?select=*&limit=1000'
  ];
  let lastError = '';
  for(const query of queries){
    try{
      const rows = await supabase(query, { method:'GET' });
      if(Array.isArray(rows)) return { rows, warning:lastError, recovered:Boolean(lastError) };
    }catch(error){
      lastError = error?.message || String(error);
    }
  }
  return { rows:[], warning:lastError || 'Supabase games listesi alınamadı.', recovered:false };
}


function normalizeRawgDate(value){
  if(!value) return '';
  const m = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[3]}.${m[2]}.${m[1]}` : String(value);
}
function localGameMeta(title){
  const t = String(title || '').toLowerCase();
  const rows = [
    [/a\s*way\s*out|away\s*out/i, { exact:true, title:'A Way Out', seriesName:'A Way Out', genre:'Aksiyon-macera, co-op, hikaye odaklı, kaçış, sinematik', released:'23.03.2018', releaseDate:'23.03.2018', score:8.2, cover:'https://cdn.akamai.steamstatic.com/steam/apps/1222700/header.jpg', slug:'a-way-out' }],
    [/alan\s*wake.*remaster|alan\s*wake/i, { exact:true, title:'Alan Wake Remastered', seriesName:'Alan Wake', genre:'Aksiyon-macera, psikolojik korku, hikaye odaklı, tek oyunculu', released:'05.10.2021', releaseDate:'05.10.2021', score:8.0, cover:'https://cdn.akamai.steamstatic.com/steam/apps/108710/header.jpg', slug:'alan-wake-remastered' }],
    [/plague.*innocence|innocence/i, { exact:true, title:'A Plague Tale: Innocence', seriesName:'A Plague Tale', genre:'Macera, aksiyon, gizlilik, hikaye odaklı, tek oyunculu', released:'14.05.2019', releaseDate:'14.05.2019', score:8.3, cover:'https://cdn.akamai.steamstatic.com/steam/apps/752590/header.jpg', slug:'a-plague-tale-innocence' }],
    [/plague.*requiem|requiem/i, { exact:true, title:'A Plague Tale: Requiem', seriesName:'A Plague Tale', genre:'Macera, aksiyon, gizlilik, hikaye odaklı, tek oyunculu', released:'18.10.2022', releaseDate:'18.10.2022', score:8.6, cover:'https://cdn.akamai.steamstatic.com/steam/apps/1182900/header.jpg', slug:'a-plague-tale-requiem' }],
    [/assassin.*origins|origins/i, { exact:true, title:"Assassin's Creed Origins", seriesName:"Assassin's Creed", genre:'Aksiyon, Macera, RPG, Açık Dünya, Gizlilik', released:'27.10.2017', releaseDate:'27.10.2017', score:8.5, cover:'https://cdn.akamai.steamstatic.com/steam/apps/582160/header.jpg', slug:'assassins-creed-origins' }],
    [/cyberpunk\s*2077/i, { exact:true, title:'Cyberpunk 2077', seriesName:'Cyberpunk', genre:'Aksiyon RPG, Açık Dünya, Bilim Kurgu, Hikaye Odaklı', released:'10.12.2020', releaseDate:'10.12.2020', score:9.1, cover:'https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg', slug:'cyberpunk-2077' }],
    [/witcher\s*3|wild\s*hunt/i, { exact:true, title:'The Witcher 3: Wild Hunt', seriesName:'The Witcher', genre:'RPG, Açık Dünya, Fantastik, Hikaye Odaklı', released:'19.05.2015', releaseDate:'19.05.2015', score:9.6, cover:'https://cdn.akamai.steamstatic.com/steam/apps/292030/header.jpg', slug:'the-witcher-3-wild-hunt' }],
    [/elden\s*ring/i, { exact:true, title:'Elden Ring', seriesName:'Elden Ring', genre:'Aksiyon RPG, Açık Dünya, Soulslike, Fantastik', released:'25.02.2022', releaseDate:'25.02.2022', score:9.6, cover:'https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg', slug:'elden-ring' }],
    [/red\s*dead\s*redemption\s*2|rdr\s*2/i, { exact:true, title:'Red Dead Redemption 2', seriesName:'Red Dead', genre:'Aksiyon-macera, Açık Dünya, Western, Hikaye Odaklı', released:'26.10.2018', releaseDate:'26.10.2018', score:9.7, cover:'https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg', slug:'red-dead-redemption-2' }],
    [/god\s*of\s*war\s*ragnarok|ragnarök/i, { exact:true, title:'God of War Ragnarök', seriesName:'God of War', genre:'Aksiyon-macera, Mitoloji, Hikaye Odaklı', released:'09.11.2022', releaseDate:'09.11.2022', score:9.4, cover:'https://cdn.akamai.steamstatic.com/steam/apps/2322010/header.jpg', slug:'god-of-war-ragnarok' }]
  ];
  const found = rows.find(([r])=>r.test(t));
  if(found) return found[1];
  return { title:String(title || 'Yeni Oyun').trim(), genre:'Aksiyon-macera, Hikaye Odaklı', released:'', releaseDate:'', score:8.5, cover:'', slug:'' };
}
function translateGenre(name){
  const map = { Action:'Aksiyon', Adventure:'Macera', RPG:'RPG', Shooter:'Nişancı', Puzzle:'Bulmaca', Strategy:'Strateji', Simulation:'Simülasyon', Sports:'Spor', Racing:'Yarış', Platformer:'Platform', Indie:'Bağımsız', Horror:'Korku', Fighting:'Dövüş' };
  return map[name] || name;
}
function stripHtml(value){ return String(value || '').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim(); }
function localTurkishStory(title, genre=''){
  const name = String(title || 'Bu oyun').trim() || 'Bu oyun';
  const key = (name + ' ' + genre).toLocaleLowerCase('tr-TR');
  if(key.includes('assassin') || key.includes('origins')) return `${name}, Antik Mısır döneminde geçen hikaye odaklı bir macera sunar. Oyuncu, Bayek'in kişisel intikam yolculuğunu, halkını koruma mücadelesini ve Suikastçı Kardeşliği'nin temellerine uzanan olayları bölüm bölüm takip eder.`;
  if(key.includes('resident') || key.includes('silent') || key.includes('alan wake') || key.includes('outlast') || key.includes('korku')) return `${name}, gerilim ve hayatta kalma atmosferini öne çıkaran hikaye odaklı bir deneyim sunar. Oyuncu, karanlık olayların arkasındaki sırrı çözerken bölüm bölüm ilerleyen tehditlerle yüzleşir.`;
  if(key.includes('rpg') || key.includes('açık dünya') || key.includes('macera') || key.includes('aksiyon')) return `${name}, keşif, mücadele ve hikaye ilerleyişini bir araya getiren bir seridir. Oyuncu görevleri tamamlayarak ana hikayeyi, yan içerikleri ve bölüm ilerlemesini takip eder.`;
  return `${name}, oyun arşivinde bölüm bölüm takip edilecek bir içerik olarak kaydedildi. Bu alanda oyunun hikayesi, ilerleme durumu, seri bilgisi ve izleme notları tutulur.`;
}
async function fetchRawgDetails(slug, key){
  if(!slug || !key) return null;
  const url = `https://api.rawg.io/api/games/${encodeURIComponent(slug)}?key=${encodeURIComponent(key)}`;
  const response = await fetch(url, { headers:{ 'User-Agent':'Hayatimiz-Oyun-Archive' } });
  if(!response.ok) return null;
  const data = await response.json();
  return { description:stripHtml(data.description_raw || data.description || ''), website:data.website || '' };
}
async function fetchRawgMeta(title){
  const key = process.env.RAWG_API_KEY || '';
  if(!key) return null;
  const url = `https://api.rawg.io/api/games?key=${encodeURIComponent(key)}&search=${encodeURIComponent(title)}&page_size=5&search_precise=false`;
  const response = await fetch(url, { headers:{ 'User-Agent':'Hayatimiz-Oyun-Archive' } });
  if(!response.ok) return null;
  const data = await response.json();
  const candidates = [];
  for(const game of (data?.results || []).slice(0,5)){
    const genres = Array.isArray(game.genres) ? game.genres.map(g=>translateGenre(g.name)).filter(Boolean).join(', ') : '';
    const details = await fetchRawgDetails(game.slug, key).catch(()=>null);
    candidates.push({
      title:game.name || title,
      genre:genres || 'Genel',
      released:normalizeRawgDate(game.released),
      score:Number(game.rating || 0) ? Math.min(10, Number(game.rating) * 2).toFixed(1) : 8.5,
      cover:game.background_image || '',
      rawg_slug:game.slug || '',
      description:localTurkishStory(game.name || title, genres)
    });
  }
  return candidates.length ? { ...candidates[0], candidates } : null;
}

function extractYoutubePlaylistId(raw){
  const value = String(raw || '').trim();
  if(!value) return '';
  try{
    const u = new URL(value);
    const list = u.searchParams.get('list');
    if(list) return list;
  }catch{}
  const m = value.match(/[?&]list=([^&\s]+)/) || value.match(/playlist\?list=([^&\s]+)/) || value.match(/list=([^&\s]+)/);
  return m ? decodeURIComponent(m[1]) : '';
}
function cleanYoutubeTitle(value){
  return String(value || '')
    .replace(/\\u0026/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}
function uniqueEpisodes(rows){
  const seen = new Set();
  const out = [];
  for(const row of rows || []){
    const videoId = String(row.videoId || '').trim();
    if(!videoId || seen.has(videoId)) continue;
    if(/deleted video|private video/i.test(row.title || '')) continue;
    seen.add(videoId);
    const idx = out.length + 1;
    out.push({
      id:`yt-${videoId}`,
      number:idx,
      title:cleanYoutubeTitle(row.title) || `${idx}. Bölüm`,
      description:'',
      thumbnail:row.thumbnail || `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
      videoId,
      videoUrl:`https://www.youtube.com/watch?v=${videoId}`,
      watched:false
    });
  }
  return out;
}
async function fetchYoutubePlaylistItemsNoKey(playlistUrl){
  const playlistId = extractYoutubePlaylistId(playlistUrl);
  if(!playlistId) return { count:0, episodes:[] };
  const url = `https://www.youtube.com/playlist?list=${encodeURIComponent(playlistId)}`;
  const response = await fetch(url, { headers:{ 'User-Agent':'Mozilla/5.0 HayatimizOyunBot/1.0', 'Accept-Language':'tr-TR,tr;q=0.9,en;q=0.7' } });
  if(!response.ok) return { count:0, episodes:[] };
  const html = await response.text();
  const rows = [];
  const blocks = html.split('playlistVideoRenderer');
  for(const block of blocks){
    const videoId = (block.match(/"videoId":"([a-zA-Z0-9_-]{11})"/) || [])[1];
    if(!videoId) continue;
    const simple = block.match(/"title":\{"simpleText":"([^"]+)"\}/);
    const runs = block.match(/"title":\{"runs":\[\{"text":"([^"]+)"\}\]/);
    const title = cleanYoutubeTitle((simple && simple[1]) || (runs && runs[1]) || '');
    rows.push({ videoId, title:title || `${rows.length+1}. Bölüm`, thumbnail:`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg` });
  }
  if(!rows.length){
    const ids = [...html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)].map(m=>m[1]);
    for(const videoId of ids) rows.push({ videoId, title:`${rows.length+1}. Bölüm`, thumbnail:`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg` });
  }
  const episodes = uniqueEpisodes(rows).slice(0, 500);
  return { count:episodes.length, episodes };
}
async function fetchYoutubePlaylistItems(playlistUrl){
  const playlistId = extractYoutubePlaylistId(playlistUrl);
  if(!playlistId) return { count:0, episodes:[] };
  const key = process.env.YOUTUBE_API_KEY || '';
  if(!key) return await fetchYoutubePlaylistItemsNoKey(playlistUrl);
  const rows = [];
  let pageToken = '';
  for(let page=0; page<20; page++){
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${encodeURIComponent(playlistId)}&key=${encodeURIComponent(key)}${pageToken?`&pageToken=${encodeURIComponent(pageToken)}`:''}`;
    const response = await fetch(url);
    if(!response.ok) break;
    const data = await response.json();
    (data.items || []).forEach((item)=>{
      const sn = item.snippet || {};
      const videoId = item.contentDetails?.videoId || sn.resourceId?.videoId || '';
      rows.push({
        videoId,
        title:sn.title || '',
        thumbnail:sn.thumbnails?.medium?.url || sn.thumbnails?.default?.url || `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`
      });
    });
    pageToken = data.nextPageToken || '';
    if(!pageToken) break;
  }
  let episodes = uniqueEpisodes(rows);
  if(!episodes.length) return await fetchYoutubePlaylistItemsNoKey(playlistUrl);
  return { count:episodes.length, episodes };
}
async function fetchYoutubePlaylistCount(playlistUrl){
  const key = process.env.YOUTUBE_API_KEY || '';
  if(!key) return 0;
  const playlistId = extractYoutubePlaylistId(playlistUrl);
  if(!playlistId) return 0;
  const url = `https://www.googleapis.com/youtube/v3/playlists?part=contentDetails&id=${encodeURIComponent(playlistId)}&key=${encodeURIComponent(key)}`;
  const response = await fetch(url);
  if(!response.ok) return 0;
  const data = await response.json();
  return Number(data?.items?.[0]?.contentDetails?.itemCount || 0);
}

export default async function handler(req, res){
  if(req.method === 'OPTIONS') return json(res, 200, { ok:true });
  const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`);
  const action = url.searchParams.get('action') || 'health';
  const body = req.method === 'POST' ? await readBody(req) : {};

  try{
    if(action === 'health') return json(res, 200, { ok:true, version:'v2.4.4' });

    if(action === 'register'){
      const email = String(body.email || '').trim().toLowerCase();
      const fullName = String(body.fullName || '').trim();
      const password = String(body.password || '');
      if(!email || !password) throw new Error('E-posta ve şifre gerekli.');
      if(await getUserByEmail(email)) throw new Error('Bu e-posta zaten kayıtlı.');
      const { salt, hash } = hashPassword(password);
      const rows = await supabase('site_users', { method:'POST', body: JSON.stringify([{ full_name:fullName || email.split('@')[0], email, password_hash:hash, password_salt:salt, role:'user', is_active:true }]) });
      const user = cleanUser(rows?.[0]);
      return json(res, 200, { ok:true, user, adminToken:isStaff(user.role) ? signToken({ email:user.email, role:user.role }) : null });
    }

    if(action === 'login'){
      const email = String(body.email || '').trim().toLowerCase();
      const password = String(body.password || '');
      const userRaw = await getUserByEmail(email);
      if(!userRaw) throw new Error('Kullanıcı bulunamadı.');
      const role = normalizeRole(userRaw.role);
      if(userRaw.is_active === false || role === 'banned') throw new Error(userRaw.ban_reason || 'Hesap banlı.');
      const { hash } = hashPassword(password, userRaw.password_salt || '');
      if(hash !== userRaw.password_hash) throw new Error('Şifre hatalı.');
      await supabase(`site_users?id=eq.${encodeURIComponent(userRaw.id)}`, { method:'PATCH', body: JSON.stringify({ last_login_at:new Date().toISOString(), role }) }).catch(()=>{});
      const user = cleanUser({ ...userRaw, role });
      return json(res, 200, { ok:true, user, adminToken:isStaff(user.role) ? signToken({ email:user.email, role:user.role }) : null });
    }

    if(action === 'session-refresh'){
      const email = String(body.email || '').trim().toLowerCase();
      const user = cleanUser(await getUserByEmail(email));
      return json(res, 200, { ok:true, user, adminToken:user && isStaff(user.role) ? signToken({ email:user.email, role:user.role }) : null });
    }

    if(action === 'profile-photo-upload'){
      const email = String(body.email || '').trim().toLowerCase();
      if(!email) throw new Error('E-posta gerekli.');
      const dataUrl = String(body.dataUrl || '');
      const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
      if(!match) throw new Error('Dosya base64 dataUrl olarak gelmeli.');
      const contentType = String(body.contentType || match[1] || 'image/png');
      const ext = (String(body.fileName || '').split('.').pop() || contentType.split('/').pop() || 'png').replace(/[^a-z0-9]/gi,'').slice(0,8) || 'png';
      const safeEmail = email.replace(/[^a-z0-9_.-]/gi,'_');
      const objectPath = `${safeEmail}/${Date.now()}.${ext}`;
      const publicUrl = await supabaseStorageUpload('profile-photos', objectPath, Buffer.from(match[2], 'base64'), contentType);
      await supabase(`site_users?email=eq.${encodeURIComponent(email)}`, { method:'PATCH', body: JSON.stringify({ avatar_url:publicUrl, updated_at:new Date().toISOString() }) }).catch(()=>{});
      return json(res, 200, { ok:true, publicUrl });
    }

    if(action === 'profile-update'){
      const email = String(body.email || '').trim().toLowerCase();
      if(!email) throw new Error('E-posta gerekli.');
      const fullName = String(body.fullName || '').trim();
      const avatarUrl = String(body.avatarUrl || body.avatar_url || '').trim();
      const rows = await supabase(`site_users?email=eq.${encodeURIComponent(email)}`, { method:'PATCH', body: JSON.stringify({ full_name:fullName, avatar_url:avatarUrl, updated_at:new Date().toISOString() }) });
      return json(res, 200, { ok:true, user:cleanUser(rows?.[0]) });
    }

    if(action === 'users-list'){
      await requireOwner(body.adminToken);
      const rows = await supabase('site_users?select=id,full_name,avatar_url,email,role,is_active,banned_at,ban_reason,created_at,updated_at,last_login_at&order=created_at.desc', { method:'GET' });
      return json(res, 200, { ok:true, users:(rows || []).map(cleanUser) });
    }

    if(action === 'user-role-set'){
      await requireOwner(body.adminToken);
      const role = normalizeRole(body.role);
      if(!['kurucu','yonetici','moderator','editor','user','banned'].includes(role)) throw new Error('Geçersiz rol.');
      const patch = role === 'banned'
        ? { role:'banned', is_active:false, banned_at:new Date().toISOString(), ban_reason:'Yönetim panelinden banlandı', updated_at:new Date().toISOString() }
        : { role, is_active:true, banned_at:null, ban_reason:null, updated_at:new Date().toISOString() };
      const rows = await supabase(`site_users?id=eq.${encodeURIComponent(body.userId)}`, { method:'PATCH', body: JSON.stringify(patch) });
      return json(res, 200, { ok:true, user:cleanUser(rows?.[0]) });
    }

    if(action === 'user-ban-toggle'){
      await requireOwner(body.adminToken);
      const target = await getUserById(body.userId);
      if(!target) throw new Error('Kullanıcı bulunamadı.');
      const ban = target.is_active !== false;
      const patch = ban ? { role:'banned', is_active:false, banned_at:new Date().toISOString(), ban_reason:'Yönetim panelinden banlandı', updated_at:new Date().toISOString() } : { role:'user', is_active:true, banned_at:null, ban_reason:null, updated_at:new Date().toISOString() };
      const rows = await supabase(`site_users?id=eq.${encodeURIComponent(body.userId)}`, { method:'PATCH', body: JSON.stringify(patch) });
      return json(res, 200, { ok:true, user:cleanUser(rows?.[0]) });
    }

    if(action === 'user-delete'){
      await requireOwner(body.adminToken);
      await supabase(`site_users?id=eq.${encodeURIComponent(body.userId)}`, { method:'DELETE', headers:{ Prefer:'return=minimal' } });
      return json(res, 200, { ok:true });
    }

    if(action === 'settings-get'){
      const rows = await supabase('site_runtime_config?key=eq.maintenance_mode&limit=1', { method:'GET' }).catch(()=>[]);
      const value = Array.isArray(rows) && rows[0]?.value ? rows[0].value : { enabled:false, message:'Hayatımız Oyun kısa süreli bakımda.', eta:'' };
      return json(res, 200, { ok:true, maintenance:value });
    }

    if(action === 'settings-set'){
      await requireStaff(body.adminToken);
      const maintenance = body.maintenance || { enabled:false, message:'Hayatımız Oyun kısa süreli bakımda.', eta:'' };
      await supabase('site_runtime_config?on_conflict=key', { method:'POST', headers:{ Prefer:'resolution=merge-duplicates,return=representation' }, body: JSON.stringify([{ key:'maintenance_mode', value:maintenance, updated_at:new Date().toISOString() }]) });
      return json(res, 200, { ok:true, maintenance });
    }

    if(action === 'features-list'){
      const rows = await supabase('site_features?select=key,enabled&order=created_at.asc', { method:'GET' }).catch(()=>[]);
      const features = {};
      FEATURE_CATALOG.forEach(f => { features[f.key] = false; });
      (rows || []).forEach(row => { if(row?.key) features[row.key] = row.enabled === true; });
      return json(res, 200, { ok:true, features });
    }

    if(action === 'feature-plan-add'){
      await requireOwner(body.adminToken);
      const key = String(body.key || '').trim();
      const title = String(body.title || key).trim();
      if(!key || !title) throw new Error('Özellik adı gerekli.');
      const feature = {
        key, title,
        group:String(body.group || 'Adminin Önerileri'),
        target:String(body.target || 'Yönetim Paneli > Özellik Planı'),
        description:String(body.description || 'Manuel özellik isteği'),
        next:String(body.next || '')
      };
      await ensurePlannerFeature(feature).catch(()=>{});
      await supabase(`site_admin_planner?feature_key=eq.${encodeURIComponent(key)}`, {
        method:'PATCH',
        body: JSON.stringify({ group_name:feature.group, title:feature.title, status:'plan', feature_key:feature.key, updated_at:new Date().toISOString() })
      }).catch(()=>{});
      return json(res, 200, { ok:true, feature:{ key:feature.key, title:feature.title, status:'plan' } });
    }

    if(action === 'feature-apply'){
      await requireOwner(body.adminToken);
      const key = String(body.key || '').trim();
      if(!key) throw new Error('Özellik anahtarı gerekli.');
      const preset = FEATURE_CATALOG.find(f => f.key === key);
      const feature = {
        ...(preset || {}),
        key,
        title:String(body.title || preset?.title || key).trim(),
        group:String(body.group || preset?.group || 'Adminin Önerileri'),
        target:String(body.target || preset?.target || 'Özellik Planı'),
        description:String(body.description || preset?.description || 'Özel özellik isteği'),
        next:String(body.next || preset?.next || 'Bu özel istek için hazır modül kodunu ekle')
      };
      await supabase('site_features?on_conflict=key', {
        method:'POST',
        headers:{ Prefer:'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify([{ key:feature.key, title:feature.title, description:feature.description || feature.next, enabled:true, updated_at:new Date().toISOString() }])
      });
      await ensurePlannerFeature(feature).catch(()=>{});
      const planner = await supabase(`site_admin_planner?title=eq.${encodeURIComponent(feature.title)}`, {
        method:'PATCH',
        body: JSON.stringify({ status:'tamam', feature_key:feature.key, updated_at:new Date().toISOString() })
      }).catch(()=>[]);
      if(feature.next){
        const existingNext = await supabase(`site_admin_planner?title=eq.${encodeURIComponent(feature.next)}&limit=1`, { method:'GET' }).catch(()=>[]);
        if(!Array.isArray(existingNext) || !existingNext.length){
          await supabase('site_admin_planner', { method:'POST', body: JSON.stringify([{ group_name:feature.group || 'Adminin Önerileri', title:feature.next, status:'plan' }]) }).catch(()=>{});
        }
      }
      return json(res, 200, { ok:true, feature:{ key:feature.key, enabled:true, preset:Boolean(preset) }, planner });
    }


    if(action === 'feature-disable'){
      await requireOwner(body.adminToken);
      const key = String(body.key || '').trim();
      if(!key) throw new Error('Özellik anahtarı gerekli.');
      await supabase(`site_features?key=eq.${encodeURIComponent(key)}`, { method:'PATCH', body: JSON.stringify({ enabled:false, updated_at:new Date().toISOString() }) }).catch(()=>{});
      await supabase(`site_admin_planner?feature_key=eq.${encodeURIComponent(key)}`, { method:'PATCH', body: JSON.stringify({ status:'plan', updated_at:new Date().toISOString() }) }).catch(()=>{});
      return json(res, 200, { ok:true, key, enabled:false });
    }

    if(action === 'feature-disable-all'){
      await requireOwner(body.adminToken);
      const keys = Array.isArray(body.keys) ? body.keys.map(k=>String(k)) : [];
      const rows = keys.length ? keys.map(key => ({ key })) : await supabase('site_features?select=key', { method:'GET' }).catch(()=>[]);
      for(const row of rows || []){
        if(row?.key){
          await supabase(`site_features?key=eq.${encodeURIComponent(row.key)}`, { method:'PATCH', body: JSON.stringify({ enabled:false, updated_at:new Date().toISOString() }) }).catch(()=>{});
          await supabase(`site_admin_planner?feature_key=eq.${encodeURIComponent(row.key)}`, { method:'PATCH', body: JSON.stringify({ status:'plan', updated_at:new Date().toISOString() }) }).catch(()=>{});
        }
      }
      return json(res, 200, { ok:true, disabled:(rows || []).map(r=>r.key).filter(Boolean) });
    }


    if(action === 'game-story'){
      await requireStaff(body.adminToken);
      const title = String(body.title || '').trim();
      if(!title) throw new Error('Oyun adı gerekli.');
      const meta = await fetchRawgMeta(title).catch(()=>null);
      return json(res, 200, { ok:true, story: localTurkishStory(title, meta?.genre || '') });
    }


    if(action === 'game-release-date'){
      await requireStaff(body.adminToken);
      const title = String(body.title || '').trim();
      if(!title) throw new Error('Oyun adı gerekli.');
      const result = await ho240f42ResolveReleaseDate(title).catch(error => ({ releaseDate:'', source:'Hata', warning:error?.message || String(error) }));
      return json(res, 200, { ok:true, title, ...result });
    }

    if(action === 'game-description'){
      await requireStaff(body.adminToken);
      const title = String(body.title || '').trim();
      if(!title) throw new Error('Oyun adı gerekli.');
      const meta = await ho240f42BuildGameMeta(title).catch(()=>null);
      const genre = meta?.meta?.genre || meta?.genre || localGameMeta(title)?.genre || '';
      return json(res, 200, { ok:true, description: localTurkishStory(title, genre), genre, source: meta?.source || 'Yerel hikaye motoru' });
    }

    if(action === 'game-meta'){
      await requireStaff(body.adminToken);
      const title = String(body.title || '').trim();
      if(!title) throw new Error('Oyun adı gerekli.');
      const fixed = await ho240f42BuildGameMeta(title).catch(()=>null);
      if(fixed?.meta){
        return json(res, 200, { ok:true, meta:fixed.meta, candidates:fixed.candidates || [], source:fixed.source || 'FIX42 profesyonel meta' });
      }
      const fallback = localGameMeta(title);
      const rawg = await fetchRawgMeta(fallback.title || title).catch(()=>null);
      const known = fallback && fallback.exact === true;
      const rawgTitle = String(rawg?.title || '').toLowerCase();
      const fallbackFirst = String(fallback?.title || title).toLowerCase().split(/\s+/)[0] || '';
      const rawgLooksRight = rawg && (!fallbackFirst || rawgTitle.includes(fallbackFirst));
      const meta = known || !rawgLooksRight ? fallback : { ...fallback, ...rawg };
      const releaseDate = normalizeRawgDate(meta.releaseDate || meta.released || fallback.released || rawg?.released || '');
      return json(res, 200, { ok:true, meta:{ ...meta, title, releaseDate, released:releaseDate }, candidates: rawg?.candidates || [{ ...fallback, title:fallback.title || title }] });
    }

    if(action === 'games-list'){
      const result = await ho240f31GamesListResilient();
      return json(res, 200, { ok:true, games:(result.rows || []).map(cleanGame).filter(Boolean), warning:result.warning || '', recovered:result.recovered === true });
    }

    if(action === 'games-add'){
      await requireStaff(body.adminToken);
      const game = body.game || {};
      const title = String(game.title || '').trim();
      if(!title) throw new Error('Oyun adı gerekli.');
      const rows = await supabase('games', { method:'POST', body: JSON.stringify([{ title, genre:String(game.genre || 'Genel'), status:String(game.status || 'Devam Ediyor'), episode_count:Number(game.eps || game.episode_count || 0), score:Number(game.score || 0), cover_url:String(game.cover || game.cover_url || ''), tags:String(game.tags || ''), release_date:String(game.releaseDate || game.release_date || ''), rawg_slug:String(game.rawg_slug || game.rawgSlug || ''), series_name:String(game.seriesName || game.series_name || ''), playlist_url:String(game.playlistUrl || game.playlist_url || ''), video_url:String(game.videoUrl || game.video_url || ''), watched_episode_count:Number(game.watchedEps || game.watched_episode_count || 0), series_order:Number(game.seriesOrder || game.series_order || 0), episodes:Array.isArray(game.episodes) ? game.episodes : [], description:String(game.description || '') }]) });
      return json(res, 200, { ok:true, game:cleanGame(rows?.[0]) });
    }

    if(action === 'games-update'){
      await requireStaff(body.adminToken);
      const gameId = String(body.gameId || '').trim();
      if(!gameId) throw new Error('Oyun ID gerekli.');
      const game = body.game || {};
      const patch = {
        title:String(game.title || '').trim() || undefined,
        genre:String(game.genre || 'Genel'),
        status:String(game.status || 'Devam Ediyor'),
        episode_count:Number(game.eps ?? game.episode_count ?? 0),
        score:Number(game.score ?? 0),
        cover_url:String(game.cover || game.cover_url || ''),
        tags:String(game.tags || ''),
        release_date:String(game.releaseDate || game.release_date || ''),
        rawg_slug:String(game.rawg_slug || game.rawgSlug || ''),
        series_name:String(game.seriesName || game.series_name || ''),
        playlist_url:String(game.playlistUrl || game.playlist_url || ''),
        video_url:String(game.videoUrl || game.video_url || ''),
        watched_episode_count:Number(game.watchedEps ?? game.watched_episode_count ?? 0),
        series_order:Number(game.seriesOrder ?? game.series_order ?? 0),
        episodes:Array.isArray(game.episodes) ? game.episodes : [],
        description:String(game.description || ''),
        updated_at:new Date().toISOString()
      };
      Object.keys(patch).forEach(k => patch[k] === undefined && delete patch[k]);
      const rows = await supabase(`games?id=eq.${encodeURIComponent(gameId)}`, { method:'PATCH', body: JSON.stringify(patch) });
      return json(res, 200, { ok:true, game:cleanGame(rows?.[0]) });
    }


    if(action === 'episode-progress-save'){
      const gameId = String(body.gameId || '').trim();
      if(!gameId) throw new Error('Oyun ID gerekli.');
      const episodes = Array.isArray(body.episodes) ? body.episodes : [];
      const watched = Number(body.watchedEps ?? episodes.filter(ep=>ep && ep.watched).length ?? 0);
      const rows = await supabase(`games?id=eq.${encodeURIComponent(gameId)}`, { method:'PATCH', body: JSON.stringify({ episodes, watched_episode_count:watched, updated_at:new Date().toISOString() }) });
      return json(res, 200, { ok:true, game:cleanGame(rows?.[0]) });
    }

    if(action === 'games-delete'){
      await requireStaff(body.adminToken);
      const gameId = String(body.gameId || '').trim();
      if(!gameId) throw new Error('Oyun ID gerekli.');
      await supabase(`games?id=eq.${encodeURIComponent(gameId)}`, { method:'DELETE', headers:{ Prefer:'return=minimal' } });
      return json(res, 200, { ok:true });
    }


    if(action === 'games-delete-all'){
      await requireStaff(body.adminToken);
      await supabase('games?id=not.is.null', { method:'DELETE', headers:{ Prefer:'return=minimal' } }).catch(async ()=>{
        await supabase('games?title=not.is.null', { method:'DELETE', headers:{ Prefer:'return=minimal' } });
      });
      return json(res, 200, { ok:true, deleted:'all' });
    }


    if(action === 'playlist-count'){
      await requireStaff(body.adminToken);
      const count = await fetchYoutubePlaylistCount(String(body.playlistUrl || '')).catch(()=>0);
      return json(res, 200, { ok:true, count });
    }

    if(action === 'playlist-items'){
      await requireStaff(body.adminToken);
      const items = await fetchYoutubePlaylistItems(String(body.playlistUrl || '')).catch(()=>({ count:0, episodes:[] }));
      const count = items.count || await fetchYoutubePlaylistCount(String(body.playlistUrl || '')).catch(()=>0);
      return json(res, 200, { ok:true, count, episodes:items.episodes || [] });
    }



    if(action === 'game-request-add'){
      const req = body.request || {};
      const payload = {
        game_title:String(req.gameTitle || req.game_title || '').trim(),
        series_name:String(req.seriesName || req.series_name || ''),
        requester_email:String(req.email || body.email || ''),
        note:String(req.note || ''),
        status:String(req.status || 'Yeni'),
        created_at:new Date().toISOString(),
        updated_at:new Date().toISOString()
      };
      if(!payload.game_title) throw new Error('Oyun isteği için oyun adı gerekli.');
      const rows = await supabase('site_game_requests', { method:'POST', body: JSON.stringify([payload]) }).catch(()=>[]);
      return json(res, 200, { ok:true, request:rows?.[0] || payload });
    }

    if(action === 'game-requests-list'){
      await requireStaff(body.adminToken);
      const rows = await supabase('site_game_requests?select=id,game_title,series_name,requester_email,note,status,admin_note,created_at,updated_at&order=created_at.desc', { method:'GET' }).catch(()=>[]);
      return json(res, 200, { ok:true, requests:rows || [] });
    }

    if(action === 'bug-report-add'){
      const report = body.report || {};
      const payload = {
        title:String(report.title || '').trim(),
        page_name:String(report.page || report.page_name || ''),
        reporter_email:String(report.email || body.email || ''),
        description:String(report.description || ''),
        screenshot_url:String(report.screenshotUrl || report.screenshot_url || report.screenshot || ''),
        status:String(report.status || 'Yeni'),
        created_at:new Date().toISOString(),
        updated_at:new Date().toISOString()
      };
      if(!payload.title || !payload.description) throw new Error('Hata bildirimi için başlık ve detay gerekli.');
      const rows = await supabase('site_bug_reports', { method:'POST', body: JSON.stringify([payload]) }).catch(()=>[]);
      return json(res, 200, { ok:true, report:rows?.[0] || payload });
    }

    if(action === 'bug-reports-list'){
      await requireStaff(body.adminToken);
      const rows = await supabase('site_bug_reports?select=id,title,page_name,reporter_email,description,screenshot_url,status,admin_note,solution_note,created_at,updated_at&order=created_at.desc', { method:'GET' }).catch(()=>[]);
      return json(res, 200, { ok:true, reports:rows || [] });
    }


    if(action === 'game-request-update'){
      await requireStaff(body.adminToken);
      const id = String(body.id || '').trim();
      if(!id) throw new Error('Oyun isteği ID gerekli.');
      const patch = { updated_at:new Date().toISOString() };
      if(body.status !== undefined) patch.status = String(body.status || 'Yeni');
      if(body.adminNote !== undefined) patch.admin_note = String(body.adminNote || '');
      const rows = await supabase(`site_game_requests?id=eq.${encodeURIComponent(id)}`, { method:'PATCH', body: JSON.stringify(patch) }).catch(()=>[]);
      return json(res, 200, { ok:true, request:Array.isArray(rows)?rows[0]:patch });
    }

    if(action === 'bug-report-update'){
      await requireStaff(body.adminToken);
      const id = String(body.id || '').trim();
      if(!id) throw new Error('Hata bildirimi ID gerekli.');
      const patch = { updated_at:new Date().toISOString() };
      if(body.status !== undefined) patch.status = String(body.status || 'Yeni');
      if(body.adminNote !== undefined) patch.admin_note = String(body.adminNote || '');
      if(body.solutionNote !== undefined) patch.solution_note = String(body.solutionNote || '');
      const rows = await supabase(`site_bug_reports?id=eq.${encodeURIComponent(id)}`, { method:'PATCH', body: JSON.stringify(patch) }).catch(()=>[]);
      return json(res, 200, { ok:true, report:Array.isArray(rows)?rows[0]:patch });
    }

    if(action === 'calendar-events-list'){
      const rows = await supabase('site_calendar_events?select=id,title,event_date,event_time,event_type,game_id,game_title,episode_number,episode_title,cover_url,note,is_active,created_at,updated_at&is_active=eq.true&order=event_date.asc', { method:'GET' }).catch(()=>[]);
      const events = (rows || []).map(row => ({ id:row.id, title:row.title, date:row.event_date, time:row.event_time, type:row.event_type, gameId:row.game_id, gameTitle:row.game_title, episodeNumber:row.episode_number, episodeTitle:row.episode_title, cover:row.cover_url, note:row.note, isActive:row.is_active }));
      return json(res, 200, { ok:true, events });
    }

    if(action === 'calendar-events-upsert'){
      await requireStaff(body.adminToken);
      const event = body.event || {};
      const title = String(event.title || '').trim();
      const date = String(event.date || event.event_date || '').trim();
      if(!title || !date) throw new Error('Takvim kaydı için başlık ve tarih gerekli.');
      const payload = {
        title,
        event_date:date,
        event_time:String(event.time || event.event_time || '20:00'),
        event_type:String(event.type || event.event_type || 'Ana Yayın'),
        game_id:String(event.gameId || event.game_id || ''),
        game_title:String(event.gameTitle || event.game_title || ''),
        episode_number:String(event.episodeNumber || event.episode_number || ''),
        episode_title:String(event.episodeTitle || event.episode_title || ''),
        cover_url:String(event.cover || event.cover_url || ''),
        note:String(event.note || ''),
        is_active:true,
        updated_at:new Date().toISOString()
      };
      const rawId = String(event.id || '').trim();
      const uuidLike = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawId);
      let rows;
      if(uuidLike){
        rows = await supabase(`site_calendar_events?id=eq.${encodeURIComponent(rawId)}`, { method:'PATCH', body: JSON.stringify(payload) });
      }else{
        rows = await supabase('site_calendar_events', { method:'POST', body: JSON.stringify([payload]) });
      }
      const row = Array.isArray(rows) ? (rows[0] || payload) : payload;
      return json(res, 200, { ok:true, event:{ id:row.id || rawId, title:row.title || payload.title, date:row.event_date || payload.event_date, time:row.event_time || payload.event_time, type:row.event_type || payload.event_type, gameId:row.game_id || payload.game_id, gameTitle:row.game_title || payload.game_title, episodeNumber:row.episode_number || payload.episode_number, episodeTitle:row.episode_title || payload.episode_title, cover:row.cover_url || payload.cover_url, note:row.note || payload.note } });
    }

    if(action === 'calendar-events-delete'){
      await requireStaff(body.adminToken);
      const id = String(body.id || '').trim();
      if(!id) throw new Error('Takvim kayıt ID gerekli.');
      await supabase(`site_calendar_events?id=eq.${encodeURIComponent(id)}`, { method:'PATCH', body: JSON.stringify({ is_active:false, updated_at:new Date().toISOString() }) });
      return json(res, 200, { ok:true });
    }


    if(action === 'game-genres'){
      await requireStaff(body.adminToken);
      const title = String(body.title || '').trim();
      if(!title) throw new Error('Oyun adı gerekli.');
      const meta = await fetchRawgMeta(title).catch(()=>null);
      const fallback = localGameMeta(title);
      const genre = meta?.genre || fallback.genre || 'Aksiyon-macera, hikaye odaklı';
      return json(res, 200, { ok:true, genre, source:meta?.genre ? 'RAWG + yerel Türkçe eşleştirme' : 'Yerel Türkçe doğrulama' });
    }

    if(action === 'archive-view-preference-save'){
      const email = String(body.email || '').trim().toLowerCase();
      const viewMode = String(body.viewMode || 'compact');
      if(!email) return json(res, 200, { ok:true, localOnly:true, viewMode });
      await supabase('site_user_preferences?on_conflict=email', { method:'POST', headers:{ Prefer:'resolution=merge-duplicates,return=representation' }, body: JSON.stringify([{ email, archive_view_mode:viewMode, updated_at:new Date().toISOString() }]) }).catch(()=>{});
      return json(res, 200, { ok:true, viewMode });
    }

    if(action === 'calendar-reminder-add'){
      const email = String(body.email || '').trim().toLowerCase();
      const event = body.event || {};
      const payload = { email, event_id:String(event.id || ''), title:String(event.title || ''), remind_at:`${String(event.date || '')} ${String(event.time || '20:00')}`, is_sent:false, created_at:new Date().toISOString() };
      await supabase('site_calendar_reminders', { method:'POST', body: JSON.stringify([payload]) }).catch(()=>{});
      return json(res, 200, { ok:true, reminder:payload });
    }

    if(action === 'series-order-history-add'){
      await requireStaff(body.adminToken);
      const payload = { series_name:String(body.series || ''), game_ids:Array.isArray(body.gameIds)?body.gameIds:[], user_email:String(body.email || ''), created_at:new Date().toISOString() };
      await supabase('site_series_order_history', { method:'POST', body: JSON.stringify([payload]) }).catch(()=>{});
      return json(res, 200, { ok:true, history:payload });
    }

    if(action === 'planner-list'){
      await requireStaff(body.adminToken);
      const planner = await supabase('site_admin_planner?select=id,group_name,title,status,feature_key,created_at&order=created_at.asc', { method:'GET' }).catch(()=>[]);
      const notes = await supabase('site_admin_notes?select=id,note,created_at&order=created_at.desc&limit=20', { method:'GET' }).catch(()=>[]);
      return json(res, 200, { ok:true, planner:(planner || []).map(p=>({ id:p.id, group:p.group_name, text:p.title, status:p.status, feature_key:p.feature_key })), notes:notes || [] });
    }

    if(action === 'planner-complete-add'){
      await requireStaff(body.adminToken);
      if(body.completedId && !String(body.completedId).startsWith('local-')){
        await supabase(`site_admin_planner?id=eq.${encodeURIComponent(body.completedId)}`, { method:'PATCH', body: JSON.stringify({ status:'tamam', updated_at:new Date().toISOString() }) }).catch(()=>{});
      }
      const group = String(body.group || 'Adminin Önerileri');
      const nextText = String(body.nextText || 'Yeni kontrol maddesi');
      await supabase('site_admin_planner', { method:'POST', body: JSON.stringify([{ group_name:group, title:nextText, status:'plan' }]) }).catch(()=>{});
      return json(res, 200, { ok:true });
    }

    if(action === 'admin-note-add'){
      await requireStaff(body.adminToken);
      const note = String(body.note || '').trim();
      if(!note) throw new Error('Not boş olamaz.');
      const actor = verifyToken(body.adminToken)?.email || null;
      const rows = await supabase('site_admin_notes', { method:'POST', body: JSON.stringify([{ note, actor_email:actor }]) });
      return json(res, 200, { ok:true, note:rows?.[0] });
    }


    if(action === 'update-note-add'){
      await requireStaff(body.adminToken);
      const version = String(body.version || '').trim();
      const title = String(body.title || '').trim();
      if(!version || !title) throw new Error('Sürüm ve başlık gerekli.');
      const note = String(body.written || body.summary || '').trim();
      const summary = String(body.summary || '').trim();
      const image_url = String(body.image || '').trim();
      const rows = await supabase('site_update_notes', {
        method:'POST',
        body: JSON.stringify([{ version, title, note, summary, image_url, status:'published', created_at:new Date().toISOString() }])
      });
      return json(res, 200, { ok:true, note:rows?.[0] });
    }


    if(action === 'episode-comment-add'){
      const gameId = String(body.gameId || '').trim();
      const episodeIndex = Number(body.episodeIndex || 0);
      const comment = String(body.comment || '').trim();
      if(!gameId || !comment) throw new Error('Oyun ve yorum gerekli.');
      const actor = verifyToken(body.adminToken || body.token || '')?.email || null;
      const rows = await supabase('site_episode_comments', { method:'POST', body: JSON.stringify([{ game_id:gameId, episode_index:episodeIndex, comment, actor_email:actor }]) }).catch(()=>[]);
      return json(res, 200, { ok:true, comment:rows?.[0] || { game_id:gameId, episode_index:episodeIndex, comment, actor_email:actor } });
    }

    if(action === 'notifications-list'){
      const rows = await supabase('site_notifications?select=id,title,message,type,is_read,created_at&order=created_at.desc&limit=50', { method:'GET' }).catch(()=>[]);
      return json(res, 200, { ok:true, notifications:rows || [] });
    }

    if(action === 'bulk-operation-log'){
      await requireStaff(body.adminToken);
      const title = String(body.title || 'Toplu işlem').trim();
      const details = body.details || {};
      const rows = await supabase('site_bulk_operations', { method:'POST', body: JSON.stringify([{ title, details, actor_email:verifyToken(body.adminToken)?.email || null }]) }).catch(()=>[]);
      return json(res, 200, { ok:true, operation:rows?.[0] || { title, details } });
    }



    if(action === 'game-request-convert-to-game'){
      await requireStaff(body.adminToken);
      const game = body.game || {};
      const payload = {
        title:String(game.title || '').trim(),
        genre:String(game.genre || 'Genel'),
        status:String(game.status || 'Devam Ediyor'),
        episode_count:Number(game.eps || game.episode_count || 0),
        score:Number(game.score || 8.5),
        cover_url:String(game.cover || game.cover_url || ''),
        tags:String(game.tags || ''),
        release_date:String(game.releaseDate || game.release_date || ''),
        series_name:String(game.seriesName || game.series_name || ''),
        playlist_url:String(game.playlistUrl || game.playlist_url || ''),
        video_url:String(game.videoUrl || game.video_url || ''),
        description:String(game.description || ''),
        watched_episode_count:Number(game.watchedEps || game.watched_episode_count || 0),
        series_order:Number(game.seriesOrder || game.series_order || 0),
        created_at:new Date().toISOString(),
        updated_at:new Date().toISOString()
      };
      if(!payload.title) throw new Error('Oyun adı gerekli.');
      const rows = await supabase('games', { method:'POST', body: JSON.stringify([payload]) });
      const row = Array.isArray(rows) ? rows[0] : payload;
      if(body.requestId){
        await supabase(`site_game_requests?id=eq.${encodeURIComponent(String(body.requestId))}`, { method:'PATCH', body: JSON.stringify({ status:'Eklendi', converted_game_id:String(row?.id || ''), updated_at:new Date().toISOString() }) }).catch(()=>{});
      }
      return json(res, 200, { ok:true, game:cleanGame(row) });
    }

    if(action === 'series-order-restore'){
      await requireStaff(body.adminToken);
      const gameIds = Array.isArray(body.gameIds) ? body.gameIds : [];
      for(const [index,id] of gameIds.entries()){
        await supabase(`games?id=eq.${encodeURIComponent(String(id))}`, { method:'PATCH', body: JSON.stringify({ series_order:index+1, updated_at:new Date().toISOString() }) }).catch(()=>{});
      }
      if(body.historyId){
        await supabase(`site_series_order_history?id=eq.${encodeURIComponent(String(body.historyId))}`, { method:'PATCH', body: JSON.stringify({ restored_at:new Date().toISOString() }) }).catch(()=>{});
      }
      return json(res, 200, { ok:true, restored:gameIds.length });
    }





    if(action === 'notification-queue-add'){
      const item = body.item || {};
      const payload = { email:String(item.email || ''), title:String(item.title || 'Hatırlatıcı'), message:String(item.message || ''), channel:String(item.channel || 'browser'), status:'pending', created_at:new Date().toISOString() };
      await supabase('site_notification_queue', { method:'POST', body: JSON.stringify([payload]) }).catch(()=>{});
      return json(res, 200, { ok:true, queued:payload });
    }



    if(action === 'game-request-delete'){
      await requireStaff(body.adminToken);
      const id = String(body.id || '').trim();
      if(!id) throw new Error('Oyun isteği ID gerekli.');
      await supabase(`site_game_requests?id=eq.${encodeURIComponent(id)}`, { method:'DELETE', headers:{ Prefer:'return=minimal' } }).catch(()=>{});
      return json(res, 200, { ok:true, deleted:id });
    }

    if(action === 'bug-report-delete'){
      await requireStaff(body.adminToken);
      const id = String(body.id || '').trim();
      if(!id) throw new Error('Hata raporu ID gerekli.');
      await supabase(`site_bug_reports?id=eq.${encodeURIComponent(id)}`, { method:'DELETE', headers:{ Prefer:'return=minimal' } }).catch(()=>{});
      return json(res, 200, { ok:true, deleted:id });
    }








    if(action === 'save-user-preferences'){
      const email = String(body.email || body.user_email || '').trim().toLowerCase();
      const prefs = body.preferences || body.prefs || body || {};
      if(email){
        await supabase('site_user_preferences?on_conflict=email', { method:'POST', headers:{ Prefer:'resolution=merge-duplicates,return=representation' }, body: JSON.stringify([{ email, preferences:prefs, updated_at:new Date().toISOString() }]) }).catch(()=>{});
      }
      return json(res, 200, { ok:true, preferences:prefs });
    }

    if(action === 'update-note-delete'){
      const id = String(body.id || body.noteId || '').trim();
      if(id){ await supabase(`site_update_notes?id=eq.${encodeURIComponent(id)}`, { method:'PATCH', body: JSON.stringify({ status:'deleted', updated_at:new Date().toISOString() }) }).catch(()=>{}); }
      return json(res, 200, { ok:true, id });
    }

    if(action === 'auto-fix-request-add'){
      const payload = { version:String(body.version || 'v2.4.0 FIX 11'), source:String(body.source || 'admin_panel'), error_text:String(body.errorText || body.error_text || ''), diagnosis:body.diagnosis || [], status:String(body.status || 'new'), fixed_files:String(body.fixedFiles || body.fixed_files || ''), created_at:new Date().toISOString(), updated_at:new Date().toISOString() };
      await supabase('site_auto_fix_requests', { method:'POST', body: JSON.stringify([payload]) }).catch(()=>{});
      return json(res, 200, { ok:true, request:payload });
    }


    if(action === 'steam-check'){
      await requireStaff(body.adminToken);
      const title = String(body.title || '').trim();
      if(!title) throw new Error('Steam kontrolü için oyun adı gerekli.');
      const steam = await ho240f58SteamBest(title).catch(()=>null);
      if(!steam) return json(res, 200, { ok:false, steam:null, message:'Steam sonucu bulunamadı.' });
      const currentDate = ho240f58ApiDate(body.releaseDate || '');
      const steamDate = ho240f58ApiDate(steam.releaseDate || steam.released || '');
      return json(res, 200, { ok:true, steam:{ ...steam, releaseDate:steamDate, released:steamDate }, checks:{ titleScore:Number(steam.matchScore || 0), dateOk: currentDate && steamDate ? currentDate === steamDate : null, coverOk: body.cover && steam.cover ? String(body.cover).replace(/\?.*$/,'') === String(steam.cover).replace(/\?.*$/,'') : null }, version:HO240F58_API_VERSION });
    }


    if(action === 'multi-store-check'){
      await requireStaff(body.adminToken);
      const title = String(body.title || '').trim();
      const source = String(body.source || 'epic').trim().toLowerCase();
      if(!title) throw new Error('Kaynak kontrolü için oyun adı gerekli.');
      const result = ho244ApiStoreSearch(title, source);
      return json(res, 200, { ok:true, title, result:{ ...result, title, matchScore:82, message:`${result.source} için resmi arama bağlantısı hazırlandı. Sonuçtan kapak ve çıkış tarihini manuel doğrulayabilirsin.` }, version:'v2.4.4' });
    }

    return json(res, 404, { ok:false, error:'Bilinmeyen API action.' });
  }catch(error){
    return json(res, 400, { ok:false, error:error.message || String(error) });
  }
}

/* v2.2.0 FIX 14 - API tarafında çıkış tarihini gün.ay.yıl üret */
const FIX14_RELEASE_DATE_MAP_API = [
  [/a\s*plague\s*tale.*innocence|innocence/i, '14.05.2019'],
  [/a\s*plague\s*tale.*requiem|requiem/i, '18.10.2022'],
  [/a\s*way\s*out/i, '23.03.2018'],
  [/assassin.*creed.*origins|origins/i, '27.10.2017'],
  [/red\s*dead\s*redemption\s*2|rdr2/i, '26.10.2018'],
  [/gta\s*v|grand\s*theft\s*auto\s*v/i, '17.09.2013'],
  [/cyberpunk\s*2077/i, '10.12.2020'],
  [/resident\s*evil\s*4/i, '24.03.2023'],
  [/resident\s*evil\s*2/i, '25.01.2019'],
  [/resident\s*evil\s*3/i, '03.04.2020'],
  [/the\s*witcher\s*3|witcher\s*3/i, '19.05.2015'],
  [/god\s*of\s*war\s*ragnar/i, '09.11.2022'],
  [/god\s*of\s*war/i, '20.04.2018'],
  [/elden\s*ring/i, '25.02.2022'],
  [/sekiro/i, '22.03.2019'],
  [/baldur.*gate\s*3/i, '03.08.2023'],
  [/mass\s*effect\s*andromeda/i, '21.03.2017'],
  [/mass\s*effect\s*3/i, '06.03.2012'],
  [/mass\s*effect\s*2/i, '26.01.2010'],
  [/mass\s*effect/i, '20.11.2007']
];
function fix14ApiReleaseDateForTitle(title){
  const row = FIX14_RELEASE_DATE_MAP_API.find(([rx]) => rx.test(String(title || '')));
  return row ? row[1] : '';
}
function fix14ApiNormalizeDate(value){
  if(!value) return '';
  const raw = String(value).trim();
  const iso = raw.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if(iso) return `${iso[3].padStart(2,'0')}.${iso[2].padStart(2,'0')}.${iso[1]}`;
  const tr = raw.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
  if(tr) return `${tr[1].padStart(2,'0')}.${tr[2].padStart(2,'0')}.${tr[3]}`;
  return raw;
}
try{ normalizeRawgDate = fix14ApiNormalizeDate; }catch{}
const fix14ApiPreviousLocalGameMeta = localGameMeta;
localGameMeta = function(title){
  const base = fix14ApiPreviousLocalGameMeta(title) || {};
  const date = fix14ApiNormalizeDate(base.releaseDate || base.released || fix14ApiReleaseDateForTitle(title));
  return { ...base, released: date, releaseDate: date };
};


/* v2.4.0 FIX 7 - API doğru oyun tanıma, gün.ay.yıl tarih ve doğru kapak önceliği */
const HO240_FIX7_API_META = [
  {rx:/a\s*way\s*out|way\s*out|away\s*out/i,title:'A Way Out',seriesName:'A Way Out',genre:'Aksiyon-macera, co-op, hikaye odaklı, sinematik, kaçış',released:'23.03.2018',releaseDate:'23.03.2018',score:8.2,cover:'https://media.rawg.io/media/games/fc2/fc2277ac5e7f7e31a8d5f9a12efc44f1.jpg',slug:'a-way-out',exact:true},
  {rx:/alan\s*wake.*remaster|alan\s*wake/i,title:'Alan Wake Remastered',seriesName:'Alan Wake',genre:'Aksiyon-macera, psikolojik korku, hikaye odaklı, tek oyunculu',released:'05.10.2021',releaseDate:'05.10.2021',score:8.0,cover:'https://media.rawg.io/media/games/053/0531fbe64d90d7a97acb88ba8f340cb9.jpg',slug:'alan-wake-remastered',exact:true},
  {rx:/plague.*innocence|innocence/i,title:'A Plague Tale: Innocence',seriesName:'A Plague Tale',genre:'Macera, aksiyon, gizlilik, hikaye odaklı, tek oyunculu',released:'14.05.2019',releaseDate:'14.05.2019',score:8.3,cover:'https://media.rawg.io/media/games/94a/94a59c5136a9b90eef5ce679964d7759.jpg',slug:'a-plague-tale-innocence',exact:true},
  {rx:/plague.*requiem|requiem/i,title:'A Plague Tale: Requiem',seriesName:'A Plague Tale',genre:'Macera, aksiyon, gizlilik, hikaye odaklı, tek oyunculu',released:'18.10.2022',releaseDate:'18.10.2022',score:8.6,cover:'https://media.rawg.io/media/games/99f/99f9f7d5fb6f5f4b49028cfddf6cdb6d.jpg',slug:'a-plague-tale-requiem',exact:true},
  {rx:/assassin.*origins|origins/i,title:"Assassin's Creed Origins",seriesName:"Assassin's Creed",genre:'Aksiyon, RPG, açık dünya, tarihi macera, gizlilik',released:'27.10.2017',releaseDate:'27.10.2017',score:8.5,cover:'https://media.rawg.io/media/games/336/336c6bd63d83cf8e59937ab8895d1240.jpg',slug:'assassins-creed-origins',exact:true},
  {rx:/cyberpunk\s*2077/i,title:'Cyberpunk 2077',seriesName:'Cyberpunk',genre:'Aksiyon RPG, açık dünya, bilim kurgu, hikaye odaklı',released:'10.12.2020',releaseDate:'10.12.2020',score:9.1,cover:'https://media.rawg.io/media/games/490/49016e06ae2103881ff6373248843069.jpg',slug:'cyberpunk-2077',exact:true},
  {rx:/witcher\s*3|wild\s*hunt/i,title:'The Witcher 3: Wild Hunt',seriesName:'The Witcher',genre:'RPG, açık dünya, fantastik, hikaye odaklı',released:'19.05.2015',releaseDate:'19.05.2015',score:9.6,cover:'https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg',slug:'the-witcher-3-wild-hunt',exact:true}
];
const ho240Fix7OldLocalGameMetaApi = localGameMeta;
localGameMeta = function(title){
  const known = HO240_FIX7_API_META.find(x=>x.rx.test(String(title||'')));
  if(known) return { ...known };
  return ho240Fix7OldLocalGameMetaApi(title);
};
const ho240Fix7OldStoryApi = localTurkishStory;
localTurkishStory = function(title, genre=''){
  const known = HO240_FIX7_API_META.find(x=>x.rx.test(String(title||'')));
  if(known?.title === 'A Way Out') return "A Way Out, birbirinden farklı geçmişlere ve motivasyonlara sahip iki mahkum olan Leo ve Vincent'ın hapishaneden kaçışını ve ardından ortak düşmanlarından intikam alma süreçlerini anlatan tamamen eşli oynanışa dayalı sinematik bir aksiyon-macera oyunudur. Oyun, iki karakterin güven, fedakarlık ve hayatta kalma üzerine kurulu ortak yolculuğunu bölüm bölüm takip eder.";
  if(known?.title) return `${known.title}, ${known.genre} türlerini bir araya getiren, karakter motivasyonu, ana çatışma ve atmosferiyle öne çıkan hikaye odaklı bir oyun deneyimi sunar. Oyuncu, oyun dünyasını keşfederken ilerleyişi bölüm bölüm takip eder.`;
  return ho240Fix7OldStoryApi(title, genre);
};

/* v2.4.0 FIX 14 - API kapak/meta kesin eşleşme genişletmesi */
const HO240F14_API_VERSION = 'v2.4.0 FIX 14';
const HO240F14_API_CATALOG = [
  {rx:/alan\s*wake\s*'?s?\s*american\s*nightmare|american\s*nightmare/i,title:"Alan Wake's American Nightmare",seriesName:'Alan Wake',genre:'Aksiyon, Psikolojik Korku, Gerilim, Hikaye Odaklı',released:'22.02.2012',releaseDate:'22.02.2012',score:7.8,cover:'https://cdn.akamai.steamstatic.com/steam/apps/202750/header.jpg',slug:'alan-wakes-american-nightmare',covers:['https://cdn.akamai.steamstatic.com/steam/apps/202750/header.jpg','https://cdn.akamai.steamstatic.com/steam/apps/202750/capsule_616x353.jpg','https://cdn.cloudflare.steamstatic.com/steam/apps/202750/header.jpg','https://cdn.cloudflare.steamstatic.com/steam/apps/202750/capsule_616x353.jpg'],exact:true},
  {rx:/alan\s*wake\s*2/i,title:'Alan Wake 2',seriesName:'Alan Wake',genre:'Hayatta Kalma Korku, Psikolojik Gerilim, Hikaye Odaklı',released:'27.10.2023',releaseDate:'27.10.2023',score:9.1,cover:'https://media.rawg.io/media/games/599/5999f254b9a7facb3147a28d956a163e.jpg',slug:'alan-wake-2',covers:['https://media.rawg.io/media/games/599/5999f254b9a7facb3147a28d956a163e.jpg'],exact:true},
  {rx:/alan\s*wake\s*remaster|alan\s*wake\s*remastered/i,title:'Alan Wake Remastered',seriesName:'Alan Wake',genre:'Aksiyon-macera, Psikolojik Korku, Hikaye Odaklı',released:'05.10.2021',releaseDate:'05.10.2021',score:8.0,cover:'https://media.rawg.io/media/games/053/0531fbe64d90d7a97acb88ba8f340cb9.jpg',slug:'alan-wake-remastered',covers:['https://media.rawg.io/media/games/053/0531fbe64d90d7a97acb88ba8f340cb9.jpg','https://cdn.akamai.steamstatic.com/steam/apps/108710/header.jpg'],exact:true},
  {rx:/\balan\s*wake\b/i,title:'Alan Wake',seriesName:'Alan Wake',genre:'Aksiyon-macera, Psikolojik Korku, Hikaye Odaklı',released:'14.05.2010',releaseDate:'14.05.2010',score:8.2,cover:'https://cdn.akamai.steamstatic.com/steam/apps/108710/header.jpg',slug:'alan-wake',covers:['https://cdn.akamai.steamstatic.com/steam/apps/108710/header.jpg','https://cdn.akamai.steamstatic.com/steam/apps/108710/capsule_616x353.jpg'],exact:true},
  {rx:/max\s*payne\s*3/i,title:'Max Payne 3',seriesName:'Max Payne',genre:'Üçüncü Şahıs Nişancı, Neo-noir, Aksiyon',released:'15.05.2012',releaseDate:'15.05.2012',score:8.7,cover:'https://cdn.akamai.steamstatic.com/steam/apps/204100/header.jpg',slug:'max-payne-3',covers:['https://cdn.akamai.steamstatic.com/steam/apps/204100/header.jpg','https://cdn.akamai.steamstatic.com/steam/apps/204100/capsule_616x353.jpg'],exact:true},
  {rx:/max\s*payne\s*2/i,title:'Max Payne 2: The Fall of Max Payne',seriesName:'Max Payne',genre:'Üçüncü Şahıs Nişancı, Neo-noir, Aksiyon',released:'14.10.2003',releaseDate:'14.10.2003',score:8.8,cover:'https://cdn.akamai.steamstatic.com/steam/apps/12150/header.jpg',slug:'max-payne-2',covers:['https://cdn.akamai.steamstatic.com/steam/apps/12150/header.jpg','https://cdn.akamai.steamstatic.com/steam/apps/12150/capsule_616x353.jpg'],exact:true},
  {rx:/max\s*payne(?!\s*[23])/i,title:'Max Payne',seriesName:'Max Payne',genre:'Üçüncü Şahıs Nişancı, Neo-noir, Aksiyon',released:'23.07.2001',releaseDate:'23.07.2001',score:8.9,cover:'https://cdn.akamai.steamstatic.com/steam/apps/12140/header.jpg',slug:'max-payne',covers:['https://cdn.akamai.steamstatic.com/steam/apps/12140/header.jpg','https://cdn.akamai.steamstatic.com/steam/apps/12140/capsule_616x353.jpg'],exact:true},
  {rx:/serious\s*sam\s*2/i,title:'Serious Sam 2',seriesName:'Serious Sam',genre:'FPS, Aksiyon, Co-op, Arcade',released:'11.10.2005',releaseDate:'11.10.2005',score:7.7,cover:'https://cdn.akamai.steamstatic.com/steam/apps/204340/header.jpg',slug:'serious-sam-2',covers:['https://cdn.akamai.steamstatic.com/steam/apps/204340/header.jpg','https://cdn.akamai.steamstatic.com/steam/apps/204340/capsule_616x353.jpg'],exact:true},
  {rx:/crysis\s*3/i,title:'Crysis 3',seriesName:'Crysis',genre:'FPS, Bilim Kurgu, Aksiyon, Nanosuit',released:'19.02.2013',releaseDate:'19.02.2013',score:8.1,cover:'https://media.rawg.io/media/games/580/580c6c99d24e07e6b827ec2d2ee8e8c8.jpg',slug:'crysis-3',covers:['https://media.rawg.io/media/games/580/580c6c99d24e07e6b827ec2d2ee8e8c8.jpg'],exact:true},
  {rx:/\bcrysis\b/i,title:'Crysis',seriesName:'Crysis',genre:'FPS, Bilim Kurgu, Aksiyon, Nanosuit',released:'13.11.2007',releaseDate:'13.11.2007',score:8.4,cover:'https://cdn.akamai.steamstatic.com/steam/apps/17300/header.jpg',slug:'crysis',covers:['https://cdn.akamai.steamstatic.com/steam/apps/17300/header.jpg','https://cdn.akamai.steamstatic.com/steam/apps/17300/capsule_616x353.jpg'],exact:true},
  {rx:/resident\s*evil\s*4/i,title:'Resident Evil 4',seriesName:'Resident Evil',genre:'Hayatta Kalma Korku, Aksiyon, Gerilim',released:'24.03.2023',releaseDate:'24.03.2023',score:9.2,cover:'https://cdn.akamai.steamstatic.com/steam/apps/2050650/header.jpg',slug:'resident-evil-4',covers:['https://cdn.akamai.steamstatic.com/steam/apps/2050650/header.jpg','https://cdn.akamai.steamstatic.com/steam/apps/2050650/capsule_616x353.jpg'],exact:true},
  {rx:/tomb\s*raider\s*2013|\btomb\s*raider\b/i,title:'Tomb Raider',seriesName:'Tomb Raider',genre:'Aksiyon-macera, Keşif, Hikaye Odaklı',released:'05.03.2013',releaseDate:'05.03.2013',score:8.6,cover:'https://cdn.akamai.steamstatic.com/steam/apps/203160/header.jpg',slug:'tomb-raider',covers:['https://cdn.akamai.steamstatic.com/steam/apps/203160/header.jpg','https://cdn.akamai.steamstatic.com/steam/apps/203160/capsule_616x353.jpg'],exact:true}
];
function ho240f14ApiKnown(title){ return HO240F14_API_CATALOG.find(x=>x.rx.test(String(title || ''))); }
function ho240f14ApiCandidatesFor(row){
  if(!row) return [];
  return (row.covers || [row.cover]).filter(Boolean).map((cover, index)=>({
    title:row.title, genre:row.genre, released:row.released, releaseDate:row.releaseDate, score:row.score, cover, rawg_slug:row.slug || '', seriesName:row.seriesName, source:index ? 'FIX14 alternatif' : 'FIX14 kesin eşleşme', description:localTurkishStory(row.title, row.genre)
  }));
}
const ho240f14ApiOldLocalGameMeta = localGameMeta;
localGameMeta = function(title){
  const known = ho240f14ApiKnown(title);
  if(known) return { ...known, description:localTurkishStory(known.title, known.genre) };
  return ho240f14ApiOldLocalGameMeta(title);
};
const ho240f14ApiOldFetchRawgMeta = fetchRawgMeta;
fetchRawgMeta = async function(title){
  const known = ho240f14ApiKnown(title);
  const localCandidates = ho240f14ApiCandidatesFor(known);
  let remote = null;
  try{ remote = await ho240f14ApiOldFetchRawgMeta(title); }catch{}
  const seen = new Set();
  const merged = [...localCandidates, ...(remote?.candidates || [])].filter(c=>{
    const cover = String(c.cover || '').trim();
    if(!cover || seen.has(cover)) return false;
    seen.add(cover); return true;
  }).slice(0,20);
  if(known) return { ...known, description:localTurkishStory(known.title, known.genre), candidates:merged.length ? merged : localCandidates };
  if(remote) return { ...remote, candidates:merged.length ? merged : (remote.candidates || []) };
  return null;
};


/* v2.4.0 FIX 33 - API tarafında oyun adı kesin eşleşme kilidi */
function ho240f33ApiNorm(value=''){
  return String(value || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/['’`´]/g,' ')
    .replace(/&/g,' and ')
    .replace(/[^a-z0-9]+/g,' ')
    .replace(/\s+/g,' ')
    .trim();
}
function ho240f33ApiTokens(value=''){
  return ho240f33ApiNorm(value).split(' ').filter(Boolean).filter(t=>!['the','a','an','of','and','edition','remastered','remaster'].includes(t));
}
function ho240f33ApiNumbers(value=''){
  return new Set((ho240f33ApiNorm(value).match(/\b\d+\b/g) || []));
}
function ho240f33ApiScore(query='', candidate=''){
  const q = ho240f33ApiNorm(query);
  const c = ho240f33ApiNorm(candidate);
  if(!q || !c) return 0;
  if(q === c) return 100;
  const qNums = ho240f33ApiNumbers(q);
  const cNums = ho240f33ApiNumbers(c);
  for(const n of cNums){ if(!qNums.has(n)) return 0; }
  for(const n of qNums){ if(!cNums.has(n)) return 0; }
  if(c.includes(q)) return 92;
  const qt = ho240f33ApiTokens(q);
  const ct = new Set(ho240f33ApiTokens(c));
  if(!qt.length) return 0;
  const hits = qt.filter(t=>ct.has(t)).length;
  const ratio = hits / qt.length;
  if(ratio === 1){
    const extra = Math.max(0, ct.size - qt.length);
    return Math.max(76, 88 - extra * 4);
  }
  return Math.round(ratio * 70);
}
function ho240f33ApiKnown(title=''){
  try{
    if(typeof HO240F14_API_CATALOG !== 'undefined'){
      const found = HO240F14_API_CATALOG.find(x=>x.rx.test(String(title || '')) && ho240f33ApiScore(title, x.title) >= 76);
      if(found) return { ...found, matchScore:ho240f33ApiScore(title, found.title) };
    }
  }catch{}
  return null;
}
function ho240f33ApiMetaFromKnown(row){
  if(!row) return null;
  return {
    ...row,
    title:row.title,
    seriesName:row.seriesName || '',
    released:row.released || row.releaseDate || '',
    releaseDate:row.releaseDate || row.released || '',
    rawg_slug:row.slug || row.rawg_slug || '',
    description:localTurkishStory(row.title, row.genre || ''),
    exact:true,
    matchScore:row.matchScore || 100
  };
}
function ho240f33ApiCandidates(row){
  if(!row) return [];
  const meta = ho240f33ApiMetaFromKnown(row);
  return (row.covers || [row.cover]).filter(Boolean).map((cover, index)=>({
    ...meta,
    cover,
    source:index ? 'FIX33 alternatif kapak' : 'FIX33 kesin eşleşme'
  }));
}
const ho240f33PrevLocalGameMetaApi = localGameMeta;
localGameMeta = function(title){
  const known = ho240f33ApiKnown(title);
  if(known) return ho240f33ApiMetaFromKnown(known);
  const base = ho240f33PrevLocalGameMetaApi(title) || {};
  const score = ho240f33ApiScore(title, base.title || title);
  if(score >= 76) return { ...base, title:base.title || String(title || '').trim(), matchScore:score };
  return { title:String(title || '').trim(), genre:'Genel, Hikaye Odaklı', released:'', releaseDate:'', score:8.5, cover:'', exact:false, matchScore:0 };
};
const ho240f33PrevFetchRawgMetaApi = fetchRawgMeta;
fetchRawgMeta = async function(title){
  const query = String(title || '').trim();
  const known = ho240f33ApiKnown(query);
  if(known){
    const meta = ho240f33ApiMetaFromKnown(known);
    return { ...meta, candidates:ho240f33ApiCandidates(known) };
  }
  let remote = null;
  try{ remote = await ho240f33PrevFetchRawgMetaApi(query); }catch{}
  const candidates = (remote?.candidates || []).map(c=>({ ...c, matchScore:ho240f33ApiScore(query, c.title || '') })).filter(c=>c.matchScore >= 76);
  candidates.sort((a,b)=>(Number(b.matchScore||0)-Number(a.matchScore||0)));
  if(!candidates.length) return null;
  const best = candidates[0];
  return { ...best, title:best.title || query, releaseDate:best.releaseDate || best.released || '', released:best.released || best.releaseDate || '', exact:best.matchScore >= 92, candidates };
};

/* v2.4.0 FIX 34 - API meta/kapak kesin başlık güvenliği
   Eski geniş regexler (özellikle Alan Wake) farklı oyunu döndürmesin. */
function ho240f34ApiNorm(value=''){
  return String(value || '').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/['’`´]/g,' ').replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
}
function ho240f34ApiScore(query='', candidate=''){
  const q = ho240f34ApiNorm(query), c = ho240f34ApiNorm(candidate);
  if(!q || !c) return 0;
  if(q === c) return 100;
  const qNums = new Set(q.match(/\b\d+\b/g) || []);
  const cNums = new Set(c.match(/\b\d+\b/g) || []);
  for(const n of qNums){ if(!cNums.has(n)) return 0; }
  for(const n of cNums){ if(!qNums.has(n)) return 0; }
  if(c.includes(q)) return 92;
  const stop = new Set(['the','a','an','of','and','edition','remastered','remaster']);
  const qt = q.split(' ').filter(t=>t && !stop.has(t));
  const ct = new Set(c.split(' ').filter(t=>t && !stop.has(t)));
  const hits = qt.filter(t=>ct.has(t)).length;
  if(!qt.length) return 0;
  const ratio = hits / qt.length;
  return ratio === 1 ? Math.max(76, 88 - Math.max(0, ct.size - qt.length) * 5) : Math.round(ratio * 70);
}
const ho240f34PrevLocalGameMetaApi = localGameMeta;
localGameMeta = function(title){
  const query = String(title || '').trim();
  const known = (typeof HO240F14_API_CATALOG !== 'undefined' ? HO240F14_API_CATALOG : []).find(row => row.rx.test(query) && ho240f34ApiScore(query, row.title) >= 76);
  if(known) return { ...known, released:known.releaseDate || known.released || '', releaseDate:known.releaseDate || known.released || '', description:localTurkishStory(known.title, known.genre), exact:true, matchScore:ho240f34ApiScore(query, known.title) };
  const base = ho240f34PrevLocalGameMetaApi(query) || {};
  const score = ho240f34ApiScore(query, base.title || query);
  if(score >= 92) return { ...base, title:base.title || query, exact:true, matchScore:score };
  return { title:query, genre:'Genel, Hikaye Odaklı', released:'', releaseDate:'', score:8.5, cover:'', exact:false, matchScore:0, description:localTurkishStory(query, 'Genel') };
};
const ho240f34PrevFetchRawgMetaApi = fetchRawgMeta;
fetchRawgMeta = async function(title){
  const query = String(title || '').trim();
  const known = localGameMeta(query);
  if(known?.exact === true && ho240f34ApiScore(query, known.title || '') >= 76){
    const covers = known.covers || [known.cover].filter(Boolean);
    return { ...known, candidates:covers.map((cover, index)=>({ ...known, cover, source:index ? 'FIX34 alternatif kapak' : 'FIX34 kesin eşleşme' })) };
  }
  const remote = await ho240f34PrevFetchRawgMetaApi(query).catch(()=>null);
  const candidates = (remote?.candidates || []).map(c=>({ ...c, matchScore:ho240f34ApiScore(query, c.title || '') })).filter(c=>c.matchScore >= 76).sort((a,b)=>Number(b.matchScore||0)-Number(a.matchScore||0));
  if(!candidates.length) return null;
  const best = candidates[0];
  return { ...best, title:best.title || query, exact:Number(best.matchScore||0) >= 92, candidates };
};

/* v2.4.0 FIX 35 - API kapak arama için Steam yedek kaynağı
   RAWG key yoksa veya sonuç dönmezse Steam store aramasıyla header/capsule kapak adayları üretilir. */
function ho240f35ApiNorm(value=''){
  return String(value || '').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/['’`´]/g,' ').replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
}
function ho240f35ApiScore(query='', candidate=''){
  const q = ho240f35ApiNorm(query), c = ho240f35ApiNorm(candidate);
  if(!q || !c) return 0;
  if(q === c) return 100;
  const qNums = new Set(q.match(/\b\d+\b/g) || []);
  const cNums = new Set(c.match(/\b\d+\b/g) || []);
  for(const n of qNums){ if(!cNums.has(n)) return 0; }
  for(const n of cNums){ if(!qNums.has(n)) return 0; }
  if(c.includes(q)) return 94;
  const stop = new Set(['the','a','an','of','and','edition','remastered','remaster','game']);
  const qt = q.split(' ').filter(t=>t && !stop.has(t));
  const ct = new Set(c.split(' ').filter(t=>t && !stop.has(t)));
  if(!qt.length) return 0;
  const hits = qt.filter(t=>ct.has(t)).length;
  const ratio = hits / qt.length;
  return ratio === 1 ? Math.max(70, 90 - Math.max(0, ct.size - qt.length) * 4) : Math.round(ratio * 72);
}
async function ho240f35SteamCoverCandidates(title=''){
  const query = String(title || '').trim();
  if(!query || typeof fetch !== 'function') return [];
  const url = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(query)}&cc=tr&l=turkish`;
  const response = await fetch(url, { headers:{ 'User-Agent':'Hayatimiz-Oyun-Archive/2.4.0-fix35' } }).catch(()=>null);
  if(!response || !response.ok) return [];
  const data = await response.json().catch(()=>({}));
  const items = Array.isArray(data?.items) ? data.items : [];
  const out = [];
  for(const item of items.slice(0,10)){
    const appid = item.id || item.appid;
    const name = item.name || query;
    const matchScore = ho240f35ApiScore(query, name);
    if(!appid || matchScore < 70) continue;
    const base = `https://cdn.akamai.steamstatic.com/steam/apps/${appid}`;
    out.push({ title:name, genre:'Genel, Hikaye Odaklı', released:'', releaseDate:'', score:8.5, cover:`${base}/header.jpg`, rawg_slug:'', source:'Steam kapak araması', matchScore, description:localTurkishStory(name, 'Genel') });
    out.push({ title:name, genre:'Genel, Hikaye Odaklı', released:'', releaseDate:'', score:8.5, cover:`${base}/capsule_616x353.jpg`, rawg_slug:'', source:'Steam alternatif kapak', matchScore:Math.max(70, matchScore-1), description:localTurkishStory(name, 'Genel') });
  }
  return out;
}
function ho240f35MergeApiCandidates(list=[]){
  const seen = new Set();
  return (Array.isArray(list) ? list : []).filter(c=>{
    const cover = String(c?.cover || '').trim();
    if(!cover) return false;
    const id = cover.toLowerCase().replace(/\?.*$/,'');
    if(seen.has(id)) return false;
    seen.add(id);
    return true;
  }).sort((a,b)=>Number(b.matchScore||0)-Number(a.matchScore||0)).slice(0,24);
}
const ho240f35PrevFetchRawgMetaApi = fetchRawgMeta;
fetchRawgMeta = async function(title){
  const query = String(title || '').trim();
  const prev = await ho240f35PrevFetchRawgMetaApi(query).catch(()=>null);
  const steam = await ho240f35SteamCoverCandidates(query).catch(()=>[]);
  const candidates = ho240f35MergeApiCandidates([...(prev?.candidates || []), ...steam].map(c=>({ ...c, matchScore:c.matchScore || ho240f35ApiScore(query, c.title || '') })).filter(c=>Number(c.matchScore||0) >= 70));
  if(prev && candidates.length) return { ...prev, candidates, cover:prev.cover || candidates[0]?.cover || '' };
  if(candidates.length) return { ...candidates[0], exact:Number(candidates[0].matchScore||0) >= 92, candidates };
  return prev;
};


/* v2.4.0 FIX 36 - API tüm Alan Wake kapakları + çıkış tarihi adayları
   Kapak aramasında sadece ilk eşleşmeyi değil, aynı seri ailesindeki tüm güvenli adayları döndürür. */
const HO240F36_API_ALAN_WAKE_FAMILY = [
  {title:'Alan Wake Remastered DLC: The Writer',seriesName:'Alan Wake',releaseDate:'12.10.2010',released:'12.10.2010',genre:'Psikolojik gerilim, hikaye odaklı DLC, aksiyon-macera',score:8.1,match:['alan wake remastered dlc the writer','alan wake the writer','the writer'],covers:[['https://cdn.akamai.steamstatic.com/steam/apps/108710/header.jpg','The Writer / Alan Wake geniş kapak'],['https://cdn.akamai.steamstatic.com/steam/apps/108710/capsule_616x353.jpg','The Writer / Steam capsule'],['https://cdn.cloudflare.steamstatic.com/steam/apps/108710/header.jpg','The Writer / Cloudflare header'],['https://cdn.cloudflare.steamstatic.com/steam/apps/108710/capsule_616x353.jpg','The Writer / Cloudflare capsule']]},
  {title:'Alan Wake Remastered DLC: The Signal',seriesName:'Alan Wake',releaseDate:'27.07.2010',released:'27.07.2010',genre:'Psikolojik gerilim, hikaye odaklı DLC, aksiyon-macera',score:8.0,match:['alan wake remastered dlc the signal','alan wake the signal','the signal'],covers:[['https://cdn.akamai.steamstatic.com/steam/apps/108710/header.jpg','The Signal / Alan Wake geniş kapak'],['https://cdn.akamai.steamstatic.com/steam/apps/108710/capsule_616x353.jpg','The Signal / Steam capsule'],['https://cdn.cloudflare.steamstatic.com/steam/apps/108710/header.jpg','The Signal / Cloudflare header'],['https://cdn.cloudflare.steamstatic.com/steam/apps/108710/capsule_616x353.jpg','The Signal / Cloudflare capsule']]},
  {title:'Alan Wake',seriesName:'Alan Wake',releaseDate:'14.05.2010',released:'14.05.2010',genre:'Aksiyon-macera, psikolojik korku, gerilim, hikaye odaklı',score:8.2,match:['alan wake'],covers:[['https://cdn.akamai.steamstatic.com/steam/apps/108710/header.jpg','Alan Wake / Steam header'],['https://cdn.akamai.steamstatic.com/steam/apps/108710/capsule_616x353.jpg','Alan Wake / Steam capsule'],['https://cdn.akamai.steamstatic.com/steam/apps/108710/library_600x900.jpg','Alan Wake / Dikey kütüphane kapağı'],['https://cdn.cloudflare.steamstatic.com/steam/apps/108710/header.jpg','Alan Wake / Cloudflare header'],['https://cdn.cloudflare.steamstatic.com/steam/apps/108710/capsule_616x353.jpg','Alan Wake / Cloudflare capsule']]},
  {title:'Alan Wake Remastered',seriesName:'Alan Wake',releaseDate:'05.10.2021',released:'05.10.2021',genre:'Aksiyon-macera, psikolojik korku, gerilim, hikaye odaklı, remastered',score:8.0,match:['alan wake remastered','alan wake remaster'],covers:[['https://media.rawg.io/media/games/053/0531fbe64d90d7a97acb88ba8f340cb9.jpg','Alan Wake Remastered / RAWG kapak'],['https://cdn.akamai.steamstatic.com/steam/apps/108710/header.jpg','Alan Wake Remastered / güvenli geniş kapak'],['https://cdn.akamai.steamstatic.com/steam/apps/108710/capsule_616x353.jpg','Alan Wake Remastered / güvenli capsule'],['https://cdn.cloudflare.steamstatic.com/steam/apps/108710/library_600x900.jpg','Alan Wake Remastered / alternatif dikey kapak']]},
  {title:"Alan Wake's American Nightmare",seriesName:'Alan Wake',releaseDate:'22.02.2012',released:'22.02.2012',genre:'Aksiyon, psikolojik korku, gerilim, arcade aksiyon, hikaye odaklı',score:7.8,match:['alan wakes american nightmare','alan wake american nightmare','american nightmare'],covers:[['https://cdn.akamai.steamstatic.com/steam/apps/202750/header.jpg','American Nightmare / Steam header'],['https://cdn.akamai.steamstatic.com/steam/apps/202750/capsule_616x353.jpg','American Nightmare / Steam capsule'],['https://cdn.akamai.steamstatic.com/steam/apps/202750/library_600x900.jpg','American Nightmare / Dikey kütüphane kapağı'],['https://cdn.cloudflare.steamstatic.com/steam/apps/202750/header.jpg','American Nightmare / Cloudflare header'],['https://cdn.cloudflare.steamstatic.com/steam/apps/202750/capsule_616x353.jpg','American Nightmare / Cloudflare capsule']]},
  {title:'Alan Wake 2',seriesName:'Alan Wake',releaseDate:'27.10.2023',released:'27.10.2023',genre:'Hayatta kalma korku, psikolojik gerilim, sinematik hikaye',score:9.1,match:['alan wake 2','alan wake ii'],covers:[['https://media.rawg.io/media/games/599/5999f254b9a7facb3147a28d956a163e.jpg','Alan Wake 2 / RAWG kapak'],['https://media.rawg.io/media/screenshots/6e6/6e6daab9b4632d594d9c2b79e926f6e5.jpg','Alan Wake 2 / alternatif görsel']]}
];
function ho240f36ApiNorm(value=''){
  return String(value || '').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/['’`´]/g,' ').replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
}
function ho240f36ApiIsAlanWake(value=''){
  const q = ho240f36ApiNorm(value);
  return /\balan\s+wake\b/.test(q) || /\bamerican\s+nightmare\b/.test(q) || /\bthe\s+writer\b/.test(q) || /\bthe\s+signal\b/.test(q);
}
function ho240f36ApiBoost(query='', row){
  const q = ho240f36ApiNorm(query);
  const title = ho240f36ApiNorm(row?.title || '');
  const match = Array.isArray(row?.match) ? row.match.map(ho240f36ApiNorm) : [];
  if(match.some(m=>m && q.includes(m))) return 130;
  if(q.includes('writer') && title.includes('writer')) return 128;
  if(q.includes('signal') && title.includes('signal')) return 126;
  if(q.includes('american nightmare') && title.includes('american nightmare')) return 124;
  if(/\balan wake 2\b/.test(q) && /\balan wake 2\b/.test(title)) return 124;
  if(q.includes('remaster') && title.includes('remaster')) return 122;
  if(title === 'alan wake') return 112;
  return 96;
}
function ho240f36ApiStory(row){
  return `${row.title}, ${row.genre} türünde Alan Wake evrenine bağlı bir içeriktir. Bu kayıt kapak seçici ve çıkış tarihi alanı için güvenli yerel katalogdan üretilmiştir.`;
}
function ho240f36ApiAlanWakeCandidates(title=''){
  const query = String(title || '').trim();
  if(!ho240f36ApiIsAlanWake(query)) return [];
  const out = [];
  for(const row of HO240F36_API_ALAN_WAKE_FAMILY){
    const baseScore = ho240f36ApiBoost(query, row);
    (row.covers || []).forEach((item, index)=>{
      const cover = Array.isArray(item) ? item[0] : item;
      const label = Array.isArray(item) ? item[1] : (index ? 'Alternatif kapak' : 'Ana kapak');
      if(!cover) return;
      out.push({
        title:row.title,
        seriesName:row.seriesName,
        genre:row.genre,
        released:row.released || row.releaseDate,
        releaseDate:row.releaseDate || row.released,
        score:row.score,
        cover,
        rawg_slug:'',
        exact:true,
        matchScore:Math.max(80, baseScore - index),
        source:`FIX36 Alan Wake seri kataloğu • ${label}`,
        description:ho240f36ApiStory(row)
      });
    });
  }
  return out.sort((a,b)=>Number(b.matchScore||0)-Number(a.matchScore||0));
}
function ho240f36ApiMergeCandidates(list=[]){
  const seen = new Set();
  return (Array.isArray(list) ? list : []).filter(c=>{
    const cover = String(c?.cover || '').trim();
    if(!cover) return false;
    const id = `${ho240f36ApiNorm(c.title || '')}|${String(c.releaseDate || c.released || '').trim()}|${cover.toLowerCase().replace(/\?.*$/,'')}`;
    if(seen.has(id)) return false;
    seen.add(id);
    return true;
  }).sort((a,b)=>Number(b.matchScore||0)-Number(a.matchScore||0)).slice(0,60);
}
const ho240f36PrevLocalGameMetaApi = localGameMeta;
localGameMeta = function(title){
  const family = ho240f36ApiAlanWakeCandidates(title);
  if(family.length){
    const best = family[0];
    return { ...best, cover:best.cover || '', exact:true, description:best.description || localTurkishStory(best.title, best.genre) };
  }
  return ho240f36PrevLocalGameMetaApi(title);
};
const ho240f36PrevFetchRawgMetaApi = fetchRawgMeta;
fetchRawgMeta = async function(title){
  const query = String(title || '').trim();
  const family = ho240f36ApiAlanWakeCandidates(query);
  const prev = await ho240f36PrevFetchRawgMetaApi(query).catch(()=>null);
  const candidates = ho240f36ApiMergeCandidates([...family, ...(prev?.candidates || [])]);
  if(candidates.length){
    const best = candidates[0];
    return { ...best, exact:true, candidates, cover:best.cover || prev?.cover || '' };
  }
  return prev;
};

/* v2.4.0 FIX 37 - API Google/Internet geniş DLC kapak havuzu */
const HO240F37_API_VERSION = 'v2.4.0 FIX 37';
function ho240f37ApiNorm(value=''){
  return String(value || '').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/['’`´]/g,' ').replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
}
function ho240f37ApiIsAlanWake(value=''){
  const q = ho240f37ApiNorm(value);
  return /\balan\s+wake\b/.test(q) || /\bnight\s+springs\b/.test(q) || /\blake\s+house\b/.test(q) || /\bthe\s+writer\b/.test(q) || /\bthe\s+signal\b/.test(q) || /\bamerican\s+nightmare\b/.test(q);
}
const HO240F37_API_ALAN_WAKE_INTERNET_COVERS = [
  {title:'Alan Wake II: Night Springs',aliases:['alan wake 2 night springs','alan wake ii night springs','night springs','alan wake 2 dlc night springs'],seriesName:'Alan Wake',releaseDate:'08.06.2024',genre:'DLC, psikolojik korku, antoloji hikaye, aksiyon-macera',score:8.5,covers:[['/assets/alan-wake-night-springs.png','Night Springs / paket içi yerel kapak'],['https://blog.playstation.com/uploads/2024/06/1bca6c720882a33f0cc80ade266dd65e33e58302.jpg','Night Springs / PlayStation Blog resmi görsel'],['https://www.alanwake.com/wp-content/uploads/2023/05/Expansion_pass_3.webp','Expansion Pass / resmi kart']]},
  {title:'Alan Wake II: The Lake House',aliases:['alan wake 2 the lake house','alan wake ii the lake house','the lake house','lake house expansion'],seriesName:'Alan Wake',releaseDate:'22.10.2024',genre:'DLC, survival horror, FBC, psikolojik korku, hikaye odaklı',score:8.4,covers:[['https://www.alanwake.com/wp-content/uploads/2024/09/AW2_Lakehouse_DLC_teaser_keyart_1000x1000_logo_final-1300x650.png','The Lake House / AlanWake.com resmi key art'],['https://www.alanwake.com/wp-content/uploads/2023/05/Expansion_pass_3.webp','Expansion Pass / resmi kart']]},
  {title:'Alan Wake: The Writer',aliases:['alan wake the writer','the writer','alan wake remastered the writer','alan wake remastered dlc the writer'],seriesName:'Alan Wake',releaseDate:'12.10.2010',genre:'DLC, psikolojik gerilim, hikaye odaklı, aksiyon-macera',score:8.1,covers:[['https://www.slam-zine.de/uploads/micro/alan_wake_-_the_writer_%28c%29_microsoft.jpg','The Writer / internet kapak sonucu'],['https://cdn.akamai.steamstatic.com/steam/apps/108710/header.jpg','The Writer / Alan Wake Steam geniş kapak'],['https://cdn.akamai.steamstatic.com/steam/apps/108710/capsule_616x353.jpg','The Writer / Steam capsule']]},
  {title:'Alan Wake: The Signal',aliases:['alan wake the signal','the signal','alan wake remastered the signal','alan wake remastered dlc the signal'],seriesName:'Alan Wake',releaseDate:'27.07.2010',genre:'DLC, psikolojik gerilim, hikaye odaklı, aksiyon-macera',score:8.0,covers:[['https://images.igdb.com/igdb/image/upload/t_cover_big/co1ybw.jpg','The Signal / IGDB kapak'],['https://cdn.akamai.steamstatic.com/steam/apps/108710/header.jpg','The Signal / Alan Wake Steam geniş kapak'],['https://cdn.akamai.steamstatic.com/steam/apps/108710/capsule_616x353.jpg','The Signal / Steam capsule']]},
  {title:'Alan Wake',aliases:['alan wake'],seriesName:'Alan Wake',releaseDate:'14.05.2010',genre:'Aksiyon-macera, psikolojik korku, gerilim, hikaye odaklı',score:8.2,covers:[['https://cdn.akamai.steamstatic.com/steam/apps/108710/header.jpg','Alan Wake / Steam header'],['https://cdn.akamai.steamstatic.com/steam/apps/108710/capsule_616x353.jpg','Alan Wake / Steam capsule'],['https://cdn.akamai.steamstatic.com/steam/apps/108710/library_600x900.jpg','Alan Wake / dikey kütüphane kapağı']]},
  {title:'Alan Wake Remastered',aliases:['alan wake remastered','alan wake remaster'],seriesName:'Alan Wake',releaseDate:'05.10.2021',genre:'Remastered, aksiyon-macera, psikolojik korku, hikaye odaklı',score:8.0,covers:[['https://media.rawg.io/media/games/053/0531fbe64d90d7a97acb88ba8f340cb9.jpg','Alan Wake Remastered / RAWG kapak'],['https://cdn.akamai.steamstatic.com/steam/apps/108710/header.jpg','Alan Wake Remastered / geniş kapak'],['https://cdn.akamai.steamstatic.com/steam/apps/108710/capsule_616x353.jpg','Alan Wake Remastered / capsule']]},
  {title:"Alan Wake's American Nightmare",aliases:['alan wakes american nightmare','alan wake american nightmare','american nightmare'],seriesName:'Alan Wake',releaseDate:'22.02.2012',genre:'Aksiyon, psikolojik korku, gerilim, arcade aksiyon, hikaye odaklı',score:7.8,covers:[['https://cdn.akamai.steamstatic.com/steam/apps/202750/header.jpg','American Nightmare / Steam header'],['https://cdn.akamai.steamstatic.com/steam/apps/202750/capsule_616x353.jpg','American Nightmare / Steam capsule'],['https://cdn.akamai.steamstatic.com/steam/apps/202750/library_600x900.jpg','American Nightmare / dikey kapak']]},
  {title:'Alan Wake 2',aliases:['alan wake 2','alan wake ii'],seriesName:'Alan Wake',releaseDate:'27.10.2023',genre:'Hayatta kalma korku, psikolojik gerilim, sinematik hikaye',score:9.1,covers:[['https://media.rawg.io/media/games/599/5999f254b9a7facb3147a28d956a163e.jpg','Alan Wake 2 / RAWG kapak'],['https://media.rawg.io/media/screenshots/6e6/6e6daab9b4632d594d9c2b79e926f6e5.jpg','Alan Wake 2 / alternatif görsel'],['https://www.alanwake.com/wp-content/uploads/2023/05/Expansion_pass_3.webp','Alan Wake 2 / Expansion Pass kartı']]}
];
function ho240f37ApiBoost(query='', row){
  const q = ho240f37ApiNorm(query), title = ho240f37ApiNorm(row?.title || '');
  const aliases = Array.isArray(row?.aliases) ? row.aliases.map(ho240f37ApiNorm) : [];
  if(aliases.some(a=>a && q === a)) return 160;
  if(aliases.some(a=>a && q.includes(a))) return 150;
  if(q.includes('night springs') && title.includes('night springs')) return 155;
  if(q.includes('lake house') && title.includes('lake house')) return 154;
  if(q.includes('writer') && title.includes('writer')) return 153;
  if(q.includes('signal') && title.includes('signal')) return 152;
  if(q.includes('american nightmare') && title.includes('american nightmare')) return 151;
  if(q.includes('remaster') && title.includes('remaster')) return 140;
  if(title === 'alan wake') return 110;
  return 92;
}
function ho240f37ApiStory(row){ return `${row.title}, ${row.genre} türünde Alan Wake evrenine bağlı bir içeriktir. Bu kayıt Google/İnternet tarzı geniş kapak havuzu ve güvenli yerel katalogdan üretildi.`; }
function ho240f37ApiExpandedCandidates(title=''){
  const query = String(title || '').trim();
  if(!ho240f37ApiIsAlanWake(query)) return [];
  const out = [];
  for(const row of HO240F37_API_ALAN_WAKE_INTERNET_COVERS){
    const base = ho240f37ApiBoost(query, row);
    (row.covers || []).forEach((item, index)=>{
      const cover = Array.isArray(item) ? item[0] : item;
      const label = Array.isArray(item) ? item[1] : (index ? 'Alternatif kapak' : 'Ana kapak');
      if(!cover) return;
      out.push({title:row.title,seriesName:row.seriesName,genre:row.genre,released:row.releaseDate,releaseDate:row.releaseDate,score:row.score,cover,rawg_slug:'',exact:true,matchScore:Math.max(75, base-index),source:`FIX37 Google/İnternet kapak havuzu • ${label}`,description:ho240f37ApiStory(row)});
    });
  }
  return out.sort((a,b)=>Number(b.matchScore||0)-Number(a.matchScore||0));
}
function ho240f37ApiMergeCandidates(list=[]){
  const seen = new Set();
  return (Array.isArray(list) ? list : []).filter(c=>{
    const cover = String(c?.cover || c?.cover_url || '').trim();
    if(!cover) return false;
    const id = `${ho240f37ApiNorm(c.title || '')}|${String(c.releaseDate || c.released || '').trim()}|${cover.toLowerCase().replace(/\?.*$/,'')}`;
    if(seen.has(id)) return false;
    seen.add(id);
    return true;
  }).sort((a,b)=>Number(b.matchScore||0)-Number(a.matchScore||0)).slice(0,90);
}
function ho240f37ApiGuessSearchTitle(query=''){
  const q = ho240f37ApiNorm(query);
  if(q.includes('night springs')) return 'Alan Wake II Night Springs expansion cover art';
  if(q.includes('lake house')) return 'Alan Wake II The Lake House expansion cover art';
  if(q.includes('the writer') || q === 'writer') return 'Alan Wake The Writer DLC cover art';
  if(q.includes('the signal') || q === 'signal') return 'Alan Wake The Signal DLC cover art';
  return `${query} game cover art`;
}
function ho240f37ApiDecodeHtml(value=''){
  return String(value || '').replace(/\\\//g,'/').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\\u002f/g,'/');
}
async function ho240f37BingImageCandidates(query=''){
  const q = ho240f37ApiGuessSearchTitle(query);
  const url = `https://www.bing.com/images/search?q=${encodeURIComponent(q)}&safeSearch=moderate&first=1&count=35`;
  const response = await fetch(url, { headers:{ 'User-Agent':'Mozilla/5.0 Hayatimiz-Oyun-Cover-Fetch' } });
  if(!response.ok) return [];
  const html = await response.text();
  const urls = [];
  const rxList = [/"murl"\s*:\s*"([^"]+)"/g, /murl&quot;:&quot;([^&]+)&quot;/g, /imgurl=([^&"']+)/g];
  for(const rx of rxList){
    let m;
    while((m = rx.exec(html)) && urls.length < 30){
      let u = ho240f37ApiDecodeHtml(decodeURIComponent(m[1] || ''));
      if(!/^https?:\/\//i.test(u)) continue;
      if(!/\.(jpg|jpeg|png|webp)(\?|$)/i.test(u)) continue;
      if(/sprite|logo|favicon|avatar|blank|pixel/i.test(u)) continue;
      urls.push(u);
    }
  }
  const seen = new Set();
  return urls.filter(u=>{ const k=u.toLowerCase().replace(/\?.*$/,''); if(seen.has(k)) return false; seen.add(k); return true; }).slice(0,12).map((cover, index)=>({ title:String(query || '').trim(), seriesName:ho240f37ApiIsAlanWake(query)?'Alan Wake':'', genre:'Genel, Hikaye Odaklı', released:'', releaseDate:'', score:8.5, cover, rawg_slug:'', exact:false, matchScore:72-index, source:'FIX37 canlı internet görsel araması', description:localTurkishStory(query, 'Genel') }));
}
try{
  const ho240f37PrevLocalMetaApi = localGameMeta;
  localGameMeta = function(title){
    const family = ho240f37ApiExpandedCandidates(title);
    if(family.length){ const best = family[0]; return { ...best, cover:best.cover || '', exact:true, description:best.description || localTurkishStory(best.title, best.genre) }; }
    return ho240f37PrevLocalMetaApi(title);
  };
}catch{}
try{
  const ho240f37PrevFetchRawgMetaApi = fetchRawgMeta;
  fetchRawgMeta = async function(title){
    const query = String(title || '').trim();
    const family = ho240f37ApiExpandedCandidates(query);
    const prev = await ho240f37PrevFetchRawgMetaApi(query).catch(()=>null);
    const web = await ho240f37BingImageCandidates(query).catch(()=>[]);
    const candidates = ho240f37ApiMergeCandidates([...family, ...(prev?.candidates || []), ...web]);
    if(candidates.length){ const best = candidates[0]; return { ...best, exact:true, candidates, cover:best.cover || prev?.cover || '' }; }
    return prev;
  };
}catch(error){ console.warn('FIX37 API kapak havuzu kurulamadı:', error); }

/* v2.4.0 FIX 41 - API kapak/tarih/tür kaynaklarını genişletme
   Steam Store + RAWG + internet görsel havuzu + yerel DLC katalog adayları birlikte döner. */
const HO240F41_API_VERSION = 'v2.4.0 FIX 41';
function ho240f41ApiMonthToTr(value=''){
  const map = {jan:'01',january:'01',feb:'02',february:'02',mar:'03',march:'03',apr:'04',april:'04',may:'05',jun:'06',june:'06',jul:'07',july:'07',aug:'08',august:'08',sep:'09',sept:'09',september:'09',oct:'10',october:'10',nov:'11',november:'11',dec:'12',december:'12'};
  return map[String(value||'').toLowerCase()] || '';
}
function ho240f41ApiNormalizeDate(value=''){
  const raw = String(value || '').trim();
  if(!raw) return '';
  const tr = raw.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
  if(tr) return `${tr[1].padStart(2,'0')}.${tr[2].padStart(2,'0')}.${tr[3]}`;
  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if(iso) return `${iso[3]}.${iso[2]}.${iso[1]}`;
  const en = raw.replace(',', '').match(/^([A-Za-z]+)\s+(\d{1,2})\s+(\d{4})$/);
  if(en){ const mo = ho240f41ApiMonthToTr(en[1]); if(mo) return `${en[2].padStart(2,'0')}.${mo}.${en[3]}`; }
  const en2 = raw.replace(',', '').match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if(en2){ const mo = ho240f41ApiMonthToTr(en2[2]); if(mo) return `${en2[1].padStart(2,'0')}.${mo}.${en2[3]}`; }
  return normalizeRawgDate(raw);
}
function ho240f41ApiTranslateSteamGenres(items=[]){
  const names = (Array.isArray(items) ? items : []).map(g=>String(g.description || g.name || '').trim()).filter(Boolean);
  if(!names.length) return '';
  return names.map(translateGenre).filter(Boolean).join(', ');
}
async function ho240f41SteamCandidates(query=''){
  const title = String(query || '').trim();
  if(!title) return [];
  const out = [];
  try{
    const searchUrl = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(title)}&cc=us&l=en`;
    const response = await fetch(searchUrl, { headers:{ 'User-Agent':'Hayatimiz-Oyun-Archive-FIX41' } });
    if(!response.ok) return [];
    const data = await response.json();
    const items = Array.isArray(data?.items) ? data.items.slice(0,8) : [];
    for(const [idx,item] of items.entries()){
      const appid = item?.id || item?.appid;
      let details = null;
      if(appid){
        try{
          const detailRes = await fetch(`https://store.steampowered.com/api/appdetails?appids=${encodeURIComponent(appid)}&cc=us&l=en`, { headers:{ 'User-Agent':'Hayatimiz-Oyun-Archive-FIX41' } });
          if(detailRes.ok){
            const detailJson = await detailRes.json();
            details = detailJson?.[appid]?.data || null;
          }
        }catch{}
      }
      const name = details?.name || item?.name || title;
      const releaseDate = ho240f41ApiNormalizeDate(details?.release_date?.date || '');
      const genre = ho240f41ApiTranslateSteamGenres(details?.genres || []) || 'Genel, Hikaye Odaklı';
      const coverUrls = [
        item?.tiny_image,
        details?.header_image,
        appid ? `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/header.jpg` : '',
        appid ? `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/capsule_616x353.jpg` : '',
        appid ? `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/library_600x900.jpg` : ''
      ].filter(Boolean);
      coverUrls.forEach((cover, cidx)=>out.push({
        title:name,
        seriesName:'',
        genre,
        released:releaseDate,
        releaseDate,
        score:8.5,
        cover,
        rawg_slug:'',
        exact:false,
        matchScore:Math.max(64, 96 - idx*5 - cidx),
        source:`FIX41 Steam Store ${appid ? '#' + appid : ''}${cidx ? ' alternatif' : ''}`,
        description:localTurkishStory(name, genre)
      }));
    }
  }catch(error){ console.warn('FIX41 Steam adayları alınamadı:', error); }
  return out;
}
function ho240f41ApiMergeCandidates(list=[]){
  const seen = new Set();
  return (Array.isArray(list) ? list : [])
    .map(c=>({ ...c, cover:String(c?.cover || c?.cover_url || '').trim(), releaseDate:ho240f41ApiNormalizeDate(c?.releaseDate || c?.released || '') }))
    .filter(c=>{
      if(!c.cover) return false;
      const id = `${ho240f37ApiNorm(c.title || '')}|${String(c.releaseDate || '')}|${c.cover.toLowerCase().replace(/\?.*$/,'')}`;
      if(seen.has(id)) return false;
      seen.add(id);
      return true;
    })
    .sort((a,b)=>Number(b.matchScore||0)-Number(a.matchScore||0))
    .slice(0,120);
}
try{
  const ho240f41PrevFetchRawgMetaApi = fetchRawgMeta;
  fetchRawgMeta = async function(title){
    const query = String(title || '').trim();
    const prev = await ho240f41PrevFetchRawgMetaApi(query).catch(()=>null);
    const family = typeof ho240f37ApiExpandedCandidates === 'function' ? ho240f37ApiExpandedCandidates(query) : [];
    const steam = await ho240f41SteamCandidates(query).catch(()=>[]);
    const web = typeof ho240f37BingImageCandidates === 'function' ? await ho240f37BingImageCandidates(query).catch(()=>[]) : [];
    const candidates = ho240f41ApiMergeCandidates([...family, ...(prev?.candidates || []), ...steam, ...web]);
    if(candidates.length){
      const best = candidates[0];
      const releaseDate = ho240f41ApiNormalizeDate(best.releaseDate || best.released || prev?.releaseDate || prev?.released || '');
      return { ...(prev || {}), ...best, releaseDate, released:releaseDate, genre:best.genre || prev?.genre || 'Genel, Hikaye Odaklı', candidates, cover:best.cover || prev?.cover || '' };
    }
    return prev;
  };
}catch(error){ console.warn('FIX41 API fetchRawgMeta genişletilemedi:', error); }

/* v2.4.0 FIX 42 - Profesyonel temizlik + çıkış tarihi kesinleştirme motoru
   Oyun adı kilitli kalır. Kapak/tarih/tür/açıklama çekimleri öneri üretir, ana adı değiştirmez. */
const HO240F42_API_VERSION = 'v2.4.0 FIX 42';
function ho240f42Norm(value=''){
  return String(value || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[’']/g,'')
    .replace(/[^a-z0-9ğüşöçıİ\s:.-]/gi,' ')
    .replace(/\s+/g,' ')
    .trim();
}
function ho240f42Date(value=''){
  const raw = String(value || '').trim();
  if(!raw) return '';
  if(typeof ho240f41ApiNormalizeDate === 'function'){
    const d = ho240f41ApiNormalizeDate(raw);
    if(/^\d{2}\.\d{2}\.\d{4}$/.test(d)) return d;
  }
  const iso = raw.match(/(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if(iso) return `${iso[3].padStart(2,'0')}.${iso[2].padStart(2,'0')}.${iso[1]}`;
  const tr = raw.match(/(\d{1,2})[./-](\d{1,2})[./-](\d{4})/);
  if(tr) return `${tr[1].padStart(2,'0')}.${tr[2].padStart(2,'0')}.${tr[3]}`;
  return '';
}
const HO240F42_EXACT_CATALOG = [
  {keys:['alan wake ii night springs','alan wake 2 night springs','night springs'], title:'Alan Wake II: Night Springs', seriesName:'Alan Wake', type:'DLC', genre:'Psikolojik Korku, Gerilim, Hikaye Odaklı, DLC', releaseDate:'08.06.2024', score:8.4, cover:'/assets/alan-wake-night-springs.png', covers:['/assets/alan-wake-night-springs.png','https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2756330/header.jpg','https://cdn.cloudflare.steamstatic.com/steam/apps/2756330/header.jpg']},
  {keys:['alan wake ii the lake house','alan wake 2 the lake house','the lake house'], title:'Alan Wake II: The Lake House', seriesName:'Alan Wake', type:'DLC', genre:'Psikolojik Korku, Gerilim, Hikaye Odaklı, DLC', releaseDate:'22.10.2024', score:8.3, cover:'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2756340/header.jpg', covers:['https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2756340/header.jpg','https://cdn.cloudflare.steamstatic.com/steam/apps/2756340/header.jpg']},
  {keys:['alan wake remastered dlc the writer','alan wake the writer','the writer'], title:'Alan Wake: The Writer', seriesName:'Alan Wake', type:'DLC', genre:'Aksiyon-macera, Psikolojik Korku, Hikaye Odaklı, DLC', releaseDate:'12.10.2010', score:8.1, cover:'https://static.wikia.nocookie.net/alanwake/images/9/9d/The_Writer_title_card.jpg', covers:['https://static.wikia.nocookie.net/alanwake/images/9/9d/The_Writer_title_card.jpg','https://static.wikia.nocookie.net/alanwake/images/f/f8/The_Writer_DLC.jpg']},
  {keys:['alan wake remastered dlc the signal','alan wake the signal','the signal'], title:'Alan Wake: The Signal', seriesName:'Alan Wake', type:'DLC', genre:'Aksiyon-macera, Psikolojik Korku, Hikaye Odaklı, DLC', releaseDate:'27.07.2010', score:8.0, cover:'https://static.wikia.nocookie.net/alanwake/images/1/14/The_Signal_title_card.jpg', covers:['https://static.wikia.nocookie.net/alanwake/images/1/14/The_Signal_title_card.jpg','https://static.wikia.nocookie.net/alanwake/images/8/80/The_Signal_DLC.jpg']},
  {keys:['alan wakes american nightmare','alan wake american nightmare','american nightmare'], title:"Alan Wake's American Nightmare", seriesName:'Alan Wake', type:'Oyun', genre:'Aksiyon, Psikolojik Korku, Gerilim, Hikaye Odaklı', releaseDate:'22.02.2012', score:7.8, cover:'https://cdn.akamai.steamstatic.com/steam/apps/202750/header.jpg', covers:['https://cdn.akamai.steamstatic.com/steam/apps/202750/header.jpg','https://cdn.akamai.steamstatic.com/steam/apps/202750/capsule_616x353.jpg']},
  {keys:['alan wake remastered'], title:'Alan Wake Remastered', seriesName:'Alan Wake', type:'Oyun', genre:'Aksiyon-macera, Psikolojik Korku, Hikaye Odaklı', releaseDate:'05.10.2021', score:8.0, cover:'https://cdn.akamai.steamstatic.com/steam/apps/108710/header.jpg', covers:['https://cdn.akamai.steamstatic.com/steam/apps/108710/header.jpg','https://media.rawg.io/media/games/053/0531fbe64d90d7a97acb88ba8f340cb9.jpg']},
  {keys:['alan wake 2','alan wake ii'], title:'Alan Wake 2', seriesName:'Alan Wake', type:'Oyun', genre:'Hayatta Kalma Korku, Psikolojik Gerilim, Hikaye Odaklı', releaseDate:'27.10.2023', score:9.1, cover:'https://media.rawg.io/media/games/599/5999f254b9a7facb3147a28d956a163e.jpg', covers:['https://media.rawg.io/media/games/599/5999f254b9a7facb3147a28d956a163e.jpg']},
  {keys:['alan wake'], title:'Alan Wake', seriesName:'Alan Wake', type:'Oyun', genre:'Aksiyon-macera, Psikolojik Korku, Hikaye Odaklı', releaseDate:'14.05.2010', score:8.2, cover:'https://cdn.akamai.steamstatic.com/steam/apps/108710/header.jpg', covers:['https://cdn.akamai.steamstatic.com/steam/apps/108710/header.jpg','https://cdn.akamai.steamstatic.com/steam/apps/108710/capsule_616x353.jpg']},
  {keys:['a way out'], title:'A Way Out', seriesName:'A Way Out', type:'Oyun', genre:'Aksiyon-macera, Co-op, Hikaye Odaklı, Sinematik, Kaçış', releaseDate:'23.03.2018', score:8.2, cover:'https://cdn.akamai.steamstatic.com/steam/apps/1222700/header.jpg', covers:['https://cdn.akamai.steamstatic.com/steam/apps/1222700/header.jpg']},
  {keys:['a plague tale innocence'], title:'A Plague Tale: Innocence', seriesName:'A Plague Tale', type:'Oyun', genre:'Macera, Aksiyon, Gizlilik, Hikaye Odaklı', releaseDate:'14.05.2019', score:8.3, cover:'https://cdn.akamai.steamstatic.com/steam/apps/752590/header.jpg', covers:['https://cdn.akamai.steamstatic.com/steam/apps/752590/header.jpg']},
  {keys:['a plague tale requiem'], title:'A Plague Tale: Requiem', seriesName:'A Plague Tale', type:'Oyun', genre:'Macera, Aksiyon, Gizlilik, Hikaye Odaklı', releaseDate:'18.10.2022', score:8.6, cover:'https://cdn.akamai.steamstatic.com/steam/apps/1182900/header.jpg', covers:['https://cdn.akamai.steamstatic.com/steam/apps/1182900/header.jpg']}
];
function ho240f42MatchCatalog(query=''){
  const q = ho240f42Norm(query);
  if(!q) return null;
  let best = null;
  let score = 0;
  for(const row of HO240F42_EXACT_CATALOG){
    for(const key of row.keys || []){
      const k = ho240f42Norm(key);
      let s = 0;
      if(q === k) s = 100;
      else if(q.includes(k) || k.includes(q)) s = Math.min(96, 68 + Math.min(q.length,k.length));
      else {
        const words = k.split(' ').filter(w=>w.length>2);
        const hit = words.filter(w=>q.includes(w)).length;
        s = words.length ? Math.round((hit/words.length)*72) : 0;
      }
      if(s > score){ score = s; best = row; }
    }
  }
  return best && score >= 60 ? { ...best, matchScore:score } : null;
}
function ho240f42CatalogCandidates(query=''){
  const q = ho240f42Norm(query);
  if(!q) return [];
  const rows = [];
  const exact = ho240f42MatchCatalog(query);
  const shouldShowAlanWakeFamily = q.includes('alan wake') || q.includes('night springs') || q.includes('lake house') || q.includes('writer') || q.includes('signal') || q.includes('american nightmare');
  const pool = shouldShowAlanWakeFamily ? HO240F42_EXACT_CATALOG.filter(r=>String(r.seriesName||'')==='Alan Wake') : (exact ? [exact] : HO240F42_EXACT_CATALOG);
  for(const row of pool){
    const baseScore = exact && row.title === exact.title ? 100 : (String(row.seriesName||'')==='Alan Wake' && shouldShowAlanWakeFamily ? 86 : 68);
    (row.covers || [row.cover]).filter(Boolean).forEach((cover, index)=>rows.push({
      ...row,
      title:row.title,
      requestedTitle:String(query || '').trim(),
      released:row.releaseDate,
      releaseDate:row.releaseDate,
      cover,
      exact: exact?.title === row.title,
      source:`FIX42 yerel kesin katalog${row.type ? ' • ' + row.type : ''}${index ? ' • alternatif' : ''}`,
      matchScore: Math.max(50, baseScore-index),
      description: localTurkishStory(row.title, row.genre)
    }));
  }
  return rows;
}
async function ho240f42WebReleaseDate(query=''){
  const q = `${query} game release date`;
  try{
    const response = await fetch(`https://www.bing.com/search?q=${encodeURIComponent(q)}&setlang=en-US`, { headers:{ 'User-Agent':'Mozilla/5.0 Hayatimiz-Oyun-FIX42' } });
    if(!response.ok) return '';
    const html = await response.text();
    const text = stripHtml(html).replace(/\s+/g,' ');
    const month = '(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)';
    const patterns = [
      new RegExp(`${month}\\s+([0-9]{1,2}),?\\s+([0-9]{4})`, 'i'),
      new RegExp(`([0-9]{1,2})\\s+${month}\\s+([0-9]{4})`, 'i'),
      /([0-9]{4})[-/.]([0-9]{1,2})[-/.]([0-9]{1,2})/
    ];
    for(const rx of patterns){
      const m = text.match(rx);
      if(m){
        const raw = m[0];
        const d = ho240f42Date(raw);
        if(d) return d;
      }
    }
  }catch{}
  return '';
}
function ho240f42PickDateFromCandidates(candidates=[]){
  for(const c of candidates || []){
    const d = ho240f42Date(c?.releaseDate || c?.released || c?.release_date || '');
    if(d) return d;
  }
  return '';
}
function ho240f42MergeApiCandidates(list=[]){
  const seen = new Set();
  return (Array.isArray(list) ? list : []).map(c=>({
    ...c,
    releaseDate:ho240f42Date(c?.releaseDate || c?.released || c?.release_date || ''),
    released:ho240f42Date(c?.releaseDate || c?.released || c?.release_date || ''),
    cover:String(c?.cover || c?.cover_url || '').trim()
  })).filter(c=>{
    if(!c.cover && !c.releaseDate && !c.genre) return false;
    const key = `${ho240f42Norm(c.title || '')}|${c.releaseDate}|${String(c.cover||'').toLowerCase().replace(/\?.*$/,'')}`;
    if(seen.has(key)) return false;
    seen.add(key);
    return true;
  }).sort((a,b)=>Number(b.matchScore||0)-Number(a.matchScore||0)).slice(0,140);
}
async function ho240f42ResolveReleaseDate(title=''){
  const local = ho240f42CatalogCandidates(title);
  let date = ho240f42PickDateFromCandidates(local);
  if(date) return { releaseDate:date, released:date, source:'FIX42 yerel kesin katalog', candidates:local };
  const steam = typeof ho240f41SteamCandidates === 'function' ? await ho240f41SteamCandidates(title).catch(()=>[]) : [];
  date = ho240f42PickDateFromCandidates(steam);
  if(date) return { releaseDate:date, released:date, source:'Steam Store', candidates:ho240f42MergeApiCandidates([...local, ...steam]) };
  const rawg = await fetchRawgMeta(title).catch(()=>null);
  date = ho240f42PickDateFromCandidates([rawg, ...(rawg?.candidates || [])]);
  if(date) return { releaseDate:date, released:date, source:'RAWG', candidates:ho240f42MergeApiCandidates([...local, ...(rawg?.candidates || [])]) };
  const webDate = await ho240f42WebReleaseDate(title).catch(()=> '');
  if(webDate) return { releaseDate:webDate, released:webDate, source:'İnternet tarih araması', candidates:ho240f42MergeApiCandidates([...local, ...(rawg?.candidates || [])]) };
  return { releaseDate:'', released:'', source:'Bulunamadı', candidates:ho240f42MergeApiCandidates([...local, ...(rawg?.candidates || [])]) };
}
async function ho240f42BuildGameMeta(title=''){
  const requestedTitle = String(title || '').trim();
  const local = ho240f42CatalogCandidates(requestedTitle);
  const rawg = await fetchRawgMeta(requestedTitle).catch(()=>null);
  const steam = typeof ho240f41SteamCandidates === 'function' ? await ho240f41SteamCandidates(requestedTitle).catch(()=>[]) : [];
  const web = typeof ho240f37BingImageCandidates === 'function' ? await ho240f37BingImageCandidates(requestedTitle).catch(()=>[]) : [];
  const candidates = ho240f42MergeApiCandidates([...local, ...(rawg?.candidates || []), rawg, ...steam, ...web]);
  const releaseInfo = await ho240f42ResolveReleaseDate(requestedTitle).catch(()=>({ releaseDate:'' }));
  const best = local[0] || candidates[0] || localGameMeta(requestedTitle) || {};
  const releaseDate = ho240f42Date(releaseInfo.releaseDate || best.releaseDate || best.released || rawg?.releaseDate || rawg?.released || '');
  const genre = best.genre || rawg?.genre || candidates.find(c=>c.genre)?.genre || 'Genel, Hikaye Odaklı';
  const meta = {
    ...best,
    title:requestedTitle,
    requestedTitle,
    seriesName:best.seriesName || best.series_name || '',
    genre,
    tags:genre,
    releaseDate,
    released:releaseDate,
    score:best.score || rawg?.score || 8.5,
    cover:best.cover || candidates.find(c=>c.cover)?.cover || '',
    description:localTurkishStory(requestedTitle, genre),
    exact:Boolean(best.exact || local.length),
    source:releaseInfo.source || best.source || 'FIX42 profesyonel meta'
  };
  return { ok:true, meta, candidates, source:meta.source };
}
try{
  const ho240f42PrevLocalGameMeta = localGameMeta;
  localGameMeta = function(title){
    const row = ho240f42MatchCatalog(title);
    if(row){
      return { ...row, title:String(title || row.title).trim(), requestedTitle:String(title || '').trim(), released:row.releaseDate, releaseDate:row.releaseDate, exact:true, description:localTurkishStory(String(title || row.title), row.genre) };
    }
    const prev = ho240f42PrevLocalGameMeta(title) || {};
    return { ...prev, title:String(title || prev.title || '').trim() || prev.title };
  };
}catch(error){ console.warn('FIX42 API localGameMeta override kurulamadı:', error); }
try{
  const ho240f42PrevFetchRawgMeta = fetchRawgMeta;
  fetchRawgMeta = async function(title){
    const requestedTitle = String(title || '').trim();
    const local = ho240f42CatalogCandidates(requestedTitle);
    const prev = await ho240f42PrevFetchRawgMeta(requestedTitle).catch(()=>null);
    const candidates = ho240f42MergeApiCandidates([...local, ...(prev?.candidates || []), prev]);
    if(candidates.length){
      const best = local[0] || candidates[0];
      const releaseDate = ho240f42Date(best.releaseDate || best.released || prev?.releaseDate || prev?.released || '');
      return { ...(prev || {}), ...best, title:requestedTitle, requestedTitle, releaseDate, released:releaseDate, genre:best.genre || prev?.genre || 'Genel, Hikaye Odaklı', candidates, cover:best.cover || prev?.cover || '' };
    }
    return prev;
  };
}catch(error){ console.warn('FIX42 API fetchRawgMeta override kurulamadı:', error); }

/* FIX55 API: v2.4.1 kesin tarih kataloğu, Avatar DLC tarih düzeltmesi */
const HO240F55_API_VERSION = 'v2.4.1 FIX 55';
function ho240f55ApiNorm(value=''){
  return String(value || '').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’'`]/g,'').replace(/[^a-z0-9ğüşöçıİĞÜŞÖÇ]+/gi,' ').replace(/\s+/g,' ').trim();
}
const HO240F55_API_CATALOG = [
  {keys:['avatar frontiers of pandora dlc the sky breaker','avatar frontiers pandora sky breaker','the sky breaker','sky breaker avatar'], title:'Avatar: Frontiers of Pandora DLC: The Sky Breaker', seriesName:'Avatar', type:'DLC', genre:'Aksiyon-macera, Açık Dünya, Hikaye Odaklı, DLC', releaseDate:'16.07.2024', released:'16.07.2024', score:8.1, cover:'https://cdn.akamai.steamstatic.com/steam/apps/2840500/header.jpg', covers:['https://cdn.akamai.steamstatic.com/steam/apps/2840500/header.jpg','https://cdn.cloudflare.steamstatic.com/steam/apps/2840500/header.jpg'], exact:true},
  {keys:['avatar frontiers of pandora dlc secrets of the spires','avatar frontiers pandora secrets of the spires','secrets of the spires','secret of the spires'], title:'Avatar: Frontiers of Pandora DLC: Secrets of the Spires', seriesName:'Avatar', type:'DLC', genre:'Aksiyon-macera, Açık Dünya, Hikaye Odaklı, DLC', releaseDate:'28.11.2024', released:'28.11.2024', score:8.1, cover:'https://cdn.akamai.steamstatic.com/steam/apps/2840501/header.jpg', covers:['https://cdn.akamai.steamstatic.com/steam/apps/2840501/header.jpg','https://cdn.cloudflare.steamstatic.com/steam/apps/2840501/header.jpg'], exact:true},
  {keys:['avatar frontiers of pandora','frontiers of pandora avatar'], title:'Avatar: Frontiers of Pandora', seriesName:'Avatar', type:'Oyun', genre:'Aksiyon-macera, Açık Dünya, FPS, Keşif, Hikaye Odaklı', releaseDate:'07.12.2023', released:'07.12.2023', score:8.5, cover:'https://cdn.akamai.steamstatic.com/steam/apps/2840770/header.jpg', covers:['https://cdn.akamai.steamstatic.com/steam/apps/2840770/header.jpg','https://cdn.cloudflare.steamstatic.com/steam/apps/2840770/header.jpg'], exact:true}
];
function ho240f55ApiCatalogHit(title=''){
  const q = ho240f55ApiNorm(title);
  if(!q) return null;
  for(const row of HO240F55_API_CATALOG){
    for(const key of row.keys || []){
      const k = ho240f55ApiNorm(key);
      if(q === k || q.includes(k) || k.includes(q)) return { ...row, source:'FIX55 kesin tarih kataloğu' };
    }
  }
  return null;
}
try{
  if(typeof HO240F42_EXACT_CATALOG !== 'undefined' && Array.isArray(HO240F42_EXACT_CATALOG)){
    HO240F42_EXACT_CATALOG.unshift(...HO240F55_API_CATALOG.map(row=>({
      keys:row.keys,
      title:row.title,
      seriesName:row.seriesName,
      type:row.type,
      genre:row.genre,
      releaseDate:row.releaseDate,
      score:row.score,
      cover:row.cover,
      covers:row.covers
    })));
  }
}catch(error){ console.warn('FIX55 API catalog unshift atlandı:', error); }
try{
  const __ho240f55PrevApiResolve = typeof ho240f42ResolveReleaseDate === 'function' ? ho240f42ResolveReleaseDate : null;
  ho240f42ResolveReleaseDate = async function(title=''){
    const hit = ho240f55ApiCatalogHit(title);
    if(hit) return { releaseDate:hit.releaseDate, released:hit.releaseDate, source:'FIX55 kesin tarih kataloğu', candidates:(hit.covers || [hit.cover]).filter(Boolean).map((cover,index)=>({ ...hit, cover, matchScore:100-index, source:index?'FIX55 kesin katalog alternatif':'FIX55 kesin katalog' })) };
    return __ho240f55PrevApiResolve ? __ho240f55PrevApiResolve(title) : { releaseDate:'', released:'', source:'Bulunamadı', candidates:[] };
  };
}catch(error){ console.warn('FIX55 API release override kurulamadı:', error); }
try{
  const __ho240f55PrevApiMeta = typeof ho240f42BuildGameMeta === 'function' ? ho240f42BuildGameMeta : null;
  ho240f42BuildGameMeta = async function(title=''){
    const hit = ho240f55ApiCatalogHit(title);
    if(hit){
      const candidates = (hit.covers || [hit.cover]).filter(Boolean).map((cover,index)=>({ ...hit, cover, released:hit.releaseDate, releaseDate:hit.releaseDate, matchScore:100-index, source:index?'FIX55 kesin katalog alternatif':'FIX55 kesin katalog' }));
      return { ok:true, source:'FIX55 kesin tarih kataloğu', meta:{ ...hit, released:hit.releaseDate, releaseDate:hit.releaseDate, description:localTurkishStory(hit.title, hit.genre) }, candidates };
    }
    return __ho240f55PrevApiMeta ? __ho240f55PrevApiMeta(title) : null;
  };
}catch(error){ console.warn('FIX55 API meta override kurulamadı:', error); }

/* FIX57 API: Assassin's Creed kesin tarih/kapak kataloğu + Google tarzı web görsel yedeği */
const HO240F57_API_VERSION = 'v2.4.1 FIX 57';
function ho240f57ApiNorm(value=''){
  return String(value || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[’'`]/g,'')
    .replace(/assassin'?s?/g,'assassins')
    .replace(/director'?s?\s*cut\s*edition/g,'directors cut edition')
    .replace(/[^a-z0-9ğüşöçıİĞÜŞÖÇ]+/gi,' ')
    .replace(/\s+/g,' ')
    .trim();
}
function ho240f57ApiStory(title='', genre='', type=''){
  const name = String(title || 'Bu oyun').trim();
  const g = String(genre || 'aksiyon-macera, hikaye odaklı').trim();
  const dlc = /dlc|expansion|ek paket/i.test(type || name) ? ' Bu kayıt ana oyundan ayrı ek paket/DLC olarak tutulur.' : '';
  return `${name}, ${g} türlerini merkeze alan ve arşivde bölüm bölüm izlenebilecek bir yapımdır.${dlc} Hikaye açıklaması spoiler kontrollü tutulur; oyunun dünyasını, ana çatışmasını, oynanış tonunu, karakter motivasyonlarını ve izleyicinin bekleyebileceği atmosferi anlatır. Kritik final olayları açık edilmez.`;
}
const HO240F57_API_EXACT = [
  {keys:['assassins creed 1','assassin creed 1','assassins creed','assassins creed directors cut edition','assassin s creed director s cut edition','assassin s creed 1'], title:"Assassin's Creed Director's Cut Edition", seriesName:"Assassin's Creed", type:'Oyun', genre:'Aksiyon-macera, açık dünya, gizlilik, tarihi kurgu, tek oyunculu', tags:'Aksiyon, Macera, Açık Dünya, Gizlilik, Tarihi Kurgu, Assassin’s Creed', releaseDate:'13.11.2007', released:'13.11.2007', score:8.3, cover:'/assets/assassins-creed-directors-cut.png', covers:['/assets/assassins-creed-directors-cut.png','https://cdn.akamai.steamstatic.com/steam/apps/15100/header.jpg','https://cdn.akamai.steamstatic.com/steam/apps/15100/capsule_616x353.jpg','https://cdn.akamai.steamstatic.com/steam/apps/15100/library_600x900.jpg','https://cdn.cloudflare.steamstatic.com/steam/apps/15100/header.jpg'], exact:true},
  {keys:['assassins creed ii','assassins creed 2','assassin creed 2'], title:"Assassin's Creed II", seriesName:"Assassin's Creed", type:'Oyun', genre:'Aksiyon-macera, açık dünya, gizlilik, tarihi kurgu', tags:'Aksiyon, Macera, Açık Dünya, Gizlilik, Tarihi Kurgu', releaseDate:'17.11.2009', released:'17.11.2009', score:9.0, cover:'https://cdn.akamai.steamstatic.com/steam/apps/33230/header.jpg', covers:['https://cdn.akamai.steamstatic.com/steam/apps/33230/header.jpg','https://cdn.akamai.steamstatic.com/steam/apps/33230/capsule_616x353.jpg'], exact:true},
  {keys:['assassins creed brotherhood','brotherhood'], title:"Assassin's Creed Brotherhood", seriesName:"Assassin's Creed", type:'Oyun', genre:'Aksiyon-macera, açık dünya, gizlilik, tarihi kurgu', tags:'Aksiyon, Macera, Açık Dünya, Gizlilik, Tarihi Kurgu', releaseDate:'16.11.2010', released:'16.11.2010', score:8.8, cover:'https://cdn.akamai.steamstatic.com/steam/apps/48190/header.jpg', covers:['https://cdn.akamai.steamstatic.com/steam/apps/48190/header.jpg'], exact:true},
  {keys:['assassins creed revelations','revelations'], title:"Assassin's Creed Revelations", seriesName:"Assassin's Creed", type:'Oyun', genre:'Aksiyon-macera, açık dünya, gizlilik, tarihi kurgu', tags:'Aksiyon, Macera, Açık Dünya, Gizlilik, Tarihi Kurgu', releaseDate:'15.11.2011', released:'15.11.2011', score:8.5, cover:'https://cdn.akamai.steamstatic.com/steam/apps/201870/header.jpg', covers:['https://cdn.akamai.steamstatic.com/steam/apps/201870/header.jpg'], exact:true},
  {keys:['assassins creed iii','assassins creed 3','ac iii'], title:"Assassin's Creed III", seriesName:"Assassin's Creed", type:'Oyun', genre:'Aksiyon-macera, açık dünya, gizlilik, tarihi kurgu', tags:'Aksiyon, Macera, Açık Dünya, Gizlilik, Tarihi Kurgu', releaseDate:'30.10.2012', released:'30.10.2012', score:8.0, cover:'https://cdn.akamai.steamstatic.com/steam/apps/208480/header.jpg', covers:['https://cdn.akamai.steamstatic.com/steam/apps/208480/header.jpg'], exact:true},
  {keys:['assassins creed iv black flag','assassins creed 4 black flag','black flag'], title:"Assassin's Creed IV: Black Flag", seriesName:"Assassin's Creed", type:'Oyun', genre:'Aksiyon-macera, açık dünya, korsan, gizlilik', tags:'Aksiyon, Macera, Açık Dünya, Korsan, Gizlilik', releaseDate:'29.10.2013', released:'29.10.2013', score:9.0, cover:'https://cdn.akamai.steamstatic.com/steam/apps/242050/header.jpg', covers:['https://cdn.akamai.steamstatic.com/steam/apps/242050/header.jpg'], exact:true},
  {keys:['assassins creed rogue','rogue'], title:"Assassin's Creed Rogue", seriesName:"Assassin's Creed", type:'Oyun', genre:'Aksiyon-macera, açık dünya, gizlilik, tarihi kurgu', tags:'Aksiyon, Macera, Açık Dünya, Gizlilik, Tarihi Kurgu', releaseDate:'11.11.2014', released:'11.11.2014', score:7.8, cover:'https://cdn.akamai.steamstatic.com/steam/apps/311560/header.jpg', covers:['https://cdn.akamai.steamstatic.com/steam/apps/311560/header.jpg'], exact:true},
  {keys:['assassins creed unity','unity'], title:"Assassin's Creed Unity", seriesName:"Assassin's Creed", type:'Oyun', genre:'Aksiyon-macera, açık dünya, gizlilik, tarihi kurgu', tags:'Aksiyon, Macera, Açık Dünya, Gizlilik, Tarihi Kurgu', releaseDate:'11.11.2014', released:'11.11.2014', score:7.6, cover:'https://cdn.akamai.steamstatic.com/steam/apps/289650/header.jpg', covers:['https://cdn.akamai.steamstatic.com/steam/apps/289650/header.jpg'], exact:true},
  {keys:['assassins creed syndicate','syndicate'], title:"Assassin's Creed Syndicate", seriesName:"Assassin's Creed", type:'Oyun', genre:'Aksiyon-macera, açık dünya, gizlilik, tarihi kurgu', tags:'Aksiyon, Macera, Açık Dünya, Gizlilik, Tarihi Kurgu', releaseDate:'23.10.2015', released:'23.10.2015', score:8.0, cover:'https://cdn.akamai.steamstatic.com/steam/apps/368500/header.jpg', covers:['https://cdn.akamai.steamstatic.com/steam/apps/368500/header.jpg'], exact:true},
  {keys:['assassins creed origins','origins'], title:"Assassin's Creed Origins", seriesName:"Assassin's Creed", type:'Oyun', genre:'Aksiyon RPG, açık dünya, tarihi kurgu, macera', tags:'Aksiyon, RPG, Açık Dünya, Tarihi Kurgu, Macera', releaseDate:'27.10.2017', released:'27.10.2017', score:8.5, cover:'https://cdn.akamai.steamstatic.com/steam/apps/582160/header.jpg', covers:['https://cdn.akamai.steamstatic.com/steam/apps/582160/header.jpg'], exact:true},
  {keys:['assassins creed odyssey','odyssey'], title:"Assassin's Creed Odyssey", seriesName:"Assassin's Creed", type:'Oyun', genre:'Aksiyon RPG, açık dünya, tarihi kurgu, macera', tags:'Aksiyon, RPG, Açık Dünya, Tarihi Kurgu, Macera', releaseDate:'05.10.2018', released:'05.10.2018', score:8.7, cover:'https://cdn.akamai.steamstatic.com/steam/apps/812140/header.jpg', covers:['https://cdn.akamai.steamstatic.com/steam/apps/812140/header.jpg'], exact:true},
  {keys:['assassins creed valhalla','valhalla'], title:"Assassin's Creed Valhalla", seriesName:"Assassin's Creed", type:'Oyun', genre:'Aksiyon RPG, açık dünya, viking, tarihi kurgu', tags:'Aksiyon, RPG, Açık Dünya, Viking, Tarihi Kurgu', releaseDate:'10.11.2020', released:'10.11.2020', score:8.3, cover:'https://cdn.akamai.steamstatic.com/steam/apps/2208920/header.jpg', covers:['https://cdn.akamai.steamstatic.com/steam/apps/2208920/header.jpg'], exact:true},
  {keys:['assassins creed mirage','mirage'], title:"Assassin's Creed Mirage", seriesName:"Assassin's Creed", type:'Oyun', genre:'Aksiyon-macera, gizlilik, tarihi kurgu, açık dünya', tags:'Aksiyon, Macera, Gizlilik, Tarihi Kurgu, Açık Dünya', releaseDate:'05.10.2023', released:'05.10.2023', score:8.1, cover:'https://cdn.akamai.steamstatic.com/steam/apps/3035570/header.jpg', covers:['https://cdn.akamai.steamstatic.com/steam/apps/3035570/header.jpg'], exact:true},
  {keys:['avatar frontiers of pandora dlc the sky breaker','the sky breaker','sky breaker avatar'], title:'Avatar: Frontiers of Pandora DLC: The Sky Breaker', seriesName:'Avatar', type:'DLC', genre:'Aksiyon-macera, açık dünya, hikaye odaklı, DLC', tags:'Aksiyon, Macera, Açık Dünya, Hikaye Odaklı, DLC, Avatar', releaseDate:'16.07.2024', released:'16.07.2024', score:8.1, cover:'https://cdn.akamai.steamstatic.com/steam/apps/2840500/header.jpg', covers:['https://cdn.akamai.steamstatic.com/steam/apps/2840500/header.jpg'], exact:true}
];
function ho240f57ApiExact(title=''){
  const n = ho240f57ApiNorm(title);
  if(!n) return null;
  const exact = HO240F57_API_EXACT.find(row => (row.keys||[]).some(key => n === ho240f57ApiNorm(key)));
  const contains = exact || HO240F57_API_EXACT.find(row => (row.keys||[]).some(key => n.includes(ho240f57ApiNorm(key)) && ho240f57ApiNorm(key).length > 5));
  return contains ? {...contains, requestedTitle:String(title||''), description:contains.description || ho240f57ApiStory(contains.title, contains.genre, contains.type), source:'FIX57 kesin tarih/kapak kataloğu'} : null;
}
function ho240f57ApiMerge(list=[]){
  const seen = new Set();
  return (Array.isArray(list)?list:[]).filter(Boolean).map(c=>({...c, cover:String(c.cover || c.cover_url || '').trim(), releaseDate:ho240f41ApiNormalizeDate(c.releaseDate || c.released || ''), released:ho240f41ApiNormalizeDate(c.released || c.releaseDate || '')})).filter(c=>{
    if(!c.cover && !c.releaseDate && !c.genre) return false;
    const key = `${ho240f57ApiNorm(c.title || '')}|${c.releaseDate}|${String(c.cover||'').toLowerCase().replace(/\?.*$/,'')}`;
    if(seen.has(key)) return false;
    seen.add(key);
    return true;
  }).sort((a,b)=>Number(b.matchScore||0)-Number(a.matchScore||0)).slice(0,140);
}
async function ho240f57GoogleLikeImageCandidates(query=''){
  const q = `${String(query||'').trim()} game cover`.trim();
  if(!q) return [];
  const urls = [];
  const headers = { 'User-Agent':'Mozilla/5.0 HayatimizOyunBot/2.4.1', 'Accept-Language':'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7' };
  const endpoints = [
    `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(q)}`,
    `https://www.bing.com/images/search?q=${encodeURIComponent(q)}`,
    `https://duckduckgo.com/html/?q=${encodeURIComponent(q + ' cover')}`
  ];
  for(const endpoint of endpoints){
    try{
      const response = await fetch(endpoint, { headers });
      if(!response.ok) continue;
      const html = await response.text();
      const patterns = [
        /"(https?:\\\/\\\/[^"<>]+?\.(?:jpg|jpeg|png|webp)[^"<>]*?)"/gi,
        /murl&quot;:&quot;(https?:\/\/[^&]+?\.(?:jpg|jpeg|png|webp)[^&]*?)&quot;/gi,
        /imgurl=(https?:%2F%2F[^&]+?\.(?:jpg|jpeg|png|webp)[^&]*)/gi,
        /src="(https?:\/\/[^"<>]+?\.(?:jpg|jpeg|png|webp)[^"<>]*?)"/gi
      ];
      for(const rx of patterns){
        let m;
        while((m = rx.exec(html)) && urls.length < 35){
          let u = String(m[1] || '').replace(/\\\//g,'/');
          try{ u = decodeURIComponent(u); }catch{}
          u = u.replace(/&amp;/g,'&');
          if(!/^https?:\/\//i.test(u)) continue;
          if(/gstatic|googlelogo|sprite|favicon|blank|pixel|data:image/i.test(u)) continue;
          urls.push(u);
        }
      }
    }catch{}
  }
  const seen = new Set();
  return urls.filter(u=>{ const k=u.toLowerCase().replace(/\?.*$/,''); if(seen.has(k)) return false; seen.add(k); return true; }).slice(0,20).map((cover,index)=>({title:String(query||'').trim(), genre:'Genel, Hikaye Odaklı', releaseDate:'', released:'', cover, score:8.5, exact:false, matchScore:70-index, source:'Google/Bing/DuckDuckGo görsel arama yedeği', description:ho240f57ApiStory(query,'Genel, Hikaye Odaklı')}));
}
try{
  const __ho240f57PrevLocal = localGameMeta;
  localGameMeta = function(title){ return ho240f57ApiExact(title) || __ho240f57PrevLocal(title); };
}catch{}
try{
  const __ho240f57PrevResolve = typeof ho240f42ResolveReleaseDate === 'function' ? ho240f42ResolveReleaseDate : null;
  ho240f42ResolveReleaseDate = async function(title){
    const exact = ho240f57ApiExact(title);
    if(exact?.releaseDate) return { releaseDate:exact.releaseDate, released:exact.releaseDate, source:'FIX57 kesin tarih kataloğu', candidates:ho240f57ApiMerge((exact.covers||[exact.cover]).filter(Boolean).map((cover,index)=>({...exact,cover,matchScore:120-index}))) };
    return __ho240f57PrevResolve ? __ho240f57PrevResolve(title) : { releaseDate:'', released:'', source:'Bulunamadı', candidates:[] };
  };
}catch{}
try{
  const __ho240f57PrevBuild = typeof ho240f42BuildGameMeta === 'function' ? ho240f42BuildGameMeta : null;
  ho240f42BuildGameMeta = async function(title){
    const requestedTitle = String(title || '').trim();
    const exact = ho240f57ApiExact(requestedTitle);
    const exactCandidates = exact ? (exact.covers || [exact.cover]).filter(Boolean).map((cover,index)=>({...exact,cover,matchScore:130-index,source:index?'FIX57 kesin katalog alternatif kapak':'FIX57 kesin katalog doğru kapak'})) : [];
    let prev = null;
    try{ prev = __ho240f57PrevBuild ? await __ho240f57PrevBuild(requestedTitle) : null; }catch{}
    let steam = [];
    try{ steam = typeof ho240f41SteamCandidates === 'function' ? await ho240f41SteamCandidates(requestedTitle) : []; }catch{}
    let google = [];
    try{ google = await ho240f57GoogleLikeImageCandidates(requestedTitle); }catch{}
    const candidates = ho240f57ApiMerge([...exactCandidates, ...(prev?.candidates||[]), ...steam, ...google]);
    const metaBase = exact || prev?.meta || localGameMeta(requestedTitle) || {};
    const releaseDate = ho240f41ApiNormalizeDate(exact?.releaseDate || metaBase.releaseDate || metaBase.released || '');
    const genre = metaBase.genre || candidates.find(c=>c.genre)?.genre || 'Genel, Hikaye Odaklı';
    const meta = {...metaBase, title:requestedTitle, requestedTitle, seriesName:metaBase.seriesName || metaBase.series_name || '', genre, tags:metaBase.tags || genre, releaseDate, released:releaseDate, cover:metaBase.cover || candidates.find(c=>c.cover)?.cover || '', description:metaBase.description || ho240f57ApiStory(requestedTitle, genre, metaBase.type), exact:Boolean(exact || metaBase.exact), source: exact ? 'FIX57 kesin tarih/kapak kataloğu' : (prev?.source || 'FIX57 genişletilmiş meta')};
    return { ok:true, meta, candidates, source:meta.source };
  };
}catch(error){ console.warn('FIX57 API build meta kurulamadı:', error); }

/* FIX58 API: Steam tarih/kapak kontrolü + güçlü playlist video çekme */
const HO240F58_API_VERSION = 'v2.4.1 FIX 58';
function ho240f58ApiNorm(value=''){
  return String(value || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[’'`]/g,'')
    .replace(/\b(the|a|an|edition|standard|deluxe|complete|directors|cut|remastered|remake|game|video)\b/g,' ')
    .replace(/assassin\s*s/g,'assassins')
    .replace(/[^a-z0-9ğüşöçıİĞÜŞÖÇ]+/gi,' ')
    .replace(/\s+/g,' ')
    .trim();
}
function ho240f58ApiDate(value=''){
  const raw = String(value || '').trim();
  if(!raw) return '';
  if(/^\d{1,2}[./-]\d{1,2}[./-]\d{4}$/.test(raw)){
    const [d,m,y] = raw.split(/[./-]/);
    return `${String(d).padStart(2,'0')}.${String(m).padStart(2,'0')}.${y}`;
  }
  const iso = raw.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if(iso) return `${iso[3].padStart(2,'0')}.${iso[2].padStart(2,'0')}.${iso[1]}`;
  const months = {
    jan:'01', january:'01', ocak:'01', oca:'01',
    feb:'02', february:'02', şubat:'02', subat:'02', şub:'02', sub:'02',
    mar:'03', march:'03', mart:'03',
    apr:'04', april:'04', nisan:'04', nis:'04',
    may:'05', mayis:'05', mayıs:'05',
    jun:'06', june:'06', haziran:'06', haz:'06',
    jul:'07', july:'07', temmuz:'07', tem:'07',
    aug:'08', august:'08', ağustos:'08', agustos:'08', ağu:'08', agu:'08',
    sep:'09', sept:'09', september:'09', eylül:'09', eylul:'09', eyl:'09',
    oct:'10', october:'10', ekim:'10', eki:'10',
    nov:'11', november:'11', kasım:'11', kasim:'11', kas:'11',
    dec:'12', december:'12', aralık:'12', aralik:'12', ara:'12'
  };
  const normalized = raw.toLocaleLowerCase('tr-TR').replace(/[,]/g,' ').replace(/\s+/g,' ').trim();
  let m = normalized.match(/(\d{1,2})\s+([a-zçğıöşüâîû]+)\s+(\d{4})/i);
  if(m){
    const month = months[m[2].normalize('NFD').replace(/[\u0300-\u036f]/g,'') ] || months[m[2]];
    if(month) return `${m[1].padStart(2,'0')}.${month}.${m[3]}`;
  }
  m = normalized.match(/([a-zçğıöşüâîû]+)\s+(\d{1,2})\s+(\d{4})/i);
  if(m){
    const month = months[m[1].normalize('NFD').replace(/[\u0300-\u036f]/g,'') ] || months[m[1]];
    if(month) return `${m[2].padStart(2,'0')}.${month}.${m[3]}`;
  }
  const y = raw.match(/\b(19|20)\d{2}\b/);
  return y ? y[0] : raw;
}
function ho240f58ApiScore(a='', b=''){
  const aa = ho240f58ApiNorm(a);
  const bb = ho240f58ApiNorm(b);
  if(!aa || !bb) return 0;
  if(aa === bb) return 100;
  if(aa.includes(bb) || bb.includes(aa)) return Math.max(82, Math.round((Math.min(aa.length, bb.length) / Math.max(aa.length, bb.length)) * 100));
  const A = new Set(aa.split(' ').filter(x=>x.length>1));
  const B = new Set(bb.split(' ').filter(x=>x.length>1));
  const inter = [...A].filter(x=>B.has(x)).length;
  const union = new Set([...A, ...B]).size || 1;
  return Math.round((inter / union) * 100);
}
function ho240f58SteamImage(appid, type='header'){
  const id = String(appid || '').trim();
  if(!id) return '';
  if(type === 'library') return `https://cdn.akamai.steamstatic.com/steam/apps/${id}/library_600x900.jpg`;
  if(type === 'capsule') return `https://cdn.akamai.steamstatic.com/steam/apps/${id}/capsule_616x353.jpg`;
  return `https://cdn.akamai.steamstatic.com/steam/apps/${id}/header.jpg`;
}
async function ho240f58SteamSearch(title=''){
  const q = String(title || '').trim();
  if(!q) return [];
  const url = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(q)}&cc=tr&l=turkish`;
  const response = await fetch(url, { headers:{ 'User-Agent':'Mozilla/5.0 HayatimizOyunBot/2.4.1', 'Accept-Language':'tr-TR,tr;q=0.9,en;q=0.8' } });
  if(!response.ok) return [];
  const data = await response.json().catch(()=>({}));
  return (data.items || []).filter(x=>x?.id).slice(0,8).map(item=>({ appid:item.id, title:item.name || '', cover:item.tiny_image || ho240f58SteamImage(item.id), matchScore:ho240f58ApiScore(q, item.name || ''), source:'Steam Store Search' }));
}
async function ho240f58SteamDetails(appid){
  const id = String(appid || '').trim();
  if(!id) return null;
  const url = `https://store.steampowered.com/api/appdetails?appids=${encodeURIComponent(id)}&cc=tr&l=turkish`;
  const response = await fetch(url, { headers:{ 'User-Agent':'Mozilla/5.0 HayatimizOyunBot/2.4.1', 'Accept-Language':'tr-TR,tr;q=0.9,en;q=0.8' } });
  if(!response.ok) return null;
  const json = await response.json().catch(()=>({}));
  const data = json?.[id]?.data;
  if(!data) return null;
  const genres = (data.genres || []).map(g=>g.description).filter(Boolean).join(', ');
  const tags = (data.categories || []).slice(0,8).map(g=>g.description).filter(Boolean).join(', ');
  const releaseDate = ho240f58ApiDate(data.release_date?.date || '');
  return {
    appid:id,
    title:data.name || '',
    releaseDate,
    released:releaseDate,
    cover:data.header_image || ho240f58SteamImage(id),
    covers:[data.header_image, ho240f58SteamImage(id,'header'), ho240f58SteamImage(id,'capsule'), ho240f58SteamImage(id,'library')].filter(Boolean),
    genre:genres || 'Genel, Hikaye Odaklı',
    tags:tags || genres || '',
    description:String(data.short_description || '').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim(),
    source:'Steam Store doğrulama'
  };
}
async function ho240f58SteamBest(title=''){
  const q = String(title || '').trim();
  const rows = await ho240f58SteamSearch(q).catch(()=>[]);
  const ranked = rows.sort((a,b)=>Number(b.matchScore||0)-Number(a.matchScore||0)).slice(0,5);
  const checked = [];
  for(const row of ranked){
    let detail = null;
    try{ detail = await ho240f58SteamDetails(row.appid); }catch{}
    const merged = { ...row, ...(detail || {}), matchScore:ho240f58ApiScore(q, detail?.title || row.title || ''), source:detail ? 'Steam Store doğrulama' : row.source };
    checked.push(merged);
  }
  return checked.sort((a,b)=>Number(b.matchScore||0)-Number(a.matchScore||0))[0] || null;
}
function ho240f58ExtractYtInitialData(html=''){
  const text = String(html || '');
  const markerIndex = text.indexOf('ytInitialData');
  if(markerIndex < 0) return null;
  const start = text.indexOf('{', markerIndex);
  if(start < 0) return null;
  let depth = 0, inString = false, quote = '', escape = false;
  for(let i=start; i<text.length; i++){
    const ch = text[i];
    if(inString){
      if(escape){ escape = false; continue; }
      if(ch === '\\'){ escape = true; continue; }
      if(ch === quote){ inString = false; quote = ''; }
      continue;
    }
    if(ch === '"' || ch === "'"){ inString = true; quote = ch; continue; }
    if(ch === '{') depth++;
    if(ch === '}'){
      depth--;
      if(depth === 0){
        try{ return JSON.parse(text.slice(start, i+1)); }catch{return null;}
      }
    }
  }
  return null;
}
function ho240f58WalkPlaylistJson(node, rows=[]){
  if(!node || rows.length > 700) return rows;
  if(Array.isArray(node)){
    node.forEach(child=>ho240f58WalkPlaylistJson(child, rows));
    return rows;
  }
  if(typeof node !== 'object') return rows;
  const p = node.playlistVideoRenderer || node.reelItemRenderer || null;
  if(p?.videoId){
    const title = p.title?.simpleText || p.title?.runs?.map(r=>r.text).join('') || p.accessibility?.accessibilityData?.label || '';
    const thumbs = p.thumbnail?.thumbnails || p.thumbnailOverlays?.[0]?.thumbnail?.thumbnails || [];
    const thumbnail = thumbs?.length ? thumbs[thumbs.length-1].url : `https://i.ytimg.com/vi/${p.videoId}/mqdefault.jpg`;
    rows.push({ videoId:p.videoId, title, thumbnail });
  }
  if(node.videoId && (node.title || node.thumbnail)){
    const title = node.title?.simpleText || node.title?.runs?.map(r=>r.text).join('') || '';
    const thumbs = node.thumbnail?.thumbnails || [];
    rows.push({ videoId:node.videoId, title, thumbnail:thumbs?.length ? thumbs[thumbs.length-1].url : `https://i.ytimg.com/vi/${node.videoId}/mqdefault.jpg` });
  }
  for(const key of Object.keys(node)) ho240f58WalkPlaylistJson(node[key], rows);
  return rows;
}
try{
  const __ho240f58PrevNoKey = typeof fetchYoutubePlaylistItemsNoKey === 'function' ? fetchYoutubePlaylistItemsNoKey : null;
  fetchYoutubePlaylistItemsNoKey = async function(playlistUrl){
    const playlistId = extractYoutubePlaylistId(playlistUrl);
    if(!playlistId) return { count:0, episodes:[] };
    const mergedRows = [];
    try{
      const prev = __ho240f58PrevNoKey ? await __ho240f58PrevNoKey(playlistUrl) : { episodes:[] };
      (prev.episodes || []).forEach(ep=>mergedRows.push({ videoId:ep.videoId, title:ep.title, thumbnail:ep.thumbnail }));
    }catch{}
    try{
      const url = `https://www.youtube.com/playlist?list=${encodeURIComponent(playlistId)}&disable_polymer=false`;
      const response = await fetch(url, { headers:{ 'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) HayatimizOyunBot/2.4.1', 'Accept-Language':'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7' } });
      const html = response.ok ? await response.text() : '';
      const data = ho240f58ExtractYtInitialData(html);
      ho240f58WalkPlaylistJson(data, mergedRows);
      const ids = [...html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)].map(m=>m[1]);
      for(const videoId of ids) mergedRows.push({ videoId, title:`${mergedRows.length+1}. Bölüm`, thumbnail:`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg` });
    }catch{}
    const episodes = uniqueEpisodes(mergedRows).slice(0,700);
    return { count:episodes.length, episodes, source:'FIX58 güçlü YouTube playlist taraması' };
  };
}catch(error){ console.warn('FIX58 playlist no-key override kurulamadı:', error); }
try{
  const __ho240f58PrevItems = typeof fetchYoutubePlaylistItems === 'function' ? fetchYoutubePlaylistItems : null;
  fetchYoutubePlaylistItems = async function(playlistUrl){
    let official = { count:0, episodes:[] };
    try{ official = __ho240f58PrevItems ? await __ho240f58PrevItems(playlistUrl) : official; }catch{}
    let strong = { count:0, episodes:[] };
    try{ strong = await fetchYoutubePlaylistItemsNoKey(playlistUrl); }catch{}
    const rows = [...(official.episodes || []), ...(strong.episodes || [])].map(ep=>({ videoId:ep.videoId, title:ep.title, thumbnail:ep.thumbnail }));
    const episodes = uniqueEpisodes(rows).slice(0,700);
    return { count:Math.max(Number(official.count||0), Number(strong.count||0), episodes.length), episodes, source:'FIX58 resmi API + güçlü HTML yedeği' };
  };
}catch(error){ console.warn('FIX58 playlist items override kurulamadı:', error); }
try{
  const __ho240f58PrevResolve = typeof ho240f42ResolveReleaseDate === 'function' ? ho240f42ResolveReleaseDate : null;
  ho240f42ResolveReleaseDate = async function(title=''){
    const steam = await ho240f58SteamBest(title).catch(()=>null);
    if(steam?.releaseDate && Number(steam.matchScore || 0) >= 70){
      return { releaseDate:steam.releaseDate, released:steam.releaseDate, source:'FIX58 Steam doğrulama', steam, candidates:(steam.covers || [steam.cover]).filter(Boolean).map((cover,index)=>({ ...steam, cover, matchScore:Number(steam.matchScore||0)-index })) };
    }
    return __ho240f58PrevResolve ? __ho240f58PrevResolve(title) : { releaseDate:'', released:'', source:'Bulunamadı', candidates:[] };
  };
}catch(error){ console.warn('FIX58 tarih override kurulamadı:', error); }
try{
  const __ho240f58PrevBuild = typeof ho240f42BuildGameMeta === 'function' ? ho240f42BuildGameMeta : null;
  ho240f42BuildGameMeta = async function(title=''){
    const requestedTitle = String(title || '').trim();
    let prev = null;
    try{ prev = __ho240f58PrevBuild ? await __ho240f58PrevBuild(requestedTitle) : null; }catch{}
    const steam = await ho240f58SteamBest(requestedTitle).catch(()=>null);
    const steamCandidates = steam && Number(steam.matchScore || 0) >= 60 ? (steam.covers || [steam.cover]).filter(Boolean).map((cover,index)=>({ ...steam, cover, title:steam.title || requestedTitle, matchScore:Number(steam.matchScore||0)-index, source:index?'Steam alternatif kapak':'Steam doğrulama' })) : [];
    const prevCandidates = prev?.candidates || [];
    const candidates = ho240f57ApiMerge ? ho240f57ApiMerge([...steamCandidates, ...prevCandidates]) : [...steamCandidates, ...prevCandidates];
    const useSteam = steam && Number(steam.matchScore || 0) >= 70;
    const base = prev?.meta || localGameMeta(requestedTitle) || {};
    const releaseDate = ho240f58ApiDate((useSteam && steam.releaseDate) || base.releaseDate || base.released || '');
    const cover = (useSteam && steam.cover) || base.cover || candidates.find(c=>c.cover)?.cover || '';
    const genre = (useSteam && steam.genre) || base.genre || candidates.find(c=>c.genre)?.genre || 'Genel, Hikaye Odaklı';
    return { ok:true, source:useSteam?'FIX58 Steam doğrulama':(prev?.source || 'FIX58 genişletilmiş meta'), meta:{ ...base, title:requestedTitle, requestedTitle, releaseDate, released:releaseDate, cover, genre, tags:base.tags || steam?.tags || genre, description:base.description || steam?.description || ho240f57ApiStory(requestedTitle, genre), steamCheck:steam || null }, candidates };
  };
}catch(error){ console.warn('FIX58 meta override kurulamadı:', error); }

/* v2.4.1 FIX63 - Playlist çekme sadece formdaki gerçek playlist listesine kilitlendi */
function ho240f63StrictPlaylistId(playlistUrl=''){
  const id = extractYoutubePlaylistId(String(playlistUrl || ''));
  if(!id) return '';
  return id.replace(/[^a-zA-Z0-9_-]/g,'');
}
function ho240f63SlicePlaylistHtml(html=''){
  const text = String(html || '');
  const markers = ['playlistVideoListRenderer','playlistVideoRenderer'];
  let start = -1;
  for(const marker of markers){ const i = text.indexOf(marker); if(i >= 0){ start = i; break; } }
  if(start < 0) return text;
  const endMarkers = ['continuationItemRenderer','secondaryResults','watchNextSecondaryResults'];
  let end = text.length;
  for(const marker of endMarkers){ const i = text.indexOf(marker, start + 1); if(i > start && i < end) end = i; }
  return text.slice(start, end);
}
try{
  fetchYoutubePlaylistItemsNoKey = async function(playlistUrl){
    const playlistId = ho240f63StrictPlaylistId(playlistUrl);
    if(!playlistId) return { count:0, episodes:[], source:'FIX63: playlist linki yok' };
    const url = `https://www.youtube.com/playlist?list=${encodeURIComponent(playlistId)}`;
    const response = await fetch(url, { headers:{ 'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) HayatimizOyunBot/2.4.1 FIX63', 'Accept-Language':'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7' } });
    if(!response.ok) return { count:0, episodes:[], source:'FIX63: playlist HTML okunamadı' };
    const html = await response.text();
    const scoped = ho240f63SlicePlaylistHtml(html);
    const rows = [];
    const blocks = scoped.split('playlistVideoRenderer');
    for(const block of blocks){
      const videoId = (block.match(/"videoId":"([a-zA-Z0-9_-]{11})"/) || [])[1];
      if(!videoId) continue;
      const simple = block.match(/"title":\{"simpleText":"([^"]+)"\}/);
      const runs = block.match(/"title":\{"runs":\[\{"text":"([^"]+)"\}\]/);
      const title = cleanYoutubeTitle((simple && simple[1]) || (runs && runs[1]) || '');
      rows.push({ videoId, title:title || `${rows.length+1}. Bölüm`, thumbnail:`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg` });
    }
    const episodes = uniqueEpisodes(rows).slice(0,700).map((ep,i)=>({ ...ep, number:i+1 }));
    return { count:episodes.length, episodes, source:'FIX63 sıkı playlist HTML taraması', playlistId };
  };
  fetchYoutubePlaylistItems = async function(playlistUrl){
    const playlistId = ho240f63StrictPlaylistId(playlistUrl);
    if(!playlistId) return { count:0, episodes:[], source:'FIX63: sadece playlist URL kabul edilir' };
    const key = process.env.YOUTUBE_API_KEY || '';
    let official = { count:0, episodes:[] };
    if(key){
      const rows = [];
      let pageToken = '';
      for(let page=0; page<20; page++){
        const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${encodeURIComponent(playlistId)}&key=${encodeURIComponent(key)}${pageToken?`&pageToken=${encodeURIComponent(pageToken)}`:''}`;
        const response = await fetch(url);
        if(!response.ok) break;
        const data = await response.json();
        (data.items || []).forEach((item)=>{
          const sn = item.snippet || {};
          const videoId = item.contentDetails?.videoId || sn.resourceId?.videoId || '';
          rows.push({ videoId, title:sn.title || '', thumbnail:sn.thumbnails?.medium?.url || sn.thumbnails?.default?.url || `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg` });
        });
        pageToken = data.nextPageToken || '';
        if(!pageToken) break;
      }
      const episodes = uniqueEpisodes(rows).slice(0,700).map((ep,i)=>({ ...ep, number:i+1 }));
      official = { count:episodes.length, episodes };
    }
    if(official.episodes?.length) return { ...official, source:'FIX63 resmi YouTube playlist API', playlistId };
    return await fetchYoutubePlaylistItemsNoKey(`https://www.youtube.com/playlist?list=${playlistId}`);
  };
}catch(error){ console.warn('FIX63 playlist kaynak kilidi kurulamadı:', error); }


/* v2.4.3 - API hikaye açıklaması iyileştirmesi */
function ho243ApiNorm(value=''){
  return String(value || '').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9ğüşöçıİĞÜŞÖÇ]+/gi,' ').replace(/\s+/g,' ').trim();
}
function ho243ApiStory(title='', genre='', type=''){
  const name = String(title || 'Bu oyun').trim() || 'Bu oyun';
  const key = ho243ApiNorm(`${name} ${genre} ${type}`);
  const isDlc = /dlc|ek paket|expansion|night springs|lake house|the writer|the signal/i.test(`${name} ${type}`);
  if(key.includes('plague tale innocence') || (key.includes('plague') && key.includes('innocence'))){
    return `${name}, salgın ve savaşla parçalanmış Orta Çağ Fransa’sında Amicia ile küçük kardeşi Hugo’nun hayatta kalma yolculuğunu anlatır. Hikâye, iki kardeşin hem kendilerini avlayan güçlerden kaçmasını hem de Hugo’nun taşıdığı gizemli rahatsızlığın ardındaki sırrı anlamaya çalışmasını merkezine alır. Oyuncu, karanlık köylerden yıkılmış şehirlere uzanan bu yolculukta korku, çaresizlik, aile bağı ve fedakârlık duygusunu spoiler vermeden takip eder.`;
  }
  if(key.includes('plague tale requiem') || (key.includes('plague') && key.includes('requiem'))){
    return `${name}, Amicia ve Hugo’nun huzurlu bir hayat ararken yeniden karanlık bir tehdidin içine sürüklenmesini anlatır. Hikâye, aile bağının, umudun ve çaresizliğin daha ağır bir sınava dönüşmesini işler; final sürprizlerini açık etmeden karakterlerin neyi korumaya çalıştığını anlatır.`;
  }
  if(key.includes('a way out') || key.includes('way out')) return `${name}, hapishanede yolları kesişen Leo ve Vincent’ın kaçış planıyla başlayan; güven, ortak hedef ve geçmişle yüzleşme üzerine kurulu iki kişilik bir hikâye anlatır.`;
  if(key.includes('alan wake')) return `${name}, yazdığı hikâyelerle gerçeklik arasındaki çizgi bulanıklaşan Alan Wake’in karanlık olaylar içindeki psikolojik gerilimini anlatır.${isDlc ? ' Bu içerik ana hikâyenin çevresindeki ek olayları ayrı kayıt olarak takip eder.' : ''}`;
  if(key.includes('assassin')) return `${name}, kişisel kayıplar, adalet arayışı ve gizli örgütlerin çatışması üzerinden ilerleyen tarihi bir hikâye anlatır. Ana karakter, yaşadığı dünyanın baskısı ve ihanetleriyle yüzleşirken daha büyük bir düzenin parçası olduğunu fark eder.`;
  if(key.includes('resident')) return `${name}, biyolojik tehditlerin ve kapalı alan geriliminin ortasında hayatta kalmaya çalışan karakterlerin hikâyesini anlatır. Oyuncu, olayların arkasındaki sırrı parça parça çözer.`;
  return `${name}, oyuncuyu kendi dünyasının çatışmaları, karakter hedefleri ve bölüm bölüm gelişen olayları üzerinden takip edilen bir hikâyeye davet eder. Açıklama; türleri listelemek yerine karakterlerin ne istediğini, karşılarına neyin çıktığını ve izleyicinin nasıl bir atmosfer beklemesi gerektiğini spoiler vermeden anlatır.`;
}
try{ localTurkishStory = ho243ApiStory; }catch{}
try{ ho240f57ApiStory = ho243ApiStory; }catch{}


/* v2.4.4 - Epic Games / Ubisoft kaynak kontrol yardımcıları */
function ho244ApiStoreSearch(title, source='epic'){
  const q = encodeURIComponent(String(title || '').trim());
  const store = String(source || '').toLowerCase();
  if(store === 'ubisoft') return { source:'Ubisoft', searchUrl:`https://www.ubisoft.com/tr-tr/search?search=${q}`, icon:'https://www.google.com/s2/favicons?sz=64&domain_url=ubisoft.com' };
  if(store === 'steam') return { source:'Steam', searchUrl:`https://store.steampowered.com/search/?term=${q}`, icon:'https://www.google.com/s2/favicons?sz=64&domain_url=store.steampowered.com' };
  return { source:'Epic Games', searchUrl:`https://store.epicgames.com/tr/browse?q=${q}&sortBy=relevancy&sortDir=DESC&count=40`, icon:'https://www.google.com/s2/favicons?sz=64&domain_url=store.epicgames.com' };
}
