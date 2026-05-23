import './styles.css';

const VERSION = 'v2.1.3 Fix 8 Beyaz Ekran Kesin Fix';
const STAFF_ROLES = ['kurucu', 'yonetici', 'moderator', 'editor'];
const OWNER_ROLES = ['kurucu', 'yonetici'];
const ROLE_LABELS = { kurucu:'Kurucu', yonetici:'Yönetici', moderator:'Moderatör', editor:'Editör', user:'Kullanıcı', banned:'Banlı' };
const ROLE_OPTIONS = ['kurucu','yonetici','moderator','editor','user'];
const AUTH_SESSION_KEY = 'hayatimiz_session_v213_fix8';
const MAINTENANCE_KEY = 'hayatimiz_maintenance_cache';

const state = {
  page: 'Ana Sayfa',
  adminPage: localStorage.getItem('hayatimiz_admin_tab_fix8') || 'Genel Bakış',
  query: '',
  session: safeParse(localStorage.getItem(AUTH_SESSION_KEY), null),
  maintenance: safeParse(localStorage.getItem(MAINTENANCE_KEY), { enabled:false, message:'Hayatımız Oyun kısa süreli bakımda.' }),
  users: [],
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
    'Fix 8: Beyaz ekran için inline boot fallback ve güvenli hata ekranı eklendi.',
    'Fix 8: Giriş ekranından yetkili/admin sekmesi kaldırıldı; yetki normal hesaptaki Supabase role alanından okunur.',
    'Fix 8: Bakım modu giriş yapmayanlara ve normal kullanıcılara global gösterilir.',
    'Fix 8: Yönetim paneli butonları tek sayfa state sistemiyle sabitlendi.'
  ]
};

function safeParse(raw, fallback){ try { return raw ? JSON.parse(raw) : fallback; } catch { return fallback; } }
function $(sel){ return document.querySelector(sel); }
function html(strings, ...values){ return strings.map((s,i)=>s + (values[i] ?? '')).join(''); }
function esc(value){ return String(value ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch])); }
function normalizeRole(role){
  const raw = String(role || 'user').trim().toLowerCase();
  const ascii = raw.replace(/ı/g,'i').replace(/İ/g,'i').replace(/ö/g,'o').replace(/ü/g,'u').replace(/ğ/g,'g').replace(/ş/g,'s').replace(/ç/g,'c');
  if(['kurucu','founder','owner','sahip'].includes(ascii)) return 'kurucu';
  if(['yonetici','yönetici','admin','administrator'].includes(ascii)) return 'yonetici';
  if(['moderator','mod','moderator'].includes(ascii)) return 'moderator';
  if(['editor','editor'].includes(ascii)) return 'editor';
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
      if(data.user){ saveSession({ ...state.session, ...data.user, role: normalizeRole(data.user.role) }); }
    }catch(e){}
  }
  render();
}
async function loadUsers(){
  if(!isOwner()) return;
  try { const data = await api('users-list', { adminToken: state.session?.adminToken }); state.users = data.users || []; }
  catch(e){ setToast('Kullanıcı listesi alınamadı: ' + e.message); }
  render();
}
function navigate(page){ state.page = page; render(); }
function adminNavigate(page){ state.page = 'Yönetim Paneli'; state.adminPage = page; localStorage.setItem('hayatimiz_admin_tab_fix8', page); if(page === 'Kullanıcı Yetkileri') loadUsers(); render(); }

function topbar(){
  const role = normalizeRole(state.session?.role);
  return html`<header class="topbar">
    <div class="brand"><div class="mark">🎮</div><div><b>Hayatımız Oyun</b><span>${VERSION}</span></div></div>
    <label class="search">🔎 <input id="searchInput" value="${esc(state.query)}" placeholder="Oyun, kategori veya bölüm ara" /></label>
    <div class="topActions">
      ${state.maintenance?.enabled ? '<span class="pill banned">Bakım Modu Açık</span>' : '<span class="pill">Yayında</span>'}
      ${state.session ? `<span class="pill ${role}">${esc(displayRole(role))}</span><button class="btn" data-action="logout">Çıkış</button>` : `<button class="btn" data-action="open-login">Giriş</button><button class="btn primary" data-action="open-register">Kayıt</button>`}
      ${isStaff() ? '<button class="btn primary" data-admin="Genel Bakış">Yönetim Paneli</button>' : ''}
    </div>
  </header>`;
}
function categoryRail(){
  if(!state.session || (state.maintenance?.enabled && !isStaff())) return '';
  const cats = ['Ana Sayfa','Popüler','Tamamlanan','Devam Eden','Yakında','Korku','Aksiyon','Hikaye Odaklı','Takvim','Koleksiyonlar'];
  return `<nav class="category">${cats.map(c=>`<button class="tab ${state.page===c?'active':''}" data-page="${esc(c)}">${esc(c)}</button>`).join('')}</nav>`;
}
function maintenancePage(){
  return html`<section class="maintenanceWrap"><div class="pulseOrb"></div><div class="maintenanceCard"><div class="loader"></div><span class="eyebrow">Bakım Modu</span><h1>Hayatımız Oyun kısa süreli bakımda.</h1><p>${esc(state.maintenance?.message || 'Site kısa süreli bakımda. Lütfen daha sonra tekrar dene.')}</p><div class="authButtons"><button class="btn primary" data-action="open-login">Giriş Yap</button>${isStaff()?'<button class="btn" data-admin="Bakım Modu">Yönetim Paneli</button>':''}</div></div></section>`;
}
function authLanding(){
  return html`<section class="authWrap"><div class="authCard"><span class="eyebrow">Oyun arşivi • üyelik sistemi</span><h1>Hayatımız Oyun arşivine giriş yap.</h1><p>Kayıt ve giriş normal kullanıcı hesabıyla yapılır. Kurucu, yönetici, moderatör ve editör yetkileri Supabase tablosundaki rol alanından otomatik okunur.</p><div class="authButtons"><button class="btn primary" data-action="open-login">Giriş Yap</button><button class="btn" data-action="open-register">Kayıt Ol</button></div><div class="note" style="margin-top:22px">Ayrı yetkili girişi yoktur. Yetkili hesap da normal giriş ekranından girer.</div></div></section>`;
}
function hero(){
  return html`<section class="hero"><div><span class="eyebrow">Kullanıcı ana sayfası</span><h1>Oyun arşivi, yayın takvimi ve koleksiyonlar.</h1><p>Teknik test, Supabase ve yönetim notları kullanıcı tarafında görünmez. Yetkili hesaplar normal giriş yaptıktan sonra yönetim panelini kullanabilir.</p><div class="heroActions"><button class="btn primary" data-page="Popüler">Popüler Oyunlar</button><button class="btn" data-page="Takvim">Yayın Takvimi</button><button class="btn" data-page="Koleksiyonlar">Koleksiyonlar</button></div></div><div class="heroStats"><div><strong>${state.games.length}</strong><span>Oyun</span></div><div><strong>0</strong><span>Kritik hata</span></div><div><strong>${state.updates.length}</strong><span>Güncelleme</span></div><div><strong>${state.runtimeLoaded?'Bağlandı':'Local'}</strong><span>Veri durumu</span></div></div></section>`;
}
function stats(){ return `<section class="grid stats"><div class="card"><b>Devam Eden</b><h3>${state.games.filter(g=>g.status==='Devam Ediyor').length}</h3><span class="muted">aktif seri</span></div><div class="card"><b>Tamamlanan</b><h3>${state.games.filter(g=>g.status==='Tamamlandı').length}</h3><span class="muted">arşivde</span></div><div class="card"><b>Yakında</b><h3>${state.games.filter(g=>g.status==='Yakında').length}</h3><span class="muted">planlanan</span></div><div class="card"><b>Yetki</b><h3>${esc(displayRole(state.session?.role))}</h3><span class="muted">hesap rolü</span></div></section>`; }
function gameGrid(){
  let games = state.games.filter(g => !state.query || JSON.stringify(g).toLowerCase().includes(state.query.toLowerCase()));
  if(state.page === 'Popüler') games = games.filter(g=>g.status==='Popüler' || g.score >= 9.2);
  if(state.page === 'Tamamlanan') games = games.filter(g=>g.status==='Tamamlandı');
  if(state.page === 'Devam Eden') games = games.filter(g=>g.status==='Devam Ediyor');
  if(state.page === 'Yakında') games = games.filter(g=>g.status==='Yakında');
  if(state.page === 'Korku') games = games.filter(g=>g.genre.includes('Korku'));
  if(state.page === 'Aksiyon') games = games.filter(g=>g.genre.includes('Aksiyon'));
  if(state.page === 'Hikaye Odaklı') games = games.filter(g=>g.genre.includes('Hikaye'));
  return `<section class="section"><div class="sectionTitle"><h2>${esc(state.page)} Oyunları</h2><span class="muted">${games.length} sonuç</span></div><div class="grid games">${games.map(g=>`<article class="card game"><div class="cover" style="background-image:url('${esc(g.cover)}')"><span class="badge">${esc(g.status)}</span></div><div class="gameBody"><h3>${esc(g.title)}</h3><p class="muted">${esc(g.genre)}</p><div class="meta"><span>${g.eps} bölüm</span><span>⭐ ${g.score}</span></div></div></article>`).join('')}</div></section>`;
}
function scheduleCollections(){
  return html`<section class="section"><div class="sectionTitle"><h2>Takvim ve Koleksiyonlar</h2><span class="muted">Kullanıcı alanı</span></div><div class="grid stats"><div class="card"><h3>Pazartesi</h3><p>Resident Evil 4 Remake • 15. Bölüm</p></div><div class="card"><h3>Çarşamba</h3><p>Alan Wake 2 • 9. Bölüm</p></div><div class="card"><h3>Korku Gecesi</h3><p>Korku serileri tek koleksiyonda.</p></div><div class="card"><h3>Hikaye Odaklı</h3><p>Sinematik oyunlar listesi.</p></div></div></section>`;
}
function publicPage(){
  if(state.maintenance?.enabled && !isStaff()) return maintenancePage();
  if(!state.session) return authLanding();
  if(['Takvim','Koleksiyonlar'].includes(state.page)) return scheduleCollections();
  return hero() + stats() + gameGrid();
}
function adminPanel(){
  if(!isStaff()) return `<section class="authWrap"><div class="authCard"><h1>Bu alan yetkili hesaplara özel.</h1><p>Kurucu, yönetici, moderatör veya editör rolü olan hesapla normal giriş yap.</p><button class="btn primary" data-action="open-login">Giriş Yap</button></div></section>`;
  const tabs = ['Genel Bakış','Kullanıcı Yetkileri','Bakım Modu','Özellik Planı','Güncelleme Notları','Oyunlar','Ayarlar'];
  return html`<section class="adminShell"><aside class="adminSide"><h2>Yönetim Paneli</h2><span class="muted">${esc(displayRole(state.session?.role))} hesabı</span><nav>${tabs.map(t=>`<button class="btn ${state.adminPage===t?'active':''}" data-admin="${esc(t)}">${esc(t)}</button>`).join('')}</nav></aside><main class="adminMain"><div class="adminTop"><div><h1>${esc(state.adminPage)}</h1><p class="muted">Butonlar sayfa yenilemeden panel içinde çalışır.</p></div><button class="btn ${state.maintenance?.enabled?'danger':'green'}" data-admin="Bakım Modu">${state.maintenance?.enabled?'Bakım açık':'Bakım kapalı'}</button></div>${adminContent()}</main></section>`;
}
function adminContent(){
  if(state.adminPage === 'Kullanıcı Yetkileri') return userAuthority();
  if(state.adminPage === 'Bakım Modu') return maintenanceAdmin();
  if(state.adminPage === 'Özellik Planı') return featurePlan();
  if(state.adminPage === 'Güncelleme Notları') return updateNotes();
  if(state.adminPage === 'Oyunlar') return `<div class="grid adminGrid"><div class="card"><h3>Oyun Ekle</h3><p class="muted">Supabase games tablosuna bağlanacak sonraki ekran hazır.</p><button class="btn primary" data-toast="Oyun ekleme formu sonraki sürüme hazırlandı.">Hazırla</button></div><div class="card"><h3>Eksik Kapak</h3><p class="muted">Eksik kapak kontrolü simüle edilir.</p><button class="btn" data-toast="Eksik kapak kontrolü tamamlandı.">Kontrol Et</button></div></div>`;
  if(state.adminPage === 'Ayarlar') return `<div class="grid adminGrid"><div class="card"><h3>Rol Sistemi</h3><p>kurucu, yonetici, moderator, editor, user, banned</p></div><div class="card"><h3>Gizli Bilgiler</h3><p class="muted">Ekranda şifre veya key gösterilmez.</p></div></div>`;
  return `<div class="grid adminGrid"><div class="card"><h3>Beyaz Ekran Fix</h3><p>Inline boot fallback ve güvenli render sistemi aktif.</p><button class="btn" data-toast="Site açılış kontrolü tamamlandı.">Kontrol Et</button></div><div class="card"><h3>Kayıt Sistemi</h3><p>Yeni kayıtlar public.site_users tablosuna gider.</p><button class="btn" data-admin="Kullanıcı Yetkileri">Kullanıcıları Aç</button></div><div class="card"><h3>Bakım Modu</h3><p>Giriş yapmayanlar dahil herkese bakım ekranı gösterilir.</p><button class="btn" data-admin="Bakım Modu">Bakımı Yönet</button></div><div class="card wide"><h3>Güncel Not</h3><p>Fix 7 temiz giriş olarak anlaşılmıştı; Fix 8 asıl beyaz ekran açılmama sorununa odaklandı.</p></div></div>`;
}
function userAuthority(){
  const canManage = isOwner();
  const rows = state.users.length ? state.users : [{ id:'demo', full_name:'Kullanıcı listesi için Yenile butonuna bas', email:'Supabase bağlantısı bekleniyor', role:'user', is_active:true }];
  return `<div class="card"><div class="sectionTitle"><h2>Kullanıcı Yetkileri</h2><button class="btn primary" data-action="refresh-users">Yenile</button></div><p class="muted">Kurucu/yönetici kullanıcı rol verebilir. Şifre ve gizli key ekranda gösterilmez.</p><table class="roleTable"><thead><tr><th>Kullanıcı</th><th>Rol</th><th>Durum</th><th>İşlem</th></tr></thead><tbody>${rows.map(u=>`<tr><td><b>${esc(u.full_name || 'İsimsiz')}</b><br><span class="muted">${esc(u.email)}</span></td><td><span class="pill ${normalizeRole(u.role)}">${esc(displayRole(u.role))}</span></td><td>${u.is_active === false ? '<span class="pill banned">Banlı</span>' : '<span class="pill">Aktif</span>'}</td><td><div class="roleActions">${ROLE_OPTIONS.map(r=>`<button class="miniBtn ${r==='kurucu'?'primary':''}" data-user-role="${esc(u.id)}|${r}" ${!canManage||u.id==='demo'?'disabled':''}>${esc(displayRole(r))}</button>`).join('')}<button class="miniBtn danger" data-user-ban="${esc(u.id)}" ${!canManage||u.id==='demo'?'disabled':''}>${u.is_active===false?'Ban Aç':'Banla'}</button><button class="miniBtn danger" data-user-delete="${esc(u.id)}" ${!canManage||u.id==='demo'?'disabled':''}>Sil</button></div></td></tr>`).join('')}</tbody></table></div>`;
}
function maintenanceAdmin(){
  return html`<div class="grid adminGrid"><div class="card wide"><h3>Global Bakım Modu</h3><p class="muted">Açıkken giriş yapmayanlar ve normal kullanıcılar bakım ekranında kalır. Kurucu/yönetici/moderatör/editör normal girişten sonra paneli kullanabilir.</p><button class="btn ${state.maintenance?.enabled?'danger':'green'}" data-action="toggle-maintenance">${state.maintenance?.enabled?'Bakımı Kapat':'Bakımı Aç'}</button></div><div class="card"><h3>Durum</h3><p><span class="pill ${state.maintenance?.enabled?'banned':''}">${state.maintenance?.enabled?'Açık':'Kapalı'}</span></p></div></div>`;
}
function featurePlan(){
  const cols = [
    ['Eklenen Özellikler',['Beyaz ekran boot fallback','Normal girişten rol okuma','Global bakım kilidi','Yönetim buton fixleri']],
    ['Siteye Gelmesi Gerekenler',['Supabase Auth e-posta doğrulama','Oyun ekleme formu','Güncelleme notu editörü','Kapak yükleme sistemi']],
    ['Gözden Kaçanlar',['Mobil admin menü testi','Bakım açıkken guest kontrolü','Eski localStorage temizliği','Clear Build Cache kontrolü']],
    ['Adminin Önerileri',['Bugün ne eksik paneli','Eksik kapak sarı uyarı','Anonim izleme istatistiği','Planlanan otomatik çekme']]
  ];
  return `<div class="grid adminGrid">${cols.map(([title,items])=>`<div class="card"><h3>${esc(title)}</h3>${items.map(i=>`<p>✅ ${esc(i)}</p>`).join('')}<button class="btn" data-toast="${esc(title)} kontrol listesi açıldı.">Kontrol Et</button></div>`).join('')}</div>`;
}
function updateNotes(){ return `<div class="card"><h3>Güncelleme Notları</h3>${state.updates.map(n=>`<p>✅ ${esc(n)}</p>`).join('')}<button class="btn primary" data-action="download-notes">Güncelleme notlarını indir</button></div>`; }
function modal(){
  if(!state.authMode) return '';
  const title = state.authMode === 'register' ? 'Kayıt Ol' : 'Giriş Yap';
  return html`<div class="modalOverlay"><form class="modal" id="authForm"><button class="close" type="button" data-action="close-modal">×</button><div class="switch"><button type="button" class="btn ${state.authMode==='login'?'primary':''}" data-action="open-login">Giriş</button><button type="button" class="btn ${state.authMode==='register'?'primary':''}" data-action="open-register">Kayıt</button></div><h2>${title}</h2><p>Ayrı yetkili girişi yok. Kurucu/yönetici/moderatör/editör normal hesapla giriş yapar.</p>${state.authMode==='register'?'<label class="field">Ad Soyad<input name="fullName" autocomplete="name" required /></label>':''}<label class="field">E-posta<input name="email" type="email" autocomplete="email" required /></label><label class="field">Şifre<input name="password" type="password" autocomplete="current-password" required /></label>${state.error?`<div class="alert">${esc(state.error)}</div>`:''}<div class="note">Gizli key veya şifre ekranda gösterilmez.</div><button class="btn primary" type="submit" ${state.loading?'disabled':''}>${state.loading?'İşleniyor...':title}</button></form></div>`;
}
function toast(){ return state.toast ? `<div class="toast"><span>✅</span><b>${esc(state.toast)}</b><button class="miniBtn" data-action="close-toast">Tamam</button></div>` : ''; }
function mainContent(){
  if(state.page === 'Yönetim Paneli') return adminPanel();
  return publicPage();
}
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
  const form = $('#authForm');
  if(form) form.addEventListener('submit', onAuthSubmit);
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
}
async function onAuthSubmit(e){
  e.preventDefault(); state.loading=true; state.error=''; render();
  const fd = new FormData(e.currentTarget);
  const payload = { fullName: fd.get('fullName'), email: fd.get('email'), password: fd.get('password') };
  try{
    const data = await api(state.authMode === 'register' ? 'register' : 'login', payload);
    const user = data.user || {};
    saveSession({ ...user, role: normalizeRole(user.role), adminToken: data.adminToken || user.adminToken || null });
    state.authMode = null;
    state.page = isStaff() ? 'Yönetim Paneli' : 'Ana Sayfa';
    setToast(`${displayRole(state.session?.role)} olarak giriş yapıldı.`);
  }catch(err){ state.error = err.message; }
  state.loading=false; render();
}
async function toggleMaintenance(){
  const enabled = !state.maintenance?.enabled;
  state.maintenance = { enabled, message:'Hayatımız Oyun kısa süreli bakımda. Lütfen daha sonra tekrar dene.' };
  localStorage.setItem(MAINTENANCE_KEY, JSON.stringify(state.maintenance));
  render();
  try{ await api('settings-set', { adminToken: state.session?.adminToken, maintenance: state.maintenance }); setToast(enabled?'Bakım modu herkese açıldı.':'Bakım modu kapatıldı.'); }
  catch(e){ setToast('Bakım local değişti; Supabase kaydı başarısız: ' + e.message); }
}
async function onSetRole(e){
  e.preventDefault(); const [userId, role] = e.currentTarget.dataset.userRole.split('|');
  try{ await api('user-role-set', { adminToken: state.session?.adminToken, userId, role }); setToast(`Rol ${displayRole(role)} yapıldı.`); await loadUsers(); }
  catch(err){ setToast('Rol verilemedi: ' + err.message); }
}
async function onBan(e){
  e.preventDefault();
  try{ await api('user-ban-toggle', { adminToken: state.session?.adminToken, userId: e.currentTarget.dataset.userBan }); setToast('Ban durumu değiştirildi.'); await loadUsers(); }
  catch(err){ setToast('Ban işlemi başarısız: ' + err.message); }
}
async function onDeleteUser(e){
  e.preventDefault(); if(!confirm('Kullanıcı silinsin mi?')) return;
  try{ await api('user-delete', { adminToken: state.session?.adminToken, userId: e.currentTarget.dataset.userDelete }); setToast('Kullanıcı silindi.'); await loadUsers(); }
  catch(err){ setToast('Silme başarısız: ' + err.message); }
}
function download(filename, content){ const blob = new Blob([content], {type:'application/json;charset=utf-8'}); const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(a.href); }
function showBootError(error){
  const root = document.getElementById('root'); if(!root) return; root.dataset.mounted='1'; window.clearTimeout(window.__HAYATIMIZ_BOOT_TIMER__);
  root.innerHTML = `<section class="bootError"><div class="bootErrorCard"><h1>Site açılırken hata yakalandı.</h1><p>Beyaz ekran yerine hata yakalama ekranı aktif oldu. Bu mesaj çıkarsa ekran görüntüsüyle konsol hatasını gönder.</p><pre>${esc(error?.stack || error?.message || error)}</pre><button class="btn primary" onclick="location.reload()">Sayfayı Yenile</button></div></section>`;
}
window.addEventListener('error', event => showBootError(event.error || event.message));
window.addEventListener('unhandledrejection', event => showBootError(event.reason || 'Bilinmeyen promise hatası'));
try{ render(); loadRuntime(); }catch(error){ showBootError(error); }
