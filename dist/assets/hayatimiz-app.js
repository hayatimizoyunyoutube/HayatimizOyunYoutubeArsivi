const VERSION = 'v2.0.4';
const FIX_NAME = 'FIX • kalıcı silme + kayıt/giriş + bakım modu';
const ADMIN_EMAILS = ['mertdundaroyunda@gmail.com','mertdundar05@outlook.com'];
const STORAGE = {
  games: 'hayatimiz_games_v204_canonical',
  gamesInitialized: 'hayatimiz_games_v204_initialized',
  events: 'hayatimiz_events_v204_canonical',
  notes: 'hayatimiz_update_notes_v204_canonical',
  maintenance: 'hayatimiz_maintenance_v204_canonical',
  users: 'hayatimiz_auth_users_v204',
  session: 'hayatimiz_auth_session_v204',
  maintenanceFix: 'hayatimiz_maintenance_fix_applied_v204'
};
const GAME_KEYS = [STORAGE.games,'hayatimiz_games_cache_stable_v31','hayatimiz_games_cache_stable_v30','hayatimiz_games_cache_stable_v24','hayatimiz_games_cache_stable','hayatimiz_games_v2'];
const EVENTS_KEYS = [STORAGE.events,'hayatimiz_v202_calendar_events','hayatimiz_v254_fix2_calendar_events','hayatimiz_calendar_events_stable_v253f4'];
const NOTES_KEYS = [STORAGE.notes,'hayatimiz_update_notes_local_v204','hayatimiz_update_notes_local_v203','hayatimiz_update_notes_local_v202','hayatimiz_update_notes_local_v254f8','hayatimiz_update_notes_local_v251','hayatimiz_update_notes_local'];
const MAINTENANCE_KEYS = [STORAGE.maintenance,'hayatimiz_maintenance_cache_stable','hayatimiz_v254_maintenance','hayatimiz_site_runtime_config_maintenance'];

const DEFAULT_GAMES = [
  {id:'alan-wake-remastered',title:'Alan Wake Remastered',status:'Devam Eden',genre:'Korku',seriesName:'Alan Wake',cover:'/assets/alan-wake-night-springs.png',releaseDate:'2010',description:'Korku ve hikaye odaklı yayın arşivi. Bölüm bölüm takip için hazır kart yapısı.',episodeCount:8,tags:'Türkçe Altyazılı, Hikaye, Korku'},
  {id:'assassins-creed-directors-cut',title:'Assassin’s Creed Director’s Cut',status:'Tamamlanan',genre:'Aksiyon',seriesName:'Assassin’s Creed',cover:'/assets/assassins-creed-directors-cut.png',releaseDate:'2008',description:'Tamamlanan seri arşivi, bölüm sayısı ve koleksiyon görünümü için örnek kayıt.',episodeCount:14,tags:'Türkçe, Seri, Tarihi'},
  {id:'hayatimiz-oyun-arsiv',title:'Hayatımız Oyun Arşivi',status:'Yakında',genre:'YouTube Arşivi',seriesName:'Genel Arşiv',cover:'/assets/hayatimiz-kapak.png',releaseDate:'2026',description:'YouTube playlist, bölüm ve oyun koleksiyonu merkezi.',episodeCount:0,tags:'Arşiv, Plan, YouTube'},
  {id:'a-plague-tale-innocence',title:'A Plague Tale: Innocence',status:'Planlandı',genre:'Macera',seriesName:'A Plague Tale',cover:'/assets/hayatimiz-kapak.png',releaseDate:'2019',description:'Hikaye odaklı seri için gelecek yayın planı ve kart/filtre örneği.',episodeCount:0,tags:'Türkçe Altyazılı, Hikaye, Macera'},
  {id:'control-ultimate-edition',title:'Control Ultimate Edition',status:'Ara Verildi',genre:'Aksiyon',seriesName:'Remedy Evreni',cover:'/assets/hayatimiz-kapak.png',releaseDate:'2019',description:'Ara verilen seriler için durum rozeti ve koleksiyon sayacı örneği.',episodeCount:5,tags:'Aksiyon, Bilim Kurgu, Seri'}
];
const DEFAULT_NOTES = [
  {id:'fix-v204-auth-bakim',version:'v2.0.4 FIX',title:'Kalıcı Silme, Kayıt/Giriş ve Bakım Modu Fix',summary:'Mevcut oyunlarda son kayıt silinince demo oyunların geri gelmesi düzeltildi. Kayıt ol/giriş yap sayfaları geri eklendi. Bakım modu herkese yönetim sayfası olarak görünmeyecek şekilde yetkili alanına alındı.',status:'Tamamlandı'},
  {id:'v204',version:'v2.0.4',title:'Oyun Arşivi, Kartlar ve Filtreler',summary:'Profesyonel oyun kartları, arama, durum, tür, etiket, seri filtreleri, koleksiyon ve sonuç sayıları geri eklendi.',status:'Tamamlandı'},
  {id:'v203',version:'v2.0.3',title:'Profesyonel Ana Sayfa Geri Dönüş',summary:'Sinematik hero, arşiv istatistikleri, son eklenenler ve hızlı menü geri eklendi.',status:'Tamamlandı'}
];

function $(sel, root=document){ return root.querySelector(sel); }
function esc(v){ return String(v ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
function readJson(key, fallback){ try{ const raw=localStorage.getItem(key); return raw === null ? fallback : JSON.parse(raw); }catch{ return fallback; } }
function writeJson(key, value){ localStorage.setItem(key, JSON.stringify(value)); }
function keyExists(key){ return localStorage.getItem(key) !== null; }
function firstStoredArray(keys){
  for(const key of keys){
    if(keyExists(key)){
      const val = readJson(key, null);
      if(Array.isArray(val)) return val;
    }
  }
  return null;
}
function slugify(v){ return String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || ('item-'+Date.now()); }
function normalizeGame(g,i){
  const title = g.title || g.name || g.game_title || `Oyun ${i+1}`;
  return {
    id: g.id || g.slug || slugify(title),
    title,
    status: g.status || g.progress_status || g.state || 'Devam Eden',
    genre: g.genre || g.category || (Array.isArray(g.genres)?g.genres[0]:'Arşiv'),
    tags: Array.isArray(g.tags) ? g.tags.join(', ') : (g.tags || ''),
    seriesName: g.seriesName || g.series_name || g.series || '',
    cover: g.cover || g.coverUrl || g.cover_url || g.image || g.image_url || g.background_image || '/assets/hayatimiz-kapak.png',
    releaseDate: g.releaseDate || g.release_date || g.released || '',
    description: g.description || g.summary || 'Açıklama eklenmedi.',
    youtubePlaylistUrl: g.youtubePlaylistUrl || g.youtube_playlist_url || g.playlistUrl || g.playlist_url || '',
    episodeCount: Number(g.episodeCount || g.episode_count || g.totalEpisodes || 0),
    watchedEpisodeCount: Number(g.watchedEpisodeCount || g.watched_episode_count || 0)
  };
}
function loadGames(){
  const stored = firstStoredArray(GAME_KEYS);
  if(stored !== null){
    const normalized = stored.map(normalizeGame);
    if(!keyExists(STORAGE.games)) writeJson(STORAGE.games, normalized);
    localStorage.setItem(STORAGE.gamesInitialized,'1');
    return normalized;
  }
  if(localStorage.getItem(STORAGE.gamesInitialized)==='1') return [];
  const initial = DEFAULT_GAMES.map(normalizeGame);
  saveGames(initial);
  return initial;
}
function saveGames(rows){
  const normalized = (Array.isArray(rows)?rows:[]).map(normalizeGame);
  for(const key of GAME_KEYS) writeJson(key, normalized);
  localStorage.setItem(STORAGE.gamesInitialized,'1');
  localStorage.setItem('hayatimiz_games_last_saved_at', new Date().toISOString());
}
function deleteGame(id){ saveGames(loadGames().filter(g=>String(g.id)!==String(id))); }
function clearAllGames(){ saveGames([]); }
function restoreDemoGames(){ saveGames(DEFAULT_GAMES.map(normalizeGame)); }
function firstArray(keys, fallback=[]){ const stored=firstStoredArray(keys); return stored === null ? fallback : stored; }
function loadEvents(){ return firstArray(EVENTS_KEYS, []); }
function saveEvents(rows){ for(const k of EVENTS_KEYS) writeJson(k, Array.isArray(rows)?rows:[]); }
function loadNotes(){ const local=firstArray(NOTES_KEYS, []); return Array.isArray(local) && local.length ? local : DEFAULT_NOTES; }
function saveNotes(rows){ for(const k of NOTES_KEYS) writeJson(k, Array.isArray(rows)?rows:[]); }
function sanitizeMaintenance(raw){
  const base = {enabled:false,message:'Hayatımız Oyun kısa süreli bakımda.',eta:'',percent:0,adminBypass:true,managedBy:'v204-fix'};
  const cfg = {...base, ...(raw && typeof raw==='object' ? raw : {})};
  if(localStorage.getItem(STORAGE.maintenanceFix)!=='1' && cfg.enabled === true && cfg.managedBy !== 'v204-fix'){
    cfg.enabled = false;
    cfg.repairedFromLegacy = true;
    cfg.repairedAt = new Date().toISOString();
    cfg.message = cfg.message || base.message;
    saveMaintenance(cfg);
    localStorage.setItem(STORAGE.maintenanceFix,'1');
  }
  return cfg;
}
function loadMaintenance(){
  let found = null;
  for(const key of MAINTENANCE_KEYS){ if(keyExists(key)){ found = readJson(key, null); break; } }
  return sanitizeMaintenance(found || {enabled:false,message:'Hayatımız Oyun kısa süreli bakımda.',eta:'',percent:0,adminBypass:true,managedBy:'v204-fix'});
}
function saveMaintenance(v){
  const cfg = {...v, enabled: v.enabled === true, percent: Number(v.percent||0), managedBy:'v204-fix', updatedAt:new Date().toISOString()};
  for(const key of MAINTENANCE_KEYS) writeJson(key, cfg);
  localStorage.setItem(STORAGE.maintenanceFix,'1');
}
function loadUsers(){ return readJson(STORAGE.users, []); }
function saveUsers(rows){ writeJson(STORAGE.users, rows); }
function isAdminEmail(email){ return ADMIN_EMAILS.includes(String(email||'').trim().toLowerCase()); }
function currentUser(){ return readJson(STORAGE.session, null); }
function isLoggedIn(){ return !!currentUser(); }
function isAdmin(){ const u=currentUser(); return !!u && (u.role === 'owner' || u.role === 'admin' || isAdminEmail(u.email)); }
function signOut(){ localStorage.removeItem(STORAGE.session); }
function route(){ return decodeURI(location.pathname || '/'); }
function isAuthRoute(p=route()){ return ['/giris-yap','/kayit-ol','/auth/login','/auth/register'].includes(p); }
function setRoute(path){ history.pushState({},'',path); render(); window.scrollTo(0,0); }
function toast(msg){ const old=$('.toast'); if(old) old.remove(); const t=document.createElement('div'); t.className='toast'; t.textContent=msg; document.body.appendChild(t); setTimeout(()=>t.remove(),3000); }
function active(path){ const p=route(); return p===path || (path!=='/' && p.startsWith(path)); }
function countBy(rows, key){ return rows.reduce((acc,item)=>{ const k=item[key] || 'Diğer'; acc[k]=(acc[k]||0)+1; return acc; },{}); }
function statusClass(status){ const s=String(status||'').toLowerCase(); return s.includes('tamam')?'green':s.includes('yak')||s.includes('plan')?'amber':s.includes('ara')?'red':''; }
function tagList(g){ return String(g.tags||'').split(',').map(x=>x.trim()).filter(Boolean); }
function uniqueValues(rows, getter){ return Array.from(new Set(rows.map(getter).flat().map(x=>String(x||'').trim()).filter(Boolean))).sort((a,b)=>a.localeCompare(b,'tr')); }
function queryParams(){ return new URLSearchParams(location.search || ''); }
function selectedOption(current, value){ return String(current||'')===String(value||'') ? 'selected' : ''; }
function clearTextMatch(g, q){ if(!q) return true; return [g.title,g.genre,g.seriesName,g.description,g.tags,g.status].join(' ').toLocaleLowerCase('tr').includes(String(q).toLocaleLowerCase('tr')); }
function filterGames(rows, filters){
  return rows.filter(g => clearTextMatch(g, filters.q)
    && (!filters.status || filters.status==='Tümü' || g.status===filters.status)
    && (!filters.genre || filters.genre==='Tümü' || g.genre===filters.genre)
    && (!filters.series || filters.series==='Tümü' || (g.seriesName||'Serisiz')===filters.series)
    && (!filters.tag || filters.tag==='Tümü' || tagList(g).includes(filters.tag))
  );
}
function progressPercent(g){ const total=Number(g.episodeCount||0); const watched=Number(g.watchedEpisodeCount||0); if(!total) return g.status==='Tamamlanan'?100:0; return Math.max(0, Math.min(100, Math.round((watched/total)*100))); }
function canShowAdminLinks(){ return isAdmin(); }

function nav(){
  const user=currentUser();
  const publicItems=[['/ana-sayfa','Ana Sayfa'],['/oyun-arsivi','Oyun Arşivi'],['/seriler','Seriler']];
  const adminItems=[['/yonetim','Yönetim Paneli'],['/yonetim/oyun-ekle','Oyun Ekle'],['/yonetim/mevcut-oyunlar','Mevcut Oyunlar'],['/yonetim/yayin-takvimi','Yayın Takvimi'],['/yonetim/guncelleme-notlari','Güncelleme Notları'],['/yonetim/bakim-modu','Bakım Modu']];
  const authItems = user ? [['/hesabim', user.role==='owner'?'Owner Hesabı':'Hesabım']] : [['/giris-yap','Giriş Yap'],['/kayit-ol','Kayıt Ol']];
  return `<aside class="side"><div class="brand"><span class="logo">🎮</span><span><b>Hayatımız <em>Oyun</em></b><small>${VERSION} • ${FIX_NAME}</small></span></div><nav class="nav">${publicItems.map(([href,label])=>`<a class="${active(href)?'active':''}" href="${href}">${label}</a>`).join('')}${canShowAdminLinks()?`<div class="navLabel">Yönetim</div>${adminItems.map(([href,label])=>`<a class="${active(href)?'active':''}" href="${href}">${label}</a>`).join('')}`:''}<div class="navLabel">Üyelik</div>${authItems.map(([href,label])=>`<a class="${active(href)?'active':''}" href="${href}">${label}</a>`).join('')}</nav><button data-action="hard-refresh">Sayfayı Yenile</button>${user?`<button class="ghostBtn" data-action="logout">Çıkış Yap</button>`:''}<div class="sideFooter"><b class="okText">FIX aktif</b><br>Oyun silme kalıcıdır. Kayıt/Giriş ve Bakım Modu yetki koruması geri geldi.</div></aside>`;
}
function layout(content){ return `<main class="app">${nav()}<section class="main">${content}</section></main>`; }
function adminOnly(contentFn){
  if(isAdmin()) return contentFn();
  return layout(`<section class="panel authPanel"><span class="badge red">Yetki gerekli</span><h1>Yönetim alanı gizli</h1><p class="muted">Admin panel, oyun ekleme, mevcut oyunlar ve bakım modu artık herkese görünmez. Devam etmek için owner/admin hesabıyla giriş yap.</p><div class="actions"><a class="btn primary" href="/giris-yap">Giriş Yap</a><a class="btn secondary" href="/kayit-ol">Kayıt Ol</a></div><p class="muted small">Owner e-posta: ${esc(ADMIN_EMAILS[0])}</p></section>`);
}
function maintenancePublic(){
  const m=loadMaintenance();
  return `<main class="maintenancePublic"><section class="maintenanceCard"><span class="badge amber">Bakım Modu</span><h1>Site kısa süreli bakımda</h1><p>${esc(m.message || 'Hayatımız Oyun kısa süreli bakımda.')}</p><div class="maintenanceProgress"><i><span style="width:${Math.max(0, Math.min(100, Number(m.percent||0)))}%"></span></i><b>${esc(m.percent||0)}%</b></div><p class="muted">${esc(m.eta || 'Tahmini açılış bilgisi yakında eklenecek.')}</p><div class="actions"><a class="btn primary" href="/giris-yap">Admin Girişi</a><a class="btn secondary" href="/ana-sayfa">Yeniden Dene</a></div></section></main>`;
}
function gameCard(g){
  const cls=statusClass(g.status); const tags=tagList(g).slice(0,4); const pct=progressPercent(g); const episodeText=Number(g.episodeCount||0)?`${Number(g.episodeCount||0)} bölüm`:'Bölüm bekliyor';
  return `<article class="gameCard proGameCard"><div class="posterWrap"><img src="${esc(g.cover)}" alt="${esc(g.title)}" onerror="this.src='/assets/hayatimiz-kapak.png'"><span class="statusBadge ${cls}">${esc(g.status)}</span></div><div class="cardBody"><div class="cardTop"><span class="pill ${cls}">${esc(g.genre||'Arşiv')}</span><span class="pill">${esc(episodeText)}</span></div><h3>${esc(g.title)}</h3><p>${esc(g.description)}</p><div class="progressMini"><i><span style="width:${pct}%"></span></i><small>${pct}% izleme/seri ilerlemesi</small></div>${tags.length?`<div class="tags">${tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div>`:''}<div class="metaLine"><span>${g.seriesName?`🎬 ${esc(g.seriesName)}`:'🎬 Serisiz'}</span><span>${g.releaseDate?`📅 ${esc(g.releaseDate)}`:'📅 Tarih yok'}</span></div></div></article>`;
}
function quickCard(href, icon, title, text){ return `<a class="quickCard" href="${href}"><span class="quickIcon">${icon}</span><b>${esc(title)}</b><small>${esc(text)}</small></a>`; }
function statusBar(label,count,total,cls=''){ const pct=total?Math.round((count/total)*100):0; return `<div class="statusBar"><div><span class="pill ${cls}">${esc(label)}</span><b>${count}</b></div><i><span style="width:${pct}%"></span></i></div>`; }
function home(){
  const games=loadGames(), notes=loadNotes(), events=loadEvents();
  const series=new Set(games.map(g=>g.seriesName).filter(Boolean)); const genres=new Set(games.map(g=>g.genre).filter(Boolean));
  const episodeTotal=games.reduce((sum,g)=>sum+Number(g.episodeCount||0),0); const featured=games[0] || DEFAULT_GAMES[0]; const byStatus=countBy(games,'status'); const lastGames=games.slice(0,4); const latestNote=notes[0] || DEFAULT_NOTES[0];
  return layout(`<section class="dashboardHero"><div class="heroGlow"></div><div class="heroContent"><span class="badge">${VERSION} • FIX aktif</span><h1>Hayatımız Oyun Arşivi</h1><p>Kalıcı silme, kayıt/giriş ve bakım modu düzeltildi. Admin alanları artık herkese görünmez; oyunları tamamen silince demo kayıtlar geri gelmez.</p><div class="actions"><a class="btn primary" href="/oyun-arsivi">Arşivi Aç</a>${isAdmin()?'<a class="btn secondary" href="/yonetim/oyun-ekle">Oyun Ekle</a><a class="btn secondary" href="/yonetim">Yönetim Paneli</a>':'<a class="btn secondary" href="/giris-yap">Giriş Yap</a><a class="btn secondary" href="/kayit-ol">Kayıt Ol</a>'}</div><div class="heroMiniStats"><span><b>${games.length}</b> Oyun</span><span><b>${series.size}</b> Seri</span><span><b>${episodeTotal}</b> Bölüm</span><span><b>${genres.size}</b> Kategori</span></div></div><aside class="heroSpotlight"><img src="${esc(featured.cover)}" alt="${esc(featured.title)}" onerror="this.src='/assets/hayatimiz-kapak.png'"><div><span class="pill ${statusClass(featured.status)}">Öne Çıkan</span><h2>${esc(featured.title)}</h2><p>${esc(featured.description)}</p><small>${esc(featured.genre)} ${featured.seriesName?'• '+esc(featured.seriesName):''}</small></div></aside></section><section class="quickGrid">${quickCard('/oyun-arsivi','🗂️','Oyun Arşivi','Kartlar ve temel filtreler')}${quickCard('/seriler','🎞️','Seriler','Seri grupları ve bölüm sayısı')}${isAdmin()?quickCard('/yonetim/yayin-takvimi','📅','Yayın Takvimi','Yetkili yayın kayıtları'):quickCard('/giris-yap','🔐','Yönetici Girişi','Admin alanlarını aç')}${isAdmin()?quickCard('/yonetim/guncelleme-notlari','📝','Güncellemeler','Tamamlanan/planlanan notlar'):quickCard('/kayit-ol','👤','Kayıt Ol','Üyelik sayfası geri geldi')}</section><section class="stats"><article class="stat"><b>${games.length}</b><span>Toplam Oyun</span></article><article class="stat"><b>${series.size}</b><span>Seri Grubu</span></article><article class="stat"><b>${episodeTotal}</b><span>Takip Edilen Bölüm</span></article><article class="stat"><b>${VERSION}</b><span>Aktif Sürüm</span></article></section><section class="panels homePanels"><div class="panel"><div class="sectionHead compact"><div><h2>Arşiv Durumu</h2><p>Devam eden, tamamlanan ve yakında gelecek içerikler.</p></div></div><div class="miniList">${Object.entries(byStatus).map(([label,count])=>statusBar(label,count,games.length,statusClass(label))).join('') || '<div class="empty">Durum verisi yok.</div>'}</div></div><div class="panel"><div class="sectionHead compact"><div><h2>Son Güncelleme</h2><p>${esc(latestNote.version||VERSION)}</p></div>${isAdmin()?'<a class="btn secondary" href="/yonetim/guncelleme-notlari">Notları Aç</a>':''}</div><article class="note"><span class="pill green">${esc(latestNote.status||'Tamamlandı')}</span><h3>${esc(latestNote.title)}</h3><p>${esc(latestNote.summary||latestNote.description||'')}</p></article></div></section><div class="sectionHead"><div><h2>Son Eklenenler</h2><p>Oyun silme artık kalıcıdır; son oyun silinince bu alan boş kalır.</p></div><a class="btn secondary" href="/oyun-arsivi">Tümünü Gör</a></div>${lastGames.length?`<section class="grid">${lastGames.map(gameCard).join('')}</section>`:'<div class="empty">Henüz oyun yok. Admin girişiyle yeni oyun ekleyebilir veya örnek oyunları geri yükleyebilirsin.</div>'}<section class="panels"><div class="panel"><h2>Yaklaşan Yayınlar</h2><div class="miniList">${events.length?events.slice(0,4).map(e=>`<article class="event"><span class="pill">${esc(e.date||'Tarih yok')}</span><h3>${esc(e.title||'Yayın')}</h3><p>${esc(e.time||'20:00')} • ${esc(e.note||e.type||'')}</p></article>`).join(''):'<div class="empty">Henüz takvim kaydı yok.</div>'}</div></div><div class="panel"><h2>FIX Durumu</h2><div class="roadList"><span class="done">Oyun silme kalıcı</span><span class="done">Kayıt ol / giriş yap geri geldi</span><span class="done">Bakım modu admin korumasında</span><span>Silinen gelişmiş özellikler sırayla eklenecek</span></div></div></section>`);
}
function archive(){
  const games=loadGames(); const params=queryParams(); const filters={q:params.get('q')||'',status:params.get('status')||'Tümü',genre:params.get('genre')||'Tümü',series:params.get('series')||'Tümü',tag:params.get('tag')||'Tümü'};
  const statuses=['Tümü',...uniqueValues(games,g=>g.status)]; const genres=['Tümü',...uniqueValues(games,g=>g.genre)]; const series=['Tümü',...uniqueValues(games,g=>g.seriesName||'Serisiz')]; const tags=['Tümü',...uniqueValues(games,g=>tagList(g))];
  const filtered=filterGames(games, filters); const byStatus=countBy(games,'status'); const episodeTotal=filtered.reduce((sum,g)=>sum+Number(g.episodeCount||0),0); const activeFilterCount=Object.entries(filters).filter(([k,v])=>k==='q'?String(v).trim():v && v!=='Tümü').length;
  return layout(`<section class="archiveHero"><div><span class="badge">${VERSION} • Kalıcı silme fix aktif</span><h1>Oyun Arşivi</h1><p>Oyunlar tamamen silinince artık demo kayıtlar geri gelmez. Mevcut oyunlar localStorage içinde kalıcı tutulur.</p></div>${isAdmin()?'<a class="btn primary" href="/yonetim/oyun-ekle">Yeni Oyun Ekle</a>':'<a class="btn secondary" href="/giris-yap">Admin Girişi</a>'}</section><section class="archiveStats"><article><b>${games.length}</b><span>Koleksiyon</span></article><article><b>${filtered.length}</b><span>Sonuç</span></article><article><b>${episodeTotal}</b><span>Filtrelenen Bölüm</span></article><article><b>${activeFilterCount}</b><span>Aktif Filtre</span></article></section><form class="filterPanel" data-search-form><label>Arama<input class="input" name="q" placeholder="Oyun, tür, seri, etiket ara" value="${esc(filters.q)}"></label><label>Durum<select name="status">${statuses.map(s=>`<option ${selectedOption(filters.status,s)}>${esc(s)}</option>`).join('')}</select></label><label>Tür<select name="genre">${genres.map(s=>`<option ${selectedOption(filters.genre,s)}>${esc(s)}</option>`).join('')}</select></label><label>Seri<select name="series">${series.map(s=>`<option ${selectedOption(filters.series,s)}>${esc(s)}</option>`).join('')}</select></label><label>Etiket<select name="tag">${tags.map(s=>`<option ${selectedOption(filters.tag,s)}>${esc(s)}</option>`).join('')}</select></label><div class="filterActions"><button class="btn primary" type="submit">Filtrele</button><a class="btn secondary" href="/oyun-arsivi">Temizle</a></div></form><section class="statusChips">${Object.entries(byStatus).map(([label,count])=>`<a class="statusChip" href="/oyun-arsivi?status=${encodeURIComponent(label)}"><span class="pill ${statusClass(label)}">${esc(label)}</span><b>${count}</b></a>`).join('')}</section><div class="sectionHead"><div><h2>Arşiv Kartları</h2><p>${filtered.length} sonuç / ${games.length} toplam oyun.</p></div></div>${filtered.length?`<section class="grid archiveGrid">${filtered.map(gameCard).join('')}</section>`:'<div class="empty">Bu filtreyle oyun bulunamadı. Oyunların hepsini sildiysen buranın boş kalması artık normaldir.</div>'}`);
}
function seriesPage(){ const games=loadGames(); const map=new Map(); games.forEach(g=>{ const key=g.seriesName||'Serisiz Oyunlar'; if(!map.has(key)) map.set(key,[]); map.get(key).push(g); }); return layout(`<div class="sectionHead"><div><h2>Seriler</h2><p>Oyunlar seri adına göre gruplandı.</p></div></div>${games.length?`<section class="miniList">${Array.from(map.entries()).map(([name,rows])=>`<article class="panel"><span class="pill">${rows.length} oyun</span><h2>${esc(name)}</h2><div class="grid" style="margin-top:14px">${rows.map(gameCard).join('')}</div></article>`).join('')}</section>`:'<div class="empty">Seri oluşturmak için önce oyun ekle.</div>'}`); }
function loginPage(){ return layout(`<section class="panel authPanel"><span class="badge">Üyelik geri geldi</span><h1>Giriş Yap</h1><p class="muted">Owner/admin hesabıyla giriş yapınca yönetim paneli, mevcut oyunlar ve bakım modu görünür.</p><form class="formGrid" data-login-form><label class="field full">E-posta<input class="input" type="email" name="email" required placeholder="${esc(ADMIN_EMAILS[0])}"></label><label class="field full">Şifre<input class="input" type="password" name="password" required placeholder="Yerel şifren"></label><div class="full actions"><button class="btn primary" type="submit">Giriş Yap</button><a class="btn secondary" href="/kayit-ol">Kayıt Ol</a></div></form><p class="muted small">Bu paket local üyelik kabuğudur. Supabase Auth v2.1.x adımında kalıcı sunucu auth sistemine taşınacak.</p></section>`); }
function registerPage(){ return layout(`<section class="panel authPanel"><span class="badge">Kayıt ol geri geldi</span><h1>Kayıt Ol</h1><p class="muted">Admin e-postasıyla kayıt olursan yönetim alanları açılır. Normal kullanıcıda admin linkleri gizli kalır.</p><form class="formGrid" data-register-form><label class="field full">Ad / Kanal Adı<input class="input" name="displayName" required placeholder="Hayatımız Oyun"></label><label class="field full">E-posta<input class="input" type="email" name="email" required placeholder="${esc(ADMIN_EMAILS[0])}"></label><label class="field full">Şifre<input class="input" type="password" name="password" required placeholder="Yerel şifre belirle"></label><div class="full actions"><button class="btn primary" type="submit">Kayıt Ol</button><a class="btn secondary" href="/giris-yap">Giriş Yap</a></div></form></section>`); }
function accountPage(){ const u=currentUser(); if(!u) return loginPage(); return layout(`<section class="panel authPanel"><span class="badge green">Oturum açık</span><h1>${esc(u.displayName||u.email)}</h1><p class="muted">Rol: <b>${esc(u.role||'user')}</b></p><div class="actions">${isAdmin()?'<a class="btn primary" href="/yonetim">Yönetim Paneli</a>':''}<button class="btn danger" data-action="logout">Çıkış Yap</button></div></section>`); }
function admin(){ return adminOnly(()=>{ const cards=[['/yonetim/oyun-ekle','Oyun Ekle','Yeni oyun kaydı oluştur, kapak ve playlist bilgisi gir.'],['/yonetim/mevcut-oyunlar','Mevcut Oyunlar','Kayıtlı oyunları kontrol et, tek tek veya toplu sil.'],['/yonetim/yayin-takvimi','Yayın Takvimi','Manuel yayın tarihlerini kaydet.'],['/yonetim/guncelleme-notlari','Güncelleme Notları','Tamamlanan ve planlanan notları düzenle.'],['/yonetim/bakim-modu','Bakım Modu','Bakım mesajı, yüzde ve tahmini açılışı ayarla.']]; return layout(`<div class="sectionHead"><div><h2>Yönetim Paneli</h2><p>Admin alanları artık sadece giriş yapan yetkili kullanıcıya görünür.</p></div></div><section class="adminGrid">${cards.map(([href,t,d])=>`<a class="adminCard" href="${href}"><b>${esc(t)}</b><span>${esc(d)}</span></a>`).join('')}</section><section class="panel" style="margin-top:16px"><h2>FIX Notu</h2><p>Mevcut oyunları silme kalıcıdır. Tüm oyunlar silinirse ana sayfa ve arşiv boş kalır, demo oyunlar tekrar otomatik gelmez.</p></section>`); }); }
function gameForm(){ return adminOnly(()=>layout(`<div class="sectionHead"><div><h2>Oyun Ekle</h2><p>Form kaydedince oyun arşivine eklenir. Veri localStorage içinde saklanır.</p></div></div><form class="panel formGrid" data-game-form><label class="field">Oyun Adı<input class="input" name="title" required placeholder="Örn: Alan Wake 2"></label><label class="field">Durum<select name="status"><option>Devam Eden</option><option>Tamamlanan</option><option>Yakında</option><option>Planlandı</option><option>Ara Verildi</option></select></label><label class="field">Tür / Kategori<input class="input" name="genre" placeholder="Korku, Aksiyon, RPG"></label><label class="field">Seri Adı<input class="input" name="seriesName" placeholder="Örn: Alan Wake"></label><label class="field">Çıkış Tarihi<input class="input" name="releaseDate" placeholder="2023"></label><label class="field">Bölüm Sayısı<input class="input" type="number" min="0" name="episodeCount" value="0"></label><label class="field full">Kapak URL<input class="input" name="cover" placeholder="https://... veya /assets/hayatimiz-kapak.png"></label><label class="field full">Etiketler<input class="input" name="tags" placeholder="Türkçe Altyazılı, Hikaye, Canlı Yayın"></label><label class="field full">YouTube Playlist URL<input class="input" name="youtubePlaylistUrl" placeholder="https://youtube.com/playlist?list=..."></label><label class="field full">Açıklama<textarea name="description" placeholder="Oyun açıklaması"></textarea></label><div class="full actions"><button class="btn primary" type="submit">Oyunu Kaydet</button><a class="btn secondary" href="/oyun-arsivi">Arşive Dön</a></div></form>`)); }
function currentGamesAdmin(){ return adminOnly(()=>{ const games=loadGames(); return layout(`<div class="sectionHead"><div><h2>Mevcut Oyunlar</h2><p>${games.length} kayıt listeleniyor. Son oyun silinse bile demo kayıtlar geri gelmez.</p></div><div class="actions"><a class="btn primary" href="/yonetim/oyun-ekle">Yeni Oyun</a><button class="btn danger" data-delete-all-games>Tüm Oyunları Sil</button><button class="btn secondary" data-reset-demo-games>Örnekleri Geri Yükle</button></div></div><div class="panel">${games.length?`<table class="table"><thead><tr><th>Oyun</th><th>Durum</th><th>Tür</th><th>Seri</th><th></th></tr></thead><tbody>${games.map(g=>`<tr><td>${esc(g.title)}</td><td>${esc(g.status)}</td><td>${esc(g.genre)}</td><td>${esc(g.seriesName||'-')}</td><td><button class="btn danger" data-delete-game="${esc(g.id)}">Sil</button></td></tr>`).join('')}</tbody></table>`:'<div class="empty">Kayıtlı oyun yok. Bu durum artık korunur; sayfa yenilenince demo oyunlar geri gelmez.</div>'}</div>`); }); }
function calendar(){ return adminOnly(()=>{ const rows=loadEvents(); return layout(`<div class="sectionHead"><div><h2>Yayın Takvimi</h2><p>Manuel kayıtlar kalıcı olarak localStorage içinde korunur.</p></div></div><section class="panels"><form class="panel formGrid" data-event-form><label class="field full">Başlık<input class="input" name="title" required placeholder="Örn: Alan Wake 2 Bölüm 3"></label><label class="field">Tarih<input class="input" type="date" name="date" required></label><label class="field">Saat<input class="input" name="time" value="20:00"></label><label class="field full">Video URL<input class="input" name="videoUrl" placeholder="https://youtube.com/..."></label><label class="field full">Not<textarea name="note"></textarea></label><div class="full"><button class="btn primary" type="submit">Yayını Kaydet</button></div></form><div class="panel"><h2>Kayıtlı Yayınlar</h2><div class="miniList">${rows.length?rows.map((e,i)=>`<article class="event"><span class="pill">${esc(e.date||'Tarih yok')} • ${esc(e.time||'20:00')}</span><h3>${esc(e.title||'Yayın')}</h3><p>${esc(e.note||e.videoUrl||'')}</p><button class="btn danger" data-delete-event="${i}">Sil</button></article>`).join(''):'<div class="empty">Henüz yayın kaydı yok.</div>'}</div></div></section>`); }); }
function updateNotes(){ return adminOnly(()=>{ const rows=loadNotes(); return layout(`<div class="sectionHead"><div><h2>Güncelleme Notları</h2><p>Tamamlanan ve planlanan sürümler buradan eklenebilir.</p></div></div><section class="panels"><form class="panel formGrid" data-note-form><label class="field">Sürüm<input class="input" name="version" value="v2.0.4 FIX"></label><label class="field">Durum<select name="status"><option>Tamamlandı</option><option>Planlandı</option></select></label><label class="field full">Başlık<input class="input" name="title" required placeholder="Güncelleme başlığı"></label><label class="field full">Özet<textarea name="summary" required></textarea></label><div class="full"><button class="btn primary" type="submit">Notu Kaydet</button></div></form><div class="panel"><h2>Kayıtlı Notlar</h2><div class="miniList">${rows.map((n,i)=>`<article class="note"><span class="pill ${String(n.status).includes('Plan')?'amber':'green'}">${esc(n.version||VERSION)} • ${esc(n.status||'Tamamlandı')}</span><h3>${esc(n.title)}</h3><p>${esc(n.summary||n.description||'')}</p><button class="btn danger" data-delete-note="${i}">Sil</button></article>`).join('')}</div></div></section>`); }); }
function maintenance(){ return adminOnly(()=>{ const m=loadMaintenance(); return layout(`<div class="sectionHead"><div><h2>Bakım Modu</h2><p>Bakım yönetimi artık sadece admin hesabına görünür. Admin giriş yaptıysa bakım ekranını bypass eder.</p></div></div><form class="panel formGrid" data-maint-form><label class="field">Durum<select name="enabled"><option value="false" ${!m.enabled?'selected':''}>Kapalı</option><option value="true" ${m.enabled?'selected':''}>Açık</option></select></label><label class="field">Yüzde<input class="input" type="number" min="0" max="100" name="percent" value="${esc(m.percent||0)}"></label><label class="field full">Mesaj<input class="input" name="message" value="${esc(m.message||'')}"></label><label class="field full">Tahmini Açılış<input class="input" name="eta" value="${esc(m.eta||'')}"></label><div class="full actions"><button class="btn primary" type="submit">Bakım Ayarını Kaydet</button><button type="button" class="btn secondary" data-action="maintenance-off">Bakımı Kapat</button></div></form><section class="panel" style="margin-top:16px"><h2>Önizleme</h2><p><b>Durum:</b> ${m.enabled?'<span class="pill red">Açık - public kullanıcı bakım ekranı görür</span>':'<span class="pill green">Kapalı - site normal açılır</span>'}</p><p>${esc(m.message||'Mesaj yok')}</p><p class="muted">${esc(m.eta||'Tahmini açılış girilmedi')} • ${esc(m.percent||0)}%</p></section>`); }); }
function notFound(){ return layout(`<section class="panel"><h1>Sayfa bulunamadı</h1><p class="muted">Bu rota stabil kabukta bulunamadı.</p><a class="btn primary" href="/ana-sayfa">Ana Sayfaya Dön</a></section>`); }
function pageHtml(){ const p=route(); const m=loadMaintenance(); if(m.enabled && !isAdmin() && !isAuthRoute(p)) return maintenancePublic(); if(p==='/'||p==='/ana-sayfa') return home(); if(p.startsWith('/oyun-arsivi')) return archive(); if(p.startsWith('/seriler')) return seriesPage(); if(p==='/giris-yap'||p==='/auth/login') return loginPage(); if(p==='/kayit-ol'||p==='/auth/register') return registerPage(); if(p==='/hesabim') return accountPage(); if(p==='/yonetim') return admin(); if(p==='/yonetim/oyun-ekle') return gameForm(); if(p==='/yonetim/mevcut-oyunlar') return currentGamesAdmin(); if(p==='/yonetim/yayin-takvimi') return calendar(); if(p==='/yonetim/guncelleme-notlari' || p==='/guncellemeler') return updateNotes(); if(p==='/yonetim/bakim-modu') return maintenance(); return notFound(); }
function bind(){
  document.body.addEventListener('click', e=>{
    const a=e.target.closest('a[href]'); if(a && a.origin===location.origin && !a.hasAttribute('download')){ e.preventDefault(); setRoute(a.pathname + a.search); return; }
    const delGame=e.target.closest('[data-delete-game]'); if(delGame){ if(confirm('Bu oyunu kalıcı olarak silmek istiyor musun?')){ deleteGame(delGame.dataset.deleteGame); toast('Oyun kalıcı olarak silindi.'); render(); } return; }
    if(e.target.closest('[data-delete-all-games]')){ if(confirm('Tüm oyunları kalıcı olarak silmek istiyor musun? Bu işlemden sonra demo oyunlar geri gelmez.')){ clearAllGames(); toast('Tüm oyunlar kalıcı olarak silindi.'); render(); } return; }
    if(e.target.closest('[data-reset-demo-games]')){ if(confirm('Örnek oyunları geri yüklemek istiyor musun?')){ restoreDemoGames(); toast('Örnek oyunlar geri yüklendi.'); render(); } return; }
    const delEvent=e.target.closest('[data-delete-event]'); if(delEvent){ const rows=loadEvents(); rows.splice(Number(delEvent.dataset.deleteEvent),1); saveEvents(rows); toast('Yayın silindi.'); render(); return; }
    const delNote=e.target.closest('[data-delete-note]'); if(delNote){ const rows=loadNotes(); rows.splice(Number(delNote.dataset.deleteNote),1); saveNotes(rows); toast('Not silindi.'); render(); return; }
    if(e.target.closest('[data-action="maintenance-off"]')){ const m=loadMaintenance(); saveMaintenance({...m, enabled:false}); toast('Bakım modu kapatıldı.'); render(); return; }
    if(e.target.closest('[data-action="logout"]')){ signOut(); toast('Çıkış yapıldı.'); setRoute('/ana-sayfa'); return; }
    if(e.target.closest('[data-action="hard-refresh"]')) location.reload();
  });
  document.body.addEventListener('submit', e=>{
    const search=e.target.closest('[data-search-form]'); if(search){ e.preventDefault(); const fd=new FormData(search); const qs=new URLSearchParams(); for(const key of ['q','status','genre','series','tag']){ const val=String(fd.get(key)||'').trim(); if(val && val!=='Tümü') qs.set(key,val); } setRoute('/oyun-arsivi'+(qs.toString()?('?'+qs.toString()):'')); return; }
    const login=e.target.closest('[data-login-form]'); if(login){ e.preventDefault(); const fd=new FormData(login); const email=String(fd.get('email')||'').trim().toLowerCase(); const password=String(fd.get('password')||''); let users=loadUsers(); let user=users.find(u=>String(u.email).toLowerCase()===email); if(!user && isAdminEmail(email)){ user={id:'user-'+Date.now(),email,displayName:'Hayatımız Oyun Admin',password,role:'owner',createdAt:new Date().toISOString()}; users.push(user); saveUsers(users); } if(!user || String(user.password||'')!==password){ toast('E-posta veya şifre hatalı. Kayıt olmayı dene.'); return; } localStorage.setItem(STORAGE.session, JSON.stringify({email:user.email,displayName:user.displayName,role:isAdminEmail(user.email)?'owner':(user.role||'user')})); toast('Giriş başarılı.'); setRoute(isAdminEmail(user.email)?'/yonetim':'/ana-sayfa'); return; }
    const register=e.target.closest('[data-register-form]'); if(register){ e.preventDefault(); const fd=new FormData(register); const email=String(fd.get('email')||'').trim().toLowerCase(); const displayName=String(fd.get('displayName')||'').trim(); const password=String(fd.get('password')||''); if(password.length<3){ toast('Şifre en az 3 karakter olsun.'); return; } let users=loadUsers().filter(u=>String(u.email).toLowerCase()!==email); const role=isAdminEmail(email)?'owner':'user'; const user={id:'user-'+Date.now(),email,displayName,password,role,createdAt:new Date().toISOString()}; users.push(user); saveUsers(users); localStorage.setItem(STORAGE.session, JSON.stringify({email:user.email,displayName:user.displayName,role:user.role})); toast('Kayıt oluşturuldu.'); setRoute(role==='owner'?'/yonetim':'/ana-sayfa'); return; }
    const gf=e.target.closest('[data-game-form]'); if(gf){ e.preventDefault(); const fd=new FormData(gf); const rows=loadGames(); const title=fd.get('title'); rows.unshift(normalizeGame({id:slugify(title)+'-'+Date.now(),title,status:fd.get('status'),genre:fd.get('genre'),seriesName:fd.get('seriesName'),cover:fd.get('cover')||'/assets/hayatimiz-kapak.png',releaseDate:fd.get('releaseDate'),description:fd.get('description'),youtubePlaylistUrl:fd.get('youtubePlaylistUrl'),tags:fd.get('tags'),episodeCount:fd.get('episodeCount')},0)); saveGames(rows); toast('Oyun kaydedildi.'); setRoute('/oyun-arsivi'); return; }
    const ef=e.target.closest('[data-event-form]'); if(ef){ e.preventDefault(); const fd=new FormData(ef); const rows=loadEvents(); rows.unshift({id:'event-'+Date.now(),title:fd.get('title'),date:fd.get('date'),time:fd.get('time'),videoUrl:fd.get('videoUrl'),note:fd.get('note')}); saveEvents(rows); toast('Yayın kaydedildi.'); render(); return; }
    const nf=e.target.closest('[data-note-form]'); if(nf){ e.preventDefault(); const fd=new FormData(nf); const rows=loadNotes(); rows.unshift({id:'note-'+Date.now(),version:fd.get('version'),status:fd.get('status'),title:fd.get('title'),summary:fd.get('summary')}); saveNotes(rows); toast('Güncelleme notu kaydedildi.'); render(); return; }
    const mf=e.target.closest('[data-maint-form]'); if(mf){ e.preventDefault(); const fd=new FormData(mf); saveMaintenance({enabled:fd.get('enabled')==='true',percent:Number(fd.get('percent')||0),message:fd.get('message'),eta:fd.get('eta'),adminBypass:true}); toast('Bakım modu kaydedildi.'); render(); return; }
  });
}
function render(){ const root=document.getElementById('root'); if(!root) return; root.innerHTML=pageHtml(); document.title='Hayatımız Oyun - '+VERSION+' FIX'; }
window.addEventListener('popstate', render);
window.addEventListener('error', ev=>{ console.error('v2.0.4 fix hata:', ev.message); const root=document.getElementById('root'); if(root && (root.textContent||'').trim().length<40) root.innerHTML=home(); });
document.addEventListener('DOMContentLoaded', ()=>{ bind(); render(); setTimeout(()=>{ const r=document.getElementById('root'); if(!r || (r.textContent||'').trim().length<40) render(); }, 300); });
window.HAYATIMIZ_OYUN_VERSION = VERSION;
window.HAYATIMIZ_OYUN_FIX = FIX_NAME;
