const APP_VERSION = 'v2.5.6 Temiz Çalışan';
const LS = {
  session:'hayatimiz_session_stable',
  page:'hayatimiz_page_stable',
  admin:'hayatimiz_admin_tab_stable',
  maintenance:'hayatimiz_maintenance_cache_stable',
  games:'hayatimiz_clean_games_v256',
  notes:'hayatimiz_clean_notes_v256',
  calendar:'hayatimiz_clean_calendar_v256',
  toast:'hayatimiz_clean_toast_v256'
};

const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
const esc = (v)=>String(v ?? '').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const clean = (v)=>v==null?'':String(v).trim();
const read = (k,d)=>{try{return JSON.parse(localStorage.getItem(k)||'') ?? d}catch{return d}};
const write = (k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{} return v};
const today = ()=>new Date().toISOString().slice(0,10);
function slug(v){return clean(v).toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replaceAll('ı','i').replaceAll('ğ','g').replaceAll('ü','u').replaceAll('ş','s').replaceAll('ö','o').replaceAll('ç','c').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || 'sayfa'}
function dateTR(v){const s=clean(v); if(!s) return '-'; const m=s.match(/^(\d{4})-(\d{2})-(\d{2})/); return m?`${m[3]}.${m[2]}.${m[1]}`:s}
function splitList(v){return Array.isArray(v)?v.map(clean).filter(Boolean):clean(v).split(/[,;|]/).map(clean).filter(Boolean)}
function parseNum(v,d=0){const n=Number(v); return Number.isFinite(n)?n:d}

const starterGames = [
  {id:'local-awayout',title:'A Way Out',genre:'Aksiyon-macera, Co-op, Hikaye',tags:'Türkçe Altyazılı, Coop, Final',release_date:'2018-03-23',episode_count:10,watched_episode_count:0,score:8.8,cover_url:'',series_name:'A Way Out',series_order:1,description:'Hapishanede yolları kesişen iki karakterin ortak kaçış hikayesi.'},
  {id:'local-plague1',title:'A Plague Tale: Innocence',genre:'Macera, Aksiyon, Gizlilik, Hikaye odaklı',tags:'Türkçe Altyazılı, Hikaye, Final',release_date:'2019-05-14',episode_count:17,watched_episode_count:0,score:9.2,cover_url:'',series_name:'A Plague Tale',series_order:1,description:'Amicia ve Hugo’nun karanlık Orta Çağ Fransası yolculuğu.'},
  {id:'local-alanwake',title:'Alan Wake Remastered',genre:'Hayatta kalma korku, Psikolojik gerilim',tags:'Türkçe Altyazılı, Hikaye',release_date:'2021-10-05',episode_count:0,watched_episode_count:0,score:8,cover_url:'',series_name:'Alan Wake',series_order:1,description:'Alan Wake’in karanlık Bright Falls hikayesi.'}
];

const localMeta = [
  [/assassin.*creed.*origins|assassins.*creed.*origins|origins/i,{title:"Assassin's Creed Origins",genre:'Aksiyon, Macera, RPG, Açık Dünya',tags:'Tek Oyunculu, Hikaye, Açık Dünya',cover_url:'https://media.rawg.io/media/games/336/336c6bd63d83cf8e59937ab8895d1240.jpg',release_date:'2017-10-27',description:"Antik Mısır'da geçen Assassin's Creed Origins yayın planı."}],
  [/alan.*wake.*2/i,{title:'Alan Wake 2',genre:'Hayatta kalma korku, Psikolojik gerilim',tags:'Türkçe Altyazılı, Hikaye',cover_url:'https://media.rawg.io/media/games/51a/51a404b98e2068a8a7ee0874a34050f5.jpg',release_date:'2023-10-27',description:'Alan Wake 2 korku/gerilim seri yayını.'}],
  [/alan.*wake/i,{title:'Alan Wake Remastered',genre:'Hayatta kalma korku, Psikolojik gerilim',tags:'Türkçe Altyazılı, Hikaye',cover_url:'',release_date:'2021-10-05',description:'Alan Wake Remastered yayın planı.'}],
  [/plague.*requiem/i,{title:'A Plague Tale: Requiem',genre:'Macera, Aksiyon, Gizlilik, Hikaye odaklı',tags:'Türkçe Altyazılı, Hikaye, Final',cover_url:'https://media.rawg.io/media/games/566/566f407b1d685c1d34045045abb1723d.jpg',release_date:'2022-10-18',description:'A Plague Tale: Requiem seri devam yayını.'}],
  [/plague.*innocence/i,{title:'A Plague Tale: Innocence',genre:'Macera, Aksiyon, Gizlilik, Hikaye odaklı',tags:'Türkçe Altyazılı, Hikaye, Final',cover_url:'https://media.rawg.io/media/games/67b/67b322b5c84a291b97af9a8585cdd945.jpg',release_date:'2019-05-14',description:'A Plague Tale: Innocence seri yayını.'}],
  [/a.*way.*out/i,{title:'A Way Out',genre:'Aksiyon-macera, Co-op, Hikaye',tags:'Türkçe Altyazılı, Coop, Final',cover_url:'',release_date:'2018-03-23',description:'A Way Out co-op yayın planı.'}],
  [/avatar.*frontiers/i,{title:'Avatar: Frontiers of Pandora',genre:'Aksiyon-macera, Açık Dünya, FPS',tags:'Türkçe Altyazılı, Hikaye',cover_url:'https://media.rawg.io/media/games/1e1/1e1be3fdafce366ec4e7a54e8e8e446e.jpg',release_date:'2023-12-07',description:'Avatar: Frontiers of Pandora yayın planı.'}]
];
function guessMeta(title){const hit=localMeta.find(([r])=>r.test(title)); return hit?{...hit[1]}:{title:clean(title),genre:'Aksiyon, Macera',tags:'Hikaye',cover_url:'',release_date:'',description:`${clean(title)} yayın planı.`}}

const state = {
  page:'Ana Sayfa', adminPage:'Genel Bakış', loading:false, toast:'', error:'',
  session:read(LS.session,null),
  games:read(LS.games,starterGames),
  notes:read(LS.notes,[]),
  calendar:read(LS.calendar,[]),
  maintenance:{enabled:false,message:'Hayatımız Oyun kısa süreli bakımda. Yeni güncelleme hazırlanıyor.',eta:'',percent:0,notesText:'',...read(LS.maintenance,{})},
  editingGameId:null, editingNoteId:null, editingEventId:null, query:''
};

function routeToState(){
  const p=location.pathname.toLocaleLowerCase('tr-TR');
  if(p.includes('/yonetim')) state.page='Yönetim Paneli';
  if(p.includes('oyun-ekle')) state.adminPage='Oyun Ekle';
  else if(p.includes('mevcut-oyun')) state.adminPage='Mevcut Oyunlar';
  else if(p.includes('yayin-takvimi')) state.adminPage='Yayın Takvimi';
  else if(p.includes('guncelleme-notlari')) state.adminPage='Güncelleme Notları';
  else if(p.includes('bakim-modu')) state.adminPage='Bakım Modu';
  else if(p.includes('seri-izleme')) state.adminPage='Seri İzleme';
  else if(p.includes('/yonetim')) state.adminPage=read(LS.admin,'Genel Bakış');
  else if(p.includes('/seriler')) state.page='Seriler';
  else if(p.includes('/videolar')) state.page='Videolar';
  else if(p.includes('/canli')) state.page='Canlı';
  else state.page=read(LS.page,'Ana Sayfa');
}
function routeFor(page,admin){
  if(page==='Yönetim Paneli'){
    const map={'Genel Bakış':'genel-bakis','Mevcut Oyunlar':'mevcut-oyunlar','Oyun Ekle':'oyun-ekle','Yayın Takvimi':'yayin-takvimi','Güncelleme Notları':'guncelleme-notlari','Bakım Modu':'bakim-modu','Seri İzleme':'seri-izleme'};
    return `/yonetim/${map[admin]||'genel-bakis'}`;
  }
  const map={'Ana Sayfa':'/','Seriler':'/seriler','Videolar':'/videolar','Canlı':'/canli','Listeler':'/listeler'};
  return map[page]||'/';
}
function navigate(page,admin=null,push=true){
  state.page=page; if(admin) state.adminPage=admin;
  write(LS.page,state.page); write(LS.admin,state.adminPage);
  const path=routeFor(state.page,state.adminPage);
  if(push && location.pathname!==path) history.pushState({page:state.page,admin:state.adminPage},'',path);
  render();
}
window.addEventListener('popstate',()=>{routeToState();render()});

async function api(action, body={}, method='POST'){
  const opts = method==='POST' ? {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)} : {method:'GET'};
  const res = await fetch(`/api?action=${encodeURIComponent(action)}`, opts);
  const data = await res.json().catch(()=>({ok:false,error:'Geçersiz JSON'}));
  if(!res.ok || data.ok===false) throw new Error(data.error || data.message || `API ${res.status}`);
  return data;
}
function adminToken(){return state.session?.adminToken || state.session?.token || ''}
function isStaff(){return ['kurucu','yonetici','moderator','editor'].includes(clean(state.session?.role))}
function toast(msg){state.toast=msg; write(LS.toast,msg); render(); setTimeout(()=>{ if(state.toast===msg){state.toast='';render()}},4500)}
function persist(){write(LS.games,state.games);write(LS.calendar,state.calendar);write(LS.notes,state.notes);write(LS.maintenance,state.maintenance)}

function mapGame(row){
  return {id:row.id||`local-${Date.now()}`,title:row.title||row.name||'İsimsiz Oyun',genre:row.genre||row.category||'',tags:row.tags||'',status:row.status||'Devam Ediyor',release_date:row.release_date||row.releaseDate||'',episode_count:parseNum(row.episode_count ?? row.eps),watched_episode_count:parseNum(row.watched_episode_count ?? row.watchedEps),score:parseNum(row.score),cover_url:row.cover_url||row.cover||'',series_name:row.series_name||row.seriesName||row.title||'',series_order:parseNum(row.series_order ?? row.seriesOrder),playlist_url:row.playlist_url||row.playlistUrl||'',video_url:row.video_url||row.videoUrl||'',description:row.description||'',episodes:Array.isArray(row.episodes)?row.episodes:[]};
}
function toApiGame(g){return {title:g.title,genre:g.genre,tags:g.tags,status:g.status,releaseDate:g.release_date,release_date:g.release_date,eps:g.episode_count,episode_count:g.episode_count,watchedEps:g.watched_episode_count,watched_episode_count:g.watched_episode_count,score:g.score,cover:g.cover_url,cover_url:g.cover_url,seriesName:g.series_name,series_name:g.series_name,seriesOrder:g.series_order,series_order:g.series_order,playlistUrl:g.playlist_url,playlist_url:g.playlist_url,videoUrl:g.video_url,video_url:g.video_url,description:g.description,episodes:g.episodes||[]}}
async function loadAll(){
  state.loading=true; render();
  try{
    const g=await api('games-list',{},'GET');
    if(Array.isArray(g.games)) state.games=g.games.map(mapGame);
    write(LS.games,state.games);
  }catch(e){console.warn(e);}
  try{const s=await api('settings-get',{},'POST'); if(s.maintenance){state.maintenance={...state.maintenance,...s.maintenance}; write(LS.maintenance,state.maintenance)}}catch(e){}
  try{const c=await api('calendar-events-list',{},'POST'); if(Array.isArray(c.events)){state.calendar=c.events.map(e=>({id:e.id,title:e.title,date:e.date,time:e.time||'20:00',type:e.type||'Ana Yayın',cover:e.cover||'',note:e.note||'',gameId:e.gameId||'',videoUrl:e.videoUrl||''})); write(LS.calendar,state.calendar)}}catch(e){}
  state.loading=false; render();
}

function topbar(){
  const nav=['Ana Sayfa','Seriler','Videolar','Canlı','Listeler'];
  return `<header class="topbar"><div class="brand" data-page="Ana Sayfa"><div class="logo">🎮</div><div><b>HAYATIMIZ <em>OYUN</em></b><small>Oyun, anı, seri.</small></div></div><nav>${nav.map(p=>`<button class="navBtn ${state.page===p?'active':''}" data-page="${p}">${p}</button>`).join('')}</nav><input class="search" placeholder="Ara..." value="${esc(state.query)}" data-search><div class="topActions"><span class="version">${APP_VERSION}</span><button class="adminBtn" data-admin="Genel Bakış">Admin</button></div></header>`;
}
function layout(content){return `${topbar()}<main class="appMain">${content}</main>${state.toast?`<div class="toast">${esc(state.toast)}<button data-action="close-toast">Tamam</button></div>`:''}`}
function hero(title,sub,badge=''){return `<section class="hero"><div><span>${esc(badge||APP_VERSION)}</span><h1>${esc(title)}</h1><p>${esc(sub)}</p></div><b>${state.games.length} oyun</b></section>`}
function gameCard(g){const pct=g.episode_count?Math.round((g.watched_episode_count/g.episode_count)*100):0;return `<article class="gameCard"><div class="cover">${g.cover_url?`<img src="${esc(g.cover_url)}" onerror="this.closest('.cover').classList.add('noimg');this.remove()">`:'<span>Kapak yok</span>'}<b>${g.score||'Puan yok'}</b></div><div class="gameBody"><h3>${esc(g.title)}</h3><p>${esc(g.description||'Açıklama eklenmedi.')}</p><div class="chips">${splitList(g.genre).slice(0,4).map(x=>`<i>${esc(x)}</i>`).join('')}${splitList(g.tags).slice(0,4).map(x=>`<i class="tag">${esc(x)}</i>`).join('')}</div><div class="stats"><span>${g.watched_episode_count||0}/${g.episode_count||0}<small>Bölüm</small></span><span>%${pct}<small>İlerleme</small></span><span>${g.series_order||1}<small>Sıra</small></span></div></div></article>`}
function filteredGames(){const q=clean(state.query).toLowerCase();return state.games.filter(g=>!q||`${g.title} ${g.genre} ${g.tags} ${g.series_name}`.toLowerCase().includes(q))}
function homePage(){return layout(`${hero('Hayatımız Oyun','Temiz çalışan sürüm aktif. Yönetim paneli baştan sadeleştirildi.','Arşiv Hazır')}<section class="sectionHead"><h2>Son Eklenen Oyunlar</h2><button class="linkBtn" data-page="Seriler">Tümünü Gör</button></section><div class="gameGrid">${filteredGames().slice(0,8).map(gameCard).join('')||empty('Henüz oyun yok')}</div>`)}
function seriesPage(){const groups={}; filteredGames().forEach(g=>{const k=g.series_name||g.title; (groups[k] ||= []).push(g)}); const entries=Object.entries(groups).sort((a,b)=>a[0].localeCompare(b[0],'tr')); return layout(`${hero('Seriler','Seriler alfabetik ve temiz şekilde listelenir.','Seri Kütüphanesi')}<div class="seriesGrid">${entries.map(([name,list])=>`<article class="seriesCard"><div class="seriesCover">${list[0].cover_url?`<img src="${esc(list[0].cover_url)}">`:'<span>Kapak yok</span>'}<b>${list.length} oyun</b></div><h3>${esc(name)}</h3><p>${esc(list[0].description||'Seri açıklaması eklenmedi.')}</p><div class="miniList">${list.sort((a,b)=>a.series_order-b.series_order).map(g=>`<span>${esc(g.title)} <small>Sıra ${g.series_order||1}</small></span>`).join('')}</div></article>`).join('')||empty('Henüz seri yok')}</div>`)}
function videosPage(){const episodes=[]; state.games.forEach(g=>{if(Array.isArray(g.episodes)&&g.episodes.length) g.episodes.forEach((ep,i)=>episodes.push({game:g,ep,idx:i+1})); else if(g.video_url) episodes.push({game:g,ep:{title:g.title,thumbnail:g.cover_url,videoUrl:g.video_url},idx:1})}); return layout(`${hero('Videolar','Bölümler ve video linkleri burada listelenir.','Video Arşivi')}<div class="videoGrid">${episodes.map(x=>`<article class="videoCard"><div class="videoThumb">${x.ep.thumbnail||x.game.cover_url?`<img src="${esc(x.ep.thumbnail||x.game.cover_url)}">`:'<span>Video</span>'}</div><h3>${esc(x.game.title)}</h3><p>${esc(x.ep.title||`${x.idx}. Bölüm`)}</p><a class="btn primary" href="${esc(x.ep.videoUrl||x.ep.video_url||x.game.video_url||'#')}" target="_blank">İzle</a></article>`).join('')||empty('Henüz video yok')}</div>`)}
function empty(text){return `<section class="empty"><b>${esc(text)}</b><p>Yönetim panelinden kayıt ekleyebilirsin.</p></section>`}

const adminLinks=['Genel Bakış','Mevcut Oyunlar','Oyun Ekle','Yayın Takvimi','Güncelleme Notları','Bakım Modu','Seri İzleme'];
function adminShell(body){return layout(`<section class="adminShell"><aside class="adminSide"><div class="sideLogo"><b>HAYATIMIZ <em>OYUN</em></b><small>${APP_VERSION}</small></div><button data-page="Ana Sayfa">Ana Sayfa</button><button data-page="Seriler">Seriler</button><button data-page="Videolar">Videolar</button><hr>${adminLinks.map(p=>`<button class="${state.adminPage===p?'active':''}" data-admin="${esc(p)}">${esc(p)}</button>`).join('')}<hr>${state.session?`<small>${esc(state.session.full_name||state.session.email||'Admin')}</small><button data-action="logout">Çıkış</button>`:`<button data-action="open-login">Giriş Yap</button>`}</aside><section class="adminContent"><div class="adminHeader"><div><small>Yönetim Paneli › ${esc(state.adminPage)}</small><h1>${esc(state.adminPage)}</h1><p>Boş sayfa üretmeyen temiz yönetim paneli.</p></div><span class="pill ${state.maintenance.enabled?'bad':'green'}">${state.maintenance.enabled?'Bakım açık':'Bakım kapalı'}</span></div>${body}</section></section>`)}
function adminPage(){const p=state.adminPage; const map={'Genel Bakış':adminOverview,'Mevcut Oyunlar':adminGames,'Oyun Ekle':adminGameForm,'Yayın Takvimi':adminCalendar,'Güncelleme Notları':adminNotes,'Bakım Modu':adminMaintenance,'Seri İzleme':adminSeriesSort}; return adminShell((map[p]||adminOverview)())}
function adminOverview(){const missing=state.games.filter(g=>!g.cover_url).length;return `<div class="dashGrid"><article><b>${state.games.length}</b><span>Oyun</span></article><article><b>${Object.keys(state.games.reduce((a,g)=>(a[g.series_name||g.title]=1,a),{})).length}</b><span>Seri</span></article><article><b>${missing}</b><span>Kapak Eksik</span></article><article><b>${state.calendar.length}</b><span>Takvim</span></article></div><div class="card"><h2>Hızlı İşlemler</h2><div class="rowActions"><button class="btn primary" data-admin="Oyun Ekle">Oyun Ekle</button><button class="btn" data-admin="Yayın Takvimi">Yayın Takvimi</button><button class="btn" data-admin="Güncelleme Notları">Güncelleme Notları</button><button class="btn" data-admin="Bakım Modu">Bakım Modu</button></div></div>`}
function adminGames(){return `<div class="card"><div class="sectionTitle"><h2>Mevcut Oyunlar</h2><button class="btn primary" data-admin="Oyun Ekle">Yeni Oyun Ekle</button></div><input class="fullInput" placeholder="Oyun ara..." value="${esc(state.query)}" data-search><div class="adminList">${filteredGames().map(g=>`<article><div class="thumb">${g.cover_url?`<img src="${esc(g.cover_url)}">`:'🎮'}</div><div><b>${esc(g.title)}</b><small>${esc(g.series_name||'-')} • ${esc(g.release_date||'-')} • ${esc(g.genre||'-')}</small></div><footer><button class="miniBtn" data-action="edit-game" data-id="${esc(g.id)}">Düzenle</button><button class="miniBtn" data-action="view-game" data-id="${esc(g.id)}">Sitede İzle</button><button class="miniBtn danger" data-action="delete-game" data-id="${esc(g.id)}">Sil</button></footer></article>`).join('')||empty('Oyun bulunamadı')}</div></div>`}
function gameFormData(id){return state.games.find(g=>String(g.id)===String(id)) || {title:'',genre:'',tags:'',status:'Devam Ediyor',release_date:'',episode_count:0,watched_episode_count:0,score:'',cover_url:'',series_name:'',series_order:0,playlist_url:'',video_url:'',description:'',episodes:[]}}
function adminGameForm(){const g=gameFormData(state.editingGameId);return `<form class="card gameForm" id="gameForm"><div class="sectionTitle"><h2>${state.editingGameId?'Oyunu Düzenle':'Yeni Oyun Ekle'}</h2><button class="btn" type="button" data-admin="Mevcut Oyunlar">Mevcut Oyunlar</button></div><input type="hidden" name="id" value="${esc(g.id||'')}"><div class="formGrid"><label>Oyun Adı *<input name="title" required value="${esc(g.title)}" placeholder="Assassin's Creed Origins"></label><label>Seri Adı<input name="series_name" value="${esc(g.series_name)}"></label><label>Çıkış Tarihi<input name="release_date" value="${esc(g.release_date)}" placeholder="2017-10-27"></label><label>Durum<select name="status"><option>Devam Ediyor</option><option ${g.status==='Tamamlandı'?'selected':''}>Tamamlandı</option><option ${g.status==='Yakında'?'selected':''}>Yakında</option></select></label><label class="wide">Türler<input name="genre" value="${esc(g.genre)}" placeholder="Aksiyon, Macera"></label><label class="wide">Etiketler<input name="tags" value="${esc(g.tags)}" placeholder="Türkçe Altyazılı, Hikaye"></label><label>Bölüm Sayısı<input name="episode_count" type="number" min="0" value="${esc(g.episode_count)}"></label><label>İzlenen<input name="watched_episode_count" type="number" min="0" value="${esc(g.watched_episode_count)}"></label><label>Puan<input name="score" type="number" min="0" max="10" step="0.1" value="${esc(g.score)}"></label><label>Seri Sıra<input name="series_order" type="number" min="0" value="${esc(g.series_order)}"></label><label class="wide">Kapak URL<div class="inline"><input name="cover_url" value="${esc(g.cover_url)}"><button class="miniBtn primary" type="button" data-action="fetch-meta">Meta + Kapak Çek</button></div></label><label class="wide">YouTube Playlist<input name="playlist_url" value="${esc(g.playlist_url)}"></label><label class="wide">Tek Video URL<input name="video_url" value="${esc(g.video_url)}"></label><label class="wide">Açıklama<textarea name="description" rows="5">${esc(g.description)}</textarea></label><label class="wide">Bölümler<textarea name="episodesText" rows="5" placeholder="1|Başlık|Video URL|Kapak|Açıklama">${esc((g.episodes||[]).map((e,i)=>`${e.number||i+1}|${e.title||''}|${e.videoUrl||e.video_url||''}|${e.thumbnail||''}|${e.description||''}`).join('\n'))}</textarea></label></div><div class="rowActions"><button class="btn" type="button" data-action="new-game">Yeni Temiz Form</button><button class="btn primary" type="submit">Kaydet</button></div></form>`}
function readGameForm(form){const v=n=>clean(form.elements[n]?.value);const episodes=v('episodesText').split(/\n+/).map((line,i)=>{const [num,title,videoUrl,thumbnail,description]=line.split('|').map(clean);return title||videoUrl?{id:`ep-${i+1}`,number:parseNum(num,i+1),title:title||`${i+1}. Bölüm`,videoUrl,thumbnail,description,watched:false}:null}).filter(Boolean);return mapGame({id:v('id')||`local-${Date.now()}`,title:v('title'),series_name:v('series_name')||v('title'),release_date:v('release_date'),status:v('status'),genre:v('genre'),tags:v('tags'),episode_count:parseNum(v('episode_count')),watched_episode_count:parseNum(v('watched_episode_count')),score:parseNum(v('score')),series_order:parseNum(v('series_order')),cover_url:v('cover_url'),playlist_url:v('playlist_url'),video_url:v('video_url'),description:v('description'),episodes})}
async function saveGame(form){const game=readGameForm(form); if(!game.title){toast('Oyun adı gerekli.');return} try{let data;if(adminToken()){data=await api(state.editingGameId?'games-update':'games-add',{adminToken:adminToken(),gameId:game.id,game:toApiGame(game)}); if(data.game) Object.assign(game,mapGame(data.game));} const idx=state.games.findIndex(g=>String(g.id)===String(game.id)); if(idx>=0) state.games[idx]=game; else state.games.unshift(game); persist(); state.editingGameId=null; state.adminPage='Mevcut Oyunlar'; toast('Oyun kaydedildi.'); render();}catch(e){toast('Kayıt local yapıldı, Supabase hatası: '+e.message); const idx=state.games.findIndex(g=>String(g.id)===String(game.id)); if(idx>=0) state.games[idx]=game; else state.games.unshift(game); persist(); render();}}
async function fillMeta(form){const title=clean(form.elements.title?.value); if(!title){toast('Önce oyun adını yaz.');return} let meta=guessMeta(title); try{if(adminToken()){const data=await api('game-meta',{adminToken:adminToken(),title}); if(data.meta) meta={...meta,...data.meta,cover_url:data.meta.cover||data.meta.cover_url||data.meta.background_image||meta.cover_url}}}catch(e){} const set=(n,v,force=false)=>{const el=form.elements[n]; if(el&&(force||!clean(el.value))) el.value=v||''}; set('title',meta.title,false); set('genre',meta.genre,true); set('tags',meta.tags,false); set('cover_url',meta.cover_url||meta.cover,true); set('release_date',meta.release_date||meta.releaseDate||meta.released,false); set('description',meta.description,false); toast(clean(form.elements.cover_url?.value)?'Meta ve kapak forma çekildi.':'Meta çekildi, kapak bulunamadı.');}
function eventData(id){return state.calendar.find(e=>String(e.id)===String(id)) || {title:'',date:today(),time:'20:00',type:'Seri Devamı',cover:'',videoUrl:'',note:'',gameId:''}}
function adminCalendar(){const e=eventData(state.editingEventId);return `<div class="calendarGrid"><form class="card" id="calendarForm"><h2>${state.editingEventId?'Etkinliği Düzenle':'Yayın Takvimi'}</h2><input type="hidden" name="id" value="${esc(e.id||'')}"><label>Kayıtlı Oyun<select name="gameId"><option value="">Manuel</option>${state.games.map(g=>`<option value="${esc(g.id)}" ${e.gameId===g.id?'selected':''}>${esc(g.title)}</option>`).join('')}</select></label><label>Yayın Başlığı<input name="title" required value="${esc(e.title)}" placeholder="Assassin's Creed Origins"></label><button class="btn" type="button" data-action="calendar-meta">Oyun Bilgilerini / Kapağı Çek</button><div class="two"><label>Tarih<input type="date" name="date" value="${esc(e.date||today())}"></label><label>Saat<input name="time" value="${esc(e.time||'20:00')}"></label></div><label>Yayın Türü<select name="type"><option>Ana Yayın</option><option ${e.type==='Seri Devamı'?'selected':''}>Seri Devamı</option><option ${e.type==='Topluluk'?'selected':''}>Topluluk</option><option ${e.type==='Arşiv'?'selected':''}>Arşiv</option></select></label><label>Kapak URL<input name="cover" value="${esc(e.cover)}"></label><label>Video URL<input name="videoUrl" value="${esc(e.videoUrl)}"></label><label>Not<textarea name="note" rows="4">${esc(e.note)}</textarea></label><div class="rowActions"><button class="btn" type="button" data-action="new-event">Temizle</button><button class="btn primary" type="submit">Etkinliği Kaydet</button></div></form><aside class="card preview" id="calPreview">${calendarPreview(e)}</aside></div><div class="card"><h2>Kayıtlı Yayınlar</h2><div class="adminList">${state.calendar.map(ev=>`<article><div class="thumb">${ev.cover?`<img src="${esc(ev.cover)}">`:'📅'}</div><div><b>${esc(ev.title)}</b><small>${dateTR(ev.date)} • ${esc(ev.time)} • ${esc(ev.type)}</small><p>${esc(ev.note||'')}</p></div><footer><button class="miniBtn" data-action="edit-event" data-id="${esc(ev.id)}">Düzenle</button><button class="miniBtn danger" data-action="delete-event" data-id="${esc(ev.id)}">Sil</button></footer></article>`).join('')||empty('Takvim kaydı yok')}</div></div>`}
function calendarPreview(e){return `<div class="calCard"><span>Canlı Önizleme</span><h3>${esc(e.title||'Yeni yayın')}</h3><div class="chips"><i>${dateTR(e.date)}</i><i>${esc(e.time||'20:00')}</i><i class="tag">${esc(e.type||'Seri Devamı')}</i></div>${e.cover?`<img src="${esc(e.cover)}">`:'<div class="coverEmpty">Kapak seçilmedi</div>'}<p>${esc(e.note||'Not eklenmedi.')}</p></div>`}
function readEvent(form){const v=n=>clean(form.elements[n]?.value);return {id:v('id')||`local-${Date.now()}`,gameId:v('gameId'),title:v('title'),date:v('date')||today(),time:v('time')||'20:00',type:v('type')||'Seri Devamı',cover:v('cover'),videoUrl:v('videoUrl'),note:v('note')}}
function calendarMeta(form){const game=state.games.find(g=>String(g.id)===String(form.elements.gameId.value)) || state.games.find(g=>slug(g.title)===slug(form.elements.title.value)); const meta=game?{title:game.title,cover_url:game.cover_url,videoUrl:game.video_url,genre:game.genre,description:game.description}:guessMeta(form.elements.title.value); const set=(n,v,force=false)=>{const el=form.elements[n]; if(el&&(force||!clean(el.value))) el.value=v||''}; set('title',meta.title,false); set('cover',meta.cover_url||meta.cover,true); set('videoUrl',meta.videoUrl||meta.video_url,false); set('note',meta.description,false); form.elements.type.value=(meta.genre||'').toLowerCase().includes('topluluk')?'Topluluk':'Seri Devamı'; $('#calPreview').innerHTML=calendarPreview(readEvent(form)); toast(clean(form.elements.cover.value)?'Takvim kapağı çekildi.':'Bilgi çekildi, kapak bulunamadı.');}
async function saveEvent(form){const ev=readEvent(form); const idx=state.calendar.findIndex(x=>String(x.id)===String(ev.id)); if(idx>=0) state.calendar[idx]=ev; else state.calendar.unshift(ev); persist(); try{if(adminToken()) await api('calendar-events-upsert',{adminToken:adminToken(),event:ev}); toast('Yayın takvimi kaydedildi.')}catch(e){toast('Takvim local kaydedildi, Supabase hatası: '+e.message)} state.editingEventId=null; render();}

function adminNotes(){const notes=[...defaultNotes(),...state.notes];return `<div class="noteGrid"><form class="card" id="noteForm"><h2>${state.editingNoteId?'Notu Düzenle':'Yeni Güncelleme Notu'}</h2>${noteFormFields(notes.find(n=>String(n.id)===String(state.editingNoteId))||{})}<div class="rowActions"><button class="btn" type="button" data-action="new-note">Temizle</button><button class="btn primary" type="submit">Notu Kaydet</button><button class="btn" type="button" data-action="notes-maint">Son 5 Notu Bakım Moduna İşle</button></div></form><section class="card"><h2>Kayıtlı Notlar</h2><div class="noteList">${notes.map(n=>noteCard(n)).join('')}</div></section></div>`}
function defaultNotes(){return [{id:'v256',version:'v2.5.6',title:'Temiz Çalışan Admin Panel',summary:'Boş sayfa sorunları için frontend baştan sadeleştirildi.',detail:'Oyun Ekle, Yayın Takvimi, Güncelleme Notları ve Bakım Modu tek stabil yapıda çalışır.',locked:true,status:'Tamamlandı'}]}
function noteFormFields(n){return `<input type="hidden" name="id" value="${esc(n.id||'')}"><label>Sürüm<input name="version" value="${esc(n.version||'v2.5.6')}"></label><label>Başlık<input name="title" value="${esc(n.title||'')}" placeholder="Kısa başlık"></label><label>Kullanıcı Özeti<textarea name="summary" rows="3">${esc(n.summary||'')}</textarea></label><label>Detaylı Not<textarea name="detail" rows="5">${esc(n.detail||'')}</textarea></label><label>Durum<select name="status"><option>Tamamlandı</option><option ${n.status==='Planlandı'?'selected':''}>Planlandı</option><option ${n.status==='Aktif'?'selected':''}>Aktif</option></select></label>`}
function noteCard(n){return `<article class="noteCard"><div><b>${esc(n.version)}</b><small>${esc(n.status||'Tamamlandı')}</small></div><h3>${esc(n.title)}</h3><p>${esc(n.summary)}</p><small>${esc(n.detail||'')}</small><footer><button class="miniBtn" data-action="edit-note" data-id="${esc(n.id)}">Düzenle</button><button class="miniBtn danger" data-action="delete-note" data-id="${esc(n.id)}">Sil</button></footer></article>`}
function readNote(form){const v=n=>clean(form.elements[n]?.value);return {id:v('id')||`custom-${Date.now()}`,version:v('version'),title:v('title'),summary:v('summary'),detail:v('detail'),status:v('status')||'Tamamlandı'}}
async function saveNote(form){const n=readNote(form); if(!n.version||!n.title){toast('Sürüm ve başlık gerekli.');return} const idx=state.notes.findIndex(x=>String(x.id)===String(n.id)); if(idx>=0) state.notes[idx]=n; else state.notes.unshift(n); persist(); try{if(adminToken()) await api('update-note-save',{adminToken:adminToken(),...n}); toast('Güncelleme notu kaydedildi.')}catch(e){toast('Not local kaydedildi, Supabase hatası: '+e.message)} state.editingNoteId=null; render();}
function recentNotesText(){return [...defaultNotes(),...state.notes].slice(0,5).map(n=>`${n.version} • ${n.title}: ${n.summary}`).join('\n')}
function adminMaintenance(){const m=state.maintenance;return `<form class="card maintenance" id="maintenanceForm"><h2>Bakım Modu</h2><p>Yazarken sıfırlanmaz. Kaydedince local ve Supabase’e gönderilir.</p><label>Bakım mesajı<input name="message" value="${esc(m.message)}"></label><label>Tahmini açılış<input name="eta" value="${esc(m.eta)}" placeholder="30.05.2026 20:00"></label><label>Tamamlanma yüzdesi<input name="percent" type="number" min="0" max="100" value="${esc(m.percent||0)}"></label><label>Güncelleme notları<textarea name="notesText" rows="6">${esc(m.notesText||recentNotesText())}</textarea></label><div class="rowActions"><button class="btn" type="button" data-action="maint-notes">Son 5 Notu Getir</button><button class="btn primary" type="submit">Kaydet</button><button class="btn primary" type="button" data-action="maint-on">Bakımı Aç</button><button class="btn danger" type="button" data-action="maint-off">Bakımı Kapat</button></div></form><aside class="card maintPreview"><span>Kullanıcı Önizlemesi</span><h2>Hayatımız Oyun güncelleniyor</h2><p>${esc(m.message)}</p><div class="progress"><i style="width:${parseNum(m.percent)}%"></i><b>${parseNum(m.percent)}%</b></div><pre>${esc(m.notesText||recentNotesText())}</pre></aside>`}
function readMaint(form, enabled=state.maintenance.enabled){const v=n=>clean(form.elements[n]?.value);return {enabled,message:v('message')||'Hayatımız Oyun kısa süreli bakımda.',eta:v('eta'),percent:Math.max(0,Math.min(100,parseNum(v('percent')))),notesText:v('notesText')||recentNotesText()}}
async function saveMaint(form,enabled=state.maintenance.enabled){state.maintenance=readMaint(form,enabled); persist(); try{if(adminToken()) await api('settings-set',{adminToken:adminToken(),key:'maintenance_mode',value:state.maintenance,maintenance:state.maintenance}); toast('Bakım modu kaydedildi.')}catch(e){toast('Bakım local kaydedildi, Supabase hatası: '+e.message)} render();}
function adminSeriesSort(){const rows=[...state.games].sort((a,b)=>(a.series_name||a.title).localeCompare(b.series_name||b.title,'tr')||a.series_order-b.series_order);return `<div class="card"><h2>Seri Sıralama</h2><p>Seri Geçmişi kaldırıldı. Sadece aktif seri sıralaması burada.</p><div class="adminList">${rows.map(g=>`<article><div class="thumb">${g.cover_url?`<img src="${esc(g.cover_url)}">`:'🎮'}</div><div><b>${esc(g.title)}</b><small>${esc(g.series_name||g.title)} • Sıra ${g.series_order||1}</small></div><footer><button class="miniBtn" data-action="move-up" data-id="${esc(g.id)}">↑</button><button class="miniBtn" data-action="move-down" data-id="${esc(g.id)}">↓</button></footer></article>`).join('')}</div></div>`}

function loginModal(){return `<div class="modal"><form class="loginBox" id="loginForm"><h2>Admin Girişi</h2><label>E-posta<input name="email" type="email" required></label><label>Şifre<input name="password" type="password" required></label><div class="rowActions"><button class="btn" type="button" data-action="close-modal">Kapat</button><button class="btn primary" type="submit">Giriş Yap</button></div></form></div>`}
async function login(form){try{const data=await api('login',{email:form.elements.email.value,password:form.elements.password.value}); state.session={...data.user,adminToken:data.adminToken}; write(LS.session,state.session); toast('Giriş başarılı.'); render();}catch(e){toast('Giriş başarısız: '+e.message)}}

function render(){
  const root=$('#root'); if(!root) return;
  let html='';
  if(state.page==='Yönetim Paneli') html=adminPage();
  else if(state.page==='Seriler') html=seriesPage();
  else if(state.page==='Videolar') html=videosPage();
  else html=homePage();
  root.innerHTML = html + (state.loginOpen?loginModal():'') + (state.loading?'<div class="loading">Yükleniyor...</div>':'');
}

document.addEventListener('click',async e=>{
  const page=e.target.closest('[data-page]')?.dataset.page; if(page){e.preventDefault(); navigate(page,null,true); return}
  const admin=e.target.closest('[data-admin]')?.dataset.admin; if(admin){e.preventDefault(); navigate('Yönetim Paneli',admin,true); return}
  const act=e.target.closest('[data-action]')?.dataset.action;
  if(!act) return;
  e.preventDefault();
  if(act==='close-toast'){state.toast='';render()}
  if(act==='open-login'){state.loginOpen=true;render()}
  if(act==='close-modal'){state.loginOpen=false;render()}
  if(act==='logout'){state.session=null;localStorage.removeItem(LS.session);toast('Çıkış yapıldı.')}
  if(act==='edit-game'){state.editingGameId=e.target.closest('[data-id]').dataset.id; navigate('Yönetim Paneli','Oyun Ekle',true)}
  if(act==='new-game'){state.editingGameId=null;render()}
  if(act==='delete-game'){const id=e.target.closest('[data-id]').dataset.id;if(confirm('Oyun silinsin mi?')){state.games=state.games.filter(g=>String(g.id)!==String(id));persist();try{if(adminToken())await api('games-delete',{adminToken:adminToken(),gameId:id})}catch{}toast('Oyun silindi.')}}
  if(act==='fetch-meta') await fillMeta($('#gameForm'));
  if(act==='calendar-meta') calendarMeta($('#calendarForm'));
  if(act==='new-event'){state.editingEventId=null;render()}
  if(act==='edit-event'){state.editingEventId=e.target.closest('[data-id]').dataset.id;render()}
  if(act==='delete-event'){const id=e.target.closest('[data-id]').dataset.id;if(confirm('Takvim kaydı silinsin mi?')){state.calendar=state.calendar.filter(x=>String(x.id)!==String(id));persist();try{if(adminToken())await api('calendar-events-delete',{adminToken:adminToken(),id})}catch{}toast('Takvim kaydı silindi.')}}
  if(act==='new-note'){state.editingNoteId=null;render()}
  if(act==='edit-note'){state.editingNoteId=e.target.closest('[data-id]').dataset.id;render()}
  if(act==='delete-note'){const id=e.target.closest('[data-id]').dataset.id;if(confirm('Not silinsin mi?')){state.notes=state.notes.filter(n=>String(n.id)!==String(id));persist();toast('Not silindi.');render()}}
  if(act==='notes-maint'){state.maintenance.notesText=recentNotesText();persist();toast('Son 5 not bakım moduna işlendi.');render()}
  if(act==='maint-notes'){const f=$('#maintenanceForm'); if(f){f.elements.notesText.value=recentNotesText();}}
  if(act==='maint-on') await saveMaint($('#maintenanceForm'),true);
  if(act==='maint-off') await saveMaint($('#maintenanceForm'),false);
  if(act==='move-up'||act==='move-down'){const id=e.target.closest('[data-id]').dataset.id; const g=state.games.find(x=>String(x.id)===String(id)); if(g){g.series_order=Math.max(1,(g.series_order||1)+(act==='move-up'?-1:1)); persist(); render();}}
});
document.addEventListener('input',e=>{if(e.target.matches('[data-search]')){state.query=e.target.value;render()} if(e.target.closest('#calendarForm')){$('#calPreview') && ($('#calPreview').innerHTML=calendarPreview(readEvent($('#calendarForm'))))}});
document.addEventListener('submit',async e=>{if(e.target.id==='loginForm'){e.preventDefault();await login(e.target);return} if(e.target.id==='gameForm'){e.preventDefault();await saveGame(e.target);return} if(e.target.id==='calendarForm'){e.preventDefault();await saveEvent(e.target);return} if(e.target.id==='noteForm'){e.preventDefault();await saveNote(e.target);return} if(e.target.id==='maintenanceForm'){e.preventDefault();await saveMaint(e.target);return}});

window.addEventListener('error',e=>{const r=$('#root'); if(r) r.innerHTML=`<main class="fatal"><h1>Site açılış hatası yakalandı</h1><p>${esc(e.message||'Bilinmeyen hata')}</p><button onclick="location.href='/'">Ana Sayfa</button></main>`});
routeToState();
render();
loadAll();
