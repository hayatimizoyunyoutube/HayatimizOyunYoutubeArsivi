import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Activity, AlertTriangle, Bell, BrainCircuit, CalendarCheck, CheckCircle2, ClipboardList, Cloud, Database, Download, EyeOff, FileDown, Filter, Gamepad2, Gauge, ImagePlus, Lightbulb, ListChecks, LockKeyhole, LogIn, LogOut, Menu, Palette, PlayCircle, Plus, RefreshCcw, Search, Settings, ShieldCheck, SlidersHorizontal, Sparkles, Star, Target, Timer, TrendingUp, UploadCloud, UserCheck, UserPlus, UserRound, WandSparkles, X, Zap } from 'lucide-react';
import './styles.css';
import { loadAutoData, fallbackGames, fallbackUpdates, fallbackConfig, fallbackSyncLog, fallbackAnalytics, fallbackSchedule, fallbackCollections, fallbackRecommendations, fallbackNotifications, fallbackThemes, fallbackWatchProgress, fallbackRoadmap, fallbackTestCenter, fallbackQaChecklist, fallbackErrorReports, fallbackApiStatus, fallbackRollbackPlan, analyzeGameHealth } from './services/autoFetch.js';

const VERSION = 'v2.1.3';

const categories = [
  'Ana Sayfa', 'Popüler', 'Tamamlanan', 'Devam Eden', 'Yakında', 'Korku', 'Aksiyon', 'Hikaye Odaklı',
  'Takvim', 'Koleksiyonlar'
];

const hiddenAdminPages = [
  'Test Merkezi', 'Hata Raporları', 'API Durumu', 'AI Öneriler', 'Bildirimler', 'Yönetim Paneli'
];

const adminFeatureBoard = {
  added: [
    'Supabase tablo kayıt sistemi: yeni kullanıcılar public.site_users tablosuna yazılır.',
    'Tek serverless API: Vercel Hobby limitini aşmadan /api üzerinden kayıt/giriş çalışır.',
    'Admin test şifresi arayüzden kaldırıldı; parola sadece Vercel ADMIN_PASSWORD üzerinden kontrol edilir.',
    'Yönetim Paneline Özellik Planı alanı eklendi.',
    'schema.sql v2.1.3 tabloları ve güncelleme notlarıyla yenilendi.'
  ],
  needed: [
    'Gerçek Supabase Auth bağlantısı ve e-posta doğrulama.',
    'Admin içinden oyun ekleme formunu doğrudan Supabase games tablosuna kaydetme.',
    'Profil fotoğrafını Supabase Storage profile-photos bucket içine yükleme.',
    'YouTube otomatik çekmeyi zamanlanmış cron yapısına bağlama.',
    'RAWG kapak eşleştirme için manuel onay ekranı.'
  ],
  missed: [
    'Bakım modunda normal kullanıcıların tüm alt sayfalardan kesildiği tekrar test edilmeli.',
    'Mobilde küçük ekranlarda admin sol menü kaydırma testi yapılmalı.',
    'Vercel ENV değişikliği sonrası Clear Build Cache ile redeploy yapılmalı.',
    'Supabase schema.sql eski tabloyu silmeden kolon ekliyor mu kontrol edilmeli.',
    'Kayıt formunda aynı e-posta ikinci kez denenince doğru uyarı veriyor mu bakılmalı.'
  ],
  adminIdeas: [
    'Admin paneline “Bugün ne eksik?” hızlı kontrol butonu eklensin.',
    'Kullanıcıların izleme listesi admin tarafından anonim istatistik olarak görülsün.',
    'Oyun kartlarında eksik kapak varsa otomatik sarı uyarı çıksın.',
    'Güncelleme notları admin panelinden eklenip Supabase update_notes tablosuna kaydedilsin.',
    'Bakım modu ekranında tahmini açılış metni admin tarafından değiştirilsin.'
  ]
};

const AUTH_USERS_KEY = 'hayatimizAuthUsers';
const AUTH_SESSION_KEY = 'hayatimizAuthSession';

function safeJsonParse(value, fallback) {
  try { return JSON.parse(value) ?? fallback; } catch { return fallback; }
}

function getSavedUsers() {
  if (typeof localStorage === 'undefined') return [];
  return safeJsonParse(localStorage.getItem(AUTH_USERS_KEY), []);
}

function saveUsers(users) {
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}

function getSavedSession() {
  if (typeof localStorage === 'undefined') return null;
  return safeJsonParse(localStorage.getItem(AUTH_SESSION_KEY), null);
}

function saveSession(session) {
  if (!session) localStorage.removeItem(AUTH_SESSION_KEY);
  else localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

async function callAuthApi(action, payload = {}) {
  const response = await fetch(`/api?action=${encodeURIComponent(action)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok === false) {
    throw new Error(data.error || 'Sunucu bağlantısı başarısız. Vercel ENV ve Supabase schema.sql kontrol edilmeli.');
  }
  return data;
}


const fixNotes = [
  'v2.1.3: Kayıt Ol formu artık Vercel API üzerinden Supabase public.site_users tablosuna kayıt gönderir.',
  'v2.1.3: Admin test şifresi arayüzden tamamen kaldırıldı; yönetici parolası Vercel ADMIN_PASSWORD ile kontrol edilir.',
  'v2.1.3: Yönetim Paneline Özellik Planı eklendi: eklenen özellikler, siteye gelmesi gerekenler, gözden kaçanlar ve admin önerileri tek ekranda toplandı.',
  'v2.1.3: Kullanıcı Kayıtları paneli eklendi; kayıtların Supabase tablosuna düşmesi için durum açıklaması eklendi.',
  'v2.1.3: schema.sql güncellendi; site_users, admin_feature_board, admin_suggestions ve v2.1.3 update_notes kayıtları eklendi.',
  'v2.1.3: Tek API dosyası korunur; Vercel Hobby 12 function sınırı aşılmaz.',
  'v2.1.2 Fix 1: Giriş yap / kayıt ol sistemi eklendi; ziyaretçi önce hesap ekranını görür.',
  'v2.1.2 Fix 1: Normal kullanıcı artık Yönetim Paneli, Test Merkezi, API Durumu ve Hata Raporları alanlarını göremez.',
  'v2.1.2 Fix 1: Bakım modu açıkken admin olmayan herkes animasyonlu bakım ekranında kalır.',
  'v2.1.2: Kullanıcıya görünmemesi gereken Test Merkezi, Hata Raporları, API Durumu, Bildirimler ve Yönetim Paneli ana kategori menüsünden kaldırıldı.',
  'Fix 4: Vercel Environment Variables eklendiği halde görünen yanlış API/Supabase uyarıları kaldırıldı.',
  'Fix 3: Yönetim Paneli sol menü butonları artık site kategorilerine kaçmaz; panel içinde sekme olarak açılır.',
  'Fix 2: Vercel Building ekranında dönüp kalma riskini azaltmak için temiz kaynak paketi hazırlandı.',
  'Fix 1: Ana sayfa, hero ve kategori butonları ayrı bölümlere bağlandı; sağa taşan büyük butonlar küçültüldü.'
];

function statusLabel(status) {
  return status === 'online' ? 'Bağlandı' : status === 'fallback' ? 'Yedek veri' : status === 'syncing' ? 'Çekiliyor' : 'Hazır';
}

function TopBar({ mobileOpen, setMobileOpen, query, setQuery, syncStatus, onRefresh, onAdmin, maintenanceMode, session, onOpenLogin, onOpenRegister, onLogout }) {
  const isAdmin = session?.role === 'admin';
  return (
    <header className="topbar">
      <div className="brand">
        <button type="button" className="iconBtn mobileOnly" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menü">
          {mobileOpen ? <X size={20}/> : <Menu size={20}/>} 
        </button>
        <div className="logoMark"><Gamepad2 size={23}/></div>
        <div><strong>Hayatımız Oyun</strong><span>{VERSION}</span></div>
      </div>
      <div className="searchBox">
        <Search size={17}/>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Oyun, bölüm, kategori veya koleksiyon ara..." disabled={maintenanceMode && !isAdmin} />
      </div>
      <div className="topActions">
        <button type="button" className={`syncPill ${syncStatus}`} onClick={onRefresh}><RefreshCcw size={15}/><span>{statusLabel(syncStatus)}</span></button>
        {maintenanceMode && <span className="maintenancePill"><Activity size={14}/> Bakım</span>}
        {!session && <button type="button" className="loginBtn" onClick={onOpenLogin}><LogIn size={15}/> Giriş Yap</button>}
        {!session && <button type="button" className="registerBtn" onClick={onOpenRegister}><UserPlus size={15}/> Kayıt Ol</button>}
        {isAdmin && <button type="button" className="adminAccessBtn" onClick={onAdmin}><ShieldCheck size={15}/> Yönetim</button>}
        {session && <div className="profilePill profileLogged"><div className="avatar"><UserRound size={18}/></div><div><strong>{session.name}</strong><span>{isAdmin ? 'Yönetici' : 'Kullanıcı'}</span></div><button type="button" onClick={onLogout} aria-label="Çıkış Yap"><LogOut size={15}/></button></div>}
      </div>
    </header>
  );
}

function CategoryRail({ active, setActive }) {
  return (
    <nav className="categoryRail" aria-label="Kategoriler">
      {categories.map((cat) => (
        <button type="button" key={cat} onClick={() => setActive(cat)} className={active === cat ? 'active' : ''}>{cat}</button>
      ))}
    </nav>
  );
}

function Hero({ config, analytics, health, syncStatus, testCenter, onNavigate }) {
  return (
    <section className="heroCard v211Hero">
      <div className="heroText">
        <span className="eyebrow"><Sparkles size={16}/> Supabase kayıt + admin plan paneli: {VERSION}</span>
        <h1>Kayıtlar Supabase tablosuna gider; admin panelinde eksik özellik planı ve öneri merkezi hazır.</h1>
        <p>{config?.heroText || fallbackConfig.heroText}</p>
        <div className="heroActions">
          <button type="button" className="primaryBtn" onClick={() => onNavigate('Popüler')}><PlayCircle size={17}/> Popüler Oyunlar</button>
          <button type="button" className="ghostBtn" onClick={() => onNavigate('Takvim')}><CalendarCheck size={17}/> Yayın Takvimi</button>
          <button type="button" className="ghostBtn" onClick={() => onNavigate('Koleksiyonlar')}><TrendingUp size={17}/> Koleksiyonlar</button>
          <button type="button" className="ghostBtn" onClick={() => onNavigate('Devam Eden')}><Timer size={17}/> Devam Edenler</button>
        </div>
      </div>
      <div className="heroStats smartStats">
        <div><strong>{testCenter?.overallScore || analytics.testScore || 96}</strong><span>Test skoru</span></div>
        <div><strong>{testCenter?.critical ?? analytics.criticalBugs ?? 0}</strong><span>Kritik hata</span></div>
        <div><strong>{health.total}</strong><span>Oyun</span></div>
        <div><strong>{statusLabel(syncStatus)}</strong><span>Veri durumu</span></div>
      </div>
    </section>
  );
}

function MiniDashboard({ analytics, health, notifications }) {
  const cards = [
    ['Test', `${analytics.testScore || 96}/100`, <ShieldCheck/>],
    ['Kritik', analytics.criticalBugs ?? 0, <AlertTriangle/>],
    ['Uyarı', analytics.warningBugs ?? 3, <Bell/>],
    ['Ekran', analytics.checkedScreens ?? 12, <Activity/>],
    ['Kalite', `${health.qualityAverage}/100`, <Gauge/>],
    ['Bildirim', notifications.length, <Zap/>]
  ];
  return <section className="statGrid">{cards.map(([label, value, icon]) => <article className="statCard" key={label}>{icon}<span>{label}</span><strong>{value}</strong></article>)}</section>;
}

function SmartFilter({ smartFilter, setSmartFilter, sortMode, setSortMode }) {
  const items = ['Tümü', 'Devam Ediyor', 'Tamamlandı', 'Yakında', 'Öncelikli', 'Haftalık', 'İzleniyor'];
  return (
    <section className="filterPanel">
      <div><SlidersHorizontal size={17}/><strong>Akıllı Filtre</strong></div>
      {items.map((item) => <button type="button" key={item} className={smartFilter === item ? 'active' : ''} onClick={() => setSmartFilter(item)}>{item}</button>)}
      <select value={sortMode} onChange={(event) => setSortMode(event.target.value)}>
        <option value="priority">Öncelik</option>
        <option value="quality">Kalite skoru</option>
        <option value="score">Puan</option>
        <option value="progress">İlerleme</option>
        <option value="az">A-Z</option>
      </select>
    </section>
  );
}

function GameGrid({ games, query, active, smartFilter, sortMode }) {
  const filtered = useMemo(() => {
    const lowered = query.trim().toLowerCase();
    const archiveCats = ['Ana Sayfa', 'Popüler', 'Tamamlanan', 'Devam Eden', 'Yakında', 'Korku', 'Aksiyon', 'Hikaye Odaklı'];
    return games
      .filter((game) => {
        const matchQuery = !lowered || [game.title, game.genre, game.status, game.priority, game.nextEpisode, ...(game.tags || [])].join(' ').toLowerCase().includes(lowered);
        const matchCategory = active === 'Ana Sayfa' || active === 'Popüler' || !archiveCats.includes(active)
          ? true
          : active === 'Tamamlanan' ? game.status === 'Tamamlandı'
          : active === 'Devam Eden' ? game.status === 'Devam Ediyor'
          : active === 'Yakında' ? game.status === 'Yakında'
          : (game.genre || '').includes(active) || (game.tags || []).includes(active);
        const matchSmart = smartFilter === 'Tümü' || game.status === smartFilter || game.priority === smartFilter || game.watchState === smartFilter;
        return matchQuery && matchCategory && matchSmart;
      })
      .sort((a, b) => {
        if (sortMode === 'quality') return Number(b.qualityScore || 0) - Number(a.qualityScore || 0);
        if (sortMode === 'score') return Number(b.score || 0) - Number(a.score || 0);
        if (sortMode === 'progress') return Number(b.progress || 0) - Number(a.progress || 0);
        if (sortMode === 'az') return a.title.localeCompare(b.title, 'tr');
        return String(a.priority || '').localeCompare(String(b.priority || ''), 'tr');
      });
  }, [games, query, active, smartFilter, sortMode]);

  return (
    <section className="sectionBlock">
      <div className="sectionTitle"><h2>Oyun Arşivi</h2><span><Filter size={14}/> {filtered.length} sonuç</span></div>
      <div className="gameGrid">
        {filtered.map(game => (
          <article className="gameCard" key={game.id || game.title}>
            <div className="cover" style={{ backgroundImage: `url(${game.cover})` }}><span>{game.status}</span><b>{game.priority}</b></div>
            <div className="gameBody">
              <h3>{game.title}</h3><p>{game.genre}</p>
              <div className="ratingLine"><span><Star size={13}/> {game.score}</span><span><Gauge size={13}/> %{game.progress}</span><span><ShieldCheck size={13}/> {game.qualityScore}</span></div>
              <div className="progressLine"><i style={{ width: `${game.progress || 0}%` }} /></div>
              <div className="meta"><span>{game.episodes} bölüm</span><span>{game.nextEpisode}</span><span>{game.source}</span></div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function TestCenter({ testCenter }) {
  return (
    <section className="sectionBlock testCenter">
      <div className="sectionTitle"><h2>Test Merkezi</h2><span><ShieldCheck size={14}/> {testCenter.status} • {testCenter.checkedAt}</span></div>
      <div className="testScore"><strong>{testCenter.overallScore}</strong><div><b>Genel test skoru</b><span>Kritik: {testCenter.critical} • Uyarı: {testCenter.warnings}</span></div></div>
      <div className="testGrid">{testCenter.modules.map((item) => <article className={`testCard ${String(item.state).toLowerCase()}`} key={item.name}><div><b>{item.name}</b><span>{item.state}</span></div><p>{item.note}</p></article>)}</div>
      <div className="eveningNotes">{testCenter.eveningNotes.map((note) => <span key={note}><CheckCircle2 size={14}/> {note}</span>)}</div>
    </section>
  );
}

function ErrorReports({ errorReports }) {
  return (
    <section className="sectionBlock">
      <div className="sectionTitle"><h2>Hata Raporları</h2><span><AlertTriangle size={14}/> Akşam test notları için hazır alan</span></div>
      <div className="errorGrid">{errorReports.map((item) => <article className={`errorCard ${item.level}`} key={item.title}><div><AlertTriangle size={18}/><b>{item.title}</b><span>{item.status}</span></div><p>{item.area}</p><em>{item.fix}</em></article>)}</div>
    </section>
  );
}

function ApiStatusPanel({ apiStatus }) {
  return (
    <section className="sectionBlock">
      <div className="sectionTitle"><h2>API / ENV Durumu</h2><span><Database size={14}/> Vercel keyleri güvenli sunucu tarafında</span></div>
      <div className="envInfoBox">
        <ShieldCheck size={20}/>
        <div><strong>Vercel içine eklediğin keyler tarayıcıdan okunmaz.</strong><p>Bu doğru davranış. <b>SUPABASE_URL</b>, <b>SUPABASE_SERVICE_ROLE_KEY</b>, <b>YOUTUBE_API_KEY</b>, <b>RAWG_API_KEY</b> ve <b>ADMIN_PASSWORD</b> hassas olduğu için sadece Vercel build/server ortamında tutulur. Arayüz testinde local JSON yeterlidir.</p></div>
      </div>
      <div className="apiGrid">{apiStatus.map((item) => <article className={`apiCard ${item.status}`} key={item.name}><strong>{item.name}</strong><span>{item.status}</span><p>{item.detail}</p></article>)}</div>
    </section>
  );
}

function ChecklistPanel({ qaChecklist, rollbackPlan }) {
  return (
    <section className="sectionBlock">
      <div className="sectionTitle"><h2>Deploy Checklist + Rollback</h2><span><FileDown size={14}/> Testten önce kontrol</span></div>
      <div className="checkGrid">
        {qaChecklist.map((group) => <article className="checkCard" key={group.group}><h3>{group.group}</h3>{group.items.map((item) => <p key={item}><CheckCircle2 size={14}/> {item}</p>)}</article>)}
        <article className="checkCard rollback"><h3>Geri Dönüş: {rollbackPlan.safeRollbackVersion}</h3>{rollbackPlan.steps.slice(0, 6).map((item) => <p key={item}><RefreshCcw size={14}/> {item}</p>)}</article>
      </div>
    </section>
  );
}

function ContinueWatching({ watchProgress, onAction = () => {} }) {
  return (
    <section className="sectionBlock">
      <div className="sectionTitle"><h2>Kaldığın Yerden Devam Et</h2><span><Timer size={14}/> izleme ilerleme sistemi</span></div>
      <div className="watchGrid">{watchProgress.map((item) => <article className="watchCard" key={item.title}><div><strong>{item.title}</strong><span>{item.episode} • {item.lastWatched}</span></div><div className="progressLine"><i style={{ width: `${item.percent}%` }} /></div><b>%{item.percent}</b><button type="button" onClick={() => onAction(`${item.title}: ${item.next} açıldı.`)}>{item.next}</button></article>)}</div>
    </section>
  );
}

function RecommendationPanel({ recommendations, onAction = () => {} }) {
  return (
    <section className="sectionBlock aiBlock">
      <div className="sectionTitle"><h2>AI Öneri Paneli</h2><span><BrainCircuit size={14}/> Etiket + puan + ilerleme analizi</span></div>
      <div className="recommendGrid">{recommendations.map((item) => <article className="recommendCard" key={item.title}><div className="aiIcon"><WandSparkles size={25}/></div><h3>{item.title}</h3><p>{item.reason}</p><div className="confidence"><span>Güven</span><b>%{item.confidence}</b></div><button type="button" onClick={() => onAction(`${item.title} önerisi seçildi.`)}>{item.action}</button></article>)}</div>
    </section>
  );
}

function NotificationCenter({ notifications }) {
  return (
    <section className="sectionBlock">
      <div className="sectionTitle"><h2>Bildirim Merkezi</h2><span><Bell size={14}/> Site ve arşiv uyarıları</span></div>
      <div className="notificationList">{notifications.map((item) => <article className={`notice ${item.level}`} key={item.title}><Bell size={18}/><div><strong>{item.title}</strong><p>{item.text}</p></div><span>{item.time}</span></article>)}</div>
    </section>
  );
}

function ScheduleCollections({ schedule, collections, roadmap }) {
  return (
    <>
      <section className="sectionBlock"><div className="sectionTitle"><h2>Yayın Takvimi</h2><span><CalendarCheck size={14}/> planlanan bölümler</span></div><div className="scheduleGrid">{schedule.map((item) => <article className="scheduleCard" key={`${item.day}-${item.title}`}><b>{item.day}</b><h3>{item.title}</h3><p>{item.episode}</p><span>{item.status}</span></article>)}</div></section>
      <section className="sectionBlock"><div className="sectionTitle"><h2>Koleksiyonlar ve Yol Haritası</h2><span><TrendingUp size={14}/> arşiv planı</span></div><div className="collectionGrid">{collections.map((item) => <article className="collectionCard" key={item.name}><div><b>{item.name}</b><span>{item.count}</span></div><p>{item.description}</p><em>{item.tag}</em></article>)}</div><div className="roadmap">{roadmap.slice(0,4).map((item) => <article key={item.version}><b>{item.version}</b><h3>{item.title}</h3><span>{item.status}</span></article>)}</div></section>
    </>
  );
}

function AdminTabIntro({ active, children }) {
  return <div className="adminTabTitle"><div><span>Aktif admin sekmesi</span><h2>{active}</h2><p>{children}</p></div><b>v2.1.3</b></div>;
}


function AdminFeatureBoard({ onAction = () => {} }) {
  const groups = [
    ['Eklenen Özellikler', adminFeatureBoard.added, Sparkles, 'added'],
    ['Siteye Gelmesi Gereken Özellikler', adminFeatureBoard.needed, Target, 'needed'],
    ['Gözden Kaçanlar', adminFeatureBoard.missed, EyeOff, 'missed'],
    ['Adminin Önerileri', adminFeatureBoard.adminIdeas, Lightbulb, 'ideas']
  ];
  return (
    <section className="sectionBlock featureBoardBlock">
      <div className="sectionTitle"><h2>Özellik Planı</h2><span><ClipboardList size={14}/> admin karar merkezi</span></div>
      <div className="featureBoardGrid">
        {groups.map(([title, items, Icon, tone]) => (
          <article className={`featureBoardCard ${tone}`} key={title}>
            <div className="cardHeader"><Icon/><strong>{title}</strong></div>
            <ul>{items.map((item) => <li key={item}><CheckCircle2/> {item}</li>)}</ul>
            <button type="button" className="ghostBtn" onClick={() => onAction(`${title} kontrol listesi açıldı.`)}>Kontrol Et</button>
          </article>
        ))}
      </div>
    </section>
  );
}

function AdminUsersPanel({ onAction = () => {} }) {
  const [health, setHealth] = useState(null);
  const [checking, setChecking] = useState(false);
  const check = async () => {
    setChecking(true);
    try {
      const data = await callAuthApi('health', {});
      setHealth(data);
      onAction(data.supabaseConfigured ? 'Supabase bağlantı bilgileri hazır. Kayıtlar site_users tablosuna düşer.' : 'Supabase ENV eksik görünüyor. Vercel değişkenlerini kontrol et.');
    } catch (error) {
      setHealth({ ok:false, error:error.message });
      onAction('API sağlık kontrolü alınamadı. Deploy ve ENV ayarlarını kontrol et.');
    } finally {
      setChecking(false);
    }
  };
  return (
    <section className="sectionBlock userTableBlock">
      <div className="sectionTitle"><h2>Kullanıcı Kayıtları</h2><span><Cloud size={14}/> Supabase public.site_users</span></div>
      <div className="userTableInfo">
        <article className="adminCard large"><div className="cardHeader"><UserCheck/><strong>Kayıt Akışı</strong></div><p>Kayıt Ol formu /api?action=register adresine gider. Vercel içindeki SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY ile Supabase REST API üzerinden public.site_users tablosuna kayıt eklenir.</p><ul><li><CheckCircle2/> Şifre düz metin kaydedilmez, SHA-256 hash + salt kaydedilir.</li><li><CheckCircle2/> Normal kullanıcı rolü user olarak düşer.</li><li><CheckCircle2/> Aynı e-posta tekrar kayıt olamaz.</li></ul></article>
        <article className="adminCard"><div className="cardHeader"><Database/><strong>Tablo Durumu</strong></div><p>{health ? (health.supabaseConfigured ? 'Vercel ENV hazır görünüyor.' : 'ENV eksik veya API ulaşamadı.') : 'Kontrol için butona bas.'}</p>{health?.error && <em>{health.error}</em>}<button type="button" className="primaryBtn" onClick={check} disabled={checking}>{checking ? 'Kontrol ediliyor...' : 'Supabase Bağlantısını Kontrol Et'}</button></article>
        <article className="adminCard"><div className="cardHeader"><ListChecks/><strong>Supabase’te Bakılacak Yer</strong></div><p>Supabase Dashboard → Table Editor → public.site_users tablosu. Yeni kayıtlar burada name, email, role ve created_at alanlarıyla görünür.</p></article>
      </div>
    </section>
  );
}

function AdminPanel({ health, analytics, games, updates, notifications, apiStatus, testCenter, errorReports, recommendations, watchProgress, schedule, collections, roadmap, themes, maintenanceMode, setMaintenanceMode, onAction }) {
  const [adminActive, setAdminActive] = useState('Genel Bakış');
  const adminTabs = [
    ['Genel Bakış', ShieldCheck], ['Oyunlar', Gamepad2], ['Kullanıcı Menüleri', Menu], ['Kullanıcı Kayıtları', UserCheck], ['Özellik Planı', ClipboardList], ['Test Merkezi', ShieldCheck], ['Hata Raporları', AlertTriangle],
    ['API/ENV Durumu', Database], ['AI Öneriler', BrainCircuit], ['İzleme İlerlemesi', Timer], ['Bildirim Merkezi', Bell],
    ['Takvim', CalendarCheck], ['Koleksiyonlar', TrendingUp], ['Export', Download], ['Bakım Modu', Activity], ['Ayarlar', Settings]
  ];

  const renderAdminContent = () => {
    if (adminActive === 'Oyunlar') return (
      <>
        <AdminTabIntro active="Oyunlar">Oyun ekleme, kapak kontrolü ve arşiv listeleme artık admin panelinin içinde açılır.</AdminTabIntro>
        <div className="adminMiniActions"><button type="button" onClick={() => onAction('Yeni oyun ekleme paneli hazırlandı.') }><Plus size={16}/> Yeni oyun ekle</button><button type="button" onClick={() => onAction('Kapak kontrolü başlatıldı.') }><ImagePlus size={16}/> Kapak kontrolü</button><button type="button" onClick={() => onAction('JSON yenileme simülasyonu tamamlandı.') }><RefreshCcw size={16}/> JSON yenile</button></div>
        <div className="adminGameList">{games.map((game) => <article key={game.id || game.title}><div><b>{game.title}</b><span>{game.genre}</span></div><p>{game.status} • {game.episodes} bölüm • {game.nextEpisode}</p><em>Kalite: {game.qualityScore} / İlerleme: %{game.progress}</em></article>)}</div>
      </>
    );
    if (adminActive === 'Kullanıcı Menüleri') return (
      <>
        <AdminTabIntro active="Kullanıcı Menüleri">Ana kategori menüsünde sadece kullanıcıya görünen bölümler kalır; admin/test/API sayfaları burada gizli listede tutulur.</AdminTabIntro>
        <div className="adminInternalGrid">
          <article className="adminCard large"><div className="cardHeader"><Menu/><strong>Görünen Ana Kategoriler</strong></div><ul>{categories.map((item) => <li key={item}><CheckCircle2/> {item}</li>)}</ul></article>
          <article className="adminCard large"><div className="cardHeader"><ShieldCheck/><strong>Menüden Kaldırılan Gizli Alanlar</strong></div><ul>{hiddenAdminPages.map((item) => <li key={item}><CheckCircle2/> {item}</li>)}</ul><p>Bu alanlar kullanıcının kategori menüsünde görünmez; yönetim panelinden erişilir.</p></article>
          <article className="adminCard"><div className="cardHeader"><Settings/><strong>Kategori Davranışı</strong></div><p>Yanlış sekmeye giden butonlar kapatıldı. Ana kategori butonları sadece kullanıcı sayfalarına gider.</p><button type="button" className="ghostBtn" onClick={() => onAction('Kullanıcı menüsü kontrol edildi: gizli alanlar ana kategorilerden kaldırıldı.')}>Kontrol Et</button></article>
        </div>
      </>
    );
    if (adminActive === 'Kullanıcı Kayıtları') return <><AdminTabIntro active="Kullanıcı Kayıtları">Yeni kayıtlar Supabase Dashboard içindeki public.site_users tablosuna düşer.</AdminTabIntro><AdminUsersPanel onAction={onAction}/></>;
    if (adminActive === 'Özellik Planı') return <><AdminTabIntro active="Özellik Planı">Eklenen özellikler, siteye gelmesi gerekenler, gözden kaçanlar ve admin önerileri tek panelde.</AdminTabIntro><AdminFeatureBoard onAction={onAction}/></>;
    if (adminActive === 'Test Merkezi') return <><AdminTabIntro active="Test Merkezi">Admin içinden açılan test modülü; artık dış sayfaya fırlamaz.</AdminTabIntro><TestCenter testCenter={testCenter}/></>;
    if (adminActive === 'Hata Raporları') return <><AdminTabIntro active="Hata Raporları">Fix 4 ile yanlış API/Supabase uyarıları temizlendi; gerçek arayüz hatalarını buradan takip et.</AdminTabIntro><ErrorReports errorReports={errorReports}/></>;
    if (adminActive === 'API/ENV Durumu') return <><AdminTabIntro active="API/ENV Durumu">Vercel keylerinin neden tarayıcıda görünmediğini ve local JSON durumunu admin içinde gör.</AdminTabIntro><ApiStatusPanel apiStatus={apiStatus}/></>;
    if (adminActive === 'AI Öneriler') return <><AdminTabIntro active="AI Öneriler">AI önerileri admin panelinin içinde açılır.</AdminTabIntro><RecommendationPanel recommendations={recommendations}/></>;
    if (adminActive === 'İzleme İlerlemesi') return <><AdminTabIntro active="İzleme İlerlemesi">Kaldığın yerden devam kayıtları admin içinde kalır.</AdminTabIntro><ContinueWatching watchProgress={watchProgress}/></>;
    if (adminActive === 'Bildirim Merkezi') return <><AdminTabIntro active="Bildirim Merkezi">Tüm bildirimler ayrı admin sekmesinde.</AdminTabIntro><NotificationCenter notifications={notifications}/></>;
    if (adminActive === 'Takvim') return <><AdminTabIntro active="Takvim">Yayın planı admin panelinden yönetilir.</AdminTabIntro><section className="sectionBlock"><div className="scheduleGrid">{schedule.map((item) => <article className="scheduleCard" key={`${item.day}-${item.title}`}><b>{item.day}</b><h3>{item.title}</h3><p>{item.episode}</p><span>{item.status}</span></article>)}</div></section></>;
    if (adminActive === 'Koleksiyonlar') return <><AdminTabIntro active="Koleksiyonlar">Koleksiyonlar ve yol haritası admin içinde.</AdminTabIntro><section className="sectionBlock"><div className="collectionGrid">{collections.map((item) => <article className="collectionCard" key={item.name}><div><b>{item.name}</b><span>{item.count}</span></div><p>{item.description}</p><em>{item.tag}</em></article>)}</div><div className="roadmap">{roadmap.map((item) => <article key={item.version}><b>{item.version}</b><h3>{item.title}</h3><span>{item.status}</span></article>)}</div></section></>;
    if (adminActive === 'Export') return (
      <>
        <AdminTabIntro active="Export">Backup ve dışa aktarma butonları artık admin içinde çalışır.</AdminTabIntro>
        <div className="adminInternalGrid">
          {['Oyun listesini dışa aktar', 'Güncelleme notlarını indir', 'Test raporunu indir', 'Rollback notunu kopyala'].map((item) => <article className="adminCard" key={item}><div className="cardHeader"><Download/><strong>{item}</strong></div><p>Statik test sürümü: işlem panel içinde simüle edilir, dış sayfaya yönlendirme yapmaz.</p><button type="button" className="ghostBtn" onClick={() => onAction(`${item} hazırlandı.`)}>Hazırla</button></article>)}
        </div>
      </>
    );
    if (adminActive === 'Bakım Modu') return (
      <>
        <AdminTabIntro active="Bakım Modu">Bakım modu kullanıcı tarafını kilitler; yönetim paneli ve test alanları erişilebilir kalır.</AdminTabIntro>
        <div className="maintenanceControl">
          <div><Activity size={28}/><h3>Bakım Modu: {maintenanceMode ? 'Açık' : 'Kapalı'}</h3><p>{maintenanceMode ? 'Kullanıcılar bakım ekranını görür. Admin panelinden düzenleme yapabilirsin.' : 'Site kullanıcılar için normal şekilde yayında.'}</p></div>
          <button type="button" className={maintenanceMode ? 'dangerBtn' : 'primaryBtn'} onClick={() => { setMaintenanceMode(!maintenanceMode); onAction(!maintenanceMode ? 'Bakım modu açıldı. Kullanıcı tarafı bakım ekranına alınır.' : 'Bakım modu kapatıldı. Site kullanıcı tarafına açıldı.'); }}>{maintenanceMode ? 'Bakım Modunu Kapat' : 'Bakım Modunu Aç'}</button>
        </div>
        <div className="adminInternalGrid">
          {[
            ['Kullanıcı ekranı', maintenanceMode ? 'Bakım sayfası gösterilir' : 'Normal site gösterilir'],
            ['Yönetim paneli', 'Her zaman erişilebilir'],
            ['Otomatik çekme', 'Bakımda güvenli bekleme modunda'],
            ['Fallback veri', 'Local JSON ile site bozulmadan açılır']
          ].map(([title, text]) => <article className="adminCard" key={title}><div className="cardHeader"><Activity/><strong>{title}</strong></div><p>{text}</p><button type="button" className="ghostBtn" onClick={() => onAction(`${title}: ${text}`)}>Durumu Göster</button></article>)}
        </div>
      </>
    );
    if (adminActive === 'Ayarlar') return (
      <>
        <AdminTabIntro active="Ayarlar">Tema presetleri, profil ve genel ayarlar için güvenli alan.</AdminTabIntro>
        <div className="adminInternalGrid">
          <article className="adminCard large"><div className="cardHeader"><Palette/><strong>Tema Presetleri</strong></div><ul>{themes.map((theme) => <li key={theme.key || theme.name}><CheckCircle2/> {theme.name} - {theme.description}</li>)}</ul></article>
          <article className="adminCard"><div className="cardHeader"><UserRound/><strong>Profil</strong></div><p>Profil fotoğrafı ve kullanıcı adı alanı buradan düzenlenecek.</p></article>
          <article className="adminCard"><div className="cardHeader"><Settings/><strong>Genel Ayarlar</strong></div><p>Site başlığı, sosyal medya ikonları ve görünür menüler burada toplanır.</p></article>
        </div>
      </>
    );

    return (
      <>
        <AdminTabIntro active="Genel Bakış">Panel içi sekme sistemi aktif. Artık butonlar başka yere açılmaz.</AdminTabIntro>
        <div className="adminMiniActions">
          <button type="button" onClick={() => setAdminActive('Oyunlar')}><Gamepad2 size={16}/> Oyunlar</button>
          <button type="button" onClick={() => setAdminActive('Kullanıcı Menüleri')}><Menu size={16}/> Kullanıcı Menüleri</button>
          <button type="button" onClick={() => setAdminActive('Kullanıcı Kayıtları')}><UserCheck size={16}/> Kullanıcı Kayıtları</button>
          <button type="button" onClick={() => setAdminActive('Özellik Planı')}><ClipboardList size={16}/> Özellik Planı</button>
          <button type="button" onClick={() => setAdminActive('Test Merkezi')}><ShieldCheck size={16}/> Test Merkezi</button>
          <button type="button" onClick={() => setAdminActive('Hata Raporları')}><AlertTriangle size={16}/> Hata Raporları</button>
          <button type="button" onClick={() => setAdminActive('API/ENV Durumu')}><Database size={16}/> API/ENV</button>
        </div>
        <div className="adminGrid">
          <div className="adminCard large"><div className="cardHeader"><ImagePlus/><strong>Kapak / Profil Fotoğrafı</strong></div><div className="uploadBox"><UploadCloud size={34}/><span>Dosya seç veya sürükle</span></div><p>Fotoğraf yükleme arayüzü korunur; dış sayfaya yönlendirme yok.</p></div>
          <div className="adminCard"><div className="cardHeader"><ShieldCheck/><strong>Test Merkezi</strong></div><p>Skor: <b>{testCenter.overallScore}/100</b></p><ul><li><CheckCircle2/> Kritik hata: {testCenter.critical}</li><li><CheckCircle2/> Uyarı: {testCenter.warnings}</li></ul></div>
          <div className="adminCard healthCard"><div className="cardHeader"><Activity/><strong>Sağlık Özeti</strong></div><div className="healthGrid"><span>{health.total}<small>Toplam</small></span><span>{health.missingCover}<small>Eksik kapak</small></span><span>{health.duplicates}<small>Kopya</small></span><span>{health.missingEpisodes}<small>Bölüm hatası</small></span></div></div>
          <div className="adminCard"><div className="cardHeader"><Database/><strong>API / ENV</strong></div><ul>{apiStatus.slice(0,4).map((item) => <li key={item.name}><CheckCircle2/> {item.name}: {item.status}</li>)}</ul></div>
          <div className="adminCard"><div className="cardHeader"><Bell/><strong>Bildirimler</strong></div><p>{notifications.length} aktif uyarı var.</p><ul>{notifications.slice(0,3).map((item) => <li key={item.title}><CheckCircle2/> {item.title}</li>)}</ul></div>
          <div className="adminCard"><div className="cardHeader"><Gauge/><strong>Arşiv Kalitesi</strong></div><p>Ortalama kalite: <b>{health.qualityAverage}/100</b></p><p>Test skoru: <b>{analytics.testScore || 96}/100</b></p></div>
          <div className="adminCard wide"><div className="cardHeader"><Sparkles/><strong>Güncelleme Notları</strong></div><ul>{updates.slice(0,5).map((note) => <li key={note.version}><CheckCircle2/> {note.version} - {note.title}</li>)}</ul></div>
        </div>
      </>
    );
  };

  return (
    <section className="adminShell adminShellFix3">
      <aside className="adminSide">
        <div className="adminHead"><ShieldCheck/><div><strong>Yönetim Paneli</strong><span>{VERSION}</span></div></div>
        {adminTabs.map(([item, Icon]) => <button type="button" key={item} onClick={() => setAdminActive(item)} className={adminActive === item ? 'active' : ''}><Icon size={15}/><span>{item}</span></button>)}
      </aside>
      <div className="adminMain">
        <div className="adminTop">
          <div><h2>Yönetim Paneli</h2><p>v2.1.3 ile Supabase kullanıcı kayıtları, güncelleme notları ve admin özellik planı eklendi.</p></div>
          <button type="button" className="primaryBtn" onClick={() => setAdminActive('Bakım Modu')}><Activity size={17}/> Bakım Modu</button>
        </div>
        {renderAdminContent()}
      </div>
    </section>
  );
}

function FeatureNotes(){
  return (
    <section className="sectionBlock">
      <div className="sectionTitle"><h2>v2.1.3 Özellikleri</h2><span><Sparkles size={14}/> güncellenmiş sürüm notları</span></div>
      <div className="fixList">{fixNotes.map((item)=><div className="fixItem" key={item}><CheckCircle2 size={18}/><span>{item}</span></div>)}</div>
      <div className="warningBox"><AlertTriangle/><p>Bu sürüm Supabase kullanıcı kayıtlarını, gizli admin şifre alanını ve yönetim paneli özellik planını ekler.</p></div>
    </section>
  );
}


function MaintenancePage({ isAdmin, onAdmin }) {
  return (
    <section className="maintenancePage animatedMaintenance">
      <div className="maintenanceGlow" />
      <div className="maintenanceOrbit"><Gamepad2 size={42}/></div>
      <div className="maintenanceCard">
        <span className="eyebrow"><Activity size={16}/> Bakım Modu Aktif</span>
        <h1>Hayatımız Oyun kısa süreli bakımda.</h1>
        <p>Arayüz, butonlar ve kullanıcı hesap sistemi düzenleniyor. Normal kullanıcılar bu ekrandan çıkamaz; yönetici paneli sadece admin girişinde açık kalır.</p>
        <div className="maintenanceSteps">
          <span><CheckCircle2 size={15}/> Giriş / kayıt kontrolü</span>
          <span><CheckCircle2 size={15}/> Gizli alan kilidi</span>
          <span><CheckCircle2 size={15}/> Buton testi</span>
        </div>
        {isAdmin && <button type="button" className="primaryBtn" onClick={onAdmin}><ShieldCheck size={17}/> Yönetim Paneline Git</button>}
      </div>
    </section>
  );
}


function AuthLanding({ onOpenLogin, onOpenRegister }) {
  return (
    <section className="authLanding">
      <div className="authGlow" />
      <div className="authHeroCard">
        <span className="eyebrow"><LockKeyhole size={16}/> Giriş sistemi aktif</span>
        <h1>Arşive giriş yap veya yeni kullanıcı hesabı oluştur.</h1>
        <p>v2.1.3 ile kayıtlar Supabase public.site_users tablosuna düşer. Admin parolası ekranda gösterilmez ve Vercel ENV üzerinden kontrol edilir.</p>
        <div className="heroActions authActions">
          <button type="button" className="primaryBtn" onClick={onOpenLogin}><LogIn size={17}/> Giriş Yap</button>
          <button type="button" className="ghostBtn" onClick={onOpenRegister}><UserPlus size={17}/> Kayıt Ol</button>
        </div>
        <div className="authInfoGrid">
          <span><CheckCircle2 size={15}/> Kullanıcı menüsü ayrı</span>
          <span><CheckCircle2 size={15}/> Admin paneli kilitli</span>
          <span><CheckCircle2 size={15}/> Kayıtlar Supabase tablosuna gider</span>
        </div>
      </div>
    </section>
  );
}

function AuthModal({ mode, onClose, onLoginSuccess, onAction }) {
  const [tab, setTab] = useState(mode === 'register' ? 'register' : 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiNote, setApiNote] = useState('');

  useEffect(() => { setTab(mode === 'register' ? 'register' : 'login'); setError(''); }, [mode]);

  const submit = async (event) => {
    event.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim() || cleanEmail.split('@')[0] || 'Kullanıcı';
    if (!cleanEmail || !password) { setError('E-posta/kullanıcı adı ve şifre gir.'); return; }
    setError('');
    setApiNote('');
    setLoading(true);
    try {
      if (tab === 'admin') {
        const result = await callAuthApi('admin-login', { username: cleanEmail, password });
        const session = result.session || { name: 'Admin', email: cleanEmail, role: 'admin' };
        saveSession(session); onLoginSuccess(session); onAction('Yönetici girişi başarılı. Yönetim Paneli açıldı.'); onClose();
        return;
      }

      if (tab === 'register') {
        const result = await callAuthApi('register', { name: cleanName, email: cleanEmail, password });
        const user = result.user || { name: cleanName, email: cleanEmail, role: 'user' };
        const users = getSavedUsers();
        if (!users.some((item) => item.email === user.email)) saveUsers([...users, { ...user, password: '__supabase__' }]);
        const session = { name: user.name, email: user.email, role: user.role || 'user' };
        saveSession(session); onLoginSuccess(session); onAction('Kayıt başarılı. Supabase site_users tablosuna gönderildi.'); onClose();
        return;
      }

      const result = await callAuthApi('login', { email: cleanEmail, password });
      const user = result.user || { name: cleanEmail.split('@')[0], email: cleanEmail, role: 'user' };
      const session = { name: user.name, email: user.email, role: user.role || 'user' };
      saveSession(session); onLoginSuccess(session); onAction('Giriş başarılı. Kullanıcı arşivi açıldı.'); onClose();
    } catch (apiError) {
      if (tab !== 'admin') {
        const users = getSavedUsers();
        if (tab === 'login') {
          const found = users.find((user) => user.email === cleanEmail && user.password === password);
          if (found) {
            const session = { name: found.name, email: found.email, role: 'user' };
            saveSession(session); onLoginSuccess(session); onAction('Giriş local yedek kayıtla açıldı. Supabase bağlantısını sonra kontrol et.'); onClose();
            return;
          }
        }
      }
      setError(apiError.message || 'İşlem başarısız. Supabase schema.sql ve Vercel ENV kontrol edilmeli.');
      setApiNote('Not: Kayıtların Supabase tablosuna düşmesi için supabase/schema.sql çalıştırılmış olmalı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authModalBackdrop" role="dialog" aria-modal="true">
      <form className="authModal" onSubmit={submit}>
        <button type="button" className="modalClose" onClick={onClose} aria-label="Kapat"><X size={18}/></button>
        <div className="authTabs">
          <button type="button" className={tab === 'login' ? 'active' : ''} onClick={() => setTab('login')}><LogIn size={15}/> Giriş</button>
          <button type="button" className={tab === 'register' ? 'active' : ''} onClick={() => setTab('register')}><UserPlus size={15}/> Kayıt</button>
          <button type="button" className={tab === 'admin' ? 'active' : ''} onClick={() => setTab('admin')}><ShieldCheck size={15}/> Admin</button>
        </div>
        <h2>{tab === 'register' ? 'Kayıt Ol' : tab === 'admin' ? 'Yönetici Girişi' : 'Giriş Yap'}</h2>
        <p>{tab === 'admin' ? 'Admin parolası ekranda gösterilmez; Vercel ADMIN_PASSWORD ile kontrol edilir.' : 'Kayıtlar Supabase public.site_users tablosuna gönderilir.'}</p>
        {tab === 'register' && <label>Ad Soyad<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Örn: Mevlüt" /></label>}
        <label>{tab === 'admin' ? 'Admin kullanıcı adı' : 'E-posta'}<input value={email} onChange={(event) => setEmail(event.target.value)} placeholder={tab === 'admin' ? 'Yönetici kullanıcı adı' : 'ornek@mail.com'} /></label>
        <label>Şifre<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={tab === 'admin' ? 'Admin şifresi' : 'Şifre'} /></label>
        {error && <div className="authError"><AlertTriangle size={15}/> {error}</div>}
        {apiNote && <div className="authNote"><Database size={15}/> {apiNote}</div>}
        <button type="submit" className="primaryBtn authSubmit" disabled={loading}>{tab === 'register' ? <UserPlus size={17}/> : tab === 'admin' ? <ShieldCheck size={17}/> : <LogIn size={17}/>} {loading ? 'İşleniyor...' : tab === 'register' ? 'Kayıt Ol' : tab === 'admin' ? 'Admin Girişi' : 'Giriş Yap'}</button>
      </form>
    </div>
  );
}

function AccessDenied({ onOpenLogin }) {
  return (
    <section className="sectionBlock accessDenied">
      <LockKeyhole size={38}/>
      <h2>Bu alan kullanıcıya kapalı.</h2>
      <p>Yönetim, test, API ve hata raporları sadece admin girişinden sonra görünür.</p>
      <button type="button" className="primaryBtn" onClick={onOpenLogin}><ShieldCheck size={17}/> Admin girişi yap</button>
    </section>
  );
}

function ActionToast({ message, onClose }) {
  if (!message) return null;
  return <div className="actionToast"><CheckCircle2 size={17}/><span>{message}</span><button type="button" onClick={onClose}>Tamam</button></div>;
}

function App(){
  const [query,setQuery]=useState('');
  const [active,setActive]=useState('Ana Sayfa');
  const [mobileOpen,setMobileOpen]=useState(false);
  const [syncStatus,setSyncStatus]=useState('syncing');
  const [maintenanceMode,setMaintenanceModeState]=useState(() => localStorage.getItem('hayatimizMaintenanceMode') === '1');
  const [actionMessage,setActionMessage]=useState('');
  const [authMode,setAuthMode]=useState(null);
  const [session,setSession]=useState(() => getSavedSession());
  const [smartFilter,setSmartFilter]=useState('Tümü');
  const [sortMode,setSortMode]=useState('priority');
  const [data,setData]=useState({ games:fallbackGames, updates:fallbackUpdates, config:fallbackConfig, syncLog:fallbackSyncLog, analytics:fallbackAnalytics, schedule:fallbackSchedule, collections:fallbackCollections, recommendations:fallbackRecommendations, notifications:fallbackNotifications, themes:fallbackThemes, watchProgress:fallbackWatchProgress, roadmap:fallbackRoadmap, testCenter:fallbackTestCenter, qaChecklist:fallbackQaChecklist, errorReports:fallbackErrorReports, apiStatus:fallbackApiStatus, rollbackPlan:fallbackRollbackPlan });
  const isAdmin = session?.role === 'admin';
  const isLoggedIn = Boolean(session);
  const refresh=async()=>{setSyncStatus('syncing'); const next=await loadAutoData(); setData(next); setSyncStatus(next.status);};
  const setMaintenanceMode=(value)=>{setMaintenanceModeState(value); localStorage.setItem('hayatimizMaintenanceMode', value ? '1' : '0');};
  const showAction=(message)=>{setActionMessage(message); window.clearTimeout(window.__hayatimizToastTimer); window.__hayatimizToastTimer=window.setTimeout(()=>setActionMessage(''), 3200);};
  const openLogin=()=>setAuthMode('login');
  const openRegister=()=>setAuthMode('register');
  const handleLogout=()=>{saveSession(null); setSession(null); setActive('Ana Sayfa'); showAction('Çıkış yapıldı. Gizli alanlar kapatıldı.');};
  const goAdmin=()=>{ if (isAdmin) setActive('Yönetim Paneli'); else setAuthMode('login'); };
  useEffect(()=>{refresh();},[]);
  const health=useMemo(()=>analyzeGameHealth(data.games),[data.games]);

  const PageContent = () => {
    if (!isLoggedIn) return <AuthLanding onOpenLogin={openLogin} onOpenRegister={openRegister}/>;
    if (maintenanceMode && !isAdmin) return <MaintenancePage isAdmin={false} onAdmin={goAdmin}/>;
    if (active === 'Yönetim Paneli' && !isAdmin) return <AccessDenied onOpenLogin={openLogin}/>;
    if (active === 'Test Merkezi' || active === 'Hata Raporları' || active === 'API Durumu' || active === 'AI Öneriler' || active === 'Bildirimler') return <AccessDenied onOpenLogin={openLogin}/>;
    if (active === 'Kaldığın Yerden') return <ContinueWatching watchProgress={data.watchProgress} onAction={showAction}/>;
    if (active === 'Takvim' || active === 'Koleksiyonlar') return <ScheduleCollections schedule={data.schedule} collections={data.collections} roadmap={data.roadmap}/>;
    if (active === 'Yönetim Paneli') return <AdminPanel health={health} analytics={data.analytics} games={data.games} updates={data.updates} notifications={data.notifications} apiStatus={data.apiStatus} testCenter={data.testCenter} errorReports={data.errorReports} recommendations={data.recommendations} watchProgress={data.watchProgress} schedule={data.schedule} collections={data.collections} roadmap={data.roadmap} themes={data.themes} maintenanceMode={maintenanceMode} setMaintenanceMode={setMaintenanceMode} onAction={showAction}/>;
    return <>
      <Hero config={data.config} analytics={data.analytics} health={health} syncStatus={syncStatus} testCenter={data.testCenter} onNavigate={setActive}/>
      <MiniDashboard analytics={data.analytics} health={health} notifications={data.notifications}/>
      {active === 'Ana Sayfa' && <><ContinueWatching watchProgress={data.watchProgress} onAction={showAction}/><RecommendationPanel recommendations={data.recommendations} onAction={showAction}/></>}
      <SmartFilter smartFilter={smartFilter} setSmartFilter={setSmartFilter} sortMode={sortMode} setSortMode={setSortMode}/>
      <GameGrid games={data.games} query={query} active={active} smartFilter={smartFilter} sortMode={sortMode}/>
      {active === 'Ana Sayfa' && <FeatureNotes/>}
    </>;
  };

  return <>
    <TopBar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} query={query} setQuery={setQuery} syncStatus={syncStatus} onRefresh={refresh} onAdmin={goAdmin} maintenanceMode={maintenanceMode} session={session} onOpenLogin={openLogin} onOpenRegister={openRegister} onLogout={handleLogout}/>
    {isLoggedIn && (!maintenanceMode || isAdmin) && <CategoryRail active={active} setActive={setActive}/>}    
    <main className="pageWrap"><PageContent/></main>
    {authMode && <AuthModal mode={authMode} onClose={() => setAuthMode(null)} onLoginSuccess={setSession} onAction={showAction}/>}    
    <ActionToast message={actionMessage} onClose={() => setActionMessage('')}/>
  </>;
}

createRoot(document.getElementById('root')).render(<App/>);
