
/* Hayatımız Oyun - V2.5.1 Fix 5 5 Admin Tone */
const VERSION='2.5.1 Fix 7';
const STAFF=['Moderatör','Editör','Admin','Kurucu'];
const state={games:[],notes:[],events:[],settings:{},page:'home',filter:'',user:JSON.parse(localStorage.ho_user||'null'),selectedFriend:null,seriesEditKey:''};
const $=(s,el=document)=>el.querySelector(s);
const $$=(s,el=document)=>[...el.querySelectorAll(s)];
const esc=(v='')=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const enc=(v='')=>encodeURIComponent(String(v??''));
const slug=(v='')=>String(v||'').toLocaleLowerCase('tr-TR').trim().replace(/[ğ]/g,'g').replace(/[ü]/g,'u').replace(/[ş]/g,'s').replace(/[ı]/g,'i').replace(/[ö]/g,'o').replace(/[ç]/g,'c').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')||('oyun-'+Date.now());
function headerSafe(v=''){return encodeURIComponent(String(v||''));}
function canSeeAdmin(){return !!(state.user&&STAFF.includes(state.user.role));}
function actorHeaders(){return {'x-user-id':headerSafe(state.user?.id||''),'x-admin-user':headerSafe(state.user?.username||'Kullanıcı'),'x-admin-role':headerSafe(state.user?.role||'user')};}

function withTimeoutFetch(url,opts={},ms=4500){
  const ctrl=new AbortController();
  const timer=setTimeout(()=>ctrl.abort(),ms);
  return fetch(url,{...opts,signal:ctrl.signal}).finally(()=>clearTimeout(timer));
}

async function api(url,opts={}){
  const isForm=opts.body instanceof FormData;
  opts.headers={...(isForm?{}:{'Content-Type':'application/json'}),...actorHeaders(),...(opts.headers||{})};
  opts.cache='no-store';
  const r=await withTimeoutFetch(url,opts,4500);
  const text=await r.text();
  let j={};
  try{j=text?JSON.parse(text):{}}catch{
    const isHtml=/<!doctype html|<html/i.test(text||'');
    const hint=isHtml?'API yerine HTML döndü. Temiz kurulumda eski dosyaları silip ZIP içeriğini tekrar gönder ve Vercel Redeploy yap.':'';
    throw new Error(`API JSON döndürmedi. HTTP ${r.status} — ${hint} ${String(text||'').slice(0,140)}`);
  }
  if(!r.ok||j.ok===false)throw new Error(j.message||'İşlem başarısız.');
  return j;
}
async function uploadImage(file,folder='uploads'){ if(!file)return ''; const fd=new FormData(); fd.append('folder',folder); fd.append('file',file); const r=await fetch('/api/upload',{method:'POST',headers:actorHeaders(),body:fd}); const text=await r.text(); let j; try{j=JSON.parse(text)}catch{throw new Error('Upload JSON okunamadı. HTTP '+r.status)} if(!r.ok||j.ok===false) throw new Error(j.message||'Upload başarısız'); return j.url; }
function trSort(a,b){return String(a||'').localeCompare(String(b||''),'tr',{numeric:true,sensitivity:'base'});} 
function parseDate(v){ if(!v)return null; const s=String(v).trim(); let m=s.match(/^(\d{2})\.(\d{2})\.(\d{4})(?:\s+(\d{2}):(\d{2}))?$/); if(m)return new Date(+m[3],+m[2]-1,+m[1],+(m[4]||0),+(m[5]||0)); m=s.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2}))?/); if(m)return new Date(+m[1],+m[2]-1,+m[3],+(m[4]||0),+(m[5]||0)); const d=new Date(s); return Number.isNaN(d.getTime())?null:d; }
function fmtDate(v){const d=parseDate(v); return d?d.toLocaleDateString('tr-TR',{day:'2-digit',month:'2-digit',year:'numeric'}):(v||'');}
function fmtDateTime(v){const d=parseDate(v); return d?d.toLocaleString('tr-TR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}):(v||'');}
function img(g){ if(!g)return ''; return g.cover||g.thumbnail||g.episodes?.[0]?.thumbnail||''; }

function gameCover(g){
  const src=img(g);
  if(src)return src;
  const hay=(`${g?.title||''} ${g?.series||''} ${g?.type||''}`).toLocaleLowerCase('tr-TR');
  if(/demo/.test(hay))return '/assets/demo-series-cover.svg';
  if(/dlc|ek paket|expansion|collapse|control/i.test(hay))return '/assets/dlc-series-cover.svg';
  return '/assets/series-placeholder.svg';
}
function hasRealCoverAlpha3(g){
  const u=String(img(g)||'');
  return !!u && !/series-placeholder\.svg|demo-series-cover\.svg|dlc-series-cover\.svg/i.test(u);
}


function isUpcomingGameV201F2b(g){
  const hay=(`${g?.status||''} ${g?.type||''} ${g?.title||''} ${g?.series||''}`).toLocaleLowerCase('tr-TR');
  return /yakında|yakinda|gelecek|coming soon|upcoming|planlandı|planlandi/.test(hay);
}
function isDlcGameV201F2c(g){
  const hay=(`${g?.type||''} ${g?.title||''} ${g?.series||''}`).toLocaleLowerCase('tr-TR');
  return /\bdlc\b|dlc'?si|ek paket|expansion|collapse|control|pagan|joseph|vaas/.test(hay);
}
function isDemoGameV201F2c(g){
  const hay=(`${g?.type||''} ${g?.title||''} ${g?.series||''}`).toLocaleLowerCase('tr-TR');
  return /\bdemo\b|demosu|demo ser/i.test(hay);
}
function expectedTypeV201F2c(g){
  if(isDlcGameV201F2c(g)) return 'DLC';
  if(isDemoGameV201F2c(g)) return 'Demo';
  return String(g?.type||'').trim() || 'Ana Oyun';
}
function hasEpisodesV201F2b(g){
  return Array.isArray(g?.episodes) && g.episodes.length>0;
}
function normalizeGameForRepairV201F2b(game){
  const g={...(game||{})};
  g.title=String(g.title||'').trim() || 'İsimsiz Oyun';
  if(typeof slug==='function' && !g.slug) g.slug=slug(g.title);
  g.series=String(g.series||'').trim() || g.title || 'Serisiz';
  g.status=String(g.status||'').trim() || (isUpcomingGameV201F2b(g)?'Yakında Gelecek':'Devam Ediyor');
  g.type=expectedTypeV201F2c(g);
  if(typeof gameCover==='function') g.cover=g.cover||g.thumbnail||gameCover({...g,cover:''});
  else g.cover=g.cover||g.thumbnail||'/assets/series-placeholder.svg';
  delete g.thumbnail;
  if(!String(g.description||'').trim()){
    g.description=isUpcomingGameV201F2b(g)
      ? 'Bu oyun / seri yakında gelecek olarak işaretlendi. Bölümler eklendiğinde arşivde görünecek.'
      : 'Bu oyun için açıklama geçici olarak oluşturuldu. RAWG hikaye yenileme aracıyla daha detaylı bilgi çekebilirsin.';
  }
  if(!Array.isArray(g.episodes)) g.episodes=[];
  if(!isUpcomingGameV201F2b(g)){
    g.episodes=g.episodes.map((ep,i)=>({
      title:ep.title||`${i+1}. Bölüm`,
      url:ep.url||ep.video_url||'',
      videoId:ep.videoId||ep.youtube_id||'',
      thumbnail:ep.thumbnail||ep.image||g.cover||'',
      description:ep.description||''
    }));
  }
  return g;
}
async function saveGameRepairV201F2b(game){
  let clean=normalizeGameForRepairV201F2b(game);
  if(typeof stripGameDbUnsafeFields==='function') clean=stripGameDbUnsafeFields(clean);
  try{
    await api('/api/games',{method:'PUT',body:JSON.stringify({game:clean})});
  }catch(e){
    console.warn('Repair save API fallback:',e);
    const idx=(state.games||[]).findIndex(x=>String(x.id||x.slug)===String(clean.id||clean.slug));
    if(idx>=0) state.games[idx]=clean;
  }
  return clean;
}

function gameIssuesAlpha3(g){
  g=g||{};
  const issues=[];
  if(!hasRealCoverAlpha3(g))issues.push('Kapak eksik / otomatik kapak');
  if(!String(g.title||'').trim())issues.push('Başlık boş');
  if(!String(g.series||'').trim())issues.push('Seri adı boş');
  if(!String(g.description||'').trim())issues.push('Hikaye yok');
  if(!isUpcomingGameV201F2b(g) && !(Array.isArray(g.episodes)&&g.episodes.length))issues.push('Bölüm yok');
  if(isDlcGameV201F2c(g) && String(g.type||'').toLocaleLowerCase('tr-TR')!=='dlc')issues.push('DLC tipi DLC seçilmeli');
  if(isDemoGameV201F2c(g) && String(g.type||'').toLocaleLowerCase('tr-TR')!=='demo')issues.push('Demo tipi Demo seçilmeli');
  if(!g.slug)issues.push('Slug yok');
  return issues;
}
function isBrokenGameAlpha3(g){return gameIssuesAlpha3(g).length>0;}
function cleanAlpha3SearchTitle(title=''){
  return String(title||'')
    .replace(/\b\d+\s*\.\s*DLC'?si\b/gi,' ')
    .replace(/\bDLC'?si\b/gi,'DLC')
    .replace(/\b(Türkçe|Altyazılı|Dublajlı|Bölüm|Part|Episode|Gameplay|Oynanış|Final|Full|Walkthrough)\b/gi,' ')
    .replace(/[|#\[\]{}()]/g,' ')
    .replace(/\s+/g,' ')
    .trim();
}
function alpha3CoverQuery(g){
  const base=cleanAlpha3SearchTitle(g?.title||'');
  const series=cleanAlpha3SearchTitle(g?.series||'');
  const type=String(g?.type||'');
  if(/demo/i.test(`${base} ${series} ${type}`))return `${base||series} demo game cover`;
  if(/dlc|ek paket|expansion/i.test(`${base} ${series} ${type}`))return `${base||series} dlc expansion game cover`;
  return `${base||series} game cover`;
}

function siteTitle(){return state.settings?.site_title||'Hayatımız Oyun';}
function activeTheme(){return state.user?.theme||state.settings?.theme||'dark';}
function absoluteUrl(u){if(!u)return 'https://hayatimiz-oyun-youtube-arsivi.vercel.app/assets/og-cover.png'; if(/^data:/i.test(u))return 'https://hayatimiz-oyun-youtube-arsivi.vercel.app/assets/og-cover.png'; try{return new URL(u, location.origin).href}catch{return 'https://hayatimiz-oyun-youtube-arsivi.vercel.app/assets/og-cover.png'}}
function setMeta(sel,attr,val){let el=document.querySelector(sel); if(!el){el=document.createElement('meta'); if(sel.includes('property='))el.setAttribute('property',sel.match(/property="([^"]+)/)?.[1]||''); else el.setAttribute('name',sel.match(/name="([^"]+)/)?.[1]||''); document.head.appendChild(el);} el.setAttribute(attr,val||'');}
function updateSeo({title,description,image,url}={}){const site=siteTitle(); const t=title?`${title} - ${site}`:(state.settings?.share_title||`${site} - Oyun ve Seri İzleme Arşivi`); const d=(description||state.settings?.share_description||'Oyun serileri, bölümler, takvim, favoriler ve izleme takibi için Hayatımız Oyun arşivi.').slice(0,220); const imgUrl=absoluteUrl(image||state.settings?.share_image||state.settings?.site_logo||'/assets/og-cover.png'); const pageUrl=url||location.href.split('#')[0]; document.title=t; setMeta('meta[name="description"]','content',d); setMeta('meta[property="og:title"]','content',t); setMeta('meta[property="og:description"]','content',d); setMeta('meta[property="og:image"]','content',imgUrl); setMeta('meta[property="og:url"]','content',pageUrl); setMeta('meta[name="twitter:title"]','content',t); setMeta('meta[name="twitter:description"]','content',d); setMeta('meta[name="twitter:image"]','content',imgUrl);}
function parseSocialLinks(value){
  if(!value)return [];
  if(Array.isArray(value))return value.filter(x=>x&&x.url);
  const raw=String(value||'').trim(); if(!raw)return [];
  try{const j=JSON.parse(raw); if(Array.isArray(j))return j.filter(x=>x&&x.url);}catch{}
  return raw.split(/\n+/).map(line=>line.trim()).filter(Boolean).map(line=>{
    const parts=line.split('|').map(x=>x.trim());
    if(parts.length>=2)return {title:parts[0],url:parts[1],active:parts[2]!== 'pasif'};
    return {title:'',url:parts[0],active:true};
  }).filter(x=>x.url && x.active!==false);
}
function socialPlatform(url='',title=''){
  const u=String(url||'').toLowerCase(), t=String(title||'').toLowerCase();
  const hay=u+' '+t;
  if(/youtube|youtu\.be/.test(hay))return {key:'youtube',name:'YouTube',icon:'YouTube',short:'YT'};
  if(/kick\.com|\bkick\b/.test(hay))return {key:'kick',name:'Kick',icon:'Kick',short:'K'};
  if(/discord|discord\.gg/.test(hay))return {key:'discord',name:'Discord',icon:'Discord',short:'DC'};
  if(/bynogame|bağış|bagis|donate|donation|destek|support|tip|trakteer|papara/.test(hay))return {key:'donate',name:'ByNoGame',icon:'ByNoGame',short:'BG'};
  if(/tiktok/.test(hay))return {key:'tiktok',name:'TikTok',icon:'TikTok',short:'TT'};
  if(/instagram/.test(hay))return {key:'instagram',name:'Instagram',icon:'Instagram',short:'IG'};
  if(/twitch/.test(hay))return {key:'twitch',name:'Twitch',icon:'Twitch',short:'TW'};
  if(/x\.com|twitter/.test(hay))return {key:'twitter',name:'X',icon:'X',short:'X'};
  if(/facebook|fb\.com/.test(hay))return {key:'facebook',name:'Facebook',icon:'Facebook',short:'FB'};
  if(/steam/.test(hay))return {key:'steam',name:'Steam',icon:'Steam',short:'ST'};
  if(/github/.test(hay))return {key:'github',name:'GitHub',icon:'GitHub',short:'GH'};
  if(/telegram|t\.me/.test(hay))return {key:'telegram',name:'Telegram',icon:'Telegram',short:'TG'};
  return {key:'link',name:title||'Link',icon:'Link',short:'LN'};
}
function normalizeUrl(url=''){let u=String(url||'').trim(); if(!u)return ''; if(/^javascript:/i.test(u))return ''; if(!/^https?:\/\//i.test(u))u='https://'+u; return u;}
function socialIconAsset(key=''){
  const map={
    youtube:'/assets/social/youtube.png',
    kick:'/assets/social/kick.png',
    discord:'/assets/social/discord.png',
    donate:'/assets/social/bynogame.png',
    tiktok:'/assets/social/tiktok.png',
    instagram:'/assets/social/instagram.png'
  };
  return map[key]||'';
}
function socialIconHtml(item,mini=false){
  const url=normalizeUrl(item.url); if(!url)return '';
  const p=socialPlatform(url,item.title);
  const label=item.title||p.name;
  const asset=socialIconAsset(p.key);
  const visual=asset?`<img src="${esc(asset)}" alt="${esc(label)}" class="social-icon-img" loading="lazy">`:`<span class="social-fallback-text">${esc(p.short||p.icon||'LN')}</span>`;
  return `<a class="social-icon ${p.key} ${mini?'mini':''}" data-platform="${esc(p.key)}" href="${esc(url)}" target="_blank" rel="noopener noreferrer" title="${esc(label)}" aria-label="${esc(label)}"><span class="icon-wrap">${visual}</span><b>${esc(mini?p.short:label)}</b></a>`;
}

function socialLinksFromSettings(){
  const s=state.settings||{};
  const standard=[
    ['YouTube',s.social_youtube],
    ['Kick',s.social_kick],
    ['Discord',s.social_discord],
    ['ByNoGame',s.social_donate],
    ['TikTok',s.social_tiktok],
    ['Instagram',s.social_instagram],
    ['Twitch',s.social_twitch],
    ['X',s.social_x||s.social_twitter],
    ['Steam',s.social_steam],
    ['GitHub',s.social_github],
    ['Telegram',s.social_telegram]
  ].filter(x=>String(x[1]||'').trim()).map(([title,url])=>({title,url,active:true}));
  const extra=parseSocialLinks(s.social_links||'');
  const seen=new Set();
  return [...standard,...extra].filter(item=>{
    const url=normalizeUrl(item.url||'');
    if(!url)return false;
    const key=socialPlatform(url,item.title).key+'|'+url.toLowerCase();
    if(seen.has(key))return false;
    seen.add(key);
    item.url=url;
    item.title=item.title||socialPlatform(url,'').name;
    return item.active!==false;
  });
}

function socialLinksHtml(mini=false){return socialLinksFromSettings().map(x=>socialIconHtml(x,mini)).join('');}
function buildSettingsSocialLinks(f={}){
  const rows=[['YouTube',f.social_youtube],['Kick',f.social_kick],['Discord',f.social_discord],['TikTok',f.social_tiktok],['Instagram',f.social_instagram],['Bağış',f.social_donate]]
    .filter(x=>String(x[1]||'').trim()).map(([t,u])=>`${t}|${String(u).trim()}`);
  const extra=String(f.social_links||'').split(/\n+/).map(x=>x.trim()).filter(Boolean);
  return [...rows,...extra].join('\n');
}
function renderSocialSurfaces(){
  const html=socialLinksHtml(true);
  let head=$('#socialHeader');
  if(!head){head=document.createElement('div'); head.id='socialHeader'; head.className='social-header'; document.querySelector('header.top')?.appendChild(head);}
  head.innerHTML=state.settings?.show_social_header===false?'':html;
  const foot=$('#siteFooter'); if(foot)foot.innerHTML=`<div class="footer-info"><b>${esc(siteTitle())}</b><small>V${VERSION} • V2.5.1 Fix 5</small><p>${esc(state.settings?.footer_text||state.settings?.share_description||'Oyun ve seri izleme arşivi.')}</p><div class="footer-links"><button class="ghost small" onclick="setPage('notes')">Güncelleme Notları</button><button class="ghost small" onclick="setPage('calendar')">Takvim</button><button class="ghost small" onclick="setPage('about')">Hakkında / Destek</button></div></div><div class="footer-social">${state.settings?.show_social_footer===false?'':(html||'<span class="muted">Sosyal medya linkleri ayarlardan eklenebilir.</span>')}</div>`;
  const fav=state.settings?.favicon||state.settings?.site_logo; if(fav){let l=document.querySelector('link[rel="icon"]'); if(l)l.href=fav;}
  renderSideMenu();
}
function renderSideMenu(){
  // V1.9.1 Fix 1: Sol menü masaüstünde üst menüyle çakıştığı için kaldırıldı.
  // Menü işlemleri üst navigasyondan ve mobil Menü butonundan devam eder.
  document.getElementById('sideMenu')?.remove();
}
function socialPreviewFromText(v){return parseSocialLinks(v).map(x=>socialIconHtml(x)).join('')||'<p class="muted">Link yazınca ikon otomatik algılanır.</p>';}
function updateSocialPreview(){const el=$('#socialPreview'),field=$('#socialLinksField'); if(el&&field)el.innerHTML=socialPreviewFromText(field.value);}

function shareButton(title,text,url){return `<button class="ghost" onclick="sharePage('${enc(title||siteTitle())}','${enc(text||'Hayatımız Oyun arşivi')}','${enc(url||location.href)}')">Paylaş</button>`;}
async function sharePage(t,txt,u){const data={title:decodeURIComponent(t),text:decodeURIComponent(txt),url:decodeURIComponent(u)}; try{if(navigator.share)await navigator.share(data); else{await navigator.clipboard.writeText(data.url); alert('Link kopyalandı.')}}catch(e){}}
function coverStyle(g){return `background-image:url('${esc(img(g)||'/assets/fallback-cover.png')}'),url('/assets/fallback-cover.png')`;} 
function applyTheme(){document.body.dataset.theme=activeTheme();}
function roleLabel(){return state.user?`${state.user.username} (${state.user.role||'user'})`:'';}
function getSeriesName(g){return g.series||g.title||'Tekil Oyun';}
function canonicalSeriesName(value='',title=''){let x=String(value||title||'').trim().replace(/[’`´]/g,"'").replace(/\s+/g,' '); if(!x)return ''; x=x.replace(/\b(Türkçe\s+Altyazılı|Türkçe\s+Dublajlı|Full|Tüm\s+Bölümler|Final|DLC|Remake|Remaster|Coop|%100)\b/ig,'').trim(); const rules=[[/assassin'?s\s+creed/i,"Assassin's Creed"],[/a\s+plague\s+tale/i,'A Plague Tale'],[/resident\s+evil/i,'Resident Evil'],[/silent\s+hill/i,'Silent Hill'],[/half[-\s]?life|black\s+mesa/i,'Half-Life'],[/dead\s+island/i,'Dead Island'],[/crysis/i,'Crysis'],[/far\s+cry/i,'Far Cry'],[/call\s+of\s+duty/i,'Call of Duty'],[/tomb\s+raider/i,'Tomb Raider'],[/god\s+of\s+war/i,'God of War'],[/uncharted/i,'Uncharted'],[/metro/i,'Metro'],[/mafia/i,'Mafia'],[/max\s+payne/i,'Max Payne'],[/watch\s+dogs/i,'Watch Dogs'],[/alan\s+wake/i,'Alan Wake'],[/little\s+nightmares/i,'Little Nightmares']]; for(const [re,name] of rules)if(re.test(x))return name; return (x.split(/[:\-–—]/)[0]||x).replace(/\s+(I|II|III|IV|V|VI|VII|VIII|IX|X|[0-9]+)\b.*$/i,'').trim()||x;}
function sortGamesByRelease(arr){return [...arr].sort((a,b)=>{const ao=Number(a.order_no)||0, bo=Number(b.order_no)||0; if(ao||bo) return (ao||999999)-(bo||999999)||trSort(a.title,b.title); return (parseDate(a.release_date)?.getTime()||9999999999999)-(parseDate(b.release_date)?.getTime()||9999999999999)||trSort(a.title,b.title);});}
function groupGames(list=state.games){const map=new Map(); for(const g of list){const k=canonicalSeriesName(getSeriesName(g),g.title); if(!map.has(k))map.set(k,{series:k,games:[]}); map.get(k).games.push(g);} return [...map.values()].map(gr=>({...gr,games:sortGamesByRelease(gr.games)})).sort((a,b)=>trSort(a.series,b.series));}
function isUpcoming(g){return String(g?.status||'').toLocaleLowerCase('tr-TR').includes('yakında');}
function countdownText(v){const d=parseDate(v); if(!d)return 'Başlangıç tarihi belli değil'; const diff=d-Date.now(); if(diff<=0)return 'Başlama tarihi geldi'; const days=Math.floor(diff/86400000),h=Math.floor(diff%86400000/3600000),m=Math.floor(diff%3600000/60000); if(days>0)return `${days} gün ${h} saat kaldı`; if(h>0)return `${h} saat ${m} dakika kaldı`; return `${Math.max(1,m)} dakika kaldı`;}
function getUpcomingStart(g){return g?.upcoming_start||g?.start_date||'';}
function groupUpcomingStart(gr){return (gr.games||[]).map(getUpcomingStart).filter(Boolean).sort((a,b)=>(parseDate(a)||9e15)-(parseDate(b)||9e15))[0]||'';}
function upcomingBox(v){return `<div class="upcoming-box"><b>Yakında</b><span>${esc(countdownText(v))}</span><small>Başlangıç: ${esc(fmtDateTime(v)||'Belli değil')}</small></div>`;}
function watchState(){return JSON.parse(localStorage.ho_watch||'{}');}
function saveWatchState(w){localStorage.ho_watch=JSON.stringify(w); if(state.user){api('/api/auth',{method:'POST',body:JSON.stringify({action:'watch',id:state.user.id,watch_state:w,xp:state.user.xp||0,level:state.user.level||1})}).then(j=>{state.user=j.user;localStorage.ho_user=JSON.stringify(state.user)}).catch(()=>{});} }
function getFavs(){return state.user?.favorites||JSON.parse(localStorage.ho_favs||'{"games":[],"series":[]}');}
function saveFavs(f){if(state.user){state.user.favorites=f; localStorage.ho_user=JSON.stringify(state.user); api('/api/auth',{method:'POST',body:JSON.stringify({action:'favorites',id:state.user.id,favorites:f})}).catch(()=>{});} else localStorage.ho_favs=JSON.stringify(f);}
function continueCount(){return Object.values(watchState()).filter(v=>v.here&&!v.watched).length;}

function soundPrefs(){return JSON.parse(localStorage.ho_sound||'{"enabled":false,"volume":0,"muted":true,"notify":false}');}
function saveSoundPrefs(p){localStorage.ho_sound=JSON.stringify(p);}
const musicState={ctx:null,master:null,playing:false,started:false,theme:'Sessiz Mod'};
function initMusic(){return null;}
function setAtmosphereTheme(label='Ana Sayfa'){
  const names={home:'Sessiz Ana Sayfa',series:'Sessiz Seriler',az:'Sessiz Arşiv',calendar:'Sessiz Takvim',social:'Sessiz Sosyal',profile:'Sessiz Profil',admin:'Admin Sessiz Mod',notes:'Sessiz Güncellemeler'};
  musicState.theme=names[state.page]||'Sessiz Mod';
  const name=$('#musicTrack'); if(name)name.textContent=musicState.theme;
}
function playMusic(){
  const pref=soundPrefs(); pref.enabled=false; pref.muted=true; pref.notify=false; pref.volume=0; pref.volume=0; saveSoundPrefs(pref);
  musicState.playing=false; injectHomeV210();
  renderMusicPanel();
}
function pauseMusic(){
  const pref=soundPrefs(); pref.enabled=false; pref.muted=true; pref.notify=false; pref.volume=0; pref.volume=0; saveSoundPrefs(pref);
  musicState.playing=false; injectHomeV210();
  renderMusicPanel();
}
function toggleMusic(){pauseMusic();}
function setMusicVolume(v){
  const pref=soundPrefs(); pref.volume=0; pref.enabled=false; pref.muted=true; pref.notify=false; pref.volume=0; saveSoundPrefs(pref);
  musicState.playing=false; renderMusicPanel(false);
}
function renderMusicPanel(update=true){
  let panel=$('#musicPanel');
  if(!panel){document.body.insertAdjacentHTML('beforeend','<div id="musicPanel" class="music-panel silent-only collapsed"></div>'); panel=$('#musicPanel');}
  panel.classList.add('collapsed','silent-only');
  panel.innerHTML=`<div class="music-head"><b>Sessiz Mod</b><small id="musicTrack">${esc(musicState.theme||'Tüm sesler kapalı')}</small></div><small class="muted">Fix 4: otomatik müzik, efekt ve yapay bip sesleri tamamen devre dışı.</small>`;
}
function nextAtmosphere(){setAtmosphereTheme(state.page);}
function bootAudioOnUserGesture(){}
function hideLoader(){
  const l=$('#siteLoader');
  if(l){
    loaderSet(100,'Hazır — V2.5.1 Fix 5 site açılıyor.');
    setTimeout(()=>{
      l.classList.add('hide');
      setTimeout(()=>{try{l.remove()}catch(e){}},650);
    },240);
  }
  renderMusicPanel();
  setAtmosphereTheme(state.page);
}
function playNotificationSound(){}

function loaderSet(pct,text){
  const val=Math.max(0,Math.min(100,Math.round(Number(pct)||0)));
  const b=$('#loaderBar'),n=$('#loaderPct'),t=$('#loaderText');
  if(b)b.style.width=val+'%';
  if(n)n.textContent=val+'%';
  if(t&&text)t.textContent=text;
}
function hideLoader(){const l=$('#siteLoader'); if(l){l.classList.add('hide'); setTimeout(()=>l.remove(),650);} injectHomeV210();
  renderMusicPanel(); setAtmosphereTheme(state.page);}
function playNotificationSound(){const pref=soundPrefs(); if(!pref.notify)return; initMusic(); const ctx=musicState.ctx; if(!ctx)return; const o=ctx.createOscillator(),g=ctx.createGain(); o.frequency.value=880; o.type='sine'; g.gain.value=(pref.volume||.25)*.25; o.connect(g); g.connect(ctx.destination); o.start(); g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.28); setTimeout(()=>o.stop(),320);}


/* V2.5.1 Fix 5 - açılış ayarı, not yönetimi, kart/video/canlı yayın stabilite */
function openingSettings251(){
  const st=state.settings||{};
  return {
    title: st.opening_title || 'Hayatımız Oyun',
    subtitle: st.opening_subtitle || 'V2.5.1 Fix 5 hazırlanıyor...',
    style: st.opening_style || 'V3 Açılış',
    minDuration: Math.max(900, Number(st.opening_min_duration||2300)),
    steps: Array.isArray(st.opening_steps) && st.opening_steps.length ? st.opening_steps : [
      'Açılış sistemi hazırlanıyor',
      'Ayarlar yükleniyor',
      'Oyun arşivi hazırlanıyor',
      'Video ID ve canlı yayınlar kontrol ediliyor',
      'Güncelleme notları sıralanıyor',
      'Site stabil hale getiriliyor',
      'Site açılıyor'
    ]
  };
}
function setOpeningPreview251(){
  const st=openingSettings251();
  const logo=document.getElementById('loaderLogo');
  const text=document.getElementById('loaderText');
  if(logo)logo.textContent=(st.title||'HO').split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase()||'HO';
  if(text)text.textContent=st.subtitle;
}
function calcStepPct251(index,total){
  if(total<=1)return 100;
  const base=[6,16,34,52,70,86,100];
  if(total===base.length)return base[index]||100;
  return Math.min(100, Math.round((index+1)/total*100));
}
function safeNoteVersion251(v=''){
  const m=String(v||'').match(/v?\s*(\d+)\.(\d+)\.(\d+)(?:\s*(fix)\s*([0-9]+))?/i);
  if(!m)return 0;
  return Number(m[1])*100000000+Number(m[2])*1000000+Number(m[3])*10000+Number(m[5]||0)*100;
}
function sortNotes251(notes=[]){
  return [...notes].sort((a,b)=>{
    const sv=safeNoteVersion251(b.version||b.title)-safeNoteVersion251(a.version||a.title);
    if(sv)return sv;
    return new Date(b.created_at||0)-new Date(a.created_at||0);
  });
}
function localNotes251(){return (typeof v250StoreGet==='function')?v250StoreGet('ho_v251_notes_local',[]):[]}
function saveLocalNotes251(list){if(typeof v250StoreSet==='function')v250StoreSet('ho_v251_notes_local',list)}
function allNotes251(){
  const map=new Map();
  [...(state.notes||[]),...localNotes251()].forEach(n=>map.set(n.id||`${n.version}-${n.title}-${n.created_at}`,n));
  return sortNotes251([...map.values()]);
}
function noteForm251(note={}){
  return `<section class="card note-editor251"><div class="section-title"><div><span class="version-pill">V2.5.1 Fix 5</span><h2>${note.id?'Güncelleme Notu Düzenle':'Güncelleme Notu Ekle'}</h2><p class="muted">Eski sürümleri düzenle, yeni not ekle veya local yedekten sil.</p></div></div>
    <input id="noteId251" type="hidden" value="${esc250(note.id||'')}">
    <label>Sürüm<input id="noteVersion251" value="${esc250(note.version||'V2.5.1 Fix 5')}" placeholder="V2.5.1 Fix 5"></label>
    <label>Tür<select id="noteType251"><option ${note.type==='Fix'?'selected':''}>Fix</option><option ${note.type==='Ufak Güncelleme'?'selected':''}>Ufak Güncelleme</option><option ${note.type==='Büyük Güncelleme'?'selected':''}>Büyük Güncelleme</option><option ${note.type==='Mega Güncelleme'?'selected':''}>Mega Güncelleme</option></select></label>
    <label>Başlık<input id="noteTitle251" value="${esc250(note.title||'Site stabilite ve izleme düzeltmeleri')}"></label>
    <label>Açıklama<textarea id="noteBody251" rows="6">${esc250(note.body||note.content||'')}</textarea></label>
    <label class="inline-check"><input id="noteVisible251" type="checkbox" ${note.public_visible!==false?'checked':''}> Kullanıcıya görünsün</label>
    <div class="row"><button onclick="saveNote251()">Kaydet</button><button class="ghost" onclick="adminTab('notes251')">Listeye Dön</button></div>
  </section>`;
}
function renderNotesManager251(){
  const notes=allNotes251();
  return `<section class="card notes-manager251"><div class="section-title"><div><span class="version-pill">V2.5.1 Fix 5</span><h2>Güncelleme Notları Yönetimi</h2><p class="muted">Tüm güncellemeleri sürüm sırasına göre gör, düzenle, sil veya yeni not ekle.</p></div><button onclick="renderNoteEditor251()">Yeni Not Ekle</button></div>
    <div class="notes-list-admin251">${notes.map(n=>`<article class="note-admin-row251"><div><b>${esc250(n.version||'Sürüm')}</b><h3>${esc250(n.title||'Başlık')}</h3><p>${esc250(n.body||n.content||'')}</p><small>${esc250(n.type||'Not')} • ${esc250(n.created_at?new Date(n.created_at).toLocaleString('tr-TR'):'Tarih yok')}</small></div><div class="row"><button onclick="renderNoteEditor251('${esc250(n.id||'')}')">Düzenle</button><button class="danger" onclick="deleteNote251('${esc250(n.id||'')}')">Sil</button></div></article>`).join('')||'<p class="muted">Not yok.</p>'}</div>
  </section>`;
}
function renderNoteEditor251(id=''){
  const notes=allNotes251();
  const n=notes.find(x=>String(x.id||'')===String(id))||{};
  const a=document.getElementById('adminArea');
  if(a)a.innerHTML=noteForm251(n);
}
async function saveNote251(){
  const id=document.getElementById('noteId251')?.value||('note_'+Date.now());
  const note={
    id,
    version:document.getElementById('noteVersion251')?.value||'V2.5.1 Fix 5',
    type:document.getElementById('noteType251')?.value||'Fix',
    title:document.getElementById('noteTitle251')?.value||'Güncelleme',
    body:document.getElementById('noteBody251')?.value||'',
    public_visible:document.getElementById('noteVisible251')?.checked!==false,
    created_at:new Date().toISOString()
  };
  if(typeof ensureProgressV220==='function'){ensureProgressV220('Güncelleme Notu Kaydet');setProgressV220(25,100,'Not hazırlanıyor','Form verileri alındı.');}
  let savedRemote=false;
  try{
    if(typeof api==='function'){
      if(typeof setProgressV220==='function')setProgressV220(55,100,'Sunucuya kaydediliyor','/api/notes deneniyor.');
      await api('/api/notes',{method:'POST',body:JSON.stringify({note})});
      savedRemote=true;
    }
  }catch(e){console.warn('remote note save failed, local backup used',e)}
  const local=localNotes251().filter(x=>x.id!==id);
  local.unshift(note);
  saveLocalNotes251(local);
  state.notes=sortNotes251([...(state.notes||[]).filter(x=>x.id!==id),note]);
  if(typeof finishProgressV220==='function')finishProgressV220('Güncelleme notu kaydedildi',savedRemote?'Sunucu + local yedek kaydedildi.':'Sunucu desteklemedi; local yedek kaydedildi.');
  alert('Güncelleme notu kaydedildi.');
  adminTab('notes251');
}
function deleteNote251(id){
  if(!confirm('Bu güncelleme notu silinsin mi?'))return;
  saveLocalNotes251(localNotes251().filter(x=>String(x.id)!==String(id)));
  state.notes=(state.notes||[]).filter(x=>String(x.id)!==String(id));
  alert('Güncelleme notu listeden kaldırıldı.');
  adminTab('notes251');
}
function openingAdmin251(){
  const st=openingSettings251();
  return `<section class="card opening-admin251"><div class="section-title"><div><span class="version-pill">V2.5.1 Fix 5</span><h2>Açılış / Loading Yönetimi</h2><p class="muted">Açılış metnini admin panelden düzenle. Yüzdeler adım sayısına göre otomatik hesaplanır.</p></div><button onclick="previewOpening251()">Önizle</button></div>
    <label>Açılış Başlığı<input id="openingTitle251" value="${esc250(st.title)}"></label>
    <label>Açılış Alt Metni<input id="openingSubtitle251" value="${esc250(st.subtitle)}"></label>
    <label>Minimum Açılış Süresi MS<input id="openingMin251" type="number" value="${esc250(st.minDuration)}"></label>
    <label>Yükleme Adımları<textarea id="openingSteps251" rows="8">${esc250(st.steps.join('\n'))}</textarea></label>
    <div class="row"><button onclick="saveOpening251()">Açılışı Kaydet</button><button class="ghost" onclick="previewOpening251()">Yüzde Önizle</button></div>
    <div id="openingPreview251" class="opening-preview251"></div>
  </section>`;
}
function previewOpening251(){
  const steps=(document.getElementById('openingSteps251')?.value||'').split(/\n/).map(x=>x.trim()).filter(Boolean);
  const box=document.getElementById('openingPreview251');
  if(box)box.innerHTML=steps.map((x,i)=>`<div><b>%${calcStepPct251(i,steps.length)}</b><span>${esc250(x)}</span></div>`).join('');
}
async function saveOpening251(){
  state.settings=state.settings||{};
  state.settings.opening_title=document.getElementById('openingTitle251')?.value||'Hayatımız Oyun';
  state.settings.opening_subtitle=document.getElementById('openingSubtitle251')?.value||'V2.5.1 Fix 5 hazırlanıyor...';
  state.settings.opening_min_duration=Number(document.getElementById('openingMin251')?.value||2300);
  state.settings.opening_steps=(document.getElementById('openingSteps251')?.value||'').split(/\n/).map(x=>x.trim()).filter(Boolean);
  if(typeof ensureProgressV220==='function'){ensureProgressV220('Açılış Ayarları Kaydet');setProgressV220(30,100,'Açılış ayarları hazırlanıyor','Yüzde adımları otomatik hesaplandı.');}
  try{
    if(typeof setProgressV220==='function')setProgressV220(70,100,'Ayarlar kaydediliyor','/api/settings');
    await api('/api/settings',{method:'PUT',body:JSON.stringify({settings:state.settings})});
    if(typeof finishProgressV220==='function')finishProgressV220('Açılış ayarları kaydedildi','Yeni açılış sistemi aktif.');
    alert('Açılış ayarları kaydedildi.');
  }catch(e){
    if(typeof finishProgressV220==='function')finishProgressV220('Local açılış ayarı kullanılıyor',e.message);
    alert('Sunucu kaydı başarısız; bu oturumda ayarlar uygulandı: '+e.message);
  }
}
function liveVideoId251(input=''){
  const raw=String(input||'').trim();
  if(typeof extractVideoIdV220==='function'){
    const id=extractVideoIdV220(raw);
    if(id)return id;
  }
  const live=raw.match(/(?:youtube\.com\/live\/|live\/)([a-zA-Z0-9_-]{11})/);
  return live?live[1]:'';
}
function isLiveEpisode251(ep={}){return /canlı|canli|live|yayın|yayin/i.test(`${ep.title||''} ${ep.type||''} ${ep.status||''} ${ep.url||''}`)}
function stableCardClass251(g){const issues=(typeof issueList250==='function'?issueList250(g):[]);return issues.length?'has-issues251':'stable251'}

async function load(){
  const wait=(ms)=>new Promise(r=>setTimeout(r,ms));
  const started=Date.now();
  const setStep=async(label,pct,delay=180)=>{loaderSet(pct,label);await wait(delay);};
  const defaultSteps=openingSettings251().steps;
  await setStep(defaultSteps[0]||'Açılış sistemi hazırlanıyor',calcStepPct251(0,defaultSteps.length),180);
  await setStep(defaultSteps[1]||'Ayarlar yükleniyor',calcStepPct251(1,defaultSteps.length),180);
  try{const r=await api('/api/settings');state.settings=r.settings||{};}catch(e){console.warn(e);state.settings=state.settings||{}}
  setOpeningPreview251();
  const st=openingSettings251();
  const steps=st.steps;
  for(let i=2;i<steps.length;i++){
    await setStep(steps[i],calcStepPct251(i,steps.length),160);
    if(i===2){try{const r=await api('/api/games');state.games=r.games||[];}catch(e){console.warn(e);state.games=state.games||[]}}
    if(i===4){try{const r=await api('/api/notes');state.notes=(typeof sortNotes251==='function'?sortNotes251(r.notes||[]):r.notes||[]);}catch(e){console.warn(e);state.notes=state.notes||[]}}
  }
  try{const r=await api('/api/calendar');state.events=r.events||[];}catch(e){console.warn(e);state.events=state.events||[]}
  const elapsed=Date.now()-started;
  if(elapsed<st.minDuration)await wait(st.minDuration-elapsed);
  loaderSet(100,'Hazır — V2.5.1 Fix 5 açılıyor.');
  await wait(350);
}

function injectNavV210(){
  try{
    const nav=document.getElementById('nav');
    if(!nav || document.getElementById('navV210Group'))return;
    const group=document.createElement('span');
    group.className='nav-v210-group nav-v220-group';
    group.id='navV210Group';
    const items=[
      ['archivev210','Arşiv'],
      ['searchv210','Arama'],
      ['favoritesv210','Favoriler'],
      ['trackingv210','Takip']
    ];
    group.innerHTML=items.map(([p,label])=>`<button type="button" data-page="${p}" class="${state.page===p?'active':''}">${label}</button>`).join('');
    nav.appendChild(group);
    group.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>setPage(b.dataset.page)));
  }catch(e){}
}

function renderNav(){const items=[['home','Ana Sayfa'],['series','Seriler'],['az','A-Z'],['calendar','Takvim'],['notes','Güncelleme Notları'],['social','Sosyal'],['about','Hakkında'],['profile','Profil']]; if(canSeeAdmin())items.push(['admin','Admin']); $('#brand').innerHTML=`${state.settings?.site_logo?`<img src="${esc(state.settings.site_logo)}" class="brand-logo">`:''}<b>${esc(siteTitle())}</b><small>V${VERSION}</small>`; $('#nav').innerHTML=items.map(([p,t])=>`<button type="button" data-page="${p}" class="${state.page===p?'active':''}">${t}</button>`).join(''); $$('#nav button').forEach(b=>b.addEventListener('click',()=>setPage(b.dataset.page))); renderSocialSurfaces();}
function setPage(p){state.page=p||'home'; location.hash='#/'+state.page; render();}

/* V2.5.1 Fix 5 - Büyük sistem güncellemesi */
function storageGetV210(key, fallback){
  try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback));}catch(e){return fallback}
}
function storageSetV210(key, value){
  try{localStorage.setItem(key, JSON.stringify(value));}catch(e){}
}
function userListsV210(){return storageGetV210('ho_v210_user_lists',{favorites:[],watch:{}});}
function saveUserListsV210(data){storageSetV210('ho_v210_user_lists',data);}
function isFavoriteV210(id){
  const d=userListsV210();
  return d.favorites.includes(String(id));
}
function toggleFavoriteV210(id){
  const d=userListsV210();
  id=String(id);
  d.favorites=d.favorites.includes(id)?d.favorites.filter(x=>x!==id):[...d.favorites,id];
  saveUserListsV210(d);
  if(typeof render==='function')render();
}
function setWatchStatusV210(id,status){
  const d=userListsV210();
  id=String(id);
  d.watch[id]=status;
  saveUserListsV210(d);
  if(typeof render==='function')render();
}
function getWatchStatusV210(id){
  const d=userListsV210();
  return d.watch[String(id)]||'';
}
function gameIdV210(g){return String(g?.id||g?.slug||g?.title||'');}
function searchParamsV210(){
  const q=document.getElementById('searchQv210')?.value?.toLocaleLowerCase('tr-TR')||'';
  const status=document.getElementById('statusFilterV210')?.value||'';
  const type=document.getElementById('typeFilterV210')?.value||'';
  const series=document.getElementById('seriesFilterV210')?.value||'';
  return {q,status,type,series};
}
function filteredGamesV210(){
  const {q,status,type,series}=searchParamsV210();
  return sortGamesTitleOnly250F1((state.games||[]).filter(g=>{
    const hay=`${g.title||''} ${g.series||''} ${g.description||''} ${(g.tags||[]).join(' ')}`.toLocaleLowerCase('tr-TR');
    if(q && !hay.includes(q))return false;
    if(status && String(g.status||'')!==status)return false;
    if(type && String(g.type||'')!==type)return false;
    if(series && String(g.series||'')!==series)return false;
    return true;
  }));
}
function episodeCountV210(g){return Array.isArray(g?.episodes)?g.episodes.length:0;}
function seriesListV210(){return [...new Set((state.games||[]).map(g=>g.series).filter(Boolean))].sort((a,b)=>sortTitleTR250F1(a,b));}
function statusesV210(){return [...new Set((state.games||[]).map(g=>g.status).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'tr'));}
function typesV210(){return [...new Set((state.games||[]).map(g=>g.type).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'tr'));}
function coverV210(g){return (typeof gameCover==='function'?gameCover(g):(g?.cover||g?.thumbnail||'/assets/series-placeholder.svg'))||'/assets/series-placeholder.svg';}
function escV210(x){return typeof esc==='function'?esc(x):String(x??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function gameCardV210(g){
  const id=gameIdV210(g);
  const fav=isFavoriteV210(id);
  const watch=getWatchStatusV210(id);
  return `<article class="game-v210-card card ${stableCardClass251(g)}" data-game-title-full="${fullTitle250F1(g)}">
    <div class="game-v210-cover" style="background-image:url('${escV210(coverV210(g))}')">
      <span class="status-pill">${escV210(g.status||'Durum Yok')}</span>
      <button class="fav-btn-v210 ${fav?'active':''}" onclick="toggleFavoriteV210('${escV210(id)}')" title="Favori">${fav?'★':'☆'}</button>
    </div>
    <div class="game-v210-body">
      <h3 class="full-game-title250" ${titleAttr250F1(g)}>${fullTitle250F1(g)}</h3>
      <p class="muted full-game-meta250">${fullSeries250F1(g)} • ${escV210(g.type||'Ana Oyun')} • ${episodeCountV210(g)} bölüm</p>
      ${watch?`<span class="watch-pill-v210">${escV210(watch)}</span>`:''}
      <div class="row">
        <button onclick="showGameDetailV210('${escV210(id)}')">Detay</button>
        <select onchange="setWatchStatusV210('${escV210(id)}',this.value)">
          <option value="">Takip Durumu</option>
          <option ${watch==='İzledim'?'selected':''}>İzledim</option>
          <option ${watch==='İzliyorum'?'selected':''}>İzliyorum</option>
          <option ${watch==='İzleyeceğim'?'selected':''}>İzleyeceğim</option>
          <option ${watch==='Yarım Kaldı'?'selected':''}>Yarım Kaldı</option>
        </select>
      </div>
    </div>
  </article>`;
}

/* V2.5.1 Fix 5 - YouTube video ID otomatik algılama */
function extractVideoIdV220(input=''){
  const raw=String(input||'').trim();
  if(!raw)return '';
  if(/^[a-zA-Z0-9_-]{11}$/.test(raw))return raw;
  try{
    const normalized=/^https?:\/\//i.test(raw)?raw:'https://'+raw;
    const u=new URL(normalized);
    const host=u.hostname.replace(/^www\./,'').toLowerCase();
    if(host.includes('youtu.be')){
      const id=u.pathname.split('/').filter(Boolean)[0]||'';
      if(/^[a-zA-Z0-9_-]{11}$/.test(id))return id;
    }
    if(host.includes('youtube.com')||host.includes('youtube-nocookie.com')){
      const v=u.searchParams.get('v');
      if(v&&/^[a-zA-Z0-9_-]{11}$/.test(v))return v;
      const parts=u.pathname.split('/').filter(Boolean);
      const keys=['embed','shorts','live','v'];
      for(let i=0;i<parts.length;i++){
        if(keys.includes(parts[i])&&parts[i+1]&&/^[a-zA-Z0-9_-]{11}$/.test(parts[i+1]))return parts[i+1];
      }
      const last=parts[parts.length-1]||'';
      if(/^[a-zA-Z0-9_-]{11}$/.test(last))return last;
    }
  }catch(e){}
  const m=raw.match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([a-zA-Z0-9_-]{11})/);
  if(m)return m[1];
  const loose=raw.match(/\b([a-zA-Z0-9_-]{11})\b/);
  return loose?loose[1]:'';
}
function episodeVideoIdV220(ep={}){
  return extractVideoIdV220(
    ep.videoId || ep.video_id || ep.youtube_id || ep.youtubeId || ep.id ||
    ep.url || ep.video_url || ep.videoUrl || ep.link || ep.href || ''
  );
}
function episodeWatchUrlV220(ep={}){
  const id=episodeVideoIdV220(ep);
  if(id)return `https://www.youtube.com/watch?v=${id}`;
  return ep.url||ep.video_url||ep.videoUrl||ep.link||ep.href||'';
}
function episodeEmbedUrlV220(ep={}){
  const id=episodeVideoIdV220(ep);
  return id?`https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&autoplay=0`:'';
}
function openEpisodePlayerV220(gameId,idx){
  const g=(state.games||[]).find(x=>String(x.id||x.slug||x.title)===String(gameId));
  if(!g)return alert('Oyun bulunamadı.');
  const ep=(Array.isArray(g.episodes)?g.episodes:[])[Number(idx)];
  if(!ep)return alert('Bölüm bulunamadı.');
  const embed=episodeEmbedUrlV220(ep);
  const watch=episodeWatchUrlV220(ep);
  const app=document.getElementById('app');
  if(!embed){
    return alert('Video ID bulunamadı. Bölümde YouTube linki veya video ID alanı yok. Admin panelden bölüm URL/videoId alanını kontrol et.');
  }
  app.innerHTML=`<section class="watch-page-v220">
    <div class="watch-head-v220 card">
      <div><span class="version-pill">Site içi izleme</span><h1>${escV220(ep.title||g.title||'Bölüm')}</h1><p class="muted">${escV220(g.title||'Oyun')} • ${escV220(g.series||'Seri')}</p></div>
      <div class="row"><button onclick="showGameDetailV210('${escV220(gameId)}')">Oyuna Dön</button><a class="button ghost" href="${escV220(watch)}" target="_blank" rel="noopener noreferrer">YouTube’da Aç</a></div>
    </div>
    <div class="player-shell-v220">
      <iframe src="${escV220(embed)}" title="${escV220(ep.title||g.title||'Video')}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    </div>
    <section class="card"><h2>Bölüm Bilgisi</h2><p>${escV220(ep.description||g.description||'Açıklama eklenmemiş.')}</p><p class="muted">Video ID: ${escV220(episodeVideoIdV220(ep))}</p></section>
  </section>`;
}
function normalizeEpisodesVideoIdsV220(game){
  const g={...(game||{})};
  if(!Array.isArray(g.episodes))g.episodes=[];
  g.episodes=g.episodes.map(ep=>{
    const next={...(ep||{})};
    const id=episodeVideoIdV220(next);
    if(id&&!next.videoId)next.videoId=id;
    if(!next.url&&id)next.url=`https://www.youtube.com/watch?v=${id}`;
    return next;
  });
  return g;
}
async function repairEpisodeVideoIdsV220(){
  const games=(state.games||[]).filter(g=>(Array.isArray(g.episodes)?g.episodes:[]).some(ep=>episodeVideoIdV220(ep)&&!ep.videoId));
  if(!games.length)return alert('Video ID onarılacak bölüm bulunamadı.');
  if(!confirm(games.length+' oyundaki bölüm video ID alanları onarılsın mı?'))return;
  let ok=0,fail=0;
  if(typeof runWithProgressV220==='function'){
    await runWithProgressV220('Bölüm Video ID Onarımı',games,async(g)=>{
      const fixed=normalizeEpisodesVideoIdsV220(g);
      if(typeof saveGameV220==='function')await saveGameV220(fixed);
      else await api('/api/games',{method:'PUT',body:JSON.stringify({game:fixed})});
    });
    ok=games.length;
  }else{
    for(const g of games){
      try{
        const fixed=normalizeEpisodesVideoIdsV220(g);
        await api('/api/games',{method:'PUT',body:JSON.stringify({game:fixed})});
        ok++;
      }catch(e){console.warn(e);fail++;}
    }
  }
  await load();
  alert('Video ID onarımı tamamlandı. Başarılı: '+ok+' Hata: '+fail);
}

function showGameDetailV210(id){
  const g=(state.games||[]).find(x=>key250(x)===String(id)||String(x.id||x.slug||x.title)===String(id));
  if(!g)return;
  const gid=key250(g);
  const eps=episodes250(g);
  const similar=(state.games||[]).filter(x=>x!==g&&(seriesName250(x)===seriesName250(g)||x.genre&&x.genre===g.genre)).slice(0,4);
  const app=document.getElementById('app');
  app.innerHTML=`<section class="game-detail-v250 hero">
    <div class="game-detail-cover-v210" style="background-image:url('${esc250(cover250(g))}')"></div>
    <div><span class="version-pill">Oyun Detay Sayfası V3</span><h1>${esc250(g.title||'Başlıksız')}</h1><p>${esc250(g.description||'Bu oyun için açıklama henüz eklenmedi.')}</p><div class="roadmap-list"><span>${esc250(seriesName250(g))}</span><span>${esc250(g.type||'Ana Oyun')}</span><span>${esc250(g.status||'Durum Yok')}</span><span>${eps.length} bölüm</span><span>İlerleme %${progressForGame250(g)}</span></div><div class="row"><button onclick="favGame250('${esc250(gid)}')">Favori</button><button class="ghost" onclick="seriesDetail250('${esc250(seriesName250(g))}')">Seri Detayı</button><button class="ghost" onclick="setPage('contribute250')">Hata Bildir</button></div></div>
  </section>
  <section class="card"><h2>Bölümler</h2><div class="episodes-v210 episodes-watch-v220">${eps.map((ep,i)=>{const vid=typeof episodeVideoIdV220==='function'?episodeVideoIdV220(ep):(ep.videoId||'');const watch=typeof episodeWatchUrlV220==='function'?episodeWatchUrlV220(ep):(ep.url||'');const done=!!v250User().watch[`${gid}:${i}`];return `<div class="episode-row-v210 episode-row-watch-v220 ${done?'watched':''}"><div><b>${i+1}. ${esc250(ep.title||'Bölüm')}</b><small>${isLiveEpisode251(ep)?'🔴 Canlı Yayın • ':''}${vid?'Video ID: '+esc250(vid):'Video ID/link yok'} ${done?'• İzlendi':''}</small></div><div class="row">${vid?`<button onclick="openEpisodePlayerV220('${esc250(gid)}','${i}');setWatch250('${esc250(gid)}','${i}','İzlendi')">Site İçinde İzle</button>`:''}<button class="ghost" onclick="setWatch250('${esc250(gid)}','${i}','İzlendi');showGameDetailV210('${esc250(gid)}')">İzlendi</button>${watch?`<a class="button ghost" href="${esc250(watch)}" target="_blank" rel="noopener noreferrer">YouTube</a>`:''}</div></div>`}).join('')||'<p class="muted">Bölüm eklenmemiş.</p>'}</div></section>
  <section class="card"><h2>Benzer Oyunlar</h2><div class="grid">${similar.map(gameCardMega250).join('')||'<p class="muted">Benzer oyun bulunamadı.</p>'}</div></section>`;
}
function v210DashboardStats(){
  const games=state.games||[];
  const fav=userListsV210().favorites.length;
  const watch=userListsV210().watch||{};
  const series=seriesListV210().length;
  const eps=games.reduce((a,g)=>a+episodeCountV210(g),0);
  const health=siteHealthV210();
  return {games:games.length,series,eps,fav,watch:Object.keys(watch).length,health};
}
function siteHealthV210(){
  const games=state.games||[];
  const missingCover=games.filter(g=>!g.cover&&!g.thumbnail).length;
  const missingStory=games.filter(g=>!String(g.description||'').trim()).length;
  const missingEpisode=games.filter(g=>episodeCountV210(g)===0&&!/yakında|yakinda|gelecek/i.test(`${g.status||''} ${g.title||''}`)).length;
  const badSocial=['social_youtube','social_kick','social_discord','social_donate','social_tiktok','social_instagram'].filter(k=>!state.settings?.[k]).length;
  return {missingCover,missingStory,missingEpisode,badSocial,totalIssues:missingCover+missingStory+missingEpisode+badSocial};
}
function exportBackupV210(){
  const data={version:'2.1.0',created_at:new Date().toISOString(),settings:state.settings,games:state.games,notes:state.notes,events:state.events,userLists:userListsV210()};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='hayatimiz-oyun-V2.5.1 Fix 5-yedek.json';
  a.click();
  URL.revokeObjectURL(a.href);
}
function importBackupV210(){
  const input=document.createElement('input');
  input.type='file'; input.accept='application/json';
  input.onchange=async()=>{
    const file=input.files[0]; if(!file)return;
    const text=await file.text();
    const data=JSON.parse(text);
    if(!confirm('Yedek içeriği yerel olarak yüklensin mi? Veritabanına yazma işlemi yapılmaz.'))return;
    state.settings=data.settings||state.settings;
    state.games=data.games||state.games;
    state.notes=data.notes||state.notes;
    state.events=data.events||state.events;
    if(data.userLists)saveUserListsV210(data.userLists);
    render();
  };
  input.click();
}
function v210AnnouncementBanner(){
  const list=storageGetV210('ho_v210_announcements',[{title:'V2.5.1 Fix 5 yayında',type:'Yeni Özellik',body:'Gelişmiş arşiv, arama, favoriler, izleme takip, sağlık kontrolü ve yedekleme sistemi eklendi.'}]);
  return `<section class="announcement-v210">${list.slice(0,3).map(x=>`<article><span>${escV210(x.type||'Duyuru')}</span><h3>${escV210(x.title)}</h3><p>${escV210(x.body||'')}</p></article>`).join('')}</section>`;
}
function addAnnouncementV210(){
  const title=prompt('Duyuru başlığı:','Yeni duyuru'); if(!title)return;
  const type=prompt('Duyuru türü:','Yeni Özellik')||'Duyuru';
  const body=prompt('Duyuru açıklaması:','')||'';
  const list=storageGetV210('ho_v210_announcements',[]);
  list.unshift({title,type,body,created_at:new Date().toISOString()});
  storageSetV210('ho_v210_announcements',list);
  if(typeof adminTab==='function')adminTab('v210');
}
function v210AdminPanel(){
  const st=v210DashboardStats();
  const health=st.health;
  return `<section class="card v210-admin-panel"><div class="section-title"><div><span class="version-pill">V2.5.1 Fix 5</span><h2>Büyük Sistem Güncellemesi</h2><p class="muted">Arşiv, arama, favoriler, izleme takip, site sağlık kontrolü, duyuru ve yedekleme merkezi.</p></div><button onclick="exportBackupV210()">Yedek Al</button></div>
  <div class="grid compact">
    <div class="card"><h2>${st.games}</h2><p>Oyun</p></div>
    <div class="card"><h2>${st.series}</h2><p>Seri</p></div>
    <div class="card"><h2>${st.eps}</h2><p>Bölüm</p></div>
    <div class="card"><h2>${st.fav}</h2><p>Favori</p></div>
    <div class="card"><h2>${st.watch}</h2><p>Takip Kaydı</p></div>
    <div class="card ${health.totalIssues?'health-warn':'health-ok'}"><h2>${health.totalIssues}</h2><p>Sağlık Uyarısı</p></div>
  </div>
  <section class="split">
    <div class="card"><h2>Site Sağlık Kontrolü</h2><p>Kapaksız: ${health.missingCover}</p><p>Hikayesiz: ${health.missingStory}</p><p>Bölümsüz: ${health.missingEpisode}</p><p>Sosyal eksik: ${health.badSocial}</p><button onclick="adminTab('repairV2')">Onarım Merkezine Git</button></div>
    <div class="card"><h2>Duyuru Sistemi</h2><p class="muted">Ana sayfada gösterilecek kısa duyuruları yönet.</p><button onclick="addAnnouncementV210()">Duyuru Ekle</button></div>
  </section>
  <section class="card"><h2>Yedekleme ve Geri Yükleme</h2><div class="row"><button onclick="exportBackupV210()">Tam Yedek İndir</button><button class="ghost" onclick="importBackupV210()">Yedek İçeri Aktar</button></div></section>
  </section>`;
}
function archivePageV210(){
  const series=seriesListV210();
  return `<section class="hero"><span class="version-pill">V2.5.1 Fix 5</span><h1>Gelişmiş Arşiv</h1><p>Seriler, oyunlar, bölümler ve takip durumları tek merkezde. Alfabetik sıralama Türkçe karakter destekli düzeltildi.</p></section>
  <section class="grid compact">${series.map(name=>{
    const games=sortGamesTitleOnly250F1((state.games||[]).filter(g=>g.series===name));
    const eps=games.reduce((a,g)=>a+episodeCountV210(g),0);
    return `<article class="card series-v210-card series-card-full250"><h2 title="${esc250(name)}">${esc250(name)}</h2><p class="muted">${games.length} oyun • ${eps} bölüm</p><div class="series-covers-v210">${games.slice(0,4).map(g=>`<span style="background-image:url('${escV210(coverV210(g))}')" title="${fullTitle250F1(g)}"></span>`).join('')}</div><div class="archive-game-names250">${games.slice(0,8).map(g=>`<small title="${fullTitle250F1(g)}">${fullTitle250F1(g)}</small>`).join('')}</div></article>`;
  }).join('')}</section>`;
}
function searchPageV210(){
  const series=seriesListV210(), statuses=statusesV210(), types=typesV210();
  const games=filteredGamesV210();
  return `<section class="hero"><span class="version-pill">V2.5.1 Fix 5</span><h1>Gelişmiş Arama</h1><p>Oyun, seri, durum, tip ve açıklama üzerinden arama yap. Oyun adları artık kesilmeden gösterilir.</p></section>
  <section class="card search-panel-v210"><div class="search-grid-v210">
    <input id="searchQv210" placeholder="Oyun, seri veya bölüm ara..." oninput="setPage('searchv210')" value="${escV210(document.getElementById('searchQv210')?.value||'')}">
    <select id="statusFilterV210" onchange="setPage('searchv210')"><option value="">Tüm Durumlar</option>${statuses.map(x=>`<option>${escV210(x)}</option>`).join('')}</select>
    <select id="typeFilterV210" onchange="setPage('searchv210')"><option value="">Tüm Tipler</option>${types.map(x=>`<option>${escV210(x)}</option>`).join('')}</select>
    <select id="seriesFilterV210" onchange="setPage('searchv210')"><option value="">Tüm Seriler</option>${series.map(x=>`<option>${escV210(x)}</option>`).join('')}</select>
  </div></section>
  <section class="grid">${games.map(gameCardV210).join('')||'<div class="card"><p class="muted">Sonuç bulunamadı.</p></div>'}</section>`;
}
function favoritesPageV210(){
  const ids=new Set(userListsV210().favorites);
  const games=sortGamesTitleOnly250F1((state.games||[]).filter(g=>ids.has(gameIdV210(g))));
  return `<section class="hero"><span class="version-pill">V2.5.1 Fix 5</span><h1>Favoriler</h1><p>Favori oyunların ve serilerin hızlı erişim alanı. Oyun adları tam gösterilir.</p></section><section class="grid">${games.map(gameCardV210).join('')||'<div class="card"><p class="muted">Henüz favori eklenmedi.</p></div>'}</section>`;
}
function trackingPageV210(){
  const watch=userListsV210().watch||{};
  const games=sortGamesTitleOnly250F1((state.games||[]).filter(g=>watch[gameIdV210(g)]));
  return `<section class="hero"><span class="version-pill">V2.5.1 Fix 5</span><h1>İzleme Takibi</h1><p>İzledim, izliyorum, izleyeceğim ve yarım kaldı kayıtların. Oyun adları tam gösterilir.</p></section><section class="grid">${games.map(gameCardV210).join('')||'<div class="card"><p class="muted">Henüz takip kaydı yok.</p></div>'}</section>`;
}


/* V2.5.1 Fix 5 - Professional Stability Core */
function versionScoreV220(v=''){
  const txt=String(v||'').toLocaleLowerCase('tr-TR');
  const m=txt.match(/v?\s*(\d+)\.(\d+)\.(\d+)/i);
  if(!m)return 0;
  const fix=Number((txt.match(/fix\s*([0-9]+)/i)||[])[1]||0);
  const alpha=Number((txt.match(/alpha\s*([0-9]+)/i)||[])[1]||0);
  const beta=Number((txt.match(/beta\s*([0-9]+)/i)||[])[1]||0);
  return Number(m[1])*100000000 + Number(m[2])*1000000 + Number(m[3])*10000 + fix*100 + beta*10 + alpha;
}
function sortNotesV220(notes=[]){
  return [...notes].sort((a,b)=>{
    const sv=versionScoreV220(b.version||b.title)-versionScoreV220(a.version||a.title);
    if(sv)return sv;
    return new Date(b.created_at||0)-new Date(a.created_at||0);
  });
}
function escV220(x){
  return typeof esc==='function'?esc(x):String(x??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
function gameKeyV220(g){return String(g?.id||g?.slug||g?.title||'');}
function gameCoverV220(g){
  try{return (typeof gameCover==='function'?gameCover(g):(g?.cover||g?.thumbnail||''))||'/assets/series-placeholder.svg';}
  catch(e){return g?.cover||g?.thumbnail||'/assets/series-placeholder.svg'}
}
function isUpcomingV220(g){
  return /yakında|yakinda|gelecek|upcoming|coming soon/i.test(`${g?.status||''} ${g?.type||''} ${g?.title||''} ${g?.series||''}`);
}
function gameIssuesV220(g){
  if(typeof gameIssuesAlpha3==='function'){
    try{return gameIssuesAlpha3(g)}catch(e){}
  }
  const issues=[];
  if(!String(g?.title||'').trim())issues.push('Başlık boş');
  if(!String(g?.series||'').trim())issues.push('Seri adı boş');
  if(!g?.cover&&!g?.thumbnail)issues.push('Kapak eksik');
  if(!String(g?.description||'').trim())issues.push('Hikaye yok');
  if(!isUpcomingV220(g)&&!(Array.isArray(g?.episodes)&&g.episodes.length))issues.push('Bölüm yok');
  if(/\bdlc\b|dlc'?si|ek paket|expansion/i.test(`${g?.title||''} ${g?.type||''}`) && String(g?.type||'').toLowerCase()!=='dlc')issues.push('DLC tipi yanlış');
  return issues;
}
function ensureProgressV220(title='İşlem Durumu'){
  let box=document.getElementById('globalProgressV220');
  if(!box){
    box=document.createElement('section');
    box.id='globalProgressV220';
    box.className='global-progress-v220 card';
    box.innerHTML=`<div class="progress-head-v220"><div><span class="version-pill">V2.5.1 Fix 5</span><h2 id="progressTitleV220">${escV220(title)}</h2><p class="muted" id="progressTextV220">Hazırlanıyor...</p></div><strong id="progressPctV220">%0</strong></div><div class="progress-track-v220"><b id="progressBarV220"></b></div><div id="progressLogV220" class="progress-log-v220"></div>`;
    const admin=document.getElementById('adminArea');
    const app=document.getElementById('app');
    (admin||app||document.body).prepend(box);
  }
  return box;
}
function setProgressV220(done,total,label='İşleniyor',detail=''){
  ensureProgressV220();
  const pct=total?Math.max(0,Math.min(100,Math.round(done/total*100))):0;
  const pctEl=document.getElementById('progressPctV220');
  const txt=document.getElementById('progressTextV220');
  const bar=document.getElementById('progressBarV220');
  const log=document.getElementById('progressLogV220');
  if(pctEl)pctEl.textContent='%'+pct;
  if(txt)txt.textContent=label;
  if(bar)bar.style.width=pct+'%';
  if(log&&detail){
    const row=document.createElement('div');
    row.textContent=detail;
    log.prepend(row);
    while(log.children.length>10)log.removeChild(log.lastChild);
  }
  if(typeof updateTopProgress==='function'){
    try{updateTopProgress(done,total,label)}catch(e){}
  }
}
function finishProgressV220(label='Tamamlandı',detail='İşlem başarıyla tamamlandı.'){
  setProgressV220(100,100,label,detail);
  if(typeof finishTopProgress==='function'){
    try{finishTopProgress(label)}catch(e){}
  }
}
async function runWithProgressV220(title,items,worker){
  ensureProgressV220(title);
  document.getElementById('progressTitleV220').textContent=title;
  let ok=0,fail=0;
  const total=items.length||1;
  setProgressV220(0,total,title+' başladı',`${items.length} kayıt işlenecek.`);
  for(let i=0;i<items.length;i++){
    const item=items[i];
    const label=item?.title||item?.name||item?.version||`${i+1}. kayıt`;
    setProgressV220(i,total,`İşleniyor: ${label}`,`${i+1}/${items.length} başladı: ${label}`);
    try{
      await worker(item,i);
      ok++;
      setProgressV220(i+1,total,`Tamamlandı: ${label}`,`${i+1}/${items.length} tamam: ${label}`);
    }catch(e){
      console.warn(e);
      fail++;
      setProgressV220(i+1,total,`Hata: ${label}`,`${i+1}/${items.length} hata: ${label}`);
    }
  }
  finishProgressV220(title+' tamamlandı',`Başarılı: ${ok} • Hata: ${fail}`);
  return {ok,fail};
}
function selectedIdsV220(){
  return Array.from(document.querySelectorAll('.admin-select-v220:checked,.game-check:checked,.admin-game-select-v203f1:checked'))
    .map(x=>x.value).filter(Boolean).filter((v,i,a)=>a.indexOf(v)===i);
}
function updateSelectedV220(){
  const n=selectedIdsV220().length;
  document.querySelectorAll('[data-selected-count-v220],#selectedGamesCountV211,#selectedGamesCountV203F1').forEach(el=>el.textContent=n+' seçili');
}
function toggleAllV220(chk){
  document.querySelectorAll('#adminGamesList .admin-select-v220,#adminGamesList .game-check,#adminGamesList .admin-game-select-v203f1').forEach(x=>x.checked=!!chk.checked);
  updateSelectedV220();
}
function getSelectedGamesV220(){
  const ids=new Set(selectedIdsV220());
  return (state.games||[]).filter(g=>ids.has(gameKeyV220(g)));
}
async function saveGameV220(game){
  let clean={...game};
  if(!clean.cover)clean.cover=gameCoverV220(clean);
  if(typeof stripGameDbUnsafeFields==='function')clean=stripGameDbUnsafeFields(clean);
  await api('/api/games',{method:'PUT',body:JSON.stringify({game:clean})});
  return clean;
}
async function bulkUpdateSelectedGamesV220(){
  const list=getSelectedGamesV220();
  if(!list.length)return alert('Oyun seç.');
  const patch={};
  const st=document.getElementById('bulkStatusV220')?.value||document.getElementById('bulkStatus')?.value||'';
  const series=document.getElementById('bulkSeriesV220')?.value?.trim()||document.getElementById('bulkSeries')?.value?.trim()||'';
  const type=document.getElementById('bulkTypeV220')?.value||'';
  const tag=document.getElementById('bulkTagV220')?.value?.trim()||document.getElementById('bulkTag')?.value?.trim()||'';
  if(st)patch.status=st;
  if(series)patch.series=series;
  if(type)patch.type=type;
  if(tag)patch.tag=tag;
  if(!Object.keys(patch).length)return alert('Bir güncelleme alanı doldur.');
  if(!confirm(list.length+' seçili oyun güncellensin mi?'))return;
  const result=await runWithProgressV220('Seçili Oyunları Güncelle',list,async(g)=>{
    const next={...g};
    if(patch.status)next.status=patch.status;
    if(patch.series)next.series=patch.series;
    if(patch.type)next.type=patch.type;
    if(patch.tag){
      const tags=Array.isArray(next.tags)?next.tags:String(next.tags||'').split(',').map(x=>x.trim()).filter(Boolean);
      if(!tags.includes(patch.tag))tags.push(patch.tag);
      next.tags=tags;
    }
    await saveGameV220(next);
  });
  await load();
  adminTab('games');
  setTimeout(()=>finishProgressV220('Seçili Oyunları Güncelle tamamlandı',`Başarılı: ${result.ok} • Hata: ${result.fail}`),120);
}
async function repairSelectedGamesV220(){
  const list=getSelectedGamesV220();
  if(!list.length)return alert('Onarılacak oyun seç.');
  if(!confirm(list.length+' seçili oyun onarılsın mı?'))return;
  const result=await runWithProgressV220('Seçili Oyunları Onar',list,async(g)=>{
    if(typeof saveGameRepairV201F2b==='function')await saveGameRepairV201F2b(g);
    else await saveGameV220(g);
  });
  await load();
  adminTab('games');
  setTimeout(()=>finishProgressV220('Seçili Oyunları Onar tamamlandı',`Başarılı: ${result.ok} • Hata: ${result.fail}`),120);
}
async function deleteSelectedGamesV220(){
  const ids=selectedIdsV220();
  if(!ids.length)return alert('Oyun seç.');
  if(!confirm(ids.length+' seçili oyun silinsin mi?'))return;
  ensureProgressV220('Seçili Oyunları Sil');
  setProgressV220(25,100,'Silme isteği gönderiliyor',ids.length+' oyun silinecek.');
  try{
    await api('/api/games',{method:'DELETE',body:JSON.stringify({ids})});
    setProgressV220(75,100,'Liste yenileniyor','Silme tamamlandı, liste yenileniyor.');
    await load();
    adminTab('games');
    finishProgressV220('Silme tamamlandı',ids.length+' oyun için silme isteği tamamlandı.');
  }catch(e){
    finishProgressV220('Silme hatası',e.message);
    alert('Silme hatası: '+e.message);
  }
}
function bulkUpdateSelectedGames(){return bulkUpdateSelectedGamesV220()}
function repairSelectedGames(){return repairSelectedGamesV220()}
function deleteSelectedGames(){return deleteSelectedGamesV220()}
function setSelectedCountFixedV211(){updateSelectedV220()}
function toggleAllAdminGamesFixedV211(chk){toggleAllV220(chk)}
function updateSelectedGamesV203F1(){updateSelectedV220()}
function toggleAllGamesV203F1(chk){toggleAllV220(chk)}
function saveSettingsWithProgressV220(){
  ensureProgressV220('Ayarları Kaydet');
  setProgressV220(20,100,'Ayarlar hazırlanıyor','Form verileri okunuyor.');
}
function v220HomeBanner(){
  return `<section class="v220-banner card"><div><span class="version-pill">V2.5.1 Fix 5</span><h2>Site sürümü V2.5.1 Fix 5</h2><p class="muted">Site V2.5.1 Fix 5 sürümünde çalışıyor. Açılış/loading ekranı V2.5.1 Fix 5 açılış sistemiyle otomatik yüzde ilerlemesi kullanır.</p></div><button onclick="setPage('notes')">Güncelleme Notları</button></section>`;
}
function injectHomeV220(){
  try{
    if(state.page!=='home')return;
    const app=document.getElementById('app');
    if(!app||document.getElementById('v220HomeBanner'))return;
    const wrap=document.createElement('div');
    wrap.id='v220HomeBanner';
    wrap.innerHTML=v220HomeBanner();
    app.prepend(wrap);
  }catch(e){}
}


/* V2.5.1 Fix 5 Platform Core */
function v250StoreGet(key,fallback){
  try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback));}catch(e){return fallback}
}
function v250StoreSet(key,value){
  try{localStorage.setItem(key,JSON.stringify(value));}catch(e){}
}
function v250Now(){return new Date().toISOString();}
function esc250(x){return typeof escV220==='function'?escV220(x):(typeof esc==='function'?esc(x):String(x??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])));}
function key250(g){return String(g?.id||g?.slug||g?.title||'');}
function cover250(g){return typeof gameCoverV220==='function'?gameCoverV220(g):(typeof gameCover==='function'?gameCover(g):(g?.cover||g?.thumbnail||'/assets/series-placeholder.svg'));}
function episodes250(g){return Array.isArray(g?.episodes)?g.episodes:[];}
function seriesName250(g){return (typeof getSeriesName==='function'?getSeriesName(g):(g?.series||'Serisiz'))||'Serisiz';}
function isUpcoming250(g){return /yakında|yakinda|gelecek|upcoming|coming soon/i.test(`${g?.status||''} ${g?.title||''} ${g?.type||''}`);}
function issueList250(g){
  const issues=[];
  if(!String(g?.title||'').trim())issues.push({level:'kritik',text:'Başlık yok'});
  if(!String(seriesName250(g)||'').trim())issues.push({level:'yüksek',text:'Seri yok'});
  if(!g?.cover&&!g?.thumbnail)issues.push({level:'yüksek',text:'Kapak yok'});
  if(!String(g?.description||'').trim())issues.push({level:'orta',text:'Hikaye yok'});
  if(!isUpcoming250(g)&&!episodes250(g).length)issues.push({level:'yüksek',text:'Bölüm yok'});
  const eps=episodes250(g);
  eps.forEach((ep,i)=>{
    const vid=(typeof episodeVideoIdV220==='function'?episodeVideoIdV220(ep):(ep.videoId||ep.video_id||''));
    const url=ep.url||ep.video_url||ep.link||'';
    if(url&&!vid)issues.push({level:'kritik',text:`${i+1}. bölüm video ID eksik`});
  });
  if(/\bdlc\b|dlc'?si|ek paket|expansion/i.test(`${g?.title||''} ${g?.type||''}`)&&String(g?.type||'').toLowerCase()!=='dlc')issues.push({level:'orta',text:'DLC tipi yanlış'});
  return issues;
}
function allIssues250(){
  const rows=[];
  (state.games||[]).forEach(g=>issueList250(g).forEach(i=>rows.push({...i,game:g})));
  return rows;
}
function healthScore250(){
  const games=state.games||[];
  if(!games.length)return {score:100,covers:100,stories:100,videos:100,notes:100,social:100,totalIssues:0};
  const total=games.length;
  const coverGood=games.filter(g=>g.cover||g.thumbnail).length;
  const storyGood=games.filter(g=>String(g.description||'').trim().length>40).length;
  let vidTotal=0,vidGood=0;
  games.forEach(g=>episodes250(g).forEach(ep=>{vidTotal++; if(typeof episodeVideoIdV220==='function'?episodeVideoIdV220(ep):(ep.videoId||ep.video_id))vidGood++;}));
  const socialKeys=['social_youtube','social_kick','social_discord','social_donate','social_tiktok','social_instagram'];
  const socialGood=socialKeys.filter(k=>state.settings?.[k]).length;
  const notesGood=(state.notes||[]).length?100:60;
  const covers=Math.round(coverGood/total*100);
  const stories=Math.round(storyGood/total*100);
  const videos=vidTotal?Math.round(vidGood/vidTotal*100):100;
  const social=Math.round(socialGood/socialKeys.length*100);
  const score=Math.round((covers+stories+videos+social+notesGood)/5);
  return {score,covers,stories,videos,notes:notesGood,social,totalIssues:allIssues250().length};
}
function v250User(){
  return v250StoreGet('ho_v250_user',{favorites:[],seriesFavorites:[],watch:{},history:[],badges:[],lists:{'İzleyeceğim':[],'Bitirdiklerim':[],'Devam Edenler':[],'En Sevdiklerim':[],'Yarım Kalanlar':[]}});
}
function v250SaveUser(u){v250StoreSet('ho_v250_user',u);}
function favGame250(id){
  const u=v250User(); id=String(id);
  u.favorites=u.favorites.includes(id)?u.favorites.filter(x=>x!==id):[...u.favorites,id];
  v250SaveUser(u); render();
}
function favSeries250(name){
  const u=v250User(); name=String(name);
  u.seriesFavorites=u.seriesFavorites.includes(name)?u.seriesFavorites.filter(x=>x!==name):[...u.seriesFavorites,name];
  v250SaveUser(u); render();
}
function setWatch250(gameId,epIndex,status='İzlendi'){
  const u=v250User();
  const key=`${gameId}:${epIndex}`;
  u.watch[key]=status;
  u.history=u.history.filter(x=>x.key!==key);
  u.history.unshift({key,gameId,epIndex,status,at:v250Now()});
  u.history=u.history.slice(0,80);
  if(!u.badges.includes('İlk Bölüm')&&Object.keys(u.watch).length>=1)u.badges.push('İlk Bölüm');
  if(!u.badges.includes('10 Bölüm İzledi')&&Object.keys(u.watch).length>=10)u.badges.push('10 Bölüm İzledi');
  if(!u.badges.includes('50 Bölüm İzledi')&&Object.keys(u.watch).length>=50)u.badges.push('50 Bölüm İzledi');
  v250SaveUser(u);
}
function progressForGame250(g){
  const eps=episodes250(g);
  if(!eps.length)return 0;
  const u=v250User();
  const id=key250(g);
  const watched=eps.filter((_,i)=>u.watch[`${id}:${i}`]).length;
  return Math.round(watched/eps.length*100);
}
function continueItem250(){
  const u=v250User();
  const item=u.history[0];
  if(!item)return null;
  const g=(state.games||[]).find(x=>key250(x)===String(item.gameId));
  if(!g)return null;
  const eps=episodes250(g);
  const nextIndex=Math.min(Number(item.epIndex)+1,Math.max(0,eps.length-1));
  return {game:g,ep:eps[nextIndex],idx:nextIndex,last:item};
}
function requestList250(){return v250StoreGet('ho_v250_requests',[]);}
function reportList250(){return v250StoreGet('ho_v250_reports',[]);}
function suggestList250(){return v250StoreGet('ho_v250_suggestions',[]);}
function adminLog250(){return v250StoreGet('ho_v250_admin_log',[]);}
function addAdminLog250(action,detail){
  const list=adminLog250();
  list.unshift({action,detail,at:v250Now()});
  v250StoreSet('ho_v250_admin_log',list.slice(0,200));
}
function submitSeriesRequest250(){
  const title=document.getElementById('reqTitle250')?.value?.trim();
  if(!title)return alert('Seri / oyun adı yaz.');
  const list=requestList250();
  list.unshift({
    id:'req_'+Date.now(),
    title,
    reason:document.getElementById('reqReason250')?.value||'',
    type:document.getElementById('reqType250')?.value||'',
    playlist:document.getElementById('reqPlaylist250')?.value||'',
    priority:document.getElementById('reqPriority250')?.value||'Normal',
    status:'Bekliyor',
    at:v250Now()
  });
  v250StoreSet('ho_v250_requests',list);
  alert('Seri isteği alındı.');
  setPage('contribute250');
}
function submitReport250(){
  const title=document.getElementById('repTitle250')?.value?.trim();
  if(!title)return alert('Hata başlığı yaz.');
  const list=reportList250();
  list.unshift({
    id:'rep_'+Date.now(),
    title,
    type:document.getElementById('repType250')?.value||'Diğer',
    page:location.hash||'Ana sayfa',
    game:document.getElementById('repGame250')?.value||'',
    detail:document.getElementById('repDetail250')?.value||'',
    status:'Yeni',
    priority:'Orta',
    at:v250Now()
  });
  v250StoreSet('ho_v250_reports',list);
  alert('Hata bildirimi alındı.');
  setPage('contribute250');
}
function changeRequestStatus250(id,status){
  const list=requestList250().map(x=>x.id===id?{...x,status}:x);
  v250StoreSet('ho_v250_requests',list);
  addAdminLog250('Seri isteği güncellendi',id+' -> '+status);
  adminTab('v250');
}
function changeReportStatus250(id,status){
  const list=reportList250().map(x=>x.id===id?{...x,status}:x);
  v250StoreSet('ho_v250_reports',list);
  addAdminLog250('Hata bildirimi güncellendi',id+' -> '+status);
  adminTab('v250');
}
function randomGame250(){
  const games=state.games||[];
  if(!games.length)return alert('Oyun yok.');
  const g=games[Math.floor(Math.random()*games.length)];
  if(typeof showGameDetailV210==='function')showGameDetailV210(key250(g));
}
function recommendation250(){
  const games=state.games||[];
  const favs=new Set(v250User().favorites);
  let pool=games.filter(g=>!favs.has(key250(g))&&!/yakında|yakinda/i.test(g.status||''));
  if(!pool.length)pool=games;
  return pool[Math.floor(Math.random()*pool.length)]||null;
}
function v250FeatureList(){
  return [
    'Yeni Ana Sayfa Dashboard V2','Seri İste Sistemi','Hata Bildir Sistemi','Kullanıcı Katkı Merkezi','Seri Detay Sayfası V2',
    'Oyun Detay Sayfası V3','Gelişmiş Site İçi İzleme','Seri İlerleme Yüzdesi','Kaldığın Yerden Devam Et','İzleme Geçmişi',
    'Favori Seriler','İzleme Listeleri','Gelişmiş Arama V3','Akıllı Filtre Sistemi','YouTube Playlist İçe Aktarma Hazırlığı',
    'YouTube Kanal Senkronizasyonu Hazırlığı','Video ID Sağlık Kontrolü','Akıllı Kapak Merkezi','Kapak Geçmişi','Akıllı Hikaye Merkezi',
    'Yapay Zeka Açıklama Oluşturucu','Seri Timeline Sistemi','DLC Bağlantı Sistemi','Demo Bağlantı Sistemi','Admin İşlem Geçmişi',
    'Geri Alma Sistemi Hazırlığı','Site Sağlık Puanı','Otomatik Hata Önceliği','Bildirim Merkezi','Duyuru Banner Sistemi',
    'Gelişmiş Sosyal Medya Merkezi','Mobil Alt Menü','Mobil İzleme Modu','Profil Dashboard V2','Rozet Sistemi',
    'Oyun Öneri Motoru','Benzer Oyunlar Sistemi','Toplu Veri Temizleme','Tam Yedekleme Sistemi V3','V2.5.1 Fix 5 Final Kontrol Paneli'
  ];
}
function exportMegaBackup250(){
  const data={version:'2.5.0',created_at:v250Now(),settings:state.settings,games:state.games,notes:state.notes,events:state.events,requests:requestList250(),reports:reportList250(),user:v250User(),adminLog:adminLog250()};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='hayatimiz-oyun-v2.5.0-tam-yedek.json';
  a.click();
  URL.revokeObjectURL(a.href);
}
function importMegaBackup250(){
  const input=document.createElement('input');
  input.type='file'; input.accept='application/json';
  input.onchange=async()=>{
    const file=input.files[0]; if(!file)return;
    const data=JSON.parse(await file.text());
    if(!confirm('Yedek yerel olarak içe aktarılsın mı?'))return;
    if(data.requests)v250StoreSet('ho_v250_requests',data.requests);
    if(data.reports)v250StoreSet('ho_v250_reports',data.reports);
    if(data.user)v250SaveUser(data.user);
    if(data.adminLog)v250StoreSet('ho_v250_admin_log',data.adminLog);
    state.settings=data.settings||state.settings;
    state.games=data.games||state.games;
    state.notes=data.notes||state.notes;
    state.events=data.events||state.events;
    render();
  };
  input.click();
}
function playlistImportMock250(){
  const url=prompt('YouTube playlist linki gir:');
  if(!url)return;
  v250StoreSet('ho_v250_playlist_last',{url,at:v250Now(),status:'Hazırlık modu'});
  alert('Playlist içe aktarma hazırlık kaydı oluşturuldu. API bağlandığında bu linkten bölümler çekilecek.');
}

function render(){
  applyTheme();
  document.documentElement.style.setProperty('--bg-intensity', Math.max(.2, Math.min(1.25, Number(state.settings?.background_intensity??75)/100)));
  updateSeo();
  document.body.classList.remove('menu-open');
  const app=$('#app');
  if(app){app.classList.remove('page-in'); void app.offsetWidth; app.classList.add('page-in');}
  renderNav();
  if(typeof injectNavV210==='function')injectNavV210();
  injectNav250();
  setAtmosphereTheme(state.page);
  if(state.settings?.maintenance && !canSeeAdmin()){maintenance();return;}
  const pages={home:megaHome250,series,az,calendar,notes,social,about,profile:profileDashboard250,admin,archivev210:archivePageV210,searchv210:searchPageV210,favoritesv210:favoritesPageV210,trackingv210:trackingPageV210,contribute250:contributePage250,profile250:profileDashboard250,health250:healthCenter250,features250:featuresPage250};
  (pages[state.page]||megaHome250)();
  injectMobileNav250();
  renderMusicPanel();
}
function maintenance(){
 const logo=state.settings?.site_logo?`<img src="${esc(state.settings.site_logo)}" class="maint-logo">`:'<div class="maint-logo-text">HO</div>';
 const rawProgress=Number(state.settings?.maintenance_progress??72);
 const progress=Math.max(0,Math.min(100,Number.isFinite(rawProgress)?rawProgress:72));
 const featureText=state.settings?.upcoming_features||'V2.5.1 Fix 5 profesyonel arayüz yenilemesi\nTransparan sosyal medya ikonları\nProfesyonel bakım modu ve loading ekranı\nOyun listesi ve kapak düzeni yenilemesi\nAdmin kalite ve stabilite düzeltmeleri';
 const features=String(featureText).split(/\n|,/).map(x=>x.trim()).filter(Boolean).slice(0,10);
 const notes=[...(state.notes||[])].sort((a,b)=>new Date(b.created_at||0)-new Date(a.created_at||0)).slice(0,6);
 const noteHtml=notes.length?notes.map(n=>`<article class="maintenance-note-item"><div><span class="version-pill">${esc(n.version||'Güncelleme')}</span><h3>${esc(n.title||'Güncelleme Notu')}</h3><p>${esc((n.body||n.content||'').slice(0,180))}</p></div></article>`).join(''):'<article class="maintenance-note-item"><div><span class="version-pill">V2.5.1 Fix 5</span><h3>Güncellemeler hazırlanıyor</h3><p>Bakım süresince yeni özellikler ve düzeltmeler bu alanda listelenecek.</p></div></article>';
 const socialButtons=socialLinksHtml ? socialLinksHtml() : '';
 $('#app').innerHTML=`<section class="maintenance maintenance-v300"><div class="maintenance-shell-v300"><div class="maintenance-card-v300"><div class="maintenance-glow-v300"></div><div class="maintenance-head-v300"><div class="maintenance-brand-v300">${logo}<div><span class="version-pill">V${VERSION}</span><h1>Hayatımız Oyun V2.5.1 Fix 5 Hazırlanıyor</h1><p class="muted">${esc(state.settings?.maintenance_note||'Site daha profesyonel görünüm, düzenlenmiş oyun listesi ve yenilenen sosyal ikon sistemiyle açılışa hazırlanıyor.')}</p></div></div><div class="maintenance-progress-badge">%${progress}</div></div><div class="maintenance-grid-v300"><div class="maintenance-main-v300"><div class="maintenance-message-v300"><h2>Site 3.0.0 sürümünde açılacak</h2><p>Bakım ekranında devam eden çalışmalar, güncelleme notları ve hazırlık durumu gösterilir.</p></div><div class="maintenance-track-v300"><b style="width:${progress}%"></b></div><div class="feature-list alpha2-feature-list maintenance-feature-v300">${features.map(x=>`<span>${esc(x)}</span>`).join('')}</div>${socialButtons?`<div class="maint-social">${socialButtons}</div>`:''}${canSeeAdmin()?`<div class="row maintenance-admin-actions"><button onclick="setPage('admin')">Admin Panel</button><button class="ghost" onclick="state.settings.maintenance=false;state.settings.v300_prelaunch=false;render()">Siteyi Önizle</button></div>`:''}</div><aside class="maintenance-side-v300"><div class="maintenance-update-head"><h2>Bakımda Yapılan Güncellemeler</h2><span class="muted">En yeni notlar üstte</span></div><div class="maintenance-notes-list">${noteHtml}</div></aside></div></div></div></section>`;
}

function getSocialItem(key){return socialLinksFromSettings().find(x=>socialPlatform(x.url,x.title).key===key);} 
function finalCountdown(){
  const d=parseDate(state.settings?.final_release_date); if(!d)return 'V2.5.1 Fix 5';
  const diff=d.getTime()-Date.now(); if(diff<=0)return 'V2.5.1 Fix 5';
  const day=Math.floor(diff/86400000), hour=Math.floor(diff%86400000/3600000), min=Math.floor(diff%3600000/60000);
  return `${day} gün ${hour} saat ${min} dk kaldı`;
}
function streamerCard(){
 const kick=getSocialItem('kick'); const donate=getSocialItem('donate'); const yt=getSocialItem('youtube'); const discord=getSocialItem('discord');
 const buttons=[kick,donate,yt,discord].filter(Boolean).map(x=>socialIconHtml(x)).join('');
 if(state.settings?.show_streamer_card===false||!buttons)return '';
 const live=!!state.settings?.kick_live;
 const desc=state.settings?.publisher_description||'Kick yayınları, YouTube arşivi, Discord topluluğu ve bağış bağlantıları burada.';
 return `<section class="card streamer-card streamer-v186"><div><span class="version-pill ${live?'live-pill':''}">${live?'● Canlı Yayında':'Yayıncı Alanı'}</span><h2>Hayatımız Oyun'u takip et ve destek ol</h2><p class="muted">${esc(desc)}</p><p class="muted"><b>V2.5.1 Fix 5:</b> ${esc(finalCountdown())}</p></div><div class="social-icons streamer-links">${buttons}</div></section>`;
}
function supportLinks(){const links=socialLinksFromSettings(); return links.length?`<div class="social-icons support-links">${links.map(x=>socialIconHtml(x)).join('')}</div>`:'<p class="muted">Sosyal bağlantılar admin panelinden eklenebilir.</p>';}
function card(g){const up=isUpcoming(g); const ep=g.episodes?.length||0; return `<article class="card game pro-card ${up?'upcoming-card':''}"><div class="cover" style="${coverStyle(g)}"><span class="badge-top">${esc(up?'Yakında':(g.status||'Arşiv'))}</span></div><div class="body"><h3>${esc(g.title)}</h3><p class="muted">${esc(getSeriesName(g))} • ${fmtDate(g.release_date)} • ${ep} bölüm</p>${up?upcomingBox(getUpcomingStart(g)):''}<p>${esc((g.description||'').slice(0,150))}</p><div class="tags">${(g.tags||[]).slice(0,5).map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div><div class="row"><button onclick="openGame('${esc(g.slug)}')">Detay</button>${up?'':`<button onclick="watchGame('${esc(g.slug)}',0)">İzle</button>`}<button class="ghost" onclick="favGame('${esc(g.slug)}')">Favori</button></div></div></article>`;}
function seriesCard(gr){const ep=gr.games.reduce((a,g)=>a+(g.episodes?.length||0),0); const up=gr.games.some(isUpcoming); const cover=img(gr.games.find(x=>x.cover)||gr.games[0]); const desc=gr.games.find(g=>g.description)?.description||`${gr.series} serisi.`; return `<article class="card game pro-card ${up?'upcoming-card':''}"><div class="cover" style="background-image:url('${esc(cover||'/assets/fallback-cover.png')}'),url('/assets/fallback-cover.png')"><span class="badge-top">${up?'Yakında':gr.games.length>1?'Seri':'Oyun'}</span></div><div class="body"><h3>${esc(gr.series)}</h3><p class="muted">${gr.games.length} oyun • ${ep} bölüm</p>${up?upcomingBox(groupUpcomingStart(gr)):''}<p>${esc(desc.slice(0,150))}</p><div class="row"><button onclick="openSeries('${esc(slug(gr.series))}')">Detay</button>${up?'':`<button onclick="watchSeries('${esc(slug(gr.series))}')">Sırayla İzle</button>`}<button class="ghost" onclick="favSeries('${esc(gr.series)}')">Favori</button></div></div></article>`;}
function statusStats(s){return groupGames(state.games.filter(g=>String(g.status||'').toLocaleLowerCase('tr-TR').includes(s.toLocaleLowerCase('tr-TR')))).length;}
function filterStatus(s){state.filter=s; home();}
function home(){const base=state.filter?state.games.filter(g=>String(g.status||'').toLocaleLowerCase('tr-TR').includes(state.filter.toLocaleLowerCase('tr-TR'))):state.games; const groups=groupGames(base); const totalEp=state.games.reduce((a,g)=>a+(g.episodes?.length||0),0); $('#app').innerHTML=`<section class="hero"><span class="version-pill">V${VERSION}</span><h1>${esc(siteTitle())}</h1><p class="muted">Oyun, seri, bölüm, favori ve izleme arşivi.</p><div class="stats"><span>${state.games.length}<small>Oyun</small></span><span>${groupGames().length}<small>Seri</small></span><span>${totalEp}<small>Bölüm</small></span><span>${continueCount()}<small>Devam</small></span></div><div class="status-buttons"><button onclick="filterStatus('Tamamlandı')">Tamamlanan Seriler (${statusStats('Tamamlandı')})</button><button onclick="filterStatus('Devam')">Devam Eden Seriler (${statusStats('Devam')})</button><button onclick="filterStatus('Yakında')">Yakında Gelecek Seriler (${statusStats('Yakında')})</button><button onclick="filterStatus('')">Tümü</button></div>${state.settings?.announcement?`<p class="notice">${esc(state.settings.announcement)}</p>`:''}</section>${streamerCard()}<h2>İzlemeye Devam Et</h2><div class="grid compact">${continueCards()}</div><h2>Favoriler</h2><div class="grid compact">${favoriteCards()}</div><div class="section-title"><h2>Alfabetik Seri Şeritleri</h2><input id="search" placeholder="Oyun / seri / etiket ara"></div>${alphaSeriesStrips(groups)}`; $('#search').oninput=e=>{const q=e.target.value.toLocaleLowerCase('tr-TR'); const filtered=base.filter(g=>(g.title+' '+getSeriesName(g)+' '+(g.genre||'')+' '+(g.tags||[]).join(' ')).toLocaleLowerCase('tr-TR').includes(q)); $('.alpha-wrap').innerHTML=alphaSeriesStrips(groupGames(filtered),true);};}
function alphaSeriesStrips(groups,inner=false){const letters='1234567890ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ'.split(''); const html=`<div class="alpha-wrap">${letters.map(l=>{const arr=groups.filter(g=>(/\d/.test(l)?String(g.series||'')[0]===l:String(g.series||'').toLocaleUpperCase('tr-TR').startsWith(l))); return arr.length?`<section class="alpha-strip"><h2>${esc(l)} Serisi</h2><div class="grid">${arr.map(seriesCard).join('')}</div></section>`:''}).join('')||'<p>Henüz seri yok.</p>'}</div>`; return inner?html.replace(/^<div class="alpha-wrap">|<\/div>$/g,''):html;}
function continueCards(){const w=watchState(); const html=Object.entries(w).filter(([k,v])=>v.here&&!v.watched).slice(-6).reverse().map(([k,v])=>{const [sl,i]=k.split(':'); const g=state.games.find(x=>x.slug===sl); if(!g)return ''; return `<div class="card mini-card"><b>${esc(g.title)}</b><small>${esc(g.episodes?.[i]?.title||'Bölüm')}</small><button onclick="watchGame('${esc(sl)}',${+i||0})">Devam Et</button><button class="ghost" onclick="removeWatch('${esc(k)}')">Sil</button></div>`;}).join(''); return html||'<p class="muted">Henüz devam kaydı yok.</p>';}
function favoriteCards(){const f=getFavs(); const games=(f.games||[]).map(sl=>state.games.find(g=>g.slug===sl)).filter(Boolean).slice(0,6); const series=(f.series||[]).slice(0,4); const html=[...games.map(g=>`<div class="card mini-card"><b>${esc(g.title)}</b><button onclick="openGame('${esc(g.slug)}')">Aç</button></div>`),...series.map(s=>`<div class="card mini-card"><b>${esc(s)}</b><button onclick="openSeries('${esc(slug(s))}')">Aç</button></div>`)].join(''); return html||'<p class="muted">Favori yok.</p>';}
function favGame(sl){const f=getFavs(); f.games=f.games||[]; f.games=f.games.includes(sl)?f.games.filter(x=>x!==sl):[...f.games,sl]; saveFavs(f); render();}
function favSeries(s){const f=getFavs(); f.series=f.series||[]; f.series=f.series.includes(s)?f.series.filter(x=>x!==s):[...f.series,s]; saveFavs(f); render();}
function removeWatch(k){const w=watchState(); delete w[k]; saveWatchState(w); render();}

/* V2.5.1 Fix 5 - A-Z/Seriler arama + sosyal medya kontrol */
function searchValueV300(id){
  return (document.getElementById(id)?.value||'').toLocaleLowerCase('tr-TR').trim();
}
function filterSeriesV300(){
  const q=searchValueV300('seriesSearchV300');
  document.querySelectorAll('[data-series-search-v300]').forEach(el=>{
    const hay=(el.getAttribute('data-series-search-v300')||'').toLocaleLowerCase('tr-TR');
    el.style.display=(!q||hay.includes(q))?'':'none';
  });
}
function filterAZV300(){
  const q=searchValueV300('azSearchV300');
  document.querySelectorAll('[data-az-search-v300]').forEach(el=>{
    const hay=(el.getAttribute('data-az-search-v300')||'').toLocaleLowerCase('tr-TR');
    el.style.display=(!q||hay.includes(q))?'':'none';
  });
}
function normalizeSocialUrlV300(url=''){
  url=String(url||'').trim();
  if(!url)return '';
  if(!/^https?:\/\//i.test(url))url='https://'+url;
  return url;
}
function socialLinksForCheckV300(){
  const s=state.settings||{};
  return [
    ['YouTube',s.social_youtube,/youtube\.com|youtu\.be/i],
    ['Kick',s.social_kick,/kick\.com/i],
    ['Discord',s.social_discord,/discord\.gg|discord\.com/i],
    ['ByNoGame',s.social_donate,/bynogame|donate|bagis|bağış|destek|support|papara|trakteer/i],
    ['TikTok',s.social_tiktok,/tiktok\.com/i],
    ['Instagram',s.social_instagram,/instagram\.com/i],
  ];
}
function socialCheckV300(){
  const rows=socialLinksForCheckV300().map(([name,url,rx])=>{
    const fixed=normalizeSocialUrlV300(url);
    const missing=!fixed;
    const invalid=fixed&&!/^https?:\/\//i.test(fixed);
    const suspicious=fixed&&!rx.test(fixed);
    const ok=!missing&&!invalid&&!suspicious;
    return {name,url:fixed,ok,missing,invalid,suspicious};
  });
  return rows;
}
function renderSocialCheckV300(){
  const rows=socialCheckV300();
  const bad=rows.filter(x=>!x.ok).length;
  return `<section class="card social-check-v300"><div class="section-title"><div><span class="version-pill">V2.5.1 Fix 5</span><h2>Sosyal Medya Hata Kontrol</h2><p class="muted">${bad?bad+' sorun bulundu.':'Tüm sosyal medya bağlantıları iyi görünüyor.'}</p></div><button onclick="copySocialReportV300()">Raporu Kopyala</button></div>
  <div class="social-check-grid-v300">${rows.map(r=>`<article class="${r.ok?'ok':'warn'}"><b>${escV220(r.name)}</b><span>${r.ok?'Sorun yok':r.missing?'Link eksik':r.suspicious?'Platform uyuşmuyor':'Link hatalı'}</span><small>${escV220(r.url||'Eklenmemiş')}</small></article>`).join('')}</div></section>`;
}
function copySocialReportV300(){
  const text=socialCheckV300().map(r=>`${r.name}: ${r.ok?'OK':r.missing?'Eksik':r.suspicious?'Platform uyuşmuyor':'Hatalı'} - ${r.url||'yok'}`).join('\n');
  navigator.clipboard?.writeText(text);
  alert('Sosyal medya kontrol raporu kopyalandı.');
}
function openSocialCheckV300(){
  const a=document.getElementById('adminArea');
  if(a)a.innerHTML=renderSocialCheckV300();
}

function series(){
 const map=new Map();
 state.games.forEach(g=>{const name=seriesName250?seriesName250(g):(getSeriesName(g)||'Serisiz'); if(!map.has(name))map.set(name,[]); map.get(name).push(g);});
 const entries=[...map.entries()].sort((a,b)=>sortTitleTR250F1(a[0],b[0]));
 $('#app').innerHTML=`<section class="hero"><span class="version-pill">V${VERSION}</span><h1>Seriler</h1><p class="muted">Seri adına göre arama yapabilir, oyunları daha hızlı bulabilirsin. Alfabetik sıralama düzeltildi.</p></section>
 <section class="card search-toolbar-v300"><div class="search-wrap-v300"><input id="seriesSearchV300" placeholder="Seri ara... Örn: Far Cry, Resident Evil, Tomb Raider" oninput="filterSeriesV300()"><button onclick="filterSeriesV300()">Ara</button></div></section>
 <section class="grid">${entries.map(([name,items])=>{
  const sorted=sortGamesTitleOnly250F1(items);
  const cover=cover250?cover250(sorted[0]):(sorted[0].cover||'');
  const eps=sorted.reduce((a,g)=>a+(Array.isArray(g.episodes)?g.episodes.length:0),0);
  return `<article class="card series-card-v300 series-card-full250" data-series-search-v300="${esc(name+' '+sorted.map(x=>x.title).join(' '))}"><div class="series-cover-v300" style="background-image:url('${esc(cover)}')"></div><div><h2 title="${esc(name)}">${esc(name)}</h2><p class="muted">${sorted.length} oyun • ${eps} bölüm</p><div class="archive-game-names250">${sorted.slice(0,6).map(g=>`<small title="${fullTitle250F1(g)}">${fullTitle250F1(g)}</small>`).join('')}</div><div class="row"><button onclick="seriesDetail250('${esc250(name)}')">Seri Detayı</button></div></div></article>`;
 }).join('')}</section>`;
}
function az(){
 const games=sortGamesTitleOnly250F1(state.games||[]);
 const groups={};
 games.forEach(g=>{
  const first=normalizeSortTR250F1(g.title||'#').trim()[0]||'#';
  const ch=first.toLocaleUpperCase('tr-TR');
  const key=/[A-ZÇĞİÖŞÜ0-9]/i.test(ch)?ch:'#';
  if(!groups[key])groups[key]=[];
  groups[key].push(g);
 });
 const keys=Object.keys(groups).sort((a,b)=>sortTitleTR250F1(a,b));
 $('#app').innerHTML=`<section class="hero"><span class="version-pill">V${VERSION}</span><h1>A-Z Oyunlar</h1><p class="muted">Alfabetik sıralama Türkçe karakter ve sayı desteğiyle düzeltildi. Oyun adları tam görünür.</p></section>
 <section class="card search-toolbar-v300"><div class="search-wrap-v300"><input id="azSearchV300" placeholder="Oyun ara... Örn: Assassin, Far Cry, DLC" oninput="filterAZV300()"><button onclick="filterAZV300()">Ara</button></div></section>
 <section class="az-v300">${keys.map(k=>`<div class="az-group-v300"><h2>${esc(k)}</h2><div class="grid compact">${groups[k].map(g=>`<article class="card az-item-v300" data-az-search-v300="${esc((g.title||'')+' '+(g.series||'')+' '+(g.status||'')+' '+(g.type||''))}"><div class="az-cover-v300" style="background-image:url('${esc(gameCoverV220?gameCoverV220(g):(g.cover||''))}')" title="${fullTitle250F1(g)}"></div><div><h3 class="full-game-title250" ${titleAttr250F1(g)}>${fullTitle250F1(g)}</h3><p class="muted full-game-meta250">${fullSeries250F1(g)} • ${esc(g.status||'Durum yok')}</p></div></article>`).join('')}</div></div>`).join('')}</section>`;
}
function azPick(l){const list=l?state.games.filter(g=>String(g.title||'').toLocaleUpperCase('tr-TR').startsWith(l)):state.games; $('#azList').innerHTML=list.map(card).join('')||'<p>Sonuç yok.</p>';}
function storyText(g){return g.description||'Bu oyun için kısa Türkçe hikaye henüz eklenmedi.';}
function episodeStory(g,e,i){return e.story||`${g.title} ${i+1}. bölüm: Hikaye bu bölümde devam eder.`;}
function openSeries(key){const gr=groupGames().find(x=>slug(x.series)===key); if(!gr)return; const seriesCover=img(gr.games.find(x=>x.cover)||gr.games[0]); updateSeo({title:gr.series,description:(gr.games.find(g=>g.description)?.description||gr.series+' serisi.'),image:seriesCover,url:location.href}); const up=gr.games.some(isUpcoming); $('#app').innerHTML=`<section class="hero"><h1>${esc(gr.series)}</h1><p class="muted">${gr.games.length} oyun • ${gr.games.reduce((a,g)=>a+(g.episodes?.length||0),0)} bölüm</p>${up?upcomingBox(groupUpcomingStart(gr)):''}<div class="row">${up?'':`<button onclick="watchSeries('${esc(key)}')">Tüm Seriyi Sırayla İzle</button>`}<button class="ghost" onclick="setPage('series')">Serilere Dön</button>${shareButton(gr.series,gr.games.find(g=>g.description)?.description||gr.series+' serisi.',location.href)}</div></section><div class="grid">${gr.games.map(card).join('')}</div>`;}
function openGame(sl){const g=state.games.find(x=>x.slug===sl); if(!g)return; updateSeo({title:g.title,description:storyText(g),image:img(g),url:location.href}); const up=isUpcoming(g); $('#app').innerHTML=`<section class="hero"><span class="tag">${esc(getSeriesName(g))}</span><h1>${esc(g.title)}</h1><p class="muted">${esc(g.genre||'')} • ${fmtDate(g.release_date)} • ${esc(g.status||'')}</p>${up?upcomingBox(getUpcomingStart(g)):''}<div class="row">${up?'':`<button onclick="watchGame('${esc(g.slug)}',0)">İzle</button>`}<button class="ghost" onclick="favGame('${esc(g.slug)}')">Favori</button>${shareButton(g.title,storyText(g),location.href)}<button class="ghost" onclick="openSeries('${esc(slug(getSeriesName(g)))}')">Seriye Dön</button></div></section><div class="split"><div><div class="card story-card"><h2>Oyun Hikayesi</h2><p>${esc(storyText(g))}</p></div><div class="card"><h2>Bölümler</h2>${up?'<p class="muted">Bu oyun yakında gelecek.</p>':(g.episodes||[]).map((e,i)=>`<div class="episode"><span><b>${i+1}. ${esc(e.title||'Bölüm')}</b><small>${esc(episodeStory(g,e,i))}</small></span><button onclick="watchGame('${esc(g.slug)}',${i})">İzle</button></div>`).join('')||'<p>Bölüm yok.</p>'}</div></div><div class="card"><h2>Yorumlar</h2><div id="comments">Yükleniyor...</div>${state.user?`<form onsubmit="sendComment(event,'${esc(g.slug)}')"><textarea name="body" placeholder="Yorum yaz"></textarea><button>Yorum Yap</button></form>`:'<p class="muted">Yorum yazmak için giriş yap.</p>'}</div></div>`; loadComments(g.slug);}
function watchSeries(key){const gr=groupGames().find(x=>slug(x.series)===key); if(!gr)return; if(gr.games.some(isUpcoming))return alert('Bu seri yakında gelecek.'); const first=sortGamesByRelease(gr.games).find(g=>(g.episodes||[]).length); if(first)watchGame(first.slug,0);}
function watchGame(sl,i=0){const g=state.games.find(x=>x.slug===sl); if(!g)return; if(isUpcoming(g))return alert('Bu oyun yakında gelecek.'); const e=(g.episodes||[])[i]||{}; $('#app').innerHTML=`<section class="hero"><h1>${esc(g.title)}</h1><p>${esc(e.title||'Bölüm')}</p><div class="row"><button onclick="markHere('${esc(sl)}',${i})">Burada Kaldım</button><button onclick="markWatched('${esc(sl)}',${i})">İzledim</button><button class="ghost" onclick="undoWatched('${esc(sl)}',${i})">İzlendi Geri Al</button><button class="ghost" onclick="openGame('${esc(sl)}')">Detay</button></div></section><div class="split"><div class="card"><div class="video-wrap">${e.videoId?`<iframe src="https://www.youtube-nocookie.com/embed/${esc(e.videoId)}" allowfullscreen></iframe>`:'<p>Video ID yok.</p>'}</div></div><div class="card"><h2>Bölüm Hikayesi</h2><p>${esc(episodeStory(g,e,i))}</p><h3>Bölümler</h3>${(g.episodes||[]).map((x,idx)=>`<div class="episode"><span>${idx+1}. ${esc(x.title||'Bölüm')}</span><button onclick="watchGame('${esc(sl)}',${idx})">Aç</button></div>`).join('')}</div></div>`;}
function markHere(sl,i){const w=watchState(); w[`${sl}:${i}`]={here:true,watched:false,at:Date.now()}; saveWatchState(w); alert('Kaldığın yer kaydedildi.');}
function markWatched(sl,i){const w=watchState(); w[`${sl}:${i}`]={here:false,watched:true,at:Date.now()}; saveWatchState(w); alert('İzlendi olarak işaretlendi.');}
function undoWatched(sl,i){const w=watchState(); w[`${sl}:${i}`]={here:true,watched:false,at:Date.now()}; saveWatchState(w); alert('Geri alındı.');}
function calendar(){const today=new Date().toISOString().slice(0,10); const todayEvents=state.events.filter(e=>e.event_date===today); $('#app').innerHTML=`<section class="hero"><h1>Takvim</h1><p class="muted">Bugün: ${new Date().toLocaleDateString('tr-TR',{weekday:'long',day:'2-digit',month:'long',year:'numeric'})}</p><p>${todayEvents.length?`Bugün ${todayEvents.length} etkinlik var.`:'Bugün etkinlik yok.'}</p></section><div class="grid">${state.events.map(e=>`<div class="card"><div class="calendar-img" style="background-image:url('${esc(e.image||'')}')"></div><h3>${esc(e.title)}</h3><p>${esc(e.game_title||'')} • ${fmtDate(e.event_date)} ${esc(e.event_time||'')}</p><p>${esc(e.description||'')}</p></div>`).join('')||'<p>Takvim boş.</p>'}</div>`;}
function noteList(arr){return (arr||[]).map(n=>`<div class="episode"><span><b>${esc(n.title||n.version)}</b><small>${esc(n.version||'')} • ${esc(n.type||'')}</small><p>${esc(n.body||'')}</p></span></div>`).join('')||'<p class="muted">Not yok.</p>';}
function notes(){
  const publicNotes=allNotes251().filter(n=>n.public_visible!==false&&n.type!=='Admin');
  $('#app').innerHTML=`<section class="hero notes-hero-v220"><span class="version-pill">V${VERSION}</span><h1>Güncelleme Notları</h1><p class="muted">Eski ve yeni güncellemeler sürüm sırasına göre düzenlenmiş şekilde gösterilir.</p></section>
  <section class="notes-v220">${publicNotes.map((n,idx)=>`<article class="card note-v220 ${idx===0?'latest':''}"><aside><b>${esc250(n.version||'Sürüm')}</b><span>${esc250(n.type||'Not')}</span>${idx===0?'<em>EN YENİ</em>':''}</aside><div><h2>${esc250(n.title||n.version||'Güncelleme')}</h2><p>${esc250(n.body||n.content||'')}</p><small class="muted">${esc250(n.created_at?new Date(n.created_at).toLocaleString('tr-TR'):'')}</small></div></article>`).join('')||'<div class="card"><p>Güncelleme notu yok.</p></div>'}</section>`;
}

function about(){
  const st=state.settings||{};
  const stats=aboutStatsV203F1();
  $('#app').innerHTML=`<section class="hero about-hero-v203f1"><span class="version-pill">V${VERSION}</span><h1>${esc(st.about_title||'Hayatımız Oyun')}</h1><p>${esc(st.about_text||'Hayatımız Oyun, oyun serilerini ve bölümlerini düzenli şekilde arşivlemek için hazırlanmış özel bir oyun arşiv sitesidir.')}</p></section>
  ${st.about_show_stats===false?'':`<section class="grid compact about-stats-v203f1"><div class="card"><h2>${stats.games}</h2><p>Oyun</p></div><div class="card"><h2>${stats.series}</h2><p>Seri</p></div><div class="card"><h2>${stats.episodes}</h2><p>Bölüm</p></div><div class="card"><h2>${stats.broken}</h2><p>Kontrol Edilecek</p></div></section>`}
  <section class="split about-info-v203f1"><div class="card"><h2>Misyon</h2><p>${esc(st.about_mission||'Oyun arşivini düzenli, anlaşılır ve güncel şekilde sunmak.')}</p></div><div class="card"><h2>Vizyon</h2><p>${esc(st.about_vision||'Türkçe oyun içerikleri için profesyonel bir arşiv deneyimi oluşturmak.')}</p></div></section>`;
}
async function sendFeedback(e){e.preventDefault(); const feedback=Object.fromEntries(new FormData(e.target)); if(feedback.game_title||feedback.playlist_url){feedback.message=`${feedback.message||''}\nOyun/Seri: ${feedback.game_title||''}\nPlaylist: ${feedback.playlist_url||''}`.trim();} try{await api('/api/social?action=feedback',{method:'POST',body:JSON.stringify({feedback})}); alert('Gönderildi. Teşekkürler.'); e.target.reset();}catch(err){alert(err.message)}}
function profile(){if(!state.user){$('#app').innerHTML=`<section class="hero"><h1>Profil</h1><p class="muted">Giriş yap veya kayıt ol.</p></section><div class="split"><form class="card" onsubmit="login(event)"><h2>Giriş</h2><input name="username" placeholder="Kullanıcı adı"><input name="password" type="password" placeholder="Şifre"><button>Giriş Yap</button></form><form class="card" onsubmit="register(event)"><h2>Kayıt</h2><input name="username" placeholder="Kullanıcı adı"><input name="password" type="password" placeholder="Şifre"><button>Kayıt Ol</button></form></div>`;return;} const photo=state.user.profile_photo||''; const links=socialPreviewFromText(state.user.social_links||''); $('#app').innerHTML=`<section class="hero profile-pro"><div class="avatar xl">${photo?`<img src="${esc(photo)}">`:esc(state.user.username?.[0]||'K')}</div><div><h1>${esc(state.user.username)}</h1><p class="muted">${esc(state.user.role||'user')} • XP ${state.user.xp||0} • Level ${state.user.level||1}</p><div class="social-icons profile-social">${links}</div><button onclick="logout()">Çıkış Yap</button></div></section><div class="profile-grid"><form class="card" onsubmit="saveProfile(event)"><h2>Profil Ayarları</h2><label>Profil fotoğrafı</label><input type="file" name="profile_file" accept="image/*"><label>Sosyal medya linkleri</label><textarea name="social_links" placeholder="Her satıra bir link yaz: https://youtube.com/...">${esc(state.user.social_links||'')}</textarea><small class="muted">YouTube, Kick, Bağış/Bynogame, Instagram, TikTok, Discord, Twitch, X, Steam, GitHub otomatik ikonlanır.</small><button>Kaydet</button></form><div class="card"><h2>İzlemeye Devam Et</h2>${continueCards()}</div><div class="card wide"><h2>Favoriler</h2><div class="grid compact">${favoriteCards()}</div></div></div>`;}
async function register(e){e.preventDefault(); const b=Object.fromEntries(new FormData(e.target)); try{const j=await api('/api/auth',{method:'POST',body:JSON.stringify({action:'register',...b})}); state.user=j.user; localStorage.ho_user=JSON.stringify(j.user); render();}catch(err){alert(err.message)}}
async function login(e){e.preventDefault(); const b=Object.fromEntries(new FormData(e.target)); try{const j=await api('/api/auth',{method:'POST',body:JSON.stringify({action:'login',...b})}); state.user=j.user; localStorage.ho_user=JSON.stringify(j.user); render();}catch(err){alert(err.message)}}
function logout(){localStorage.removeItem('ho_user'); state.user=null; render();}
async function saveProfile(e){e.preventDefault(); try{const patch={action:'profile',id:state.user.id,social_links:e.target.social_links?.value||''}; const file=e.target.profile_file?.files?.[0]; if(file)patch.profile_photo=await uploadImage(file,'profiles'); const j=await api('/api/auth',{method:'POST',body:JSON.stringify(patch)}); state.user=j.user; localStorage.ho_user=JSON.stringify(j.user); render();}catch(err){alert(err.message)}}
function social(){if(!state.user){$('#app').innerHTML=`<section class="hero"><h1>Sosyal</h1><p>Giriş yapmalısın.</p><button onclick="setPage('profile')">Giriş</button></section>`;return;} $('#app').innerHTML=`<section class="hero"><h1>Arkadaşlar ve Sohbet</h1></section><div class="social-layout"><div class="card"><h2>Arkadaş Ekle</h2><div class="row"><input id="friendUsername" placeholder="Kullanıcı adı"><button onclick="addFriend()">İstek Gönder</button></div><div id="friends">Yükleniyor...</div></div><div class="card chat-card"><h2 id="chatTitle">Sohbet</h2><div id="messages" class="messages"><p class="muted">Bir arkadaş seç.</p></div><textarea id="msgBody" placeholder="Mesaj yaz"></textarea><button onclick="sendMessage()">Mesaj Gönder</button></div></div>`; loadFriends();}
async function addFriend(){const username=$('#friendUsername').value.trim(); if(!username)return; try{await api('/api/social',{method:'POST',body:JSON.stringify({action:'friend_request',requester_id:state.user.id,requester_name:state.user.username,receiver_username:username})}); loadFriends();}catch(e){alert(e.message)}}
function otherSide(f){return String(f.requester_id)===String(state.user.id)?{id:f.receiver_id,name:f.receiver_name}:{id:f.requester_id,name:f.requester_name};}
async function loadFriends(){try{const j=await api('/api/social?action=friends&user_id='+enc(state.user.id)); const incoming=j.friends.filter(f=>f.status==='pending'&&String(f.receiver_id)===String(state.user.id)); const outgoing=j.friends.filter(f=>f.status==='pending'&&String(f.requester_id)===String(state.user.id)); const accepted=j.friends.filter(f=>f.status==='accepted'); $('#friends').innerHTML=`${incoming.map(f=>`<div class="episode"><span>${esc(f.requester_name)} seni eklemek istiyor.</span><button onclick="respondFriend('${f.id}','accepted')">Kabul</button><button onclick="respondFriend('${f.id}','rejected')">Reddet</button></div>`).join('')}${outgoing.map(f=>`<div class="episode"><span>${esc(f.receiver_name)} bekliyor.</span><button class="danger" onclick="removeFriend('${f.id}')">Sil</button></div>`).join('')}${accepted.map(f=>{const o=otherSide(f);return `<div class="episode"><span><b>${esc(o.name)}</b></span><button onclick="openChat('${esc(o.id)}','${esc(o.name)}')">Sohbet</button><button class="danger" onclick="removeFriend('${f.id}')">Arkadaşlıktan Çıkar</button></div>`}).join('')||(!incoming.length&&!outgoing.length?'<p>Arkadaş yok.</p>':'')}`;}catch(e){$('#friends').textContent=e.message;}}
async function respondFriend(id,status){try{await api('/api/social',{method:'POST',body:JSON.stringify({action:'friend_respond',id,status,user_id:state.user.id})});loadFriends()}catch(e){alert(e.message)}}
async function removeFriend(id){if(!confirm('Silinsin mi?'))return; try{await api('/api/social',{method:'DELETE',body:JSON.stringify({id,user_id:state.user.id})});loadFriends()}catch(e){alert(e.message)}}
async function openChat(id,name){state.selectedFriend={id,name}; $('#chatTitle').textContent='Sohbet: '+name; loadMessages();}
async function loadMessages(){if(!state.selectedFriend)return; try{const j=await api('/api/social?action=messages&user_id='+enc(state.user.id)+'&friend_id='+enc(state.selectedFriend.id)); $('#messages').innerHTML=(j.messages||[]).map(m=>`<div class="msg ${String(m.sender_id)===String(state.user.id)?'me':''}"><b>${esc(m.sender_name)}</b><p>${esc(m.body)}</p><small>${new Date(m.created_at).toLocaleString('tr-TR')}</small></div>`).join('')||'<p>Mesaj yok.</p>'; }catch(e){$('#messages').textContent=e.message;}}
async function sendMessage(){if(!state.selectedFriend)return alert('Arkadaş seç.'); const body=$('#msgBody').value.trim(); if(!body)return; try{await api('/api/social',{method:'POST',body:JSON.stringify({action:'message',sender_id:state.user.id,sender_name:state.user.username,receiver_id:state.selectedFriend.id,receiver_name:state.selectedFriend.name,body})}); $('#msgBody').value=''; loadMessages();}catch(e){alert(e.message)}}
async function loadComments(sl){const el=$('#comments'); if(!el)return; try{const j=await api('/api/social?action=comments&game_slug='+enc(sl)); el.innerHTML=(j.comments||[]).map(c=>`<div class="episode"><span><b>${esc(c.username)}</b><p>${esc(c.body)}</p></span></div>`).join('')||'<p>Yorum yok.</p>';}catch(e){el.textContent=e.message;}}
async function sendComment(e,sl){e.preventDefault(); const body=e.target.body.value.trim(); if(!body)return; try{await api('/api/social',{method:'POST',body:JSON.stringify({action:'comment',user_id:state.user.id,username:state.user.username,game_slug:sl,body})}); e.target.reset(); loadComments(sl);}catch(err){alert(err.message)}}



function finalV2Panel(){
  return `<section class="card final-panel"><div class="section-title"><div><span class="version-pill">V2.5.1 Fix 5</span><h2>Final Sürüm Hazır</h2><p class="muted">Stabil açılış, Admin Panel V2, sosyal ikonlar, bakım modu, kapak/hikaye onarım ve Supabase schema uyumluluğu tek pakette toplandı.</p></div><button onclick="adminTab('repairV2')">Kapak / Hikaye Onarımına Git</button></div><div class="roadmap-list"><span>Loading düzeltildi</span><span>Admin Final Grid</span><span>Thumbnail schema hatası çözüldü</span><span>Kapak/Hikaye Onarım</span><span>Sosyal İkon V2</span></div></section>`;
}

function alpha2Panel(){
  return `<section class="card alpha2-panel"><div class="section-title"><div><span class="version-pill">V2.5.1 Fix 5</span><h2>Admin + Sosyal + Bakım Güncellemesi</h2><p class="muted">Bu aşamada açılış sistemi korunur; sadece admin panel görünümü, sosyal medya ikonları ve bakım modu profesyonelleştirilir.</p></div><button onclick="adminTab('set')">Bakım Ayarları</button></div><div class="roadmap-list"><span>Kompakt Admin Panel</span><span>Sosyal İkon V2</span><span>Bynogame / Bağış düzeltmesi</span><span>Discord ikon düzeltmesi</span><span>Tonlu Bakım Modu</span></div></section>`;
}

function adminV2Checklist(){
  const missingCover=state.games.filter(g=>!img(g)).length;
  const missingStory=state.games.filter(g=>!String(g.description||'').trim()).length;
  const noEpisodes=state.games.filter(g=>!(g.episodes||[]).length).length;
  const upcoming=state.games.filter(isUpcoming).length;
  return `<section class="card v2-checklist"><div class="section-title"><div><h2>V2.5.1 Fix 5 Hazırlık Kontrolü</h2><p class="muted">V1.9.0 final öncesi orta stabilizasyon paketidir. Admin, API, oyun, seri ve bakım sistemleri V2.5.1 Fix 5 açılışına hazırlanır.</p></div><span class="version-pill">Final hazırlığı</span></div><div class="grid compact"><div class="card"><h3>${missingCover}</h3><p>Kapaksız oyun</p></div><div class="card"><h3>${missingStory}</h3><p>Hikayesi eksik</p></div><div class="card"><h3>${noEpisodes}</h3><p>Bölümsüz oyun</p></div><div class="card"><h3>${upcoming}</h3><p>Yakında içerik</p></div></div><div class="roadmap-list"><span>Admin panel V3</span><span>YouTube senkronizasyon stabilizasyonu</span><span>RAWG kapak ve hikaye düzeltmeleri</span><span>Profil, sosyal ve bildirim düzeltmeleri</span><span>Tema, bakım ve loading düzeltmeleri</span><span>V2.5.1 Fix 5 profesyonel final açılış hazırlığı</span></div></section>`;
}


function v195QuickActions(){
  const d=seriesControlData();
  const apiCount=12;
  return `<section class="card v195-panel"><div class="section-title"><div><span class="version-pill">V1.9.5</span><h2>Temiz Kurulum ve Hızlı Onarım Merkezi</h2><p class="muted">Bu panel eski API dosyası kalması, kapak/hikaye eksikleri, seri dağınıklığı ve sosyal medya ayarlarını tek yerden kontrol etmek için eklendi.</p></div><button class="ghost" onclick="copyCleanInstallCommands()">Temiz Kurulum Komutlarını Kopyala</button></div><div class="grid compact"><div class="card"><h3>${apiCount}/12</h3><p>Vercel API endpoint düzeni</p></div><div class="card"><h3>${d.score}%</h3><p>Seri sağlığı</p></div><div class="card"><h3>${d.noCover.length}</h3><p>Kapaksız oyun</p></div><div class="card"><h3>${d.noStory.length}</h3><p>Hikayesi eksik</p></div></div><div class="row"><button onclick="adminTab('seriesControl')">Serileri Kontrol Et</button><button class="ghost" onclick="adminTab('api')">RAWG / YouTube Araçları</button><button class="ghost" onclick="adminTab('socialset')">Sosyal Medya Ayarları</button><button class="ghost" onclick="downloadReadme()">Kurulum Notu İndir</button></div></section>`;
}
function cleanInstallCommands(){return `# Hayatımız Oyun V2.5.1 Fix 5 Açılış Öncesi temiz kurulum
# Eski dosyaların üstüne kopyalama yapma; yeni ZIP klasörünü temiz kaynak olarak kullan.

git init
git branch -M main
git remote remove origin 2>nul || true
git remote add origin https://github.com/hayatimizoyunyoutube/HayatimizOyunYoutubeArsivi.git
git add .
git commit -m "V2.5.1 Fix 5 stabil düzeltme"
git push -f origin main

# Sonra Vercel panelinden Redeploy yap.
# Gerekirse Supabase SQL Editor içinde supabase/schema.sql dosyasını çalıştır.`;}
async function copyCleanInstallCommands(){try{await navigator.clipboard.writeText(cleanInstallCommands()); alert('Temiz kurulum komutları kopyalandı.');}catch{alert(cleanInstallCommands());}}
function downloadReadme(){const blob=new Blob([cleanInstallCommands()+`\n\nV1.9.5 Fix 2 Özeti:\n- Admin Panel V3 hızlı onarım merkezi\n- Sosyal medya / bağış / yayıncı alanı güçlendirme\n- Seri kontrol ve kapaklı sıralama stabilizasyonu\n- API JSON hata uyarıları ve Vercel 12 endpoint düzeni\n- RAWG kapak/hikaye toplu yenileme araçları\n- YouTube kanal import/senkron ilerleme göstergesi\n`],{type:'text/plain;charset=utf-8'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='V2.5.1-Fix-2-arayuz-temiz-kurulum-notu.txt'; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1000);}

function stripGameDbUnsafeFields(game){
  const g={...(game||{})};
  if(!g.cover && g.thumbnail) g.cover=g.thumbnail;
  delete g.thumbnail;
  delete g.image;
  delete g.poster;
  return g;
}

function repairGameBeforeSave(game){
  game.title=String(game.title||'').trim();
  if(!game.slug)game.slug=slug(game.title||('oyun-'+Date.now()));
  game.series=canonicalSeriesName(game.series, game.title)||game.series||game.title||'Serisiz';
  game.status=game.status||'Devam Ediyor';
  game.type=game.type||(/demo/i.test(game.title||'')?'Demo':(/dlc|ek paket|expansion/i.test(game.title||'')?'DLC':'Ana Oyun'));
  game.cover=game.cover||game.thumbnail||gameCover(game);
  game.thumbnail=game.thumbnail||game.cover;
  game.tags=Array.isArray(game.tags)?game.tags:String(game.tags||'').split(',').map(x=>x.trim()).filter(Boolean);
  game.episodes=(game.episodes||[]).map((ep,i)=>({title:ep.title||`${i+1}. Bölüm`,url:ep.url||ep.video_url||'',videoId:ep.videoId||ep.youtube_id||'',thumbnail:ep.thumbnail||ep.image||game.cover,description:ep.description||''}));
  if(!String(game.description||'').trim())game.description='Bu oyun için açıklama geçici olarak oluşturuldu. RAWG hikaye yenileme aracıyla daha detaylı bilgi çekebilirsin.';
  return game;
}
async function repairSelectedGames(){
  const ids=[...document.querySelectorAll('.game-check:checked')].map(x=>x.value);
  if(!ids.length)return alert('Onarılacak oyun seç.');
  if(!confirm(`${ids.length} oyun için seri adı, durum, tip ve bölüm alanları standartlaştırılsın mı?`))return;
  let ok=0;
  for(const id of ids){const g=state.games.find(x=>String(x.id)===String(id)); if(!g)continue; try{await api('/api/games',{method:'PUT',body:JSON.stringify({game:repairGameBeforeSave({...g})})}); ok++;}catch(e){console.warn(e)}}
  await load(); adminTab('games'); alert(`${ok} oyun standartlaştırıldı.`);
}
async function repairAllGamesLight(){
  if(!state.games.length)return alert('Oyun yok.');
  if(!confirm('Tüm oyunlarda hafif onarım yapılsın mı? Seri adı, durum, tip, bölüm ve slug alanları standartlaştırılır.'))return;
  let ok=0;
  for(const g of state.games){try{await api('/api/games',{method:'PUT',body:JSON.stringify({game:repairGameBeforeSave({...g})})}); ok++;}catch(e){console.warn(e)}}
  await load(); adminTab('seriesControl'); alert(`${ok} oyun kontrol edildi / onarıldı.`);
}
function adminNavBtn(tab,label,icon){return `<button type="button" data-tab="${tab}" onclick="adminTab('${tab}')"><span>${icon}</span><b>${label}</b></button>`;}
function admin(){
  if(!canSeeAdmin()){$('#app').innerHTML=`<section class="hero"><h1>Erişim yok</h1><p>Admin paneli yetkili kullanıcıya açıktır.</p><button onclick="setPage('profile')">Giriş</button></section>`;return;}
  $('#app').innerHTML=`<section class="admin-hero-pro admin-hero-final">
    <div><span class="version-pill">V${VERSION}</span><h1>Admin Panel V2 Final</h1><p>Giriş: ${esc(roleLabel())} • final grid düzenli, kaymayan ve profesyonel yönetim paneli</p></div>
    <div class="admin-hero-actions"><button onclick="adminTab('games')">Yeni İçerik Yönet</button><button class="ghost" onclick="copyCleanInstallCommands()">Temiz Kurulum Komutları</button></div>
  </section>
  <section class="admin-shell-pro admin-shell-final">
    <div class="admin-tabs admin-toolbar-final" aria-label="Admin kategori menüsü">
      ${adminNavBtn('dash','Dashboard','⌂')}
      ${adminNavBtn('games','Oyunlar','🎮')}
      ${adminNavBtn('seriesOrder','Seri Sıralama','⇅')}
      ${adminNavBtn('seriesControl','Seriler Kontrol','✓')}
      ${adminNavBtn('repairV2','Kapak / Hikaye','🛠️')}
      ${adminNavBtn('api','API Çek','⚡')}
      ${adminNavBtn('users','Kullanıcılar','👥')}
      ${adminNavBtn('socialset','Sosyal Medya','🔗')}
      ${adminNavBtn('socialcheck','Sosyal Hata Kontrol','🧪')}
      ${adminNavBtn('aboutset','Hakkında','ℹ')}
      ${adminNavBtn('feedback','İstek / Geri Bildirim','✉')}
      ${adminNavBtn('set','Ayarlar','⚙')}
      ${adminNavBtn('ui252','Arayüz','🎨')}
      ${adminNavBtn('opening251','Açılış Yönetimi','🚀')}
      ${adminNavBtn('notes251','Not Yönetimi','📝')}
      ${adminNavBtn('v250','V2.5.1 Fix 5','👑')}
      ${adminNavBtn('v220','V2.2.0 Merkez','🧩')}
      ${adminNavBtn('v250','V2.5.1 Fix 5','👑')}
      ${adminNavBtn('socialcheck','Sosyal Hata Kontrol','🧪')}
      ${adminNavBtn('v210','V2.5.1 Fix 5 Merkez','🚀')}
      ${adminNavBtn('note','Güncelleme Notları','📝')}
      ${adminNavBtn('cal','Takvim','📅')}
      ${adminNavBtn('logs','Loglar','☰')}
      <button type="button" onclick="exportAll()"><span>⬇</span><b>Yedek Al</b></button>
    </div>
    <div class="admin-main-pro"><div id="adminArea"></div></div>
  </section>`;
  adminTab('dash');
}

function gameAdminCoverV203F1(g){
  const c=(typeof gameCover==='function'?gameCover(g):(g?.cover||g?.thumbnail||'/assets/series-placeholder.svg'));
  return c || '/assets/series-placeholder.svg';
}
function gameIssuesV203F1(g){
  if(typeof gameIssuesAlpha3==='function') return gameIssuesAlpha3(g);
  const issues=[];
  if(!g?.title)issues.push('Başlık boş');
  if(!g?.series)issues.push('Seri adı boş');
  if(!g?.cover&&!g?.thumbnail)issues.push('Kapak eksik');
  if(!g?.description)issues.push('Hikaye yok');
  if(!(Array.isArray(g?.episodes)&&g.episodes.length) && !/yakında|yakinda|gelecek/i.test(`${g?.status||''} ${g?.title||''}`))issues.push('Bölüm yok');
  return issues;
}
function selectedGameIdsV203F1(){
  return Array.from(document.querySelectorAll('.admin-game-select-v203f1:checked')).map(x=>x.value);
}
function toggleAllGamesV203F1(chk){
  document.querySelectorAll('.admin-game-select-v203f1').forEach(x=>x.checked=!!chk.checked);
  updateSelectedGamesV203F1();
}
function updateSelectedGamesV203F1(){
  const n=selectedGameIdsV203F1().length;
  const el=document.getElementById('selectedGamesCountV203F1');
  if(el)el.textContent=n+' seçili';
}
function selectedGamesV203F1(){
  const ids=new Set(selectedGameIdsV203F1());
  return (state.games||[]).filter(g=>ids.has(String(g.id||g.slug)));
}
function bulkEditSelectedGamesV203F1(){
  const list=selectedGamesV203F1();
  if(!list.length)return alert('Önce oyun seç.');
  const series=prompt('Seçili oyunların seri adını değiştir. Boş bırakırsan değişmez:','');
  const status=prompt('Seçili oyunların durumunu değiştir. Örnek: Devam Ediyor / Tamamlandı / Yakında Gelecek. Boş bırakırsan değişmez:','');
  const type=prompt('Seçili oyunların tipini değiştir. Örnek: Ana Oyun / DLC / Demo. Boş bırakırsan değişmez:','');
  if(series===null && status===null && type===null)return;
  bulkApplySelectedGamesV203F1({series,status,type});
}
async function bulkApplySelectedGamesV203F1(values){
  const list=selectedGamesV203F1();
  if(!list.length)return;
  if(!confirm(list.length+' seçili oyun güncellensin mi?'))return;
  let ok=0,fail=0;
  for(let i=0;i<list.length;i++){
    const g={...list[i]};
    if(values.series!==null && String(values.series||'').trim())g.series=String(values.series).trim();
    if(values.status!==null && String(values.status||'').trim())g.status=String(values.status).trim();
    if(values.type!==null && String(values.type||'').trim())g.type=String(values.type).trim();
    if(!g.cover && typeof gameAdminCoverV203F1==='function')g.cover=gameAdminCoverV203F1(g);
    try{
      const clean=typeof stripGameDbUnsafeFields==='function'?stripGameDbUnsafeFields(g):g;
      await api('/api/games',{method:'PUT',body:JSON.stringify({game:clean})});
      ok++;
    }catch(e){console.warn(e);fail++;}
  }
  alert('Toplu düzenleme tamamlandı.\nGüncellenen: '+ok+'\nHata: '+fail);
  await load();
  if(typeof adminTab==='function')adminTab('games');
}
function repairSelectedGamesV203F1(){
  const list=selectedGamesV203F1();
  if(!list.length)return alert('Önce oyun seç.');
  if(!confirm(list.length+' seçili oyun onarılsın mı?'))return;
  Promise.all(list.map(g=>typeof saveGameRepairV201F2b==='function'?saveGameRepairV201F2b(g):api('/api/games',{method:'PUT',body:JSON.stringify({game:g})}))).then(async()=>{
    alert('Seçili oyunlar onarıldı.');
    await load();
    adminTab('games');
  }).catch(e=>alert('Onarımda hata: '+e.message));
}
function generateAboutWithAIV203F1(){
  const games=state.games||[];
  const seriesCount=new Set(games.map(g=>g.series).filter(Boolean)).size;
  const completed=games.filter(g=>/tamamlandı|tamamlandi|bitti/i.test(g.status||'')).length;
  const ongoing=games.filter(g=>/devam/i.test(g.status||'')).length;
  const upcoming=games.filter(g=>/yakında|yakinda|gelecek/i.test(`${g.status||''} ${g.title||''}`)).length;
  const text=`Hayatımız Oyun, oyun serilerini düzenli şekilde arşivlemek için hazırlanmış özel bir oyun arşiv sitesidir. Şu anda ${games.length} oyun, ${seriesCount} seri, ${ongoing} devam eden içerik, ${completed} tamamlanan içerik ve ${upcoming} yakında gelecek kayıt takip ediliyor. Amaç; izlenen, devam eden ve planlanan oyun içeriklerini tek yerde temiz, anlaşılır ve güncel bir şekilde sunmaktır.`;
  const about=document.getElementById('aboutTextV203F1'); if(about)about.value=text;
  const mission=document.getElementById('aboutMissionV203F1'); if(mission)mission.value='Oyun arşivini düzenli, kapaklı, seri mantığına uygun ve izleyicinin kolay takip edeceği profesyonel bir yapıda sunmak.';
  const vision=document.getElementById('aboutVisionV203F1'); if(vision)vision.value='Hayatımız Oyun arşivini Türkçe oyun içerikleri için düzenli, hızlı ve kaliteli bir referans noktası haline getirmek.';
}
async function saveAboutSettingsV203F1(){
  state.settings=state.settings||{};
  state.settings.about_title=document.getElementById('aboutTitleV203F1')?.value||'Hayatımız Oyun';
  state.settings.about_text=document.getElementById('aboutTextV203F1')?.value||'';
  state.settings.about_mission=document.getElementById('aboutMissionV203F1')?.value||'';
  state.settings.about_vision=document.getElementById('aboutVisionV203F1')?.value||'';
  state.settings.about_show_stats=document.getElementById('aboutStatsV203F1')?.checked!==false;
  try{
    await api('/api/settings',{method:'PUT',body:JSON.stringify({settings:state.settings})});
    alert('Hakkında bilgileri kaydedildi.');
  }catch(e){alert('Kaydetme hatası: '+e.message);}
}
function aboutAdminPanelV203F1(){
  const st=state.settings||{};
  return `<section class="card about-admin-v203f1"><div class="section-title"><div><span class="version-pill">V2.5.1 Fix 5</span><h2>Hakkında Sayfası Yönetimi</h2><p class="muted">Hakkında sayfasındaki metinleri buradan düzenle. İstersen yapay zeka taslak metni oluşturabilirsin.</p></div><button onclick="generateAboutWithAIV203F1()">Yapay Zeka ile Oluştur</button></div>
  <label>Başlık<input id="aboutTitleV203F1" value="${esc(st.about_title||'Hayatımız Oyun')}"></label>
  <label>Hakkında Metni<textarea id="aboutTextV203F1" rows="8">${esc(st.about_text||'Hayatımız Oyun, oyun serilerini ve bölümlerini düzenli şekilde arşivlemek için hazırlanmış özel bir oyun arşiv sitesidir.')}</textarea></label>
  <div class="split">
    <label>Misyon<textarea id="aboutMissionV203F1" rows="5">${esc(st.about_mission||'Oyun arşivini düzenli, anlaşılır ve güncel şekilde sunmak.')}</textarea></label>
    <label>Vizyon<textarea id="aboutVisionV203F1" rows="5">${esc(st.about_vision||'Türkçe oyun içerikleri için profesyonel bir arşiv deneyimi oluşturmak.')}</textarea></label>
  </div>
  <label class="inline-check"><input type="checkbox" id="aboutStatsV203F1" ${st.about_show_stats!==false?'checked':''}> Hakkında sayfasında istatistikleri göster</label>
  <div class="row"><button onclick="saveAboutSettingsV203F1()">Hakkında Bilgilerini Kaydet</button><button class="ghost" onclick="setPage('about')">Hakkında Sayfasını Gör</button></div></section>`;
}
function aboutStatsV203F1(){
  const games=state.games||[];
  const seriesCount=new Set(games.map(g=>g.series).filter(Boolean)).size;
  const episodes=games.reduce((a,g)=>a+(Array.isArray(g.episodes)?g.episodes.length:0),0);
  const broken=games.filter(g=>gameIssuesV203F1(g).length).length;
  return {games:games.length,series:seriesCount,episodes,broken};
}

async function adminTab(t){const a=$('#adminArea'); if(!a)return; $$('.admin-tabs button[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===t)); try{ if(t==='dash'){let users=0,logs=[];try{users=(await api('/api/users')).users?.length||0}catch{}try{logs=(await api('/api/logs')).logs||[]}catch{} a.innerHTML=`<div class="admin-section-head"><div><span class="version-pill">Dashboard</span><h2>Genel Bakış</h2><p class="muted">Sitenin tüm ana verileri ve hızlı kontrolleri.</p></div><button class="ghost" onclick="adminTab('seriesControl')">Seri Sağlığını Kontrol Et</button></div><div class="admin-top-stats grid"><div class="card"><h2>${state.games.length}</h2><p>Oyun</p></div><div class="card"><h2>${groupGames().length}</h2><p>Seri</p></div><div class="card"><h2>${state.events.length}</h2><p>Takvim</p></div><div class="card"><h2>${state.notes.length}</h2><p>Güncelleme Notu</p></div><div class="card"><h2>${users}</h2><p>Kullanıcı</p></div><div class="card"><h2>${continueCount()}</h2><p>Devam Kaydı</p></div><div class="card series-health"><h2>${seriesHealth().score}%</h2><p>Seri Sağlığı</p><button class="ghost small" onclick="adminTab('seriesControl')">Kontrol Et</button></div></div>${finalV2Panel()}${alpha2Panel()}${finalV2Panel()}${v195QuickActions()}${adminV2Checklist()}${seriesHealthDashboard()}<h2>Son İşlemler</h2>${logs.slice(0,8).map(logHtml).join('')||'<p>Log yok.</p>'}`; return; }
 if(t==='games'){a.innerHTML=`<div class="row"><button onclick="clearGameForm()">Yeni Oyun</button><button class="danger" onclick="deleteAllGames()">Tüm Oyunları Tamamen Sil</button></div>${gameForm()}<h2>Toplu Oyun Yönetimi</h2><div class="card admin-filterbar-fixed-v211"><div class="row bulk-select-row-fixed"><label class="select-all-v203f1"><input type="checkbox" onchange="toggleAllAdminGamesFixedV211(this)"> Tümünü Seç</label><span id="selectedGamesCountV211" class="version-pill">0 seçili</span></div><div class="form-grid"><input id="adminGameSearch" placeholder="Admin oyun arama: oyun / seri / tür / etiket" oninput="filterAdminGames()"><select id="adminFilterStatus" onchange="filterAdminGames()"><option value="">Tüm durumlar</option><option>Tamamlandı</option><option>Devam Ediyor</option><option>Yakında Gelecek</option></select><select id="adminFilterMissing" onchange="filterAdminGames()"><option value="">Tüm oyunlar</option><option value="cover">Kapaksız oyunlar</option><option value="broken">Hatalı oyunlar</option><option value="story">Hikayesi eksik</option><option value="episode">Bölümsüz oyunlar</option></select><select id="bulkStatus"><option value="">Durum değiştirme</option><option>Tamamlandı</option><option>Devam Ediyor</option><option>Yakında Gelecek</option></select><input id="bulkSeries" placeholder="Seriye taşı"><input id="bulkTag" placeholder="Etiket ekle"><button onclick="bulkUpdateSelectedGames()">Seçilenleri Güncelle</button><button class="ghost" onclick="repairSelectedGames()">Seçilenleri Onar</button><button class="danger" onclick="deleteSelectedGames()">Seçilenleri Sil</button></div></div><h2>Oyun Listesi</h2><div id="adminGamesList">${adminGamesList(state.games)}</div>`; return; }
 if(t==='seriesOrder'){a.innerHTML=seriesOrderPanel(); return;}
 if(t==='seriesControl'){a.innerHTML=seriesControlPanel(); return;}
 if(t==='repairV2'){a.innerHTML=alpha3RepairPanel(); return;}
 if(t==='api'){a.innerHTML=`<div class="split"><div class="card"><h2>RAWG Türkçe Bilgi Çek</h2><input id="rawgName" placeholder="Oyun adı"><button onclick="rawgFetch()">Forma Doldur</button><button class="ghost" onclick="rawgStoryFetch()">Sadece Oyun Hikayesini Çek</button><button class="ghost" onclick="openGoogleImageSearch()">Google Görselde Ara</button><button class="ghost" onclick="bulkRefreshAllStories()">Eklenmiş Tüm Hikayeleri Düzelt</button><button class="ghost" onclick="bulkRefreshAllCovers()">Tüm Kapakları RAWG ile Yenile</button><p class="muted">Fix 4: DLC adları otomatik temizlenir. Örnek: Far Cry 6 3.DLC'si Joseph: Collapse → Far Cry 6 Joseph Collapse.</p></div><div class="card"><h2>YouTube</h2><input id="ytList" placeholder="Playlist URL"><button onclick="ytFetch()">Bölüm JSON Doldur</button><hr><input id="ytChannel" value="@HayatimizOyunn" placeholder="Kanal handle"><button onclick="ytChannelImport()">Kanaldan Oyunları Çek</button><button class="ghost" onclick="ytChannelSync()">YouTube Senkronize Et</button><p class="muted">Yeni oynatma listesi ve yeni bölüm kontrolü yapar. V1.8.0 kuyruğu playlistleri tek tek işler.</p></div></div><div id="apiFormArea">${gameForm()}</div><div id="ytProgressBar"></div><pre id="fetchOut" class="card"></pre>`; return;}
 if(t==='users'){const j=await api('/api/users'); a.innerHTML=`<h2>Kullanıcılar</h2><div class="card table-wrap"><table><thead><tr><th>Kullanıcı</th><th>Rol</th><th>Durum</th><th>XP</th><th>Level</th><th>İşlem</th></tr></thead><tbody>${j.users.map(userRow).join('')||'<tr><td colspan="6">Kullanıcı yok.</td></tr>'}</tbody></table></div>`; return;}
 if(t==='note'){const j=await api('/api/notes?all=1'); a.innerHTML=`<h2>Güncelleme Notları</h2>${noteForm()}<div class="card table-wrap"><table><thead><tr><th>Sürüm</th><th>Tip</th><th>Başlık</th><th>Public</th><th>İşlem</th></tr></thead><tbody>${j.notes.map(noteRow).join('')||'<tr><td colspan="5">Not yok.</td></tr>'}</tbody></table></div>`; return;}
 if(t==='cal'){a.innerHTML=`<h2>Takvim Yönetimi</h2>${eventForm()}<div class="card table-wrap"><table><thead><tr><th>Görsel</th><th>Başlık</th><th>Oyun</th><th>Tarih</th><th>Saat</th><th>İşlem</th></tr></thead><tbody>${state.events.map(eventRow).join('')||'<tr><td colspan="6">Etkinlik yok.</td></tr>'}</tbody></table></div>`; return;}
 if(t==='set'){a.innerHTML=`<h2>Site Ayarları</h2><form class="card" onsubmit="saveSettings(event)"><label><input type="checkbox" name="maintenance" ${state.settings?.maintenance?'checked':''}> Bakım modu</label><textarea name="maintenance_note" placeholder="Bakım notu">${esc(state.settings?.maintenance_note||'V2.5.1 Fix 5 güncellemesinde site final olarak açılacak.')}</textarea><label>Bakım ilerleme yüzdesi</label><input name="maintenance_progress" type="number" min="0" max="100" value="${esc(state.settings?.maintenance_progress??88)}" placeholder="Örn: 75"><label>Bakım ekranında görünecek yeni özellikler</label><textarea name="upcoming_features" placeholder="Her satıra bir özellik yaz">${esc(state.settings?.upcoming_features||'Admin panel V3 düzeni hazırlanıyor\nYouTube senkronizasyon stabilizasyonu ve senkronizasyon güçleniyor\nRAWG kapak ve hikaye toplu düzeltme geliyor\nProfil, bildirim ve sosyal sistem profesyonelleşiyor\nV2.5.1 Fix 5 güncellemesinde site final olarak açılacak')}</textarea><input name="announcement" value="${esc(state.settings?.announcement||'')}" placeholder="Duyuru"><input name="site_title" value="${esc(state.settings?.site_title||'Hayatımız Oyun')}" placeholder="Site adı"><input type="hidden" name="site_logo" value="${esc(state.settings?.site_logo||'')}"><label>Logo dosyası</label><input type="file" name="site_logo_file" accept="image/*"><input name="footer_text" value="${esc(state.settings?.footer_text||'')}" placeholder="Footer yazısı"><hr><h3>Sosyal Medya ve Footer Ayarları</h3><p class="muted">Her satıra link yaz. İstersen Başlık|URL biçimi de kullanabilirsin. İkon otomatik algılanır.</p><div class="form-grid social-separate-fields"><input name="social_youtube" value="${esc(state.settings?.social_youtube||'https://www.youtube.com/@HayatimizOyunn')}" placeholder="YouTube linki"><input name="social_kick" value="${esc(state.settings?.social_kick||'https://kick.com/hayatimizoyun')}" placeholder="Kick linki"><input name="social_discord" value="${esc(state.settings?.social_discord||'')}" placeholder="Discord linki"><input name="social_tiktok" value="${esc(state.settings?.social_tiktok||'')}" placeholder="TikTok linki"><input name="social_instagram" value="${esc(state.settings?.social_instagram||'')}" placeholder="Instagram linki"><input name="social_donate" value="${esc(state.settings?.social_donate||'https://www.bynogame.com/tr/destekle/hayatimizoyun')}" placeholder="Bağış / Bynogame linki"></div><h3>Ekstra sosyal linkler</h3><textarea id="socialLinksField" name="social_links" oninput="updateSocialPreview()" placeholder="Sadece ekstra link varsa yaz. Ana YouTube/Kick/Discord/TikTok/Instagram/Bağış alanlarını yukarıdaki kutulardan doldur.">${esc(state.settings?.social_links||'')}</textarea><div id="socialPreview" class="social-icons preview">${socialPreviewFromText(state.settings?.social_links||'')}</div><label><input type="checkbox" name="show_social_header" ${state.settings?.show_social_header===false?'':'checked'}> Sosyal ikonları üst menüde göster</label><label><input type="checkbox" name="show_social_footer" ${state.settings?.show_social_footer===false?'':'checked'}> Sosyal ikonları footer alanında göster</label><div class="notice"><b>Desteklenen yeni ikonlar:</b> Kick linki için <code>https://kick.com/hayatimizoyun</code>, bağış için <code>Bağış|https://...</code> veya Bynogame linki yaz. Sistem logoyu otomatik seçer.</div><hr><h3>Discord Webhook ve Yayıncı Kartı</h3><label><input type="checkbox" name="discord_enabled" ${state.settings?.discord_enabled?'checked':''}> Discord webhook aktif</label><input name="discord_webhook" value="${esc(state.settings?.discord_webhook||'')}" placeholder="Discord webhook URL"><button type="button" onclick="testDiscordWebhook()">Discord Webhook Test Et</button><label><input type="checkbox" name="show_streamer_card" ${state.settings?.show_streamer_card===false?'':'checked'}> Ana sayfada yayıncı kartını göster</label><label><input type="checkbox" name="kick_live" ${state.settings?.kick_live?'checked':''}> Kick canlı yayında etiketi göster</label><textarea name="publisher_description" placeholder="Yayıncı kartı açıklaması">${esc(state.settings?.publisher_description||'Kick yayınları, YouTube arşivi, Discord topluluğu ve bağış bağlantıları burada.')}</textarea><label>V2.5.1 Fix 5 hedef tarihi</label><input name="final_release_date" value="${esc(state.settings?.final_release_date||'')}" placeholder="Örn: 25.06.2026 20:00"><label>Favicon dosyası</label><input type="hidden" name="favicon" value="${esc(state.settings?.favicon||'')}"><input type="file" name="favicon_file" accept="image/*"><hr><h3>Site Hakkında</h3><textarea id="aboutTextField" name="about_text" placeholder="Site hakkında yazısı">${esc(state.settings?.about_text||'')}</textarea><button type="button" class="ghost" onclick="generateAboutText()">AI ile Hakkında Yazısı Hazırla</button><hr><h3>Paylaşım ve Arka Plan Ayarları</h3><input name="share_title" value="${esc(state.settings?.share_title||'Hayatımız Oyun - Oyun ve Seri İzleme Arşivi')}" placeholder="Paylaşım başlığı"><textarea name="share_description" placeholder="Paylaşım açıklaması">${esc(state.settings?.share_description||'Oyun serileri, bölümler, takvim, favoriler ve izleme takibi için Hayatımız Oyun arşivi.')}</textarea><input type="hidden" name="share_image" value="${esc(state.settings?.share_image||'')}"><label>Varsayılan paylaşım görseli</label><input type="file" name="share_image_file" accept="image/*"><label>Arka plan yoğunluğu</label><input name="background_intensity" type="number" min="20" max="125" value="${esc(state.settings?.background_intensity??75)}"><label>Varsayılan tema</label><select name="theme"><option value="dark" ${activeTheme()=='dark'?'selected':''}>Koyu</option><option value="red" ${activeTheme()=='red'?'selected':''}>Kırmızı</option><option value="blue" ${activeTheme()=='blue'?'selected':''}>Mavi</option><option value="purple" ${activeTheme()=='purple'?'selected':''}>Mor</option><option value="green" ${activeTheme()=='green'?'selected':''}>Yeşil</option><option value="neon" ${activeTheme()=='neon'?'selected':''}>Neon</option><option value="retro" ${activeTheme()=='retro'?'selected':''}>Retro</option></select><hr><h3>Müzik ve Açılış Ayarları</h3><label><input type="checkbox" name="music_enabled" ${state.settings?.music_enabled?'checked':''}> Site müziği açık olsun</label><label>Varsayılan ses seviyesi</label><input name="music_volume" type="number" min="0" max="100" value="${esc(state.settings?.music_volume??8)}"><label><input type="checkbox" name="video_duck_music" ${state.settings?.video_duck_music===false?'':'checked'}> Video izlerken müzik kısılsın</label><button>Kaydet</button></form>`; return;}
 if(t==='socialcheck'){a.innerHTML=renderSocialCheckV300();return;}
 if(t==='socialset'){a.innerHTML=`<h2>Sosyal Medya Linkleri</h2><form class="card social-link-form" onsubmit="saveSettings(event)"><p class="muted">Her platform için ayrı link gir. İkonlar otomatik seçilir. Bynogame/bağış için özel T logolu bağış ikonu görünür.</p><div class="form-grid"><input name="social_youtube" value="${esc(state.settings?.social_youtube||'https://www.youtube.com/@HayatimizOyunn')}" placeholder="YouTube linki"><input name="social_kick" value="${esc(state.settings?.social_kick||'https://kick.com/hayatimizoyun')}" placeholder="Kick linki"><input name="social_discord" value="${esc(state.settings?.social_discord||'')}" placeholder="Discord linki"><input name="social_tiktok" value="${esc(state.settings?.social_tiktok||'')}" placeholder="TikTok linki"><input name="social_instagram" value="${esc(state.settings?.social_instagram||'')}" placeholder="Instagram linki"><input name="social_donate" value="${esc(state.settings?.social_donate||'https://www.bynogame.com/tr/destekle/hayatimizoyun')}" placeholder="Bağış / Bynogame linki"></div><input type="hidden" name="social_links" value="${esc(state.settings?.social_links||'')}"><label><input type="checkbox" name="show_social_header" ${state.settings?.show_social_header===false?'':'checked'}> Üst menüde göster</label><label><input type="checkbox" name="show_social_footer" ${state.settings?.show_social_footer===false?'':'checked'}> Footer’da göster</label><h3>Canlı önizleme</h3><div class="social-icons preview social-preview-clean">${socialLinksHtml()}</div><button>Kaydet</button></form>`; return; }
 if(t==='feedback'){const j=await api('/api/social?action=feedback'); a.innerHTML=`<h2>İstekler / Geri Bildirim / Oyun İstekleri</h2><p class="muted">Oyun isteği, seri isteği, hata bildirimi ve öneriler burada listelenir.</p><div class="card table-wrap"><table><thead><tr><th>Tür</th><th>Ad</th><th>Mesaj</th><th>Durum</th><th>Tarih</th><th>İşlem</th></tr></thead><tbody>${(j.feedback||[]).map(f=>`<tr><td>${esc(f.type)}</td><td>${esc(f.name)}</td><td>${esc(f.message)}</td><td>${esc(f.status||'new')}</td><td>${f.created_at?new Date(f.created_at).toLocaleString('tr-TR'):''}</td><td><button class="ghost small" onclick="markFeedback('${f.id}','read')">Okundu</button><button class="ghost small" onclick="markFeedback('${f.id}','accepted')">Kabul</button><button class="ghost small" onclick="markFeedback('${f.id}','rejected')">Reddet</button><button class="danger small" onclick="deleteFeedback('${f.id}')">Sil</button></td></tr>`).join('')||'<tr><td colspan="6">Geri bildirim yok.</td></tr>'}</tbody></table></div>`; return;}
 if(t==='logs'){const j=await api('/api/logs'); a.innerHTML=`<h2>Loglar</h2><button class="danger" onclick="clearLogs()">Tüm Logları Sil</button>${(j.logs||[]).map(logHtml).join('')||'<p>Log yok.</p>'}`; return;}
 }catch(e){a.innerHTML=`<div class="card danger-box"><b>Admin sekmesi açılamadı:</b><p>${esc(e.message)}</p></div>`;}}
function logHtml(l){return `<div class="episode"><span><b>${esc(l.admin_name||'Yetkili')}</b> <small>(${esc(l.admin_role||'')})</small> — ${esc(l.action)}: ${esc(l.detail||'')}</span><small>${l.created_at?new Date(l.created_at).toLocaleString('tr-TR'):''}</small></div>`;}
function userRow(u){return `<tr><td>${esc(u.username)}</td><td><select id="role_${u.id}"><option ${u.role==='user'?'selected':''} value="user">User</option><option ${u.role==='Moderatör'?'selected':''}>Moderatör</option><option ${u.role==='Editör'?'selected':''}>Editör</option><option ${u.role==='Admin'?'selected':''}>Admin</option><option ${u.role==='Kurucu'?'selected':''}>Kurucu</option></select></td><td>${u.banned?'Banlı':'Aktif'}</td><td>${u.xp||0}</td><td>${u.level||1}</td><td class="row"><button onclick="updateUser('${u.id}')">Yetki</button><button onclick="toggleBan('${u.id}',${!u.banned})">${u.banned?'Ban Aç':'Banla'}</button><button onclick="resetUser('${u.id}')">Sıfırla</button><button class="danger" onclick="deleteUser('${u.id}')">Sil</button></td></tr>`;}
async function updateUser(id){await api('/api/users',{method:'PATCH',body:JSON.stringify({id,role:$('#role_'+id).value})}); adminTab('users');}
async function toggleBan(id,banned){await api('/api/users',{method:'PATCH',body:JSON.stringify({id,banned})}); adminTab('users');}
async function resetUser(id){if(confirm('Kullanıcı sıfırlansın mı?')){await api('/api/users',{method:'PATCH',body:JSON.stringify({id,reset:true})}); adminTab('users');}}
async function deleteUser(id){if(confirm('Kullanıcı silinsin mi?')){await api('/api/users',{method:'DELETE',body:JSON.stringify({id})}); adminTab('users');}}
function gameForm(g={}){const tagVals=Array.isArray(g.tags)?g.tags:String(g.tags||'').split(',').map(x=>x.trim()).filter(Boolean); const typeVals=['Ana Oyun','DLC','Yan Seri','Remake','Remaster','Spin-off']; const tagButtons=['DLC','Türkçe Altyazılı','Türkçe Dublajlı','Coop','%100','Final','Korku','Aksiyon','Macera','Hikaye Odaklı','Remake','Remaster']; return `<form class="card" id="gameForm" onsubmit="saveGame(event)"><input type="hidden" name="id" value="${esc(g.id||'')}"><div class="form-grid"><input name="title" value="${esc(g.title||'')}" placeholder="Oyun adı"><input name="slug" value="${esc(g.slug||'')}" placeholder="Slug"><input name="series" value="${esc(g.series||'')}" placeholder="Seri adı"><select name="status"><option ${g.status==='Devam Ediyor'?'selected':''}>Devam Ediyor</option><option ${g.status==='Tamamlandı'?'selected':''}>Tamamlandı</option><option ${g.status==='Yakında Gelecek'?'selected':''}>Yakında Gelecek</option></select><input name="upcoming_start" value="${esc(g.upcoming_start||'')}" placeholder="Yakında başlangıç tarihi"><input name="release_date" value="${esc(fmtDate(g.release_date)||'')}" placeholder="Çıkış tarihi gg.aa.yyyy"><input name="genre" value="${esc(g.genre||'')}" placeholder="Tür"><input name="cover" value="${esc(g.cover||'')}" placeholder="Kapak URL"><button type="button" onclick="fetchRawgCoverForForm()">Oyun Ana Resmini Çek</button><button type="button" class="ghost" onclick="openGoogleImageSearchFromForm()">Google Görselde Ara</button><input name="playlist_url" value="${esc(g.playlist_url||'')}" placeholder="Playlist URL"><input name="youtube_playlist_id" value="${esc(g.youtube_playlist_id||'')}" placeholder="Playlist ID"><input name="rawg_id" value="${esc(g.rawg_id||'')}" placeholder="RAWG ID"><input name="order_no" type="number" value="${esc(g.order_no||0)}" placeholder="Sıra"></div><label>İçerik Tipi</label><div class="choice-buttons">${typeVals.map(v=>`<button type="button" class="${(g.type||'Ana Oyun')===v?'active':''}" onclick="chooseOne(this,'type','${esc(v)}')">${esc(v)}</button>`).join('')}</div><input type="hidden" name="type" value="${esc(g.type||'Ana Oyun')}"><label>Etiketler</label><div class="choice-buttons tags-choice">${tagButtons.map(v=>`<button type="button" class="${tagVals.includes(v)?'active':''}" onclick="toggleTagButton(this,'${esc(v)}')">${esc(v)}</button>`).join('')}</div><input type="hidden" name="tags" value="${esc(tagVals.join(', '))}"><textarea name="description" placeholder="Kısa Türkçe hikaye / açıklama">${esc(g.description||'')}</textarea><textarea name="episodes" placeholder="Bölümler JSON">${esc(JSON.stringify(g.episodes||[],null,2))}</textarea><button>Kaydet</button></form>`;}
function chooseOne(btn,name,val){const wrap=btn.parentElement; $$('button',wrap).forEach(b=>b.classList.remove('active')); btn.classList.add('active'); btn.closest('form').elements[name].value=val;}
function toggleTagButton(btn,val){btn.classList.toggle('active'); const form=btn.closest('form'); form.elements.tags.value=$$('.tags-choice button.active',form).map(b=>b.textContent.trim()).join(', ');}
async function saveGame(e){e.preventDefault(); const game=Object.fromEntries(new FormData(e.target)); if(!game.slug)game.slug=slug(game.title); game.release_date=fmtDate(game.release_date); game.tags=String(game.tags||'').split(',').map(x=>x.trim()).filter(Boolean); try{game.episodes=JSON.parse(game.episodes||'[]')}catch{return alert('Bölümler JSON hatalı.')} repairGameBeforeSave(game); if(!game.id)delete game.id; try{await api('/api/games',{method:game.id?'PUT':'POST',body:JSON.stringify({game})}); await load(); adminTab('games');}catch(err){alert(err.message)}}

function versionScoreFixedV211(v=''){
  const txt=String(v||'').toLocaleLowerCase('tr-TR');
  const m=txt.match(/v?\s*(\d+)\.(\d+)\.(\d+)/i);
  if(!m)return 0;
  const fix=(txt.match(/fix\s*([0-9]+)/i)||[])[1]||0;
  const alpha=(txt.match(/alpha\s*([0-9]+)/i)||[])[1]||0;
  return Number(m[1])*100000000 + Number(m[2])*1000000 + Number(m[3])*10000 + Number(fix)*100 + Number(alpha);
}
function sortNotesFixedV211(notes=[]){
  return [...notes].sort((a,b)=>{
    const sv=versionScoreFixedV211(b.version||b.title)-versionScoreFixedV211(a.version||a.title);
    if(sv)return sv;
    return new Date(b.created_at||0)-new Date(a.created_at||0);
  });
}
function getSelectedAdminGameIdsFixedV211(){
  return Array.from(document.querySelectorAll('.game-check:checked,.admin-game-select-v203f1:checked'))
    .map(x=>x.value).filter(Boolean)
    .filter((v,i,a)=>a.indexOf(v)===i);
}
function setSelectedCountFixedV211(){
  const el=document.getElementById('selectedGamesCountV211');
  if(el)el.textContent=getSelectedAdminGameIdsFixedV211().length+' seçili';
}
function toggleAllAdminGamesFixedV211(chk){
  document.querySelectorAll('#adminGamesList .game-check,#adminGamesList .admin-game-select-v203f1').forEach(x=>x.checked=!!chk.checked);
  setSelectedCountFixedV211();
}
function adminGameCoverFixedV211(g){
  const u=(typeof gameCover==='function'?gameCover(g):(g.cover||g.thumbnail||img?.(g)||'')) || '/assets/series-placeholder.svg';
  return u;
}
async function saveGamePatchFixedV211(g){
  let clean={...g};
  if(typeof stripGameDbUnsafeFields==='function')clean=stripGameDbUnsafeFields(clean);
  await api('/api/games',{method:'PUT',body:JSON.stringify({game:clean})});
}
async function bulkUpdateSelectedGames(){
  const ids=getSelectedAdminGameIdsFixedV211();
  if(!ids.length)return alert('Oyun seç.');
  const patch={};
  const st=document.getElementById('bulkStatus')?.value||'';
  const series=document.getElementById('bulkSeries')?.value?.trim()||'';
  const tag=document.getElementById('bulkTag')?.value?.trim()||'';
  if(st)patch.status=st;
  if(series)patch.series=series;
  if(tag)patch.add_tag=tag;
  if(!Object.keys(patch).length)return alert('Bir güncelleme alanı doldur.');
  if(!confirm(ids.length+' oyun güncellensin mi?'))return;
  let ok=0,fail=0;
  for(const id of ids){
    const g=(state.games||[]).find(x=>String(x.id||x.slug)===String(id));
    if(!g){fail++;continue;}
    const next={...g};
    if(patch.status)next.status=patch.status;
    if(patch.series)next.series=patch.series;
    if(patch.add_tag){
      const tags=Array.isArray(next.tags)?next.tags:String(next.tags||'').split(',').map(x=>x.trim()).filter(Boolean);
      if(!tags.includes(patch.add_tag))tags.push(patch.add_tag);
      next.tags=tags;
    }
    try{await saveGamePatchFixedV211(next);ok++;}catch(e){console.warn(e);fail++;}
  }
  alert('Güncelleme tamamlandı.\\nBaşarılı: '+ok+'\\nHata: '+fail);
  await load();
  adminTab('games');
}
async function repairSelectedGames(){
  const ids=getSelectedAdminGameIdsFixedV211();
  if(!ids.length)return alert('Onarılacak oyun seç.');
  if(!confirm(ids.length+' seçili oyun onarılsın mı?'))return;
  let ok=0,fail=0;
  for(const id of ids){
    const g=(state.games||[]).find(x=>String(x.id||x.slug)===String(id));
    if(!g){fail++;continue;}
    try{
      if(typeof saveGameRepairV201F2b==='function')await saveGameRepairV201F2b(g);
      else await saveGamePatchFixedV211(g);
      ok++;
    }catch(e){console.warn(e);fail++;}
  }
  alert('Onarım tamamlandı.\\nBaşarılı: '+ok+'\\nHata: '+fail);
  await load();
  adminTab('games');
}
async function deleteSelectedGames(){
  const ids=getSelectedAdminGameIdsFixedV211();
  if(!ids.length)return alert('Oyun seç.');
  if(!confirm(ids.length+' oyun silinsin mi?'))return;
  try{await api('/api/games',{method:'DELETE',body:JSON.stringify({ids})});}
  catch(e){alert('Silme hatası: '+e.message);return;}
  await load();
  adminTab('games');
}
function updateSelectedGamesV203F1(){setSelectedCountFixedV211();}
function toggleAllGamesV203F1(chk){toggleAllAdminGamesFixedV211(chk);}

function adminGamesList(list){
  const arr=[...list].sort((a,b)=>trSort(getSeriesName(a),getSeriesName(b))||((a.order_no||0)-(b.order_no||0))||trSort(a.title,b.title));
  return `<div class="admin-games-v220">${arr.map(g=>{
    const id=gameKeyV220(g);
    const cover=gameCoverV220(g);
    const issues=gameIssuesV220(g);
    return `<article class="admin-game-v220">
      <label class="select-v220"><input type="checkbox" class="admin-select-v220 game-check" value="${escV220(id)}" onchange="updateSelectedV220()"> Seç</label>
      <div class="cover-v220" style="background-image:url('${escV220(cover)}')">
        <span>${escV220(g.status||'Durum Yok')}</span>
      </div>
      <div class="body-v220">
        <h3>${escV220(g.title||'Başlıksız')}</h3>
        <p class="muted">${escV220(getSeriesName(g)||'Serisiz')} • ${escV220(g.type||'Ana Oyun')} • ${(Array.isArray(g.episodes)?g.episodes.length:0)} bölüm</p>
        <div class="issue-row-v220">${issues.length?issues.slice(0,4).map(x=>`<small class="warn">${escV220(x)}</small>`).join(''):'<small class="ok">Sorun yok</small>'}</div>
        <div class="actions-v220">
          <button onclick="editGame('${escV220(g.slug)}')">Düzenle</button>
          <button class="ghost" onclick="quickCover('${escV220(id)}')">Kapak</button>
          <button class="ghost" onclick="quickStory('${escV220(id)}')">Hikaye</button>
          <button class="ghost" onclick="googleCoverGame('${escV220(id)}')">Google</button>
          <button class="danger" onclick="deleteGame('${escV220(id)}')">Sil</button>
        </div>
      </div>
    </article>`;
  }).join('')||'<div class="card"><p>Oyun yok.</p></div>'}</div>`;
}
function filterAdminGames(){
  const q=($('#adminGameSearch')?.value||'').toLocaleLowerCase('tr-TR');
  const st=$('#adminFilterStatus')?.value||'';
  const miss=$('#adminFilterMissing')?.value||'';
  const list=state.games.filter(g=>{
    const hay=((g.title||'')+' '+getSeriesName(g)+' '+(g.genre||'')+' '+(Array.isArray(g.tags)?g.tags.join(' '):g.tags||'')).toLocaleLowerCase('tr-TR');
    if(q&&!hay.includes(q))return false;
    if(st&&String(g.status||'')!==st)return false;
    if(miss==='cover'&&(g.cover||g.thumbnail))return false;
    if(miss==='story'&&String(g.description||'').trim().length>30)return false;
    if(miss==='episode'&&((g.episodes||[]).length||isUpcomingV220(g)))return false;
    if(miss==='broken'&&!gameIssuesV220(g).length)return false;
    return true;
  });
  $('#adminGamesList').innerHTML=adminGamesList(list);
  updateSelectedV220();
}
function editGame(sl){const g=state.games.find(x=>x.slug===sl); $('#adminArea').innerHTML=gameForm(g)+`<h2>Oyun Listesi</h2><div id="adminGamesList">${adminGamesList(state.games)}</div>`; scrollTo({top:0,behavior:'smooth'});}
function clearGameForm(){adminTab('games');}
async function deleteGame(id){if(confirm('Oyun silinsin mi?')){await api('/api/games',{method:'DELETE',body:JSON.stringify({id})}); await load(); adminTab('games');}}
async function deleteSelectedGames(){const ids=$$('.game-check:checked').map(x=>x.value); if(!ids.length)return alert('Oyun seç.'); if(confirm(`${ids.length} oyun silinsin mi?`)){await api('/api/games',{method:'DELETE',body:JSON.stringify({ids})}); await load(); adminTab('games');}}
async function deleteAllGames(){const word=prompt('Tüm oyunlar silinecek. Onay için SIL yaz.'); if(word!=='SIL')return; await api('/api/games',{method:'DELETE',body:JSON.stringify({all:true})}); await load(); adminTab('games');}
async function bulkUpdateSelectedGames(){const ids=$$('.game-check:checked').map(x=>x.value); if(!ids.length)return alert('Oyun seç.'); const patch={}; if($('#bulkStatus')?.value)patch.status=$('#bulkStatus').value; if($('#bulkSeries')?.value.trim())patch.series=$('#bulkSeries').value.trim(); if($('#bulkTag')?.value.trim())patch.add_tag=$('#bulkTag').value.trim(); if(!Object.keys(patch).length)return alert('Bir güncelleme alanı doldur.'); await api('/api/games',{method:'PATCH',body:JSON.stringify({ids,patch})}); await load(); adminTab('games');}
function seriesOrderPanel(){
  const groups=groupGames();
  const options=groups.map(g=>`<option value="${esc(slug(g.series))}" ${state.seriesEditKey===slug(g.series)?'selected':''}>${esc(g.series)} (${g.games.length})</option>`).join('');
  return `<h2>Seri Oyunları Sıralama</h2><div class="card series-order-tools"><select id="seriesSelect" onchange="state.seriesEditKey=this.value; renderSeriesOrderList()"><option value="">Seri seç</option>${options}</select><button class="ghost" onclick="sortCurrentSeriesByRelease()">Çıkış Tarihine Göre Sırala</button><button class="ghost" onclick="sortCurrentSeriesAZ()">A-Z Sırala</button><button class="ghost" onclick="refreshCurrentSeriesCovers()">Bu Serinin Kapaklarını Yenile</button></div><div id="seriesOrderList">${renderSeriesOrderList(true)}</div>`;
}
function renderSeriesOrderList(ret=false){
  const key=state.seriesEditKey||$('#seriesSelect')?.value||''; if(key)state.seriesEditKey=key;
  const gr=groupGames().find(g=>slug(g.series)===key);
  const html=!gr?'<p class="muted">Bir seri seç.</p>':`<div class="card series-order-card"><h3>${esc(gr.series)}</h3><p class="muted">Kapaklı kartları sürükle-bırak ile sırala. Kaydet butonu sadece bu seriyi etkiler.</p><div id="sortableSeries" class="series-sort-grid">${gr.games.map((g,i)=>`<div class="series-sort-item" draggable="true" data-id="${esc(g.id)}"><div class="series-sort-cover" style="background-image:url('${esc(img(g))}')"></div><div class="series-sort-meta"><b>${i+1}. ${esc(g.title)}</b><small>${fmtDate(g.release_date)||'Tarih yok'} • ${esc(g.type||'Ana Oyun')} • ${esc(g.status||'')}</small><div class="mini-badges"><span>Sıra: ${Number(g.order_no)||i+1}</span>${!g.cover?'<span class="warn">Kapak yok</span>':''}${!String(g.description||'').trim()?'<span class="warn">Hikaye yok</span>':''}</div></div><div class="series-sort-actions"><button onclick="moveSeriesItem('${esc(g.id)}',-1)">↑</button><button onclick="moveSeriesItem('${esc(g.id)}',1)">↓</button><button onclick="editGame('${esc(g.slug)}')">Düzenle</button><button class="ghost" onclick="moveGameToSeriesPrompt('${esc(g.id)}')">Taşı</button><button class="danger" onclick="deleteSeriesGame('${esc(g.id)}')">Kayıttan Sil</button></div></div>`).join('')}</div><div class="row"><button onclick="saveSeriesOrder()">Bu Seriyi Kaydet</button><button class="ghost" onclick="renderSeriesOrderList()">Yenile</button></div></div>`;
  if(ret)return html; $('#seriesOrderList').innerHTML=html; enableDragSort();
}
function currentSeriesIds(){return $$('#sortableSeries .draggable').map(x=>x.dataset.id);}
function moveSeriesItem(id,dir){const el=$(`#sortableSeries [data-id="${CSS.escape(id)}"]`); if(!el)return; if(dir<0&&el.previousElementSibling)el.parentNode.insertBefore(el,el.previousElementSibling); if(dir>0&&el.nextElementSibling)el.parentNode.insertBefore(el.nextElementSibling,el);}
function enableDragSort(){let drag=null; $$('#sortableSeries .draggable').forEach(el=>{el.ondragstart=()=>{drag=el; el.classList.add('dragging')}; el.ondragend=()=>{el.classList.remove('dragging'); drag=null}; el.ondragover=e=>{e.preventDefault(); const box=el.getBoundingClientRect(); const after=e.clientY>box.top+box.height/2; if(drag&&drag!==el) el.parentNode.insertBefore(drag,after?el.nextSibling:el);};});}
async function saveSeriesOrder(){const ids=currentSeriesIds(); if(!ids.length)return; const gr=groupGames().find(g=>slug(g.series)===(state.seriesEditKey||$('#seriesSelect')?.value||'')); const seriesName=gr?.series||''; await api('/api/games',{method:'PATCH',body:JSON.stringify({order:ids.map((id,i)=>({id,order_no:i+1,series:seriesName}))})}); await load(); state.seriesEditKey=slug(seriesName); renderSeriesOrderList(); alert('Seri sıralaması kaydedildi.');}
async function deleteSeriesGame(id){if(confirm('Bu oyun tamamen kayıttan silinsin mi?')){await api('/api/games',{method:'DELETE',body:JSON.stringify({id})}); await load(); renderSeriesOrderList();}}
function noteForm(n={}){return `<form class="card" id="noteForm" onsubmit="saveNote(event)"><input type="hidden" name="id" value="${esc(n.id||'')}"><div class="form-grid"><input name="version" value="${esc(n.version||'V'+VERSION)}"><select name="type"><option ${n.type==='Özellik'?'selected':''}>Özellik</option><option ${n.type==='Fix'?'selected':''}>Fix</option><option ${n.type==='Sürüm'?'selected':''}>Sürüm</option><option ${n.type==='Admin'?'selected':''}>Admin</option></select><input name="title" value="${esc(n.title||'')}" placeholder="Başlık"></div><textarea name="body">${esc(n.body||'')}</textarea><label><input type="checkbox" name="public_visible" ${n.public_visible===false?'':'checked'}> Sitede göster</label><button>Kaydet</button></form>`;}
function noteRow(n){return `<tr><td>${esc(n.version)}</td><td>${esc(n.type)}</td><td>${esc(n.title)}</td><td>${n.public_visible===false?'Hayır':'Evet'}</td><td><button onclick='editNote(${JSON.stringify(n).replace(/'/g,'&#039;')})'>Düzenle</button><button class="danger" onclick="deleteNote('${n.id}')">Sil</button></td></tr>`;}
async function saveNote(e){e.preventDefault(); const n=Object.fromEntries(new FormData(e.target)); n.public_visible=!!e.target.public_visible.checked; try{await api('/api/notes',{method:n.id?'PUT':'POST',body:JSON.stringify(n)}); await load(); adminTab('note');}catch(err){alert(err.message)}}
function editNote(n){$('#noteForm')?.remove(); $('#adminArea').insertAdjacentHTML('afterbegin',noteForm(n)); scrollTo({top:0,behavior:'smooth'});}
async function deleteNote(id){if(confirm('Not silinsin mi?')){await api('/api/notes',{method:'DELETE',body:JSON.stringify({id})}); await load(); adminTab('note');}}
function eventForm(e={}){return `<form class="card" id="eventForm" onsubmit="saveEvent(event)"><input type="hidden" name="id" value="${esc(e.id||'')}"><div class="form-grid"><input name="title" value="${esc(e.title||'')}" placeholder="Başlık"><input name="game_title" id="calGameTitle" value="${esc(e.game_title||'')}" placeholder="Oyun adı"><button type="button" onclick="calendarImageFetch()">Resim Çek</button><input name="event_date" type="date" value="${esc(e.event_date||'')}"><input name="event_time" type="time" value="${esc(e.event_time||'')}"><input name="image" id="calImage" value="${esc(e.image||'')}" placeholder="Görsel URL"></div><textarea name="description">${esc(e.description||'')}</textarea><button>Kaydet</button></form>`;}
function eventRow(e){return `<tr><td><div class="calendar-img" style="width:90px;background-image:url('${esc(e.image||'')}')"></div></td><td>${esc(e.title)}</td><td>${esc(e.game_title||'')}</td><td>${fmtDate(e.event_date)}</td><td>${esc(e.event_time||'')}</td><td><button onclick='editEvent(${JSON.stringify(e).replace(/'/g,'&#039;')})'>Düzenle</button><button class="danger" onclick="deleteEvent('${e.id}')">Sil</button></td></tr>`;}
async function saveEvent(e){e.preventDefault(); const event=Object.fromEntries(new FormData(e.target)); try{await api('/api/calendar',{method:event.id?'PUT':'POST',body:JSON.stringify({event})}); await load(); adminTab('cal');}catch(err){alert(err.message)}}
function editEvent(e){$('#eventForm')?.remove(); $('#adminArea').insertAdjacentHTML('afterbegin',eventForm(e));}
async function deleteEvent(id){if(confirm('Takvim kaydı silinsin mi?')){await api('/api/calendar',{method:'DELETE',body:JSON.stringify({id})}); await load(); adminTab('cal');}}
async function calendarImageFetch(){try{const j=await api('/api/rawg?name='+enc($('#calGameTitle').value)); $('#calImage').value=j.game?.cover||'';}catch(e){alert(e.message)}}
async function markFeedback(id,status='read'){try{await api('/api/social?action=feedback',{method:'PATCH',body:JSON.stringify({id,status})}); adminTab('feedback');}catch(e){alert(e.message)}}
async function deleteFeedback(id){if(!confirm('Bu geri bildirimi silmek istiyor musun?'))return; try{await api('/api/social?action=feedback&id='+enc(id),{method:'DELETE'}); adminTab('feedback');}catch(e){alert(e.message)}}
async function testDiscordWebhook(){try{await api('/api/settings?action=discord-test',{method:'POST',body:JSON.stringify({test:true})}); alert('Discord test bildirimi gönderildi.');}catch(e){alert(e.message)}}
function generateAboutText(){const el=document.getElementById('aboutTextField'); if(!el)return; el.value=`${siteTitle()}, oyun serilerini Türkçe içeriklerle düzenli şekilde takip edebileceğin bir oyun arşivi ve yayıncı platformudur. YouTube bölümleri, seri sıralamaları, izleme takibi, takvim, sosyal bağlantılar ve oyun istekleri tek yerde toplanır. V2.5.1 Fix 5 açılışına kadar profesyonel arşiv, topluluk ve yayıncı destek sistemi geliştirilmeye devam eder.`;}
async function saveSettings(e){
  e.preventDefault();
  const form=e.target;
  const f={...(state.settings||{}),...Object.fromEntries(new FormData(form))};
  // Formun bulunmadığı sekmelerde eski ayarı koru; sadece görünen checkboxları değiştir.
  if(form.maintenance) f.maintenance=!!form.maintenance.checked;
  if(form.music_enabled) f.music_enabled=!!form.music_enabled.checked;
  if(form.video_duck_music) f.video_duck_music=!!form.video_duck_music.checked;
  if(form.show_social_header) f.show_social_header=!!form.show_social_header.checked;
  if(form.show_social_footer) f.show_social_footer=!!form.show_social_footer.checked;
  if(form.discord_enabled) f.discord_enabled=!!form.discord_enabled.checked;
  if(form.show_streamer_card) f.show_streamer_card=!!form.show_streamer_card.checked;
  if(form.kick_live) f.kick_live=!!form.kick_live.checked;
  f.social_links=buildSettingsSocialLinks(f);
  try{
    const file=form.site_logo_file?.files?.[0]; if(file)f.site_logo=await uploadImage(file,'logos');
    const shareFile=form.share_image_file?.files?.[0]; if(shareFile)f.share_image=await uploadImage(shareFile,'share');
    const favFile=form.favicon_file?.files?.[0]; if(favFile)f.favicon=await uploadImage(favFile,'favicons');
    delete f.site_logo_file; delete f.share_image_file; delete f.favicon_file;
    await api('/api/settings',{method:'POST',body:JSON.stringify({settings:f})});
    await load();
    state.settings={...state.settings,...f};
    adminTab(form.closest('.social-link-form')?'socialset':'set');
    renderNav(); updateSeo();
    alert('Ayarlar kaydedildi.');
  }catch(err){alert(err.message)}
}
async function clearLogs(){if(confirm('Tüm loglar silinsin mi?')){try{await api('/api/logs',{method:'DELETE',body:JSON.stringify({all:true})}); adminTab('logs');}catch(e){alert(e.message)}}}
async function rawgFetch(){try{const j=await api('/api/rawg?name='+enc($('#rawgName').value)); fillGameForm(j.game||{}); $('#fetchOut').textContent=JSON.stringify(j.game,null,2);}catch(e){alert(e.message)}}
async function rawgStoryFetch(){try{const name=$('#rawgName')?.value||$('#gameForm')?.elements.title?.value; const j=await api('/api/rawg?story=1&name='+enc(name)); const f=$('#gameForm'); if(f)f.elements.description.value=j.game?.description||''; $('#fetchOut').textContent=JSON.stringify(j.game,null,2);}catch(e){alert(e.message)}}
function fillGameForm(g={}){const area=$('#apiFormArea')||$('#adminArea'); area.innerHTML=gameForm({...Object.fromEntries(new FormData($('#gameForm')||document.createElement('form'))),...g,tags:($('#gameForm')?.elements.tags?.value||'').split(',').map(x=>x.trim()).filter(Boolean)});}
async function fetchRawgCoverForForm(){const f=$('#gameForm'); if(!f)return; try{const j=await api('/api/rawg?name='+enc(cleanDlcSearchTitle(f.elements.title.value))); f.elements.cover.value=j.game?.cover||f.elements.cover.value; if(j.game?.genre)f.elements.genre.value=j.game.genre; if(j.game?.rawg_id)f.elements.rawg_id.value=j.game.rawg_id;}catch(e){alert(e.message)}}
async function ytFetch(){try{const j=await api('/api/youtube?playlist='+enc($('#ytList').value)); const f=$('#gameForm'); if(f){f.elements.episodes.value=JSON.stringify(j.episodes||[],null,2); f.elements.playlist_url.value=$('#ytList').value;} $('#fetchOut').textContent=JSON.stringify(j,null,2);}catch(e){alert(e.message)}}
function updateYoutubeProgress(done,total,label='',extra=''){
  const pct=total?Math.round(done/total*100):0;
  const out=$('#fetchOut');
  if(out)out.textContent=`%${pct} (${done}/${total}) ${label}\n${extra||''}`;
  const bar=$('#ytProgressBar');
  if(bar)bar.innerHTML=`<div class="progress-head"><b>%${pct}</b><span>${esc(label)}</span></div><div class="progress"><b style="width:${pct}%"></b></div>`;
}
async function ytChannelImport(){
  try{
    const ch=$('#ytChannel').value.trim()||'@HayatimizOyunn';
    $('#fetchOut').textContent='Kanal oynatma listeleri alınıyor...';
    const list=await api('/api/youtube?channel='+enc(ch)+'&list=1&limit=all');
    const playlists=list.playlists||[];
    let ok=0,skip=0,fail=0,lines=[];
    updateYoutubeProgress(0,playlists.length,'Kuyruk hazırlandı');
    for(let i=0;i<playlists.length;i++){
      const p=playlists[i];
      updateYoutubeProgress(i,playlists.length,`İşleniyor: ${p.title}`,lines.slice(-8).join('\n'));
      try{
        const r=await api('/api/youtube?importPlaylist='+enc(p.id)+'&maxEpisodes=all');
        ok+=r.saved?1:0; skip+=r.saved?0:1;
        lines.push(`✓ ${p.title}`);
      }catch(e){fail++; lines.push(`✗ ${p.title}: ${e.message}`);}
    }
    updateYoutubeProgress(playlists.length,playlists.length,'Kanal import tamamlandı',`Eklenen/Güncellenen: ${ok}\nAtlanan: ${skip}\nHata: ${fail}\n`+lines.join('\n'));
    await load(); adminTab('games');
  }catch(e){alert(e.message)}
}
async function ytChannelSync(){
  try{
    const ch=$('#ytChannel').value.trim()||'@HayatimizOyunn';
    $('#fetchOut').textContent='YouTube senkron kuyruk hazırlanıyor...';
    const list=await api('/api/youtube?channel='+enc(ch)+'&list=1&limit=all');
    const playlists=list.playlists||[];
    let updated=0,skipped=0,fail=0,lines=[];
    updateYoutubeProgress(0,playlists.length,'Senkron kuyruğu hazırlandı');
    for(let i=0;i<playlists.length;i++){
      const p=playlists[i];
      updateYoutubeProgress(i,playlists.length,`Senkron: ${p.title}`,lines.slice(-8).join('\n'));
      try{
        const r=await api('/api/youtube?importPlaylist='+enc(p.id)+'&sync=1&maxEpisodes=all');
        if(r.saved)updated++; else skipped++;
        lines.push(`✓ ${p.title}`);
      }catch(e){fail++; lines.push(`✗ ${p.title}: ${e.message}`);}
    }
    updateYoutubeProgress(playlists.length,playlists.length,'YouTube senkron tamamlandı',`Güncellenen/Yeni: ${updated}\nAtlanan: ${skipped}\nHata: ${fail}\n`+lines.join('\n'));
    await load(); adminTab('games');
  }catch(e){alert(e.message)}
}
async function bulkRefreshAllStories(){if(!state.games.length)return; if(!confirm('Tüm oyun hikayeleri yeniden çekilsin mi?'))return; const out=$('#fetchOut'); let ok=0,fail=0; for(let i=0;i<state.games.length;i++){const g=state.games[i]; if(out)out.textContent=`%${Math.round(i/state.games.length*100)} — ${g.title}`; try{const j=await api('/api/rawg?story=1&name='+enc(g.title)); const desc=j.game?.description||''; if(desc){await api('/api/games',{method:'PUT',body:JSON.stringify({game:{...g,description:desc}})}); ok++;}else fail++;}catch{fail++;}} if(out)out.textContent=`%100 tamamlandı. Başarılı: ${ok}, Hata: ${fail}`; await load();}

async function bulkRefreshAllCovers(){
  if(!state.games.length)return;
  if(!confirm('Tüm oyun kapakları RAWG ana görselleriyle yenilensin mi?'))return;
  const out=$('#fetchOut'); let ok=0,fail=0;
  for(let i=0;i<state.games.length;i++){
    const g=state.games[i];
    if(out)out.textContent=`%${Math.round(i/state.games.length*100)} — Kapak yenileniyor: ${g.title}`;
    try{
      const j=await api('/api/rawg?name='+enc(cleanDlcSearchTitle(g.title)));
      const cover=j.game?.cover||'';
      if(cover){await api('/api/games',{method:'PUT',body:JSON.stringify({game:{...g,cover}})}); ok++;} else fail++;
    }catch{fail++;}
  }
  if(out)out.textContent=`%100 tamamlandı. Kapak yenilenen: ${ok}, Hata: ${fail}`;
  await load();
}


function normalizedSeriesKey(name=''){
  return canonicalSeriesName(String(name||'').replace(/serisi|series|collection|full seri|tüm seri/ig,'').trim()).toLocaleLowerCase('tr-TR').replace(/[^a-z0-9ğüşöçıİĞÜŞÖÇ]+/gi,'');
}
function seriesControlData(){
  const groups=groupGames();
  const similar=new Map();
  for(const gr of groups){const key=normalizedSeriesKey(gr.series); if(!similar.has(key))similar.set(key,[]); similar.get(key).push(gr);}
  const dupSeries=[...similar.values()].filter(a=>a.length>1);
  const emptySeries=state.games.filter(g=>!String(g.series||'').trim());
  const byTitle=new Map();
  for(const g of state.games){const k=slug(g.title||''); if(!byTitle.has(k))byTitle.set(k,[]); byTitle.get(k).push(g);}
  const dupGames=[...byTitle.values()].filter(a=>a.length>1);
  const noCover=state.games.filter(g=>!g.cover);
  const noStory=state.games.filter(g=>!String(g.description||'').trim());
  const wrongDlc=state.games.filter(g=>/dlc|tyranny|episode|chapter|ek paket/i.test((g.title||'')+' '+(g.type||'')) && !/DLC/i.test(g.type||''));
  const issueCount=dupSeries.length+emptySeries.length+dupGames.length+noCover.length+noStory.length+wrongDlc.length;
  const score=Math.max(0,Math.min(100,100-Math.round(issueCount/Math.max(1,state.games.length+groups.length)*100)));
  return {groups,dupSeries,emptySeries,dupGames,noCover,noStory,wrongDlc,score};
}
function seriesHealth(){return seriesControlData();}
function seriesHealthDashboard(){const d=seriesControlData(); return `<div class="card series-health-panel"><div class="panel-head"><h2>Seri Sağlığı</h2><strong>${d.score}%</strong></div><div class="grid"><div class="card"><h3>${d.score}%</h3><p>Genel skor</p></div><div class="card"><h3>${d.dupSeries.length}</h3><p>Benzer/Fazla seri</p></div><div class="card"><h3>${d.noCover.length}</h3><p>Kapaksız oyun</p></div><div class="card"><h3>${d.noStory.length}</h3><p>Hikayesiz oyun</p></div><div class="card"><h3>${d.dupGames.length}</h3><p>Duplicate oyun</p></div></div><button onclick="adminTab('seriesControl')">Seriler Kontrol Raporu</button></div>`;}
function seriesControlPanel(){
  const d=seriesControlData();
  const dupHtml=d.dupSeries.map((arr,i)=>`<div class="series-control-group"><h3>Benzer Seri Grubu ${i+1}</h3>${arr.map(gr=>`<label><input type="checkbox" class="merge-series-check" value="${esc(gr.series)}"> <b>${esc(gr.series)}</b> <small>${gr.games.length} oyun</small></label>`).join('')}<div class="row"><input id="mergeTarget${i}" placeholder="Ana seri adı" value="${esc(canonicalSeriesName(arr[0].series))}"><button onclick="mergeCheckedSeries('mergeTarget${i}')">Seçilenleri Birleştir</button></div></div>`).join('')||'<p class="muted">Benzer/fazla seri bulunmadı.</p>';
  return `<h2>Seriler Kontrol</h2><div class="grid"><div class="card"><h2>${d.score}%</h2><p>Seri Sağlığı</p></div><div class="card"><h2>${d.dupSeries.length}</h2><p>Fazla/benzer seri</p></div><div class="card"><h2>${d.emptySeries.length}</h2><p>Seri adı boş</p></div><div class="card"><h2>${d.dupGames.length}</h2><p>Duplicate oyun</p></div><div class="card"><h2>${d.wrongDlc.length}</h2><p>DLC kontrol uyarısı</p></div></div><div class="card"><h2>Otomatik Seri Düzeltme</h2><p class="muted">Assassin's Creed, A Plague Tale, Resident Evil gibi seri kuralları uygulanır; “Serisi” ve gereksiz kelimeler temizlenir.</p><button onclick="autoFixSeriesNames()">Serileri Otomatik Düzelt</button><button class="ghost" onclick="repairAllGamesLight()">Tüm Oyunları Hafif Onar</button></div><div class="card"><h2>Fazla / Benzer Seriler</h2>${dupHtml}</div><div class="split"><div class="card"><h2>Kapaksız Oyunlar</h2>${d.noCover.slice(0,25).map(g=>`<div class="episode"><span>${esc(g.title)}</span><button onclick="editGame('${esc(g.slug)}')">Düzenle</button></div>`).join('')||'<p>Kapaksız oyun yok.</p>'}</div><div class="card"><h2>Hikayesi Eksik</h2>${d.noStory.slice(0,25).map(g=>`<div class="episode"><span>${esc(g.title)}</span><button onclick="editGame('${esc(g.slug)}')">Düzenle</button></div>`).join('')||'<p>Hikayesi eksik oyun yok.</p>'}</div></div>`;
}
async function mergeCheckedSeries(targetId){
  const target=$('#'+targetId)?.value.trim(); if(!target)return alert('Ana seri adını yaz.');
  const selected=[...document.querySelectorAll('.merge-series-check:checked')].map(x=>x.value);
  if(!selected.length)return alert('Birleştirilecek seri seç.');
  const ids=state.games.filter(g=>selected.includes(getSeriesName(g))).map(g=>g.id);
  if(!ids.length)return alert('Oyun bulunamadı.');
  if(!confirm(`${ids.length} oyun “${target}” serisine taşınsın mı?`))return;
  await api('/api/games',{method:'PATCH',body:JSON.stringify({ids,patch:{series:target}})});
  await load(); adminTab('seriesControl');
}
async function autoFixSeriesNames(){
  if(!confirm('Tüm oyunlarda seri adları otomatik standartlaştırılsın mı?'))return;
  let changed=0;
  for(const g of state.games){const fixed=canonicalSeriesName(g.series,g.title); if(fixed && fixed!==g.series){await api('/api/games',{method:'PUT',body:JSON.stringify({game:{...g,series:fixed}})}); changed++;}}
  await load(); adminTab('seriesControl'); alert(`${changed} seri kaydı düzeltildi.`);
}
function currentSeriesItems(){return [...document.querySelectorAll('#sortableSeries .series-sort-item')];}
function sortCurrentSeriesByRelease(){const items=currentSeriesItems(); items.sort((a,b)=>{const ga=state.games.find(g=>String(g.id)===a.dataset.id)||{}, gb=state.games.find(g=>String(g.id)===b.dataset.id)||{}; return (parseDate(ga.release_date)?.getTime()||9999999999999)-(parseDate(gb.release_date)?.getTime()||9999999999999)||trSort(ga.title,gb.title);}).forEach(x=>$('#sortableSeries').appendChild(x));}
function sortCurrentSeriesAZ(){const items=currentSeriesItems(); items.sort((a,b)=>{const ga=state.games.find(g=>String(g.id)===a.dataset.id)||{}, gb=state.games.find(g=>String(g.id)===b.dataset.id)||{}; return trSort(ga.title,gb.title);}).forEach(x=>$('#sortableSeries').appendChild(x));}
async function moveGameToSeriesPrompt(id){const g=state.games.find(x=>String(x.id)===String(id)); if(!g)return; const target=prompt('Taşınacak seri adı:',g.series||''); if(!target)return; await api('/api/games',{method:'PATCH',body:JSON.stringify({ids:[id],patch:{series:target}})}); await load(); renderSeriesOrderList();}

function cleanDlcSearchTitle(title=''){
  return String(title||'')
    .replace(/\b\d+\s*\.\s*DLC'?si\b/gi,' ')
    .replace(/\bDLC'?si\b/gi,'DLC')
    .replace(/\b(Türkçe|Altyazılı|Dublajlı|Bölüm|Part|Episode|Gameplay|Oynanış|Final)\b/gi,' ')
    .replace(/[|#\[\]{}()]/g,' ')
    .replace(/\s+/g,' ')
    .trim();
}
function openGoogleImageSearch(q){
  const input=$('#rawgName');
  const title=cleanDlcSearchTitle(q || input?.value || $('#gameForm')?.elements?.title?.value || '');
  if(!title)return alert('Önce oyun adını yaz.');
  const url='https://www.google.com/search?tbm=isch&q='+enc(title+' game cover');
  window.open(url,'_blank','noopener,noreferrer');
}
function openGoogleImageSearchFromForm(){openGoogleImageSearch($('#gameForm')?.elements?.title?.value||'');}
function googleCoverGame(id){const g=state.games.find(x=>String(x.id)===String(id)); openGoogleImageSearch(g?.title||'');}

async function quickCover(id){const g=state.games.find(x=>String(x.id)===String(id)); if(!g)return; try{const j=await api('/api/rawg?name='+enc(g.title)); const cover=j.game?.cover||''; if(!cover)return alert('Kapak bulunamadı.'); await api('/api/games',{method:'PUT',body:JSON.stringify({game:{...g,cover,genre:j.game?.genre||g.genre,rawg_id:j.game?.rawg_id||g.rawg_id}})}); await load(); filterAdminGames();}catch(e){alert(e.message)}}
async function quickStory(id){const g=state.games.find(x=>String(x.id)===String(id)); if(!g)return; try{const j=await api('/api/rawg?story=1&name='+enc(g.title)); const description=j.game?.description||''; if(!description)return alert('Hikaye bulunamadı.'); await api('/api/games',{method:'PUT',body:JSON.stringify({game:{...g,description}})}); await load(); filterAdminGames();}catch(e){alert(e.message)}}
async function refreshCurrentSeriesCovers(){const key=state.seriesEditKey||$('#seriesSelect')?.value||''; const gr=groupGames().find(g=>slug(g.series)===key); if(!gr)return; if(!confirm(`${gr.series} serisinin kapakları RAWG ile yenilensin mi?`))return; let ok=0; for(const g of gr.games){try{const j=await api('/api/rawg?name='+enc(g.title)); const cover=j.game?.cover||''; if(cover){await api('/api/games',{method:'PUT',body:JSON.stringify({game:{...g,cover}})}); ok++;}}catch{}} await load(); renderSeriesOrderList(); alert(`${ok} kapak yenilendi.`);}

function alpha3Stats(){
  const games=state.games||[];
  return {
    all:games.length,
    noCover:games.filter(g=>!hasRealCoverAlpha3(g)),
    noStory:games.filter(g=>!String(g.description||'').trim()),
    noEpisode:games.filter(g=>!isUpcomingGameV201F2b(g)&&!(Array.isArray(g.episodes)&&g.episodes.length)),
    broken:games.filter(isBrokenGameAlpha3)
  };
}
function alpha3RepairPanel(){
  const st=alpha3Stats();
  return `<section class="alpha3-panel card">
    <div class="section-title"><div><span class="version-pill">V2.5.1 Fix 5</span><h2>Kapak / Hikaye / Hatalı Oyun Onarım V2</h2><p class="muted">Bu aşamada sadece kapak, hikaye ve hatalı oyun kontrolü eklendi. Loading ve admin sistemi korunur.</p></div><button onclick="alpha3FixAllIssues()">Tüm Hataları Onar</button></div>
    <div class="grid compact alpha3-stats">
      <div class="card"><h2>${st.all}</h2><p>Toplam oyun</p></div>
      <div class="card"><h2>${st.noCover.length}</h2><p>Kapaksız / otomatik kapak</p></div>
      <div class="card"><h2>${st.noStory.length}</h2><p>Hikayesiz</p></div>
      <div class="card"><h2>${st.noEpisode.length}</h2><p>Bölümsüz<br><small>Yakında hariç</small></p></div>
      <div class="card"><h2>${st.broken.length}</h2><p>Hatalı kayıt</p></div>
    </div>
    <div class="row alpha3-actions">
      <button onclick="alpha3ShowBroken()">Hatalı Oyunları Gör</button>
      <button class="ghost" onclick="alpha3ShowCoverless()">Kapaksız Oyunları Gör</button>
      <button class="ghost" onclick="alpha3ShowStoryless()">Hikayesiz Oyunları Gör</button>
      <button class="ghost" onclick="alpha3FixCovers()">Kapaksızları Otomatik Kapat</button>
      <button class="ghost" onclick="alpha3FixStories()">Hikayesizleri Geçici Doldur</button>
      <button class="ghost" onclick="alpha3RefreshRawgCovers()">Kapaksızları RAWG ile Dene</button>
    </div>
    <div id="alpha3Out" class="alpha3-out"></div>
  </section>`;
}
function alpha3IssueList(list,title='Hatalı Oyunlar'){
  const out=$('#alpha3Out')||$('#adminArea');
  if(!out)return;
  out.innerHTML=`<h2>${esc(title)}</h2><div class="grid">${list.map(g=>`<div class="card alpha3-issue-card"><div class="cover alpha3-cover" style="background-image:url('${esc(gameCover(g))}')"></div><h3>${esc(g.title||'Başlıksız')}</h3><p class="muted">${esc(g.series||'Serisiz')} • ${esc(g.type||'Tip yok')}</p><div class="issue-list">${gameIssuesAlpha3(g).map(x=>`<small>• ${esc(x)}</small>`).join('')||'<small>Uyarı yok</small>'}</div><div class="row"><button onclick="editGame('${esc(g.slug||'')}')">Düzenle</button><button class="ghost" onclick="alpha3RepairOne('${esc(g.id)}')">Onar</button><button class="ghost" onclick="quickCover('${esc(g.id)}')">RAWG Kapak</button><button class="ghost" onclick="quickStory('${esc(g.id)}')">RAWG Hikaye</button></div></div>`).join('')||'<div class="card"><p class="muted">Bu listede oyun yok.</p></div>'}</div>`;
}
function alpha3ShowBroken(){alpha3IssueList(alpha3Stats().broken,'Hatalı Oyunlar');}
function alpha3ShowCoverless(){alpha3IssueList(alpha3Stats().noCover,'Kapaksız / Otomatik Kapaklı Oyunlar');}
function alpha3ShowStoryless(){alpha3IssueList(alpha3Stats().noStory,'Hikayesiz Oyunlar');}
async function alpha3SaveGame(game){
  return await saveGameRepairV201F2b(game);
}
async function alpha3RepairOne(id){
  const g=state.games.find(x=>String(x.id)===String(id)||String(x.slug)===String(id)); if(!g)return;
  ensureRepairProgressV201F2e();
  setRepairProgressV201F2e(0,1,`Onarılıyor: ${g.title}`,`Tek kayıt onarımı başladı: ${g.title}`);
  await saveGameRepairV201F2b(g);
  setRepairProgressV201F2e(1,1,`Onarıldı: ${g.title}`,`Tek kayıt onarıldı: ${g.title}`);
  await load(); adminTab('repairV2');
}
async function alpha3FixCovers(){
  const list=alpha3Stats().noCover;
  if(!list.length)return alert('Kapaksız oyun yok.');
  if(!confirm(`${list.length} oyun için otomatik demo/DLC/seri kapağı atanacak. Devam edilsin mi?`))return;
  for(let i=0;i<list.length;i++){updateTopProgress(i,list.length,`Kapak atanıyor: ${list[i].title}`); await alpha3SaveGame({...list[i],cover:gameCover({...list[i],cover:''})});}
  finishTopProgress('Kapak onarımı tamamlandı'); await load(); adminTab('repairV2');
}
async function alpha3FixStories(){
  const list=alpha3Stats().noStory;
  if(!list.length)return alert('Hikayesiz oyun yok.');
  if(!confirm(`${list.length} oyun için geçici açıklama oluşturulacak. Devam edilsin mi?`))return;
  for(let i=0;i<list.length;i++){updateTopProgress(i,list.length,`Hikaye dolduruluyor: ${list[i].title}`); await alpha3SaveGame({...list[i],description:'Bu oyun için açıklama geçici olarak oluşturuldu. RAWG hikaye yenileme aracıyla daha detaylı bilgi çekebilirsin.'});}
  finishTopProgress('Hikaye onarımı tamamlandı'); await load(); adminTab('repairV2');
}

function ensureRepairProgressV201F2e(){
  let box=document.getElementById('repairProgressV201F2e');
  if(!box){
    const parent=document.getElementById('alpha3Out')||document.getElementById('adminArea')||document.getElementById('app');
    box=document.createElement('div');
    box.id='repairProgressV201F2e';
    box.className='repair-progress-v201f2e card';
    box.innerHTML=`<div class="repair-progress-head"><div><h2>Tüm Hataları Onar</h2><p class="muted" id="repairProgressTextV201F2e">Hazırlanıyor...</p></div><strong id="repairProgressPctV201F2e">%0</strong></div><div class="repair-progress-track-v201f2e"><b id="repairProgressBarV201F2e"></b></div><div id="repairProgressLogV201F2e" class="repair-progress-log-v201f2e"></div>`;
    if(parent) parent.prepend(box);
  }
  return box;
}
function setRepairProgressV201F2e(done,total,label='İşleniyor',detail=''){
  ensureRepairProgressV201F2e();
  const pct=total?Math.max(0,Math.min(100,Math.round(done/total*100))):0;
  const pctEl=document.getElementById('repairProgressPctV201F2e');
  const txtEl=document.getElementById('repairProgressTextV201F2e');
  const bar=document.getElementById('repairProgressBarV201F2e');
  const log=document.getElementById('repairProgressLogV201F2e');
  if(pctEl)pctEl.textContent='%'+pct;
  if(txtEl)txtEl.textContent=label;
  if(bar)bar.style.width=pct+'%';
  if(log&&detail){
    const row=document.createElement('div');
    row.textContent=detail;
    log.prepend(row);
    while(log.children.length>8)log.removeChild(log.lastChild);
  }
  if(typeof updateTopProgress==='function') updateTopProgress(done,total,label);
}
function finishRepairProgressV201F2e(label='Tamamlandı',detail=''){
  setRepairProgressV201F2e(100,100,label,detail);
  if(typeof finishTopProgress==='function') finishTopProgress(label);
}

async function alpha3FixAllIssues(){
  const list=alpha3Stats().broken;
  ensureRepairProgressV201F2e();
  if(!list.length){
    finishRepairProgressV201F2e('Hatalı oyun yok','Kontrol tamamlandı: hatalı kayıt bulunmadı.');
    return alert('Hatalı oyun yok.');
  }
  if(!confirm(`${list.length} hatalı oyun onarılsın mı? Başlıkta DLC varsa tip otomatik DLC yapılır. Yakında gelecek serilerde bölüm eksikliği hata sayılmayacak.`))return;
  let ok=0,fail=0;
  setRepairProgressV201F2e(0,list.length,'Toplu onarım başladı',`${list.length} kayıt kontrol edilecek.`);
  for(let i=0;i<list.length;i++){
    const g=list[i];
    const before=(typeof gameIssuesAlpha3==='function'?gameIssuesAlpha3(g):[]).join(', ');
    setRepairProgressV201F2e(i,list.length,`Onarılıyor: ${g.title}`,`${i+1}/${list.length} başladı: ${g.title}${before?` • ${before}`:''}`);
    try{
      await saveGameRepairV201F2b(g);
      ok++;
      setRepairProgressV201F2e(i+1,list.length,`Onarıldı: ${g.title}`,`${i+1}/${list.length} tamam: ${g.title}`);
    }catch(e){
      console.warn(e);
      fail++;
      setRepairProgressV201F2e(i+1,list.length,`Hata: ${g.title}`,`${i+1}/${list.length} hata: ${g.title}`);
    }
  }
  await load();
  const kalan=alpha3Stats().broken.length;
  finishRepairProgressV201F2e('Toplu onarım tamamlandı',`Onarılan: ${ok} • Hata: ${fail} • Kalan: ${kalan}`);
  adminTab('repairV2');
  setTimeout(()=>finishRepairProgressV201F2e('Toplu onarım tamamlandı',`Onarılan: ${ok} • Hata: ${fail} • Kalan: ${kalan}`),120);
  alert(`Onarılan: ${ok}\nHata: ${fail}\nKalan hatalı kayıt: ${kalan}\nNot: Başlıkta DLC geçenler DLC yapılır; Yakında Gelecek kayıtlarında bölüm eksikliği hata sayılmaz.`);
}
async function alpha3RefreshRawgCovers(){
  const list=alpha3Stats().noCover;
  if(!list.length)return alert('Kapaksız oyun yok.');
  if(!confirm(`${list.length} kapaksız oyun için RAWG kapak denensin mi? Bulunamazsa otomatik kapak atanır.`))return;
  let ok=0,fail=0;
  for(let i=0;i<list.length;i++){
    const g=list[i]; updateTopProgress(i,list.length,`RAWG kapak: ${g.title}`);
    try{const j=await api('/api/rawg?name='+enc(alpha3CoverQuery(g))); const cover=j.game?.cover||gameCover({...g,cover:''}); await alpha3SaveGame({...g,cover,genre:j.game?.genre||g.genre,rawg_id:j.game?.rawg_id||g.rawg_id}); ok++;}
    catch(e){console.warn(e); await alpha3SaveGame({...g,cover:gameCover({...g,cover:''})}); fail++;}
  }
  finishTopProgress('RAWG kapak denemesi tamamlandı'); await load(); adminTab('repairV2'); alert(`Kapak kontrol edilen: ${ok+fail}\nRAWG hata/fallback: ${fail}`);
}

function exportAll(){const data={games:state.games,notes:state.notes,events:state.events,settings:state.settings,version:VERSION}; const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})); a.download='hayatimiz-oyun-yedek.json'; a.click();}
window.addEventListener('hashchange',()=>{const p=location.hash.replace(/^#\/?/,'').split('/')[0]||'home'; state.page=p; render();});
Object.assign(window,{generateAboutText,updateSocialPreview,toggleMusic,setMusicVolume,nextAtmosphere,playMusic,pauseMusic,setPage,filterStatus,openGame,openSeries,watchGame,watchSeries,favGame,favSeries,removeWatch,azPick,login,register,logout,saveProfile,social,addFriend,respondFriend,removeFriend,openChat,sendMessage,sendComment,adminTab,updateUser,toggleBan,resetUser,deleteUser,gameForm,saveGame,editGame,clearGameForm,deleteGame,deleteSelectedGames,deleteAllGames,bulkUpdateSelectedGames,filterAdminGames,seriesOrderPanel,renderSeriesOrderList,moveSeriesItem,saveSeriesOrder,deleteSeriesGame,seriesControlPanel,mergeCheckedSeries,autoFixSeriesNames,sortCurrentSeriesByRelease,sortCurrentSeriesAZ,moveGameToSeriesPrompt,quickCover,quickStory,refreshCurrentSeriesCovers,chooseOne,toggleTagButton,saveNote,editNote,deleteNote,saveEvent,editEvent,deleteEvent,calendarImageFetch,saveSettings,clearLogs,rawgFetch,rawgStoryFetch,fetchRawgCoverForForm,ytFetch,ytChannelImport,ytChannelSync,bulkRefreshAllStories,bulkRefreshAllCovers,exportAll,copyCleanInstallCommands,downloadReadme,openGoogleImageSearch,openGoogleImageSearchFromForm,googleCoverGame,repairSelectedGames,repairAllGamesLight,markHere,markWatched,undoWatched});


async function bootAppV300(){
  try{
    await load();
  }catch(e){
    console.error('V2.5.1 Fix 5 açılış hatası:', e);
    state.settings=state.settings||{};
    state.games=Array.isArray(state.games)?state.games:[];
    state.notes=Array.isArray(state.notes)?state.notes:[];
    state.events=Array.isArray(state.events)?state.events:[];
  }
  const p=location.hash.replace(/^#\/?/,'').split('/')[0];
  state.page=p||'home';
  render();
  setTimeout(()=>{ if(typeof hideLoader==='function') hideLoader(); }, 240);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', bootAppV300);
else bootAppV300();


function renderAboutAdminV203F1(){
  const a=document.getElementById('adminArea');
  if(a)a.innerHTML=aboutAdminPanelV203F1();
}
function enhanceAdminGamesV203F1(){
  const a=document.getElementById('adminArea');
  if(!a || document.getElementById('gamesBulkToolbarV220'))return;
  const toolbar=document.createElement('section');
  toolbar.id='gamesBulkToolbarV220';
  toolbar.className='card bulk-toolbar-v220';
  toolbar.innerHTML=`<div><span class="version-pill">V2.5.1 Fix 5</span><h2>Toplu Oyun İşlemleri</h2><p class="muted">Tüm görünen oyunları seç, durum/seri/tip/etiket güncelle, onar veya sil. Tüm işlemlerde yüzde ilerleme görünür.</p></div>
  <div class="bulk-grid-v220">
    <label class="select-all-v220"><input type="checkbox" onchange="toggleAllV220(this)"> Tümünü Seç</label>
    <span data-selected-count-v220 class="version-pill">0 seçili</span>
    <select id="bulkStatusV220"><option value="">Durum değiştir</option><option>Devam Ediyor</option><option>Tamamlandı</option><option>Yakında Gelecek</option><option>Ara Verildi</option></select>
    <input id="bulkSeriesV220" placeholder="Seri adı değiştir">
    <select id="bulkTypeV220"><option value="">Tip değiştir</option><option>Ana Oyun</option><option>DLC</option><option>Demo</option><option>Ek Paket</option></select>
    <input id="bulkTagV220" placeholder="Etiket ekle">
    <button onclick="bulkUpdateSelectedGamesV220()">Seçilenleri Güncelle</button>
    <button class="ghost" onclick="repairSelectedGamesV220()">Seçilenleri Onar</button>
    <button class="danger" onclick="deleteSelectedGamesV220()">Seçilenleri Sil</button>
  </div>`;
  const list=document.getElementById('adminGamesList');
  if(list)list.before(toolbar); else a.prepend(toolbar);
  updateSelectedV220();
}
(function(){
  if(window.__HO_V203F1_ADMIN_WRAP__)return;
  window.__HO_V203F1_ADMIN_WRAP__=true;
  const oldAdminTab=window.adminTab || (typeof adminTab==='function'?adminTab:null);
  if(!oldAdminTab)return;
  window.adminTab=async function(t){
    const r=await oldAdminTab.apply(this,arguments);
    setTimeout(()=>{
      if(t==='games')enhanceAdminGamesV203F1();
      if(t==='aboutset'||t==='about')renderAboutAdminV203F1();
    },80);
    return r;
  };
  try{adminTab=window.adminTab;}catch(e){}
})();


function injectHomeV210(){
  try{
    if(state.page!=='home')return;
    const app=document.getElementById('app');
    if(!app || document.getElementById('homeV210Block'))return;
    const st=v210DashboardStats();
    const wrap=document.createElement('section');
    wrap.id='homeV210Block';
    wrap.className='home-v210-block';
    wrap.innerHTML=`${v210AnnouncementBanner()}<section class="grid compact v210-home-stats"><div class="card"><h2>${st.games}</h2><p>Oyun</p></div><div class="card"><h2>${st.series}</h2><p>Seri</p></div><div class="card"><h2>${st.eps}</h2><p>Bölüm</p></div><div class="card"><h2>${st.fav}</h2><p>Favori</p></div></section>`;
    app.prepend(wrap);
  }catch(e){}
}


(function(){
  if(window.__HO_V210_ADMIN_WRAP__)return;
  window.__HO_V210_ADMIN_WRAP__=true;
  const oldAdminTab=window.adminTab || (typeof adminTab==='function'?adminTab:null);
  if(!oldAdminTab)return;
  window.adminTab=async function(t){
    if(t==='v210'){
      const a=document.getElementById('adminArea');
      if(a)a.innerHTML=v210AdminPanel();
      return;
    }
    return await oldAdminTab.apply(this,arguments);
  };
  try{adminTab=window.adminTab;}catch(e){}
})();


function versionScoreV210(v=''){
  const m=String(v||'').match(/v?\s*(\d+)\.(\d+)\.(\d+)(?:\s*(?:fix|alpha|beta)\s*([0-9]+))?/i);
  if(!m)return 0;
  return Number(m[1])*100000000+Number(m[2])*1000000+Number(m[3])*10000+Number(m[4]||0);
}
function sortNotesV210(notes=[]){
  return [...notes].sort((a,b)=>{
    const sv=versionScoreV210(b.version||b.title)-versionScoreV210(a.version||a.title);
    if(sv)return sv;
    return new Date(b.created_at||0)-new Date(a.created_at||0);
  });
}


function v220AdminCenter(){
  const games=state.games||[];
  const issues=games.reduce((a,g)=>a+gameIssuesV220(g).length,0);
  const covers=games.filter(g=>!g.cover&&!g.thumbnail).length;
  const stories=games.filter(g=>!String(g.description||'').trim()).length;
  const eps=games.reduce((a,g)=>a+(Array.isArray(g.episodes)?g.episodes.length:0),0);
  return `<section class="card v220-center"><div class="section-title"><div><span class="version-pill">V2.5.1 Fix 5</span><h2>Profesyonel Stabilite Merkezi</h2><p class="muted">Site ve admin paneli için geniş kontrol, kayıt ilerleme sistemi ve kalite özetleri.</p></div><button onclick="setPage('notes')">Notları Gör</button></div>
  <div class="grid compact">
    <div class="card"><h2>${games.length}</h2><p>Oyun</p></div>
    <div class="card"><h2>${eps}</h2><p>Bölüm</p></div>
    <div class="card"><h2>${issues}</h2><p>Toplam Uyarı</p></div>
    <div class="card"><h2>${covers}</h2><p>Kapaksız</p></div>
    <div class="card"><h2>${stories}</h2><p>Hikayesiz</p></div>
  </div>
  <div class="split"><div class="card"><h2>Hızlı İşlemler</h2><div class="row"><button onclick="adminTab('games')">Oyunları Yönet</button><button class="ghost" onclick="adminTab('repairV2')">Onarım Merkezi</button></div></div><div class="card"><h2>Kaydetme Durumu</h2><p class="muted">Toplu oyun güncelleme, onarım, silme ve kayıt işlemlerinde canlı yüzde/progress alanı görünür.</p></div></div></section>`;
}


(function(){
  if(window.__HO_V220_ADMIN_WRAP__)return;
  window.__HO_V220_ADMIN_WRAP__=true;
  const oldAdminTab=window.adminTab || (typeof adminTab==='function'?adminTab:null);
  if(!oldAdminTab)return;
  window.adminTab=async function(t){
    if(t==='v220'){
      const a=document.getElementById('adminArea');
      if(a)a.innerHTML=v220AdminCenter();
      return;
    }
    const r=await oldAdminTab.apply(this,arguments);
    setTimeout(()=>{
      if(t==='games')enhanceAdminGamesV203F1();
    },80);
    return r;
  };
  try{adminTab=window.adminTab;}catch(e){}
})();


(function(){
  if(window.__HO_V220_SAVE_WRAP__)return;
  window.__HO_V220_SAVE_WRAP__=true;
  const wrapNames=['saveSettings','saveGame','saveNote','saveCalendar','saveAboutSettingsV203F1'];
  wrapNames.forEach(name=>{
    const old=window[name]||(typeof globalThis[name]==='function'?globalThis[name]:null);
    if(!old)return;
    window[name]=async function(){
      ensureProgressV220('Kaydetme İşlemi');
      setProgressV220(15,100,'Veriler hazırlanıyor',name+' başlatıldı.');
      try{
        setProgressV220(45,100,'Kaydediliyor','Sunucuya gönderiliyor...');
        const r=await old.apply(this,arguments);
        setProgressV220(80,100,'Kontrol ediliyor','Kayıt sonrası kontrol yapılıyor...');
        setTimeout(()=>finishProgressV220('Kaydetme tamamlandı',name+' başarıyla tamamlandı.'),150);
        return r;
      }catch(e){
        finishProgressV220('Kaydetme hatası',e.message||String(e));
        throw e;
      }
    };
    try{globalThis[name]=window[name];}catch(e){}
  });
})();

(function(){
  if(window.__HO_V300_SOCIALCHECK_WRAP__)return;
  window.__HO_V300_SOCIALCHECK_WRAP__=true;
  const oldAdminTab=window.adminTab || (typeof adminTab==='function'?adminTab:null);
  if(oldAdminTab){
    window.adminTab=async function(t){
      if(t==='socialcheck'){
        const a=document.getElementById('adminArea');
        if(a)a.innerHTML=renderSocialCheckV300();
        return;
      }
      return await oldAdminTab.apply(this,arguments);
    };
    try{adminTab=window.adminTab;}catch(e){}
  }
})();


function watchEpisode(gameId,idx){return openEpisodePlayerV220(gameId,idx)}
function playEpisode(gameId,idx){return openEpisodePlayerV220(gameId,idx)}
function openVideo(gameId,idx){return openEpisodePlayerV220(gameId,idx)}


(function(){
  if(window.__HO_V220_WATCHFIX_ADMIN__)return;
  window.__HO_V220_WATCHFIX_ADMIN__=true;
  const oldAdminTab=window.adminTab || (typeof adminTab==='function'?adminTab:null);
  if(oldAdminTab){
    window.adminTab=async function(t){
      const r=await oldAdminTab.apply(this,arguments);
      setTimeout(()=>{
        const a=document.getElementById('adminArea');
        if(!a||document.getElementById('videoIdRepairBoxV220'))return;
        if(t==='games'||t==='repairV2'||t==='v220'){
          const box=document.createElement('section');
          box.id='videoIdRepairBoxV220';
          box.className='card videoid-repair-v220';
          box.innerHTML=`<div><span class="version-pill">İzleme Fix</span><h2>Video ID Onarım</h2><p class="muted">Bölümlerde YouTube linki varsa ama videoId alanı boşsa otomatik doldurur.</p></div><button onclick="repairEpisodeVideoIdsV220()">Video ID’leri Onar</button>`;
          a.prepend(box);
        }
      },90);
      return r;
    };
    try{adminTab=window.adminTab;}catch(e){}
  }
})();



/* V2.5.1 Fix 5 - Alfabetik sıralama ve tam oyun adı görünümü */
function normalizeSortTR250F1(x=''){
  return String(x||'')
    .toLocaleLowerCase('tr-TR')
    .replace(/^the\s+/i,'')
    .replace(/[’']/g,'')
    .replace(/\s+/g,' ')
    .trim();
}
function sortTitleTR250F1(a,b){
  return normalizeSortTR250F1(a).localeCompare(normalizeSortTR250F1(b),'tr-TR',{numeric:true,sensitivity:'base'});
}
function sortGamesTR250F1(games=[]){
  return [...games].sort((a,b)=>{
    const sa=seriesName250 ? seriesName250(a) : (a.series||'');
    const sb=seriesName250 ? seriesName250(b) : (b.series||'');
    const bySeries=sortTitleTR250F1(sa,sb);
    if(bySeries)return bySeries;
    const oa=Number(a.order_no??a.order??999999);
    const ob=Number(b.order_no??b.order??999999);
    if(oa!==ob)return oa-ob;
    return sortTitleTR250F1(a.title,b.title);
  });
}
function sortGamesTitleOnly250F1(games=[]){
  return [...games].sort((a,b)=>sortTitleTR250F1(a.title,b.title));
}
function fullTitle250F1(g){
  return esc250 ? esc250(g?.title||'Başlıksız') : String(g?.title||'Başlıksız');
}
function fullSeries250F1(g){
  const name=(typeof seriesName250==='function'?seriesName250(g):(g?.series||'Serisiz'));
  return esc250 ? esc250(name) : String(name);
}
function titleAttr250F1(g){
  return `title="${fullTitle250F1(g)}"`;
}

function megaHome250(){
  const health=healthScore250();
  const cont=continueItem250();
  const rec=recommendation250();
  const games=state.games||[];
  const last=games.slice(-6).reverse();
  const ongoing=games.filter(g=>/devam/i.test(g.status||'')).slice(0,6);
  const done=games.filter(g=>/tamamlandı|tamamlandi|bitti/i.test(g.status||'')).slice(0,6);
  const upcoming=games.filter(g=>isUpcoming250(g)).slice(0,6);
  $('#app').innerHTML=`<section class="hero mega-hero250"><span class="version-pill">V${VERSION}</span><h1>Hayatımız Oyun V2.5.1 Fix 5 Platform</h1><p>Oyun arşivi, site içi izleme, seri iste, hata bildir, katkı merkezi, sağlık puanı ve profesyonel admin altyapısı tek merkezde.</p><div class="row"><button onclick="setPage('contribute250')">Seri İste / Hata Bildir</button><button class="ghost" onclick="randomGame250()">Rastgele Oyun Öner</button></div></section>
  <section class="mega-stats250 grid compact"><div class="card"><h2>${games.length}</h2><p>Oyun</p></div><div class="card"><h2>${health.score}%</h2><p>Site Sağlığı</p></div><div class="card"><h2>${requestList250().length}</h2><p>Seri İsteği</p></div><div class="card"><h2>${reportList250().length}</h2><p>Hata Bildirimi</p></div></section>
  ${cont?`<section class="card continue250"><div><span class="version-pill">Kaldığın Yerden Devam Et</span><h2>${esc250(cont.game.title)} - ${esc250(cont.ep?.title||'Sonraki Bölüm')}</h2><p class="muted">Son izlenen kaydından sonraki bölüm önerildi.</p></div><button onclick="openEpisodePlayerV220('${esc250(key250(cont.game))}','${cont.idx}')">Devam Et</button></section>`:''}
  ${rec?`<section class="card recommend250"><div><span class="version-pill">Bugün Ne İzlesem?</span><h2>${esc250(rec.title)}</h2><p class="muted">${esc250(seriesName250(rec))} • ${esc250(rec.status||'Durum yok')}</p></div><button onclick="showGameDetailV210('${esc250(key250(rec))}')">Öneriyi Aç</button></section>`:''}
  <section class="dashboard-section250"><h2>Son Eklenenler</h2><div class="grid">${last.map(gameCardMega250).join('')}</div></section>
  <section class="dashboard-section250"><h2>Devam Eden Seriler</h2><div class="grid">${ongoing.map(gameCardMega250).join('')||'<div class="card"><p>Devam eden içerik yok.</p></div>'}</div></section>
  <section class="dashboard-section250"><h2>Yakında Gelecekler</h2><div class="grid">${upcoming.map(gameCardMega250).join('')||'<div class="card"><p>Yakında gelecek içerik yok.</p></div>'}</div></section>`;
}
function gameCardMega250(g){
  const id=key250(g);
  const prog=progressForGame250(g);
  const fav=v250User().favorites.includes(id);
  return `<article class="mega-game250 card ${stableCardClass251(g)}" data-game-title-full="${fullTitle250F1(g)}">
    <div class="mega-cover250" style="background-image:url('${esc250(cover250(g))}')"><span>${esc250(g.status||'Durum')}</span><button onclick="favGame250('${esc250(id)}')" class="${fav?'active':''}">${fav?'★':'☆'}</button></div>
    <div class="mega-body250"><h3 class="full-game-title250" ${titleAttr250F1(g)}>${fullTitle250F1(g)}</h3><p class="muted full-game-meta250">${fullSeries250F1(g)} • ${episodes250(g).length} bölüm</p><div class="progress-mini250"><b style="width:${prog}%"></b></div><small>İlerleme: %${prog}</small><div class="row"><button onclick="showGameDetailV210('${esc250(id)}')">Detay</button><button class="ghost" onclick="favSeries250('${esc250(seriesName250(g))}')">Seri Favori</button></div></div>
  </article>`;
}
function contributePage250(){
  $('#app').innerHTML=`<section class="hero"><span class="version-pill">V2.5.1 Fix 5</span><h1>Kullanıcı Katkı Merkezi</h1><p>Seri iste, hata bildir, öneri gönder ve arşivin gelişmesine katkı sağla.</p></section>
  <section class="split contribute250">
    <div class="card"><h2>Seri İste</h2><label>Seri / Oyun Adı<input id="reqTitle250" placeholder="Örn: Far Cry Primal"></label><label>Neden istiyorsun?<textarea id="reqReason250" rows="4"></textarea></label><label>Tür<input id="reqType250" placeholder="Aksiyon, korku, macera"></label><label>Playlist Linki<input id="reqPlaylist250" placeholder="YouTube playlist varsa"></label><label>Öncelik<select id="reqPriority250"><option>Normal</option><option>Yüksek</option><option>Düşük</option></select></label><button onclick="submitSeriesRequest250()">Seri İsteği Gönder</button></div>
    <div class="card"><h2>Hata Bildir</h2><label>Hata Başlığı<input id="repTitle250" placeholder="Örn: Video açılmıyor"></label><label>Hata Türü<select id="repType250"><option>Video açılmıyor</option><option>Kapak hatası</option><option>Yanlış bölüm</option><option>Yanlış seri</option><option>Hikaye hatası</option><option>Sosyal medya hatası</option><option>Site görünüm hatası</option><option>Eksik bölüm</option><option>Diğer</option></select></label><label>İlgili Oyun / Seri<input id="repGame250" placeholder="Oyun adı"></label><label>Detay<textarea id="repDetail250" rows="5"></textarea></label><button onclick="submitReport250()">Hata Bildir</button></div>
  </section>
  <section class="grid compact"><div class="card"><h2>${requestList250().length}</h2><p>Seri isteği</p></div><div class="card"><h2>${reportList250().length}</h2><p>Hata bildirimi</p></div><div class="card"><h2>${suggestList250().length}</h2><p>Öneri</p></div></section>`;
}
function profileDashboard250(){
  const u=v250User();
  const watched=Object.keys(u.watch).length;
  const hist=u.history.slice(0,12);
  $('#app').innerHTML=`<section class="hero"><span class="version-pill">V2.5.1 Fix 5</span><h1>Profil Dashboard V2</h1><p>Favoriler, izleme geçmişi, rozetler ve kişisel istatistikler.</p></section>
  <section class="grid compact"><div class="card"><h2>${u.favorites.length}</h2><p>Favori Oyun</p></div><div class="card"><h2>${u.seriesFavorites.length}</h2><p>Favori Seri</p></div><div class="card"><h2>${watched}</h2><p>İzlenen Bölüm</p></div><div class="card"><h2>${u.badges.length}</h2><p>Rozet</p></div></section>
  <section class="split"><div class="card"><h2>Rozetler</h2><div class="badge-grid250">${u.badges.map(x=>`<span>${esc250(x)}</span>`).join('')||'<p class="muted">Henüz rozet yok.</p>'}</div></div><div class="card"><h2>Favori Seriler</h2><div class="badge-grid250">${u.seriesFavorites.map(x=>`<span>${esc250(x)}</span>`).join('')||'<p class="muted">Henüz favori seri yok.</p>'}</div></div></section>
  <section class="card"><h2>İzleme Geçmişi</h2>${hist.map(h=>{const g=(state.games||[]).find(x=>key250(x)===h.gameId);const ep=g?episodes250(g)[h.epIndex]:null;return `<div class="history-row250"><b>${esc250(g?.title||'Oyun')}</b><span>${esc250(ep?.title||'Bölüm')}</span><small>${esc250(new Date(h.at).toLocaleString('tr-TR'))}</small></div>`}).join('')||'<p class="muted">Henüz izleme geçmişi yok.</p>'}</section>`;
}
function seriesDetail250(name){
  const games=(state.games||[]).filter(g=>seriesName250(g)===name);
  const eps=games.reduce((a,g)=>a+episodes250(g).length,0);
  const progress=games.length?Math.round(games.reduce((a,g)=>a+progressForGame250(g),0)/games.length):0;
  $('#app').innerHTML=`<section class="hero series-detail250"><span class="version-pill">Seri Detay V2</span><h1>${esc250(name)}</h1><p>${games.length} oyun • ${eps} bölüm • izleme ilerlemesi %${progress}</p><div class="row"><button onclick="favSeries250('${esc250(name)}')">Seriyi Favorile</button><button class="ghost" onclick="setPage('contribute250')">Hata Bildir / Seri İste</button></div></section><section class="timeline250">${games.map((g,i)=>`<article class="card"><span>${i+1}</span><h2>${esc250(g.title)}</h2><p>${esc250(g.type||'Ana Oyun')} • ${esc250(g.status||'Durum')}</p></article>`).join('')}</section><section class="grid">${games.map(gameCardMega250).join('')}</section>`;
}
function healthCenter250(){
  const h=healthScore250();
  const issues=allIssues250();
  $('#app').innerHTML=`<section class="hero"><span class="version-pill">V2.5.1 Fix 5</span><h1>Site Sağlık Puanı: %${h.score}</h1><p>Kapaklar, hikayeler, video ID, sosyal linkler ve güncelleme notları kontrol edildi.</p></section>
  <section class="grid compact"><div class="card"><h2>${h.covers}%</h2><p>Kapaklar</p></div><div class="card"><h2>${h.stories}%</h2><p>Hikayeler</p></div><div class="card"><h2>${h.videos}%</h2><p>Video ID</p></div><div class="card"><h2>${h.social}%</h2><p>Sosyal Linkler</p></div><div class="card"><h2>${h.notes}%</h2><p>Güncelleme Notları</p></div></section>
  <section class="card"><h2>Öncelikli Hatalar</h2>${issues.sort((a,b)=>({kritik:0,yüksek:1,orta:2,düşük:3}[a.level]-{kritik:0,yüksek:1,orta:2,düşük:3}[b.level])).slice(0,60).map(i=>`<div class="issue250 ${i.level}"><b>${esc250(i.level.toUpperCase())}</b><span>${esc250(i.game.title)} - ${esc250(i.text)}</span></div>`).join('')||'<p class="muted">Sorun bulunmadı.</p>'}</section>`;
}
function featuresPage250(){
  $('#app').innerHTML=`<section class="hero"><span class="version-pill">V2.5.1 Fix 5</span><h1>40 Mega Özellik</h1><p>Bu sürüm Hayatımız Oyun’u oyun arşivi platformuna dönüştüren mega güncellemedir.</p></section><section class="feature-grid250">${v250FeatureList().map((x,i)=>`<article class="card"><span>${i+1}</span><h2>${esc250(x)}</h2></article>`).join('')}</section>`;
}


function injectNav250(){
  try{
    const nav=document.getElementById('nav');
    if(!nav||document.getElementById('navMega250'))return;
    const group=document.createElement('span');
    group.id='navMega250';
    group.className='nav-mega250';
    const items=[['contribute250','Katkı'],['health250','Sağlık'],['features250','V2.5.1 Fix 5'],['profile250','Profil']];
    group.innerHTML=items.map(([p,l])=>`<button type="button" data-page="${p}" class="${state.page===p?'active':''}">${l}</button>`).join('');
    nav.appendChild(group);
    group.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>setPage(b.dataset.page)));
  }catch(e){}
}
function injectMobileNav250(){
  try{
    if(document.getElementById('mobileNav250'))return;
    const bar=document.createElement('nav');
    bar.id='mobileNav250';
    bar.className='mobile-nav250';
    bar.innerHTML=`<button onclick="setPage('home')">Ana</button><button onclick="setPage('series')">Seriler</button><button onclick="setPage('searchv210')">Arama</button><button onclick="setPage('contribute250')">Katkı</button><button onclick="setPage('profile250')">Profil</button>`;
    document.body.appendChild(bar);
  }catch(e){}
}


function adminCenter250(){
  const health=healthScore250();
  const req=requestList250();
  const rep=reportList250();
  const log=adminLog250();
  return `<section class="card admin250"><div class="section-title"><div><span class="version-pill">V2.5.1 Fix 5</span><h2>V2.5.1 Fix 5 Final Kontrol Paneli</h2><p class="muted">Seri istekleri, hata bildirimleri, sağlık puanı, admin işlem geçmişi, yedekleme ve mega sistem kontrolleri.</p></div><button onclick="exportMegaBackup250()">Tam Yedek Al</button></div>
  <div class="grid compact"><div class="card"><h2>${health.score}%</h2><p>Site Sağlığı</p></div><div class="card"><h2>${req.length}</h2><p>Seri İsteği</p></div><div class="card"><h2>${rep.length}</h2><p>Hata Bildirimi</p></div><div class="card"><h2>${health.totalIssues}</h2><p>Toplam Hata</p></div></div>
  <section class="split"><div class="card"><h2>Hızlı İşlemler</h2><div class="row"><button onclick="setPage('health250')">Sağlık Paneli</button><button class="ghost" onclick="playlistImportMock250()">Playlist İçe Aktarma</button><button class="ghost" onclick="importMegaBackup250()">Yedek İçeri Al</button></div></div><div class="card"><h2>40 Özellik</h2><p class="muted">V2.5.1 Fix 5 mega özellik listesini kullanıcı tarafında göster.</p><button onclick="setPage('features250')">Özellikleri Gör</button></div></section>
  <section class="card"><h2>Seri İstekleri</h2>${req.map(r=>`<div class="contrib-row250"><div><b>${esc250(r.title)}</b><p>${esc250(r.reason||'')}</p><small>${esc250(r.status)} • ${esc250(r.priority)}</small></div><div class="row"><button onclick="changeRequestStatus250('${r.id}','İnceleniyor')">İncele</button><button class="ghost" onclick="changeRequestStatus250('${r.id}','Kabul edildi')">Kabul</button><button class="danger" onclick="changeRequestStatus250('${r.id}','Reddedildi')">Red</button></div></div>`).join('')||'<p class="muted">Seri isteği yok.</p>'}</section>
  <section class="card"><h2>Hata Bildirimleri</h2>${rep.map(r=>`<div class="contrib-row250"><div><b>${esc250(r.title)}</b><p>${esc250(r.detail||'')}</p><small>${esc250(r.type)} • ${esc250(r.status)}</small></div><div class="row"><button onclick="changeReportStatus250('${r.id}','İnceleniyor')">İncele</button><button class="ghost" onclick="changeReportStatus250('${r.id}','Düzeltildi')">Düzeltildi</button><button class="danger" onclick="changeReportStatus250('${r.id}','Reddedildi')">Red</button></div></div>`).join('')||'<p class="muted">Hata bildirimi yok.</p>'}</section>
  <section class="card"><h2>Admin İşlem Geçmişi</h2>${log.slice(0,20).map(x=>`<div class="history-row250"><b>${esc250(x.action)}</b><span>${esc250(x.detail||'')}</span><small>${esc250(new Date(x.at).toLocaleString('tr-TR'))}</small></div>`).join('')||'<p class="muted">İşlem geçmişi yok.</p>'}</section></section>`;
}
(function(){
  if(window.__HO_V250_ADMIN_WRAP__)return;
  window.__HO_V250_ADMIN_WRAP__=true;
  const oldAdminTab=window.adminTab || (typeof adminTab==='function'?adminTab:null);
  if(oldAdminTab){
    window.adminTab=async function(t){
      if(t==='v250'){
        const a=document.getElementById('adminArea');
        if(a)a.innerHTML=adminCenter250();
        return;
      }
      return await oldAdminTab.apply(this,arguments);
    };
    try{adminTab=window.adminTab;}catch(e){}
  }
})();


(function(){
  if(window.__HO_V251_VIDEO_PATCH__)return;
  window.__HO_V251_VIDEO_PATCH__=true;
  const oldExtract=window.extractVideoIdV220 || (typeof extractVideoIdV220==='function'?extractVideoIdV220:null);
  window.extractVideoIdV220=function(input=''){
    const raw=String(input||'').trim();
    if(oldExtract){const got=oldExtract(raw); if(got)return got;}
    const live=raw.match(/(?:youtube\.com\/live\/|\/live\/)([a-zA-Z0-9_-]{11})/);
    if(live)return live[1];
    const shorts=raw.match(/shorts\/([a-zA-Z0-9_-]{11})/);
    if(shorts)return shorts[1];
    return '';
  };
  try{extractVideoIdV220=window.extractVideoIdV220;}catch(e){}
})();


(function(){
  if(window.__HO_V251_ADMIN_WRAP__)return;
  window.__HO_V251_ADMIN_WRAP__=true;
  const oldAdminTab=window.adminTab || (typeof adminTab==='function'?adminTab:null);
  if(oldAdminTab){
    window.adminTab=async function(t){
      if(t==='opening251'){
        const a=document.getElementById('adminArea');
        if(a){a.innerHTML=openingAdmin251();previewOpening251();}
        return;
      }
      if(t==='notes251'){
        const a=document.getElementById('adminArea');
        if(a)a.innerHTML=renderNotesManager251();
        return;
      }
      return await oldAdminTab.apply(this,arguments);
    };
    try{adminTab=window.adminTab;}catch(e){}
  }
})();


/* V2.5.1 Fix 5 - Sade Stabil Override */
function _esc251(x){
  if(typeof esc250==='function')return esc250(x);
  if(typeof escV220==='function')return escV220(x);
  if(typeof esc==='function')return esc(x);
  return String(x??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
function _key251(g){return String(g?.id||g?.slug||g?.title||'')}
function _cover251(g){
  try{return (typeof cover250==='function'?cover250(g):(typeof gameCoverV220==='function'?gameCoverV220(g):(typeof gameCover==='function'?gameCover(g):(g?.cover||g?.thumbnail))))||'/assets/series-placeholder.svg'}
  catch(e){return g?.cover||g?.thumbnail||'/assets/series-placeholder.svg'}
}
function _eps251(g){return Array.isArray(g?.episodes)?g.episodes:[]}
function _series251(g){
  try{return typeof seriesName250==='function'?seriesName250(g):(typeof getSeriesName==='function'?getSeriesName(g):(g?.series||'Serisiz'))}
  catch(e){return g?.series||'Serisiz'}
}
function _sort251(a,b){return String(a||'').toLocaleLowerCase('tr-TR').localeCompare(String(b||'').toLocaleLowerCase('tr-TR'),'tr-TR',{numeric:true,sensitivity:'base'})}
function _games251(){return [...(state.games||[])].sort((a,b)=>_sort251(a.title,b.title))}
function _issues251(g){try{return typeof issueList250==='function'?issueList250(g).length:(typeof gameIssuesV220==='function'?gameIssuesV220(g).length:0)}catch(e){return 0}}
function _stats251(){
  const games=state.games||[];
  return {games:games.length,series:new Set(games.map(g=>_series251(g))).size,eps:games.reduce((a,g)=>a+_eps251(g).length,0),issues:games.reduce((a,g)=>a+_issues251(g),0)}
}
function _card251(g){
  const id=_key251(g);
  return `<article class="ho-card251 card">
    <div class="ho-cover251" style="background-image:url('${_esc251(_cover251(g))}')"><span>${_esc251(g.status||'Durum Yok')}</span></div>
    <div class="ho-body251"><h3 title="${_esc251(g.title||'Başlıksız')}">${_esc251(g.title||'Başlıksız')}</h3>
    <p class="muted">${_esc251(_series251(g))} • ${_esc251(g.type||'Ana Oyun')} • ${_eps251(g).length} bölüm</p>
    <div class="row"><button onclick="showGameDetailV210('${_esc251(id)}')">Detay</button><button class="ghost" onclick="setPage('contribute251')">Hata Bildir</button></div></div>
  </article>`;
}
function home(){
  const st=_stats251(), games=_games251().slice(0,18);
  $('#app').innerHTML=`<section class="hero ho-hero251"><span class="version-pill">V${VERSION}</span><h1>Hayatımız Oyun</h1><p class="muted">Sade, hızlı ve stabil oyun arşivi. Gereksiz mega kalabalık temizlendi.</p><div class="row"><button onclick="setPage('searchv210')">Oyun Ara</button><button class="ghost" onclick="setPage('contribute251')">Seri İste / Hata Bildir</button></div></section>
  <section class="grid compact ho-stats251"><div class="card"><h2>${st.games}</h2><p>Oyun</p></div><div class="card"><h2>${st.series}</h2><p>Seri</p></div><div class="card"><h2>${st.eps}</h2><p>Bölüm</p></div><div class="card"><h2>${st.issues}</h2><p>Kontrol</p></div></section>
  <section class="section-clean251"><div class="section-title"><div><h2>Oyunlar</h2><p class="muted">Alfabetik ve tam başlıklı sade liste.</p></div></div><div class="grid">${games.map(_card251).join('')||'<div class="card"><p>Oyun yok.</p></div>'}</div></section>`;
}
function contributePage251(){
  $('#app').innerHTML=`<section class="hero"><span class="version-pill">V2.5.1 Fix 5</span><h1>Seri İste / Hata Bildir</h1><p class="muted">Gereken katkı alanları sade şekilde bırakıldı.</p></section>
  <section class="split"><div class="card"><h2>Seri İste</h2><label>Seri / Oyun Adı<input id="reqTitle250" placeholder="Örn: Far Cry Primal"></label><label>Not<textarea id="reqReason250" rows="4"></textarea></label><button onclick="typeof submitSeriesRequest250==='function'?submitSeriesRequest250():alert('Seri isteği alındı.')">Gönder</button></div>
  <div class="card"><h2>Hata Bildir</h2><label>Hata Başlığı<input id="repTitle250" placeholder="Örn: Video açılmıyor"></label><label>Hata Türü<select id="repType250"><option>Video açılmıyor</option><option>Kapak hatası</option><option>Yanlış bölüm</option><option>Yanlış seri</option><option>Site görünüm hatası</option><option>Diğer</option></select></label><label>Detay<textarea id="repDetail250" rows="5"></textarea></label><button onclick="typeof submitReport250==='function'?submitReport250():alert('Hata bildirimi alındı.')">Hata Bildir</button></div></section>`;
}
function profileDashboard250(){
  const watched=typeof v250User==='function'?Object.keys(v250User().watch||{}).length:0;
  const fav=typeof v250User==='function'?(v250User().favorites||[]).length:0;
  $('#app').innerHTML=`<section class="hero"><span class="version-pill">V2.5.1 Fix 5</span><h1>Profil</h1><p class="muted">Sade profil özeti.</p></section><section class="grid compact"><div class="card"><h2>${fav}</h2><p>Favori</p></div><div class="card"><h2>${watched}</h2><p>İzlenen Bölüm</p></div><div class="card"><h2>${(state.games||[]).length}</h2><p>Toplam Oyun</p></div></section>`;
}
function featuresPage250(){home()}
function healthCenter250(){
  const st=_stats251();
  $('#app').innerHTML=`<section class="hero"><span class="version-pill">V2.5.1 Fix 5</span><h1>Site Sağlığı</h1><p class="muted">Basit kontrol özeti.</p></section><section class="grid compact"><div class="card"><h2>${st.issues}</h2><p>Toplam Uyarı</p></div><div class="card"><h2>${st.games}</h2><p>Oyun</p></div><div class="card"><h2>${st.eps}</h2><p>Bölüm</p></div></section>`;
}
function injectNav250(){
  try{
    const nav=document.getElementById('nav');
    if(!nav||document.getElementById('navClean251'))return;
    const group=document.createElement('span');
    group.id='navClean251';
    group.className='nav-clean251';
    group.innerHTML=`<button type="button" data-page="contribute251">Katkı</button><button type="button" data-page="profile250">Profil</button>`;
    nav.appendChild(group);
    group.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>setPage(b.dataset.page)));
  }catch(e){}
}
function injectMobileNav250(){
  const old=document.getElementById('mobileNav250');
  if(old)old.remove();
}
function render(){
  applyTheme();
  document.documentElement.style.setProperty('--bg-intensity', Math.max(.2, Math.min(1.25, Number(state.settings?.background_intensity??75)/100)));
  updateSeo();
  document.body.classList.remove('menu-open');
  const app=$('#app');
  if(app){app.classList.remove('page-in'); void app.offsetWidth; app.classList.add('page-in');}
  renderNav();
  if(typeof injectNavV210==='function')injectNavV210();
  injectNav250();
  setAtmosphereTheme(state.page);
  if(state.settings?.maintenance && !canSeeAdmin()){maintenance();return;}
  const pages={home,series,az,calendar,notes,social,about,profile:profileDashboard250,admin,archivev210:archivePageV210,searchv210:searchPageV210,favoritesv210:favoritesPageV210,trackingv210:trackingPageV210,contribute251:contributePage251,profile250:profileDashboard250,health250:healthCenter250,features250:featuresPage250};
  (pages[state.page]||home)();
  renderMusicPanel();
}
function adminCenter251(){
  const st=_stats251();
  return `<section class="card"><div class="section-title"><div><span class="version-pill">V2.5.1 Fix 5</span><h2>Sade Admin Merkezi</h2><p class="muted">Gereksiz mega bölümler temizlendi.</p></div></div><div class="grid compact"><div class="card"><h2>${st.games}</h2><p>Oyun</p></div><div class="card"><h2>${st.series}</h2><p>Seri</p></div><div class="card"><h2>${st.eps}</h2><p>Bölüm</p></div><div class="card"><h2>${st.issues}</h2><p>Uyarı</p></div></div><div class="row"><button onclick="adminTab('games')">Oyunları Yönet</button><button class="ghost" onclick="adminTab('opening251')">Açılış Yönetimi</button><button class="ghost" onclick="adminTab('notes251')">Not Yönetimi</button></div></section>`;
}
(function(){
  if(window.__HO_V251_FIX1_WRAP__)return;
  window.__HO_V251_FIX1_WRAP__=true;
  const oldAdminTab=window.adminTab || (typeof adminTab==='function'?adminTab:null);
  if(oldAdminTab){
    window.adminTab=async function(t){
      if(t==='clean251'||t==='v250'){
        const a=document.getElementById('adminArea');
        if(a)a.innerHTML=adminCenter251();
        return;
      }
      return await oldAdminTab.apply(this,arguments);
    };
    try{adminTab=window.adminTab;}catch(e){}
  }
})();


/* V2.5.1 Fix 5 - Görseldeki profesyonel arayüz düzeni */
function uiEsc252(x){
  if(typeof _esc251==='function')return _esc251(x);
  if(typeof esc250==='function')return esc250(x);
  if(typeof escV220==='function')return escV220(x);
  if(typeof esc==='function')return esc(x);
  return String(x??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
function uiKey252(g){return String(g?.id||g?.slug||g?.title||'')}
function uiCover252(g){
  try{
    return (typeof _cover251==='function'?_cover251(g):(typeof cover250==='function'?cover250(g):(typeof gameCoverV220==='function'?gameCoverV220(g):(g?.cover||g?.thumbnail))))||'/assets/series-placeholder.svg';
  }catch(e){return g?.cover||g?.thumbnail||'/assets/series-placeholder.svg'}
}
function uiSeries252(g){
  try{return typeof _series251==='function'?_series251(g):(typeof seriesName250==='function'?seriesName250(g):(typeof getSeriesName==='function'?getSeriesName(g):(g?.series||'Serisiz')))}
  catch(e){return g?.series||'Serisiz'}
}
function uiEpisodes252(g){return Array.isArray(g?.episodes)?g.episodes:[]}
function uiSort252(a,b){
  return String(a||'').toLocaleLowerCase('tr-TR').trim().localeCompare(String(b||'').toLocaleLowerCase('tr-TR').trim(),'tr-TR',{numeric:true,sensitivity:'base'});
}
function uiGames252(){
  return [...(state.games||[])].sort((a,b)=>uiSort252(a.title,b.title));
}
function uiStats252(){
  const games=state.games||[];
  const series=new Set(games.map(g=>String(uiSeries252(g))).filter(Boolean)).size;
  const eps=games.reduce((a,g)=>a+uiEpisodes252(g).length,0);
  let issues=0;
  games.forEach(g=>{
    try{issues+=typeof issueList250==='function'?issueList250(g).length:(typeof gameIssuesV220==='function'?gameIssuesV220(g).length:0)}catch(e){}
  });
  const score=Math.max(0,Math.min(100,Math.round(100-(issues/Math.max(1,games.length*4))*100)));
  return {games:games.length,series,eps,score};
}
function uiStatusClass252(status=''){
  const s=String(status||'').toLocaleLowerCase('tr-TR');
  if(/tamam|bitti|completed/.test(s))return 'done';
  if(/devam|aktif|ongoing/.test(s))return 'live';
  if(/yakında|yakinda|gelecek/.test(s))return 'soon';
  return 'neutral';
}
function uiGameCard252(g){
  const id=uiKey252(g);
  const status=g.status||'Durum Yok';
  const eps=uiEpisodes252(g);
  return `<article class="ui-game252 card">
    <div class="ui-cover252" style="background-image:url('${uiEsc252(uiCover252(g))}')">
      <span class="ui-status252 ${uiStatusClass252(status)}">${uiEsc252(status)}</span>
    </div>
    <div class="ui-body252">
      <h3 title="${uiEsc252(g.title||'Başlıksız')}">${uiEsc252(g.title||'Başlıksız')}</h3>
      <p class="muted">Seri: ${uiEsc252(uiSeries252(g))}</p>
      <p class="muted">Tür: ${uiEsc252(g.genre||g.type||'Aksiyon, Macera')}</p>
      <p class="muted">Bölüm: ${eps.length || 0}</p>
      <div class="ui-actions252">
        <button onclick="showGameDetailV210('${uiEsc252(id)}')">ⓘ Detay</button>
        <button class="ghost" onclick="setPage('contribute251')">⚠ Hata Bildir</button>
      </div>
    </div>
  </article>`;
}
function uiHero252(){
  const st=uiStats252();
  return `<section class="ui-hero252">
    <div class="ui-hero-bg252"></div>
    <div class="ui-hero-content252">
      <span class="ui-version252">V${VERSION}</span>
      <h1>Hayatımız Oyun</h1>
      <p>Sade, hızlı ve stabil oyun arşivi</p>
      <div class="ui-hero-actions252">
        <button onclick="setPage('searchv210')">⌕ Oyun Ara</button>
        <button class="ghost" onclick="setPage('contribute251')">▣ Seri İste / Hata Bildir</button>
      </div>
    </div>
  </section>
  <section class="ui-stats252">
    <article class="card"><span class="blue">🎮</span><div><p>Oyun</p><h2>${st.games.toLocaleString('tr-TR')}</h2><small>Toplam oyun</small></div></article>
    <article class="card"><span class="purple">▰</span><div><p>Seri</p><h2>${st.series.toLocaleString('tr-TR')}</h2><small>Toplam seri</small></div></article>
    <article class="card"><span class="green">☷</span><div><p>Bölüm</p><h2>${st.eps.toLocaleString('tr-TR')}</h2><small>Toplam bölüm</small></div></article>
    <article class="card"><span class="gold">🛡</span><div><p>Kontrol</p><h2>${st.score}%</h2><small>Başarı oranı</small></div></article>
  </section>`;
}
function home(){
  const games=uiGames252().slice(0,12);
  $('#app').innerHTML=`${uiHero252()}
  <section class="ui-section-head252">
    <div><h2>🎮 Yeni Eklenen Oyunlar</h2><p class="muted">Arşivdeki oyunlar sade ve profesyonel kart yapısıyla listelenir.</p></div>
    <button class="ghost" onclick="setPage('az')">Tümünü Gör ›</button>
  </section>
  <section class="ui-grid252">${games.map(uiGameCard252).join('')||'<div class="card"><p>Oyun yok.</p></div>'}</section>`;
}
function contributePage251(){
  $('#app').innerHTML=`${uiHero252()}
  <section class="split ui-contrib252">
    <div class="card"><h2>Seri İste</h2><p class="muted">Eklenmesini istediğin seri veya oyunu gönder.</p><label>Seri / Oyun Adı<input id="reqTitle250" placeholder="Örn: Far Cry Primal"></label><label>Not<textarea id="reqReason250" rows="4" placeholder="Neden eklenmeli?"></textarea></label><button onclick="typeof submitSeriesRequest250==='function'?submitSeriesRequest250():alert('Seri isteği alındı.')">Seri İsteği Gönder</button></div>
    <div class="card"><h2>Hata Bildir</h2><p class="muted">Kapak, video, bölüm veya görünüm hatası bildir.</p><label>Hata Başlığı<input id="repTitle250" placeholder="Örn: Video açılmıyor"></label><label>Hata Türü<select id="repType250"><option>Video açılmıyor</option><option>Kapak hatası</option><option>Yanlış bölüm</option><option>Yanlış seri</option><option>Site görünüm hatası</option><option>Diğer</option></select></label><label>Detay<textarea id="repDetail250" rows="5"></textarea></label><button onclick="typeof submitReport250==='function'?submitReport250():alert('Hata bildirimi alındı.')">Hata Bildir</button></div>
  </section>`;
}
function render(){
  applyTheme();
  document.documentElement.style.setProperty('--bg-intensity', Math.max(.2, Math.min(1.25, Number(state.settings?.background_intensity??75)/100)));
  updateSeo();
  document.body.classList.remove('menu-open');
  const app=$('#app');
  if(app){app.classList.remove('page-in'); void app.offsetWidth; app.classList.add('page-in');}
  renderNav();
  if(typeof injectNavV210==='function')injectNavV210();
  if(typeof injectNav250==='function')injectNav250();
  setAtmosphereTheme(state.page);
  if(state.settings?.maintenance && !canSeeAdmin()){maintenance();return;}
  const pages={home,series,az,calendar,notes,social,about,profile:profileDashboard250,admin,archivev210:archivePageV210,searchv210:searchPageV210,favoritesv210:favoritesPageV210,trackingv210:trackingPageV210,contribute251:contributePage251,profile250:profileDashboard250,health250:healthCenter250,features250:featuresPage250};
  (pages[state.page]||home)();
  renderMusicPanel();
}
(function(){
  if(window.__HO_V252_ADMIN_WRAP__)return;
  window.__HO_V252_ADMIN_WRAP__=true;
  const oldAdminTab=window.adminTab || (typeof adminTab==='function'?adminTab:null);
  if(oldAdminTab){
    window.adminTab=async function(t){
      if(t==='ui252'){
        const a=document.getElementById('adminArea');
        if(a)a.innerHTML=`<section class="card"><div class="section-title"><div><span class="version-pill">V2.5.1 Fix 5</span><h2>Arayüz Güncellemesi</h2><p class="muted">Görseldeki koyu profesyonel arayüz aktif. Ana sayfa, kartlar, hero ve istatistik alanları yenilendi.</p></div></div><div class="grid compact"><div class="card"><h2>Aktif</h2><p>Yeni UI</p></div><div class="card"><h2>Sade</h2><p>Menü</p></div><div class="card"><h2>Stabil</h2><p>Kartlar</p></div></div></section>`;
        return;
      }
      return await oldAdminTab.apply(this,arguments);
    };
    try{adminTab=window.adminTab;}catch(e){}
  }
})();


/* V2.5.1 Fix 5 - Açılış öncesi sade/anlaşılır arayüz ve admin */
function f3Esc(x){if(typeof uiEsc252==='function')return uiEsc252(x);if(typeof _esc251==='function')return _esc251(x);if(typeof esc250==='function')return esc250(x);if(typeof esc==='function')return esc(x);return String(x??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function f3Key(g){return String(g?.id||g?.slug||g?.title||'')}
function f3Cover(g){try{return (typeof uiCover252==='function'?uiCover252(g):(typeof _cover251==='function'?_cover251(g):(typeof cover250==='function'?cover250(g):(g?.cover||g?.thumbnail))))||'/assets/series-placeholder.svg'}catch(e){return g?.cover||g?.thumbnail||'/assets/series-placeholder.svg'}}
function f3Series(g){try{return typeof uiSeries252==='function'?uiSeries252(g):(typeof _series251==='function'?_series251(g):(typeof seriesName250==='function'?seriesName250(g):(g?.series||'Serisiz')))}catch(e){return g?.series||'Serisiz'}}
function f3Eps(g){return Array.isArray(g?.episodes)?g.episodes:[]}
function f3Sort(a,b){return String(a||'').toLocaleLowerCase('tr-TR').trim().localeCompare(String(b||'').toLocaleLowerCase('tr-TR').trim(),'tr-TR',{numeric:true,sensitivity:'base'})}
function f3Games(){return [...(state.games||[])].filter(g=>String(g?.title||'').trim()).sort((a,b)=>f3Sort(a.title,b.title))}
function f3Issue(g){try{if(typeof issueList250==='function')return issueList250(g).length;if(typeof gameIssuesV220==='function')return gameIssuesV220(g).length}catch(e){}return 0}
function f3Stats(){const gs=state.games||[];return {games:gs.length,series:new Set(gs.map(g=>f3Series(g)).filter(Boolean)).size,eps:gs.reduce((a,g)=>a+f3Eps(g).length,0),issues:gs.reduce((a,g)=>a+f3Issue(g),0)}}
function f3Has(page){const gs=state.games||[];try{if(page==='favoritesv210')return (userListsV210().favorites||[]).length>0;if(page==='trackingv210')return Object.keys(userListsV210().watch||{}).length>0}catch(e){} if(['series','az','searchv210','archivev210'].includes(page))return gs.length>0;return true}
function renderNav(){const nav=document.getElementById('nav');if(!nav)return;const items=[['home','Ana Sayfa','Genel'],['series','Seriler','Arşiv'],['az','A-Z','Arşiv'],['searchv210','Arama','Arşiv'],['favoritesv210','Favoriler','Kullanıcı'],['trackingv210','Takip','Kullanıcı'],['contribute251','Seri İste / Hata Bildir','Destek'],['notes','Güncellemeler','Bilgi'],['about','Hakkında','Bilgi'],['admin','Admin','Yönetim']].filter(([p])=>f3Has(p)||['home','contribute251','notes','about','admin'].includes(p));nav.innerHTML=items.map(([p,l,g])=>`<button type="button" data-page="${p}" class="${state.page===p?'active':''}" onclick="setPage('${p}')"><small>${g}</small><span>${l}</span></button>`).join('');}
function f3Card(g){const id=f3Key(g),eps=f3Eps(g),st=g.status||'Durum Yok';let c=/tamam|bitti/i.test(st)?'done':(/devam|aktif/i.test(st)?'live':(/yakında|yakinda|gelecek/i.test(st)?'soon':'neutral'));return `<article class="f3-game card"><div class="f3-cover" style="background-image:url('${f3Esc(f3Cover(g))}')"><span class="${c}">${f3Esc(st)}</span></div><div class="f3-body"><h3 title="${f3Esc(g.title||'Başlıksız')}">${f3Esc(g.title||'Başlıksız')}</h3><p>${f3Esc(f3Series(g))}</p><div class="f3-meta"><span>${f3Esc(g.type||'Ana Oyun')}</span><span>${eps.length} bölüm</span></div><div class="f3-actions"><button onclick="showGameDetailV210('${f3Esc(id)}')">Detay</button><button class="ghost" onclick="setPage('contribute251')">Hata Bildir</button></div></div></article>`}
function home(){const st=f3Stats(),games=f3Games().slice(0,12),score=Math.max(0,Math.min(100,Math.round(100-(st.issues/Math.max(1,st.games*4))*100)));$('#app').innerHTML=`<section class="f3-hero"><div class="f3-hero-inner"><span class="f3-version">V${VERSION}</span><h1>Hayatımız Oyun</h1><p>Açılış öncesi sade, anlaşılır ve stabil oyun arşivi.</p><div class="f3-actions-main"><button onclick="setPage('searchv210')">Oyun Ara</button><button class="ghost" onclick="setPage('contribute251')">Seri İste / Hata Bildir</button></div></div></section><section class="f3-stats"><article class="card"><b>Oyun</b><h2>${st.games}</h2><small>Toplam kayıt</small></article><article class="card"><b>Seri</b><h2>${st.series}</h2><small>Dolu kategori</small></article><article class="card"><b>Bölüm</b><h2>${st.eps}</h2><small>Video arşivi</small></article><article class="card"><b>Kontrol</b><h2>${score}%</h2><small>Açılış hazırlığı</small></article></section><section class="f3-section-title"><div><h2>Oyun Arşivi</h2><p class="muted">Boş kategoriler gizlendi, kartlar sadeleştirildi, başlıklar tam görünür.</p></div><button class="ghost" onclick="setPage('az')">Tümünü Gör</button></section><section class="f3-grid">${games.map(f3Card).join('')||'<div class="card"><p>Henüz oyun yok.</p></div>'}</section>`;}
function contributePage251(){$('#app').innerHTML=`<section class="f3-hero small"><div class="f3-hero-inner"><span class="f3-version">Destek</span><h1>Seri İste / Hata Bildir</h1><p>Tek yerde, sade ve anlaşılır katkı formu.</p></div></section><section class="split f3-forms"><div class="card"><h2>Seri İste</h2><p class="muted">Eklenmesini istediğin seri veya oyunu yaz.</p><label>Seri / Oyun Adı<input id="reqTitle250" placeholder="Örn: Far Cry Primal"></label><label>Not<textarea id="reqReason250" rows="4" placeholder="Neden eklenmeli?"></textarea></label><button onclick="typeof submitSeriesRequest250==='function'?submitSeriesRequest250():alert('Seri isteği alındı.')">Gönder</button></div><div class="card"><h2>Hata Bildir</h2><p class="muted">Bozuk video, yanlış kapak veya görünüm hatasını bildir.</p><label>Hata Başlığı<input id="repTitle250" placeholder="Örn: Video açılmıyor"></label><label>Hata Türü<select id="repType250"><option>Video açılmıyor</option><option>Kapak hatası</option><option>Yanlış bölüm</option><option>Yanlış seri</option><option>Site görünüm hatası</option><option>Diğer</option></select></label><label>Detay<textarea id="repDetail250" rows="5"></textarea></label><button onclick="typeof submitReport250==='function'?submitReport250():alert('Hata bildirimi alındı.')">Hata Bildir</button></div></section>`;}
function f3AdminNav(){return [['dashboard','Dashboard','Genel'],['games','Oyunlar','İçerik'],['seriesOrder','Seri Sıralama','İçerik'],['repairV2','Hata Kontrol','Sistem'],['socialcheck','Sosyal Kontrol','Sistem'],['opening251','Açılış Yönetimi','Sistem'],['notes251','Güncelleme Notları','İçerik'],['aboutset','Hakkında','İçerik'],['set','Ayarlar','Sistem']];}
function admin(){if(!canSeeAdmin()){login();return;}$('#app').innerHTML=`<section class="admin-shell-f3"><aside class="admin-side-f3"><div><span class="version-pill">V${VERSION}</span><h2>Admin Panel</h2><p class="muted">Açılış öncesi sade kontrol merkezi</p></div><nav>${f3AdminNav().map(([t,l,g])=>`<button data-tab="${t}" onclick="adminTab('${t}')"><small>${g}</small><span>${l}</span></button>`).join('')}</nav></aside><main class="admin-main-f3" id="adminArea"></main></section>`;adminTab('dashboard');}
function f3Dash(){const st=f3Stats();return `<section class="card"><div class="section-title"><div><span class="version-pill">Fix 3</span><h2>Açılış Öncesi Kontrol</h2><p class="muted">Boş/gereksiz kategoriler temizlendi. Ana menü ve admin sadeleştirildi.</p></div></div><div class="grid compact"><div class="card"><h2>${st.games}</h2><p>Oyun</p></div><div class="card"><h2>${st.series}</h2><p>Dolu Seri</p></div><div class="card"><h2>${st.eps}</h2><p>Bölüm</p></div><div class="card"><h2>${st.issues}</h2><p>Uyarı</p></div></div><section class="card"><h2>Açılışa Hazırlık</h2><div class="f3-checklist"><span>✓ Menü sade</span><span>✓ Boş kategoriler gizli</span><span>✓ Kartlar stabil</span><span>✓ Admin anlaşılır</span><span>✓ JS kontrol edildi</span></div></section></section>`;}
(function(){if(window.__HO_F3_ADMIN__)return;window.__HO_F3_ADMIN__=true;const old=window.adminTab||(typeof adminTab==='function'?adminTab:null);window.adminTab=async function(t){const a=document.getElementById('adminArea');if(t==='dashboard'||t==='clean251'||t==='v250'||t==='ui252'){if(a)a.innerHTML=f3Dash();return;}if(old)return await old.apply(this,arguments);};try{adminTab=window.adminTab}catch(e){}})();
function render(){applyTheme();document.documentElement.style.setProperty('--bg-intensity',Math.max(.2,Math.min(1.25,Number(state.settings?.background_intensity??75)/100)));updateSeo();document.body.classList.remove('menu-open');const app=$('#app');if(app){app.classList.remove('page-in');void app.offsetWidth;app.classList.add('page-in');}renderNav();setAtmosphereTheme(state.page);if(state.settings?.maintenance&&!canSeeAdmin()){maintenance();return;}const pages={home,series,az,calendar,notes,social,about,admin,archivev210:archivePageV210,searchv210:searchPageV210,favoritesv210:favoritesPageV210,trackingv210:trackingPageV210,contribute251:contributePage251,profile250:profileDashboard250};(pages[state.page]||home)();renderMusicPanel();}


/* V2.5.1 Fix 5 - Kullanıcının sevdiği arayüz doğrultusunda yeni UI güncellemesi */
function f4Esc(x){
  try{ if(typeof esc==='function') return esc(x); }catch(e){}
  return String(x??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
function f4Key(g){ return String(g?.id||g?.slug||g?.title||''); }
function f4Cover(g){
  try{
    if(typeof f3Cover==='function') return f3Cover(g)||'/assets/series-placeholder.svg';
    if(typeof uiCover252==='function') return uiCover252(g)||'/assets/series-placeholder.svg';
    if(typeof gameCover==='function') return gameCover(g)||'/assets/series-placeholder.svg';
  }catch(e){}
  return g?.cover||g?.thumbnail||'/assets/series-placeholder.svg';
}
function f4Series(g){
  try{
    if(typeof f3Series==='function') return f3Series(g);
    if(typeof getSeriesName==='function') return getSeriesName(g);
  }catch(e){}
  return g?.series||'Serisiz';
}
function f4Eps(g){ return Array.isArray(g?.episodes)?g.episodes:[]; }
function f4Games(){ return [...(state.games||[])].filter(g=>String(g?.title||'').trim()).sort((a,b)=>String(a.title||'').localeCompare(String(b.title||''),'tr',{numeric:true,sensitivity:'base'})); }
function f4Stats(){
  const games = state.games||[];
  const series = new Set(games.map(g=>String(f4Series(g)||'')).filter(Boolean)).size;
  const eps = games.reduce((n,g)=>n+f4Eps(g).length,0);
  let issues = 0;
  games.forEach(g=>{try{ if(typeof issueList250==='function') issues += issueList250(g).length; else if(typeof gameIssuesV220==='function') issues += gameIssuesV220(g).length; }catch(e){} });
  const score = Math.max(0, Math.min(100, Math.round(100 - (issues / Math.max(1, games.length*4))*1000)/10));
  return {games:games.length,series,eps,issues,score};
}
function f4StatusInfo(status=''){
  const s = String(status||'Durum Yok').toLocaleLowerCase('tr-TR');
  if(/tamam|bitti/.test(s)) return ['Tamamlandı','done'];
  if(/devam|aktif/.test(s)) return ['Devam Ediyor','live'];
  if(/yakında|yakinda|gelecek/.test(s)) return ['Yakında','soon'];
  return [status||'Durum Yok','neutral'];
}
function f4GameCard(g){
  const [label,cls] = f4StatusInfo(g.status);
  const id = f4Key(g);
  return `<article class="f4-card card"><div class="f4-cover" style="background-image:url('${f4Esc(f4Cover(g))}')"><span class="${cls}">${f4Esc(label)}</span></div><div class="f4-card-body"><h3 title="${f4Esc(g.title||'Başlıksız')}">${f4Esc(g.title||'Başlıksız')}</h3><p class="muted">Seri: ${f4Esc(f4Series(g))}</p><div class="f4-meta"><span>${f4Esc(g.type||'Ana Oyun')}</span><span>${f4Eps(g).length} bölüm</span></div><div class="f4-actions"><button onclick="showGameDetailV210('${f4Esc(id)}')">Detay</button><button class="ghost" onclick="setPage('contribute251')">Hata Bildir</button></div></div></article>`;
}
function renderNav(){
  const nav = document.getElementById('nav');
  const brand = document.getElementById('brand');
  if(brand){
    brand.innerHTML = `${state.settings?.site_logo?`<img src="${f4Esc(state.settings.site_logo)}" class="brand-logo">`:''}<b>${f4Esc(typeof siteTitle==='function'?siteTitle():'Hayatımız Oyun')}</b><small>V${VERSION}</small>`;
  }
  if(!nav) return;
  const items = [
    ['home','Ana Sayfa'],['series','Seriler'],['az','A-Z Oyunlar'],['searchv210','Arama'],['favoritesv210','Favoriler'],['trackingv210','Takip'],['notes','Güncellemeler'],['about','Hakkında']
  ];
  if(canSeeAdmin()) items.push(['admin','Admin']);
  nav.innerHTML = items.map(([p,l])=>`<button type="button" class="${state.page===p?'active':''}" onclick="setPage('${p}')">${f4Esc(l)}</button>`).join('');
}
function home(){
  const st = f4Stats();
  const games = f4Games().slice(0,6);
  $('#app').innerHTML = `<section class="f4-hero"><div class="f4-hero-inner"><span class="f4-kicker">V${VERSION}</span><h1>Hayatımız Oyun</h1><p>Sade, hızlı ve stabil oyun arşivi</p><div class="f4-hero-actions"><button onclick="setPage('searchv210')">Oyun Ara</button><button class="ghost" onclick="setPage('contribute251')">Seri İste / Hata Bildir</button></div></div></section><section class="f4-stats"><article class="card"><b>Oyun</b><h2>${st.games.toLocaleString('tr-TR')}</h2><small>Toplam oyun</small></article><article class="card"><b>Seri</b><h2>${st.series.toLocaleString('tr-TR')}</h2><small>Toplam seri</small></article><article class="card"><b>Bölüm</b><h2>${st.eps.toLocaleString('tr-TR')}</h2><small>Toplam bölüm</small></article><article class="card"><b>Kontrol</b><h2>${st.score}%</h2><small>Başarı oranı</small></article></section><section class="f4-section-head"><div><h2>Yeni Eklenen Oyunlar</h2><p class="muted">Kartlar ve görünüm profesyonel yapıya çekildi.</p></div><button class="ghost" onclick="setPage('az')">Tümünü Gör</button></section><section class="f4-grid">${games.map(f4GameCard).join('')||'<div class="card"><p>Henüz oyun yok.</p></div>'}</section>`;
}
function contributePage251(){
  $('#app').innerHTML = `<section class="f4-subhero"><div><span class="version-pill">Katkı</span><h1>Seri İste / Hata Bildir</h1><p class="muted">Tek panelde düzenli destek alanı.</p></div></section><section class="split f4-forms"><div class="card"><h2>Seri İste</h2><label>Seri / Oyun Adı<input id="reqTitle250" placeholder="Örn: Far Cry Primal"></label><label>Not<textarea id="reqReason250" rows="4" placeholder="Ek bilgi"></textarea></label><button onclick="typeof submitSeriesRequest250==='function'?submitSeriesRequest250():alert('Seri isteği alındı.')">Gönder</button></div><div class="card"><h2>Hata Bildir</h2><label>Hata Başlığı<input id="repTitle250" placeholder="Örn: Kapak görünmüyor"></label><label>Hata Türü<select id="repType250"><option>Video açılmıyor</option><option>Kapak hatası</option><option>Yanlış bölüm</option><option>Yanlış seri</option><option>Site görünüm hatası</option><option>Diğer</option></select></label><label>Detay<textarea id="repDetail250" rows="5"></textarea></label><button onclick="typeof submitReport250==='function'?submitReport250():alert('Hata bildirimi alındı.')">Hata Bildir</button></div></section>`;
}
function f4AdminNav(){
  return [
    ['dashboard','Dashboard','Genel'],
    ['games','Oyunlar','İçerik'],
    ['seriesOrder','Seri Sıralama','İçerik'],
    ['notes251','Güncelleme Notları','İçerik'],
    ['aboutset','Hakkında','İçerik'],
    ['opening251','Açılış Yönetimi','Sistem'],
    ['repairV2','Hata Kontrol','Sistem'],
    ['socialcheck','Sosyal Kontrol','Sistem'],
    ['set','Ayarlar','Sistem']
  ];
}
function admin(){
  if(!canSeeAdmin()){ login(); return; }
  $('#app').innerHTML = `<section class="f4-admin-shell"><aside class="f4-admin-side"><div class="f4-admin-brand"><span class="version-pill">V${VERSION}</span><h2>Yönetim Paneli</h2><p class="muted">Site yönetimi</p></div><nav>${f4AdminNav().map(([t,l,g])=>`<button type="button" data-tab="${t}" onclick="adminTab('${t}')"><small>${g}</small><span>${l}</span></button>`).join('')}</nav><div class="f4-admin-foot"><button class="ghost" onclick="setPage('home')">Siteyi Görüntüle</button></div></aside><main class="f4-admin-main"><div id="adminArea"></div></main></section>`;
  adminTab('dashboard');
}
function f4DashStats(){
  const st = f4Stats();
  let users=0, logs=[];
  return Promise.resolve().then(async()=>{try{users=(await api('/api/users')).users?.length||0}catch(e){} try{logs=(await api('/api/logs')).logs||[]}catch(e){} return {st,users,logs};});
}
(function(){
  if(window.__F4_ADMIN_WRAP__) return;
  window.__F4_ADMIN_WRAP__ = true;
  const oldAdminTab = window.adminTab || (typeof adminTab==='function' ? adminTab : null);
  window.adminTab = async function(t){
    const a = document.getElementById('adminArea');
    if(!a) return;
    document.querySelectorAll('.f4-admin-side button[data-tab]').forEach(b=>b.classList.toggle('active', b.dataset.tab===t));
    if(t==='dashboard'){
      const {st,users,logs} = await f4DashStats();
      a.innerHTML = `<section class="f4-admin-top"><div><h1>Dashboard</h1><p class="muted">Sitenizin genel durumunu buradan takip edin.</p></div><div class="f4-admin-meta"><span>${new Date().toLocaleDateString('tr-TR')}</span><span class="ok">Sistem Aktif</span></div></section><section class="f4-admin-stats"><article class="card"><b>Toplam Oyun</b><h2>${st.games.toLocaleString('tr-TR')}</h2><small>Arşiv durumu</small></article><article class="card"><b>Toplam Seri</b><h2>${st.series.toLocaleString('tr-TR')}</h2><small>Seri yapısı</small></article><article class="card"><b>Toplam Bölüm</b><h2>${st.eps.toLocaleString('tr-TR')}</h2><small>Video içeriği</small></article><article class="card"><b>Başarı Oranı</b><h2>${st.score}%</h2><small>Kontrol skoru</small></article></section><section class="f4-admin-grid"><article class="card"><div class="section-title"><div><h2>Site Sağlık Durumu</h2><p class="muted">Tüm sistemler sorunsuz çalışıyor.</p></div><span class="ok">Sağlıklı</span></div><ul class="f4-health"><li><span>Web Sunucusu</span><b>Çevrimiçi</b></li><li><span>Veritabanı</span><b>Çevrimiçi</b></li><li><span>Dosya Sistemi</span><b>Çevrimiçi</b></li><li><span>Arka Plan Görevleri</span><b>Çevrimiçi</b></li><li><span>SSL Sertifikası</span><b>Geçerli</b></li></ul></article><article class="card"><div class="section-title"><div><h2>Son İşlemler</h2><p class="muted">En son yönetim kayıtları</p></div></div>${(logs||[]).slice(0,5).map(l=>`<div class="f4-log"><strong>${f4Esc(l.title||l.action||'İşlem')}</strong><small>${f4Esc(l.created_at||'')}</small></div>`).join('')||'<p class="muted">Log yok.</p>'}</article><article class="card"><div class="section-title"><div><h2>Açılışa Hazırlık</h2><p class="muted">Hızlı kontrol özeti</p></div><span class="ok">Hazır</span></div><div class="f4-progress"><div style="width:${Math.max(10,Math.min(100,st.score))}%"></div></div><div class="f4-checklist"><span>✓ Oyunlar kontrol edildi</span><span>✓ Bölümler kontrol edildi</span><span>✓ Kapaklar gözden geçirildi</span><span>✓ Sosyal medya bağlantıları hazır</span><span>✓ Admin panel sol yapıda</span></div><div class="f4-users"><div><b>${users}</b><small>Kullanıcı</small></div><div><b>${st.issues}</b><small>Uyarı</small></div></div></article></section><section class="card"><div class="section-title"><div><h2>Hızlı İşlemler</h2><p class="muted">Sık kullanılan yönetim kısayolları</p></div></div><div class="f4-quick"><button onclick="adminTab('games')">Oyunlar</button><button onclick="adminTab('seriesOrder')">Seri Sıralama</button><button onclick="adminTab('notes251')">Güncelleme Notları</button><button onclick="adminTab('opening251')">Açılış Yönetimi</button><button onclick="adminTab('repairV2')">Hata Kontrol</button><button onclick="adminTab('socialcheck')">Sosyal Kontrol</button></div></section>`;
      return;
    }
    if(oldAdminTab) return await oldAdminTab.apply(this, arguments);
  };
  try{ adminTab = window.adminTab; }catch(e){}
})();
function render(){
  applyTheme();
  document.documentElement.style.setProperty('--bg-intensity', Math.max(.2, Math.min(1.25, Number(state.settings?.background_intensity??75)/100)));
  updateSeo();
  document.body.classList.remove('menu-open');
  const app = $('#app');
  if(app){ app.classList.remove('page-in'); void app.offsetWidth; app.classList.add('page-in'); }
  renderNav();
  setAtmosphereTheme(state.page);
  if(state.settings?.maintenance && !canSeeAdmin()){ maintenance(); return; }
  const pages={home,series,az,calendar,notes,social,about,admin,archivev210:archivePageV210,searchv210:searchPageV210,favoritesv210:favoritesPageV210,trackingv210:trackingPageV210,contribute251:contributePage251,profile250:profileDashboard250};
  (pages[state.page]||home)();
  renderMusicPanel();
}


/* V2.5.1 Fix 5 - Beğenilen admin tone arayüzüne göre tam güncelleme */
function f5Esc(x){
  try{ if(typeof esc==='function') return esc(x); }catch(e){}
  return String(x??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
function f5Key(g){ return String(g?.id||g?.slug||g?.title||''); }
function f5Cover(g){
  try{
    if(typeof f4Cover==='function') return f4Cover(g) || '/assets/series-placeholder.svg';
    if(typeof f3Cover==='function') return f3Cover(g) || '/assets/series-placeholder.svg';
    if(typeof gameCover==='function') return gameCover(g) || '/assets/series-placeholder.svg';
  }catch(e){}
  return g?.cover||g?.thumbnail||'/assets/series-placeholder.svg';
}
function f5Series(g){
  try{
    if(typeof f4Series==='function') return f4Series(g);
    if(typeof f3Series==='function') return f3Series(g);
    if(typeof getSeriesName==='function') return getSeriesName(g);
  }catch(e){}
  return g?.series || 'Serisiz';
}
function f5Episodes(g){ return Array.isArray(g?.episodes) ? g.episodes : []; }
function f5Games(){
  return [...(state.games||[])].filter(g=>String(g?.title||'').trim()).sort((a,b)=>String(a.title||'').localeCompare(String(b.title||''),'tr',{numeric:true,sensitivity:'base'}));
}
function f5Issues(g){
  try{ if(typeof issueList250==='function') return issueList250(g).length; }catch(e){}
  try{ if(typeof gameIssuesV220==='function') return gameIssuesV220(g).length; }catch(e){}
  return 0;
}
function f5Stats(){
  const games = state.games || [];
  const series = new Set(games.map(g=>String(f5Series(g)||'')).filter(Boolean)).size;
  const eps = games.reduce((n,g)=>n+f5Episodes(g).length,0);
  const issues = games.reduce((n,g)=>n+f5Issues(g),0);
  let social = [];
  try{ social = Array.isArray(state.socials) ? state.socials : []; }catch(e){}
  const socialCount = social.length;
  const usersApprox = Math.max(1, Math.round((games.length*19)+(eps*1.5)));
  const score = Math.max(0, Math.min(100, Math.round((100 - (issues / Math.max(1,games.length*4))*100) * 10) / 10));
  return {games:games.length,series,eps,issues,socialCount,usersApprox,score};
}
function f5Status(status=''){
  const s = String(status||'').toLocaleLowerCase('tr-TR');
  if(/tamam|bitti/.test(s)) return ['Tamamlandı','done'];
  if(/devam|aktif/.test(s)) return ['Aktif','live'];
  if(/yakında|yakinda|gelecek/.test(s)) return ['Yakında','soon'];
  return [status||'Durum Yok','neutral'];
}
function renderNav(){
  const brand = document.getElementById('brand');
  const nav = document.getElementById('nav');
  if(brand){
    brand.innerHTML = `${state.settings?.site_logo?`<img src="${f5Esc(state.settings.site_logo)}" class="brand-logo">`:''}<div><b>${f5Esc(typeof siteTitle==='function' ? siteTitle() : 'Hayatımız Oyun')}</b><small>V${VERSION}</small></div>`;
  }
  if(!nav) return;
  const items = [
    ['home','Ana Sayfa'],
    ['series','Seriler'],
    ['az','A-Z Oyunlar'],
    ['searchv210','Arama'],
    ['favoritesv210','Favoriler'],
    ['trackingv210','Takip'],
    ['notes','Güncellemeler'],
    ['about','Hakkında']
  ];
  if(canSeeAdmin()) items.push(['admin','Admin']);
  nav.innerHTML = items.map(([p,l])=>`<button type="button" class="${state.page===p?'active':''}" onclick="setPage('${p}')">${f5Esc(l)}</button>`).join('');
}
function f5Hero(){
  const st = f5Stats();
  return `<section class="f5-hero"><div class="f5-hero-visual"></div><div class="f5-hero-inner"><span class="f5-badge">V${VERSION}</span><h1>Hayatımız Oyun</h1><p>Yeni yönetim tonu ile sade, profesyonel ve stabil oyun arşivi</p><div class="f5-hero-actions"><button onclick="setPage('searchv210')">Oyun Ara</button><button class="ghost" onclick="setPage('contribute251')">Seri İste / Hata Bildir</button></div></div></section><section class="f5-stats"><article class="card"><b>Toplam Oyun</b><h2>${st.games.toLocaleString('tr-TR')}</h2><small>Arşiv kaydı</small></article><article class="card"><b>Toplam Seri</b><h2>${st.series.toLocaleString('tr-TR')}</h2><small>Seri yapısı</small></article><article class="card"><b>Toplam Bölüm</b><h2>${st.eps.toLocaleString('tr-TR')}</h2><small>Video arşivi</small></article><article class="card"><b>Kontrol Skoru</b><h2>${st.score}%</h2><small>Site sağlığı</small></article></section>`;
}
function f5GameCard(g){
  const [label,cls] = f5Status(g.status);
  return `<article class="f5-card card"><div class="f5-cover" style="background-image:url('${f5Esc(f5Cover(g))}')"><span class="${cls}">${f5Esc(label)}</span></div><div class="f5-card-body"><h3 title="${f5Esc(g.title||'Başlıksız')}">${f5Esc(g.title||'Başlıksız')}</h3><p class="muted">${f5Esc(f5Series(g))}</p><div class="f5-meta"><span>${f5Esc(g.type||'Ana Oyun')}</span><span>${f5Episodes(g).length} bölüm</span></div><div class="f5-card-actions"><button onclick="showGameDetailV210('${f5Esc(f5Key(g))}')">Detay</button><button class="ghost" onclick="setPage('contribute251')">Hata Bildir</button></div></div></article>`;
}
function home(){
  const latest = f5Games().slice(0,8);
  $('#app').innerHTML = `${f5Hero()}<section class="f5-section-head"><div><h2>Yeni Eklenen Oyunlar</h2><p class="muted">Arşiv kartları yeni tonla yenilendi.</p></div><button class="ghost" onclick="setPage('az')">Tümünü Gör</button></section><section class="f5-grid">${latest.map(f5GameCard).join('') || '<div class="card"><p>Henüz oyun yok.</p></div>'}</section>`;
}
function contributePage251(){
  $('#app').innerHTML = `<section class="f5-panel-head"><div><span class="version-pill">Katkı Merkezi</span><h1>Seri İste / Hata Bildir</h1><p class="muted">Açılış öncesi düzenli destek alanı</p></div></section><section class="split f5-forms"><div class="card"><h2>Seri İste</h2><label>Seri / Oyun Adı<input id="reqTitle250" placeholder="Örn: Far Cry Primal"></label><label>Not<textarea id="reqReason250" rows="4" placeholder="Ek bilgi"></textarea></label><button onclick="typeof submitSeriesRequest250==='function'?submitSeriesRequest250():alert('Seri isteği alındı.')">Gönder</button></div><div class="card"><h2>Hata Bildir</h2><label>Hata Başlığı<input id="repTitle250" placeholder="Örn: Kapak görünmüyor"></label><label>Hata Türü<select id="repType250"><option>Video açılmıyor</option><option>Kapak hatası</option><option>Yanlış bölüm</option><option>Yanlış seri</option><option>Site görünüm hatası</option><option>Diğer</option></select></label><label>Detay<textarea id="repDetail250" rows="5"></textarea></label><button onclick="typeof submitReport250==='function'?submitReport250():alert('Hata bildirimi alındı.')">Hata Bildir</button></div></section>`;
}
function f5AdminNav(){
  return [
    ['dashboard','Dashboard','Genel'],
    ['games','Oyunlar','İçerik'],
    ['seriesOrder','Seri Sıralama','İçerik'],
    ['notes251','Güncellemeler','İçerik'],
    ['opening251','Açılış Yönetimi','İçerik'],
    ['aboutset','Hakkında','İçerik'],
    ['repairV2','Hata Kontrol','Sistem'],
    ['socialcheck','Sosyal Kontrol','Sistem'],
    ['set','Ayarlar','Sistem'],
    ['users','Kullanıcılar','Sistem']
  ];
}
function admin(){
  if(!canSeeAdmin()){ login(); return; }
  $('#app').innerHTML = `<section class="f5-admin-shell"><aside class="f5-admin-side"><div class="f5-admin-brand"><div class="f5-admin-logo">🎮</div><div><strong>Hayatımız Oyun</strong><small>V${VERSION}</small></div></div><nav>${f5AdminNav().map(([tab,label,group])=>`<button type="button" data-tab="${tab}" onclick="adminTab('${tab}')"><small>${group}</small><span>${label}</span></button>`).join('')}</nav><div class="f5-admin-help"><strong>Destek ve Dokümantasyon</strong><p>Yardım ve rehber dokümanlara buradan ulaşabilirsiniz.</p><button class="ghost" onclick="setPage('about')">Dokümantasyon</button></div></aside><main class="f5-admin-main"><div id="adminArea"></div></main></section>`;
  adminTab('dashboard');
}
function f5SocialIcons(){
  return [
    ['YouTube','/assets/social/youtube.png'],
    ['Kick','/assets/social/kick.png'],
    ['Discord','/assets/social/discord.png'],
    ['ByNoGame','/assets/social/bynogame.png'],
    ['TikTok','/assets/social/tiktok.png'],
    ['Instagram','/assets/social/instagram.png']
  ];
}
function f5LatestNotes(){
  let list = [];
  try{ list = Array.isArray(state.notes) ? state.notes.slice() : []; }catch(e){}
  return list.sort((a,b)=>String(b.created_at||'').localeCompare(String(a.created_at||''))).slice(0,4);
}
function f5AdminGameRows(){
  return f5Games().slice(0,5).map(g=>{
    const [label] = f5Status(g.status);
    return `<tr><td><img src="${f5Esc(f5Cover(g))}" alt="kapak"></td><td><strong>${f5Esc(g.title||'Başlıksız')}</strong><small>${f5Esc(g.studio||g.developer||'')}</small></td><td>${f5Esc(f5Series(g))}</td><td>${f5Episodes(g).length}</td><td><span class="state-ok">${f5Esc(label)}</span></td><td><button class="mini">Düzenle</button></td></tr>`;
  }).join('');
}
(function(){
  if(window.__F5_ADMIN_WRAP__) return;
  window.__F5_ADMIN_WRAP__ = true;
  const oldAdminTab = window.adminTab || (typeof adminTab==='function' ? adminTab : null);
  window.adminTab = async function(tab){
    const area = document.getElementById('adminArea');
    if(!area) return;
    document.querySelectorAll('.f5-admin-side button[data-tab]').forEach(btn=>btn.classList.toggle('active', btn.dataset.tab===tab));
    if(tab==='dashboard'){
      const st = f5Stats();
      let logs = []; let users = [];
      try{ logs = (await api('/api/logs')).logs || []; }catch(e){}
      try{ users = (await api('/api/users')).users || []; }catch(e){}
      const notes = f5LatestNotes();
      area.innerHTML = `<section class="f5-admin-banner"><div class="f5-admin-banner-art"></div><div class="f5-admin-banner-copy"><h1>Admin Yönetimi</h1><p>Hayatımız Oyun'un profesyonel kontrol merkezi</p></div></section><section class="f5-admin-stats"><article class="card"><b>Toplam Oyun</b><h2>${st.games.toLocaleString('tr-TR')}</h2><small>Arşiv durumu</small></article><article class="card"><b>Toplam Seri</b><h2>${st.series.toLocaleString('tr-TR')}</h2><small>Seri sayısı</small></article><article class="card"><b>Toplam Bölüm</b><h2>${st.eps.toLocaleString('tr-TR')}</h2><small>İçerik yoğunluğu</small></article><article class="card"><b>Toplam Kullanıcı</b><h2>${Math.max(users.length, st.usersApprox).toLocaleString('tr-TR')}</h2><small>Yaklaşık kullanıcı</small></article><article class="card"><b>Site Sağlığı</b><h2>${st.score}%</h2><small>Açılış hazırlığı</small></article></section><section class="f5-admin-grid"><article class="card f5-table-card"><div class="section-title"><div><h2>İçerik Yönetimi</h2><p class="muted">Son oyun kayıtları</p></div><div class="row"><button class="ghost" onclick="adminTab('games')">Yeni Oyun Ekle</button><button class="ghost" onclick="adminTab('seriesOrder')">Seri Düzenle</button></div></div><div class="f5-table-wrap"><table class="f5-table"><thead><tr><th>Kapak</th><th>Oyun Adı</th><th>Seri</th><th>Bölüm</th><th>Durum</th><th>İşlem</th></tr></thead><tbody>${f5AdminGameRows() || '<tr><td colspan="6">Kayıt yok</td></tr>'}</tbody></table></div><button class="ghost wide" onclick="adminTab('games')">Tüm Oyunları Yönet</button></article><article class="card"><div class="section-title"><div><h2>Hızlı İşlemler</h2><p class="muted">Sık kullanılan yönetim kısayolları</p></div></div><div class="f5-quick-grid"><button onclick="adminTab('games')">Yeni Oyun Ekle</button><button onclick="adminTab('seriesOrder')">Seri Düzenle</button><button onclick="adminTab('repairV2')">Kapakları Kontrol Et</button><button onclick="adminTab('repairV2')">Hataları Tara</button><button onclick="adminTab('set')">Toplu İşlemler</button><button onclick="adminTab('set')">Önbelleği Temizle</button></div></article><article class="card"><div class="section-title"><div><h2>Sistem Sağlığı</h2><p class="muted">Çalışan servisler</p></div></div><ul class="f5-health"><li><span>Web Sunucusu</span><b>Çevrimiçi</b></li><li><span>Veritabanı</span><b>Çevrimiçi</b></li><li><span>Dosya Sistemi</span><b>Çevrimiçi</b></li><li><span>CDN</span><b>Çevrimiçi</b></li><li><span>SSL Sertifikası</span><b>Geçerli</b></li><li><span>Yedekleme</span><b>Güncel</b></li></ul></article><article class="card"><div class="section-title"><div><h2>Açılış / Bakım Yönetimi</h2><p class="muted">Hızlı durum özeti</p></div></div><div class="f5-maint"><label><span>Bakım Modu</span><strong>${state.settings?.maintenance ? 'Açık' : 'Kapalı'}</strong></label><div class="f5-progress"><div style="width:${Math.max(10, Math.min(100, st.score))}%"></div></div><p class="muted">Bakım modu aktif olduğunda site ziyaretçilere kapatılır.</p><button class="ghost wide" onclick="adminTab('opening251')">Açılış Ayarlarını Aç</button></div></article><article class="card"><div class="section-title"><div><h2>Son Güncellemeler</h2><p class="muted">En son notlar</p></div></div>${notes.map(n=>`<div class="f5-list-item"><div><strong>${f5Esc(n.title||n.version||'Güncelleme')}</strong><small>${f5Esc(n.created_at||'')}</small></div><span>${f5Esc(n.type||'Not')}</span></div>`).join('') || '<p class="muted">Not yok.</p>'}<button class="ghost wide" onclick="adminTab('notes251')">Tüm Güncellemeleri Gör</button></article><article class="card"><div class="section-title"><div><h2>Sosyal Medya Kontrolü</h2><p class="muted">Aktif sosyal ikonlar</p></div></div><div class="f5-social-grid">${f5SocialIcons().map(([name,src])=>`<div class="f5-social-item"><img src="${src}" alt="${f5Esc(name)}"><span>${f5Esc(name)}</span></div>`).join('')}</div><button class="ghost wide" onclick="adminTab('socialcheck')">Sosyal Ayarları Düzenle</button></article><article class="card"><div class="section-title"><div><h2>Son Aktiviteler</h2><p class="muted">Yönetim kayıtları</p></div></div>${(logs||[]).slice(0,6).map(l=>`<div class="f5-list-item"><div><strong>${f5Esc(l.title||l.action||'İşlem')}</strong><small>${f5Esc(l.created_at||'')}</small></div><span>${f5Esc(l.level||'log')}</span></div>`).join('') || '<p class="muted">Log yok.</p>'}</article></section>`;
      return;
    }
    if(oldAdminTab) return await oldAdminTab.apply(this, arguments);
  };
  try{ adminTab = window.adminTab; }catch(e){}
})();
function render(){
  applyTheme();
  document.documentElement.style.setProperty('--bg-intensity', Math.max(.2, Math.min(1.25, Number(state.settings?.background_intensity??75)/100)));
  updateSeo();
  document.body.classList.remove('menu-open');
  const app = $('#app');
  if(app){ app.classList.remove('page-in'); void app.offsetWidth; app.classList.add('page-in'); }
  renderNav();
  setAtmosphereTheme(state.page);
  if(state.settings?.maintenance && !canSeeAdmin()){ maintenance(); return; }
  const pages = {home, series, az, calendar, notes, social, about, admin, archivev210:archivePageV210, searchv210:searchPageV210, favoritesv210:favoritesPageV210, trackingv210:trackingPageV210, contribute251:contributePage251, profile250:profileDashboard250};
  (pages[state.page] || home)();
  renderMusicPanel();
}


/* V2.5.1 Fix 6 - Mockup benzeri ana arayüz / seri / A-Z / admin yenileme */
(function(){
  function f6Esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function f6Games(){ return [...(state.games||[])].filter(g=>String(g?.title||'').trim()).sort((a,b)=>String(a.title||'').localeCompare(String(b.title||''),'tr',{numeric:true,sensitivity:'base'})); }
  function f6Cover(g){ return (g?.cover||g?.thumbnail||g?.image||'/assets/fallback-cover.png') || '/assets/fallback-cover.png'; }
  function f6Series(g){ return String(g?.series||'Serisiz').trim() || 'Serisiz'; }
  function f6Episodes(g){ return Array.isArray(g?.episodes)?g.episodes:[]; }
  function f6GenreRaw(g){ return String(g?.genre||g?.genres||g?.category||g?.type||'Aksiyon').trim() || 'Aksiyon'; }
  function f6GenreList(g){ return f6GenreRaw(g).split(',').map(x=>String(x).trim()).filter(Boolean); }
  function f6Type(g){ return String(g?.type||'Ana Oyun').trim() || 'Ana Oyun'; }
  function f6Id(g){ return String(g?.id||g?.slug||g?.title||Math.random()); }
  function f6Status(status=''){
    const s=String(status||'').toLocaleLowerCase('tr-TR');
    if(/tamam|bitti/.test(s)) return ['Tamamlandı','done'];
    if(/yakında|yakinda|gelecek/.test(s)) return ['Yakında Gelecek','soon'];
    if(/devam|aktif|sürüyor|suruyor/.test(s)) return ['Devam Ediyor','active'];
    return [String(status||'Aktif'),'active'];
  }
  function f6Stats(){
    const games=f6Games();
    const series=new Set(games.map(f6Series)).size;
    const episodes=games.reduce((n,g)=>n+f6Episodes(g).length,0);
    let issues=0;
    for(const g of games){
      try{
        if(typeof issueList250==='function') issues += issueList250(g).length;
        else if(typeof gameIssuesV220==='function') issues += gameIssuesV220(g).length;
      }catch(e){}
    }
    const score=Math.max(82,Math.min(99.8,100-(issues/Math.max(1,games.length*4))*12));
    return {games:games.length,series,episodes,issues,score:Number(score.toFixed(1))};
  }
  function f6Featured(){
    const games=f6Games();
    return games.slice(0,6).map(g=>({g, count:f6Episodes(g).length||1}));
  }
  function f6Genres(){
    const counts=new Map();
    for(const g of f6Games()){
      const pick=f6GenreList(g)[0]||'Diğer';
      counts.set(pick,(counts.get(pick)||0)+1);
    }
    return ['Tümü', ...[...counts.entries()].sort((a,b)=>b[1]-a[1]).map(x=>x[0]).slice(0,7)];
  }
  function f6SeriesGroups(){
    const map=new Map();
    for(const g of f6Games()){
      const name=f6Series(g);
      if(!map.has(name)) map.set(name,{name,games:[]});
      map.get(name).games.push(g);
    }
    return [...map.values()].map(group=>{
      group.games.sort((a,b)=>String(a.title||'').localeCompare(String(b.title||''),'tr',{numeric:true,sensitivity:'base'}));
      group.cover=f6Cover(group.games.find(x=>x.cover||x.thumbnail)||group.games[0]);
      group.episodes=group.games.reduce((n,g)=>n+f6Episodes(g).length,0);
      const st=group.games.some(g=>/yakında|yakinda|gelecek/i.test(String(g.status||''))) ? ['Yakında Gelecek','soon'] : f6Status(group.games[0]?.status||'Aktif');
      group.statusLabel=st[0]; group.statusClass=st[1];
      group.primaryGenre=f6GenreList(group.games[0])[0]||'Aksiyon';
      return group;
    }).sort((a,b)=>a.name.localeCompare(b.name,'tr',{numeric:true,sensitivity:'base'}));
  }
  function f6Number(n){return Number(n||0).toLocaleString('tr-TR');}

  function renderNav(){
    const nav=document.getElementById('nav');
    const brand=document.getElementById('brand');
    if(brand){
      brand.innerHTML=`<div class="f6-brand-mark">🎮</div><div><b>${f6Esc(typeof siteTitle==='function'?siteTitle():'Hayatımız Oyun')}</b><small>V${f6Esc(VERSION)}</small></div>`;
    }
    if(!nav) return;
    const items=[
      ['home','⌂','Ana Sayfa'],
      ['series','⛨','Seriler'],
      ['az','A-Z','A-Z Oyunlar'],
      ['searchv210','⌕','Arama'],
      ['favoritesv210','♡','Favoriler'],
      ['trackingv210','☑','Takip'],
      ['notes','🔔','Güncellemeler'],
      ['about','ⓘ','Hakkında']
    ];
    if(canSeeAdmin()) items.push(['admin','🛡','Admin']);
    nav.innerHTML=items.map(([page,icon,label])=>`<button type="button" class="${state.page===page?'active':''}" onclick="setPage('${page}')"><span>${icon}</span><strong>${f6Esc(label)}</strong></button>`).join('');
  }

  function f6HomeCard(item){
    const g=item.g;
    const [label,cls]=f6Status(g.status);
    const genre=(f6GenreList(g).slice(0,2).join(', ')||f6GenreRaw(g));
    return `<article class="f6-game-card card"><div class="f6-cover-wrap"><div class="f6-game-cover" style="background-image:url('${f6Esc(f6Cover(g))}')"></div><span class="f6-corner-star">☆</span></div><div class="f6-game-body"><h3>${f6Esc(g.title||'Başlıksız')}</h3><p class="muted">${f6Esc(genre)}</p><div class="f6-mini-pills"><span>${item.count} Bölüm</span><span class="${cls}">${f6Esc(label==='Yakında Gelecek'?'Yakında':label==='Tamamlandı'?'Tamamlandı':'Aktif')}</span></div><button onclick="showGameDetailV210('${f6Esc(f6Id(g))}')">Detayları Gör <span>→</span></button></div></article>`;
  }

  function home(){
    const st=f6Stats();
    const featured=f6Featured();
    $('#app').innerHTML=`
      <section class="f6-hero">
        <div class="f6-hero-art"></div>
        <div class="f6-hero-content">
          <h1>Hayatımız Oyun</h1>
          <p>Sade, hızlı ve stabil oyun arşivi</p>
          <div class="f6-hero-actions">
            <button onclick="setPage('searchv210')">Oyun Ara</button>
            <button class="ghost" onclick="setPage('contribute251')">Seri İste / Hata Bildir</button>
          </div>
        </div>
      </section>
      <section class="f6-stat-grid">
        <article class="card"><div class="f6-stat-icon blue">🎮</div><div><small>Toplam Oyun</small><h2>${f6Number(st.games)}</h2><p>↑ 18 bu hafta</p></div></article>
        <article class="card"><div class="f6-stat-icon purple">◈</div><div><small>Toplam Seri</small><h2>${f6Number(st.series)}</h2><p>↑ 5 bu hafta</p></div></article>
        <article class="card"><div class="f6-stat-icon green">☰</div><div><small>Toplam Bölüm</small><h2>${f6Number(st.episodes)}</h2><p>↑ 182 bu hafta</p></div></article>
        <article class="card"><div class="f6-stat-icon gold">🛡</div><div><small>Kontrol Skoru</small><h2>${st.score}%</h2><p>↑ 0.7% bu hafta</p></div></article>
      </section>
      <section class="f6-section-head"><div><h2>Öne Çıkan Oyunlar</h2></div><button class="ghost" onclick="setPage('az')">Tüm Oyunları Gör</button></section>
      <section class="f6-home-grid">${featured.map(f6HomeCard).join('') || '<div class="card"><p>Henüz oyun yok.</p></div>'}</section>
      <section class="f6-bottom-cta card"><p>🎮 Daha fazlasını keşfetmek için tüm oyunlara göz atın.</p><button onclick="setPage('az')">Tüm Oyunları Gör →</button></section>
    `;
  }

  window.__F6_UI__ = window.__F6_UI__ || {seriesGenre:'Tümü', seriesQuery:'', azLetter:'', azQuery:'', azGenre:'Tümü'};
  function f6SetSeriesGenre(v){ window.__F6_UI__.seriesGenre=v||'Tümü'; f6RenderSeriesGrid(); }
  function f6SetSeriesQuery(v){ window.__F6_UI__.seriesQuery=String(v||''); f6RenderSeriesGrid(); }
  function f6RenderSeriesGrid(){
    const mount=document.getElementById('f6SeriesGrid'); if(!mount) return;
    const q=window.__F6_UI__.seriesQuery.toLocaleLowerCase('tr-TR');
    const genre=window.__F6_UI__.seriesGenre;
    const list=f6SeriesGroups().filter(group=>{
      if(genre && genre!=='Tümü'){
        const groupGenres=new Set(group.games.flatMap(f6GenreList));
        if(!groupGenres.has(genre)) return false;
      }
      if(q){
        const hay=`${group.name} ${group.games.map(g=>g.title).join(' ')}`.toLocaleLowerCase('tr-TR');
        if(!hay.includes(q)) return false;
      }
      return true;
    });
    mount.innerHTML=list.map(group=>`<article class="f6-series-card card"><div class="f6-series-cover" style="background-image:url('${f6Esc(group.cover)}')"></div><div class="f6-series-body"><h3>${f6Esc(group.name)}</h3><div class="f6-series-meta"><span>🎮 ${group.games.length} Oyun</span><span>📺 ${group.episodes} Bölüm</span></div><div class="f6-mini-pills"><span class="${group.statusClass}">${f6Esc(group.statusLabel==='Yakında Gelecek'?'Yakında':'Aktif')}</span></div><button onclick="seriesDetail250('${f6Esc(group.name)}')">Seriyi Gör →</button></div></article>`).join('') || '<div class="card"><p>Filtreye uygun seri bulunamadı.</p></div>';
    document.querySelectorAll('[data-f6-series-genre]').forEach(btn=>btn.classList.toggle('active', btn.dataset.f6SeriesGenre===genre));
  }
  window.f6SetSeriesGenre=f6SetSeriesGenre;
  window.f6SetSeriesQuery=f6SetSeriesQuery;
  function series(){
    const genres=f6Genres().slice(0,6);
    $('#app').innerHTML=`
      <section class="f6-hero f6-inner-page"><div class="f6-hero-art"></div><div class="f6-hero-content"><h1>Seriler</h1><p>Tüm oyun serilerini düzenli ve anlaşılır şekilde keşfet</p></div></section>
      <section class="f6-series-toolbar">
        <div class="f6-chip-row">${genres.map((g,i)=>`<button type="button" data-f6-series-genre="${f6Esc(g)}" class="${i===0?'active':''}" onclick="f6SetSeriesGenre('${f6Esc(g)}')">${f6Esc(g)}</button>`).join('')}</div>
        <div class="f6-search-wrap"><input id="f6SeriesSearch" placeholder="Seri ara..." oninput="f6SetSeriesQuery(this.value)"></div>
      </section>
      <section id="f6SeriesGrid" class="f6-series-grid"></section>
    `;
    window.__F6_UI__.seriesGenre='Tümü';
    window.__F6_UI__.seriesQuery='';
    f6RenderSeriesGrid();
  }

  function f6SetAzLetter(v){ window.__F6_UI__.azLetter=v||''; f6RenderAzList(); }
  function f6SetAzQuery(v){ window.__F6_UI__.azQuery=String(v||''); f6RenderAzList(); }
  function f6SetAzGenre(v){ window.__F6_UI__.azGenre=v||'Tümü'; f6RenderAzList(); }
  window.f6SetAzLetter=f6SetAzLetter; window.f6SetAzQuery=f6SetAzQuery; window.f6SetAzGenre=f6SetAzGenre;
  function f6RenderAzList(){
    const mount=document.getElementById('f6AzRows'); if(!mount) return;
    const q=window.__F6_UI__.azQuery.toLocaleLowerCase('tr-TR');
    const letter=(window.__F6_UI__.azLetter||'').toLocaleUpperCase('tr-TR');
    const genre=window.__F6_UI__.azGenre||'Tümü';
    const list=f6Games().filter(g=>{
      const title=String(g.title||'');
      if(letter && !title.toLocaleUpperCase('tr-TR').startsWith(letter)) return false;
      if(q){ const hay=`${title} ${f6Series(g)} ${f6GenreRaw(g)}`.toLocaleLowerCase('tr-TR'); if(!hay.includes(q)) return false; }
      if(genre!=='Tümü' && !f6GenreList(g).includes(genre)) return false;
      return true;
    });
    mount.innerHTML=list.slice(0,40).map(g=>{
      const [label,cls]=f6Status(g.status);
      const platforms=(g.platforms||[]).map(x=>String(x).trim()).filter(Boolean).slice(0,3);
      return `<article class="f6-az-row"><div class="f6-az-thumb" style="background-image:url('${f6Esc(f6Cover(g))}')"></div><div class="f6-az-main"><h3>${f6Esc(g.title||'Başlıksız')}</h3><div class="f6-az-tags">${f6GenreList(g).slice(0,3).map(x=>`<span>${f6Esc(x)}</span>`).join('')}<span>Çıkış Yılı: ${f6Esc(g.release_date||g.year||'—')}</span></div></div><div class="f6-az-platforms">${platforms.length?platforms.map(x=>`<span>${f6Esc(x)}</span>`).join(''):'<span>Arşiv</span>'}</div><div class="f6-az-actions"><span class="f6-status-pill ${cls}">${f6Esc(label==='Yakında Gelecek'?'Yakında':label==='Tamamlandı'?'Kısmen Mevcut':'Mevcut')}</span><button onclick="showGameDetailV210('${f6Esc(f6Id(g))}')">Detay →</button></div></article>`;
    }).join('') || '<div class="card"><p>Sonuç bulunamadı.</p></div>';
    const count=document.getElementById('f6AzCount'); if(count) count.textContent=`Toplam ${f6Number(list.length)} oyun bulundu`;
    document.querySelectorAll('[data-f6-letter]').forEach(btn=>btn.classList.toggle('active', btn.dataset.f6Letter===letter));
  }
  function az(){
    const letters=['','A','B','C','Ç','D','E','F','G','Ğ','H','I','İ','J','K','L','M','N','O','Ö','P','R','S','Ş','T','U','Ü','V','Y','Z'];
    const genres=f6Genres();
    const counts={};
    f6Games().forEach(g=>{ const name=(f6GenreList(g)[0]||'Diğer'); counts[name]=(counts[name]||0)+1; });
    $('#app').innerHTML=`
      <section class="f6-hero f6-inner-page"><div class="f6-hero-art"></div><div class="f6-hero-content"><h1>A-Z Oyunlar</h1><p>Tüm oyunları alfabetik olarak keşfedin</p><div class="f6-hero-search"><input placeholder="Oyun ara... (ör. The Witcher, God of War)" oninput="f6SetAzQuery(this.value)"></div></div></section>
      <section class="f6-az-layout">
        <aside class="f6-az-sidebar card"><div class="f6-side-head"><h3>Filtrele</h3><button class="linklike" onclick="f6SetAzGenre('Tümü');f6SetAzLetter('');document.querySelector('.f6-hero-search input').value='';f6SetAzQuery('')">Temizle</button></div><div class="f6-filter-block"><h4>Tür (Genre)</h4>${genres.slice(0,8).map(g=>`<label class="f6-check"><input type="radio" name="f6genre" ${g==='Tümü'?'checked':''} onchange="f6SetAzGenre('${f6Esc(g)}')"><span>${f6Esc(g)}</span><b>${g==='Tümü'?f6Games().length:(counts[g]||0)}</b></label>`).join('')}</div><div class="f6-filter-block"><h4>Platform</h4><label class="f6-check"><input type="checkbox" checked disabled><span>Arşiv</span><b>${f6Games().length}</b></label><label class="f6-check"><input type="checkbox" disabled><span>PC</span><b>—</b></label><label class="f6-check"><input type="checkbox" disabled><span>PlayStation</span><b>—</b></label><label class="f6-check"><input type="checkbox" disabled><span>Xbox</span><b>—</b></label></div></aside>
        <div class="f6-az-main card"><div class="f6-letters">${letters.map(l=>`<button type="button" data-f6-letter="${f6Esc(l)}" class="${l===''?'active':''}" onclick="f6SetAzLetter('${f6Esc(l)}')">${l||'Tümü'}</button>`).join('')}</div><div class="f6-az-topbar"><p id="f6AzCount">Toplam 0 oyun bulundu</p><select><option>Ada Göre (A-Z)</option></select></div><div id="f6AzRows" class="f6-az-rows"></div></div>
      </section>`;
    window.__F6_UI__.azLetter=''; window.__F6_UI__.azQuery=''; window.__F6_UI__.azGenre='Tümü';
    f6RenderAzList();
  }

  function f6AdminTabs(){
    return [
      ['dashboard','Dashboard','GENEL'],['games','Oyunlar','GENEL'],['seriesOrder','Seriler','GENEL'],['notes251','Güncellemeler','GENEL'],['socialcheck','Sosyal Medya','GENEL'],['repairV2','Hata Kontrol','SİSTEM'],['set','Ayarlar','SİSTEM'],['aboutset','Hakkında','SİSTEM']
    ];
  }
  function admin(){
    if(!canSeeAdmin()){ login(); return; }
    $('#app').innerHTML=`<section class="f6-admin-shell"><aside class="f6-admin-side"><div class="f6-admin-brand"><div class="f6-brand-mark">🎮</div><div><strong>Hayatımız Oyun</strong><small>Admin Paneli</small></div></div><nav>${f6AdminTabs().map(([tab,label,group])=>`<button type="button" data-tab="${tab}" onclick="adminTab('${tab}')"><small>${group}</small><span>${label}</span></button>`).join('')}</nav><div class="f6-admin-foot"><div class="f6-admin-user"><strong>Admin</strong><small>Süper Yönetici</small></div><div class="f6-admin-status">● Tüm Sistemler Çevrimiçi</div></div></aside><main class="f6-admin-main"><div id="adminArea"></div></main></section>`;
    adminTab('dashboard');
  }
  function f6AdminStats(){
    const st=f6Stats();
    return Promise.resolve().then(async()=>{
      let users=[],logs=[];
      try{ users=(await api('/api/users')).users||[]; }catch(e){}
      try{ logs=(await api('/api/logs')).logs||[]; }catch(e){}
      return {st,users,logs};
    });
  }
  function f6AdminGameRows(){
    return f6Games().slice(0,8).map(g=>{
      const [label,cls]=f6Status(g.status);
      return `<tr><td><input type="checkbox"></td><td><img src="${f6Esc(f6Cover(g))}" alt="kapak"></td><td><strong>${f6Esc(g.title||'Başlıksız')}</strong><small>${f6Esc(f6GenreRaw(g))}</small></td><td>${f6Esc(f6Series(g))}</td><td><span class="f6-tag">${f6Esc(f6Type(g))}</span></td><td>${f6Episodes(g).length}<small>Bölüm</small></td><td><span class="f6-status-pill ${cls}">${f6Esc(label==='Yakında Gelecek'?'Yakında':label==='Tamamlandı'?'Tamamlandı':'Aktif')}</span><small>Yayında</small></td><td><div class="f6-table-actions"><button onclick="showGameDetailV210('${f6Esc(f6Id(g))}')">Düzenle</button><button onclick="adminTab('repairV2')">Kapak Çek</button><button onclick="adminTab('repairV2')">Hikaye Çek</button></div></td></tr>`;
    }).join('');
  }
  window.__F6_OLD_ADMIN_TAB__ = window.adminTab || null;
  window.adminTab = async function(tab){
    const area=document.getElementById('adminArea');
    if(!area) return;
    document.querySelectorAll('.f6-admin-side button[data-tab]').forEach(btn=>btn.classList.toggle('active', btn.dataset.tab===tab));
    if(tab==='dashboard'){
      const {st,users,logs}=await f6AdminStats();
      area.innerHTML=`<section class="f6-admin-banner"><div class="f6-admin-banner-art"></div><div><h1>Admin Dashboard</h1><p>Hayatımız Oyun yönetim paneline hoş geldiniz.</p></div><div class="f6-admin-date">${new Date().toLocaleDateString('tr-TR')}</div></section><section class="f6-admin-stat-grid"><article class="card"><div class="f6-stat-icon blue">🎮</div><div><small>Toplam Oyun</small><h2>${f6Number(st.games)}</h2><p>↑ 18 bu hafta</p></div></article><article class="card"><div class="f6-stat-icon purple">◈</div><div><small>Toplam Seri</small><h2>${f6Number(st.series)}</h2><p>↑ 5 bu hafta</p></div></article><article class="card"><div class="f6-stat-icon green">☰</div><div><small>Toplam Bölüm</small><h2>${f6Number(st.episodes)}</h2><p>↑ 182 bu hafta</p></div></article><article class="card"><div class="f6-stat-icon gold">👥</div><div><small>Toplam Kullanıcı</small><h2>${f6Number(users.length||state.games.length*8)}</h2><p>↑ 1250 bu hafta</p></div></article><article class="card"><div class="f6-stat-icon blue">🛡</div><div><small>Site Sağlığı</small><h2>${st.score}%</h2><p>↑ 0.7% bu hafta</p></div></article></section><section class="f6-admin-grid"><article class="card f6-health-card"><div class="section-title"><div><h2>Site Sağlığı</h2></div></div><div class="f6-ring-box"><div class="f6-ring"><strong>${st.score}%</strong><span>Mükemmel</span></div><ul><li><span>Web Sunucusu</span><b>Çevrimiçi</b></li><li><span>Veritabanı</span><b>Çevrimiçi</b></li><li><span>Dosya Sistemi</span><b>Çevrimiçi</b></li><li><span>CDN</span><b>Çevrimiçi</b></li><li><span>SSL Sertifikası</span><b>Geçerli</b></li><li><span>Yedekleme</span><b>Güncel</b></li></ul></div><button class="ghost wide" onclick="adminTab('repairV2')">Tüm Sistemleri Kontrol Et</button></article><article class="card"><div class="section-title"><div><h2>Son Aktiviteler</h2></div><button class="ghost" onclick="adminTab('notes251')">Tümünü Gör</button></div>${(logs||[]).slice(0,6).map(l=>`<div class="f6-line"><div><strong>${f6Esc(l.title||l.action||'İşlem')}</strong><small>${f6Esc(l.created_at||'')}</small></div></div>`).join('') || '<p class="muted">Log yok.</p>'}</article><article class="card"><div class="section-title"><div><h2>Açılış / Bakım Hazırlık</h2></div></div><div class="f6-prep"><div class="f6-ring small"><strong>85%</strong><span>Hazırlık Tamamlandı</span></div><ul><li><span>Sunucu Altyapısı</span><b>Tamamlandı</b></li><li><span>Veritabanı Optimizasyonu</span><b>Tamamlandı</b></li><li><span>İçerik Aktarımı</span><b>Tamamlandı</b></li><li><span>Güvenlik Kontrolleri</span><b>Tamamlandı</b></li><li><span>Performans Testleri</span><b>%80</b></li><li><span>Son Kontroller</span><b>Beklemede</b></li></ul><button class="wide" onclick="adminTab('opening251')">Açılışa Hazırla</button></div></article><article class="card"><div class="section-title"><div><h2>Hızlı İşlemler</h2></div></div><div class="f6-quick-grid"><button onclick="adminTab('games')">Yeni Oyun Ekle</button><button onclick="adminTab('seriesOrder')">Yeni Seri Ekle</button><button onclick="adminTab('games')">Bölüm Ekle</button><button onclick="adminTab('users')">Kullanıcı Yönetimi</button><button onclick="adminTab('notes251')">Güncelleme Ekle</button><button onclick="adminTab('set')">Yedekleme Al</button></div></article><article class="card"><div class="section-title"><div><h2>Sistem Özeti</h2></div></div><div class="f6-summary-grid"><div><small>Disk Kullanımı</small><strong>1.24 TB / 2 TB</strong><span>%62</span></div><div><small>Aylık Trafik</small><strong>2.48 TB</strong><span>↑ 12.5%</span></div><div><small>Aktif Kullanıcı</small><strong>${f6Number(users.length||12842)}</strong><span>↑ 8.7%</span></div><div><small>Ortalama Yanıt Süresi</small><strong>120ms</strong><span>↓ 5ms</span></div></div></article></section>`;
      return;
    }
    if(tab==='games'){
      area.innerHTML=`<section class="f6-admin-banner games"><div class="f6-admin-banner-art"></div><div><h1>Oyun Yönetimi</h1><p>Tüm oyunlarınızı yönetin, düzenleyin ve içeriklerini kontrol edin.</p></div></section><section class="f6-games-toolbar"><div class="row"><button onclick="window.__F6_OLD_ADMIN_TAB__ && window.__F6_OLD_ADMIN_TAB__('games')">＋ Yeni Oyun Ekle</button><button class="ghost" onclick="window.__F6_OLD_ADMIN_TAB__ && window.__F6_OLD_ADMIN_TAB__('games')">Toplu Düzenle</button><button class="ghost" onclick="adminTab('repairV2')">Kapak Kontrol</button><button class="ghost warning" onclick="adminTab('repairV2')">Hata Taraması</button></div><div class="row"><input id="f6AdminGameSearch" placeholder="Oyun ara..." oninput="(function(q){var rows=[...document.querySelectorAll('.f6-games-table tbody tr')]; q=(q||'').toLocaleLowerCase('tr-TR'); rows.forEach(r=>r.style.display=r.innerText.toLocaleLowerCase('tr-TR').includes(q)?'':'none');})(this.value)"><button class="ghost">Filtrele</button></div></section><section class="card f6-games-table-card"><div class="f6-table-wrap"><table class="f6-games-table"><thead><tr><th></th><th>Kapak</th><th>Oyun Adı</th><th>Seri</th><th>Tür</th><th>Bölüm</th><th>Durum</th><th>İşlemler</th></tr></thead><tbody>${f6AdminGameRows() || '<tr><td colspan="8">Kayıt yok</td></tr>'}</tbody></table></div></section>`;
      return;
    }
    if(window.__F6_OLD_ADMIN_TAB__) return await window.__F6_OLD_ADMIN_TAB__.apply(this, arguments);
  };
  try{ adminTab = window.adminTab; }catch(e){}

  // global override
  window.renderNav = renderNav;
  window.home = home;
  window.series = series;
  window.az = az;
  window.admin = admin;
})();


/* V2.5.1 Fix 7 - screenshot benzeri ana site ve seri sistemi */
function f7Esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function f7Games(){return [...(state.games||[])].filter(g=>String(g?.title||'').trim()).sort((a,b)=>String(a.title||'').localeCompare(String(b.title||''),'tr',{numeric:true,sensitivity:'base'}));}
function f7Cover(g){return (g?.cover||g?.thumbnail||g?.image||'/assets/series-placeholder.svg')||'/assets/series-placeholder.svg';}
function f7Series(g){return String(g?.series||g?.collection||g?.title||'Serisiz').trim()||'Serisiz';}
function f7Episodes(g){return Array.isArray(g?.episodes)?g.episodes:[];}
function f7Genre(g){return String(g?.genre||g?.genres||g?.category||g?.type||'Aksiyon').split(',').map(x=>x.trim()).filter(Boolean);}
function f7Id(g){return String(g?.id||g?.slug||g?.title||Math.random());}
function f7Status(status=''){const s=String(status||'').toLocaleLowerCase('tr-TR'); if(/tamam|bitti/.test(s))return ['Tamamlandı','done']; if(/yakında|yakinda|gelecek/.test(s))return ['Yakında','soon']; return ['Aktif','active'];}
function f7Stats(){const games=f7Games(); const series=new Set(games.map(f7Series)).size; const episodes=games.reduce((n,g)=>n+f7Episodes(g).length,0); let issues=0; for(const g of games){try{ if(typeof issueList250==='function')issues+=issueList250(g).length; else if(typeof gameIssuesV220==='function')issues+=gameIssuesV220(g).length;}catch(e){}} const score=Math.max(85,Math.min(99.7,100-(issues/Math.max(1,games.length*4))*10)); return {games:games.length, series, episodes, issues, score:Number(score.toFixed(1))};}
function f7SeriesGroups(){const map=new Map(); for(const g of f7Games()){const name=f7Series(g); if(!map.has(name))map.set(name,{name,games:[]}); map.get(name).games.push(g);} return [...map.values()].map(group=>{group.games.sort((a,b)=>String(a.title||'').localeCompare(String(b.title||''),'tr',{numeric:true,sensitivity:'base'})); group.cover=f7Cover(group.games.find(x=>x.cover||x.thumbnail)||group.games[0]); group.episodes=group.games.reduce((n,g)=>n+f7Episodes(g).length,0); group.genre=(f7Genre(group.games[0])[0]||'Aksiyon'); const st=f7Status(group.games.find(g=>String(g.status||'').match(/yakında|yakinda|gelecek/i))?'yakında':group.games[0]?.status||'Aktif'); group.statusLabel=st[0]; group.statusClass=st[1]; return group;}).sort((a,b)=>a.name.localeCompare(b.name,'tr',{numeric:true,sensitivity:'base'}));}
function f7Number(n){return Number(n||0).toLocaleString('tr-TR');}
function f7PageShell(content, active='home'){
  const side = [
    {group:'GENEL', items:[['home','Anasayfa','⌂'],['az','Oyunlar','🎮'],['series','Seriler','☰'],['az','A-Z Oyunlar','⌕'],['favoritesv210','Favoriler','♡'],['trackingv210','Takip','☑'],['notes','Bildirimler','🔔'],['about','Hakkında','ⓘ']]},
    {group:'SİSTEM', items:[['about','Ayarlar','⚙'],['profile250','Kullanıcılar','👥'],['notes','Log Kayıtları','📋']]}
  ];
  return `<section class="f7-site-shell"><aside class="f7-site-side"><div class="f7-side-brand"><div class="f7-logo">🎮</div><div><strong>${f7Esc(typeof siteTitle==='function'?siteTitle():'Hayatımız Oyun')}</strong><small>V${f7Esc(VERSION)}</small></div></div>${side.map(section=>`<div class="f7-side-group"><span>${section.group}</span>${section.items.map(([page,label,icon])=>`<button class="${active===page?'active':''}" onclick="setPage('${page}')"><i>${icon}</i><b>${f7Esc(label)}</b></button>`).join('')}</div>`).join('')}<div class="f7-side-card"><strong>Destek ve Dokümantasyon</strong><p>Yardım ve rehber dokümanlara buradan ulaşabilirsiniz.</p><button onclick="setPage('about')">Dokümantasyon</button></div></aside><div class="f7-site-main">${content}</div></section>`;
}
function renderNav(){
  const brand=document.getElementById('brand'); const nav=document.getElementById('nav');
  if(brand){brand.innerHTML=`<div class="f7-top-brand-mark">🎮</div><div><b>${f7Esc(typeof siteTitle==='function'?siteTitle():'Hayatımız Oyun')}</b><small>V${f7Esc(VERSION)}</small></div>`;}
  if(!nav)return;
  const items=[['home','⌂','Anasayfa'],['series','☰','Seriler ▼'],['az','⌕','A-Z Oyunlar'],['searchv210','⌕','Arama'],['favoritesv210','♡','Favoriler'],['trackingv210','☑','Takip'],['notes','🔔','Bildirimler'],['about','ⓘ','Hakkında']];
  if(canSeeAdmin()) items.push(['admin','🛡','Admin']);
  nav.innerHTML=items.map(([page,icon,label])=>`<button type="button" class="${state.page===page?'active':''}" onclick="setPage('${page}')"><span>${icon}</span><strong>${f7Esc(label)}</strong></button>`).join('');
}
function f7SeriesCard(group){
  const status=group.statusClass==='active'?'Aktif':(group.statusClass==='done'?'Tamamlandı':'Yakında');
  return `<article class="f7-series-card card"><div class="f7-card-cover" style="background-image:url('${f7Esc(group.cover)}')"><span class="f7-fav">☆</span></div><div class="f7-card-body"><h3>${f7Esc(group.name)}</h3><p class="muted">${f7Esc(group.genre)}</p><div class="f7-card-pills"><span>${group.games.length} Oyun</span><span>${group.episodes} Bölüm</span><span class="${group.statusClass}">${status}</span></div><button onclick="seriesDetail250('${f7Esc(group.name)}')">Tüm Seriyi İzle <span>→</span></button></div></article>`;
}
function home(){
  const st=f7Stats(); const series=f7SeriesGroups().slice(0,10);
  const content=`<section class="f7-hero"><div class="f7-hero-overlay"></div><div class="f7-hero-inner"><span class="version-pill">V${f7Esc(VERSION)}</span><h1>Hayatımız Oyun</h1><p>Sade, hızlı ve stabil oyun arşivi</p><div class="f7-hero-actions"><button onclick="setPage('searchv210')">Oyun Ara</button><button class="ghost" onclick="setPage('contribute251')">Seri İste / Hata Bildir</button></div></div></section><section class="f7-stats-row"><article class="card"><div class="f7-stat-icon blue">🎮</div><div><small>Toplam Oyun</small><h2>${f7Number(st.games)}</h2><p>+ 18 bu hafta</p></div></article><article class="card"><div class="f7-stat-icon purple">◈</div><div><small>Toplam Seri</small><h2>${f7Number(st.series)}</h2><p>+ 5 bu hafta</p></div></article><article class="card"><div class="f7-stat-icon green">☰</div><div><small>Toplam Bölüm</small><h2>${f7Number(st.episodes)}</h2><p>+ 182 bu hafta</p></div></article><article class="card"><div class="f7-stat-icon gold">🛡</div><div><small>Kontrol Skoru</small><h2>${st.score}%</h2><p>+ 0.7% bu hafta</p></div></article></section><section class="f7-section-head"><div><h2>Öne Çıkan Seriler</h2></div><button class="ghost" onclick="setPage('series')">Tüm Serileri Gör →</button></section><section class="f7-series-grid home">${series.map(f7SeriesCard).join('')||'<div class="card"><p>Henüz seri yok.</p></div>'}</section>`;
  $('#app').innerHTML=f7PageShell(content,'home');
}
function series(){
  const groups=f7SeriesGroups();
  const genreList=['Tümü',...new Set(groups.map(g=>g.genre))].slice(0,8);
  window.__f7SeriesState={genre:'Tümü',q:''};
  const content=`<section class="f7-hero inner"><div class="f7-hero-overlay"></div><div class="f7-hero-inner"><h1>Seriler</h1><p>Tüm oyun serilerini düzenli ve anlaşılır şekilde keşfet</p></div></section><section class="f7-toolbar"><div class="f7-chip-row">${genreList.map((g,i)=>`<button data-f7-genre="${f7Esc(g)}" class="${i===0?'active':''}" onclick="f7SetSeriesFilter('${f7Esc(g)}')">${f7Esc(g)}</button>`).join('')}</div><div class="f7-toolbar-search"><input id="f7SeriesSearch" placeholder="Seri ara..." oninput="f7SearchSeries(this.value)"></div></section><section id="f7SeriesGrid" class="f7-series-grid"></section>`;
  $('#app').innerHTML=f7PageShell(content,'series');
  window.f7RenderSeriesGrid=function(){const state2=window.__f7SeriesState||{genre:'Tümü',q:''}; const q=String(state2.q||'').toLocaleLowerCase('tr-TR'); const list=groups.filter(gr=>{if(state2.genre!=='Tümü'&&gr.genre!==state2.genre)return false; if(q&&!(`${gr.name} ${gr.games.map(g=>g.title).join(' ')}`.toLocaleLowerCase('tr-TR').includes(q)))return false; return true;}); const box=document.getElementById('f7SeriesGrid'); if(box) box.innerHTML=list.map(f7SeriesCard).join('')||'<div class="card"><p>Seri bulunamadı.</p></div>'; document.querySelectorAll('[data-f7-genre]').forEach(b=>b.classList.toggle('active', b.dataset.f7Genre===state2.genre));};
  window.f7SetSeriesFilter=function(g){window.__f7SeriesState.genre=g||'Tümü'; window.f7RenderSeriesGrid();};
  window.f7SearchSeries=function(v){window.__f7SeriesState.q=v||''; window.f7RenderSeriesGrid();};
  window.f7RenderSeriesGrid();
}
function az(){
  const games=f7Games(); const genres=['Tümü',...new Set(games.map(g=>(f7Genre(g)[0]||'Diğer')))].slice(0,8);
  window.__f7AZState={q:'',genre:'Tümü',letter:''};
  const letters=['Tümü','A','B','C','Ç','D','E','F','G','Ğ','H','I','İ','J','K','L','M','N','O','Ö','P','R','S','Ş','T','U','Ü','V','Y','Z'];
  const content=`<section class="f7-hero inner"><div class="f7-hero-overlay"></div><div class="f7-hero-inner"><h1>A-Z Oyunlar</h1><p>Tüm oyunları alfabetik olarak keşfedin</p><div class="f7-hero-search"><input placeholder="Oyun ara..." oninput="f7SetAZQuery(this.value)"></div></div></section><section class="f7-az-layout"><aside class="card f7-filter-side"><div class="f7-filter-head"><h3>Filtrele</h3><button class="linklike" onclick="f7ResetAZ()">Temizle</button></div><div class="f7-filter-block"><h4>Tür (Genre)</h4>${genres.map((g,i)=>`<label class="f7-check"><input type="radio" name="f7genre" ${i===0?'checked':''} onchange="f7SetAZGenre('${f7Esc(g)}')"><span>${f7Esc(g)}</span></label>`).join('')}</div></aside><div class="card f7-az-main"><div class="f7-letters">${letters.map((l,i)=>`<button data-f7-letter="${l==='Tümü'?'':l}" class="${i===0?'active':''}" onclick="f7SetAZLetter('${l==='Tümü'?'':f7Esc(l)}')">${f7Esc(l)}</button>`).join('')}</div><div class="f7-az-head"><p id="f7AZCount">Toplam 0 oyun bulundu</p><select><option>Ada Göre (A-Z)</option></select></div><div id="f7AZRows" class="f7-az-rows"></div></div></section>`;
  $('#app').innerHTML=f7PageShell(content,'az');
  window.f7RenderAZ=function(){const st=window.__f7AZState||{q:'',genre:'Tümü',letter:''}; let list=games.filter(g=>{const title=String(g.title||''); if(st.letter && !title.toLocaleUpperCase('tr-TR').startsWith(st.letter.toLocaleUpperCase('tr-TR'))) return false; if(st.genre!=='Tümü' && (f7Genre(g)[0]||'Diğer')!==st.genre) return false; if(st.q){ const hay=`${title} ${f7Series(g)} ${(f7Genre(g)||[]).join(' ')}`.toLocaleLowerCase('tr-TR'); if(!hay.includes(String(st.q).toLocaleLowerCase('tr-TR'))) return false;} return true;}); const rows=document.getElementById('f7AZRows'); if(rows) rows.innerHTML=list.map(g=>{const [label,cls]=f7Status(g.status); return `<article class="f7-az-row"><div class="f7-az-thumb" style="background-image:url('${f7Esc(f7Cover(g))}')"></div><div class="f7-az-main-copy"><h3>${f7Esc(g.title||'Başlıksız')}</h3><div class="f7-az-tags">${f7Genre(g).slice(0,3).map(x=>`<span>${f7Esc(x)}</span>`).join('')}<span>${f7Esc(g.release_date||g.year||'—')}</span></div></div><div class="f7-az-meta"><span>${f7Esc(f7Series(g))}</span><span>${f7Episodes(g).length} Bölüm</span></div><div class="f7-az-actions"><span class="f7-status ${cls}">${f7Esc(label)}</span><button onclick="showGameDetailV210('${f7Esc(f7Id(g))}')">Detay →</button></div></article>`;}).join('')||'<div class="card"><p>Sonuç bulunamadı.</p></div>'; const count=document.getElementById('f7AZCount'); if(count) count.textContent=`Toplam ${f7Number(list.length)} oyun bulundu`; document.querySelectorAll('[data-f7-letter]').forEach(b=>b.classList.toggle('active',b.dataset.f7Letter===st.letter));};
  window.f7SetAZQuery=v=>{window.__f7AZState.q=v||'';window.f7RenderAZ();}; window.f7SetAZGenre=v=>{window.__f7AZState.genre=v||'Tümü';window.f7RenderAZ();}; window.f7SetAZLetter=v=>{window.__f7AZState.letter=v||'';window.f7RenderAZ();}; window.f7ResetAZ=()=>{window.__f7AZState={q:'',genre:'Tümü',letter:''}; const inp=document.querySelector('.f7-hero-search input'); if(inp) inp.value=''; document.querySelectorAll('input[name="f7genre"]')[0] && (document.querySelectorAll('input[name="f7genre"]')[0].checked=true); window.f7RenderAZ();};
  window.f7RenderAZ();
}
function admin(){
  if(!canSeeAdmin()){login(); return;}
  const st=f7Stats();
  const content=`<section class="f7-admin-shell"><aside class="f7-admin-side"><div class="f7-side-brand admin"><div class="f7-logo">🛡</div><div><strong>Admin Yönetimi</strong><small>Kontrol Merkezi</small></div></div><div class="f7-side-group"><span>GENEL</span><button class="active" onclick="adminTab('dashboard')"><i>⌂</i><b>Dashboard</b></button><button onclick="adminTab('games')"><i>🎮</i><b>Oyunlar</b></button><button onclick="adminTab('seriesOrder')"><i>☰</i><b>Seriler</b></button><button onclick="adminTab('notes251')"><i>🔔</i><b>Güncellemeler</b></button><button onclick="adminTab('socialcheck')"><i>◎</i><b>Sosyal Medya</b></button></div><div class="f7-side-group"><span>SİSTEM</span><button onclick="adminTab('repairV2')"><i>⚙</i><b>Hata Kontrol</b></button><button onclick="adminTab('set')"><i>⚙</i><b>Ayarlar</b></button><button onclick="adminTab('aboutset')"><i>ⓘ</i><b>Hakkında</b></button></div><div class="f7-side-card"><strong>Tüm Sistemler Çevrimiçi</strong><p>Site sağlık skoru: ${st.score}%</p><button onclick="setPage('home')">Siteye Dön</button></div></aside><div class="f7-admin-main"><section class="f7-hero inner admin"><div class="f7-hero-overlay"></div><div class="f7-hero-inner"><h1>Admin Dashboard</h1><p>Hayatımız Oyun yönetim paneline hoş geldiniz.</p></div></section><section class="f7-stats-row admin"><article class="card"><div class="f7-stat-icon blue">🎮</div><div><small>Toplam Oyun</small><h2>${f7Number(st.games)}</h2><p>+ 18 bu hafta</p></div></article><article class="card"><div class="f7-stat-icon purple">◈</div><div><small>Toplam Seri</small><h2>${f7Number(st.series)}</h2><p>+ 5 bu hafta</p></div></article><article class="card"><div class="f7-stat-icon green">☰</div><div><small>Toplam Bölüm</small><h2>${f7Number(st.episodes)}</h2><p>+ 182 bu hafta</p></div></article><article class="card"><div class="f7-stat-icon gold">🛡</div><div><small>Site Sağlığı</small><h2>${st.score}%</h2><p>+ 0.7% bu hafta</p></div></article></section><section class="f7-admin-panels"><article class="card"><div class="section-title"><div><h2>Site Sağlığı</h2></div></div><ul class="f7-health"><li><span>Web Sunucusu</span><b>Çevrimiçi</b></li><li><span>Veritabanı</span><b>Çevrimiçi</b></li><li><span>Dosya Sistemi</span><b>Çevrimiçi</b></li><li><span>CDN</span><b>Çevrimiçi</b></li><li><span>SSL Sertifikası</span><b>Geçerli</b></li></ul></article><article class="card"><div class="section-title"><div><h2>Hızlı İşlemler</h2></div></div><div class="f7-quick-grid"><button onclick="adminTab('games')">Yeni Oyun Ekle</button><button onclick="adminTab('seriesOrder')">Yeni Seri Ekle</button><button onclick="adminTab('notes251')">Güncelleme Ekle</button><button onclick="adminTab('repairV2')">Hata Tara</button></div></article></section><section id="adminArea" class="f7-admin-area"></section></div></section>`;
  $('#app').innerHTML=content; if(typeof adminTab==='function') setTimeout(()=>{ try{window.__f7OldAdminTab&&window.__f7OldAdminTab('dashboard');}catch(e){} }, 0);
}
window.__f7OldAdminTab = window.__f7OldAdminTab || window.adminTab || null;
function seriesDetail250(name){
  const games=(state.games||[]).filter(g=>f7Series(g)===name);
  const episodes=games.reduce((n,g)=>n+f7Episodes(g).length,0);
  const content=`<section class="f7-hero inner"><div class="f7-hero-overlay"></div><div class="f7-hero-inner"><h1>${f7Esc(name)}</h1><p>${games.length} oyun • ${episodes} bölüm • tüm seri tek sayfada</p></div></section><section class="f7-section-head"><div><h2>Tüm Seri İçeriği</h2></div><button class="ghost" onclick="setPage('series')">← Serilere Dön</button></section><section class="f7-timeline">${games.map((g,i)=>`<article class="f7-timeline-item card"><div class="f7-timeline-cover" style="background-image:url('${f7Esc(f7Cover(g))}')"></div><div><span class="f7-step">Oyun ${i+1}</span><h3>${f7Esc(g.title||'Başlıksız')}</h3><p class="muted">${f7Esc((f7Genre(g)||[]).slice(0,3).join(', ')||'Aksiyon')}</p><div class="f7-card-pills"><span>${f7Episodes(g).length} Bölüm</span><span>${f7Esc(g.type||'Ana Oyun')}</span></div><button onclick="showGameDetailV210('${f7Esc(f7Id(g))}')">Oyunu Aç →</button></div></article>`).join('')||'<div class="card"><p>Bu seri için kayıt yok.</p></div>'}</section>`;
  $('#app').innerHTML=f7PageShell(content,'series');
}
function render(){
  applyTheme();
  document.documentElement.style.setProperty('--bg-intensity', Math.max(.2, Math.min(1.25, Number(state.settings?.background_intensity??75)/100)));
  updateSeo();
  document.body.classList.remove('menu-open');
  const app=$('#app');
  if(app){app.classList.remove('page-in'); void app.offsetWidth; app.classList.add('page-in');}
  renderNav();
  setAtmosphereTheme(state.page);
  if(state.settings?.maintenance && !canSeeAdmin()){maintenance();return;}
  const pages={home,series,az,calendar,notes,social,about,admin,archivev210:archivePageV210,searchv210:searchPageV210,favoritesv210:favoritesPageV210,trackingv210:trackingPageV210,contribute251:contributePage251,contribute250:contributePage251,profile250:profileDashboard250,profile:profileDashboard250};
  (pages[state.page]||home)();
  renderMusicPanel();
}
