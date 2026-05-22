import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Activity, AlertTriangle, Bell, BrainCircuit, CalendarCheck, CheckCircle2, Command, Database, Download, FileDown, Filter, Gamepad2, Gauge, ImagePlus, Menu, Palette, PlayCircle, Plus, RefreshCcw, Search, Settings, ShieldCheck, SlidersHorizontal, Sparkles, Star, Timer, TrendingUp, UploadCloud, UserRound, WandSparkles, X, Zap } from 'lucide-react';
import './styles.css';
import { loadAutoData, fallbackGames, fallbackUpdates, fallbackConfig, fallbackSyncLog, fallbackAnalytics, fallbackSchedule, fallbackCollections, fallbackRecommendations, fallbackNotifications, fallbackThemes, fallbackWatchProgress, fallbackRoadmap, fallbackTestCenter, fallbackQaChecklist, fallbackErrorReports, fallbackApiStatus, fallbackRollbackPlan, analyzeGameHealth } from './services/autoFetch.js';

const VERSION = 'v2.1.1 Fix 4';

const categories = [
  'Ana Sayfa', 'Test Merkezi', 'Hata Raporları', 'API Durumu', 'Kaldığın Yerden', 'AI Öneriler',
  'Popüler', 'Tamamlanan', 'Devam Eden', 'Yakında', 'Korku', 'Aksiyon', 'Hikaye Odaklı',
  'Takvim', 'Koleksiyonlar', 'Bildirimler', 'Yönetim Paneli'
];

const fixNotes = [
  'Fix 4: Vercel Environment Variables eklendiği halde görünen yanlış API/Supabase uyarıları kaldırıldı.',
  'Fix 4: API/ENV paneli artık gizli Vercel keylerini tarayıcıdan okumaya çalışmaz; server tarafında saklandığını açıkça gösterir.',
  'Fix 4: Hata Raporları bölümündeki “Gerçek API anahtarı yok” ve “Supabase şema çalıştırılmadı” yanlış uyarıları düzeltildi.',
  'Fix 4: Test Merkezi ENV durumu “Vercel’de tanımlı / sunucu tarafında güvenli” mantığıyla güncellendi.',
  'Fix 4: Supabase zorunlu uyarısı kaldırıldı; arayüz testinde local JSON/fallback sisteminin yeterli olduğu belirtildi.',
  'Fix 3: Yönetim Paneli sol menü butonları artık site kategorilerine kaçmaz; panel içinde sekme olarak açılır.',
  'Fix 3: Oyunlar, Test Merkezi, Hata Raporları, API/ENV Durumu, AI Öneriler, Bildirim Merkezi, Takvim, Koleksiyonlar, Export, Bakım Modu ve Ayarlar ayrı admin sekmesi oldu.',
  'Fix 3: Yönetim Paneli içindeki ana aksiyon butonları dış sayfaya atmak yerine ilgili admin modülünü açar.',
  'Fix 3: Aktif admin sekmesi görsel olarak işaretlenir; hangi butona basıldığını panel başlığında gösterir.',
  'Fix 3: Admin grid taşmaları azaltıldı; butonlar küçük, kontrollü ve satır içinde kırılabilir hale getirildi.',
  'Fix 3: Vercel Building temizliği korundu; node_modules, package-lock ve serverless API klasörü yok.',
  'Fix 3: Vercel Hobby sınırı güvenli; deploy statik Vite build olarak çalışır.',
  'Fix 3: Supabase zorunlu değil; arayüz local JSON fallback ile açılır.',
  'Fix 2: Vercel Building ekranında dönüp kalma riskini azaltmak için temiz kaynak paketi hazırlandı.',
  'Fix 1: Ana sayfa, hero ve kategori butonları ayrı bölümlere bağlandı; sağa taşan büyük butonlar küçültüldü.'
];

function statusLabel(status) {
  return status === 'online' ? 'Bağlandı' : status === 'fallback' ? 'Yedek veri' : status === 'syncing' ? 'Çekiliyor' : 'Hazır';
}

function TopBar({ mobileOpen, setMobileOpen, query, setQuery, syncStatus, onRefresh }) {
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
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Oyun, bölüm, hata, test maddesi veya API durumu ara..." />
      </div>
      <div className="topActions">
        <button type="button" className={`syncPill ${syncStatus}`} onClick={onRefresh}><RefreshCcw size={15}/><span>{statusLabel(syncStatus)}</span></button>
        <div className="profilePill"><div className="avatar"><UserRound size={18}/></div><div><strong>Profil</strong><span>Fix 4 hazır</span></div></div>
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
        <span className="eyebrow"><Sparkles size={16}/> Vercel ENV panel fix: {VERSION}</span>
        <h1>Vercel keyleri eklenmişse artık yanlış uyarı göstermez; API/ENV durumu güvenli şekilde açıklanır.</h1>
        <p>{config?.heroText || fallbackConfig.heroText}</p>
        <div className="heroActions">
          <button type="button" className="primaryBtn" onClick={() => onNavigate('Yönetim Paneli')}><Command size={17}/> Yönetim Paneli</button>
          <button type="button" className="ghostBtn" onClick={() => onNavigate('Test Merkezi')}><ShieldCheck size={17}/> Test Merkezi</button>
          <button type="button" className="ghostBtn" onClick={() => onNavigate('Hata Raporları')}><AlertTriangle size={17}/> Hata Raporları</button>
          <button type="button" className="ghostBtn" onClick={() => onNavigate('API Durumu')}><Database size={17}/> API Durumu</button>
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

function ContinueWatching({ watchProgress }) {
  return (
    <section className="sectionBlock">
      <div className="sectionTitle"><h2>Kaldığın Yerden Devam Et</h2><span><Timer size={14}/> izleme ilerleme sistemi</span></div>
      <div className="watchGrid">{watchProgress.map((item) => <article className="watchCard" key={item.title}><div><strong>{item.title}</strong><span>{item.episode} • {item.lastWatched}</span></div><div className="progressLine"><i style={{ width: `${item.percent}%` }} /></div><b>%{item.percent}</b><button type="button">{item.next}</button></article>)}</div>
    </section>
  );
}

function RecommendationPanel({ recommendations }) {
  return (
    <section className="sectionBlock aiBlock">
      <div className="sectionTitle"><h2>AI Öneri Paneli</h2><span><BrainCircuit size={14}/> Etiket + puan + ilerleme analizi</span></div>
      <div className="recommendGrid">{recommendations.map((item) => <article className="recommendCard" key={item.title}><div className="aiIcon"><WandSparkles size={25}/></div><h3>{item.title}</h3><p>{item.reason}</p><div className="confidence"><span>Güven</span><b>%{item.confidence}</b></div><button type="button">{item.action}</button></article>)}</div>
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
  return <div className="adminTabTitle"><div><span>Aktif admin sekmesi</span><h2>{active}</h2><p>{children}</p></div><b>Fix 4</b></div>;
}

function AdminPanel({ health, analytics, games, updates, notifications, apiStatus, testCenter, errorReports, recommendations, watchProgress, schedule, collections, roadmap, themes }) {
  const [adminActive, setAdminActive] = useState('Genel Bakış');
  const adminTabs = [
    ['Genel Bakış', ShieldCheck], ['Oyunlar', Gamepad2], ['Test Merkezi', ShieldCheck], ['Hata Raporları', AlertTriangle],
    ['API/ENV Durumu', Database], ['AI Öneriler', BrainCircuit], ['İzleme İlerlemesi', Timer], ['Bildirim Merkezi', Bell],
    ['Takvim', CalendarCheck], ['Koleksiyonlar', TrendingUp], ['Export', Download], ['Bakım Modu', Activity], ['Ayarlar', Settings]
  ];

  const renderAdminContent = () => {
    if (adminActive === 'Oyunlar') return (
      <>
        <AdminTabIntro active="Oyunlar">Oyun ekleme, kapak kontrolü ve arşiv listeleme artık admin panelinin içinde açılır.</AdminTabIntro>
        <div className="adminMiniActions"><button type="button"><Plus size={16}/> Yeni oyun ekle</button><button type="button"><ImagePlus size={16}/> Kapak kontrolü</button><button type="button"><RefreshCcw size={16}/> JSON yenile</button></div>
        <div className="adminGameList">{games.map((game) => <article key={game.id || game.title}><div><b>{game.title}</b><span>{game.genre}</span></div><p>{game.status} • {game.episodes} bölüm • {game.nextEpisode}</p><em>Kalite: {game.qualityScore} / İlerleme: %{game.progress}</em></article>)}</div>
      </>
    );
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
          {['Oyun listesini dışa aktar', 'Güncelleme notlarını indir', 'Test raporunu indir', 'Rollback notunu kopyala'].map((item) => <article className="adminCard" key={item}><div className="cardHeader"><Download/><strong>{item}</strong></div><p>Statik test sürümü: işlem panel içinde simüle edilir, dış sayfaya yönlendirme yapmaz.</p><button type="button" className="ghostBtn">Hazırla</button></article>)}
        </div>
      </>
    );
    if (adminActive === 'Bakım Modu') return (
      <>
        <AdminTabIntro active="Bakım Modu">Bakım modu, otomatik çekme kilidi ve test modu kontrolü tek yerde.</AdminTabIntro>
        <div className="adminInternalGrid">
          {['Bakım modu kapalı', 'Test modu açık', 'Otomatik çekme güvenli', 'Fallback veri aktif'].map((item) => <article className="adminCard" key={item}><div className="cardHeader"><Activity/><strong>{item}</strong></div><p>Bu kart sadece admin içinde açılır. Butonlar dış kategoriye geçmez.</p><button type="button" className="ghostBtn">Durumu değiştir</button></article>)}
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
          <div><h2>Yönetim Paneli</h2><p>Fix 4 ile admin buton fixleri korunur; API/ENV uyarıları artık doğru mantıkla gösterilir.</p></div>
          <button type="button" className="primaryBtn" onClick={() => setAdminActive('Oyunlar')}><Plus size={17}/> Oyunları Aç</button>
        </div>
        {renderAdminContent()}
      </div>
    </section>
  );
}

function FeatureNotes(){
  return (
    <section className="sectionBlock">
      <div className="sectionTitle"><h2>Fix 3 Özellikleri</h2><span><Sparkles size={14}/> son güncelleme notları</span></div>
      <div className="fixList">{fixNotes.map((item)=><div className="fixItem" key={item}><CheckCircle2 size={18}/><span>{item}</span></div>)}</div>
      <div className="warningBox"><AlertTriangle/><p>Bu sürüm özellikle Yönetim Paneli butonlarını düzeltir. Sol menü artık site kategorilerine yönlendirme yapmaz; panel içinde sekme değiştirir.</p></div>
    </section>
  );
}

function App(){
  const [query,setQuery]=useState('');
  const [active,setActive]=useState('Ana Sayfa');
  const [mobileOpen,setMobileOpen]=useState(false);
  const [syncStatus,setSyncStatus]=useState('syncing');
  const [smartFilter,setSmartFilter]=useState('Tümü');
  const [sortMode,setSortMode]=useState('priority');
  const [data,setData]=useState({ games:fallbackGames, updates:fallbackUpdates, config:fallbackConfig, syncLog:fallbackSyncLog, analytics:fallbackAnalytics, schedule:fallbackSchedule, collections:fallbackCollections, recommendations:fallbackRecommendations, notifications:fallbackNotifications, themes:fallbackThemes, watchProgress:fallbackWatchProgress, roadmap:fallbackRoadmap, testCenter:fallbackTestCenter, qaChecklist:fallbackQaChecklist, errorReports:fallbackErrorReports, apiStatus:fallbackApiStatus, rollbackPlan:fallbackRollbackPlan });
  const refresh=async()=>{setSyncStatus('syncing'); const next=await loadAutoData(); setData(next); setSyncStatus(next.status);};
  useEffect(()=>{refresh();},[]);
  const health=useMemo(()=>analyzeGameHealth(data.games),[data.games]);

  const PageContent = () => {
    if (active === 'Test Merkezi') return <><TestCenter testCenter={data.testCenter}/><ChecklistPanel qaChecklist={data.qaChecklist} rollbackPlan={data.rollbackPlan}/><FeatureNotes/></>;
    if (active === 'Hata Raporları') return <><ErrorReports errorReports={data.errorReports}/><FeatureNotes/></>;
    if (active === 'API Durumu') return <><ApiStatusPanel apiStatus={data.apiStatus}/><ChecklistPanel qaChecklist={data.qaChecklist} rollbackPlan={data.rollbackPlan}/></>;
    if (active === 'Kaldığın Yerden') return <ContinueWatching watchProgress={data.watchProgress}/>;
    if (active === 'AI Öneriler') return <RecommendationPanel recommendations={data.recommendations}/>;
    if (active === 'Bildirimler') return <NotificationCenter notifications={data.notifications}/>;
    if (active === 'Takvim' || active === 'Koleksiyonlar') return <ScheduleCollections schedule={data.schedule} collections={data.collections} roadmap={data.roadmap}/>;
    if (active === 'Yönetim Paneli') return <AdminPanel health={health} analytics={data.analytics} games={data.games} updates={data.updates} notifications={data.notifications} apiStatus={data.apiStatus} testCenter={data.testCenter} errorReports={data.errorReports} recommendations={data.recommendations} watchProgress={data.watchProgress} schedule={data.schedule} collections={data.collections} roadmap={data.roadmap} themes={data.themes}/>;
    return <>
      <Hero config={data.config} analytics={data.analytics} health={health} syncStatus={syncStatus} testCenter={data.testCenter} onNavigate={setActive}/>
      <MiniDashboard analytics={data.analytics} health={health} notifications={data.notifications}/>
      {active === 'Ana Sayfa' && <><ContinueWatching watchProgress={data.watchProgress}/><RecommendationPanel recommendations={data.recommendations}/></>}
      <SmartFilter smartFilter={smartFilter} setSmartFilter={setSmartFilter} sortMode={sortMode} setSortMode={setSortMode}/>
      <GameGrid games={data.games} query={query} active={active} smartFilter={smartFilter} sortMode={sortMode}/>
      {active === 'Ana Sayfa' && <FeatureNotes/>}
    </>;
  };

  return <>
    <TopBar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} query={query} setQuery={setQuery} syncStatus={syncStatus} onRefresh={refresh}/>
    <CategoryRail active={active} setActive={setActive}/>
    <main className="pageWrap"><PageContent/></main>
  </>;
}

createRoot(document.getElementById('root')).render(<App/>);
