import './styles.css';

const VERSION = 'v2.1.4 Otomatik Uygulama Merkezi';
const STAFF_ROLES = ['kurucu', 'yonetici', 'moderator', 'editor'];
const OWNER_ROLES = ['kurucu', 'yonetici'];
const ROLE_LABELS = { kurucu:'Kurucu', yonetici:'Yönetici', moderator:'Moderatör', editor:'Editör', user:'Kullanıcı', banned:'Banlı' };
const ROLE_OPTIONS = ['kurucu','yonetici','moderator','editor','user'];
const AUTH_SESSION_KEY = 'hayatimiz_session_v214';
const MAINTENANCE_KEY = 'hayatimiz_maintenance_cache_v214';
const ADMIN_TAB_KEY = 'hayatimiz_admin_tab_v214';
const FEATURE_CACHE_KEY = 'hayatimiz_features_v214';

const FEATURE_CATALOG = [
  {
    key:'admin_games_add_button',
    title:'Oyunlar sekmesine Oyun Ekle butonu ekle',
    group:'Siteye Gelmesi Gerekenler',
    target:'Yönetim Paneli > Oyunlar',
    description:'Uygula deyince Oyunlar sekmesine Oyun Ekle butonu ve Supabase games kayıt formu gelir.',
    next:'Oyun kapağı yükleme sistemini Supabase Storage ile bağla'
  },
  {
    key:'update_notes_editor',
    title:'Güncelleme notu editörünü Supabase site_update_notes tablosuna bağla',
    group:'Siteye Gelmesi Gerekenler',
    target:'Yönetim Paneli > Güncelleme Notları',
    description:'Güncelleme notlarını panelden yazma/dışa aktarma altyapısını aktif eder.',
    next:'Güncelleme notlarına sürüm filtresi ve arama ekle'
  },
  {
    key:'profile_photo_upload',
    title:'Profil fotoğrafı yükleme alanı ekle',
    group:'Siteye Gelmesi Gerekenler',
    target:'Profilim',
    description:'Profil bölümünde fotoğraf yükleme alanını görünür yapar. Storage bağlantısı sonraki modüldedir.',
    next:'Profil fotoğrafını profile-photos bucket içine yükle'
  },
  {
    key:'missing_cover_warning',
    title:'Oyun kartında eksik kapak sarı uyarısını otomatik göster',
    group:'Gözden Kaçanlar',
    target:'Oyun kartları',
    description:'Kapak görseli olmayan oyunlara admin tarafında sarı uyarı gösterir.',
    next:'Eksik kapakları RAWG kapağıyla eşleştir'
  }
];

const DEFAULT_GAMES = [
  { id:'local-1', title:'Resident Evil 4 Remake', genre:'Korku / Aksiyon', status:'Devam Ediyor', eps:14, score:9.2, cover:'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=900&auto=format&fit=crop' },
  { id:'local-2', title:'Alan Wake 2', genre:'Korku / Hikaye', status:'Devam Ediyor', eps:8, score:9.1, cover:'https://images.unsplash.com/photo-1500673922987-e212871fec22?q=80&w=900&auto=format&fit=crop' },
  { id:'local-3', title:'The Last of Us', genre:'Hikaye Odaklı', status:'Tamamlandı', eps:11, score:9.4, cover:'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=900&auto=format&fit=crop' },
  { id:'local-4', title:'God of War', genre:'Aksiyon', status:'Popüler', eps:18, score:9.5, cover:'https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=900&auto=format&fit=crop' },
  { id:'local-5', title:'Silent Hill 2', genre:'Korku', status:'Yakında', eps:0, score:9.0, cover:'' }
];

const state = {
  page: 'Ana Sayfa',
  adminPage: localStorage.getItem(ADMIN_TAB_KEY) || 'Genel Bakış',
  query: '',
  session: safeParse(localStorage.getItem(AUTH_SESSION_KEY), null),
  maintenance: safeParse(localStorage.getItem(MAINTENANCE_KEY), { enabled:false, message:'Hayatımız Oyun kısa süreli bakımda.' }),
  features: normalizeFeatureMap(safeParse(localStorage.getItem(FEATURE_CACHE_KEY), {})),
  users: [],
  notes: [],
  planner: defaultPlanner(),
  toast: '',
  authMode: null,
  loading: false,
  error: '',
  runtimeLoaded: false,
  showGameForm: false,
  games: DEFAULT_GAMES,
  updates: [
    'v2.1.4: Otomatik Uygulama Merkezi eklendi; hazır özellikler panelden Siteye Uygula ile aktif edilebilir.',
    'v2.1.4: Oyunlar sekmesine Oyun Ekle butonu artık özellik planından uygulanınca görünür olur.',
    'v2.1.4: Oyun ekleme formu Supabase games tablosuna bağlandı.',
    'v2.1.4: Kurulum notları Supabase > GitHub > Vercel sırasına göre madde madde güncellendi.'
  ]
};

function defaultPlanner(){
  return [
    { id:'p1', group:'Eklenen Özellikler', text:'Kullanıcı ana sayfasından teknik istatistikleri kaldır', status:'tamam' },
    { id:'p2', group:'Eklenen Özellikler', text:'Profil sekmesi ekle', status:'tamam' },
    { id:'p3', group:'Siteye Gelmesi Gerekenler', text:'Oyunlar sekmesine Oyun Ekle butonu ekle', status:'plan', featureKey:'admin_games_add_button' },
    { id:'p4', group:'Siteye Gelmesi Gerekenler', text:'Güncelleme notu editörünü Supabase site_update_notes tablosuna bağla', status:'plan', featureKey:'update_notes_editor' },
    { id:'p5', group:'Gözden Kaçanlar', text:'Oyun kartında eksik kapak sarı uyarısını otomatik göster', status:'plan', featureKey:'missing_cover_warning' },
    { id:'p6', group:'Adminin Önerileri', text:'Benim Notlarım alanından eksik/hata girişi ekle', status:'kontrol' }
  ];
}
const rotatingTasks = [
  'Oyun kapağı yükleme sistemini Supabase Storage ile bağla',
  'Profil fotoğrafını profile-photos bucket içine yükle',
  'Oyun düzenleme ve silme formlarını gerçek tabloya bağla',
  'Güncelleme notlarına sürüm filtresi ve arama ekle',
  'Yayın takvimine bölüm ekleme formu ekle',
  'Eksik kapakları RAWG kapağıyla eşleştir',
  'Otomatik YouTube çekme işlerini zamanlanmış cron yapısına bağla'
];
let rotateIndex = Number(localStorage.getItem('hayatimiz_task_rotate_v214') || '0');

function safeParse(raw, fallback){ try { return raw ? JSON.parse(raw) : fallback; } catch { return fallback; } }
function $(sel){ return document.querySelector(sel); }
function html(strings, ...values){ return strings.map((s,i)=>s + (values[i] ?? '')).join(''); }
function esc(value){ return String(value ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch])); }
function normalizeFeatureMap(input){
  const map = {};
  FEATURE_CATALOG.forEach(f=>{ map[f.key] = Boolean(input?.[f.key]); });
  return map;
}
function featureEnabled(key){ return Boolean(state.features?.[key]); }
function persistFeatures(){ localStorage.setItem(FEATURE_CACHE_KEY, JSON.stringify(state.features)); }
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
function isStaff(){ return STAFF_ROLES.includes(normalizeRole(state.session?.role)); }
function isOwner(){ return OWNER_ROLES.includes(normalizeRole(state.session?.role)); }
function displayRole(role){ return ROLE_LABELS[normalizeRole(role)] || 'Kullanıcı'; }
function saveSession(session){ state.session = session; if(session) localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session)); else localStorage.removeItem(AUTH_SESSION_KEY); }
function setToast(message){ state.toast = message; render(); window.clearTimeout(window.__hyToast); window.__hyToast = window.setTimeout(()=>{ state.toast=''; render(); }, 3600); }
async function api(action, payload = {}){
  const res = await fetch(`/api?action=${encodeURIComponent(action)}&t=${Date.now()}`, {
    method:'POST', headers:{'Content-Type':'application/json','Cache-Control':'no-store'}, body: JSON.stringify(payload)
  });
  const data = await res.json().catch(()=>({}));
  if(!res.ok || data.ok === false) throw new Error(data.error || 'Sunucu isteği başarısız.');
  return data;
}
async function loadRuntime(){
  try{
    const data = await api('settings-get', {});
    state.runtimeLoaded = true;
    state.maintenance = data.maintenance || { enabled:false, message:'Hayatımız Oyun kısa süreli bakımda.' };
    localStorage.setItem(MAINTENANCE_KEY, JSON.stringify(state.maintenance));
  }catch(e){ state.runtimeLoaded = false; }
  try{
    const data = await api('features-list', {});
    if(data.features){ state.features = normalizeFeatureMap(data.features); persistFeatures(); }
  }catch(e){}
  try{
    const data = await api('games-list', {});
    if(Array.isArray(data.games) && data.games.length) state.games = data.games.map(mapGame);
  }catch(e){}
  if(state.session?.email){
    try{
      const data = await api('session-refresh', { email: state.session.email });
      if(data.user){ saveSession({ ...state.session, ...data.user, role: normalizeRole(data.user.role), adminToken:data.adminToken || state.session.adminToken || null }); }
    }catch(e){}
  }
  if(isStaff()) await loadPlanner(false);
  render();
}
function mapGame(game){
  return {
    id: game.id || `game-${Date.now()}`,
    title: game.title || game.name || 'İsimsiz Oyun',
    genre: game.genre || game.category || 'Genel',
    status: game.status || 'Devam Ediyor',
    eps: Number(game.episode_count ?? game.eps ?? 0),
    score: Number(game.score ?? 0),
    cover: game.cover_url || game.cover || ''
  };
}
async function loadUsers(){
  if(!isOwner()) return;
  try { const data = await api('users-list', { adminToken: state.session?.adminToken }); state.users = data.users || []; }
  catch(e){ setToast('Kullanıcı listesi alınamadı: ' + e.message); }
  render();
}
async function loadPlanner(doRender = true){
  try{
    const data = await api('planner-list', { adminToken: state.session?.adminToken });
    if(Array.isArray(data.planner) && data.planner.length) state.planner = mergePlannerWithCatalog(data.planner);
    if(Array.isArray(data.notes)) state.notes = data.notes;
  }catch(e){}
  if(doRender) render();
}
function mergePlannerWithCatalog(rows){
  const mapped = rows.map(p => ({ ...p, featureKey: p.feature_key || p.featureKey || FEATURE_CATALOG.find(f => f.title === p.text)?.key || null }));
  FEATURE_CATALOG.forEach(f => {
    if(!mapped.some(p => p.featureKey === f.key || p.text === f.title)) mapped.push({ id:`local-${f.key}`, group:f.group, text:f.title, status:featureEnabled(f.key) ? 'tamam' : 'plan', featureKey:f.key });
  });
  return mapped;
}
function navigate(page){ state.page = page; render(); }
function adminNavigate(page){ state.page = 'Yönetim Paneli'; state.adminPage = page; localStorage.setItem(ADMIN_TAB_KEY, page); if(page === 'Kullanıcı Yetkileri') loadUsers(); if(page === 'Özellik Planı' || page === 'Uygulama Merkezi') loadPlanner(false); render(); }

function topbar(){
  const role = normalizeRole(state.session?.role);
  return html`<header class="topbar">
    <button class="brand cleanBtn" data-page="Ana Sayfa"><div class="mark">🎮</div><div><b>Hayatımız Oyun</b><span>${VERSION}</span></div></button>
    <label class="search">🔎 <input id="searchInput" value="${esc(state.query)}" placeholder="Oyun, kategori veya bölüm ara" /></label>
    <div class="topActions">
      ${state.maintenance?.enabled ? '<span class="pill banned">Bakım açık</span>' : '<span class="pill">Yayında</span>'}
      ${state.session ? `<button class="btn" data-page="Profilim">Profil</button><span class="pill ${role}">${esc(displayRole(role))}</span><button class="btn" data-action="logout">Çıkış</button>` : `<button class="btn" data-action="open-login">Giriş</button><button class="btn primary" data-action="open-register">Kayıt</button>`}
      ${isStaff() ? '<button class="btn primary" data-admin="Genel Bakış">Yönetim Paneli</button>' : ''}
    </div>
  </header>`;
}
function categoryRail(){
  if(!state.session || (state.maintenance?.enabled && !isStaff())) return '';
  const cats = ['Ana Sayfa','Popüler','Tamamlanan','Devam Eden','Yakında','Korku','Aksiyon','Hikaye Odaklı','Takvim','Koleksiyonlar','Profilim'];
  return `<nav class="category">${cats.map(c=>`<button class="tab ${state.page===c?'active':''}" data-page="${esc(c)}">${esc(c)}</button>`).join('')}</nav>`;
}
function maintenancePage(){
  return html`<section class="maintenanceWrap"><div class="pulseOrb"></div><div class="maintenanceCard"><div class="loader"></div><span class="eyebrow">Bakım Modu</span><h1>Hayatımız Oyun kısa süreli bakımda.</h1><p>${esc(state.maintenance?.message || 'Site kısa süreli bakımda. Lütfen daha sonra tekrar dene.')}</p><div class="authButtons"><button class="btn primary" data-action="open-login">Giriş Yap</button>${isStaff()?'<button class="btn" data-admin="Bakım Modu">Yönetim Paneli</button>':''}</div></div></section>`;
}
function authLanding(){
  return html`<section class="authWrap"><div class="authCard"><span class="eyebrow">Oyun arşivi • üyelik sistemi</span><h1>Hayatımız Oyun arşivine giriş yap.</h1><p>Giriş ve kayıt normal kullanıcı hesabıyla yapılır. Kurucu, yönetici, moderatör ve editör yetkileri Supabase tablosundaki rol alanından otomatik okunur.</p><div class="authButtons"><button class="btn primary" data-action="open-login">Giriş Yap</button><button class="btn" data-action="open-register">Kayıt Ol</button></div><div class="note" style="margin-top:22px">Ayrı yetkili/admin girişi yoktur. Şifre veya gizli key ekranda yazmaz.</div></div></section>`;
}
function hero(){
  return html`<section class="hero userHero"><div><span class="eyebrow">Kullanıcı ana sayfası</span><h1>Oyun arşivi, yayın takvimi ve koleksiyonlar.</h1><p>Kullanıcı tarafında sadece izleme/arşiv alanları görünür. Yönetim, Supabase, teknik not ve plan panelleri sadece yetkili hesaplara görünür.</p><div class="heroActions"><button class="btn primary" data-page="Popüler">Popüler Oyunlar</button><button class="btn" data-page="Takvim">Yayın Takvimi</button><button class="btn" data-page="Koleksiyonlar">Koleksiyonlar</button><button class="btn" data-page="Profilim">Profilim</button></div></div></section>`;
}
function publicStats(){ return `<section class="grid stats"><div class="card"><b>Devam Eden</b><h3>${state.games.filter(g=>g.status==='Devam Ediyor').length}</h3><span class="muted">aktif seri</span></div><div class="card"><b>Tamamlanan</b><h3>${state.games.filter(g=>g.status==='Tamamlandı').length}</h3><span class="muted">arşivde</span></div><div class="card"><b>Yakında</b><h3>${state.games.filter(g=>g.status==='Yakında').length}</h3><span class="muted">planlanan</span></div></section>`; }
function coverFor(g){ return g.cover || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=900&auto=format&fit=crop'; }
function gameGrid(){
  let games = state.games.filter(g => !state.query || JSON.stringify(g).toLowerCase().includes(state.query.toLowerCase()));
  if(state.page === 'Popüler') games = games.filter(g=>g.status==='Popüler' || g.score >= 9.2);
  if(state.page === 'Tamamlanan') games = games.filter(g=>g.status==='Tamamlandı');
  if(state.page === 'Devam Eden') games = games.filter(g=>g.status==='Devam Ediyor');
  if(state.page === 'Yakında') games = games.filter(g=>g.status==='Yakında');
  if(['Korku','Aksiyon','Hikaye Odaklı'].includes(state.page)) games = games.filter(g=>g.genre.includes(state.page.replace('Hikaye Odaklı','Hikaye')));
  return `<section class="games">${games.map(g=>`<article class="game"><div class="coverWrap"><img src="${esc(coverFor(g))}" alt="${esc(g.title)}">${featureEnabled('missing_cover_warning') && !g.cover ? '<span class="coverWarn">Kapak eksik</span>' : ''}</div><div><span class="pill">${esc(g.status)}</span><h3>${esc(g.title)}</h3><p>${esc(g.genre)} • ${g.eps} bölüm</p><b>⭐ ${g.score}</b></div></article>`).join('') || '<div class="card wide">Oyun bulunamadı.</div>'}</section>`;
}
function calendarPage(){ return `<section class="card wide"><h2>Yayın Takvimi</h2><p class="muted">Bu alan kullanıcı tarafında kalır. Teknik plan ve admin notları gösterilmez.</p><div class="timeline"><p><b>Bugün:</b> Alan Wake 2 bölüm kontrolü</p><p><b>Yarın:</b> Resident Evil 4 yeni bölüm</p><p><b>Hafta sonu:</b> Koleksiyon düzenleme</p></div></section>`; }
function collectionsPage(){ return `<section class="card wide"><h2>Koleksiyonlar</h2><p>Favori seriler, devam edenler ve tamamlanan oyun listeleri burada görünür.</p><div class="grid"><div class="card soft"><b>Korku Koleksiyonu</b><span>Alan Wake, Silent Hill, Resident Evil</span></div><div class="card soft"><b>Hikaye Odaklı</b><span>The Last of Us, God of War</span></div></div></section>`; }
function profilePage(){
  if(!state.session) return authLanding();
  const role = normalizeRole(state.session.role);
  return html`<section class="profileGrid"><div class="card profileCard"><div class="avatar">${esc((state.session.full_name || state.session.email || 'H')[0]).toUpperCase()}</div><h2>Profilim</h2><p class="muted">Hesap bilgileri ve yetki durumu</p><span class="pill ${role}">${esc(displayRole(role))}</span><div class="profileInfo"><p><b>Ad Soyad:</b> ${esc(state.session.full_name || 'Belirtilmedi')}</p><p><b>E-posta:</b> ${esc(state.session.email)}</p><p><b>Durum:</b> ${normalizeRole(state.session.role)==='banned' || state.session.is_active === false ? 'Banlı' : 'Aktif'}</p></div>${featureEnabled('profile_photo_upload') ? '<button class="btn" data-toast="Profil fotoğrafı alanı aktif. Storage bağlantısı sonraki maddede tamamlanacak.">Profil Fotoğrafı Yükle</button>' : ''}</div><form class="card profileEdit" id="profileForm"><h3>Profil Bilgilerini Güncelle</h3><label class="field">Ad Soyad<input name="fullName" value="${esc(state.session.full_name || '')}" /></label><button class="btn primary" type="submit">Profili Kaydet</button><p class="note">Rol değişikliği sadece kurucu/yönetici tarafından yönetim panelinden yapılır.</p></form></section>`;
}
function publicPage(){
  if(state.maintenance?.enabled && !isStaff()) return maintenancePage();
  if(!state.session) return authLanding();
  if(state.page === 'Takvim') return calendarPage();
  if(state.page === 'Koleksiyonlar') return collectionsPage();
  if(state.page === 'Profilim') return profilePage();
  return hero() + publicStats() + gameGrid();
}
function adminPanel(){
  if(!isStaff()) return `<section class="card"><h2>Yetki gerekiyor</h2><p>Yönetim paneli sadece kurucu, yönetici, moderatör ve editör hesaplarına görünür.</p></section>`;
  const pages = ['Genel Bakış','Oyunlar','Profil','Kullanıcı Yetkileri','Özellik Planı','Uygulama Merkezi','Güncelleme Notları','Bakım Modu','API/ENV Durumu','Ayarlar'];
  return `<section class="adminLayout"><aside class="sidebar"><h3>Yönetim Paneli</h3><span>${VERSION}</span>${pages.map(p=>`<button class="sideBtn ${state.adminPage===p?'active':''}" data-admin="${esc(p)}">${icon(p)} ${esc(p)}</button>`).join('')}</aside><div class="adminContent"><div class="adminTop"><div><h1>${esc(state.adminPage)}</h1><p>${adminSubtitle(state.adminPage)}</p></div><span class="pill ${state.maintenance?.enabled?'banned':'green'}">${state.maintenance?.enabled?'Bakım açık':'Bakım kapalı'}</span></div>${adminBody()}</div></section>`;
}
function icon(p){ return ({'Genel Bakış':'🛡️','Oyunlar':'🎮','Profil':'👤','Kullanıcı Yetkileri':'👥','Özellik Planı':'✨','Uygulama Merkezi':'⚙️','Güncelleme Notları':'📝','Bakım Modu':'🔌','API/ENV Durumu':'🗄️','Ayarlar':'⚙️'}[p] || '•'); }
function adminSubtitle(page){
  return ({
    'Genel Bakış':'Teknik kartlar, veri durumu ve yönetim özetleri burada tutulur.',
    'Özellik Planı':'Hazır özellikleri Siteye Uygula ile aktif et; tamamlanan işten sonra yeni madde eklenir.',
    'Uygulama Merkezi':'Panelden açılıp kapanabilen hazır modüllerin durum merkezi.',
    'Kullanıcı Yetkileri':'Kurucu/yönetici hesapları rol verme, banlama ve silme yapabilir.',
    'Profil':'Yetkili hesabın profil bilgileri.',
    'Oyunlar':'Oyun Ekle butonu özellik planından uygulandıktan sonra görünür.',
    'Bakım Modu':'Global bakım kilidi giriş yapmayanlara ve normal kullanıcılara uygulanır.'
  }[page] || 'Panel içi butonlar sayfa yenilemeden çalışır.');
}
function adminBody(){
  if(state.adminPage === 'Kullanıcı Yetkileri') return usersPanel();
  if(state.adminPage === 'Özellik Planı') return featurePlan();
  if(state.adminPage === 'Uygulama Merkezi') return applicationCenter();
  if(state.adminPage === 'Bakım Modu') return maintenanceAdmin();
  if(state.adminPage === 'Güncelleme Notları') return updateNotes();
  if(state.adminPage === 'Profil') return profilePage();
  if(state.adminPage === 'Oyunlar') return gamesAdmin();
  if(state.adminPage === 'API/ENV Durumu') return apiStatus();
  if(state.adminPage === 'Ayarlar') return settingsPanel();
  return overviewAdmin();
}
function overviewAdmin(){
  const activeFeatures = Object.values(state.features).filter(Boolean).length;
  return `<section class="grid stats adminStats"><div class="card"><b>Oyun</b><h3>${state.games.length}</h3><span class="muted">arşiv verisi</span></div><div class="card"><b>Aktif Özellik</b><h3>${activeFeatures}</h3><span class="muted">uygulandı</span></div><div class="card"><b>Güncelleme</b><h3>${state.updates.length}</h3><span class="muted">not</span></div><div class="card"><b>Veri durumu</b><h3>${state.runtimeLoaded?'Bağlandı':'Local'}</h3><span class="muted">Supabase/API</span></div></section><section class="card wide"><h2>Otomatik Uygulama Merkezi hazır</h2><p>Özellik Planı içinde hazır özelliklerde <b>Siteye Uygula</b> butonuna basınca modül Supabase site_features tablosunda aktifleşir ve yönetim panelindeki ilgili buton görünür olur.</p><button class="btn primary" data-admin="Özellik Planı">Özellik Planını Aç</button><button class="btn" data-admin="Uygulama Merkezi">Uygulama Merkezi</button><button class="btn" data-admin="Oyunlar">Oyunlar Sekmesi</button></section>`;
}
function gamesAdmin(){
  const addEnabled = featureEnabled('admin_games_add_button');
  return `<section class="card wide"><div class="sectionHead"><div><h2>Oyun Yönetimi</h2><p class="muted">Oyun ekleme formu özellik planından aktif edilir ve Supabase games tablosuna kayıt gönderir.</p></div>${addEnabled ? '<button class="btn primary" data-action="toggle-game-form">+ Oyun Ekle</button>' : '<button class="btn" data-admin="Özellik Planı">Oyun Ekle özelliğini uygula</button>'}</div>${!addEnabled?'<div class="note">Oyun Ekle butonu henüz aktif değil. Yönetim Paneli > Özellik Planı içinde “Oyunlar sekmesine Oyun Ekle butonu ekle” maddesine Siteye Uygula de.</div>':''}${addEnabled && state.showGameForm ? gameAddForm() : ''}${gameGrid()}</section>`;
}
function gameAddForm(){
  return `<form class="card soft gameForm" id="gameAddForm"><h3>Yeni Oyun Ekle</h3><div class="formGrid"><label class="field">Oyun adı<input name="title" required placeholder="Örn: Red Dead Redemption 2" /></label><label class="field">Kategori / Tür<input name="genre" required placeholder="Aksiyon / Hikaye" /></label><label class="field">Durum<select name="status"><option>Devam Ediyor</option><option>Tamamlandı</option><option>Popüler</option><option>Yakında</option></select></label><label class="field">Bölüm<input name="eps" type="number" min="0" value="0" /></label><label class="field">Puan<input name="score" type="number" min="0" max="10" step="0.1" value="8.5" /></label><label class="field">Kapak URL<input name="cover" placeholder="https://..." /></label></div><button class="btn primary" type="submit">Supabase games tablosuna kaydet</button><button class="btn" type="button" data-action="toggle-game-form">Kapat</button></form>`;
}
function apiStatus(){ return `<section class="grid adminGrid"><div class="card"><h3>Vercel ENV</h3><p>Gizli keyler ekranda gösterilmez. Sadece bağlantı durumu izlenir.</p><span class="pill ${state.runtimeLoaded?'green':'banned'}">${state.runtimeLoaded?'API bağlı':'Local/Fallback'}</span></div><div class="card"><h3>Supabase Tabloları</h3><p>site_users, games, site_features, site_admin_planner, site_admin_notes, site_runtime_config, site_update_notes.</p></div><div class="card"><h3>Güvenlik</h3><p>Key/şifre GitHub dosyalarına yazılmaz; sadece Vercel Environment Variables içinde kalır.</p></div></section>`; }
function settingsPanel(){ return `<section class="card wide"><h2>Ayarlar</h2><p>Kurulum notları ZIP içindeki KURULUM-KOMUTLARI.txt dosyasındadır. Önce Supabase, sonra GitHub, sonra Vercel sırası kullanılır.</p><button class="btn" data-action="clear-local">Eski local kayıtları temizle</button></section>`; }
function usersPanel(){
  if(!isOwner()) return `<section class="card"><h2>Kurucu/Yönetici yetkisi gerekir</h2><p>Rol verme, banlama ve silme sadece kurucu veya yönetici içindir.</p></section>`;
  const rows = state.users.map(u=>`<tr><td><b>${esc(u.full_name || '-')}</b><br><span class="muted">${esc(u.email)}</span></td><td><span class="pill ${normalizeRole(u.role)}">${esc(displayRole(u.role))}</span></td><td>${u.is_active===false?'Pasif/Banlı':'Aktif'}</td><td><div class="roleActions">${ROLE_OPTIONS.map(r=>`<button class="miniBtn" data-user-role="${esc(u.id)}|${r}">${esc(displayRole(r))}</button>`).join('')}<button class="miniBtn danger" data-user-ban="${esc(u.id)}">Ban</button><button class="miniBtn danger" data-user-delete="${esc(u.id)}">Sil</button></div></td></tr>`).join('');
  return `<section class="card wide"><div class="sectionHead"><h2>Kullanıcı Yetkileri</h2><button class="btn" data-action="refresh-users">Yenile</button></div><p class="muted">Kurucu, yönetici, moderatör, editör ve kullanıcı rolleri normal girişten okunur.</p><div class="tableWrap"><table class="roleTable"><thead><tr><th>Kullanıcı</th><th>Rol</th><th>Durum</th><th>İşlemler</th></tr></thead><tbody>${rows || '<tr><td colspan="4">Kullanıcı yok veya Supabase bağlantısı bekleniyor.</td></tr>'}</tbody></table></div></section>`;
}
function maintenanceAdmin(){
  return `<section class="card wide"><h2>Bakım Modu</h2><p>Bakım açıkken giriş yapmayanlar ve normal kullanıcılar bakım ekranını görür. Yetkili hesaplar yönetim panelini kullanır.</p><label class="field">Bakım mesajı<input id="maintenanceMessage" value="${esc(state.maintenance?.message || '')}" /></label><button class="btn ${state.maintenance?.enabled?'danger':'primary'}" data-action="toggle-maintenance">${state.maintenance?.enabled?'Bakımı Kapat':'Bakımı Aç'}</button></section>`;
}
function featurePlan(){
  const groups = ['Eklenen Özellikler','Siteye Gelmesi Gerekenler','Gözden Kaçanlar','Adminin Önerileri'];
  return `<section class="plannerWrap"><div class="grid adminGrid">${groups.map(group=>`<div class="card"><h3>${esc(group)}</h3>${state.planner.filter(p=>p.group===group).map(planItem).join('') || '<p class="muted">Madde yok.</p>'}<button class="btn" data-plan-complete="${esc(group)}">Tamamla + Yeni Madde</button></div>`).join('')}</div><div class="card wide notesCard"><h3>Benim Notlarım</h3><p class="muted">Eksik, hata ve fikirlerini buraya yaz. Supabase site_admin_notes tablosuna kaydedilir.</p><form id="adminNoteForm" class="noteForm"><textarea name="note" placeholder="Örn: Oyun düzenleme butonu eksik, mobilde buton taşmış..."></textarea><button class="btn primary" type="submit">Notu Kaydet</button></form><div class="noteList">${state.notes.map(n=>`<div class="noteLine">📝 ${esc(n.note || n.content || n.title || '')}</div>`).join('') || '<span class="muted">Henüz not yok.</span>'}</div></div></section>`;
}
function planItem(p){
  const feature = FEATURE_CATALOG.find(f => f.key === p.featureKey);
  const enabled = feature ? featureEnabled(feature.key) : p.status === 'tamam';
  return `<div class="planItem ${enabled?'done':''}"><span>${enabled?'✅':'⬜'}</span><div><b>${esc(p.text)}</b>${feature?`<small>${esc(feature.target)}</small>`:''}<div class="planActions">${feature && !enabled ? `<button class="miniBtn primary" data-feature-apply="${esc(feature.key)}">Siteye Uygula</button>` : ''}${feature && enabled ? '<span class="pill green">Sitede aktif</span>' : ''}</div></div></div>`;
}
function applicationCenter(){
  return `<section class="grid adminGrid featureCenter">${FEATURE_CATALOG.map(f=>`<div class="card"><span class="pill ${featureEnabled(f.key)?'green':'banned'}">${featureEnabled(f.key)?'Aktif':'Bekliyor'}</span><h3>${esc(f.title)}</h3><p>${esc(f.description)}</p><p class="muted"><b>Hedef:</b> ${esc(f.target)}</p>${featureEnabled(f.key)?`<button class="btn" data-admin="${f.target.includes('Oyunlar')?'Oyunlar':f.target.includes('Güncelleme')?'Güncelleme Notları':'Özellik Planı'}">Aç</button>`:`<button class="btn primary" data-feature-apply="${esc(f.key)}">Siteye Uygula</button>`}</div>`).join('')}</section>`;
}
function updateNotes(){
  const editor = featureEnabled('update_notes_editor') ? '<div class="note"><b>Güncelleme notu editörü aktif.</b> Kaydetme altyapısı hazır; detaylı editör sonraki maddede genişletilecek.</div>' : '<div class="note">Editör henüz aktif değil. Özellik Planı veya Uygulama Merkezi içinden uygula.</div>';
  return `<div class="card wide"><h3>Güncelleme Notları</h3>${editor}${state.updates.map(n=>`<p>✅ ${esc(n)}</p>`).join('')}<button class="btn primary" data-action="download-notes">Güncelleme notlarını indir</button></div>`;
}
function modal(){
  if(!state.authMode) return '';
  const title = state.authMode === 'register' ? 'Kayıt Ol' : 'Giriş Yap';
  return html`<div class="modalOverlay"><form class="modal" id="authForm"><button class="close" type="button" data-action="close-modal">×</button><div class="switch"><button type="button" class="btn ${state.authMode==='login'?'primary':''}" data-action="open-login">Giriş</button><button type="button" class="btn ${state.authMode==='register'?'primary':''}" data-action="open-register">Kayıt</button></div><h2>${title}</h2><p>Ayrı yetkili girişi yok. Kurucu/yönetici/moderatör/editör normal hesapla giriş yapar.</p>${state.authMode==='register'?'<label class="field">Ad Soyad<input name="fullName" autocomplete="name" required /></label>':''}<label class="field">E-posta<input name="email" type="email" autocomplete="email" required /></label><label class="field">Şifre<input name="password" type="password" autocomplete="current-password" required /></label>${state.error?`<div class="alert">${esc(state.error)}</div>`:''}<div class="note">Gizli key veya şifre ekranda gösterilmez.</div><button class="btn primary" type="submit" ${state.loading?'disabled':''}>${state.loading?'İşleniyor...':title}</button></form></div>`;
}
function toast(){ return state.toast ? `<div class="toast"><span>✅</span><b>${esc(state.toast)}</b><button class="miniBtn" data-action="close-toast">Tamam</button></div>` : ''; }
function mainContent(){ if(state.page === 'Yönetim Paneli') return adminPanel(); return publicPage(); }
function render(){
  const root = document.getElementById('root');
  root.dataset.mounted = '1';
  window.clearTimeout(window.__HAYATIMIZ_BOOT_TIMER__);
  root.innerHTML = `<div class="app">${topbar()}${categoryRail()}<main class="page">${mainContent()}</main>${modal()}${toast()}</div>`;
  bind();
}
function bind(){
  const input = $('#searchInput');
  if(input) input.addEventListener('input', e=>{ state.query = e.target.value; render(); });
  document.querySelectorAll('[data-page]').forEach(el=>el.addEventListener('click', e=>{ e.preventDefault(); navigate(el.dataset.page); }));
  document.querySelectorAll('[data-admin]').forEach(el=>el.addEventListener('click', e=>{ e.preventDefault(); adminNavigate(el.dataset.admin); }));
  document.querySelectorAll('[data-toast]').forEach(el=>el.addEventListener('click', e=>{ e.preventDefault(); setToast(el.dataset.toast); }));
  document.querySelectorAll('[data-action]').forEach(el=>el.addEventListener('click', onAction));
  document.querySelectorAll('[data-user-role]').forEach(el=>el.addEventListener('click', onSetRole));
  document.querySelectorAll('[data-user-ban]').forEach(el=>el.addEventListener('click', onBan));
  document.querySelectorAll('[data-user-delete]').forEach(el=>el.addEventListener('click', onDeleteUser));
  document.querySelectorAll('[data-plan-complete]').forEach(el=>el.addEventListener('click', onPlanComplete));
  document.querySelectorAll('[data-feature-apply]').forEach(el=>el.addEventListener('click', onApplyFeature));
  const auth = $('#authForm'); if(auth) auth.addEventListener('submit', onAuthSubmit);
  const profile = $('#profileForm'); if(profile) profile.addEventListener('submit', onProfileSubmit);
  const note = $('#adminNoteForm'); if(note) note.addEventListener('submit', onAdminNoteSubmit);
  const game = $('#gameAddForm'); if(game) game.addEventListener('submit', onGameAddSubmit);
}
async function onAction(e){
  e.preventDefault(); const action = e.currentTarget.dataset.action;
  if(action === 'open-login'){ state.authMode='login'; state.error=''; render(); }
  if(action === 'open-register'){ state.authMode='register'; state.error=''; render(); }
  if(action === 'close-modal'){ state.authMode=null; state.error=''; render(); }
  if(action === 'close-toast'){ state.toast=''; render(); }
  if(action === 'logout'){ saveSession(null); state.page='Ana Sayfa'; setToast('Çıkış yapıldı.'); }
  if(action === 'refresh-users'){ await loadUsers(); }
  if(action === 'toggle-maintenance'){ await toggleMaintenance(); }
  if(action === 'toggle-game-form'){ state.showGameForm = !state.showGameForm; render(); }
  if(action === 'download-notes'){ download('hayatimiz-oyun-guncelleme-notlari.json', JSON.stringify(state.updates, null, 2)); setToast('Güncelleme notları indirildi.'); }
  if(action === 'clear-local'){ localStorage.removeItem(AUTH_SESSION_KEY); localStorage.removeItem(ADMIN_TAB_KEY); localStorage.removeItem(MAINTENANCE_KEY); localStorage.removeItem(FEATURE_CACHE_KEY); setToast('v2.1.4 local kayıtları temizlendi.'); }
}
async function onAuthSubmit(e){
  e.preventDefault(); state.loading=true; state.error=''; render();
  const fd = new FormData(e.currentTarget);
  const payload = { fullName: fd.get('fullName'), email: fd.get('email'), password: fd.get('password') };
  try{
    const data = await api(state.authMode === 'register' ? 'register' : 'login', payload);
    const user = data.user || {};
    saveSession({ ...user, role: normalizeRole(user.role), adminToken: data.adminToken || user.adminToken || null });
    state.authMode = null; state.page = isStaff() ? 'Yönetim Paneli' : 'Ana Sayfa';
    setToast(`${displayRole(state.session?.role)} olarak giriş yapıldı.`);
  }catch(err){ state.error = err.message; }
  state.loading=false; render();
}
async function onProfileSubmit(e){
  e.preventDefault(); const fd = new FormData(e.currentTarget); const fullName = String(fd.get('fullName') || '').trim();
  const old = state.session; saveSession({ ...old, full_name: fullName }); render();
  try{ const data = await api('profile-update', { adminToken: state.session?.adminToken, email: old.email, fullName }); if(data.user) saveSession({ ...state.session, ...data.user }); setToast('Profil güncellendi.'); }
  catch(err){ setToast('Profil local güncellendi; Supabase kaydı başarısız: ' + err.message); }
}
async function toggleMaintenance(){
  const enabled = !state.maintenance?.enabled;
  const msgInput = $('#maintenanceMessage');
  state.maintenance = { enabled, message: msgInput?.value || 'Hayatımız Oyun kısa süreli bakımda. Lütfen daha sonra tekrar dene.' };
  localStorage.setItem(MAINTENANCE_KEY, JSON.stringify(state.maintenance)); render();
  try{ await api('settings-set', { adminToken: state.session?.adminToken, maintenance: state.maintenance }); setToast(enabled?'Bakım modu herkese açıldı.':'Bakım modu kapatıldı.'); }
  catch(e){ setToast('Bakım local değişti; Supabase kaydı başarısız: ' + e.message); }
}
async function onSetRole(e){ e.preventDefault(); const [userId, role] = e.currentTarget.dataset.userRole.split('|'); try{ await api('user-role-set', { adminToken: state.session?.adminToken, userId, role }); setToast(`Rol ${displayRole(role)} yapıldı.`); await loadUsers(); } catch(err){ setToast('Rol verilemedi: ' + err.message); } }
async function onBan(e){ e.preventDefault(); try{ await api('user-ban-toggle', { adminToken: state.session?.adminToken, userId: e.currentTarget.dataset.userBan }); setToast('Ban durumu değiştirildi.'); await loadUsers(); } catch(err){ setToast('Ban işlemi başarısız: ' + err.message); } }
async function onDeleteUser(e){ e.preventDefault(); if(!confirm('Kullanıcı silinsin mi?')) return; try{ await api('user-delete', { adminToken: state.session?.adminToken, userId: e.currentTarget.dataset.userDelete }); setToast('Kullanıcı silindi.'); await loadUsers(); } catch(err){ setToast('Silme başarısız: ' + err.message); } }
async function onPlanComplete(e){
  e.preventDefault(); const group = e.currentTarget.dataset.planComplete;
  const active = state.planner.find(x=>x.group===group && x.status !== 'tamam'); if(active) active.status = 'tamam';
  const nextText = rotatingTasks[rotateIndex % rotatingTasks.length]; rotateIndex += 1; localStorage.setItem('hayatimiz_task_rotate_v214', String(rotateIndex));
  state.planner.push({ id:'local-'+Date.now(), group, text: nextText, status:'plan' });
  render();
  try{ await api('planner-complete-add', { adminToken: state.session?.adminToken, group, completedId: active?.id, nextText }); await loadPlanner(false); setToast(`${group}: tamamlandı ve yeni madde eklendi.`); }
  catch(err){ setToast(`${group}: local tamamlandı, Supabase kaydı sonra denenir.`); }
}
async function onApplyFeature(e){
  e.preventDefault();
  const key = e.currentTarget.dataset.featureApply;
  const feature = FEATURE_CATALOG.find(f => f.key === key);
  if(!feature) return setToast('Özellik bulunamadı.');
  if(!isOwner()) return setToast('Siteye uygulama için kurucu veya yönetici yetkisi gerekir.');
  state.features[key] = true;
  persistFeatures();
  const plannerItem = state.planner.find(p => p.featureKey === key || p.text === feature.title);
  if(plannerItem) plannerItem.status = 'tamam';
  if(!state.planner.some(p => p.text === feature.next)) state.planner.push({ id:'local-'+Date.now(), group:feature.group, text:feature.next, status:'plan' });
  if(key === 'admin_games_add_button'){ state.adminPage = 'Oyunlar'; state.showGameForm = false; }
  render();
  try{
    await api('feature-apply', { adminToken: state.session?.adminToken, key });
    await loadPlanner(false);
    setToast(`${feature.title} siteye uygulandı.`);
  }catch(err){ setToast(`${feature.title} local aktif edildi; Supabase kaydı başarısız: ${err.message}`); }
}
async function onAdminNoteSubmit(e){
  e.preventDefault(); const fd = new FormData(e.currentTarget); const note = String(fd.get('note') || '').trim(); if(!note) return setToast('Not boş olamaz.');
  state.notes.unshift({ note, created_at: new Date().toISOString() }); e.currentTarget.reset(); render();
  try{ await api('admin-note-add', { adminToken: state.session?.adminToken, note }); await loadPlanner(false); setToast('Not kaydedildi.'); }
  catch(err){ setToast('Not local kaydedildi; Supabase kaydı başarısız.'); }
}
async function onGameAddSubmit(e){
  e.preventDefault();
  const fd = new FormData(e.currentTarget);
  const game = {
    title:String(fd.get('title') || '').trim(),
    genre:String(fd.get('genre') || 'Genel').trim(),
    status:String(fd.get('status') || 'Devam Ediyor'),
    eps:Number(fd.get('eps') || 0),
    score:Number(fd.get('score') || 0),
    cover:String(fd.get('cover') || '').trim()
  };
  if(!game.title) return setToast('Oyun adı gerekli.');
  state.games.unshift({ id:'local-'+Date.now(), ...game });
  state.showGameForm = false;
  render();
  try{
    const data = await api('games-add', { adminToken: state.session?.adminToken, game });
    if(data.game){ state.games = state.games.map(g => String(g.id).startsWith('local-') && g.title === game.title ? mapGame(data.game) : g); }
    setToast('Oyun Supabase games tablosuna kaydedildi.');
  }catch(err){ setToast('Oyun local eklendi; Supabase kaydı başarısız: ' + err.message); }
}
function download(filename, content){ const blob = new Blob([content], {type:'application/json;charset=utf-8'}); const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(a.href); }
function showBootError(error){
  const root = document.getElementById('root'); if(!root) return; root.dataset.mounted='1'; window.clearTimeout(window.__HAYATIMIZ_BOOT_TIMER__);
  root.innerHTML = `<section class="bootError"><div class="bootErrorCard"><h1>Site açılırken hata yakalandı.</h1><p>Beyaz ekran yerine hata yakalama ekranı aktif oldu. Bu mesaj çıkarsa ekran görüntüsüyle konsol hatasını gönder.</p><pre>${esc(error?.stack || error?.message || error)}</pre><button class="btn primary" onclick="location.reload()">Sayfayı Yenile</button></div></section>`;
}
window.addEventListener('error', event => showBootError(event.error || event.message));
window.addEventListener('unhandledrejection', event => showBootError(event.reason || 'Bilinmeyen promise hatası'));
try{ render(); loadRuntime(); }catch(error){ showBootError(error); }
