import './styles.css';

const VERSION = 'v2.1.3 Fix 9 Profil + Temiz Kullanıcı Ana Sayfası';
const STAFF_ROLES = ['kurucu', 'yonetici', 'moderator', 'editor'];
const OWNER_ROLES = ['kurucu', 'yonetici'];
const ROLE_LABELS = { kurucu:'Kurucu', yonetici:'Yönetici', moderator:'Moderatör', editor:'Editör', user:'Kullanıcı', banned:'Banlı' };
const ROLE_OPTIONS = ['kurucu','yonetici','moderator','editor','user'];
const AUTH_SESSION_KEY = 'hayatimiz_session_v213_fix9';
const MAINTENANCE_KEY = 'hayatimiz_maintenance_cache_v213_fix9';
const ADMIN_TAB_KEY = 'hayatimiz_admin_tab_fix9';

const state = {
  page: 'Ana Sayfa',
  adminPage: localStorage.getItem(ADMIN_TAB_KEY) || 'Genel Bakış',
  query: '',
  session: safeParse(localStorage.getItem(AUTH_SESSION_KEY), null),
  maintenance: safeParse(localStorage.getItem(MAINTENANCE_KEY), { enabled:false, message:'Hayatımız Oyun kısa süreli bakımda.' }),
  users: [],
  notes: [],
  planner: defaultPlanner(),
  toast: '',
  authMode: null,
  loading: false,
  error: '',
  runtimeLoaded: false,
  games: [
    { title:'Resident Evil 4 Remake', genre:'Korku / Aksiyon', status:'Devam Ediyor', eps:14, score:9.2, cover:'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=900&auto=format&fit=crop' },
    { title:'Alan Wake 2', genre:'Korku / Hikaye', status:'Devam Ediyor', eps:8, score:9.1, cover:'https://images.unsplash.com/photo-1500673922987-e212871fec22?q=80&w=900&auto=format&fit=crop' },
    { title:'The Last of Us', genre:'Hikaye Odaklı', status:'Tamamlandı', eps:11, score:9.4, cover:'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=900&auto=format&fit=crop' },
    { title:'God of War', genre:'Aksiyon', status:'Popüler', eps:18, score:9.5, cover:'https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=900&auto=format&fit=crop' },
    { title:'Silent Hill 2', genre:'Korku', status:'Yakında', eps:0, score:9.0, cover:'https://images.unsplash.com/photo-1579547621113-e4bb2a19bdd6?q=80&w=900&auto=format&fit=crop' }
  ],
  updates: [
    'Fix 9: Kullanıcı ana sayfasındaki teknik/yönetim istatistikleri kaldırıldı ve Yönetim Paneli > Genel Bakış içine taşındı.',
    'Fix 9: Profil sekmesi eklendi; ad soyad düzenleme, rol bilgisi ve hesap durumu alanları eklendi.',
    'Fix 9: Özellik Planı geliştirilip tamamlanan işten sonra yeni kontrol maddesi üretildi; Admin Notlarım alanı eklendi.',
    'Fix 9: Supabase temiz başlangıç scripti eklendi; site_users hesabı korunur, diğer proje tabloları temizlenir.'
  ]
};

function defaultPlanner(){
  return [
    { id:'p1', group:'Eklenen Özellikler', text:'Kullanıcı ana sayfasından teknik istatistikleri kaldır', status:'kontrol' },
    { id:'p2', group:'Eklenen Özellikler', text:'Profil sekmesi ekle', status:'kontrol' },
    { id:'p3', group:'Siteye Gelmesi Gerekenler', text:'Oyun ekleme formunu Supabase games tablosuna bağla', status:'plan' },
    { id:'p4', group:'Siteye Gelmesi Gerekenler', text:'Güncelleme notu editörünü Supabase site_update_notes tablosuna bağla', status:'plan' },
    { id:'p5', group:'Gözden Kaçanlar', text:'Bakım modu açıkken guest ve normal kullanıcı kontrolünü tekrar test et', status:'kontrol' },
    { id:'p6', group:'Adminin Önerileri', text:'Benim Notlarım alanından eksik/hata girişi ekle', status:'kontrol' }
  ];
}
const rotatingTasks = [
  'Profil fotoğrafı yükleme alanı ekle',
  'Oyun kartında eksik kapak sarı uyarısını otomatik göster',
  'Mobil admin menüsüne yatay kaydırma testi ekle',
  'Bugün ne eksik hızlı kontrol kutusu yap',
  'Kullanıcı aktivite kayıtlarını anonim istatistik olarak göster',
  'Bakım mesajını admin panelinden düzenlenebilir yap',
  'Supabase games tablosundan gerçek oyun listesini çek',
  'Koleksiyon ekleme/düzenleme ekranı hazırla'
];
let rotateIndex = Number(localStorage.getItem('hayatimiz_task_rotate_fix9') || '0');

function safeParse(raw, fallback){ try { return raw ? JSON.parse(raw) : fallback; } catch { return fallback; } }
function $(sel){ return document.querySelector(sel); }
function html(strings, ...values){ return strings.map((s,i)=>s + (values[i] ?? '')).join(''); }
function esc(value){ return String(value ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch])); }
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
function setToast(message){ state.toast = message; render(); window.clearTimeout(window.__hyToast); window.__hyToast = window.setTimeout(()=>{ state.toast=''; render(); }, 3200); }
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
  if(state.session?.email){
    try{
      const data = await api('session-refresh', { email: state.session.email });
      if(data.user){ saveSession({ ...state.session, ...data.user, role: normalizeRole(data.user.role), adminToken:data.adminToken || state.session.adminToken || null }); }
    }catch(e){}
  }
  if(isStaff()) await loadPlanner(false);
  render();
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
    if(Array.isArray(data.planner) && data.planner.length) state.planner = data.planner;
    if(Array.isArray(data.notes)) state.notes = data.notes;
  }catch(e){}
  if(doRender) render();
}
function navigate(page){ state.page = page; render(); }
function adminNavigate(page){ state.page = 'Yönetim Paneli'; state.adminPage = page; localStorage.setItem(ADMIN_TAB_KEY, page); if(page === 'Kullanıcı Yetkileri') loadUsers(); if(page === 'Özellik Planı') loadPlanner(false); render(); }

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
  return html`<section class="hero userHero"><div><span class="eyebrow">Kullanıcı ana sayfası</span><h1>Oyun arşivi, yayın takvimi ve koleksiyonlar.</h1><p>Kullanıcı tarafında sadece izleme/arşiv alanları görünür. Teknik test, Supabase durumu, kritik hata ve yönetim notları artık yönetim panelindedir.</p><div class="heroActions"><button class="btn primary" data-page="Popüler">Popüler Oyunlar</button><button class="btn" data-page="Takvim">Yayın Takvimi</button><button class="btn" data-page="Koleksiyonlar">Koleksiyonlar</button><button class="btn" data-page="Profilim">Profilim</button></div></div></section>`;
}
function publicStats(){ return `<section class="grid stats"><div class="card"><b>Devam Eden</b><h3>${state.games.filter(g=>g.status==='Devam Ediyor').length}</h3><span class="muted">aktif seri</span></div><div class="card"><b>Tamamlanan</b><h3>${state.games.filter(g=>g.status==='Tamamlandı').length}</h3><span class="muted">arşivde</span></div><div class="card"><b>Yakında</b><h3>${state.games.filter(g=>g.status==='Yakında').length}</h3><span class="muted">planlanan</span></div></section>`; }
function gameGrid(){
  let games = state.games.filter(g => !state.query || JSON.stringify(g).toLowerCase().includes(state.query.toLowerCase()));
  if(state.page === 'Popüler') games = games.filter(g=>g.status==='Popüler' || g.score >= 9.2);
  if(state.page === 'Tamamlanan') games = games.filter(g=>g.status==='Tamamlandı');
  if(state.page === 'Devam Eden') games = games.filter(g=>g.status==='Devam Ediyor');
  if(state.page === 'Yakında') games = games.filter(g=>g.status==='Yakında');
  if(['Korku','Aksiyon','Hikaye Odaklı'].includes(state.page)) games = games.filter(g=>g.genre.includes(state.page.replace('Hikaye Odaklı','Hikaye')));
  return `<section class="games">${games.map(g=>`<article class="game"><img src="${esc(g.cover)}" alt="${esc(g.title)}"><div><span class="pill">${esc(g.status)}</span><h3>${esc(g.title)}</h3><p>${esc(g.genre)} • ${g.eps} bölüm</p><b>⭐ ${g.score}</b></div></article>`).join('')}</section>`;
}
function calendarPage(){ return `<section class="card wide"><h2>Yayın Takvimi</h2><p class="muted">Bu alan kullanıcı tarafında kalır. Teknik plan ve admin notları gösterilmez.</p><div class="timeline"><p><b>Bugün:</b> Alan Wake 2 bölüm kontrolü</p><p><b>Yarın:</b> Resident Evil 4 yeni bölüm</p><p><b>Hafta sonu:</b> Koleksiyon düzenleme</p></div></section>`; }
function collectionsPage(){ return `<section class="card wide"><h2>Koleksiyonlar</h2><p>Favori seriler, devam edenler ve tamamlanan oyun listeleri burada görünür.</p><div class="grid"><div class="card soft"><b>Korku Koleksiyonu</b><span>Alan Wake, Silent Hill, Resident Evil</span></div><div class="card soft"><b>Hikaye Odaklı</b><span>The Last of Us, God of War</span></div></div></section>`; }
function profilePage(){
  if(!state.session) return authLanding();
  const role = normalizeRole(state.session.role);
  return html`<section class="profileGrid"><div class="card profileCard"><div class="avatar">${esc((state.session.full_name || state.session.email || 'H')[0]).toUpperCase()}</div><h2>Profilim</h2><p class="muted">Hesap bilgileri ve yetki durumu</p><span class="pill ${role}">${esc(displayRole(role))}</span><div class="profileInfo"><p><b>Ad Soyad:</b> ${esc(state.session.full_name || 'Belirtilmedi')}</p><p><b>E-posta:</b> ${esc(state.session.email)}</p><p><b>Durum:</b> ${normalizeRole(state.session.role)==='banned' || state.session.is_active === false ? 'Banlı' : 'Aktif'}</p></div></div><form class="card profileEdit" id="profileForm"><h3>Profil Bilgilerini Güncelle</h3><label class="field">Ad Soyad<input name="fullName" value="${esc(state.session.full_name || '')}" /></label><button class="btn primary" type="submit">Profili Kaydet</button><p class="note">Rol değişikliği sadece kurucu/yönetici tarafından yönetim panelinden yapılır.</p></form></section>`;
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
  const pages = ['Genel Bakış','Oyunlar','Profil','Kullanıcı Yetkileri','Özellik Planı','Güncelleme Notları','Bakım Modu','API/ENV Durumu','Ayarlar'];
  return `<section class="adminLayout"><aside class="sidebar"><h3>Yönetim Paneli</h3><span>${VERSION}</span>${pages.map(p=>`<button class="sideBtn ${state.adminPage===p?'active':''}" data-admin="${esc(p)}">${icon(p)} ${esc(p)}</button>`).join('')}</aside><div class="adminContent"><div class="adminTop"><div><h1>${esc(state.adminPage)}</h1><p>${adminSubtitle(state.adminPage)}</p></div><span class="pill ${state.maintenance?.enabled?'banned':'green'}">${state.maintenance?.enabled?'Bakım açık':'Bakım kapalı'}</span></div>${adminBody()}</div></section>`;
}
function icon(p){ return ({'Genel Bakış':'🛡️','Oyunlar':'🎮','Profil':'👤','Kullanıcı Yetkileri':'👥','Özellik Planı':'✨','Güncelleme Notları':'📝','Bakım Modu':'🔌','API/ENV Durumu':'🗄️','Ayarlar':'⚙️'}[p] || '•'); }
function adminSubtitle(page){
  return ({
    'Genel Bakış':'Teknik kartlar, veri durumu ve yönetim özetleri burada tutulur.',
    'Özellik Planı':'Eklenenler, gelmesi gerekenler, gözden kaçanlar, öneriler ve senin notların.',
    'Kullanıcı Yetkileri':'Kurucu/yönetici hesapları rol verme, banlama ve silme yapabilir.',
    'Profil':'Yetkili hesabın profil bilgileri.',
    'Bakım Modu':'Global bakım kilidi giriş yapmayanlara ve normal kullanıcılara uygulanır.'
  }[page] || 'Panel içi butonlar sayfa yenilemeden çalışır.');
}
function adminBody(){
  if(state.adminPage === 'Kullanıcı Yetkileri') return usersPanel();
  if(state.adminPage === 'Özellik Planı') return featurePlan();
  if(state.adminPage === 'Bakım Modu') return maintenanceAdmin();
  if(state.adminPage === 'Güncelleme Notları') return updateNotes();
  if(state.adminPage === 'Profil') return profilePage();
  if(state.adminPage === 'Oyunlar') return gamesAdmin();
  if(state.adminPage === 'API/ENV Durumu') return apiStatus();
  if(state.adminPage === 'Ayarlar') return settingsPanel();
  return overviewAdmin();
}
function overviewAdmin(){
  return `<section class="grid stats adminStats"><div class="card"><b>Oyun</b><h3>${state.games.length}</h3><span class="muted">arşiv verisi</span></div><div class="card"><b>Kritik hata</b><h3>0</h3><span class="muted">aktif hata yok</span></div><div class="card"><b>Güncelleme</b><h3>${state.updates.length}</h3><span class="muted">not</span></div><div class="card"><b>Veri durumu</b><h3>${state.runtimeLoaded?'Bağlandı':'Local'}</h3><span class="muted">Supabase/API</span></div></section><section class="card wide"><h2>Teknik alanlar yönetim paneline taşındı</h2><p>Kullanıcı ana sayfasında Supabase, test skoru, kritik hata, veri durumu veya güncelleme notu kartları görünmez.</p><button class="btn primary" data-admin="Özellik Planı">Özellik Planını Aç</button><button class="btn" data-admin="Kullanıcı Yetkileri">Kullanıcı Yetkileri</button></section>`;
}
function gamesAdmin(){ return `<section class="card wide"><h2>Oyun Yönetimi</h2><p class="muted">Sonraki sürümde oyun ekleme formu Supabase games tablosuna bağlanacak.</p>${gameGrid()}<button class="btn primary" data-toast="Oyun ekleme formu sonraki kontrol listesine eklendi.">Oyun Ekle Hazırlığı</button></section>`; }
function apiStatus(){ return `<section class="grid adminGrid"><div class="card"><h3>Vercel ENV</h3><p>Gizli keyler ekranda gösterilmez. Sadece bağlantı durumu izlenir.</p><span class="pill ${state.runtimeLoaded?'green':'banned'}">${state.runtimeLoaded?'API erişimi var':'Local/fallback'}</span></div><div class="card"><h3>Supabase</h3><p>Tablo temizliği için hesapları koruyan SQL dosyası eklendi.</p><button class="btn" data-toast="supabase/SUPABASE-TEMIZ-BASLANGIC-HESAPLAR-KALSIN.sql dosyasını çalıştır.">Temiz Başlangıç Notu</button></div></section>`; }
function settingsPanel(){ return `<section class="card wide"><h2>Ayarlar</h2><p>Bu sürümde ayarlar güvenli moda alındı. Gizli şifre ve key değerleri hiçbir ekranda yazmaz.</p><button class="btn" data-action="clear-local">Eski Tarayıcı Cache Temizle</button></section>`; }
function usersPanel(){
  const canManage = isOwner();
  const rows = state.users.length ? state.users : [{id:'demo', full_name:'Örnek Kullanıcı', email:'kullanici@example.com', role:'user', is_active:true}];
  return `<div class="card wide"><div class="sectionHead"><h2>Kullanıcı Yetkileri</h2><button class="btn primary" data-action="refresh-users">Yenile</button></div><p class="muted">Roller: Kurucu, Yönetici, Moderatör, Editör, Kullanıcı, Banlı. Eski admin rolü yönetici olarak okunur.</p><table class="roleTable"><thead><tr><th>Kullanıcı</th><th>Rol</th><th>Durum</th><th>İşlem</th></tr></thead><tbody>${rows.map(u=>`<tr><td><b>${esc(u.full_name || 'İsimsiz')}</b><br><span class="muted">${esc(u.email)}</span></td><td><span class="pill ${normalizeRole(u.role)}">${esc(displayRole(u.role))}</span></td><td>${u.is_active === false ? '<span class="pill banned">Banlı</span>' : '<span class="pill green">Aktif</span>'}</td><td><div class="roleActions">${ROLE_OPTIONS.map(r=>`<button class="miniBtn ${r==='kurucu'?'primary':''}" data-user-role="${esc(u.id)}|${r}" ${!canManage||u.id==='demo'?'disabled':''}>${esc(displayRole(r))}</button>`).join('')}<button class="miniBtn danger" data-user-ban="${esc(u.id)}" ${!canManage||u.id==='demo'?'disabled':''}>${u.is_active===false?'Ban Aç':'Banla'}</button><button class="miniBtn danger" data-user-delete="${esc(u.id)}" ${!canManage||u.id==='demo'?'disabled':''}>Sil</button></div></td></tr>`).join('')}</tbody></table></div>`;
}
function maintenanceAdmin(){
  return html`<div class="grid adminGrid"><div class="card wide"><h3>Global Bakım Modu</h3><p class="muted">Açıkken giriş yapmayanlar ve normal kullanıcılar bakım ekranında kalır. Kurucu/yönetici/moderatör/editör paneli kullanabilir.</p><label class="field">Bakım Mesajı<input id="maintenanceMessage" value="${esc(state.maintenance?.message || 'Hayatımız Oyun kısa süreli bakımda.')}" /></label><button class="btn ${state.maintenance?.enabled?'danger':'green'}" data-action="toggle-maintenance">${state.maintenance?.enabled?'Bakımı Kapat':'Bakımı Aç'}</button></div><div class="card"><h3>Durum</h3><p><span class="pill ${state.maintenance?.enabled?'banned':'green'}">${state.maintenance?.enabled?'Açık':'Kapalı'}</span></p></div></div>`;
}
function featurePlan(){
  const groups = ['Eklenen Özellikler','Siteye Gelmesi Gerekenler','Gözden Kaçanlar','Adminin Önerileri'];
  return `<div class="plannerWrap"><div class="grid adminGrid">${groups.map(group=>`<div class="card planCard"><h3>${esc(group)}</h3>${state.planner.filter(x=>x.group===group).map(item=>`<p class="planItem ${item.status==='tamam'?'done':''}"><span>${item.status==='tamam'?'✅':'☑️'}</span>${esc(item.text)}</p>`).join('') || '<p class="muted">Bu bölüm boş.</p>'}<button class="btn" data-plan-complete="${esc(group)}">Tamamla + Yeni Madde</button></div>`).join('')}</div><div class="card wide notesCard"><h2>Benim Notlarım</h2><p class="muted">Eksikleri, hataları ve aklına gelen yeni fikirleri buraya yaz. Kayıt Supabase’e denenir, olmazsa localde kalır.</p><form id="adminNoteForm" class="noteForm"><textarea name="note" placeholder="Örn: Mobilde profil butonu sağa taşıyor, oyun ekleme formunda kapak yükleme eksik..."></textarea><button class="btn primary" type="submit">Notu Kaydet</button></form><div class="noteList">${state.notes.map(n=>`<div class="noteLine">📝 ${esc(n.note || n.content || n.title || '')}</div>`).join('') || '<span class="muted">Henüz not yok.</span>'}</div></div></div>`;
}
function updateNotes(){ return `<div class="card wide"><h3>Güncelleme Notları</h3>${state.updates.map(n=>`<p>✅ ${esc(n)}</p>`).join('')}<button class="btn primary" data-action="download-notes">Güncelleme notlarını indir</button></div>`; }
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
  const auth = $('#authForm'); if(auth) auth.addEventListener('submit', onAuthSubmit);
  const profile = $('#profileForm'); if(profile) profile.addEventListener('submit', onProfileSubmit);
  const note = $('#adminNoteForm'); if(note) note.addEventListener('submit', onAdminNoteSubmit);
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
  if(action === 'download-notes'){ download('hayatimiz-oyun-guncelleme-notlari.json', JSON.stringify(state.updates, null, 2)); setToast('Güncelleme notları indirildi.'); }
  if(action === 'clear-local'){ localStorage.removeItem('hayatimiz_session_v213_fix8'); localStorage.removeItem('hayatimiz_admin_tab_fix8'); setToast('Eski Fix 8 tarayıcı kayıtları temizlendi.'); }
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
  const nextText = rotatingTasks[rotateIndex % rotatingTasks.length]; rotateIndex += 1; localStorage.setItem('hayatimiz_task_rotate_fix9', String(rotateIndex));
  state.planner.push({ id:'local-'+Date.now(), group, text: nextText, status:'plan' });
  render();
  try{ await api('planner-complete-add', { adminToken: state.session?.adminToken, group, completedId: active?.id, nextText }); await loadPlanner(false); setToast(`${group}: tamamlandı ve yeni madde eklendi.`); }
  catch(err){ setToast(`${group}: local tamamlandı, Supabase kaydı sonra denenir.`); }
}
async function onAdminNoteSubmit(e){
  e.preventDefault(); const fd = new FormData(e.currentTarget); const note = String(fd.get('note') || '').trim(); if(!note) return setToast('Not boş olamaz.');
  state.notes.unshift({ note, created_at: new Date().toISOString() }); e.currentTarget.reset(); render();
  try{ await api('admin-note-add', { adminToken: state.session?.adminToken, note }); await loadPlanner(false); setToast('Not kaydedildi.'); }
  catch(err){ setToast('Not local kaydedildi; Supabase kaydı başarısız.'); }
}
function download(filename, content){ const blob = new Blob([content], {type:'application/json;charset=utf-8'}); const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(a.href); }
function showBootError(error){
  const root = document.getElementById('root'); if(!root) return; root.dataset.mounted='1'; window.clearTimeout(window.__HAYATIMIZ_BOOT_TIMER__);
  root.innerHTML = `<section class="bootError"><div class="bootErrorCard"><h1>Site açılırken hata yakalandı.</h1><p>Beyaz ekran yerine hata yakalama ekranı aktif oldu. Bu mesaj çıkarsa ekran görüntüsüyle konsol hatasını gönder.</p><pre>${esc(error?.stack || error?.message || error)}</pre><button class="btn primary" onclick="location.reload()">Sayfayı Yenile</button></div></section>`;
}
window.addEventListener('error', event => showBootError(event.error || event.message));
window.addEventListener('unhandledrejection', event => showBootError(event.reason || 'Bilinmeyen promise hatası'));
try{ render(); loadRuntime(); }catch(error){ showBootError(error); }
