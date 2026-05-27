

/* FIX28: Eski AI/Deploy temizliği sonrası kalan modül referansları ES module içinde güvenli tanımlandı. */
var ho240DeployCenter;
var hoFix10AiCenter;
var bindEvents;
var v223Fix3Form;
var ho240f13SetVersion;
var ho240Fix7Meta;
var hoFix10TargetPage;
var hoFix10GoTarget;
var ho240f13ApplyFeature;
var ho240f13DeployCenter;
var hoFix8DeployPanel;
var ho240f11DeployCenter;
var ho240f15DeployCenter;
var ho240f15AiCenter;
var ho240f15PanelForAdmin;
var ho240Applied;
const VERSION = 'v2.4.0 FIX 28 - Acilis Referans Stabil Fix';
const STAFF_ROLES = ['kurucu', 'yonetici', 'moderator', 'editor'];
const OWNER_ROLES = ['kurucu', 'yonetici'];
const ROLE_LABELS = { kurucu:'Kurucu', yonetici:'Yönetici', moderator:'Moderatör', editor:'Editör', user:'Kullanıcı', banned:'Banlı' };
const ROLE_OPTIONS = ['kurucu','yonetici','moderator','editor','user'];
const AUTH_SESSION_KEY = 'hayatimiz_session_stable';
const MAINTENANCE_KEY = 'hayatimiz_maintenance_cache_stable';
const ADMIN_TAB_KEY = 'hayatimiz_admin_tab_stable';
const PAGE_KEY = 'hayatimiz_page_stable';
const AFTER_REFRESH_TOAST_KEY = 'hayatimiz_after_refresh_toast';
const FEATURE_CACHE_KEY = 'hayatimiz_features_stable';
const SMART_FEATURE_DRAFT_KEY = 'hayatimiz_smart_feature_draft';
const FEATURE_OVERRIDES_KEY = 'hayatimiz_feature_overrides_stable';
const GAME_FORM_DRAFT_KEY = 'hayatimiz_game_form_draft_stable';
const GAME_LIST_CACHE_KEY = 'hayatimiz_games_cache_stable_v31';
const LEGACY_SESSION_KEYS = ['hayatimiz_session_v2143','hayatimiz_session_v2142','hayatimiz_session_v2141','hayatimiz_session_v213'];
const LEGACY_MAINTENANCE_KEYS = ['hayatimiz_maintenance_cache_v2143','hayatimiz_maintenance_cache_v2142','hayatimiz_maintenance_cache_v2141'];
const LEGACY_ADMIN_TAB_KEYS = ['hayatimiz_admin_tab_v2143','hayatimiz_admin_tab_v2142','hayatimiz_admin_tab_v2141'];
const LEGACY_FEATURE_KEYS = ['hayatimiz_features_v2143','hayatimiz_features_v2142','hayatimiz_features_v2141'];

const FEATURE_CATALOG = [
  {
    key:'admin_games_add_button',
    title:'Oyunlar sekmesine Oyun Ekle butonu ekle',
    group:'Siteye Gelmesi Gerekenler',
    target:'Yönetim Paneli > Oyunlar',
    keywords:['oyun ekle','oyun ekleme','games tablosu','oyun formu'],
    description:'Uygula deyince Oyunlar sekmesine Oyun Ekle butonu ve Supabase games kayıt formu gelir.',
    next:'Oyun düzenleme ve silme butonlarını aktif et'
  },
  {
    key:'auto_cover_fetch',
    title:'Otomatik kapak resmi çekme sistemini aç',
    group:'Siteye Gelmesi Gerekenler',
    target:'Yönetim Paneli > Oyunlar',
    keywords:['otomatik kapak','kapak resmi çek','kapak çekme','rawg kapak','kapak bul','eksik kapak'],
    description:'Uygula deyince Oyunlar sekmesine Otomatik Kapak Çek butonu gelir; kapaksız oyunlara güvenli kapak atanır.',
    next:'RAWG kapak eşleştirme için manuel onay ekranı ekle'
  },
  {
    key:'update_notes_editor',
    title:'Güncelleme notu editörünü Supabase site_update_notes tablosuna bağla',
    group:'Siteye Gelmesi Gerekenler',
    target:'Yönetim Paneli > Güncelleme Notları',
    keywords:['güncelleme notu','update notes','sürüm notu','not editörü'],
    description:'Güncelleme notlarını panelden yazma/dışa aktarma altyapısını aktif eder.',
    next:'Güncelleme notlarına sürüm filtresi ve arama ekle'
  },
  {
    key:'profile_photo_upload',
    title:'Profil fotoğrafı yükleme alanı ekle',
    group:'Siteye Gelmesi Gerekenler',
    target:'Profilim',
    keywords:['profil foto','profil resmi','avatar yükle','fotoğraf yükleme'],
    description:'Profil fotoğrafını gerçek Supabase Storage profile-photos bucket içine yükler.',
    next:'Profil fotoğrafı kırpma ve boyutlandırma ekle'
  },

  {
    key:'game_auto_meta_fetch',
    title:'Oyun adından tür, etiket ve açıklama otomatik çekme',
    group:'Siteye Gelmesi Gerekenler',
    target:'Yönetim Paneli > Oyunlar',
    keywords:['oyun adı çekme','türünü otomatik çek','tür çekme','etiket ekleme','otomatik etiket','oyun adı otomatik','meta çekme'],
    description:'Oyun adını yazınca tür, etiket, durum ve önerilen kapak bilgilerini otomatik doldurma panelini açar.',
    next:'Oyun düzenleme formunda otomatik meta yenile butonu ekle'
  },
  {
    key:'feature_edit_delete',
    title:'Akıllı özelliklerde düzenleme ve silme sistemi',
    group:'Eklenen Özellikler',
    target:'Yönetim Paneli > Özellik Planı',
    keywords:['düzenleme silme','özellik silme','özellik düzenle','öneri silme','öneri düzenle'],
    description:'Özellik kartlarında düzenle, sil ve pasife al işlemlerini görünür yapar.',
    next:'Özellik geçmişi ve geri alma ekranı ekle'
  },

  {
    key:'game_edit_delete_buttons',
    title:'Oyunları düzenle ve sil butonlarını aktif et',
    group:'Siteye Gelmesi Gerekenler',
    target:'Yönetim Paneli > Oyunlar',
    keywords:['oyunları düzenle','oyunlari duzenle','oyun düzenle','oyun duzenle','oyun sil','oyunları sil','duzenle sil','düzenle sil','oyunlara düzenle sil','oyunlara duzenle sil','sil butonu','düzenle butonu'],
    description:'Uygula deyince Oyunlar sekmesindeki oyun kartlarına Düzenle ve Sil butonları gelir. Supabase games tablosu güncellenir.',
    next:'Oyun düzenleme ekranına kapak önizleme ve otomatik meta yenile ekle'
  },
  {
    key:'active_features_bulk_clear',
    title:'Özellikleri Olan Özellikler bölümüne tümünü silme butonu ekle',
    group:'Siteye Gelmesi Gerekenler',
    target:'Yönetim Paneli > Özellik Planı',
    keywords:['özellikleri olan özellikler tümünü sil','ozellikleri olan ozellikler tumunu sil','tümünü sil','tumunu sil','hepsini sil','komple sil','aktif özellikleri sil','aktif ozellikleri sil','tümünü pasif','tumunu pasif','hepsini tümünü sil'],
    description:'Uygula deyince Özellikleri Olan Özellikler kartında Tüm Aktif Özellikleri Pasif Yap butonu görünür.',
    next:'Özellik silme geçmişi ve geri alma paneli ekle'
  },
  {
    key:'apply_and_refresh_flow',
    title:'Siteye Uygula + Siteyi Yenile akışını aktif et',
    group:'Eklenen Özellikler',
    target:'Yönetim Paneli > Özellik Planı',
    keywords:['siteye uygula siteyi yenile','uygula ve yenile','siteyi yenile','uygula + yenile','otomatik yenile'],
    description:'Özelliği uyguladıktan sonra oturumdan çıkmadan panel verilerini yeniden yükleyen akışı açar.',
    next:'Uygulama sonrası otomatik test raporu göster'
  },
  {
    key:'missing_cover_warning',
    title:'Oyun kartında eksik kapak sarı uyarısını otomatik göster',
    group:'Gözden Kaçanlar',
    target:'Oyun kartları',
    keywords:['eksik kapak','sarı uyarı','kapak yok','uyarı göster'],
    description:'Kapak görseli olmayan oyunlara admin tarafında sarı uyarı gösterir.',
    next:'Eksik kapakları RAWG kapağıyla eşleştir'
  },
  {
    key:'maintenance_message_editor',
    title:'Bakım modu yazısını panelden düzenleme alanı ekle',
    group:'Siteye Gelmesi Gerekenler',
    target:'Yönetim Paneli > Bakım Modu',
    keywords:['bakım yazısı','bakım modu yazı','bakım mesajı','bakım metni'],
    description:'Bakım modu ekranındaki mesajı panelden değiştirme alanını güçlendirir.',
    next:'Bakım moduna tahmini açılış zamanı ekle'
  }
];

const DEFAULT_GAMES = [];
const DEFAULT_GAME_DRAFT = { title:'', genre:'', tags:'', releaseDate:'', status:'Devam Ediyor', eps:0, watchedEps:0, score:8.5, cover:'', seriesName:'', seriesOrder:0, playlistUrl:'', videoUrl:'', description:'', episodesText:'', episodes:[], playlistSyncHash:'' };



const VERSION_NOTES_ARCHIVE = [
  { version:'v2.0.6', title:'UI Safe Fix', summary:'Kategori taşma fixi, yönetim paneli düzeni ve oyun kartı kapak oranları düzenlendi.', image:'previews/hayatimiz-oyun-v206-desktop-preview.png', written:'Site bozulmadan uygulanabilecek ilk güvenli arayüz patch paketi hazırlandı.' },
  { version:'v2.0.7', title:'Otomatik Çekme Altyapısı', summary:'JSON veri sistemi, otomatik çekme paneli ve fallback yapısı eklendi.', image:'previews/hayatimiz-oyun-v207-desktop-preview.png', written:'Veri gelmezse sitenin bozulmaması için güvenli katman hazırlandı.' },
  { version:'v2.0.8', title:'Smart Archive', summary:'Akıllı filtre, kalite skoru, otomatik çekme geçmişi ve sağlık özeti eklendi.', image:'previews/hayatimiz-oyun-v208-desktop-preview.png', written:'Arşiv tarafında kontrol ve filtreleme kartları geliştirildi.' },
  { version:'v2.0.9', title:'Control Hub', summary:'Kontrol merkezi, sezon/bölüm takibi, yayın takvimi ve koleksiyon alanı eklendi.', image:'previews/hayatimiz-oyun-v209-desktop-preview.png', written:'Arşiv yönetimi sezon ve koleksiyon odaklı hale getirildi.' },
  { version:'v2.1.0', title:'AI Archive Studio', summary:'AI öneri paneli, bildirim merkezi, izleme ilerlemesi ve tema presetleri eklendi.', image:'previews/hayatimiz-oyun-v210-desktop-preview.png', written:'Büyük sürümde kişiselleştirme ve otomasyon altyapısı genişletildi.' },
  { version:'v2.1.1', title:'Oyun Ekle Meta + Koleksiyon Fix', summary:'Oyun ekleme formu, otomatik kapak/tarih/tür çekme ve koleksiyon sayacı düzeltildi.', image:'previews/hayatimiz-oyun-v211-oyun-meta-preview.png', written:'Otomatik çekme artık oyun eklemez/silmez; sadece formu doldurur. Koleksiyonlar gerçek oyun verisine göre hesaplanır.' },
  { version:'v2.1.2', title:'Oyun Yönetimi + Meta + Seriler', summary:'RAWG çoklu kapak onayı, formda oyun düzenleme, tür/etiket filtreleri, çıkış tarihi çipleri, playlist bölüm sayısı ve seri alanı eklendi.', image:'previews/hayatimiz-oyun-v212-games-meta-editor-preview.png', written:'Yüklenen stabil v2.1.2 planındaki oyun yönetimi maddeleri tamamlananlara taşındı.' },
  { version:'v2.1.3', title:'Stabilizasyon + Koleksiyon Fix', summary:'Sürüm karışıklığı temizlendi, koleksiyonlar daha geniş veriyle hesaplanır hale getirildi ve Supabase kurulum notları düzenlendi.', image:'previews/hayatimiz-oyun-v213-stabilizasyon-preview.png', written:'v2.1.3 ile package, README, schema, update notes ve plan/tamamlanan klasörleri aynı sürüm çizgisine çekildi. Koleksiyon sayısı artık sadece sabit başlıklara değil durum, tür, etiket, favori ve seri verisine göre dinamik hesaplanır.' },
  { version:'v2.1.4', title:'Gelişmiş Arşiv + Profesyonel UI', summary:'Koleksiyon sekmesi kaldırıldı, ana sayfa daha profesyonel istatistiklere geçti, oyun kartlarına izleme butonları, bölüm yüzdesi ve alfabetik arşiv şeritleri eklendi.', image:'previews/hayatimiz-oyun-v214-profesyonel-arsiv-preview.png', written:'v2.1.4 ile oyun kartları daha temiz görünüme taşındı. Admin paneline eksik kapak kontrolü, RAWG büyük önizleme, bakım tahmini açılış zamanı ve güncelleme notları arama/filtre alanı eklendi.' },
  { version:'v2.1.5', title:'Gerçek Storage + Gelişmiş İzleme', summary:'Profil fotoğrafı gerçek Supabase Storage yüklemesine bağlandı, seri izleme ekranı ve gelişmiş bölüm takibi eklendi.', image:'previews/hayatimiz-oyun-v215-storage-izleme-preview.png', written:'v2.1.5 ile Seriyi İzle detay ekranı, bölüm listesi, aktif harf görünümü, A Harfinde Başlayan Seriler başlıkları, admin kapak oranı düzeltmesi ve güncelleme notu düzenle/sil altyapısı tamamlandı.' },
  { version:'v2.1.6', title:'Büyük Arşiv Otomasyonu + Bölüm Yönetimi', summary:'YouTube playlist import, bölüm yönetimi, gelişmiş site içi seri izleme, sağlık paneli, liste/kompakt görünüm ve istatistik grafikleri eklendi.', image:'previews/hayatimiz-oyun-v216-bolum-yonetimi-preview.png', written:'v2.1.6 ile playlistten tüm bölümleri çekme, bölümlere başlık/açıklama/kapak/video linki ekleme, izlenme durumuna göre otomatik ilerleme, sağda bölüm listeli site içi oynatıcı, admin seri gruplama ve hatalı YouTube link kontrolü tamamlandı.' },
  { version:'v2.1.7', title:'Gelişmiş Otomasyon + Kalıcı Bölüm Senkronizasyonu', summary:'Bölüm izlendi durumu Supabase’e kalıcı kaydedilir, playlist import yeni/değişen bölümleri karşılaştırır, seri kategorileri yönetim panelindeki sıraya göre listelenir.', image:'previews/hayatimiz-oyun-v217-kalici-bolum-senkronizasyonu-preview.png', written:'v2.1.7 ile Seriler kategorisi, otomatik sonraki bölüme geçme, gelişmiş mobil alt menü, gelişmiş sağlık paneli, kalıcı bölüm işaretleme ve profesyonel seri arayüzü eklendi.' },
  { version:'v2.1.8', title:'Tam Otomatik Yayın Takvimi + Gelişmiş Medya Yönetimi', summary:'Bölüm yayın tarihi, burada kaldım/geri al, sırayla izle, toplu playlist/kapak senkronizasyonu, sinema modu ve profesyonel bakım ekranı eklendi.', image:'previews/hayatimiz-oyun-v218-yayin-takvimi-medya-preview.png', written:'v2.1.8 ile bölümlere yayın tarihi/not alanı, klavye kısayolları, tam ekran sinema modu, sıradaki oyuna geçiş, ayrı seri sıralama paneli, toplu kapak yenileme, toplu playlist senkronizasyonu ve kullanıcıya özel bakım notları tamamlandı.' },
  { version:'v2.1.9', title:'Yayın Otomasyonu + Bildirim Merkezi', summary:'Bildirim merkezi, rozetli/sesli uyarılar, daha büyük site içi izleme, bölüm yorumları, izleme geçmişi ve toplu işlem geçmişi eklendi.', image:'previews/hayatimiz-oyun-v219-bildirim-merkezi-preview.png', written:'v2.1.9 ile YouTube yeni video kontrol altyapısı, yaklaşan bölüm bildirimi, Supabase bölüm yorumları hazırlığı, görsel kırpma modalı, medya optimizasyon raporu, tümünü izle akışı, ayrı yönetim paneli Seri İzleme kategorisi ve profesyonel sitede izleme ekranı tamamlandı.' },
  { version:'v2.2.0', title:'Tam Otomatik YouTube Senkron + Profesyonel Arşiv UI', summary:'Bildirim butonları düzeltildi, site içi izleme ekranı büyütüldü, arayüz tam oyun arşivi paneli gibi yenilendi.', image:'previews/hayatimiz-oyun-v220-profesyonel-arsiv-ui-preview.png', written:'v2.2.0 ile sol kategori menüsü, üst navigasyon, öne çıkan oyunlar, devam eden seriler, sağ profil/istatistik paneli ve yaklaşan yayın kartları geldi. Bildirim okundu/ses/tercih butonları çalışır hale getirildi; Seriyi İzle ekranı çok daha büyük ve profesyonel hale getirildi.' }
];

const state = {
  page: initialPageFromUrl() || localStorage.getItem(PAGE_KEY) || 'Ana Sayfa',
  adminPage: initialAdminPageFromUrl() || localStorage.getItem(ADMIN_TAB_KEY) || 'Genel Bakış',
  query: '',
  session: loadStorageWithLegacy(AUTH_SESSION_KEY, LEGACY_SESSION_KEYS, null),
  maintenance: loadStorageWithLegacy(MAINTENANCE_KEY, LEGACY_MAINTENANCE_KEYS, { enabled:false, message:'Hayatımız Oyun kısa süreli bakımda.', eta:'' }),
  features: normalizeFeatureMap(loadStorageWithLegacy(FEATURE_CACHE_KEY, LEGACY_FEATURE_KEYS, {})),
  users: [],
  notes: [],
  planner: defaultPlanner(),
  toast: readAfterRefreshToast() || '',
  authMode: null,
  loading: false,
  error: '',
  runtimeLoaded: false,
  showGameForm: false,
  gameDraft: { ...DEFAULT_GAME_DRAFT, ...safeParse(localStorage.getItem(GAME_FORM_DRAFT_KEY), {}) },
  coverSuggestions: [],
  rawgCandidates: [],
  collectionFilter: 'Tümü',
  selectedLetter: '',
  watchingGameId: null,
  selectedEpisodeId: null,
  selectedEpisodeIndex: 0,
  gameViewMode: localStorage.getItem('hayatimiz_game_view_mode_v219') || localStorage.getItem('hayatimiz_game_view_mode_v217') || 'compact',
  showSeriesSortPanel:false,
  activeSeriesName: localStorage.getItem('hayatimiz_active_series_v217') || '',
  autoNextEpisode: localStorage.getItem('hayatimiz_auto_next_episode_v219') === '1' || localStorage.getItem('hayatimiz_auto_next_episode_v217') === '1',
  cinemaFullscreen: localStorage.getItem('hayatimiz_cinema_fullscreen_v219') === '1',
  episodeNotes: safeParse(localStorage.getItem('hayatimiz_episode_notes_v219'), {}),
  notificationsMuted: localStorage.getItem('hayatimiz_notifications_muted_v220') === '1',
  notificationSeen: safeParse(localStorage.getItem('hayatimiz_notification_seen_v220'), {}),
  notificationPrefs: safeParse(localStorage.getItem('hayatimiz_notification_prefs_v220'), { newVideos:true, releases:true, maintenance:true }),
  watchHistory: safeParse(localStorage.getItem('hayatimiz_watch_history_v219'), []),
  bulkHistory: safeParse(localStorage.getItem('hayatimiz_bulk_history_v219'), []),
  editingUpdateNoteId: null,
  editingGameId: null,
  pendingFeature: null,
  editingFeature: null,
  featureOverrides: safeParse(localStorage.getItem(FEATURE_OVERRIDES_KEY), {}),
  aiSuggestions: null,
  games: DEFAULT_GAMES,
  updates: VERSION_NOTES_ARCHIVE.map(n => `${n.version}: ${n.title} - ${n.summary}`)
};

function defaultPlanner(){
  return [
    { id:'p1', group:'Eklenen Özellikler', text:'Kullanıcı ana sayfasından teknik istatistikleri kaldır', status:'tamam' },
    { id:'p2', group:'Eklenen Özellikler', text:'Profil sekmesi ekle', status:'tamam' },
    { id:'p3', group:'Siteye Gelmesi Gerekenler', text:'Oyunlar sekmesine Oyun Ekle butonu ekle', status:'plan', featureKey:'admin_games_add_button' },
    { id:'p4', group:'Siteye Gelmesi Gerekenler', text:'Güncelleme notu editörünü Supabase site_update_notes tablosuna bağla', status:'plan', featureKey:'update_notes_editor' },
    { id:'p5', group:'Siteye Gelmesi Gerekenler', text:'Otomatik kapak resmi çekme sistemini aç', status:'plan', featureKey:'auto_cover_fetch' },
    { id:'p6', group:'Gözden Kaçanlar', text:'Oyun kartında eksik kapak sarı uyarısını otomatik göster', status:'plan', featureKey:'missing_cover_warning' },
    { id:'p8', group:'Siteye Gelmesi Gerekenler', text:'Oyun adından tür, etiket ve açıklama otomatik çekme', status:'plan', featureKey:'game_auto_meta_fetch' },
    { id:'p10', group:'Siteye Gelmesi Gerekenler', text:'Oyunları düzenle ve sil butonlarını aktif et', status:'plan', featureKey:'game_edit_delete_buttons' },
    { id:'p13', group:'Adminin Önerileri', text:'Benim Notlarım alanından eksik/hata girişi ekle', status:'kontrol' }
  ];
}
const rotatingTasks = [
  'Oyun kapağı yükleme sistemini Supabase Storage ile bağla',
  'Profil fotoğrafını profile-photos bucket içine yükle',
  'Oyun düzenleme ve silme formlarını gerçek tabloya bağla',
  'Güncelleme notlarına sürüm filtresi ve arama ekle',
  'Yayın takvimine bölüm ekleme formu ekle',
  'Eksik kapakları RAWG kapağıyla eşleştir',
  'Otomatik YouTube çekme işlerini zamanlanmış cron yapısına bağla',
  'Yayın takvimine bölüm ekleme formu ekle'
];
let rotateIndex = Number(localStorage.getItem('hayatimiz_task_rotate_stable') || localStorage.getItem('hayatimiz_task_rotate_v2143') || '0');

function safeParse(raw, fallback){ try { return raw ? JSON.parse(raw) : fallback; } catch { return fallback; } }
function loadStorageWithLegacy(primaryKey, legacyKeys, fallback){
  const primaryRaw = localStorage.getItem(primaryKey);
  if(primaryRaw !== null) return safeParse(primaryRaw, fallback);
  for(const key of legacyKeys || []){
    const raw = localStorage.getItem(key);
    if(raw !== null){
      const value = safeParse(raw, fallback);
      try { localStorage.setItem(primaryKey, JSON.stringify(value)); } catch {}
      return value;
    }
  }
  return fallback;
}

function ho240f31GameCacheKeys(){
  return [GAME_LIST_CACHE_KEY, 'hayatimiz_games_cache_stable', 'hayatimiz_games_cache_fix30', 'hayatimiz_games_cache_v240'];
}
function ho240f31NormalizeGames(rows){
  if(!Array.isArray(rows)) return [];
  return rows.filter(Boolean).map(row => {
    try { return typeof mapGame === 'function' ? mapGame(row) : row; }
    catch { return row; }
  }).filter(g => g && (g.title || g.id));
}
function ho240f31LoadGamesCache(){
  for(const key of ho240f31GameCacheKeys()){
    try{
      const cached = safeParse(localStorage.getItem(key), []);
      const games = ho240f31NormalizeGames(cached);
      if(games.length) return games;
    }catch{}
  }
  return [];
}
function ho240f31SaveGamesCache(games){
  const list = ho240f31NormalizeGames(games);
  if(!list.length) return;
  try{ localStorage.setItem(GAME_LIST_CACHE_KEY, JSON.stringify(list)); }catch{}
}
function ho240f31KeepGamesOnFailure(reason=''){
  const current = ho240f31NormalizeGames(state.games);
  if(current.length){ ho240f31SaveGamesCache(current); return current; }
  const cached = ho240f31LoadGamesCache();
  if(cached.length){ console.warn('FIX31 oyun cache geri yüklendi:', reason); return cached; }
  return [];
}
function cleanupLegacyKeys(){
  [...LEGACY_SESSION_KEYS, ...LEGACY_MAINTENANCE_KEYS, ...LEGACY_ADMIN_TAB_KEYS, ...LEGACY_FEATURE_KEYS, 'hayatimiz_task_rotate_v2143'].forEach(k=>{ try{ localStorage.removeItem(k); }catch{} });
}
function $(sel){ return document.querySelector(sel); }
function html(strings, ...values){ return strings.map((s,i)=>s + (values[i] ?? '')).join(''); }
function esc(value){ return String(value ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch])); }
function normalizeFeatureMap(input){
  const map = {};
  if(input && typeof input === 'object') Object.keys(input).forEach(k => { map[k] = Boolean(input[k]); });
  FEATURE_CATALOG.forEach(f=>{ if(!(f.key in map)) map[f.key] = Boolean(input?.[f.key]); });
  return map;
}

function slugifyFeature(text){
  return 'custom_' + String(text || 'ozellik').toLowerCase()
    .replace(/[ıİ]/g,'i').replace(/[öÖ]/g,'o').replace(/[üÜ]/g,'u').replace(/[ğĞ]/g,'g').replace(/[şŞ]/g,'s').replace(/[çÇ]/g,'c')
    .replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'').slice(0,48);
}
function normalizeSearchText(value){
  return String(value || '').toLowerCase()
    .replace(/[ıİ]/g,'i').replace(/[öÖ]/g,'o').replace(/[üÜ]/g,'u').replace(/[ğĞ]/g,'g').replace(/[şŞ]/g,'s').replace(/[çÇ]/g,'c')
    .replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
}
function featureScore(feature, text){
  const q = normalizeSearchText(text);
  const title = normalizeSearchText(feature.title);
  const keywords = (feature.keywords || []).map(normalizeSearchText);
  let score = 0;
  for(const kw of keywords){ if(kw && q.includes(kw)) score += 12; }
  for(const word of q.split(' ').filter(Boolean)){
    if(title.includes(word)) score += 2;
    if(keywords.some(k=>k.includes(word))) score += 3;
  }
  if(q.includes('oyun') && (q.includes('duzenle') || q.includes('sil')) && feature.key === 'game_edit_delete_buttons') score += 30;
  if(q.includes('ozellik') && (q.includes('tumunu') || q.includes('hepsini') || q.includes('komple')) && feature.key === 'active_features_bulk_clear') score += 30;
  if(q.includes('yenile') && feature.key === 'apply_and_refresh_flow') score += 20;
  if(q.includes('kapak') && feature.key === 'auto_cover_fetch') score += 10;
  return score;
}
function findFeatureByText(text){
  const scored = FEATURE_CATALOG.map(f => ({ f, score: featureScore(f, text) })).sort((a,b)=>b.score-a.score);
  return scored[0]?.score > 0 ? scored[0].f : null;
}
function getRelatedFeatureSuggestions(text){
  return getAiFeatureSuggestions(text).filter(f=>f.matched !== false).slice(0,5);
}
function getAiFeatureSuggestions(text){
  const clean = String(text || '').trim();
  const ctx = getSmartFeatureContext();
  const contextualQuery = `${clean} ${ctx.searchBoost || ''}`.trim();
  const scored = FEATURE_CATALOG
    .map(f => ({ ...f, score: featureScore(f, contextualQuery), matched:true, originalText:clean, contextLabel:ctx.label }))
    .sort((a,b)=>b.score-a.score);
  const top = scored.filter(f => f.score > 0).slice(0,5);
  if(top.length < 5){
    const extra = scored.filter(f => f.score <= 0).slice(0, 5 - top.length);
    top.push(...extra);
  }
  const custom = {
    key: slugifyFeature(`${ctx.slug || 'genel'} ${clean}`),
    title: clean || `${ctx.label} için yeni özel özellik isteği`,
    group:'Adminin Önerileri',
    target:ctx.target || 'Yönetim Paneli > Özellik Planı',
    keywords:[],
    description:`Bu özel istek ${ctx.label} bağlamına göre kaydedilir. Hazır modül yoksa sonraki paketle gerçek koda dönüştürülür.`,
    next:`${ctx.label} bağlamında bu özel istek için gerçek modül kodu ekle`,
    matched:false,
    originalText:clean,
    contextLabel:ctx.label,
    score:0
  };
  if(clean && !top.some(f=>f.key===custom.key)) top.push(custom);
  return top.slice(0,5);
}
function rememberPendingFeature(feature){
  state.pendingFeature = feature || null;
  try{ localStorage.removeItem(SMART_FEATURE_DRAFT_KEY); }catch{}
}
function featureFromPlannerItem(item){
  if(!item) return null;
  const preset = FEATURE_CATALOG.find(f => f.key === item.featureKey || f.title === item.text);
  if(preset) return mergeFeatureOverride(preset);
  return {
    key: item.featureKey || slugifyFeature(item.text),
    title: item.text,
    group: item.group || 'Adminin Önerileri',
    target: 'Özellik Planı',
    description: 'Özel özellik isteği. Kodda hazır modül yoksa plan/öneri olarak tutulur.',
    next: 'Bu özel özellik için modül ekle',
    matched:false,
    suggestions: getRelatedFeatureSuggestions(item.text)
  };
}
function getActiveFeatureItems(){
  const map = new Map();
  FEATURE_CATALOG.filter(f => featureEnabled(f.key)).map(mergeFeatureOverride).forEach(f=>map.set(f.key, f));
  state.planner.forEach(item => {
    const key = item.featureKey || slugifyFeature(item.text);
    if(item.status === 'tamam' || featureEnabled(key)){
      const feature = featureFromPlannerItem(item);
      if(feature && !map.has(key)) map.set(key, feature);
    }
  });
  return Array.from(map.values());
}
function proposeFeatureFromText(text){
  const clean = String(text || '').trim();
  const matched = findFeatureByText(clean);
  if(matched){ return { ...matched, matched:true, originalText:clean, suggestions: getRelatedFeatureSuggestions(clean) }; }
  return {
    key: slugifyFeature(clean),
    title: clean || 'Yeni özel özellik',
    group: 'Adminin Önerileri',
    target: 'Özellik Planı',
    description: 'Bu özel istek plan listesine eklenir. Kodda hazır modül varsa Siteye Uygula aktif eder; hazır modül yoksa yapılacak iş olarak tutulur.',
    next: 'Bu özel istek için hazır modül kodunu ekle',
    matched:false,
    originalText:clean,
    suggestions: getRelatedFeatureSuggestions(clean)
  };
}
function targetAdminPage(feature){
  const t = feature?.target || '';
  if(t.includes('Oyunlar')) return 'Oyunlar';
  if(t.includes('Güncelleme')) return 'Güncelleme Notları';
  if(t.includes('Bakım')) return 'Bakım Modu';
  if(t.includes('Profil')) return 'Profil';
  return 'Özellik Planı';
}

function routeSlug(value){
  return normalizeSearchText(value).replace(/\s+/g,'-') || 'ana-sayfa';
}
function routeNameFromSlug(raw){
  const slug = routeSlug(decodeURIComponent(String(raw || '').replace(/^#?\/?/,'')));
  const map = {
    'ana-sayfa':'Ana Sayfa','anasayfa':'Ana Sayfa','home':'Ana Sayfa',
    'populer':'Popüler','popular':'Popüler','tamamlanan':'Tamamlanan','devam-eden':'Devam Eden','devam':'Devam Eden',
    'yakinda':'Yakında','yakında':'Yakında','korku':'Korku','aksiyon':'Aksiyon','hikaye-odakli':'Hikaye Odaklı','hikaye':'Hikaye Odaklı',
    'takvim':'Takvim','seriler':'Seriler','seri':'Seriler','koleksiyonlar':'Koleksiyonlar','profilim':'Profilim','profil':'Profilim'
  };
  return map[slug] || null;
}
function adminNameFromSlug(raw){
  const slug = routeSlug(raw);
  const map = {
    'genel-bakis':'Genel Bakış','genel-bakış':'Genel Bakış','oyunlar':'Oyunlar','profil':'Profil','kullanici-yetkileri':'Kullanıcı Yetkileri',
    'kullanıcı-yetkileri':'Kullanıcı Yetkileri','ozellik-plani':'Özellik Planı','özellik-planı':'Özellik Planı','uygulama-merkezi':'Uygulama Merkezi',
    'guncelleme-notlari':'Güncelleme Notları','güncelleme-notları':'Güncelleme Notları','bakim-modu':'Bakım Modu','bakım-modu':'Bakım Modu',
    'api-env-durumu':'API/ENV Durumu','ayarlar':'Ayarlar'
  };
  return map[slug] || null;
}
function parseRouteFromLocation(){
  let path = '';
  let hash = '';
  try{
    path = decodeURIComponent((window.location.pathname || '').replace(/^\/+|\/+$/g,''));
    hash = decodeURIComponent((window.location.hash || '').replace(/^#\/?/,''));
  }catch{}
  let params = null;
  try{ params = new URLSearchParams(window.location.search || ''); }catch{ params = new URLSearchParams(''); }
  const adminParam = params.get('admin') || params.get('panel');
  if(adminParam){ return { page:'Yönetim Paneli', adminPage:adminNameFromSlug(adminParam) || 'Genel Bakış' }; }
  const pageParam = params.get('page') || params.get('kategori') || params.get('category');
  const fromParam = routeNameFromSlug(pageParam);
  if(fromParam) return { page:fromParam };
  const source = hash || path;
  const parts = source.split('/').filter(Boolean);
  if(parts[0] && ['admin','panel','yonetim','yönetim','yonetim-paneli','yönetim-paneli'].includes(routeSlug(parts[0]))){
    return { page:'Yönetim Paneli', adminPage:adminNameFromSlug(parts.slice(1).join('-')) || 'Genel Bakış' };
  }
  if(parts[0] && ['kategori','category','sayfa','page'].includes(routeSlug(parts[0]))){
    const page = routeNameFromSlug(parts.slice(1).join('-'));
    if(page) return { page };
  }
  if(source && source !== 'index.html'){
    const page = routeNameFromSlug(parts.join('-') || source);
    if(page) return { page };
  }
  return {};
}
function initialPageFromUrl(){ return parseRouteFromLocation().page || null; }
function initialAdminPageFromUrl(){ return parseRouteFromLocation().adminPage || null; }
function syncRouteToAddress(){
  // v2.2.0 FIX 3: Menü ve sayfa geçişlerinde tarayıcı adresi değiştirilmez.
  // Önceki sürümlerde #/kategori/... yazıldığı için site adresi kötü görünüyordu.
  // İlk açılışta mevcut URL okunmaya devam eder, fakat kullanıcı site içinde gezerken URL sabit kalır.
  return;
}
function readAfterRefreshToast(){
  try{
    const msg = sessionStorage.getItem(AFTER_REFRESH_TOAST_KEY);
    if(msg) sessionStorage.removeItem(AFTER_REFRESH_TOAST_KEY);
    return msg;
  }catch{ return ''; }
}
function scheduleHardRefresh(message){
  try{ sessionStorage.setItem(AFTER_REFRESH_TOAST_KEY, message || 'Site F5 ile yenilendi ve seçilen düzenleme entegre edildi.'); }catch{}
  window.setTimeout(()=>{ try{ window.location.reload(); }catch{} }, 650);
}
function getSmartFeatureContext(){
  const page = state?.page || initialPageFromUrl() || 'Ana Sayfa';
  const admin = state?.adminPage || initialAdminPageFromUrl() || 'Genel Bakış';
  if(page === 'Yönetim Paneli'){
    const base = { type:'admin', label:admin, target:`Yönetim Paneli > ${admin}`, slug:routeSlug(admin) };
    const boost = {
      'Oyunlar':'oyun oyunlar oyun ekle oyun düzenle oyun sil kapak meta tür etiket games',
      'Özellik Planı':'özellik planı siteye uygula düzenle sil öneri ai yenile',
      'Uygulama Merkezi':'uygulama merkezi modül aktif pasif uygula yenile',
      'Güncelleme Notları':'güncelleme notu sürüm editör arşiv not',
      'Bakım Modu':'bakım modu mesaj kapat aç bakım yazısı',
      'Profil':'profil fotoğraf avatar kullanıcı',
      'Kullanıcı Yetkileri':'kullanıcı rol yetki ban sil yönetici kurucu'
    }[admin] || normalizeSearchText(admin);
    return { ...base, searchBoost:boost };
  }
  const publicBoost = {
    'Popüler':'popüler oyun liste puan öne çıkan',
    'Tamamlanan':'tamamlanan biten arşiv oyun liste',
    'Devam Eden':'devam eden seri bölüm ilerleme',
    'Yakında':'yakında planlanan gelecek oyun',
    'Korku':'korku gerilim kapak karanlık kategori oyun',
    'Aksiyon':'aksiyon savaş oyun kategori',
    'Hikaye Odaklı':'hikaye odaklı bölüm seri kategori',
    'Takvim':'takvim yayın bölüm plan',
    'Koleksiyonlar':'koleksiyon favori liste kategori',
    'Profilim':'profil fotoğraf hesap kullanıcı'
  }[page] || normalizeSearchText(page);
  return { type:'public', label:page, target:`${page} kategorisi`, slug:routeSlug(page), searchBoost:publicBoost };
}
function buildFeatureEditVariants(feature){
  const base = mergeFeatureOverride(feature || {});
  const ctx = getSmartFeatureContext();
  const title = base.title || 'Yeni özellik';
  const target = ctx.target || base.target || 'Yönetim Paneli > Özellik Planı';
  const group = base.group || 'Adminin Önerileri';
  const variants = [];
  const add = (variantTitle, variantTarget, description, tag='Öneri') => {
    const cleanTitle = String(variantTitle || '').trim();
    if(!cleanTitle || variants.some(v => normalizeSearchText(v.title) === normalizeSearchText(cleanTitle))) return;
    variants.push({ key:base.key, title:cleanTitle, target:variantTarget || target, description:String(description || '').trim(), group, next:base.next || '', matched:base.matched !== false, tag });
  };
  const isGames = base.key === 'game_edit_delete_buttons' || /oyunlar|oyun/i.test(`${base.target || ''} ${ctx.target || ''} ${title}`);
  const isFeaturePlan = base.key === 'feature_edit_delete' || base.key === 'active_features_bulk_clear' || /özellik|ozellik|feature/i.test(`${base.target || ''} ${ctx.target || ''} ${title}`);
  const isUpdates = base.key === 'update_notes_editor' || /güncelleme|guncelleme|update/i.test(`${base.target || ''} ${ctx.target || ''} ${title}`);
  if(isGames){
    add('Oyun kartlarına Düzenle ve Sil butonlarını aktif et', 'Yönetim Paneli > Oyunlar', 'Oyunlar sekmesinde her oyun kartının altında Düzenle ve Sil butonları görünür; işlemden sonra liste aynı sayfada yenilenir.', 'En uygun');
    add('Oyun düzenleme modalı + güvenli silme onayı ekle', 'Yönetim Paneli > Oyunlar', 'Düzenle işlemi sayfa içi modalda açılır, silme işleminde onay alınır ve Supabase games tablosu güncellenir.', 'Stabil');
    add(`${ctx.label} bağlamına göre oyun düzenle/sil butonlarını göster`, ctx.target, `Aktif kategori veya panel adresi ${ctx.label} olduğunda öneriler ve hedef alan buna göre şekillenir.`, 'Kategori uyumlu');
    add('Oyun düzenleme sonrası Siteye Uygula + F5 yenile akışı', 'Yönetim Paneli > Oyunlar', 'Seçilen düzenleme siteye uygulanır, panel verileri yenilenir ve F5 sonrası oturum korunarak entegre kalır.', 'F5 entegre');
    add('Oyun düzenleme formuna kapak, tür, etiket ve puan alanları ekle', 'Yönetim Paneli > Oyunlar', 'Düzenleme ekranında kapak URL, kategori/tür, etiket, bölüm ve puan alanları birlikte yönetilir.', 'Gelişmiş');
  }else if(isUpdates){
    add('Güncelleme notu editörünü daha stabil hale getir', 'Yönetim Paneli > Güncelleme Notları', 'Sürüm, başlık, görsel ve yazılı not alanları kaydedilir; arşiv aynı sayfada yenilenir.', 'En uygun');
    add('Güncelleme notu kaydından sonra F5 ile arşivi yenile', 'Yönetim Paneli > Güncelleme Notları', 'Yeni not eklendikten sonra veri tazelenir ve F5 sonrası not editörü aktif kalır.', 'F5 entegre');
    add(`${ctx.label} sayfasına göre güncelleme önerisi hazırla`, ctx.target, `Mevcut adres/kategori ${ctx.label} olduğu için hedef alan ve açıklama buna göre düzenlenir.`, 'Kategori uyumlu');
    add('Güncelleme notlarına resimli/yazılı ayrımını netleştir', 'Yönetim Paneli > Güncelleme Notları', 'ZIP içindeki görseller ve yazılı notlar panelde ayrı akış olarak gösterilir.', 'Düzenli');
    add('Güncelleme notu editörünü Supabase ile yeniden senkronize et', 'Yönetim Paneli > Güncelleme Notları', 'site_update_notes tablosuna kayıt denemesi yapılır; başarısız olursa local panel verisi korunur.', 'Supabase');
  }else if(isFeaturePlan){
    add('Düzenle dedikten sonra 4-5 öneri göster ve seçileni uygula', 'Yönetim Paneli > Özellik Planı', 'Düzenle butonu doğrudan 4-5 yeni öneri açar; seçilen öneri siteye uygulanır, yeşile döner ve F5 ile entegre edilir.', 'En uygun');
    add('Özellik düzenleme önerilerini kategoriye göre şekillendir', ctx.target, `Adres veya aktif kategori ${ctx.label} ise öneri başlıkları, hedef alan ve açıklamalar bu bağlama göre hazırlanır.`, 'Kategori uyumlu');
    add('Seçilen düzenlemeyi Siteye Uygula + Supabase kaydet', 'Yönetim Paneli > Özellik Planı', 'Seçilen öneri override olarak kaydedilir, plan maddesi tamamlandı olur ve site_features aktif edilir.', 'Supabase');
    add('Düzenleme sonrası otomatik F5 yenile ve oturumu koru', 'Yönetim Paneli > Özellik Planı', 'Kaydetme tamamlanınca sayfa F5 ile yenilenir; admin sekmesi ve kullanıcı oturumu localStorage üzerinden korunur.', 'F5 entegre');
    add('Özellik kartında yeşil aktif durumunu anında göster', 'Yönetim Paneli > Özellik Planı', 'Uygulama başarılı olduğunda kart bekletmeden yeşil Sitede aktif durumuna geçer.', 'Görsel fix');
  }else{
    add(`${title} - ${ctx.label} uyumlu düzenleme`, target, `Bu düzenleme mevcut adres/kategori olan ${ctx.label} bağlamına göre hedeflenir ve seçilince siteye uygulanır.`, 'En uygun');
    add(`${title} + Siteye Uygula ve F5 yenile`, base.target || target, 'Seçilen öneri aktif edilir, veriler yenilenir ve F5 sonrası da entegre kalır.', 'F5 entegre');
    add(`${title} + Supabase kayıt akışı`, base.target || target, 'Özellik hem local cache hem de Supabase site_features/site_admin_planner akışına yazılır.', 'Supabase');
    add(`${title} + yeşil aktif kart güncellemesi`, base.target || target, 'Uygulama sonrası kart anında yeşil aktif durumuna döner ve aktif modüller listesine eklenir.', 'Görsel fix');
    add(`${ctx.label} için ${title}`, ctx.target || base.target, `Aktif kategori/panel ${ctx.label} olduğu için hedef ve açıklama bu alana göre ayarlanır.`, 'Kategori uyumlu');
  }
  return variants.slice(0,5);
}

function featureEnabled(key){ return Boolean(state.features?.[key]); }
function persistFeatures(){ localStorage.setItem(FEATURE_CACHE_KEY, JSON.stringify(state.features)); }
function persistFeatureOverrides(){ localStorage.setItem(FEATURE_OVERRIDES_KEY, JSON.stringify(state.featureOverrides || {})); }
function mergeFeatureOverride(feature){
  if(!feature) return feature;
  const override = state.featureOverrides?.[feature.key] || {};
  return { ...feature, ...override, key: feature.key };
}
function applyFeatureOverride(key, patch){
  state.featureOverrides = state.featureOverrides || {};
  state.featureOverrides[key] = { ...(state.featureOverrides[key] || {}), ...patch };
  persistFeatureOverrides();
}
function findPlannerByKey(key){
  return state.planner.find(p => (p.featureKey || slugifyFeature(p.text)) === key || p.id === key);
}
function editableFeatureByKey(key){
  const planner = findPlannerByKey(key);
  const base = FEATURE_CATALOG.find(f => f.key === key) || featureFromPlannerItem(planner) || { key, title:key, group:'Adminin Önerileri', target:'Yönetim Paneli > Özellik Planı', description:'' };
  return mergeFeatureOverride(base);
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
async function loadFeatures(doRender = true){
  try{
    const data = await api('features-list', {});
    if(data.features){ state.features = normalizeFeatureMap(data.features); persistFeatures(); }
  }catch(e){}
  if(doRender) render();
}
async function loadRuntime(){
  try{
    const data = await api('settings-get', {});
    state.runtimeLoaded = true;
    state.maintenance = data.maintenance || { enabled:false, message:'Hayatımız Oyun kısa süreli bakımda.', eta:'' };
    localStorage.setItem(MAINTENANCE_KEY, JSON.stringify(state.maintenance));
  }catch(e){ state.runtimeLoaded = false; }
  try{
    const data = await api('features-list', {});
    if(data.features){ state.features = normalizeFeatureMap(data.features); persistFeatures(); }
  }catch(e){}
  try{
    const data = await api('games-list', {});
    const mappedGames = ho240f31NormalizeGames(data.games);
    if(mappedGames.length){
      state.games = mappedGames;
      ho240f31SaveGamesCache(state.games);
    }else{
      const safeGames = ho240f31KeepGamesOnFailure(data.warning || 'Supabase boş oyun listesi döndürdü');
      state.games = safeGames.length ? safeGames : (Array.isArray(state.games) ? state.games : []);
      if(data.warning) console.warn('FIX31 games-list uyarı:', data.warning);
    }
  }catch(e){
    console.warn('Supabase oyun listesi alınamadı, mevcut oyunlar korunuyor:', e);
    state.games = ho240f31KeepGamesOnFailure(e.message || e) || [];
  }
  if(state.session?.email){
    try{
      const data = await api('session-refresh', { email: state.session.email });
      if(data.user){ saveSession({ ...state.session, ...data.user, role: normalizeRole(data.user.role), adminToken:data.adminToken || state.session.adminToken || null }); }
    }catch(e){}
  }
  if(isStaff()) await loadPlanner(false);
  rememberPendingFeature(null);
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
    cover: game.cover_url || game.cover || '',
    releaseDate: game.release_date || game.releaseDate || '',
    tags: game.tags || '',
    seriesName: game.series_name || game.seriesName || '',
    playlistUrl: game.playlist_url || game.playlistUrl || '',
    videoUrl: game.video_url || game.videoUrl || '',
    watchedEps: Number(game.watched_episode_count ?? game.watchedEps ?? 0),
    seriesOrder: Number(game.series_order ?? game.seriesOrder ?? 0),
    episodes: normalizeEpisodes(game.episodes || game.episode_list || []),
    description: game.description || '',
    rawg_slug: game.rawg_slug || game.rawgSlug || ''
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
function navigate(page){ state.page = page; localStorage.setItem(PAGE_KEY, page); syncRouteToAddress(); render(); }
function adminNavigate(page){ state.page = 'Yönetim Paneli'; state.adminPage = page; if(page === 'Oyunlar' && !state.editingGameId) state.showGameForm = true; localStorage.setItem(PAGE_KEY, 'Yönetim Paneli'); localStorage.setItem(ADMIN_TAB_KEY, page); syncRouteToAddress(); if(page === 'Kullanıcı Yetkileri') loadUsers(); if(page === 'Özellik Planı' || page === 'Uygulama Merkezi') loadPlanner(false); render(); }

function topbar(){
  const role = normalizeRole(state.session?.role);
  const unread = userNotifications().filter(n=>!state.notificationSeen[n.id] && n.id!=='empty').length;
  return html`<header class="topbar v220Topbar v220TopbarClean fix6Topbar">
    <div class="topbarBrandGhost"><button class="brand cleanBtn compactBrand topbarBrandChip" data-page="Ana Sayfa"><div class="mark">🎮</div><div><b>Hayatımız Oyun</b><span>${VERSION}</span></div></button></div>
    <label class="search v220Search fix4Search fix6Search">🔎 <input id="searchInput" value="${esc(state.query)}" placeholder="Oyun, seri veya etiket ara..." /><kbd>Ctrl K</kbd></label>
    <div class="topActions v220UserActions fix6TopActions">
      ${state.session ? `<button class="notifyTopBtn" data-page="Bildirimler" title="Bildirimler">🔔 <b>${unread}</b></button>` : ''}
      ${state.session ? `<button class="avatarChip fix6AvatarChip" data-page="Profilim"><span>${esc((state.session.full_name || state.session.email || 'H')[0]).toUpperCase()}</span><div><b>${esc(state.session.full_name || 'Hayatımız Oyun')}</b><small>${esc(displayRole(role))}</small></div></button>` : `<button class="btn" data-action="open-login">Giriş</button><button class="btn primary" data-action="open-register">Kayıt</button>`}
      ${isStaff() ? '<button class="btn primary adminQuick" data-admin="Genel Bakış">Yönetim</button>' : ''}
    </div>
  </header>`;
}
function navIcon(n){ return ({'Ana Sayfa':'⌂','Oyunlar':'🎮','Seriler':'◈','Yayın Takvimi':'▣','Bildirimler':'🔔','Topluluk':'☄'}[n] || '•'); }
function categoryRail(){ return ''; }
function archiveSideNav(){
  const isArchiveActive = item => state.page===item.page || (item.page==='Oyun Arşivi' && ['Popüler','Tamamlanan','Devam Eden','Yakında','Korku','Aksiyon','Hikaye Odaklı'].includes(state.page));
  return `<aside class="v220SideNav fixedArchiveMenu fix5SideNav fix6SideNav">
    <div class="sideLogo fix6SideLogo"><span class="logoMark">🎮</span><div><b>Hayatımız Oyun</b><small>Oyun Arşivi & Seriler</small></div></div>
    <div class="sideNavLabel">MENÜ</div>
    ${sideNavItems().map(item=>`<button class="sideNavItem ${isArchiveActive(item)?'active':''}" data-page="${esc(item.page)}"><span>${item.icon}</span><em>${esc(item.label)}</em></button>`).join('')}
    ${isStaff() ? `<div class="sideNavLabel">YÖNETİM</div><button class="sideNavItem manager ${state.page==='Yönetim Paneli'?'active':''}" data-admin="Genel Bakış"><span>👑</span><div><b>Yönetim</b><small>Yönetici Paneline Git</small></div><strong>›</strong></button>` : ''}
    <div class="supportBox"><span class="supportEmoji">💜</span><b>Koleksiyonunu Genişlet</b><small>Yeni oyunlar keşfet, favorilerini ayır ve seri takibini güncel tut.</small><button class="miniBtn primary" data-page="Oyun Arşivi">Keşfet</button></div>
    <div class="sideFooter"><div class="socialRow"><button class="socialMiniBtn" data-toast="Discord bağlantısı sonraki pakette eklenecek.">💬</button><button class="socialMiniBtn" data-toast="X bağlantısı sonraki pakette eklenecek.">𝕏</button><button class="socialMiniBtn" data-toast="YouTube bağlantısı sonraki pakette eklenecek.">▶</button><button class="socialMiniBtn" data-toast="Instagram bağlantısı sonraki pakette eklenecek.">◎</button></div><small>© 2024 Hayatımız Oyun<br>Tüm hakları saklıdır.</small></div>
  </aside>`;
}
function withArchiveLayout(content){
  return `<section class="v220Shell v220ShellPersistent">${archiveSideNav()}<main class="v220HomeMain v220ContentMain">${content}</main></section>`;
}
function maintenancePage(){
  const eta = String(state.maintenance?.eta || '').trim();
  const publicNotes = VERSION_NOTES_ARCHIVE.filter(n=>['v2.1.8','v2.1.7','v2.1.6'].includes(n.version)).slice(-3).reverse();
  return html`<section class="maintenanceWrap proMaintenance v218Maintenance"><div class="maintenanceGlow"></div><div class="pulseOrb"></div><div class="maintenanceCard"><div class="loader cinematicLoader"></div><span class="eyebrow">Bakım Modu</span><h1>Hayatımız Oyun güncelleniyor.</h1><p>${esc(state.maintenance?.message || 'Site kısa süreli bakımda. Lütfen daha sonra tekrar dene.')}</p>${eta ? `<div class="maintenanceEta"><span>Tahmini açılış</span><b>${esc(eta)}</b></div>` : ''}<div class="maintenancePublicNotes"><b>Kullanıcıyı ilgilendiren yenilikler</b>${publicNotes.map(n=>`<span>${esc(n.version)} • ${esc(n.title)}</span>`).join('')}</div><div class="maintenanceSteps"><span></span><span></span><span></span></div><div class="authButtons"><button class="btn primary" data-action="open-login">Yetkili Girişi</button>${isStaff()?'<button class="btn" data-admin="Bakım Modu">Yönetim Paneli</button>':''}</div></div></section>`;
}
function authLanding(){
  return html`<section class="authWrap"><div class="authCard"><span class="eyebrow">Oyun arşivi • üyelik sistemi</span><h1>Hayatımız Oyun arşivine giriş yap.</h1><p>Giriş ve kayıt normal kullanıcı hesabıyla yapılır. Kurucu, yönetici, moderatör ve editör yetkileri Supabase tablosundaki rol alanından otomatik okunur.</p><div class="authButtons"><button class="btn primary" data-action="open-login">Giriş Yap</button><button class="btn" data-action="open-register">Kayıt Ol</button></div><div class="note" style="margin-top:22px">Ayrı yetkili/admin girişi yoktur. Şifre veya gizli key ekranda yazmaz.</div></div></section>`;
}
function hero(){
  const games = Array.isArray(state.games) ? state.games : [];
  const active = games.filter(g=>g.status==='Devam Ediyor').length;
  const completed = games.filter(g=>g.status==='Tamamlandı').length;
  const upcoming = games.filter(g=>g.status==='Yakında').length;
  const series = games.filter(g=>Number(g.eps || 0) > 0 || g.seriesName).length;
  return html`<section class="hero userHero premiumHero compactHero"><div class="heroCopy"><span class="eyebrow">Profesyonel oyuncu arşivi</span><h1>Oyun arşivi ve seri takip merkezi.</h1><p>Profesyonel seri merkezi: alfabetik arşiv, kalıcı bölüm ilerlemesi, site içi izleme ve yönetim panelindeki sıra ile düzenlenen seriler.</p><div class="heroActions"><button class="btn primary" data-page="Popüler">Arşivi Keşfet</button><button class="btn" data-page="Seriler">Seriler</button><button class="btn" data-page="Yakında">Yakında</button></div></div><div class="heroStatsPanel"><div class="miniStat"><b>${games.length}</b><span>Oyun</span></div><div class="miniStat"><b>${series}</b><span>Seri</span></div><div class="miniStat"><b>${active}</b><span>Devam eden</span></div><div class="miniStat"><b>${completed}</b><span>Tamamlanan</span></div><div class="miniStat"><b>${upcoming}</b><span>Yakında</span></div></div></section>`;
}
function normalizeCollectionText(value){
  return String(value || '').trim();
}
function addCollection(map, id, title, description, items){
  const cleanItems = Array.isArray(items) ? items.filter(Boolean) : [];
  if(!cleanItems.length) return;
  const safeId = routeSlug(id || title || 'koleksiyon');
  if(map.has(safeId)){
    const existing = map.get(safeId);
    const ids = new Set(existing.items.map(g => String(g.id)));
    cleanItems.forEach(g => { if(!ids.has(String(g.id))){ existing.items.push(g); ids.add(String(g.id)); } });
    return;
  }
  map.set(safeId, { id:safeId, title, description, items:cleanItems });
}
function buildCollections(){
  const games = Array.isArray(state.games) ? state.games : [];
  const map = new Map();
  const has = (g, words) => words.some(w => `${g.title || ''} ${g.genre || ''} ${g.tags || ''} ${g.status || ''} ${g.seriesName || ''}`.toLocaleLowerCase('tr-TR').includes(w.toLocaleLowerCase('tr-TR')));

  addCollection(map, 'devam-eden', 'Devam Eden Seriler', 'Aktif oynanan veya bölümlenen oyunlar', games.filter(g => g.status === 'Devam Ediyor'));
  addCollection(map, 'tamamlanan', 'Tamamlanan Arşiv', 'Bitmiş ve arşive alınmış oyunlar', games.filter(g => g.status === 'Tamamlandı'));
  addCollection(map, 'yakinda', 'Yakında / Planlanan', 'Planlanan yayınlar ve gelecek oyunlar', games.filter(g => g.status === 'Yakında'));
  addCollection(map, 'populer', 'Popüler Oyunlar', 'Yüksek skorlu veya popüler durumundaki oyunlar', games.filter(g => g.status === 'Popüler' || Number(g.score || 0) >= 9.2));
  addCollection(map, 'favoriler', 'Favoriler', 'Kullanıcının favoriye aldığı oyunlar', games.filter(g => isFavorite(g.id)));

  addCollection(map, 'korku', 'Korku Koleksiyonu', 'Korku türündeki oyunlar', games.filter(g => has(g, ['korku','horror','resident','silent hill','alan wake','outlast','dead space'])));
  addCollection(map, 'aksiyon', 'Aksiyon Koleksiyonu', 'Aksiyon ve macera ağırlıklı oyunlar', games.filter(g => has(g, ['aksiyon','action','macera','adventure'])));
  addCollection(map, 'hikaye', 'Hikaye Odaklı', 'Hikaye, RPG ve sinematik deneyimler', games.filter(g => has(g, ['hikaye','story','rpg','odaklı','narrative'])));
  addCollection(map, 'turkce', 'Türkçe İçerikler', 'Türkçe altyazı veya dublaj etiketi olan oyunlar', games.filter(g => has(g, ['türkçe altyazılı','turkce altyazili','türkçe dublajlı','turkce dublajli'])));
  addCollection(map, 'coop', 'Coop / Çok Oyunculu', 'Coop, online veya çok oyunculu etiketleri', games.filter(g => has(g, ['coop','co-op','çok oyunculu','cok oyunculu','online'])));

  const genreMap = new Map();
  games.forEach(g => {
    String(g.genre || '').split(/[\/,|]+/).map(normalizeCollectionText).filter(Boolean).forEach(genre => {
      const key = `tur-${routeSlug(genre)}`;
      if(!genreMap.has(key)) genreMap.set(key, { name:genre, items:[] });
      genreMap.get(key).items.push(g);
    });
  });
  Array.from(genreMap.values()).filter(x => x.items.length >= 2).slice(0,10).forEach(x => addCollection(map, `tur-${x.name}`, `Tür: ${x.name}`, 'Aynı türdeki oyunlar', x.items));

  const tagMap = new Map();
  games.forEach(g => splitTags(g.tags).forEach(tag => {
    const key = `etiket-${routeSlug(tag)}`;
    if(!tagMap.has(key)) tagMap.set(key, { name:tag, items:[] });
    tagMap.get(key).items.push(g);
  }));
  Array.from(tagMap.values()).filter(x => x.items.length >= 2).slice(0,10).forEach(x => addCollection(map, `etiket-${x.name}`, `Etiket: ${x.name}`, 'Aynı etikete sahip oyunlar', x.items));

  Array.from(new Set(games.map(g => normalizeCollectionText(g.seriesName)).filter(Boolean))).slice(0,10).forEach(name => {
    addCollection(map, `seri-${name}`, `Seri: ${name}`, 'Aynı seri altında toplanan oyunlar', games.filter(g => normalizeCollectionText(g.seriesName) === name));
  });

  return Array.from(map.values()).sort((a,b) => b.items.length - a.items.length || a.title.localeCompare(b.title, 'tr'));
}
function publicStats(){
  const games = Array.isArray(state.games) ? state.games : [];
  const series = games.filter(g=>Number(g.eps || 0) > 0 || g.seriesName).length;
  const totalEpisodes = games.reduce((a,g)=>a+Number(g.eps || normalizeEpisodes(g.episodes).length || 0),0);
  const watchedEpisodes = games.reduce((a,g)=>a+Number(g.watchedEps || normalizeEpisodes(g.episodes).filter(ep=>ep.watched).length || 0),0);
  const completed = games.filter(g=>String(g.status||'')==='Tamamlandı' || progressPercent(g)>=100).length;
  const missing = games.filter(g=>!String(g.cover || '').trim()).length;
  return `<section class="grid stats publicHighlights proStats v216Stats v218Charts"><div class="card"><b>Toplam Seri</b><h3>${series}</h3><span class="muted">bölümlü içerik</span><div class="statBar"><span style="width:${Math.min(100,series*8)}%"></span></div></div><div class="card"><b>Toplam Bölüm</b><h3>${totalEpisodes}</h3><span class="muted">playlist + manuel</span><div class="statBar"><span style="width:${Math.min(100,totalEpisodes*3)}%"></span></div></div><div class="card"><b>İzlenen Bölüm</b><h3>${watchedEpisodes}</h3><span class="muted">otomatik ilerleme</span><div class="statBar"><span style="width:${totalEpisodes?Math.round((watchedEpisodes/totalEpisodes)*100):0}%"></span></div></div><div class="card"><b>Tamamlanan Seri</b><h3>${completed}</h3><span class="muted">bitmiş arşiv</span><div class="statBar"><span style="width:${games.length?Math.round((completed/games.length)*100):0}%"></span></div></div></section><section class="viewTools"><button class="miniBtn ${state.gameViewMode==='grid'?'primary':''}" data-view-mode="grid">Kart Görünüm</button><button class="miniBtn ${state.gameViewMode==='compact'?'primary':''}" data-view-mode="compact">Kompakt Liste</button></section>`;
}
function coverFor(g){ return g.cover || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=900&auto=format&fit=crop'; }

function getGameProgress(g){
  const status = String(g.status || '');
  if(status === 'Tamamlandı') return 100;
  if(status === 'Yakında') return 0;
  const eps = Number(g.eps || 0);
  if(eps <= 0) return status === 'Popüler' ? 60 : 25;
  return Math.max(10, Math.min(95, Math.round(eps * 6)));
}
function gameInitial(g){
  const t = String(g.title || '').trim().toLocaleUpperCase('tr-TR');
  if(!t) return '#';
  const first = t[0];
  return /[0-9]/.test(first) ? '1' : first;
}
function sortedVisibleGames(){
  return [...visibleGames()].sort((a,b)=>String(a.title || '').localeCompare(String(b.title || ''), 'tr'));
}
function alphabetNav(games){
  const letters = Array.from(new Set(games.map(g=>gameInitial(g)))).sort((a,b)=>a.localeCompare(b,'tr'));
  if(!letters.length) return '';
  return `<div class="alphabetRail"><span>Harfe git</span>${letters.map(l=>`<a class="${state.selectedLetter===l?'active':''}" href="#harf-${esc(routeSlug(l))}" data-letter-jump="${esc(l)}">${esc(l)}</a>`).join('')}</div>`;
}
function normalizeEpisodes(value){
  let rows = value;
  if(typeof rows === 'string'){ try{ rows = JSON.parse(rows); }catch{ rows = []; } }
  if(!Array.isArray(rows)) rows = [];
  return rows.map((ep,i)=>({
    id:String(ep.id || ep.videoId || `ep-${i+1}`),
    number:Number(ep.number || i+1),
    title:String(ep.title || `${i+1}. Bölüm`),
    description:String(ep.description || ''),
    thumbnail:String(ep.thumbnail || ep.cover || ''),
    videoUrl:String(ep.videoUrl || ep.url || (ep.videoId ? `https://www.youtube.com/watch?v=${ep.videoId}` : '')),
    videoId:String(ep.videoId || youtubeVideoId(ep.videoUrl || ep.url || '') || ''),
    watched:ep.watched === true
  })).sort((a,b)=>Number(a.number||0)-Number(b.number||0));
}
function cleanEpisodeTitle(value, number){
  let title = String(value || '').replace(/\s+/g, ' ').trim();
  title = title.replace(/^\d+\s*[|.)-]\s*/,'');
  title = title.replace(/\s*[-–—]\s*YouTube\s*$/i,'').trim();
  return title || `${number || 1}. Bölüm`;
}
function episodesToText(episodes){
  return normalizeEpisodes(episodes).map(ep => {
    const number = Number(ep.number || 1);
    const title = cleanEpisodeTitle(ep.title, number).replace(/\|/g, ' / ');
    const url = String(ep.videoUrl || '').trim();
    const thumb = String(ep.thumbnail || '').trim();
    const publishAt = String(ep.publishAt || ep.publish_at || '').trim();
    const note = String(ep.note || ep.personalNote || '').replace(/\|/g, ' / ').trim();
    return `${number}|${title}|${url}|${thumb}|${publishAt}|${note}`;
  }).join('\n');
}
function parseEpisodesText(text){
  const rawText = String(text || '').trim();
  if(!rawText) return [];
  try{ const parsed = JSON.parse(rawText); if(Array.isArray(parsed)) return normalizeEpisodes(parsed); }catch{}
  return rawText.split(/\r?\n/).map((line,i)=>{
    const raw = line.trim(); if(!raw) return null;
    const parts = raw.split('|');
    const number = parts.length > 1 ? Number(parts[0] || i+1) : i+1;
    const title = parts.length > 1 ? parts[1] : raw.replace(/^\d+[.)-]?\s*/, '');
    const videoUrl = parts.length > 2 ? parts[2] : '';
    const videoId = youtubeVideoId(videoUrl);
    return { id: videoId ? `yt-${videoId}` : `ep-${i+1}`, number, title:cleanEpisodeTitle(title, number), videoUrl, thumbnail:parts[3] || (videoId ? `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg` : ''), publishAt:parts[4] || '', note:parts[5] || '', description:'', watched:false };
  }).filter(Boolean);
}
function episodeImportPreview(episodesText, episodes){
  const rows = parseEpisodesText(episodesText || episodesToText(episodes || [])).slice(0, 80);
  if(!rows.length) return '<div class="episodePreview empty">Playlistten video çekilince bölümler burada profesyonel liste olarak görünür.</div>';
  return `<div class="episodePreview">${rows.map(ep=>`<div class="episodePreviewRow"><span class="episodeNo">${esc(ep.number)}</span>${ep.thumbnail?`<img src="${esc(ep.thumbnail)}" onerror="this.style.display=\'none\'">`:''}<b>${esc(ep.title)}</b><small>${ep.videoUrl?'Video hazır':'Video linki yok'}${ep.publishAt?' • '+esc(ep.publishAt):''}</small></div>`).join('')}</div>`;
}
function youtubeVideoId(raw){
  const url = String(raw || '').trim();
  if(!url) return '';
  try{ const u = new URL(url); const host = u.hostname.replace('www.',''); if(u.searchParams.get('v')) return u.searchParams.get('v'); if(host === 'youtu.be') return u.pathname.replace('/','').split('/')[0]; const m = u.pathname.match(/\/embed\/([^/?#]+)/); if(m) return m[1]; }catch{}
  return '';
}
function progressPercent(g){ const eps = normalizeEpisodes(g.episodes); const total = Number(g.eps || eps.length || 0); const watched = Number(g.watchedEps || eps.filter(ep=>ep.watched).length || 0); if(!total) return String(g.status || '') === 'Tamamlandı' ? 100 : 0; return Math.max(0, Math.min(100, Math.round((watched / total) * 100))); }
function seriesEpisodes(g){ const eps = normalizeEpisodes(g.episodes); if(eps.length) return eps; const total = Math.max(0, Number(g.eps || 0)); return Array.from({length: total}, (_,i)=>({ id:`manual-${i+1}`, number:i+1, title:`${i+1}. Bölüm`, videoUrl: watchTargetUrl(g), thumbnail:g.cover || '', description:'', watched:i < Number(g.watchedEps||0) })); }
function watchTargetUrl(g){ return String(g.videoUrl || g.video_url || g.playlistUrl || g.playlist_url || '').trim(); }
function youtubeEmbedUrl(raw){
  const url = String(raw || '').trim();
  if(!url) return '';
  try{
    const u = new URL(url);
    const host = u.hostname.replace('www.','');
    const list = u.searchParams.get('list');
    const v = u.searchParams.get('v');
    if(list) return `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(list)}`;
    if(v) return `https://www.youtube.com/embed/${encodeURIComponent(v)}`;
    if(host === 'youtu.be'){
      const id = u.pathname.replace('/','').trim();
      if(id) return `https://www.youtube.com/embed/${encodeURIComponent(id)}`;
    }
    const embedMatch = u.pathname.match(/\/embed\/([^/?#]+)/);
    if(embedMatch) return url;
  }catch{}
  return '';
}
function episodeEmbedUrl(ep, fallback){
  const raw = String(ep?.videoUrl || '').trim();
  const id = ep?.videoId || youtubeVideoId(raw);
  if(id) return `https://www.youtube.com/embed/${encodeURIComponent(id)}`;
  return youtubeEmbedUrl(fallback);
}
function watchButtonHtml(g){
  const hasSeries = Number(g.eps || 0) > 0 || String(g.seriesName || '').trim();
  if(String(g.status || '') === 'Yakında') return `<button class="miniBtn disabled" disabled>Yakında</button>`;
  if(hasSeries || watchTargetUrl(g)) return `<button class="miniBtn primary" data-watch-series="${esc(g.id)}">Seriyi İzle</button>`;
  return `<button class="miniBtn" data-toast="${esc(g.title)} için izleme bağlantısı eklenmemiş.">Seriyi İzle</button>`;
}

function gameCard(g, adminActions){
  const progress = progressPercent(g) || getGameProgress(g);
  const desc = fix4Description(g).slice(0,135);
  const cardClass = adminActions ? 'game v214GameCard adminGameCard fix4AdminGameCard' : `game v214GameCard fix4ArchiveCard ${state.gameViewMode==='compact'?'compactGameCard':''}`;
  return `<article class="${cardClass}"><div class="coverWrap fix4Cover"><img src="${esc(coverFor(g))}" alt="${esc(g.title)}">${featureEnabled('missing_cover_warning') && !g.cover ? '<span class="coverWarn">Kapak eksik</span>' : ''}<span class="scoreBadge fix4Score">${esc(String(g.score || '8.5'))}</span><button class="heartBtn" data-favorite-game="${esc(g.id)}">${isFavorite(g.id)?'♥':'♡'}</button></div><div class="gameBody"><div class="cardTopline"><span class="pill">${esc(g.status)}</span>${g.releaseDate ? `<span class="pill softPill">${esc(g.releaseDate)}</span>` : ''}${g.seriesName?`<span class="pill softPill">${esc(g.seriesName)}</span>`:''}</div><h3>${esc(g.title)}</h3><p class="gameDesc">${esc(desc)}${desc.length>=135?'...':''}</p>${tagChipsHtml(g.tags || g.genre)}<div class="progressMeta"><small>İlerleme</small><b>%${progress}</b></div><div class="progressLine"><span style="width:${progress}%"></span></div><div class="gameMetaLine"><small>${Number(g.watchedEps || 0)}/${Number(g.eps || 0)} bölüm</small><small>${g.seriesName ? 'Sıra: '+esc(g.seriesOrder || '-') : 'Tek oyun'}</small></div>${adminActions ? `<div class="gameAdminActions"><button class="miniBtn" data-game-edit="${esc(g.id)}">Formda Düzenle</button><button class="miniBtn danger" data-game-delete="${esc(g.id)}">Sil</button></div>` : `<div class="gameAdminActions">${watchButtonHtml(g)}<button class="miniBtn" data-favorite-game="${esc(g.id)}">${isFavorite(g.id)?'Favoriden Çıkar':'Favoriye Ekle'}</button></div>`}</div></article>`;
}


function gameGrid(){
  const games = sortedVisibleGames();
  const adminActions = isStaff() && state.page === 'Yönetim Paneli' && state.adminPage === 'Oyunlar';
  if(!games.length) return '<section class="games fix4ArchiveGrid"><div class="card wide">Oyun bulunamadı.</div></section>';
  if(adminActions) return `${seriesGroupPanel(games)}<div class="games fix4ArchiveGrid adminGrid">${games.map(g=>gameCard(g, true)).join('')}</div>`;
  return `<section class="fix4ArchivePage"><div class="fix4ArchiveHeader"><div><span class="eyebrow">Profesyonel Arşiv</span><h1>${state.page === 'Favoriler' ? 'Favoriler' : 'Oyun Arşivi'}</h1><p class="muted">Sıkışmayan kapaklar, açıklamalı kartlar ve temiz kategori geçişleri.</p></div><span class="pill green">${games.length} oyun</span></div>${advancedSearchPanel()}<div class="games fix4ArchiveGrid">${games.map(g=>gameCard(g, false)).join('')}</div></section>`;
}

function seriesGroupPanel(games){
  if(!state.showSeriesSortPanel) return '<section class="card wide seriesManager compactSeriesSort"><div class="sectionHead"><div><h3>Seri Sıralama</h3><p class="muted">Oyun sıralaması artık ayrı butonla açılır; yönetim panelindeki üst kategori çubukları aşağı kaydırınca ekrana yapışmaz.</p></div><button class="miniBtn primary" data-action="open-series-sort-panel">Seri Sıralamayı Aç</button></div></section>';
  const groups = sortedSeriesGroups(games);
  const blocks = groups.map(({name,items})=>`<details class="seriesGroup" open><summary><b>${esc(name)}</b><span>${items.length} kayıt</span></summary><div class="seriesOrderList">${items.map(g=>`<div><span>${esc(g.title)}</span><label>Sıra <input data-series-order-game="${esc(g.id)}" type="number" value="${esc(String(g.seriesOrder||0))}"></label></div>`).join('')}</div></details>`).join('');
  return `<section class="card wide seriesManager"><div class="sectionHead"><div><h3>Seri Gruplama ve Toplu Sıra</h3><p class="muted">Her seri kendi altında; kayıtlar verdiğin sıra numarasına göre dizilir.</p></div><div class="rowActions"><span class="pill green">v2.1.8</span><button class="miniBtn" data-action="open-series-sort-panel">Kapat</button><button class="miniBtn primary" data-action="save-series-orders">Seri Sırasını Kalıcı Kaydet</button></div></div>${blocks}</section>`;
}

function calendarPage(){
  const monthTitle = 'Mayıs 2024';
  const events = {
    '1': [{ time:'20:00', title:'Elden Ring', tone:'purple' }],
    '3': [{ time:'21:00', title:'God of War', tone:'blue' }],
    '5': [{ time:'20:00', title:'Cyberpunk 2077', tone:'purple' }],
    '7': [{ time:'21:30', title:'The Witcher 3', tone:'purple' }],
    '14': [{ time:'20:30', title:"Assassin's Creed", tone:'blue' }],
    '16': [{ time:'21:00', title:'The Witcher 3', tone:'purple' }],
    '18': [{ time:'20:00', title:'Cyberpunk 2077', tone:'blue' }],
    '21': [{ time:'21:30', title:'Sekiro', tone:'purple' }],
    '24': [{ time:'20:00', title:'God of War', tone:'blue' }],
    '26': [{ time:'19:00', title:"Baldur's Gate 3", tone:'pink' }],
    '28': [{ time:'20:00', title:'Elden Ring', tone:'purple' }],
    '31': [{ time:'20:00', title:'Dragon Age', tone:'pink' }]
  };
  const dayNames = ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'];
  const rows = [
    ['29','30','1','2','3','4','5'],
    ['6','7','8','9','10','11','12'],
    ['13','14','15','16','17','18','19'],
    ['20','21','22','23','24','25','26'],
    ['27','28','29','30','31','1','2']
  ];
  const upcoming = [
    { title:'Elden Ring', subtitle:'Ana Hikaye Devamı', date:'20 Mayıs 2024, 20:00', left:'20dk', cover:'https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.jpg' },
    { title:'God of War Ragnarök', subtitle:'Yeni Oyun+', date:'21 Mayıs 2024, 21:00', left:'1g 1sa', cover:'https://images.igdb.com/igdb/image/upload/t_cover_big/co5s6x.jpg' },
    { title:'Cyberpunk 2077', subtitle:'Phantom Liberty DLC', date:'24 Mayıs 2024, 20:00', left:'3g 20sa', cover:'https://images.igdb.com/igdb/image/upload/t_cover_big/co7497.jpg' },
    { title:"Baldur's Gate 3", subtitle:'Taktik Savaşları', date:'26 Mayıs 2024, 19:00', left:'5g 19sa', cover:'https://images.igdb.com/igdb/image/upload/t_cover_big/co670h.jpg' }
  ];
  const week = [
    ['20 Pzt','20:00','Elden Ring'],
    ['21 Sal','21:00','God of War Ragnarök'],
    ['22 Çar','—','Yayın Yok'],
    ['23 Per','21:00','The Witcher 3'],
    ['24 Cum','20:00','Cyberpunk 2077'],
    ['25 Cmt','21:00','Topluluk Gecesi'],
    ['26 Paz','19:00',"Baldur's Gate 3"]
  ];
  const features = [
    { day:'25 MAY', title:'Topluluk Gecesi', desc:'Topluluk ile beraber Among Us gecesi!', meta:'Cmt 21:00', badge:'Topluluk', cover:'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop' },
    { day:'01 HAZ', title:'Yaz Sezonu Başlangıcı', desc:'Yeni sezonda yeni oyunlar!', meta:'Cmt 20:00', badge:'Özel', cover:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop' },
    { day:'08 HAZ', title:'Indie Oyun Gecesi', desc:'Bağımsız oyunları keşfediyoruz.', meta:'Cmt 21:00', badge:'Özel', cover:'https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=800&auto=format&fit=crop' },
    { day:'15 HAZ', title:'400K Özel Yayını', desc:'Büyük çekiliş ve sürprizler!', meta:'Cmt 20:00', badge:'Özel', cover:'https://images.unsplash.com/photo-1511882150382-421056c89033?q=80&w=800&auto=format&fit=crop' }
  ];
  return `<section class="fix6CalendarShell">
    <div class="fix6CalendarMain card wide">
      <div class="fix6CalendarHead"><div><span class="calendarIcon">▣</span><div><h1>Yayın Takvimi</h1><p class="muted">Yaklaşan yayınları, etkinlikleri ve özel içerikleri kaçırma.</p></div></div></div>
      <div class="fix6CalendarToolbar"><div class="toolbarGroup"><button class="miniBtn">‹</button><button class="miniBtn primary">Bugün</button><button class="miniBtn">›</button></div><div class="monthChip">${monthTitle}</div><div class="toolbarGroup"><button class="miniBtn primary">Ay</button><button class="miniBtn">Hafta</button><button class="miniBtn">Gün</button><button class="miniBtn">Filtrele</button></div></div>
      <div class="fix6CalendarGrid">${dayNames.map(d=>`<div class="dayHead">${d}</div>`).join('')}${rows.map((weekArr,rowIndex)=>weekArr.map(d=>{ const inMonth = !((rowIndex===0 && Number(d)>7) || (rowIndex===4 && Number(d)<8)); const cellEvents = inMonth ? (events[d] || []) : []; const selected = d==='20' && rowIndex===3; return `<div class="dayCell ${inMonth?'':'mutedCell'} ${selected?'today':''}"><span class="dayNo">${d}</span>${cellEvents.map(ev=>`<div class="calEvent ${ev.tone}"><small>${ev.time}</small><b>${esc(ev.title)}</b></div>`).join('')}</div>`; }).join('')).join('')}</div>
      <div class="fix6CalendarLegend"><span><i class="purple"></i>Ana Yayın</span><span><i class="pink"></i>Seri Devamı</span><span><i class="green"></i>Özel Etkinlik</span><span><i class="blue"></i>Topluluk Yayını</span><span><i class="yellow"></i>Etkinlik</span></div>
      <div class="fix6CalendarSectionHead"><h3>Öne Çıkan Etkinlikler</h3><button class="miniBtn">Tüm Etkinlikler ›</button></div>
      <div class="fix6EventCards">${features.map(item=>`<article class="eventCard"><img src="${item.cover}" alt="${esc(item.title)}"><div class="dateBadge">${item.day.replace(' ','<br>')}</div><div class="eventInfo"><h4>${esc(item.title)}</h4><p>${esc(item.desc)}</p><div class="eventMeta"><span>${esc(item.meta)}</span><b>${esc(item.badge)}</b></div></div></article>`).join('')}</div>
    </div>
    <aside class="fix6CalendarAside">
      <section class="card"><div class="sectionHead"><h3>Yaklaşan Yayınlar</h3><button class="miniBtn">Tümünü Gör</button></div><div class="upcomingList">${upcoming.map(item=>`<div class="upcomingItem"><img src="${item.cover}" alt="${esc(item.title)}"><div><b>${esc(item.title)}</b><small>${esc(item.subtitle)}</small><span>${esc(item.date)}</span></div><strong>${esc(item.left)}<br>sonra</strong></div>`).join('')}</div><button class="miniBtn">Hatırlatıcıları Yönet ›</button></section>
      <section class="card"><h3>Bu Hafta</h3><div class="weekList">${week.map(item=>`<div class="weekRow"><span>${esc(item[0])}</span><b>${esc(item[1])}</b><small>${esc(item[2])}</small></div>`).join('')}</div><button class="miniBtn">Tüm Takvime Git ›</button></section>
    </aside>
  </section>`;
}

function collectionsPage(){
  const collections = buildCollections();
  const filters = uniqueGameFilters();
  const selected = state.collectionFilter || 'Tümü';
  const visibleCollections = collections.filter(c => selected === 'Tümü' || c.items.some(g=>gameMatchesFilter(g, selected)) || textHas(c.title, selected));
  const cards = visibleCollections.map(c => {
    const items = c.items.filter(g=>gameMatchesFilter(g, selected));
    const showItems = selected === 'Tümü' ? c.items : (items.length ? items : c.items);
    return `<div class="card soft collectionCard"><div class="sectionHead"><div><b>${esc(c.title)}</b><p class="muted">${esc(c.description)}</p></div><span class="pill green">${showItems.length} oyun</span></div><div class="collectionList">${showItems.slice(0,12).map(g=>`<button class="miniBtn" data-page="Popüler" data-toast="${esc(g.title)} koleksiyonda görünüyor.">${esc(g.title)}</button>`).join('')}</div></div>`;
  }).join('');
  const countText = selected === 'Tümü' ? `${collections.length} koleksiyon` : `${visibleCollections.length}/${collections.length} koleksiyon`;
  return `<section class="card wide"><div class="sectionHead"><div><h2>Koleksiyonlar</h2><p class="muted">v2.1.3 ile koleksiyonlar durum, tür, etiket, seri ve favori verisine göre dinamik hesaplanır.</p></div><span class="pill green">${countText}</span></div><div class="filterChips">${filters.map(f=>`<button class="tagBtn ${selected===f?'active':''}" data-filter-chip="${esc(f)}">${esc(f)}</button>`).join('')}</div><div class="grid collectionGrid">${cards || '<div class="card soft"><b>Henüz koleksiyon yok</b><span>Oyunlara tür, durum, seri veya etiket ekleyince koleksiyonlar burada otomatik oluşur.</span></div>'}</div></section>`;
}
function profilePage(){
  if(!state.session) return authGate();
  const role = normalizeRole(state.session.role);
  const avatarUrl = state.session.avatar_url || '';
  const avatar = avatarUrl ? `<img src="${esc(avatarUrl)}" alt="Profil fotoğrafı">` : esc((state.session.full_name || state.session.email || 'H')[0]).toUpperCase();
  return html`<section class="profileGrid"><div class="card profileCard"><div class="avatar profileAvatar">${avatar}</div><h2>Profilim</h2><p class="muted">Hesap bilgileri ve yetki durumu</p><span class="pill ${role}">${esc(displayRole(role))}</span><div class="profileInfo"><p><b>Ad Soyad:</b> ${esc(state.session.full_name || 'Belirtilmedi')}</p><p><b>E-posta:</b> ${esc(state.session.email)}</p><p><b>Durum:</b> ${normalizeRole(state.session.role)==='banned' || state.session.is_active === false ? 'Banlı' : 'Aktif'}</p></div></div><form class="card profileEdit" id="profileForm"><h3>Profil Bilgilerini Güncelle</h3><label class="field">Ad Soyad<input name="fullName" value="${esc(state.session.full_name || '')}" /></label><label class="field">Profil Fotoğrafı URL<input name="avatarUrl" value="${esc(avatarUrl)}" placeholder="Supabase Storage public URL veya görsel linki" /></label><label class="field">Gerçek Storage Yükleme<input name="avatarFile" type="file" accept="image/*" /></label><button class="btn primary" type="submit">Profili Kaydet / Fotoğrafı Yükle</button><p class="note">v2.1.5: Dosya seçersen görsel profile-photos bucket içine yüklenir ve avatar URL otomatik güncellenir.</p></form></section>`;
}

function seriesKey(g){ return String(g.seriesName || 'Tek Oyunlar').trim() || 'Tek Oyunlar'; }
function sortedSeriesGroups(games = state.games){
  const groups = new Map();
  (games || []).forEach(g=>{
    const key = seriesKey(g);
    if(!groups.has(key)) groups.set(key, []);
    groups.get(key).push(g);
  });
  return Array.from(groups.entries()).map(([name,items])=>({ name, items:items.slice().sort((a,b)=>Number(a.seriesOrder||9999)-Number(b.seriesOrder||9999)||String(a.title).localeCompare(String(b.title),'tr')) }))
    .sort((a,b)=>{
      const ao = Math.min(...a.items.map(x=>Number(x.seriesOrder||9999)));
      const bo = Math.min(...b.items.map(x=>Number(x.seriesOrder||9999)));
      return ao - bo || a.name.localeCompare(b.name,'tr');
    });
}
function seriesDirectoryPage(){
  const groups = sortedSeriesGroups(state.games.filter(g=>String(g.seriesName||'').trim() || Number(g.eps||0)>0));
  if(!groups.length) return `<section class="card wide"><h2>Seriler</h2><p class="muted">Henüz seri kaydı yok. Yönetim Paneli > Oyunlar bölümünden seri adı ve sıra numarası ekle.</p></section>`;
  const activeName = state.activeSeriesName || groups[0].name;
  const active = groups.find(g=>g.name===activeName) || groups[0];
  return `<section class="seriesHub"><div class="seriesHubHead"><div><span class="eyebrow">Profesyonel Seri Kategorileri</span><h1>Seriler</h1><p class="muted">Her seri kendi altında, yönetim panelinde verdiğin seri sıra numarasına göre listelenir.</p></div><span class="pill green">${groups.length} seri</span></div><div class="seriesHubLayout"><aside class="seriesListNav">${groups.map(g=>`<button class="seriesNavItem ${g.name===active.name?'active':''}" data-series-tab="${esc(g.name)}"><b>${esc(g.name)}</b><small>${g.items.length} oyun</small></button>`).join('')}</aside><main class="seriesShelf"><div class="sectionHead"><div><h2>${esc(active.name)}</h2><p class="muted">Seri içi sıralama: yönetim panelindeki sıra numarasına göre.</p></div><button class="miniBtn primary" data-watch-series="${esc(active.items[0]?.id||'')}">Seriyi Tümünü İzle</button><button class="miniBtn" data-admin="Seri İzleme">Serileri Yönet</button></div><div class="seriesShelfGrid">${active.items.map((g,i)=>`<article class="seriesShelfCard"><span class="seriesIndex">${i+1}</span><img src="${esc(coverFor(g))}" onerror="this.src='https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=900&auto=format&fit=crop'"/><div><span class="pill">Sıra: ${esc(g.seriesOrder||i+1)}</span><h3>${esc(g.title)}</h3><p>${esc(g.genre||'Genel')} • ${Number(g.watchedEps||0)}/${Number(g.eps||seriesEpisodes(g).length||0)} bölüm</p><div class="progressLine"><span style="width:${progressPercent(g)}%"></span></div><button class="btn primary" data-watch-series="${esc(g.id)}">Seriyi İzle</button></div></article>`).join('')}</div></main></div></section>`;
}
function playlistSignature(episodes){ return normalizeEpisodes(episodes).map(ep=>`${ep.videoId||videoIdFromUrl(ep.videoUrl)||''}:${cleanEpisodeTitle(ep.title, ep.number)}`).join('|'); }
function compareEpisodes(oldEpisodes, newEpisodes){
  const oldMap = new Map(normalizeEpisodes(oldEpisodes).map(ep=>[String(ep.videoId||videoIdFromUrl(ep.videoUrl)||cleanEpisodeTitle(ep.title, ep.number)).trim(), ep]));
  let added=0, changed=0;
  normalizeEpisodes(newEpisodes).forEach(ep=>{ const key=String(ep.videoId||videoIdFromUrl(ep.videoUrl)||cleanEpisodeTitle(ep.title, ep.number)).trim(); const prev=oldMap.get(key); if(!prev) added++; else if(cleanEpisodeTitle(prev.title, prev.number)!==cleanEpisodeTitle(ep.title, ep.number) || String(prev.thumbnail||'')!==String(ep.thumbnail||'')) changed++; });
  return { added, changed, total:normalizeEpisodes(newEpisodes).length };
}
function healthIssues(){
  const games = Array.isArray(state.games) ? state.games : [];
  return {
    youtube: games.filter(g=>{ const hasEpisodes = normalizeEpisodes(g.episodes).some(ep=>String(ep.videoUrl||'').trim()); return (Number(g.eps||0)>0 || g.seriesName) && !watchTargetUrl(g) && !hasEpisodes; }),
    cover: games.filter(g=>!String(g.cover||'').trim()),
    story: games.filter(g=>!String(g.description||'').trim()),
    order: games.filter(g=>String(g.seriesName||'').trim() && !Number(g.seriesOrder||0))
  };
}
function mobileBottomNav(){
  if(!state.session || state.page==='Yönetim Paneli') return '';
  const items = [['Ana Sayfa','🏠'],['Seriler','🎬'],['Devam Eden','▶️'],['Takvim','📅'],['Profilim','👤']];
  return `<nav class="mobileBottomNav">${items.map(([p,ico])=>`<button class="${state.page===p?'active':''}" data-page="${esc(p)}"><span>${ico}</span><b>${esc(p.replace('Devam Eden','Devam'))}</b></button>`).join('')}<button data-action="focus-search"><span>🔎</span><b>Ara</b></button></nav>`;
}

function publicPage(){
  if(state.maintenance?.enabled && !isStaff()) return maintenancePage();
  if(!state.session) return authLanding();
  if(state.page === 'Koleksiyonlar') state.page = 'Ana Sayfa';
  if(state.page === 'Yayın Takvimi') state.page = 'Takvim';
  if(state.page === 'Ana Sayfa') return gameArchiveDashboard();
  let content = '';
  if(state.page === 'Takvim') content = calendarPage();
  else if(state.page === 'Bildirimler') content = notificationsPage();
  else if(state.page === 'Seriler') content = seriesDirectoryPage();
  else if(state.page === 'Topluluk') content = communityPage();
  else if(state.page === 'Profilim') content = profilePage();
  else content = gameGrid();
  return withArchiveLayout(content);
}

function gameArchiveDashboard(){
  const games = Array.isArray(state.games) ? state.games : [];
  const featured = games.slice().sort((a,b)=>Number(b.score||0)-Number(a.score||0)).slice(0,6);
  const continued = games.filter(g=>Number(g.eps||0)>0 || String(g.seriesName||'').trim()).slice(0,6);
  const releases = userNotifications().filter(n=>n.gameId).slice(0,4);
  const totalEpisodes = games.reduce((sum,g)=>sum + Number(g.eps || seriesEpisodes(g).length || 0),0);
  const watchedEpisodes = games.reduce((sum,g)=>sum + Number(g.watchedEps || 0),0);
  const completed = games.filter(g=>g.status==='Tamamlandı').length;
  return `<section class="v220Shell fix4Shell">
    ${archiveSideNav()}
    <main class="v220HomeMain fix4HomeMain">
      <section class="v220Hero fix4Hero"><div><span class="eyebrow">Hayatımız Oyun</span><h1>Oyun Arşivi, seriler ve daha fazlası.</h1><p>Oyunları keşfet, serileri takip et, favorilerini ayır, bölümleri site içinde profesyonel sinema ekranıyla izle.</p><div class="heroActions"><button class="btn primary" data-page="Oyun Arşivi">Arşivi Keşfet</button><button class="btn" data-page="Takvim">Yayın Takvimini Gör</button></div></div></section>
      <section class="fix4StatsRow"><div><b>${games.length}</b><span>Oyun</span></div><div><b>${sortedSeriesGroups(games).length}</b><span>Seri</span></div><div><b>${completed}</b><span>Tamamlanan</span></div><div><b>${watchedEpisodes}/${totalEpisodes}</b><span>Bölüm</span></div></section>
      <section class="v220Shelf fix4Shelf"><div class="sectionHead"><div><h2>Öne Çıkan Oyunlar</h2><p class="muted">Kapaklar artık sıkışmadan geniş kartlarda gösterilir.</p></div><button class="miniBtn" data-page="Oyun Arşivi">Tümünü Gör</button></div><div class="fix4FeaturedGrid">${featured.map(g=>miniGameTile(g)).join('') || '<div class="card">Henüz oyun yok.</div>'}</div></section>
      <section class="v220Shelf fix4Shelf"><div class="sectionHead"><div><h2>Devam Eden Serilerim</h2><p class="muted">İlerleme yüzdesi ve bölüm sayısı ile.</p></div><button class="miniBtn" data-page="Seriler">Tümünü Gör</button></div><div class="v220SeriesRow fix4SeriesRow">${continued.map(g=>seriesProgressTile(g)).join('') || '<div class="card">Henüz seri yok.</div>'}</div></section>
      <section class="v220Shelf fix4Shelf"><div class="sectionHead"><div><h2>Yaklaşan Yayınlar</h2><p class="muted">Bildirim merkezinden gelen yayın ve video notları.</p></div><button class="miniBtn" data-page="Bildirimler">Tümü</button></div><div class="fix4ReleaseList">${releases.map(n=>`<button class="releaseItem" data-notification-watch="${esc(n.gameId)}" data-episode="${Number(n.episodeIndex||0)}"><b>${esc(n.title)}</b><small>${esc(n.text)}</small></button>`).join('') || '<p class="muted">Yaklaşan yayın bulunmadı.</p>'}</div></section>
    </main>
    <aside class="v220RightRail fix4RightRail"><div class="profilePanel"><div class="avatar glowAvatar">${esc((state.session?.full_name || state.session?.email || 'H')[0]).toUpperCase()}</div><h3>${esc(state.session?.full_name || 'Hayatımız Oyun')}</h3><span class="pill green">Seviye 24</span><div class="xpLine"><span style="width:64%"></span></div><div class="rightStats"><div><b>${games.length}</b><span>Oyun</span></div><div><b>${sortedSeriesGroups(games).length}</b><span>Seri</span></div><div><b>${completed}</b><span>Tamamlanan</span></div><div><b>${watchedEpisodes}</b><span>İzlenen Bölüm</span></div></div><button class="miniBtn" data-page="Profilim">Profilime Git</button></div><div class="releasePanel"><h3>Son Etkinlikler</h3>${state.watchHistory.slice(0,4).map(h=>`<p class="activityItem">▶ ${esc(h.title)} • ${h.episode}. bölüm</p>`).join('') || '<p class="muted">Henüz etkinlik yok.</p>'}</div></aside>
  </section>`;
}
function sideNavItems(){ return [
  {label:'Ana Sayfa', page:'Ana Sayfa', icon:'⌂'},
  {label:'Oyun Arşivi', page:'Oyun Arşivi', icon:'🎮'},
  {label:'Seriler', page:'Seriler', icon:'◈'},
  {label:'Yayın Takvimi', page:'Takvim', icon:'▣'},
  {label:'Favoriler', page:'Favoriler', icon:'♡'},
  {label:'Bildirimler', page:'Bildirimler', icon:'🔔'},
  {label:'Profilim', page:'Profilim', icon:'👤'}
]; }
function fix4Description(g){ return String(g.description || '').trim() || `${g.title} için arşiv kaydı. Seri ilerlemesini takip et, bölümleri site içinden izle ve favorilerine ekle.`; }
function miniGameTile(g){
  const progress = progressPercent(g);
  const desc = fix4Description(g).slice(0,120);
  return `<article class="v220GameTile fix4HomeGame"><div class="fix4HomeCover"><img src="${esc(coverFor(g))}" alt="${esc(g.title)}"><span class="scoreBadge">${Math.round(Number(g.score||0)*10)}</span></div><div class="fix4HomeInfo"><h3>${esc(g.title)}</h3><p>${esc(desc)}${desc.length>=120?'...':''}</p>${tagChipsHtml(g.tags || g.genre)}<div class="progressLine"><span style="width:${progress}%"></span></div><div class="tileActions">${watchButtonHtml(g)}<button class="miniBtn" data-favorite-game="${esc(g.id)}">${isFavorite(g.id)?'♥':'♡'}</button></div></div></article>`;
}
function seriesProgressTile(g){ const eps=Number(g.eps||seriesEpisodes(g).length||0); const watched=Number(g.watchedEps||0); return `<article class="v220SeriesTile"><img src="${esc(coverFor(g))}" alt="${esc(g.title)}"><div><b>${esc(g.seriesName || g.title)}</b><small>${watched}/${eps}</small></div><div class="progressLine"><span style="width:${progressPercent(g)}%"></span></div><button class="miniBtn primary" data-watch-series="${esc(g.id)}">Sırayla İzle</button></article>`; }
function communityPage(){ return `<section class="card wide"><h2>Topluluk</h2><p class="muted">Topluluk alanı v2.2.0 arayüzüne hazırlandı. İleride yorumlar, öneriler ve seri takip bildirimleri burada genişletilecek.</p></section>`; }
function adminPanel(){
  if(!isStaff()) return `<section class="card"><h2>Yetki gerekiyor</h2><p>Yönetim paneli sadece kurucu, yönetici, moderatör ve editör hesaplarına görünür.</p></section>`;
  const pages = ['Genel Bakış','Oyunlar','Seri İzleme','AI Özellik Merkezi','Profil','Kullanıcı Yetkileri','Güncelleme Notları','Bakım Modu','API/ENV Durumu','Ayarlar'];
  if(!pages.includes(state.adminPage)){
    state.adminPage = 'Genel Bakış';
    try{ localStorage.setItem(ADMIN_TAB_KEY, state.adminPage); }catch{}
  }
  const publicShortcuts = [
    { label:'Ana Sayfa', page:'Ana Sayfa', icon:'⌂', type:'page' },
    { label:'Oyun Arşivi', page:'Oyun Arşivi', icon:'🎮', type:'page' },
    { label:'Seriler', page:'Seriler', icon:'◈', type:'page' },
    { label:'Yayın Takvimi', page:'Takvim', icon:'▣', type:'page' },
    { label:'Bildirimler', page:'Bildirimler', icon:'🔔', type:'page' },
    { label:'Profiller', page:'Profilim', icon:'👤', type:'page' }
  ];
  const adminLinks = [
    { label:'Genel Bakış', page:'Genel Bakış', caption:'Panel durumu' },
    { label:'Kullanıcılar', page:'Kullanıcı Yetkileri', caption:'Rol ve yetkiler' },
    { label:'Oyunlar', page:'Oyunlar', caption:'Arşiv düzenleme' },
    { label:'Seriler', page:'Seri İzleme', caption:'Sıra ve playlist' },
    { label:'AI Özellik Merkezi', page:'AI Özellik Merkezi', caption:'Versiyon özellikleri' },
    { label:'Güncelleme Notları', page:'Güncelleme Notları', caption:'Sürüm notları' },
    { label:'Bakım Modu', page:'Bakım Modu', caption:'Geçici kapatma' },
    { label:'API / ENV', page:'API/ENV Durumu', caption:'Bağlantı durumu' },
    { label:'Ayarlar', page:'Ayarlar', caption:'Site ayarları' }
  ];
  const headerActions = state.adminPage === 'Oyunlar'
    ? `<div class="rowActions"><button class="btn" data-action="toggle-game-form">${state.showGameForm?'Formu Gizle':'Yeni Oyun Ekle'}</button><button class="btn primary" data-action="bulk-sync-playlists">Toplu İşlemler</button></div>`
    : state.adminPage === 'Seri İzleme'
      ? `<div class="rowActions"><button class="btn primary" data-action="bulk-sync-playlists">Toplu Playlist Senkronizasyonu</button></div>`
      : `<span class="pill ${state.maintenance?.enabled?'banned':'green'}">${state.maintenance?.enabled?'Bakım açık':'Bakım kapalı'}</span>`;
  return `<section class="fix5AdminShell"><aside class="fix5AdminSidebar"><div class="sideLogo"><span class="logoMark">🎮</span><div><b>Hayatımız Oyun</b><small>Oyun Arşivi & Seriler</small></div></div><div class="sideNavLabel">MENÜ</div>${publicShortcuts.map(item=>`<button class="sideNavItem ${state.page===item.page?'active':''}" data-page="${esc(item.page)}"><span>${item.icon}</span>${esc(item.label)}</button>`).join('')}<div class="sideNavLabel">YÖNETİM</div><div class="adminAccordion open"><button class="adminAccordionHead ${state.page==='Yönetim Paneli'?'active':''}" data-admin="${esc(state.adminPage || 'Genel Bakış')}"><span>👑</span><div><b>Yönetim Paneli</b><small>${esc(state.session?.full_name || 'Yetkili hesap')}</small></div><strong>⌄</strong></button><div class="adminAccordionBody">${adminLinks.map(link=>`<button class="adminSubLink ${state.adminPage===link.page?'active':''}" data-admin="${esc(link.page)}"><span class="subDot"></span><div><b>${esc(link.label)}</b><small>${esc(link.caption)}</small></div></button>`).join('')}</div></div><div class="sideFooter"><small>© 2024 Hayatımız Oyun<br>Tüm hakları saklıdır.</small></div></aside><div class="adminContent fix5AdminContent"><div class="fix5AdminHeader"><div><div class="adminBreadcrumb">Yönetim Paneli <span>›</span> ${esc(state.adminPage)}</div><h1>${esc(state.adminPage)}</h1><p>${adminSubtitle(state.adminPage)}</p></div>${headerActions}</div>${adminBody()}</div></section>`;
}
function icon(p){ return ({'Genel Bakış':'🛡️','Oyunlar':'🎮','Profil':'👤','Kullanıcı Yetkileri':'👥','Güncelleme Notları':'📝','Bakım Modu':'🔌','API/ENV Durumu':'🗄️','Ayarlar':'⚙️'}[p] || '•'); }
function adminSubtitle(page){
  return ({
    'Genel Bakış':'Teknik kartlar, veri durumu ve yönetim özetleri burada tutulur.',
    'Özellik Planı':'Hazır özellikleri Siteye Uygula ile aktif et; tamamlanan işten sonra yeni madde eklenir.',
    'Uygulama Merkezi':'Panelden açılıp kapanabilen hazır modüllerin durum merkezi.',
    'Kullanıcı Yetkileri':'Kurucu/yönetici hesapları rol verme, banlama ve silme yapabilir.',
    'Profil':'Yetkili hesabın profil bilgileri.',
    'Oyunlar':'Oyun Ekle butonu özellik planından uygulandıktan sonra görünür.',
    'Bakım Modu':'Global bakım kilidi giriş yapmayanlara ve normal kullanıcılara uygulanır.',
    'AI Özellik Merkezi':'Site üzerinden özellik öner, versiyon planına al ve güncelleme notlarına işle.'
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
  if(state.adminPage === 'Seri İzleme') return adminSeriesWatchPanel();
  if(state.adminPage === 'AI Özellik Merkezi') return (typeof v223FeatureCenter === 'function' ? v223FeatureCenter() : applicationCenter());
  if(state.adminPage === 'API/ENV Durumu') return apiStatus();
  if(state.adminPage === 'Ayarlar') return settingsPanel();
  return overviewAdmin();
}
function overviewAdmin(){
  return `<section class="grid stats adminStats"><div class="card"><b>Oyun</b><h3>${state.games.length}</h3><span class="muted">arşiv verisi</span></div><div class="card"><b>Güncelleme</b><h3>${state.updates.length}</h3><span class="muted">not</span></div><div class="card"><b>Veri durumu</b><h3>${state.runtimeLoaded?'Bağlandı':'Local'}</h3><span class="muted">Supabase/API</span></div><div class="card"><b>Oyun ekleme</b><h3>Aktif</h3><span class="muted">meta/kapak/etiket</span></div></section><section class="card wide"><h2>v2.2.0 paketi aktif</h2><p>Profesyonel oyun arşivi arayüzü, çalışan bildirim butonları, büyütülmüş sitede izleme ekranı ve YouTube senkron altyapısı aktif.</p><button class="btn primary" data-admin="Oyunlar">Oyunlar Sekmesini Aç</button></section>`;
}

function missingCoverPanel(){
  const missing = state.games.filter(g=>!String(g.cover || '').trim());
  return `<div class="card soft missingCoverPanel"><div class="sectionHead"><div><h3>Eksik Kapak Kontrolü</h3><p class="muted">Kapaksız oyunlar tek ekranda listelenir. RAWG öneri sistemiyle kapak hazırlayabilirsin.</p></div><span class="pill ${missing.length?'banned':'green'}">${missing.length} eksik</span></div>${missing.length ? `<div class="missingCoverList">${missing.map(g=>`<div><b>${esc(g.title)}</b><small>${esc(g.genre || 'Genel')} • ${esc(g.status || '-')}</small><button class="miniBtn" data-game-edit="${esc(g.id)}">Düzenle</button></div>`).join('')}</div><button class="btn primary" data-action="auto-cover-fetch">Eksik Kapaklara Öneri Hazırla</button>` : '<p class="note greenNote">Tüm oyunlarda kapak var.</p>'}</div>`;
}

function gamesAdmin(){
  const buttons = `<button class="btn" data-action="toggle-game-form">+ Yeni Oyun Ekle</button><button class="btn primary">Toplu İşlemler ▾</button>`;
  return `<section class="fix5AdminGamesPage"><div class="fix5AdminHeader"><div><div class="adminBreadcrumb">Yönetim Paneli <span>›</span> Oyunlar</div><h1>Yönetim Paneli</h1><p>Oyun ekleme, önizleme ve tablo görünümü referans tasarıma yaklaştırıldı.</p></div><div class="rowActions">${buttons}</div></div><div class="fix5AdminSectionStack">${state.showGameForm ? gameAddForm() : '<section class="card wide fix5CollapsedHint"><div><h3>Oyun formu kapalı</h3><p class="muted">Yeni Oyun Ekle ile detaylı formu tekrar açabilirsin.</p></div><button class="btn primary" data-action="toggle-game-form">Formu Aç</button></section>'}${state.editingGameId ? gameEditForm() : ''}${rawgCandidatePanel()}${coverSuggestionPanel()}${adminGamesTable()}</div></section>`;
}
const GAME_TAG_OPTIONS = ['Türkçe Altyazılı','Türkçe Dublajlı','DLC','Coop','%100','Tek Oyunculu','Çok Oyunculu','Online','Hikaye','Açık Dünya','Rehber','Final'];
function splitTags(value){
  return String(value || '').split(',').map(t=>t.trim()).filter(Boolean);
}
function tagButtonsHtml(selectedText){
  const selected = new Set(splitTags(selectedText).map(t=>t.toLocaleLowerCase('tr-TR')));
  return `<div class="tagButtonGrid">${GAME_TAG_OPTIONS.map(tag=>`<button class="tagBtn ${selected.has(tag.toLocaleLowerCase('tr-TR'))?'active':''}" type="button" data-tag-toggle="${esc(tag)}">${esc(tag)}</button>`).join('')}</div><input type="hidden" name="tags" value="${esc(splitTags(selectedText).join(', '))}">`;
}

function tagChipsHtml(tags){
  const chips = splitTags(tags);
  return chips.length ? `<div class="gameTagChips">${chips.map(t=>`<span>${esc(t)}</span>`).join('')}</div>` : '';
}
function textHas(value, term){ return normalizeSearchText(value).includes(normalizeSearchText(term)); }
function allGameText(g){ return `${g.title || ''} ${g.genre || ''} ${g.tags || ''} ${g.status || ''} ${g.releaseDate || ''} ${g.seriesName || ''} ${g.description || ''}`; }
function favoriteKey(){ return `hayatimiz_favorites_${state.session?.email || 'guest'}`; }
function isFavorite(id){ const list = safeParse(localStorage.getItem(favoriteKey()), []); return Array.isArray(list) && list.map(String).includes(String(id)); }
function toggleFavorite(id){
  const list = safeParse(localStorage.getItem(favoriteKey()), []);
  const ids = new Set(Array.isArray(list) ? list.map(String) : []);
  ids.has(String(id)) ? ids.delete(String(id)) : ids.add(String(id));
  localStorage.setItem(favoriteKey(), JSON.stringify(Array.from(ids)));
  render(); setToast(ids.has(String(id)) ? 'Favorilere eklendi.' : 'Favorilerden çıkarıldı.');
}
function uniqueGameFilters(){
  const set = new Set(['Tümü','Favoriler']);
  state.games.forEach(g=>{
    splitTags(g.tags).forEach(t=>set.add(t));
    String(g.genre || '').split(',').map(x=>x.trim()).filter(Boolean).forEach(x=>set.add(x));
    if(g.seriesName) set.add(`Seri: ${g.seriesName}`);
  });
  return Array.from(set).slice(0,24);
}
function gameMatchesFilter(g, filter){
  if(!filter || filter === 'Tümü') return true;
  if(filter === 'Favoriler') return isFavorite(g.id);
  if(filter.startsWith('Seri: ')) return String(g.seriesName || '').toLocaleLowerCase('tr-TR') === filter.replace('Seri: ','').toLocaleLowerCase('tr-TR');
  return textHas(`${g.genre || ''} ${g.tags || ''}`, filter);
}
function visibleGames(){
  let games = state.games.filter(g => !state.query || textHas(allGameText(g), state.query));
  games = games.filter(g => gameMatchesFilter(g, state.collectionFilter));
  if(state.page === 'Popüler') games = games.filter(g=>g.status==='Popüler' || Number(g.score||0) >= 9.0);
  if(state.page === 'Tamamlanan') games = games.filter(g=>g.status==='Tamamlandı' || progressPercent(g) >= 100);
  if(state.page === 'Devam Eden') games = games.filter(g=>g.status==='Devam Ediyor' || (Number(g.eps||0)>0 && progressPercent(g) < 100));
  if(state.page === 'Yakında') games = games.filter(g=>g.status==='Yakında');
  if(state.page === 'Seriler') games = games.filter(g=>String(g.seriesName || '').trim() || Number(g.eps || 0) > 0);
  if(state.page === 'Favoriler') games = games.filter(g=>isFavorite(g.id));
  if(['Korku','Aksiyon','Hikaye Odaklı'].includes(state.page)) games = games.filter(g=>textHas(g.genre, state.page.replace('Hikaye Odaklı','Hikaye')) || textHas(g.tags, state.page));
  return games;
}
function advancedSearchPanel(){
  const filters = uniqueGameFilters();
  return `<section class="card wide searchPanel"><div class="sectionHead"><div><h2>Gelişmiş Arama</h2><p class="muted">Oyun adı, tür, etiket, durum, çıkış yılı ve seri adına göre arar.</p></div><span class="pill green">v2.1.4</span></div><div class="filterChips">${filters.map(f=>`<button class="tagBtn ${state.collectionFilter===f?'active':''}" data-filter-chip="${esc(f)}">${esc(f)}</button>`).join('')}</div></section>`;
}
function rawgCandidatePanel(){
  const list = state.rawgCandidates || [];
  if(!list.length) return '';
  return `<div class="card soft rawgCandidatePanel rawgLargePanel"><div class="sectionHead"><div><h3>RAWG kapak/meta sonuçları</h3><p class="muted">Büyük önizleme ile doğru kapağı seç. Seçmeden oyun eklenmez.</p></div><button class="miniBtn danger" data-action="clear-rawg-candidates">Kapat</button></div><div class="rawgCandidateGrid largePreviewGrid">${list.map((c,i)=>`<article class="rawgCandidate largeRawgCandidate"><img src="${esc(c.cover || coverFor(c))}" alt="${esc(c.title || '')}"><div><b>${esc(c.title || 'Sonuç')}</b><small>${esc(c.genre || 'Genel')} ${c.released || c.releaseDate ? '• '+esc(c.released || c.releaseDate) : ''}</small><span class="pill">⭐ ${esc(c.score || 8.5)}</span></div><button class="miniBtn primary" data-rawg-candidate="${i}">Bu kapağı ve metayı kullan</button></article>`).join('')}</div></div>`;
}
function normalizeReleaseDate(value){
  if(!value) return '';
  const raw = String(value).trim();
  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if(iso) return `${iso[3]}.${iso[2]}.${iso[1]}`;
  const tr = raw.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
  if(tr) return `${tr[1].padStart(2,'0')}.${tr[2].padStart(2,'0')}.${tr[3]}`;
  return raw;
}

function adminGamesTable(){
  const games = (Array.isArray(state.games) ? state.games : []).slice().sort((a,b)=>Number(b.score||0)-Number(a.score||0));
  return `<section class="card wide fix6AdminTableWrap"><div class="sectionHead"><div><h3>Mevcut Oyunlar</h3><p class="muted">Arşivdeki oyunlar tablo görünümünde listelenir.</p></div><span class="pill green">${games.length} Oyun</span></div><div class="fix6AdminTableTools"><label class="search toolSearch">🔎 <input value="${esc(state.query || '')}" placeholder="Oyun ara..."></label><div class="rowActions"><button class="miniBtn">Filtrele</button><button class="miniBtn">Sırala: En Yeni</button></div></div><div class="tableWrap"><table class="roleTable fix6GameTable"><thead><tr><th>#</th><th>Kapak</th><th>Oyun Adı</th><th>Seri</th><th>Etiketler</th><th>Çıkış Tarihi</th><th>Puan</th><th>İşlemler</th></tr></thead><tbody>${games.map((g,index)=>`<tr><td>${String(index+1).padStart(3,'0')}</td><td><img class="tableCover" src="${esc(coverFor(g))}" alt="${esc(g.title)}"></td><td><b>${esc(g.title)}</b></td><td>${esc(g.seriesName || '-')}</td><td>${tagChipsHtml(g.tags || g.genre)}</td><td>${esc(g.releaseDate || '-')}</td><td><span class="pill green">${esc(String(g.score || '8.5'))}</span></td><td><div class="roleActions"><button class="miniBtn" data-game-edit="${esc(g.id)}">✎</button><button class="miniBtn" data-watch-series="${esc(g.id)}">▶</button><button class="miniBtn danger" data-game-delete="${esc(g.id)}">🗑</button></div></td></tr>`).join('') || '<tr><td colspan="8">Oyun bulunamadı.</td></tr>'}</tbody></table></div></section>`;
}

gameFormFields = function(d, mode='add'){
  const opts = ['Devam Ediyor','Tamamlandı','Popüler','Yakında'].map(st=>`<option ${d.status===st?'selected':''}>${st}</option>`).join('');
  const descPreview = (d.description || 'Bu oyun, site üzerinde aşağıdaki gibi görünecektir.').slice(0,240);
  return `<div class="fix6AdminGameComposer"><div class="fix6AdminGameMain"><div class="fix6FormGridHeader"><div><h3>Oyun Bilgileri</h3><p class="muted">Oyun bilgilerini düzenleyin veya yeni bir oyun ekleyin.</p></div></div><div class="formGrid cleanGameFormGrid fix6FormGrid"><label class="field">Oyun Adı *<input name="title" required placeholder="Örn: Assassin's Creed Origins" value="${esc(d.title)}" /></label><label class="field">Seri<select name="seriesName"><option value="${esc(d.seriesName || '')}">${esc(d.seriesName || 'Seri Seç / Yaz')}</option></select></label><div class="field wideField"><span>Etiketler</span>${tagButtonsHtml(d.tags)}</div><label class="field wideField">Kapak Görseli<div class="fix6UploadRow"><div class="coverDropHint"><span>☁</span><b>Görsel yükleyin veya sürükleyip bırakın</b><small>Önerilen: 16:9 oranında, en az 1920x1080px</small><button class="miniBtn" type="button">Dosya Seç</button></div><div class="coverPreview ${d.cover?'':'isEmpty'}">${d.cover?`<img src="${esc(d.cover)}" alt="Kapak önizleme">`:'Kapak çekilince burada önizleme görünür.'}</div></div><input name="cover" placeholder="https://..." value="${esc(d.cover)}" /></label><label class="field wideField storyField">Hikâye / Açıklama<textarea name="description" rows="7" placeholder="Hikâye Getir butonu oyun için temiz Türkçe özet oluşturur.">${esc(d.description || '')}</textarea></label><label class="field">Çıkış Tarihi<input name="releaseDate" placeholder="27.10.2017" value="${esc(d.releaseDate || '')}" /></label><label class="field">Durum<select name="status">${opts}</select></label><label class="field">Kategori / Tür<input name="genre" required placeholder="Aksiyon, RPG" value="${esc(d.genre)}" /></label><label class="field">Puan<input name="score" type="number" min="0" max="10" step="0.1" value="${esc(String(d.score ?? 8.5))}" /></label><label class="field">Toplam Bölüm<input name="eps" type="number" min="0" value="${esc(String(d.eps ?? 0))}" /></label><label class="field">İzlenen Bölüm<input name="watchedEps" type="number" min="0" value="${esc(String(d.watchedEps ?? 0))}" /></label><label class="field">Seri Sıra No<input name="seriesOrder" type="number" min="0" value="${esc(String(d.seriesOrder ?? 0))}" /></label><label class="field wideField">YouTube Playlist<input name="playlistUrl" placeholder="https://youtube.com/playlist?list=..." value="${esc(d.playlistUrl || '')}" /></label><label class="field wideField">Tek Video URL<input name="videoUrl" placeholder="https://youtube.com/watch?v=..." value="${esc(d.videoUrl || '')}" /></label><label class="field wideField episodeImportField">Bölüm Listesi${episodeImportPreview(d.episodesText, d.episodes)}<textarea name="episodesText" rows="5" class="technicalEpisodes" placeholder="Teknik bölüm verisi otomatik oluşur">${esc(d.episodesText || episodesToText(d.episodes || []))}</textarea><button class="miniBtn" type="button" data-action="toggle-technical-episodes">Teknik Veriyi Göster / Gizle</button></label></div><div class="fix6FormBottomActions"><button class="btn" type="button" data-action="estimate-playlist-episodes">Playlist İçe Aktar</button><button class="btn" type="button" data-action="auto-game-meta">Meta Verileri Getir</button><button class="btn" type="button" data-action="fetch-game-story">Hikâye Getir</button><div class="rowActions"><button class="btn" type="button" data-action="toggle-game-form">İptal</button><button class="btn primary" type="submit">Kaydet</button></div></div></div><aside class="fix6AdminGamePreview"><h3>Önizleme</h3><p class="muted">Bu oyun, site üzerinde aşağıdaki gibi görünecektir.</p><article class="fix6PreviewCard"><div class="fix6PreviewCover"><img src="${esc(d.cover || 'https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1000&auto=format&fit=crop')}" alt="${esc(d.title || 'Oyun')}" /><span class="scoreBadge fix4Score">${esc(String(d.score || '8.5'))}</span></div><div class="fix6PreviewBody"><h4>${esc(d.title || 'Oyun adı')}</h4>${tagChipsHtml(d.tags || d.genre)}<p>${esc(descPreview)}</p><div class="fix6MetaGrid"><div><small>Çıkış Tarihi</small><b>${esc(d.releaseDate || '-')}</b></div><div><small>Geliştirici</small><b>RAWG / Manuel</b></div><div><small>Tür</small><b>${esc(d.genre || 'Genel')}</b></div><div><small>Platformlar</small><b>PC, PlayStation, Xbox</b></div></div></div></article></aside></div>`;
}

function gameAddForm(){
  const d = { ...DEFAULT_GAME_DRAFT, ...state.gameDraft };
  return `<form class="card soft gameForm fix6GameForm" id="gameAddForm" autocomplete="off">${gameFormFields(d,'add')}</form>`;
}
function gameEditForm(){
  const current = state.games.find(g=>String(g.id)===String(state.editingGameId));
  if(!current) return '';
  return `<form class="card soft gameForm editGameForm fix6GameForm" id="gameEditForm" autocomplete="off">${gameFormFields(current,'edit')}</form>`;
}

function coverSuggestionPanel(){
  const list = Array.isArray(state.coverSuggestions) ? state.coverSuggestions : [];
  if(!list.length) return '';
  return `<div class="card soft coverSuggestionPanel"><div class="sectionHead"><div><h3>Kapak önerileri onay bekliyor</h3><p class="muted">Otomatik Kapak Çek artık doğrudan oyunları değiştirmez. Önce önerileri gösterir, sen uygularsan kaydeder.</p></div><button class="miniBtn danger" data-action="clear-cover-suggestions">Kapat</button></div><div class="coverSuggestionGrid">${list.map(item=>`<div class="coverSuggestionItem"><img src="${esc(item.cover)}" alt="${esc(item.title)}"><div><b>${esc(item.title)}</b><small>${esc(item.genre || 'Genel')}</small></div></div>`).join('')}</div><div class="rowActions"><button class="btn primary" data-action="apply-cover-suggestions">Seçilen Kapakları Uygula</button><button class="btn" data-action="clear-cover-suggestions">Vazgeç</button></div></div>`;
}
function apiStatus(){ return `<section class="grid adminGrid"><div class="card"><h3>Vercel ENV</h3><p>Gizli keyler ekranda gösterilmez. Sadece bağlantı durumu izlenir.</p><span class="pill ${state.runtimeLoaded?'green':'banned'}">${state.runtimeLoaded?'API bağlı':'Local/Fallback'}</span></div><div class="card"><h3>Supabase Tabloları</h3><p>site_users, games, site_features, site_admin_planner, site_admin_notes, site_runtime_config, site_update_notes.</p></div><div class="card"><h3>Güvenlik</h3><p>Key/şifre GitHub dosyalarına yazılmaz; sadece Vercel Environment Variables içinde kalır.</p></div></section>`; }
function settingsPanel(){ return `<section class="card wide"><h2>Ayarlar</h2><p>Kurulum notları ZIP içindeki KURULUM-KOMUTLARI.txt dosyasındadır. Önce Supabase, sonra GitHub, sonra Vercel sırası kullanılır.</p><button class="btn" data-action="clear-local">Eski sürüm local cache temizle</button><p class="note">Bu işlem oturumu silmez; çıkış sadece sen Çıkış butonuna basınca yapılır.</p></section>`; }
function usersPanel(){
  if(!isOwner()) return `<section class="card"><h2>Kurucu/Yönetici yetkisi gerekir</h2><p>Rol verme, banlama ve silme sadece kurucu veya yönetici içindir.</p></section>`;
  const rows = state.users.map(u=>`<tr><td><b>${esc(u.full_name || '-')}</b><br><span class="muted">${esc(u.email)}</span></td><td><span class="pill ${normalizeRole(u.role)}">${esc(displayRole(u.role))}</span></td><td>${u.is_active===false?'Pasif/Banlı':'Aktif'}</td><td><div class="roleActions">${ROLE_OPTIONS.map(r=>`<button class="miniBtn" data-user-role="${esc(u.id)}|${r}">${esc(displayRole(r))}</button>`).join('')}<button class="miniBtn danger" data-user-ban="${esc(u.id)}">Ban</button><button class="miniBtn danger" data-user-delete="${esc(u.id)}">Sil</button></div></td></tr>`).join('');
  return `<section class="card wide"><div class="sectionHead"><h2>Kullanıcı Yetkileri</h2><button class="btn" data-action="refresh-users">Yenile</button></div><p class="muted">Kurucu, yönetici, moderatör, editör ve kullanıcı rolleri normal girişten okunur.</p><div class="tableWrap"><table class="roleTable"><thead><tr><th>Kullanıcı</th><th>Rol</th><th>Durum</th><th>İşlemler</th></tr></thead><tbody>${rows || '<tr><td colspan="4">Kullanıcı yok veya Supabase bağlantısı bekleniyor.</td></tr>'}</tbody></table></div></section>`;
}
function youtubeHealthPanel(){
  const issues = healthIssues();
  const total = issues.youtube.length + issues.cover.length + issues.story.length + issues.order.length;
  const block = (title, items, action) => `<div class="healthIssueBlock"><h4>${title} <span>${items.length}</span></h4>${items.slice(0,8).map(g=>`<div><b>${esc(g.title)}</b><small>${esc(g.seriesName || g.genre || 'Genel')}</small><button class="miniBtn" data-game-edit="${esc(g.id)}">${action}</button></div>`).join('') || '<p class="muted">Sorun yok.</p>'}</div>`;
  if(!total) return `<div class="note greenNote">Admin sağlık kontrolü temiz: kırık link, boş kapak, boş hikaye ve eksik seri sırası görünmüyor.</div>`;
  return `<section class="card soft healthPanel v217Health"><div class="sectionHead"><div><h3>Admin Sağlık Paneli</h3><p class="muted">Kırık YouTube linki, eksik kapak, boş hikaye ve eksik seri sırası kontrolleri.</p></div><span class="pill banned">${total} sorun</span></div><div class="healthGrid">${block('Boş / kırık YouTube', issues.youtube, 'Link Ekle')}${block('Kırık / boş kapak', issues.cover, 'Kapak Ekle')}${block('Boş hikaye', issues.story, 'Hikaye Çek')}${block('Eksik seri sırası', issues.order, 'Sıra Ver')}</div></section>`;
}
function maintenanceAdmin(){
  return `<section class="card wide"><h2>Bakım Modu</h2><p>Bakım açıkken giriş yapmayanlar ve normal kullanıcılar profesyonel loading ekranlı bakım sayfasını görür. Yetkili hesaplar yönetim panelini kullanır.</p><label class="field">Bakım mesajı<input id="maintenanceMessage" value="${esc(state.maintenance?.message || '')}" /></label><label class="field">Tahmini açılış zamanı<input id="maintenanceEta" placeholder="Örn: Bugün 22:30 / 25 Mayıs 2026 18:00" value="${esc(state.maintenance?.eta || '')}" /></label><button class="btn ${state.maintenance?.enabled?'danger':'primary'}" data-action="toggle-maintenance">${state.maintenance?.enabled?'Bakımı Kapat':'Bakımı Aç'}</button><p class="note">Tahmini açılış zamanı bakım ekranında gösterilir ve Supabase site_runtime_config içine kaydedilir.</p></section>`;
}
function featurePlan(){
  return `<section class="card wide"><h2>AI Özellik bölümü kaldırıldı</h2><p>Bu panel artık kullanılmıyor. Yeni özellikleri siteden otomatik ekleme yerine bu sohbet üzerinden hazırlayacağız. Oyun ekleme, otomatik kapak, çıkış tarihi, tür ve etiket sistemi doğrudan <b>Yönetim Paneli > Oyunlar</b> sekmesinde hazır.</p><button class="btn primary" data-admin="Oyunlar">Oyunlar Sekmesine Git</button></section>`;
}

function aiSuggestionPanel(){
  if(!state.aiSuggestions?.items?.length) return '<div class="aiEmpty">Henüz öneri yok. Özellik yazıp AI ile Önerileri Bul butonuna bas.</div>';
  return `<div class="aiSuggestions"><div class="sectionHead"><div><b>AI önerileri</b><p class="muted">Yazdığın istek: ${esc(state.aiSuggestions.query)}</p></div><button class="miniBtn danger" data-action="clear-ai-suggestions">Önerileri Temizle</button></div><div class="aiSuggestionGrid">${state.aiSuggestions.items.map((f,i)=>`<article class="aiSuggestion ${featureEnabled(f.key)?'active':''}"><span class="pill ${featureEnabled(f.key)?'green':(f.matched===false?'banned':'')}">${featureEnabled(f.key)?'Sitede aktif':(f.matched===false?'Özel istek':'Hazır modül')}</span><h3>${i+1}. ${esc(f.title)}</h3><p>${esc(f.description || '')}</p><small>Hedef: ${esc(f.target || 'Özellik Planı')}</small><div class="rowActions">${featureEnabled(f.key)?'<span class="pill green">Yeşil / aktif</span>':`<button class="btn primary" data-feature-choose="${esc(f.key)}">Seç + Siteye Uygula</button>`}<button class="btn" data-feature-plan="${esc(f.key)}">Sadece Plana Ekle</button></div></article>`).join('')}</div></div>`;
}

function activeFeatureManager(){
  const items = getActiveFeatureItems();
  const bulkEnabled = featureEnabled('active_features_bulk_clear');
  const bulkButton = bulkEnabled
    ? '<button class="btn danger" data-action="clear-active-features">Tüm Aktif Özellikleri Pasif Yap</button>'
    : '<button class="btn" data-feature-apply="active_features_bulk_clear">Toplu pasif butonunu aç</button>';
  return `<div class="card wide activeFeatureBox proActive"><div class="sectionHead"><div><h2>Aktif Site Modülleri</h2><p class="muted">Burada sadece gerçekten uygulanmış özellikler görünür. Siteye Uygula sayfadan atmaz; durum anında yeşile döner.</p></div><div class="rowActions"><span class="pill green">${items.length} aktif</span>${bulkButton}</div></div><div class="activeFeatureGrid">${items.map(f=>`<div class="activeFeatureItem"><span class="pill green">Sitede aktif</span><b>${esc(f.title)}</b><small>${esc(f.target || 'Özellik Planı')}</small><div class="rowActions"><button class="miniBtn" data-feature-edit="${esc(f.key)}">Düzenle</button><button class="miniBtn danger" data-feature-delete="${esc(f.key)}">Sil / Pasif</button></div></div>`).join('') || '<p class="muted">Henüz siteye uygulanmış özellik yok.</p>'}</div></div>`;
}

function planItem(p){
  const feature = featureFromPlannerItem(p);
  const key = feature?.key || p.featureKey || slugifyFeature(p.text);
  const enabled = p.status === 'tamam' || featureEnabled(key);
  const target = feature?.target || 'Özellik Planı';
  return `<div class="planItem ${enabled?'done':''}"><span>${enabled?'✅':'⬜'}</span><div><b>${esc(p.text)}</b><small>${esc(target)}</small><div class="planActions">${!enabled ? `<button class="miniBtn primary" data-feature-apply="${esc(key)}" data-feature-title="${esc(p.text)}">Siteye Uygula</button>` : `<span class="pill green">Sitede aktif</span>`}<button class="miniBtn" data-feature-edit="${esc(key)}">Düzenle</button><button class="miniBtn danger" data-feature-delete="${esc(key)}">Sil</button></div></div></div>`;
}
function applicationCenter(){
  return `<section class="grid adminGrid featureCenter">${FEATURE_CATALOG.map(raw=>mergeFeatureOverride(raw)).map(f=>`<div class="card"><span class="pill ${featureEnabled(f.key)?'green':'banned'}">${featureEnabled(f.key)?'Aktif':'Bekliyor'}</span><h3>${esc(f.title)}</h3><p>${esc(f.description)}</p><p class="muted"><b>Hedef:</b> ${esc(f.target)}</p>${featureEnabled(f.key)?`<button class="btn" data-admin="${targetAdminPage(f)}">Aç</button>`:`<button class="btn primary" data-feature-apply="${esc(f.key)}">Siteye Uygula</button>`}</div>`).join('')}</section>`;
}
function updateNotes(){
  const active = featureEnabled('update_notes_editor');
  const versions = ['Tümü', ...Array.from(new Set(VERSION_NOTES_ARCHIVE.map(n=>n.version)))].sort((a,b)=>a==='Tümü'?-1:b==='Tümü'?1:b.localeCompare(a,'tr'));
  const selected = state.updateFilter || 'Tümü';
  const q = normalizeSearchText(state.updateQuery || '');
  const filtered = VERSION_NOTES_ARCHIVE.filter(n => (selected === 'Tümü' || n.version === selected) && (!q || normalizeSearchText(`${n.version} ${n.title} ${n.summary} ${n.written}`).includes(q))).sort((a,b)=>b.version.localeCompare(a.version,'tr'));
  const editing = state.editingUpdateNoteId ? VERSION_NOTES_ARCHIVE.find(n=>noteId(n)===state.editingUpdateNoteId) : null;
  const list = filtered.map(n=>`<article class="updateCard"><img src="${esc(n.image)}" onerror="this.style.display='none'" alt="${esc(n.version)}"><div><span class="pill green">${esc(n.version)}</span><h3>${esc(n.title)}</h3><p>${esc(n.summary)}</p><small>${esc(n.written)}</small><div class="rowActions"><button class="miniBtn" data-update-edit="${esc(noteId(n))}">Düzenle</button><button class="miniBtn danger" data-update-delete="${esc(noteId(n))}">Sil</button></div></div></article>`).join('');
  return `<section class="updateNotesLayout"><div class="card updateEditor"><h3>${editing?'Güncelleme Notunu Düzenle':'Yeni Güncelleme Notu Ekle'}</h3><p class="muted">v2.1.5 ile düzenleme/silme işlemi gerçek kayıt ID mantığıyla API tarafına bağlandı.</p>${active?'<span class="pill green">Editör aktif</span>':'<span class="pill banned">Editör pasif</span>'}<form id="updateNoteForm" class="stackForm"><input type="hidden" name="id" value="${esc(editing?noteId(editing):'')}"><label class="field">Sürüm<input name="version" value="${esc(editing?.version || '')}" placeholder="Örn: v2.1.5" required></label><label class="field">Başlık<input name="title" value="${esc(editing?.title || '')}" placeholder="Kısa güncelleme başlığı" required></label><label class="field">Kısa Özet<textarea name="summary" placeholder="Kullanıcılara gösterilecek kısa özet">${esc(editing?.summary || '')}</textarea></label><label class="field">Resimli Not / Kapak URL<input name="image" value="${esc(editing?.image || '')}" placeholder="https://... veya previews/...png"></label><label class="field">Yazılı Not<textarea name="written" placeholder="Detaylı yazılı güncelleme notu">${esc(editing?.written || '')}</textarea></label><div class="rowActions"><button class="btn" type="button" data-action="download-notes">Yazılı Notları İndir</button>${editing?'<button class="btn" type="button" data-action="cancel-update-edit">Vazgeç</button>':''}<button class="btn primary" type="submit">${editing?'Notu Güncelle':'Notu Ekle'}</button></div></form>${!active?'<button class="btn" data-feature-apply="update_notes_editor">Güncelleme Notu Editörünü Siteye Uygula</button>':''}</div><div class="card updateArchive"><div class="sectionHead"><div><h3>Güncelleme Notları Arşivi</h3><p class="muted">Son sürüm en üstte, eski sürümler altta listelenir.</p></div><span class="pill green">${filtered.length} not</span></div><div class="updateTools"><label class="field">Sürüm filtresi<select id="updateVersionFilter">${versions.map(v=>`<option value="${esc(v)}" ${selected===v?'selected':''}>${esc(v)}</option>`).join('')}</select></label><label class="field">Notlarda ara<input id="updateSearchInput" value="${esc(state.updateQuery || '')}" placeholder="Sürüm, başlık veya not ara"></label></div><div class="updateList">${list || '<p class="muted">Arama sonucunda güncelleme notu bulunamadı.</p>'}</div></div></section>`;
}
function noteId(n){ return String(n.id || `${n.version}-${n.title}`).replace(/[^a-zA-Z0-9_.-]+/g,'-'); }

function episodeNoteKey(gameId, index){ return `${gameId}:${index}`; }
function nextSeriesGame(current){
  if(!current) return null;
  const group = sortedSeriesGroups(state.games).find(g=>g.name===seriesKey(current));
  if(!group) return null;
  const idx = group.items.findIndex(x=>String(x.id)===String(current.id));
  return idx>=0 ? group.items[idx+1] : null;
}

function userNotifications(){
  const now = new Date();
  const items = [];
  state.games.forEach(game=>{
    normalizeEpisodes(game.episodes || []).forEach((ep,idx)=>{
      if(state.notificationPrefs.releases && ep.publishAt){
        const d = new Date(ep.publishAt);
        if(!Number.isNaN(d.getTime())){
          const days = Math.ceil((d.getTime()-now.getTime())/86400000);
          if(days >= -1 && days <= 7){
            items.push({ id:`pub-${game.id}-${idx}`, type: days < 0 ? 'yayında' : 'yaklaşıyor', tone: days < 0 ? 'green' : 'warn', title:`${game.title} - ${ep.number}. Bölüm`, text: days < 0 ? 'Bu bölüm yayınlandı. Site içinden izleyebilirsin.' : `${days || 'Bugün'} gün içinde yayınlanacak.`, gameId:game.id, episodeIndex:idx });
          }
        }
      }
      if(state.notificationPrefs.newVideos && ep.videoUrl && !state.notificationSeen[`new-${game.id}-${idx}`]){
        items.push({ id:`new-${game.id}-${idx}`, type:'yeni video', tone:'pink', title:`Yeni video hazır: ${game.title}`, text:`${ep.number}. bölüm site içi izleme ekranına eklendi.`, gameId:game.id, episodeIndex:idx });
      }
    });
  });
  if(state.notificationPrefs.maintenance && state.maintenance?.enabled) items.unshift({ id:'maintenance-active', type:'bakım', tone:'warn', title:'Bakım modu aktif', text:state.maintenance.message || 'Site bakımda. Yönetici kullanıcılar kontrol edebilir.' });
  if(!items.length) items.push({ id:'empty', type:'durum', tone:'green', title:'Yeni bildirim yok', text:'Yeni video, yaklaşan bölüm veya bakım uyarısı olduğunda burada rozetli görünür.' });
  return items.slice(0,40);
}
function notificationsPage(){
  const items = userNotifications();
  const unread = items.filter(n=>!state.notificationSeen[n.id] && n.id !== 'empty').length;
  return `<section class="notificationCenter card wide v220Notifications"><div class="sectionHead"><div><span class="eyebrow">Sesli • Rozetli • Kullanıcı Tercihli</span><h1>Bildirimler</h1><p class="muted">Yeni video, yaklaşan yayın tarihi, bakım ve seri takibi uyarıları burada toplanır. Butonlar v2.2.0 ile çalışır hale getirildi.</p></div><div class="rowActions"><span class="notifyBadge">${unread}</span><button class="miniBtn ${state.notificationsMuted?'':'primary'}" data-action="toggle-notification-sound">${state.notificationsMuted?'Sesi Aç':'Sesi Kapat'}</button><button class="miniBtn" data-action="mark-all-notifications">Tümünü Okundu Yap</button></div></div><div class="notificationPrefs"><button class="tagBtn ${state.notificationPrefs.newVideos?'active':''}" data-action="toggle-pref-newVideos">Yeni Video</button><button class="tagBtn ${state.notificationPrefs.releases?'active':''}" data-action="toggle-pref-releases">Yayın Tarihi</button><button class="tagBtn ${state.notificationPrefs.maintenance?'active':''}" data-action="toggle-pref-maintenance">Bakım</button></div><div class="notificationGrid">${items.map(n=>`<article class="notificationCard ${n.tone||''} ${state.notificationSeen[n.id]?'seen':''}"><div><span class="pulseDot"></span><b>${esc(n.title)}</b><small>${esc(n.type)}</small><p>${esc(n.text)}</p></div><div class="rowActions">${n.gameId?`<button class="miniBtn primary" data-notification-watch="${esc(n.gameId)}" data-episode="${Number(n.episodeIndex||0)}">Sitede İzle</button>`:''}<button class="miniBtn" data-notification-seen="${esc(n.id)}">Okundu</button></div></article>`).join('')}</div></section>`;
}
function adminSeriesWatchPanel(){
  const groups = sortedSeriesGroups(state.games.filter(g=>String(g.seriesName||'').trim() || Number(g.eps||0)>0));
  return `<section class="card wide adminSeriesWatch"><div class="sectionHead"><div><span class="eyebrow">Yönetim Paneli</span><h2>Seri İzleme Yönetimi</h2><p class="muted">Serileri İzle artık ayrı yönetim kategorisinde. Her seriyi sıraya göre kontrol et, tümünü izle ekranını aç ve eksik linkleri gör.</p></div><button class="btn primary" data-action="bulk-playlist-sync">Toplu Playlist Senkronizasyonu</button></div><div class="seriesAdminGrid">${groups.map(group=>`<article class="seriesAdminCard"><h3>${esc(group.name)}</h3><p>${group.items.length} oyun • ${group.items.reduce((a,g)=>a+Number(g.eps||seriesEpisodes(g).length||0),0)} bölüm</p><div class="seriesMiniList">${group.items.map((g,i)=>`<div><span>${i+1}</span><b>${esc(g.title)}</b><small>Sıra ${esc(g.seriesOrder||i+1)} • ${progressPercent(g)}%</small><button class="miniBtn" data-watch-series="${esc(g.id)}">Sitede İzle</button></div>`).join('')}</div></article>`).join('')}</div></section>`;
}
function recordWatchHistory(game, ep){
  const item = { at:new Date().toISOString(), gameId:game?.id, title:game?.title || '', episode:ep?.number || 0, episodeTitle:ep?.title || '' };
  state.watchHistory = [item, ...state.watchHistory.filter(x=>!(String(x.gameId)===String(item.gameId) && Number(x.episode)===Number(item.episode)))].slice(0,50);
  try{ localStorage.setItem('hayatimiz_watch_history_v219', JSON.stringify(state.watchHistory)); }catch{}
}

function seriesWatchModal(){
  if(!state.watchingGameId) return '';
  const g = state.games.find(x=>String(x.id)===String(state.watchingGameId));
  if(!g) return '';
  const episodes = seriesEpisodes(g);
  const watched = Number(g.watchedEps || episodes.filter(ep=>ep.watched).length || 0);
  const total = Number(g.eps||episodes.length||0);
  const safeIndex = Math.max(0, Math.min(episodes.length - 1, Number(state.selectedEpisodeIndex || 0)));
  const active = episodes[safeIndex] || episodes[0] || null;
  const rawUrl = watchTargetUrl(g);
  const embed = active ? episodeEmbedUrl(active, rawUrl) : youtubeEmbedUrl(rawUrl);
  const player = embed ? `<iframe src="${esc(embed)}" title="${esc(g.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>` : `<div class="playerPlaceholder">Video linki eklenmemiş.</div>`;
  const noteKey = episodeNoteKey(g.id, safeIndex);
  const userNote = state.episodeNotes[noteKey] || active?.note || '';
  const nextGame = nextSeriesGame(g);
  const rows = episodes.length ? episodes.map((ep,idx)=>`<button class="episodeRow ${idx===safeIndex?'active':''} ${ep.watched||Number(ep.number)<=watched?'done':''}" data-watch-episode-index="${idx}"><img src="${esc(ep.thumbnail || g.cover || coverFor(g))}" onerror="this.style.display='none'"><span><b>${esc(ep.number)}. ${esc(cleanEpisodeTitle(ep.title, ep.number))}</b><small>${ep.publishAt?`Yayın: ${esc(ep.publishAt)} • `:''}${ep.videoUrl?'Sitede oynatmaya hazır':'Video linki eksik'}</small></span></button>`).join('') : '<div class="episodeEmpty">Bölüm hedefi eklenmemiş. Admin panelinden playlist videolarını çek.</div>';
  return `<div class="modalOverlay watchPageOverlay fix4WatchOverlay ${state.cinemaFullscreen?'cinemaFull':''}"><div class="modal seriesModalV216 professionalWatch v218Watch v220Watch fix5Watch"><button class="close" type="button" data-action="close-series-watch">×</button><div class="watchHeroBar"><div><span class="eyebrow">Profesyonel Sitede İzle</span><h2>${esc(g.title)}</h2><p class="muted">${esc(g.seriesName || 'Tek seri')} • ${watched}/${total} bölüm tamamlandı • %${progressPercent(g)}</p></div><div class="watchHeroStats"><div><b>${watched}</b><span>İzlenen</span></div><div><b>${Math.max(total-watched,0)}</b><span>Kalan</span></div><div><b>${total}</b><span>Toplam</span></div></div></div><div class="watchToolbar"><button class="miniBtn ${state.cinemaFullscreen?'primary':''}" data-action="toggle-cinema-fullscreen">Sinema: ${state.cinemaFullscreen?'Tam':'Normal'}</button><button class="miniBtn ${state.autoNextEpisode?'primary':''}" data-action="toggle-auto-next">Oto Sonraki: ${state.autoNextEpisode?'Açık':'Kapalı'}</button><button class="miniBtn" data-action="resume-episode">Burada Kaldım</button><button class="miniBtn" data-action="watch-all-series">Seriyi Tümünü İzle</button><button class="miniBtn primary" data-toggle-active-watched-index="${safeIndex}">${active?.watched?'İzlendi Geri Al':'Bu Bölümü İzledim'}</button></div><div class="watchLayout fix5WatchLayout"><main class="watchCinemaStage"><div class="sitePlayer cinemaPlayer fix5CinemaPlayer">${player}</div><div class="fix5EpisodeSummary"><div class="activeEpisodeInfo"><span class="pill green">${active?`${active.number}. Bölüm`:'Bölüm yok'}</span><h3>${esc(active ? cleanEpisodeTitle(active.title, active.number) : g.title)}</h3><p class="muted">${esc(active?.description || g.description || 'Bölümü doğrudan site içinden izliyorsun.')}</p></div><div class="fix5WatchActions">${nextGame?`<button class="miniBtn" data-next-series-game="${esc(nextGame.id)}">Seride Sıradaki Oyun: ${esc(nextGame.title)}</button>`:''}<div class="progressBlock"><small>Genel ilerleme</small><div class="progressLine large"><span style="width:${progressPercent(g)}%"></span></div></div></div></div><label class="field episodeNoteBox">Bölüm Yorumum / Kişisel Notum<textarea data-episode-note="${esc(noteKey)}" rows="3" placeholder="Bu bölüm için yorum veya not yaz...">${esc(userNote)}</textarea></label></main><aside class="v220EpisodePanel fix5EpisodePanel"><div class="sectionHead"><div><h3>Bölümler</h3><p class="muted">Sağ panelden bölüm seç, solda izlemeye devam et.</p></div><span class="pill">${episodes.length} bölüm</span></div><div class="episodeSidebar">${rows}</div></aside></div></div></div>`;
}


function modal(){
  const blocks = [];
  const watch = seriesWatchModal(); if(watch) blocks.push(watch);
  if(state.authMode){
    const title = state.authMode === 'register' ? 'Kayıt Ol' : 'Giriş Yap';
    blocks.push(html`<div class="modalOverlay"><form class="modal" id="authForm"><button class="close" type="button" data-action="close-modal">×</button><div class="switch"><button type="button" class="btn ${state.authMode==='login'?'primary':''}" data-action="open-login">Giriş</button><button type="button" class="btn ${state.authMode==='register'?'primary':''}" data-action="open-register">Kayıt</button></div><h2>${title}</h2><p>Ayrı yetkili girişi yok. Kurucu/yönetici/moderatör/editör normal hesapla giriş yapar.</p>${state.authMode==='register'?'<label class="field">Ad Soyad<input name="fullName" autocomplete="name" required /></label>':''}<label class="field">E-posta<input name="email" type="email" autocomplete="email" required /></label><label class="field">Şifre<input name="password" type="password" autocomplete="current-password" required /></label>${state.error?`<div class="alert">${esc(state.error)}</div>`:''}<div class="note">Gizli key veya şifre ekranda gösterilmez.</div><button class="btn primary" type="submit" ${state.loading?'disabled':''}>${state.loading?'İşleniyor...':title}</button></form></div>`);
  }
  if(state.editingFeature){
    const f = state.editingFeature;
    const ctx = getSmartFeatureContext();
    const variants = Array.isArray(f.editVariants) && f.editVariants.length ? f.editVariants : buildFeatureEditVariants(f);
    const variantCards = `<div class="editVariantBox"><div class="sectionHead"><div><h3>4-5 yeni düzenleme önerisi</h3><p class="muted">Bunlardan hangisi istediğiniz doğrultusunda? Seçtiğin öneri düzenlenmiş haliyle siteye uygulanır, yeşile döner ve F5 ile entegre edilir.</p></div><span class="pill green">${esc(ctx.label)}</span></div><div class="editVariantGrid">${variants.map((v,i)=>`<article class="editVariantCard"><span class="pill">${esc(v.tag || 'Öneri')} ${i+1}</span><h3>${esc(v.title)}</h3><p>${esc(v.description || '')}</p><small>Hedef: ${esc(v.target || f.target || 'Özellik Planı')}</small><button class="btn primary" type="button" data-feature-edit-variant="${i}">Bu öneriyi seç + Siteye Uygula + F5</button></article>`).join('')}</div></div>`;
    blocks.push(html`<div class="modalOverlay"><form class="modal stableEditModal smartEditModal" id="featureEditForm"><button class="close" type="button" data-action="close-feature-edit">×</button><span class="eyebrow">Sayfa içi akıllı düzenleme</span><h2>Özelliği düzenle</h2><p class="muted">Düzenle dedikten sonra sistem aktif site adresine/kategoriye göre yeni seçenekler önerir.</p>${variantCards}<div class="manualEditArea"><h3>Manuel düzenle</h3><p class="muted">Öneriler yetmezse burada kendin yazıp sadece kaydedebilirsin.</p><input type="hidden" name="key" value="${esc(f.key)}"><label class="field">Özellik adı<input name="title" value="${esc(f.title || '')}" required autofocus></label><label class="field">Hedef alan<input name="target" value="${esc(f.target || ctx.target || 'Yönetim Paneli > Özellik Planı')}"></label><label class="field">Açıklama<textarea name="description" rows="4">${esc(f.description || '')}</textarea></label><div class="editStatusBox"><span class="pill ${featureEnabled(f.key)?'green':'banned'}">${featureEnabled(f.key)?'Sitede aktif':'Henüz aktif değil'}</span><span>${esc(f.key)}</span></div><div class="rowActions"><button class="btn" type="submit">Sadece Kaydet</button>${!featureEnabled(f.key)?`<button class="btn" type="button" data-feature-apply="${esc(f.key)}">Kaydetmeden Siteye Uygula</button>`:''}<button class="btn" type="button" data-action="close-feature-edit">Vazgeç</button></div></div></form></div>`);
  }
  return blocks.join('');
}
function toast(){ return state.toast ? `<div class="toast"><span>✅</span><b>${esc(state.toast)}</b><button class="miniBtn" data-action="close-toast">Tamam</button></div>` : ''; }
function mainContent(){ if(state.page === 'Yönetim Paneli') return adminPanel(); return publicPage(); }
function render(){
  const root = document.getElementById('root');
  root.dataset.mounted = '1';
  syncRouteToAddress();
  window.clearTimeout(window.__HAYATIMIZ_BOOT_TIMER__);
  root.innerHTML = `<div class="app v220App">${topbar()}${categoryRail()}<main class="page">${mainContent()}</main>${modal()}${toast()}${mobileBottomNav()}</div>`;
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
  document.querySelectorAll('[data-feature-choose]').forEach(el=>el.addEventListener('click', onChooseAiFeature));
  document.querySelectorAll('[data-feature-plan]').forEach(el=>el.addEventListener('click', onPlanAiFeature));
  document.querySelectorAll('[data-feature-edit]').forEach(el=>el.addEventListener('click', onFeatureEdit));
  document.querySelectorAll('[data-feature-edit-variant]').forEach(el=>el.addEventListener('click', onFeatureEditVariantApply));
  document.querySelectorAll('[data-feature-delete]').forEach(el=>el.addEventListener('click', onFeatureDelete));
  document.querySelectorAll('[data-game-edit]').forEach(el=>el.addEventListener('click', onGameEdit));
  document.querySelectorAll('[data-game-delete]').forEach(el=>el.addEventListener('click', onGameDelete));
  document.querySelectorAll('[data-tag-toggle]').forEach(el=>el.addEventListener('click', onTagToggle));
  document.querySelectorAll('[data-filter-chip]').forEach(el=>el.addEventListener('click', e=>{ e.preventDefault(); state.collectionFilter = el.dataset.filterChip || 'Tümü'; render(); }));
  document.querySelectorAll('[data-letter-jump]').forEach(el=>el.addEventListener('click', e=>{ state.selectedLetter = el.dataset.letterJump || ''; }));
  document.querySelectorAll('[data-watch-series]').forEach(el=>el.addEventListener('click', e=>{ e.preventDefault(); state.watchingGameId = el.dataset.watchSeries; state.selectedEpisodeId = null; state.selectedEpisodeIndex = 0; render(); }));
  document.querySelectorAll('[data-notification-watch]').forEach(el=>el.addEventListener('click', e=>{ e.preventDefault(); state.watchingGameId = el.dataset.notificationWatch; state.selectedEpisodeIndex = Number(el.dataset.episode||0); state.page='Ana Sayfa'; render(); }));
  document.querySelectorAll('[data-notification-seen]').forEach(el=>el.addEventListener('click', e=>{ state.notificationSeen[el.dataset.notificationSeen]=true; localStorage.setItem('hayatimiz_notification_seen_v220', JSON.stringify(state.notificationSeen)); render(); }));

  document.querySelectorAll('[data-watch-episode-index]').forEach(el=>el.addEventListener('click', e=>{ e.preventDefault(); state.selectedEpisodeIndex = Number(el.dataset.watchEpisodeIndex || 0); render(); }));
  document.querySelectorAll('[data-mark-active-watched-index]').forEach(el=>el.addEventListener('click', e=>{ e.preventDefault(); markEpisodeWatchedIndex(Number(el.dataset.markActiveWatchedIndex || 0)); }));
  document.querySelectorAll('[data-toggle-active-watched-index]').forEach(el=>el.addEventListener('click', e=>{ e.preventDefault(); toggleEpisodeWatchedIndex(Number(el.dataset.toggleActiveWatchedIndex || 0)); }));
  document.querySelectorAll('[data-next-series-game]').forEach(el=>el.addEventListener('click', e=>{ e.preventDefault(); state.watchingGameId = el.dataset.nextSeriesGame; state.selectedEpisodeIndex = 0; render(); }));
  document.querySelectorAll('[data-episode-note]').forEach(el=>el.addEventListener('input', e=>{ state.episodeNotes[el.dataset.episodeNote] = e.target.value || ''; localStorage.setItem('hayatimiz_episode_notes_v219', JSON.stringify(state.episodeNotes)); }));
  document.querySelectorAll('[data-view-mode]').forEach(el=>el.addEventListener('click', e=>{ e.preventDefault(); state.gameViewMode = el.dataset.viewMode || 'grid'; localStorage.setItem('hayatimiz_game_view_mode_v219', state.gameViewMode); render(); }));
  document.querySelectorAll('[data-series-order-game]').forEach(el=>el.addEventListener('change', e=>{ const game = state.games.find(g=>String(g.id)===String(el.dataset.seriesOrderGame)); if(game){ game.seriesOrder = Number(e.target.value||0); setToast('Sıra değeri ekranda güncellendi. Kalıcı kaydetmek için Seri Sırasını Kalıcı Kaydet butonuna bas.'); render(); } }));
  document.querySelectorAll('[data-series-tab]').forEach(el=>el.addEventListener('click', e=>{ e.preventDefault(); state.activeSeriesName = el.dataset.seriesTab || ''; localStorage.setItem('hayatimiz_active_series_v217', state.activeSeriesName); render(); }));
  document.querySelectorAll('[data-update-edit]').forEach(el=>el.addEventListener('click', e=>{ e.preventDefault(); state.editingUpdateNoteId = el.dataset.updateEdit; render(); }));
  document.querySelectorAll('[data-update-delete]').forEach(el=>el.addEventListener('click', onUpdateNoteDelete));
  document.querySelectorAll('[data-favorite-game]').forEach(el=>el.addEventListener('click', e=>{ e.preventDefault(); toggleFavorite(el.dataset.favoriteGame); }));
  document.querySelectorAll('[data-rawg-candidate]').forEach(el=>el.addEventListener('click', e=>{ e.preventDefault(); applyRawgCandidate(Number(el.dataset.rawgCandidate || 0)); }));
  const idea = $('#featureIdeaForm'); if(idea) idea.addEventListener('submit', onFeatureIdeaSubmit);
  const auth = $('#authForm'); if(auth) auth.addEventListener('submit', onAuthSubmit);
  const profile = $('#profileForm'); if(profile) profile.addEventListener('submit', onProfileSubmit);
  const note = $('#adminNoteForm'); if(note) note.addEventListener('submit', onAdminNoteSubmit);
  const game = $('#gameAddForm'); if(game){ game.addEventListener('submit', onGameAddSubmit); game.addEventListener('input', () => saveGameDraftFromForm(game)); game.addEventListener('change', () => saveGameDraftFromForm(game)); }
  const editGame = $('#gameEditForm'); if(editGame){ editGame.addEventListener('submit', onGameEditSubmit); }
  const coverUpload = $('#coverUpload'); if(coverUpload) coverUpload.addEventListener('change', onCoverUploadPreview);
  const updateNoteForm = $('#updateNoteForm'); if(updateNoteForm) updateNoteForm.addEventListener('submit', onUpdateNoteSubmit);
  const updateVersionFilter = $('#updateVersionFilter'); if(updateVersionFilter) updateVersionFilter.addEventListener('change', e=>{ state.updateFilter = e.target.value || 'Tümü'; render(); });
  const updateSearchInput = $('#updateSearchInput'); if(updateSearchInput) updateSearchInput.addEventListener('input', e=>{ state.updateQuery = e.target.value || ''; render(); });
  const featureEditForm = $('#featureEditForm'); if(featureEditForm) featureEditForm.addEventListener('submit', onFeatureEditSubmit);
}
async function onUpdateNoteSubmit(e){
  e.preventDefault();
  const fd = new FormData(e.currentTarget);
  const id = String(fd.get('id') || '').trim();
  const note = { id, version:String(fd.get('version')||'').trim(), title:String(fd.get('title')||'').trim(), summary:String(fd.get('summary')||'').trim(), image:String(fd.get('image')||'').trim(), written:String(fd.get('written')||'').trim() };
  if(!note.version || !note.title) return setToast('Sürüm ve başlık gerekli.');
  if(id){
    const i = VERSION_NOTES_ARCHIVE.findIndex(n=>noteId(n)===id);
    if(i>=0) VERSION_NOTES_ARCHIVE[i] = { ...VERSION_NOTES_ARCHIVE[i], ...note };
    state.editingUpdateNoteId = null;
  }else{
    VERSION_NOTES_ARCHIVE.unshift({ ...note, id:'local-'+Date.now() });
  }
  render();
  try{ await api(id ? 'update-note-update' : 'update-note-add', { adminToken: state.session?.adminToken, ...note }); setToast(id?'Güncelleme notu Supabase üzerinde güncellendi.':'Güncelleme notu Supabase tablosuna eklendi.'); }
  catch(err){ setToast('Not ekranda güncellendi; Supabase kaydı başarısız: ' + err.message); }
}
async function onUpdateNoteDelete(e){
  e.preventDefault();
  const id = e.currentTarget.dataset.updateDelete;
  if(!id || !confirm('Bu güncelleme notu silinsin mi?')) return;
  const idx = VERSION_NOTES_ARCHIVE.findIndex(n=>noteId(n)===id);
  if(idx>=0) VERSION_NOTES_ARCHIVE.splice(idx,1);
  if(state.editingUpdateNoteId===id) state.editingUpdateNoteId=null;
  render();
  try{ await api('update-note-delete', { adminToken: state.session?.adminToken, id }); setToast('Güncelleme notu silindi.'); }
  catch(err){ setToast('Not ekrandan silindi; Supabase silme başarısız: ' + err.message); }
}

async function onAction(e){
  e.preventDefault(); const action = e.currentTarget.dataset.action;
  if(action === 'open-login'){ state.authMode='login'; state.error=''; render(); }
  if(action === 'open-register'){ state.authMode='register'; state.error=''; render(); }
  if(action === 'close-modal'){ state.authMode=null; state.error=''; render(); }
  if(action === 'close-feature-edit'){ state.editingFeature=null; render(); }
  if(action === 'close-toast'){ state.toast=''; render(); }
  if(action === 'logout'){ saveSession(null); state.page='Ana Sayfa'; setToast('Çıkış yapıldı.'); }
  if(action === 'refresh-users'){ await loadUsers(); }
  if(action === 'toggle-maintenance'){ await toggleMaintenance(); }
  if(action === 'toggle-game-form'){ state.showGameForm = !state.showGameForm; render(); }
  if(action === 'auto-cover-fetch'){ autoCoverFetch(); }
  if(action === 'auto-game-meta'){ await autoGameMetaFill('gameAddForm'); }
  if(action === 'auto-game-meta-edit'){ await autoGameMetaFill('gameEditForm'); }
  if(action === 'fetch-game-story'){ await fetchGameStoryToForm('gameAddForm'); }
  if(action === 'fetch-game-story-edit'){ await fetchGameStoryToForm('gameEditForm'); }
  if(action === 'clear-rawg-candidates'){ state.rawgCandidates = []; render(); }
  if(action === 'estimate-playlist-episodes'){ await estimatePlaylistEpisodes('gameAddForm'); }
  if(action === 'estimate-playlist-episodes-edit'){ await estimatePlaylistEpisodes('gameEditForm'); }
  if(action === 'close-game-edit'){ state.editingGameId = null; state.rawgCandidates = []; render(); }
  if(action === 'close-series-watch'){ state.watchingGameId = null; state.selectedEpisodeId = null; state.selectedEpisodeIndex = 0; render(); }
  if(action === 'toggle-technical-episodes'){ const box = e.currentTarget.closest('.episodeImportField'); if(box) box.classList.toggle('showTechnical'); }
  if(action === 'toggle-auto-next'){ state.autoNextEpisode = !state.autoNextEpisode; localStorage.setItem('hayatimiz_auto_next_episode_v219', state.autoNextEpisode ? '1' : '0'); render(); }
  if(action === 'toggle-cinema-fullscreen'){ state.cinemaFullscreen = !state.cinemaFullscreen; localStorage.setItem('hayatimiz_cinema_fullscreen_v219', state.cinemaFullscreen ? '1' : '0'); render(); }
  if(action === 'resume-episode'){ state.selectedEpisodeIndex = Math.max(0, Number((state.games.find(g=>String(g.id)===String(state.watchingGameId))||{}).watchedEps || 1) - 1); render(); }
  if(action === 'open-series-sort-panel'){ state.showSeriesSortPanel = !state.showSeriesSortPanel; render(); }
  if(action === 'bulk-sync-playlists'){ await bulkSyncPlaylists(); }
  if(action === 'focus-search'){ const input = document.getElementById('searchInput'); if(input){ input.focus(); input.scrollIntoView({behavior:'smooth', block:'center'}); } }
  if(action === 'save-series-orders'){ await saveSeriesOrders(); }
  if(action === 'apply-cover-suggestions'){ await applyCoverSuggestions(); }
  if(action === 'clear-cover-suggestions'){ state.coverSuggestions = []; render(); }
  if(action === 'edit-pending-feature'){ if(state.pendingFeature){ state.editingFeature = { ...state.pendingFeature }; render(); } }
  if(action === 'cancel-feature-confirm'){ rememberPendingFeature(null); render(); }
  if(action === 'confirm-feature-apply'){ const pending = state.pendingFeature; rememberPendingFeature(null); if(pending) await applyFeatureObject(pending); }
  if(action === 'confirm-feature-apply-refresh'){ const pending = state.pendingFeature; rememberPendingFeature(null); if(pending){ await applyFeatureObject(pending); await loadRuntime(); setToast('Özellik uygulandı, site verileri yenilendi. Oturum korunuyor.'); } }
  if(action === 'clear-active-features'){ await clearActiveFeatures(); }
  if(action === 'clear-ai-suggestions'){ state.aiSuggestions = null; render(); }
  if(action === 'download-notes'){ download('hayatimiz-oyun-guncelleme-notlari.json', JSON.stringify(state.updates, null, 2)); setToast('Güncelleme notları indirildi.'); }
  if(action === 'toggle-notification-sound'){ state.notificationsMuted = !state.notificationsMuted; localStorage.setItem('hayatimiz_notifications_muted_v220', state.notificationsMuted ? '1' : '0'); setToast(state.notificationsMuted ? 'Bildirim sesi kapatıldı.' : 'Bildirim sesi açıldı.'); render(); }
  if(action === 'mark-all-notifications'){ userNotifications().forEach(n=>{ if(n.id !== 'empty') state.notificationSeen[n.id] = true; }); localStorage.setItem('hayatimiz_notification_seen_v220', JSON.stringify(state.notificationSeen)); setToast('Tüm bildirimler okundu yapıldı.'); render(); }
  if(action && action.startsWith('toggle-pref-')){ const key = action.replace('toggle-pref-',''); state.notificationPrefs[key] = !state.notificationPrefs[key]; localStorage.setItem('hayatimiz_notification_prefs_v220', JSON.stringify(state.notificationPrefs)); setToast('Bildirim tercihi güncellendi.'); render(); }
  if(action === 'watch-all-series'){ const g = state.games.find(x=>String(x.id)===String(state.watchingGameId)); if(g){ const firstUnwatched = seriesEpisodes(g).findIndex(ep=>!ep.watched); state.selectedEpisodeIndex = firstUnwatched >= 0 ? firstUnwatched : 0; setToast('Seri sırayla izleme modu hazır.'); render(); } }
  if(action === 'clear-local'){ localStorage.removeItem(ADMIN_TAB_KEY); localStorage.removeItem(MAINTENANCE_KEY); cleanupLegacyKeys(); setToast('Eski sürüm local cache temizlendi. Oturum korunur.'); }
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
  e.preventDefault();
  const fd = new FormData(e.currentTarget);
  const old = state.session;
  const fullName = String(fd.get('fullName') || '').trim();
  let avatarUrl = String(fd.get('avatarUrl') || '').trim();
  const file = e.currentTarget.elements.avatarFile?.files?.[0];
  if(file){
    try{
      const base64 = await fileToBase64(file);
      const uploaded = await api('profile-photo-upload', { adminToken: state.session?.adminToken, email: old.email, fileName:file.name, contentType:file.type || 'image/png', dataUrl:base64 });
      avatarUrl = uploaded.publicUrl || uploaded.url || avatarUrl;
      setToast('Profil fotoğrafı Supabase Storage içine yüklendi.');
    }catch(err){ setToast('Fotoğraf yüklenemedi: ' + err.message); }
  }
  saveSession({ ...old, full_name:fullName, avatar_url: avatarUrl }); render();
  try{ const data = await api('profile-update', { adminToken: state.session?.adminToken, email: old.email, fullName, avatarUrl }); if(data.user) saveSession({ ...state.session, ...data.user, avatar_url: avatarUrl }); else saveSession({ ...state.session, full_name: fullName, avatar_url: avatarUrl }); setToast('Profil güncellendi.'); }
  catch(err){ setToast('Profil local güncellendi; Supabase kaydı başarısız: ' + err.message); }
}
function fileToBase64(file){ return new Promise((resolve,reject)=>{ const reader=new FileReader(); reader.onload=()=>resolve(String(reader.result||'')); reader.onerror=reject; reader.readAsDataURL(file); }); }
async function toggleMaintenance(){
  const enabled = !state.maintenance?.enabled;
  const msgInput = $('#maintenanceMessage');
  const etaInput = $('#maintenanceEta');
  state.maintenance = { enabled, message: msgInput?.value || 'Hayatımız Oyun kısa süreli bakımda. Lütfen daha sonra tekrar dene.', eta: etaInput?.value || state.maintenance?.eta || '' };
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
  const nextText = rotatingTasks[rotateIndex % rotatingTasks.length]; rotateIndex += 1; localStorage.setItem('hayatimiz_task_rotate_stable', String(rotateIndex));
  state.planner.push({ id:'local-'+Date.now(), group, text: nextText, status:'plan' });
  render();
  try{ await api('planner-complete-add', { adminToken: state.session?.adminToken, group, completedId: active?.id, nextText }); await loadPlanner(false); setToast(`${group}: tamamlandı ve yeni madde eklendi.`); }
  catch(err){ setToast(`${group}: local tamamlandı, Supabase kaydı sonra denenir.`); }
}



async function clearActiveFeatures(){
  if(!isOwner()) return setToast('Tümünü silme/pasife alma için kurucu veya yönetici yetkisi gerekir.');
  const activeKeys = Object.keys(state.features || {}).filter(k => state.features[k]);
  if(!activeKeys.length) return setToast('Pasife alınacak aktif özellik yok.');
  if(!confirm(`${activeKeys.length} aktif özellik pasife alınsın mı?`)) return;
  activeKeys.forEach(k => { state.features[k] = false; });
  state.planner = state.planner.map(p => ({ ...p, status: (p.featureKey && activeKeys.includes(p.featureKey)) ? 'plan' : p.status }));
  persistFeatures();
  render();
  try{ await api('feature-disable-all', { adminToken: state.session?.adminToken, keys: activeKeys }); await loadPlanner(false); setToast('Tüm aktif özellikler pasife alındı.'); }
  catch(err){ setToast('Aktif özellikler local pasife alındı; Supabase sonra güncellenir.'); }
}

async function onGameEdit(e){
  e.preventDefault();
  const id = e.currentTarget.dataset.gameEdit;
  const current = state.games.find(g => String(g.id) === String(id));
  if(!current) return setToast('Oyun bulunamadı.');
  state.editingGameId = id;
  state.rawgCandidates = [];
  render();
  setToast('Oyun formda düzenleme için açıldı.');
}
async function onGameEditSubmit(e){
  e.preventDefault();
  const form = e.currentTarget;
  const id = state.editingGameId;
  const current = state.games.find(g => String(g.id) === String(id));
  if(!current) return setToast('Düzenlenecek oyun bulunamadı.');
  const patch = { ...current, ...readGameDraftFromForm(form) };
  if(!patch.title) return setToast('Oyun adı gerekli.');
  state.games = state.games.map(g => String(g.id) === String(id) ? { ...g, ...patch } : g);
  state.editingGameId = null;
  state.rawgCandidates = [];
  render();
  try{ const data = await api('games-update', { adminToken: state.session?.adminToken, gameId:id, game:patch }); if(data.game) state.games = state.games.map(g => String(g.id) === String(id) ? mapGame(data.game) : g); setToast('Oyun Supabase games tablosunda güncellendi.'); }
  catch(err){ setToast('Oyun local güncellendi; Supabase güncelleme başarısız: ' + err.message); }
  render();
}
async function onGameDelete(e){
  e.preventDefault();
  const id = e.currentTarget.dataset.gameDelete;
  const current = state.games.find(g => String(g.id) === String(id));
  if(!current) return setToast('Oyun bulunamadı.');
  if(!confirm(`${current.title} silinsin mi?`)) return;
  state.games = state.games.filter(g => String(g.id) !== String(id));
  render();
  try{ await api('games-delete', { adminToken: state.session?.adminToken, gameId:id }); setToast('Oyun silindi.'); }
  catch(err){ setToast('Oyun local silindi; Supabase silme başarısız: ' + err.message); }
}

function onFeatureEdit(e){
  e.preventDefault();
  const key = e.currentTarget.dataset.featureEdit;
  const feature = editableFeatureByKey(key);
  const editing = {
    key: feature.key,
    title: feature.title || key,
    target: feature.target || 'Yönetim Paneli > Özellik Planı',
    description: feature.description || '',
    group: feature.group || 'Adminin Önerileri',
    next: feature.next || ''
  };
  editing.editVariants = buildFeatureEditVariants(editing);
  state.editingFeature = editing;
  render();
}
function saveFeaturePatchLocal(key, patch, current = editableFeatureByKey(key)){
  applyFeatureOverride(key, patch);
  let item = findPlannerByKey(key);
  if(item){
    item.text = patch.title || item.text;
    item.featureKey = key;
    item.group = item.group || current.group || 'Adminin Önerileri';
    item.target = patch.target || item.target;
    item.description = patch.description ?? item.description;
  }else{
    state.planner.unshift({ id:'local-'+Date.now(), group:current.group || 'Adminin Önerileri', text:patch.title || current.title || key, status:featureEnabled(key)?'tamam':'plan', featureKey:key, target:patch.target, description:patch.description });
  }
  if(state.aiSuggestions?.items?.length){
    state.aiSuggestions = { ...state.aiSuggestions, items: state.aiSuggestions.items.map(f => f.key === key ? { ...f, ...patch } : f) };
  }
  if(state.pendingFeature?.key === key){ state.pendingFeature = { ...state.pendingFeature, ...patch }; }
}
async function onFeatureEditSubmit(e){
  e.preventDefault();
  const fd = new FormData(e.currentTarget);
  const key = String(fd.get('key') || '').trim();
  const title = String(fd.get('title') || '').trim();
  const target = String(fd.get('target') || '').trim() || 'Yönetim Paneli > Özellik Planı';
  const description = String(fd.get('description') || '').trim();
  if(!key || !title) return setToast('Özellik adı boş olamaz.');
  const current = editableFeatureByKey(key);
  const patch = { title, target, description };
  saveFeaturePatchLocal(key, patch, current);
  state.editingFeature = null;
  render();
  try{
    await api('feature-plan-add', { adminToken: state.session?.adminToken, key, title, group:current.group || 'Adminin Önerileri', target, description, next:current.next || '', matched:current.matched !== false });
    setToast('Özellik düzenlendi ve tabloya kaydedildi.');
  }catch(err){
    setToast('Özellik düzenlendi; Supabase kaydı sonra denenir.');
  }
  render();
}
async function onFeatureEditVariantApply(e){
  e.preventDefault();
  const index = Number(e.currentTarget.dataset.featureEditVariant || -1);
  const editing = state.editingFeature;
  if(!editing) return setToast('Düzenlenecek özellik bulunamadı.');
  const variants = Array.isArray(editing.editVariants) && editing.editVariants.length ? editing.editVariants : buildFeatureEditVariants(editing);
  const variant = variants[index];
  if(!variant) return setToast('Öneri bulunamadı.');
  const key = editing.key;
  const patch = { title:variant.title, target:variant.target, description:variant.description };
  const current = editableFeatureByKey(key);
  saveFeaturePatchLocal(key, patch, current);
  state.editingFeature = null;
  const feature = { ...current, ...variant, ...patch, key, group:variant.group || current.group || 'Adminin Önerileri', next:variant.next || current.next || '' };
  await applyFeatureObject(feature, { stay:true, reload:true, hardRefresh:true });
}
async function onFeatureDelete(e){
  e.preventDefault();
  const key = e.currentTarget.dataset.featureDelete;
  if(!confirm('Bu özelliği silmek veya pasife almak istiyor musun?')) return;
  state.features[key] = false;
  persistFeatures();
  state.planner = state.planner.filter(p => (p.featureKey || slugifyFeature(p.text)) !== key);
  if(state.pendingFeature?.key === key) rememberPendingFeature(null);
  render();
  try{ await api('feature-disable', { adminToken: state.session?.adminToken, key }); setToast('Özellik kaldırıldı / pasife alındı.'); }
  catch(err){ setToast('Özellik local kaldırıldı; Supabase sonra güncellenir.'); }
}

function getFormValue(form, name, fallback=''){
  return form?.elements?.[name] ? form.elements[name].value : fallback;
}
function readGameDraftFromForm(form){
  return {
    title:String(getFormValue(form, 'title')).trim(),
    genre:String(getFormValue(form, 'genre')).trim(),
    tags:String(getFormValue(form, 'tags')).trim(),
    releaseDate:normalizeReleaseDate(getFormValue(form, 'releaseDate')),
    status:String(getFormValue(form, 'status', 'Devam Ediyor') || 'Devam Ediyor'),
    eps:Number(getFormValue(form, 'eps', 0) || 0),
    watchedEps:Number(getFormValue(form, 'watchedEps', 0) || 0),
    score:Number(getFormValue(form, 'score', 8.5) || 0),
    cover:String(getFormValue(form, 'cover')).trim(),
    seriesName:String(getFormValue(form, 'seriesName')).trim(),
    seriesOrder:Number(getFormValue(form, 'seriesOrder', 0) || 0),
    playlistUrl:String(getFormValue(form, 'playlistUrl')).trim(),
    videoUrl:String(getFormValue(form, 'videoUrl')).trim(),
    description:String(getFormValue(form, 'description')).trim(),
    episodesText:String(getFormValue(form, 'episodesText')).trim(),
    episodes:parseEpisodesText(getFormValue(form, 'episodesText'))
  };
}
function persistGameDraft(){
  try{ localStorage.setItem(GAME_FORM_DRAFT_KEY, JSON.stringify({ ...DEFAULT_GAME_DRAFT, ...state.gameDraft })); }catch{}
}
function saveGameDraftFromForm(form){
  state.gameDraft = { ...DEFAULT_GAME_DRAFT, ...state.gameDraft, ...readGameDraftFromForm(form) };
  persistGameDraft();
}
function clearGameDraft(){
  state.gameDraft = { ...DEFAULT_GAME_DRAFT };
  try{ localStorage.removeItem(GAME_FORM_DRAFT_KEY); }catch{}
}
function sameTitle(a,b){
  return String(a || '').trim().toLocaleLowerCase('tr-TR') === String(b || '').trim().toLocaleLowerCase('tr-TR');
}
function setFormValue(form, name, value){
  const el = form?.elements?.[name];
  if(el) el.value = value ?? '';
}
function updateOpenGameFormSnapshot(form){
  if(!form) return;
  const draft = readGameDraftFromForm(form);
  const episodes = parseEpisodesText(draft.episodesText);
  const patch = { ...draft, episodes, eps:Number(draft.eps || episodes.length || 0), watchedEps:Number(draft.watchedEps || 0) };
  if(form.id === 'gameAddForm'){
    state.gameDraft = { ...state.gameDraft, ...patch };
    persistGameDraft();
  }else if(state.editingGameId){
    const idx = state.games.findIndex(g=>String(g.id)===String(state.editingGameId));
    if(idx >= 0) state.games[idx] = { ...state.games[idx], ...patch };
  }
}
function setFormValuesAndSnapshot(form, patch){
  if(!form || !patch) return;
  Object.entries(patch).forEach(([key,value])=>setFormValue(form, key, value));
  const preview = form.querySelector('.coverPreview');
  const cover = getFormValue(form,'cover');
  if(preview){ preview.classList.toggle('isEmpty', !cover); preview.innerHTML = cover ? `<img src="${esc(cover)}" alt="Kapak önizleme">` : 'Kapak çekilince burada önizleme görünür.'; }
  updateOpenGameFormSnapshot(form);
}

function localGameMeta(title){
  const t = String(title || '').toLowerCase();
  const map = [
    [/assassin.*origins|origins/, { genre:'Aksiyon, Macera, RPG, Açık Dünya', released:'27.10.2017', score:8.5, cover:'https://media.rawg.io/media/games/336/336c6bd63d83cf8e59937ab8895d1240.jpg' }],
    [/red dead|rdr2/, { genre:'Aksiyon, Macera, Açık Dünya', released:'26.10.2018', score:9.7, cover:'https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg' }],
    [/gta|grand theft auto/, { genre:'Aksiyon, Macera, Açık Dünya', released:'17.09.2013', score:9.3, cover:'https://media.rawg.io/media/games/20a/20aa03a10cb1e10f31f82a5e2ebf1e72.jpg' }],
    [/resident|silent hill|alan wake|outlast|evil|dead space/, { genre:'Korku, Aksiyon, Macera', released:'', score:8.8, cover:'https://images.unsplash.com/photo-1500673922987-e212871fec22?q=80&w=900&auto=format&fit=crop' }],
    [/god of war|elden ring|dark souls|sekiro|witcher/, { genre:'Aksiyon, RPG, Macera', released:'', score:9.2, cover:'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=900&auto=format&fit=crop' }],
    [/cyberpunk|mass effect|starfield|halo/, { genre:'Aksiyon, RPG, Bilim Kurgu', released:'', score:8.6, cover:'https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=900&auto=format&fit=crop' }]
  ];
  return (map.find(([r])=>r.test(t)) || [null, { genre:'Genel, Hikaye', released:'', score:8.5, cover:'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=900&auto=format&fit=crop' }])[1];
}
function guessGameMeta(title){
  const local = localGameMeta(title);
  return [local.genre, '', local.cover, local.released, local.score];
}

async function autoGameMetaFill(formId='gameAddForm'){
  const form = document.getElementById(formId);
  if(!form) return setToast('Oyun formu açık değil.');
  const title = getFormValue(form, 'title');
  if(!title.trim()) return setToast('Önce oyun adını yaz.');
  try{
    const data = await api('game-meta', { adminToken: state.session?.adminToken, title });
    const meta = data.meta || localGameMeta(title);
    state.rawgCandidates = data.candidates || [];
    const draft = readGameDraftFromForm(form);
    const patch = {
      title: meta.title || draft.title || title,
      genre: meta.genre || draft.genre || state.gameDraft.genre,
      releaseDate: normalizeReleaseDate(meta.releaseDate || meta.released || draft.releaseDate),
      score: Number(meta.score || draft.score || state.gameDraft.score || 8.5),
      cover: meta.cover || draft.cover || state.gameDraft.cover,
      description: draft.description || state.gameDraft.description || '',
      tags: draft.tags || state.gameDraft.tags || '',
      seriesName: draft.seriesName || state.gameDraft.seriesName || '',
      playlistUrl: draft.playlistUrl || state.gameDraft.playlistUrl || '',
      videoUrl: draft.videoUrl || state.gameDraft.videoUrl || '',
      watchedEps: draft.watchedEps || state.gameDraft.watchedEps || 0,
      seriesOrder: draft.seriesOrder || state.gameDraft.seriesOrder || 0,
      episodesText: draft.episodesText || state.gameDraft.episodesText || ''
    };
    setFormValuesAndSnapshot(form, patch);
    setToast(state.rawgCandidates.length > 1 ? 'RAWG sonuçları geldi. Doğru kapağı seçebilir veya formu böyle güncelleyebilirsin.' : 'Form dolduruldu: kapak, çıkış tarihi, tür ve varsa hikaye bilgisi işlendi.');
  }catch(err){ setToast('Meta çekilemedi: ' + err.message); }
}
async function fetchGameStoryToForm(formId='gameAddForm'){
  const form = document.getElementById(formId);
  if(!form) return setToast('Oyun formu açık değil.');
  const title = getFormValue(form, 'title');
  if(!title.trim()) return setToast('Önce oyun adını yaz.');
  try{
    const data = await api('game-story', { adminToken: state.session?.adminToken, title, rawgSlug:getFormValue(form,'rawg_slug') });
    const story = data.story || data.description || '';
    if(!story.trim()) return setToast('Hikaye bulunamadı. Manuel açıklama yazabilirsin.');
    setFormValuesAndSnapshot(form, { description:story });
    setToast('RAWG notu eklenmeden Türkçe oyun hikayesi forma işlendi.');
  }catch(err){
    const fallback = localTurkishStory(title, getFormValue(form,'genre'));
    setFormValuesAndSnapshot(form, { description:fallback });
    setToast('API hikayesi alınamadı; Türkçe yerel hikaye özeti forma işlendi.');
  }
}
function localTurkishStory(title, genre=''){
  const name = String(title || 'Bu oyun').trim() || 'Bu oyun';
  const g = String(genre || '').toLocaleLowerCase('tr-TR');
  if(/assassin|creed|origins/.test(name.toLocaleLowerCase('tr-TR'))) return `${name}, Antik Mısır döneminde geçen hikaye odaklı bir macera sunar. Oyuncu, Bayek'in kişisel intikam yolculuğunu, halkını koruma mücadelesini ve Suikastçı Kardeşliği'nin temellerine uzanan olayları bölüm bölüm takip eder.`;
  if(/korku|horror|silent|resident|alan wake|outlast/.test(g+' '+name.toLocaleLowerCase('tr-TR'))) return `${name}, gerilim ve hayatta kalma atmosferini öne çıkaran hikaye odaklı bir deneyim sunar. Oyuncu, karanlık olayların arkasındaki sırrı çözerken kaynaklarını dikkatli kullanır ve bölüm bölüm ilerleyen tehditlerle yüzleşir.`;
  if(/rpg|açık dünya|macera|aksiyon/.test(g)) return `${name}, keşif, mücadele ve hikaye ilerleyişini bir araya getiren bir seridir. Oyuncu görevleri tamamlayarak karakter gelişimini, ana hikayeyi ve yan içerikleri bölüm bölüm takip eder.`;
  return `${name}, oyun arşivinde bölüm bölüm takip edilecek bir içerik olarak kaydedildi. Bu alanda oyunun hikayesi, ilerleme durumu, seri bilgisi ve izleme notları tutulur.`;
}


function applyRawgCandidate(index){
  const item = state.rawgCandidates?.[index];
  if(!item) return setToast('RAWG sonucu bulunamadı.');
  const form = document.getElementById(state.editingGameId ? 'gameEditForm' : 'gameAddForm');
  if(!form) return setToast('Oyun formu açık değil.');
  setFormValuesAndSnapshot(form, {
    title:item.title || getFormValue(form,'title'),
    genre:item.genre || getFormValue(form,'genre'),
    releaseDate:normalizeReleaseDate(item.released || item.releaseDate || getFormValue(form,'releaseDate')),
    score:item.score || getFormValue(form,'score'),
    cover:item.cover || getFormValue(form,'cover')
  });
  state.rawgCandidates = [];
  setToast('Seçilen RAWG sonucu forma uygulandı. Kaydetmeden oyun eklenmez.');
}
function onCoverUploadPreview(e){
  const file = e.target.files?.[0];
  const form = e.target.closest('form');
  if(!file || !form) return;
  const reader = new FileReader();
  reader.onload = () => {
    const value = String(reader.result || '');
    setFormValue(form, 'cover', value);
    const preview = form.querySelector('.coverPreview');
    if(preview){ preview.classList.remove('isEmpty'); preview.innerHTML = `<img src="${esc(value)}" alt="Kapak önizleme">`; }
    if(form.id === 'gameAddForm') saveGameDraftFromForm(form);
    setToast('Kapak dosyası önizlemeye alındı. Supabase Storage URL bağlantısı varsa sonraki kayıtta URL olarak tutulur.');
  };
  reader.readAsDataURL(file);
}
async function estimatePlaylistEpisodes(formId='gameAddForm'){
  const form = document.getElementById(formId);
  if(!form) return setToast('Oyun formu açık değil.');
  const playlistUrl = getFormValue(form, 'playlistUrl');
  if(!playlistUrl.trim()) return setToast('Önce YouTube oynatma listesi linkini yaz.');
  try{
    const data = await api('playlist-items', { adminToken: state.session?.adminToken, playlistUrl });
    const episodes = normalizeEpisodes(data.episodes || []).map((ep,i)=>({ ...ep, number:i+1, title:cleanEpisodeTitle(ep.title, i+1) }));
    const count = Number(data.count || episodes.length || 0);
    const current = parseEpisodesText(getFormValue(form, 'episodesText'));
    const diff = compareEpisodes(current, episodes);
    if(episodes.length > 0){
      const text = episodesToText(episodes);
      setFormValuesAndSnapshot(form, { eps:episodes.length, episodesText:text, watchedEps:getFormValue(form,'watchedEps') || 0, playlistSyncHash:playlistSignature(episodes) });
      setToast(`Playlist senkronize edildi: ${episodes.length} bölüm, ${diff.added} yeni, ${diff.changed} değişen video.`);
      return;
    }
    if(count > 0){
      setFormValuesAndSnapshot(form, { eps:count, watchedEps:getFormValue(form,'watchedEps') || 0 });
      setToast(`Playlistte ${count} video görünüyor ama video listesi alınamadı. YOUTUBE_API_KEY ekle veya playlisti herkese açık yap.`);
      return;
    }
    setToast('Playlist videoları alınamadı. Linkin herkese açık playlist linki olduğundan emin ol.');
  }catch(err){ setToast('Playlist videoları alınamadı: ' + err.message); }
}


async function markEpisodeWatchedIndex(index){
  const g = state.games.find(x=>String(x.id)===String(state.watchingGameId));
  if(!g) return;
  const eps = seriesEpisodes(g).map((ep,i)=>i===index ? { ...ep, watched:true, watchedAt:new Date().toISOString() } : ep);
  g.episodes = eps;
  g.watchedEps = eps.filter(ep=>ep.watched).length;
  if(eps[index]?.watched) recordWatchHistory(g, eps[index]);
  const nextIndex = Math.min(eps.length - 1, index + 1);
  try{
    const data = await api('episode-progress-save', { gameId:g.id, episodeIndex:index, episodes:eps, watchedEps:g.watchedEps });
    if(data.game) state.games = state.games.map(x=>String(x.id)===String(g.id) ? mapGame(data.game) : x);
    setToast(`${index+1}. bölüm Supabase'e kalıcı kaydedildi.`);
  }catch(err){
    setToast(`${index+1}. bölüm local işaretlendi; Supabase kaydı başarısız: ${err.message}`);
  }
  if(state.autoNextEpisode && nextIndex !== index) state.selectedEpisodeIndex = nextIndex;
  render();
}

async function toggleEpisodeWatchedIndex(index){
  const g = state.games.find(x=>String(x.id)===String(state.watchingGameId));
  if(!g) return;
  const eps = seriesEpisodes(g).map((ep,i)=>i===index ? { ...ep, watched:!ep.watched, watchedAt:!ep.watched ? new Date().toISOString() : '' } : ep);
  g.episodes = eps;
  g.watchedEps = eps.filter(ep=>ep.watched).length;
  if(eps[index]?.watched) recordWatchHistory(g, eps[index]);
  try{
    const data = await api('episode-progress-save', { gameId:g.id, episodeIndex:index, episodes:eps, watchedEps:g.watchedEps });
    if(data.game) state.games = state.games.map(x=>String(x.id)===String(g.id) ? mapGame(data.game) : x);
    setToast(eps[index]?.watched ? `${index+1}. bölüm izlendi.` : `${index+1}. bölüm geri alındı.`);
  }catch(err){ setToast('Bölüm durumu local değişti; Supabase kaydı başarısız: ' + err.message); }
  const nextGame = nextSeriesGame(g);
  if(state.autoNextEpisode && index >= eps.length-1 && nextGame){ state.watchingGameId = nextGame.id; state.selectedEpisodeIndex = 0; }
  else if(state.autoNextEpisode && eps[index]?.watched && index < eps.length-1) state.selectedEpisodeIndex = index + 1;
  render();
}
async function bulkSyncPlaylists(){
  const targets = state.games.filter(g=>String(g.playlistUrl||'').trim());
  if(!targets.length) return setToast('Playlist linki olan oyun bulunamadı.');
  let ok=0, fail=0;
  for(const g of targets){
    try{
      const data = await api('playlist-items', { adminToken: state.session?.adminToken, playlistUrl:g.playlistUrl });
      const episodes = normalizeEpisodes(data.episodes || []).map((ep,i)=>({ ...ep, number:i+1, title:cleanEpisodeTitle(ep.title, i+1) }));
      if(episodes.length){
        const patch = { ...g, episodes, eps:episodes.length, playlistSyncHash:playlistSignature(episodes) };
        const saved = await api('games-update', { adminToken: state.session?.adminToken, gameId:g.id, game:patch });
        if(saved.game) state.games = state.games.map(x=>String(x.id)===String(g.id) ? mapGame(saved.game) : x);
        ok++;
      }
    }catch(err){ fail++; }
  }
  setToast(`Toplu playlist senkronizasyonu: ${ok} başarılı${fail?`, ${fail} hata`:''}.`);
  render();
}



async function saveSeriesOrders(){
  const targets = state.games.filter(g=>String(g.seriesName||'').trim());
  if(!targets.length) return setToast('Kaydedilecek seri sırası yok.');
  let ok=0, fail=0;
  for(const g of targets){
    try{ const data = await api('games-update', { adminToken: state.session?.adminToken, gameId:g.id, game:g }); if(data.game) state.games = state.games.map(x=>String(x.id)===String(g.id) ? mapGame(data.game) : x); ok++; }
    catch(err){ fail++; }
  }
  setToast(`Seri sırası kaydı tamamlandı: ${ok} başarılı${fail?`, ${fail} hata`:''}.`);
  render();
}

async function onFeatureIdeaSubmit(e){
  e.preventDefault();
  const fd = new FormData(e.currentTarget);
  const text = String(fd.get('featureText') || '').trim();
  if(!text) return setToast('Özellik yazısı boş olamaz.');
  const items = getAiFeatureSuggestions(text);
  state.aiSuggestions = { query:text, items };
  rememberPendingFeature(null);
  e.currentTarget.reset();
  setToast('AI önerileri hazır. Birini seçip Siteye Uygula de.');
  render();
}
function featureByKey(key){
  if(state.aiSuggestions?.items?.length){
    const fromAi = state.aiSuggestions.items.find(f => f.key === key);
    if(fromAi) return mergeFeatureOverride(fromAi);
  }
  const preset = FEATURE_CATALOG.find(f => f.key === key);
  if(preset) return mergeFeatureOverride(preset);
  const item = state.planner.find(p => (p.featureKey || slugifyFeature(p.text)) === key);
  return featureFromPlannerItem(item) || proposeFeatureFromText(key);
}
async function onChooseAiFeature(e){
  e.preventDefault();
  const key = e.currentTarget.dataset.featureChoose;
  const feature = featureByKey(key);
  if(!feature) return setToast('AI önerisi bulunamadı.');
  await applyFeatureObject(feature, { stay:true, reload:true });
}
async function onPlanAiFeature(e){
  e.preventDefault();
  const key = e.currentTarget.dataset.featurePlan;
  const feature = featureByKey(key);
  if(!feature) return setToast('Plan önerisi bulunamadı.');
  addFeatureToPlanner(feature, 'plan');
  render();
  try{ await api('feature-plan-add', { adminToken: state.session?.adminToken, key:feature.key, title:feature.title, group:feature.group, target:feature.target, description:feature.description, next:feature.next, matched:feature.matched !== false }); setToast('Özellik plana eklendi.'); }
  catch(err){ setToast('Özellik local plana eklendi; Supabase kaydı sonra denenir.'); }
}
async function onApplyFeature(e){
  e.preventDefault();
  const key = e.currentTarget.dataset.featureApply;
  const title = e.currentTarget.dataset.featureTitle || '';
  const feature = featureByKey(key) || proposeFeatureFromText(title || key);
  if(!feature) return setToast('Özellik bulunamadı.');
  await applyFeatureObject(feature, { stay:true, reload:false });
}
function addFeatureToPlanner(feature, status='plan'){
  const key = feature.key;
  const fixed = mergeFeatureOverride(feature);
  let plannerItem = state.planner.find(p => (p.featureKey === key) || p.text === fixed.title || p.text === feature.originalText || slugifyFeature(p.text) === key);
  if(plannerItem){
    plannerItem.status = status;
    plannerItem.featureKey = key;
    plannerItem.text = fixed.title || plannerItem.text;
    plannerItem.group = fixed.group || plannerItem.group;
    plannerItem.target = fixed.target || plannerItem.target;
    plannerItem.description = fixed.description || plannerItem.description;
  }
  else state.planner.unshift({ id:'local-'+Date.now(), group:fixed.group || 'Adminin Önerileri', text:fixed.title, status, featureKey:key, target:fixed.target, description:fixed.description });
}
async function applyFeatureObject(feature, options={}){
  if(!isOwner()) return setToast('Siteye uygulama için kurucu veya yönetici yetkisi gerekir.');
  feature = mergeFeatureOverride(feature);
  const key = feature.key;
  state.features[key] = true;
  state.editingFeature = null;
  persistFeatures();
  addFeatureToPlanner(feature, 'tamam');
  if(feature.next && !state.planner.some(p => p.text === feature.next)) state.planner.push({ id:'local-'+(Date.now()+1), group:feature.group || 'Adminin Önerileri', text:feature.next, status:'plan' });
  state.aiSuggestions = state.aiSuggestions ? { ...state.aiSuggestions, items: state.aiSuggestions.items.map(f=> f.key===key ? { ...f, enabled:true } : f) } : null;
  render();
  try{
    await api('feature-apply', { adminToken: state.session?.adminToken, key, title:feature.title, group:feature.group, target:feature.target, description:feature.description, next:feature.next, matched:feature.matched !== false });
    if(options.reload) { await loadFeatures(false); await loadPlanner(false); }
    state.features[key] = true;
    persistFeatures();
    const refreshed = state.planner.find(p => p.featureKey === key || p.text === feature.title);
    if(refreshed) refreshed.status = 'tamam';
    const message = `${feature.title} siteye uygulandı. F5 sonrası entegre kaldı.`;
    setToast(options.hardRefresh ? `${message} Sayfa yenileniyor...` : `${feature.title} siteye uygulandı. Aynı sayfada kaldın.`);
    if(options.hardRefresh) scheduleHardRefresh(message);
  }catch(err){
    const message = `${feature.title} local aktif edildi; F5 sonrası local entegre kalır. Supabase kaydı başarısız: ${err.message}`;
    setToast(message);
    if(options.hardRefresh) scheduleHardRefresh(message);
  }
  render();
}
function autoCoverFetch(){
  const form = document.getElementById('gameAddForm');
  if(form && String(form.elements.title?.value || '').trim()){
    autoGameMetaFill();
    return;
  }
  const missing = state.games.filter(g => !String(g.cover || '').trim());
  if(!missing.length) return setToast('Kapaksız oyun bulunmadı. Listeye dokunulmadı.');
  state.coverSuggestions = missing.map(g => ({ id:g.id, title:g.title, genre:g.genre, cover:localGameMeta(g.title).cover }));
  render();
  setToast(`${state.coverSuggestions.length} kapak önerisi hazır. Oyunlar değiştirilmedi; uygulamak için onayla.`);
}
async function applyCoverSuggestions(){
  if(!state.coverSuggestions?.length) return setToast('Uygulanacak kapak önerisi yok.');
  const suggestions = [...state.coverSuggestions];
  const previousGames = [...state.games];
  state.games = state.games.map(g => {
    const hit = suggestions.find(s => String(s.id) === String(g.id));
    return hit ? { ...g, cover:hit.cover } : g;
  });
  state.coverSuggestions = [];
  render();
  let saved = 0;
  for(const item of suggestions){
    if(String(item.id).startsWith('local-')) continue;
    try{ await api('games-update', { adminToken: state.session?.adminToken, gameId:item.id, game:{ cover:item.cover } }); saved += 1; }catch(err){}
  }
  setToast(saved ? `${saved} kapak Supabase games tablosuna kaydedildi.` : 'Kapaklar ekranda uygulandı. Supabase kaydı için gerçek tablo ID ve yetki gerekir.');
}
async function onAdminNoteSubmit(e){
  e.preventDefault(); const fd = new FormData(e.currentTarget); const note = String(fd.get('note') || '').trim(); if(!note) return setToast('Not boş olamaz.');
  state.notes.unshift({ note, created_at: new Date().toISOString() }); e.currentTarget.reset(); render();
  try{ await api('admin-note-add', { adminToken: state.session?.adminToken, note }); await loadPlanner(false); setToast('Not kaydedildi.'); }
  catch(err){ setToast('Not local kaydedildi; Supabase kaydı başarısız.'); }
}
function onTagToggle(e){
  e.preventDefault();
  const btn = e.currentTarget;
  const form = btn.closest('form');
  if(!form) return;
  const tag = String(btn.dataset.tagToggle || '').trim();
  const input = form.elements.tags;
  const current = splitTags(input?.value || '');
  const lower = tag.toLocaleLowerCase('tr-TR');
  const exists = current.some(t=>t.toLocaleLowerCase('tr-TR') === lower);
  const next = exists ? current.filter(t=>t.toLocaleLowerCase('tr-TR') !== lower) : [...current, tag];
  if(input) input.value = next.join(', ');
  btn.classList.toggle('active', !exists);
  saveGameDraftFromForm(form);
}

async function onGameAddSubmit(e){
  e.preventDefault();
  const form = e.currentTarget;
  saveGameDraftFromForm(form);
  const game = { ...DEFAULT_GAME_DRAFT, ...state.gameDraft };
  if(!game.title) return setToast('Oyun adı gerekli.');
  if(state.games.some(g => sameTitle(g.title, game.title))){
    return setToast('Bu oyun zaten listede var. Otomatik ekleme yapılmadı; istersen mevcut oyunu Düzenle/Sil ile güncelle.');
  }
  try{
    const data = await api('games-add', { adminToken: state.session?.adminToken, game });
    if(!data.game) throw new Error('Supabase kayıt cevabı boş döndü. Oyun local eklenmedi.');
    state.games.unshift(mapGame(data.game));
    clearGameDraft();
    state.showGameForm = false;
    render();
    setToast('Oyun Supabase games tablosuna kaydedildi.');
  }catch(err){
    state.showGameForm = true;
    render();
    setToast('Oyun eklenmedi. Form korundu. Supabase/API hatası: ' + err.message);
  }
}
function download(filename, content){ const blob = new Blob([content], {type:'application/json;charset=utf-8'}); const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(a.href); }
function showBootError(error){
  const root = document.getElementById('root'); if(!root) return; root.dataset.mounted='1'; window.clearTimeout(window.__HAYATIMIZ_BOOT_TIMER__);
  root.innerHTML = `<section class="bootError"><div class="bootErrorCard"><h1>Site açılırken hata yakalandı.</h1><p>Beyaz ekran yerine hata yakalama ekranı aktif oldu. Bu mesaj çıkarsa ekran görüntüsüyle konsol hatasını gönder.</p><pre>${esc(error?.stack || error?.message || error)}</pre><button class="btn primary" onclick="location.reload()">Sayfayı Yenile</button></div></section>`;
}
window.addEventListener('error', event => showBootError(event.error || event.message));
window.addEventListener('unhandledrejection', event => showBootError(event.reason || 'Bilinmeyen promise hatası'));
window.addEventListener('hashchange', () => { const route = parseRouteFromLocation(); if(route.page){ state.page = route.page; localStorage.setItem(PAGE_KEY, state.page); if(route.adminPage){ state.adminPage = route.adminPage; localStorage.setItem(ADMIN_TAB_KEY, state.adminPage); } render(); } });


/* v2.2.0 FIX 6 FINAL - profesyonel ana sayfa, seri sayfası, oyun formu ve düzenlenebilir yayın takvimi */
const CALENDAR_EVENTS_KEY_FIX6_FINAL = 'hayatimiz_calendar_events_v220_fix6_final';
function parseTrDateToIsoFix6(value){
  const raw = String(value || '').trim();
  if(!raw) return '';
  if(/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const m = raw.match(/^(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{4})$/);
  if(m) return `${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`;
  const d = new Date(raw);
  if(!Number.isNaN(d.getTime())) return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  return '';
}
function formatDateTrFix6(value){
  const iso = parseTrDateToIsoFix6(value);
  if(!iso) return String(value || '');
  const [y,m,d] = iso.split('-');
  return `${d}.${m}.${y}`;
}
function monthNameTrFix6(index){ return ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'][index] || ''; }
function eventToneFix6(type){ const t=String(type||'').toLowerCase(); if(t.includes('seri')) return 'pink'; if(t.includes('özel')||t.includes('ozel')) return 'green'; if(t.includes('topluluk')) return 'blue'; if(t.includes('etkin')) return 'yellow'; return 'purple'; }
function defaultCalendarEventsFix6(){
  const now = new Date();
  const y = now.getFullYear(), m = now.getMonth();
  const iso = d => `${y}-${String(m+1).padStart(2,'0')}-${String(Math.max(1, Math.min(28, d))).padStart(2,'0')}`;
  const games = Array.isArray(state.games) ? state.games : [];
  const fromGames = games.filter(g=>String(g.releaseDate||'').trim()).slice(0,8).map((g,i)=>({ id:`game-${g.id||i}`, title:g.title, date:parseTrDateToIsoFix6(g.releaseDate), time:'20:00', type:g.status==='Yakında'?'Yaklaşan Yayın':'Oyun Yayını', cover:coverFor(g), note:g.description || g.genre || '' })).filter(e=>e.date);
  if(fromGames.length) return fromGames;
  return [
    { id:'demo-1', title:'Elden Ring', date:iso(now.getDate()), time:'20:00', type:'Ana Yayın', cover:'https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.jpg', note:'Ana hikaye devamı' },
    { id:'demo-2', title:'God of War Ragnarök', date:iso(now.getDate()+1), time:'21:00', type:'Oyun Yayını', cover:'https://images.igdb.com/igdb/image/upload/t_cover_big/co5s6x.jpg', note:'Yeni Oyun+' },
    { id:'demo-3', title:'Cyberpunk 2077', date:iso(now.getDate()+4), time:'20:00', type:'Seri Devamı', cover:'https://images.igdb.com/igdb/image/upload/t_cover_big/co7497.jpg', note:'Phantom Liberty DLC' },
    { id:'demo-4', title:"Baldur's Gate 3", date:iso(now.getDate()+6), time:'19:00', type:'Özel Etkinlik', cover:'https://images.igdb.com/igdb/image/upload/t_cover_big/co670h.jpg', note:'Taktik savaşları' }
  ];
}
function getCalendarEventsFix6(){
  const stored = safeParse(localStorage.getItem(CALENDAR_EVENTS_KEY_FIX6_FINAL), null);
  const base = Array.isArray(stored) ? stored : defaultCalendarEventsFix6();
  const gameEvents = (Array.isArray(state.games)?state.games:[]).filter(g=>String(g.releaseDate||'').trim()).map((g,i)=>({ id:`release-${g.id||i}`, title:g.title, date:parseTrDateToIsoFix6(g.releaseDate), time:'20:00', type:'Çıkış Tarihi', cover:coverFor(g), note:g.genre||'' })).filter(e=>e.date);
  const ids = new Set(base.map(e=>String(e.id)));
  gameEvents.forEach(e=>{ if(!ids.has(e.id)) base.push(e); });
  return base.filter(e=>e && e.date).sort((a,b)=>String(a.date).localeCompare(String(b.date)) || String(a.time||'').localeCompare(String(b.time||'')));
}
function saveCalendarEventsFix6(events){ localStorage.setItem(CALENDAR_EVENTS_KEY_FIX6_FINAL, JSON.stringify(events)); }
function calendarGridDatesFix6(baseDate){
  const y = baseDate.getFullYear(), m = baseDate.getMonth();
  const first = new Date(y,m,1);
  const startOffset = (first.getDay()+6)%7;
  const start = new Date(y,m,1-startOffset);
  const rows=[];
  for(let r=0;r<5;r++){
    const row=[];
    for(let c=0;c<7;c++){ const d=new Date(start); d.setDate(start.getDate()+r*7+c); row.push(d); }
    rows.push(row);
  }
  return rows;
}
function eventCardCoverFix6(g){ return coverFor(g) || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=900&auto=format&fit=crop'; }
miniGameTile = function(g){
  return `<article class="homeProGameCard"><div class="homeProCover"><img src="${esc(eventCardCoverFix6(g))}" alt="${esc(g.title)}"><span class="scoreBadge fix4Score">${esc(String(g.score || '8.5'))}</span><button class="heartBtn" data-favorite-game="${esc(g.id)}">${isFavorite(g.id)?'♥':'♡'}</button></div><div class="homeProBody"><h3>${esc(g.title)}</h3><p>${esc(fix4Description(g).slice(0,115))}${fix4Description(g).length>115?'...':''}</p>${tagChipsHtml(g.tags || g.genre)}<div class="homeProActions">${watchButtonHtml(g)}<small>${esc(formatDateTrFix6(g.releaseDate) || g.status || 'Arşiv')}</small></div></div></article>`;
};
seriesProgressTile = function(g){
  const eps = Number(g.eps||seriesEpisodes(g).length||0), watched=Number(g.watchedEps||0);
  return `<article class="seriesProgressPro"><img src="${esc(eventCardCoverFix6(g))}" alt="${esc(g.title)}"><div><b>${esc(g.seriesName || g.title)}</b><small>${watched}/${eps} bölüm • %${progressPercent(g)}</small><div class="progressLine"><span style="width:${progressPercent(g)}%"></span></div><button class="miniBtn primary" data-watch-series="${esc(g.id)}">Sırayla İzle</button></div></article>`;
};
gameArchiveDashboard = function(){
  const games = Array.isArray(state.games) ? state.games : [];
  const featured = games.slice().sort((a,b)=>Number(b.score||0)-Number(a.score||0)).slice(0,5);
  const continued = games.filter(g=>Number(g.eps||0)>0 || String(g.seriesName||'').trim()).slice(0,5);
  const events = getCalendarEventsFix6().slice(0,4);
  const totalEpisodes = games.reduce((sum,g)=>sum + Number(g.eps || seriesEpisodes(g).length || 0),0);
  const watchedEpisodes = games.reduce((sum,g)=>sum + Number(g.watchedEps || 0),0);
  const completed = games.filter(g=>g.status==='Tamamlandı').length;
  return `<section class="v220Shell fix4Shell fix6FinalHome">
    ${archiveSideNav()}
    <main class="v220HomeMain fix4HomeMain fix6FinalMain">
      <section class="v220Hero fix4Hero fix6FinalHero"><div><span class="eyebrow">Hayatımız Oyun</span><h1>Oyun Arşivi, seriler ve daha fazlası.</h1><p>Oyunları keşfet, seri ilerlemeni takip et, kapakları bozulmadan gör ve bölümleri site içinde sinema ekranıyla izle.</p><div class="heroActions"><button class="btn primary" data-page="Oyun Arşivi">Arşivi Keşfet</button><button class="btn" data-page="Takvim">Yayın Takvimini Gör</button></div></div></section>
      <section class="fix4StatsRow fix6FinalStats"><div><b>${games.length}</b><span>Oyun</span></div><div><b>${sortedSeriesGroups(games).length}</b><span>Seri</span></div><div><b>${completed}</b><span>Tamamlanan</span></div><div><b>${watchedEpisodes}/${totalEpisodes}</b><span>Bölüm</span></div></section>
      <section class="v220Shelf fix4Shelf fix6FinalShelf"><div class="sectionHead"><div><h2>Öne Çıkan Oyunlar</h2><p class="muted">Kapaklar kırpılmadan, daha geniş ve okunabilir kartlarda gösterilir.</p></div><button class="miniBtn" data-page="Oyun Arşivi">Tümünü Gör</button></div><div class="homeProGrid">${featured.map(g=>miniGameTile(g)).join('') || '<div class="card">Henüz oyun yok.</div>'}</div></section>
      <section class="v220Shelf fix4Shelf fix6FinalShelf"><div class="sectionHead"><div><h2>Devam Eden Serilerim</h2><p class="muted">Seri ilerlemesi ve sıradaki bölümler tek bakışta görünür.</p></div><button class="miniBtn" data-page="Seriler">Tümünü Gör</button></div><div class="seriesProgressGridPro">${continued.map(g=>seriesProgressTile(g)).join('') || '<div class="card">Henüz seri yok.</div>'}</div></section>
      <section class="v220Shelf fix4Shelf fix6FinalShelf"><div class="sectionHead"><div><h2>Yaklaşan Yayınlar</h2><p class="muted">Yönetim panelindeki Yayın Takvimi kayıtlarından otomatik gelir.</p></div><button class="miniBtn" data-page="Takvim">Tümü</button></div><div class="fix6ReleaseCards">${events.map(ev=>`<article class="releaseCardPro"><img src="${esc(ev.cover || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=900&auto=format&fit=crop')}" alt="${esc(ev.title)}"><div><b>${esc(ev.title)}</b><small>${esc(formatDateTrFix6(ev.date))} • ${esc(ev.time || '20:00')}</small><p>${esc(ev.note || ev.type || 'Yayın takvimi kaydı')}</p></div></article>`).join('') || '<p class="muted">Yaklaşan yayın bulunmadı.</p>'}</div></section>
    </main>
    <aside class="v220RightRail fix4RightRail"><div class="profilePanel"><div class="avatar glowAvatar">${esc((state.session?.full_name || state.session?.email || 'H')[0]).toUpperCase()}</div><h3>${esc(state.session?.full_name || 'Hayatımız Oyun')}</h3><span class="pill green">Seviye 24</span><div class="xpLine"><span style="width:64%"></span></div><div class="rightStats"><div><b>${games.length}</b><span>Oyun</span></div><div><b>${sortedSeriesGroups(games).length}</b><span>Seri</span></div><div><b>${completed}</b><span>Tamamlanan</span></div><div><b>${watchedEpisodes}</b><span>İzlenen Bölüm</span></div></div><button class="miniBtn" data-page="Profilim">Profilime Git</button></div><div class="releasePanel"><h3>Takvim Özeti</h3>${events.map(ev=>`<p class="activityItem">📅 ${esc(ev.title)} • ${esc(formatDateTrFix6(ev.date))}</p>`).join('') || '<p class="muted">Henüz etkinlik yok.</p>'}</div></aside>
  </section>`;
};
seriesDirectoryPage = function(){
  const groups = sortedSeriesGroups(state.games.filter(g=>String(g.seriesName||'').trim() || Number(g.eps||0)>0));
  if(!groups.length) return `<section class="card wide"><h2>Seriler</h2><p class="muted">Henüz seri kaydı yok. Yönetim Paneli > Oyunlar bölümünden seri adı ve sıra numarası ekle.</p></section>`;
  return `<section class="seriesDirectoryFinal"><div class="seriesDirectoryHero"><span class="eyebrow">Profesyonel Seri Kategorileri</span><h1>Seriler</h1><p>Seriler artık geniş kapaklı satırlarda, oyunlar sıra numarasına göre ve kapakları bozulmadan listelenir.</p><span class="pill green">${groups.length} seri</span></div><div class="seriesRowsFinal">${groups.map(group=>{ const first=group.items[0] || {}; const totalEps=group.items.reduce((s,g)=>s+Number(g.eps||seriesEpisodes(g).length||0),0); const watched=group.items.reduce((s,g)=>s+Number(g.watchedEps||0),0); const percent=totalEps?Math.round(watched/totalEps*100):0; return `<article class="seriesRowFinal"><div class="seriesBannerFinal"><img src="${esc(eventCardCoverFix6(first))}" alt="${esc(group.name)}"><div><h2>${esc(group.name)}</h2><p>${esc(first.description || 'Bu serideki oyunları sırayla takip et ve site içinde izle.')}</p><div class="seriesMetaFinal"><span>${group.items.length} oyun</span><span>${watched}/${totalEps} bölüm</span><span>%${percent} tamamlandı</span></div><div class="progressLine"><span style="width:${percent}%"></span></div></div></div><div class="seriesGamesStrip">${group.items.slice(0,5).map((g,i)=>`<button class="seriesMiniGameFinal" data-watch-series="${esc(g.id)}"><img src="${esc(eventCardCoverFix6(g))}" alt="${esc(g.title)}"><b>${esc(g.title)}</b><small>Sıra ${esc(g.seriesOrder||i+1)} • ${esc(formatDateTrFix6(g.releaseDate) || '')}</small></button>`).join('')}${group.items.length>5?`<div class="seriesMoreFinal">+${group.items.length-5}<small>Daha fazla</small></div>`:''}</div><div class="seriesActionsFinal"><button class="btn primary" data-watch-series="${esc(first.id||'')}">Seriyi İzle</button>${isStaff()?'<button class="btn" data-admin="Seri İzleme">Serileri Yönet</button>':''}</div></article>`; }).join('')}</div></section>`;
};
calendarPage = function(){
  const events = getCalendarEventsFix6();
  const monthBase = events[0]?.date ? new Date(parseTrDateToIsoFix6(events[0].date)+'T12:00:00') : new Date();
  const now = new Date();
  const base = new Date(now.getFullYear(), now.getMonth(), 1);
  const rows = calendarGridDatesFix6(base);
  const monthKey = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const dayNames = ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'];
  const upcoming = events.filter(e=>parseTrDateToIsoFix6(e.date)>=monthKey(now)).slice(0,5);
  return `<section class="fix6CalendarShell fix6FinalCalendar"><div class="fix6CalendarMain card wide"><div class="fix6CalendarHead"><div><span class="calendarIcon">▣</span><div><h1>Yayın Takvimi</h1><p class="muted">Tarihler gün.ay.yıl biçiminde gösterilir ve yönetim panelinden düzenlenir.</p></div></div></div><div class="fix6CalendarToolbar"><div class="toolbarGroup"><button class="miniBtn">‹</button><button class="miniBtn primary">Bugün</button><button class="miniBtn">›</button></div><div class="monthChip">${monthNameTrFix6(base.getMonth())} ${base.getFullYear()}</div><div class="toolbarGroup"><button class="miniBtn primary">Ay</button><button class="miniBtn">Hafta</button><button class="miniBtn">Gün</button>${isStaff()?'<button class="miniBtn" data-admin="Yayın Takvimi">Takvimi Düzenle</button>':''}</div></div><div class="fix6CalendarGrid">${dayNames.map(d=>`<div class="dayHead">${d}</div>`).join('')}${rows.map(row=>row.map(d=>{ const iso=monthKey(d); const inMonth=d.getMonth()===base.getMonth(); const cell=events.filter(e=>parseTrDateToIsoFix6(e.date)===iso); const selected=iso===monthKey(now); return `<div class="dayCell ${inMonth?'':'mutedCell'} ${selected?'today':''}"><span class="dayNo">${d.getDate()}</span>${cell.slice(0,3).map(ev=>`<div class="calEvent ${eventToneFix6(ev.type)}"><small>${esc(ev.time||'20:00')}</small><b>${esc(ev.title)}</b></div>`).join('')}</div>`; }).join('')).join('')}</div><div class="fix6CalendarLegend"><span><i class="purple"></i>Ana Yayın</span><span><i class="pink"></i>Seri Devamı</span><span><i class="green"></i>Özel Etkinlik</span><span><i class="blue"></i>Topluluk Yayını</span><span><i class="yellow"></i>Etkinlik</span></div><div class="fix6CalendarSectionHead"><h3>Öne Çıkan Etkinlikler</h3><button class="miniBtn">Tüm Etkinlikler ›</button></div><div class="fix6EventCards">${upcoming.slice(0,4).map(ev=>`<article class="eventCard"><img src="${esc(ev.cover || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop')}" alt="${esc(ev.title)}"><div class="dateBadge">${formatDateTrFix6(ev.date).slice(0,5).replace('.','<br>')}</div><div class="eventInfo"><h4>${esc(ev.title)}</h4><p>${esc(ev.note || ev.type || 'Yayın takvimi')}</p><div class="eventMeta"><span>${esc(ev.time||'20:00')}</span><b>${esc(ev.type||'Yayın')}</b></div></div></article>`).join('')}</div></div><aside class="fix6CalendarAside"><section class="card"><div class="sectionHead"><h3>Yaklaşan Yayınlar</h3><button class="miniBtn">Tümünü Gör</button></div><div class="upcomingList">${upcoming.map(ev=>`<div class="upcomingItem"><img src="${esc(ev.cover || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop')}" alt="${esc(ev.title)}"><div><b>${esc(ev.title)}</b><small>${esc(ev.note || ev.type || '')}</small><span>${esc(formatDateTrFix6(ev.date))}, ${esc(ev.time||'20:00')}</span></div><strong>${esc(ev.type||'Yayın')}</strong></div>`).join('') || '<p class="muted">Yaklaşan yayın yok.</p>'}</div></section><section class="card"><h3>Bu Hafta</h3><div class="weekList">${upcoming.slice(0,7).map(ev=>`<div class="weekRow"><span>${esc(formatDateTrFix6(ev.date).slice(0,5))}</span><b>${esc(ev.time||'20:00')}</b><small>${esc(ev.title)}</small></div>`).join('') || '<p class="muted">Bu hafta kayıt yok.</p>'}</div></section></aside></section>`;
};
function calendarAdminPanelFix6(){
  const events = getCalendarEventsFix6();
  return `<section class="calendarAdminFinal"><div class="card wide"><div class="sectionHead"><div><span class="eyebrow">Yönetim Paneli</span><h2>Yayın Takvimi Düzenleme</h2><p class="muted">Tarihleri doğru tutmak için gün.ay.yıl biçiminde gösterilir; formda tarih seçince otomatik kaydedilir.</p></div><span class="pill green">${events.length} kayıt</span></div><form class="calendarEventForm" id="calendarEventForm"><label class="field">Başlık<input name="title" placeholder="Örn: A Plague Tale yeni bölüm" required></label><label class="field">Tarih<input name="date" type="date" required></label><label class="field">Saat<input name="time" type="time" value="20:00"></label><label class="field">Tür<select name="type"><option>Ana Yayın</option><option>Seri Devamı</option><option>Özel Etkinlik</option><option>Topluluk Yayını</option><option>Çıkış Tarihi</option></select></label><label class="field wideField">Kapak URL<input name="cover" placeholder="Kapak otomatik gelemezse buraya URL yaz"></label><label class="field wideField">Not<textarea name="note" rows="3" placeholder="Kısa açıklama"></textarea></label><div class="formActionBar noSticky"><button class="btn primary" data-action="save-calendar-event" type="button">Takvime Kaydet</button><button class="btn" data-page="Takvim" type="button">Takvimi Gör</button></div></form></div><section class="card wide"><h3>Kayıtlı Yayınlar</h3><div class="calendarAdminList">${events.map(ev=>`<article><img src="${esc(ev.cover || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop')}" alt="${esc(ev.title)}"><div><b>${esc(ev.title)}</b><small>${esc(formatDateTrFix6(ev.date))} • ${esc(ev.time || '20:00')} • ${esc(ev.type || 'Yayın')}</small><p>${esc(ev.note || '')}</p></div><button class="miniBtn danger" data-action="delete-calendar-event" data-calendar-id="${esc(ev.id)}">Sil</button></article>`).join('')}</div></section></section>`;
}
const oldAdminBodyFix6Final = adminBody;
adminBody = function(){
  if(state.adminPage === 'Yayın Takvimi') return calendarAdminPanelFix6();
  return oldAdminBodyFix6Final();
};
adminPanel = function(){
  if(!isStaff()) return `<section class="card"><h2>Yetki gerekiyor</h2><p>Yönetim paneli sadece kurucu, yönetici, moderatör ve editör hesaplarına görünür.</p></section>`;
  const pages = ['Genel Bakış','Oyunlar','Seri İzleme','Yayın Takvimi','Profil','Kullanıcı Yetkileri','Güncelleme Notları','Bakım Modu','API/ENV Durumu','Ayarlar'];
  if(!pages.includes(state.adminPage)){ state.adminPage = 'Genel Bakış'; try{ localStorage.setItem(ADMIN_TAB_KEY, state.adminPage); }catch{} }
  const publicShortcuts = [
    { label:'Ana Sayfa', page:'Ana Sayfa', icon:'⌂' }, { label:'Oyun Arşivi', page:'Oyun Arşivi', icon:'🎮' }, { label:'Seriler', page:'Seriler', icon:'◈' }, { label:'Yayın Takvimi', page:'Takvim', icon:'▣' }, { label:'Bildirimler', page:'Bildirimler', icon:'🔔' }, { label:'Profiller', page:'Profilim', icon:'👤' }
  ];
  const adminLinks = [
    { label:'Genel Bakış', page:'Genel Bakış', caption:'Panel durumu' }, { label:'Kullanıcılar', page:'Kullanıcı Yetkileri', caption:'Rol ve yetkiler' }, { label:'Oyunlar', page:'Oyunlar', caption:'Arşiv düzenleme' }, { label:'Seriler', page:'Seri İzleme', caption:'Sıra ve playlist' }, { label:'Yayın Takvimi', page:'Yayın Takvimi', caption:'Tarih ve yayın yönetimi' }, { label:'Yayınlar', page:'Yayın Takvimi', caption:'Takvim kayıtları' }, { label:'Yorumlar', page:'Güncelleme Notları', caption:'Not ve yorum alanı' }, { label:'Bildirimler', page:'Güncelleme Notları', caption:'Duyuru sistemi' }, { label:'Ayarlar', page:'Ayarlar', caption:'Site ayarları' }, { label:'Geri Bildirimler', page:'Güncelleme Notları', caption:'Geri dönüşler' }
  ];
  const headerActions = state.adminPage === 'Oyunlar' ? `<div class="rowActions"><button class="btn" data-action="toggle-game-form">+ Yeni Oyun Ekle</button><button class="btn primary" data-action="bulk-sync-playlists">Toplu İşlemler</button></div>` : state.adminPage === 'Yayın Takvimi' ? `<div class="rowActions"><button class="btn primary" data-admin="Yayın Takvimi">Takvim Düzenle</button><button class="btn" data-page="Takvim">Sitede Gör</button></div>` : `<span class="pill ${state.maintenance?.enabled?'banned':'green'}">${state.maintenance?.enabled?'Bakım açık':'Bakım kapalı'}</span>`;
  return `<section class="fix5AdminShell fix6FinalAdminShell"><aside class="fix5AdminSidebar"><div class="sideLogo"><span class="logoMark">🎮</span><div><b>Hayatımız Oyun</b><small>Oyun Arşivi & Seriler</small></div></div><div class="sideNavLabel">MENÜ</div>${publicShortcuts.map(item=>`<button class="sideNavItem ${state.page===item.page?'active':''}" data-page="${esc(item.page)}"><span>${item.icon}</span>${esc(item.label)}</button>`).join('')}<div class="sideNavLabel">YÖNETİM</div><div class="adminAccordion open"><button class="adminAccordionHead ${state.page==='Yönetim Paneli'?'active':''}" data-admin="${esc(state.adminPage || 'Genel Bakış')}"><span>👑</span><div><b>Yönetim Paneli</b><small>${esc(state.session?.full_name || 'Yetkili hesap')}</small></div><strong>⌄</strong></button><div class="adminAccordionBody">${adminLinks.map(link=>`<button class="adminSubLink ${state.adminPage===link.page?'active':''}" data-admin="${esc(link.page)}"><span class="subDot"></span><div><b>${esc(link.label)}</b><small>${esc(link.caption)}</small></div></button>`).join('')}</div></div><div class="sideFooter"><small>© 2024 Hayatımız Oyun<br>Tüm hakları saklıdır.</small></div></aside><div class="adminContent fix5AdminContent"><div class="fix5AdminHeader"><div><div class="adminBreadcrumb">Yönetim Paneli <span>›</span> ${esc(state.adminPage)}</div><h1>${state.adminPage==='Oyunlar'?'Yönetim Paneli':esc(state.adminPage)}</h1><p>${state.adminPage==='Oyunlar'?'Oyun ekleme, önizleme ve tablo görünümü referans tasarıma yaklaştırıldı.':adminSubtitle(state.adminPage)}</p></div>${headerActions}</div>${adminBody()}</div></section>`;
};
function adminGamesTableFix6Final(){
  const games = (Array.isArray(state.games) ? state.games : []).slice().sort((a,b)=>Number(b.score||0)-Number(a.score||0));
  return `<section class="card wide fix6AdminTableWrap"><div class="sectionHead"><div><h3>Mevcut Oyunlar</h3><p class="muted">Kapaklar normal oranla gösterilir; tarih gün.ay.yıl olarak listelenir.</p></div><span class="pill green">${games.length} Oyun</span></div><div class="fix6AdminTableTools"><label class="search toolSearch">🔎 <input value="${esc(state.query || '')}" placeholder="Oyun ara..."></label><div class="rowActions"><button class="miniBtn">Filtrele</button><button class="miniBtn">Sırala: En Yeni</button></div></div><div class="tableWrap"><table class="roleTable fix6GameTable"><thead><tr><th>#</th><th>Kapak</th><th>Oyun Adı</th><th>Seri</th><th>Etiketler</th><th>Çıkış Tarihi</th><th>Puan</th><th>İşlemler</th></tr></thead><tbody>${games.map((g,index)=>`<tr><td>${String(index+1).padStart(3,'0')}</td><td><img class="tableCover" src="${esc(eventCardCoverFix6(g))}" alt="${esc(g.title)}"></td><td><b>${esc(g.title)}</b></td><td>${esc(g.seriesName || '-')}</td><td>${tagChipsHtml(g.tags || g.genre)}</td><td>${esc(formatDateTrFix6(g.releaseDate) || '-')}</td><td><span class="pill green">${esc(String(g.score || '8.5'))}</span></td><td><div class="roleActions"><button class="miniBtn" data-game-edit="${esc(g.id)}">✎</button><button class="miniBtn" data-watch-series="${esc(g.id)}">▶</button><button class="miniBtn danger" data-game-delete="${esc(g.id)}">🗑</button></div></td></tr>`).join('') || '<tr><td colspan="8">Oyun bulunamadı.</td></tr>'}</tbody></table></div></section>`;
}
gameFormFields = function(d, mode='add'){
  const opts = ['Devam Ediyor','Tamamlandı','Popüler','Yakında'].map(st=>`<option ${d.status===st?'selected':''}>${st}</option>`).join('');
  const descPreview = (d.description || 'Bu oyun, site üzerinde aşağıdaki gibi görünecektir.').slice(0,240);
  const dateValue = formatDateTrFix6(d.releaseDate || '');
  return `<div class="fix6AdminGameComposer fix6FinalComposer"><div class="fix6AdminGameMain"><div class="fix6FormGridHeader"><div><h3>Oyun Bilgileri</h3><p class="muted">Oyun adını yaz, otomatik kapak/meta çek, çıkış tarihini gün.ay.yıl olarak kaydet.</p></div></div><div class="formGrid cleanGameFormGrid fix6FormGrid"><label class="field">Oyun Adı *<input name="title" required placeholder="Örn: Assassin's Creed Origins" value="${esc(d.title)}" /></label><label class="field">Seri Adı<input name="seriesName" placeholder="Örn: Assassin's Creed" value="${esc(d.seriesName || '')}" /></label><div class="field wideField"><span>Etiketler</span>${tagButtonsHtml(d.tags)}</div><label class="field wideField">Kapak Görseli<div class="fix6UploadRow"><div class="coverDropHint"><span>☁</span><b>Otomatik kapak veya manuel URL</b><small>Meta/Kapak Çek butonu RAWG üzerinden kapak ve çıkış tarihi doldurur.</small><button class="miniBtn" type="button" data-action="${mode==='edit'?'auto-game-meta-edit':'auto-game-meta'}">Kapakları Otomatik Çek</button></div><div class="coverPreview ${d.cover?'':'isEmpty'}">${d.cover?`<img src="${esc(d.cover)}" alt="Kapak önizleme">`:'Kapak çekilince burada önizleme görünür.'}</div></div><input name="cover" placeholder="https://..." value="${esc(d.cover)}" /></label><label class="field wideField storyField">Hikâye / Açıklama<textarea name="description" rows="7" placeholder="Hikâye Getir butonu oyun için temiz Türkçe özet oluşturur.">${esc(d.description || '')}</textarea></label><label class="field">Çıkış Tarihi <small>gün.ay.yıl</small><input name="releaseDate" placeholder="27.10.2017" value="${esc(dateValue)}" /></label><label class="field">Durum<select name="status">${opts}</select></label><label class="field">Kategori / Tür<input name="genre" required placeholder="Aksiyon, RPG" value="${esc(d.genre)}" /></label><label class="field">Puan<input name="score" type="number" min="0" max="10" step="0.1" value="${esc(String(d.score ?? 8.5))}" /></label><label class="field">Toplam Bölüm<input name="eps" type="number" min="0" value="${esc(String(d.eps ?? 0))}" /></label><label class="field">İzlenen Bölüm<input name="watchedEps" type="number" min="0" value="${esc(String(d.watchedEps ?? 0))}" /></label><label class="field">Seri Sıra No<input name="seriesOrder" type="number" min="0" value="${esc(String(d.seriesOrder ?? 0))}" /></label><label class="field wideField">YouTube Playlist<input name="playlistUrl" placeholder="https://youtube.com/playlist?list=..." value="${esc(d.playlistUrl || '')}" /></label><label class="field wideField">Tek Video URL<input name="videoUrl" placeholder="https://youtube.com/watch?v=..." value="${esc(d.videoUrl || '')}" /></label><label class="field wideField episodeImportField">Bölüm Listesi${episodeImportPreview(d.episodesText, d.episodes)}<textarea name="episodesText" rows="5" class="technicalEpisodes" placeholder="Teknik bölüm verisi otomatik oluşur">${esc(d.episodesText || episodesToText(d.episodes || []))}</textarea><button class="miniBtn" type="button" data-action="toggle-technical-episodes">Teknik Veriyi Göster / Gizle</button></label></div><div class="fix6FormBottomActions"><button class="btn" type="button" data-action="${mode==='edit'?'estimate-playlist-episodes-edit':'estimate-playlist-episodes'}">Playlist İçe Aktar</button><button class="btn" type="button" data-action="${mode==='edit'?'auto-game-meta-edit':'auto-game-meta'}">Meta + Kapakları Getir</button><button class="btn" type="button" data-action="${mode==='edit'?'fetch-game-story-edit':'fetch-game-story'}">Hikâye Getir</button><div class="rowActions"><button class="btn" type="button" data-action="${mode==='edit'?'close-game-edit':'toggle-game-form'}">İptal</button><button class="btn primary" type="submit">${mode==='edit'?'Oyunu Güncelle':'Oyunu Kaydet'}</button></div></div></div><aside class="fix6AdminGamePreview"><h3>Önizleme</h3><p class="muted">Bu oyun, site üzerinde aşağıdaki gibi görünecektir.</p><article class="fix6PreviewCard"><div class="fix6PreviewCover"><img src="${esc(d.cover || 'https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1000&auto=format&fit=crop')}" alt="${esc(d.title || 'Oyun')}" /><span class="scoreBadge fix4Score">${esc(String(d.score || '8.5'))}</span></div><div class="fix6PreviewBody"><h4>${esc(d.title || 'Oyun adı')}</h4>${tagChipsHtml(d.tags || d.genre)}<p>${esc(descPreview)}</p><div class="fix6MetaGrid"><div><small>Çıkış Tarihi</small><b>${esc(dateValue || '-')}</b></div><div><small>Geliştirici</small><b>RAWG / Manuel</b></div><div><small>Tür</small><b>${esc(d.genre || 'Genel')}</b></div><div><small>Platformlar</small><b>PC, PlayStation, Xbox</b></div></div></div></article></aside></div>`;
};
gameAddForm = function(){ const d = { ...DEFAULT_GAME_DRAFT, ...state.gameDraft }; return `<form class="card soft gameForm fix6GameForm" id="gameAddForm" autocomplete="off">${gameFormFields(d,'add')}</form>`; };
gameEditForm = function(){ const current = state.games.find(g=>String(g.id)===String(state.editingGameId)); if(!current) return ''; return `<form class="card soft gameForm editGameForm fix6GameForm" id="gameEditForm" autocomplete="off">${gameFormFields(current,'edit')}</form>`; };
gamesAdmin = function(){
  const buttons = `<button class="btn" data-action="toggle-game-form">+ Yeni Oyun Ekle</button><button class="btn primary" data-action="bulk-sync-playlists">Toplu İşlemler ▾</button>`;
  return `<section class="fix5AdminGamesPage"><div class="fix5AdminHeader"><div><div class="adminBreadcrumb">Yönetim Paneli <span>›</span> Oyunlar</div><h1>Yönetim Paneli</h1><p>Oyun ekleme, otomatik kapak, tarih biçimi ve önizleme ekranı profesyonel düzene çekildi.</p></div><div class="rowActions">${buttons}</div></div><div class="fix5AdminSectionStack">${state.showGameForm ? gameAddForm() : '<section class="card wide fix5CollapsedHint"><div><h3>Oyun formu kapalı</h3><p class="muted">Yeni Oyun Ekle ile detaylı formu tekrar açabilirsin.</p></div><button class="btn primary" data-action="toggle-game-form">Formu Aç</button></section>'}${state.editingGameId ? gameEditForm() : ''}${rawgCandidatePanel()}${coverSuggestionPanel()}${adminGamesTableFix6Final()}</div></section>`;
};
const oldOnActionFix6Final = onAction;
onAction = async function(e){
  const action = e.currentTarget?.dataset?.action || '';
  if(action === 'save-calendar-event'){
    e.preventDefault();
    const form = document.getElementById('calendarEventForm');
    if(!form) return;
    const fd = new FormData(form);
    const event = { id:`cal-${Date.now()}`, title:String(fd.get('title')||'').trim(), date:parseTrDateToIsoFix6(fd.get('date')), time:String(fd.get('time')||'20:00'), type:String(fd.get('type')||'Ana Yayın'), cover:String(fd.get('cover')||'').trim(), note:String(fd.get('note')||'').trim() };
    if(!event.title || !event.date){ setToast('Takvim için başlık ve tarih gerekli.'); return; }
    const events = getCalendarEventsFix6().filter(x=>!String(x.id).startsWith('demo-'));
    events.push(event); saveCalendarEventsFix6(events); form.reset(); render(); setToast('Yayın takvimi kaydı eklendi. Tarih sitede gün.ay.yıl görünecek.');
    try{ await api('calendar-events-upsert', { adminToken: state.session?.adminToken, event }); }catch{}
    return;
  }
  if(action === 'delete-calendar-event'){
    e.preventDefault(); const id = e.currentTarget.dataset.calendarId; const events = getCalendarEventsFix6().filter(ev=>String(ev.id)!==String(id)); saveCalendarEventsFix6(events); render(); setToast('Takvim kaydı silindi.'); try{ await api('calendar-events-delete', { adminToken: state.session?.adminToken, id }); }catch{} return;
  }
  return oldOnActionFix6Final(e);
};



/* v2.2.0 FIX 7 - alfabetik şeritler, kapaklı seri sıralama, gelişmiş takvim yönetimi */
const TR_ALPHABET_FIX7 = ['0-9','A','B','C','Ç','D','E','F','G','Ğ','H','I','İ','J','K','L','M','N','O','Ö','P','R','S','Ş','T','U','Ü','V','Y','Z'];
function initialFix7(value){
  const raw = String(value || '').trim();
  if(!raw) return '#';
  const first = raw[0].toLocaleUpperCase('tr-TR');
  if(/[0-9]/.test(first)) return '0-9';
  return TR_ALPHABET_FIX7.includes(first) ? first : '#';
}
function groupByInitialFix7(items, titleFn){
  const map = new Map();
  (items || []).forEach(item => {
    const letter = initialFix7(titleFn ? titleFn(item) : item?.title);
    if(!map.has(letter)) map.set(letter, []);
    map.get(letter).push(item);
  });
  return TR_ALPHABET_FIX7.concat('#').filter(letter => map.has(letter)).map(letter => ({ letter, items: map.get(letter) }));
}
function alphabetNavFix7(groups, label='Harfe git'){
  const active = new Set(groups.map(g=>g.letter));
  return `<section class="alphabetNavFix7"><div><b>${label}</b><small>${groups.length} harf grubu</small></div><div class="alphabetRailFix7">${TR_ALPHABET_FIX7.map(letter=>`<a class="${active.has(letter)?'active':'disabled'}" href="#${letter==='0-9'?'num':letter}">${letter}</a>`).join('')}</div></section>`;
}
function alphabetGameSectionsFix7(games){
  const groups = groupByInitialFix7(games, g=>g.title);
  if(!groups.length) return '<section class="card wide">Oyun bulunamadı.</section>';
  return `${alphabetNavFix7(groups, 'Harfe git')}<div class="alphabetSectionsFix7">${groups.map(group=>`<section class="letterSectionFix7" id="${group.letter==='0-9'?'num':esc(group.letter)}"><div class="letterHeadFix7"><div><span>${esc(group.letter)}</span><h2>${esc(group.letter)} Harfindeki Oyunlar</h2></div><b>${group.items.length} oyun</b></div><div class="letterGameGridFix7">${group.items.map(g=>gameCard(g,false)).join('')}</div></section>`).join('')}</div>`;
}
function alphabetSeriesSectionsFix7(groups){
  const grouped = groupByInitialFix7(groups, g=>g.name);
  if(!grouped.length) return '<section class="card wide">Seri bulunamadı.</section>';
  return `${alphabetNavFix7(grouped, 'Serilerde harfe git')}<div class="seriesAlphabetSectionsFix7">${grouped.map(letterGroup=>`<section class="letterSectionFix7" id="series-${letterGroup.letter==='0-9'?'num':esc(letterGroup.letter)}"><div class="letterHeadFix7"><div><span>${esc(letterGroup.letter)}</span><h2>${esc(letterGroup.letter)} Harfindeki Seriler</h2></div><b>${letterGroup.items.length} seri</b></div><div class="seriesRowsFinal fix7SeriesRows">${letterGroup.items.map(group=>seriesRowFix7(group)).join('')}</div></section>`).join('')}</div>`;
}
function seriesRowFix7(group){
  const first = group.items[0] || {};
  const totalEps = group.items.reduce((s,g)=>s+Number(g.eps||seriesEpisodes(g).length||0),0);
  const watched = group.items.reduce((s,g)=>s+Number(g.watchedEps||0),0);
  const percent = totalEps ? Math.round(watched/totalEps*100) : 0;
  return `<article class="seriesRowFinal fix7SeriesRow"><div class="seriesBannerFinal"><img src="${esc(eventCardCoverFix6(first))}" alt="${esc(group.name)}"><div><h2>${esc(group.name)}</h2><p>${esc(first.description || 'Bu seri alfabetik arşiv içinde kapaklı ve sıralı şekilde gösterilir.')}</p><div class="seriesMetaFinal"><span>${group.items.length} oyun</span><span>${watched}/${totalEps} bölüm</span><span>%${percent} tamamlandı</span></div><div class="progressLine"><span style="width:${percent}%"></span></div></div></div><div class="seriesGamesStrip">${group.items.slice(0,6).map((g,i)=>`<button class="seriesMiniGameFinal" data-watch-series="${esc(g.id)}"><img src="${esc(eventCardCoverFix6(g))}" alt="${esc(g.title)}"><b>${esc(g.title)}</b><small>Sıra ${esc(g.seriesOrder||i+1)} • ${esc(formatDateTrFix6(g.releaseDate) || '')}</small></button>`).join('')}</div><div class="seriesActionsFinal"><button class="btn primary" data-watch-series="${esc(first.id||'')}">Seriyi İzle</button>${isStaff()?'<button class="btn" data-admin="Seri İzleme">Serileri Yönet</button>':''}</div></article>`;
}
const oldGameArchiveDashboardFix7 = gameArchiveDashboard;
gameArchiveDashboard = function(){
  const games = Array.isArray(state.games) ? state.games : [];
  const alphabetShelf = `<section class="v220Shelf fix4Shelf fix7AlphabetHome"><div class="sectionHead"><div><h2>Alfabetik Oyun Arşivi</h2><p class="muted">Oyun Arşivi içindeki gibi harfe git şeridi ve harf grupları.</p></div><button class="miniBtn" data-page="Oyun Arşivi">Tam Arşiv</button></div>${alphabetNavFix7(groupByInitialFix7(games, g=>g.title), 'Ana sayfada harfe git')}<div class="miniLetterPreviewFix7">${groupByInitialFix7(games, g=>g.title).slice(0,3).map(group=>`<div><b>${esc(group.letter)} Harfi</b><span>${group.items.length} oyun</span></div>`).join('')}</div></section>`;
  return oldGameArchiveDashboardFix7().replace('</main>', `${alphabetShelf}</main>`);
};

gameGrid = function(){
  const games = sortedVisibleGames();
  const adminActions = isStaff() && state.page === 'Yönetim Paneli' && state.adminPage === 'Oyunlar';
  if(!games.length) return '<section class="games fix4ArchiveGrid"><div class="card wide">Oyun bulunamadı.</div></section>';
  if(adminActions) return `${seriesGroupPanel(games)}<div class="games fix4ArchiveGrid adminGrid">${games.map(g=>gameCard(g, true)).join('')}</div>`;
  const title = state.page === 'Favoriler' ? 'Favoriler' : state.page === 'Popüler' ? 'Popüler Oyunlar' : 'Oyun Arşivi';
  return `<section class="fix4ArchivePage fix7ArchivePage"><div class="fix4ArchiveHeader"><div><span class="eyebrow">Profesyonel Arşiv</span><h1>${esc(title)}</h1><p class="muted">Alfabetik şerit, harfe git ve harf başlığıyla oyunlar daha düzenli listelenir.</p></div><span class="pill green">${games.length} oyun</span></div>${advancedSearchPanel()}${alphabetGameSectionsFix7(games)}</section>`;
};

seriesDirectoryPage = function(){
  const groups = sortedSeriesGroups(state.games.filter(g=>String(g.seriesName||'').trim() || Number(g.eps||0)>0));
  if(!groups.length) return `<section class="card wide"><h2>Seriler</h2><p class="muted">Henüz seri kaydı yok.</p></section>`;
  return `<section class="seriesDirectoryFinal fix7SeriesDirectory"><div class="seriesDirectoryHero"><span class="eyebrow">Profesyonel Seri Kategorileri</span><h1>Seriler</h1><p>Seriler artık alfabetik şeritli, kapaklı ve sıra numarasına göre listelenir.</p><span class="pill green">${groups.length} seri</span></div>${alphabetSeriesSectionsFix7(groups)}</section>`;
};

adminSeriesWatchPanel = function(){
  const groups = sortedSeriesGroups(state.games.filter(g=>String(g.seriesName||'').trim() || Number(g.eps||0)>0));
  return `<section class="adminSeriesWatchFix7"><div class="card wide"><div class="sectionHead"><div><span class="eyebrow">Kapaklı Seri Sıralama</span><h2>Seri İzleme Yönetimi</h2><p class="muted">Seri sıralama artık kapaklı kartlarla düzenlenir. Sıra değerini değiştirip kalıcı kaydet.</p></div><button class="btn primary" data-action="save-series-orders">Seri Sırasını Kalıcı Kaydet</button></div></div><div class="adminSeriesGridFix7">${groups.map(group=>`<article class="adminSeriesCardFix7"><div class="adminSeriesCardHead"><img src="${esc(eventCardCoverFix6(group.items[0]||{}))}" alt="${esc(group.name)}"><div><h3>${esc(group.name)}</h3><p>${group.items.length} oyun • ${group.items.reduce((s,g)=>s+Number(g.eps||0),0)} bölüm</p></div></div><div class="adminSeriesOrderListFix7">${group.items.map((g,i)=>`<div><img src="${esc(eventCardCoverFix6(g))}" alt="${esc(g.title)}"><b>${esc(g.title)}</b><label>Sıra <input data-series-order-game="${esc(g.id)}" type="number" value="${esc(String(g.seriesOrder||i+1))}"></label><button class="miniBtn" data-game-edit="${esc(g.id)}">Düzenle</button></div>`).join('')}</div></article>`).join('') || '<div class="card">Seri bulunamadı.</div>'}</div></section>`;
};

calendarAdminPanelFix6 = function(){
  const events = getCalendarEventsFix6();
  const games = Array.isArray(state.games) ? state.games : [];
  const gameOptions = ['<option value="">Oyun seç</option>'].concat(games.map(g=>`<option value="${esc(g.id)}">${esc(g.title)}</option>`)).join('');
  return `<section class="calendarAdminFinal fix7CalendarAdmin"><div class="card wide"><div class="sectionHead"><div><span class="eyebrow">Yönetim Paneli</span><h2>Yayın Takvimi Düzenleme</h2><p class="muted">Oyun adı, bölüm numarası, tarih, saat ve kapak tek formda yönetilir. Oyun seçince kapak ve meta otomatik doldurulur.</p></div><span class="pill green">${events.length} kayıt</span></div><form class="calendarEventForm fix7CalendarEventForm" id="calendarEventForm"><label class="field">Oyun seç<select name="gameId">${gameOptions}</select></label><label class="field">Yayın Başlığı<input name="title" placeholder="Örn: A Plague Tale - 3. Bölüm" required></label><label class="field">Bölüm No<input name="episodeNumber" type="number" min="0" placeholder="1"></label><label class="field">Bölüm Başlığı<input name="episodeTitle" placeholder="Örn: Farelerin Gazabı"></label><label class="field">Tarih<input name="date" type="date" required></label><label class="field">Saat<input name="time" type="time" value="20:00"></label><label class="field">Tür<select name="type"><option>Ana Yayın</option><option>Seri Devamı</option><option>Yeni Bölüm</option><option>Özel Etkinlik</option><option>Topluluk Yayını</option><option>Çıkış Tarihi</option></select></label><label class="field wideField">Kapak URL<input name="cover" placeholder="Oyun seçince otomatik kapak gelir"></label><label class="field wideField">Not<textarea name="note" rows="3" placeholder="Kısa açıklama veya bölüm notu"></textarea></label><div class="formActionBar noSticky"><button class="btn" data-action="calendar-use-selected-game" type="button">Seçilen Oyundan Meta/Kapak Çek</button><button class="btn primary" data-action="save-calendar-event" type="button">Takvime Kaydet</button><button class="btn" data-page="Takvim" type="button">Takvimi Gör</button></div></form></div><section class="card wide"><h3>Kayıtlı Yayınlar</h3><div class="calendarAdminList fix7CalendarAdminList">${events.map(ev=>`<article><img src="${esc(ev.cover || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop')}" alt="${esc(ev.title)}"><div><b>${esc(ev.title)}</b><small>${esc(formatDateTrFix6(ev.date))} • ${esc(ev.time || '20:00')} • ${esc(ev.type || 'Yayın')}</small><p>${esc(ev.episodeTitle ? `${ev.episodeNumber || ''}. Bölüm - ${ev.episodeTitle}` : ev.note || '')}</p></div><button class="miniBtn danger" data-action="delete-calendar-event" data-calendar-id="${esc(ev.id)}">Sil</button></article>`).join('')}</div></section></section>`;
};

const oldGetCalendarEventsFix7 = getCalendarEventsFix6;
getCalendarEventsFix6 = function(){
  return oldGetCalendarEventsFix7().map(ev=>({ ...ev, gameId:ev.gameId || ev.game_id || '', episodeNumber:ev.episodeNumber || ev.episode_number || '', episodeTitle:ev.episodeTitle || ev.episode_title || '' }));
};
const oldLoadRuntimeFix7 = loadRuntime;
loadRuntime = async function(){
  await oldLoadRuntimeFix7();
  try{ const data = await api('calendar-events-list', {}); if(Array.isArray(data.events) && data.events.length){ saveCalendarEventsFix6(data.events); } }catch(e){}
  render();
};
const oldOnActionFix7 = onAction;
onAction = async function(e){
  const action = e.currentTarget?.dataset?.action || '';
  if(action === 'calendar-use-selected-game'){
    e.preventDefault();
    const form = document.getElementById('calendarEventForm'); if(!form) return;
    const g = state.games.find(x=>String(x.id)===String(form.elements.gameId?.value));
    if(!g) return setToast('Önce oyun seç.');
    form.elements.title.value = g.title;
    form.elements.cover.value = eventCardCoverFix6(g);
    form.elements.note.value = g.description || g.genre || '';
    if(form.elements.type) form.elements.type.value = Number(g.eps||0)>0 ? 'Yeni Bölüm' : 'Oyun Yayını';
    setToast('Oyun adı, kapak ve meta takvim formuna çekildi.');
    return;
  }
  if(action === 'save-calendar-event'){
    e.preventDefault();
    const form = document.getElementById('calendarEventForm'); if(!form) return;
    const fd = new FormData(form);
    const g = state.games.find(x=>String(x.id)===String(fd.get('gameId')||''));
    const epNo = String(fd.get('episodeNumber')||'').trim();
    const epTitle = String(fd.get('episodeTitle')||'').trim();
    const title = String(fd.get('title')||'').trim() || (g ? g.title : 'Yeni Yayın');
    const event = { id:`cal-${Date.now()}`, title, gameId:String(fd.get('gameId')||''), gameTitle:g?.title || title, episodeNumber:epNo, episodeTitle:epTitle, date:parseTrDateToIsoFix6(fd.get('date')), time:String(fd.get('time')||'20:00'), type:String(fd.get('type')||'Ana Yayın'), cover:String(fd.get('cover')||'').trim() || (g?eventCardCoverFix6(g):''), note:String(fd.get('note')||'').trim() };
    if(!event.title || !event.date){ setToast('Takvim için başlık ve tarih gerekli.'); return; }
    const events = getCalendarEventsFix6().filter(x=>!String(x.id).startsWith('demo-'));
    events.push(event); saveCalendarEventsFix6(events); form.reset(); render(); setToast('Yayın takvimi kaydı eklendi.');
    try{ await api('calendar-events-upsert', { adminToken: state.session?.adminToken, event }); }catch{}
    return;
  }
  return oldOnActionFix7(e);
};

try{ render(); loadRuntime(); }catch(error){ showBootError(error); }


let v218KeyboardBound = false;
function bindV218Keyboard(){
  if(v218KeyboardBound) return;
  v218KeyboardBound = true;
  window.addEventListener('keydown', (e)=>{
    if(!state.watchingGameId || ['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)) return;
    const g = state.games.find(x=>String(x.id)===String(state.watchingGameId));
    const total = seriesEpisodes(g || {}).length;
    if(e.key === 'ArrowRight'){ state.selectedEpisodeIndex = Math.min(total-1, Number(state.selectedEpisodeIndex||0)+1); render(); }
    if(e.key === 'ArrowLeft'){ state.selectedEpisodeIndex = Math.max(0, Number(state.selectedEpisodeIndex||0)-1); render(); }
    if(e.key === ' '){ e.preventDefault(); toggleEpisodeWatchedIndex(Number(state.selectedEpisodeIndex||0)); }
    if(String(e.key).toLowerCase() === 'f'){ state.cinemaFullscreen = !state.cinemaFullscreen; localStorage.setItem('hayatimiz_cinema_fullscreen_v219', state.cinemaFullscreen ? '1' : '0'); render(); }
  });
}
bindV218Keyboard();

/* v2.2.0 FIX 8 - profesyonel panel, taşmayan arşiv, istek/hata sistemi */
const FIX8_REQUESTS_KEY = 'hayatimiz_game_requests_fix8';
let submitBugReportFix8;
const FIX8_BUGS_KEY = 'hayatimiz_bug_reports_fix8';
const FIX8_GAME_TAB_KEY = 'hayatimiz_admin_game_tab_fix8';
const FIX8_SERIES_PICK_KEY = 'hayatimiz_admin_series_pick_fix8';

function fix8LocalList(key){ return safeParse(localStorage.getItem(key), []); }
function fix8SaveLocal(key, value){ localStorage.setItem(key, JSON.stringify(value || [])); }
function fix8TodayIso(){ return new Date().toISOString().slice(0,10); }
function fix8GameAdminTab(){ return localStorage.getItem(FIX8_GAME_TAB_KEY) || 'add'; }
function fix8SetGameAdminTab(tab){ localStorage.setItem(FIX8_GAME_TAB_KEY, tab); }
function fix8ContinueGames(){ return (Array.isArray(state.games)?state.games:[]).filter(g => g.status === 'Devam Ediyor' || (Number(g.eps||0)>0 && progressPercent(g) < 100)); }
function fix8InferGenre(title=''){
  const t = normalizeSearchText(title);
  if(t.includes('assassin') || t.includes('metal gear') || t.includes('hitman')) return 'Aksiyon-macera, gizlilik';
  if(t.includes('resident') || t.includes('silent') || t.includes('outlast') || t.includes('alan wake')) return 'Korku, hayatta kalma, aksiyon-macera';
  if(t.includes('witcher') || t.includes('mass effect') || t.includes('baldur') || t.includes('dragon age')) return 'Rol yapma, hikaye odaklı, macera';
  if(t.includes('plague')) return 'Macera, gizlilik, hikaye odaklı';
  if(t.includes('god of war') || t.includes('sekiro') || t.includes('elden')) return 'Aksiyon, macera, soulslike';
  if(t.includes('cyberpunk')) return 'Aksiyon-RPG, açık dünya, bilim kurgu';
  return 'Aksiyon-macera, hikaye odaklı, tek oyunculu';
}
function fix8FormToObject(form){ return Object.fromEntries(new FormData(form).entries()); }
function fix8RequestStatusPill(status='Yeni'){ return `<span class="pill ${status==='Tamamlandı'?'green':status==='Reddedildi'?'banned':''}">${esc(status)}</span>`; }

sideNavItems = function(){ return [
  {label:'Ana Sayfa', page:'Ana Sayfa', icon:'⌂'},
  {label:'Oyun Arşivi', page:'Oyun Arşivi', icon:'🎮'},
  {label:'Seriler', page:'Seriler', icon:'◈'},
  {label:'Yayın Takvimi', page:'Takvim', icon:'▣'},
  {label:'Favoriler', page:'Favoriler', icon:'♡'},
  {label:'Oyun İstekleri', page:'Oyun İstekleri', icon:'💡'},
  {label:'Hata Bildir', page:'Hata Bildir', icon:'🐞'},
  {label:'Bildirimler', page:'Bildirimler', icon:'🔔'},
  {label:'Profilim', page:'Profilim', icon:'👤'}
]; };

const oldPublicPageFix8 = publicPage;
publicPage = function(){
  if(state.maintenance?.enabled && !isStaff()) return maintenancePage();
  if(!state.session) return authLanding();
  if(state.page === 'Oyun İstekleri') return withArchiveLayout(gameRequestPageFix8());
  if(state.page === 'Hata Bildir') return withArchiveLayout(bugReportPageFix8());
  return oldPublicPageFix8();
};

function gameRequestPageFix8(){
  const mine = fix8LocalList(FIX8_REQUESTS_KEY).filter(r=>!state.session?.email || r.email===state.session.email).slice(0,8);
  return `<section class="fix8FeedbackPage"><div class="fix8FeedbackHero"><span class="eyebrow">Topluluk İstek Merkezi</span><h1>Oyun İstekleri</h1><p>İstediğin oyunu, seri bilgisini ve neden eklenmesini istediğini yaz. Yetkililer yönetim panelinde kapaklı liste olarak görebilir.</p></div><div class="fix8FeedbackLayout"><form id="gameRequestForm" class="card fix8FeedbackForm"><h2>Yeni Oyun İste</h2><label class="field">Oyun adı<input name="gameTitle" placeholder="Örn: Metro Exodus" required></label><label class="field">Seri adı<input name="seriesName" placeholder="Varsa seri adı"></label><label class="field">Neden eklenmeli?<textarea name="note" rows="5" placeholder="Kısa açıklama yaz..."></textarea></label><button class="btn primary" type="submit">İsteği Gönder</button></form><section class="card"><h2>Son İsteklerin</h2><div class="fix8FeedbackList">${mine.map(r=>`<article><b>${esc(r.gameTitle)}</b><small>${esc(r.seriesName||'Seri yok')} • ${esc(r.createdAt||'')}</small>${fix8RequestStatusPill(r.status)}</article>`).join('') || '<p class="muted">Henüz oyun isteğin yok.</p>'}</div></section></div></section>`;
}
function bugReportPageFix8(){
  const mine = fix8LocalList(FIX8_BUGS_KEY).filter(r=>!state.session?.email || r.email===state.session.email).slice(0,8);
  return `<section class="fix8FeedbackPage"><div class="fix8FeedbackHero bug"><span class="eyebrow">Hata Bildirim Merkezi</span><h1>Hata Bildir</h1><p>Sitede gördüğün hatayı, hangi sayfada olduğunu ve mümkünse ekran görüntüsü/link bilgisini yaz. Yetkililer yönetim panelinden takip eder.</p></div><div class="fix8FeedbackLayout"><form id="bugReportForm" class="card fix8FeedbackForm"><h2>Yeni Hata Bildir</h2><label class="field">Hata başlığı<input name="title" placeholder="Örn: Seriyi İzle 1. bölümü açıyor" required></label><label class="field">Sayfa / kategori<input name="page" placeholder="Örn: Seriler / Yönetim Paneli"></label><label class="field">Detay<textarea name="description" rows="5" placeholder="Hatanın detayını yaz..." required></textarea></label><button class="btn primary" type="submit">Hatayı Gönder</button></form><section class="card"><h2>Son Bildirimlerin</h2><div class="fix8FeedbackList">${mine.map(r=>`<article><b>${esc(r.title)}</b><small>${esc(r.page||'Sayfa yok')} • ${esc(r.createdAt||'')}</small>${fix8RequestStatusPill(r.status)}</article>`).join('') || '<p class="muted">Henüz hata bildirimin yok.</p>'}</div></section></div></section>`;
}

function adminGameRequestsPageFix8(){
  const list = fix8LocalList(FIX8_REQUESTS_KEY);
  return `<section class="card wide fix8AdminFeedback"><div class="sectionHead"><div><span class="eyebrow">Yetkili Takip Merkezi</span><h2>Oyun İstekleri</h2><p class="muted">Kullanıcıların istediği oyunlar burada görünür. Supabase bağlıysa yeni istekler tabloya da yazılır.</p></div><span class="pill green">${list.length} istek</span></div><div class="fix8RequestGrid">${list.map(r=>`<article><div><b>${esc(r.gameTitle)}</b><small>${esc(r.seriesName||'Seri yok')} • ${esc(r.email||'Anonim')}</small><p>${esc(r.note||'Not yok')}</p></div>${fix8RequestStatusPill(r.status)}</article>`).join('') || '<p class="muted">Henüz oyun isteği yok.</p>'}</div></section>`;
}
function adminBugReportsPageFix8(){
  const list = fix8LocalList(FIX8_BUGS_KEY);
  return `<section class="card wide fix8AdminFeedback"><div class="sectionHead"><div><span class="eyebrow">Yetkili Takip Merkezi</span><h2>Hata Bildirimleri</h2><p class="muted">Kullanıcıların bildirdiği hatalar burada görünür. Kritik hatalar için sayfa bilgisini kontrol et.</p></div><span class="pill banned">${list.length} hata</span></div><div class="fix8RequestGrid bug">${list.map(r=>`<article><div><b>${esc(r.title)}</b><small>${esc(r.page||'Sayfa yok')} • ${esc(r.email||'Anonim')}</small><p>${esc(r.description||'Detay yok')}</p></div>${fix8RequestStatusPill(r.status)}</article>`).join('') || '<p class="muted">Henüz hata bildirimi yok.</p>'}</div></section>`;
}

adminBody = function(){
  if(state.adminPage === 'Kullanıcı Yetkileri') return usersPanel();
  if(state.adminPage === 'Özellik Planı') return featurePlan();
  if(state.adminPage === 'Uygulama Merkezi') return applicationCenter();
  if(state.adminPage === 'Bakım Modu') return maintenanceAdmin();
  if(state.adminPage === 'Güncelleme Notları') return updateNotes();
  if(state.adminPage === 'Profil') return profilePage();
  if(state.adminPage === 'Oyunlar') return gamesAdmin();
  if(state.adminPage === 'Seri İzleme') return adminSeriesWatchPanel();
  if(state.adminPage === 'Yayın Takvimi') return calendarAdminPanelFix6();
  if(state.adminPage === 'Oyun İstekleri') return adminGameRequestsPageFix8();
  if(state.adminPage === 'Hata Bildirimleri') return adminBugReportsPageFix8();
  if(state.adminPage === 'API/ENV Durumu') return apiStatus();
  if(state.adminPage === 'Ayarlar') return settingsPanel();
  return overviewAdmin();
};

adminPanel = function(){
  if(!isStaff()) return `<section class="card"><h2>Yetki gerekiyor</h2><p>Yönetim paneli sadece yetkili hesaplara görünür.</p></section>`;
  const pages = ['Genel Bakış','Oyunlar','Seri İzleme','Yayın Takvimi','Oyun İstekleri','Hata Bildirimleri','Profil','Kullanıcı Yetkileri','Güncelleme Notları','Bakım Modu','API/ENV Durumu','Ayarlar'];
  if(!pages.includes(state.adminPage)) state.adminPage = 'Genel Bakış';
  const publicShortcuts = [
    { label:'Ana Sayfa', page:'Ana Sayfa', icon:'⌂' }, { label:'Oyun Arşivi', page:'Oyun Arşivi', icon:'🎮' }, { label:'Seriler', page:'Seriler', icon:'◈' }, { label:'Yayın Takvimi', page:'Takvim', icon:'▣' }, { label:'Oyun İstekleri', page:'Oyun İstekleri', icon:'💡' }, { label:'Hata Bildir', page:'Hata Bildir', icon:'🐞' }
  ];
  const adminLinks = [
    { label:'Genel Bakış', page:'Genel Bakış', caption:'Panel durumu' },
    { label:'Oyun Ekle / Mevcut Oyunlar', page:'Oyunlar', caption:'Ayrı sekmeli arşiv yönetimi' },
    { label:'Seri Sıralama', page:'Seri İzleme', caption:'Arama + seri seç + sıra' },
    { label:'Yayın Takvimi', page:'Yayın Takvimi', caption:'Devam eden oyun yayınları' },
    { label:'Oyun İstekleri', page:'Oyun İstekleri', caption:'Kullanıcı istekleri' },
    { label:'Hata Bildirimleri', page:'Hata Bildirimleri', caption:'Kullanıcı hata raporları' },
    { label:'Güncelleme Notları', page:'Güncelleme Notları', caption:'Sürüm notları geri geldi' },
    { label:'Bakım Modu', page:'Bakım Modu', caption:'Aç / kapat ve mesaj' },
    { label:'Kullanıcılar', page:'Kullanıcı Yetkileri', caption:'Rol ve yetkiler' },
    { label:'API / ENV', page:'API/ENV Durumu', caption:'Bağlantı durumu' },
    { label:'Ayarlar', page:'Ayarlar', caption:'Site ayarları' }
  ];
  const headerActions = state.adminPage === 'Oyunlar'
    ? `<div class="rowActions"><button class="btn ${fix8GameAdminTab()==='add'?'primary':''}" data-action="game-admin-tab" data-tab="add">Oyun Ekle</button><button class="btn ${fix8GameAdminTab()==='list'?'primary':''}" data-action="game-admin-tab" data-tab="list">Mevcut Oyunlar</button></div>`
    : state.adminPage === 'Bakım Modu'
      ? `<button class="btn ${state.maintenance?.enabled?'danger':'primary'}" data-action="toggle-maintenance">${state.maintenance?.enabled?'Bakımı Kapat':'Bakımı Aç'}</button>`
      : `<span class="pill ${state.maintenance?.enabled?'banned':'green'}">${state.maintenance?.enabled?'Bakım açık':'Bakım kapalı'}</span>`;
  return `<section class="fix5AdminShell fix8AdminShell"><aside class="fix5AdminSidebar"><div class="sideLogo"><span class="logoMark">🎮</span><div><b>Hayatımız Oyun</b><small>Yönetim Merkezi</small></div></div><div class="sideNavLabel">MENÜ</div>${publicShortcuts.map(item=>`<button class="sideNavItem" data-page="${esc(item.page)}"><span>${item.icon}</span>${esc(item.label)}</button>`).join('')}<div class="sideNavLabel">YÖNETİM</div><div class="adminAccordion open"><button class="adminAccordionHead active" data-admin="${esc(state.adminPage)}"><span>👑</span><div><b>Yönetim Paneli</b><small>${esc(state.session?.full_name || 'Yetkili hesap')}</small></div><strong>⌄</strong></button><div class="adminAccordionBody">${adminLinks.map(link=>`<button class="adminSubLink ${state.adminPage===link.page?'active':''}" data-admin="${esc(link.page)}"><span class="subDot"></span><div><b>${esc(link.label)}</b><small>${esc(link.caption)}</small></div></button>`).join('')}</div></div></aside><div class="adminContent fix5AdminContent"><div class="fix5AdminHeader"><div><div class="adminBreadcrumb">Yönetim Paneli <span>›</span> ${esc(state.adminPage)}</div><h1>${esc(state.adminPage)}</h1><p>${adminSubtitle(state.adminPage)}</p></div>${headerActions}</div>${adminBody()}</div></section>`;
};

function gameStatusQuickButtonsFix8(current='Devam Ediyor'){
  const list = [
    ['Tamamlandı','Tamamlanan Seriler'],
    ['Devam Ediyor','Devam Eden Seriler'],
    ['Yakında','Yakında Gelecek Seriler']
  ];
  return `<div class="fix8StatusButtons">${list.map(([value,label])=>`<button type="button" class="tagBtn ${current===value?'active':''}" data-status-pick="${esc(value)}">${esc(label)}</button>`).join('')}</div>`;
}

gameFormFields = function(d, mode='add'){
  const opts = ['Devam Ediyor','Tamamlandı','Popüler','Yakında'].map(st=>`<option ${d.status===st?'selected':''}>${st}</option>`).join('');
  const dateValue = formatDateTrFix6(d.releaseDate || '');
  const descPreview = (d.description || 'Bu oyun, site üzerinde kapaklı ve açıklamalı şekilde görünecektir.').slice(0,260);
  return `<div class="fix8GameComposer"><section class="fix8GameFormMain"><div class="sectionHead"><div><h2>Oyun Bilgileri</h2><p class="muted">Kısa, iki kolonlu ve göze hoş form. Kapak önizleme sağda sabit durur.</p></div><span class="pill green">FIX 8</span></div>${gameStatusQuickButtonsFix8(d.status)}<div class="fix8FormGrid"><label class="field">Oyun Adı *<input name="title" required placeholder="Örn: Assassin's Creed Origins" value="${esc(d.title)}" /></label><label class="field">Seri Adı<input name="seriesName" placeholder="Örn: Assassin's Creed" value="${esc(d.seriesName||'')}" /></label><label class="field">Çıkış Tarihi <small>gün.ay.yıl</small><input name="releaseDate" placeholder="27.10.2017" value="${esc(dateValue)}" /></label><label class="field">Durum<select name="status">${opts}</select></label><label class="field">Kategori / Tür<div class="inlineField"><input name="genre" required placeholder="Aksiyon-macera, gizlilik" value="${esc(d.genre)}" /><button class="miniBtn" type="button" data-action="suggest-tr-genres">Türleri Türkçe Öner</button></div></label><label class="field">Puan<input name="score" type="number" min="0" max="10" step="0.1" value="${esc(String(d.score ?? 8.5))}" /></label><label class="field">Toplam Bölüm<input name="eps" type="number" min="0" value="${esc(String(d.eps ?? 0))}" /></label><label class="field">İzlenen Bölüm<input name="watchedEps" type="number" min="0" value="${esc(String(d.watchedEps ?? 0))}" /></label><label class="field">Seri Sıra No<input name="seriesOrder" type="number" min="0" value="${esc(String(d.seriesOrder ?? 0))}" /></label><label class="field">Tek Video URL<input name="videoUrl" placeholder="https://youtube.com/watch?v=..." value="${esc(d.videoUrl || '')}" /></label><label class="field wideField">Etiketler${tagButtonsHtml(d.tags)}</label><label class="field wideField">YouTube Playlist<input name="playlistUrl" placeholder="https://youtube.com/playlist?list=..." value="${esc(d.playlistUrl || '')}" /></label><label class="field wideField">Kapak URL<div class="inlineField"><input name="cover" placeholder="https://..." value="${esc(d.cover)}" /><button class="miniBtn" type="button" data-action="${mode==='edit'?'auto-game-meta-edit':'auto-game-meta'}">Otomatik Kapak Çek</button></div></label><label class="field wideField storyField">Hikâye / Açıklama<textarea name="description" rows="4" placeholder="Hikâye Getir ile temiz Türkçe hikaye oluştur.">${esc(d.description || '')}</textarea></label><label class="field wideField episodeImportField">Bölüm Listesi${episodeImportPreview(d.episodesText, d.episodes)}<textarea name="episodesText" rows="4" class="technicalEpisodes" placeholder="Teknik bölüm verisi otomatik oluşur">${esc(d.episodesText || episodesToText(d.episodes || []))}</textarea><button class="miniBtn" type="button" data-action="toggle-technical-episodes">Teknik Veriyi Göster / Gizle</button></label></div><div class="fix8FormActions"><button class="btn" type="button" data-action="${mode==='edit'?'estimate-playlist-episodes-edit':'estimate-playlist-episodes'}">Playlist Bölümlerini Çek</button><button class="btn" type="button" data-action="${mode==='edit'?'auto-game-meta-edit':'auto-game-meta'}">Meta + Kapakları Getir</button><button class="btn" type="button" data-action="${mode==='edit'?'fetch-game-story-edit':'fetch-game-story'}">Hikâye Getir</button><button class="btn primary" type="submit">${mode==='edit'?'Oyunu Güncelle':'Oyunu Kaydet'}</button></div></section><aside class="fix8PreviewSide"><h3>Kapak Önizleme</h3><div class="fix8CoverPreview"><img src="${esc(d.cover || 'https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1000&auto=format&fit=crop')}" alt="${esc(d.title||'Oyun')}" /></div><article class="fix8PreviewCard"><span class="scoreBadge fix4Score">${esc(String(d.score || '8.5'))}</span><h2>${esc(d.title || 'Oyun adı')}</h2>${tagChipsHtml(d.tags || d.genre)}<p>${esc(descPreview)}</p><div class="fix6MetaGrid"><div><small>Çıkış Tarihi</small><b>${esc(dateValue || '-')}</b></div><div><small>Tür</small><b>${esc(d.genre || 'Genel')}</b></div><div><small>Durum</small><b>${esc(d.status || 'Devam Ediyor')}</b></div><div><small>Bölüm</small><b>${esc(String(d.watchedEps||0))}/${esc(String(d.eps||0))}</b></div></div></article></aside></div>`;
};

gameAddForm = function(){ const d = { ...DEFAULT_GAME_DRAFT, ...state.gameDraft }; return `<form class="card soft gameForm fix8GameForm" id="gameAddForm" autocomplete="off">${gameFormFields(d,'add')}</form>`; };
gameEditForm = function(){ const current = state.games.find(g=>String(g.id)===String(state.editingGameId)); if(!current) return ''; return `<form class="card soft gameForm editGameForm fix8GameForm" id="gameEditForm" autocomplete="off">${gameFormFields(current,'edit')}</form>`; };

function adminGamesTableFix8(){
  const games = sortedVisibleGames();
  return `<section class="card wide fix8AdminGamesList"><div class="sectionHead"><div><h2>Mevcut Oyunlar</h2><p class="muted">Oyun ekleme formundan ayrı, düzenli tablo/kart listesi.</p></div><span class="pill green">${games.length} oyun</span></div>${advancedSearchPanel()}<div class="fix8GameAdminCards">${games.map(g=>`<article><img src="${esc(eventCardCoverFix6(g))}" alt="${esc(g.title)}"><div><b>${esc(g.title)}</b><small>${esc(g.seriesName||'Seri yok')} • ${esc(g.status||'')}</small><p>${esc((g.description||g.genre||'').slice(0,130))}</p><div class="progressLine"><span style="width:${progressPercent(g)}%"></span></div></div><div class="rowActions"><button class="miniBtn" data-game-edit="${esc(g.id)}">Düzenle</button><button class="miniBtn" data-watch-series="${esc(g.id)}">İzle</button><button class="miniBtn danger" data-game-delete="${esc(g.id)}">Sil</button></div></article>`).join('') || '<p class="muted">Oyun bulunamadı.</p>'}</div></section>`;
}

gamesAdmin = function(){
  const tab = fix8GameAdminTab();
  return `<section class="fix8GamesAdmin"><div class="fix8AdminTabs"><button class="btn ${tab==='add'?'primary':''}" data-action="game-admin-tab" data-tab="add">Oyun Ekle</button><button class="btn ${tab==='list'?'primary':''}" data-action="game-admin-tab" data-tab="list">Mevcut Oyunlar</button><button class="btn" data-action="auto-cover-fetch">Kapaksızlara Kapak Öner</button></div>${tab==='add' ? `${gameAddForm()}${state.editingGameId ? gameEditForm() : ''}${rawgCandidatePanel()}${coverSuggestionPanel()}` : adminGamesTableFix8()}</section>`;
};

adminSeriesWatchPanel = function(){
  const groups = sortedSeriesGroups(state.games.filter(g=>String(g.seriesName||'').trim() || Number(g.eps||0)>0));
  const q = normalizeSearchText(localStorage.getItem('hayatimiz_series_admin_query_fix8') || '');
  const filtered = q ? groups.filter(g=>normalizeSearchText(g.name).includes(q) || g.items.some(item=>normalizeSearchText(item.title).includes(q))) : groups;
  const selectedName = localStorage.getItem(FIX8_SERIES_PICK_KEY) || filtered[0]?.name || '';
  const active = filtered.find(g=>g.name===selectedName) || filtered[0] || { name:'Seri seçilmedi', items:[] };
  return `<section class="fix8SeriesAdmin"><div class="card wide"><div class="sectionHead"><div><span class="eyebrow">Seri Sıralama Merkezi</span><h2>Seriyi Seç ve İçinde Sırala</h2><p class="muted">Önce seriyi butondan seç, sonra içindeki oyunların sıra numarasını değiştir ve kalıcı kaydet.</p></div><button class="btn primary" data-action="save-series-orders">Seri Sırasını Kalıcı Kaydet</button></div><label class="search fix8SeriesSearch">🔎 <input id="seriesAdminSearchFix8" value="${esc(localStorage.getItem('hayatimiz_series_admin_query_fix8') || '')}" placeholder="Seri veya oyun ara..."></label><div class="fix8SeriesPickRail">${filtered.map(group=>`<button class="tagBtn ${group.name===active.name?'active':''}" data-action="series-admin-pick" data-series="${esc(group.name)}"><img src="${esc(eventCardCoverFix6(group.items[0]||{}))}" alt="">${esc(group.name)} <small>${group.items.length}</small></button>`).join('') || '<p class="muted">Seri bulunamadı.</p>'}</div></div><div class="card wide"><div class="sectionHead"><div><h3>${esc(active.name)}</h3><p class="muted">Seçilen seri içindeki oyunlar kapaklı olarak sıralanır.</p></div><span class="pill green">${active.items.length} oyun</span></div><div class="fix8SeriesOrderList">${active.items.map((g,i)=>`<article><img src="${esc(eventCardCoverFix6(g))}" alt="${esc(g.title)}"><div><b>${esc(g.title)}</b><small>${esc(g.releaseDate||'Tarih yok')} • ${esc(g.status||'')}</small><div class="progressLine"><span style="width:${progressPercent(g)}%"></span></div></div><label>Sıra<input data-series-order-game="${esc(g.id)}" type="number" value="${esc(String(g.seriesOrder||i+1))}"></label><button class="miniBtn" data-game-edit="${esc(g.id)}">Düzenle</button></article>`).join('') || '<p class="muted">Bu seride oyun yok.</p>'}</div></div></section>`;
};

calendarAdminPanelFix6 = function(){
  const events = getCalendarEventsFix6();
  const games = fix8ContinueGames();
  const editing = state.editingCalendarEventId ? events.find(e=>String(e.id)===String(state.editingCalendarEventId)) : null;
  const gameOptions = ['<option value="">Devam eden oyun seç</option>'].concat(games.map(g=>`<option value="${esc(g.id)}" ${String(editing?.gameId||'')===String(g.id)?'selected':''}>${esc(g.title)}</option>`)).join('');
  return `<section class="calendarAdminFinal fix8CalendarAdmin"><div class="card wide"><div class="sectionHead"><div><span class="eyebrow">Devam Eden Oyun Yayın Takvimi</span><h2>Yayın Takvimi Düzenleme</h2><p class="muted">Sadece devam eden oyunlar listelenir. Her kayıt düzenlenebilir veya silinebilir.</p></div><span class="pill green">${events.length} kayıt</span></div><form class="calendarEventForm fix8CalendarForm" id="calendarEventForm"><input type="hidden" name="id" value="${esc(editing?.id||'')}"><label class="field">Devam Eden Oyun<select name="gameId">${gameOptions}</select></label><label class="field">Yayın Başlığı<input name="title" placeholder="Örn: A Plague Tale - 3. Bölüm" value="${esc(editing?.title||'')}" required></label><label class="field">Bölüm No<input name="episodeNumber" type="number" min="0" placeholder="1" value="${esc(editing?.episodeNumber||'')}"></label><label class="field">Bölüm Başlığı<input name="episodeTitle" placeholder="Örn: Farelerin Gazabı" value="${esc(editing?.episodeTitle||'')}"></label><label class="field">Tarih<input name="date" type="date" value="${esc(parseTrDateToIsoFix6(editing?.date||'') || fix8TodayIso())}" required></label><label class="field">Saat<input name="time" type="time" value="${esc(editing?.time||'20:00')}"></label><label class="field">Tür<select name="type"><option ${editing?.type==='Yeni Bölüm'?'selected':''}>Yeni Bölüm</option><option ${editing?.type==='Seri Devamı'?'selected':''}>Seri Devamı</option><option ${editing?.type==='Ana Yayın'?'selected':''}>Ana Yayın</option><option ${editing?.type==='Özel Etkinlik'?'selected':''}>Özel Etkinlik</option></select></label><label class="field wideField">Kapak URL<input name="cover" value="${esc(editing?.cover||'')}" placeholder="Oyun seçince otomatik kapak gelir"></label><label class="field wideField">Not<textarea name="note" rows="3" placeholder="Kısa açıklama veya bölüm notu">${esc(editing?.note||'')}</textarea></label><div class="formActionBar noSticky"><button class="btn" data-action="calendar-use-selected-game" type="button">Seçilen Oyundan Meta/Kapak Çek</button><button class="btn primary" data-action="save-calendar-event" type="button">${editing?'Düzenlemeyi Kaydet':'Takvime Kaydet'}</button>${editing?'<button class="btn" data-action="calendar-cancel-edit" type="button">Vazgeç</button>':''}<button class="btn" data-page="Takvim" type="button">Takvimi Gör</button></div></form></div><section class="card wide"><h3>Kayıtlı Yayınlar</h3><div class="calendarAdminList fix8CalendarList">${events.map(ev=>`<article><img src="${esc(ev.cover || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop')}" alt="${esc(ev.title)}"><div><b>${esc(ev.title)}</b><small>${esc(formatDateTrFix6(ev.date))} • ${esc(ev.time || '20:00')} • ${esc(ev.type || 'Yayın')}</small><p>${esc(ev.episodeTitle ? `${ev.episodeNumber || ''}. Bölüm - ${ev.episodeTitle}` : ev.note || '')}</p></div><div class="rowActions"><button class="miniBtn" data-action="edit-calendar-event" data-calendar-id="${esc(ev.id)}">Düzenle</button><button class="miniBtn danger" data-action="delete-calendar-event" data-calendar-id="${esc(ev.id)}">Sil</button></div></article>`).join('') || '<p class="muted">Kayıt yok.</p>'}</div></section></section>`;
};

maintenanceAdmin = function(){
  return `<section class="fix8MaintenanceAdmin"><div class="card wide fix8MaintenanceHero"><div><span class="eyebrow">Profesyonel Bakım Modu</span><h2>Bakım Modunu Yönet</h2><p>Bakım açıkken normal kullanıcılar animasyonlu bakım ekranını görür. Yetkililer yönetim paneline erişmeye devam eder.</p></div><button class="btn ${state.maintenance?.enabled?'danger':'primary'}" data-action="toggle-maintenance">${state.maintenance?.enabled?'Bakımı Kapat':'Bakımı Aç'}</button></div><section class="card wide"><label class="field">Bakım mesajı<input id="maintenanceMessage" value="${esc(state.maintenance?.message || 'Hayatımız Oyun kısa süreli bakımda.')}" /></label><label class="field">Tahmini açılış zamanı<input id="maintenanceEta" placeholder="Örn: Bugün 22:30" value="${esc(state.maintenance?.eta || '')}" /></label><div class="maintenancePreview"><div class="loader cinematicLoader"></div><h3>Hayatımız Oyun güncelleniyor.</h3><p>${esc(state.maintenance?.message || 'Site kısa süreli bakımda.')}</p><span>${esc(state.maintenance?.eta || 'Tahmini açılış belirtilmedi')}</span></div></section></section>`;
};

const oldOnActionFix8 = onAction;
onAction = async function(e){
  const action = e.currentTarget?.dataset?.action || '';
  if(action === 'game-admin-tab'){ e.preventDefault(); fix8SetGameAdminTab(e.currentTarget.dataset.tab || 'add'); render(); return; }
  if(action === 'series-admin-pick'){ e.preventDefault(); localStorage.setItem(FIX8_SERIES_PICK_KEY, e.currentTarget.dataset.series || ''); render(); return; }
  if(action === 'suggest-tr-genres'){
    e.preventDefault(); const form = e.currentTarget.closest('form'); if(!form) return; const genre = fix8InferGenre(form.elements.title?.value || ''); if(form.elements.genre){ form.elements.genre.value = genre; saveGameDraftFromForm(form); } setToast('Tür önerisi Türkçe olarak dolduruldu.'); render(); return;
  }
  if(action === 'calendar-cancel-edit'){ e.preventDefault(); state.editingCalendarEventId = null; render(); return; }
  if(action === 'edit-calendar-event'){ e.preventDefault(); state.editingCalendarEventId = e.currentTarget.dataset.calendarId || ''; render(); return; }
  if(action === 'calendar-use-selected-game'){
    e.preventDefault(); const form = document.getElementById('calendarEventForm'); if(!form) return; const g = state.games.find(x=>String(x.id)===String(form.elements.gameId?.value)); if(!g) return setToast('Önce devam eden oyun seç.'); form.elements.title.value = `${g.title}${Number(form.elements.episodeNumber?.value||0)>0?' - '+form.elements.episodeNumber.value+'. Bölüm':''}`; form.elements.cover.value = eventCardCoverFix6(g); form.elements.note.value = g.description || g.genre || ''; if(form.elements.type) form.elements.type.value = Number(g.eps||0)>0 ? 'Yeni Bölüm' : 'Ana Yayın'; setToast('Oyun adı, kapak ve meta takvim formuna çekildi.'); return;
  }
  if(action === 'save-calendar-event'){
    e.preventDefault(); const form = document.getElementById('calendarEventForm'); if(!form) return; const fd = new FormData(form); const g = state.games.find(x=>String(x.id)===String(fd.get('gameId')||'')); const id = String(fd.get('id')||state.editingCalendarEventId||'').trim(); const event = { id:id || `cal-${Date.now()}`, title:String(fd.get('title')||'').trim() || (g?.title||'Yeni Yayın'), gameId:String(fd.get('gameId')||''), gameTitle:g?.title || '', episodeNumber:String(fd.get('episodeNumber')||''), episodeTitle:String(fd.get('episodeTitle')||''), date:parseTrDateToIsoFix6(fd.get('date')), time:String(fd.get('time')||'20:00'), type:String(fd.get('type')||'Yeni Bölüm'), cover:String(fd.get('cover')||'').trim() || (g?eventCardCoverFix6(g):''), note:String(fd.get('note')||'').trim() };
    if(!event.title || !event.date) return setToast('Takvim için başlık ve tarih gerekli.');
    const events = getCalendarEventsFix6().filter(x=>!String(x.id).startsWith('demo-') && String(x.id)!==String(event.id)); events.push(event); saveCalendarEventsFix6(events); state.editingCalendarEventId = null; form.reset(); render(); setToast('Yayın takvimi kaydı kaydedildi.'); try{ await api('calendar-events-upsert', { adminToken: state.session?.adminToken, event }); }catch{} return;
  }
  return oldOnActionFix8(e);
};

const oldBindFix8 = bind;
bind = function(){
  oldBindFix8();
  document.querySelectorAll('[data-status-pick]').forEach(btn=>btn.addEventListener('click', e=>{ e.preventDefault(); const form=btn.closest('form'); if(form?.elements.status){ form.elements.status.value=btn.dataset.statusPick||'Devam Ediyor'; saveGameDraftFromForm(form); render(); } }));
  const s = document.getElementById('seriesAdminSearchFix8'); if(s) s.addEventListener('input', e=>{ localStorage.setItem('hayatimiz_series_admin_query_fix8', e.target.value || ''); render(); });
  const req = document.getElementById('gameRequestForm'); if(req) req.addEventListener('submit', submitGameRequestFix8);
  const bug = document.getElementById('bugReportForm'); if(bug) bug.addEventListener('submit', submitBugReportFix8);
};

async function submitGameRequestFix8(e){
  e.preventDefault(); const form=e.currentTarget; const data=fix8FormToObject(form); const item={ id:`req-${Date.now()}`, gameTitle:String(data.gameTitle||'').trim(), seriesName:String(data.seriesName||'').trim(), note:String(data.note||'').trim(), email:state.session?.email||'', status:'Yeni', createdAt:new Date().toLocaleString('tr-TR')}; if(!item.gameTitle) return setToast('Oyun adı gerekli.'); const list=fix8LocalList(FIX8_REQUESTS_KEY); list.unshift(item); fix8SaveLocal(FIX8_REQUESTS_KEY,list); form.reset(); render(); setToast('Oyun isteği yetkililere gönderildi.'); try{ await api('game-request-add', { request:item }); }catch{}
}
submitBugReportFix8 = async function(e){
  e.preventDefault(); const form=e.currentTarget; const data=fix8FormToObject(form); const item={ id:`bug-${Date.now()}`, title:String(data.title||'').trim(), page:String(data.page||'').trim(), description:String(data.description||'').trim(), email:state.session?.email||'', status:'Yeni', createdAt:new Date().toLocaleString('tr-TR')}; if(!item.title || !item.description) return setToast('Başlık ve detay gerekli.'); const list=fix8LocalList(FIX8_BUGS_KEY); list.unshift(item); fix8SaveLocal(FIX8_BUGS_KEY,list); form.reset(); render(); setToast('Hata bildirimi yetkililere gönderildi.'); try{ await api('bug-report-add', { report:item }); }catch{}
}

try{ render(); }catch(error){ showBootError(error); }

/* v2.2.0 FIX 9 - düzenleme, takvim, bakım yüzdesi ve sürükle-bırak seri sıralama */
const FIX9_MAINTENANCE_NOTES_DEFAULT = [
  'Arayüz düzeni ve oyun kartları iyileştiriliyor.',
  'Yayın takvimi kayıtları kontrol ediliyor.',
  'Seri sıralama ve izleme akışı güncelleniyor.'
];
function fix9MaintenanceNotesText(){
  const value = state.maintenance?.notesText || state.maintenance?.updateNotesText || state.maintenance?.publicNotes;
  if(Array.isArray(value)) return value.join('\n');
  if(String(value || '').trim()) return String(value).trim();
  return FIX9_MAINTENANCE_NOTES_DEFAULT.join('\n');
}
function fix9MaintenanceNotesArray(){
  return fix9MaintenanceNotesText().split(/\n+/).map(x=>x.trim()).filter(Boolean).slice(0,8);
}
function fix9MaintenanceProgress(){
  const n = Number(state.maintenance?.progress ?? state.maintenance?.percent ?? 35);
  return Math.max(0, Math.min(100, Number.isFinite(n) ? n : 35));
}
function fix9ReadMaintenanceForm(){
  const notesText = String(document.getElementById('maintenanceNotesText')?.value || fix9MaintenanceNotesText()).trim();
  const progress = Math.max(0, Math.min(100, Number(document.getElementById('maintenanceProgress')?.value || fix9MaintenanceProgress())));
  return {
    enabled: !!state.maintenance?.enabled,
    message: document.getElementById('maintenanceMessage')?.value || state.maintenance?.message || 'Hayatımız Oyun kısa süreli bakımda.',
    eta: document.getElementById('maintenanceEta')?.value || state.maintenance?.eta || '',
    progress,
    notesText,
    publicNotes: notesText.split(/\n+/).map(x=>x.trim()).filter(Boolean)
  };
}
function fix9MaintenancePreview(maintenance = state.maintenance || {}){
  const progress = Math.max(0, Math.min(100, Number(maintenance.progress ?? fix9MaintenanceProgress())));
  const notes = Array.isArray(maintenance.publicNotes) ? maintenance.publicNotes : fix9MaintenanceNotesArray();
  return `<div class="fix9MaintenancePreview"><div class="maintenancePreviewTop"><div class="loader cinematicLoader"></div><div><span class="eyebrow">Bakım Önizlemesi</span><h3>Hayatımız Oyun güncelleniyor.</h3><p>${esc(maintenance.message || state.maintenance?.message || 'Site kısa süreli bakımda.')}</p>${maintenance.eta || state.maintenance?.eta ? `<small>Tahmini açılış: ${esc(maintenance.eta || state.maintenance?.eta)}</small>` : ''}</div></div><div class="fix9Percent"><div><b>%${progress}</b><span>tamamlandı</span></div><div class="progressLine large"><span style="width:${progress}%"></span></div></div><div class="maintenancePublicNotes"><b>Güncelleme notları</b>${notes.map(n=>`<span>${esc(n)}</span>`).join('')}</div></div>`;
}
maintenancePage = function(){
  return html`<section class="maintenanceWrap proMaintenance v218Maintenance fix9MaintenancePublic"><div class="maintenanceGlow"></div><div class="pulseOrb"></div><div class="maintenanceCard fix9MaintenanceCard"><div class="loader cinematicLoader"></div><span class="eyebrow">Bakım Modu</span><h1>Hayatımız Oyun güncelleniyor.</h1><p>${esc(state.maintenance?.message || 'Site kısa süreli bakımda. Lütfen daha sonra tekrar dene.')}</p>${state.maintenance?.eta ? `<div class="maintenanceEta"><span>Tahmini açılış</span><b>${esc(state.maintenance.eta)}</b></div>` : ''}<div class="fix9Percent public"><div><b>%${fix9MaintenanceProgress()}</b><span>tamamlandı</span></div><div class="progressLine large"><span style="width:${fix9MaintenanceProgress()}%"></span></div></div><div class="maintenancePublicNotes"><b>Kullanıcıyı ilgilendiren güncelleme notları</b>${fix9MaintenanceNotesArray().map(n=>`<span>${esc(n)}</span>`).join('')}</div><div class="maintenanceSteps"><span></span><span></span><span></span></div><div class="authButtons"><button class="btn primary" data-action="open-login">Yetkili Girişi</button>${isStaff()?'<button class="btn" data-admin="Bakım Modu">Yönetim Paneli</button>':''}</div></div></section>`;
};
maintenanceAdmin = function(){
  const m = state.maintenance || {};
  return `<section class="fix9MaintenanceAdmin"><div class="card wide fix8MaintenanceHero"><div><span class="eyebrow">Profesyonel Bakım Modu</span><h2>Bakım Modunu Yönet</h2><p>Bakımı açmadan önce kullanıcı görünümünü burada canlı önizle. Yüzde ve güncelleme notlarını kendin düzenleyebilirsin.</p></div><div class="rowActions"><button class="btn" data-action="save-maintenance-settings">Ayarları Kaydet</button><button class="btn ${m.enabled?'danger':'primary'}" data-action="toggle-maintenance">${m.enabled?'Bakımı Kapat':'Bakımı Aç'}</button></div></div><section class="fix9MaintenanceGrid"><div class="card"><label class="field">Bakım mesajı<input id="maintenanceMessage" value="${esc(m.message || 'Hayatımız Oyun kısa süreli bakımda.')}" /></label><label class="field">Tahmini açılış zamanı<input id="maintenanceEta" placeholder="Örn: Bugün 22:30" value="${esc(m.eta || '')}" /></label><label class="field">Tamamlanma yüzdesi<input id="maintenanceProgress" type="number" min="0" max="100" value="${esc(String(fix9MaintenanceProgress()))}" /></label><label class="field">Güncelleme notları<textarea id="maintenanceNotesText" rows="7" placeholder="Her satıra bir kullanıcı notu yaz">${esc(fix9MaintenanceNotesText())}</textarea></label><div class="rowActions"><button class="btn primary" data-action="save-maintenance-settings">Önizlemeyi / Notları Kaydet</button><button class="btn" data-action="preview-maintenance-only">Sadece Önizlemeyi Yenile</button></div><p class="note">Bakım modunu açmana gerek yok. Kullanıcıların göreceği ekran sağdaki önizlemede gösterilir.</p></div><div class="card">${fix9MaintenancePreview(m)}</div></section></section>`;
};
toggleMaintenance = async function(){
  const formState = fix9ReadMaintenanceForm();
  state.maintenance = { ...formState, enabled: !state.maintenance?.enabled };
  localStorage.setItem(MAINTENANCE_KEY, JSON.stringify(state.maintenance));
  render();
  try{ await api('settings-set', { adminToken: state.session?.adminToken, maintenance: state.maintenance }); setToast(state.maintenance.enabled?'Bakım modu açıldı.':'Bakım modu kapatıldı.'); }
  catch(e){ setToast('Bakım local değişti; Supabase kaydı başarısız: ' + e.message); }
};

function fix9StoredCalendarEvents(){
  const stored = safeParse(localStorage.getItem(CALENDAR_EVENTS_KEY_FIX6_FINAL), []);
  return (Array.isArray(stored) ? stored : []).filter(ev => ev && ev.date && !String(ev.id||'').startsWith('demo-') && !String(ev.id||'').startsWith('release-') && !String(ev.id||'').startsWith('game-'));
}
getCalendarEventsFix6 = function(){
  return fix9StoredCalendarEvents().map(ev=>({
    ...ev,
    gameId:ev.gameId || ev.game_id || '',
    gameTitle:ev.gameTitle || ev.game_title || '',
    episodeNumber:ev.episodeNumber || ev.episode_number || '',
    episodeTitle:ev.episodeTitle || ev.episode_title || ''
  })).sort((a,b)=>String(a.date).localeCompare(String(b.date)) || String(a.time||'').localeCompare(String(b.time||'')));
};
calendarAdminPanelFix6 = function(){
  const events = getCalendarEventsFix6();
  const continuingGames = (Array.isArray(state.games) ? state.games : []).filter(g=>g.status==='Devam Ediyor' || Number(g.eps||0)>0 || String(g.seriesName||'').trim());
  const editing = state.editingCalendarEventId ? events.find(e=>String(e.id)===String(state.editingCalendarEventId)) : null;
  const gameOptions = ['<option value="">Devam eden oyun seç</option>'].concat(continuingGames.map(g=>`<option value="${esc(g.id)}" ${String(editing?.gameId||'')===String(g.id)?'selected':''}>${esc(g.title)}</option>`)).join('');
  const title = editing ? 'Yayın Kaydını Düzenle' : 'Yeni Yayın Kaydı Ekle';
  return `<section class="calendarAdminFinal fix9CalendarAdmin"><div class="card wide"><div class="sectionHead"><div><span class="eyebrow">Devam Eden Oyun Yayın Takvimi</span><h2>${title}</h2><p class="muted">Gereksiz/demo kayıtlar gösterilmez. Sadece kaydettiğin devam eden oyun yayınları listelenir; düzenle ve sil butonları aktif çalışır.</p></div><span class="pill green">${events.length} kayıt</span></div><form class="calendarEventForm fix8CalendarForm" id="calendarEventForm"><input type="hidden" name="id" value="${esc(editing?.id||'')}"><label class="field">Devam Eden Oyun<select name="gameId">${gameOptions}</select></label><label class="field">Yayın Başlığı<input name="title" placeholder="Örn: A Plague Tale - 3. Bölüm" value="${esc(editing?.title||'')}" required></label><label class="field">Bölüm No<input name="episodeNumber" type="number" min="0" placeholder="1" value="${esc(editing?.episodeNumber||'')}"></label><label class="field">Bölüm Başlığı<input name="episodeTitle" placeholder="Örn: Farelerin Gazabı" value="${esc(editing?.episodeTitle||'')}"></label><label class="field">Tarih<input name="date" type="date" value="${esc(parseTrDateToIsoFix6(editing?.date||'') || fix8TodayIso())}" required></label><label class="field">Saat<input name="time" type="time" value="${esc(editing?.time||'20:00')}"></label><label class="field">Tür<select name="type"><option ${editing?.type==='Yeni Bölüm'?'selected':''}>Yeni Bölüm</option><option ${editing?.type==='Seri Devamı'?'selected':''}>Seri Devamı</option><option ${editing?.type==='Ana Yayın'?'selected':''}>Ana Yayın</option><option ${editing?.type==='Özel Etkinlik'?'selected':''}>Özel Etkinlik</option></select></label><label class="field wideField">Kapak URL<input name="cover" value="${esc(editing?.cover||'')}" placeholder="Oyun seçince otomatik kapak gelir"></label><label class="field wideField">Not<textarea name="note" rows="3" placeholder="Kısa açıklama veya bölüm notu">${esc(editing?.note||'')}</textarea></label><div class="formActionBar noSticky"><button class="btn" data-action="calendar-use-selected-game" type="button">Seçilen Oyundan Meta/Kapak Çek</button><button class="btn primary" data-action="save-calendar-event" type="button">${editing?'Düzenlemeyi Kaydet':'Takvime Kaydet'}</button>${editing?'<button class="btn" data-action="calendar-cancel-edit" type="button">Vazgeç</button>':''}<button class="btn" data-page="Takvim" type="button">Takvimi Gör</button></div></form></div><section class="card wide"><div class="sectionHead"><h3>Kayıtlı Yayınlar</h3><p class="muted">Sadece senin kaydettiğin yayınlar burada görünür.</p></div><div class="calendarAdminList fix9CalendarList">${events.map(ev=>`<article><img src="${esc(ev.cover || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop')}" alt="${esc(ev.title)}"><div><b>${esc(ev.title)}</b><small>${esc(formatDateTrFix6(ev.date))} • ${esc(ev.time || '20:00')} • ${esc(ev.type || 'Yayın')}</small><p>${esc(ev.episodeTitle ? `${ev.episodeNumber || ''}. Bölüm - ${ev.episodeTitle}` : ev.note || '')}</p></div><div class="rowActions"><button class="miniBtn" data-action="edit-calendar-event" data-calendar-id="${esc(ev.id)}">Düzenle</button><button class="miniBtn danger" data-action="delete-calendar-event" data-calendar-id="${esc(ev.id)}">Sil</button></div></article>`).join('') || '<p class="muted">Kayıt yok. Yukarıdan devam eden oyun seçip takvime ekle.</p>'}</div></section></section>`;
};

function fix9ActiveSeriesGroup(){
  const groups = sortedSeriesGroups(state.games.filter(g=>String(g.seriesName||'').trim() || Number(g.eps||0)>0));
  const query = normalizeSearchText(localStorage.getItem('hayatimiz_series_admin_query_fix9') || localStorage.getItem('hayatimiz_series_admin_query_fix8') || '');
  const filtered = query ? groups.filter(group=>normalizeSearchText(group.name).includes(query) || group.items.some(g=>normalizeSearchText(`${g.title} ${g.genre}`).includes(query))) : groups;
  const selected = localStorage.getItem(FIX8_SERIES_PICK_KEY) || filtered[0]?.name || groups[0]?.name || '';
  const active = filtered.find(g=>g.name===selected) || filtered[0] || groups[0] || { name:'Seri yok', items:[] };
  return { groups, filtered, active, query };
}
adminSeriesWatchPanel = function(){
  const { filtered, active, query } = fix9ActiveSeriesGroup();
  return `<section class="fix9SeriesAdmin"><div class="card wide"><div class="sectionHead"><div><span class="eyebrow">Sürükle Bırak Seri Sıralama</span><h2>Seriyi Seç ve İçinde Otomatik Sırala</h2><p class="muted">Seriyi butondan seç, kartları sürükle bırak. Sıra otomatik güncellenip kaydedilir.</p></div><span class="pill green">Otomatik kayıt</span></div><label class="search fix8SeriesSearch">🔎 <input id="seriesAdminSearchFix9" value="${esc(query)}" placeholder="Seri veya oyun ara..."></label><div class="fix8SeriesPickRail">${filtered.map(group=>`<button class="tagBtn ${group.name===active.name?'active':''}" data-action="series-admin-pick" data-series="${esc(group.name)}"><img src="${esc(eventCardCoverFix6(group.items[0]||{}))}" alt="">${esc(group.name)} <small>${group.items.length}</small></button>`).join('') || '<p class="muted">Seri bulunamadı.</p>'}</div></div><div class="card wide"><div class="sectionHead"><div><h3>${esc(active.name)}</h3><p class="muted">Kartı tutup yukarı/aşağı taşı. Manuel sıra inputu da otomatik kaydeder.</p></div><span class="pill green">${active.items.length} oyun</span></div><div class="fix9SeriesDropZone" data-series-name="${esc(active.name)}">${active.items.map((g,i)=>`<article class="fix9SeriesDragCard" draggable="true" data-series-drag-id="${esc(g.id)}"><span class="dragHandle">↕</span><img src="${esc(eventCardCoverFix6(g))}" alt="${esc(g.title)}"><div><b>${esc(g.title)}</b><small>${esc(g.releaseDate||'Tarih yok')} • ${esc(g.status||'')}</small><div class="progressLine"><span style="width:${progressPercent(g)}%"></span></div></div><label>Sıra<input data-series-order-game="${esc(g.id)}" type="number" value="${esc(String(g.seriesOrder||i+1))}"></label><button class="miniBtn" data-game-edit="${esc(g.id)}">Düzenle</button></article>`).join('') || '<p class="muted">Bu seride oyun yok.</p>'}</div></div></section>`;
};

onGameEdit = async function(e){
  e.preventDefault();
  const id = e.currentTarget.dataset.gameEdit;
  const current = state.games.find(g => String(g.id) === String(id));
  if(!current) return setToast('Oyun bulunamadı.');
  state.page = 'Yönetim Paneli';
  state.adminPage = 'Oyunlar';
  state.editingGameId = id;
  state.showGameForm = false;
  state.rawgCandidates = [];
  localStorage.setItem(PAGE_KEY, 'Yönetim Paneli');
  localStorage.setItem(ADMIN_TAB_KEY, 'Oyunlar');
  localStorage.setItem(FIX8_GAME_TAB_KEY, 'edit');
  render();
  setToast('Düzenleme formu açıldı. Değişiklikleri kaydedebilirsin.');
};
onGameEditSubmit = async function(e){
  e.preventDefault();
  const form = e.currentTarget;
  const id = state.editingGameId;
  const current = state.games.find(g => String(g.id) === String(id));
  if(!current) return setToast('Düzenlenecek oyun bulunamadı.');
  const patch = { ...current, ...readGameDraftFromForm(form) };
  if(!patch.title) return setToast('Oyun adı gerekli.');
  state.games = state.games.map(g => String(g.id) === String(id) ? { ...g, ...patch } : g);
  state.editingGameId = null;
  state.rawgCandidates = [];
  localStorage.setItem(FIX8_GAME_TAB_KEY, 'list');
  render();
  try{
    const data = await api('games-update', { adminToken: state.session?.adminToken, gameId:id, game:patch });
    if(data.game) state.games = state.games.map(g => String(g.id) === String(id) ? mapGame(data.game) : g);
    setToast('Oyun düzenleme kaydedildi.');
  }catch(err){ setToast('Oyun local güncellendi; Supabase güncelleme başarısız: ' + err.message); }
  render();
};
gamesAdmin = function(){
  const tab = state.editingGameId ? 'edit' : (localStorage.getItem(FIX8_GAME_TAB_KEY) || 'add');
  return `<section class="fix8GamesAdmin fix9GamesAdmin"><div class="fix8AdminTabs"><button class="btn ${tab==='add'?'primary':''}" data-action="game-admin-tab" data-tab="add">Oyun Ekle</button><button class="btn ${tab==='list'?'primary':''}" data-action="game-admin-tab" data-tab="list">Mevcut Oyunlar</button><button class="btn" data-action="auto-cover-fetch">Kapaksızlara Kapak Öner</button></div>${tab==='edit' ? `${gameEditForm()}${rawgCandidatePanel()}${coverSuggestionPanel()}` : tab==='add' ? `${gameAddForm()}${rawgCandidatePanel()}${coverSuggestionPanel()}` : adminGamesTableFix8()}</section>`;
};

const oldOnActionFix9 = onAction;
onAction = async function(e){
  const action = e.currentTarget?.dataset?.action || '';
  if(action === 'save-maintenance-settings' || action === 'preview-maintenance-only'){
    e.preventDefault();
    state.maintenance = fix9ReadMaintenanceForm();
    localStorage.setItem(MAINTENANCE_KEY, JSON.stringify(state.maintenance));
    render();
    if(action === 'save-maintenance-settings'){
      try{ await api('settings-set', { adminToken: state.session?.adminToken, maintenance: state.maintenance }); setToast('Bakım görünümü, yüzde ve güncelleme notları kaydedildi.'); }
      catch(err){ setToast('Bakım ayarı local kaydedildi; Supabase kaydı başarısız: ' + err.message); }
    } else setToast('Bakım önizlemesi yenilendi.');
    return;
  }
  if(action === 'game-admin-tab'){
    e.preventDefault();
    const tab = e.currentTarget.dataset.tab || 'add';
    localStorage.setItem(FIX8_GAME_TAB_KEY, tab);
    if(tab !== 'edit') state.editingGameId = null;
    render();
    return;
  }
  if(action === 'calendar-cancel-edit'){ e.preventDefault(); state.editingCalendarEventId = null; render(); return; }
  if(action === 'edit-calendar-event'){ e.preventDefault(); state.editingCalendarEventId = e.currentTarget.dataset.calendarId || ''; render(); return; }
  if(action === 'delete-calendar-event'){
    e.preventDefault();
    const id = e.currentTarget.dataset.calendarId;
    const events = getCalendarEventsFix6().filter(ev=>String(ev.id)!==String(id));
    saveCalendarEventsFix6(events);
    if(String(state.editingCalendarEventId||'') === String(id)) state.editingCalendarEventId = null;
    render(); setToast('Takvim kaydı silindi.');
    try{ await api('calendar-events-delete', { adminToken: state.session?.adminToken, id }); }catch{}
    return;
  }
  if(action === 'calendar-use-selected-game'){
    e.preventDefault();
    const form = document.getElementById('calendarEventForm'); if(!form) return;
    const g = state.games.find(x=>String(x.id)===String(form.elements.gameId?.value));
    if(!g) return setToast('Önce devam eden oyun seç.');
    const epNo = String(form.elements.episodeNumber?.value || '').trim();
    form.elements.title.value = `${g.title}${epNo ? ' - '+epNo+'. Bölüm' : ''}`;
    form.elements.cover.value = eventCardCoverFix6(g);
    form.elements.note.value = g.description || g.genre || '';
    if(form.elements.type) form.elements.type.value = Number(g.eps||0)>0 ? 'Yeni Bölüm' : 'Ana Yayın';
    setToast('Oyun adı, kapak ve meta takvim formuna çekildi.');
    return;
  }
  if(action === 'save-calendar-event'){
    e.preventDefault();
    const form = document.getElementById('calendarEventForm'); if(!form) return;
    const fd = new FormData(form);
    const g = state.games.find(x=>String(x.id)===String(fd.get('gameId')||''));
    const id = String(fd.get('id') || state.editingCalendarEventId || '').trim();
    const event = {
      id: id || `cal-${Date.now()}`,
      title:String(fd.get('title')||'').trim() || (g?.title||'Yeni Yayın'),
      gameId:String(fd.get('gameId')||''),
      gameTitle:g?.title || '',
      episodeNumber:String(fd.get('episodeNumber')||'').trim(),
      episodeTitle:String(fd.get('episodeTitle')||'').trim(),
      date:parseTrDateToIsoFix6(fd.get('date')),
      time:String(fd.get('time')||'20:00'),
      type:String(fd.get('type')||'Yeni Bölüm'),
      cover:String(fd.get('cover')||'').trim() || (g?eventCardCoverFix6(g):''),
      note:String(fd.get('note')||'').trim()
    };
    if(!event.title || !event.date) return setToast('Takvim için başlık ve tarih gerekli.');
    const events = getCalendarEventsFix6().filter(x=>String(x.id)!==String(event.id));
    events.push(event); saveCalendarEventsFix6(events); state.editingCalendarEventId = null; form.reset(); render(); setToast('Yayın takvimi kaydı kaydedildi.');
    try{ await api('calendar-events-upsert', { adminToken: state.session?.adminToken, event }); }catch{}
    return;
  }
  if(action === 'series-admin-pick'){
    e.preventDefault(); localStorage.setItem(FIX8_SERIES_PICK_KEY, e.currentTarget.dataset.series || ''); render(); return;
  }
  return oldOnActionFix9(e);
};
const oldBindFix9 = bind;
bind = function(){
  oldBindFix9();
  const search = document.getElementById('seriesAdminSearchFix9');
  if(search) search.addEventListener('input', e=>{ localStorage.setItem('hayatimiz_series_admin_query_fix9', e.target.value || ''); render(); });
  document.querySelectorAll('.fix9SeriesDragCard').forEach(card=>{
    card.addEventListener('dragstart', e=>{ e.dataTransfer.setData('text/plain', card.dataset.seriesDragId || ''); card.classList.add('dragging'); });
    card.addEventListener('dragend', ()=>card.classList.remove('dragging'));
  });
  document.querySelectorAll('.fix9SeriesDropZone').forEach(zone=>{
    zone.addEventListener('dragover', e=>{ e.preventDefault(); const dragging=document.querySelector('.fix9SeriesDragCard.dragging'); if(!dragging) return; const after=[...zone.querySelectorAll('.fix9SeriesDragCard:not(.dragging)')].find(el=>e.clientY <= el.getBoundingClientRect().top + el.offsetHeight/2); after ? zone.insertBefore(dragging, after) : zone.appendChild(dragging); });
    zone.addEventListener('drop', async e=>{ e.preventDefault(); const ids=[...zone.querySelectorAll('.fix9SeriesDragCard')].map(el=>String(el.dataset.seriesDragId)); ids.forEach((id,idx)=>{ const g=state.games.find(x=>String(x.id)===id); if(g) g.seriesOrder=idx+1; }); render(); setToast('Seri sırası otomatik kaydediliyor...'); try{ await saveSeriesOrders(); }catch{} });
  });
  document.querySelectorAll('.fix9SeriesDropZone [data-series-order-game]').forEach(input=>input.addEventListener('change', async e=>{ const g=state.games.find(x=>String(x.id)===String(input.dataset.seriesOrderGame)); if(g){ g.seriesOrder=Number(e.target.value||0); setToast('Sıra otomatik kaydediliyor...'); try{ await api('games-update', { adminToken: state.session?.adminToken, gameId:g.id, game:g }); setToast('Seri sırası otomatik kaydedildi.'); }catch(err){ setToast('Sıra local güncellendi; Supabase kaydı başarısız.'); } render(); } }));
};
try{ render(); }catch(error){ showBootError(error); }

/* v2.2.0 FIX 10 - düzenleme butonları, detaylı hikaye, tür çekme, kompakt arşiv/seri, profesyonel istek-hata */
const FIX10_VERSION_LABEL = 'v2.2.0 FIX 10';
function fix10GenreFromTitle(title=''){
  const t = normalizeSearchText(title);
  if(t.includes('assassin') || t.includes('origins') || t.includes('mirage')) return 'Aksiyon-macera, gizlilik, açık dünya, tarihi kurgu';
  if(t.includes('plague')) return 'Macera, gizlilik, hikaye odaklı, bulmaca';
  if(t.includes('resident') || t.includes('silent') || t.includes('outlast') || t.includes('dead space')) return 'Korku, hayatta kalma, aksiyon-macera';
  if(t.includes('witcher') || t.includes('mass effect') || t.includes('dragon age') || t.includes('baldur')) return 'Rol yapma, hikaye odaklı, macera, seçim odaklı';
  if(t.includes('cyberpunk')) return 'Aksiyon-RPG, açık dünya, bilim kurgu';
  if(t.includes('god of war') || t.includes('sekiro') || t.includes('elden') || t.includes('dark souls')) return 'Aksiyon, macera, soulslike, rol yapma';
  if(t.includes('red dead') || t.includes('gta')) return 'Aksiyon-macera, açık dünya, suç, hikaye odaklı';
  if(t.includes('tomb raider') || t.includes('uncharted')) return 'Aksiyon-macera, keşif, bulmaca';
  return 'Aksiyon-macera, hikaye odaklı, tek oyunculu';
}
function fix10DetailedStory(title='', genre=''){
  const name = String(title || 'Bu oyun').trim() || 'Bu oyun';
  const g = String(genre || fix10GenreFromTitle(name)).trim();
  const key = normalizeSearchText(name);
  if(key.includes('plague')) return `${name}, karanlık Orta Çağ atmosferinde geçen hikaye odaklı bir macera sunar. Amicia ve Hugo'nun hayatta kalma mücadelesi, salgın, savaş ve doğaüstü tehditlerin gölgesinde ilerler. Oyuncu, gizlilik, bulmaca çözme ve çevreyi dikkatli kullanma üzerinden kardeşlerin tehlikeli yolculuğuna eşlik eder. Hikaye boyunca aile bağı, korku, umut ve fedakarlık temaları öne çıkar.`;
  if(key.includes('assassin')) return `${name}, tarihi olaylar ve gizli örgütlerin çatışması etrafında şekillenen aksiyon-macera türünde bir hikaye anlatır. Oyuncu, kişisel intikam, halkı koruma ve büyük bir komployu ortaya çıkarma sürecinde açık dünyayı keşfeder. Gizlilik, parkur, yakın dövüş ve keşif sistemleriyle hikaye bölüm bölüm ilerler. Seri içindeki olaylar, karakterin geçmişiyle tarikat/örgüt mücadelesini birbirine bağlar.`;
  if(key.includes('resident')) return `${name}, hayatta kalma korkusu ve aksiyon öğelerini birleştiren gerilim odaklı bir hikaye sunar. Oyuncu, biyolojik tehditlerin ve karanlık deneylerin merkezinde kaynak yönetimi, keşif ve çatışma ile ilerler. Hikaye, karakterlerin hayatta kalma çabasıyla birlikte salgının arkasındaki sırları açığa çıkarır.`;
  if(key.includes('witcher')) return `${name}, canavar avcılığı, siyasi entrikalar ve kişisel seçimler üzerine kurulu geniş bir rol yapma hikayesi sunar. Oyuncu, görevlerde verdiği kararlarla dünyanın gidişatını ve karakterlerin kaderini etkiler. Ana hikaye; aile, kader, savaş ve ahlaki seçimler etrafında gelişir.`;
  if(key.includes('cyberpunk')) return `${name}, distopik bir gelecekte kimlik, güç ve hayatta kalma mücadelesini anlatır. Oyuncu, Night City'nin suç, teknoloji ve şirket baskısıyla şekillenen karanlık sokaklarında ilerler. Hikaye, karakterin kendi geleceğini belirleme çabasıyla büyük şehirdeki güç dengelerini birleştirir.`;
  return `${name}, ${g} türlerini birleştiren hikaye odaklı bir deneyim sunar. Oyuncu, ana karakterin hedefleri ve karşılaştığı tehlikeler üzerinden ilerleyen bölümlerde keşif, mücadele ve karar anlarıyla karşılaşır. Hikaye, oyunun dünyasını, karakterlerini ve görev akışını anlaşılır biçimde takip etmeyi sağlar. Bu açıklama, arşivde oyunun kısa ama detaylı hikaye özeti olarak kullanılabilir.`;
}
function fix10Cover(g){ return eventCardCoverFix6(g || {}) || coverFor(g || {}) || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=900&auto=format&fit=crop'; }

function fix10GameFormActions(mode){
  return `<div class="fix10FormActions"><button class="btn" type="button" data-action="${mode==='edit'?'auto-game-meta-edit':'auto-game-meta'}">Meta + Kapak Çek</button><button class="btn" type="button" data-action="fix10-refetch-story">Hikayeyi Tekrar Çek</button><button class="btn" type="button" data-action="fix10-refetch-genres">Türleri Tekrar Çek</button><button class="btn" type="button" data-action="${mode==='edit'?'estimate-playlist-episodes-edit':'estimate-playlist-episodes'}">Playlist Bölümleri Çek</button><button class="btn primary" type="submit">${mode==='edit'?'Oyunu Güncelle':'Oyunu Kaydet'}</button></div>`;
}
function gameFormFields(d, mode='add'){
  const opts = ['Devam Ediyor','Tamamlandı','Popüler','Yakında'].map(st=>`<option ${d.status===st?'selected':''}>${st}</option>`).join('');
  const dateValue = formatDateTrFix6(d.releaseDate || '');
  const descPreview = (d.description || fix10DetailedStory(d.title, d.genre)).slice(0,260);
  return `<div class="fix10GameEditor"><section class="fix10EditorMain"><div class="sectionHead"><div><span class="eyebrow">${mode==='edit'?'Mevcut Oyunu Düzenle':'Profesyonel Oyun Ekleme'}</span><h2>${mode==='edit'?'Oyun Bilgilerini Güncelle':'Yeni Oyun Bilgileri'}</h2><p class="muted">Kapak, meta, tür ve hikaye tek formda düzenlenir. Tarih biçimi: gün.ay.yıl.</p></div></div><div class="statusPickBar"><button class="tagBtn ${d.status==='Tamamlandı'?'active':''}" type="button" data-status-pick="Tamamlandı">Tamamlanan Seriler</button><button class="tagBtn ${d.status==='Devam Ediyor'?'active':''}" type="button" data-status-pick="Devam Ediyor">Devam Eden Seriler</button><button class="tagBtn ${d.status==='Yakında'?'active':''}" type="button" data-status-pick="Yakında">Yakında Gelecek Seriler</button></div><div class="fix10FormGrid"><label class="field">Oyun Adı *<input name="title" required placeholder="Örn: A Plague Tale: Innocence" value="${esc(d.title)}" /></label><label class="field">Seri Adı<input name="seriesName" placeholder="Örn: A Plague Tale" value="${esc(d.seriesName || '')}" /></label><label class="field">Çıkış Tarihi <small>gün.ay.yıl</small><input name="releaseDate" placeholder="14.05.2019" value="${esc(dateValue)}" /></label><label class="field">Durum<select name="status">${opts}</select></label><label class="field wideField">Türler<input name="genre" placeholder="Aksiyon-macera, gizlilik" value="${esc(d.genre)}" /></label><div class="field wideField"><span>Etiketler</span>${tagButtonsHtml(d.tags)}</div><label class="field">Toplam Bölüm<input name="eps" type="number" min="0" value="${esc(String(d.eps ?? 0))}" /></label><label class="field">İzlenen Bölüm<input name="watchedEps" type="number" min="0" value="${esc(String(d.watchedEps ?? 0))}" /></label><label class="field">Puan<input name="score" type="number" min="0" max="10" step="0.1" value="${esc(String(d.score ?? 8.5))}" /></label><label class="field">Seri Sıra No<input name="seriesOrder" type="number" min="0" value="${esc(String(d.seriesOrder ?? 0))}" /></label><label class="field wideField">Kapak URL<div class="inlineField"><input name="cover" placeholder="https://..." value="${esc(d.cover)}" /><button class="miniBtn" type="button" data-action="${mode==='edit'?'auto-game-meta-edit':'auto-game-meta'}">Kapakları Çek</button></div></label><label class="field wideField">YouTube Playlist<input name="playlistUrl" placeholder="https://youtube.com/playlist?list=..." value="${esc(d.playlistUrl || '')}" /></label><label class="field wideField">Tek Video URL<input name="videoUrl" placeholder="https://youtube.com/watch?v=..." value="${esc(d.videoUrl || '')}" /></label><label class="field wideField storyField">Oyunun Hikayesi<textarea name="description" rows="6" placeholder="Hikayeyi Tekrar Çek butonu detaylı Türkçe hikaye yazar.">${esc(d.description || '')}</textarea></label><label class="field wideField episodeImportField">Bölüm Listesi${episodeImportPreview(d.episodesText, d.episodes)}<textarea name="episodesText" rows="4" class="technicalEpisodes" placeholder="Teknik bölüm verisi otomatik oluşur">${esc(d.episodesText || episodesToText(d.episodes || []))}</textarea><button class="miniBtn" type="button" data-action="toggle-technical-episodes">Teknik Veriyi Göster / Gizle</button></label></div>${fix10GameFormActions(mode)}</section><aside class="fix10PreviewSide"><div class="fix10PreviewSticky"><h3>Canlı Kapak Önizleme</h3><div class="fix10CoverFrame"><img src="${esc(d.cover || 'https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1000&auto=format&fit=crop')}" alt="${esc(d.title||'Oyun')}"></div><article class="fix10PreviewCard"><span class="scoreBadge fix4Score">${esc(String(d.score || '8.5'))}</span><h2>${esc(d.title || 'Oyun adı')}</h2>${tagChipsHtml(d.tags || d.genre)}<p>${esc(descPreview)}${descPreview.length>=260?'...':''}</p><div class="fix6MetaGrid"><div><small>Çıkış Tarihi</small><b>${esc(dateValue || '-')}</b></div><div><small>Tür</small><b>${esc(d.genre || 'Genel')}</b></div><div><small>Durum</small><b>${esc(d.status || 'Devam Ediyor')}</b></div><div><small>Bölüm</small><b>${esc(String(d.watchedEps||0))}/${esc(String(d.eps||0))}</b></div></div></article></div></aside></div>`;
}
gameAddForm = function(){ const d = { ...DEFAULT_GAME_DRAFT, ...state.gameDraft }; return `<form class="card soft gameForm fix10GameForm" id="gameAddForm" autocomplete="off">${gameFormFields(d,'add')}</form>`; };
gameEditForm = function(){ const current = state.games.find(g=>String(g.id)===String(state.editingGameId)); if(!current) return ''; return `<form class="card soft gameForm editGameForm fix10GameForm" id="gameEditForm" autocomplete="off">${gameFormFields(current,'edit')}</form>`; };

function fix10CompactGameCard(g, admin=false){
  const progress = progressPercent(g) || getGameProgress(g);
  const desc = fix4Description(g).slice(0,95);
  return `<article class="fix10CompactCard"><div class="fix10CardCover"><img src="${esc(fix10Cover(g))}" alt="${esc(g.title)}"><span class="scoreBadge">${esc(String(g.score || '8.5'))}</span></div><div class="fix10CardBody"><div class="cardTopline"><span class="pill">${esc(g.status||'')}</span>${g.releaseDate?`<span class="pill softPill">${esc(formatDateTrFix6(g.releaseDate))}</span>`:''}</div><h3>${esc(g.title)}</h3><p>${esc(desc)}${desc.length>=95?'...':''}</p>${tagChipsHtml(g.tags || g.genre)}<div class="progressLine"><span style="width:${progress}%"></span></div><div class="fix10CardActions">${admin?`<button class="miniBtn primary" data-game-edit="${esc(g.id)}">Düzenle</button><button class="miniBtn danger" data-game-delete="${esc(g.id)}">Sil</button>`:`${watchButtonHtml(g)}<button class="miniBtn" data-favorite-game="${esc(g.id)}">${isFavorite(g.id)?'♥':'♡'}</button>`}</div></div></article>`;
}
gameGrid = function(){
  const games = sortedVisibleGames();
  const adminActions = isStaff() && state.page === 'Yönetim Paneli' && state.adminPage === 'Oyunlar';
  if(!games.length) return '<section class="games fix10ArchiveGrid"><div class="card wide">Oyun bulunamadı.</div></section>';
  if(adminActions) return `<div class="fix10AdminCardGrid">${games.map(g=>fix10CompactGameCard(g,true)).join('')}</div>`;
  return `<section class="fix10ArchivePage"><div class="fix4ArchiveHeader"><div><span class="eyebrow">Kompakt Profesyonel Arşiv</span><h1>${state.page === 'Favoriler' ? 'Favoriler' : 'Oyun Arşivi'}</h1><p class="muted">Kartlar sayfayı taşırmaz; dolunca alt satıra geçer.</p></div><span class="pill green">${games.length} oyun</span></div>${advancedSearchPanel()}${typeof alphabeticalGameArchiveFix7==='function'?alphabeticalGameArchiveFix7(games):''}<div class="fix10ArchiveGrid">${games.map(g=>fix10CompactGameCard(g,false)).join('')}</div></section>`;
};
seriesDirectoryPage = function(){
  const groups = sortedSeriesGroups(state.games.filter(g=>String(g.seriesName||'').trim() || Number(g.eps||0)>0));
  if(!groups.length) return `<section class="card wide"><h2>Seri yok</h2><p>Seri adı veya bölüm bilgisi olan oyun eklenince burada görünür.</p></section>`;
  const letters = Array.from(new Set(groups.map(g=>(g.name||'#')[0].toLocaleUpperCase('tr-TR')))).sort((a,b)=>a.localeCompare(b,'tr'));
  const activeLetter = state.selectedSeriesLetter || letters[0] || 'A';
  const visible = groups.filter(g=>(g.name||'#')[0].toLocaleUpperCase('tr-TR')===activeLetter);
  return `<section class="fix10SeriesPage"><div class="fix4ArchiveHeader"><div><span class="eyebrow">Kompakt Seri Arşivi</span><h1>Seriler</h1><p class="muted">Alfabetik şerit ve kompakt kapaklı seri kartları.</p></div><span class="pill green">${groups.length} seri</span></div><div class="letterRail fix10Letters">${letters.map(l=>`<button class="tagBtn ${activeLetter===l?'active':''}" data-series-letter="${esc(l)}">${esc(l)}</button>`).join('')}</div><h2>${esc(activeLetter)} Harfindeki Seriler</h2><div class="fix10SeriesGrid">${visible.map(group=>`<article class="fix10SeriesCard"><div class="fix10SeriesBanner"><img src="${esc(fix10Cover(group.items[0]||{}))}" alt="${esc(group.name)}"></div><div><h3>${esc(group.name)}</h3><p>${group.items.length} oyun • ${group.items.reduce((a,g)=>a+Number(g.eps||seriesEpisodes(g).length||0),0)} bölüm</p><div class="fix10MiniGames">${group.items.slice(0,4).map(g=>`<span><img src="${esc(fix10Cover(g))}">${esc(g.title)}</span>`).join('')}</div><div class="rowActions"><button class="miniBtn primary" data-watch-series="${esc(group.items[0]?.id||'')}">Seriyi İzle</button><button class="miniBtn" data-admin="Seri İzleme">Yönet</button></div></div></article>`).join('') || '<p class="muted">Bu harfte seri yok.</p>'}</div></section>`;
};

adminGamesTableFix8 = function(){
  const games = sortedVisibleGames().length ? sortedVisibleGames() : (Array.isArray(state.games)?state.games:[]);
  return `<section class="card wide fix10ExistingGames"><div class="sectionHead"><div><h2>Mevcut Oyunlar</h2><p class="muted">Düzenle butonu doğrudan profesyonel düzenleme formunu açar.</p></div><span class="pill green">${games.length} oyun</span></div>${advancedSearchPanel()}<div class="fix10AdminCardGrid">${games.map(g=>fix10CompactGameCard(g,true)).join('') || '<p class="muted">Oyun bulunamadı.</p>'}</div></section>`;
};
gamesAdmin = function(){
  const tab = state.editingGameId ? 'edit' : (localStorage.getItem(FIX8_GAME_TAB_KEY) || 'add');
  return `<section class="fix10GamesAdmin"><div class="fix8AdminTabs fix10AdminTabs"><button class="btn ${tab==='add'?'primary':''}" data-action="game-admin-tab" data-tab="add">Oyun Ekle</button><button class="btn ${tab==='list'?'primary':''}" data-action="game-admin-tab" data-tab="list">Mevcut Oyunlar</button><button class="btn" data-action="auto-cover-fetch">Kapaksızlara Kapak Öner</button></div>${tab==='edit' ? `${gameEditForm()}${rawgCandidatePanel()}${coverSuggestionPanel()}` : tab==='add' ? `${gameAddForm()}${rawgCandidatePanel()}${coverSuggestionPanel()}` : adminGamesTableFix8()}</section>`;
};

function fix10FeedbackStatusSelect(item, type){ return `<select data-feedback-status="${esc(type)}:${esc(item.id)}"><option ${item.status==='Yeni'?'selected':''}>Yeni</option><option ${item.status==='İnceleniyor'?'selected':''}>İnceleniyor</option><option ${item.status==='Tamamlandı'?'selected':''}>Tamamlandı</option><option ${item.status==='Reddedildi'?'selected':''}>Reddedildi</option></select>`; }
adminGameRequestsPageFix8 = function(){
  const list = fix8LocalList(FIX8_REQUESTS_KEY);
  return `<section class="fix10FeedbackAdmin"><div class="card wide fix10FeedbackHead"><div><span class="eyebrow">Yetkili Oyun İstek Merkezi</span><h2>Oyun İstekleri</h2><p class="muted">Kullanıcıların istediği oyunları durumlandır, notlarını oku ve uygun olanları arşive ekle.</p></div><span class="pill green">${list.length} istek</span></div><div class="fix10FeedbackGrid">${list.map(r=>`<article><div class="fix10FeedbackIcon">💡</div><div><h3>${esc(r.gameTitle)}</h3><small>${esc(r.seriesName||'Seri yok')} • ${esc(r.email||'Anonim')} • ${esc(r.createdAt||'')}</small><p>${esc(r.note||'Not yok')}</p></div><div class="fix10FeedbackActions">${fix10FeedbackStatusSelect(r,'request')}<button class="miniBtn primary" data-action="feedback-mark-done" data-feedback="request:${esc(r.id)}">Tamamla</button></div></article>`).join('') || '<p class="muted">Henüz oyun isteği yok.</p>'}</div></section>`;
};
adminBugReportsPageFix8 = function(){
  const list = fix8LocalList(FIX8_BUGS_KEY);
  return `<section class="fix10FeedbackAdmin"><div class="card wide fix10FeedbackHead bug"><div><span class="eyebrow">Yetkili Hata Takip Merkezi</span><h2>Hata Bildirimleri</h2><p class="muted">Hataları sayfasına göre takip et, durumunu güncelle ve çözülenleri işaretle.</p></div><span class="pill banned">${list.length} hata</span></div><div class="fix10FeedbackGrid bug">${list.map(r=>`<article><div class="fix10FeedbackIcon">🐞</div><div><h3>${esc(r.title)}</h3><small>${esc(r.page||'Sayfa yok')} • ${esc(r.email||'Anonim')} • ${esc(r.createdAt||'')}</small><p>${esc(r.description||'Detay yok')}</p></div><div class="fix10FeedbackActions">${fix10FeedbackStatusSelect(r,'bug')}<button class="miniBtn primary" data-action="feedback-mark-done" data-feedback="bug:${esc(r.id)}">Çözüldü</button></div></article>`).join('') || '<p class="muted">Henüz hata bildirimi yok.</p>'}</div></section>`;
};

gameRequestPageFix8 = function(){
  const mine = fix8LocalList(FIX8_REQUESTS_KEY).filter(r=>!state.session?.email || r.email===state.session.email).slice(0,8);
  return `<section class="fix10FeedbackPage"><div class="fix10FeedbackHero"><span class="eyebrow">Oyun Öneri Merkezi</span><h1>Oyun İste</h1><p>Eklenmesini istediğin oyunu, seri adını ve neden arşive gelmesi gerektiğini yaz. Yetkililer yönetim panelinden görebilir.</p></div><div class="fix8FeedbackLayout"><form id="gameRequestForm" class="card fix10FeedbackForm"><h2>Yeni Oyun İsteği</h2><label class="field">Oyun adı<input name="gameTitle" placeholder="Örn: Metro Exodus" required></label><label class="field">Seri adı<input name="seriesName" placeholder="Varsa seri adı"></label><label class="field">Neden eklenmeli?<textarea name="note" rows="5" placeholder="Kısa açıklama yaz..."></textarea></label><button class="btn primary" type="submit">İsteği Gönder</button></form><section class="card"><h2>Son İsteklerin</h2><div class="fix8FeedbackList">${mine.map(r=>`<article><b>${esc(r.gameTitle)}</b><small>${esc(r.seriesName||'Seri yok')} • ${esc(r.createdAt||'')}</small>${fix8RequestStatusPill(r.status)}</article>`).join('') || '<p class="muted">Henüz oyun isteğin yok.</p>'}</div></section></div></section>`;
};
bugReportPageFix8 = function(){
  const mine = fix8LocalList(FIX8_BUGS_KEY).filter(r=>!state.session?.email || r.email===state.session.email).slice(0,8);
  return `<section class="fix10FeedbackPage"><div class="fix10FeedbackHero bug"><span class="eyebrow">Hata Takip Merkezi</span><h1>Hata Bildir</h1><p>Sayfayı, hatayı ve ne yapınca oluştuğunu yaz. Yetkililer yönetim panelinde takip eder.</p></div><div class="fix8FeedbackLayout"><form id="bugReportForm" class="card fix10FeedbackForm"><h2>Yeni Hata Bildirimi</h2><label class="field">Hata başlığı<input name="title" placeholder="Örn: Düzenle butonu çalışmıyor" required></label><label class="field">Sayfa / kategori<input name="page" placeholder="Örn: Yönetim Paneli / Oyunlar"></label><label class="field">Detay<textarea name="description" rows="5" placeholder="Hatanın detayını yaz..." required></textarea></label><button class="btn primary" type="submit">Hatayı Gönder</button></form><section class="card"><h2>Son Bildirimlerin</h2><div class="fix8FeedbackList">${mine.map(r=>`<article><b>${esc(r.title)}</b><small>${esc(r.page||'Sayfa yok')} • ${esc(r.createdAt||'')}</small>${fix8RequestStatusPill(r.status)}</article>`).join('') || '<p class="muted">Henüz hata bildirimin yok.</p>'}</div></section></div></section>`;
};

const oldOnGameEditFix10 = onGameEdit;
onGameEdit = async function(e){
  e.preventDefault();
  const id = e.currentTarget.dataset.gameEdit;
  const current = state.games.find(g => String(g.id) === String(id));
  if(!current) return setToast('Oyun bulunamadı.');
  state.page = 'Yönetim Paneli'; state.adminPage = 'Oyunlar'; state.editingGameId = id; state.showGameForm = false; state.rawgCandidates = [];
  localStorage.setItem(PAGE_KEY, 'Yönetim Paneli'); localStorage.setItem(ADMIN_TAB_KEY, 'Oyunlar'); localStorage.setItem(FIX8_GAME_TAB_KEY, 'edit');
  render(); setToast('Düzenleme formu açıldı. Butonlar aktif.');
};
const oldOnActionFix10 = onAction;
onAction = async function(e){
  const action = e.currentTarget?.dataset?.action || '';
  if(action === 'fix10-refetch-story'){
    e.preventDefault(); const form = e.currentTarget.closest('form'); if(!form) return; const title=form.elements.title?.value||''; const genre=form.elements.genre?.value||fix10GenreFromTitle(title); if(form.elements.description){ form.elements.description.value = fix10DetailedStory(title, genre); saveGameDraftFromForm(form); } setToast('Detaylı oyun hikayesi Türkçe olarak tekrar çekildi.'); return;
  }
  if(action === 'fix10-refetch-genres'){
    e.preventDefault(); const form = e.currentTarget.closest('form'); if(!form) return; const genre=fix10GenreFromTitle(form.elements.title?.value||''); if(form.elements.genre){ form.elements.genre.value = genre; saveGameDraftFromForm(form); } setToast('Türler Türkçe olarak forma tekrar çekildi.'); return;
  }
  if(action === 'feedback-mark-done'){
    e.preventDefault(); const [type,id]=String(e.currentTarget.dataset.feedback||'').split(':'); const key=type==='bug'?FIX8_BUGS_KEY:FIX8_REQUESTS_KEY; const list=fix8LocalList(key).map(x=>String(x.id)===String(id)?{...x,status:type==='bug'?'Tamamlandı':'Tamamlandı'}:x); fix8SaveLocal(key,list); render(); setToast(type==='bug'?'Hata bildirimi çözüldü işaretlendi.':'Oyun isteği tamamlandı işaretlendi.'); return;
  }
  return oldOnActionFix10(e);
};
const oldBindFix10 = bind;
bind = function(){
  oldBindFix10();
  document.querySelectorAll('[data-series-letter]').forEach(btn=>btn.addEventListener('click', e=>{ e.preventDefault(); state.selectedSeriesLetter = btn.dataset.seriesLetter || ''; render(); }));
  document.querySelectorAll('[data-feedback-status]').forEach(sel=>sel.addEventListener('change', e=>{ const [type,id]=String(sel.dataset.feedbackStatus||'').split(':'); const key=type==='bug'?FIX8_BUGS_KEY:FIX8_REQUESTS_KEY; const list=fix8LocalList(key).map(x=>String(x.id)===String(id)?{...x,status:e.target.value}:x); fix8SaveLocal(key,list); setToast('Durum güncellendi.'); render(); }));
};
try{ render(); }catch(error){ showBootError(error); }


/* v2.2.0 FIX 11 - 4 kolon arşiv/seri, profesyonel modal düzenleme, bakım ve istek/hata ekranı */
const FIX11_VERSION_LABEL = 'v2.2.0 FIX 11';
const FIX11_LOGO = '/assets/hayatimiz-logo.png';
const FIX11_COVER = '/assets/hayatimiz-kapak.png';
function fix11TitleOf(item){ return String(item?.title || item?.name || '').trim() || '#'; }
function fix11Initial(value){ return initialFix7 ? initialFix7(value) : (String(value||'#').trim()[0] || '#').toLocaleUpperCase('tr-TR'); }
function fix11Grouped(items, titleFn){
  const map = new Map();
  (items||[]).forEach(item=>{ const letter = fix11Initial(titleFn(item)); if(!map.has(letter)) map.set(letter, []); map.get(letter).push(item); });
  return TR_ALPHABET_FIX7.concat('#').filter(l=>map.has(l)).map(letter=>({letter, items:map.get(letter).sort((a,b)=>titleFn(a).localeCompare(titleFn(b),'tr'))}));
}
function fix11AlphabetBar(groups, prefix='harf'){
  const active = new Set(groups.map(g=>g.letter));
  return `<section class="fix11AlphabetBar"><div><b>Harfe Git</b><small>${groups.length} harf grubu</small></div><nav>${TR_ALPHABET_FIX7.map(l=>`<a class="${active.has(l)?'active':'disabled'}" href="#${prefix}-${esc(l==='0-9'?'num':routeSlug(l))}">${esc(l)}</a>`).join('')}</nav></section>`;
}
function fix11GameCard(g, admin=false){
  const progress = progressPercent(g) || getGameProgress(g);
  const desc = fix4Description(g).slice(0,88);
  return `<article class="fix11GameCard"><div class="fix11GameCover"><img src="${esc(fix10Cover(g))}" alt="${esc(g.title)}"><span class="scoreBadge">${esc(String(g.score || '8.5'))}</span></div><div class="fix11GameBody"><div class="fix11MetaLine"><span>${esc(g.status || 'Arşiv')}</span>${g.releaseDate?`<small>${esc(formatDateTrFix6(g.releaseDate))}</small>`:''}</div><h3>${esc(g.title)}</h3><p>${esc(desc)}${desc.length>=88?'...':''}</p>${tagChipsHtml(g.tags || g.genre)}<div class="progressLine"><span style="width:${progress}%"></span></div><div class="fix11Actions">${admin?`<button class="miniBtn primary" data-game-edit="${esc(g.id)}">Düzenle</button><button class="miniBtn danger" data-game-delete="${esc(g.id)}">Sil</button>`:`${watchButtonHtml(g)}<button class="miniBtn" data-favorite-game="${esc(g.id)}">${isFavorite(g.id)?'♥':'♡'}</button>`}</div></div></article>`;
}
function fix11AlphabetGameArchive(games){
  const groups = fix11Grouped(games, g=>g.title);
  return `${fix11AlphabetBar(groups,'oyun-harf')}<div class="fix11AlphabetSections">${groups.map(group=>`<section class="fix11LetterSection" id="oyun-harf-${group.letter==='0-9'?'num':esc(routeSlug(group.letter))}"><div class="fix11LetterHead"><div><span>${esc(group.letter)}</span><h2>${esc(group.letter)} Harfindeki Oyunlar</h2></div><b>${group.items.length} oyun</b></div><div class="fix11FourGrid">${group.items.map(g=>fix11GameCard(g,false)).join('')}</div></section>`).join('')}</div>`;
}
gameGrid = function(){
  const games = sortedVisibleGames();
  const adminActions = isStaff() && state.page === 'Yönetim Paneli' && state.adminPage === 'Oyunlar';
  if(!games.length) return '<section class="games fix11FourGrid"><div class="card wide">Oyun bulunamadı.</div></section>';
  if(adminActions) return `<div class="fix11FourGrid adminGrid">${games.map(g=>fix11GameCard(g,true)).join('')}</div>`;
  const title = state.page === 'Favoriler' ? 'Favoriler' : 'Oyun Arşivi';
  return `<section class="fix11ArchivePage"><div class="fix4ArchiveHeader"><div><span class="eyebrow">Profesyonel Arşiv</span><h1>${esc(title)}</h1><p class="muted">Yan yana 4 kart, alfabetik sıralama, harfe git ve taşmayan kompakt görünüm.</p></div><span class="pill green">${games.length} oyun</span></div>${advancedSearchPanel()}${fix11AlphabetGameArchive(games)}</section>`;
};
function fix11SeriesCard(group){
  const first = group.items[0] || {};
  const totalEpisodes = group.items.reduce((a,g)=>a+Number(g.eps||seriesEpisodes(g).length||0),0);
  return `<article class="fix11SeriesCard"><div class="fix11SeriesCover"><img src="${esc(fix10Cover(first))}" alt="${esc(group.name)}"><span>${group.items.length} oyun</span></div><div class="fix11SeriesBody"><h3>${esc(group.name)}</h3><p>${group.items.length} oyun • ${totalEpisodes} bölüm • yönetim sırasına göre</p><div class="fix11SeriesMini">${group.items.slice(0,4).map(g=>`<span><img src="${esc(fix10Cover(g))}" alt="">${esc(g.title)}</span>`).join('')}</div><div class="fix11Actions"><button class="miniBtn primary" data-watch-series="${esc(first.id||'')}">Seriyi İzle</button><button class="miniBtn" data-admin="Seri İzleme">Sırala</button></div></div></article>`;
}
seriesDirectoryPage = function(){
  const groups = sortedSeriesGroups(state.games).sort((a,b)=>a.name.localeCompare(b.name,'tr'));
  const letterGroups = fix11Grouped(groups, g=>g.name);
  return `<section class="fix11SeriesPage"><div class="seriesDirectoryHero"><span class="eyebrow">Profesyonel Seri Arşivi</span><h1>Seriler</h1><p>Seriler de oyun arşivi gibi 4 kolon, alfabetik şerit ve harfe git yapısıyla gösterilir.</p><span class="pill green">${groups.length} seri</span></div>${fix11AlphabetBar(letterGroups,'seri-harf')}<div class="fix11AlphabetSections">${letterGroups.map(group=>`<section class="fix11LetterSection" id="seri-harf-${group.letter==='0-9'?'num':esc(routeSlug(group.letter))}"><div class="fix11LetterHead"><div><span>${esc(group.letter)}</span><h2>${esc(group.letter)} Harfindeki Seriler</h2></div><b>${group.items.length} seri</b></div><div class="fix11FourGrid series">${group.items.map(fix11SeriesCard).join('')}</div></section>`).join('')}</div></section>`;
};
function fix11GameFormFields(d, mode='add'){
  const opts = ['Devam Ediyor','Tamamlandı','Popüler','Yakında'].map(st=>`<option ${d.status===st?'selected':''}>${st}</option>`).join('');
  const dateValue = formatDateTrFix6(d.releaseDate || '');
  const descPreview = (d.description || fix10DetailedStory(d.title, d.genre)).slice(0,280);
  return `<div class="fix11GameEditor"><section class="fix11EditorMain"><div class="sectionHead"><div><span class="eyebrow">${mode==='edit'?'Ayrı Pencerede Düzenleme':'Boş Formla Yeni Oyun'}</span><h2>${mode==='edit'?'Mevcut Oyunu Düzenle':'Yeni Oyun Ekle'}</h2><p class="muted">Oyun ekle açılınca form boş gelir. Hikaye/açıklama ve bölüm listesi profesyonel bloklar halinde düzenlenir.</p></div></div><div class="statusPickBar"><button class="tagBtn ${d.status==='Tamamlandı'?'active':''}" type="button" data-status-pick="Tamamlandı">Tamamlanan</button><button class="tagBtn ${d.status==='Devam Ediyor'?'active':''}" type="button" data-status-pick="Devam Ediyor">Devam Eden</button><button class="tagBtn ${d.status==='Yakında'?'active':''}" type="button" data-status-pick="Yakında">Yakında</button></div><div class="fix11FormGrid"><label class="field">Oyun Adı *<input name="title" required placeholder="Örn: A Plague Tale: Innocence" value="${esc(d.title)}" /></label><label class="field">Seri Adı<input name="seriesName" placeholder="Örn: A Plague Tale" value="${esc(d.seriesName || '')}" /></label><label class="field">Çıkış Tarihi <small>gün.ay.yıl</small><input name="releaseDate" placeholder="14.05.2019" value="${esc(dateValue)}" /></label><label class="field">Durum<select name="status">${opts}</select></label><label class="field wideField">Türler<input name="genre" placeholder="Aksiyon-macera, gizlilik, hikaye odaklı" value="${esc(d.genre)}" /></label><div class="field wideField"><span>Etiketler</span>${tagButtonsHtml(d.tags)}</div><label class="field">Toplam Bölüm<input name="eps" type="number" min="0" value="${esc(String(d.eps ?? 0))}" /></label><label class="field">İzlenen Bölüm<input name="watchedEps" type="number" min="0" value="${esc(String(d.watchedEps ?? 0))}" /></label><label class="field">Puan<input name="score" type="number" min="0" max="10" step="0.1" value="${esc(String(d.score ?? 8.5))}" /></label><label class="field">Seri Sıra No<input name="seriesOrder" type="number" min="0" value="${esc(String(d.seriesOrder ?? 0))}" /></label><label class="field wideField">Kapak URL<div class="inlineField"><input name="cover" placeholder="https://..." value="${esc(d.cover)}" /><button class="miniBtn" type="button" data-action="${mode==='edit'?'auto-game-meta-edit':'auto-game-meta'}">Kapak / Meta Çek</button></div></label><label class="field wideField">YouTube Playlist<input name="playlistUrl" placeholder="https://youtube.com/playlist?list=..." value="${esc(d.playlistUrl || '')}" /></label><label class="field wideField">Tek Video URL<input name="videoUrl" placeholder="https://youtube.com/watch?v=..." value="${esc(d.videoUrl || '')}" /></label><label class="field wideField fix11StoryField"><span>Oyunun Hikayesi / Açıklama</span><small>Detaylı Türkçe hikaye burada tutulur.</small><textarea name="description" rows="6" placeholder="Hikayeyi Tekrar Çek butonu detaylı Türkçe hikaye yazar.">${esc(d.description || '')}</textarea><button class="miniBtn" type="button" data-action="fix10-refetch-story">Hikayeyi Tekrar Çek</button></label><label class="field wideField episodeImportField fix11EpisodeField"><span>Profesyonel Bölüm Listesi</span><small>Playlistten gelen bölümler kart gibi önizlenir, teknik veri gizlenir.</small>${episodeImportPreview(d.episodesText, d.episodes)}<textarea name="episodesText" rows="4" class="technicalEpisodes" placeholder="Teknik bölüm verisi otomatik oluşur">${esc(d.episodesText || episodesToText(d.episodes || []))}</textarea><div class="rowActions"><button class="miniBtn" type="button" data-action="toggle-technical-episodes">Teknik Veriyi Göster</button><button class="miniBtn" type="button" data-action="${mode==='edit'?'estimate-playlist-episodes-edit':'estimate-playlist-episodes'}">Playlist Bölümleri Çek</button></div></label></div><div class="fix11FormActions"><button class="btn" type="button" data-action="${mode==='edit'?'auto-game-meta-edit':'auto-game-meta'}">Meta + Kapak Çek</button><button class="btn" type="button" data-action="fix10-refetch-story">Hikayeyi Tekrar Çek</button><button class="btn" type="button" data-action="fix10-refetch-genres">Türleri Tekrar Çek</button><button class="btn primary" type="submit">${mode==='edit'?'Oyunu Güncelle':'Oyunu Kaydet'}</button></div></section><aside class="fix11PreviewSide"><div class="fix11PreviewSticky"><h3>Kapak Önizleme</h3><div class="fix11CoverPreview"><img src="${esc(d.cover || FIX11_COVER)}" alt="${esc(d.title||'Oyun')}"></div><article class="fix11PreviewCard"><span class="scoreBadge">${esc(String(d.score || '8.5'))}</span><h2>${esc(d.title || 'Oyun adı')}</h2>${tagChipsHtml(d.tags || d.genre)}<p>${esc(descPreview)}${descPreview.length>=280?'...':''}</p><div class="fix6MetaGrid"><div><small>Çıkış</small><b>${esc(dateValue || '-')}</b></div><div><small>Tür</small><b>${esc(d.genre || 'Genel')}</b></div><div><small>Durum</small><b>${esc(d.status || 'Devam Ediyor')}</b></div><div><small>Bölüm</small><b>${esc(String(d.watchedEps||0))}/${esc(String(d.eps||0))}</b></div></div></article></div></aside></div>`;
}
gameFormFields = fix11GameFormFields;
gameAddForm = function(){ const d = { ...DEFAULT_GAME_DRAFT }; return `<form class="card soft gameForm fix11GameForm" id="gameAddForm" autocomplete="off">${fix11GameFormFields(d,'add')}</form>`; };
gameEditForm = function(){ const current = state.games.find(g=>String(g.id)===String(state.editingGameId)); if(!current) return ''; return `<div class="fix11EditOverlay"><form class="card soft gameForm editGameForm fix11GameForm fix11EditModal" id="gameEditForm" autocomplete="off"><button class="close" type="button" data-action="close-game-edit">×</button>${fix11GameFormFields(current,'edit')}</form></div>`; };
adminGamesTableFix8 = function(){
  const games = Array.isArray(state.games)?state.games:[];
  return `<section class="card wide fix11ExistingGames"><div class="sectionHead"><div><h2>Mevcut Oyunlar</h2><p class="muted">Düzenle butonu formu ayrı pencerede açar.</p></div><span class="pill green">${games.length} oyun</span></div>${advancedSearchPanel()}<div class="fix11FourGrid admin">${games.map(g=>fix11GameCard(g,true)).join('') || '<p class="muted">Oyun bulunamadı.</p>'}</div></section>`;
};
gamesAdmin = function(){
  const tab = state.editingGameId ? (localStorage.getItem(FIX8_GAME_TAB_KEY) || 'list') : (localStorage.getItem(FIX8_GAME_TAB_KEY) || 'add');
  const modal = state.editingGameId ? gameEditForm() : '';
  return `<section class="fix11GamesAdmin"><div class="fix8AdminTabs fix10AdminTabs"><button class="btn ${tab==='add'?'primary':''}" data-action="game-admin-tab" data-tab="add">Oyun Ekle</button><button class="btn ${tab==='list'?'primary':''}" data-action="game-admin-tab" data-tab="list">Mevcut Oyunlar</button><button class="btn" data-action="auto-cover-fetch">Kapaksızlara Kapak Öner</button></div>${tab==='add' ? `${gameAddForm()}${rawgCandidatePanel()}${coverSuggestionPanel()}` : adminGamesTableFix8()}${modal}</section>`;
};
function fix11FeedbackHero(kind){
  const isBug = kind==='bug';
  return `<div class="fix11FeedbackHero ${isBug?'bug':''}"><img src="${FIX11_LOGO}" alt="Hayatımız Oyun"><div><span class="eyebrow">${isBug?'Hata Takip Merkezi':'Oyun Öneri Merkezi'}</span><h1>${isBug?'Hata Bildir':'Oyun İste'}</h1><p>${isBug?'Gördüğün hatayı sayfa, adım ve detaylarıyla gönder. Yetkililer yönetim panelinden takip eder.':'Arşive eklenmesini istediğin oyunu gönder. Yetkililer isteği inceleyip arşive alabilir.'}</p></div></div>`;
}
gameRequestPageFix8 = function(){
  const mine = fix8LocalList(FIX8_REQUESTS_KEY).filter(r=>!state.session?.email || r.email===state.session.email).slice(0,8);
  return `<section class="fix11FeedbackPage">${fix11FeedbackHero('request')}<div class="fix11FeedbackLayout"><form id="gameRequestForm" class="card fix11FeedbackForm"><h2>Yeni Oyun İsteği</h2><label class="field">Oyun adı<input name="gameTitle" placeholder="Örn: Metro Exodus" required></label><label class="field">Seri adı<input name="seriesName" placeholder="Varsa seri adı"></label><label class="field">Neden eklenmeli?<textarea name="note" rows="5" placeholder="Oyunun neden arşive gelmesini istediğini yaz..."></textarea></label><button class="btn primary" type="submit">İsteği Gönder</button></form><section class="card fix11UserList"><h2>Son İsteklerin</h2>${mine.map(r=>`<article><b>${esc(r.gameTitle)}</b><small>${esc(r.seriesName||'Seri yok')} • ${esc(r.createdAt||'')}</small>${fix8RequestStatusPill(r.status)}</article>`).join('') || '<p class="muted">Henüz oyun isteğin yok.</p>'}</section></div></section>`;
};
bugReportPageFix8 = function(){
  const mine = fix8LocalList(FIX8_BUGS_KEY).filter(r=>!state.session?.email || r.email===state.session.email).slice(0,8);
  return `<section class="fix11FeedbackPage">${fix11FeedbackHero('bug')}<div class="fix11FeedbackLayout"><form id="bugReportForm" class="card fix11FeedbackForm"><h2>Yeni Hata Bildirimi</h2><label class="field">Hata başlığı<input name="title" placeholder="Örn: Düzenle butonu çalışmıyor" required></label><label class="field">Sayfa / kategori<input name="page" placeholder="Örn: Yönetim Paneli / Oyunlar"></label><label class="field">Detay<textarea name="description" rows="5" placeholder="Hata nasıl oluştu? Hangi adımları izledin?" required></textarea></label><button class="btn primary" type="submit">Hatayı Gönder</button></form><section class="card fix11UserList"><h2>Son Bildirimlerin</h2>${mine.map(r=>`<article><b>${esc(r.title)}</b><small>${esc(r.page||'Sayfa yok')} • ${esc(r.createdAt||'')}</small>${fix8RequestStatusPill(r.status)}</article>`).join('') || '<p class="muted">Henüz hata bildirimin yok.</p>'}</section></div></section>`;
};
maintenancePage = function(){
  const percent = Math.max(0, Math.min(100, Number(state.maintenance?.percent || state.maintenance?.progress || 65)));
  const eta = String(state.maintenance?.eta || '').trim();
  const notes = String(state.maintenance?.updates || state.maintenance?.notes || 'Arayüz iyileştirmeleri, oyun arşivi düzeni ve seri izleme sistemi güncelleniyor.').split('\n').map(x=>x.trim()).filter(Boolean).slice(0,5);
  return html`<section class="fix11MaintenancePublic"><div class="fix11MaintenanceBg"><img src="${FIX11_COVER}" alt="Hayatımız Oyun Kapak"></div><div class="fix11MaintenanceCard"><img class="fix11MaintenanceLogo" src="${FIX11_LOGO}" alt="Hayatımız Oyun"><span class="eyebrow">Bakım Modu</span><h1>Hayatımız Oyun güncelleniyor.</h1><p>${esc(state.maintenance?.message || 'Site kısa süreli profesyonel bakımda. Güncelleme tamamlanınca arşiv tekrar açılacak.')}</p><div class="fix11Percent"><div><b>%${percent}</b><span>Tamamlandı</span></div><div class="progressLine large"><span style="width:${percent}%"></span></div></div>${eta?`<div class="maintenanceEta"><span>Tahmini açılış</span><b>${esc(eta)}</b></div>`:''}<div class="maintenancePublicNotes"><b>Güncelleme Notları</b>${notes.map(n=>`<span>${esc(n)}</span>`).join('')}</div><div class="authButtons"><button class="btn primary" data-action="open-login">Yetkili Girişi</button>${isStaff()?'<button class="btn" data-admin="Bakım Modu">Yönetim Paneli</button>':''}</div></div></section>`;
};
const oldOnActionFix11 = onAction;
onAction = async function(e){
  const action = e.currentTarget?.dataset?.action || '';
  if(action === 'game-admin-tab'){
    e.preventDefault();
    const tab = e.currentTarget.dataset.tab || 'add';
    localStorage.setItem(FIX8_GAME_TAB_KEY, tab);
    if(tab === 'add'){ clearGameDraft(); state.editingGameId = null; state.rawgCandidates = []; state.coverSuggestions = []; }
    if(tab === 'list'){ state.editingGameId = null; }
    render();
    return;
  }
  if(action === 'toggle-game-form'){
    e.preventDefault(); clearGameDraft(); state.editingGameId = null; localStorage.setItem(FIX8_GAME_TAB_KEY,'add'); render(); return;
  }
  if(action === 'close-game-edit'){
    e.preventDefault(); state.editingGameId = null; localStorage.setItem(FIX8_GAME_TAB_KEY,'list'); render(); return;
  }
  return oldOnActionFix11(e);
};
const oldOnGameEditFix11 = onGameEdit;
onGameEdit = async function(e){
  e.preventDefault();
  const id = e.currentTarget.dataset.gameEdit;
  const current = state.games.find(g => String(g.id) === String(id));
  if(!current) return setToast('Oyun bulunamadı.');
  state.page = 'Yönetim Paneli'; state.adminPage = 'Oyunlar'; state.editingGameId = id; state.showGameForm = false; state.rawgCandidates = [];
  localStorage.setItem(PAGE_KEY, 'Yönetim Paneli'); localStorage.setItem(ADMIN_TAB_KEY, 'Oyunlar'); localStorage.setItem(FIX8_GAME_TAB_KEY, 'list');
  render(); setToast('Düzenleme penceresi açıldı.');
};
try{ render(); }catch(error){ showBootError(error); }


/* v2.2.0 FIX 12 - kart yazıları, durum şeritleri, çalışan hikaye/tür/meta butonları */
const FIX12_VERSION_LABEL = 'v2.2.0 FIX 12';
const FIX12_SERIES_STATUS_KEY = 'hayatimiz_series_status_filter_fix12';

function fix12SelectedSeriesStatus(){ return localStorage.getItem(FIX12_SERIES_STATUS_KEY) || 'Tümü'; }
function fix12SetSeriesStatus(value){ localStorage.setItem(FIX12_SERIES_STATUS_KEY, value || 'Tümü'); }
function fix12StatusTabs(activePage){
  const items = [
    { label:'Tüm Oyunlar', page:'Oyun Arşivi', status:'Tümü' },
    { label:'Tamamlanan Seriler', page:'Tamamlanan', status:'Tamamlandı' },
    { label:'Devam Eden Seriler', page:'Devam Eden', status:'Devam Ediyor' },
    { label:'Yakında Gelecek Seriler', page:'Yakında', status:'Yakında' }
  ];
  return `<section class="fix12StatusTabs">${items.map(item=>`<button class="tagBtn ${(activePage===item.page || activePage===item.status || (activePage==='Tümü' && item.status==='Tümü'))?'active':''}" data-page="${esc(item.page)}">${esc(item.label)}</button>`).join('')}</section>`;
}
function fix12SeriesStatusTabs(active){
  const items = ['Tümü','Tamamlandı','Devam Ediyor','Yakında'];
  const labels = { 'Tümü':'Tüm Seriler', 'Tamamlandı':'Tamamlanan Seriler', 'Devam Ediyor':'Devam Eden Seriler', 'Yakında':'Yakında Gelecek Seriler' };
  return `<section class="fix12StatusTabs series">${items.map(item=>`<button class="tagBtn ${active===item?'active':''}" data-action="fix12-series-status" data-status="${esc(item)}">${esc(labels[item])}</button>`).join('')}</section>`;
}
function fix12GameStatusMatch(g, status){
  if(!status || status === 'Tümü') return true;
  if(status === 'Tamamlandı') return g.status === 'Tamamlandı' || progressPercent(g) >= 100;
  if(status === 'Devam Ediyor') return g.status === 'Devam Ediyor' || (Number(g.eps||0)>0 && progressPercent(g) < 100 && g.status !== 'Yakında');
  if(status === 'Yakında') return g.status === 'Yakında';
  return true;
}
function fix12DetailedStory(title='', genre=''){
  const name = String(title || 'Bu oyun').trim() || 'Bu oyun';
  const key = normalizeSearchText(name);
  const g = String(genre || fix10GenreFromTitle(name)).trim();
  if(key.includes('a way out') || key.includes('way out')){
    return `${name}, birbirinden farklı geçmişlere ve motivasyonlara sahip iki mahkûm olan Leo ve Vincent'ın hapishaneden kaçışını ve ardından ortak düşmanlarından intikam alma süreçlerini anlatan tamamen eşli (co-op) bir aksiyon-macera oyunudur. Hikaye, iki karakterin güven kurmasını, birlikte plan yapmasını ve her bölümde farklı oynanış görevleriyle ilerlemesini merkeze alır. Oyuncular, kaçıştan kovalamacalara, gizlilikten çatışmaya kadar birçok sahneyi birlikte yönetir. Oyun özellikle karakterlerin kişisel hikayelerini, aile bağlarını ve finalde verilen dramatik kararları öne çıkarır.`;
  }
  if(key.includes('plague')){
    return `${name}, karanlık Orta Çağ atmosferinde geçen hikaye odaklı bir macera oyunudur. Amicia ve Hugo'nun hayatta kalma mücadelesi, salgın, savaş, fanatik güçler ve doğaüstü tehditlerin gölgesinde bölüm bölüm ilerler. Oyuncu, gizlilik, çevre kullanımı, bulmaca çözme ve sınırlı kaynak yönetimiyle iki kardeşin zorlu yolculuğuna eşlik eder. Hikaye boyunca aile bağı, korku, umut, fedakârlık ve masumiyetin kaybı gibi temalar güçlü biçimde işlenir.`;
  }
  if(key.includes('assassin')){
    return `${name}, tarihi olaylar, kişisel intikam ve gizli örgütlerin çatışması üzerine kurulu aksiyon-macera türünde bir hikaye sunar. Oyuncu, ana karakterin geçmişinden gelen motivasyonları takip ederken halkını koruma, büyük bir komployu ortaya çıkarma ve güçlü düşmanlara karşı mücadele etme sürecine girer. Açık dünya keşfi, gizlilik, parkur, yakın dövüş ve bölüm bölüm ilerleyen görev yapısı hikayeyi destekler. Anlatı, karakterin kişisel dönüşümünü ve suikastçı geleneğinin temellerine uzanan olayları anlaşılır şekilde ortaya koyar.`;
  }
  if(key.includes('resident')){
    return `${name}, hayatta kalma korkusu ve aksiyon öğelerini birleştiren gerilim odaklı bir hikaye anlatır. Oyuncu, biyolojik tehditlerin, karanlık deneylerin ve kapalı alanlardaki tehlikelerin ortasında kaynaklarını dikkatli kullanarak ilerler. Hikaye, karakterlerin hayatta kalma çabasını, salgının arkasındaki sırları ve düşmanların yarattığı baskıyı bölüm bölüm açığa çıkarır.`;
  }
  if(key.includes('witcher')){
    return `${name}, canavar avcılığı, siyasi entrikalar, aile bağı ve kişisel seçimler üzerine kurulu geniş bir rol yapma hikayesi sunar. Oyuncu, görevlerde verdiği kararlarla karakterlerin kaderini ve dünyanın gidişatını etkiler. Ana hikaye; savaş, kader, sadakat, ahlaki ikilemler ve kişisel sorumluluk gibi temalar etrafında gelişir.`;
  }
  if(key.includes('cyberpunk')){
    return `${name}, distopik bir gelecekte kimlik, güç ve hayatta kalma mücadelesini anlatan aksiyon-RPG türünde bir oyundur. Oyuncu, Night City'nin şirket baskısı, suç ağları ve ileri teknolojiyle şekillenen karanlık sokaklarında kendi geleceğini belirlemeye çalışır. Hikaye, karakterin bedenini, zihnini ve kararlarını etkileyen büyük bir tehdidin etrafında gelişir.`;
  }
  return `${name}, ${g} türlerini birleştiren hikaye odaklı bir oyun deneyimi sunar. Oyuncu, ana karakterin hedefleri, karşılaştığı düşmanlar ve içinde bulunduğu dünyanın kuralları üzerinden ilerleyen bölümlerde keşif, mücadele ve karar anlarıyla karşılaşır. Hikaye, oyunun atmosferini, karakterlerin motivasyonlarını ve bölüm bölüm gelişen ana çatışmayı anlaşılır biçimde takip etmeyi sağlar. Bu açıklama arşivde oyunun detaylı Türkçe hikaye özeti olarak kullanılabilir.`;
}
function fix12GenreFromTitle(title=''){
  const key = normalizeSearchText(title);
  if(key.includes('a way out') || key.includes('way out')) return 'Aksiyon-macera, eşli oynanış, co-op, hikaye odaklı';
  if(key.includes('plague')) return 'Macera, gizlilik, hikaye odaklı, bulmaca, dramatik anlatı';
  return fix10GenreFromTitle(title);
}
function fix12UpdateFormPreview(form){
  if(!form) return;
  const cover = getFormValue(form,'cover') || FIX11_COVER;
  form.querySelectorAll('.fix11CoverPreview img,.fix12CoverPreview img,.fix10CoverFrame img,.coverPreview img').forEach(img=>{ img.src = cover; });
  const title = getFormValue(form,'title') || 'Oyun adı';
  form.querySelectorAll('.fix11PreviewCard h2,.fix10PreviewCard h2').forEach(el=>{ el.textContent = title; });
  const story = getFormValue(form,'description') || fix12DetailedStory(title, getFormValue(form,'genre'));
  form.querySelectorAll('.fix11PreviewCard p,.fix10PreviewCard p').forEach(el=>{ el.textContent = story.slice(0,280) + (story.length>280?'...':''); });
}
function fix12PatchForm(form, patch){
  if(!form || !patch) return;
  Object.entries(patch).forEach(([key,value])=>setFormValue(form, key, value));
  updateOpenGameFormSnapshot(form);
  fix12UpdateFormPreview(form);
}
async function fix12MetaFill(form){
  if(!form) return setToast('Oyun formu açık değil.');
  const title = getFormValue(form,'title').trim();
  if(!title) return setToast('Önce oyun adını yaz.');
  const current = readGameDraftFromForm(form);
  let meta = localGameMeta(title);
  try{
    const data = await api('game-meta', { adminToken: state.session?.adminToken, title });
    if(data?.meta) meta = { ...meta, ...data.meta };
    state.rawgCandidates = data?.candidates || [];
  }catch{}
  const genre = meta.genre || fix12GenreFromTitle(title);
  const patch = {
    title: meta.title || current.title || title,
    genre: genre,
    releaseDate: normalizeReleaseDate(meta.releaseDate || meta.released || current.releaseDate || ''),
    score: Number(meta.score || current.score || 8.5),
    cover: meta.cover || current.cover || '',
    description: current.description || fix12DetailedStory(title, genre),
    tags: current.tags || '',
    seriesName: current.seriesName || '',
    playlistUrl: current.playlistUrl || '',
    videoUrl: current.videoUrl || '',
    eps: current.eps || 0,
    watchedEps: current.watchedEps || 0,
    seriesOrder: current.seriesOrder || 0,
    episodesText: current.episodesText || ''
  };
  fix12PatchForm(form, patch);
  setToast(state.rawgCandidates?.length ? 'Meta, kapak ve türler forma geldi. RAWG kapak önerileri de hazır.' : 'Meta, kapak, tür ve hikaye forma işlendi.');
}
function fix12ArchiveGameCard(g, admin=false){
  const progress = progressPercent(g) || getGameProgress(g);
  const desc = fix4Description(g).slice(0,165);
  return `<article class="fix12GameCard"><div class="fix12GameCover"><img src="${esc(fix10Cover(g))}" alt="${esc(g.title)}"><span class="scoreBadge">${esc(String(g.score || '8.5'))}</span></div><div class="fix12GameBody"><div class="fix12MetaLine"><span>${esc(g.status || 'Arşiv')}</span>${g.releaseDate?`<small>${esc(formatDateTrFix6(g.releaseDate))}</small>`:''}</div><h3>${esc(g.title)}</h3><p>${esc(desc)}${desc.length>=165?'...':''}</p>${tagChipsHtml(g.tags || g.genre)}<div class="fix12ProgressMeta"><small>${Number(g.watchedEps||0)}/${Number(g.eps||0)} bölüm</small><b>%${progress}</b></div><div class="progressLine"><span style="width:${progress}%"></span></div><div class="fix12Actions">${admin?`<button class="miniBtn primary" data-game-edit="${esc(g.id)}">Düzenle</button><button class="miniBtn danger" data-game-delete="${esc(g.id)}">Sil</button>`:`${watchButtonHtml(g)}<button class="miniBtn" data-favorite-game="${esc(g.id)}">${isFavorite(g.id)?'♥':'♡'}</button>`}</div></div></article>`;
}
function fix12AlphabetGameArchive(games){
  const groups = fix11Grouped(games, g=>g.title);
  return `${fix11AlphabetBar(groups,'oyun-harf')}<div class="fix12AlphabetSections">${groups.map(group=>`<section class="fix12LetterSection" id="oyun-harf-${group.letter==='0-9'?'num':esc(routeSlug(group.letter))}"><div class="fix11LetterHead"><div><span>${esc(group.letter)}</span><h2>${esc(group.letter)} Harfindeki Oyunlar</h2></div><b>${group.items.length} oyun</b></div><div class="fix12FourGrid">${group.items.map(g=>fix12ArchiveGameCard(g,false)).join('')}</div></section>`).join('')}</div>`;
}
gameGrid = function(){
  const games = sortedVisibleGames();
  const adminActions = isStaff() && state.page === 'Yönetim Paneli' && state.adminPage === 'Oyunlar';
  if(!games.length) return '<section class="games fix12FourGrid"><div class="card wide">Oyun bulunamadı.</div></section>';
  if(adminActions) return `<div class="fix12FourGrid adminGrid">${games.map(g=>fix12ArchiveGameCard(g,true)).join('')}</div>`;
  const title = state.page === 'Favoriler' ? 'Favoriler' : 'Oyun Arşivi';
  return `<section class="fix12ArchivePage"><div class="fix4ArchiveHeader"><div><span class="eyebrow">Profesyonel Arşiv</span><h1>${esc(title)}</h1><p class="muted">Yan yana 4 kart, alfabetik sıralama, harfe git ve yazıları tam görünen kompakt görünüm.</p></div><span class="pill green">${games.length} oyun</span></div>${fix12StatusTabs(state.page)}${advancedSearchPanel()}${fix12AlphabetGameArchive(games)}</section>`;
};
function fix12SeriesCard(group){
  const first = group.items[0] || {};
  const totalEpisodes = group.items.reduce((a,g)=>a+Number(g.eps||seriesEpisodes(g).length||0),0);
  const desc = group.items.map(g=>g.title).slice(0,3).join(', ');
  return `<article class="fix12SeriesCard"><div class="fix12SeriesCover"><img src="${esc(fix10Cover(first))}" alt="${esc(group.name)}"><span>${group.items.length} oyun</span></div><div class="fix12SeriesBody"><h3>${esc(group.name)}</h3><p>${esc(desc || 'Seri oyunları')} • ${totalEpisodes} bölüm</p><div class="fix12SeriesMini">${group.items.slice(0,4).map(g=>`<span><img src="${esc(fix10Cover(g))}" alt="">${esc(g.title)}</span>`).join('')}</div><div class="fix12Actions"><button class="miniBtn primary" data-watch-series="${esc(first.id||'')}">Seriyi İzle</button><button class="miniBtn" data-admin="Seri İzleme">Sırala</button></div></div></article>`;
}
seriesDirectoryPage = function(){
  const status = fix12SelectedSeriesStatus();
  const baseGames = state.games.filter(g=>fix12GameStatusMatch(g, status));
  const groups = sortedSeriesGroups(baseGames).sort((a,b)=>a.name.localeCompare(b.name,'tr'));
  const letterGroups = fix11Grouped(groups, g=>g.name);
  return `<section class="fix12SeriesPage"><div class="seriesDirectoryHero"><span class="eyebrow">Profesyonel Seri Arşivi</span><h1>Seriler</h1><p>Seriler de oyun arşivi gibi 4 kolon, alfabetik şerit ve harfe git yapısıyla gösterilir.</p><span class="pill green">${groups.length} seri</span></div>${fix12SeriesStatusTabs(status)}${fix11AlphabetBar(letterGroups,'seri-harf')}<div class="fix12AlphabetSections">${letterGroups.map(group=>`<section class="fix12LetterSection" id="seri-harf-${group.letter==='0-9'?'num':esc(routeSlug(group.letter))}"><div class="fix11LetterHead"><div><span>${esc(group.letter)}</span><h2>${esc(group.letter)} Harfindeki Seriler</h2></div><b>${group.items.length} seri</b></div><div class="fix12FourGrid series">${group.items.map(fix12SeriesCard).join('')}</div></section>`).join('') || '<section class="card wide"><h2>Seri bulunamadı</h2><p class="muted">Bu filtrede seri yok.</p></section>'}</div></section>`;
};
function fix12GameFormFields(d, mode='add'){
  const opts = ['Devam Ediyor','Tamamlandı','Popüler','Yakında'].map(st=>`<option ${d.status===st?'selected':''}>${st}</option>`).join('');
  const dateValue = formatDateTrFix6(d.releaseDate || '');
  const descPreview = (d.description || fix12DetailedStory(d.title, d.genre)).slice(0,280);
  return `<div class="fix12GameEditor"><section class="fix12EditorMain"><div class="sectionHead"><div><span class="eyebrow">${mode==='edit'?'Ayrı Pencerede Düzenleme':'Boş Formla Yeni Oyun'}</span><h2>${mode==='edit'?'Mevcut Oyunu Düzenle':'Yeni Oyun Ekle'}</h2><p class="muted">Butonlar formu silmeden çalışır. Hikaye ve türler Türkçe olarak forma yazılır.</p></div></div><div class="statusPickBar"><button class="tagBtn ${d.status==='Tamamlandı'?'active':''}" type="button" data-status-pick="Tamamlandı">Tamamlanan</button><button class="tagBtn ${d.status==='Devam Ediyor'?'active':''}" type="button" data-status-pick="Devam Ediyor">Devam Eden</button><button class="tagBtn ${d.status==='Yakında'?'active':''}" type="button" data-status-pick="Yakında">Yakında</button></div><div class="fix12FormGrid"><label class="field">Oyun Adı *<input name="title" required placeholder="Örn: A Way Out" value="${esc(d.title)}" /></label><label class="field">Seri Adı<input name="seriesName" placeholder="Örn: A Way Out" value="${esc(d.seriesName || '')}" /></label><label class="field">Çıkış Tarihi <small>gün.ay.yıl</small><input name="releaseDate" placeholder="23.03.2018" value="${esc(dateValue)}" /></label><label class="field">Durum<select name="status">${opts}</select></label><label class="field wideField">Türler<div class="inlineField"><input name="genre" placeholder="Aksiyon-macera, eşli oynanış, co-op" value="${esc(d.genre)}" /><button class="miniBtn" type="button" data-action="fix12-refetch-genres">Türleri Tekrar Çek</button></div></label><div class="field wideField"><span>Etiketler</span>${tagButtonsHtml(d.tags)}</div><label class="field">Toplam Bölüm<input name="eps" type="number" min="0" value="${esc(String(d.eps ?? 0))}" /></label><label class="field">İzlenen Bölüm<input name="watchedEps" type="number" min="0" value="${esc(String(d.watchedEps ?? 0))}" /></label><label class="field">Puan<input name="score" type="number" min="0" max="10" step="0.1" value="${esc(String(d.score ?? 8.5))}" /></label><label class="field">Seri Sıra No<input name="seriesOrder" type="number" min="0" value="${esc(String(d.seriesOrder ?? 0))}" /></label><label class="field wideField">Kapak URL<div class="inlineField"><input name="cover" placeholder="https://..." value="${esc(d.cover)}" /><button class="miniBtn" type="button" data-action="${mode==='edit'?'auto-game-meta-edit':'auto-game-meta'}">Kapak / Meta Çek</button></div></label><label class="field wideField">YouTube Playlist<input name="playlistUrl" placeholder="https://youtube.com/playlist?list=..." value="${esc(d.playlistUrl || '')}" /></label><label class="field wideField">Tek Video URL<input name="videoUrl" placeholder="https://youtube.com/watch?v=..." value="${esc(d.videoUrl || '')}" /></label><label class="field wideField fix12StoryField"><span>Oyunun Hikayesi / Açıklama</span><small>Örnek: karakterlerin geçmişi, motivasyonu, ana çatışması ve oynanış akışı.</small><textarea name="description" rows="7" placeholder="Hikayeyi Tekrar Çek butonu detaylı Türkçe oyun hikayesi yazar.">${esc(d.description || '')}</textarea><button class="miniBtn primary" type="button" data-action="fix12-refetch-story">Hikayeyi Tekrar Çek</button></label><label class="field wideField episodeImportField fix12EpisodeField"><span>Profesyonel Bölüm Listesi</span><small>Playlistten gelen bölümler kart önizleme olarak gösterilir, teknik veri gizlenir.</small>${episodeImportPreview(d.episodesText, d.episodes)}<textarea name="episodesText" rows="4" class="technicalEpisodes" placeholder="Teknik bölüm verisi otomatik oluşur">${esc(d.episodesText || episodesToText(d.episodes || []))}</textarea><div class="rowActions"><button class="miniBtn" type="button" data-action="toggle-technical-episodes">Teknik Veriyi Göster</button><button class="miniBtn" type="button" data-action="${mode==='edit'?'estimate-playlist-episodes-edit':'estimate-playlist-episodes'}">Playlist Bölümleri Çek</button></div></label></div><div class="fix12FormActions"><button class="btn" type="button" data-action="${mode==='edit'?'auto-game-meta-edit':'auto-game-meta'}">Meta + Kapak Çek</button><button class="btn" type="button" data-action="fix12-refetch-story">Hikayeyi Tekrar Çek</button><button class="btn" type="button" data-action="fix12-refetch-genres">Türleri Tekrar Çek</button><button class="btn primary" type="submit">${mode==='edit'?'Oyunu Güncelle':'Oyunu Kaydet'}</button></div></section><aside class="fix12PreviewSide"><div class="fix12PreviewSticky"><h3>Kapak Önizleme</h3><div class="fix12CoverPreview"><img src="${esc(d.cover || FIX11_COVER)}" alt="${esc(d.title||'Oyun')}"></div><article class="fix11PreviewCard"><span class="scoreBadge">${esc(String(d.score || '8.5'))}</span><h2>${esc(d.title || 'Oyun adı')}</h2>${tagChipsHtml(d.tags || d.genre)}<p>${esc(descPreview)}${descPreview.length>=280?'...':''}</p><div class="fix6MetaGrid"><div><small>Çıkış</small><b>${esc(dateValue || '-')}</b></div><div><small>Tür</small><b>${esc(d.genre || 'Genel')}</b></div><div><small>Durum</small><b>${esc(d.status || 'Devam Ediyor')}</b></div><div><small>Bölüm</small><b>${esc(String(d.watchedEps||0))}/${esc(String(d.eps||0))}</b></div></div></article></div></aside></div>`;
}
gameFormFields = fix12GameFormFields;
gameAddForm = function(){ const d = { ...DEFAULT_GAME_DRAFT, ...state.gameDraft }; return `<form class="card soft gameForm fix12GameForm" id="gameAddForm" autocomplete="off">${fix12GameFormFields(d,'add')}</form>`; };
gameEditForm = function(){ const current = state.games.find(g=>String(g.id)===String(state.editingGameId)); if(!current) return ''; return `<div class="fix11EditOverlay"><form class="card soft gameForm editGameForm fix12GameForm fix11EditModal" id="gameEditForm" autocomplete="off"><button class="close" type="button" data-action="close-game-edit">×</button>${fix12GameFormFields(current,'edit')}</form></div>`; };
adminGamesTableFix8 = function(){
  const games = Array.isArray(state.games)?state.games:[];
  return `<section class="card wide fix12ExistingGames"><div class="sectionHead"><div><h2>Mevcut Oyunlar</h2><p class="muted">Düzenle butonu formu ayrı pencerede açar.</p></div><span class="pill green">${games.length} oyun</span></div>${advancedSearchPanel()}<div class="fix12FourGrid admin">${games.map(g=>fix12ArchiveGameCard(g,true)).join('') || '<p class="muted">Oyun bulunamadı.</p>'}</div></section>`;
};
function fix12FeedbackHero(kind){
  const isBug = kind==='bug';
  return `<div class="fix12FeedbackHero ${isBug?'bug':''}"><img src="${FIX11_LOGO}" alt="Hayatımız Oyun"><div><span class="eyebrow">${isBug?'Hata Takip Merkezi':'Oyun Öneri Merkezi'}</span><h1>${isBug?'Hata Bildir':'Oyun İste'}</h1><p>${isBug?'Hata oluştuğu sayfayı, yaptığın adımı ve beklediğin sonucu detaylı yaz. Yetkililer yönetim panelinden takip eder.':'Arşive eklenmesini istediğin oyunu, seri adını ve neden eklenmesi gerektiğini detaylı yaz. Yetkililer isteği inceleyebilir.'}</p></div></div>`;
}
gameRequestPageFix8 = function(){
  const mine = fix8LocalList(FIX8_REQUESTS_KEY).filter(r=>!state.session?.email || r.email===state.session.email).slice(0,8);
  return `<section class="fix12FeedbackPage">${fix12FeedbackHero('request')}<div class="fix12FeedbackLayout"><form id="gameRequestForm" class="card fix12FeedbackForm"><h2>Yeni Oyun İsteği</h2><label class="field">Oyun adı<input name="gameTitle" placeholder="Örn: A Way Out" required></label><label class="field">Seri adı<input name="seriesName" placeholder="Varsa seri adı"></label><label class="field">Neden eklenmeli?<textarea name="note" rows="8" placeholder="Oyunu neden arşivde görmek istiyorsun? Seri mi, tek oyun mu, Türkçe altyazı mı, bölüm listesi olacak mı? Detaylı yaz..."></textarea></label><button class="btn primary" type="submit">İsteği Gönder</button></form><section class="card fix11UserList"><h2>Son İsteklerin</h2>${mine.map(r=>`<article><b>${esc(r.gameTitle)}</b><small>${esc(r.seriesName||'Seri yok')} • ${esc(r.createdAt||'')}</small>${fix8RequestStatusPill(r.status)}</article>`).join('') || '<p class="muted">Henüz oyun isteğin yok.</p>'}</section></div></section>`;
};
bugReportPageFix8 = function(){
  const mine = fix8LocalList(FIX8_BUGS_KEY).filter(r=>!state.session?.email || r.email===state.session.email).slice(0,8);
  return `<section class="fix12FeedbackPage">${fix12FeedbackHero('bug')}<div class="fix12FeedbackLayout"><form id="bugReportForm" class="card fix12FeedbackForm"><h2>Yeni Hata Bildirimi</h2><label class="field">Hata başlığı<input name="title" placeholder="Örn: Oyun düzenle butonu çalışmıyor" required></label><label class="field">Sayfa / kategori<input name="page" placeholder="Örn: Yönetim Paneli / Oyunlar"></label><label class="field">Detay<textarea name="description" rows="8" placeholder="Hata nasıl oluştu? Hangi butona bastın? Ne olmasını bekliyordun? Ekranda ne oldu? Detaylı yaz..." required></textarea></label><button class="btn primary" type="submit">Hatayı Gönder</button></form><section class="card fix11UserList"><h2>Son Bildirimlerin</h2>${mine.map(r=>`<article><b>${esc(r.title)}</b><small>${esc(r.page||'Sayfa yok')} • ${esc(r.createdAt||'')}</small>${fix8RequestStatusPill(r.status)}</article>`).join('') || '<p class="muted">Henüz hata bildirimin yok.</p>'}</section></div></section>`;
};
const oldOnActionFix12 = onAction;
onAction = async function(e){
  const action = e.currentTarget?.dataset?.action || '';
  if(action === 'fix12-series-status'){
    e.preventDefault();
    fix12SetSeriesStatus(e.currentTarget.dataset.status || 'Tümü');
    render();
    return;
  }
  if(action === 'fix12-refetch-story' || action === 'fix10-refetch-story' || action === 'fetch-game-story' || action === 'fetch-game-story-edit'){
    e.preventDefault();
    const form = e.currentTarget.closest('form') || document.getElementById(state.editingGameId?'gameEditForm':'gameAddForm');
    if(!form) return setToast('Oyun formu açık değil.');
    const title = getFormValue(form,'title').trim();
    if(!title) return setToast('Önce oyun adını yaz.');
    const genre = getFormValue(form,'genre') || fix12GenreFromTitle(title);
    fix12PatchForm(form, { genre, description:fix12DetailedStory(title, genre) });
    setToast('Detaylı Türkçe oyun hikayesi forma yazıldı.');
    return;
  }
  if(action === 'fix12-refetch-genres' || action === 'fix10-refetch-genres'){
    e.preventDefault();
    const form = e.currentTarget.closest('form') || document.getElementById(state.editingGameId?'gameEditForm':'gameAddForm');
    if(!form) return setToast('Oyun formu açık değil.');
    const title = getFormValue(form,'title').trim();
    if(!title) return setToast('Önce oyun adını yaz.');
    fix12PatchForm(form, { genre:fix12GenreFromTitle(title) });
    setToast('Oyun türleri Türkçe olarak forma tekrar çekildi.');
    return;
  }
  if(action === 'auto-game-meta' || action === 'auto-game-meta-edit'){
    e.preventDefault();
    const form = e.currentTarget.closest('form') || document.getElementById(action==='auto-game-meta-edit'?'gameEditForm':'gameAddForm');
    await fix12MetaFill(form);
    return;
  }
  if(action === 'game-admin-tab'){
    e.preventDefault();
    const tab = e.currentTarget.dataset.tab || 'add';
    localStorage.setItem(FIX8_GAME_TAB_KEY, tab);
    if(tab === 'add' && state.editingGameId){ state.editingGameId = null; clearGameDraft(); state.rawgCandidates = []; state.coverSuggestions = []; }
    if(tab === 'list'){ state.editingGameId = null; }
    render();
    return;
  }
  return oldOnActionFix12(e);
};
try{ render(); }catch(error){ showBootError(error); }

/* v2.2.0 FIX 13 - yakında kilidi, net seri filtreleri ve profesyonel arama */
const FIX13_VERSION_LABEL = 'v2.2.0 FIX 13';
const FIX13_EXISTING_SEARCH_KEY = 'hayatimiz_existing_games_search_fix13';

function fix13StatusOf(g){
  return String(g?.status || '').trim().toLocaleLowerCase('tr-TR');
}
function fix13IsCompleted(g){
  const s = fix13StatusOf(g);
  return s === 'tamamlandı' || s === 'tamamlanan';
}
function fix13IsUpcoming(g){
  const s = fix13StatusOf(g);
  return s === 'yakında' || s.includes('yakında');
}
function fix13IsContinuing(g){
  const s = fix13StatusOf(g);
  return s === 'devam ediyor' || s === 'devam eden';
}
function fix13ExistingQuery(){
  try{ return localStorage.getItem(FIX13_EXISTING_SEARCH_KEY) || ''; }catch{ return ''; }
}
function fix13GameMatchesStrictStatus(g, status){
  if(!status || status === 'Tümü') return true;
  if(status === 'Tamamlandı') return fix13IsCompleted(g);
  if(status === 'Devam Ediyor') return fix13IsContinuing(g);
  if(status === 'Yakında') return fix13IsUpcoming(g);
  return true;
}
fix12GameStatusMatch = fix13GameMatchesStrictStatus;

visibleGames = function(){
  let games = state.games.filter(g => !state.query || textHas(allGameText(g), state.query));
  games = games.filter(g => gameMatchesFilter(g, state.collectionFilter));
  if(state.page === 'Popüler') games = games.filter(g=>fix13StatusOf(g)==='popüler' || Number(g.score||0) >= 9.0);
  if(state.page === 'Tamamlanan') games = games.filter(g=>fix13IsCompleted(g));
  if(state.page === 'Devam Eden') games = games.filter(g=>fix13IsContinuing(g));
  if(state.page === 'Yakında') games = games.filter(g=>fix13IsUpcoming(g));
  if(state.page === 'Seriler') games = games.filter(g=>String(g.seriesName || '').trim() || Number(g.eps || 0) > 0);
  if(state.page === 'Favoriler') games = games.filter(g=>isFavorite(g.id));
  if(['Korku','Aksiyon','Hikaye Odaklı'].includes(state.page)) games = games.filter(g=>textHas(g.genre, state.page.replace('Hikaye Odaklı','Hikaye')) || textHas(g.tags, state.page));
  return games;
};

function fix13ArchiveGameCard(g, admin=false){
  const progress = progressPercent(g) || getGameProgress(g);
  const desc = fix4Description(g).slice(0,150);
  const upcoming = fix13IsUpcoming(g);
  return `<article class="fix12GameCard fix13GameCard ${upcoming?'isUpcoming':''}"><div class="fix12GameCover"><img src="${esc(fix10Cover(g))}" alt="${esc(g.title)}"><span class="scoreBadge">${esc(String(g.score || '8.5'))}</span>${upcoming?'<span class="fix13UpcomingBadge">Yakında</span>':''}</div><div class="fix12GameBody"><div class="fix12MetaLine"><span>${esc(g.status || 'Arşiv')}</span>${g.releaseDate?`<small>${esc(formatDateTrFix6(g.releaseDate))}</small>`:''}</div><h3>${esc(g.title)}</h3><p>${esc(desc)}${desc.length>=150?'...':''}</p>${tagChipsHtml(g.tags || g.genre)}<div class="fix12ProgressMeta"><small>${Number(g.watchedEps||0)}/${Number(g.eps||0)} bölüm</small><b>%${progress}</b></div><div class="progressLine"><span style="width:${progress}%"></span></div><div class="fix12Actions">${admin?`<button class="miniBtn primary" data-game-edit="${esc(g.id)}">Düzenle</button><button class="miniBtn danger" data-game-delete="${esc(g.id)}">Sil</button>`: upcoming ? `<button class="miniBtn fix13DisabledWatch" disabled>Yakında</button><button class="miniBtn" data-favorite-game="${esc(g.id)}">${isFavorite(g.id)?'♥':'♡'}</button>` : `${watchButtonHtml(g)}<button class="miniBtn" data-favorite-game="${esc(g.id)}">${isFavorite(g.id)?'♥':'♡'}</button>`}</div></div></article>`;
}
fix12ArchiveGameCard = fix13ArchiveGameCard;

function fix13AlphabetGameArchive(games){
  const clean = [...games].sort((a,b)=>String(a.title||'').localeCompare(String(b.title||''),'tr'));
  const groups = fix11Grouped(clean, g=>g.title);
  return `${fix11AlphabetBar(groups,'oyun-harf')}<div class="fix12AlphabetSections fix13AlphabetSections">${groups.map(group=>`<section class="fix12LetterSection" id="oyun-harf-${group.letter==='0-9'?'num':esc(routeSlug(group.letter))}"><div class="fix11LetterHead"><div><span>${esc(group.letter)}</span><h2>${esc(group.letter)} Harfindeki Oyunlar</h2></div><b>${group.items.length} oyun</b></div><div class="fix12FourGrid fix13FourGrid">${group.items.map(g=>fix13ArchiveGameCard(g,false)).join('')}</div></section>`).join('')}</div>`;
}
fix12AlphabetGameArchive = fix13AlphabetGameArchive;

gameGrid = function(){
  const games = sortedVisibleGames();
  const adminActions = isStaff() && state.page === 'Yönetim Paneli' && state.adminPage === 'Oyunlar';
  if(!games.length) return '<section class="games fix12FourGrid"><div class="card wide">Oyun bulunamadı.</div></section>';
  if(adminActions) return `<div class="fix12FourGrid admin fix13FourGrid">${games.map(g=>fix13ArchiveGameCard(g,true)).join('')}</div>`;
  const title = state.page === 'Favoriler' ? 'Favoriler' : 'Oyun Arşivi';
  return `<section class="fix12ArchivePage fix13ArchivePage"><div class="fix4ArchiveHeader"><div><span class="eyebrow">Profesyonel Arşiv</span><h1>${esc(title)}</h1><p class="muted">Tamamlanan, devam eden ve yakında seriler net ayrılır. Yakında içerikler gri ve tıklanamaz görünür.</p></div><span class="pill green">${games.length} oyun</span></div>${fix12StatusTabs(state.page)}${advancedSearchPanel()}${fix13AlphabetGameArchive(games)}</section>`;
};

function fix13SeriesCard(group){
  const first = group.items[0] || {};
  const upcoming = group.items.length && group.items.every(fix13IsUpcoming);
  const completed = group.items.length && group.items.every(fix13IsCompleted);
  const totalEpisodes = group.items.reduce((a,g)=>a+Number(g.eps||seriesEpisodes(g).length||0),0);
  const desc = group.items.map(g=>g.title).slice(0,3).join(', ');
  const statusLabel = upcoming ? 'Yakında' : completed ? 'Tamamlandı' : 'Devam Ediyor';
  return `<article class="fix12SeriesCard fix13SeriesCard ${upcoming?'isUpcoming':''}"><div class="fix12SeriesCover"><img src="${esc(fix10Cover(first))}" alt="${esc(group.name)}"><span>${esc(statusLabel)}</span></div><div class="fix12SeriesBody"><h3>${esc(group.name)}</h3><p>${esc(desc || 'Seri oyunları')} • ${totalEpisodes} bölüm</p><div class="fix12SeriesMini">${group.items.slice(0,4).map(g=>`<span><img src="${esc(fix10Cover(g))}" alt="">${esc(g.title)}</span>`).join('')}</div><div class="fix12Actions">${upcoming?`<button class="miniBtn fix13DisabledWatch" disabled>Yakında</button>`:`<button class="miniBtn primary" data-watch-series="${esc(first.id||'')}">Seriyi İzle</button>`}<button class="miniBtn" data-admin="Seri İzleme">Sırala</button></div></div></article>`;
}
fix12SeriesCard = fix13SeriesCard;
seriesDirectoryPage = function(){
  const status = fix12SelectedSeriesStatus();
  const baseGames = state.games.filter(g=>fix13GameMatchesStrictStatus(g, status));
  const groups = sortedSeriesGroups(baseGames).sort((a,b)=>a.name.localeCompare(b.name,'tr'));
  const letterGroups = fix11Grouped(groups, g=>g.name);
  return `<section class="fix12SeriesPage fix13SeriesPage"><div class="seriesDirectoryHero"><span class="eyebrow">Profesyonel Seri Arşivi</span><h1>Seriler</h1><p>Tamamlanan seriler, devam eden seriler ve yakında gelecek seriler net ayrıldı. Yakında olanlar gri ve tıklanamaz görünür.</p><span class="pill green">${groups.length} seri</span></div>${fix12SeriesStatusTabs(status)}${fix11AlphabetBar(letterGroups,'seri-harf')}<div class="fix12AlphabetSections fix13AlphabetSections">${letterGroups.map(group=>`<section class="fix12LetterSection" id="seri-harf-${group.letter==='0-9'?'num':esc(routeSlug(group.letter))}"><div class="fix11LetterHead"><div><span>${esc(group.letter)}</span><h2>${esc(group.letter)} Harfindeki Seriler</h2></div><b>${group.items.length} seri</b></div><div class="fix12FourGrid series fix13FourGrid">${group.items.map(fix13SeriesCard).join('')}</div></section>`).join('') || '<section class="card wide"><h2>Seri bulunamadı</h2><p class="muted">Bu filtrede seri yok.</p></section>'}</div></section>`;
};

adminGamesTableFix8 = function(){
  const q = normalizeSearchText(fix13ExistingQuery());
  const games = (Array.isArray(state.games)?state.games:[]).filter(g=>!q || normalizeSearchText(allGameText(g)).includes(q));
  return `<section class="card wide fix12ExistingGames fix13ExistingGames"><div class="sectionHead"><div><h2>Mevcut Oyunlar</h2><p class="muted">Düzenle butonu formu ayrı pencerede açar. Arama sadece mevcut oyunlar listesini filtreler.</p></div><span class="pill green">${games.length} oyun</span></div><div class="fix13SearchBox"><label><span>🔎</span><input id="existingGamesSearchFix13" value="${esc(fix13ExistingQuery())}" placeholder="Mevcut oyunlarda ara: oyun adı, seri, tür, etiket..."></label><button class="miniBtn" data-action="fix13-clear-existing-search">Temizle</button></div><div class="fix12FourGrid admin fix13FourGrid">${games.map(g=>fix13ArchiveGameCard(g,true)).join('') || '<p class="muted">Arama sonucunda oyun bulunamadı.</p>'}</div></section>`;
};

const oldOnActionFix13 = onAction;
onAction = async function(e){
  const action = e.currentTarget?.dataset?.action || '';
  if(action === 'fix13-clear-existing-search'){
    e.preventDefault(); localStorage.removeItem(FIX13_EXISTING_SEARCH_KEY); render(); return;
  }
  return oldOnActionFix13(e);
};
const oldBindFix13 = bind;
bind = function(){
  oldBindFix13();
  const existingSearch = document.getElementById('existingGamesSearchFix13');
  if(existingSearch) existingSearch.addEventListener('input', e=>{ localStorage.setItem(FIX13_EXISTING_SEARCH_KEY, e.target.value || ''); render(); });
};

try{ render(); }catch(error){ showBootError(error); }

/* v2.2.0 FIX 14 - Çıkış tarihi çekme gün.ay.yıl formatı */
const FIX14_VERSION_LABEL = 'v2.2.0 FIX 14';
const FIX14_RELEASE_DATE_MAP = [
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
function fix14ReleaseDateForTitle(title){
  const name = String(title || '').trim();
  const row = FIX14_RELEASE_DATE_MAP.find(([rx]) => rx.test(name));
  return row ? row[1] : '';
}
function fix14NormalizeDate(value){
  if(!value) return '';
  const raw = String(value).trim();
  if(!raw) return '';
  const iso = raw.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if(iso) return `${iso[3].padStart(2,'0')}.${iso[2].padStart(2,'0')}.${iso[1]}`;
  const tr = raw.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
  if(tr) return `${tr[1].padStart(2,'0')}.${tr[2].padStart(2,'0')}.${tr[3]}`;
  const textDate = raw.match(/(\d{1,2})\s+(ocak|şubat|subat|mart|nisan|mayıs|mayis|haziran|temmuz|ağustos|agustos|eylül|eylul|ekim|kasım|kasim|aralık|aralik)\s+(\d{4})/i);
  if(textDate){
    const months = { 'ocak':'01','şubat':'02','subat':'02','mart':'03','nisan':'04','mayıs':'05','mayis':'05','haziran':'06','temmuz':'07','ağustos':'08','agustos':'08','eylül':'09','eylul':'09','ekim':'10','kasım':'11','kasim':'11','aralık':'12','aralik':'12' };
    return `${textDate[1].padStart(2,'0')}.${months[textDate[2].toLocaleLowerCase('tr-TR')] || '01'}.${textDate[3]}`;
  }
  return raw;
}
try{
  normalizeReleaseDate = fix14NormalizeDate;
  formatDateTrFix6 = fix14NormalizeDate;
}catch{}
const fix14PreviousLocalGameMeta = localGameMeta;
localGameMeta = function(title){
  const base = fix14PreviousLocalGameMeta(title) || {};
  const fixedDate = fix14ReleaseDateForTitle(title);
  return { ...base, released: fix14NormalizeDate(base.releaseDate || base.released || fixedDate), releaseDate: fix14NormalizeDate(base.releaseDate || base.released || fixedDate) };
};
fix12MetaFill = async function(form){
  if(!form) return setToast('Oyun formu açık değil.');
  const title = getFormValue(form,'title').trim();
  if(!title) return setToast('Önce oyun adını yaz.');
  const current = readGameDraftFromForm(form);
  let meta = localGameMeta(title);
  try{
    const data = await api('game-meta', { adminToken: state.session?.adminToken, title });
    if(data?.meta) meta = { ...meta, ...data.meta };
    state.rawgCandidates = (data?.candidates || []).map(c => ({ ...c, released: fix14NormalizeDate(c.released || c.releaseDate || fix14ReleaseDateForTitle(c.title || title)), releaseDate: fix14NormalizeDate(c.releaseDate || c.released || fix14ReleaseDateForTitle(c.title || title)) }));
  }catch{}
  const genre = meta.genre || fix12GenreFromTitle(title);
  const releaseDate = fix14NormalizeDate(meta.releaseDate || meta.released || fix14ReleaseDateForTitle(meta.title || title) || current.releaseDate || '');
  const patch = {
    title: meta.title || current.title || title,
    genre,
    releaseDate,
    score: Number(meta.score || current.score || 8.5),
    cover: meta.cover || current.cover || '',
    description: current.description || fix12DetailedStory(title, genre),
    tags: current.tags || '',
    seriesName: current.seriesName || '',
    playlistUrl: current.playlistUrl || '',
    videoUrl: current.videoUrl || '',
    eps: current.eps || 0,
    watchedEps: current.watchedEps || 0,
    seriesOrder: current.seriesOrder || 0,
    episodesText: current.episodesText || ''
  };
  fix12PatchForm(form, patch);
  setToast(releaseDate ? `Meta, kapak, türler ve çıkış tarihi forma geldi: ${releaseDate}` : 'Meta, kapak ve türler forma geldi. Tarih bulunamazsa manuel yazabilirsin.');
};
const fix14PreviousApplyRawgCandidate = applyRawgCandidate;
applyRawgCandidate = function(index){
  const item = state.rawgCandidates?.[index];
  if(!item) return setToast('RAWG sonucu bulunamadı.');
  const form = document.getElementById(state.editingGameId ? 'gameEditForm' : 'gameAddForm');
  if(!form) return setToast('Oyun formu açık değil.');
  const releaseDate = fix14NormalizeDate(item.released || item.releaseDate || fix14ReleaseDateForTitle(item.title || getFormValue(form,'title')) || getFormValue(form,'releaseDate'));
  setFormValuesAndSnapshot(form, {
    title:item.title || getFormValue(form,'title'),
    genre:item.genre || getFormValue(form,'genre'),
    releaseDate,
    score:item.score || getFormValue(form,'score'),
    cover:item.cover || getFormValue(form,'cover')
  });
  state.rawgCandidates = [];
  setToast(releaseDate ? `Seçilen kapak/meta uygulandı. Çıkış tarihi: ${releaseDate}` : 'Seçilen RAWG sonucu forma uygulandı. Kaydetmeden oyun eklenmez.');
};
const fix14PreviousRawgCandidatePanel = rawgCandidatePanel;
rawgCandidatePanel = function(){
  const list = (state.rawgCandidates || []).map(c => ({ ...c, released: fix14NormalizeDate(c.released || c.releaseDate || fix14ReleaseDateForTitle(c.title)) }));
  if(!list.length) return '';
  return `<div class="card soft rawgCandidatePanel rawgLargePanel"><div class="sectionHead"><div><h3>RAWG kapak/meta sonuçları</h3><p class="muted">Kapak, tür ve çıkış tarihi gün.ay.yıl formatında forma aktarılır.</p></div><button class="miniBtn danger" data-action="clear-rawg-candidates">Kapat</button></div><div class="rawgCandidateGrid largePreviewGrid">${list.map((c,i)=>`<article class="rawgCandidate largeRawgCandidate"><img src="${esc(c.cover || coverFor(c))}" alt="${esc(c.title || '')}"><div><b>${esc(c.title || 'Sonuç')}</b><small>${esc(c.genre || 'Genel')} ${c.released ? '• '+esc(c.released) : ''}</small><span class="pill">⭐ ${esc(c.score || 8.5)}</span></div><button class="miniBtn primary" data-rawg-candidate="${i}">Bu kapağı, tarihi ve metayı kullan</button></article>`).join('')}</div></div>`;
};

/* v2.2.1 - Plan uygulaması: durum yönetimi, görünüm modları, takvim görünüm geçişi, sürükle-bırak seri sıralama, spoilersız hikaye */
const V221_VIEW_KEY = 'hayatimiz_archive_view_v221';
const V221_CALENDAR_VIEW_KEY = 'hayatimiz_calendar_view_v221';
const V221_SERIES_QUERY_KEY = 'hayatimiz_series_query_v221';
function v221ArchiveView(){
  const allowed = ['compact','detail','poster','horizontal'];
  const saved = localStorage.getItem(V221_VIEW_KEY) || state.gameViewMode || 'compact';
  const mode = allowed.includes(saved) ? saved : 'compact';
  if(saved !== mode){ try{ localStorage.setItem(V221_VIEW_KEY, mode); }catch{} }
  state.gameViewMode = mode;
  return mode;
}
function v221SetArchiveView(mode){ localStorage.setItem(V221_VIEW_KEY, mode); state.gameViewMode = mode; render(); }
function v221CalendarView(){ return localStorage.getItem(V221_CALENDAR_VIEW_KEY) || 'month'; }
function v221SetCalendarView(mode){ localStorage.setItem(V221_CALENDAR_VIEW_KEY, mode); render(); }
function v221SeriesQuery(){ return localStorage.getItem(V221_SERIES_QUERY_KEY) || ''; }
function v221SetSeriesQuery(value){ localStorage.setItem(V221_SERIES_QUERY_KEY, value || ''); }
function v221ViewTools(){
  const current = v221ArchiveView();
  const items = [['compact','Kompakt'],['detail','Detaylı'],['poster','Poster'],['horizontal','Yatay Kart']];
  return `<section class="viewTools v221ViewTools"><span>Görünüm</span>${items.map(([key,label])=>`<button class="miniBtn ${current===key?'primary':''}" data-v221-view="${key}">${label}</button>`).join('')}</section>`;
}
function v221CardDescription(g){ return fix4Description(g).slice(0, v221ArchiveView()==='detail' ? 220 : 120); }
function v221ArchiveCard(g, admin=false){
  const mode = v221ArchiveView();
  const progress = progressPercent(g) || getGameProgress(g);
  const desc = v221CardDescription(g);
  const upcoming = String(g.status || '').toLocaleLowerCase('tr-TR') === 'yakında';
  return `<article class="v221GameCard ${mode} ${upcoming?'upcoming':''}"><div class="v221GameCover"><img src="${esc(fix10Cover(g))}" alt="${esc(g.title)}"><span class="scoreBadge">${esc(String(g.score || '8.5'))}</span>${upcoming?'<b class="soonBadge">Yakında</b>':''}</div><div class="v221GameBody"><div class="v221Topline"><span>${esc(g.status || 'Arşiv')}</span>${g.releaseDate?`<small>${esc(formatDateTrFix6(g.releaseDate))}</small>`:''}</div><h3>${esc(g.title)}</h3><p>${esc(desc)}${desc.length >= (mode==='detail'?220:120) ? '...' : ''}</p>${tagChipsHtml(g.tags || g.genre)}<div class="v221Meta"><small>${Number(g.watchedEps||0)}/${Number(g.eps||0)} bölüm</small><b>%${progress}</b></div><div class="progressLine"><span style="width:${progress}%"></span></div><div class="v221Actions">${admin?`<button class="miniBtn primary" data-game-edit="${esc(g.id)}">Düzenle</button><button class="miniBtn danger" data-game-delete="${esc(g.id)}">Sil</button>`:(upcoming?`<button class="miniBtn v221Disabled" disabled>Yakında</button>`:`${watchButtonHtml(g)}<button class="miniBtn" data-favorite-game="${esc(g.id)}">${isFavorite(g.id)?'♥':'♡'}</button>`)}</div></div></article>`;
}
fix13ArchiveGameCard = v221ArchiveCard;
fix12ArchiveGameCard = v221ArchiveCard;
function v221AlphabetGameArchive(games){
  const groups = fix11Grouped(games, g=>g.title);
  return `${fix11AlphabetBar(groups,'oyun-harf')}<div class="v221AlphabetSections">${groups.map(group=>`<section class="fix12LetterSection v221LetterSection" id="oyun-harf-${group.letter==='0-9'?'num':esc(routeSlug(group.letter))}"><div class="fix11LetterHead"><div><span>${esc(group.letter)}</span><h2>${esc(group.letter)} Harfindeki Oyunlar</h2></div><b>${group.items.length} oyun</b></div><div class="v221ArchiveGrid ${esc(v221ArchiveView())}">${group.items.map(g=>v221ArchiveCard(g,false)).join('')}</div></section>`).join('')}</div>`;
}
gameGrid = function(){
  const games = sortedVisibleGames();
  const adminActions = isStaff() && state.page === 'Yönetim Paneli' && state.adminPage === 'Oyunlar';
  if(!games.length) return '<section class="games v221ArchiveGrid"><div class="card wide">Oyun bulunamadı.</div></section>';
  if(adminActions) return `<div class="v221ArchiveGrid admin compact">${games.map(g=>v221ArchiveCard(g,true)).join('')}</div>`;
  const title = state.page === 'Favoriler' ? 'Favoriler' : 'Oyun Arşivi';
  return `<section class="fix12ArchivePage v221ArchivePage"><div class="fix4ArchiveHeader"><div><span class="eyebrow">Profesyonel Arşiv</span><h1>${esc(title)}</h1><p class="muted">Alfabetik sıralama, harfe git ve kullanıcıya özel kart görünüm modları.</p></div><span class="pill green">${games.length} oyun</span></div>${fix12StatusTabs(state.page)}${advancedSearchPanel()}${v221ViewTools()}${v221AlphabetGameArchive(games)}</section>`;
};
function v221SeriesCard(group){
  const first = group.items[0] || {};
  const mode = v221ArchiveView();
  const upcoming = group.items.every(g=>String(g.status||'').toLocaleLowerCase('tr-TR')==='yakında');
  const percent = group.items.length ? Math.round(group.items.reduce((a,g)=>a+progressPercent(g),0)/group.items.length) : 0;
  return `<article class="v221SeriesCard ${mode} ${upcoming?'upcoming':''}"><div class="v221SeriesCover"><img src="${esc(fix10Cover(first))}" alt="${esc(group.name)}"><span>${group.items.length} oyun</span>${upcoming?'<b>Yakında</b>':''}</div><div class="v221SeriesBody"><h3>${esc(group.name)}</h3><p>${esc((first.description || group.items.map(g=>g.title).join(', ')).slice(0, mode==='detail'?180:110))}${mode==='detail'?'':'...'}</p><div class="v221SeriesMini">${group.items.slice(0, mode==='detail'?6:4).map(g=>`<span><img src="${esc(fix10Cover(g))}" alt="">${esc(g.title)}</span>`).join('')}</div><div class="v221Meta"><small>%${percent} tamamlandı</small><b>${group.items.reduce((s,g)=>s+Number(g.eps||0),0)} bölüm</b></div><div class="v221Actions">${upcoming?'<button class="miniBtn v221Disabled" disabled>Yakında</button>':`<button class="miniBtn primary" data-watch-series="${esc(first.id||'')}">Seriyi İzle</button>`}${isStaff()?'<button class="miniBtn" data-admin="Seri İzleme">Sırala</button>':''}</div></div></article>`;
}
fix12SeriesCard = v221SeriesCard;
fix13SeriesCard = v221SeriesCard;
seriesDirectoryPage = function(){
  const status = fix12SelectedSeriesStatus();
  const q = normalizeSearchText(state.query || '');
  const baseGames = state.games.filter(g=>fix13GameMatchesStrictStatus(g, status)).filter(g=>!q || normalizeSearchText(allGameText(g)).includes(q));
  const groups = sortedSeriesGroups(baseGames).sort((a,b)=>a.name.localeCompare(b.name,'tr'));
  const letterGroups = fix11Grouped(groups, g=>g.name);
  return `<section class="fix12SeriesPage v221SeriesPage"><div class="seriesDirectoryHero"><span class="eyebrow">Profesyonel Seri Arşivi</span><h1>Seriler</h1><p>Seriler alfabetik, harfe git destekli ve aynı görünüm modlarıyla listelenir.</p><span class="pill green">${groups.length} seri</span></div>${fix12SeriesStatusTabs(status)}${v221ViewTools()}${fix11AlphabetBar(letterGroups,'seri-harf')}<div class="v221AlphabetSections">${letterGroups.map(group=>`<section class="fix12LetterSection v221LetterSection" id="seri-harf-${group.letter==='0-9'?'num':esc(routeSlug(group.letter))}"><div class="fix11LetterHead"><div><span>${esc(group.letter)}</span><h2>${esc(group.letter)} Harfindeki Seriler</h2></div><b>${group.items.length} seri</b></div><div class="v221ArchiveGrid series ${esc(v221ArchiveView())}">${group.items.map(v221SeriesCard).join('')}</div></section>`).join('') || '<section class="card wide"><h2>Seri bulunamadı</h2><p class="muted">Bu filtrede seri yok.</p></section>'}</div></section>`;
};
// v2.2.1 FIX 2: publicHighlights isimli eski fonksiyon artık yoktu.
// İlk açılışta ReferenceError vermemesi için publicStats güvenli şekilde kullanılır.
const v221PublicStatsOld = publicStats;
publicStats = function(){
  try{ return v221PublicStatsOld(); }
  catch(err){
    console.warn('publicStats fallback aktif:', err);
    return '<section class="grid stats publicHighlights proStats"><div class="card"><b>Arşiv</b><h3>Hazır</h3><span class="muted">İstatistikler yükleniyor</span></div></section>';
  }
};
function v221SpoilerFreeStory(title, genre=''){
  const name = String(title || 'Bu oyun').trim();
  const g = String(genre || fix12GenreFromTitle(name) || 'hikaye odaklı macera').trim();
  if(/a\s*way\s*out/i.test(name)) return "A Way Out, birbirinden farklı geçmişlere ve motivasyonlara sahip iki mahkum olan Leo ve Vincent'ın, hapishaneden kaçışını ve ardından ortak düşmanlarından intikam alma sürecini anlatan tamamen eşli oynanışa dayalı bir aksiyon-macera oyunudur. Hikaye, iki karakterin güven sorunları, aile bağları ve özgürlük arayışı etrafında ilerler; oyuncular bölüm bölüm iş birliği yaparak kaçış planını, takip sahnelerini ve dramatik karar anlarını deneyimler.";
  return `${name}, ${g} türlerini bir araya getiren hikaye odaklı bir oyun deneyimi sunar. Oyuncu, ana karakterlerin hedeflerini, karşılaştıkları çatışmaları ve dünyadaki yerlerini spoiler vermeden adım adım keşfeder. Hikaye; karakter motivasyonları, atmosfer, görev akışı ve bölüm bölüm ilerleyen dramatik olaylar üzerine kurulur. Bu açıklama oyunun temel konusunu anlatır, fakat kritik final, büyük sürprizler veya dönüm noktalarını özellikle açık etmez.`;
}
const v221OldGameFormFields = fix12GameFormFields;
fix12GameFormFields = function(d, mode='add'){
  const html = v221OldGameFormFields(d, mode);
  return html.replace('Hikayeyi Tekrar Çek</button></label>', 'Hikayeyi Tekrar Çek</button><button class="miniBtn" type="button" data-action="v221-spoiler-free-story">Spoilersız Hikaye Çek</button></label>');
};
gameFormFields = fix12GameFormFields;
function v221UpdateFeedbackLocal(type,id,patch){
  const key = type==='bug' ? FIX8_BUGS_KEY : FIX8_REQUESTS_KEY;
  const list = fix8LocalList(key).map(item=>String(item.id)===String(id)?{...item,...patch,updatedAt:new Date().toLocaleString('tr-TR')}:item);
  fix8SaveLocal(key,list);
}
function v221FeedbackStatusSelect(item,type){
  const opts = type==='bug' ? ['Yeni','İnceleniyor','Çözüldü','Reddedildi'] : ['Yeni','İnceleniyor','Eklendi','Reddedildi'];
  return `<select class="v221FeedbackStatus" data-v221-feedback-status="${esc(type)}:${esc(item.id)}">${opts.map(o=>`<option ${String(item.status||'Yeni')===o?'selected':''}>${esc(o)}</option>`).join('')}</select>`;
}
adminGameRequestsPageFix8 = function(){
  const list = fix8LocalList(FIX8_REQUESTS_KEY);
  return `<section class="v221FeedbackAdmin"><div class="card wide fix10FeedbackHead"><div><span class="eyebrow">Yetkili Oyun İstek Merkezi</span><h2>Oyun İstekleri</h2><p class="muted">Durumu değiştir: Yeni, İnceleniyor, Eklendi, Reddedildi. Yetkili notu da kaydedilir.</p></div><span class="pill green">${list.length} istek</span></div><div class="v221FeedbackGrid">${list.map(r=>`<article><div class="v221FeedbackIcon">💡</div><div class="v221FeedbackContent"><h3>${esc(r.gameTitle)}</h3><small>${esc(r.seriesName||'Seri yok')} • ${esc(r.email||'Anonim')} • ${esc(r.createdAt||'')}</small><p>${esc(r.note||'Not yok')}</p></div><div class="v221FeedbackActions">${v221FeedbackStatusSelect(r,'request')}<textarea data-v221-feedback-note="request:${esc(r.id)}" placeholder="Yetkili notu...">${esc(r.adminNote || '')}</textarea><button class="miniBtn primary" data-v221-feedback-save="request:${esc(r.id)}">Kaydet</button></div></article>`).join('') || '<p class="muted">Henüz oyun isteği yok.</p>'}</div></section>`;
};
adminBugReportsPageFix8 = function(){
  const list = fix8LocalList(FIX8_BUGS_KEY);
  return `<section class="v221FeedbackAdmin"><div class="card wide fix10FeedbackHead bug"><div><span class="eyebrow">Yetkili Hata Takip Merkezi</span><h2>Hata Bildirimleri</h2><p class="muted">Durum değiştir ve çözüm notu ekle. Notlar Supabase bağlıysa tabloya da gönderilir.</p></div><span class="pill banned">${list.length} hata</span></div><div class="v221FeedbackGrid bug">${list.map(r=>`<article><div class="v221FeedbackIcon">🐞</div><div class="v221FeedbackContent"><h3>${esc(r.title)}</h3><small>${esc(r.page||'Sayfa yok')} • ${esc(r.email||'Anonim')} • ${esc(r.createdAt||'')}</small><p>${esc(r.description||'Detay yok')}</p></div><div class="v221FeedbackActions">${v221FeedbackStatusSelect(r,'bug')}<textarea data-v221-feedback-note="bug:${esc(r.id)}" placeholder="Çözüm notu...">${esc(r.solutionNote || r.adminNote || '')}</textarea><button class="miniBtn primary" data-v221-feedback-save="bug:${esc(r.id)}">Kaydet</button></div></article>`).join('') || '<p class="muted">Henüz hata bildirimi yok.</p>'}</div></section>`;
};
function v221CalendarEvents(){ return getCalendarEventsFix6().filter(ev=>!String(ev.id||'').startsWith('demo-')); }
function v221CalendarViewTabs(){ const mode=v221CalendarView(); return `<div class="v221CalendarTabs"><button class="miniBtn ${mode==='month'?'primary':''}" data-v221-calendar="month">Ay</button><button class="miniBtn ${mode==='week'?'primary':''}" data-v221-calendar="week">Hafta</button><button class="miniBtn ${mode==='day'?'primary':''}" data-v221-calendar="day">Gün</button></div>`; }
function v221CalendarList(events){ return `<div class="v221CalendarList">${events.map(ev=>`<article><img src="${esc(ev.cover || eventCardCoverFix6({}))}" alt="${esc(ev.title)}"><div><b>${esc(ev.title)}</b><small>${esc(formatDateTrFix6(ev.date))} • ${esc(ev.time||'20:00')} • ${esc(ev.type||'Yayın')}</small><p>${esc(ev.episodeTitle?`${ev.episodeNumber||''}. Bölüm - ${ev.episodeTitle}`:(ev.note||''))}</p></div></article>`).join('') || '<p class="muted">Bu görünümde kayıt yok.</p>'}</div>`; }
calendarPage = function(){
  const mode = v221CalendarView();
  const events = v221CalendarEvents().sort((a,b)=>String(a.date).localeCompare(String(b.date)) || String(a.time).localeCompare(String(b.time)));
  const nowIso = parseTrDateToIsoFix6(new Date().toISOString().slice(0,10));
  const today = new Date();
  const weekLimit = new Date(today.getFullYear(), today.getMonth(), today.getDate()+7).toISOString().slice(0,10);
  const visible = mode==='day' ? events.filter(e=>parseTrDateToIsoFix6(e.date)===nowIso) : mode==='week' ? events.filter(e=>{ const d=parseTrDateToIsoFix6(e.date); return d>=nowIso && d<=weekLimit; }) : events;
  return `<section class="v221CalendarPage"><div class="card wide"><div class="sectionHead"><div><span class="eyebrow">Yayın Takvimi</span><h1>Yayın Takvimi</h1><p class="muted">Ay / Hafta / Gün görünümü arasında gerçek geçiş yapar.</p></div>${v221CalendarViewTabs()}</div>${mode==='month'?`<div class="fix6CalendarGrid v221MonthGrid">${['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'].map(d=>`<div class="dayHead">${d}</div>`).join('')}${Array.from({length:35}).map((_,i)=>{ const day=i+1; const cell=events.filter(ev=>Number(String(formatDateTrFix6(ev.date)).slice(0,2))===day).slice(0,2); return `<div class="dayCell"><span class="dayNo">${day<=31?day:''}</span>${cell.map(ev=>`<div class="calEvent ${eventToneFix6(ev.type)}"><small>${esc(ev.time||'20:00')}</small><b>${esc(ev.title)}</b></div>`).join('')}</div>`; }).join('')}</div>`:v221CalendarList(visible)}</div></section>`;
};
adminSeriesWatchPanel = function(){
  const q = normalizeSearchText(v221SeriesQuery());
  const groups = sortedSeriesGroups(state.games.filter(g=>String(g.seriesName||'').trim() || Number(g.eps||0)>0)).filter(group=>!q || normalizeSearchText(group.name+' '+group.items.map(g=>g.title).join(' ')).includes(q));
  return `<section class="v221SeriesAdmin"><div class="card wide"><div class="sectionHead"><div><span class="eyebrow">Sürükle-Bırak Seri Sıralama</span><h2>Seri İzleme Yönetimi</h2><p class="muted">Seri içinde oyunları sürükle bırak ile taşı; bıraktığında otomatik kaydedilir.</p></div><span class="pill green">${groups.length} seri</span></div><label class="search v221SeriesSearch">🔎 <input id="v221SeriesSearchInput" value="${esc(v221SeriesQuery())}" placeholder="Seri veya oyun ara..."></label></div>${groups.map(group=>`<article class="card v221AdminSeriesCard"><div class="sectionHead"><div><h3>${esc(group.name)}</h3><p class="muted">${group.items.length} oyun</p></div><button class="miniBtn primary" data-v221-save-series="${esc(group.name)}">Kaydet</button></div><div class="v221DragList" data-v221-series="${esc(group.name)}">${group.items.sort((a,b)=>Number(a.seriesOrder||0)-Number(b.seriesOrder||0)).map((g,i)=>`<div class="v221DragItem" draggable="true" data-game-id="${esc(g.id)}"><span class="dragHandle">☰</span><img src="${esc(fix10Cover(g))}" alt="${esc(g.title)}"><b>${esc(g.title)}</b><small>Sıra ${i+1}</small><input data-series-order-game="${esc(g.id)}" type="number" value="${i+1}"></div>`).join('')}</div></article>`).join('') || '<section class="card wide">Seri bulunamadı.</section>'}</section>`;
};
async function v221SaveSeriesOrderFromContainer(container){
  const ids = Array.from(container.querySelectorAll('[data-game-id]')).map(el=>el.dataset.gameId);
  ids.forEach((id,index)=>{ const g=state.games.find(x=>String(x.id)===String(id)); if(g) g.seriesOrder=index+1; });
  render();
  setToast('Seri sırası otomatik kaydedildi.');
  for(const [index,id] of ids.entries()){
    if(String(id).startsWith('local-')) continue;
    try{ await api('games-update', { adminToken: state.session?.adminToken, gameId:id, game:{ seriesOrder:index+1 } }); }catch{}
  }
}
const v221OldOnAction = onAction;
onAction = async function(e){
  const action = e.currentTarget?.dataset?.action || '';
  if(action === 'v221-spoiler-free-story'){
    e.preventDefault();
    const form = e.currentTarget.closest('form') || document.getElementById(state.editingGameId?'gameEditForm':'gameAddForm');
    const title = getFormValue(form,'title').trim();
    if(!title) return setToast('Önce oyun adını yaz.');
    const genre = getFormValue(form,'genre') || fix12GenreFromTitle(title);
    fix12PatchForm(form, { genre, description:v221SpoilerFreeStory(title, genre) });
    setToast('Spoiler vermeyen detaylı hikaye forma yazıldı.');
    return;
  }
  return v221OldOnAction(e);
};
const v221OldBind = bind;
bind = function(){
  v221OldBind();
  document.querySelectorAll('[data-v221-view]').forEach(btn=>btn.addEventListener('click',()=>v221SetArchiveView(btn.dataset.v221View)));
  document.querySelectorAll('[data-v221-calendar]').forEach(btn=>btn.addEventListener('click',()=>v221SetCalendarView(btn.dataset.v221Calendar)));
  const seriesSearch = document.getElementById('v221SeriesSearchInput');
  if(seriesSearch) seriesSearch.addEventListener('input', e=>{ v221SetSeriesQuery(e.target.value); render(); });
  document.querySelectorAll('[data-v221-feedback-status]').forEach(sel=>sel.addEventListener('change', async ()=>{ const [type,id]=String(sel.dataset.v221FeedbackStatus||'').split(':'); v221UpdateFeedbackLocal(type,id,{status:sel.value}); setToast('Durum güncellendi.'); try{ await api(type==='bug'?'bug-report-update':'game-request-update',{ adminToken:state.session?.adminToken, id, status:sel.value }); }catch{} }));
  document.querySelectorAll('[data-v221-feedback-save]').forEach(btn=>btn.addEventListener('click', async ()=>{ const [type,id]=String(btn.dataset.v221FeedbackSave||'').split(':'); const note=document.querySelector(`[data-v221-feedback-note="${type}:${id}"]`)?.value || ''; const patch = type==='bug' ? { solutionNote:note, adminNote:note } : { adminNote:note }; v221UpdateFeedbackLocal(type,id,patch); setToast(type==='bug'?'Çözüm notu kaydedildi.':'Yetkili notu kaydedildi.'); try{ await api(type==='bug'?'bug-report-update':'game-request-update',{ adminToken:state.session?.adminToken, id, adminNote:note, solutionNote:note }); }catch{} }));
  let dragged = null;
  document.querySelectorAll('.v221DragItem').forEach(item=>{
    item.addEventListener('dragstart',()=>{ dragged=item; item.classList.add('dragging'); });
    item.addEventListener('dragend',()=>{ item.classList.remove('dragging'); dragged=null; });
    item.addEventListener('dragover',e=>{ e.preventDefault(); const list=item.parentElement; if(!dragged || dragged===item) return; const rect=item.getBoundingClientRect(); const before=e.clientY < rect.top + rect.height/2; list.insertBefore(dragged, before?item:item.nextSibling); });
    item.addEventListener('drop',e=>{ e.preventDefault(); const list=item.closest('.v221DragList'); if(list) v221SaveSeriesOrderFromContainer(list); });
  });
  document.querySelectorAll('[data-v221-save-series]').forEach(btn=>btn.addEventListener('click',()=>{ const card=btn.closest('.v221AdminSeriesCard'); const list=card?.querySelector('.v221DragList'); if(list) v221SaveSeriesOrderFromContainer(list); }));
};
try{ render(); }catch(error){ showBootError(error); }

/* v2.2.2 - Plan uygulaması: güçlü tür doğrulama, hatırlatıcı, tercih kaydı, seri geçmişi, filtreli raporlar, spoilersız buton kaldırma */
const V222_VIEW_PREF_KEY = 'hayatimiz_archive_view_v222_synced';
const V222_SERIES_HISTORY_KEY = 'hayatimiz_series_order_history_v222';
const V222_REPORT_FILTER_KEY = 'hayatimiz_report_filter_v222';
const V222_REMINDERS_KEY = 'hayatimiz_calendar_reminders_v222';

const V222_GENRE_MAP = [
  [/a\s*way\s*out/i, 'Aksiyon-macera, eşli oynanış, co-op, hikaye odaklı, sinematik anlatı'],
  [/plague\s*tale.*requiem/i, 'Macera, gizlilik, hikaye odaklı, bulmaca, dramatik anlatı'],
  [/plague\s*tale.*innocence/i, 'Macera, gizlilik, hikaye odaklı, bulmaca, dramatik anlatı'],
  [/assassin|creed/i, 'Aksiyon-macera, açık dünya, gizlilik, parkur, tarihi kurgu'],
  [/resident\s*evil/i, 'Hayatta kalma korkusu, aksiyon, bulmaca, gerilim'],
  [/witcher/i, 'Aksiyon-RPG, açık dünya, fantezi, hikaye odaklı'],
  [/cyberpunk/i, 'Aksiyon-RPG, açık dünya, bilim kurgu, siberpunk'],
  [/elden\s*ring|dark\s*souls|sekiro/i, 'Aksiyon-RPG, soulslike, açık dünya, zorlu mücadele'],
  [/god\s*of\s*war/i, 'Aksiyon-macera, mitoloji, hikaye odaklı, yakın dövüş'],
  [/red\s*dead|rdr/i, 'Aksiyon-macera, açık dünya, western, hikaye odaklı'],
  [/mass\s*effect/i, 'Aksiyon-RPG, bilim kurgu, seçim odaklı hikaye'],
  [/alan\s*wake/i, 'Psikolojik korku, aksiyon-macera, hikaye odaklı'],
  [/metro/i, 'FPS, hayatta kalma, kıyamet sonrası, hikaye odaklı']
];
function v222GenreFromTitle(title=''){
  const row = V222_GENRE_MAP.find(([rx])=>rx.test(String(title||'')));
  if(row) return row[1];
  const key = normalizeSearchText(title || '');
  if(key.includes('horror') || key.includes('korku')) return 'Korku, gerilim, hikaye odaklı';
  if(key.includes('racing') || key.includes('yarış')) return 'Yarış, rekabet, sürüş';
  if(key.includes('football') || key.includes('soccer') || key.includes('fifa')) return 'Spor, futbol, rekabet';
  if(key.includes('strategy') || key.includes('strateji')) return 'Strateji, taktik, yönetim';
  if(key.includes('rpg')) return 'RPG, karakter gelişimi, hikaye odaklı';
  return 'Aksiyon-macera, hikaye odaklı';
}
function v222StoryForGame(title='', genre=''){
  const name = String(title || 'Bu oyun').trim();
  const key = normalizeSearchText(name);
  const g = String(genre || v222GenreFromTitle(name) || 'hikaye odaklı').trim();
  if(key.includes('a way out')) return `${name}, birbirinden farklı geçmişlere ve motivasyonlara sahip iki mahkum olan Leo ve Vincent'ın hapishaneden kaçışını ve ardından ortak düşmanlarından intikam alma süreçlerini anlatan tamamen eşli oynanışa dayalı bir aksiyon-macera oyunudur. Hikaye, iki karakterin güven kurma zorunluluğu, aileleriyle olan bağları, geçmişte yaşadıkları kırılmalar ve özgürlük arayışı üzerine ilerler. Oyuncular bölüm bölüm farklı görevlerde birlikte hareket eder; kaçış planı, kovalamacalar, gizlilik anları, çatışmalar ve karakterlerin kişisel hesaplaşmaları oyunun ana ritmini oluşturur. Bu açıklama oyunun temel konusunu anlatır, büyük final sürprizlerini açık etmez.`;
  if(key.includes('plague')) return `${name}, savaşın ve hastalığın kararttığı bir dünyada hayatta kalmaya çalışan karakterlerin korku, umut ve aile bağı üzerinden ilerleyen hikayesini anlatır. Oyuncu; gizlilik, keşif, bulmaca ve tehlikeli karşılaşmalarla bölüm bölüm ilerlerken ana karakterlerin birbirini koruma çabasına, yaşadıkları kayıplara ve karanlık dünyada güvenli bir yol bulma mücadelesine tanık olur. Oyun, atmosferi ve karakter motivasyonlarını öne çıkarır; kritik son gelişmeleri spoiler olarak açıklamaz.`;
  if(key.includes('assassin')) return `${name}, tarihi kurgu, kişisel intikam, gizli örgütler ve halkını koruma isteği üzerine kurulu aksiyon-macera türünde bir oyundur. Oyuncu, ana karakterin geçmişinden gelen motivasyonlarını takip ederken açık dünya keşfi, gizlilik, parkur, yakın dövüş ve görev zincirleriyle ilerler. Hikaye; karakterin dönüşümünü, düşmanlarıyla yüzleşmesini ve büyük bir mücadelenin temellerini anlaşılır şekilde anlatır.`;
  if(key.includes('resident')) return `${name}, hayatta kalma korkusu ve aksiyon öğelerini birleştiren gerilim odaklı bir hikaye sunar. Oyuncu, biyolojik tehditlerin ve karanlık olayların ortasında sınırlı kaynaklarla ilerler; bulmacalar, düşmanlar ve atmosfer karakterlerin hayatta kalma mücadelesini güçlendirir. Açıklama, oyunun ana temasını anlatır fakat kritik sürprizleri açık etmez.`;
  if(key.includes('witcher')) return `${name}, canavar avcılığı, siyasi entrikalar, kişisel seçimler ve güçlü karakter bağları üzerine kurulu geniş bir aksiyon-RPG hikayesi sunar. Oyuncu, görevlerde verdiği kararlarla karakterlerin kaderini ve dünyanın gidişatını etkiler. Ana anlatı; sorumluluk, aile, kader ve ahlaki ikilemler etrafında gelişir.`;
  return `${name}, ${g} türlerini bir araya getiren hikaye odaklı bir oyun deneyimi sunar. Oyuncu, ana karakterlerin hedeflerini, geçmişten gelen motivasyonlarını, karşılaştıkları düşmanları ve içinde bulundukları dünyanın kurallarını bölüm bölüm takip eder. Hikaye; keşif, mücadele, karakter gelişimi ve ana çatışmanın ilerlemesi üzerinden anlatılır. Bu metin oyunun konusu hakkında bilgi verir; büyük final sürprizlerini veya kritik dönüm noktalarını açık etmez.`;
}
try{ /* FIX34: fix12/v222 tür fonksiyonlarını birbirine kopyalama kapatıldı; oyun kartı tıklayınca sonsuz döngü oluşmasın. */ }catch{}

function v222BaseGameFormFields(d, mode='add'){
  const opts = ['Devam Ediyor','Tamamlandı','Popüler','Yakında'].map(st=>`<option ${d.status===st?'selected':''}>${st}</option>`).join('');
  const dateValue = formatDateTrFix6(d.releaseDate || '');
  const descPreview = (d.description || v222StoryForGame(d.title || 'Oyun adı', d.genre)).slice(0,280);
  return `<div class="fix12GameEditor v222GameEditor"><section class="fix12EditorMain"><div class="sectionHead"><div><span class="eyebrow">${mode==='edit'?'Mevcut Oyunu Düzenle':'Yeni Oyun Ekle'}</span><h2>${mode==='edit'?'Oyun Bilgilerini Güncelle':'Oyun Bilgileri'}</h2><p class="muted">Hikayeyi Tekrar Çek artık oyun hakkında detaylı Türkçe bilgi yazar. Spoilersız buton kaldırıldı.</p></div></div><div class="statusPickBar"><button class="tagBtn ${d.status==='Tamamlandı'?'active':''}" type="button" data-status-pick="Tamamlandı">Tamamlanan</button><button class="tagBtn ${d.status==='Devam Ediyor'?'active':''}" type="button" data-status-pick="Devam Ediyor">Devam Eden</button><button class="tagBtn ${d.status==='Yakında'?'active':''}" type="button" data-status-pick="Yakında">Yakında</button></div><div class="fix12FormGrid"><label class="field">Oyun Adı *<input name="title" required placeholder="Örn: A Way Out" value="${esc(d.title)}" /></label><label class="field">Seri Adı<input name="seriesName" placeholder="Örn: A Way Out" value="${esc(d.seriesName || '')}" /></label><label class="field">Çıkış Tarihi <small>gün.ay.yıl</small><input name="releaseDate" placeholder="23.03.2018" value="${esc(dateValue)}" /></label><label class="field">Durum<select name="status">${opts}</select></label><label class="field wideField">Türler<div class="inlineField"><input name="genre" placeholder="Aksiyon-macera, co-op, hikaye odaklı" value="${esc(d.genre)}" /><button class="miniBtn" type="button" data-action="v222-refetch-genres">Türleri Tekrar Çek</button></div><small class="muted">RAWG + yerel doğrulama sözlüğü ile Türkçe türler forma yazılır.</small></label><div class="field wideField"><span>Etiketler</span>${tagButtonsHtml(d.tags)}</div><label class="field">Toplam Bölüm<input name="eps" type="number" min="0" value="${esc(String(d.eps ?? 0))}" /></label><label class="field">İzlenen Bölüm<input name="watchedEps" type="number" min="0" value="${esc(String(d.watchedEps ?? 0))}" /></label><label class="field">Puan<input name="score" type="number" min="0" max="10" step="0.1" value="${esc(String(d.score ?? 8.5))}" /></label><label class="field">Seri Sıra No<input name="seriesOrder" type="number" min="0" value="${esc(String(d.seriesOrder ?? 0))}" /></label><label class="field wideField">Kapak URL<div class="inlineField"><input name="cover" placeholder="https://..." value="${esc(d.cover)}" /><button class="miniBtn" type="button" data-action="${mode==='edit'?'auto-game-meta-edit':'auto-game-meta'}">Kapak / Meta Çek</button></div></label><label class="field wideField">YouTube Playlist<input name="playlistUrl" placeholder="https://youtube.com/playlist?list=..." value="${esc(d.playlistUrl || '')}" /></label><label class="field wideField">Tek Video URL<input name="videoUrl" placeholder="https://youtube.com/watch?v=..." value="${esc(d.videoUrl || '')}" /></label><label class="field wideField fix12StoryField"><span>Oyunun Hikayesi / Açıklama</span><small>Karakter motivasyonu, ana çatışma, oynanış akışı ve atmosferi anlatır.</small><textarea name="description" rows="8" placeholder="Hikayeyi Tekrar Çek butonu oyun hakkında detaylı Türkçe bilgi yazar.">${esc(d.description || '')}</textarea><button class="miniBtn primary" type="button" data-action="v222-refetch-story">Hikayeyi Tekrar Çek</button></label><label class="field wideField episodeImportField fix12EpisodeField"><span>Profesyonel Bölüm Listesi</span><small>Playlistten gelen bölümler kart önizleme olarak gösterilir, teknik veri gizlenir.</small>${episodeImportPreview(d.episodesText, d.episodes)}<textarea name="episodesText" rows="4" class="technicalEpisodes" placeholder="Teknik bölüm verisi otomatik oluşur">${esc(d.episodesText || episodesToText(d.episodes || []))}</textarea><div class="rowActions"><button class="miniBtn" type="button" data-action="toggle-technical-episodes">Teknik Veriyi Göster</button><button class="miniBtn" type="button" data-action="${mode==='edit'?'estimate-playlist-episodes-edit':'estimate-playlist-episodes'}">Playlist Bölümleri Çek</button></div></label></div><div class="fix12FormActions"><button class="btn" type="button" data-action="${mode==='edit'?'auto-game-meta-edit':'auto-game-meta'}">Meta + Kapak Çek</button><button class="btn" type="button" data-action="v222-refetch-story">Hikayeyi Tekrar Çek</button><button class="btn" type="button" data-action="v222-refetch-genres">Türleri Tekrar Çek</button><button class="btn primary" type="submit">${mode==='edit'?'Oyunu Güncelle':'Oyunu Kaydet'}</button></div></section><aside class="fix12PreviewSide"><div class="fix12PreviewSticky"><h3>Kapak Önizleme</h3><div class="fix12CoverPreview"><img src="${esc(d.cover || FIX11_COVER)}" alt="${esc(d.title||'Oyun')}"></div><article class="fix11PreviewCard"><span class="scoreBadge">${esc(String(d.score || '8.5'))}</span><h2>${esc(d.title || 'Oyun adı')}</h2>${tagChipsHtml(d.tags || d.genre)}<p>${esc(descPreview)}${descPreview.length>=280?'...':''}</p><div class="fix6MetaGrid"><div><small>Çıkış</small><b>${esc(dateValue || '-')}</b></div><div><small>Tür</small><b>${esc(d.genre || 'Genel')}</b></div><div><small>Durum</small><b>${esc(d.status || 'Devam Ediyor')}</b></div><div><small>Bölüm</small><b>${esc(String(d.watchedEps||0))}/${esc(String(d.eps||0))}</b></div></div></article></div></aside></div>`;
}
gameFormFields = v222BaseGameFormFields;
gameAddForm = function(){ const d = { ...DEFAULT_GAME_DRAFT, ...state.gameDraft }; return `<form class="card soft gameForm fix12GameForm v222GameForm" id="gameAddForm" autocomplete="off">${v222BaseGameFormFields(d,'add')}</form>`; };
gameEditForm = function(){ const current = state.games.find(g=>String(g.id)===String(state.editingGameId)); if(!current) return ''; return `<div class="fix11EditOverlay"><form class="card soft gameForm editGameForm fix12GameForm fix11EditModal v222GameForm" id="gameEditForm" autocomplete="off"><button class="close" type="button" data-action="close-game-edit">×</button>${v222BaseGameFormFields(current,'edit')}</form></div>`; };

function v222ReportFilter(type){ return localStorage.getItem(`${V222_REPORT_FILTER_KEY}_${type}`) || 'Tümü'; }
function v222ReportFilterTabs(type){ const active=v222ReportFilter(type); const items= type==='request' ? ['Tümü','Yeni','İnceleniyor','Eklendi','Reddedildi'] : ['Tümü','Yeni','İnceleniyor','Çözüldü','Reddedildi']; return `<div class="v222ReportFilters">${items.map(s=>`<button class="miniBtn ${active===s?'primary':''}" data-v222-report-filter="${type}:${esc(s)}">${esc(s)}</button>`).join('')}</div>`; }
function v222FilterRows(list, type){ const f=v222ReportFilter(type); return f==='Tümü' ? list : list.filter(x=>String(x.status||'Yeni')===f); }
adminGameRequestsPageFix8 = function(){ const list=v222FilterRows(fix8LocalList(FIX8_REQUESTS_KEY),'request'); return `<section class="v221FeedbackAdmin v222FeedbackAdmin"><div class="card wide fix10FeedbackHead"><div><span class="eyebrow">Filtreli Rapor Ekranı</span><h2>Oyun İstekleri</h2><p class="muted">Duruma göre filtrele, yetkili notu ekle ve raporları temiz takip et.</p></div><span class="pill green">${list.length} kayıt</span></div>${v222ReportFilterTabs('request')}<div class="v221FeedbackGrid">${list.map(r=>`<article><div class="v221FeedbackIcon">💡</div><div class="v221FeedbackContent"><h3>${esc(r.gameTitle)}</h3><small>${esc(r.seriesName||'Seri yok')} • ${esc(r.email||'Anonim')} • ${esc(r.createdAt||'')}</small><p>${esc(r.note||'Not yok')}</p></div><div class="v221FeedbackActions">${v221FeedbackStatusSelect(r,'request')}<textarea data-v221-feedback-note="request:${esc(r.id)}" placeholder="Yetkili notu...">${esc(r.adminNote || '')}</textarea><button class="miniBtn primary" data-v221-feedback-save="request:${esc(r.id)}">Kaydet</button></div></article>`).join('') || '<p class="muted">Bu filtrede oyun isteği yok.</p>'}</div></section>`; };
adminBugReportsPageFix8 = function(){ const list=v222FilterRows(fix8LocalList(FIX8_BUGS_KEY),'bug'); return `<section class="v221FeedbackAdmin v222FeedbackAdmin"><div class="card wide fix10FeedbackHead bug"><div><span class="eyebrow">Filtreli Hata Raporu</span><h2>Hata Bildirimleri</h2><p class="muted">Duruma göre filtrele, çözüm notu ekle ve raporları yetkili panelinden takip et.</p></div><span class="pill banned">${list.length} kayıt</span></div>${v222ReportFilterTabs('bug')}<div class="v221FeedbackGrid bug">${list.map(r=>`<article><div class="v221FeedbackIcon">🐞</div><div class="v221FeedbackContent"><h3>${esc(r.title)}</h3><small>${esc(r.page||'Sayfa yok')} • ${esc(r.email||'Anonim')} • ${esc(r.createdAt||'')}</small><p>${esc(r.description||'Detay yok')}</p></div><div class="v221FeedbackActions">${v221FeedbackStatusSelect(r,'bug')}<textarea data-v221-feedback-note="bug:${esc(r.id)}" placeholder="Çözüm notu...">${esc(r.solutionNote || r.adminNote || '')}</textarea><button class="miniBtn primary" data-v221-feedback-save="bug:${esc(r.id)}">Kaydet</button></div></article>`).join('') || '<p class="muted">Bu filtrede hata bildirimi yok.</p>'}</div></section>`; };

function v222ReminderList(){ return safeParse(localStorage.getItem(V222_REMINDERS_KEY), []); }
function v222SaveReminder(ev){ const list=v222ReminderList().filter(x=>String(x.id)!==String(ev.id)); list.unshift({ id:ev.id, title:ev.title, date:ev.date, time:ev.time, createdAt:new Date().toLocaleString('tr-TR') }); localStorage.setItem(V222_REMINDERS_KEY, JSON.stringify(list.slice(0,50))); }
function v222CalendarList(events){ return `<div class="v221CalendarList v222CalendarList">${events.map(ev=>`<article><img src="${esc(ev.cover || eventCardCoverFix6({}))}" alt="${esc(ev.title)}"><div><b>${esc(ev.title)}</b><small>${esc(formatDateTrFix6(ev.date))} • ${esc(ev.time||'20:00')} • ${esc(ev.type||'Yayın')}</small><p>${esc(ev.episodeTitle?`${ev.episodeNumber||''}. Bölüm - ${ev.episodeTitle}`:(ev.note||''))}</p></div><button class="miniBtn" data-v222-remind="${esc(ev.id)}">Hatırlat</button></article>`).join('') || '<p class="muted">Bu görünümde kayıt yok.</p>'}</div>`; }
calendarPage = function(){ const mode=v221CalendarView(); const events=v221CalendarEvents().sort((a,b)=>String(a.date).localeCompare(String(b.date)) || String(a.time).localeCompare(String(b.time))); const today=new Date().toISOString().slice(0,10); const weekLimit=new Date(Date.now()+7*86400000).toISOString().slice(0,10); const visible=mode==='day'?events.filter(e=>parseTrDateToIsoFix6(e.date)===today):mode==='week'?events.filter(e=>{const d=parseTrDateToIsoFix6(e.date); return d>=today && d<=weekLimit;}):events; return `<section class="v221CalendarPage v222CalendarPage"><div class="card wide"><div class="sectionHead"><div><span class="eyebrow">Yayın Takvimi</span><h1>Yayın Takvimi</h1><p class="muted">Ay / Hafta / Gün geçişleri ve hatırlatıcı butonları aktiftir.</p></div>${v221CalendarViewTabs()}</div>${mode==='month'?`<div class="fix6CalendarGrid v221MonthGrid">${['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'].map(d=>`<div class="dayHead">${d}</div>`).join('')}${Array.from({length:35}).map((_,i)=>{ const day=i+1; const cell=events.filter(ev=>Number(String(formatDateTrFix6(ev.date)).slice(0,2))===day).slice(0,2); return `<div class="dayCell"><span class="dayNo">${day<=31?day:''}</span>${cell.map(ev=>`<div class="calEvent ${eventToneFix6(ev.type)}"><small>${esc(ev.time||'20:00')}</small><b>${esc(ev.title)}</b><button class="calendarReminderMini" data-v222-remind="${esc(ev.id)}">🔔</button></div>`).join('')}</div>`; }).join('')}</div>`:v222CalendarList(visible)}<div class="v222ReminderPanel"><h3>Hatırlatıcılarım</h3>${v222ReminderList().slice(0,5).map(r=>`<span>${esc(r.title)} • ${esc(formatDateTrFix6(r.date))} ${esc(r.time||'')}</span>`).join('') || '<span>Henüz hatırlatıcı yok.</span>'}</div></div></section>`; };

function v222PushSeriesHistory(series, ids){ const list=safeParse(localStorage.getItem(V222_SERIES_HISTORY_KEY), []); list.unshift({ id:`hist-${Date.now()}`, series, ids, createdAt:new Date().toLocaleString('tr-TR'), user:state.session?.email||'local' }); localStorage.setItem(V222_SERIES_HISTORY_KEY, JSON.stringify(list.slice(0,80))); }
const v222PrevSaveSeries = v221SaveSeriesOrderFromContainer;
v221SaveSeriesOrderFromContainer = async function(container){ const series=container?.dataset?.v221Series || container?.dataset?.seriesName || 'Seri'; const ids=Array.from(container.querySelectorAll('[data-game-id],[data-series-drag-id]')).map(el=>el.dataset.gameId || el.dataset.seriesDragId).filter(Boolean); v222PushSeriesHistory(series, ids); await v222PrevSaveSeries(container); try{ await api('series-order-history-add',{ adminToken:state.session?.adminToken, series, gameIds:ids }); }catch{} };
function v222SeriesHistoryPanel(){ const list=safeParse(localStorage.getItem(V222_SERIES_HISTORY_KEY), []); return `<section class="card wide v222SeriesHistory"><div class="sectionHead"><div><h2>Seri Sıralama İşlem Geçmişi</h2><p class="muted">Sürükle-bırak ve kaydet işlemleri burada takip edilir.</p></div><span class="pill green">${list.length} işlem</span></div>${list.map(h=>`<article><b>${esc(h.series)}</b><small>${esc(h.createdAt)} • ${esc(h.user)}</small><p>${h.ids.length} oyun sıralandı</p></article>`).join('') || '<p class="muted">Henüz işlem geçmişi yok.</p>'}</section>`; }
const v222PrevAdminSeriesPanel = adminSeriesWatchPanel;
adminSeriesWatchPanel = function(){ return `${v222PrevAdminSeriesPanel()}${v222SeriesHistoryPanel()}`; };

const v222OldOnAction = onAction;
onAction = async function(e){ const action=e.currentTarget?.dataset?.action || ''; if(action==='v222-refetch-story' || action==='fix12-refetch-story' || action==='fix10-refetch-story' || action==='fetch-game-story' || action==='fetch-game-story-edit'){ e.preventDefault(); const form=e.currentTarget.closest('form') || document.getElementById(state.editingGameId?'gameEditForm':'gameAddForm'); if(!form) return setToast('Oyun formu açık değil.'); const title=getFormValue(form,'title').trim(); if(!title) return setToast('Önce oyun adını yaz.'); const genre=getFormValue(form,'genre') || v222GenreFromTitle(title); fix12PatchForm(form,{ genre, description:v222StoryForGame(title,genre) }); setToast('Oyunla ilgili detaylı Türkçe hikaye/bilgi forma yazıldı.'); return; } if(action==='v222-refetch-genres' || action==='fix12-refetch-genres' || action==='fix10-refetch-genres'){ e.preventDefault(); const form=e.currentTarget.closest('form') || document.getElementById(state.editingGameId?'gameEditForm':'gameAddForm'); if(!form) return setToast('Oyun formu açık değil.'); const title=getFormValue(form,'title').trim(); if(!title) return setToast('Önce oyun adını yaz.'); let genre=v222GenreFromTitle(title); try{ const data=await api('game-genres',{ adminToken:state.session?.adminToken, title }); if(data?.genre) genre=data.genre; }catch{} fix12PatchForm(form,{ genre }); setToast('Türler Türkçe olarak tekrar çekildi.'); return; } if(action==='auto-game-meta' || action==='auto-game-meta-edit'){ e.preventDefault(); const form=e.currentTarget.closest('form') || document.getElementById(action==='auto-game-meta-edit'?'gameEditForm':'gameAddForm'); await fix12MetaFill(form); try{ const title=getFormValue(form,'title').trim(); const data=await api('game-genres',{ adminToken:state.session?.adminToken, title }); if(data?.genre) fix12PatchForm(form,{ genre:data.genre }); }catch{} return; } return v222OldOnAction(e); };
const v222OldBind = bind;
bind = function(){ v222OldBind(); document.querySelectorAll('[data-v222-report-filter]').forEach(btn=>btn.addEventListener('click',()=>{ const [type,status]=String(btn.dataset.v222ReportFilter||'').split(':'); localStorage.setItem(`${V222_REPORT_FILTER_KEY}_${type}`, status || 'Tümü'); render(); })); document.querySelectorAll('[data-v222-remind]').forEach(btn=>btn.addEventListener('click',async()=>{ const id=btn.dataset.v222Remind; const ev=v221CalendarEvents().find(x=>String(x.id)===String(id)); if(ev){ v222SaveReminder(ev); setToast('Hatırlatıcı eklendi.'); try{ await api('calendar-reminder-add',{ email:state.session?.email||'', event:ev }); }catch{} render(); } })); document.querySelectorAll('[data-v221-view]').forEach(btn=>btn.addEventListener('click',async()=>{ const mode=btn.dataset.v221View; localStorage.setItem(V222_VIEW_PREF_KEY,'1'); try{ await api('archive-view-preference-save',{ email:state.session?.email||'', viewMode:mode }); }catch{} })); };
try{ render(); }catch(error){ showBootError(error); }



/* FIX24: Eski AI/Deploy bloğu kaynak dosyadan silindi. */

/* FIX24: Eski gereksiz AI/Deploy kaynak bloğu silindi. */
/* v2.4.0 FIX 3 - Supabase kayıtları ve kompakt arşiv kesin geri yükleme */
try{
  const allowedFix3 = ['compact','detail','poster','horizontal'];
  const savedFix3 = localStorage.getItem('hayatimiz_game_view_mode_v221') || localStorage.getItem('hayatimiz_game_view_mode_v219') || localStorage.getItem('hayatimiz_game_view_mode_v217') || 'compact';
  const normalizedFix3 = savedFix3 === 'grid' || !allowedFix3.includes(savedFix3) ? 'compact' : savedFix3;
  localStorage.setItem('hayatimiz_game_view_mode_v221', normalizedFix3);
  localStorage.setItem('hayatimiz_game_view_mode_v219', normalizedFix3);
  state.gameViewMode = normalizedFix3;
}catch{}

function hoFix3StatusKey(g){ return String(g?.status || '').trim().toLocaleLowerCase('tr-TR'); }
function hoFix3Upcoming(g){ const s=hoFix3StatusKey(g); return s === 'yakında' || s.includes('yakında'); }
function hoFix3Completed(g){ const s=hoFix3StatusKey(g); return s === 'tamamlandı' || s === 'tamamlanan'; }
function hoFix3Continuing(g){ const s=hoFix3StatusKey(g); return s === 'devam ediyor' || s === 'devam eden'; }

if(typeof fix13GameMatchesStrictStatus === 'function'){
  fix13GameMatchesStrictStatus = function(g,status){
    if(!status || status === 'Tümü') return true;
    if(status === 'Tamamlandı') return hoFix3Completed(g);
    if(status === 'Devam Ediyor') return hoFix3Continuing(g);
    if(status === 'Yakında') return hoFix3Upcoming(g);
    return true;
  };
  fix12GameStatusMatch = fix13GameMatchesStrictStatus;
}

if(typeof v221ArchiveView === 'function'){
  v221ArchiveView = function(){
    const allowed = ['compact','detail','poster','horizontal'];
    let mode = localStorage.getItem('hayatimiz_game_view_mode_v221') || localStorage.getItem('hayatimiz_game_view_mode_v219') || 'compact';
    if(mode === 'grid' || !allowed.includes(mode)) mode = 'compact';
    try{ localStorage.setItem('hayatimiz_game_view_mode_v221', mode); localStorage.setItem('hayatimiz_game_view_mode_v219', mode); }catch{}
    state.gameViewMode = mode;
    return mode;
  };
}

if(typeof v221ArchiveCard === 'function'){
  v221ArchiveCard = function(g, admin=false){
    const mode = v221ArchiveView();
    const progress = progressPercent(g) || getGameProgress(g);
    const desc = fix4Description(g).slice(0, mode==='detail' ? 190 : 110);
    const upcoming = hoFix3Upcoming(g);
    return `<article class="v221GameCard v240Fix3Card ${mode} ${upcoming?'upcoming':''}"><div class="v221GameCover"><img src="${esc(fix10Cover(g))}" alt="${esc(g.title)}"><span class="scoreBadge">${esc(String(g.score || '8.5'))}</span>${upcoming?'<b class="soonBadge">Yakında</b>':''}</div><div class="v221GameBody"><div class="v221Topline"><span>${esc(g.status || 'Arşiv')}</span>${g.releaseDate?`<small>${esc(formatDateTrFix6(g.releaseDate))}</small>`:''}</div><h3>${esc(g.title)}</h3><p>${esc(desc)}${desc.length >= (mode==='detail'?190:110) ? '...' : ''}</p>${tagChipsHtml(g.tags || g.genre)}<div class="v221Meta"><small>${Number(g.watchedEps||0)}/${Number(g.eps||0)} bölüm</small><b>%${progress}</b></div><div class="progressLine"><span style="width:${progress}%"></span></div><div class="v221Actions">${admin?`<button class="miniBtn primary" data-game-edit="${esc(g.id)}">Düzenle</button><button class="miniBtn danger" data-game-delete="${esc(g.id)}">Sil</button>`:(upcoming?`<button class="miniBtn v221Disabled" disabled>Yakında</button>`:`${watchButtonHtml(g)}<button class="miniBtn" data-favorite-game="${esc(g.id)}">${isFavorite(g.id)?'♥':'♡'}</button>`)}</div></div></article>`;
  };
  fix13ArchiveGameCard = v221ArchiveCard;
  fix12ArchiveGameCard = v221ArchiveCard;
}

if(typeof v221AlphabetGameArchive === 'function'){
  v221AlphabetGameArchive = function(games){
    const sorted = [...(games || [])].sort((a,b)=>String(a.title||'').localeCompare(String(b.title||''),'tr'));
    const groups = fix11Grouped(sorted, g=>g.title);
    return `${fix11AlphabetBar(groups,'oyun-harf')}<div class="v221AlphabetSections v240Fix3AlphabetSections">${groups.map(group=>`<section class="fix12LetterSection v221LetterSection" id="oyun-harf-${group.letter==='0-9'?'num':esc(routeSlug(group.letter))}"><div class="fix11LetterHead"><div><span>${esc(group.letter)}</span><h2>${esc(group.letter)} Harfindeki Oyunlar</h2></div><b>${group.items.length} oyun</b></div><div class="v221ArchiveGrid compact v240Fix3Grid">${group.items.map(g=>v221ArchiveCard(g,false)).join('')}</div></section>`).join('')}</div>`;
  };
}

gameGrid = function(){
  const games = sortedVisibleGames();
  const adminActions = isStaff() && state.page === 'Yönetim Paneli' && state.adminPage === 'Oyunlar';
  if(!games.length) return '<section class="games v221ArchiveGrid compact v240Fix3Grid"><div class="card wide"><h2>Oyun bulunamadı</h2><p class="muted">Supabase oyun kayıtları bekleniyor. Rastgele/demo oyun gösterilmez.</p></div></section>';
  if(adminActions) return `<div class="v221ArchiveGrid admin compact v240Fix3Grid">${games.map(g=>v221ArchiveCard(g,true)).join('')}</div>`;
  const title = state.page === 'Favoriler' ? 'Favoriler' : 'Oyun Arşivi';
  return `<section class="fix12ArchivePage v221ArchivePage v240Fix3ArchivePage"><div class="fix4ArchiveHeader"><div><span class="eyebrow">Supabase Dinamik Arşiv</span><h1>${esc(title)}</h1><p class="muted">Kayıtlar Supabase games tablosundan gelir. Demo/rastgele oyun gösterimi kapatıldı.</p></div><span class="pill green">${games.length} oyun</span></div>${fix12StatusTabs(state.page)}${advancedSearchPanel()}${v221ViewTools()}${v221AlphabetGameArchive(games)}</section>`;
};

if(typeof v221SeriesCard === 'function'){
  v221SeriesCard = function(group){
    const first = group.items[0] || {};
    const mode = v221ArchiveView();
    const upcoming = group.items.length && group.items.every(hoFix3Upcoming);
    const percent = group.items.length ? Math.round(group.items.reduce((a,g)=>a+progressPercent(g),0)/group.items.length) : 0;
    return `<article class="v221SeriesCard v240Fix3Card ${mode} ${upcoming?'upcoming':''}"><div class="v221SeriesCover"><img src="${esc(fix10Cover(first))}" alt="${esc(group.name)}"><span>${group.items.length} oyun</span>${upcoming?'<b>Yakında</b>':''}</div><div class="v221SeriesBody"><h3>${esc(group.name)}</h3><p>${esc((first.description || group.items.map(g=>g.title).join(', ')).slice(0, mode==='detail'?170:110))}${mode==='detail'?'':'...'}</p><div class="v221SeriesMini">${group.items.slice(0,4).map(g=>`<span><img src="${esc(fix10Cover(g))}" alt="">${esc(g.title)}</span>`).join('')}</div><div class="v221Meta"><small>%${percent} tamamlandı</small><b>${group.items.reduce((s,g)=>s+Number(g.eps||0),0)} bölüm</b></div><div class="v221Actions">${upcoming?'<button class="miniBtn v221Disabled" disabled>Yakında</button>':`<button class="miniBtn primary" data-watch-series="${esc(first.id||'')}">Seriyi İzle</button>`}${isStaff()?'<button class="miniBtn" data-admin="Seri İzleme">Sırala</button>':''}</div></div></article>`;
  };
  fix12SeriesCard = v221SeriesCard;
  fix13SeriesCard = v221SeriesCard;
}

seriesDirectoryPage = function(){
  const status = fix12SelectedSeriesStatus();
  const q = normalizeSearchText(state.query || '');
  const baseGames = state.games.filter(g=>fix13GameMatchesStrictStatus(g, status)).filter(g=>!q || normalizeSearchText(allGameText(g)).includes(q));
  const groups = sortedSeriesGroups(baseGames).sort((a,b)=>a.name.localeCompare(b.name,'tr'));
  const letterGroups = fix11Grouped(groups, g=>g.name);
  return `<section class="fix12SeriesPage v221SeriesPage v240Fix3SeriesPage"><div class="seriesDirectoryHero"><span class="eyebrow">Supabase Seri Arşivi</span><h1>Seriler</h1><p>Seriler Supabase kayıtlarından gelir, kompakt 4 kolon yapıda listelenir.</p><span class="pill green">${groups.length} seri</span></div>${fix12SeriesStatusTabs(status)}${v221ViewTools()}${fix11AlphabetBar(letterGroups,'seri-harf')}<div class="v221AlphabetSections v240Fix3AlphabetSections">${letterGroups.map(group=>`<section class="fix12LetterSection v221LetterSection" id="seri-harf-${group.letter==='0-9'?'num':esc(routeSlug(group.letter))}"><div class="fix11LetterHead"><div><span>${esc(group.letter)}</span><h2>${esc(group.letter)} Harfindeki Seriler</h2></div><b>${group.items.length} seri</b></div><div class="v221ArchiveGrid series compact v240Fix3Grid">${group.items.map(v221SeriesCard).join('')}</div></section>`).join('') || '<section class="card wide"><h2>Seri bulunamadı</h2><p class="muted">Bu filtrede seri yok veya Supabase kayıtları henüz yüklenmedi.</p></section>'}</div></section>`;
};

try{ render(); }catch(error){ showBootError(error); }


/* v2.4.0 FIX 5 - Kompakt kart genişliği, güvenli görünüm değiştirici ve profesyonel bakım geri sayımı */
const HO240_FIX5_VERSION = 'v2.4.0 FIX 5';
function ho240Fix5ViewMode(){
  const allowed = ['compact','detail','poster','horizontal'];
  let mode = String(localStorage.getItem('hayatimiz_game_view_mode_v221') || localStorage.getItem('hayatimiz_game_view_mode_v219') || state.gameViewMode || 'compact');
  if(mode === 'grid' || mode === 'list' || !allowed.includes(mode)) mode = 'compact';
  try{
    localStorage.setItem('hayatimiz_game_view_mode_v221', mode);
    localStorage.setItem('hayatimiz_game_view_mode_v219', mode);
  }catch{}
  state.gameViewMode = mode;
  return mode;
}
function ho240Fix5SetViewMode(mode){
  const allowed = ['compact','detail','poster','horizontal'];
  const next = allowed.includes(String(mode)) ? String(mode) : 'compact';
  try{
    localStorage.setItem('hayatimiz_game_view_mode_v221', next);
    localStorage.setItem('hayatimiz_game_view_mode_v219', next);
    localStorage.setItem('hayatimiz_game_view_mode_v217', next);
  }catch{}
  state.gameViewMode = next;
  try{ api('archive-view-preference-save',{ email:state.session?.email||'', viewMode:next }); }catch{}
  render();
}
try{
  v221ArchiveView = ho240Fix5ViewMode;
  v221SetArchiveView = ho240Fix5SetViewMode;
}catch{}
v221ViewTools = function(){
  const current = ho240Fix5ViewMode();
  const items = [['compact','Kompakt'],['detail','Detaylı'],['poster','Poster'],['horizontal','Yatay Kart']];
  return `<section class="viewTools v221ViewTools ho240Fix5ViewTools"><span>Görünüm</span>${items.map(([key,label])=>`<button class="miniBtn ${current===key?'primary':''}" data-v221-view="${key}" data-view-mode="${key}">${label}</button>`).join('')}</section>`;
};
if(!window.__HO240_FIX5_VIEW_DELEGATE__){
  window.__HO240_FIX5_VIEW_DELEGATE__ = true;
  document.addEventListener('click', function(e){
    const btn = e.target && e.target.closest ? e.target.closest('[data-v221-view],[data-view-mode]') : null;
    if(!btn) return;
    const mode = btn.dataset.v221View || btn.dataset.viewMode || 'compact';
    if(['compact','detail','poster','horizontal','grid','list'].includes(mode)){
      e.preventDefault();
      e.stopImmediatePropagation();
      ho240Fix5SetViewMode(mode === 'grid' || mode === 'list' ? 'compact' : mode);
    }
  }, true);
}
function ho240Fix5CardDesc(g, mode){
  const max = mode === 'detail' ? 220 : mode === 'horizontal' ? 150 : 145;
  const txt = fix4Description(g).trim();
  return { text: txt.slice(0,max), cut: txt.length > max };
}
v221ArchiveCard = function(g, admin=false){
  const mode = ho240Fix5ViewMode();
  const progress = progressPercent(g) || getGameProgress(g);
  const desc = ho240Fix5CardDesc(g, mode);
  const upcoming = hoFix3Upcoming(g);
  return `<article class="v221GameCard v240Fix5Card ${mode} ${upcoming?'upcoming':''}"><div class="v221GameCover"><img src="${esc(fix10Cover(g))}" alt="${esc(g.title)}"><span class="scoreBadge">${esc(String(g.score || '8.5'))}</span>${upcoming?'<b class="soonBadge">Yakında</b>':''}</div><div class="v221GameBody"><div class="v221Topline"><span>${esc(g.status || 'Arşiv')}</span>${g.releaseDate?`<small>${esc(formatDateTrFix6(g.releaseDate))}</small>`:''}</div><h3>${esc(g.title)}</h3><p>${esc(desc.text)}${desc.cut?'...':''}</p>${tagChipsHtml(g.tags || g.genre)}<div class="v221Meta"><small>${Number(g.watchedEps||0)}/${Number(g.eps||0)} bölüm</small><b>%${progress}</b></div><div class="progressLine"><span style="width:${progress}%"></span></div><div class="v221Actions">${admin?`<button class="miniBtn primary" data-game-edit="${esc(g.id)}">Düzenle</button><button class="miniBtn danger" data-game-delete="${esc(g.id)}">Sil</button>`:(upcoming?`<button class="miniBtn v221Disabled" disabled>Yakında</button>`:`${watchButtonHtml(g)}<button class="miniBtn" data-favorite-game="${esc(g.id)}">${isFavorite(g.id)?'♥':'♡'}</button>`)}</div></div></article>`;
};
fix13ArchiveGameCard = v221ArchiveCard;
fix12ArchiveGameCard = v221ArchiveCard;
v221AlphabetGameArchive = function(games){
  const mode = ho240Fix5ViewMode();
  const sorted = [...(games || [])].sort((a,b)=>String(a.title||'').localeCompare(String(b.title||''),'tr'));
  const groups = fix11Grouped(sorted, g=>g.title);
  return `${fix11AlphabetBar(groups,'oyun-harf')}<div class="v221AlphabetSections v240Fix5AlphabetSections">${groups.map(group=>`<section class="fix12LetterSection v221LetterSection" id="oyun-harf-${group.letter==='0-9'?'num':esc(routeSlug(group.letter))}"><div class="fix11LetterHead"><div><span>${esc(group.letter)}</span><h2>${esc(group.letter)} Harfindeki Oyunlar</h2></div><b>${group.items.length} oyun</b></div><div class="v221ArchiveGrid ${esc(mode)} v240Fix5Grid">${group.items.map(g=>v221ArchiveCard(g,false)).join('')}</div></section>`).join('')}</div>`;
};
v221SeriesCard = function(group){
  const mode = ho240Fix5ViewMode();
  const first = group.items[0] || {};
  const upcoming = group.items.length && group.items.every(hoFix3Upcoming);
  const percent = group.items.length ? Math.round(group.items.reduce((a,g)=>a+progressPercent(g),0)/group.items.length) : 0;
  const descRaw = first.description || group.items.map(g=>g.title).join(', ');
  const max = mode === 'detail' ? 210 : 145;
  const desc = String(descRaw || '').slice(0,max);
  return `<article class="v221SeriesCard v240Fix5Card ${mode} ${upcoming?'upcoming':''}"><div class="v221SeriesCover"><img src="${esc(fix10Cover(first))}" alt="${esc(group.name)}"><span>${group.items.length} oyun</span>${upcoming?'<b>Yakında</b>':''}</div><div class="v221SeriesBody"><h3>${esc(group.name)}</h3><p>${esc(desc)}${String(descRaw||'').length>max?'...':''}</p><div class="v221SeriesMini">${group.items.slice(0,4).map(g=>`<span><img src="${esc(fix10Cover(g))}" alt="">${esc(g.title)}</span>`).join('')}</div><div class="v221Meta"><small>%${percent} tamamlandı</small><b>${group.items.reduce((s,g)=>s+Number(g.eps||0),0)} bölüm</b></div><div class="v221Actions">${upcoming?'<button class="miniBtn v221Disabled" disabled>Yakında</button>':`<button class="miniBtn primary" data-watch-series="${esc(first.id||'')}">Seriyi İzle</button>`}${isStaff()?'<button class="miniBtn" data-admin="Seri İzleme">Sırala</button>':''}</div></div></article>`;
};
fix12SeriesCard = v221SeriesCard;
fix13SeriesCard = v221SeriesCard;

gameGrid = function(){
  const games = sortedVisibleGames();
  const adminActions = isStaff() && state.page === 'Yönetim Paneli' && state.adminPage === 'Oyunlar';
  if(!games.length) return '<section class="games v221ArchiveGrid compact v240Fix5Grid"><div class="card wide"><h2>Oyun bulunamadı</h2><p class="muted">Supabase oyun kayıtları bekleniyor. Rastgele/demo oyun gösterilmez.</p></div></section>';
  if(adminActions) return `<div class="v221ArchiveGrid admin ${esc(ho240Fix5ViewMode())} v240Fix5Grid">${games.map(g=>v221ArchiveCard(g,true)).join('')}</div>`;
  const title = state.page === 'Favoriler' ? 'Favoriler' : 'Oyun Arşivi';
  return `<section class="fix12ArchivePage v221ArchivePage v240Fix5ArchivePage"><div class="fix4ArchiveHeader"><div><span class="eyebrow">Supabase Dinamik Arşiv</span><h1>${esc(title)}</h1><p class="muted">Kompakt kartlar genişletildi; 4 kart yan yana, yazılar daha rahat okunur.</p></div><span class="pill green">${games.length} oyun</span></div>${fix12StatusTabs(state.page)}${advancedSearchPanel()}${v221ViewTools()}${v221AlphabetGameArchive(games)}</section>`;
};
seriesDirectoryPage = function(){
  const status = fix12SelectedSeriesStatus();
  const q = normalizeSearchText(state.query || '');
  const baseGames = state.games.filter(g=>fix13GameMatchesStrictStatus(g, status)).filter(g=>!q || normalizeSearchText(allGameText(g)).includes(q));
  const groups = sortedSeriesGroups(baseGames).sort((a,b)=>a.name.localeCompare(b.name,'tr'));
  const letterGroups = fix11Grouped(groups, g=>g.name);
  const mode = ho240Fix5ViewMode();
  return `<section class="fix12SeriesPage v221SeriesPage v240Fix5SeriesPage"><div class="seriesDirectoryHero"><span class="eyebrow">Supabase Seri Arşivi</span><h1>Seriler</h1><p>Seriler 4 kolon, daha geniş ve okunabilir kompakt kartlarla listelenir.</p><span class="pill green">${groups.length} seri</span></div>${fix12SeriesStatusTabs(status)}${v221ViewTools()}${fix11AlphabetBar(letterGroups,'seri-harf')}<div class="v221AlphabetSections v240Fix5AlphabetSections">${letterGroups.map(group=>`<section class="fix12LetterSection v221LetterSection" id="seri-harf-${group.letter==='0-9'?'num':esc(routeSlug(group.letter))}"><div class="fix11LetterHead"><div><span>${esc(group.letter)}</span><h2>${esc(group.letter)} Harfindeki Seriler</h2></div><b>${group.items.length} seri</b></div><div class="v221ArchiveGrid series ${esc(mode)} v240Fix5Grid">${group.items.map(v221SeriesCard).join('')}</div></section>`).join('') || '<section class="card wide"><h2>Seri bulunamadı</h2><p class="muted">Bu filtrede seri yok veya Supabase kayıtları henüz yüklenmedi.</p></section>'}</div></section>`;
};
function ho240Fix5EtaDate(raw){
  const text = String(raw || '').trim();
  if(!text) return null;
  const now = new Date();
  const iso = text.match(/(\d{4})[-.\/](\d{1,2})[-.\/](\d{1,2})(?:[ T](\d{1,2}):(\d{2}))?/);
  if(iso) return new Date(Number(iso[1]), Number(iso[2])-1, Number(iso[3]), Number(iso[4]||23), Number(iso[5]||59));
  const tr = text.match(/(\d{1,2})[.\/](\d{1,2})[.\/](\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
  if(tr) return new Date(Number(tr[3]), Number(tr[2])-1, Number(tr[1]), Number(tr[4]||23), Number(tr[5]||59));
  const time = text.match(/(\d{1,2}):(\d{2})/);
  if(time){ const d = new Date(now); d.setHours(Number(time[1]), Number(time[2]), 0, 0); if(d < now) d.setDate(d.getDate()+1); return d; }
  return null;
}
function ho240Fix5CountdownParts(raw){
  const target = ho240Fix5EtaDate(raw);
  if(!target) return null;
  const diff = Math.max(0, target.getTime() - Date.now());
  const totalMin = Math.floor(diff / 60000);
  const days = Math.floor(totalMin / 1440);
  const hours = Math.floor((totalMin % 1440) / 60);
  const minutes = totalMin % 60;
  return { days, hours, minutes, label: target.toLocaleString('tr-TR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' }) };
}
function ho240Fix5CountdownHtml(eta){
  const c = ho240Fix5CountdownParts(eta);
  if(!c) return `<div class="ho240Fix5Countdown"><div><b>--</b><span>Gün</span></div><div><b>--</b><span>Saat</span></div><div><b>--</b><span>Dakika</span></div></div>`;
  return `<div class="ho240Fix5Countdown"><div><b>${c.days}</b><span>Gün</span></div><div><b>${c.hours}</b><span>Saat</span></div><div><b>${c.minutes}</b><span>Dakika</span></div></div><div class="ho240Fix5OpenDate"><span>Açılış zamanı</span><b>${esc(c.label)}</b></div>`;
}
maintenancePage = function(){
  const percent = Math.max(0, Math.min(100, Number(state.maintenance?.percent || state.maintenance?.progress || 65)));
  const eta = String(state.maintenance?.eta || '').trim();
  const notes = String(state.maintenance?.updates || state.maintenance?.notes || 'Arşiv kartları iyileştiriliyor.\nBakım ekranı geri sayım ile yenileniyor.\nSupabase kayıtları korunuyor.').split('\n').map(x=>x.trim()).filter(Boolean).slice(0,5);
  return html`<section class="fix11MaintenancePublic ho240Fix5Maintenance"><div class="fix11MaintenanceBg"><img src="${FIX11_COVER}" alt="Hayatımız Oyun Kapak"></div><div class="fix11MaintenanceCard ho240Fix5MaintenanceCard"><img class="fix11MaintenanceLogo" src="${FIX11_LOGO}" alt="Hayatımız Oyun"><span class="eyebrow">Bakım Modu</span><h1>Hayatımız Oyun güncelleniyor.</h1><p>${esc(state.maintenance?.message || 'Site kısa süreli profesyonel bakımda. Güncelleme tamamlanınca arşiv tekrar açılacak.')}</p><div class="ho240Fix5ProgressRing" style="--p:${percent}"><b>%${percent}</b><span>Tamamlandı</span></div><div class="progressLine large"><span style="width:${percent}%"></span></div>${ho240Fix5CountdownHtml(eta)}<div class="maintenancePublicNotes ho240Fix5Notes"><b>Güncelleme Notları</b>${notes.map(n=>`<span>${esc(n)}</span>`).join('')}</div><div class="authButtons"><button class="btn primary" data-action="open-login">Yetkili Girişi</button>${isStaff()?'<button class="btn" data-admin="Bakım Modu">Yönetim Paneli</button>':''}</div></div></section>`;
};
maintenanceAdmin = function(){
  const m = state.maintenance || {};
  const percent = Math.max(0, Math.min(100, Number(m.percent || m.progress || 65)));
  const notes = String(m.updates || m.notes || 'Arşiv kartları iyileştiriliyor.\nBakım ekranı geri sayım ile yenileniyor.').split('\n').filter(Boolean);
  return `<section class="ho240Fix5MaintenanceAdmin"><div class="card wide ho240Hero"><div><span class="eyebrow">Bakım Modu ${HO240_FIX5_VERSION}</span><h1>Profesyonel Bakım Ekranı</h1><p class="muted">Yüzde, açılış günü/saat geri sayımı ve kullanıcıya görünecek notları buradan düzenle.</p></div><button class="btn ${state.maintenance?.enabled?'danger':'primary'}" data-action="toggle-maintenance">${state.maintenance?.enabled?'Bakımı Kapat':'Bakımı Aç'}</button></div><section class="card wide"><div class="ho240MaintGrid ho240Fix5MaintGrid"><div><label class="field">Bakım mesajı<input id="maintenanceMessage" value="${esc(m.message || 'Hayatımız Oyun kısa süreli bakımda.')}"></label><label class="field">Açılış günü / saat<input id="maintenanceEta" placeholder="Örn: 25.05.2026 22:30" value="${esc(m.eta || '')}"></label><label class="field">Tamamlanma yüzdesi<input id="maintenanceProgress" type="number" min="0" max="100" value="${percent}"></label><label class="field">Güncelleme notları<textarea id="maintenanceNotesText" rows="6">${esc(notes.join('\n'))}</textarea></label><div class="rowActions"><button class="btn primary" data-action="save-maintenance-settings">Bakım Görünümünü Kaydet</button><button class="btn" data-action="preview-maintenance-only">Önizlemeyi Yenile</button></div></div><div class="ho240MaintPreview ho240Fix5MaintPreview"><img src="${FIX11_COVER}" onerror="this.style.display='none'"><h2>Hayatımız Oyun güncelleniyor</h2><div class="ho240Fix5ProgressRing" style="--p:${percent}"><b>%${percent}</b><span>Tamamlandı</span></div>${ho240Fix5CountdownHtml(m.eta || '')}<div class="maintenancePublicNotes ho240Fix5Notes">${notes.map(n=>`<span>${esc(n)}</span>`).join('')}</div></div></div></section></section>`;
};
try{ render(); }catch(error){ showBootError(error); }



/* FIX24: Eski AI/Deploy bloğu kaynak dosyadan silindi. */
/* v2.4.0 FIX 8 - Stabil yönetim paneli, takvim ve bakım görünümü */
const HO240_FIX8_VERSION = 'v2.4.0 FIX 8';
const HO_FIX8_CAL_EDIT_KEY = 'hayatimiz_fix8_calendar_edit_id';
const HO_FIX8_DEPLOY_KEY = 'hayatimiz_fix8_deploy_state';
function hoFix8Pad(n){ return String(n).padStart(2,'0'); }
function hoFix8IsoToTr(value){
  const iso = parseTrDateToIsoFix6(value || '');
  if(!iso) return '';
  const [y,m,d] = iso.split('-');
  return `${d}.${m}.${y}`;
}
function hoFix8DateTimeToTr(value){
  const text = String(value || '').trim();
  if(!text) return '';
  const time = text.match(/(\d{1,2}):(\d{2})/);
  const date = hoFix8IsoToTr(text);
  return date ? `${date}${time ? ' '+hoFix8Pad(time[1])+':'+time[2] : ''}` : text;
}
function hoFix8ParseDate(value){ return parseTrDateToIsoFix6(value || ''); }
function hoFix8TodayTr(){ return new Date().toLocaleDateString('tr-TR', { day:'2-digit', month:'2-digit', year:'numeric' }); }
function hoFix8EventDate(ev){ return hoFix8IsoToTr(ev?.date || ev?.event_date || ev?.releaseDate || ''); }
function hoFix8ReadDeployState(){ return safeParse(localStorage.getItem(HO_FIX8_DEPLOY_KEY)||'{}', { github:false, vercel:false, supabase:false, ai:false, last:'' }); }
function hoFix8WriteDeployState(patch){ localStorage.setItem(HO_FIX8_DEPLOY_KEY, JSON.stringify({ ...hoFix8ReadDeployState(), ...patch, last:new Date().toLocaleString('tr-TR') })); }
function hoFix8Guide(){
  const items = [
    ['Genel Bakış','Sitenin genel durumunu, hızlı kontrolleri ve panel rehberini gösterir.'],
    ['Oyunlar','Oyun ekleme, mevcut oyunu düzenleme, meta/kapak/tür/hikaye çekme ve oyun silme alanıdır.'],
    ['Seri İzleme','Serileri ve seri içindeki oyun sırasını yönetmek için kullanılır.'],
    ['Seri Geçmişi','Seri sıralama değişikliklerini izler, karşılaştırır ve geri alma önizlemesi sunar.'],
    ['Yayın Takvimi','Yayın, bölüm, etkinlik ve çıkış tarihi kayıtlarını gün.ay.yıl formatında yönetir.'],
    ['Bildirim Kuyruğu','Takvim kayıtları için tarayıcı/e-posta bildirim taslaklarını test eder.'],
    ['Oyun İstekleri','Kullanıcıların istediği oyunları yetkililerin görüp yönetmesini sağlar.'],
    ['Hata Bildir','Kullanıcıların gönderdiği hata raporlarını yetkili paneline toplar.'],
    ['Raporlar','Oyun istekleri ve hata raporları için filtre, dışa aktarma ve öncelik yönetimi sunar.'],
    ['AI Özellik Ekle','Yeni özellik önerileri üretir, uygulananları takip eder ve nereye eklendiğini gösterir.'],
    ['Deploy Merkezi','GitHub, Vercel ve Supabase adımlarını kontrol listesi olarak takip eder.'],
    ['Schema Geçmişi','Supabase schema sürümlerini ve SQL zaman çizelgesini gösterir.'],
    ['Bakım Modu','Kullanıcıya görünen bakım ekranını, yüzdeyi, geri sayımı ve notları yönetir.'],
    ['Yönetim Kısayolları','Sık kullanılan yönetim aksiyonlarını role göre hızlı açar.'],
    ['Sistem Sağlık','Eksik kapak, bozuk video, API/ENV ve boş hikaye kontrolünü tek ekranda gösterir.'],
    ['Güncelleme Notları','Sürüm notlarını ekleme, arşivleme, düzenleme ve silme alanıdır.'],
    ['API/ENV Durumu','Supabase, API ve ortam değişkenlerinin bağlantı durumunu kontrol eder.'],
    ['Ayarlar','Tema, kart yoğunluğu ve kullanıcı görünüm tercihlerini yönetir.']
  ];
  return `<section class="card wide hoFix8Guide"><div class="sectionHead"><div><span class="eyebrow">Panel Rehberi</span><h2>Yönetim Panelindeki Bölümler Ne İşe Yarar?</h2><p class="muted">Bu rehber hangi panelin hangi işlem için kullanıldığını kısa ve net gösterir.</p></div><span class="pill green">${items.length} panel</span></div><div class="hoFix8GuideGrid">${items.map(([t,d])=>`<article><b>${esc(t)}</b><p>${esc(d)}</p></article>`).join('')}</div></section>`;
}
function hoFix8CalendarAdmin(){
  const events = getCalendarEventsFix6().filter(ev=>ev && ev.is_active !== false).sort((a,b)=>String(a.date||a.event_date||'').localeCompare(String(b.date||b.event_date||'')) || String(a.time||'').localeCompare(String(b.time||'')));
  const editId = localStorage.getItem(HO_FIX8_CAL_EDIT_KEY) || '';
  const editing = events.find(ev=>String(ev.id)===String(editId)) || null;
  const games = (Array.isArray(state.games)?state.games:[]).filter(g=>String(g.status||'').toLowerCase().includes('devam') || Number(g.eps||0)>0);
  const options = ['<option value="">Devam eden oyun seç</option>'].concat(games.map(g=>`<option value="${esc(g.id)}" ${String(editing?.gameId||editing?.game_id||'')===String(g.id)?'selected':''}>${esc(g.title)}</option>`)).join('');
  return `<section class="hoFix8CalendarAdmin"><div class="card wide ho240Hero"><div><span class="eyebrow">${HO240_FIX8_VERSION}</span><h1>Stabil Yayın Takvimi</h1><p class="muted">Tüm tarihler gün.ay.yıl biçiminde görünür. Kayıt ekle, düzenle, sil ve seçilen oyundan kapak/meta çek.</p></div><span class="pill green">${events.length} kayıt</span></div><section class="card wide"><form id="calendarEventForm" class="calendarEventForm hoFix8CalendarForm"><input type="hidden" name="id" value="${esc(editing?.id||'')}"><label class="field">Oyun seç<select name="gameId">${options}</select></label><label class="field">Yayın Başlığı<input name="title" required value="${esc(editing?.title||'')}" placeholder="Örn: A Plague Tale - 3. Bölüm"></label><label class="field">Bölüm No<input name="episodeNumber" type="number" min="0" value="${esc(editing?.episodeNumber||editing?.episode_number||'')}" placeholder="1"></label><label class="field">Bölüm Başlığı<input name="episodeTitle" value="${esc(editing?.episodeTitle||editing?.episode_title||'')}" placeholder="Örn: Farelerin Gazabı"></label><label class="field">Tarih <small>gün.ay.yıl</small><input name="date" value="${esc(hoFix8EventDate(editing)||hoFix8TodayTr())}" placeholder="25.05.2026" required></label><label class="field">Saat<input name="time" value="${esc(editing?.time||'20:00')}" placeholder="20:00"></label><label class="field">Tür<select name="type"><option ${editing?.type==='Ana Yayın'?'selected':''}>Ana Yayın</option><option ${editing?.type==='Seri Devamı'?'selected':''}>Seri Devamı</option><option ${editing?.type==='Yeni Bölüm'?'selected':''}>Yeni Bölüm</option><option ${editing?.type==='Özel Etkinlik'?'selected':''}>Özel Etkinlik</option><option ${editing?.type==='Topluluk Yayını'?'selected':''}>Topluluk Yayını</option><option ${editing?.type==='Çıkış Tarihi'?'selected':''}>Çıkış Tarihi</option></select></label><label class="field wideField">Kapak URL<input name="cover" value="${esc(editing?.cover||editing?.cover_url||'')}" placeholder="Oyun seçince otomatik gelir"></label><label class="field wideField">Not<textarea name="note" rows="4" placeholder="Kısa açıklama veya yayın notu">${esc(editing?.note||'')}</textarea></label><div class="formActionBar noSticky"><button class="btn" type="button" data-action="calendar-use-selected-game">Seçilen Oyundan Meta/Kapak Çek</button><button class="btn primary" type="button" data-action="save-calendar-event">${editing?'Takvimi Güncelle':'Takvime Kaydet'}</button>${editing?'<button class="btn" type="button" data-action="calendar-cancel-edit">Düzenlemeyi Kapat</button>':''}<button class="btn" type="button" data-page="Takvim">Takvimi Gör</button></div></form></section><section class="card wide"><div class="sectionHead"><div><h2>Kayıtlı Yayınlar</h2><p class="muted">Düzenle/Sil butonları sayfa yenilemeden çalışır.</p></div><span class="pill">${events.length} kayıt</span></div><div class="calendarAdminList hoFix8CalendarList">${events.map(ev=>`<article><img src="${esc(ev.cover||ev.cover_url||'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop')}" alt="${esc(ev.title)}"><div><b>${esc(ev.title)}</b><small>${esc(hoFix8EventDate(ev))} • ${esc(ev.time||'20:00')} • ${esc(ev.type||'Yayın')}</small><p>${esc((ev.episodeTitle||ev.episode_title)?`${ev.episodeNumber||ev.episode_number||''}. Bölüm - ${ev.episodeTitle||ev.episode_title}`:(ev.note||''))}</p></div><div class="rowActions"><button class="miniBtn" data-action="edit-calendar-event" data-calendar-id="${esc(ev.id)}">Düzenle</button><button class="miniBtn danger" data-action="delete-calendar-event" data-calendar-id="${esc(ev.id)}">Sil</button></div></article>`).join('') || '<p class="muted">Takvim kaydı yok.</p>'}</div></section></section>`;
}
calendarAdminPanelFix6 = hoFix8CalendarAdmin;
calendarPage = function(){
  const events = getCalendarEventsFix6().filter(ev=>ev && ev.is_active !== false).sort((a,b)=>String(a.date||a.event_date||'').localeCompare(String(b.date||b.event_date||''))).slice(0,40);
  const now = new Date();
  const base = events[0]?.date ? new Date(hoFix8ParseDate(events[0].date)+'T12:00:00') : now;
  const y = base.getFullYear(), m = base.getMonth();
  const first = new Date(y,m,1), start = new Date(first); start.setDate(first.getDate()-((first.getDay()+6)%7));
  const days = Array.from({length:35},(_,i)=>{ const d=new Date(start); d.setDate(start.getDate()+i); return d; });
  const dayNames = ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'];
  const upcoming = events.filter(ev=>hoFix8ParseDate(ev.date)>=`${now.getFullYear()}-${hoFix8Pad(now.getMonth()+1)}-${hoFix8Pad(now.getDate())}`).slice(0,8);
  return `<section class="fix6CalendarShell hoFix8CalendarPage"><div class="fix6CalendarMain card wide"><div class="fix6CalendarHead"><div><span class="calendarIcon">▣</span><div><h1>Yayın Takvimi</h1><p class="muted">Yayınlar gün.ay.yıl formatında listelenir; yönetim panelindeki kayıtlar buraya düşer.</p></div></div></div><div class="fix6CalendarToolbar"><button class="miniBtn primary">Bugün</button><div class="monthChip">${base.toLocaleDateString('tr-TR',{month:'long',year:'numeric'})}</div>${isStaff()?'<button class="miniBtn" data-admin="Yayın Takvimi">Takvimi Düzenle</button>':''}</div><div class="fix6CalendarGrid">${dayNames.map(d=>`<div class="dayHead">${d}</div>`).join('')}${days.map(d=>{ const iso=`${d.getFullYear()}-${hoFix8Pad(d.getMonth()+1)}-${hoFix8Pad(d.getDate())}`; const cell=events.filter(ev=>hoFix8ParseDate(ev.date)===iso); return `<div class="dayCell ${d.getMonth()===m?'':'mutedCell'}"><span class="dayNo">${d.getDate()}</span>${cell.slice(0,3).map(ev=>`<div class="calEvent ${eventToneFix6(ev.type)}"><small>${esc(ev.time||'20:00')}</small><b>${esc(ev.title)}</b></div>`).join('')}</div>`; }).join('')}</div></div><aside class="fix6CalendarAside"><section class="card"><h3>Yaklaşan Yayınlar</h3><div class="upcomingList">${upcoming.map(ev=>`<div class="upcomingItem"><img src="${esc(ev.cover||'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop')}" alt="${esc(ev.title)}"><div><b>${esc(ev.title)}</b><small>${esc(ev.type||'Yayın')}</small><span>${esc(hoFix8EventDate(ev))}, ${esc(ev.time||'20:00')}</span></div></div>`).join('') || '<p class="muted">Yaklaşan yayın yok.</p>'}</div></section></aside></section>`;
};
maintenanceAdmin = function(){
  const m = state.maintenance || {};
  const p = Math.max(0, Math.min(100, Number(m.percent||m.progress||65)));
  const eta = hoFix8DateTimeToTr(m.eta || '');
  const notes = String(m.updates||m.notesText||m.notes||'Supabase kayıtları korunuyor.\nYönetim paneli butonları kontrol ediliyor.\nYayın takvimi stabil hale getiriliyor.');
  return `<section class="hoFix7Panel hoFix8MaintenanceAdmin"><div class="card wide ho240Hero"><div><span class="eyebrow">${HO240_FIX8_VERSION}</span><h1>Profesyonel Bakım Modu</h1><p class="muted">Tarih gün.ay.yıl saat:dakika formatında saklanır; kullanıcı ekranındaki geri sayımı burada önizlersin.</p></div><button class="btn ${m.enabled?'danger':'primary'}" data-action="toggle-maintenance">${m.enabled?'Bakımı Kapat':'Bakımı Aç'}</button></div><section class="card wide"><div class="hoFix7MaintGrid"><div><label class="field">Bakım mesajı<input id="maintenanceMessage" value="${esc(m.message||'Hayatımız Oyun kısa süreli bakımda.')}"></label><label class="field">Açılış günü / saat <small>gün.ay.yıl saat:dakika</small><input id="maintenanceEta" placeholder="25.05.2026 22:30" value="${esc(eta)}"></label><label class="field">Tamamlanma yüzdesi<input id="maintenanceProgress" type="number" min="0" max="100" value="${p}"></label><label class="field">Güncelleme notları<textarea id="maintenanceNotesText" rows="6">${esc(notes)}</textarea></label><div class="rowActions"><button class="btn primary" data-action="save-maintenance-settings">Bakım Görünümünü Kaydet</button><button class="btn" data-action="preview-maintenance-only">Önizlemeyi Yenile</button></div></div><div class="hoFix7MaintPreview"><h2>Kullanıcı Önizlemesi</h2><div class="hoFix7Ring small" style="--p:${p}"><b>%${p}</b></div>${ho240Fix7CountdownHtml(eta)}<p>${esc(m.message||'Hayatımız Oyun kısa süreli bakımda.')}</p></div></div></section></section>`;
};
ho240DeployCenter = function(){
  const s = hoFix8ReadDeployState();
/* FIX24: eski AI/Deploy satırı silindi. */
/* FIX24: eski AI/Deploy satırı silindi. */
};
const hoFix8OldAdminBody = adminBody;
adminBody = function(){
  if(state.adminPage === 'Genel Bakış') return hoFix8Guide() + hoFix8OldAdminBody();
  if(state.adminPage === 'Yayın Takvimi') return hoFix8CalendarAdmin();
  if(state.adminPage === 'Deploy Merkezi') return ho240DeployCenter();
  if(state.adminPage === 'Bakım Modu') return maintenanceAdmin();
  return hoFix8OldAdminBody();
};
const hoFix8OldOnAction = onAction;
onAction = async function(e){
  const action = e.currentTarget?.dataset?.action || '';
  try{
    if(action === 'calendar-use-selected-game'){
      e.preventDefault(); e.stopImmediatePropagation();
      const form = document.getElementById('calendarEventForm'); if(!form) return;
      const g = state.games.find(x=>String(x.id)===String(form.elements.gameId?.value)); if(!g) return setToast('Önce devam eden oyun seç.');
      const ep = String(form.elements.episodeNumber?.value||'').trim();
      form.elements.title.value = ep ? `${g.title} - ${ep}. Bölüm` : g.title;
      form.elements.cover.value = coverFor(g);
      form.elements.note.value = g.description || g.genre || '';
      if(form.elements.type) form.elements.type.value = Number(g.eps||0)>0 ? 'Yeni Bölüm' : 'Ana Yayın';
      setToast('Oyun adı, kapak ve meta takvim formuna çekildi.'); return;
    }
    if(action === 'save-calendar-event'){
      e.preventDefault(); e.stopImmediatePropagation();
      const form = document.getElementById('calendarEventForm'); if(!form) return;
      const fd = new FormData(form); const id = String(fd.get('id')||localStorage.getItem(HO_FIX8_CAL_EDIT_KEY)||'').trim() || `cal-${Date.now()}`;
      const g = state.games.find(x=>String(x.id)===String(fd.get('gameId')||''));
      const event = { id, title:String(fd.get('title')||'').trim() || g?.title || 'Yeni Yayın', gameId:String(fd.get('gameId')||''), gameTitle:g?.title||'', episodeNumber:String(fd.get('episodeNumber')||''), episodeTitle:String(fd.get('episodeTitle')||''), date:hoFix8ParseDate(fd.get('date')), time:String(fd.get('time')||'20:00'), type:String(fd.get('type')||'Ana Yayın'), cover:String(fd.get('cover')||'').trim() || (g?coverFor(g):''), note:String(fd.get('note')||'').trim(), is_active:true };
      if(!event.title || !event.date) return setToast('Takvim için başlık ve gün.ay.yıl tarih gerekli.');
      const next = getCalendarEventsFix6().filter(x=>String(x.id)!==String(id)); next.push(event); saveCalendarEventsFix6(next); localStorage.removeItem(HO_FIX8_CAL_EDIT_KEY); render(); setToast('Yayın takvimi kaydedildi.');
      try{ await api('calendar-events-upsert',{adminToken:state.session?.adminToken,event}); }catch(err){ console.warn('Takvim Supabase kaydı atlandı',err); }
      return;
    }
    if(action === 'edit-calendar-event'){ e.preventDefault(); e.stopImmediatePropagation(); localStorage.setItem(HO_FIX8_CAL_EDIT_KEY, e.currentTarget.dataset.calendarId||''); render(); return; }
    if(action === 'calendar-cancel-edit'){ e.preventDefault(); e.stopImmediatePropagation(); localStorage.removeItem(HO_FIX8_CAL_EDIT_KEY); render(); return; }
    if(action === 'delete-calendar-event'){ e.preventDefault(); e.stopImmediatePropagation(); const id=e.currentTarget.dataset.calendarId||''; saveCalendarEventsFix6(getCalendarEventsFix6().filter(x=>String(x.id)!==String(id))); localStorage.removeItem(HO_FIX8_CAL_EDIT_KEY); render(); setToast('Takvim kaydı silindi.'); try{ await api('calendar-events-delete',{adminToken:state.session?.adminToken,id}); }catch{} return; }
    if(action === 'ho-fix8-run-auto-flow' || action === 'ho-fix8-mark-github' || action === 'ho-fix8-mark-vercel' || action === 'ho-fix8-mark-supabase'){
      e.preventDefault(); e.stopImmediatePropagation();
      const patch = action==='ho-fix8-run-auto-flow' ? {ai:true,github:true,vercel:true,supabase:true} : action==='ho-fix8-mark-github' ? {github:true} : action==='ho-fix8-mark-vercel' ? {vercel:true} : {supabase:true};
      hoFix8WriteDeployState(patch); try{ await api('deploy-event-save',{event:{provider:'admin_panel',status:'success',message:action,version:HO240_FIX8_VERSION}}); }catch{} render(); setToast('Deploy / AI tanı durumu güncellendi.'); return;
    }
    if(action === 'ho-fix8-schema-feedback'){
      e.preventDefault(); e.stopImmediatePropagation(); const msg=document.getElementById('hoFix8SchemaFeedback')?.value||''; if(!msg.trim()) return setToast('Önce geri bildirim yaz.');
      try{ await api('schema-feedback-add',{feedback:{version:HO240_FIX8_VERSION,source:'admin_panel',message:msg}}); setToast('Supabase geri bildirimi kaydedildi.'); }catch(err){ setToast('Geri bildirim local not olarak kaldı: '+err.message); }
      return;
    }
    if(action === 'save-maintenance-settings' || action === 'preview-maintenance-only'){
      e.preventDefault(); e.stopImmediatePropagation();
      const eta = hoFix8DateTimeToTr(document.getElementById('maintenanceEta')?.value || '');
      state.maintenance = { ...(state.maintenance||{}), message:document.getElementById('maintenanceMessage')?.value||'Hayatımız Oyun kısa süreli bakımda.', eta, percent:Number(document.getElementById('maintenanceProgress')?.value||0), progress:Number(document.getElementById('maintenanceProgress')?.value||0), updates:document.getElementById('maintenanceNotesText')?.value||'' };
      localStorage.setItem(MAINTENANCE_KEY, JSON.stringify(state.maintenance));
      if(action==='save-maintenance-settings') try{ await api('settings-set',{adminToken:state.session?.adminToken,maintenance:state.maintenance}); }catch{}
      render(); setToast('Bakım görünümü gün.ay.yıl formatıyla kaydedildi.'); return;
    }
    return await hoFix8OldOnAction(e);
  }catch(err){ console.error(err); setToast('İşlem hatası: '+(err.message||err)); }
};
try{ localStorage.setItem('hayatimiz_last_fix_version', HO240_FIX8_VERSION); render(); }catch(error){ showBootError(error); }


/* v2.4.0 FIX 9 - doğru oyun kapağı + bakım notları kullanıcıya görünür */
const HO240_FIX9_VERSION = 'v2.4.0 FIX 9';
const HO240_FIX9_KNOWN_META = [
  {rx:/a\s*way\s*out|away\s*out/i,title:'A Way Out',seriesName:'A Way Out',genre:'Aksiyon-macera, co-op, hikaye odaklı, kaçış, sinematik',releaseDate:'23.03.2018',score:8.2,cover:'https://cdn.akamai.steamstatic.com/steam/apps/1222700/header.jpg',story:"A Way Out, birbirinden farklı geçmişlere ve motivasyonlara sahip iki mahkum olan Leo ve Vincent'ın hapishaneden kaçışını ve ardından ortak düşmanlarından intikam alma süreçlerini anlatan tamamen eşli oynanışa dayalı sinematik bir aksiyon-macera oyunudur. Oyun, iki karakterin güven, fedakarlık ve hayatta kalma üzerine kurulu ortak yolculuğunu bölüm bölüm takip eder."},
  {rx:/alan\s*wake.*remaster|alan\s*wake/i,title:'Alan Wake Remastered',seriesName:'Alan Wake',genre:'Aksiyon-macera, psikolojik korku, hikaye odaklı, tek oyunculu',releaseDate:'05.10.2021',score:8.0,cover:'https://cdn.akamai.steamstatic.com/steam/apps/108710/header.jpg',story:'Alan Wake Remastered, yazar Alan Wake’in Bright Falls kasabasında eşinin kayboluşunu araştırırken kendi yazdığı karanlık hikayenin gerçekliğe dönüşmesiyle yüzleşmesini anlatan psikolojik korku ve aksiyon-macera oyunudur. Işık ve karanlık arasındaki mücadele, oyuncuyu gerilim dolu bir gizemin içine çeker.'},
  {rx:/plague.*innocence|innocence/i,title:'A Plague Tale: Innocence',seriesName:'A Plague Tale',genre:'Macera, aksiyon, gizlilik, hikaye odaklı, tek oyunculu',releaseDate:'14.05.2019',score:8.3,cover:'https://cdn.akamai.steamstatic.com/steam/apps/752590/header.jpg',story:'A Plague Tale: Innocence, Amicia ve küçük kardeşi Hugo’nun veba, savaş ve Engizisyon tehdidi altındaki Orta Çağ Fransa’sında hayatta kalma mücadelesini anlatır. Oyun; aile bağı, korku, kaçış ve fedakarlık temalarını gizlilik odaklı ilerleyişle işler.'},
  {rx:/plague.*requiem|requiem/i,title:'A Plague Tale: Requiem',seriesName:'A Plague Tale',genre:'Macera, aksiyon, gizlilik, hikaye odaklı, tek oyunculu',releaseDate:'18.10.2022',score:8.6,cover:'https://cdn.akamai.steamstatic.com/steam/apps/1182900/header.jpg',story:'A Plague Tale: Requiem, Amicia ve Hugo’nun yeni bir başlangıç ararken Hugo’nun laneti ve fare salgınının yarattığı tehditle yeniden yüzleşmesini anlatır. Kardeşlik, umut arayışı ve karanlık bir dünyada hayatta kalma mücadelesi sinematik şekilde işlenir.'},
  {rx:/assassin.*origins|origins/i,title:"Assassin's Creed Origins",seriesName:"Assassin's Creed",genre:'Aksiyon, RPG, açık dünya, tarihi macera, gizlilik',releaseDate:'27.10.2017',score:8.5,cover:'https://cdn.akamai.steamstatic.com/steam/apps/582160/header.jpg',story:"Assassin's Creed Origins, Antik Mısır'da Bayek ve Aya'nın kişisel kayıplarından doğan adalet arayışını ve Suikastçı Kardeşliği'nin temellerine uzanan olayları anlatır. Açık dünya, tarihsel atmosfer ve aksiyon-RPG sistemleriyle seri köken hikayesini işler."},
  {rx:/cyberpunk\s*2077/i,title:'Cyberpunk 2077',seriesName:'Cyberpunk',genre:'Aksiyon RPG, açık dünya, bilim kurgu, hikaye odaklı',releaseDate:'10.12.2020',score:9.1,cover:'https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg',story:'Cyberpunk 2077, Night City’de V adlı paralı askerin ölümsüzlük vadeden bir çip yüzünden kontrolden çıkan hayatını ve kimlik, güç, özgürlük temalarını işleyen açık dünya aksiyon-RPG oyunudur.'},
  {rx:/witcher\s*3|wild\s*hunt/i,title:'The Witcher 3: Wild Hunt',seriesName:'The Witcher',genre:'RPG, açık dünya, fantastik, hikaye odaklı',releaseDate:'19.05.2015',score:9.6,cover:'https://cdn.akamai.steamstatic.com/steam/apps/292030/header.jpg',story:'The Witcher 3: Wild Hunt, canavar avcısı Geralt’ın Ciri’yi bulmak için savaş ve karanlık güçlerle parçalanmış bir dünyada verdiği mücadeleyi anlatan, seçimlerin sonuçlarını ön plana çıkaran açık dünya RPG oyunudur.'},
  {rx:/elden\s*ring/i,title:'Elden Ring',seriesName:'Elden Ring',genre:'Aksiyon RPG, açık dünya, soulslike, fantastik',releaseDate:'25.02.2022',score:9.6,cover:'https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg',story:'Elden Ring, parçalanmış bir dünyanın sırlarını keşfeden oyuncuyu büyük düşmanlar, kadim güçler ve özgür keşif üzerine kurulu karanlık fantastik bir yolculuğa çıkarır.'},
  {rx:/red\s*dead\s*redemption\s*2|rdr\s*2/i,title:'Red Dead Redemption 2',seriesName:'Red Dead',genre:'Aksiyon-macera, açık dünya, western, hikaye odaklı',releaseDate:'26.10.2018',score:9.7,cover:'https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg',story:'Red Dead Redemption 2, Van der Linde çetesinin çöküşünü ve Arthur Morgan’ın sadakat, hayatta kalma ve vicdan arasındaki mücadelesini anlatan sinematik açık dünya western oyunudur.'},
  {rx:/god\s*of\s*war\s*ragnarok|ragnarök/i,title:'God of War Ragnarök',seriesName:'God of War',genre:'Aksiyon-macera, mitoloji, hikaye odaklı',releaseDate:'09.11.2022',score:9.4,cover:'https://cdn.akamai.steamstatic.com/steam/apps/2322010/header.jpg',story:'God of War Ragnarök, Kratos ve Atreus’un İskandinav mitolojisinin yaklaşan yıkımı içinde aile, kader ve savaşın bedeliyle yüzleşmesini anlatan sinematik aksiyon-macera oyunudur.'}
];
function ho240Fix9BadCover(url){ return !url || /unsplash\.com\/photo-1550745165|unsplash\.com\/photo-1542751371|unsplash\.com\/photo-1511512578|arcade|wallpaper|random/i.test(String(url)); }
function ho240Fix9KnownMeta(title){
  const raw = String(title||'');
  const slug = typeof ho240Fix7Slug === 'function' ? ho240Fix7Slug(raw) : raw.toLowerCase();
  const found = HO240_FIX9_KNOWN_META.find(x=>x.rx.test(raw) || x.rx.test(slug));
  if(found) return { ...found, tags:found.genre, released:found.releaseDate, exact:true };
  return null;
}
try{
  const oldLocalGameMetaFix9 = typeof localGameMeta === 'function' ? localGameMeta : null;
  localGameMeta = function(title){
    const known = ho240Fix9KnownMeta(title);
    if(known) return known;
    const old = oldLocalGameMetaFix9 ? oldLocalGameMetaFix9(title) : {};
    const cleanTitle = String(title || old.title || 'Yeni Oyun').trim();
    const cover = ho240Fix9BadCover(old.cover) ? '' : old.cover;
    return { ...old, title:cleanTitle, cover, released:old.released||old.releaseDate||'', releaseDate:old.releaseDate||old.released||'', genre:old.genre||'Aksiyon-macera, hikaye odaklı', score:old.score||8.5 };
  };
}catch{}
async function ho240Fix9MetaFill(form){
  if(!form) return setToast('Oyun formu açık değil.');
  const entered = String(form.elements?.title?.value || '').trim();
  if(!entered) return setToast('Önce oyun adını yaz.');
  let meta = ho240Fix9KnownMeta(entered) || (typeof ho240Fix7Meta === 'function' ? ho240Fix7Meta(entered) : { title:entered });
  try{
    const data = await api('game-meta', { adminToken:state.session?.adminToken, title:meta.title || entered });
    const apiMeta = data?.meta || {};
    const apiTitle = String(apiMeta.title || '').trim();
    const titleLooksRight = apiTitle && ho240Fix7Slug(apiTitle).includes((ho240Fix7Slug(meta.title||entered).split(' ')[0]||''));
    const apiCoverGood = !ho240Fix9BadCover(apiMeta.cover);
    if(!meta.exact && titleLooksRight){ meta = { ...meta, ...apiMeta, title:apiTitle }; }
    if(apiCoverGood && !meta.exact){ meta.cover = apiMeta.cover; }
  }catch(err){ console.warn('FIX9 meta API atlandı', err); }
  if(ho240Fix9BadCover(meta.cover)){
    const known = ho240Fix9KnownMeta(meta.title || entered);
    meta.cover = known?.cover || form.elements?.cover?.value || '';
  }
  const releaseDate = typeof ho240Fix7Date === 'function' ? ho240Fix7Date(meta.releaseDate || meta.released || '') : (meta.releaseDate || meta.released || '');
  const patch = { title:meta.title || entered, seriesName:meta.seriesName || form.elements?.seriesName?.value || '', genre:meta.genre || 'Aksiyon-macera, hikaye odaklı', tags:meta.tags || meta.genre || '', releaseDate, score:meta.score || 8.5, cover:meta.cover || '', description:form.elements?.description?.value || meta.story || '' };
  ho240Fix7PatchForm(form, patch);
  if(!patch.cover) setToast('Meta çekildi fakat güvenilir kapak bulunamadı. Kapak URL alanına manuel kapak ekleyebilirsin.');
  else setToast(`${patch.title} için doğru kapak, tarih ve türler forma aktarıldı.`);
}
function ho240Fix9StoryFill(form){
  if(!form) return setToast('Oyun formu açık değil.');
  const title = String(form.elements?.title?.value || '').trim();
  if(!title) return setToast('Önce oyun adını yaz.');
  const meta = ho240Fix9KnownMeta(title) || ho240Fix7Meta(title);
  ho240Fix7PatchForm(form, { title:meta.title || title, genre:form.elements?.genre?.value || meta.genre, description:meta.story || `${title}, karakter motivasyonları, ana çatışma ve bölüm bölüm ilerleyen hikaye yapısıyla arşivde takip edilecek bir oyun deneyimi sunar.` });
  setToast('Hikaye daha detaylı Türkçe metin olarak yazıldı.');
}
function ho240Fix9GenreFill(form){
  if(!form) return setToast('Oyun formu açık değil.');
  const title = String(form.elements?.title?.value || '').trim();
  if(!title) return setToast('Önce oyun adını yaz.');
  const meta = ho240Fix9KnownMeta(title) || ho240Fix7Meta(title);
  ho240Fix7PatchForm(form, { title:meta.title || title, genre:meta.genre, tags:meta.tags || meta.genre });
  setToast('Türler güvenli Türkçe liste olarak tekrar yazıldı.');
}
function ho240Fix9MaintenanceNotes(m){
  const raw = m?.updates || m?.notesText || m?.publicNotes || m?.notes || '';
  const arr = Array.isArray(raw) ? raw : String(raw || '').split(/\n+/);
  return arr.map(x=>String(x).trim()).filter(Boolean).slice(0,8);
}
maintenancePage = function(){
  const m = state.maintenance || {};
  const p = Math.max(0, Math.min(100, Number(m.percent || m.progress || 65)));
  const notes = ho240Fix9MaintenanceNotes(m);
  const eta = typeof ho240Fix7Date === 'function' ? ho240Fix7Date(m.eta || '') : (m.eta || '');
  const noteHtml = notes.length ? notes.map(n=>`<span>${esc(n)}</span>`).join('') : '<span>Güncelleme notları yönetim panelinden eklendiğinde burada görünecek.</span>';
  return html`<section class="hoFix7Maintenance hoFix9Maintenance"><div class="hoFix7Bg"><img src="/assets/hayatimiz-kapak.png" onerror="this.style.display='none'"></div><div class="hoFix7MaintenanceCard hoFix9MaintenanceCard"><img src="/assets/hayatimiz-logo.png" onerror="this.style.display='none'"><span class="eyebrow">Bakım Modu • ${HO240_FIX9_VERSION}</span><h1>Hayatımız Oyun güncelleniyor.</h1><p>${esc(m.message || 'Site kısa süreli profesyonel bakımda. Kayıtlı oyunlar ve Supabase verileri korunuyor.')}</p><div class="hoFix7Ring" style="--p:${p}"><b>%${p}</b><span>Tamamlandı</span></div>${ho240Fix7CountdownHtml(eta)}<div class="hoFix7Notes hoFix9PublicNotes"><b>Güncelleme Notları</b>${noteHtml}</div><div class="authButtons"><button class="btn primary" data-action="open-login">Yetkili Girişi</button>${isStaff()?'<button class="btn" data-admin="Bakım Modu">Yönetim Paneli</button>':''}</div></div></section>`;
};
maintenanceAdmin = function(){
  const m = state.maintenance || {};
  const p = Math.max(0, Math.min(100, Number(m.percent || m.progress || 65)));
  const eta = typeof hoFix8DateTimeToTr === 'function' ? hoFix8DateTimeToTr(m.eta || '') : (m.eta || '');
  const notes = ho240Fix9MaintenanceNotes(m).join('\n') || 'Kapak/meta sistemi düzeltildi.\nBakım notları kullanıcılara gösteriliyor.\nSupabase kayıtları korunuyor.';
  return `<section class="hoFix7Panel hoFix8MaintenanceAdmin hoFix9MaintenanceAdmin"><div class="card wide ho240Hero"><div><span class="eyebrow">${HO240_FIX9_VERSION}</span><h1>Profesyonel Bakım Modu</h1><p class="muted">Bakım notları artık kullanıcı ekranında da görünür. Tarih gün.ay.yıl saat:dakika formatında saklanır.</p></div><button class="btn ${m.enabled?'danger':'primary'}" data-action="toggle-maintenance">${m.enabled?'Bakımı Kapat':'Bakımı Aç'}</button></div><section class="card wide"><div class="hoFix7MaintGrid"><div><label class="field">Bakım mesajı<input id="maintenanceMessage" value="${esc(m.message||'Hayatımız Oyun kısa süreli bakımda.')}" /></label><label class="field">Açılış günü / saat <small>gün.ay.yıl saat:dakika</small><input id="maintenanceEta" placeholder="25.05.2026 22:30" value="${esc(eta)}" /></label><label class="field">Tamamlanma yüzdesi<input id="maintenanceProgress" type="number" min="0" max="100" value="${p}" /></label><label class="field">Kullanıcıya Gösterilecek Güncelleme Notları<textarea id="maintenanceNotesText" rows="7" placeholder="Her satır kullanıcı ekranında ayrı not olarak görünür.">${esc(notes)}</textarea></label><div class="rowActions"><button class="btn primary" data-action="save-maintenance-settings">Bakım Görünümünü Kaydet</button><button class="btn" data-action="preview-maintenance-only">Önizlemeyi Yenile</button></div></div><div class="hoFix7MaintPreview"><h2>Kullanıcı Önizlemesi</h2><div class="hoFix7Ring small" style="--p:${p}"><b>%${p}</b></div>${ho240Fix7CountdownHtml(eta)}<p>${esc(m.message||'Hayatımız Oyun kısa süreli bakımda.')}</p><div class="hoFix9MiniNotes">${notes.split(/\n+/).map(n=>`<span>${esc(n)}</span>`).join('')}</div></div></div></section></section>`;
};
const hoFix9OldOnAction = onAction;
onAction = async function(e){
  const action = e.currentTarget?.dataset?.action || '';
  try{
    if(['auto-game-meta','auto-game-meta-edit'].includes(action)){ e.preventDefault(); e.stopImmediatePropagation(); const form=e.currentTarget.closest('form')||document.getElementById(action.includes('edit')?'gameEditForm':'gameAddForm'); await ho240Fix9MetaFill(form); return; }
    if(['fetch-game-story','fetch-game-story-edit','fix12-refetch-story','v222-refetch-story'].includes(action)){ e.preventDefault(); e.stopImmediatePropagation(); ho240Fix9StoryFill(e.currentTarget.closest('form')||document.getElementById(state.editingGameId?'gameEditForm':'gameAddForm')); return; }
    if(['fix10-fetch-genres','fix12-refetch-genres','v222-refetch-genres'].includes(action)){ e.preventDefault(); e.stopImmediatePropagation(); ho240Fix9GenreFill(e.currentTarget.closest('form')||document.getElementById(state.editingGameId?'gameEditForm':'gameAddForm')); return; }
    if(action === 'save-maintenance-settings' || action === 'preview-maintenance-only'){
      e.preventDefault(); e.stopImmediatePropagation();
      const rawNotes = document.getElementById('maintenanceNotesText')?.value || '';
      const noteList = rawNotes.split(/\n+/).map(x=>x.trim()).filter(Boolean);
      const eta = typeof hoFix8DateTimeToTr === 'function' ? hoFix8DateTimeToTr(document.getElementById('maintenanceEta')?.value || '') : (document.getElementById('maintenanceEta')?.value || '');
      state.maintenance = { ...(state.maintenance || {}), message:document.getElementById('maintenanceMessage')?.value || 'Hayatımız Oyun kısa süreli bakımda.', eta, percent:Number(document.getElementById('maintenanceProgress')?.value || 0), progress:Number(document.getElementById('maintenanceProgress')?.value || 0), updates:rawNotes, notesText:rawNotes, notes:rawNotes, publicNotes:noteList };
      localStorage.setItem(MAINTENANCE_KEY, JSON.stringify(state.maintenance));
      if(action === 'save-maintenance-settings') try{ await api('settings-set', { adminToken:state.session?.adminToken, maintenance:state.maintenance }); }catch(err){ console.warn('Bakım Supabase kaydı atlandı', err); }
      render(); setToast(action === 'save-maintenance-settings' ? 'Bakım notları kullanıcı ekranına kaydedildi.' : 'Bakım önizlemesi güncellendi.'); return;
    }
    return await hoFix9OldOnAction(e);
  }catch(err){ console.error(err); setToast('İşlem hatası: '+(err.message||err)); }
};
try{ localStorage.setItem('hayatimiz_last_fix_version', HO240_FIX9_VERSION); render(); }catch(error){ showBootError(error); }


/* v2.4.0 FIX 10 - final stabil: seriesGroups, kapak seçici, AI versiyon seçimi */
function seriesGroups(games = state.games){
  try { return sortedSeriesGroups((games || state.games || []).filter(g => String(g.seriesName || '').trim() || Number(g.eps || 0) > 0)); }
  catch { return []; }
}
const HO240F10_VERSION = 'v2.4.0 FIX 10';
function ho240f10Date(value){
  if(!value) return '';
  const raw = String(value).trim();
  const iso = raw.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if(iso) return `${iso[3].padStart(2,'0')}.${iso[2].padStart(2,'0')}.${iso[1]}`;
  const tr = raw.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})(.*)$/);
  if(tr) return `${tr[1].padStart(2,'0')}.${tr[2].padStart(2,'0')}.${tr[3]}${tr[4]||''}`.trim();
  return raw;
}
function ho240f10BadCover(url){ return /unsplash|arcade|hot.?shot|photo-|images\.unsplash/i.test(String(url || '')); }
const HO240F10_COVERS = [
  {rx:/a\s*way\s*out|away\s*out/i,title:'A Way Out',seriesName:'A Way Out',releaseDate:'23.03.2018',genre:'Aksiyon-macera, co-op, hikaye odaklı, sinematik kaçış',score:8.2,covers:['https://cdn.akamai.steamstatic.com/steam/apps/1222700/header.jpg','https://cdn.akamai.steamstatic.com/steam/apps/1222700/capsule_616x353.jpg']},
  {rx:/alan\s*wake.*remaster|alan\s*wake/i,title:'Alan Wake Remastered',seriesName:'Alan Wake',releaseDate:'05.10.2021',genre:'Aksiyon-macera, psikolojik korku, hikaye odaklı, tek oyunculu',score:8.0,covers:['https://cdn.akamai.steamstatic.com/steam/apps/108710/header.jpg','https://cdn.akamai.steamstatic.com/steam/apps/108710/capsule_616x353.jpg']},
  {rx:/plague.*innocence|innocence/i,title:'A Plague Tale: Innocence',seriesName:'A Plague Tale',releaseDate:'14.05.2019',genre:'Macera, aksiyon, gizlilik, hikaye odaklı, tek oyunculu',score:8.3,covers:['https://cdn.akamai.steamstatic.com/steam/apps/752590/header.jpg','https://cdn.akamai.steamstatic.com/steam/apps/752590/capsule_616x353.jpg']},
  {rx:/plague.*requiem|requiem/i,title:'A Plague Tale: Requiem',seriesName:'A Plague Tale',releaseDate:'18.10.2022',genre:'Macera, aksiyon, gizlilik, hikaye odaklı, tek oyunculu',score:8.6,covers:['https://cdn.akamai.steamstatic.com/steam/apps/1182900/header.jpg','https://cdn.akamai.steamstatic.com/steam/apps/1182900/capsule_616x353.jpg']},
  {rx:/assassin.*origins|origins/i,title:"Assassin's Creed Origins",seriesName:"Assassin's Creed",releaseDate:'27.10.2017',genre:'Aksiyon, RPG, açık dünya, tarihi macera, gizlilik',score:8.5,covers:['https://cdn.akamai.steamstatic.com/steam/apps/582160/header.jpg','https://cdn.akamai.steamstatic.com/steam/apps/582160/capsule_616x353.jpg']},
  {rx:/cyberpunk\s*2077/i,title:'Cyberpunk 2077',seriesName:'Cyberpunk',releaseDate:'10.12.2020',genre:'Aksiyon RPG, açık dünya, bilim kurgu, hikaye odaklı',score:9.1,covers:['https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg','https://cdn.akamai.steamstatic.com/steam/apps/1091500/capsule_616x353.jpg']},
  {rx:/witcher\s*3|wild\s*hunt/i,title:'The Witcher 3: Wild Hunt',seriesName:'The Witcher',releaseDate:'19.05.2015',genre:'RPG, açık dünya, fantastik, hikaye odaklı',score:9.6,covers:['https://cdn.akamai.steamstatic.com/steam/apps/292030/header.jpg','https://cdn.akamai.steamstatic.com/steam/apps/292030/capsule_616x353.jpg']},
  {rx:/elden\s*ring/i,title:'Elden Ring',seriesName:'Elden Ring',releaseDate:'25.02.2022',genre:'Aksiyon RPG, açık dünya, soulslike, fantastik',score:9.6,covers:['https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg','https://cdn.akamai.steamstatic.com/steam/apps/1245620/capsule_616x353.jpg']},
  {rx:/red\s*dead\s*redemption\s*2|rdr\s*2/i,title:'Red Dead Redemption 2',seriesName:'Red Dead',releaseDate:'26.10.2018',genre:'Aksiyon-macera, açık dünya, western, hikaye odaklı',score:9.7,covers:['https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg','https://cdn.akamai.steamstatic.com/steam/apps/1174180/capsule_616x353.jpg']},
  {rx:/god\s*of\s*war\s*ragnarok|ragnarök/i,title:'God of War Ragnarök',seriesName:'God of War',releaseDate:'09.11.2022',genre:'Aksiyon-macera, mitoloji, hikaye odaklı',score:9.4,covers:['https://cdn.akamai.steamstatic.com/steam/apps/2322010/header.jpg','https://cdn.akamai.steamstatic.com/steam/apps/2322010/capsule_616x353.jpg']}
];
function ho240f10Known(title){ return HO240F10_COVERS.find(x => x.rx.test(String(title || ''))); }
function ho240f10Candidates(title){ const k = ho240f10Known(title); return k ? k.covers.map((cover,i)=>({title:k.title,seriesName:k.seriesName,releaseDate:k.releaseDate,genre:k.genre,score:k.score,cover,source:i?'Alternatif kapak':'Önerilen kapak'})) : []; }
function ho240f10PatchForm(form, data={}){
  if(!form) return;
  ['title','seriesName','genre','tags','releaseDate','score','cover','description'].forEach(name=>{ if(data[name] !== undefined && form.elements?.[name]) form.elements[name].value = String(data[name] ?? ''); });
  const img = form.querySelector('.coverPreview img'); if(img && data.cover) img.src = data.cover;
}
function ho240f10CaptureForm(form){
  if(!form) return;
  const fd = new FormData(form);
  const data = {title:fd.get('title')||'', seriesName:fd.get('seriesName')||'', genre:fd.get('genre')||'', tags:fd.get('tags')||'', releaseDate:fd.get('releaseDate')||'', score:fd.get('score')||'', cover:fd.get('cover')||'', description:fd.get('description')||'', eps:fd.get('eps')||0, watchedEps:fd.get('watchedEps')||0, status:fd.get('status')||'Devam Ediyor', playlistUrl:fd.get('playlistUrl')||'', videoUrl:fd.get('videoUrl')||'', episodesText:fd.get('episodesText')||''};
  if(form.id === 'gameEditForm' && state.editingGameId){ const g = state.games.find(x=>String(x.id)===String(state.editingGameId)); if(g) Object.assign(g,data); }
  else state.gameDraft = {...(state.gameDraft||{}), ...data};
}
function ho240f10CoverHtml(){
  const list = state.ho240f10CoverCandidates || [];
  if(!list.length) return `<div class="ho240f10CoverEmpty"><button class="miniBtn primary" type="button" data-action="ho240f10-find-covers">Kapak Bul ve Seç</button><small>Yanlış kapak gelirse önerilerden kendin seç.</small></div>`;
  return `<div class="ho240f10CoverChooser"><div class="sectionHead"><div><h3>Bulunan Kapaklar</h3><p class="muted">Doğru kapağı seç; kapak bulunamazsa URL alanına manuel ekleyebilirsin.</p></div><button class="miniBtn" type="button" data-action="ho240f10-find-covers">Yenile</button></div><div class="ho240f10CoverGrid">${list.map((c,i)=>`<article><img src="${esc(c.cover)}" alt="${esc(c.title)}"><b>${esc(c.title)}</b><small>${esc(c.source||'Kapak')} • ${esc(c.releaseDate||'')}</small><button class="miniBtn primary" type="button" data-ho240f10-cover-pick="${i}">Bu Kapağı Seç</button></article>`).join('')}</div></div>`;
}
try{
  const prevGameFormFieldsF10 = gameFormFields;
  gameFormFields = function(d, mode='add'){
    const html = prevGameFormFieldsF10(d, mode);
    const box = `<label class="field wideField ho240f10CoverField"><span>Kapak Bul / Manuel Seç</span>${ho240f10CoverHtml()}</label>`;
    return html.includes('<label class="field wideField episodeImportField">') ? html.replace('<label class="field wideField episodeImportField">', box + '<label class="field wideField episodeImportField">') : html.replace('</div><div class="fix6FormBottomActions">', box + '</div><div class="fix6FormBottomActions">');
  };
}catch{}
async function ho240f10FindCovers(form){
  if(!form) return setToast('Önce oyun formunu aç.');
  ho240f10CaptureForm(form);
  const title = String(form.elements?.title?.value || '').trim();
  if(!title) return setToast('Önce oyun adını yaz.');
  let candidates = ho240f10Candidates(title);
  try{
    const data = await api('game-meta', {adminToken:state.session?.adminToken, title});
    const apiCandidates = (data?.candidates||[]).map(c=>({title:c.title||data?.meta?.title||title,seriesName:c.seriesName||data?.meta?.seriesName||'',releaseDate:ho240f10Date(c.releaseDate||c.released||data?.meta?.releaseDate),genre:c.genre||data?.meta?.genre||'',score:c.score||data?.meta?.score||8.5,cover:c.cover,source:'RAWG/API'})).filter(c=>c.cover && !ho240f10BadCover(c.cover));
    candidates = [...candidates, ...apiCandidates];
  }catch(err){ console.warn('Kapak API atlandı', err); }
  const seen = new Set();
  state.ho240f10CoverCandidates = candidates.filter(c=>c.cover && !seen.has(c.cover) && (seen.add(c.cover), true)).slice(0,8);
  const first = state.ho240f10CoverCandidates[0];
  if(first){ ho240f10PatchForm(form,{title:first.title,seriesName:first.seriesName,genre:first.genre,tags:first.genre,releaseDate:ho240f10Date(first.releaseDate),score:first.score}); ho240f10CaptureForm(form); setToast('Kapaklar bulundu. Doğru kapağı seçebilirsin.'); }
  else setToast('Güvenilir kapak bulunamadı. Manuel kapak URL ekleyebilirsin.');
  render();
}
async function ho240f10MetaFill(form){
  if(!form) return setToast('Oyun formu açık değil.');
  const title = String(form.elements?.title?.value || '').trim();
  if(!title) return setToast('Önce oyun adını yaz.');
  const known = ho240f10Known(title);
  let meta = known ? {title:known.title,seriesName:known.seriesName,genre:known.genre,tags:known.genre,releaseDate:known.releaseDate,score:known.score,cover:known.covers[0]} : {title};
  try{
    const data = await api('game-meta', {adminToken:state.session?.adminToken, title:meta.title||title});
    const m = data?.meta || {};
    if(!known) meta = {...meta,...m, cover:ho240f10BadCover(m.cover)?'':m.cover};
    state.ho240f10CoverCandidates = [...(known?ho240f10Candidates(known.title):[]), ...((data?.candidates||[]).map(c=>({title:c.title||m.title||title,seriesName:m.seriesName||'',genre:c.genre||m.genre||'',releaseDate:ho240f10Date(c.releaseDate||c.released||m.releaseDate),score:c.score||m.score||8.5,cover:c.cover,source:'RAWG/API'})).filter(c=>c.cover && !ho240f10BadCover(c.cover)))].filter((c,i,a)=>a.findIndex(x=>x.cover===c.cover)===i).slice(0,8);
  }catch(err){ state.ho240f10CoverCandidates = known ? ho240f10Candidates(known.title) : []; }
  ho240f10PatchForm(form,{title:meta.title||title,seriesName:meta.seriesName||'',genre:meta.genre||'',tags:meta.tags||meta.genre||'',releaseDate:ho240f10Date(meta.releaseDate||meta.released),score:meta.score||8.5,cover:ho240f10BadCover(meta.cover)?'':(meta.cover||''),description:form.elements?.description?.value||meta.description||meta.story||''});
  ho240f10CaptureForm(form); render(); setToast('Meta çekildi ve kapak önerileri listelendi. Yanlışsa doğru kapağı seç.');
}
function ho240f10Versions(){ return ['v2.4.1','v2.4.2','v2.4.3','v2.4.4','v2.4.5','v2.4.6','v2.4.7','v2.4.8','v2.4.9','v2.5.0','v2.5.1','v2.5.2','v2.5.3','v2.5.4','v2.5.5']; }
function ho240f10Version(){ return localStorage.getItem('ho240f10_ai_version') || 'v2.4.1'; }
function ho240f10Suggestions(){
  const pool = typeof ho240AiFeaturePool === 'function' ? ho240AiFeaturePool() : [];
  const applied = new Set((typeof ho240Applied === 'function' ? ho240Applied() : []).map(x=>x.key));
  const list = pool.filter(x=>!applied.has(x.key));
  const offset = Number(localStorage.getItem('ho240f10_ai_offset') || 0) % Math.max(list.length,1);
  return [...list.slice(offset), ...list.slice(0,offset)].slice(0,10).map(f=>({...f,version:ho240f10Version()}));
}
function ho240f10Target(t){ const raw=String(t||'').toLocaleLowerCase('tr-TR'); if(raw.includes('oyun')) return 'Oyunlar'; if(raw.includes('takvim')) return 'Yayın Takvimi'; if(raw.includes('bakım')) return 'Bakım Modu'; if(raw.includes('deploy')) return 'Deploy Merkezi'; if(raw.includes('schema')||raw.includes('sql')||raw.includes('supabase')) return 'Schema Geçmişi'; if(raw.includes('rapor')||raw.includes('hata')) return 'Raporlar'; if(raw.includes('seri')) return 'Seri İzleme'; return 'Genel Bakış'; }
try{
  hoFix10AiCenter = function(){
    const view = localStorage.getItem('ho240f10_ai_view') || 'new';
    const version = ho240f10Version();
    const applied = typeof ho240Applied === 'function' ? ho240Applied() : [];
    const suggestions = ho240f10Suggestions();
    const selector = `<label class="field ho240f10VersionSelect">Hedef versiyon<select id="ho240f10AiVersion">${ho240f10Versions().map(v=>`<option ${v===version?'selected':''}>${v}</option>`).join('')}</select></label>`;
    return `<section class="ho240f10Ai"><div class="card wide ho240Hero"><div><span class="eyebrow">AI Özellik Ekle • ${HO240F10_VERSION}</span><h1>AI Özellik Ekle</h1><p class="muted">AI özellikleri oyun ekleme alanından ayrıdır. Versiyon seç, önerileri yenile, uygulananı sil veya nereye eklendiyse git.</p></div><div class="rowActions"><button class="btn ${view==='new'?'primary':''}" data-action="ho240f10-ai-new">Yeni Özellik Önerileri</button><button class="btn ${view==='applied'?'primary':''}" data-action="ho240f10-ai-applied">Siteye Uygulandı</button><button class="btn" data-action="ho240f10-ai-refresh">AI Özellik Yenile</button></div></div>${selector}${view==='applied'?`<section class="card wide"><div class="sectionHead"><h2>Siteye Uygulandı</h2><span class="pill green">${applied.length} kayıt</span></div><div class="ho240FeatureGrid">${applied.map(f=>`<article class="ho240Feature"><span class="pill green">Uygulandı</span><h3>${esc(f.title)}</h3><p>${esc(f.desc||f.description||'')}</p><small>${esc(f.version||'')} • ${esc(f.target||'Site')}</small><div class="rowActions"><button class="miniBtn primary" data-ho240f10-ai-go="${esc(f.target||'Genel Bakış')}">Nereye Eklendiyse Git</button><button class="miniBtn danger" data-ho240f10-ai-delete="${esc(f.key)}">Sil</button></div></article>`).join('')||'<p class="muted">Henüz uygulanan özellik yok.</p>'}</div></section>`:`<section class="card wide"><div class="sectionHead"><div><h2>Yeni Özellik Önerileri</h2><p class="muted">Maksimum 10 öneri gösterilir. Uygulanınca yerine yeni öneri gelir.</p></div><span class="pill green">${suggestions.length}/10</span></div><div class="ho240FeatureGrid">${suggestions.map(f=>`<article class="ho240Feature"><span class="pill">${esc(f.cat||'Özellik')}</span><h3>${esc(f.title)}</h3><p>${esc(f.desc||f.description||'')}</p><small>Hedef: ${esc(f.target||'Site')} • Versiyon: ${esc(version)}</small><button class="btn primary" data-ho240f10-ai-apply="${esc(f.key)}">Siteye Uygulandı</button></article>`).join('')}</div></section>`}</section>`;
  };
}catch{}
const ho240f10PrevOnAction = onAction;
onAction = async function(e){
  const action = e.currentTarget?.dataset?.action || '';
  try{
    if(action === 'ho240f10-find-covers'){ e.preventDefault(); e.stopImmediatePropagation(); await ho240f10FindCovers(e.currentTarget.closest('form') || document.getElementById(state.editingGameId?'gameEditForm':'gameAddForm')); return; }
    if(['auto-game-meta','auto-game-meta-edit'].includes(action)){ e.preventDefault(); e.stopImmediatePropagation(); await ho240f10MetaFill(e.currentTarget.closest('form') || document.getElementById(action.includes('edit')?'gameEditForm':'gameAddForm')); return; }
    if(action === 'ho240f10-ai-refresh'){ e.preventDefault(); localStorage.setItem('ho240f10_ai_offset', String((Number(localStorage.getItem('ho240f10_ai_offset')||0)+3)%50)); render(); setToast('AI önerileri yenilendi.'); return; }
    if(action === 'ho240f10-ai-new'){ e.preventDefault(); localStorage.setItem('ho240f10_ai_view','new'); render(); return; }
    if(action === 'ho240f10-ai-applied'){ e.preventDefault(); localStorage.setItem('ho240f10_ai_view','applied'); render(); return; }
    return await ho240f10PrevOnAction(e);
  }catch(err){ console.error(err); setToast('İşlem hatası: '+(err.message||err)); }
};
try{
  const ho240f10PrevBindEvents = bindEvents;
  bindEvents = function(){
    ho240f10PrevBindEvents();
    document.querySelectorAll('[data-ho240f10-cover-pick]').forEach(btn=>btn.addEventListener('click', e=>{ e.preventDefault(); const c=(state.ho240f10CoverCandidates||[])[Number(btn.dataset.ho240f10CoverPick)]; const form=btn.closest('form') || document.getElementById(state.editingGameId?'gameEditForm':'gameAddForm'); if(c&&form){ ho240f10PatchForm(form,{title:c.title,seriesName:c.seriesName,genre:c.genre,tags:c.genre,releaseDate:ho240f10Date(c.releaseDate),score:c.score,cover:c.cover}); ho240f10CaptureForm(form); setToast('Seçilen kapak forma eklendi.'); } }));
    const versionSel = document.getElementById('ho240f10AiVersion'); if(versionSel) versionSel.addEventListener('change', e=>{ localStorage.setItem('ho240f10_ai_version', e.target.value); render(); });
    document.querySelectorAll('[data-ho240f10-ai-apply]').forEach(btn=>btn.addEventListener('click', e=>{ e.preventDefault(); const key=btn.dataset.ho240f10AiApply; const pool=typeof ho240AiFeaturePool==='function'?ho240AiFeaturePool():[]; const f=ho240f10Suggestions().find(x=>x.key===key) || pool.find(x=>x.key===key); if(f){ const list=(typeof ho240Applied==='function'?ho240Applied():[]).filter(x=>x.key!==key); list.unshift({...f,version:ho240f10Version(),appliedAt:new Date().toLocaleString('tr-TR')}); if(typeof ho240Write==='function') ho240Write(HO240_KEYS.aiApplied,list); localStorage.setItem('ho240f10_ai_offset', String((Number(localStorage.getItem('ho240f10_ai_offset')||0)+1)%50)); setToast('Özellik Siteye Uygulandı listesine eklendi.'); render(); } }));
    document.querySelectorAll('[data-ho240f10-ai-delete]').forEach(btn=>btn.addEventListener('click', e=>{ e.preventDefault(); const list=(typeof ho240Applied==='function'?ho240Applied():[]).filter(x=>x.key!==btn.dataset.ho240f10AiDelete); if(typeof ho240Write==='function') ho240Write(HO240_KEYS.aiApplied,list); setToast('Uygulanan özellik silindi.'); render(); }));
    document.querySelectorAll('[data-ho240f10-ai-go]').forEach(btn=>btn.addEventListener('click', e=>{ e.preventDefault(); adminNavigate(ho240f10Target(btn.dataset.ho240f10AiGo)); }));
  };
}catch{}
try{ localStorage.setItem('hayatimiz_last_fix_version', HO240F10_VERSION); }catch{}

/* v2.4.0 FIX 11 - Kapakları Getir, sade Deploy Merkezi, versiyon güncelleme ve gerçek adres senkronu */
const HO240F11_VERSION = 'v2.4.0 FIX 11';

function ho240f11PageSlug(page){ return routeSlug(page || 'Ana Sayfa'); }
function ho240f11AdminSlug(page){ return routeSlug(page || 'Genel Bakış'); }
try{
  const ho240f11OldRouteNameFromSlug = routeNameFromSlug;
  routeNameFromSlug = function(raw){
    const slug = routeSlug(decodeURIComponent(String(raw || '').replace(/^#?\/?/,'')));
    const map = {
      'ana-sayfa':'Ana Sayfa','anasayfa':'Ana Sayfa','home':'Ana Sayfa',
      'oyun-arsivi':'Oyun Arşivi','oyun-arşivi':'Oyun Arşivi','arsiv':'Oyun Arşivi','arşiv':'Oyun Arşivi',
      'populer':'Popüler','popular':'Popüler','tamamlanan':'Tamamlanan','devam-eden':'Devam Eden','yakinda':'Yakında','yakında':'Yakında',
      'korku':'Korku','aksiyon':'Aksiyon','hikaye-odakli':'Hikaye Odaklı','hikaye':'Hikaye Odaklı',
      'takvim':'Takvim','yayin-takvimi':'Takvim','yayın-takvimi':'Takvim','seriler':'Seriler','seri':'Seriler',
      'profilim':'Profilim','profil':'Profilim','favoriler':'Favoriler','bildirimler':'Bildirimler'
    };
    return map[slug] || (ho240f11OldRouteNameFromSlug ? ho240f11OldRouteNameFromSlug(raw) : null);
  };
  const ho240f11OldAdminNameFromSlug = adminNameFromSlug;
  adminNameFromSlug = function(raw){
    const slug = routeSlug(raw);
    const map = {
      'genel-bakis':'Genel Bakış','genel-bakış':'Genel Bakış','oyunlar':'Oyunlar','seri-izleme':'Seri İzleme','seri-gecmisi':'Seri Geçmişi','seri-geçmişi':'Seri Geçmişi',
      'yayin-takvimi':'Yayın Takvimi','yayın-takvimi':'Yayın Takvimi','bildirim-kuyrugu':'Bildirim Kuyruğu','bildirim-kuyruğu':'Bildirim Kuyruğu',
      'oyun-istekleri':'Oyun İstekleri','hata-bildir':'Hata Bildir','hata-bildirimleri':'Hata Bildir','raporlar':'Raporlar',
      'schema-gecmisi':'Schema Geçmişi','schema-geçmişi':'Schema Geçmişi','bakim-modu':'Bakım Modu','bakım-modu':'Bakım Modu',
      'yonetim-kisayollari':'Yönetim Kısayolları','yönetim-kısayolları':'Yönetim Kısayolları','sistem-saglik':'Sistem Sağlık','sistem-sağlık':'Sistem Sağlık',
      'guncelleme-notlari':'Güncelleme Notları','güncelleme-notları':'Güncelleme Notları','api-env-durumu':'API/ENV Durumu','ayarlar':'Ayarlar','profil':'Profil','kullanici-yetkileri':'Kullanıcı Yetkileri','kullanıcı-yetkileri':'Kullanıcı Yetkileri'
    };
    return map[slug] || (ho240f11OldAdminNameFromSlug ? ho240f11OldAdminNameFromSlug(raw) : null);
  };
}catch{}

syncRouteToAddress = function(){
  try{
    if(!window.history || !window.location) return;
    const target = state.page === 'Yönetim Paneli'
      ? `/yonetim/${ho240f11AdminSlug(state.adminPage || 'Genel Bakış')}`
      : `/${ho240f11PageSlug(state.page || 'Ana Sayfa')}`;
    if(window.location.pathname !== target){
      window.history.pushState({page:state.page, adminPage:state.adminPage}, '', target);
    }
  }catch{}
};
window.addEventListener('popstate', ()=>{
  const route = parseRouteFromLocation();
  if(route.page){ state.page = route.page; localStorage.setItem(PAGE_KEY,state.page); }
  if(route.adminPage){ state.adminPage = route.adminPage; localStorage.setItem(ADMIN_TAB_KEY,state.adminPage); }
  try{ render(); }catch{}
});

function ho240f11CoverList(){ return Array.isArray(state.ho240f11CoverCandidates) ? state.ho240f11CoverCandidates : (state.ho240f10CoverCandidates || []); }
function ho240f11CoverPanel(){
  const list = ho240f11CoverList();
  return `<div class="field wideField ho240f11CoverPanel"><div class="sectionHead"><div><span class="eyebrow">Kapak Seçici</span><h3>Oyun adıyla ilgili kapaklar</h3><p class="muted">Kapakları Getir butonuna bas; bulunan görsellerden doğru kapağı kendin seç. Bulamazsa manuel URL alanı açık kalır.</p></div><button class="miniBtn primary" type="button" data-action="ho240f11-find-covers">Kapakları Getir</button></div>${list.length?`<div class="ho240f11CoverGrid">${list.map((c,i)=>`<article><img src="${esc(c.cover)}" alt="${esc(c.title||'Kapak')}"><b>${esc(c.title||'Oyun kapağı')}</b><small>${esc(c.source||'Kapak')} ${c.releaseDate?`• ${esc(c.releaseDate)}`:''}</small><button class="miniBtn primary" type="button" data-ho240f11-cover-pick="${i}">Bu Kapağı Seç</button></article>`).join('')}</div>`:`<div class="ho240f11CoverEmpty"><b>Henüz kapak listesi yok.</b><small>Önce oyun adını yaz, sonra Kapakları Getir butonuna bas.</small></div>`}</div>`;
}
function ho240f11EnhanceFormHtml(html){
  if(!html || html.includes('ho240f11CoverPanel')) return html;
  html = html.replace(/(<button type="button" class="btn" data-v223-meta>Meta \+ Kapak Çek<\/button>)/, '$1<button type="button" class="btn" data-action="ho240f11-find-covers">Kapakları Getir</button>');
  html = html.replace(/(<button type="button" class="miniBtn" data-v223-meta>Meta \+ Kapak Çek<\/button>)/, '$1<button type="button" class="miniBtn primary" data-action="ho240f11-find-covers">Kapakları Getir</button>');
  html = html.replace(/(<button class="btn" type="button" data-action="(?:auto-game-meta|auto-game-meta-edit)">Meta \+ Kapak Çek<\/button>)/, '$1<button class="btn" type="button" data-action="ho240f11-find-covers">Kapakları Getir</button>');
  if(html.includes('</section><aside')) return html.replace('</section><aside', `${ho240f11CoverPanel()}</section><aside`);
  if(html.includes('</form>')) return html.replace('</form>', `${ho240f11CoverPanel()}</form>`);
  return html + ho240f11CoverPanel();
}
try{
  if(typeof v223Fix3Form === 'function'){
    const ho240f11OldV223Form = v223Fix3Form;
    v223Fix3Form = function(d={}, mode='add'){
      return ho240f11EnhanceFormHtml(ho240f11OldV223Form(d,mode));
    };
  }
  if(typeof gameFormFields === 'function'){
    const ho240f11OldGameFormFields = gameFormFields;
    gameFormFields = function(d={}, mode='add'){
      return ho240f11EnhanceFormHtml(ho240f11OldGameFormFields(d,mode));
    };
  }
}catch{}

async function ho240f11FindCovers(form){
  if(!form) return setToast('Önce Oyun Ekle formunu aç.');
  try{ if(typeof ho240f10CaptureForm === 'function') ho240f10CaptureForm(form); }catch{}
  const title = String(form.elements?.title?.value || '').trim();
  if(!title) return setToast('Önce oyun adını yaz.');
  let candidates = [];
  try{ if(typeof ho240f10Candidates === 'function') candidates = ho240f10Candidates(title) || []; }catch{}
  try{
    const normalizedTitle = (typeof ho240f10Known === 'function' && ho240f10Known(title)?.title) || title;
    const data = await api('game-meta', { adminToken:state.session?.adminToken, title:normalizedTitle });
    const apiCandidates = (data?.candidates || []).map(c=>({
      title:c.title || data?.meta?.title || normalizedTitle,
      seriesName:c.seriesName || data?.meta?.seriesName || '',
      genre:c.genre || data?.meta?.genre || '',
      releaseDate:typeof ho240f10Date === 'function' ? ho240f10Date(c.releaseDate || c.released || data?.meta?.releaseDate) : (c.releaseDate || c.released || ''),
      score:c.score || data?.meta?.score || 8.5,
      cover:c.cover,
      source:'API / Kapak adayı'
    })).filter(c=>c.cover && !(typeof ho240f10BadCover === 'function' && ho240f10BadCover(c.cover)));
    candidates = [...candidates, ...apiCandidates];
  }catch(err){ console.warn('Kapak API atlandı:', err); }
  const seen = new Set();
  state.ho240f11CoverCandidates = candidates.filter(c=>c.cover && !seen.has(c.cover) && (seen.add(c.cover), true)).slice(0,10);
  if(!state.ho240f11CoverCandidates.length) setToast('Kapak bulunamadı. Manuel kapak URL girebilirsin.');
  else setToast(`${state.ho240f11CoverCandidates.length} kapak bulundu. Aşağıdan seç.`);
  render();
}
function ho240f11PickCover(index){
  const c = ho240f11CoverList()[Number(index)];
  const form = document.getElementById(state.editingGameId ? 'gameEditForm' : 'gameAddForm') || document.querySelector('form.gameForm');
  if(!c || !form) return setToast('Kapak seçilemedi.');
  const patch = { cover:c.cover, title:c.title, seriesName:c.seriesName, genre:c.genre, tags:c.genre, releaseDate:c.releaseDate, score:c.score };
  try{ if(typeof ho240f10PatchForm === 'function') ho240f10PatchForm(form, patch); else Object.entries(patch).forEach(([k,v])=>{ if(form.elements?.[k] && v!==undefined) form.elements[k].value = v || ''; }); }catch{}
  try{ if(typeof ho240f10CaptureForm === 'function') ho240f10CaptureForm(form); else saveGameDraftFromForm(form); }catch{}
  setToast('Seçilen kapak forma eklendi.');
  render();
}


/* FIX24: ho240f11 deploy merkezi ve aksiyonları kaynak dosyadan silindi. */
const ho240f11PrevBind = bind;
bind = function(){
  try{ ho240f11PrevBind(); }catch(err){ console.warn('Eski bind atlandı:', err); }
  document.querySelectorAll('[data-ho240f11-cover-pick]').forEach(btn=>btn.addEventListener('click', e=>{ e.preventDefault(); e.stopImmediatePropagation(); ho240f11PickCover(btn.dataset.ho240f11CoverPick); }, true));
};

try{ localStorage.setItem('hayatimiz_last_fix_version', HO240F11_VERSION); }catch{}
try{ if(document.getElementById('root')?.dataset?.mounted === '1') render(); }catch(error){ console.warn('FIX11 render atlandı:', error); }



/* FIX24: Eski gereksiz AI/Deploy kaynak bloğu silindi. */
/* v2.4.0 FIX 14 - dinamik sürüm etiketi, güçlü kapak çekme ve AI uygula stabilizasyonu */
const HO240F14_VERSION = 'v2.4.0 FIX 14';
const HO240F14_SITE_VERSION_KEY = 'ho240f14_current_site_version';
const HO240F14_APPLIED_LOG_KEY = 'ho240f14_applied_feature_log';
const HO240F14_COVER_SEEN_KEY = 'ho240f14_last_cover_query';
function ho240f14SafeJson(key, fallback){ try{ return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }catch{ return fallback; } }
function ho240f14WriteJson(key, value){ try{ localStorage.setItem(key, JSON.stringify(value)); }catch{} }
function ho240f14CurrentVersion(){
  return localStorage.getItem(HO240F14_SITE_VERSION_KEY)
    || localStorage.getItem('ho240f11_next_version')
    || localStorage.getItem('ho240f10_ai_version')
    || 'v2.4.1';
}
function ho240f14VersionLine(){ return `${ho240f14CurrentVersion()} • ${HO240F14_VERSION}`; }
function ho240f14SetVersion(value){
  const clean = String(value || '').trim() || 'v2.4.1';
  try{
    localStorage.setItem(HO240F14_SITE_VERSION_KEY, clean);
    localStorage.setItem('ho240f11_next_version', clean);
    localStorage.setItem('ho240f10_ai_version', clean);
    localStorage.setItem('hayatimiz_last_fix_version', HO240F14_VERSION);
    document.title = `Hayatımız Oyun - ${clean}`;
  }catch{}
  return clean;
}
try{
  const oldSet = typeof ho240f13SetVersion === 'function' ? ho240f13SetVersion : null;
  ho240f13SetVersion = function(v){ const next = ho240f14SetVersion(v); if(oldSet) try{ oldSet(next); }catch{} return next; };
}catch{}

const HO240F14_GAME_CATALOG = [
  {rx:/alan\s*wake\s*'?s?\s*american\s*nightmare|american\s*nightmare/i,title:"Alan Wake's American Nightmare",seriesName:'Alan Wake',releaseDate:'22.02.2012',genre:'Aksiyon, psikolojik korku, gerilim, hikaye odaklı',score:7.8,covers:['https://cdn.akamai.steamstatic.com/steam/apps/202750/header.jpg','https://cdn.akamai.steamstatic.com/steam/apps/202750/capsule_616x353.jpg','https://cdn.cloudflare.steamstatic.com/steam/apps/202750/header.jpg','https://cdn.cloudflare.steamstatic.com/steam/apps/202750/capsule_616x353.jpg'],story:"Alan Wake's American Nightmare, Alan Wake'in karanlık güçler ve Mr. Scratch tehdidiyle yüzleştiği, daha aksiyon odaklı psikolojik gerilim macerasıdır. Arizona çöl atmosferi, döngüsel hikaye yapısı ve ışık-karanlık mücadelesiyle ana Alan Wake evrenini genişletir."},
  {rx:/alan\s*wake\s*2/i,title:'Alan Wake 2',seriesName:'Alan Wake',releaseDate:'27.10.2023',genre:'Hayatta kalma korku, psikolojik gerilim, hikaye odaklı',score:9.1,covers:['https://media.rawg.io/media/games/599/5999f254b9a7facb3147a28d956a163e.jpg'],story:'Alan Wake 2, yazar Alan Wake ve FBI ajanı Saga Anderson üzerinden ilerleyen karanlık, sinematik ve psikolojik korku odaklı bir devam oyunudur.'},
  {rx:/alan\s*wake\s*remaster|alan\s*wake\s*remastered/i,title:'Alan Wake Remastered',seriesName:'Alan Wake',releaseDate:'05.10.2021',genre:'Aksiyon-macera, psikolojik korku, hikaye odaklı',score:8.0,covers:['https://media.rawg.io/media/games/053/0531fbe64d90d7a97acb88ba8f340cb9.jpg','https://cdn.akamai.steamstatic.com/steam/apps/108710/header.jpg','https://cdn.akamai.steamstatic.com/steam/apps/108710/capsule_616x353.jpg'],story:'Alan Wake Remastered, Bright Falls kasabasında geçen karanlık ve sinematik bir psikolojik gerilim hikayesidir.'},
  {rx:/\balan\s*wake\b/i,title:'Alan Wake',seriesName:'Alan Wake',releaseDate:'14.05.2010',genre:'Aksiyon-macera, psikolojik korku, hikaye odaklı',score:8.2,covers:['https://cdn.akamai.steamstatic.com/steam/apps/108710/header.jpg','https://cdn.akamai.steamstatic.com/steam/apps/108710/capsule_616x353.jpg','https://media.rawg.io/media/games/053/0531fbe64d90d7a97acb88ba8f340cb9.jpg'],story:'Alan Wake, Bright Falls kasabasında eşinin kayboluşunu araştıran bir yazarın kendi karanlık hikayesiyle yüzleşmesini anlatır.'},
  {rx:/max\s*payne\s*3/i,title:'Max Payne 3',seriesName:'Max Payne',releaseDate:'15.05.2012',genre:'Üçüncü şahıs nişancı, neo-noir, aksiyon, hikaye odaklı',score:8.7,covers:['https://cdn.akamai.steamstatic.com/steam/apps/204100/header.jpg','https://cdn.akamai.steamstatic.com/steam/apps/204100/capsule_616x353.jpg'],story:'Max Payne 3, Max’in Brezilya’da özel güvenlik görevlisi olarak çalışırken suç, kayıp ve intikam döngüsüne yeniden sürüklenmesini anlatır.'},
  {rx:/max\s*payne\s*2/i,title:'Max Payne 2: The Fall of Max Payne',seriesName:'Max Payne',releaseDate:'14.10.2003',genre:'Üçüncü şahıs nişancı, neo-noir, aksiyon',score:8.8,covers:['https://cdn.akamai.steamstatic.com/steam/apps/12150/header.jpg','https://cdn.akamai.steamstatic.com/steam/apps/12150/capsule_616x353.jpg'],story:'Max Payne 2, Max Payne’in Mona Sax ile kesişen karanlık ve trajik neo-noir hikayesini işler.'},
  {rx:/max\s*payne(?!\s*[23])/i,title:'Max Payne',seriesName:'Max Payne',releaseDate:'23.07.2001',genre:'Üçüncü şahıs nişancı, neo-noir, aksiyon',score:8.9,covers:['https://cdn.akamai.steamstatic.com/steam/apps/12140/header.jpg','https://cdn.akamai.steamstatic.com/steam/apps/12140/capsule_616x353.jpg'],story:'Max Payne, ailesinin ölümünden sonra suç örgütleri ve komplolar arasında intikam arayan bir dedektifin karanlık hikayesini anlatır.'},
  {rx:/serious\s*sam\s*2/i,title:'Serious Sam 2',seriesName:'Serious Sam',releaseDate:'11.10.2005',genre:'FPS, aksiyon, co-op, arcade',score:7.7,covers:['https://cdn.akamai.steamstatic.com/steam/apps/204340/header.jpg','https://cdn.akamai.steamstatic.com/steam/apps/204340/capsule_616x353.jpg'],story:'Serious Sam 2, Sam Stone’un Mental ordularına karşı absürt, hızlı tempolu ve co-op odaklı mücadelesini sürdürür.'},
  {rx:/crysis\s*3/i,title:'Crysis 3',seriesName:'Crysis',releaseDate:'19.02.2013',genre:'FPS, bilim kurgu, aksiyon, nanosuit',score:8.1,covers:['https://media.rawg.io/media/games/580/580c6c99d24e07e6b827ec2d2ee8e8c8.jpg'],story:'Crysis 3, Prophet’ın nanosuit gücüyle CELL ve Ceph tehdidine karşı verdiği final mücadelesini anlatır.'},
  {rx:/crysis\s*2/i,title:'Crysis 2',seriesName:'Crysis',releaseDate:'22.03.2011',genre:'FPS, bilim kurgu, aksiyon, nanosuit',score:8.0,covers:['https://media.rawg.io/media/games/85c/85c0c7d7c1c7a431b7d540a96ccda6c8.jpg'],story:'Crysis 2, New York sokaklarında nanosuit teknolojisiyle Ceph istilasına karşı verilen mücadeleyi işler.'},
  {rx:/\bcrysis\b/i,title:'Crysis',seriesName:'Crysis',releaseDate:'13.11.2007',genre:'FPS, bilim kurgu, aksiyon, açık alan',score:8.4,covers:['https://cdn.akamai.steamstatic.com/steam/apps/17300/header.jpg','https://cdn.akamai.steamstatic.com/steam/apps/17300/capsule_616x353.jpg'],story:'Crysis, Lingshan Adaları’nda başlayan askeri operasyonun uzaylı tehdidine dönüşmesini ve nanosuit gücünü konu alır.'},
  {rx:/resident\s*evil\s*4/i,title:'Resident Evil 4',seriesName:'Resident Evil',releaseDate:'24.03.2023',genre:'Hayatta kalma korku, aksiyon, gerilim',score:9.2,covers:['https://cdn.akamai.steamstatic.com/steam/apps/2050650/header.jpg','https://cdn.akamai.steamstatic.com/steam/apps/2050650/capsule_616x353.jpg'],story:'Resident Evil 4, Leon S. Kennedy’nin Avrupa’da kayıp başkan kızını ararken tarikat ve biyolojik tehditlerle yüzleşmesini anlatır.'},
  {rx:/tomb\s*raider\s*2013|\btomb\s*raider\b/i,title:'Tomb Raider',seriesName:'Tomb Raider',releaseDate:'05.03.2013',genre:'Aksiyon-macera, keşif, hikaye odaklı',score:8.6,covers:['https://cdn.akamai.steamstatic.com/steam/apps/203160/header.jpg','https://cdn.akamai.steamstatic.com/steam/apps/203160/capsule_616x353.jpg'],story:'Tomb Raider, Lara Croft’un Yamatai adasında hayatta kalma mücadelesiyle efsanevi maceracıya dönüşümünü anlatır.'}
];
function ho240f14FindKnownGame(title){
  const raw = String(title || '').trim();
  return HO240F14_GAME_CATALOG.find(x => x.rx.test(raw));
}
function ho240f14Candidates(title){
  const k = ho240f14FindKnownGame(title);
  if(!k) return [];
  return (k.covers || []).map((cover, i)=>({
    title:k.title, seriesName:k.seriesName, releaseDate:k.releaseDate, genre:k.genre, score:k.score,
    cover, description:k.story, source:i === 0 ? 'FIX14 kesin eşleşme' : 'FIX14 alternatif kapak'
  }));
}
function ho240f14Meta(title){
  const k = ho240f14FindKnownGame(title);
  if(!k) return null;
  return { title:k.title, seriesName:k.seriesName, genre:k.genre, tags:k.genre, releaseDate:k.releaseDate, released:k.releaseDate, score:k.score, cover:k.covers?.[0] || '', description:k.story, story:k.story, exact:true };
}
try{
  const oldKnown = typeof ho240f10Known === 'function' ? ho240f10Known : null;
  ho240f10Known = function(title){ return ho240f14FindKnownGame(title) || (oldKnown ? oldKnown(title) : null); };
  const oldCandidates = typeof ho240f10Candidates === 'function' ? ho240f10Candidates : null;
  ho240f10Candidates = function(title){
    const all = [...ho240f14Candidates(title), ...(oldCandidates ? oldCandidates(title) : [])];
    const seen = new Set();
    return all.filter(c=>c.cover && !seen.has(c.cover) && (seen.add(c.cover), true)).slice(0,20);
  };
}catch{}
try{
  const oldFix7Meta = typeof ho240Fix7Meta === 'function' ? ho240Fix7Meta : null;
  ho240Fix7Meta = function(title){ return ho240f14Meta(title) || (oldFix7Meta ? oldFix7Meta(title) : { title:String(title||'Yeni Oyun'), genre:'Aksiyon-macera', score:8.5 }); };
  const oldLocalMeta = typeof localGameMeta === 'function' ? localGameMeta : null;
  localGameMeta = function(title){ const m = ho240f14Meta(title); return m ? {...m, cover:m.cover, rawg_slug:''} : (oldLocalMeta ? oldLocalMeta(title) : {}); };
}catch{}

async function ho240f14ApiCandidates(title){
  const queries = Array.from(new Set([String(title || '').trim(), ho240f14Meta(title)?.title || ''].filter(Boolean)));
  const out = [];
  for(const q of queries){
    try{
      const data = await api('game-meta', { adminToken:state.session?.adminToken, title:q });
      const meta = data?.meta || {};
      (data?.candidates || []).forEach(c=>out.push({
        title:c.title || meta.title || q,
        seriesName:c.seriesName || meta.seriesName || '',
        releaseDate:typeof ho240f10Date === 'function' ? ho240f10Date(c.releaseDate || c.released || meta.releaseDate || meta.released) : (c.releaseDate || c.released || ''),
        genre:c.genre || meta.genre || '',
        score:c.score || meta.score || 8.5,
        cover:c.cover || c.cover_url || '',
        description:c.description || meta.description || '',
        source:'RAWG/API sonucu'
      }));
      if(meta.cover) out.unshift({title:meta.title || q, seriesName:meta.seriesName || '', releaseDate:meta.releaseDate || meta.released || '', genre:meta.genre || '', score:meta.score || 8.5, cover:meta.cover, description:meta.description || meta.story || '', source:'API ana kapak'});
    }catch(err){ console.warn('FIX14 kapak API atlandı:', err); }
  }
  return out;
}
function ho240f14MergeCandidates(...groups){
  const seen = new Set();
  return groups.flat().filter(c=>{
    const cover = String(c?.cover || '').trim();
    if(!cover) return false;
    if(typeof ho240f10BadCover === 'function' && ho240f10BadCover(cover)) return false;
    const id = cover.toLowerCase();
    if(seen.has(id)) return false;
    seen.add(id);
    return true;
  }).slice(0,20);
}
try{
  const oldFindCovers = typeof ho240f11FindCovers === 'function' ? ho240f11FindCovers : null;
  ho240f11FindCovers = async function(form){
    if(!form) return setToast('Önce Oyun Ekle formunu aç.');
    try{ if(typeof ho240f10CaptureForm === 'function') ho240f10CaptureForm(form); }catch{}
    const title = String(form.elements?.title?.value || '').trim();
    if(!title) return setToast('Önce oyun adını yaz.');
    localStorage.setItem(HO240F14_COVER_SEEN_KEY, title);
    const local = ho240f14Candidates(title);
    let oldList = [];
    try{ oldList = typeof ho240f10Candidates === 'function' ? ho240f10Candidates(title) : []; }catch{}
    const apiList = await ho240f14ApiCandidates(title);
    let list = ho240f14MergeCandidates(local, oldList, apiList);
    if(!list.length && oldFindCovers){
      await oldFindCovers(form);
      list = ho240f14MergeCandidates(state.ho240f11CoverCandidates || [], state.ho240f10CoverCandidates || []);
    }
    state.ho240f11CoverCandidates = list;
    state.ho240f10CoverCandidates = list;
    if(list[0]){
      try{
        if(typeof ho240f10PatchForm === 'function') ho240f10PatchForm(form, { title:list[0].title, seriesName:list[0].seriesName, genre:list[0].genre, tags:list[0].genre, releaseDate:list[0].releaseDate, score:list[0].score });
        if(typeof ho240f10CaptureForm === 'function') ho240f10CaptureForm(form);
      }catch{}
      setToast(`${list.length} kapak bulundu. Alan Wake American Nightmare gibi alt oyunlar artık ayrı eşleşir.`);
    }else{
      setToast('Kapak bulunamadı. Manuel URL alanı açık bırakıldı.');
    }
    render();
  };
  const oldMetaFill = typeof ho240f10MetaFill === 'function' ? ho240f10MetaFill : null;
  ho240f10MetaFill = async function(form){
    if(!form) return setToast('Oyun formu açık değil.');
    const title = String(form.elements?.title?.value || '').trim();
    if(!title) return setToast('Önce oyun adını yaz.');
    const exact = ho240f14Meta(title);
    if(exact){
      const apiList = await ho240f14ApiCandidates(title);
      const list = ho240f14MergeCandidates(ho240f14Candidates(title), apiList);
      state.ho240f10CoverCandidates = list;
      state.ho240f11CoverCandidates = list;
      try{ ho240f10PatchForm(form, {title:exact.title, seriesName:exact.seriesName, genre:exact.genre, tags:exact.tags, releaseDate:exact.releaseDate, score:exact.score, cover:exact.cover, description:form.elements?.description?.value || exact.description}); ho240f10CaptureForm(form); }catch{}
      render(); setToast(`${exact.title} için doğru meta ve ${list.length} kapak getirildi.`); return;
    }
    if(oldMetaFill) return oldMetaFill(form);
  };
}catch{}

function ho240f14TargetPage(target=''){
  const t = String(target || '').toLocaleLowerCase('tr-TR');
  if(t.includes('deploy') || t.includes('vercel') || t.includes('github')) return {type:'admin', page:'Deploy Merkezi'};
  if(t.includes('schema') || t.includes('sql') || t.includes('supabase')) return {type:'admin', page:'Schema Geçmişi'};
  if(t.includes('sağlık') || t.includes('saglik') || t.includes('health')) return {type:'admin', page:'Sistem Sağlık'};
  if(t.includes('rapor') || t.includes('hata') || t.includes('bug')) return {type:'admin', page:'Raporlar'};
  if(t.includes('oyun iste')) return {type:'admin', page:'Oyun İstekleri'};
  if(t.includes('oyun')) return {type:'admin', page:'Oyunlar'};
  if(t.includes('seri')) return {type:'admin', page:'Seri İzleme'};
  if(t.includes('takvim') || t.includes('yayın') || t.includes('yayin')) return {type:'admin', page:'Yayın Takvimi'};
  if(t.includes('bakım') || t.includes('bakim')) return {type:'admin', page:'Bakım Modu'};
  if(t.includes('güncelleme') || t.includes('guncelleme')) return {type:'admin', page:'Güncelleme Notları'};
  if(t.includes('profil')) return {type:'admin', page:'Profil'};
  return {type:'admin', page:'Genel Bakış'};
}
try{
  hoFix10TargetPage = ho240f14TargetPage;
  hoFix10GoTarget = function(target){ const dest = ho240f14TargetPage(target); if(dest.type === 'admin') adminNavigate(dest.page); else navigate(dest.page); setToast(`${target || 'Özellik'} alanına gidildi.`); };
  ho240f10Target = function(target){ return ho240f14TargetPage(target).page; };
}catch{}

try{
  const oldApply13 = typeof ho240f13ApplyFeature === 'function' ? ho240f13ApplyFeature : null;
  ho240f13ApplyFeature = function(feature){
    const now = typeof ho240f13Now === 'function' ? ho240f13Now() : new Date().toLocaleString('tr-TR');
    const version = ho240f14CurrentVersion();
    const item = {
      ...feature,
      key:String(feature.key || slugifyFeature(feature.title || 'ai-ozellik')),
      cat:feature.cat || feature.category || 'AI Özellik',
      category:feature.category || feature.cat || 'AI Özellik',
      desc:feature.desc || feature.description || '',
      description:feature.description || feature.desc || '',
      target:feature.target || 'Yönetim Paneli > Genel Bakış',
      version,
      appliedAt:now,
      status:'uygulandi',
      supabaseStatus:'local + Supabase kayıt denendi',
      githubStatus:'pakete işlendi',
      vercelStatus:'redeploy gerekli',
      rollbackNote:'Uygulananlar listesinden Sil ile kaldır; gerekiyorsa güncelleme notundan da sil.'
    };
    try{ if(oldApply13) oldApply13(item); }catch{}
    try{
      const current = typeof ho240Applied === 'function' ? ho240Applied() : ho240f14SafeJson('ho240_ai_applied_features', []);
      const next = [item, ...current.filter(x=>String(x.key)!==String(item.key))];
      if(typeof ho240Write === 'function' && typeof HO240_KEYS !== 'undefined') ho240Write(HO240_KEYS.aiApplied, next);
      else ho240f14WriteJson('ho240_ai_applied_features', next);
      ho240f14WriteJson(HO240F14_APPLIED_LOG_KEY, [{...item, action:'apply'}, ...ho240f14SafeJson(HO240F14_APPLIED_LOG_KEY, [])].slice(0,100));
    }catch{}
    try{
      state.features = state.features || {};
      state.features[item.key] = true;
      if(typeof persistFeatures === 'function') persistFeatures();
      const exists = state.planner.some(p => (p.featureKey || p.id) === item.key || p.text === item.title);
      if(!exists) state.planner.unshift({ id:`ai-${Date.now()}`, group:item.cat, text:item.title, status:'tamam', featureKey:item.key });
      else state.planner = state.planner.map(p => ((p.featureKey || p.id) === item.key || p.text === item.title) ? {...p, status:'tamam'} : p);
    }catch{}
    try{
      const notes = ho240f14SafeJson('ho240f12_auto_changelog', []);
      notes.unshift({version:item.version,title:item.title,target:item.target,summary:item.description,createdAt:item.appliedAt,status:'uygulandı'});
      ho240f14WriteJson('ho240f12_auto_changelog', notes.slice(0,80));
    }catch{}
    try{ api('ai-feature-apply', { adminToken:state.session?.adminToken, feature:item }).catch(()=>{}); }catch{}
    return item;
  };
}catch{}

try{
  const oldTopbar = topbar;
  topbar = function(){
    return oldTopbar()
      .replaceAll(VERSION, ho240f14VersionLine())
      .replace(/<title>[^<]*<\/title>/g, '')
      .replace(/<span>v2\.4\.0[^<]*<\/span>/g, `<span>${esc(ho240f14VersionLine())}</span>`);
  };
}catch{}
try{
  const oldAdminPanelF14 = adminPanel;
  adminPanel = function(){
    const out = oldAdminPanelF14();
    return String(out)
      .replaceAll('v2.4.0 Yönetim', `${ho240f14CurrentVersion()} Yönetim • FIX14`)
      .replaceAll('v2.4.0</span>', `${ho240f14CurrentVersion()}</span>`)
      .replaceAll('v2.4.0 FIX 13', HO240F14_VERSION)
      .replaceAll('v2.4.0 FIX 12', HO240F14_VERSION)
      .replaceAll('v2.4.0 FIX 11', HO240F14_VERSION)
      .replaceAll('v2.4.0 FIX 10', HO240F14_VERSION);
  };
}catch{}
try{
  const oldDeploy13 = typeof ho240f13DeployCenter === 'function' ? ho240f13DeployCenter : null;
  ho240f13DeployCenter = function(){
    const html = oldDeploy13 ? oldDeploy13() : (typeof ho240DeployCenter === 'function' ? ho240DeployCenter() : '');
    return String(html)
      .replaceAll('v2.4.0 FIX 13', HO240F14_VERSION)
      .replaceAll('FIX13', 'FIX14')
      .replace('Tepedeki Güncellemeler</h2>', `Tepedeki Güncellemeler</h2><p class="note greenNote">Sürüm etiketi, üst bar ve sol yönetim logosu artık ${esc(ho240f14CurrentVersion())} ile senkron.</p>`);
  };
  ho240DeployCenter = ho240f13DeployCenter;
  hoFix8DeployPanel = ho240f13DeployCenter;
}catch{}

const ho240f14PrevOnAction = onAction;
onAction = async function(e){
  const action = e.currentTarget?.dataset?.action || '';
  if(action === 'ho240f13-save-version' || action === 'ho240f11-save-version'){
    e.preventDefault(); e.stopImmediatePropagation();
    const input = document.getElementById('ho240f13VersionInput') || document.getElementById('ho240f11VersionInput');
    const v = ho240f14SetVersion(input?.value || 'v2.4.1');
    try{ if(typeof ho240f13MakePlannedUpdates === 'function') ho240f13MakePlannedUpdates(); }catch{}
    try{ if(typeof ho240f13SaveScanState === 'function') ho240f13SaveScanState({updates:true,suggestions:true,last:`Versiyon ${v} olarak kaydedildi; üst bar, site adı ve AI panelleri senkronlandı.`}); }catch{}
    render(); setToast(`Site adı ve tüm paneller ${v} sürümüne güncellendi.`); return;
  }
  if(action === 'ho240f13-scan-updates'){
    e.preventDefault(); e.stopImmediatePropagation();
    const input = document.getElementById('ho240f13VersionInput') || document.getElementById('ho240f11VersionInput');
    const v = ho240f14SetVersion(input?.value || ho240f14CurrentVersion());
    try{ localStorage.setItem(HO240F13_SEED_KEY, String(Number(localStorage.getItem(HO240F13_SEED_KEY)||0)+17)); }catch{}
    try{ if(typeof ho240f12WriteHidden === 'function') ho240f12WriteHidden([]); }catch{}
    try{ localStorage.setItem('ho240_ai_view','new'); }catch{}
    const plans = typeof ho240f13MakePlannedUpdates === 'function' ? ho240f13MakePlannedUpdates() : [];
    try{ ho240f13SaveScanState({updates:true,suggestions:true,last:`Yeni güncellemeler ${new Date().toLocaleString('tr-TR')} tarihinde tarandı. ${v} için ${plans.length || 10} öneri yenilendi; tepe kartları ve marka sürümü güncellendi.`,count:(ho240f13ScanState?.().count || 0)+1}); }catch{}
    try{ api('ai-feature-registry-save',{version:v,features:(plans||[]).map(p=>({key:p.id||p.key,title:p.title,target:p.target,table:p.cat,status:'fix14_yenilendi'}))}).catch(()=>{}); }catch{}
    render(); setToast('Tepedeki güncellemeler, site adı sürümü ve AI önerileri yenilendi.'); return;
  }
  return ho240f14PrevOnAction(e);
};

const ho240f14PrevBind = bind;
bind = function(){
  try{ ho240f14PrevBind(); }catch(err){ console.warn('FIX14 önceki bind atlandı:', err); }
  document.querySelectorAll('[data-ho-ai-go],[data-ho240f10-ai-go]').forEach(btn=>btn.addEventListener('click', e=>{
    e.preventDefault(); e.stopImmediatePropagation();
    const target = btn.dataset.hoAiGo || btn.dataset.ho240f10AiGo || 'Genel Bakış';
    const dest = ho240f14TargetPage(target);
    if(dest.type === 'admin') adminNavigate(dest.page); else navigate(dest.page);
    setToast(`${target} alanı açıldı.`);
  }, true));
  document.querySelectorAll('[data-ho240f13-ai-apply]').forEach(btn=>btn.addEventListener('click', e=>{
    e.preventDefault(); e.stopImmediatePropagation();
    const key = btn.dataset.ho240f13AiApply;
    const feature = (typeof ho240f13Suggestions === 'function' ? ho240f13Suggestions() : []).find(x=>String(x.key)===String(key)) || (typeof ho240f13AllFeatures === 'function' ? ho240f13AllFeatures() : []).find(x=>String(x.key)===String(key));
    if(!feature) return setToast('Özellik bulunamadı.');
    const item = ho240f13ApplyFeature(feature);
    try{ if(typeof ho240f12WriteHidden === 'function') ho240f12WriteHidden([...(typeof ho240f12Hidden==='function'?ho240f12Hidden():[]), key]); }catch{}
    try{ localStorage.setItem('ho240_ai_view','applied'); }catch{}
    render(); setToast(`${item.title} uygulandı. Siteye Uygulandı sekmesine taşındı; Nereye Eklendiyse Git artık çalışır.`);
  }, true));
};
try{
  ho240f14SetVersion(ho240f14CurrentVersion());
  if(Array.isArray(VERSION_NOTES_ARCHIVE) && !VERSION_NOTES_ARCHIVE.some(n=>n.version===HO240F14_VERSION)){
    VERSION_NOTES_ARCHIVE.unshift({version:HO240F14_VERSION,title:'Dinamik Sürüm + Kapak + AI Uygula Stabil Fix',summary:'Site adındaki sürüm etiketi, tepedeki güncellemeler, Alan Wake American Nightmare gibi alt oyun kapakları ve AI Siteye Uygula/Nereye Eklendi akışı düzeltildi.',image:'previews/hayatimiz-oyun-v240-fix14-stabil-preview.png',written:'FIX14 ile versiyon inputu üst bar ve sol yönetim logosuna senkronlandı; kapak seçici 20 adaya çıkarıldı; AI uygulanmış özellikler local/Supabase akışına ve hedef sayfa navigasyonuna bağlandı.'});
  }
  if(document.getElementById('root')?.dataset?.mounted === '1') render();
}catch(error){ console.warn('FIX14 render atlandı:', error); }


/* FIX24: Eski AI/Deploy bloğu kaynak dosyadan silindi. */
/* v2.4.0 FIX 18 - Oyun düzenle durum butonları kalıcı ve canlı çalışır */
const HO240F18_INTERNAL_VERSION = 'v2.4.0 FIX 18';
function ho240f18StatusToast(message){ try{ setToast(message); }catch{ console.log(message); } }
function ho240f18ReadGameForm(form){
  try{ return readGameDraftFromForm(form); }
  catch{
    const fd = form ? new FormData(form) : new FormData();
    const val = name => String(fd.get(name) || '').trim();
    return {
      title: val('title'), seriesName: val('seriesName'), releaseDate: val('releaseDate'), status: val('status') || 'Devam Ediyor',
      genre: val('genre'), tags: val('tags'), eps: Number(fd.get('eps') || 0), watchedEps: Number(fd.get('watchedEps') || 0),
      score: Number(fd.get('score') || 8.5), seriesOrder: Number(fd.get('seriesOrder') || 0), cover: val('cover'),
      playlistUrl: val('playlistUrl'), videoUrl: val('videoUrl'), description: val('description'), episodesText: val('episodesText'), episodes: []
    };
  }
}
function ho240f18SetFormStatus(form, status){
  if(!form || !status) return false;
  try{ v223Fix3SetFormValue(form, 'status', status); }catch{ try{ setFormValue(form, 'status', status); }catch{} }
  try{
    const select = form.elements?.status;
    if(select){ select.value = status; select.dispatchEvent(new Event('change', { bubbles:true })); }
  }catch{}
  const patch = { ...ho240f18ReadGameForm(form), status };
  if(form.id === 'gameEditForm' && state.editingGameId){
    const id = String(state.editingGameId);
    state.games = (Array.isArray(state.games) ? state.games : []).map(g => String(g.id) === id ? { ...g, ...patch, id:g.id } : g);
  }else{
    state.gameDraft = { ...DEFAULT_GAME_DRAFT, ...state.gameDraft, ...patch };
    try{ persistGameDraft(); }catch{}
  }
  return true;
}
function ho240f18HandleStatusClick(e){
  const btn = e.target?.closest?.('[data-v223-status],[data-status-pick]');
  if(!btn) return;
  const status = btn.dataset.v223Status || btn.dataset.statusPick || '';
  if(!status) return;
  const form = btn.closest('form');
  if(!form) return;
  e.preventDefault();
  e.stopImmediatePropagation();
  const ok = ho240f18SetFormStatus(form, status);
  if(ok){
    try{ render(); }catch{}
    ho240f18StatusToast(`Oyun durumu ${status} olarak seçildi. Oyunu Güncelle dediğinde bu durum kaydedilecek.`);
  }
}
try{
  if(!document.documentElement.dataset.ho240f18StatusGlobal){
    document.documentElement.dataset.ho240f18StatusGlobal = '1';
    document.addEventListener('click', ho240f18HandleStatusClick, true);
  }
}catch(error){ console.warn('FIX18 global durum dinleyici eklenemedi:', error); }
try{
  const ho240f18PrevBind = bind;
  bind = function(){
    try{ ho240f18PrevBind(); }catch(err){ console.warn('FIX18 önceki bind atlandı:', err); }
    document.querySelectorAll('[data-v223-status],[data-status-pick]').forEach(btn=>{
      if(btn.dataset.ho240f18Bound) return;
      btn.dataset.ho240f18Bound = '1';
      btn.addEventListener('click', ho240f18HandleStatusClick, true);
    });
  };
}catch(error){ console.warn('FIX18 bind katmanı atlandı:', error); }
try{
  const ho240f18PrevEditSubmit = onGameEditSubmit;
  onGameEditSubmit = async function(e){
    const form = e.currentTarget;
    if(form?.elements?.status && state.editingGameId){
      const status = String(form.elements.status.value || 'Devam Ediyor');
      ho240f18SetFormStatus(form, status);
    }
    return ho240f18PrevEditSubmit(e);
  };
}catch(error){ console.warn('FIX18 submit koruması atlandı:', error); }
try{
  if(Array.isArray(VERSION_NOTES_ARCHIVE) && !VERSION_NOTES_ARCHIVE.some(n=>n.version===HO240F18_INTERNAL_VERSION)){
    VERSION_NOTES_ARCHIVE.unshift({
      version:HO240F18_INTERNAL_VERSION,
      title:'Oyun Düzenle Durum Butonları Stabil',
      summary:'Oyun güncelle ekranındaki Tamamlanan, Devam Eden ve Yakında butonları artık edit formunda seçili durumu anında değiştirir, form yeniden çizilse bile seçim kaybolmaz ve Oyunu Güncelle ile kaydedilir.',
      image:'previews/hayatimiz-oyun-v240-fix18-status-buttons-preview.png',
      written:'FIX18 ile durum butonları hem yeni oyun formunda hem mevcut oyun düzenleme penceresinde kalıcı hale getirildi.'
    });
  }
}catch{}
try{ if(document.getElementById('root')?.dataset?.mounted === '1') render(); }catch(error){ console.warn('FIX18 başlangıç render atlandı:', error); }


/* v2.4.0 FIX 19 - Site yükleniyor ekranında kalma build/asset düzeltmesi */
const HO240F19_INTERNAL_VERSION = 'v2.4.0 FIX 19';
try{
  if(Array.isArray(VERSION_NOTES_ARCHIVE) && !VERSION_NOTES_ARCHIVE.some(n=>n.version===HO240F19_INTERNAL_VERSION)){
    VERSION_NOTES_ARCHIVE.unshift({
      version: HO240F19_INTERNAL_VERSION,
      title: 'Site Yükleniyor Build/Asset Fix',
      summary: 'Vercel dist içindeki JS dosyası artık kaynak dosya olarak değil gerçek Vite build olarak yayınlanır. assets/styles.css eksikliği yüzünden sayfanın Site yükleniyor ekranında kalması engellendi.',
      image: 'previews/hayatimiz-oyun-v240-fix19-site-yukleniyor-preview.png',
      written: 'FIX19 ile dist/index.html gerçek bundle dosyasına bağlandı, eski fix18 asset adı için geriye dönük uyumluluk eklendi ve Vercel cache için app dosyası sürümlü hale getirildi.'
    });
  }
}catch{}
try{ if(document.getElementById('root')?.dataset?.mounted === '1') render(); }catch(error){ console.warn('FIX19 başlangıç render atlandı:', error); }


/* FIX24: Eski AI/Deploy bloğu kaynak dosyadan silindi. */

/* FIX24: Eski AI/Deploy bloğu kaynak dosyadan silindi. */
/* v2.4.0 FIX 24 - AI + Deploy/Redeploy modülleri doğrudan silindi
   Bu katman pasifleştirme mesajı göstermez. Eski AI/Deploy sayfaları, butonları,
   localStorage kayıtları, menü bağları ve hedef paneller çalışma zamanından tamamen çıkarılır. */
const HO240F25_INTERNAL_VERSION = 'v2.4.0 FIX 25';
const HO240F24_PUBLIC_VERSION_KEY = 'ho240f14_current_site_version';
const HO240F24_REMOVED_PAGES = new Set([
  'AI Özellik Ekle','AI Özellik Merkezi','Özellik Planı','Uygulama Merkezi',
/* FIX24: eski AI/Deploy satırı silindi. */
]);
const HO240F24_REMOVED_ACTION_RE = /(ai|deploy|redeploy|github-upload|github|vercel|schema-feedback|auto-flow|scan-updates|suggest|feature-registry)/i;
function ho240f24Version(){
  return (localStorage.getItem(HO240F24_PUBLIC_VERSION_KEY) || localStorage.getItem('hayatimiz_last_public_version') || 'v2.4.1').replace(/\s*[-•]\s*v2\.4\.0\s*FIX\s*\d+.*/i,'').trim() || 'v2.4.1';
}
function ho240f24IsRemovedPage(page){ return HO240F24_REMOVED_PAGES.has(String(page || '').trim()); }
try{
  const ho240f24PrevTopbar = topbar;
  topbar = function(){
    return String(ho240f24PrevTopbar())
      .replace(/v2\.4\.\d+\s*(?:[-•])\s*v2\.4\.0\s*FIX\s*\d+[^<]*/gi, ho240f24Version())
      .replace(/<span>v2\.4\.0\s*FIX\s*\d+[^<]*<\/span>/gi, `<span>${esc(ho240f24Version())}</span>`)
      .replace(/AI Özellik Ekle|Özellik Yaz \/ AI Uygula|Deploy Merkezi|Redeploy \/ AI Tanı Merkezi/gi, 'Yönetim');
  };
}catch{}

function ho240f24CleanStorage(){
  const keep = new Set(['hayatimiz_last_public_version', HO240F24_PUBLIC_VERSION_KEY, AUTH_SESSION_KEY, PAGE_KEY, ADMIN_TAB_KEY, MAINTENANCE_KEY, GAME_FORM_DRAFT_KEY, FEATURE_CACHE_KEY]);
  const kill = /(ai|deploy|redeploy|github|vercel|hook|schema_feedback|ho240f11|ho240f12|ho240f13|ho240f15|v224_ai|v225_deploy|target_panels|custom_idea|custom_suggestion|applied_features)/i;
  try{
    Object.keys(localStorage).forEach(k=>{ if(!keep.has(k) && kill.test(k)) localStorage.removeItem(k); });
    localStorage.setItem('hayatimiz_last_fix_version', HO240F25_INTERNAL_VERSION);
  }catch{}
}
function ho240f24ScrubHtml(html){
  let out = String(html || '');
  // Orphan eski buton/panel metinlerini kes. Menü zaten yeniden çiziliyor; bu ekstra güvenliktir.
  out = out.replace(/<button[^>]+data-admin=["'](?:AI Özellik Ekle|AI Özellik Merkezi|Özellik Planı|Uygulama Merkezi|Deploy Merkezi|Redeploy \/ AI Tanı Merkezi)["'][\s\S]*?<\/button>/gi,'');
  out = out.replace(/<button[^>]+data-action=["'][^"']*(?:ai|deploy|redeploy|github|vercel)[^"']*["'][\s\S]*?<\/button>/gi,'');
  out = out.replace(/<section[^>]+(?:ho240f15TargetPanel|ho240f13DeployPanel|ho240f15DeployPanel|ho240f11DeployPanel|ho240Panel|ho240f10Ai)[\s\S]*?<\/section>/gi,'');
  out = out.replace(/AI ile Bu Alana Eklenen Özellikler/gi,'');
  out = out.replace(/Redeploy\s*\/\s*AI Tanı Merkezi/gi,'');
  return out;
}
function ho240f24Overview(){
  const games = Array.isArray(state.games) ? state.games : [];
  const completed = games.filter(g=>String(g.status||'').toLocaleLowerCase('tr-TR').includes('tamam')).length;
  const ongoing = games.filter(g=>String(g.status||'').toLocaleLowerCase('tr-TR').includes('devam')).length;
  const upcoming = games.filter(g=>String(g.status||'').toLocaleLowerCase('tr-TR').includes('yak')).length;
  return `<section class="adminGrid grid"><div class="card"><span class="pill green">Sade</span><h3>${games.length}</h3><p class="muted">toplam oyun</p></div><div class="card"><span class="pill green">Tamamlanan</span><h3>${completed}</h3><p class="muted">biten kayıt</p></div><div class="card"><span class="pill">Devam</span><h3>${ongoing}</h3><p class="muted">aktif seri/oyun</p></div><div class="card"><span class="pill">Yakında</span><h3>${upcoming}</h3><p class="muted">planlanan kayıt</p></div></section><section class="card wide"><h2>Yönetim paneli temizlendi</h2><p class="muted">AI özellik yazma/önerme ve site içinden deploy/redeploy/GitHub/Vercel yönetimi tamamen kaldırıldı. Bu panel sadece oyun, seri, takvim, rapor, bakım ve ayar işleri için kullanılır.</p><div class="rowActions"><button class="btn primary" data-admin="Oyunlar">Oyunlar Sekmesini Aç</button><button class="btn" data-admin="Güncelleme Notları">Güncelleme Notlarını Aç</button></div></section>`;
}
function ho240f24AdminBody(){
  if(ho240f24IsRemovedPage(state.adminPage)){ state.adminPage='Genel Bakış'; try{ localStorage.setItem(ADMIN_TAB_KEY,state.adminPage); }catch{} }
  if(state.adminPage === 'Genel Bakış') return ho240f24Overview();
  if(state.adminPage === 'Kullanıcı Yetkileri') return usersPanel();
  if(state.adminPage === 'Bakım Modu') return maintenanceAdmin();
  if(state.adminPage === 'Güncelleme Notları') return updateNotes();
  if(state.adminPage === 'Profil') return profilePage();
  if(state.adminPage === 'Oyunlar') return ho240f24ScrubHtml(gamesAdmin());
  if(state.adminPage === 'Seri İzleme') return adminSeriesWatchPanel();
  if(state.adminPage === 'Yayın Takvimi') return (typeof hoFix8CalendarAdmin === 'function' ? hoFix8CalendarAdmin() : (typeof calendarPage === 'function' ? calendarPage() : '<section class="card wide"><h2>Takvim</h2></section>'));
  if(state.adminPage === 'Bildirim Kuyruğu') return (typeof ho240CalendarPage === 'function' ? ho240CalendarPage() : userNotifications());
  if(state.adminPage === 'Seri Geçmişi') return (typeof ho240SeriesHistoryPanel === 'function' ? ho240SeriesHistoryPanel() : '<section class="card wide"><h2>Seri Geçmişi</h2></section>');
  if(state.adminPage === 'Oyun İstekleri') return (typeof v224AdminGameRequests === 'function' ? v224AdminGameRequests() : adminGameRequestsPageFix8());
  if(state.adminPage === 'Hata Bildir' || state.adminPage === 'Hata Bildirimleri') return (typeof v224AdminBugReports === 'function' ? v224AdminBugReports() : adminBugReportsPageFix8());
  if(state.adminPage === 'Raporlar') return (typeof ho240ReportsPanel === 'function' ? ho240ReportsPanel() : '<section class="card wide"><h2>Raporlar</h2></section>');
  if(state.adminPage === 'Schema Geçmişi') return (typeof ho240SchemaCenter === 'function' ? ho240SchemaCenter() : '<section class="card wide"><h2>Schema Geçmişi</h2></section>');
  if(state.adminPage === 'Yönetim Kısayolları') return (typeof ho240Shortcuts === 'function' ? ho240Shortcuts() : '<section class="card wide"><h2>Yönetim Kısayolları</h2></section>');
  if(state.adminPage === 'Sistem Sağlık') return (typeof ho240HealthPanel === 'function' ? ho240HealthPanel() : '<section class="card wide"><h2>Sistem Sağlık</h2></section>');
  if(state.adminPage === 'API/ENV Durumu') return apiStatus();
  if(state.adminPage === 'Ayarlar') return (typeof ho240SettingsPanel === 'function' ? ho240SettingsPanel() : settingsPanel());
  return ho240f24Overview();
}
function ho240f24AdminPanel(){
  if(!isStaff()) return `<section class="card"><h2>Yetki gerekiyor</h2><p>Yönetim paneli sadece yetkili hesaplara görünür.</p></section>`;
  const links = [
    ['Genel Bakış','Özet'],['Oyunlar','Oyun ekle/düzenle'],['Seri İzleme','Serileri sırala'],['Seri Geçmişi','Karşılaştır / geri al'],['Yayın Takvimi','Takvim görünümü'],['Bildirim Kuyruğu','Tarayıcı/e-posta'],['Oyun İstekleri','Gelen istekler'],['Hata Bildir','Gelen hatalar'],['Raporlar','Filtre/dışa aktar'],['Schema Geçmişi','SQL zaman çizelgesi'],['Bakım Modu','Yol haritası'],['Yönetim Kısayolları','Role göre'],['Sistem Sağlık','Tek tık kontrol'],['Güncelleme Notları','Sürüm notları'],['API/ENV Durumu','Bağlantı'],['Ayarlar','Tema/tercihler']
  ];
  if(!links.some(([p])=>p===state.adminPage) || ho240f24IsRemovedPage(state.adminPage)){
    state.adminPage='Genel Bakış';
    try{ localStorage.setItem(ADMIN_TAB_KEY,state.adminPage); }catch{}
  }
  const version = ho240f24Version();
  const headerActions = state.adminPage === 'Oyunlar'
    ? `<div class="rowActions"><button class="btn" data-action="toggle-game-form">${state.showGameForm?'Formu Gizle':'Yeni Oyun Ekle'}</button><button class="btn primary" data-action="bulk-sync-playlists">Toplu İşlemler</button></div>`
    : `<span class="pill ${state.maintenance?.enabled?'banned':'green'}">${state.maintenance?.enabled?'Bakım açık':'Bakım kapalı'}</span>`;
  const subtitle = state.adminPage==='Genel Bakış' ? 'Sade yönetim paneli. Gereksiz AI ve yayına alma modülleri silindi.' : adminSubtitle(state.adminPage);
  return `<section class="fix5AdminShell ho240AdminShell ho240f24AdminShell"><aside class="fix5AdminSidebar"><div class="sideLogo"><span class="logoMark">🎮</span><div><b>Hayatımız Oyun</b><small>${esc(version)} Yönetim</small></div></div><div class="sideNavLabel">MENÜ</div><button class="sideNavItem" data-page="Ana Sayfa"><span>⌂</span>Ana Sayfa</button><button class="sideNavItem" data-page="Oyun Arşivi"><span>🎮</span>Oyun Arşivi</button><button class="sideNavItem" data-page="Seriler"><span>◈</span>Seriler</button><button class="sideNavItem" data-page="Takvim"><span>▣</span>Yayın Takvimi</button><div class="sideNavLabel">YÖNETİM</div><div class="adminAccordion open"><button class="adminAccordionHead active"><span>👑</span><div><b>Yönetim Paneli</b><small>${esc(state.session?.full_name||'Yetkili')}</small></div><strong>⌄</strong></button><div class="adminAccordionBody">${links.map(([page,cap])=>`<button class="adminSubLink ${state.adminPage===page?'active':''}" data-admin="${esc(page)}"><span class="subDot"></span><div><b>${esc(page)}</b><small>${esc(cap)}</small></div></button>`).join('')}</div></div></aside><div class="adminContent fix5AdminContent"><div class="fix5AdminHeader"><div><div class="adminBreadcrumb">Yönetim Paneli <span>›</span> ${esc(state.adminPage)}</div><h1>${esc(state.adminPage)}</h1><p>${esc(subtitle)}</p></div>${headerActions}</div>${ho240f24AdminBody()}</div></section>`;
}
function ho240f24RemoveOrphans(){
  document.querySelectorAll('[data-admin="AI Özellik Ekle"],[data-admin="AI Özellik Merkezi"],[data-admin="Özellik Planı"],[data-admin="Uygulama Merkezi"],[data-admin="Deploy Merkezi"],[data-admin*="Redeploy"],[data-action*="deploy"],[data-action*="redeploy"],[data-action*="github"],[data-action*="vercel"],[data-action*="ai"],[data-ho-ai-go],[data-ho240f10-ai-go],[data-ho240f13-ai-apply],[data-v224-ai-apply],[data-v224-deploy-toggle]').forEach(el=>{ try{ el.remove(); }catch{} });
  document.querySelectorAll('.ho240f15TargetPanel,.ho240f13DeployPanel,.ho240f15DeployPanel,.ho240f11DeployPanel,.ho240Panel,.ho240f10Ai').forEach(el=>{ try{ el.remove(); }catch{} });
}
try{
  ho240f24CleanStorage();
  // Eski fonksiyon isimleri doğrudan boşaltılır. Bu sayfalar artık üretilemez.
  adminBody = ho240f24AdminBody;
  adminPanel = ho240f24AdminPanel;
  ho240DeployCenter = () => '';
  ho240f11DeployCenter = () => '';
  ho240f13DeployCenter = () => '';
  ho240f15DeployCenter = () => '';
  hoFix8DeployPanel = () => '';
  hoFix10AiCenter = () => '';
  ho240f15AiCenter = () => '';
  ho240f15PanelForAdmin = () => '';
  ho240Applied = () => [];
}catch(error){ console.warn('FIX24 hard-delete override uygulanamadı:', error); }
try{
  const ho240f24PrevAdminNavigate = adminNavigate;
  adminNavigate = function(page){
    if(ho240f24IsRemovedPage(page)){
      state.page='Yönetim Paneli'; state.adminPage='Genel Bakış';
      try{ localStorage.setItem(PAGE_KEY,state.page); localStorage.setItem(ADMIN_TAB_KEY,state.adminPage); syncRouteToAddress(); }catch{}
      render(); return;
    }
    return ho240f24PrevAdminNavigate(page);
  };
}catch{}
try{
  const ho240f24PrevAdminNameFromSlug = adminNameFromSlug;
  adminNameFromSlug = function(slug){
    const name = ho240f24PrevAdminNameFromSlug(slug);
    return ho240f24IsRemovedPage(name) ? 'Genel Bakış' : name;
  };
}catch{}
try{
  const ho240f24PrevOnAction = onAction;
  onAction = async function(e){
    const action = e.currentTarget?.dataset?.action || '';
    if(HO240F24_REMOVED_ACTION_RE.test(action)){ e.preventDefault(); e.stopImmediatePropagation(); ho240f24CleanStorage(); ho240f24RemoveOrphans(); return; }
    return ho240f24PrevOnAction(e);
  };
}catch{}
try{
  const ho240f24PrevBind = bind;
  bind = function(){ try{ ho240f24PrevBind(); }catch(err){ console.warn('FIX24 önceki bind atlandı:', err); } ho240f24RemoveOrphans(); };
}catch{}
try{
  const style = document.createElement('style');
  style.textContent = `.ho240f24AdminShell [data-admin*="AI"],.ho240f24AdminShell [data-admin="Deploy Merkezi"],.ho240f24AdminShell [data-admin*="Redeploy"],.ho240f24AdminShell [data-action*="deploy"],.ho240f24AdminShell [data-action*="redeploy"],.ho240f24AdminShell [data-action*="github"],.ho240f24AdminShell [data-action*="vercel"],.ho240f24AdminShell [data-action*="ai"],.ho240f24AdminShell .deployBadges,.ho240f15TargetPanel,.ho240f13DeployPanel,.ho240f15DeployPanel,.ho240f11DeployPanel,.ho240Panel,.ho240f10Ai{display:none!important}`;
  document.head.appendChild(style);
}catch{}
try{
  if(Array.isArray(VERSION_NOTES_ARCHIVE) && !VERSION_NOTES_ARCHIVE.some(n=>n.version===HO240F25_INTERNAL_VERSION)){
    VERSION_NOTES_ARCHIVE.unshift({
      version:HO240F25_INTERNAL_VERSION,
      title:'AI ve Deploy Kod Temizliği',
      summary:'AI özellik yazma/önerme ve deploy/redeploy modülleri pasifleştirme yerine doğrudan menüden, sayfalardan, runtime bağlarından ve API aksiyonlarından çıkarıldı.',
      image:'previews/hayatimiz-oyun-v240-fix24-temiz-panel-preview.png',
      written:'FIX24 ile sade yönetim paneli kalıcı hale getirildi. Yeni özellikler artık site içinden AI/deploy butonlarıyla değil, ZIP güncellemesi olarak hazırlanacak.'
    });
  }
  document.title = `Hayatımız Oyun - ${ho240f24Version()}`;
  if(document.getElementById('root')?.dataset?.mounted === '1') render();
}catch(error){ console.warn('FIX24 başlangıç katmanı atlandı:', error); }


/* v2.4.0 FIX 26 - Profesyonel oyun ekle/düzenle, üste atlamayan çekim ve VS Code local önizleme */
const HO240F26_INTERNAL_VERSION = 'v2.4.0 FIX 26';
function ho240f26MarkStableScroll(){
  try{
    state.ho240f26KeepScrollUntil = Date.now() + 3500;
    state.ho240f26ScrollY = Math.max(0, window.scrollY || document.documentElement.scrollTop || 0);
    document.documentElement.dataset.ho240f26StableScroll = '1';
  }catch{}
}
function ho240f26RestoreStableScroll(y){
  try{
    const target = Math.max(0, Number(y || state.ho240f26ScrollY || 0));
    requestAnimationFrame(()=>{
      window.scrollTo(0, target);
      setTimeout(()=>window.scrollTo(0, target), 40);
    });
  }catch{}
}
try{
  const ho240f26PrevRender = render;
  render = function(){
    const keep = !!(state.ho240f26KeepScrollUntil && Date.now() < state.ho240f26KeepScrollUntil);
    const y = keep ? Number(state.ho240f26ScrollY || window.scrollY || 0) : 0;
    ho240f26PrevRender();
    if(keep) ho240f26RestoreStableScroll(y);
  };
}catch(error){ console.warn('FIX26 render koruması kurulamadı:', error); }
try{
  if(!document.documentElement.dataset.ho240f26GlobalEvents){
    document.documentElement.dataset.ho240f26GlobalEvents = '1';
    document.addEventListener('click', event=>{
      const target = event.target?.closest?.('#gameAddForm,#gameEditForm,.fix26GameEditor,.ho240f11CoverPanel,.rawgCandidatePanel,.coverSuggestionPanel');
      if(target) ho240f26MarkStableScroll();
    }, true);
    document.addEventListener('submit', event=>{
      if(event.target?.matches?.('#gameAddForm,#gameEditForm')) ho240f26MarkStableScroll();
    }, true);
  }
}catch(error){ console.warn('FIX26 global form olayları kurulamadı:', error); }
function ho240f26DateValue(value){
  try{ return typeof formatDateTrFix6 === 'function' ? formatDateTrFix6(value || '') : normalizeReleaseDate(value || ''); }
  catch{ return String(value || ''); }
}
function ho240f26SeriesOptions(current=''){
  const seen = new Set();
  const items = (Array.isArray(state.games) ? state.games : [])
    .map(g=>String(g.seriesName || '').trim())
    .filter(Boolean)
    .filter(name=>!seen.has(name.toLocaleLowerCase('tr-TR')) && (seen.add(name.toLocaleLowerCase('tr-TR')), true))
    .sort((a,b)=>a.localeCompare(b,'tr'));
  if(current && !items.includes(current)) items.unshift(current);
  return items.map(name=>`<option value="${esc(name)}"></option>`).join('');
}
function ho240f26SafeCover(d){
  return String(d?.cover || '').trim() || (typeof FIX11_COVER !== 'undefined' ? FIX11_COVER : 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=900&auto=format&fit=crop');
}
function ho240f26StatusBar(current='Devam Ediyor'){
  const items = [['Tamamlandı','Tamamlanan'],['Devam Ediyor','Devam Eden'],['Yakında','Yakında']];
  return `<div class="fix26StatusBar" role="group" aria-label="Oyun durumu">${items.map(([value,label])=>`<button type="button" class="tagBtn ${current===value?'active':''}" data-status-pick="${esc(value)}"><b>${esc(label)}</b><small>${esc(value)}</small></button>`).join('')}</div>`;
}
function ho240f26FormFields(d={}, mode='add'){
  const data = { ...DEFAULT_GAME_DRAFT, ...(d || {}) };
  const isEdit = mode === 'edit';
  const status = data.status || 'Devam Ediyor';
  const opts = ['Devam Ediyor','Tamamlandı','Popüler','Yakında'].map(st=>`<option ${status===st?'selected':''}>${st}</option>`).join('');
  const dateValue = ho240f26DateValue(data.releaseDate || '');
  const title = String(data.title || '').trim();
  const desc = String(data.description || (typeof fix12DetailedStory === 'function' ? fix12DetailedStory(title || 'Oyun adı', data.genre || '') : 'Bu oyun, arşivde profesyonel kart yapısıyla görünecektir.')).slice(0,300);
  const metaAction = isEdit ? 'auto-game-meta-edit' : 'auto-game-meta';
  const playlistAction = isEdit ? 'estimate-playlist-episodes-edit' : 'estimate-playlist-episodes';
  const coverPanel = typeof ho240f11CoverPanel === 'function' ? ho240f11CoverPanel() : '';
  return `<div class="fix26GameEditor" data-mode="${mode}">
    <section class="fix26EditorHero">
      <div><span class="eyebrow">${isEdit?'Mevcut oyun düzenleme':'Yeni oyun ekleme'} • FIX26</span><h2>${isEdit?'Oyunu Profesyonel Düzenle':'Profesyonel Oyun Ekle'}</h2><p class="muted">Meta, kapak, hikaye veya playlist çekince sayfa artık üste atmaz. Form aynı yerde kalır ve önizleme canlı güncellenir.</p></div>
      <div class="fix26HeroBadges"><span class="pill green">Üste atlama fix</span><span class="pill">Local önizleme hazır</span></div>
    </section>
    <div class="fix26EditorGrid">
      <section class="fix26FormMain">
        <div class="fix26StepBar"><span class="active">1 Bilgiler</span><span>2 Kapak / Meta</span><span>3 Bölümler</span><span>4 Kaydet</span></div>
        ${ho240f26StatusBar(status)}
        <div class="fix26FormGrid">
          <label class="field">Oyun Adı *<input name="title" required placeholder="Örn: Alan Wake 2" value="${esc(data.title || '')}" /></label>
          <label class="field">Seri Adı<input name="seriesName" list="fix26SeriesNames" placeholder="Örn: Alan Wake" value="${esc(data.seriesName || '')}" /><datalist id="fix26SeriesNames">${ho240f26SeriesOptions(data.seriesName || '')}</datalist></label>
          <label class="field">Çıkış Tarihi <small>gün.ay.yıl</small><input name="releaseDate" placeholder="27.10.2023" value="${esc(dateValue)}" /></label>
          <label class="field">Durum<select name="status">${opts}</select></label>
          <label class="field wideField">Türler<div class="inlineField"><input name="genre" required placeholder="Korku, aksiyon-macera, hikaye odaklı" value="${esc(data.genre || '')}" /><button class="miniBtn" type="button" data-action="fix12-refetch-genres">Türleri Çek</button></div></label>
          <div class="field wideField"><span>Etiketler</span>${tagButtonsHtml(data.tags || '')}</div>
          <label class="field">Toplam Bölüm<input name="eps" type="number" min="0" value="${esc(String(data.eps ?? 0))}" /></label>
          <label class="field">İzlenen Bölüm<input name="watchedEps" type="number" min="0" value="${esc(String(data.watchedEps ?? 0))}" /></label>
          <label class="field">Puan<input name="score" type="number" min="0" max="10" step="0.1" value="${esc(String(data.score ?? 8.5))}" /></label>
          <label class="field">Seri Sıra No<input name="seriesOrder" type="number" min="0" value="${esc(String(data.seriesOrder ?? 0))}" /></label>
          <label class="field wideField fix26CoverField"><span>Kapak URL</span><div class="inlineField"><input name="cover" placeholder="https://..." value="${esc(data.cover || '')}" /><button class="miniBtn" type="button" data-action="${metaAction}">Meta + Kapak Çek</button><button class="miniBtn primary" type="button" data-action="ho240f11-find-covers">Kapakları Getir</button></div><div class="fix26CoverMiniPreview"><img src="${esc(ho240f26SafeCover(data))}" alt="Kapak önizleme"><small>Kapak seçince bu alan yenilenir, sayfa konumu korunur.</small></div></label>
          ${coverPanel}
          <label class="field wideField">YouTube Playlist<input name="playlistUrl" placeholder="https://youtube.com/playlist?list=..." value="${esc(data.playlistUrl || '')}" /></label>
          <label class="field wideField">Tek Video URL<input name="videoUrl" placeholder="https://youtube.com/watch?v=..." value="${esc(data.videoUrl || '')}" /></label>
          <label class="field wideField fix26StoryField"><span>Oyunun Hikayesi / Açıklama</span><textarea name="description" rows="7" placeholder="Hikayeyi Çek ile temiz Türkçe özet oluştur.">${esc(data.description || '')}</textarea><div class="rowActions"><button class="miniBtn primary" type="button" data-action="fix12-refetch-story">Hikayeyi Çek</button><button class="miniBtn" type="button" data-action="fix12-refetch-genres">Türleri Çek</button></div></label>
          <label class="field wideField episodeImportField fix26EpisodeField"><span>Bölüm Listesi</span><small>Playlist bölümleri kart önizleme olarak kalır, teknik veri gizlenebilir.</small>${episodeImportPreview(data.episodesText, data.episodes)}<textarea name="episodesText" rows="5" class="technicalEpisodes" placeholder="Teknik bölüm verisi otomatik oluşur">${esc(data.episodesText || episodesToText(data.episodes || []))}</textarea><div class="rowActions"><button class="miniBtn" type="button" data-action="toggle-technical-episodes">Teknik Veriyi Göster / Gizle</button><button class="miniBtn primary" type="button" data-action="${playlistAction}">Playlist Bölümleri Çek</button></div></label>
        </div>
        <div class="fix26ActionBar"><button class="btn" type="button" data-action="${isEdit?'close-game-edit':'fix26-clear-game-form'}">${isEdit?'Listeye Dön':'Formu Temizle'}</button><button class="btn" type="button" data-action="${metaAction}">Meta + Kapak Çek</button><button class="btn" type="button" data-action="${playlistAction}">Playlist Bölümleri Çek</button><button class="btn primary" type="submit">${isEdit?'Oyunu Güncelle':'Oyunu Kaydet'}</button></div>
      </section>
      <aside class="fix26PreviewSide"><div class="fix26PreviewSticky"><span class="eyebrow">Canlı Önizleme</span><div class="fix26PreviewCover"><img src="${esc(ho240f26SafeCover(data))}" alt="${esc(title || 'Oyun')}"><span class="scoreBadge">${esc(String(data.score || '8.5'))}</span></div><article class="fix26PreviewCard"><h3>${esc(title || 'Oyun adı')}</h3>${tagChipsHtml(data.tags || data.genre || '')}<p>${esc(desc)}${desc.length>=300?'...':''}</p><div class="fix6MetaGrid"><div><small>Çıkış</small><b>${esc(dateValue || '-')}</b></div><div><small>Durum</small><b>${esc(status)}</b></div><div><small>Tür</small><b>${esc(data.genre || 'Genel')}</b></div><div><small>Bölüm</small><b>${esc(String(data.watchedEps||0))}/${esc(String(data.eps||0))}</b></div></div></article><div class="fix26LocalHint"><b>Local test:</b><span>ZIP içindeki 03-VSCode-Localhost-Onizleme.bat dosyasını çalıştır, siteyi yayınlamadan VS Code’da gör.</span></div></div></aside>
    </div>
  </div>`;
}
try{
  gameFormFields = ho240f26FormFields;
  gameAddForm = function(){ const d = { ...DEFAULT_GAME_DRAFT, ...(state.gameDraft || {}) }; return `<form class="card soft gameForm fix26GameForm" id="gameAddForm" autocomplete="off">${ho240f26FormFields(d,'add')}</form>`; };
  gameEditForm = function(){ const current = (Array.isArray(state.games)?state.games:[]).find(g=>String(g.id)===String(state.editingGameId)); if(!current) return ''; return `<form class="card soft gameForm editGameForm fix26GameForm" id="gameEditForm" autocomplete="off">${ho240f26FormFields(current,'edit')}</form>`; };
}catch(error){ console.warn('FIX26 form override uygulanamadı:', error); }
try{
  gamesAdmin = function(){
    const tab = state.editingGameId ? 'edit' : (localStorage.getItem(FIX8_GAME_TAB_KEY) || 'add');
    const listHtml = typeof adminGamesTableFix8 === 'function' ? adminGamesTableFix8() : adminGamesTable();
    return `<section class="fix26GamesAdmin"><div class="fix26GameAdminHero"><div><span class="eyebrow">Oyun Yönetimi • Profesyonel Form</span><h2>Oyun Ekle / Mevcut Oyunu Düzenle</h2><p class="muted">Çek, seç, kaydet işlemleri sayfayı yukarı fırlatmadan çalışır. Yayınlamadan önce localde test etmek için 03-VSCode-Localhost-Onizleme.bat kullan.</p></div><div class="rowActions"><button class="btn ${tab==='add'?'primary':''}" data-action="game-admin-tab" data-tab="add">Oyun Ekle</button><button class="btn ${tab==='list'?'primary':''}" data-action="game-admin-tab" data-tab="list">Mevcut Oyunlar</button><button class="btn" data-action="auto-cover-fetch">Kapaksızlara Kapak Öner</button></div></div>${tab==='edit' ? `${gameEditForm()}${rawgCandidatePanel()}${coverSuggestionPanel()}${listHtml}` : tab==='add' ? `${gameAddForm()}${rawgCandidatePanel()}${coverSuggestionPanel()}` : listHtml}</section>`;
  };
}catch(error){ console.warn('FIX26 gamesAdmin uygulanamadı:', error); }
try{
  const ho240f26PrevOnAction = onAction;
  onAction = async function(e){
    const action = e.currentTarget?.dataset?.action || '';
    if(['auto-game-meta','auto-game-meta-edit','ho240f11-find-covers','ho240f10-find-covers','fix12-refetch-story','fetch-game-story','fetch-game-story-edit','fix10-refetch-story','fix12-refetch-genres','fix10-refetch-genres','estimate-playlist-episodes','estimate-playlist-episodes-edit','toggle-technical-episodes'].includes(action)) ho240f26MarkStableScroll();
    if(action === 'fix26-clear-game-form'){
      e.preventDefault(); e.stopImmediatePropagation();
      clearGameDraft(); state.rawgCandidates=[]; state.coverSuggestions=[]; state.ho240f11CoverCandidates=[]; state.ho240f10CoverCandidates=[]; localStorage.setItem(FIX8_GAME_TAB_KEY,'add');
      render(); setToast('Oyun ekleme formu temizlendi.'); return;
    }
    if(action === 'ho240f11-find-covers'){
      e.preventDefault(); e.stopImmediatePropagation();
      const form = e.currentTarget.closest('form') || document.getElementById(state.editingGameId ? 'gameEditForm' : 'gameAddForm');
      await ho240f11FindCovers(form);
      return;
    }
    if(action === 'game-admin-tab'){
      ho240f26MarkStableScroll();
    }
    return ho240f26PrevOnAction(e);
  };
}catch(error){ console.warn('FIX26 onAction uygulanamadı:', error); }
try{
  onGameEdit = function(e){
    e.preventDefault();
    const id = e.currentTarget.dataset.gameEdit;
    const current = (Array.isArray(state.games)?state.games:[]).find(g => String(g.id) === String(id));
    if(!current) return setToast('Oyun bulunamadı.');
    state.page = 'Yönetim Paneli'; state.adminPage = 'Oyunlar'; state.editingGameId = id; state.showGameForm = false; state.rawgCandidates = []; state.coverSuggestions = [];
    try{ localStorage.setItem(PAGE_KEY,'Yönetim Paneli'); localStorage.setItem(ADMIN_TAB_KEY,'Oyunlar'); localStorage.setItem(FIX8_GAME_TAB_KEY,'edit'); }catch{}
    render();
    requestAnimationFrame(()=>document.getElementById('gameEditForm')?.scrollIntoView({ block:'start', behavior:'smooth' }));
    setToast('Düzenleme formu açıldı. Çekim/kaydetme işleminde sayfa üste atlamaz.');
  };
}catch(error){ console.warn('FIX26 onGameEdit override uygulanamadı:', error); }
try{
  onGameEditSubmit = async function(e){
    e.preventDefault(); ho240f26MarkStableScroll();
    const form = e.currentTarget;
    const id = state.editingGameId;
    const current = (Array.isArray(state.games)?state.games:[]).find(g => String(g.id) === String(id));
    if(!current) return setToast('Düzenlenecek oyun bulunamadı.');
    const patch = { ...current, ...readGameDraftFromForm(form), id: current.id };
    if(!patch.title) return setToast('Oyun adı gerekli.');
    state.games = state.games.map(g => String(g.id) === String(id) ? { ...g, ...patch } : g);
    try{ localStorage.setItem(FIX8_GAME_TAB_KEY,'edit'); }catch{}
    render(); setToast('Oyun ekranda güncellendi. Supabase kaydı deneniyor...');
    try{
      const data = await api('games-update', { adminToken: state.session?.adminToken, gameId:id, game:patch });
      if(data.game) state.games = state.games.map(g => String(g.id) === String(id) ? mapGame(data.game) : g);
      ho240f26MarkStableScroll(); render(); setToast('Oyun Supabase üzerinde güncellendi. Form aynı yerde kaldı.');
    }catch(err){ setToast('Oyun local güncellendi; Supabase güncelleme başarısız: ' + err.message); }
  };
}catch(error){ console.warn('FIX26 edit submit override uygulanamadı:', error); }
try{
  onGameAddSubmit = async function(e){
    e.preventDefault(); ho240f26MarkStableScroll();
    const form = e.currentTarget;
    saveGameDraftFromForm(form);
    const game = { ...DEFAULT_GAME_DRAFT, ...(state.gameDraft || {}) };
    if(!game.title) return setToast('Oyun adı gerekli.');
    if((Array.isArray(state.games)?state.games:[]).some(g => sameTitle(g.title, game.title))) return setToast('Bu oyun zaten listede var. Mevcut oyunu düzenle ile güncelle.');
    try{
      const data = await api('games-add', { adminToken: state.session?.adminToken, game });
      if(!data.game) throw new Error('Supabase kayıt cevabı boş döndü.');
      state.games.unshift(mapGame(data.game));
      clearGameDraft(); state.rawgCandidates=[]; state.coverSuggestions=[]; state.ho240f11CoverCandidates=[]; state.ho240f10CoverCandidates=[];
      try{ localStorage.setItem(FIX8_GAME_TAB_KEY,'add'); }catch{}
      render(); setToast('Oyun kaydedildi. Form temizlendi, sayfa konumu korundu.');
    }catch(err){ render(); setToast('Oyun eklenmedi. Form korundu. Supabase/API hatası: ' + err.message); }
  };
}catch(error){ console.warn('FIX26 add submit override uygulanamadı:', error); }
try{
  const ho240f26PrevBind = bind;
  bind = function(){
    try{ ho240f26PrevBind(); }catch(err){ console.warn('FIX26 önceki bind atlandı:', err); }
    document.querySelectorAll('#gameAddForm input,#gameAddForm textarea,#gameAddForm select').forEach(el=>{
      if(el.dataset.ho240f26DraftBound) return; el.dataset.ho240f26DraftBound='1';
      el.addEventListener('input', ()=>{ const form=document.getElementById('gameAddForm'); if(form) saveGameDraftFromForm(form); });
      el.addEventListener('change', ()=>{ const form=document.getElementById('gameAddForm'); if(form) saveGameDraftFromForm(form); });
    });
    document.querySelectorAll('#gameEditForm input,#gameEditForm textarea,#gameEditForm select').forEach(el=>{
      if(el.dataset.ho240f26EditBound) return; el.dataset.ho240f26EditBound='1';
      el.addEventListener('input', ()=>{ try{ updateOpenGameFormSnapshot(document.getElementById('gameEditForm')); }catch{} });
      el.addEventListener('change', ()=>{ try{ updateOpenGameFormSnapshot(document.getElementById('gameEditForm')); }catch{} });
    });
  };
}catch(error){ console.warn('FIX26 bind override uygulanamadı:', error); }
try{
  if(Array.isArray(VERSION_NOTES_ARCHIVE) && !VERSION_NOTES_ARCHIVE.some(n=>n.version===HO240F26_INTERNAL_VERSION)){
    VERSION_NOTES_ARCHIVE.unshift({
      version:HO240F26_INTERNAL_VERSION,
      title:'Profesyonel Oyun Formu ve Local Önizleme',
      summary:'Oyun ekle/mevcut oyun düzenleme ekranı profesyonel hale getirildi; kapak, meta, hikaye ve playlist çekimlerinde sayfanın üste atlaması engellendi; VS Code local önizleme BAT dosyası eklendi.',
      image:'previews/hayatimiz-oyun-v240-fix26-game-editor-preview.png',
      written:'FIX26 ile oyun yönetimi sade, stabil ve local test edilebilir hale getirildi. Yayına almadan önce 03-VSCode-Localhost-Onizleme.bat ile localhost üzerinde kontrol edebilirsin.'
    });
  }
  if(document.getElementById('root')?.dataset?.mounted === '1') render();
}catch(error){ console.warn('FIX26 başlangıç render atlandı:', error); }
try{
  if(!window.__ho240f26WindowScrollGuard){
    window.__ho240f26WindowScrollGuard = true;
    window.addEventListener('click', event=>{
      if(event.target?.closest?.('#gameAddForm,#gameEditForm,.fix26GameEditor,.ho240f11CoverPanel')) ho240f26MarkStableScroll();
    }, true);
    window.addEventListener('submit', event=>{
      if(event.target?.matches?.('#gameAddForm,#gameEditForm')) ho240f26MarkStableScroll();
    }, true);
  }
}catch(error){ console.warn('FIX26 pencere scroll koruması eklenemedi:', error); }

/* v2.4.0 FIX 29 - bakım modu, seri sıralama, Supabase istek/hata çekme ve güvenli oyun formu */
const HO240F29_INTERNAL_VERSION = 'v2.4.0 FIX 29';
try{
  localStorage.removeItem(GAME_FORM_DRAFT_KEY);
  state.gameDraft = { ...DEFAULT_GAME_DRAFT };
  state.editGameDraftSnapshots = state.editGameDraftSnapshots || {};
  state.feedbackCache = state.feedbackCache || { requests:null, bugs:null, loading:false, error:'' };
}catch(error){ console.warn('FIX29 başlangıç temizliği atlandı:', error); }

function ho240f29DateTR(value){
  if(!value) return '';
  try{ const d = new Date(value); if(!Number.isNaN(d.getTime())) return d.toLocaleString('tr-TR'); }catch{}
  return String(value || '');
}
function ho240f29ClampPercent(value){
  const n = Number(value ?? 0);
  return Math.max(0, Math.min(100, Number.isFinite(n) ? n : 0));
}
function ho240f29ReadMaintenanceForm(){
  const prev = state.maintenance || {};
  const progress = ho240f29ClampPercent(document.getElementById('maintenanceProgress')?.value ?? prev.progress ?? prev.percent ?? 65);
  const notesText = String(document.getElementById('maintenanceNotesText')?.value ?? prev.updates ?? prev.notesText ?? prev.notes ?? '').trim();
  return {
    ...prev,
    enabled: Boolean(prev.enabled),
    message: String(document.getElementById('maintenanceMessage')?.value || prev.message || 'Hayatımız Oyun kısa süreli bakımda.'),
    eta: String(document.getElementById('maintenanceEta')?.value || prev.eta || ''),
    progress,
    percent: progress,
    updates: notesText,
    notesText,
    publicNotes: notesText ? notesText.split(/\n+/).map(x=>x.trim()).filter(Boolean) : []
  };
}
function ho240f29MaintenanceNotes(){
  const m = state.maintenance || {};
  const raw = m.notesText || m.updates || m.notes || (Array.isArray(m.publicNotes) ? m.publicNotes.join('\n') : '') || 'Oyun arşivi kontrol ediliyor.\nSeri sıralama ve izleme akışı düzenleniyor.\nBakım tamamlanınca site tekrar açılacak.';
  return String(raw).split(/\n+/).map(x=>x.trim()).filter(Boolean).slice(0,8);
}
function ho240f29MaintenancePreview(m = state.maintenance || {}){
  const p = ho240f29ClampPercent(m.progress ?? m.percent ?? 65);
  const notes = ho240f29MaintenanceNotes();
  return `<div class="ho240f29MaintPreview"><div class="ho240f29MaintTop"><span class="eyebrow">Kullanıcı Önizlemesi</span><h2>Hayatımız Oyun güncelleniyor.</h2><p>${esc(m.message || 'Site kısa süreli bakımda.')}</p>${m.eta?`<small>Tahmini açılış: ${esc(m.eta)}</small>`:''}</div><div class="progressLine large"><span style="width:${p}%"></span></div><b>%${p} tamamlandı</b><div class="maintenancePublicNotes">${notes.map(n=>`<span>${esc(n)}</span>`).join('')}</div></div>`;
}
try{
  maintenancePage = function(){
    const m = state.maintenance || {};
    const p = ho240f29ClampPercent(m.progress ?? m.percent ?? 65);
    const notes = ho240f29MaintenanceNotes();
    return `<section class="fix11MaintenancePublic ho240f29MaintenancePublic"><div class="fix11MaintenanceBg"><img src="${typeof FIX11_COVER !== 'undefined' ? FIX11_COVER : '/assets/hayatimiz-kapak.png'}" alt="Hayatımız Oyun Kapak"></div><div class="fix11MaintenanceCard ho240f29MaintenanceCard"><img class="fix11MaintenanceLogo" src="${typeof FIX11_LOGO !== 'undefined' ? FIX11_LOGO : '/assets/hayatimiz-logo.png'}" alt="Hayatımız Oyun"><span class="eyebrow">Bakım Modu</span><h1>Hayatımız Oyun güncelleniyor.</h1><p>${esc(m.message || 'Site kısa süreli profesyonel bakımda. Güncelleme tamamlanınca arşiv tekrar açılacak.')}</p><div class="ho240f29Progress"><b>%${p}</b><div class="progressLine large"><span style="width:${p}%"></span></div></div>${m.eta?`<div class="maintenanceEta"><span>Tahmini açılış</span><b>${esc(m.eta)}</b></div>`:''}<div class="maintenancePublicNotes ho240f29Notes"><b>Güncelleme Notları</b>${notes.map(n=>`<span>${esc(n)}</span>`).join('')}</div><div class="authButtons"><button class="btn primary" data-action="open-login">Yetkili Girişi</button>${isStaff()?'<button class="btn" data-admin="Bakım Modu">Yönetim Paneli</button>':''}</div></div></section>`;
  };
  maintenanceAdmin = function(){
    const m = state.maintenance || {};
    const p = ho240f29ClampPercent(m.progress ?? m.percent ?? 65);
    const notes = ho240f29MaintenanceNotes().join('\n');
    return `<section class="ho240f29MaintenanceAdmin"><div class="card wide ho240Hero"><div><span class="eyebrow">${HO240F29_INTERNAL_VERSION}</span><h1>Bakım Modu Kontrol Merkezi</h1><p class="muted">Bakım aç/kapat, mesaj, yüzde ve notlar artık tek yerden stabil kaydedilir. Yetkililer bakım açıkken panele erişebilir.</p></div><div class="rowActions"><span class="pill ${m.enabled?'banned':'green'}">${m.enabled?'Bakım açık':'Bakım kapalı'}</span><button class="btn ${m.enabled?'danger':'primary'}" data-action="toggle-maintenance">${m.enabled?'Bakımı Kapat':'Bakımı Aç'}</button></div></div><section class="card wide"><div class="ho240f29MaintGrid"><div><label class="field">Bakım mesajı<input id="maintenanceMessage" value="${esc(m.message || 'Hayatımız Oyun kısa süreli bakımda.')}"></label><label class="field">Tahmini açılış zamanı<input id="maintenanceEta" placeholder="Örn: 25.05.2026 22:30" value="${esc(m.eta || '')}"></label><label class="field">Tamamlanma yüzdesi<input id="maintenanceProgress" type="number" min="0" max="100" value="${p}"></label><label class="field">Güncelleme notları<textarea id="maintenanceNotesText" rows="7" placeholder="Her satıra bir not yaz">${esc(notes)}</textarea></label><div class="rowActions"><button class="btn primary" data-action="save-maintenance-settings">Bakım Ayarlarını Kaydet</button><button class="btn" data-action="preview-maintenance-only">Önizlemeyi Yenile</button><button class="btn danger" data-action="maintenance-reset-safe">Bakım Verisini Sıfırla</button></div><p class="note">Kaydetmeden sadece önizleme yenilersen Supabase’e yazmaz. Bakımı aç/kapat butonu ayrıca durumu kaydeder.</p></div>${ho240f29MaintenancePreview(m)}</div></section></section>`;
  };
  toggleMaintenance = async function(){
    const next = ho240f29ReadMaintenanceForm();
    next.enabled = !Boolean(state.maintenance?.enabled);
    state.maintenance = next;
    try{ localStorage.setItem(MAINTENANCE_KEY, JSON.stringify(state.maintenance)); }catch{}
    try{ await api('settings-set', { adminToken: state.session?.adminToken, maintenance: state.maintenance }); setToast(state.maintenance.enabled ? 'Bakım modu açıldı ve Supabase’e kaydedildi.' : 'Bakım modu kapatıldı ve Supabase’e kaydedildi.'); }
    catch(err){ setToast('Bakım local değişti; Supabase kaydı başarısız: ' + err.message); }
    render();
  };
}catch(error){ console.warn('FIX29 bakım override uygulanamadı:', error); }

function ho240f29SeriesGroups(){
  const groups = sortedSeriesGroups((Array.isArray(state.games)?state.games:[]).filter(g=>String(g.seriesName||'').trim() || Number(g.eps||0)>0));
  return groups.sort((a,b)=>a.name.localeCompare(b.name,'tr'));
}
function ho240f29SeriesButton(group, active){
  const done = group.items.filter(g=>Number(g.eps||0)>0 && Number(g.watchedEps||0)>=Number(g.eps||0)).length;
  return `<button class="ho240f29SeriesTab ${active===group.name?'active':''}" data-series-tab="${esc(group.name)}"><b>${esc(group.name)}</b><small>${group.items.length} oyun • ${done} tamam</small></button>`;
}
try{
  adminSeriesWatchPanel = function(){
    const groups = ho240f29SeriesGroups();
    if(!groups.length) return `<section class="card wide"><h2>Seri Sıralama</h2><p class="muted">Seri bilgisi olan oyun bulunamadı.</p></section>`;
    const activeName = groups.some(g=>g.name===state.activeSeriesName) ? state.activeSeriesName : groups[0].name;
    state.activeSeriesName = activeName;
    const group = groups.find(g=>g.name===activeName) || groups[0];
    const totalEpisodes = group.items.reduce((a,g)=>a+Number(g.eps||seriesEpisodes(g).length||0),0);
    return `<section class="card wide adminSeriesWatch ho240f29SeriesPanel"><div class="sectionHead"><div><span class="eyebrow">Seri Sıralama</span><h2>Seriler Üstte, Detay Aşağıda</h2><p class="muted">Üstten seriye tıkla; o serinin oyunları ve sıralama alanı aşağıda açılır. Sıra numaralarını değiştirince kalıcı kayıt için Kaydet’e bas.</p></div><div class="rowActions"><button class="btn primary" data-action="save-series-orders">Seri Sırasını Kaydet</button><button class="btn" data-action="bulk-playlist-sync">Toplu Playlist Senkronizasyonu</button></div></div><div class="ho240f29SeriesTabs">${groups.map(g=>ho240f29SeriesButton(g, activeName)).join('')}</div><section class="ho240f29SeriesDetail"><div class="ho240f29SeriesDetailHead"><div><h3>${esc(group.name)}</h3><p class="muted">${group.items.length} oyun • ${totalEpisodes} bölüm • tıklanan seri aşağıda listeleniyor.</p></div><span class="pill green">${progressPercent(group.items[0] || {})}% ilk oyun</span></div><div class="seriesMiniList ho240f29SeriesRows">${group.items.map((g,i)=>`<div class="ho240f29SeriesRow"><span>${i+1}</span><img src="${esc(coverFor(g))}" alt="${esc(g.title)}" onerror="this.style.display='none'"><b>${esc(g.title)}</b><small>${esc(g.status || 'Devam Ediyor')} • ${progressPercent(g)}%</small><label>Sıra <input data-series-order-game="${esc(g.id)}" type="number" min="0" value="${esc(String(g.seriesOrder || i+1))}"></label><button class="miniBtn" data-watch-series="${esc(g.id)}">Sitede İzle</button><button class="miniBtn" data-game-edit="${esc(g.id)}">Düzenle</button></div>`).join('')}</div></section></section>`;
  };
}catch(error){ console.warn('FIX29 seri panel override uygulanamadı:', error); }

function ho240f29MapRequest(row){
  return {
    id:String(row.id || row.request_id || `req-${Date.now()}-${Math.random()}`),
    gameTitle:String(row.gameTitle || row.game_title || row.title || '').trim(),
    seriesName:String(row.seriesName || row.series_name || ''),
    note:String(row.note || row.description || ''),
    email:String(row.email || row.requester_email || ''),
    status:String(row.status || 'Yeni'),
    adminNote:String(row.adminNote || row.admin_note || ''),
    createdAt:ho240f29DateTR(row.createdAt || row.created_at || ''),
    source:'Supabase'
  };
}
function ho240f29MapBug(row){
  return {
    id:String(row.id || row.report_id || `bug-${Date.now()}-${Math.random()}`),
    title:String(row.title || '').trim(),
    page:String(row.page || row.page_name || ''),
    description:String(row.description || ''),
    email:String(row.email || row.reporter_email || ''),
    status:String(row.status || 'Yeni'),
    adminNote:String(row.adminNote || row.admin_note || ''),
    solutionNote:String(row.solutionNote || row.solution_note || row.admin_note || ''),
    createdAt:ho240f29DateTR(row.createdAt || row.created_at || ''),
    source:'Supabase'
  };
}
function ho240f29MergeById(local, remote){
  const map = new Map();
  [...(remote||[]), ...(local||[])].forEach(item=>{
    const key = String(item.id || `${item.gameTitle||item.title}:${item.email}:${item.createdAt}`);
    map.set(key, { ...(map.get(key)||{}), ...item });
  });
  return Array.from(map.values()).sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||'')));
}
async function ho240f29LoadFeedback(type='all', doRender=true){
  state.feedbackCache = state.feedbackCache || { requests:null, bugs:null, loading:false, error:'' };
  state.feedbackCache.loading = true;
  state.feedbackCache.error = '';
  if(doRender) render();
  try{
    if(type === 'all' || type === 'requests'){
      const data = await api('game-requests-list', { adminToken: state.session?.adminToken });
      const remote = (data.requests || []).map(ho240f29MapRequest).filter(x=>x.gameTitle);
      const merged = ho240f29MergeById(fix8LocalList(FIX8_REQUESTS_KEY), remote);
      fix8SaveLocal(FIX8_REQUESTS_KEY, merged);
      state.feedbackCache.requests = merged;
    }
    if(type === 'all' || type === 'bugs'){
      const data = await api('bug-reports-list', { adminToken: state.session?.adminToken });
      const remote = (data.reports || []).map(ho240f29MapBug).filter(x=>x.title);
      const merged = ho240f29MergeById(fix8LocalList(FIX8_BUGS_KEY), remote);
      fix8SaveLocal(FIX8_BUGS_KEY, merged);
      state.feedbackCache.bugs = merged;
    }
    setToast(type === 'bugs' ? 'Supabase hata bildirimleri çekildi.' : type === 'requests' ? 'Supabase oyun istekleri çekildi.' : 'Supabase istek ve hata kayıtları çekildi.');
  }catch(err){
    state.feedbackCache.error = err.message || 'Supabase kayıtları çekilemedi.';
    setToast('Supabase çekme hatası: ' + state.feedbackCache.error);
  }finally{
    state.feedbackCache.loading = false;
    if(doRender) render();
  }
}
try{
  adminGameRequestsPageFix8 = function(){
    const list = (typeof v222FilterRows === 'function') ? v222FilterRows(fix8LocalList(FIX8_REQUESTS_KEY), 'request') : fix8LocalList(FIX8_REQUESTS_KEY);
    const loading = state.feedbackCache?.loading;
    const err = state.feedbackCache?.error;
    return `<section class="v221FeedbackAdmin v222FeedbackAdmin ho240f29FeedbackAdmin"><div class="card wide fix10FeedbackHead"><div><span class="eyebrow">Supabase Bağlı İstek Merkezi</span><h2>Oyun İstekleri</h2><p class="muted">Kullanıcı istekleri local kayıt + Supabase tablosundan birlikte çekilir. Açılmazsa Yenile butonuna bas.</p>${err?`<p class="alert">${esc(err)}</p>`:''}</div><div class="rowActions"><span class="pill green">${list.length} kayıt</span><button class="btn primary" data-action="fix29-load-feedback-requests">${loading?'Çekiliyor...':'Supabase’den Yenile'}</button></div></div>${typeof v222ReportFilterTabs==='function'?v222ReportFilterTabs('request'):''}<div class="v221FeedbackGrid">${list.map(r=>`<article><div class="v221FeedbackIcon">💡</div><div class="v221FeedbackContent"><h3>${esc(r.gameTitle)}</h3><small>${esc(r.seriesName||'Seri yok')} • ${esc(r.email||'Anonim')} • ${esc(r.createdAt||'')}</small><p>${esc(r.note||'Not yok')}</p>${r.source?`<span class="pill">${esc(r.source)}</span>`:''}</div><div class="v221FeedbackActions">${typeof v221FeedbackStatusSelect==='function'?v221FeedbackStatusSelect(r,'request'):''}<textarea data-v221-feedback-note="request:${esc(r.id)}" placeholder="Yetkili notu...">${esc(r.adminNote || '')}</textarea><button class="miniBtn primary" data-v221-feedback-save="request:${esc(r.id)}">Kaydet</button></div></article>`).join('') || '<p class="muted">Oyun isteği yok. Supabase’den Yenile ile kontrol edebilirsin.</p>'}</div></section>`;
  };
  adminBugReportsPageFix8 = function(){
    const list = (typeof v222FilterRows === 'function') ? v222FilterRows(fix8LocalList(FIX8_BUGS_KEY), 'bug') : fix8LocalList(FIX8_BUGS_KEY);
    const loading = state.feedbackCache?.loading;
    const err = state.feedbackCache?.error;
    return `<section class="v221FeedbackAdmin v222FeedbackAdmin ho240f29FeedbackAdmin"><div class="card wide fix10FeedbackHead bug"><div><span class="eyebrow">Supabase Bağlı Hata Merkezi</span><h2>Hata Bildirimleri</h2><p class="muted">Kullanıcı hata bildirimleri Supabase’den çekilir, durum ve çözüm notları panelden güncellenir.</p>${err?`<p class="alert">${esc(err)}</p>`:''}</div><div class="rowActions"><span class="pill banned">${list.length} kayıt</span><button class="btn primary" data-action="fix29-load-feedback-bugs">${loading?'Çekiliyor...':'Supabase’den Yenile'}</button></div></div>${typeof v222ReportFilterTabs==='function'?v222ReportFilterTabs('bug'):''}<div class="v221FeedbackGrid bug">${list.map(r=>`<article><div class="v221FeedbackIcon">🐞</div><div class="v221FeedbackContent"><h3>${esc(r.title)}</h3><small>${esc(r.page||'Sayfa yok')} • ${esc(r.email||'Anonim')} • ${esc(r.createdAt||'')}</small><p>${esc(r.description||'Detay yok')}</p>${r.source?`<span class="pill">${esc(r.source)}</span>`:''}</div><div class="v221FeedbackActions">${typeof v221FeedbackStatusSelect==='function'?v221FeedbackStatusSelect(r,'bug'):''}<textarea data-v221-feedback-note="bug:${esc(r.id)}" placeholder="Çözüm notu...">${esc(r.solutionNote || r.adminNote || '')}</textarea><button class="miniBtn primary" data-v221-feedback-save="bug:${esc(r.id)}">Kaydet</button></div></article>`).join('') || '<p class="muted">Hata bildirimi yok. Supabase’den Yenile ile kontrol edebilirsin.</p>'}</div></section>`;
  };
}catch(error){ console.warn('FIX29 feedback sayfaları kurulamadı:', error); }

try{
  persistGameDraft = function(){ try{ localStorage.removeItem(GAME_FORM_DRAFT_KEY); }catch{} };
  clearGameDraft = function(){ state.gameDraft = { ...DEFAULT_GAME_DRAFT }; try{ localStorage.removeItem(GAME_FORM_DRAFT_KEY); }catch{} };
  saveGameDraftFromForm = function(form){
    if(!form) return;
    const patch = { ...DEFAULT_GAME_DRAFT, ...readGameDraftFromForm(form) };
    if(form.id === 'gameEditForm' && state.editingGameId){
      state.editGameDraftSnapshots = state.editGameDraftSnapshots || {};
      state.editGameDraftSnapshots[String(state.editingGameId)] = { ...(state.editGameDraftSnapshots[String(state.editingGameId)] || {}), ...patch };
    }else{
      state.gameDraft = { ...DEFAULT_GAME_DRAFT, ...patch };
    }
    try{ localStorage.removeItem(GAME_FORM_DRAFT_KEY); }catch{}
  };
  updateOpenGameFormSnapshot = function(form){
    if(!form) return;
    const draft = readGameDraftFromForm(form);
    const episodes = parseEpisodesText(draft.episodesText);
    const patch = { ...draft, episodes, eps:Number(draft.eps || episodes.length || 0), watchedEps:Number(draft.watchedEps || 0) };
    if(form.id === 'gameEditForm' && state.editingGameId){
      state.editGameDraftSnapshots = state.editGameDraftSnapshots || {};
      state.editGameDraftSnapshots[String(state.editingGameId)] = { ...(state.editGameDraftSnapshots[String(state.editingGameId)] || {}), ...patch };
    }else{
      state.gameDraft = { ...DEFAULT_GAME_DRAFT, ...state.gameDraft, ...patch };
    }
    try{ localStorage.removeItem(GAME_FORM_DRAFT_KEY); }catch{}
  };
  ho240f10CaptureForm = function(form){
    if(!form) return;
    const patch = readGameDraftFromForm(form);
    if(form.id === 'gameEditForm' && state.editingGameId){
      state.editGameDraftSnapshots = state.editGameDraftSnapshots || {};
      state.editGameDraftSnapshots[String(state.editingGameId)] = { ...(state.editGameDraftSnapshots[String(state.editingGameId)] || {}), ...patch };
    }else{
      state.gameDraft = { ...DEFAULT_GAME_DRAFT, ...state.gameDraft, ...patch };
    }
    try{ localStorage.removeItem(GAME_FORM_DRAFT_KEY); }catch{}
  };
  gameAddForm = function(){
    const d = { ...DEFAULT_GAME_DRAFT, ...(state.gameDraft || {}) };
    return `<form class="card soft gameForm fix26GameForm ho240f29NoAutoSaveForm" id="gameAddForm" autocomplete="off">${ho240f26FormFields(d,'add')}<p class="note ho240f29SaveNote">Bu form otomatik kayıt yapmaz. Oyun yalnızca <b>Oyunu Kaydet</b> butonuna basınca Supabase’e gider.</p></form>`;
  };
  gameEditForm = function(){
    const current = (Array.isArray(state.games)?state.games:[]).find(g=>String(g.id)===String(state.editingGameId));
    if(!current) return '';
    const snap = state.editGameDraftSnapshots?.[String(state.editingGameId)] || {};
    return `<form class="card soft gameForm editGameForm fix26GameForm ho240f29NoAutoSaveForm" id="gameEditForm" autocomplete="off">${ho240f26FormFields({ ...current, ...snap },'edit')}<p class="note ho240f29SaveNote">Bu form otomatik kayıt yapmaz. Değişiklikler yalnızca <b>Oyunu Güncelle</b> butonuna basınca kaydedilir.</p></form>`;
  };
  onGameAddSubmit = async function(e){
    e.preventDefault(); ho240f26MarkStableScroll();
    const form = e.currentTarget;
    const game = { ...DEFAULT_GAME_DRAFT, ...readGameDraftFromForm(form) };
    if(!game.title) return setToast('Oyun adı gerekli.');
    if((Array.isArray(state.games)?state.games:[]).some(g => sameTitle(g.title, game.title))) return setToast('Bu oyun zaten kayıtlı. Lütfen Mevcut Oyunlar bölümünden düzenle.');
    try{
      const data = await api('games-add', { adminToken: state.session?.adminToken, game });
      if(!data.game) throw new Error('Supabase kayıt cevabı boş döndü.');
      state.games.unshift(mapGame(data.game));
      clearGameDraft(); state.rawgCandidates=[]; state.coverSuggestions=[]; state.ho240f11CoverCandidates=[]; state.ho240f10CoverCandidates=[];
      try{ localStorage.setItem(FIX8_GAME_TAB_KEY,'add'); }catch{}
      render(); setToast('Oyun kaydedildi. Form temizlendi; otomatik kayıt yapılmadı.');
    }catch(err){ setToast('Oyun kaydedilmedi. Form korunuyor. Supabase/API hatası: ' + err.message); }
  };
  onGameEditSubmit = async function(e){
    e.preventDefault(); ho240f26MarkStableScroll();
    const form = e.currentTarget;
    const id = state.editingGameId;
    const current = (Array.isArray(state.games)?state.games:[]).find(g => String(g.id) === String(id));
    if(!current) return setToast('Düzenlenecek oyun bulunamadı.');
    const patch = { ...current, ...readGameDraftFromForm(form), id: current.id };
    if(!patch.title) return setToast('Oyun adı gerekli.');
    try{
      const data = await api('games-update', { adminToken: state.session?.adminToken, gameId:id, game:patch });
      state.games = state.games.map(g => String(g.id) === String(id) ? (data.game ? mapGame(data.game) : { ...g, ...patch }) : g);
      if(state.editGameDraftSnapshots) delete state.editGameDraftSnapshots[String(id)];
      render(); setToast('Oyun yalnızca Güncelle butonuyla kaydedildi.');
    }catch(err){ setToast('Oyun güncellenmedi. Form korunuyor. Supabase/API hatası: ' + err.message); }
  };
}catch(error){ console.warn('FIX29 oyun form güvenliği uygulanamadı:', error); }

try{
  const ho240f29PrevOnAction = onAction;
  onAction = async function(e){
    const action = e.currentTarget?.dataset?.action || '';
    try{
      if(action === 'fix29-load-feedback-requests'){
        e.preventDefault(); e.stopImmediatePropagation(); await ho240f29LoadFeedback('requests'); return;
      }
      if(action === 'fix29-load-feedback-bugs'){
        e.preventDefault(); e.stopImmediatePropagation(); await ho240f29LoadFeedback('bugs'); return;
      }
      if(action === 'maintenance-reset-safe'){
        e.preventDefault(); e.stopImmediatePropagation();
        state.maintenance = { enabled:false, message:'Hayatımız Oyun kısa süreli bakımda.', eta:'', progress:65, percent:65, updates:'Arşiv bakımı yapılıyor.\nGüncelleme tamamlanınca site açılacak.', notesText:'Arşiv bakımı yapılıyor.\nGüncelleme tamamlanınca site açılacak.' };
        try{ localStorage.setItem(MAINTENANCE_KEY, JSON.stringify(state.maintenance)); await api('settings-set', { adminToken: state.session?.adminToken, maintenance: state.maintenance }); }catch{}
        render(); setToast('Bakım modu güvenli varsayılana sıfırlandı.'); return;
      }
      if(action === 'save-maintenance-settings' || action === 'preview-maintenance-only'){
        e.preventDefault(); e.stopImmediatePropagation();
        state.maintenance = ho240f29ReadMaintenanceForm();
        try{ localStorage.setItem(MAINTENANCE_KEY, JSON.stringify(state.maintenance)); }catch{}
        if(action === 'save-maintenance-settings'){
          try{ await api('settings-set', { adminToken: state.session?.adminToken, maintenance: state.maintenance }); setToast('Bakım ayarları Supabase’e kaydedildi.'); }
          catch(err){ setToast('Bakım local kaydedildi; Supabase hatası: ' + err.message); }
        }else setToast('Bakım önizlemesi yenilendi.');
        render(); return;
      }
      if(action === 'game-admin-tab'){
        const tab = e.currentTarget?.dataset?.tab || '';
        if(tab === 'add'){
          clearGameDraft();
          state.editingGameId = null;
          state.editGameDraftSnapshots = {};
          state.rawgCandidates=[]; state.coverSuggestions=[]; state.ho240f11CoverCandidates=[]; state.ho240f10CoverCandidates=[];
          try{ localStorage.setItem(FIX8_GAME_TAB_KEY,'add'); }catch{}
          e.preventDefault(); e.stopImmediatePropagation(); render(); setToast('Yeni oyun formu temiz açıldı.'); return;
        }
      }
      if(action === 'toggle-game-form'){
        clearGameDraft(); state.editingGameId = null; state.editGameDraftSnapshots = {}; try{ localStorage.setItem(FIX8_GAME_TAB_KEY,'add'); }catch{}
      }
      if(action === 'fix26-clear-game-form'){
        clearGameDraft(); state.editGameDraftSnapshots = {}; try{ localStorage.setItem(FIX8_GAME_TAB_KEY,'add'); }catch{}
      }
      return await ho240f29PrevOnAction(e);
    }catch(err){ console.error(err); setToast('FIX29 işlem hatası: ' + (err.message || err)); }
  };
}catch(error){ console.warn('FIX29 onAction override uygulanamadı:', error); }
try{
  const ho240f29PrevAdminNavigate = adminNavigate;
  adminNavigate = function(page){
    ho240f29PrevAdminNavigate(page);
    if(page === 'Oyun İstekleri') setTimeout(()=>ho240f29LoadFeedback('requests', true), 80);
    if(page === 'Hata Bildirimleri') setTimeout(()=>ho240f29LoadFeedback('bugs', true), 80);
    if(page === 'Oyunlar') { try{ localStorage.removeItem(GAME_FORM_DRAFT_KEY); }catch{} }
  };
}catch(error){ console.warn('FIX29 adminNavigate override uygulanamadı:', error); }
try{
  const ho240f29PrevBind = bind;
  bind = function(){
    ho240f29PrevBind();
    document.querySelectorAll('#gameAddForm,#gameEditForm').forEach(form=>{
      if(form.dataset.ho240f29SafeBound) return;
      form.dataset.ho240f29SafeBound = '1';
      form.addEventListener('input', ()=>{ saveGameDraftFromForm(form); try{ localStorage.removeItem(GAME_FORM_DRAFT_KEY); }catch{} }, true);
      form.addEventListener('change', ()=>{ saveGameDraftFromForm(form); try{ localStorage.removeItem(GAME_FORM_DRAFT_KEY); }catch{} }, true);
    });
  };
}catch(error){ console.warn('FIX29 bind override uygulanamadı:', error); }
try{
  if(Array.isArray(VERSION_NOTES_ARCHIVE) && !VERSION_NOTES_ARCHIVE.some(n=>n.version===HO240F29_INTERNAL_VERSION)){
    VERSION_NOTES_ARCHIVE.unshift({
      version:HO240F29_INTERNAL_VERSION,
      title:'Bakım, Seri Sıralama, Supabase İstek/Hata ve Güvenli Oyun Formu',
      summary:'Bakım modu yeniden stabil hale getirildi; seri sıralama üst sekme + alt detay düzenine alındı; oyun istekleri ve hata bildirimleri Supabase’den yenilenebilir oldu; oyun ekleme/düzenleme formlarında otomatik kayıt kapatıldı.',
      image:'previews/hayatimiz-oyun-v240-fix29-panel-stabil-preview.png',
      written:'FIX29 ile form dolu gelme ve kaydetmeden kayıt olma davranışı kapatıldı. Oyun yalnızca Kaydet/Güncelle butonuyla Supabase’e gönderilir.'
    });
  }
  localStorage.setItem('hayatimiz_last_fix_version', HO240F29_INTERNAL_VERSION);
  if(document.getElementById('root')?.dataset?.mounted === '1') render();
}catch(error){ console.warn('FIX29 final render atlandı:', error); }

/* FIX30 - Kayıt ve buton stabilizasyon katmanı
   Amaç: kayıt listelerindeki Kaydet/Durum butonları, oyun düzenleme/silme,
   bakım kaydı ve form içindeki butonlar hata verse bile ekranı bozmadan çalışsın. */
const HO240F30_INTERNAL_VERSION = 'v2.4.0 FIX 30';
function ho240f30Toast(message){ try{ setToast(message); }catch{ console.log(message); } }
function ho240f30ButtonTypeGuard(){
  try{
    document.querySelectorAll('form button[data-action], form button[data-status-pick], form button[data-v221-feedback-save], form button[data-game-edit], form button[data-game-delete], form button[data-update-delete], form button[data-update-edit]').forEach(btn=>{
      if(!btn.getAttribute('type')) btn.setAttribute('type','button');
    });
  }catch(error){ console.warn('FIX30 button type guard atlandı:', error); }
}
function ho240f30FeedbackKey(type){ return type === 'bug' ? FIX8_BUGS_KEY : FIX8_REQUESTS_KEY; }
function ho240f30ReadFeedback(type){
  try{ return fix8LocalList(ho240f30FeedbackKey(type)); }catch{ return []; }
}
function ho240f30SaveFeedback(type, list){
  try{ fix8SaveLocal(ho240f30FeedbackKey(type), Array.isArray(list) ? list : []); }catch{}
  try{
    state.feedbackCache = state.feedbackCache || {requests:[], bugs:[], loading:false, error:''};
    if(type === 'bug') state.feedbackCache.bugs = Array.isArray(list) ? list : [];
    else state.feedbackCache.requests = Array.isArray(list) ? list : [];
  }catch{}
}
function ho240f30PatchFeedbackLocal(type, id, patch){
  const sid = String(id || '');
  const list = ho240f30ReadFeedback(type).map(row => String(row.id) === sid ? { ...row, ...patch, id: row.id } : row);
  ho240f30SaveFeedback(type, list);
  return list.find(row => String(row.id) === sid) || null;
}
async function ho240f30SaveFeedbackRecord(type, id, patch){
  ho240f30PatchFeedbackLocal(type, id, patch);
  try{
    const action = type === 'bug' ? 'bug-report-update' : 'game-request-update';
    await api(action, { adminToken: state.session?.adminToken, id, ...patch });
    ho240f30Toast(type === 'bug' ? 'Hata kaydı güncellendi.' : 'Oyun isteği kaydı güncellendi.');
  }catch(error){
    ho240f30Toast('Kayıt local güncellendi; Supabase hatası engellendi: ' + (error.message || error));
  }
}
function ho240f30FeedbackSaveHandler(event){
  const btn = event.target?.closest?.('[data-v221-feedback-save]');
  if(!btn) return;
  event.preventDefault(); event.stopImmediatePropagation();
  const [typeRaw, idRaw] = String(btn.dataset.v221FeedbackSave || '').split(':');
  const type = typeRaw === 'bug' ? 'bug' : 'request';
  const id = idRaw || '';
  const box = btn.closest('article') || document;
  const note = box.querySelector('[data-v221-feedback-note]')?.value || '';
  const patch = type === 'bug' ? { solutionNote: note, adminNote: note } : { adminNote: note };
  ho240f30SaveFeedbackRecord(type, id, patch).finally(()=>{ try{ render(); }catch{} });
}
function ho240f30FeedbackStatusHandler(event){
  const sel = event.target?.closest?.('[data-v221-feedback-status]');
  if(!sel) return;
  event.preventDefault(); event.stopImmediatePropagation();
  const [typeRaw, idRaw] = String(sel.dataset.v221FeedbackStatus || '').split(':');
  const type = typeRaw === 'bug' ? 'bug' : 'request';
  const id = idRaw || '';
  ho240f30SaveFeedbackRecord(type, id, { status: sel.value || 'Yeni' }).finally(()=>{ try{ render(); }catch{} });
}
function ho240f30StatusClick(event){
  const btn = event.target?.closest?.('[data-status-pick],[data-v223-status]');
  if(!btn) return;
  const form = btn.closest('form');
  if(!form) return;
  const status = btn.dataset.statusPick || btn.dataset.v223Status || '';
  if(!status) return;
  event.preventDefault(); event.stopImmediatePropagation();
  try{
    const select = form.elements?.status;
    if(select){ select.value = status; select.dispatchEvent(new Event('change', { bubbles:true })); }
    const patch = { ...readGameDraftFromForm(form), status };
    if(form.id === 'gameEditForm' && state.editingGameId){
      state.editGameDraftSnapshots = state.editGameDraftSnapshots || {};
      state.editGameDraftSnapshots[String(state.editingGameId)] = { ...(state.editGameDraftSnapshots[String(state.editingGameId)] || {}), ...patch };
    }else{
      state.gameDraft = { ...DEFAULT_GAME_DRAFT, ...(state.gameDraft || {}), ...patch };
    }
    try{ localStorage.removeItem(GAME_FORM_DRAFT_KEY); }catch{}
    ho240f30Toast(`Durum ${status} seçildi. Kayıt sadece Kaydet/Güncelle butonuyla yapılır.`);
    render();
  }catch(error){ ho240f30Toast('Durum butonu hatası düzeltildi: ' + (error.message || error)); }
}
async function ho240f30EditGameById(id){
  const current = (Array.isArray(state.games) ? state.games : []).find(g => String(g.id) === String(id));
  if(!current) return ho240f30Toast('Düzenlenecek oyun bulunamadı.');
  state.editingGameId = id;
  state.editGameDraftSnapshots = state.editGameDraftSnapshots || {};
  state.editGameDraftSnapshots[String(id)] = { ...current };
  state.rawgCandidates=[]; state.coverSuggestions=[]; state.ho240f11CoverCandidates=[]; state.ho240f10CoverCandidates=[];
  try{ localStorage.setItem(FIX8_GAME_TAB_KEY, 'edit'); }catch{}
  render(); ho240f30Toast('Oyun düzenleme formu stabil açıldı.');
}
async function ho240f30DeleteGameById(id){
  const current = (Array.isArray(state.games) ? state.games : []).find(g => String(g.id) === String(id));
  if(!current) return ho240f30Toast('Silinecek oyun bulunamadı.');
  if(!confirm(`${current.title} silinsin mi?`)) return;
  const before = Array.isArray(state.games) ? [...state.games] : [];
  state.games = before.filter(g => String(g.id) !== String(id));
  render();
  try{ await api('games-delete', { adminToken: state.session?.adminToken, gameId:id }); ho240f30Toast('Oyun silindi.'); }
  catch(error){ state.games = before; render(); ho240f30Toast('Silme iptal edildi; Supabase/API hatası: ' + (error.message || error)); }
}
function ho240f30GameButtonHandler(event){
  const edit = event.target?.closest?.('[data-game-edit]');
  const del = event.target?.closest?.('[data-game-delete]');
  if(!edit && !del) return;
  event.preventDefault(); event.stopImmediatePropagation();
  if(edit) ho240f30EditGameById(edit.dataset.gameEdit);
  if(del) ho240f30DeleteGameById(del.dataset.gameDelete);
}
function ho240f30InstallGlobalGuards(){
  try{ if(typeof ho240f18HandleStatusClick === 'function') document.removeEventListener('click', ho240f18HandleStatusClick, true); }catch{}
  try{ ho240f18HandleStatusClick = ho240f30StatusClick; }catch{}
  if(document.documentElement.dataset.ho240f30Guards === '1') return;
  document.documentElement.dataset.ho240f30Guards = '1';
  document.addEventListener('click', ho240f30FeedbackSaveHandler, true);
  document.addEventListener('change', ho240f30FeedbackStatusHandler, true);
  document.addEventListener('click', ho240f30StatusClick, true);
  document.addEventListener('click', ho240f30GameButtonHandler, true);
  document.addEventListener('click', event=>{
    const btn = event.target?.closest?.('button');
    if(btn && btn.closest('form') && btn.dataset && Object.keys(btn.dataset).length && !btn.getAttribute('type')) btn.setAttribute('type','button');
  }, true);
}
try{
  ho240f30InstallGlobalGuards();
  const ho240f30PrevBind = bind;
  bind = function(){
    try{ ho240f30PrevBind(); }catch(error){ console.error('FIX30 önceki bind hatası yakalandı:', error); ho240f30Toast('Buton bağlama hatası yakalandı; güvenli mod aktif.'); }
    ho240f30ButtonTypeGuard();
    document.querySelectorAll('[data-v221-feedback-save]').forEach(btn=>{ if(!btn.dataset.ho240f30Bound){ btn.dataset.ho240f30Bound='1'; btn.addEventListener('click', ho240f30FeedbackSaveHandler, true); } });
    document.querySelectorAll('[data-v221-feedback-status]').forEach(sel=>{ if(!sel.dataset.ho240f30Bound){ sel.dataset.ho240f30Bound='1'; sel.addEventListener('change', ho240f30FeedbackStatusHandler, true); } });
    document.querySelectorAll('[data-status-pick],[data-v223-status]').forEach(btn=>{ if(!btn.dataset.ho240f30Bound){ btn.dataset.ho240f30Bound='1'; btn.addEventListener('click', ho240f30StatusClick, true); } });
    document.querySelectorAll('[data-game-edit],[data-game-delete]').forEach(btn=>{ if(!btn.dataset.ho240f30Bound){ btn.dataset.ho240f30Bound='1'; btn.addEventListener('click', ho240f30GameButtonHandler, true); } });
  };
}catch(error){ console.warn('FIX30 güvenli bind kurulamadı:', error); }
try{
  if(Array.isArray(VERSION_NOTES_ARCHIVE) && !VERSION_NOTES_ARCHIVE.some(n=>n.version===HO240F30_INTERNAL_VERSION)){
    VERSION_NOTES_ARCHIVE.unshift({
      version:HO240F30_INTERNAL_VERSION,
      title:'Kayıt ve Buton Stabilizasyonu',
      summary:'Oyun istekleri, hata bildirimleri, oyun düzenle/sil ve form içi butonlarda oluşan hata zinciri engellendi. Kayıtlar local korunur, Supabase hata verse bile panel bozulmaz.',
      image:'previews/hayatimiz-oyun-v240-fix30-kayit-buton-stabil.png',
      written:'FIX30 ile kayıt kaydetme, durum değiştirme, oyun düzenleme/silme ve form içi butonlar güvenli yakalama katmanına alındı.'
    });
  }
  try{ localStorage.setItem('hayatimiz_last_fix_version', HO240F30_INTERNAL_VERSION); }catch{}
  if(document.getElementById('root')?.dataset?.mounted === '1') render();
}catch(error){ console.warn('FIX30 final render atlandı:', error); }


/* FIX31 - Oyun listesi kaybolmasın / Supabase fallback cache
   Amaç: Supabase kolon farkı, geçici API hatası veya boş response yüzünden oyun arşivinin sıfırlanmasını engellemek. */
const HO240F31_INTERNAL_VERSION = 'v2.4.0 FIX 31';
function ho240f31InstallGamePersistence(){
  try{
    const current = ho240f31NormalizeGames(state.games);
    if(current.length) ho240f31SaveGamesCache(current);
  }catch{}
}
try{
  const ho240f31PrevRender = render;
  render = function(){
    try{ ho240f31InstallGamePersistence(); }catch{}
    return ho240f31PrevRender();
  };
}catch(error){ console.warn('FIX31 render cache koruması kurulamadı:', error); }
try{
  const ho240f31PrevLoadRuntime = loadRuntime;
  loadRuntime = async function(){
    const before = ho240f31NormalizeGames(state.games);
    if(before.length) ho240f31SaveGamesCache(before);
    await ho240f31PrevLoadRuntime();
    const after = ho240f31NormalizeGames(state.games);
    if(after.length){
      state.games = after;
      ho240f31SaveGamesCache(after);
    }else{
      const safe = before.length ? before : ho240f31LoadGamesCache();
      if(safe.length){
        state.games = safe;
        render();
        setToast('Oyun listesi Supabase/API hatasına karşı cache üzerinden geri yüklendi.');
      }
    }
  };
}catch(error){ console.warn('FIX31 loadRuntime cache koruması kurulamadı:', error); }
try{
  const ho240f31PrevApi = api;
  api = async function(action, payload = {}){
    const result = await ho240f31PrevApi(action, payload);
    try{
      if(['games-add','games-update','games-delete','episode-progress-save'].includes(action)){
        setTimeout(()=>ho240f31SaveGamesCache(state.games), 0);
      }
      if(action === 'games-list' && Array.isArray(result.games) && result.games.length){
        ho240f31SaveGamesCache(result.games);
      }
    }catch{}
    return result;
  };
}catch(error){ console.warn('FIX31 api cache koruması kurulamadı:', error); }
try{
  if(Array.isArray(VERSION_NOTES_ARCHIVE) && !VERSION_NOTES_ARCHIVE.some(n=>n.version===HO240F31_INTERNAL_VERSION)){
    VERSION_NOTES_ARCHIVE.unshift({
      version:HO240F31_INTERNAL_VERSION,
      title:'Oyun Listesi Geri Geldi ve Koruma Eklendi',
      summary:'Supabase geçici hata, kolon farkı veya boş response verse bile mevcut oyunlar silinmez; son sağlam oyun listesi local cache ile korunur.',
      image:'previews/hayatimiz-oyun-v240-fix31-oyun-listesi-koruma.png',
      written:'FIX31 ile games-list endpointi ve ön yüz oyun cache sistemi güçlendirildi. Oyunlar kaybolmuş gibi görünse bile son sağlam kayıtlar geri yüklenir.'
    });
  }
  try{ localStorage.setItem('hayatimiz_last_fix_version', HO240F31_INTERNAL_VERSION); }catch{}
  ho240f31InstallGamePersistence();
  if(document.getElementById('root')?.dataset?.mounted === '1') render();
}catch(error){ console.warn('FIX31 final oyun koruma atlandı:', error); }


/* v2.4.0 FIX 33 - Oyun adı kilidi: Meta/Kapak çek yanlış oyuna sapmasın */
const HO240F33_INTERNAL_VERSION = 'v2.4.0 FIX 33';
function ho240f33Norm(value=''){
  return String(value || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/['’`´]/g,' ')
    .replace(/&/g,' and ')
    .replace(/[^a-z0-9]+/g,' ')
    .replace(/\s+/g,' ')
    .trim();
}
function ho240f33Tokens(value=''){
  return ho240f33Norm(value).split(' ').filter(Boolean).filter(t=>!['the','a','an','of','and','edition','remastered','remaster'].includes(t));
}
function ho240f33Numbers(value=''){
  return new Set((ho240f33Norm(value).match(/\b\d+\b/g) || []));
}
function ho240f33CandidateScore(query='', candidate=''){
  const q = ho240f33Norm(query);
  const c = ho240f33Norm(candidate);
  if(!q || !c) return 0;
  if(q === c) return 100;
  const qNums = ho240f33Numbers(q);
  const cNums = ho240f33Numbers(c);
  for(const n of cNums){ if(!qNums.has(n)) return 0; }
  for(const n of qNums){ if(!cNums.has(n)) return 0; }
  if(c.includes(q)) return 92;
  const qt = ho240f33Tokens(q);
  const ct = new Set(ho240f33Tokens(c));
  if(!qt.length) return 0;
  const hits = qt.filter(t=>ct.has(t)).length;
  const ratio = hits / qt.length;
  if(ratio === 1){
    const extra = Math.max(0, ct.size - qt.length);
    return Math.max(76, 88 - extra * 4);
  }
  return Math.round(ratio * 70);
}
function ho240f33StrictCandidate(query='', candidate={}){
  const score = ho240f33CandidateScore(query, candidate.title || candidate.name || '');
  return score >= 76 ? { ...candidate, matchScore:score } : null;
}
function ho240f33KnownMeta(title=''){
  try{
    if(typeof ho240f14Meta === 'function'){
      const m = ho240f14Meta(title);
      const score = m ? ho240f33CandidateScore(title, m.title || title) : 0;
      if(m && score >= 76) return { ...m, matchScore:score, source:'FIX33 kesin yerel eşleşme' };
    }
  }catch{}
  try{
    if(typeof ho240Fix7Meta === 'function'){
      const m = ho240Fix7Meta(title);
      if(m && ho240f33CandidateScore(title, m.title || title) >= 76) return { ...m, matchScore:95, source:'FIX33 güvenli yerel eşleşme' };
    }
  }catch{}
  return null;
}
function ho240f33LocalCandidates(title=''){
  try{
    if(typeof ho240f14Candidates === 'function') return (ho240f14Candidates(title) || [])
      .map(c=>ho240f33StrictCandidate(title, c))
      .filter(Boolean)
      .map(c=>({ ...c, source:c.source || 'FIX33 kesin katalog' }));
  }catch{}
  return [];
}
function ho240f33DedupCandidates(list=[]){
  const seen = new Set();
  return (list || []).filter(c=>{
    const cover = String(c?.cover || c?.cover_url || '').trim();
    if(!cover) return false;
    if(typeof ho240f10BadCover === 'function' && ho240f10BadCover(cover)) return false;
    const id = cover.toLowerCase();
    if(seen.has(id)) return false;
    seen.add(id);
    return true;
  }).sort((a,b)=>(Number(b.matchScore||0)-Number(a.matchScore||0))).slice(0,20);
}
async function ho240f33ApiCandidates(title=''){
  const query = String(title || '').trim();
  const exactLocal = ho240f33LocalCandidates(query);
  const out = [...exactLocal];
  try{
    const data = await api('game-meta', { adminToken:state.session?.adminToken, title:query, strictTitle:true });
    const meta = data?.meta || {};
    const metaStrict = ho240f33StrictCandidate(query, meta);
    if(metaStrict?.cover){
      out.push({
        title:metaStrict.title || query,
        seriesName:metaStrict.seriesName || metaStrict.series_name || '',
        releaseDate:typeof ho240f10Date === 'function' ? ho240f10Date(metaStrict.releaseDate || metaStrict.released || '') : (metaStrict.releaseDate || metaStrict.released || ''),
        genre:metaStrict.genre || '',
        score:metaStrict.score || 8.5,
        cover:metaStrict.cover,
        description:metaStrict.description || metaStrict.story || '',
        matchScore:metaStrict.matchScore,
        source:'API kesin eşleşme'
      });
    }
    (data?.candidates || []).forEach(c=>{
      const strict = ho240f33StrictCandidate(query, c);
      if(!strict) return;
      out.push({
        title:strict.title || meta.title || query,
        seriesName:strict.seriesName || strict.series_name || meta.seriesName || '',
        releaseDate:typeof ho240f10Date === 'function' ? ho240f10Date(strict.releaseDate || strict.released || meta.releaseDate || meta.released || '') : (strict.releaseDate || strict.released || ''),
        genre:strict.genre || meta.genre || '',
        score:strict.score || meta.score || 8.5,
        cover:strict.cover || strict.cover_url || '',
        description:strict.description || meta.description || '',
        matchScore:strict.matchScore,
        source:'RAWG kesin filtre'
      });
    });
  }catch(err){ console.warn('FIX33 API adayları alınamadı:', err); }
  return ho240f33DedupCandidates(out);
}
function ho240f33ApplyMetaToForm(form, meta, keepCover=false){
  if(!form || !meta) return;
  const current = readGameDraftFromForm(form);
  const patch = {
    title: meta.title || current.title,
    seriesName: meta.seriesName || current.seriesName || '',
    genre: meta.genre || current.genre || '',
    tags: meta.tags || meta.genre || current.tags || '',
    releaseDate: typeof ho240f10Date === 'function' ? ho240f10Date(meta.releaseDate || meta.released || current.releaseDate || '') : (meta.releaseDate || meta.released || current.releaseDate || ''),
    score: meta.score || current.score || 8.5,
    cover: keepCover ? current.cover : (meta.cover || current.cover || ''),
    description: current.description || meta.description || meta.story || (typeof fix12DetailedStory === 'function' ? fix12DetailedStory(meta.title || current.title, meta.genre || current.genre) : '')
  };
  try{ if(typeof ho240f10PatchForm === 'function') ho240f10PatchForm(form, patch); else fix12PatchForm(form, patch); }catch{ try{ fix12PatchForm(form, patch); }catch{} }
  try{ if(typeof ho240f10CaptureForm === 'function') ho240f10CaptureForm(form); else saveGameDraftFromForm(form); }catch{}
}
async function ho240f33MetaFill(form){
  if(!form) return setToast('Oyun formu açık değil.');
  const typed = String(form.elements?.title?.value || '').trim();
  if(!typed) return setToast('Önce oyun adını yaz.');
  const known = ho240f33KnownMeta(typed);
  const candidates = await ho240f33ApiCandidates(typed);
  state.ho240f11CoverCandidates = candidates;
  state.ho240f10CoverCandidates = candidates;
  if(known){
    const cover = candidates[0]?.cover || known.cover || '';
    ho240f33ApplyMetaToForm(form, { ...known, cover });
    render();
    return setToast(`${known.title || typed} için kesin eşleşme bulundu. Yanlış oyun çekilmez.`);
  }
  const best = candidates[0];
  if(best && Number(best.matchScore || 0) >= 76){
    ho240f33ApplyMetaToForm(form, best);
    render();
    return setToast(`${best.title || typed} için güvenli eşleşme forma işlendi.`);
  }
  const genre = typeof v222GenreFromTitle === 'function' ? v222GenreFromTitle(typed) : (typeof fix12GenreFromTitle === 'function' ? fix12GenreFromTitle(typed) : 'Genel, Hikaye odaklı');
  ho240f33ApplyMetaToForm(form, { title:typed, genre, tags:genre, score:8.5, description:typeof fix12DetailedStory === 'function' ? fix12DetailedStory(typed, genre) : '' }, true);
  state.ho240f11CoverCandidates = [];
  state.ho240f10CoverCandidates = [];
  render();
  setToast('Kesin oyun eşleşmesi bulunamadı. Yanlış oyun çekmemek için sadece yerel tür/hikaye dolduruldu. Kapak URL manuel girilebilir.');
}
async function ho240f33FindCovers(form){
  if(!form) return setToast('Önce Oyun Ekle formunu aç.');
  const typed = String(form.elements?.title?.value || '').trim();
  if(!typed) return setToast('Önce oyun adını yaz.');
  try{ if(typeof ho240f10CaptureForm === 'function') ho240f10CaptureForm(form); else saveGameDraftFromForm(form); }catch{}
  const candidates = await ho240f33ApiCandidates(typed);
  state.ho240f11CoverCandidates = candidates;
  state.ho240f10CoverCandidates = candidates;
  if(candidates.length){
    const best = candidates[0];
    ho240f33ApplyMetaToForm(form, { ...best, cover:getFormValue(form,'cover') || best.cover }, false);
    render();
    setToast(`${candidates.length} doğru kapak bulundu. Sadece yazdığın oyun adıyla eşleşen sonuçlar gösteriliyor.`);
  }else{
    render();
    setToast('Bu oyun adı için güvenli kapak bulunamadı. Yanlış oyun getirmemek için liste boş bırakıldı.');
  }
}
try{
  localGameMeta = function(title){ return ho240f33KnownMeta(title) || { title:String(title || '').trim(), genre:'Genel, Hikaye odaklı', released:'', releaseDate:'', score:8.5, cover:'' }; };
}catch{}
try{
  ho240f11FindCovers = ho240f33FindCovers;
  ho240f10MetaFill = ho240f33MetaFill;
  fix12MetaFill = ho240f33MetaFill;
}catch{}
try{
  const ho240f33PrevPickCover = typeof ho240f11PickCover === 'function' ? ho240f11PickCover : null;
  ho240f11PickCover = function(index){
    const form = document.getElementById(state.editingGameId ? 'gameEditForm' : 'gameAddForm') || document.querySelector('form.gameForm');
    const typed = String(form?.elements?.title?.value || '').trim();
    const c = (state.ho240f11CoverCandidates || state.ho240f10CoverCandidates || [])[Number(index)];
    if(!c || !form) return setToast('Kapak seçilemedi.');
    if(typed && !ho240f33StrictCandidate(typed, c)){
      if(form.elements?.cover) form.elements.cover.value = c.cover || '';
      try{ if(typeof ho240f10CaptureForm === 'function') ho240f10CaptureForm(form); else saveGameDraftFromForm(form); }catch{}
      render();
      return setToast('Kapak eklendi ama oyun adı değiştirilmedi; aday adı tam eşleşmedi.');
    }
    ho240f33ApplyMetaToForm(form, c);
    state.rawgCandidates = [];
    setToast('Seçilen doğru kapak forma uygulandı. Kaydetmeden oyun eklenmez.');
    render();
  };
}catch(error){ console.warn('FIX33 kapak seçim kilidi kurulamadı:', error); }
try{
  const ho240f33PrevOnAction = onAction;
  onAction = async function(e){
    const action = e.currentTarget?.dataset?.action || '';
    if(['auto-game-meta','auto-game-meta-edit'].includes(action)){
      e.preventDefault(); e.stopImmediatePropagation();
      if(typeof ho240f26MarkStableScroll === 'function') ho240f26MarkStableScroll();
      const form = e.currentTarget.closest('form') || document.getElementById(action.includes('edit') ? 'gameEditForm' : 'gameAddForm');
      await ho240f33MetaFill(form);
      return;
    }
    if(['ho240f11-find-covers','ho240f10-find-covers','auto-cover-fetch'].includes(action)){
      e.preventDefault(); e.stopImmediatePropagation();
      if(typeof ho240f26MarkStableScroll === 'function') ho240f26MarkStableScroll();
      const form = e.currentTarget.closest('form') || document.getElementById(state.editingGameId ? 'gameEditForm' : 'gameAddForm');
      await ho240f33FindCovers(form);
      return;
    }
    return ho240f33PrevOnAction(e);
  };
}catch(error){ console.warn('FIX33 onAction oyun adı kilidi kurulamadı:', error); }
try{
  if(Array.isArray(VERSION_NOTES_ARCHIVE) && !VERSION_NOTES_ARCHIVE.some(n=>n.version===HO240F33_INTERNAL_VERSION)){
    VERSION_NOTES_ARCHIVE.unshift({
      version:HO240F33_INTERNAL_VERSION,
      title:'Oyun Adı Kilitli Meta ve Kapak Çekme',
      summary:'Oyun adını yazıp çek dediğinde sistem artık benzer ama farklı oyunları forma işlemez. Sayı, alt başlık ve tam isim eşleşmesi kontrol edilir.',
      image:'previews/hayatimiz-oyun-v240-fix33-oyun-adi-kilidi.png',
      written:'FIX33 ile RAWG/API sonuçları güvenli başlık filtresinden geçirilir. Alan Wake 2, Alan Wake American Nightmare, Max Payne 2/3 gibi benzer isimler birbirine karışmaz.'
    });
  }
  try{ localStorage.setItem('hayatimiz_last_fix_version', HO240F33_INTERNAL_VERSION); }catch{}
  if(document.getElementById('root')?.dataset?.mounted === '1') render();
}catch(error){ console.warn('FIX33 final render atlandı:', error); }


/* v2.4.0 FIX 34 - Oyun tıklama/ekleme sonsuz döngü ve eski cache asset stabilizasyonu
   Amaç: Oyun kartına tıklayınca veya oyun ekleme/meta çekme yapınca hiçbir tür/hikaye fonksiyonu
   başka bir tür fonksiyonunu döngü halinde çağırmasın. Eski FIX31 cache dosyası çağrılsa bile aynı güvenli motor çalışır. */
const HO240F34_INTERNAL_VERSION = 'v2.4.0 FIX 34';
function ho240f34Text(value=''){
  try{
    return String(value || '')
      .toLocaleLowerCase('tr-TR')
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .replace(/ı/g,'i').replace(/İ/g,'i')
      .replace(/[^a-z0-9]+/g,' ')
      .replace(/\s+/g,' ')
      .trim();
  }catch{ return String(value || '').toLowerCase(); }
}
function ho240f34GenreFromTitle(title=''){
  const key = ho240f34Text(title);
  const rules = [
    [/alan wake.*american nightmare|american nightmare/, 'Aksiyon, psikolojik korku, gerilim, hikaye odaklı'],
    [/alan wake 2/, 'Hayatta kalma korku, psikolojik gerilim, hikaye odaklı'],
    [/alan wake/, 'Aksiyon-macera, psikolojik korku, hikaye odaklı'],
    [/max payne 3/, 'Üçüncü şahıs nişancı, neo-noir, aksiyon'],
    [/max payne 2/, 'Üçüncü şahıs nişancı, neo-noir, aksiyon'],
    [/max payne/, 'Üçüncü şahıs nişancı, neo-noir, aksiyon'],
    [/a way out|way out/, 'Aksiyon-macera, eşli oynanış, co-op, hikaye odaklı'],
    [/plague.*requiem|plague.*innocence|plague tale/, 'Macera, gizlilik, hikaye odaklı, bulmaca, dramatik anlatı'],
    [/assassin|creed|origins|mirage/, 'Aksiyon-macera, açık dünya, gizlilik, parkur, tarihi kurgu'],
    [/resident evil|silent hill|outlast|dead space/, 'Korku, hayatta kalma, gerilim, aksiyon-macera'],
    [/witcher|mass effect|dragon age|baldur/, 'RPG, hikaye odaklı, seçim odaklı macera'],
    [/cyberpunk/, 'Aksiyon-RPG, açık dünya, bilim kurgu'],
    [/god of war|elden ring|dark souls|sekiro/, 'Aksiyon-RPG, soulslike, macera'],
    [/red dead|rdr|gta/, 'Aksiyon-macera, açık dünya, suç/western, hikaye odaklı'],
    [/tomb raider|uncharted/, 'Aksiyon-macera, keşif, bulmaca'],
    [/serious sam|crysis|metro|doom|call of duty|battlefield/, 'FPS, aksiyon, nişancı, hikaye odaklı'],
    [/fifa|football|soccer|pes|efootball/, 'Spor, futbol, rekabet'],
    [/racing|yar[iı]s|forza|need for speed/, 'Yarış, sürüş, rekabet'],
    [/strategy|strateji|civilization|age of empires/, 'Strateji, taktik, yönetim']
  ];
  for(const [rx, genre] of rules){ if(rx.test(key)) return genre; }
  return 'Aksiyon-macera, hikaye odaklı, tek oyunculu';
}
function ho240f34StoryForGame(title='', genre=''){
  const name = String(title || 'Bu oyun').trim() || 'Bu oyun';
  const key = ho240f34Text(name);
  const g = String(genre || ho240f34GenreFromTitle(name) || 'hikaye odaklı').trim();
  if(key.includes('alan wake')) return `${name}, psikolojik gerilim ve hikaye odaklı anlatımı öne çıkaran bir oyundur. Oyuncu, karanlık atmosfer, gizemli olaylar ve karakterin yaşadığı iç çatışmalar üzerinden ilerleyen bölümlerde keşif, mücadele ve gerilim anlarını takip eder. Bu açıklama oyunun ana temasını anlatır, kritik son gelişmeleri spoiler olarak vermez.`;
  if(key.includes('max payne')) return `${name}, neo-noir atmosferi, kişisel kayıplar ve yoğun çatışma sahneleriyle ilerleyen aksiyon odaklı bir hikaye sunar. Oyuncu, karakterin geçmişiyle yüzleştiği ve düşmanlarıyla hesaplaştığı bölümlerde sinematik anlatımı takip eder. Bu açıklama ana temayı verir, büyük sürprizleri açık etmez.`;
  if(key.includes('a way out')) return `${name}, iki karakterin birlikte hareket etmek zorunda kaldığı sinematik co-op macerasıdır. Hikaye; kaçış, güven, aile ve ortak hedefler üzerine kurulur. Oyuncular bölüm bölüm farklı görevlerde iş birliği yaparak ilerler.`;
  if(key.includes('plague')) return `${name}, karanlık bir dünyada hayatta kalmaya çalışan karakterlerin aile bağı, korku ve umut üzerinden gelişen hikayesini anlatır. Gizlilik, keşif ve bulmaca anları bölüm akışını destekler.`;
  return `${name}, ${g} türlerini bir araya getiren hikaye odaklı bir oyun deneyimi sunar. Oyuncu, karakterlerin hedeflerini, ana çatışmayı ve oyun dünyasının kurallarını bölüm bölüm takip eder. Bu metin arşivde temiz Türkçe açıklama olarak kullanılabilir.`;
}
try{
  v222GenreFromTitle = ho240f34GenreFromTitle;
  fix12GenreFromTitle = ho240f34GenreFromTitle;
  fix10GenreFromTitle = ho240f34GenreFromTitle;
  v222StoryForGame = ho240f34StoryForGame;
  fix12DetailedStory = ho240f34StoryForGame;
}catch(error){ console.warn('FIX34 güvenli tür motoru atanamadı:', error); }
try{
  const ho240f34PrevApplyMetaToForm = typeof ho240f33ApplyMetaToForm === 'function' ? ho240f33ApplyMetaToForm : null;
  ho240f33ApplyMetaToForm = function(form, meta, keepCover=false){
    if(!form || !meta) return;
    const current = readGameDraftFromForm(form);
    const typedTitle = String(form.elements?.title?.value || current.title || meta.title || '').trim();
    const safeTitle = typedTitle || String(meta.title || '').trim();
    const safeGenre = meta.genre || current.genre || ho240f34GenreFromTitle(safeTitle);
    const patch = {
      title: safeTitle,
      seriesName: meta.seriesName || current.seriesName || '',
      genre: safeGenre,
      tags: meta.tags || safeGenre || current.tags || '',
      releaseDate: typeof ho240f10Date === 'function' ? ho240f10Date(meta.releaseDate || meta.released || current.releaseDate || '') : (meta.releaseDate || meta.released || current.releaseDate || ''),
      score: meta.score || current.score || 8.5,
      cover: keepCover ? current.cover : (meta.cover || current.cover || ''),
      description: current.description || meta.description || meta.story || ho240f34StoryForGame(safeTitle, safeGenre)
    };
    try{ if(typeof ho240f10PatchForm === 'function') ho240f10PatchForm(form, patch); else fix12PatchForm(form, patch); }catch{ try{ fix12PatchForm(form, patch); }catch{} }
    try{ if(typeof ho240f10CaptureForm === 'function') ho240f10CaptureForm(form); else saveGameDraftFromForm(form); }catch{}
  };
}catch(error){ console.warn('FIX34 meta form güvenliği kurulamadı:', error); }
try{
  const ho240f34PrevGameAddForm = typeof gameAddForm === 'function' ? gameAddForm : null;
  gameAddForm = function(){
    const d = { ...DEFAULT_GAME_DRAFT, ...(state.gameDraft || {}) };
    // Sayfa yeni açılırken eski localStorage kalıntısı yüzünden form dolu gelmesin; sadece bu oturumda yazılan taslak kalsın.
    try{ localStorage.removeItem(GAME_FORM_DRAFT_KEY); }catch{}
    return `<form class="card soft gameForm fix26GameForm ho240f29NoAutoSaveForm ho240f34GameForm" id="gameAddForm" autocomplete="off">${ho240f26FormFields(d,'add')}<p class="note ho240f29SaveNote">Bu form otomatik kayıt yapmaz. Meta/kapak çekmek sadece formu doldurur; oyun yalnızca <b>Oyunu Kaydet</b> butonuyla Supabase’e gider.</p></form>`;
  };
}catch(error){ console.warn('FIX34 oyun ekleme formu güvenliği atlandı:', error); }
try{
  const ho240f34PrevOnAction = typeof onAction === 'function' ? onAction : null;
  onAction = async function(e){
    const action = e.currentTarget?.dataset?.action || '';
    try{
      if(['fix12-refetch-genres','v222-refetch-genres','fix10-refetch-genres','fix10-fetch-genres'].includes(action)){
        e.preventDefault(); e.stopImmediatePropagation();
        const form = e.currentTarget.closest('form') || document.getElementById(state.editingGameId ? 'gameEditForm' : 'gameAddForm');
        if(!form) return setToast('Oyun formu açık değil.');
        const title = String(form.elements?.title?.value || '').trim();
        if(!title) return setToast('Önce oyun adını yaz.');
        const genre = ho240f34GenreFromTitle(title);
        try{ if(typeof ho240f10PatchForm === 'function') ho240f10PatchForm(form, { genre, tags: genre }); else fix12PatchForm(form, { genre, tags: genre }); }catch{}
        setToast('Türler güvenli şekilde forma çekildi. Oyun kaydı yapılmadı.');
        return;
      }
      if(['fix12-refetch-story','v222-refetch-story','fix10-refetch-story','fetch-game-story','fetch-game-story-edit'].includes(action)){
        e.preventDefault(); e.stopImmediatePropagation();
        const form = e.currentTarget.closest('form') || document.getElementById(state.editingGameId ? 'gameEditForm' : 'gameAddForm');
        if(!form) return setToast('Oyun formu açık değil.');
        const title = String(form.elements?.title?.value || '').trim();
        if(!title) return setToast('Önce oyun adını yaz.');
        const genre = String(form.elements?.genre?.value || ho240f34GenreFromTitle(title));
        try{ if(typeof ho240f10PatchForm === 'function') ho240f10PatchForm(form, { genre, description: ho240f34StoryForGame(title, genre) }); else fix12PatchForm(form, { genre, description: ho240f34StoryForGame(title, genre) }); }catch{}
        setToast('Hikaye güvenli şekilde forma çekildi. Oyun kaydı yapılmadı.');
        return;
      }
      return ho240f34PrevOnAction ? await ho240f34PrevOnAction(e) : undefined;
    }catch(error){ console.error('FIX34 işlem hatası yakalandı:', error); setToast('İşlem hatası yakalandı, site bozulmadan durduruldu: ' + (error.message || error)); }
  };
}catch(error){ console.warn('FIX34 onAction güvenliği kurulamadı:', error); }
try{
  if(Array.isArray(VERSION_NOTES_ARCHIVE) && !VERSION_NOTES_ARCHIVE.some(n=>n.version===HO240F34_INTERNAL_VERSION)){
    VERSION_NOTES_ARCHIVE.unshift({
      version:HO240F34_INTERNAL_VERSION,
      title:'Oyun Tıklama ve Oyun Ekleme Stabilizasyonu',
      summary:'Oyun kartlarına tıklayınca oluşan Maximum call stack hatası giderildi. Eski FIX31 cache assetleri de güvenli motora alındı; oyun ekleme/meta çekme kayıt yapmadan sadece formu doldurur.',
      image:'previews/hayatimiz-oyun-v240-fix34-oyun-stabil.png',
      written:'FIX34 ile v222/fix12 tür fonksiyonlarının birbirini sonsuz çağırma ihtimali kaldırıldı. Tür, hikaye, meta ve kapak işlemleri güvenli forma yazma katmanından geçer.'
    });
  }
  try{ localStorage.setItem('hayatimiz_last_fix_version', HO240F34_INTERNAL_VERSION); }catch{}
  if(document.getElementById('root')?.dataset?.mounted === '1') render();
}catch(error){ console.warn('FIX34 final render atlandı:', error); }

/* v2.4.0 FIX 35 - Kapakları Getir kesin çalışır + profesyonel seri sıralama
   - Kapakları Getir butonu artık son onAction katmanında yakalanır ve API/yerel katalog birleşik çalışır.
   - Kapak araması oyun adını yanlış oyunla değiştirmez; sadece güvenli adayları gösterir.
   - Seri İzleme yönetimi üstte seri kartları, altta seçilen seri detayı, arama, istatistik ve hızlı düzenleme ile profesyonelleştirildi. */
const HO240F35_INTERNAL_VERSION = 'v2.4.0 FIX 35';
const HO240F35_SERIES_ACTIVE_KEY = 'hayatimiz_fix35_active_series';
const HO240F35_SERIES_SEARCH_KEY = 'hayatimiz_fix35_series_search';
function ho240f35Norm(value=''){
  try{
    return String(value || '')
      .toLocaleLowerCase('tr-TR')
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .replace(/['’`´]/g,' ')
      .replace(/&/g,' and ')
      .replace(/[^a-z0-9]+/g,' ')
      .replace(/\s+/g,' ')
      .trim();
  }catch{ return String(value || '').toLowerCase().trim(); }
}
function ho240f35Tokens(value=''){
  const stop = new Set(['the','a','an','of','and','edition','remastered','remaster','game','oyun']);
  return ho240f35Norm(value).split(' ').filter(t=>t && !stop.has(t));
}
function ho240f35Score(query='', candidate=''){
  const q = ho240f35Norm(query), c = ho240f35Norm(candidate);
  if(!q || !c) return 0;
  if(q === c) return 100;
  const qNums = new Set(q.match(/\b\d+\b/g) || []);
  const cNums = new Set(c.match(/\b\d+\b/g) || []);
  for(const n of qNums){ if(!cNums.has(n)) return 0; }
  for(const n of cNums){ if(!qNums.has(n)) return 0; }
  if(c.includes(q)) return 94;
  if(q.includes(c) && c.length > 4) return 86;
  const qt = ho240f35Tokens(q);
  const ct = new Set(ho240f35Tokens(c));
  if(!qt.length) return 0;
  const hits = qt.filter(t=>ct.has(t)).length;
  const ratio = hits / qt.length;
  if(ratio === 1){
    const extra = Math.max(0, ct.size - qt.length);
    return Math.max(72, 90 - extra * 4);
  }
  return Math.round(ratio * 72);
}
function ho240f35SafeCoverFallback(title=''){
  const slug = ho240f35Norm(title).replace(/\s+/g,'-') || 'oyun';
  return `https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&sat=-20&txt=${encodeURIComponent(slug)}`;
}
function ho240f35LocalCoverCandidates(title=''){
  const query = String(title || '').trim();
  const out = [];
  const pushAll = (list, sourceName) => {
    (Array.isArray(list) ? list : []).forEach(c=>{
      const cover = String(c?.cover || c?.cover_url || '').trim();
      const cTitle = String(c?.title || c?.name || query).trim();
      if(!cover) return;
      const matchScore = Number(c.matchScore || ho240f35Score(query, cTitle));
      if(matchScore < 70) return;
      out.push({
        title:cTitle || query,
        seriesName:c.seriesName || c.series_name || '',
        genre:c.genre || '',
        releaseDate:c.releaseDate || c.released || '',
        score:c.score || 8.5,
        cover,
        description:c.description || c.story || '',
        source:c.source || sourceName,
        matchScore
      });
    });
  };
  try{ if(typeof ho240f14Candidates === 'function') pushAll(ho240f14Candidates(query), 'Yerel kesin katalog'); }catch{}
  try{ if(typeof ho240f10Candidates === 'function') pushAll(ho240f10Candidates(query), 'Yerel kapak kataloğu'); }catch{}
  try{
    const known = typeof ho240f33KnownMeta === 'function' ? ho240f33KnownMeta(query) : null;
    if(known?.cover) pushAll([{...known, source:'Bilinen oyun ana kapağı'}], 'Bilinen oyun');
  }catch{}
  return out;
}
function ho240f35DedupCovers(list=[]){
  const seen = new Set();
  return (Array.isArray(list) ? list : [])
    .map(c=>({ ...c, cover:String(c?.cover || c?.cover_url || '').trim(), title:String(c?.title || c?.name || '').trim() }))
    .filter(c=>{
      if(!c.cover) return false;
      if(typeof ho240f10BadCover === 'function' && ho240f10BadCover(c.cover)) return false;
      const id = c.cover.toLowerCase().replace(/\?.*$/,'');
      if(seen.has(id)) return false;
      seen.add(id);
      return true;
    })
    .sort((a,b)=>Number(b.matchScore||0)-Number(a.matchScore||0))
    .slice(0,24);
}
async function ho240f35ApiCoverCandidates(title=''){
  const query = String(title || '').trim();
  const out = [];
  try{
    const data = await api('game-meta', { adminToken:state.session?.adminToken, title:query, coverSearch:true, fix:'35' });
    const meta = data?.meta || {};
    const add = (c, source='API kapak') => {
      const cTitle = c?.title || meta.title || query;
      const score = Number(c?.matchScore || ho240f35Score(query, cTitle));
      if(score < 70) return;
      out.push({
        title:cTitle,
        seriesName:c?.seriesName || c?.series_name || meta.seriesName || meta.series_name || '',
        genre:c?.genre || meta.genre || '',
        releaseDate:typeof ho240f10Date === 'function' ? ho240f10Date(c?.releaseDate || c?.released || meta.releaseDate || meta.released || '') : (c?.releaseDate || c?.released || meta.releaseDate || meta.released || ''),
        score:c?.score || meta.score || 8.5,
        cover:c?.cover || c?.cover_url || '',
        description:c?.description || meta.description || meta.story || '',
        source:c?.source || source,
        matchScore:score
      });
    };
    if(meta.cover) add(meta, 'API ana kapak');
    (data?.candidates || []).forEach(c=>add(c, c?.source || 'API kapak adayı'));
  }catch(err){ console.warn('FIX35 kapak API alınamadı:', err); }
  return out;
}
async function ho240f35FindCovers(form){
  if(!form) return setToast('Önce Oyun Ekle veya Düzenle formunu aç.');
  const title = String(form.elements?.title?.value || '').trim();
  if(!title) return setToast('Önce oyun adını yaz.');
  try{ if(typeof ho240f26MarkStableScroll === 'function') ho240f26MarkStableScroll(); }catch{}
  try{ if(typeof ho240f10CaptureForm === 'function') ho240f10CaptureForm(form); else saveGameDraftFromForm(form); }catch{}
  setToast('Kapaklar aranıyor...');
  const local = ho240f35LocalCoverCandidates(title);
  const remote = await ho240f35ApiCoverCandidates(title);
  let list = ho240f35DedupCovers([...local, ...remote]);
  if(!list.length){
    const genre = typeof ho240f34GenreFromTitle === 'function' ? ho240f34GenreFromTitle(title) : 'Genel, Hikaye odaklı';
    list = [{ title, seriesName:getFormValue(form,'seriesName') || '', genre, releaseDate:getFormValue(form,'releaseDate') || '', score:getFormValue(form,'score') || 8.5, cover:ho240f35SafeCoverFallback(title), source:'Geçici profesyonel kapak şablonu', matchScore:70, description:'API kapağı bulunamadığında manuel düzenleme için geçici görsel.' }];
  }
  state.ho240f11CoverCandidates = list;
  state.ho240f10CoverCandidates = list;
  const first = list[0];
  try{
    const patch = {
      genre:getFormValue(form,'genre') || first.genre || (typeof ho240f34GenreFromTitle === 'function' ? ho240f34GenreFromTitle(title) : ''),
      tags:getFormValue(form,'tags') || first.genre || '',
      releaseDate:getFormValue(form,'releaseDate') || first.releaseDate || '',
      score:getFormValue(form,'score') || first.score || 8.5
    };
    // Kapakları Getir yanlış oyun adı yazmasın; sadece boşsa ilk kapağı önizlemeye koyar.
    if(!String(getFormValue(form,'cover') || '').trim()) patch.cover = first.cover;
    if(typeof ho240f10PatchForm === 'function') ho240f10PatchForm(form, patch); else Object.entries(patch).forEach(([k,v])=>{ if(form.elements?.[k] && v !== undefined) form.elements[k].value = v || ''; });
    if(typeof ho240f10CaptureForm === 'function') ho240f10CaptureForm(form); else saveGameDraftFromForm(form);
  }catch{}
  render();
  setToast(`${list.length} kapak adayı hazırlandı. Oyun adı değiştirilmedi; doğru kapağı seçip sonra Kaydet/Güncelle.`);
}
try{
  ho240f11FindCovers = ho240f35FindCovers;
  const ho240f35PrevFind = typeof ho240f33FindCovers === 'function' ? ho240f33FindCovers : null;
  ho240f33FindCovers = ho240f35FindCovers;
}catch{}
try{
  const ho240f35PrevPick = typeof ho240f11PickCover === 'function' ? ho240f11PickCover : null;
  ho240f11PickCover = function(index){
    const form = document.getElementById(state.editingGameId ? 'gameEditForm' : 'gameAddForm') || document.querySelector('form.gameForm');
    const c = (state.ho240f11CoverCandidates || state.ho240f10CoverCandidates || [])[Number(index)];
    if(!form || !c) return setToast('Kapak seçilemedi.');
    const currentTitle = String(form.elements?.title?.value || '').trim();
    const patch = {
      cover:c.cover || '',
      seriesName:getFormValue(form,'seriesName') || c.seriesName || '',
      genre:getFormValue(form,'genre') || c.genre || '',
      tags:getFormValue(form,'tags') || c.genre || '',
      releaseDate:getFormValue(form,'releaseDate') || c.releaseDate || '',
      score:getFormValue(form,'score') || c.score || 8.5
    };
    // Önemli: Kapak seçimi oyun adını değiştirmez. Yanlış oyun sorununu böyle kapatıyoruz.
    if(typeof ho240f10PatchForm === 'function') ho240f10PatchForm(form, patch); else Object.entries(patch).forEach(([k,v])=>{ if(form.elements?.[k] && v !== undefined) form.elements[k].value = v || ''; });
    if(form.elements?.title && currentTitle) form.elements.title.value = currentTitle;
    try{ if(typeof ho240f10CaptureForm === 'function') ho240f10CaptureForm(form); else saveGameDraftFromForm(form); }catch{}
    render();
    setToast('Kapak forma işlendi. Oyun adı korunuyor; kayıt için Kaydet/Güncelle butonuna bas.');
  };
}catch(error){ console.warn('FIX35 kapak seçici kurulamadı:', error); }
try{
  const ho240f35PrevOnAction = typeof onAction === 'function' ? onAction : null;
  onAction = async function(e){
    const action = e.currentTarget?.dataset?.action || '';
    if(['ho240f11-find-covers','ho240f10-find-covers'].includes(action)){
      e.preventDefault(); e.stopImmediatePropagation();
      const form = e.currentTarget.closest('form') || document.getElementById(state.editingGameId ? 'gameEditForm' : 'gameAddForm');
      await ho240f35FindCovers(form);
      return;
    }
    if(action === 'fix35-series-refresh'){
      e.preventDefault(); e.stopImmediatePropagation();
      render(); setToast('Seri sıralama paneli yenilendi.'); return;
    }
    return ho240f35PrevOnAction ? await ho240f35PrevOnAction(e) : undefined;
  };
}catch(error){ console.warn('FIX35 onAction kurulamadı:', error); }
function ho240f35SeriesGroups(){
  const groups = typeof sortedSeriesGroups === 'function' ? sortedSeriesGroups((state.games || []).filter(g=>String(g.seriesName||'').trim() || Number(g.eps||0)>0)) : [];
  const q = ho240f35Norm(localStorage.getItem(HO240F35_SERIES_SEARCH_KEY) || '');
  return q ? groups.filter(g=>ho240f35Norm(`${g.name} ${g.items.map(x=>x.title).join(' ')}`).includes(q)) : groups;
}
function ho240f35SeriesStats(group){
  const items = group?.items || [];
  const totalEpisodes = items.reduce((s,g)=>s+Number(g.eps || seriesEpisodes(g).length || 0),0);
  const watched = items.reduce((s,g)=>s+Number(g.watchedEps || 0),0);
  const percent = totalEpisodes ? Math.round((watched / totalEpisodes) * 100) : Math.round(items.reduce((s,g)=>s+progressPercent(g),0) / Math.max(items.length,1));
  const completed = items.filter(g=>progressPercent(g) >= 100 || g.status === 'Tamamlandı').length;
  return { totalEpisodes, watched, percent, completed };
}
function ho240f35SeriesButton(group, activeName){
  const first = group.items?.[0] || {};
  const stats = ho240f35SeriesStats(group);
  return `<button class="ho240f35SeriesCard ${group.name===activeName?'active':''}" data-series-tab="${esc(group.name)}">
    <img src="${esc(coverFor(first))}" alt="${esc(group.name)}" onerror="this.style.display='none'">
    <div><b>${esc(group.name)}</b><small>${group.items.length} oyun • ${stats.totalEpisodes} bölüm</small><div class="progressLine"><span style="width:${Math.min(100,stats.percent)}%"></span></div></div>
    <span class="pill ${stats.percent>=100?'green':''}">%${stats.percent}</span>
  </button>`;
}
try{
  adminSeriesWatchPanel = function(){
    const groups = ho240f35SeriesGroups();
    const saved = localStorage.getItem(HO240F35_SERIES_ACTIVE_KEY) || localStorage.getItem('hayatimiz_active_series_v217') || localStorage.getItem(FIX8_SERIES_PICK_KEY) || '';
    const activeName = groups.some(g=>g.name===saved) ? saved : (groups[0]?.name || '');
    const group = groups.find(g=>g.name===activeName) || groups[0] || { name:'Seri yok', items:[] };
    const stats = ho240f35SeriesStats(group);
    const q = localStorage.getItem(HO240F35_SERIES_SEARCH_KEY) || '';
    return `<section class="ho240f35SeriesAdmin">
      <div class="card wide ho240f35SeriesHero">
        <div><span class="eyebrow">${HO240F35_INTERNAL_VERSION}</span><h2>Profesyonel Seri Sıralama Merkezi</h2><p class="muted">Seriler üstte kapaklı kart olarak durur. Tıkladığın seri aşağıda detaylı sıralama, bölüm ilerlemesi ve hızlı düzenleme alanıyla açılır.</p></div>
        <div class="rowActions"><button class="btn" data-action="fix35-series-refresh">Yenile</button><button class="btn primary" data-action="save-series-orders">Seri Sırasını Kaydet</button><button class="btn" data-action="bulk-playlist-sync">Toplu Playlist Senkronizasyonu</button></div>
      </div>
      <div class="card wide ho240f35SeriesToolbar"><label class="search">🔎 <input id="ho240f35SeriesSearch" value="${esc(q)}" placeholder="Seri veya oyun ara..."></label><div class="ho240f35SeriesSummary"><span>${groups.length} seri</span><span>${(state.games||[]).length} oyun</span><span>${stats.watched}/${stats.totalEpisodes} bölüm</span><span>%${stats.percent} seçili ilerleme</span></div></div>
      <section class="card wide ho240f35SeriesRail">${groups.map(g=>ho240f35SeriesButton(g, activeName)).join('') || '<p class="muted">Henüz seri bulunamadı.</p>'}</section>
      <section class="card wide ho240f35SeriesDetail">
        <div class="ho240f35DetailBanner"><img src="${esc(coverFor(group.items[0] || {}))}" alt="${esc(group.name)}" onerror="this.style.display='none'"><div><span class="eyebrow">Seçili Seri</span><h2>${esc(group.name)}</h2><p class="muted">${group.items.length} oyun • ${stats.completed} tamamlanan • ${stats.totalEpisodes} toplam bölüm</p><div class="progressLine large"><span style="width:${Math.min(100,stats.percent)}%"></span></div></div><span class="pill green">%${stats.percent}</span></div>
        <div class="ho240f35SeriesRows">${group.items.map((g,i)=>`<article class="ho240f35SeriesRow">
          <span class="ho240f35OrderBadge">${i+1}</span><img src="${esc(coverFor(g))}" alt="${esc(g.title)}" onerror="this.style.display='none'">
          <div class="ho240f35SeriesInfo"><b>${esc(g.title)}</b><small>${esc(g.releaseDate || 'Tarih yok')} • ${esc(g.status || 'Devam Ediyor')} • ${progressPercent(g)}%</small><div class="progressLine"><span style="width:${progressPercent(g)}%"></span></div></div>
          <label class="ho240f35OrderInput">Sıra<input data-series-order-game="${esc(g.id)}" type="number" min="1" value="${esc(String(g.seriesOrder || i+1))}"></label>
          <div class="rowActions"><button class="miniBtn" data-watch-series="${esc(g.id)}">Sitede İzle</button><button class="miniBtn" data-game-edit="${esc(g.id)}">Düzenle</button></div>
        </article>`).join('') || '<p class="muted">Bu seride oyun yok.</p>'}</div>
      </section>
    </section>`;
  };
}catch(error){ console.warn('FIX35 seri paneli kurulamadı:', error); }
try{
  const ho240f35PrevBind = typeof bind === 'function' ? bind : null;
  bind = function(){
    try{ if(ho240f35PrevBind) ho240f35PrevBind(); }catch(err){ console.warn('FIX35 önceki bind atlandı:', err); }
    document.querySelectorAll('[data-ho240f11-cover-pick]').forEach(btn=>{
      if(btn.dataset.ho240f35Bound) return; btn.dataset.ho240f35Bound='1';
      btn.addEventListener('click', e=>{ e.preventDefault(); e.stopImmediatePropagation(); ho240f11PickCover(btn.dataset.ho240f11CoverPick); }, true);
    });
    document.querySelectorAll('[data-series-tab]').forEach(btn=>{
      if(btn.dataset.ho240f35SeriesBound) return; btn.dataset.ho240f35SeriesBound='1';
      btn.addEventListener('click', e=>{
        e.preventDefault();
        const name = btn.dataset.seriesTab || '';
        localStorage.setItem(HO240F35_SERIES_ACTIVE_KEY, name);
        localStorage.setItem('hayatimiz_active_series_v217', name);
        try{ localStorage.setItem(FIX8_SERIES_PICK_KEY, name); }catch{}
        render();
      });
    });
    const search = document.getElementById('ho240f35SeriesSearch');
    if(search && !search.dataset.ho240f35Bound){
      search.dataset.ho240f35Bound='1';
      search.addEventListener('input', e=>{ localStorage.setItem(HO240F35_SERIES_SEARCH_KEY, e.target.value || ''); render(); });
    }
  };
}catch(error){ console.warn('FIX35 bind kurulamadı:', error); }
try{
  if(Array.isArray(VERSION_NOTES_ARCHIVE) && !VERSION_NOTES_ARCHIVE.some(n=>n.version===HO240F35_INTERNAL_VERSION)){
    VERSION_NOTES_ARCHIVE.unshift({
      version:HO240F35_INTERNAL_VERSION,
      title:'Kapakları Getir ve Profesyonel Seri Sıralama',
      summary:'Kapakları Getir butonu API/yerel katalog birleşik çalışacak şekilde düzeltildi. Seri sıralama üstte kapaklı seri kartları ve altta seçilen seri detayıyla profesyonel hale getirildi.',
      image:'previews/hayatimiz-oyun-v240-fix35-kapak-seri.png',
      written:'FIX35 ile kapak çekme oyun adını yanlış oyunla değiştirmez. Kapak seçimi sadece görseli forma işler; kayıt için yine Kaydet/Güncelle gerekir.'
    });
  }
  try{ localStorage.setItem('hayatimiz_last_fix_version', HO240F35_INTERNAL_VERSION); }catch{}
  if(document.getElementById('root')?.dataset?.mounted === '1') render();
}catch(error){ console.warn('FIX35 final render atlandı:', error); }


/* v2.4.0 FIX 36 - Kapakları Getir tüm seri kapakları + çıkış tarihi düzeltmesi
   - Alan Wake / Alan Wake Remastered DLC: The Writer gibi aramalarda sadece tek oyunu değil,
     aynı seri ailesindeki tüm kapak adaylarını ve çıkış tarihlerini listeler.
   - Kapak seçimi oyun adını değiştirmez; kapak, çıkış tarihi, tür ve seri bilgisini forma işler.
   - Liste 8 adayla sınırlı kalmaz; geniş seri sonuçlarını kullanıcı seçebilsin diye 60 adaya kadar gösterir. */
const HO240F36_INTERNAL_VERSION = 'v2.4.0 FIX 36';
const HO240F36_MAX_COVERS = 60;
const HO240F36_ALAN_WAKE_FAMILY = [
  {
    id:'alan-wake-writer',
    title:'Alan Wake Remastered DLC: The Writer',
    match:['alan wake remastered dlc the writer','alan wake the writer','the writer'],
    seriesName:'Alan Wake',
    releaseDate:'12.10.2010',
    genre:'Psikolojik gerilim, hikaye odaklı DLC, aksiyon-macera',
    score:8.1,
    story:'Alan Wake: The Writer, Alan Wake hikayesinin DLC bölümlerinden biridir. Yazarlık, karanlık ve gerçeklik algısı üzerinden ilerleyen psikolojik gerilim atmosferini genişletir.',
    covers:[
      ['https://cdn.akamai.steamstatic.com/steam/apps/108710/header.jpg','The Writer / Alan Wake geniş kapak'],
      ['https://cdn.akamai.steamstatic.com/steam/apps/108710/capsule_616x353.jpg','The Writer / Steam capsule'],
      ['https://cdn.cloudflare.steamstatic.com/steam/apps/108710/header.jpg','The Writer / Cloudflare header'],
      ['https://cdn.cloudflare.steamstatic.com/steam/apps/108710/capsule_616x353.jpg','The Writer / Cloudflare capsule']
    ]
  },
  {
    id:'alan-wake-signal',
    title:'Alan Wake Remastered DLC: The Signal',
    match:['alan wake remastered dlc the signal','alan wake the signal','the signal'],
    seriesName:'Alan Wake',
    releaseDate:'27.07.2010',
    genre:'Psikolojik gerilim, hikaye odaklı DLC, aksiyon-macera',
    score:8.0,
    story:'Alan Wake: The Signal, ana oyundan sonra gelen ek hikaye bölümüdür. Alan Wake evreninin karanlık atmosferini ve bölüm bazlı anlatımını genişletir.',
    covers:[
      ['https://cdn.akamai.steamstatic.com/steam/apps/108710/header.jpg','The Signal / Alan Wake geniş kapak'],
      ['https://cdn.akamai.steamstatic.com/steam/apps/108710/capsule_616x353.jpg','The Signal / Steam capsule'],
      ['https://cdn.cloudflare.steamstatic.com/steam/apps/108710/header.jpg','The Signal / Cloudflare header'],
      ['https://cdn.cloudflare.steamstatic.com/steam/apps/108710/capsule_616x353.jpg','The Signal / Cloudflare capsule']
    ]
  },
  {
    id:'alan-wake-original',
    title:'Alan Wake',
    match:['alan wake'],
    seriesName:'Alan Wake',
    releaseDate:'14.05.2010',
    genre:'Aksiyon-macera, psikolojik korku, gerilim, hikaye odaklı',
    score:8.2,
    story:'Alan Wake, Bright Falls kasabasında geçen karanlık, sinematik ve psikolojik gerilim odaklı bir hikaye anlatır.',
    covers:[
      ['https://cdn.akamai.steamstatic.com/steam/apps/108710/header.jpg','Alan Wake / Steam header'],
      ['https://cdn.akamai.steamstatic.com/steam/apps/108710/capsule_616x353.jpg','Alan Wake / Steam capsule'],
      ['https://cdn.akamai.steamstatic.com/steam/apps/108710/library_600x900.jpg','Alan Wake / Dikey kütüphane kapağı'],
      ['https://cdn.cloudflare.steamstatic.com/steam/apps/108710/header.jpg','Alan Wake / Cloudflare header'],
      ['https://cdn.cloudflare.steamstatic.com/steam/apps/108710/capsule_616x353.jpg','Alan Wake / Cloudflare capsule']
    ]
  },
  {
    id:'alan-wake-remastered',
    title:'Alan Wake Remastered',
    match:['alan wake remastered','alan wake remaster'],
    seriesName:'Alan Wake',
    releaseDate:'05.10.2021',
    genre:'Aksiyon-macera, psikolojik korku, gerilim, hikaye odaklı, remastered',
    score:8.0,
    story:'Alan Wake Remastered, ana oyunun yenilenmiş görsellerle hazırlanan sürümüdür. Bright Falls atmosferini modern platformlarda yeniden sunar.',
    covers:[
      ['https://media.rawg.io/media/games/053/0531fbe64d90d7a97acb88ba8f340cb9.jpg','Alan Wake Remastered / RAWG kapak'],
      ['https://cdn.akamai.steamstatic.com/steam/apps/108710/header.jpg','Alan Wake Remastered / güvenli geniş kapak'],
      ['https://cdn.akamai.steamstatic.com/steam/apps/108710/capsule_616x353.jpg','Alan Wake Remastered / güvenli capsule'],
      ['https://cdn.cloudflare.steamstatic.com/steam/apps/108710/library_600x900.jpg','Alan Wake Remastered / alternatif dikey kapak']
    ]
  },
  {
    id:'alan-wakes-american-nightmare',
    title:"Alan Wake's American Nightmare",
    match:['alan wakes american nightmare','alan wake american nightmare','american nightmare'],
    seriesName:'Alan Wake',
    releaseDate:'22.02.2012',
    genre:'Aksiyon, psikolojik korku, gerilim, arcade aksiyon, hikaye odaklı',
    score:7.8,
    story:"Alan Wake's American Nightmare, Alan Wake evreninde geçen daha aksiyon odaklı psikolojik gerilim oyunudur.",
    covers:[
      ['https://cdn.akamai.steamstatic.com/steam/apps/202750/header.jpg','American Nightmare / Steam header'],
      ['https://cdn.akamai.steamstatic.com/steam/apps/202750/capsule_616x353.jpg','American Nightmare / Steam capsule'],
      ['https://cdn.akamai.steamstatic.com/steam/apps/202750/library_600x900.jpg','American Nightmare / Dikey kütüphane kapağı'],
      ['https://cdn.cloudflare.steamstatic.com/steam/apps/202750/header.jpg','American Nightmare / Cloudflare header'],
      ['https://cdn.cloudflare.steamstatic.com/steam/apps/202750/capsule_616x353.jpg','American Nightmare / Cloudflare capsule']
    ]
  },
  {
    id:'alan-wake-2',
    title:'Alan Wake 2',
    match:['alan wake 2','alan wake ii'],
    seriesName:'Alan Wake',
    releaseDate:'27.10.2023',
    genre:'Hayatta kalma korku, psikolojik gerilim, sinematik hikaye',
    score:9.1,
    story:'Alan Wake 2, Alan Wake ve Saga Anderson üzerinden ilerleyen karanlık, sinematik ve hayatta kalma korku odaklı devam oyunudur.',
    covers:[
      ['https://media.rawg.io/media/games/599/5999f254b9a7facb3147a28d956a163e.jpg','Alan Wake 2 / RAWG kapak'],
      ['https://media.rawg.io/media/screenshots/6e6/6e6daab9b4632d594d9c2b79e926f6e5.jpg','Alan Wake 2 / alternatif görsel']
    ]
  }
];
function ho240f36Norm(value=''){
  try{
    return String(value || '').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/['’`´]/g,' ').replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
  }catch{ return String(value || '').toLowerCase().trim(); }
}
function ho240f36IsAlanWakeQuery(value=''){
  const q = ho240f36Norm(value);
  return /\balan\s+wake\b/.test(q) || /\bamerican\s+nightmare\b/.test(q) || /\bthe\s+writer\b/.test(q) || /\bthe\s+signal\b/.test(q);
}
function ho240f36SpecificBoost(query='', row){
  const q = ho240f36Norm(query);
  const title = ho240f36Norm(row?.title || '');
  const match = Array.isArray(row?.match) ? row.match.map(ho240f36Norm) : [];
  if(match.some(m=>m && q.includes(m))) return 130;
  if(q.includes('writer') && title.includes('writer')) return 128;
  if(q.includes('signal') && title.includes('signal')) return 126;
  if(q.includes('american nightmare') && title.includes('american nightmare')) return 124;
  if(/\balan wake 2\b/.test(q) && /\balan wake 2\b/.test(title)) return 124;
  if(q.includes('remaster') && title.includes('remaster')) return 122;
  if(title === 'alan wake') return 112;
  return 96;
}
function ho240f36AlanWakeCandidates(title=''){
  const query = String(title || '').trim();
  if(!ho240f36IsAlanWakeQuery(query)) return [];
  const out = [];
  for(const row of HO240F36_ALAN_WAKE_FAMILY){
    const baseScore = ho240f36SpecificBoost(query, row);
    (row.covers || []).forEach((item, index)=>{
      const cover = Array.isArray(item) ? item[0] : item;
      const label = Array.isArray(item) ? item[1] : (index ? 'Alternatif kapak' : 'Ana kapak');
      if(!cover) return;
      out.push({
        title:row.title,
        seriesName:row.seriesName,
        releaseDate:row.releaseDate,
        released:row.releaseDate,
        genre:row.genre,
        tags:row.genre,
        score:row.score,
        cover,
        description:row.story,
        story:row.story,
        source:`Alan Wake seri kataloğu • ${label}`,
        matchScore:Math.max(80, baseScore - index)
      });
    });
  }
  return out.sort((a,b)=>Number(b.matchScore||0)-Number(a.matchScore||0));
}
function ho240f36MergeCoverCandidates(list=[]){
  const seen = new Set();
  return (Array.isArray(list) ? list : [])
    .map(c=>({ ...c, cover:String(c?.cover || c?.cover_url || '').trim(), title:String(c?.title || c?.name || '').trim() }))
    .filter(c=>{
      if(!c.cover) return false;
      if(typeof ho240f10BadCover === 'function' && ho240f10BadCover(c.cover)) return false;
      // Aynı görsel farklı DLC/oyun tarihiyle kullanılabilir; bu yüzden sadece URL değil başlık+tarih+URL ile benzersiz yapıyoruz.
      const id = `${ho240f36Norm(c.title)}|${String(c.releaseDate || c.released || '').trim()}|${c.cover.toLowerCase().replace(/\?.*$/,'')}`;
      if(seen.has(id)) return false;
      seen.add(id);
      return true;
    })
    .sort((a,b)=>Number(b.matchScore||0)-Number(a.matchScore||0))
    .slice(0, HO240F36_MAX_COVERS);
}
try{
  const ho240f36PrevLocalCoverCandidates = typeof ho240f35LocalCoverCandidates === 'function' ? ho240f35LocalCoverCandidates : null;
  ho240f35LocalCoverCandidates = function(title=''){
    const family = ho240f36AlanWakeCandidates(title);
    const prev = ho240f36PrevLocalCoverCandidates ? ho240f36PrevLocalCoverCandidates(title) : [];
    return ho240f36MergeCoverCandidates([...family, ...prev]);
  };
}catch(error){ console.warn('FIX36 yerel kapak kataloğu kurulamadı:', error); }
try{
  ho240f35DedupCovers = ho240f36MergeCoverCandidates;
}catch(error){ console.warn('FIX36 kapak dedupe kurulamadı:', error); }
async function ho240f36FindCovers(form){
  if(!form) return setToast('Önce Oyun Ekle veya Düzenle formunu aç.');
  const title = String(form.elements?.title?.value || '').trim();
  if(!title) return setToast('Önce oyun adını yaz.');
  try{ if(typeof ho240f26MarkStableScroll === 'function') ho240f26MarkStableScroll(); }catch{}
  try{ if(typeof ho240f10CaptureForm === 'function') ho240f10CaptureForm(form); else saveGameDraftFromForm(form); }catch{}
  setToast('Tüm kapaklar ve çıkış tarihleri aranıyor...');
  const family = ho240f36AlanWakeCandidates(title);
  const local = typeof ho240f35LocalCoverCandidates === 'function' ? ho240f35LocalCoverCandidates(title) : [];
  const remote = typeof ho240f35ApiCoverCandidates === 'function' ? await ho240f35ApiCoverCandidates(title) : [];
  let list = ho240f36MergeCoverCandidates([...family, ...local, ...remote]);
  if(!list.length){
    const genre = typeof ho240f34GenreFromTitle === 'function' ? ho240f34GenreFromTitle(title) : 'Genel, Hikaye odaklı';
    list = [{ title, seriesName:getFormValue(form,'seriesName') || '', genre, releaseDate:getFormValue(form,'releaseDate') || '', score:getFormValue(form,'score') || 8.5, cover:(typeof ho240f35SafeCoverFallback==='function'?ho240f35SafeCoverFallback(title):'/assets/hayatimiz-kapak.png'), source:'Geçici profesyonel kapak şablonu', matchScore:70, description:'API kapağı bulunamadığında manuel düzenleme için geçici görsel.' }];
  }
  state.ho240f11CoverCandidates = list;
  state.ho240f10CoverCandidates = list;
  const first = list[0];
  try{
    const patch = {
      seriesName:getFormValue(form,'seriesName') || first.seriesName || '',
      genre:getFormValue(form,'genre') || first.genre || (typeof ho240f34GenreFromTitle === 'function' ? ho240f34GenreFromTitle(title) : ''),
      tags:getFormValue(form,'tags') || first.tags || first.genre || '',
      releaseDate:first.releaseDate || first.released || getFormValue(form,'releaseDate') || '',
      score:getFormValue(form,'score') || first.score || 8.5,
      description:getFormValue(form,'description') || first.description || first.story || ''
    };
    // Kapakları Getir oyun adını değiştirmez; sadece kapak boşsa ilk kapağı önizlemeye koyar.
    if(!String(getFormValue(form,'cover') || '').trim()) patch.cover = first.cover;
    if(typeof ho240f10PatchForm === 'function') ho240f10PatchForm(form, patch); else Object.entries(patch).forEach(([k,v])=>{ if(form.elements?.[k] && v !== undefined) form.elements[k].value = v || ''; });
    if(form.elements?.title) form.elements.title.value = title;
    if(typeof ho240f10CaptureForm === 'function') ho240f10CaptureForm(form); else saveGameDraftFromForm(form);
  }catch(error){ console.warn('FIX36 form patch atlandı:', error); }
  render();
  setToast(`${list.length} kapak adayı ve çıkış tarihi hazırlandı. Oyun adı korunuyor; doğru kapağı seçip Kaydet/Güncelle.`);
}
try{
  ho240f35FindCovers = ho240f36FindCovers;
  ho240f33FindCovers = ho240f36FindCovers;
  ho240f11FindCovers = ho240f36FindCovers;
}catch(error){ console.warn('FIX36 kapak bulucu atanamadı:', error); }
try{
  ho240f11PickCover = function(index){
    const form = document.getElementById(state.editingGameId ? 'gameEditForm' : 'gameAddForm') || document.querySelector('form.gameForm');
    const c = (state.ho240f11CoverCandidates || state.ho240f10CoverCandidates || [])[Number(index)];
    if(!form || !c) return setToast('Kapak seçilemedi.');
    const currentTitle = String(form.elements?.title?.value || '').trim();
    const patch = {
      cover:c.cover || '',
      seriesName:getFormValue(form,'seriesName') || c.seriesName || '',
      genre:getFormValue(form,'genre') || c.genre || '',
      tags:getFormValue(form,'tags') || c.tags || c.genre || '',
      releaseDate:c.releaseDate || c.released || getFormValue(form,'releaseDate') || '',
      score:getFormValue(form,'score') || c.score || 8.5,
      description:getFormValue(form,'description') || c.description || c.story || ''
    };
    if(typeof ho240f10PatchForm === 'function') ho240f10PatchForm(form, patch); else Object.entries(patch).forEach(([k,v])=>{ if(form.elements?.[k] && v !== undefined) form.elements[k].value = v || ''; });
    if(form.elements?.title && currentTitle) form.elements.title.value = currentTitle;
    try{ if(typeof ho240f10CaptureForm === 'function') ho240f10CaptureForm(form); else saveGameDraftFromForm(form); }catch{}
    render();
    setToast('Kapak ve çıkış tarihi forma işlendi. Oyun adı korunuyor; kayıt için Kaydet/Güncelle butonuna bas.');
  };
}catch(error){ console.warn('FIX36 kapak seçme kurulamadı:', error); }
try{
  ho240f11CoverPanel = function(){
    const list = typeof ho240f11CoverList === 'function' ? ho240f11CoverList() : (state.ho240f11CoverCandidates || state.ho240f10CoverCandidates || []);
    const groups = {};
    (list || []).forEach(c=>{ const k = c.title || 'Diğer Kapaklar'; groups[k] = (groups[k] || 0) + 1; });
    const summary = Object.entries(groups).map(([k,v])=>`${esc(k)}: ${v}`).join(' • ');
    return `<div class="field wideField ho240f11CoverPanel ho240f36CoverPanel"><div class="sectionHead"><div><span class="eyebrow">Kapak Seçici</span><h3>Oyun adıyla ilgili tüm kapaklar ve çıkış tarihleri</h3><p class="muted">Kapakları Getir butonuna bas; aynı seri içindeki tüm uygun kapakları listeler. Örneğin <b>Alan Wake Remastered DLC: The Writer</b> yazarsan Alan Wake ailesindeki kapakları da getirir, oyun adını değiştirmez.</p>${summary?`<small class="ho240f36CoverSummary">${summary}</small>`:''}</div><button class="miniBtn primary" type="button" data-action="ho240f11-find-covers">Kapakları Getir</button></div>${list.length?`<div class="ho240f11CoverGrid ho240f36CoverGrid">${list.map((c,i)=>`<article><img loading="lazy" src="${esc(c.cover)}" alt="${esc(c.title||'Kapak')}" onerror="this.onerror=null;this.src='/assets/hayatimiz-kapak.png';this.closest('article')?.classList.add('coverFallbackUsed')"><b>${esc(c.title||'Oyun kapağı')}</b><small>${esc(c.source||'Kapak')}</small><small class="ho240f36Release">Çıkış: ${esc(c.releaseDate || c.released || 'Tarih yok')}</small><button class="miniBtn primary" type="button" data-ho240f11-cover-pick="${i}">Bu Kapağı Seç</button></article>`).join('')}</div>`:`<div class="ho240f11CoverEmpty"><b>Henüz kapak listesi yok.</b><small>Önce oyun adını yaz, sonra Kapakları Getir butonuna bas.</small></div>`}</div>`;
  };
}catch(error){ console.warn('FIX36 kapak paneli kurulamadı:', error); }
try{
  const ho240f36PrevOnAction = typeof onAction === 'function' ? onAction : null;
  onAction = async function(e){
    const action = e.currentTarget?.dataset?.action || '';
    if(['ho240f11-find-covers','ho240f10-find-covers','ho240f36-find-covers'].includes(action)){
      e.preventDefault(); e.stopImmediatePropagation();
      const form = e.currentTarget.closest('form') || document.getElementById(state.editingGameId ? 'gameEditForm' : 'gameAddForm');
      await ho240f36FindCovers(form);
      return;
    }
    return ho240f36PrevOnAction ? await ho240f36PrevOnAction(e) : undefined;
  };
}catch(error){ console.warn('FIX36 onAction kurulamadı:', error); }
try{
  const ho240f36PrevBind = typeof bind === 'function' ? bind : null;
  bind = function(){
    try{ if(ho240f36PrevBind) ho240f36PrevBind(); }catch(err){ console.warn('FIX36 önceki bind atlandı:', err); }
    document.querySelectorAll('[data-ho240f11-cover-pick]').forEach(btn=>{
      if(btn.dataset.ho240f36Bound) return; btn.dataset.ho240f36Bound='1';
      btn.addEventListener('click', e=>{ e.preventDefault(); e.stopImmediatePropagation(); ho240f11PickCover(btn.dataset.ho240f11CoverPick); }, true);
    });
  };
}catch(error){ console.warn('FIX36 bind kurulamadı:', error); }
try{
  if(Array.isArray(VERSION_NOTES_ARCHIVE) && !VERSION_NOTES_ARCHIVE.some(n=>n.version===HO240F36_INTERNAL_VERSION)){
    VERSION_NOTES_ARCHIVE.unshift({
      version:HO240F36_INTERNAL_VERSION,
      title:'Tüm Kapakları Getir + Çıkış Tarihi Fix',
      summary:'Kapakları Getir artık tek veya eksik sonuçla kalmaz; Alan Wake gibi seri aramalarında ana oyun, DLC, remaster ve devam oyunu kapaklarını çıkış tarihleriyle birlikte listeler.',
      image:'previews/hayatimiz-oyun-v240-fix36-tum-kapaklar.png',
      written:'FIX36 ile kapak listesi 60 adaya çıkarıldı. Kapak seçimi oyun adını değiştirmez; seçilen kapağın çıkış tarihi forma işlenir ve kayıt sadece Kaydet/Güncelle ile yapılır.'
    });
  }
  try{ localStorage.setItem('hayatimiz_last_fix_version', HO240F36_INTERNAL_VERSION); }catch{}
  if(document.getElementById('root')?.dataset?.mounted === '1') render();
}catch(error){ console.warn('FIX36 final render atlandı:', error); }

/* v2.4.0 FIX 37 - Google/Internet tarzı geniş DLC kapak havuzu
   - Alan Wake DLC/Expansion aramalarında sadece Steam header değil, Night Springs, The Lake House,
     The Signal, The Writer, Remastered, American Nightmare ve Alan Wake 2 kapak havuzunu birlikte gösterir.
   - Kullanıcının yazdığı oyun adı korunur; kapak seçimi sadece kapak, çıkış tarihi ve eksik meta alanlarını işler.
   - API tarafı varsa internet görsel havuzu da döner; yoksa yerel güvenli katalog yine çalışır. */
const HO240F37_INTERNAL_VERSION = 'v2.4.0 FIX 37';
const HO240F37_MAX_COVERS = 90;
const HO240F37_NIGHT_SPRINGS_LOCAL = '/assets/alan-wake-night-springs.png';
function ho240f37Norm(value=''){
  try{
    return String(value || '').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/['’`´]/g,' ').replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
  }catch{ return String(value || '').toLowerCase().trim(); }
}
function ho240f37IsAlanWakeQuery(value=''){
  const q = ho240f37Norm(value);
  return /\balan\s+wake\b/.test(q) || /\bnight\s+springs\b/.test(q) || /\blake\s+house\b/.test(q) || /\bthe\s+writer\b/.test(q) || /\bthe\s+signal\b/.test(q) || /\bamerican\s+nightmare\b/.test(q);
}
const HO240F37_ALAN_WAKE_INTERNET_COVERS = [
  {
    id:'alan-wake-2-night-springs',
    title:'Alan Wake II: Night Springs',
    aliases:['alan wake 2 night springs','alan wake ii night springs','night springs','alan wake 2 dlc night springs','alan wake ii expansion night springs'],
    seriesName:'Alan Wake',
    releaseDate:'08.06.2024',
    genre:'DLC, psikolojik korku, antoloji hikaye, aksiyon-macera',
    score:8.5,
    story:'Night Springs, Alan Wake II için yayınlanan ilk hikaye genişletmesidir. Antoloji bölümleriyle Alan Wake evrenindeki farklı karakter yansımalarını işler.',
    covers:[
      [HO240F37_NIGHT_SPRINGS_LOCAL, 'Night Springs / pakete eklenen yerel kapak'],
      ['https://blog.playstation.com/uploads/2024/06/1bca6c720882a33f0cc80ade266dd65e33e58302.jpg', 'Night Springs / PlayStation Blog resmi görsel'],
      ['https://www.alanwake.com/wp-content/uploads/2023/05/Expansion_pass_3.webp', 'Expansion Pass / Night Springs + Lake House resmi kart'],
      ['https://images.igdb.com/igdb/image/upload/t_cover_big/co9nst.jpg', 'Night Springs / IGDB tarzı kapak adayı']
    ]
  },
  {
    id:'alan-wake-2-lake-house',
    title:'Alan Wake II: The Lake House',
    aliases:['alan wake 2 the lake house','alan wake ii the lake house','the lake house','lake house expansion','alan wake 2 lake house'],
    seriesName:'Alan Wake',
    releaseDate:'22.10.2024',
    genre:'DLC, survival horror, FBC, psikolojik korku, hikaye odaklı',
    score:8.4,
    story:'The Lake House, Alan Wake II için ikinci hikaye genişletmesidir. Cauldron Lake kıyısındaki FBC araştırma tesisinde geçen daha karanlık bir survival horror deneyimi sunar.',
    covers:[
      ['https://www.alanwake.com/wp-content/uploads/2024/09/AW2_Lakehouse_DLC_teaser_keyart_1000x1000_logo_final-1300x650.png', 'The Lake House / AlanWake.com resmi key art'],
      ['https://www.alanwake.com/wp-content/uploads/2023/05/Expansion_pass_3.webp', 'Expansion Pass / Night Springs + Lake House resmi kart']
    ]
  },
  {
    id:'alan-wake-writer-expanded',
    title:'Alan Wake: The Writer',
    aliases:['alan wake the writer','the writer','alan wake remastered the writer','alan wake remastered dlc the writer'],
    seriesName:'Alan Wake',
    releaseDate:'12.10.2010',
    genre:'DLC, psikolojik gerilim, hikaye odaklı, aksiyon-macera',
    score:8.1,
    story:'The Writer, Alan Wake hikayesinin ek bölümüdür ve Alan’ın karanlıkta kendi yazarlığıyla yüzleşmesini konu alır.',
    covers:[
      ['https://www.slam-zine.de/uploads/micro/alan_wake_-_the_writer_%28c%29_microsoft.jpg', 'The Writer / internet kapak sonucu'],
      ['https://cdn.akamai.steamstatic.com/steam/apps/108710/header.jpg', 'The Writer / Alan Wake Steam geniş kapak'],
      ['https://cdn.akamai.steamstatic.com/steam/apps/108710/capsule_616x353.jpg', 'The Writer / Steam capsule'],
      ['https://cdn.cloudflare.steamstatic.com/steam/apps/108710/library_600x900.jpg', 'The Writer / dikey kütüphane adayı']
    ]
  },
  {
    id:'alan-wake-signal-expanded',
    title:'Alan Wake: The Signal',
    aliases:['alan wake the signal','the signal','alan wake remastered the signal','alan wake remastered dlc the signal'],
    seriesName:'Alan Wake',
    releaseDate:'27.07.2010',
    genre:'DLC, psikolojik gerilim, hikaye odaklı, aksiyon-macera',
    score:8.0,
    story:'The Signal, Alan Wake ana hikayesinden sonra gelen ek bölümdür ve karanlıkla mücadeleyi sürdürür.',
    covers:[
      ['https://images.igdb.com/igdb/image/upload/t_cover_big/co1ybw.jpg', 'The Signal / IGDB kapak'],
      ['https://cdn.akamai.steamstatic.com/steam/apps/108710/header.jpg', 'The Signal / Alan Wake Steam geniş kapak'],
      ['https://cdn.akamai.steamstatic.com/steam/apps/108710/capsule_616x353.jpg', 'The Signal / Steam capsule'],
      ['https://cdn.cloudflare.steamstatic.com/steam/apps/108710/library_600x900.jpg', 'The Signal / dikey kütüphane adayı']
    ]
  },
  {
    id:'alan-wake-original-expanded',
    title:'Alan Wake',
    aliases:['alan wake'],
    seriesName:'Alan Wake',
    releaseDate:'14.05.2010',
    genre:'Aksiyon-macera, psikolojik korku, gerilim, hikaye odaklı',
    score:8.2,
    story:'Alan Wake, Bright Falls kasabasında geçen karanlık ve sinematik psikolojik gerilim oyunudur.',
    covers:[
      ['https://cdn.akamai.steamstatic.com/steam/apps/108710/header.jpg','Alan Wake / Steam header'],
      ['https://cdn.akamai.steamstatic.com/steam/apps/108710/capsule_616x353.jpg','Alan Wake / Steam capsule'],
      ['https://cdn.akamai.steamstatic.com/steam/apps/108710/library_600x900.jpg','Alan Wake / dikey kütüphane kapağı'],
      ['https://cdn.cloudflare.steamstatic.com/steam/apps/108710/header.jpg','Alan Wake / Cloudflare header']
    ]
  },
  {
    id:'alan-wake-remastered-expanded',
    title:'Alan Wake Remastered',
    aliases:['alan wake remastered','alan wake remaster'],
    seriesName:'Alan Wake',
    releaseDate:'05.10.2021',
    genre:'Remastered, aksiyon-macera, psikolojik korku, hikaye odaklı',
    score:8.0,
    story:'Alan Wake Remastered, ana oyunu ve klasik ek bölümleri modern platformlar için yenilenmiş şekilde sunar.',
    covers:[
      ['https://media.rawg.io/media/games/053/0531fbe64d90d7a97acb88ba8f340cb9.jpg','Alan Wake Remastered / RAWG kapak'],
      ['https://cdn.akamai.steamstatic.com/steam/apps/108710/header.jpg','Alan Wake Remastered / geniş kapak'],
      ['https://cdn.akamai.steamstatic.com/steam/apps/108710/capsule_616x353.jpg','Alan Wake Remastered / capsule'],
      ['https://cdn.cloudflare.steamstatic.com/steam/apps/108710/library_600x900.jpg','Alan Wake Remastered / dikey kapak']
    ]
  },
  {
    id:'alan-wakes-american-nightmare-expanded',
    title:"Alan Wake's American Nightmare",
    aliases:['alan wakes american nightmare','alan wake american nightmare','american nightmare'],
    seriesName:'Alan Wake',
    releaseDate:'22.02.2012',
    genre:'Aksiyon, psikolojik korku, gerilim, arcade aksiyon, hikaye odaklı',
    score:7.8,
    story:"Alan Wake's American Nightmare, Alan Wake evreninde geçen daha aksiyon odaklı yan hikayedir.",
    covers:[
      ['https://cdn.akamai.steamstatic.com/steam/apps/202750/header.jpg','American Nightmare / Steam header'],
      ['https://cdn.akamai.steamstatic.com/steam/apps/202750/capsule_616x353.jpg','American Nightmare / Steam capsule'],
      ['https://cdn.akamai.steamstatic.com/steam/apps/202750/library_600x900.jpg','American Nightmare / dikey kapak'],
      ['https://cdn.cloudflare.steamstatic.com/steam/apps/202750/header.jpg','American Nightmare / Cloudflare header']
    ]
  },
  {
    id:'alan-wake-2-expanded',
    title:'Alan Wake 2',
    aliases:['alan wake 2','alan wake ii'],
    seriesName:'Alan Wake',
    releaseDate:'27.10.2023',
    genre:'Hayatta kalma korku, psikolojik gerilim, sinematik hikaye',
    score:9.1,
    story:'Alan Wake 2, Alan Wake ve Saga Anderson üzerinden ilerleyen karanlık bir hayatta kalma korku devam oyunudur.',
    covers:[
      ['https://media.rawg.io/media/games/599/5999f254b9a7facb3147a28d956a163e.jpg','Alan Wake 2 / RAWG kapak'],
      ['https://media.rawg.io/media/screenshots/6e6/6e6daab9b4632d594d9c2b79e926f6e5.jpg','Alan Wake 2 / alternatif görsel'],
      ['https://www.alanwake.com/wp-content/uploads/2023/05/Expansion_pass_3.webp','Alan Wake 2 / Expansion Pass kartı']
    ]
  }
];
function ho240f37Boost(query='', row){
  const q = ho240f37Norm(query);
  const title = ho240f37Norm(row?.title || '');
  const aliases = Array.isArray(row?.aliases) ? row.aliases.map(ho240f37Norm) : [];
  if(aliases.some(a=>a && q === a)) return 160;
  if(aliases.some(a=>a && q.includes(a))) return 150;
  if(q.includes('night springs') && title.includes('night springs')) return 155;
  if(q.includes('lake house') && title.includes('lake house')) return 154;
  if(q.includes('writer') && title.includes('writer')) return 153;
  if(q.includes('signal') && title.includes('signal')) return 152;
  if(q.includes('american nightmare') && title.includes('american nightmare')) return 151;
  if(/\balan wake 2\b|\balan wake ii\b/.test(q) && title === 'alan wake 2') return 145;
  if(q.includes('remaster') && title.includes('remaster')) return 140;
  if(title === 'alan wake') return 110;
  return 92;
}
function ho240f37ExpandedAlanWakeCandidates(title=''){
  const query = String(title || '').trim();
  if(!ho240f37IsAlanWakeQuery(query)) return [];
  const out = [];
  for(const row of HO240F37_ALAN_WAKE_INTERNET_COVERS){
    const baseScore = ho240f37Boost(query, row);
    (row.covers || []).forEach((item, index)=>{
      const cover = Array.isArray(item) ? item[0] : item;
      const label = Array.isArray(item) ? item[1] : (index ? 'Alternatif kapak' : 'Ana kapak');
      if(!cover) return;
      out.push({
        title:row.title,
        seriesName:row.seriesName,
        releaseDate:row.releaseDate,
        released:row.releaseDate,
        genre:row.genre,
        tags:row.genre,
        score:row.score,
        cover,
        description:row.story,
        story:row.story,
        source:`FIX37 Google/İnternet kapak havuzu • ${label}`,
        matchScore:Math.max(75, baseScore - index)
      });
    });
  }
  return out.sort((a,b)=>Number(b.matchScore||0)-Number(a.matchScore||0));
}
function ho240f37MergeCoverCandidates(list=[]){
  const seen = new Set();
  return (Array.isArray(list) ? list : [])
    .map(c=>({ ...c, cover:String(c?.cover || c?.cover_url || '').trim(), title:String(c?.title || c?.name || '').trim() }))
    .filter(c=>{
      if(!c.cover) return false;
      if(typeof ho240f10BadCover === 'function' && ho240f10BadCover(c.cover)) return false;
      const id = `${ho240f37Norm(c.title)}|${String(c.releaseDate || c.released || '').trim()}|${c.cover.toLowerCase().replace(/\?.*$/,'')}`;
      if(seen.has(id)) return false;
      seen.add(id);
      return true;
    })
    .sort((a,b)=>Number(b.matchScore||0)-Number(a.matchScore||0))
    .slice(0, HO240F37_MAX_COVERS);
}
try{
  const ho240f37PrevF36Alan = typeof ho240f36AlanWakeCandidates === 'function' ? ho240f36AlanWakeCandidates : null;
  ho240f36AlanWakeCandidates = function(title=''){
    const expanded = ho240f37ExpandedAlanWakeCandidates(title);
    const prev = ho240f37PrevF36Alan ? ho240f37PrevF36Alan(title) : [];
    return ho240f37MergeCoverCandidates([...expanded, ...prev]);
  };
}catch(error){ console.warn('FIX37 Alan Wake geniş katalog atanamadı:', error); }
try{
  const ho240f37PrevLocal = typeof ho240f35LocalCoverCandidates === 'function' ? ho240f35LocalCoverCandidates : null;
  ho240f35LocalCoverCandidates = function(title=''){
    const expanded = ho240f37ExpandedAlanWakeCandidates(title);
    const prev = ho240f37PrevLocal ? ho240f37PrevLocal(title) : [];
    return ho240f37MergeCoverCandidates([...expanded, ...prev]);
  };
  ho240f35DedupCovers = ho240f37MergeCoverCandidates;
}catch(error){ console.warn('FIX37 local kapak havuzu kurulamadı:', error); }
async function ho240f37ApiCoverCandidates(title=''){
  const query = String(title || '').trim();
  const out = [];
  try{
    const data = await api('game-meta', { adminToken:state.session?.adminToken, title:query, coverSearch:true, internetCoverSearch:true, fix:'37' });
    const meta = data?.meta || {};
    const add = (c, source='API/Google kapak') => {
      const cTitle = c?.title || meta.title || query;
      const score = Number(c?.matchScore || (typeof ho240f35Score === 'function' ? ho240f35Score(query, cTitle) : 80));
      if(score < 55) return;
      out.push({
        title:cTitle,
        seriesName:c?.seriesName || c?.series_name || meta.seriesName || meta.series_name || '',
        genre:c?.genre || meta.genre || '',
        releaseDate:typeof ho240f10Date === 'function' ? ho240f10Date(c?.releaseDate || c?.released || meta.releaseDate || meta.released || '') : (c?.releaseDate || c?.released || meta.releaseDate || meta.released || ''),
        score:c?.score || meta.score || 8.5,
        cover:c?.cover || c?.cover_url || '',
        description:c?.description || meta.description || meta.story || '',
        source:c?.source || source,
        matchScore:score
      });
    };
    if(meta.cover) add(meta, 'API ana kapak');
    (data?.candidates || []).forEach(c=>add(c, c?.source || 'API/İnternet kapak adayı'));
  }catch(err){ console.warn('FIX37 internet kapak API alınamadı:', err); }
  return out;
}
async function ho240f37FindCovers(form){
  if(!form) return setToast('Önce Oyun Ekle veya Düzenle formunu aç.');
  const title = String(form.elements?.title?.value || '').trim();
  if(!title) return setToast('Önce oyun adını yaz.');
  try{ if(typeof ho240f26MarkStableScroll === 'function') ho240f26MarkStableScroll(); }catch{}
  try{ if(typeof ho240f10CaptureForm === 'function') ho240f10CaptureForm(form); else saveGameDraftFromForm(form); }catch{}
  setToast('Google/İnternet tarzı geniş kapak havuzu aranıyor...');
  const expanded = ho240f37ExpandedAlanWakeCandidates(title);
  const local = typeof ho240f35LocalCoverCandidates === 'function' ? ho240f35LocalCoverCandidates(title) : [];
  const remote = await ho240f37ApiCoverCandidates(title);
  let list = ho240f37MergeCoverCandidates([...expanded, ...local, ...remote]);
  if(!list.length){
    const genre = typeof ho240f34GenreFromTitle === 'function' ? ho240f34GenreFromTitle(title) : 'Genel, Hikaye odaklı';
    list = [{ title, seriesName:getFormValue(form,'seriesName') || '', genre, releaseDate:getFormValue(form,'releaseDate') || '', score:getFormValue(form,'score') || 8.5, cover:(typeof ho240f35SafeCoverFallback==='function'?ho240f35SafeCoverFallback(title):'/assets/hayatimiz-kapak.png'), source:'Geçici profesyonel kapak şablonu', matchScore:60, description:'İnternet kapağı bulunamadığında manuel düzenleme için geçici görsel.' }];
  }
  state.ho240f11CoverCandidates = list;
  state.ho240f10CoverCandidates = list;
  const first = list[0];
  try{
    const patch = {
      seriesName:getFormValue(form,'seriesName') || first.seriesName || '',
      genre:getFormValue(form,'genre') || first.genre || (typeof ho240f34GenreFromTitle === 'function' ? ho240f34GenreFromTitle(title) : ''),
      tags:getFormValue(form,'tags') || first.tags || first.genre || '',
      releaseDate:first.releaseDate || first.released || getFormValue(form,'releaseDate') || '',
      score:getFormValue(form,'score') || first.score || 8.5,
      description:getFormValue(form,'description') || first.description || first.story || ''
    };
    if(!String(getFormValue(form,'cover') || '').trim()) patch.cover = first.cover;
    if(typeof ho240f10PatchForm === 'function') ho240f10PatchForm(form, patch); else Object.entries(patch).forEach(([k,v])=>{ if(form.elements?.[k] && v !== undefined) form.elements[k].value = v || ''; });
    if(form.elements?.title) form.elements.title.value = title;
    if(typeof ho240f10CaptureForm === 'function') ho240f10CaptureForm(form); else saveGameDraftFromForm(form);
  }catch(error){ console.warn('FIX37 form patch atlandı:', error); }
  render();
  setToast(`${list.length} kapak adayı hazırlandı. Google/İnternet havuzu + yerel DLC katalog birlikte kullanıldı.`);
}
try{
  ho240f35FindCovers = ho240f37FindCovers;
  ho240f36FindCovers = ho240f37FindCovers;
  ho240f33FindCovers = ho240f37FindCovers;
  ho240f11FindCovers = ho240f37FindCovers;
}catch(error){ console.warn('FIX37 kapak bulucu atanamadı:', error); }
try{
  ho240f11PickCover = function(index){
    const form = document.getElementById(state.editingGameId ? 'gameEditForm' : 'gameAddForm') || document.querySelector('form.gameForm');
    const c = (state.ho240f11CoverCandidates || state.ho240f10CoverCandidates || [])[Number(index)];
    if(!form || !c) return setToast('Kapak seçilemedi.');
    const currentTitle = String(form.elements?.title?.value || '').trim();
    const patch = {
      cover:c.cover || '',
      seriesName:getFormValue(form,'seriesName') || c.seriesName || '',
      genre:getFormValue(form,'genre') || c.genre || '',
      tags:getFormValue(form,'tags') || c.tags || c.genre || '',
      releaseDate:c.releaseDate || c.released || getFormValue(form,'releaseDate') || '',
      score:getFormValue(form,'score') || c.score || 8.5,
      description:getFormValue(form,'description') || c.description || c.story || ''
    };
    if(typeof ho240f10PatchForm === 'function') ho240f10PatchForm(form, patch); else Object.entries(patch).forEach(([k,v])=>{ if(form.elements?.[k] && v !== undefined) form.elements[k].value = v || ''; });
    if(form.elements?.title && currentTitle) form.elements.title.value = currentTitle;
    try{ if(typeof ho240f10CaptureForm === 'function') ho240f10CaptureForm(form); else saveGameDraftFromForm(form); }catch{}
    render();
    setToast('Kapak ve çıkış tarihi forma işlendi. Oyun adı korunuyor; kayıt için Kaydet/Güncelle butonuna bas.');
  };
}catch(error){ console.warn('FIX37 kapak seçme kurulamadı:', error); }
try{
  ho240f11CoverPanel = function(){
    const list = typeof ho240f11CoverList === 'function' ? ho240f11CoverList() : (state.ho240f11CoverCandidates || state.ho240f10CoverCandidates || []);
    const groups = {};
    (list || []).forEach(c=>{ const k = c.title || 'Diğer Kapaklar'; groups[k] = (groups[k] || 0) + 1; });
    const summary = Object.entries(groups).map(([k,v])=>`${esc(k)}: ${v}`).join(' • ');
    return `<div class="field wideField ho240f11CoverPanel ho240f36CoverPanel"><div class="sectionHead"><div><span class="eyebrow">Kapak Seçici</span><h3>Google/İnternet + yerel DLC kapak havuzu</h3><p class="muted">Kapakları Getir butonu Alan Wake DLC/Expansion isimlerinde Night Springs, The Lake House, The Writer, The Signal, Remastered ve American Nightmare kapaklarını birlikte getirir. Oyun adı değişmez; doğru kapağı sen seçersin.</p>${summary?`<small class="ho240f36CoverSummary">${summary}</small>`:''}</div><button class="miniBtn primary" type="button" data-action="ho240f11-find-covers">Kapakları Getir</button></div>${list.length?`<div class="ho240f11CoverGrid ho240f36CoverGrid">${list.map((c,i)=>`<article><img loading="lazy" src="${esc(c.cover)}" alt="${esc(c.title||'Kapak')}" onerror="this.onerror=null;this.src='/assets/hayatimiz-kapak.png';this.closest('article')?.classList.add('coverFallbackUsed')"><b>${esc(c.title||'Oyun kapağı')}</b><small>${esc(c.source||'Kapak')}</small><small class="ho240f36Release">Çıkış: ${esc(c.releaseDate || c.released || 'Tarih yok')}</small><button class="miniBtn primary" type="button" data-ho240f11-cover-pick="${i}">Bu Kapağı Seç</button></article>`).join('')}</div>`:`<div class="ho240f11CoverEmpty"><b>Henüz kapak listesi yok.</b><small>Önce oyun adını yaz, sonra Kapakları Getir butonuna bas.</small></div>`}</div>`;
  };
}catch(error){ console.warn('FIX37 kapak paneli kurulamadı:', error); }
try{
  const ho240f37PrevOnAction = typeof onAction === 'function' ? onAction : null;
  onAction = async function(e){
    const action = e.currentTarget?.dataset?.action || '';
    if(['ho240f11-find-covers','ho240f10-find-covers','ho240f36-find-covers','ho240f37-find-covers'].includes(action)){
      e.preventDefault(); e.stopImmediatePropagation();
      const form = e.currentTarget.closest('form') || document.getElementById(state.editingGameId ? 'gameEditForm' : 'gameAddForm');
      await ho240f37FindCovers(form);
      return;
    }
    return ho240f37PrevOnAction ? await ho240f37PrevOnAction(e) : undefined;
  };
}catch(error){ console.warn('FIX37 onAction kurulamadı:', error); }
try{
  const ho240f37PrevBind = typeof bind === 'function' ? bind : null;
  bind = function(){
    try{ if(ho240f37PrevBind) ho240f37PrevBind(); }catch(err){ console.warn('FIX37 önceki bind atlandı:', err); }
    document.querySelectorAll('[data-ho240f11-cover-pick]').forEach(btn=>{
      if(btn.dataset.ho240f37Bound) return; btn.dataset.ho240f37Bound='1';
      btn.addEventListener('click', e=>{ e.preventDefault(); e.stopImmediatePropagation(); ho240f11PickCover(btn.dataset.ho240f11CoverPick); }, true);
    });
  };
}catch(error){ console.warn('FIX37 bind kurulamadı:', error); }
try{
  if(Array.isArray(VERSION_NOTES_ARCHIVE) && !VERSION_NOTES_ARCHIVE.some(n=>n.version===HO240F37_INTERNAL_VERSION)){
    VERSION_NOTES_ARCHIVE.unshift({
      version:HO240F37_INTERNAL_VERSION,
      title:'Google/İnternet DLC Kapak Havuzu',
      summary:'Kapakları Getir artık Alan Wake DLC/Expansion aramalarında Night Springs, The Lake House, The Writer, The Signal ve diğer seri kapaklarını birlikte listeler.',
      image:'previews/hayatimiz-oyun-v240-fix37-google-dlc-kapak.png',
      written:'FIX37 ile kullanıcı tarafından gönderilen Night Springs görseli yerel asset olarak eklendi. İnternet/API adayları ve yerel güvenli katalog birlikte çalışır; kapak seçimi oyun adını değiştirmez.'
    });
  }
  try{ localStorage.setItem('hayatimiz_last_fix_version', HO240F37_INTERNAL_VERSION); }catch{}
  if(document.getElementById('root')?.dataset?.mounted === '1') render();
}catch(error){ console.warn('FIX37 final render atlandı:', error); }


/* v2.4.0 FIX 38 - Profesyonel sürükle bırak seri sıralama
   - Yönetim Paneli > Oyunlar içindeki Seri Sıralama alanı üstte seri kartları, altta seçili seri listesi olacak şekilde yenilendi.
   - Oyunlar sürükle-bırak ile sıralanır; yeni sıra numaraları ekranda anında hesaplanır.
   - Kalıcı kayıt yine "Seri Sırasını Kalıcı Kaydet" butonuyla yapılır; otomatik Supabase kaydı yapılmaz. */
const HO240F38_INTERNAL_VERSION = 'v2.4.0 FIX 38';
try{
  state.ho240f38ActiveSeriesName = localStorage.getItem('hayatimiz_active_series_drag_v238') || state.activeSeriesName || '';
  state.ho240f38DraggingGameId = '';
}catch{}
function ho240f38SeriesName(g){ return String(g?.seriesName || g?.series_name || '').trim() || (Number(g?.eps || 0) > 0 ? 'Serisiz Bölümlü Oyunlar' : 'Tek Oyunlar'); }
function ho240f38SeriesGroups(games = state.games){
  const grouped = new Map();
  (games || []).filter(g=>String(g.seriesName||'').trim() || Number(g.eps||0)>0).forEach(g=>{
    const key = ho240f38SeriesName(g);
    if(!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(g);
  });
  return Array.from(grouped.entries()).map(([name, items])=>({
    name,
    items:items.slice().sort((a,b)=>Number(a.seriesOrder||9999)-Number(b.seriesOrder||9999)||String(a.title||'').localeCompare(String(b.title||''),'tr'))
  })).sort((a,b)=>{
    const ao = Math.min(...a.items.map(x=>Number(x.seriesOrder||9999)));
    const bo = Math.min(...b.items.map(x=>Number(x.seriesOrder||9999)));
    return ao - bo || a.name.localeCompare(b.name,'tr');
  });
}
function ho240f38GroupProgress(items){
  const eps = items.reduce((sum,g)=>sum + Number(g.eps || seriesEpisodes(g).length || 0), 0);
  const watched = items.reduce((sum,g)=>sum + Number(g.watchedEps || 0), 0);
  return eps ? Math.round((watched / eps) * 100) : 0;
}
function ho240f38RenumberSeries(name){
  const items = state.games.filter(g=>ho240f38SeriesName(g) === name).sort((a,b)=>Number(a.seriesOrder||9999)-Number(b.seriesOrder||9999)||String(a.title||'').localeCompare(String(b.title||''),'tr'));
  items.forEach((g,i)=>{ g.seriesOrder = i + 1; });
  return items;
}
function ho240f38MoveSeriesGame(name, gameId, direction){
  const items = state.games.filter(g=>ho240f38SeriesName(g) === name).sort((a,b)=>Number(a.seriesOrder||9999)-Number(b.seriesOrder||9999)||String(a.title||'').localeCompare(String(b.title||''),'tr'));
  const from = items.findIndex(g=>String(g.id)===String(gameId));
  if(from < 0) return false;
  const to = Math.max(0, Math.min(items.length - 1, from + direction));
  if(to === from) return false;
  const [moving] = items.splice(from, 1);
  items.splice(to, 0, moving);
  items.forEach((g,i)=>{ g.seriesOrder = i + 1; });
  return true;
}
function ho240f38DropSeriesGame(name, draggedId, targetId, placeAfter=false){
  const items = state.games.filter(g=>ho240f38SeriesName(g) === name).sort((a,b)=>Number(a.seriesOrder||9999)-Number(b.seriesOrder||9999)||String(a.title||'').localeCompare(String(b.title||''),'tr'));
  const from = items.findIndex(g=>String(g.id)===String(draggedId));
  if(from < 0) return false;
  const [moving] = items.splice(from, 1);
  let to = targetId ? items.findIndex(g=>String(g.id)===String(targetId)) : items.length;
  if(to < 0) to = items.length;
  if(placeAfter) to += 1;
  to = Math.max(0, Math.min(items.length, to));
  items.splice(to, 0, moving);
  items.forEach((g,i)=>{ g.seriesOrder = i + 1; });
  return true;
}
function ho240f38SeriesCard(group, activeName){
  const first = group.items[0] || {};
  const progress = ho240f38GroupProgress(group.items);
  const totalEp = group.items.reduce((sum,g)=>sum + Number(g.eps || seriesEpisodes(g).length || 0), 0);
  return `<button class="ho240f38SeriesCard ${group.name===activeName?'active':''}" type="button" data-series-sort-select="${esc(group.name)}">
    <img src="${esc(coverFor(first))}" alt="${esc(group.name)}" onerror="this.src='https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop'">
    <span><b>${esc(group.name)}</b><small>${group.items.length} oyun • ${totalEp} bölüm</small><i><em style="width:${progress}%"></em></i></span>
  </button>`;
}
function ho240f38SeriesRow(g, index){
  return `<article class="ho240f38DragItem" draggable="true" data-series-drag-game="${esc(g.id)}">
    <div class="ho240f38DragHandle" title="Sürükle bırak">☰</div>
    <span class="ho240f38OrderNo">${index + 1}</span>
    <img src="${esc(coverFor(g))}" alt="${esc(g.title)}" onerror="this.src='https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop'">
    <div class="ho240f38DragInfo"><b>${esc(g.title)}</b><small>${esc(g.releaseDate || g.genre || 'Tarih / tür yok')} • ${Number(g.watchedEps||0)}/${Number(g.eps||seriesEpisodes(g).length||0)} bölüm</small><div class="progressLine"><span style="width:${progressPercent(g)}%"></span></div></div>
    <label class="ho240f38OrderInput">Sıra <input data-series-order-game="${esc(g.id)}" type="number" min="1" value="${esc(String(g.seriesOrder || index + 1))}"></label>
    <div class="ho240f38RowActions"><button class="miniBtn" type="button" data-series-move-game="${esc(g.id)}" data-series-move-dir="-1">↑</button><button class="miniBtn" type="button" data-series-move-game="${esc(g.id)}" data-series-move-dir="1">↓</button><button class="miniBtn" type="button" data-game-edit="${esc(g.id)}">Düzenle</button></div>
  </article>`;
}
try{
  seriesGroupPanel = function(games){
    if(!state.showSeriesSortPanel){
      return '<section class="card wide seriesManager compactSeriesSort ho240f38SeriesManager"><div class="sectionHead"><div><h3>Seri Sıralama</h3><p class="muted">Sürükle bırak sıralama panelini aç; oyunları serinin içinde istediğin sıraya taşı.</p></div><button class="miniBtn primary" data-action="open-series-sort-panel">Seri Sıralamayı Aç</button></div></section>';
    }
    const groups = ho240f38SeriesGroups(games);
    if(!groups.length) return '<section class="card wide seriesManager ho240f38SeriesManager"><div class="sectionHead"><div><h3>Seri Sıralama</h3><p class="muted">Seri adı veya bölüm bilgisi olan oyun yok.</p></div><button class="miniBtn" data-action="open-series-sort-panel">Kapat</button></div></section>';
    const names = groups.map(g=>g.name);
    let activeName = state.ho240f38ActiveSeriesName || state.activeSeriesName || names[0];
    if(!names.includes(activeName)) activeName = names[0];
    const active = groups.find(g=>g.name===activeName) || groups[0];
    state.ho240f38ActiveSeriesName = active.name;
    const cards = groups.map(g=>ho240f38SeriesCard(g, active.name)).join('');
    const rows = active.items.map((g,i)=>ho240f38SeriesRow(g,i)).join('');
    const progress = ho240f38GroupProgress(active.items);
    return `<section class="card wide seriesManager ho240f38SeriesManager">
      <div class="sectionHead"><div><span class="eyebrow">Sürükle Bırak Seri Sıralama</span><h3>Seri Gruplama ve Sıra Editörü</h3><p class="muted">Seriler üstte kart olarak durur. Bir seriye tıkla, aşağıdaki oyunları sürükleyip bırak. Kalıcı kayıt için sonrasında kaydet butonuna bas.</p></div><div class="rowActions"><span class="pill green">FIX 38</span><button class="miniBtn" data-action="open-series-sort-panel">Kapat</button><button class="miniBtn" type="button" data-action="renumber-active-series">1’den Başlat</button><button class="miniBtn primary" data-action="save-series-orders">Seri Sırasını Kalıcı Kaydet</button></div></div>
      <div class="ho240f38SeriesCards">${cards}</div>
      <div class="ho240f38ActivePanel"><div class="sectionHead"><div><h3>${esc(active.name)}</h3><p class="muted">${active.items.length} oyun • ilerleme %${progress}. Sürükle bırak sonrası sıra numaraları otomatik güncellenir.</p></div><span class="pill">${active.items.length} kayıt</span></div><div class="ho240f38DragList" data-series-drop-list="${esc(active.name)}">${rows}</div></div>
    </section>`;
  };
}catch(error){ console.warn('FIX38 seri paneli atanamadı:', error); }
try{
  const ho240f38PrevOnAction = typeof onAction === 'function' ? onAction : null;
  onAction = async function(e){
    const action = e.currentTarget?.dataset?.action || '';
    if(action === 'renumber-active-series'){
      e.preventDefault(); e.stopImmediatePropagation();
      const name = state.ho240f38ActiveSeriesName || state.activeSeriesName || '';
      if(name){ ho240f38RenumberSeries(name); setToast('Seçili seri 1’den başlayacak şekilde yeniden numaralandı. Kalıcı kayıt için kaydet.'); render(); }
      return;
    }
    return ho240f38PrevOnAction ? await ho240f38PrevOnAction(e) : undefined;
  };
}catch(error){ console.warn('FIX38 onAction kurulamadı:', error); }
try{
  const ho240f38PrevBind = typeof bind === 'function' ? bind : null;
  bind = function(){
    try{ if(ho240f38PrevBind) ho240f38PrevBind(); }catch(err){ console.warn('FIX38 önceki bind atlandı:', err); }
    document.querySelectorAll('[data-series-sort-select]').forEach(btn=>{
      if(btn.dataset.ho240f38Bound) return; btn.dataset.ho240f38Bound='1';
      btn.addEventListener('click', e=>{ e.preventDefault(); const name = btn.dataset.seriesSortSelect || ''; state.ho240f38ActiveSeriesName = name; state.activeSeriesName = name; try{ localStorage.setItem('hayatimiz_active_series_drag_v238', name); localStorage.setItem('hayatimiz_active_series_v217', name); }catch{} render(); });
    });
    document.querySelectorAll('[data-series-move-game]').forEach(btn=>{
      if(btn.dataset.ho240f38Bound) return; btn.dataset.ho240f38Bound='1';
      btn.addEventListener('click', e=>{ e.preventDefault(); e.stopImmediatePropagation(); const name = state.ho240f38ActiveSeriesName || ''; const id = btn.dataset.seriesMoveGame; const dir = Number(btn.dataset.seriesMoveDir || 0); if(ho240f38MoveSeriesGame(name, id, dir)){ setToast('Sıra ekranda güncellendi. Kalıcı kayıt için kaydet.'); render(); } });
    });
    document.querySelectorAll('[data-series-drag-game]').forEach(item=>{
      if(item.dataset.ho240f38DragBound) return; item.dataset.ho240f38DragBound='1';
      item.addEventListener('dragstart', e=>{ state.ho240f38DraggingGameId = item.dataset.seriesDragGame || ''; item.classList.add('dragging'); try{ e.dataTransfer.effectAllowed='move'; e.dataTransfer.setData('text/plain', state.ho240f38DraggingGameId); }catch{} });
      item.addEventListener('dragend', ()=>{ item.classList.remove('dragging'); state.ho240f38DraggingGameId=''; document.querySelectorAll('.ho240f38DropBefore,.ho240f38DropAfter').forEach(x=>x.classList.remove('ho240f38DropBefore','ho240f38DropAfter')); });
      item.addEventListener('dragover', e=>{ e.preventDefault(); const rect = item.getBoundingClientRect(); const after = e.clientY > rect.top + rect.height / 2; item.classList.toggle('ho240f38DropBefore', !after); item.classList.toggle('ho240f38DropAfter', after); });
      item.addEventListener('dragleave', ()=> item.classList.remove('ho240f38DropBefore','ho240f38DropAfter'));
    });
    document.querySelectorAll('[data-series-drop-list]').forEach(list=>{
      if(list.dataset.ho240f38DropBound) return; list.dataset.ho240f38DropBound='1';
      list.addEventListener('dragover', e=>{ e.preventDefault(); try{ e.dataTransfer.dropEffect='move'; }catch{} });
      list.addEventListener('drop', e=>{
        e.preventDefault(); e.stopPropagation();
        const name = list.dataset.seriesDropList || state.ho240f38ActiveSeriesName || '';
        const draggedId = (()=>{ try{return e.dataTransfer.getData('text/plain') || state.ho240f38DraggingGameId;}catch{return state.ho240f38DraggingGameId;} })();
        const target = e.target.closest('[data-series-drag-game]');
        const targetId = target?.dataset?.seriesDragGame || '';
        let after = false;
        if(target){ const rect = target.getBoundingClientRect(); after = e.clientY > rect.top + rect.height / 2; }
        document.querySelectorAll('.ho240f38DropBefore,.ho240f38DropAfter').forEach(x=>x.classList.remove('ho240f38DropBefore','ho240f38DropAfter'));
        if(draggedId && draggedId !== targetId && ho240f38DropSeriesGame(name, draggedId, targetId, after)){
          setToast('Sürükle bırak sırası hazır. Kalıcı kayıt için Seri Sırasını Kalıcı Kaydet butonuna bas.');
          render();
        }
      });
    });
  };
}catch(error){ console.warn('FIX38 bind kurulamadı:', error); }
try{
  if(Array.isArray(VERSION_NOTES_ARCHIVE) && !VERSION_NOTES_ARCHIVE.some(n=>n.version===HO240F38_INTERNAL_VERSION)){
    VERSION_NOTES_ARCHIVE.unshift({
      version:HO240F38_INTERNAL_VERSION,
      title:'Sürükle Bırak Seri Sıralama',
      summary:'Seri sıralama ekranı üstte seri kartları ve altta sürükle bırak oyun listesi olacak şekilde profesyonel hale getirildi.',
      image:'previews/hayatimiz-oyun-v240-fix38-seri-drag-drop.png',
      written:'FIX38 ile yönetim panelindeki seri sıralama alanında oyunları sürükle bırak yöntemiyle yeniden sıralama, yukarı/aşağı kısa yol butonları ve 1’den başlat işlemi eklendi. Supabase kaydı yine sadece kalıcı kaydet butonuyla yapılır.'
    });
  }
  try{ localStorage.setItem('hayatimiz_last_fix_version', HO240F38_INTERNAL_VERSION); }catch{}
  if(document.getElementById('root')?.dataset?.mounted === '1') render();
}catch(error){ console.warn('FIX38 final render atlandı:', error); }


/* v2.4.0 FIX 39 - Seri İzleme ekranında gerçek sürükle bırak görünür hale getirildi
   - Kullanıcının ekranında görünen Yönetim Paneli > Seri İzleme paneli FIX35 tasarımında kaldığı için sürükle bırak satırları görünmüyordu.
   - Bu sürüm adminSeriesWatchPanel'i de sürükle bırak motoruna bağlar.
   - Sıra değişikliği yine sadece ekranda kalır; kalıcı Supabase kaydı için "Seri Sırasını Kalıcı Kaydet" butonuna basılır. */
const HO240F39_INTERNAL_VERSION = 'v2.4.0 FIX 39';
try{
  state.ho240f39ActiveSeriesName = localStorage.getItem('hayatimiz_active_series_drag_v239') || state.ho240f38ActiveSeriesName || state.activeSeriesName || localStorage.getItem('hayatimiz_fix35_active_series') || '';
}catch{}
function ho240f39SearchValue(){ try{return localStorage.getItem('hayatimiz_fix39_series_search') || localStorage.getItem('hayatimiz_fix35_series_search') || '';}catch{return '';} }
function ho240f39Groups(){
  const base = (typeof ho240f38SeriesGroups === 'function' ? ho240f38SeriesGroups(state.games || []) : []);
  const q = typeof ho240f35Norm === 'function' ? ho240f35Norm(ho240f39SearchValue()) : String(ho240f39SearchValue()).toLowerCase().trim();
  if(!q) return base;
  return base.filter(g=>{
    const hay = `${g.name} ${g.items.map(x=>x.title).join(' ')}`;
    const norm = typeof ho240f35Norm === 'function' ? ho240f35Norm(hay) : hay.toLowerCase();
    return norm.includes(q);
  });
}
function ho240f39Stats(items=[]){
  const totalEpisodes = items.reduce((s,g)=>s+Number(g.eps || (typeof seriesEpisodes==='function'?seriesEpisodes(g).length:0) || 0),0);
  const watched = items.reduce((s,g)=>s+Number(g.watchedEps || 0),0);
  const completed = items.filter(g=>(typeof progressPercent==='function'?progressPercent(g):0) >= 100 || String(g.status||'') === 'Tamamlandı').length;
  const percent = totalEpisodes ? Math.round((watched / totalEpisodes) * 100) : Math.round(items.reduce((s,g)=>s+(typeof progressPercent==='function'?progressPercent(g):0),0) / Math.max(items.length,1));
  return {totalEpisodes, watched, completed, percent};
}
function ho240f39SeriesTopCard(group, activeName){
  const first = group.items?.[0] || {};
  const stats = ho240f39Stats(group.items || []);
  return `<button class="ho240f39SeriesCard ${group.name===activeName?'active':''}" type="button" data-fix39-series-select="${esc(group.name)}" data-series-sort-select="${esc(group.name)}">
    <img src="${esc(coverFor(first))}" alt="${esc(group.name)}" onerror="this.style.display='none'">
    <div><b>${esc(group.name)}</b><small>${group.items.length} oyun • ${stats.totalEpisodes} bölüm</small><div class="progressLine"><span style="width:${Math.min(100,stats.percent)}%"></span></div></div>
    <span class="pill ${stats.percent>=100?'green':''}">%${stats.percent}</span>
  </button>`;
}
function ho240f39DragRow(g, i){
  const eps = Number(g.eps || (typeof seriesEpisodes==='function'?seriesEpisodes(g).length:0) || 0);
  return `<article class="ho240f39SeriesRow ho240f38DragItem" draggable="true" data-series-drag-game="${esc(g.id)}" title="Tut ve yukarı/aşağı sürükle">
    <button class="ho240f39DragHandle ho240f38DragHandle" type="button" aria-label="Sürükle bırak" title="Bu alanı tutup sürükle">⠿<small>Sürükle</small></button>
    <span class="ho240f39OrderNo ho240f38OrderNo">${i+1}</span>
    <img src="${esc(coverFor(g))}" alt="${esc(g.title)}" onerror="this.style.display='none'">
    <div class="ho240f39SeriesInfo ho240f38DragInfo"><b>${esc(g.title)}</b><small>${esc(g.releaseDate || 'Tarih yok')} • ${esc(g.status || 'Devam Ediyor')} • ${Number(g.watchedEps||0)}/${eps} bölüm • %${typeof progressPercent==='function'?progressPercent(g):0}</small><div class="progressLine"><span style="width:${typeof progressPercent==='function'?progressPercent(g):0}%"></span></div></div>
    <label class="ho240f39OrderInput ho240f38OrderInput">Sıra<input data-series-order-game="${esc(g.id)}" type="number" min="1" value="${esc(String(g.seriesOrder || i+1))}"></label>
    <div class="ho240f39RowActions ho240f38RowActions"><button class="miniBtn" type="button" data-series-move-game="${esc(g.id)}" data-series-move-dir="-1">↑</button><button class="miniBtn" type="button" data-series-move-game="${esc(g.id)}" data-series-move-dir="1">↓</button><button class="miniBtn" type="button" data-watch-series="${esc(g.id)}">Sitede İzle</button><button class="miniBtn" type="button" data-game-edit="${esc(g.id)}">Düzenle</button></div>
  </article>`;
}
try{
  adminSeriesWatchPanel = function(){
    const groups = ho240f39Groups();
    const saved = state.ho240f39ActiveSeriesName || state.ho240f38ActiveSeriesName || localStorage.getItem('hayatimiz_active_series_drag_v239') || localStorage.getItem('hayatimiz_active_series_drag_v238') || localStorage.getItem('hayatimiz_fix35_active_series') || localStorage.getItem('hayatimiz_active_series_v217') || '';
    let activeName = groups.some(g=>g.name===saved) ? saved : (groups[0]?.name || '');
    const group = groups.find(g=>g.name===activeName) || groups[0] || { name:'Seri yok', items:[] };
    activeName = group.name;
    state.ho240f39ActiveSeriesName = activeName;
    state.ho240f38ActiveSeriesName = activeName;
    state.activeSeriesName = activeName;
    const stats = ho240f39Stats(group.items || []);
    const q = ho240f39SearchValue();
    return `<section class="ho240f39SeriesAdmin ho240f35SeriesAdmin">
      <div class="card wide ho240f39SeriesHero ho240f35SeriesHero">
        <div><span class="eyebrow">${HO240F39_INTERNAL_VERSION}</span><h2>Sürükle Bırak Seri Sıralama Merkezi</h2><p class="muted">Seriler üstte durur. Aşağıdaki oyun satırlarında soldaki <b>Sürükle</b> alanını tutup oyunu istediğin sıraya taşı. Kaydetmeden Supabase'e yazılmaz.</p></div>
        <div class="rowActions"><button class="btn" type="button" data-action="fix39-series-refresh">Yenile</button><button class="btn" type="button" data-action="renumber-active-series">1’den Başlat</button><button class="btn primary" type="button" data-action="save-series-orders">Seri Sırasını Kalıcı Kaydet</button></div>
      </div>
      <div class="card wide ho240f39SeriesToolbar ho240f35SeriesToolbar"><label class="search">🔎 <input id="ho240f39SeriesSearch" value="${esc(q)}" placeholder="Seri veya oyun ara..."></label><div class="ho240f35SeriesSummary"><span>${groups.length} seri</span><span>${(state.games||[]).length} oyun</span><span>${stats.watched}/${stats.totalEpisodes} bölüm</span><span>%${stats.percent} seçili ilerleme</span></div></div>
      <section class="card wide ho240f39SeriesRail ho240f35SeriesRail">${groups.map(g=>ho240f39SeriesTopCard(g, activeName)).join('') || '<p class="muted">Henüz seri bulunamadı.</p>'}</section>
      <section class="card wide ho240f39SeriesDetail ho240f35SeriesDetail">
        <div class="ho240f39DetailBanner ho240f35DetailBanner"><img src="${esc(coverFor(group.items[0] || {}))}" alt="${esc(group.name)}" onerror="this.style.display='none'"><div><span class="eyebrow">Seçili Seri</span><h2>${esc(group.name)}</h2><p class="muted">${group.items.length} oyun • ${stats.completed} tamamlanan • ${stats.totalEpisodes} toplam bölüm</p><div class="progressLine large"><span style="width:${Math.min(100,stats.percent)}%"></span></div></div><span class="pill green">%${stats.percent}</span></div>
        <div class="ho240f39DragHelp"><b>Nasıl sıralanır?</b> Soldaki pembe <b>⠿ Sürükle</b> kutusunu tut, oyunu başka satırın üstüne/altına bırak. İstersen ↑ ↓ butonlarıyla da taşıyabilirsin.</div>
        <div class="ho240f39DragList ho240f38DragList" data-series-drop-list="${esc(group.name)}">${(group.items || []).map((g,i)=>ho240f39DragRow(g,i)).join('') || '<p class="muted">Bu seride oyun yok.</p>'}</div>
      </section>
    </section>`;
  };
}catch(error){ console.warn('FIX39 seri izleme paneli kurulamadı:', error); }
try{
  const ho240f39PrevOnAction = typeof onAction === 'function' ? onAction : null;
  onAction = async function(e){
    const action = e.currentTarget?.dataset?.action || '';
    if(action === 'fix39-series-refresh'){
      e.preventDefault(); e.stopImmediatePropagation();
      render(); setToast('Sürükle bırak seri sıralama paneli yenilendi.'); return;
    }
    return ho240f39PrevOnAction ? await ho240f39PrevOnAction(e) : undefined;
  };
}catch(error){ console.warn('FIX39 onAction kurulamadı:', error); }
try{
  const ho240f39PrevBind = typeof bind === 'function' ? bind : null;
  bind = function(){
    try{ if(ho240f39PrevBind) ho240f39PrevBind(); }catch(err){ console.warn('FIX39 önceki bind atlandı:', err); }
    document.querySelectorAll('[data-fix39-series-select]').forEach(btn=>{
      if(btn.dataset.ho240f39Bound) return; btn.dataset.ho240f39Bound='1';
      btn.addEventListener('click', e=>{
        e.preventDefault(); e.stopImmediatePropagation();
        const name = btn.dataset.fix39SeriesSelect || '';
        state.ho240f39ActiveSeriesName = name; state.ho240f38ActiveSeriesName = name; state.activeSeriesName = name;
        try{ localStorage.setItem('hayatimiz_active_series_drag_v239', name); localStorage.setItem('hayatimiz_active_series_drag_v238', name); localStorage.setItem('hayatimiz_fix35_active_series', name); localStorage.setItem('hayatimiz_active_series_v217', name); }catch{}
        render();
      }, true);
    });
    const search = document.getElementById('ho240f39SeriesSearch');
    if(search && !search.dataset.ho240f39Bound){
      search.dataset.ho240f39Bound='1';
      search.addEventListener('input', e=>{ try{ localStorage.setItem('hayatimiz_fix39_series_search', e.target.value || ''); localStorage.setItem('hayatimiz_fix35_series_search', e.target.value || ''); }catch{} render(); });
    }
    document.querySelectorAll('.ho240f39DragHandle').forEach(handle=>{
      if(handle.dataset.ho240f39HandleBound) return; handle.dataset.ho240f39HandleBound='1';
      handle.addEventListener('mousedown', ()=>{ const row = handle.closest('[data-series-drag-game]'); if(row){ row.setAttribute('draggable','true'); } });
      handle.addEventListener('touchstart', ()=>{ const row = handle.closest('[data-series-drag-game]'); if(row){ row.setAttribute('draggable','true'); } }, {passive:true});
    });
  };
}catch(error){ console.warn('FIX39 bind kurulamadı:', error); }
try{
  if(Array.isArray(VERSION_NOTES_ARCHIVE) && !VERSION_NOTES_ARCHIVE.some(n=>n.version===HO240F39_INTERNAL_VERSION)){
    VERSION_NOTES_ARCHIVE.unshift({
      version:HO240F39_INTERNAL_VERSION,
      title:'Seri Sıralama Sürükle Bırak Görünür Düzeltmesi',
      summary:'Yönetim Paneli > Seri İzleme ekranındaki eski liste görünümü değiştirildi; satırlara görünür Sürükle alanı ve gerçek drag/drop bağlantısı eklendi.',
      image:'previews/hayatimiz-oyun-v240-fix39-seri-surukle-gorunur.png',
      written:'FIX39 ile kullanıcının ekranında görünen seri sıralama paneli de sürükle bırak motoruna bağlandı. Sıra değişiklikleri otomatik Supabase kaydı yapmaz; kalıcı kayıt için kaydet butonu kullanılır.'
    });
  }
  try{ localStorage.setItem('hayatimiz_last_fix_version', HO240F39_INTERNAL_VERSION); }catch{}
  if(document.getElementById('root')?.dataset?.mounted === '1') render();
}catch(error){ console.warn('FIX39 final render atlandı:', error); }

/* v2.4.0 FIX 40 - İzleyici için profesyonel seri durum ekranı
   - Seriler sayfasında kapak üstüne net durum rozeti eklendi: Devam Ediyor / Tamamlandı / Yakında.
   - Devam eden seriler izleyicilerin hemen görebileceği ayrı detaylı bölümde gösterilir.
   - Seri kartları kapak, oyun sayısı, bölüm ilerlemesi, sıradaki izlenecek oyun/bölüm ve hızlı izleme butonuyla yenilendi. */
const HO240F40_INTERNAL_VERSION = 'v2.4.0 FIX 40';
function ho240f40StatusText(value){ return String(value || '').toLocaleLowerCase('tr-TR').trim(); }
function ho240f40IsUpcoming(g){ const s = ho240f40StatusText(g?.status); return s.includes('yak') || s.includes('soon'); }
function ho240f40IsCompleted(g){
  const s = ho240f40StatusText(g?.status);
  if(s.includes('tamam') || s.includes('bitti') || s.includes('completed')) return true;
  const eps = Number(g?.eps || (typeof seriesEpisodes === 'function' ? seriesEpisodes(g).length : 0) || 0);
  const watched = Number(g?.watchedEps || 0);
  return eps > 0 && watched >= eps;
}
function ho240f40IsOngoing(g){
  const s = ho240f40StatusText(g?.status);
  if(s.includes('devam') || s.includes('aktif') || s.includes('ongoing')) return true;
  const eps = Number(g?.eps || (typeof seriesEpisodes === 'function' ? seriesEpisodes(g).length : 0) || 0);
  const watched = Number(g?.watchedEps || 0);
  return eps > 0 && watched > 0 && watched < eps;
}
function ho240f40GroupStats(group){
  const items = Array.isArray(group?.items) ? group.items : [];
  const games = items.length;
  const totalEps = items.reduce((s,g)=>s+Number(g.eps || (typeof seriesEpisodes === 'function' ? seriesEpisodes(g).length : 0) || 0),0);
  const watched = items.reduce((s,g)=>s+Number(g.watchedEps || 0),0);
  const completedGames = items.filter(ho240f40IsCompleted).length;
  const upcomingGames = items.filter(ho240f40IsUpcoming).length;
  const ongoingGames = items.filter(ho240f40IsOngoing).length;
  const average = games ? Math.round(items.reduce((s,g)=>s+(typeof progressPercent === 'function' ? progressPercent(g) : 0),0)/games) : 0;
  const percent = totalEps ? Math.round((watched / Math.max(totalEps,1)) * 100) : average;
  let key = 'archive', label = 'Arşiv', tone = 'neutral';
  if(games && upcomingGames === games){ key = 'upcoming'; label = 'Yakında'; tone = 'blue'; }
  else if(games && (completedGames === games || percent >= 100)){ key = 'completed'; label = 'Tamamlandı'; tone = 'green'; }
  else if(ongoingGames || (watched > 0 && watched < totalEps) || items.some(g=>ho240f40StatusText(g.status).includes('devam'))){ key = 'ongoing'; label = 'Devam Ediyor'; tone = 'pink'; }
  return {games,totalEps,watched,completedGames,upcomingGames,ongoingGames,percent:Math.max(0,Math.min(100,percent || 0)),key,label,tone};
}
function ho240f40NextItem(group){
  const items = Array.isArray(group?.items) ? group.items : [];
  return items.find(g=>!ho240f40IsCompleted(g) && !ho240f40IsUpcoming(g)) || items.find(g=>ho240f40IsOngoing(g)) || items[0] || {};
}
function ho240f40SeriesStatusBadge(stats){ return `<span class="ho240f40StatusBadge ${esc(stats.tone)}">${esc(stats.label)}</span>`; }
function ho240f40SeriesMiniList(items=[]){
  return `<div class="ho240f40SeriesMiniList">${items.slice(0,5).map(g=>`<span><img src="${esc(typeof fix10Cover==='function'?fix10Cover(g):coverFor(g))}" alt=""><b>${esc(g.title)}</b><small>${esc(g.status || '')}</small></span>`).join('')}${items.length>5?`<em>+${items.length-5} oyun</em>`:''}</div>`;
}
function ho240f40SeriesCard(group){
  const first = group.items?.[0] || {};
  const next = ho240f40NextItem(group);
  const stats = ho240f40GroupStats(group);
  const descRaw = first.description || group.items.map(g=>g.title).join(', ') || 'Bu serideki oyunları sırasıyla takip edebilirsin.';
  const max = 145;
  const disabled = stats.key === 'upcoming';
  return `<article class="v221SeriesCard ho240f40SeriesCard ${esc(stats.key)}">
    <div class="v221SeriesCover ho240f40SeriesCover">
      <img src="${esc(typeof fix10Cover==='function'?fix10Cover(first):coverFor(first))}" alt="${esc(group.name)}">
      ${ho240f40SeriesStatusBadge(stats)}
      <span class="ho240f40CoverCount">${stats.games} oyun</span>
    </div>
    <div class="v221SeriesBody ho240f40SeriesBody">
      <div class="ho240f40TitleRow"><h3>${esc(group.name)}</h3><b>%${stats.percent}</b></div>
      <p>${esc(String(descRaw).slice(0,max))}${String(descRaw).length>max?'...':''}</p>
      ${ho240f40SeriesMiniList(group.items || [])}
      <div class="ho240f40MetaGrid"><span><b>${stats.games}</b><small>Oyun</small></span><span><b>${stats.watched}/${stats.totalEps}</b><small>Bölüm</small></span><span><b>${esc(next.title || '-')}</b><small>Sıradaki</small></span></div>
      <div class="progressLine"><span style="width:${stats.percent}%"></span></div>
      <div class="v221Actions ho240f40Actions">${disabled?'<button class="miniBtn v221Disabled" disabled>Yakında</button>':`<button class="miniBtn primary" data-watch-series="${esc(next.id || first.id || '')}">Seriyi İzle</button>`}${isStaff()?'<button class="miniBtn" data-admin="Seri İzleme">Sırala</button>':''}</div>
    </div>
  </article>`;
}
function ho240f40OngoingCard(group){
  const first = group.items?.[0] || {};
  const next = ho240f40NextItem(group);
  const stats = ho240f40GroupStats(group);
  const remaining = Math.max(0, stats.totalEps - stats.watched);
  return `<article class="ho240f40OngoingCard">
    <div class="ho240f40OngoingCover"><img src="${esc(typeof fix10Cover==='function'?fix10Cover(first):coverFor(first))}" alt="${esc(group.name)}">${ho240f40SeriesStatusBadge(stats)}</div>
    <div class="ho240f40OngoingBody">
      <div class="ho240f40OngoingTop"><div><span class="eyebrow">Devam Eden Seri</span><h3>${esc(group.name)}</h3></div><span class="pill green">%${stats.percent}</span></div>
      <p>${esc((first.description || 'Bu seri devam ediyor. İzleyiciler hangi serinin aktif olduğunu bu alandan hızlıca görebilir.').slice(0,190))}${String(first.description || '').length>190?'...':''}</p>
      <div class="ho240f40MetaGrid detail"><span><b>${stats.games}</b><small>Oyun</small></span><span><b>${stats.watched}/${stats.totalEps}</b><small>İzlenen bölüm</small></span><span><b>${remaining}</b><small>Kalan bölüm</small></span><span><b>${esc(next.title || '-')}</b><small>Sıradaki kayıt</small></span></div>
      <div class="progressLine large"><span style="width:${stats.percent}%"></span></div>
      <div class="ho240f40OngoingGames">${group.items.slice(0,6).map((g,i)=>`<button type="button" data-watch-series="${esc(g.id)}"><img src="${esc(typeof fix10Cover==='function'?fix10Cover(g):coverFor(g))}" alt=""><span><b>${i+1}. ${esc(g.title)}</b><small>${Number(g.watchedEps||0)}/${Number(g.eps||0)} bölüm • ${esc(g.status || 'Arşiv')}</small></span></button>`).join('')}</div>
      <div class="rowActions"><button class="btn primary" data-watch-series="${esc(next.id || first.id || '')}">Devam Eden Seriyi İzle</button><button class="btn" data-page="Seriler">Tüm Seriler</button></div>
    </div>
  </article>`;
}
function ho240f40StatusSummary(groups=[]){
  const counts = groups.reduce((acc,g)=>{ const k=ho240f40GroupStats(g).key; acc[k]=(acc[k]||0)+1; return acc; },{});
  return `<div class="ho240f40StatusSummary"><span><b>${counts.ongoing||0}</b><small>Devam eden</small></span><span><b>${counts.completed||0}</b><small>Tamamlanan</small></span><span><b>${counts.upcoming||0}</b><small>Yakında</small></span><span><b>${groups.length}</b><small>Toplam seri</small></span></div>`;
}
try{
  v221SeriesCard = ho240f40SeriesCard;
  fix12SeriesCard = ho240f40SeriesCard;
  fix13SeriesCard = ho240f40SeriesCard;
  seriesDirectoryPage = function(){
    const status = typeof fix12SelectedSeriesStatus === 'function' ? fix12SelectedSeriesStatus() : (state.page || 'Seriler');
    const q = typeof normalizeSearchText === 'function' ? normalizeSearchText(state.query || '') : String(state.query || '').toLowerCase();
    const sourceGames = Array.isArray(state.games) ? state.games : [];
    const baseGames = sourceGames
      .filter(g=> typeof fix13GameMatchesStrictStatus === 'function' ? fix13GameMatchesStrictStatus(g, status) : true)
      .filter(g=>!q || (typeof normalizeSearchText === 'function' ? normalizeSearchText(allGameText(g)).includes(q) : String(allGameText(g)).toLowerCase().includes(q)));
    const groups = (typeof sortedSeriesGroups === 'function' ? sortedSeriesGroups(baseGames) : []).sort((a,b)=>a.name.localeCompare(b.name,'tr'));
    const ongoingGroups = groups.filter(g=>ho240f40GroupStats(g).key === 'ongoing');
    const letterGroups = typeof fix11Grouped === 'function' ? fix11Grouped(groups, g=>g.name) : [];
    return `<section class="fix12SeriesPage v221SeriesPage ho240f40SeriesPage">
      <div class="seriesDirectoryHero ho240f40Hero"><div><span class="eyebrow">İzleyici Seri Durumu</span><h1>Seriler</h1><p>Kapakların üzerinde seri durumu görünür. Devam eden seriler üstte detaylı gösterilir; izleyici hangi serilerin aktif olduğunu tek ekrandan görür.</p></div>${ho240f40StatusSummary(groups)}</div>
      ${typeof fix12SeriesStatusTabs === 'function' ? fix12SeriesStatusTabs(status) : ''}
      ${typeof v221ViewTools === 'function' ? v221ViewTools() : ''}
      ${ongoingGroups.length ? `<section class="ho240f40OngoingSection"><div class="sectionHead"><div><span class="eyebrow">Aktif Takip</span><h2>Devam Eden Seriler</h2><p class="muted">İzleyicilerin hangi serilerin sürdüğünü göreceği detaylı alan.</p></div><span class="pill green">${ongoingGroups.length} aktif seri</span></div><div class="ho240f40OngoingGrid">${ongoingGroups.map(ho240f40OngoingCard).join('')}</div></section>` : ''}
      ${typeof fix11AlphabetBar === 'function' ? fix11AlphabetBar(letterGroups,'seri-harf') : ''}
      <div class="v221AlphabetSections ho240f40AlphabetSections">${letterGroups.map(group=>`<section class="fix12LetterSection v221LetterSection ho240f40LetterSection" id="seri-harf-${group.letter==='0-9'?'num':esc(routeSlug(group.letter))}"><div class="fix11LetterHead"><div><span>${esc(group.letter)}</span><h2>${esc(group.letter)} Harfindeki Seriler</h2></div><b>${group.items.length} seri</b></div><div class="v221ArchiveGrid series compact ho240f40SeriesGrid">${group.items.map(ho240f40SeriesCard).join('')}</div></section>`).join('') || '<section class="card wide"><h2>Seri bulunamadı</h2><p class="muted">Bu filtrede seri yok veya Supabase kayıtları henüz yüklenmedi.</p></section>'}</div>
    </section>`;
  };
}catch(error){ console.warn('FIX40 seri durum ekranı kurulamadı:', error); }
try{
  if(Array.isArray(VERSION_NOTES_ARCHIVE) && !VERSION_NOTES_ARCHIVE.some(n=>n.version===HO240F40_INTERNAL_VERSION)){
    VERSION_NOTES_ARCHIVE.unshift({
      version:HO240F40_INTERNAL_VERSION,
      title:'İzleyici Seri Durumu ve Devam Eden Seriler Ekranı',
      summary:'Seri kartlarına kapak üstü Tamamlandı / Devam Ediyor / Yakında rozeti eklendi. Devam eden seriler üstte detaylı izleyici alanında gösterilir.',
      image:'previews/hayatimiz-oyun-v240-fix40-seri-durum-ekrani.png',
      written:'FIX40 ile Seriler sayfası izleyici odaklı yenilendi. Kapaklarda durum rozeti görünür, aktif/devam eden seriler üstte detaylı kartlarla listelenir ve tüm seri kartlarında ilerleme, bölüm sayısı ve sıradaki kayıt net gösterilir.'
    });
  }
  try{ localStorage.setItem('hayatimiz_last_fix_version', HO240F40_INTERNAL_VERSION); }catch{}
  if(document.getElementById('root')?.dataset?.mounted === '1') render();
}catch(error){ console.warn('FIX40 final render atlandı:', error); }

/* v2.4.0 FIX 41 - Oyun formu kapak/tarih/tür ayrı çekme butonları
   - Oyun Ekle / Mevcut Oyunu Düzenle alt aksiyon barına Kapakları Getir, Çıkış Tarihini Tekrar Çek ve Türleri Tekrar Çek eklendi.
   - Bu butonlar sadece açık formu doldurur; Oyunu Kaydet / Oyunu Güncelle demeden Supabase'e kayıt yapmaz.
   - Kapak arama RAWG + Steam + internet/Google benzeri görsel havuzu + yerel DLC katalog adaylarını birleştirir. */
const HO240F41_INTERNAL_VERSION = 'v2.4.0 FIX 41';
function ho240f41CurrentForm(source){
  return source?.closest?.('form') || document.getElementById(state.editingGameId ? 'gameEditForm' : 'gameAddForm') || document.querySelector('#gameEditForm,#gameAddForm,form.gameForm');
}
function ho240f41Title(form){ return String(form?.elements?.title?.value || '').trim(); }
function ho240f41Capture(form){
  try{ if(typeof ho240f10CaptureForm === 'function') ho240f10CaptureForm(form); else if(typeof saveGameDraftFromForm === 'function') saveGameDraftFromForm(form); }catch{}
}
function ho240f41Patch(form, patch={}, shouldRender=true){
  if(!form || !patch) return;
  const currentTitle = ho240f41Title(form);
  const cleanPatch = { ...patch };
  delete cleanPatch.title;
  try{
    if(typeof ho240f10PatchForm === 'function') ho240f10PatchForm(form, cleanPatch);
    else Object.entries(cleanPatch).forEach(([k,v])=>{ if(form.elements?.[k] && v !== undefined) form.elements[k].value = String(v ?? ''); });
  }catch{
    Object.entries(cleanPatch).forEach(([k,v])=>{ if(form.elements?.[k] && v !== undefined) form.elements[k].value = String(v ?? ''); });
  }
  if(form.elements?.title && currentTitle) form.elements.title.value = currentTitle;
  if(cleanPatch.cover){
    form.querySelectorAll('.coverPreview img,.fix26CoverMiniPreview img,.fix26PreviewCover img,.fix12CoverPreview img,.fix11CoverPreview img').forEach(img=>{ img.src = cleanPatch.cover; });
  }
  ho240f41Capture(form);
  if(shouldRender){
    try{ if(typeof ho240f26MarkStableScroll === 'function') ho240f26MarkStableScroll(); }catch{}
    render();
  }
}
function ho240f41NormalizeDate(value=''){
  try{ return typeof ho240f10Date === 'function' ? ho240f10Date(value) : (typeof normalizeReleaseDate === 'function' ? normalizeReleaseDate(value) : String(value || '')); }
  catch{ return String(value || ''); }
}
async function ho240f41ApiGameMeta(title){
  try{ return await api('game-meta', { adminToken:state.session?.adminToken, title, coverSearch:true, providers:['rawg','steam','internet','google-like','local-dlc'], fix:'41' }); }
  catch(error){ console.warn('FIX41 game-meta alınamadı:', error); return null; }
}
function ho240f41CandidateFromMeta(title, data){
  const meta = data?.meta || {};
  const list = [];
  const push = (c, source='Meta')=>{
    if(!c) return;
    const cover = String(c.cover || c.cover_url || '').trim();
    list.push({
      title:String(c.title || c.name || meta.title || title).trim(),
      seriesName:c.seriesName || c.series_name || meta.seriesName || meta.series_name || '',
      genre:c.genre || meta.genre || '',
      tags:c.tags || c.genre || meta.genre || '',
      releaseDate:ho240f41NormalizeDate(c.releaseDate || c.released || meta.releaseDate || meta.released || ''),
      released:ho240f41NormalizeDate(c.releaseDate || c.released || meta.releaseDate || meta.released || ''),
      score:c.score || meta.score || 8.5,
      cover,
      description:c.description || c.story || meta.description || meta.story || '',
      source:c.source || source,
      matchScore:Number(c.matchScore || (typeof ho240f35Score === 'function' ? ho240f35Score(title, c.title || meta.title || title) : 80))
    });
  };
  push(meta, 'API ana meta');
  (Array.isArray(data?.candidates) ? data.candidates : []).forEach(c=>push(c, c?.source || 'API kapak/tarih adayı'));
  return list;
}
function ho240f41MergeCandidates(list=[]){
  const base = (Array.isArray(list) ? list : []).filter(Boolean);
  if(typeof ho240f37MergeCoverCandidates === 'function') return ho240f37MergeCoverCandidates(base).slice(0,90);
  const seen = new Set();
  return base.filter(c=>{
    const cover = String(c.cover || '').trim();
    if(!cover) return false;
    const id = `${String(c.title||'').toLocaleLowerCase('tr-TR')}|${String(c.releaseDate||c.released||'')}|${cover.toLowerCase().replace(/\?.*$/,'')}`;
    if(seen.has(id)) return false;
    seen.add(id);
    return true;
  }).sort((a,b)=>Number(b.matchScore||0)-Number(a.matchScore||0)).slice(0,90);
}
async function ho240f41BuildCoverList(title){
  const local = [];
  try{ if(typeof ho240f37ExpandedAlanWakeCandidates === 'function') local.push(...ho240f37ExpandedAlanWakeCandidates(title)); }catch{}
  try{ if(typeof ho240f36ExpandedAlanWakeCandidates === 'function') local.push(...ho240f36ExpandedAlanWakeCandidates(title)); }catch{}
  try{ if(typeof ho240f35LocalCoverCandidates === 'function') local.push(...ho240f35LocalCoverCandidates(title)); }catch{}
  const data = await ho240f41ApiGameMeta(title);
  const remote = ho240f41CandidateFromMeta(title, data);
  return ho240f41MergeCandidates([...local, ...remote]);
}
async function ho240f41FindCovers(form){
  if(!form) return setToast('Önce Oyun Ekle veya Mevcut Oyunu Düzenle formunu aç.');
  const title = ho240f41Title(form);
  if(!title) return setToast('Önce oyun adını yaz.');
  try{ if(typeof ho240f26MarkStableScroll === 'function') ho240f26MarkStableScroll(); }catch{}
  ho240f41Capture(form);
  setToast('Kapaklar Steam / RAWG / internet / yerel DLC havuzundan aranıyor...');
  let list = await ho240f41BuildCoverList(title);
  if(!list.length){
    list = [{ title, seriesName:getFormValue(form,'seriesName') || '', genre:getFormValue(form,'genre') || 'Genel, Hikaye Odaklı', tags:getFormValue(form,'tags') || '', releaseDate:getFormValue(form,'releaseDate') || '', score:getFormValue(form,'score') || 8.5, cover:(typeof ho240f35SafeCoverFallback==='function'?ho240f35SafeCoverFallback(title):'/assets/hayatimiz-kapak.png'), source:'Geçici güvenli kapak', matchScore:55 }];
  }
  state.ho240f11CoverCandidates = list;
  state.ho240f10CoverCandidates = list;
  const first = list[0] || {};
  const patch = {
    seriesName:getFormValue(form,'seriesName') || first.seriesName || '',
    genre:getFormValue(form,'genre') || first.genre || '',
    tags:getFormValue(form,'tags') || first.tags || first.genre || '',
    releaseDate:getFormValue(form,'releaseDate') || first.releaseDate || first.released || '',
    score:getFormValue(form,'score') || first.score || 8.5,
    description:getFormValue(form,'description') || first.description || first.story || ''
  };
  if(!String(getFormValue(form,'cover') || '').trim()) patch.cover = first.cover || '';
  ho240f41Patch(form, patch, true);
  setToast(`${list.length} kapak adayı hazırlandı. Oyun adı korunur; doğru kapağı seçip Kaydet/Güncelle yap.`);
}
async function ho240f41RefetchRelease(form){
  if(!form) return setToast('Önce oyun formunu aç.');
  const title = ho240f41Title(form);
  if(!title) return setToast('Önce oyun adını yaz.');
  try{ if(typeof ho240f26MarkStableScroll === 'function') ho240f26MarkStableScroll(); }catch{}
  ho240f41Capture(form);
  setToast('Çıkış tarihi tekrar çekiliyor...');
  const data = await ho240f41ApiGameMeta(title);
  const candidates = ho240f41CandidateFromMeta(title, data);
  const release = ho240f41NormalizeDate(data?.meta?.releaseDate || data?.meta?.released || candidates.find(c=>c.releaseDate || c.released)?.releaseDate || candidates.find(c=>c.releaseDate || c.released)?.released || '');
  if(!release) return setToast('Çıkış tarihi bulunamadı. Manuel yazabilirsin.');
  ho240f41Patch(form, { releaseDate:release }, true);
  setToast(`Çıkış tarihi forma yazıldı: ${release}. Kayıt için Oyunu Kaydet/Güncelle.`);
}
async function ho240f41RefetchGenres(form){
  if(!form) return setToast('Önce oyun formunu aç.');
  const title = ho240f41Title(form);
  if(!title) return setToast('Önce oyun adını yaz.');
  try{ if(typeof ho240f26MarkStableScroll === 'function') ho240f26MarkStableScroll(); }catch{}
  ho240f41Capture(form);
  setToast('Türler tekrar çekiliyor...');
  let genre = '';
  try{
    const data = await api('game-genres', { adminToken:state.session?.adminToken, title, fix:'41' });
    genre = data?.genre || '';
  }catch(error){ console.warn('FIX41 game-genres alınamadı:', error); }
  if(!genre){
    const meta = await ho240f41ApiGameMeta(title);
    genre = meta?.meta?.genre || ho240f41CandidateFromMeta(title, meta).find(c=>c.genre)?.genre || '';
  }
  if(!genre && typeof ho240f34GenreFromTitle === 'function') genre = ho240f34GenreFromTitle(title);
  if(!genre) genre = 'Genel, Hikaye Odaklı';
  ho240f41Patch(form, { genre, tags:genre }, true);
  setToast(`Türler forma yazıldı: ${genre}. Kayıt için Oyunu Kaydet/Güncelle.`);
}
function ho240f41ActionBarHtml(mode='add'){
  const isEdit = mode === 'edit';
  const playlistAction = isEdit ? 'estimate-playlist-episodes-edit' : 'estimate-playlist-episodes';
  const metaAction = isEdit ? 'auto-game-meta-edit' : 'auto-game-meta';
  return `<div class="fix26ActionBar ho240f41ActionBar">
    <button class="btn" type="button" data-action="${isEdit?'close-game-edit':'fix26-clear-game-form'}">${isEdit?'Listeye Dön':'Formu Temizle'}</button>
    <button class="btn primary softPrimary" type="button" data-action="ho240f41-find-covers">Kapakları Getir</button>
    <button class="btn" type="button" data-action="ho240f41-refetch-release">Çıkış Tarihini Tekrar Çek</button>
    <button class="btn" type="button" data-action="ho240f41-refetch-genres">Türleri Tekrar Çek</button>
    <button class="btn" type="button" data-action="${metaAction}">Meta + Kapak Çek</button>
    <button class="btn" type="button" data-action="${playlistAction}">Playlist Bölümleri Çek</button>
    <button class="btn primary" type="submit">${isEdit?'Oyunu Güncelle':'Oyunu Kaydet'}</button>
  </div>`;
}
try{
  const ho240f41PrevFormFields = typeof ho240f26FormFields === 'function' ? ho240f26FormFields : (typeof gameFormFields === 'function' ? gameFormFields : null);
  ho240f26FormFields = function(d={}, mode='add'){
    let html = ho240f41PrevFormFields ? ho240f41PrevFormFields(d, mode) : '';
    const start = html.indexOf('<div class="fix26ActionBar"');
    if(start >= 0){
      const tail = html.indexOf('</div>\n      </section>', start);
      if(tail >= 0){ html = html.slice(0,start) + ho240f41ActionBarHtml(mode) + html.slice(tail + 6); }
    }
    html = html.replace('Oyun Ekle / Mevcut Oyunu Düzenle</h2><p class="muted">Çek, seç, kaydet işlemleri sayfayı yukarı fırlatmadan çalışır. Yayınlamadan önce localde test etmek için 03-VSCode-Localhost-Onizleme.bat kullan.</p>', 'Oyun Ekle / Mevcut Oyunu Düzenle</h2><p class="muted">Kapak, çıkış tarihi ve türleri ayrı ayrı çekebilirsin. Hiçbiri Kaydet/Güncelle demeden Supabase\'e yazmaz.</p>');
    return html;
  };
  gameFormFields = ho240f26FormFields;
  gameAddForm = function(){ const d = { ...DEFAULT_GAME_DRAFT, ...(state.gameDraft || {}) }; return `<form class="card soft gameForm fix26GameForm" id="gameAddForm" autocomplete="off">${ho240f26FormFields(d,'add')}</form>`; };
  gameEditForm = function(){ const current = (Array.isArray(state.games)?state.games:[]).find(g=>String(g.id)===String(state.editingGameId)); if(!current) return ''; return `<form class="card soft gameForm editGameForm fix26GameForm" id="gameEditForm" autocomplete="off">${ho240f26FormFields(current,'edit')}</form>`; };
}catch(error){ console.warn('FIX41 form butonları kurulamadı:', error); }
try{
  const ho240f41PrevPickCover = typeof ho240f11PickCover === 'function' ? ho240f11PickCover : null;
  ho240f11PickCover = function(index){
    const form = document.getElementById(state.editingGameId ? 'gameEditForm' : 'gameAddForm') || document.querySelector('form.gameForm');
    const c = (state.ho240f11CoverCandidates || state.ho240f10CoverCandidates || [])[Number(index)];
    if(!form || !c) return ho240f41PrevPickCover ? ho240f41PrevPickCover(index) : setToast('Kapak seçilemedi.');
    const currentTitle = ho240f41Title(form);
    ho240f41Patch(form, {
      cover:c.cover || '',
      seriesName:getFormValue(form,'seriesName') || c.seriesName || '',
      genre:getFormValue(form,'genre') || c.genre || '',
      tags:getFormValue(form,'tags') || c.tags || c.genre || '',
      releaseDate:c.releaseDate || c.released || getFormValue(form,'releaseDate') || '',
      score:getFormValue(form,'score') || c.score || 8.5,
      description:getFormValue(form,'description') || c.description || c.story || ''
    }, true);
    const newForm = document.getElementById(state.editingGameId ? 'gameEditForm' : 'gameAddForm') || form;
    if(newForm.elements?.title && currentTitle) newForm.elements.title.value = currentTitle;
    setToast('Seçilen kapak, çıkış tarihi ve tür bilgisi forma işlendi. Kayıt için Kaydet/Güncelle butonuna bas.');
  };
}catch(error){ console.warn('FIX41 kapak seçme kurulamadı:', error); }
try{
  const ho240f41PrevOnAction = typeof onAction === 'function' ? onAction : null;
  onAction = async function(e){
    const action = e.currentTarget?.dataset?.action || '';
    if(['ho240f41-find-covers','ho240f11-find-covers','ho240f10-find-covers','ho240f36-find-covers','ho240f37-find-covers'].includes(action)){
      e.preventDefault(); e.stopImmediatePropagation();
      await ho240f41FindCovers(ho240f41CurrentForm(e.currentTarget));
      return;
    }
    if(action === 'ho240f41-refetch-release'){
      e.preventDefault(); e.stopImmediatePropagation();
      await ho240f41RefetchRelease(ho240f41CurrentForm(e.currentTarget));
      return;
    }
    if(action === 'ho240f41-refetch-genres'){
      e.preventDefault(); e.stopImmediatePropagation();
      await ho240f41RefetchGenres(ho240f41CurrentForm(e.currentTarget));
      return;
    }
    return ho240f41PrevOnAction ? await ho240f41PrevOnAction(e) : undefined;
  };
}catch(error){ console.warn('FIX41 onAction kurulamadı:', error); }
try{
  if(Array.isArray(VERSION_NOTES_ARCHIVE) && !VERSION_NOTES_ARCHIVE.some(n=>n.version===HO240F41_INTERNAL_VERSION)){
    VERSION_NOTES_ARCHIVE.unshift({
      version:HO240F41_INTERNAL_VERSION,
      title:'Oyun Formu Kapak / Çıkış Tarihi / Tür Butonları',
      summary:'Oyun Ekle ve Mevcut Oyunu Düzenle alt barına Kapakları Getir, Çıkış Tarihini Tekrar Çek ve Türleri Tekrar Çek butonları eklendi.',
      image:'previews/hayatimiz-oyun-v240-fix41-oyun-form-kapak-tarih-tur.png',
      written:'FIX41 ile kapak, tarih ve tür çekme işlemleri ayrı butonlara ayrıldı. Steam, RAWG, internet görsel havuzu ve yerel DLC katalog adayları birlikte kullanılır; hiçbir çekme işlemi Kaydet/Güncelle olmadan Supabase kaydı yapmaz.'
    });
  }
  try{ localStorage.setItem('hayatimiz_last_fix_version', HO240F41_INTERNAL_VERSION); }catch{}
  if(document.getElementById('root')?.dataset?.mounted === '1') render();
}catch(error){ console.warn('FIX41 final render atlandı:', error); }

/* v2.4.0 FIX 42 - Tam temizlik + profesyonel yönetim + kapak/tarih/tür/açıklama çekme stabilizasyonu
   - Önceden 'olmalı' denilen kritik modüller eklendi: dashboard, içerik kontrol paneli, profesyonel oyun formu, gelişmiş kapak seçici, istek/hata takip alanı.
   - Çıkış tarihi çekme ayrı API ve yerel kesin katalog ile güçlendirildi.
   - AI/Deploy/Redeploy kalıntıları yine kullanıcı arayüzünden kaldırılır. */
const HO240F42_INTERNAL_VERSION = 'v2.4.0 FIX 42';
const HO240F42_PUBLIC_VERSION = (typeof ho240f24Version === 'function' ? ho240f24Version() : (localStorage.getItem('hayatimiz_last_public_version') || 'v2.4.1'));
const HO240F42_CLEAN_ADMIN_LINKS = [
  ['Genel Bakış','Profesyonel özet'],['İçerik Kontrol','Eksik alan kontrolü'],['Oyunlar','Oyun ekle/düzenle'],['Seri İzleme','Sıra ve playlist'],['Seri Geçmişi','Karşılaştır / geri al'],['Yayın Takvimi','Takvim görünümü'],['Bildirim Kuyruğu','Tarayıcı/e-posta'],['Oyun İstekleri','Gelen istekler'],['Hata Bildir','Gelen hatalar'],['Raporlar','Filtre/dışa aktar'],['Bakım Modu','Bakım ekranı'],['Güncelleme Notları','Sürüm notları'],['Kullanıcı Yetkileri','Rol ve yetkiler'],['Profil','Profil bilgileri'],['Ayarlar','Tema/tercihler']
];
function ho240f42Norm(value=''){
  return String(value || '').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’']/g,'').replace(/[^a-z0-9ğüşöçıİ\s:.-]/gi,' ').replace(/\s+/g,' ').trim();
}
function ho240f42Date(value=''){
  try{ if(typeof ho240f41NormalizeDate === 'function'){ const d = ho240f41NormalizeDate(value); if(/^\d{2}\.\d{2}\.\d{4}$/.test(d)) return d; } }catch{}
  const raw = String(value || '').trim();
  if(!raw) return '';
  const iso = raw.match(/(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if(iso) return `${iso[3].padStart(2,'0')}.${iso[2].padStart(2,'0')}.${iso[1]}`;
  const tr = raw.match(/(\d{1,2})[./-](\d{1,2})[./-](\d{4})/);
  if(tr) return `${tr[1].padStart(2,'0')}.${tr[2].padStart(2,'0')}.${tr[3]}`;
  return '';
}
const HO240F42_FRONT_CATALOG = [
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
function ho240f42MatchLocal(query=''){
  const q = ho240f42Norm(query);
  let best = null, score = 0;
  for(const row of HO240F42_FRONT_CATALOG){
    for(const key of row.keys || []){
      const k = ho240f42Norm(key);
      let s = q === k ? 100 : (q.includes(k) || k.includes(q) ? Math.min(96, 68 + Math.min(q.length,k.length)) : 0);
      if(!s){ const words = k.split(' ').filter(w=>w.length>2); const hit = words.filter(w=>q.includes(w)).length; s = words.length ? Math.round((hit/words.length)*72) : 0; }
      if(s > score){ score = s; best = row; }
    }
  }
  return best && score >= 60 ? { ...best, matchScore:score } : null;
}
function ho240f42LocalCandidates(query=''){
  const q = ho240f42Norm(query);
  const exact = ho240f42MatchLocal(query);
  const family = q.includes('alan wake') || q.includes('night springs') || q.includes('lake house') || q.includes('writer') || q.includes('signal') || q.includes('american nightmare');
  const pool = family ? HO240F42_FRONT_CATALOG.filter(x=>x.seriesName==='Alan Wake') : (exact ? [exact] : []);
  const out = [];
  for(const row of pool){
    const base = exact && row.title === exact.title ? 100 : (family ? 86 : 70);
    (row.covers || [row.cover]).filter(Boolean).forEach((cover,index)=>out.push({
      ...row,
      requestedTitle:String(query || '').trim(),
      title:row.title,
      cover,
      released:row.releaseDate,
      source:`FIX42 yerel katalog • ${row.type || 'Oyun'}${index ? ' • alternatif' : ''}`,
      matchScore:Math.max(52, base-index),
      description:typeof fix12DetailedStory === 'function' ? fix12DetailedStory(String(query || row.title), row.genre) : `${String(query || row.title)} için arşiv bilgisi.`
    }));
  }
  return out;
}
function ho240f42Form(source){ return source?.closest?.('form') || document.getElementById(state.editingGameId ? 'gameEditForm' : 'gameAddForm') || document.querySelector('#gameEditForm,#gameAddForm,form.gameForm'); }
function ho240f42Title(form){ return String(form?.elements?.title?.value || '').trim(); }
function ho240f42Patch(form, patch={}, shouldRender=true){
  if(!form || !patch) return;
  const title = ho240f42Title(form);
  const clean = { ...patch };
  delete clean.title;
  delete clean.name;
  try{ if(typeof ho240f41Patch === 'function') ho240f41Patch(form, clean, false); else if(typeof ho240f10PatchForm === 'function') ho240f10PatchForm(form, clean); else Object.entries(clean).forEach(([k,v])=>{ if(form.elements?.[k] && v !== undefined) form.elements[k].value = String(v ?? ''); }); }catch{ Object.entries(clean).forEach(([k,v])=>{ if(form.elements?.[k] && v !== undefined) form.elements[k].value = String(v ?? ''); }); }
  if(form.elements?.title && title) form.elements.title.value = title;
  try{ if(typeof ho240f41Capture === 'function') ho240f41Capture(form); else if(typeof ho240f10CaptureForm === 'function') ho240f10CaptureForm(form); else if(typeof saveGameDraftFromForm === 'function') saveGameDraftFromForm(form); }catch{}
  if(shouldRender){ try{ if(typeof ho240f26MarkStableScroll === 'function') ho240f26MarkStableScroll(); }catch{} render(); }
}
function ho240f42MergeCandidates(list=[]){
  const seen = new Set();
  return (Array.isArray(list) ? list : []).map(c=>({
    ...c,
    title:String(c?.title || c?.name || '').trim(),
    cover:String(c?.cover || c?.cover_url || c?.background_image || '').trim(),
    releaseDate:ho240f42Date(c?.releaseDate || c?.released || c?.release_date || ''),
    released:ho240f42Date(c?.releaseDate || c?.released || c?.release_date || ''),
    matchScore:Number(c?.matchScore || c?.match || 70)
  })).filter(c=>{
    if(!c.cover) return false;
    const id = `${ho240f42Norm(c.title)}|${c.releaseDate}|${c.cover.toLowerCase().replace(/\?.*$/,'')}`;
    if(seen.has(id)) return false;
    seen.add(id); return true;
  }).sort((a,b)=>Number(b.matchScore||0)-Number(a.matchScore||0)).slice(0,140);
}
async function ho240f42Meta(title){
  try{ return await api('game-meta', { adminToken:state.session?.adminToken, title, coverSearch:true, fix:'42' }); }
  catch(error){ console.warn('FIX42 game-meta alınamadı:', error); return null; }
}
async function ho240f42BuildCovers(title){
  const local = ho240f42LocalCandidates(title);
  const remoteData = await ho240f42Meta(title);
  const remote = [];
  if(remoteData?.meta) remote.push({ ...remoteData.meta, source:remoteData.source || remoteData.meta.source || 'FIX42 API meta' });
  (Array.isArray(remoteData?.candidates) ? remoteData.candidates : []).forEach(c=>remote.push({ ...c, source:c.source || 'FIX42 API aday' }));
  const old = [];
  try{ if(typeof ho240f37ExpandedAlanWakeCandidates === 'function') old.push(...ho240f37ExpandedAlanWakeCandidates(title)); }catch{}
  try{ if(typeof ho240f35LocalCoverCandidates === 'function') old.push(...ho240f35LocalCoverCandidates(title)); }catch{}
  return ho240f42MergeCandidates([...local, ...remote, ...old]);
}
async function ho240f42FindCovers(form){
  if(!form) return setToast('Önce Oyun Ekle veya Mevcut Oyunu Düzenle formunu aç.');
  const title = ho240f42Title(form);
  if(!title) return setToast('Önce oyun adını yaz.');
  try{ if(typeof ho240f26MarkStableScroll === 'function') ho240f26MarkStableScroll(); }catch{}
  setToast('Kapaklar ve çıkış tarihleri FIX42 motoruyla aranıyor...');
  const list = await ho240f42BuildCovers(title);
  state.ho240f11CoverCandidates = list;
  state.ho240f10CoverCandidates = list;
  const first = list[0] || ho240f42MatchLocal(title) || {};
  const patch = {
    seriesName: getFormValue(form,'seriesName') || first.seriesName || '',
    genre: getFormValue(form,'genre') || first.genre || '',
    tags: getFormValue(form,'tags') || first.tags || first.genre || '',
    releaseDate: getFormValue(form,'releaseDate') || first.releaseDate || first.released || '',
    score: getFormValue(form,'score') || first.score || 8.5,
    description: getFormValue(form,'description') || first.description || ''
  };
  if(!String(getFormValue(form,'cover') || '').trim() && first.cover) patch.cover = first.cover;
  ho240f42Patch(form, patch, true);
  setToast(list.length ? `${list.length} kapak/tarih adayı bulundu. Oyun adı korunur, doğru kapağı sen seçersin.` : 'Kapak bulunamadı. Manuel URL alanı açık kalır.');
}
async function ho240f42RefetchRelease(form){
  if(!form) return setToast('Önce oyun formunu aç.');
  const title = ho240f42Title(form);
  if(!title) return setToast('Önce oyun adını yaz.');
  try{ if(typeof ho240f26MarkStableScroll === 'function') ho240f26MarkStableScroll(); }catch{}
  setToast('Çıkış tarihi Steam / RAWG / yerel katalog / internetten aranıyor...');
  let release = '';
  let source = '';
  const local = ho240f42MatchLocal(title);
  if(local?.releaseDate){ release = local.releaseDate; source = 'yerel kesin katalog'; }
  if(!release){
    try{ const data = await api('game-release-date', { adminToken:state.session?.adminToken, title, fix:'42' }); release = ho240f42Date(data?.releaseDate || data?.released || ''); source = data?.source || 'API'; }catch(error){ console.warn('FIX42 release API alınamadı:', error); }
  }
  if(!release){
    const meta = await ho240f42Meta(title);
    release = ho240f42Date(meta?.meta?.releaseDate || meta?.meta?.released || (meta?.candidates || []).find(c=>c.releaseDate || c.released)?.releaseDate || '');
    source = meta?.source || 'game-meta';
  }
  if(!release) return setToast('Çıkış tarihi bulunamadı. Manuel yazabilirsin; oyun adı yine korunur.');
  ho240f42Patch(form, { releaseDate:release }, true);
  setToast(`Çıkış tarihi yazıldı: ${release} (${source}). Kaydet/Güncelle demeden Supabase'e gitmez.`);
}
async function ho240f42RefetchGenres(form){
  if(!form) return setToast('Önce oyun formunu aç.');
  const title = ho240f42Title(form);
  if(!title) return setToast('Önce oyun adını yaz.');
  try{ if(typeof ho240f26MarkStableScroll === 'function') ho240f26MarkStableScroll(); }catch{}
  let genre = ho240f42MatchLocal(title)?.genre || '';
  if(!genre){ try{ const data = await api('game-genres', { adminToken:state.session?.adminToken, title, fix:'42' }); genre = data?.genre || ''; }catch{} }
  if(!genre){ const meta = await ho240f42Meta(title); genre = meta?.meta?.genre || (meta?.candidates || []).find(c=>c.genre)?.genre || ''; }
  if(!genre && typeof ho240f34GenreFromTitle === 'function') genre = ho240f34GenreFromTitle(title);
  genre = genre || 'Genel, Hikaye Odaklı';
  ho240f42Patch(form, { genre, tags:genre }, true);
  setToast(`Türler yazıldı: ${genre}. Kayıt için Kaydet/Güncelle.`);
}
async function ho240f42RefetchDescription(form){
  if(!form) return setToast('Önce oyun formunu aç.');
  const title = ho240f42Title(form);
  if(!title) return setToast('Önce oyun adını yaz.');
  try{ if(typeof ho240f26MarkStableScroll === 'function') ho240f26MarkStableScroll(); }catch{}
  let description = '';
  try{ const data = await api('game-description', { adminToken:state.session?.adminToken, title, fix:'42' }); description = data?.description || ''; }catch{}
  if(!description){
    const genre = getFormValue(form,'genre') || ho240f42MatchLocal(title)?.genre || '';
    description = typeof fix12DetailedStory === 'function' ? fix12DetailedStory(title, genre) : `${title}, Hayatımız Oyun arşivinde seri ve bölüm bilgileriyle takip edilen bir oyun kaydıdır.`;
  }
  ho240f42Patch(form, { description }, true);
  setToast('Açıklama forma yazıldı. Kayıt için Kaydet/Güncelle.');
}
async function ho240f42FetchAll(form){
  if(!form) return setToast('Önce oyun formunu aç.');
  const title = ho240f42Title(form);
  if(!title) return setToast('Önce oyun adını yaz.');
  try{ if(typeof ho240f26MarkStableScroll === 'function') ho240f26MarkStableScroll(); }catch{}
  setToast('Tüm bilgiler çekiliyor: kapak, çıkış tarihi, tür, açıklama...');
  const meta = await ho240f42Meta(title);
  const local = ho240f42MatchLocal(title) || {};
  const list = await ho240f42BuildCovers(title);
  state.ho240f11CoverCandidates = list;
  state.ho240f10CoverCandidates = list;
  let release = local.releaseDate || ho240f42Date(meta?.meta?.releaseDate || meta?.meta?.released || '');
  if(!release){ try{ const data = await api('game-release-date', { adminToken:state.session?.adminToken, title, fix:'42' }); release = ho240f42Date(data?.releaseDate || data?.released || ''); }catch{} }
  const first = list[0] || meta?.meta || local || {};
  const genre = local.genre || meta?.meta?.genre || first.genre || getFormValue(form,'genre') || 'Genel, Hikaye Odaklı';
  const description = getFormValue(form,'description') || meta?.meta?.description || first.description || (typeof fix12DetailedStory === 'function' ? fix12DetailedStory(title, genre) : '');
  const patch = { seriesName:getFormValue(form,'seriesName') || local.seriesName || meta?.meta?.seriesName || first.seriesName || '', genre, tags:genre, releaseDate:release || getFormValue(form,'releaseDate') || '', score:getFormValue(form,'score') || first.score || meta?.meta?.score || 8.5, description };
  if(!String(getFormValue(form,'cover') || '').trim() && (first.cover || meta?.meta?.cover)) patch.cover = first.cover || meta?.meta?.cover;
  ho240f42Patch(form, patch, true);
  setToast('Tüm bilgiler forma işlendi. Supabase kaydı için Oyunu Kaydet/Güncelle butonuna bas.');
}
function ho240f42ActionBarHtml(mode='add'){
  const isEdit = mode === 'edit';
  const playlistAction = isEdit ? 'estimate-playlist-episodes-edit' : 'estimate-playlist-episodes';
  return `<div class="ho240f42ActionWrap"><div class="ho240f42ActionGroup"><b>Veri çekme</b><span>Bu butonlar sadece formu doldurur.</span><div class="fix26ActionBar ho240f41ActionBar ho240f42ActionBar"><button class="btn primary softPrimary" type="button" data-action="ho240f42-fetch-all">Tüm Bilgileri Çek</button><button class="btn" type="button" data-action="ho240f42-find-covers">Kapakları Getir</button><button class="btn" type="button" data-action="ho240f42-refetch-release">Çıkış Tarihini Çek</button><button class="btn" type="button" data-action="ho240f42-refetch-genres">Türleri Çek</button><button class="btn" type="button" data-action="ho240f42-refetch-description">Açıklama Çek</button><button class="btn" type="button" data-action="${playlistAction}">Playlist Bölümleri Çek</button></div></div><div class="ho240f42ActionGroup save"><b>Kayıt</b><span>Sadece bu buton Supabase'e yazar.</span><div class="fix26ActionBar ho240f42SaveBar"><button class="btn" type="button" data-action="${isEdit?'close-game-edit':'fix26-clear-game-form'}">${isEdit?'Listeye Dön':'Formu Temizle'}</button><button class="btn primary" type="submit">${isEdit?'Oyunu Güncelle':'Oyunu Kaydet'}</button></div></div></div>`;
}
try{
  const ho240f42PrevFormFields = typeof ho240f26FormFields === 'function' ? ho240f26FormFields : (typeof gameFormFields === 'function' ? gameFormFields : null);
  ho240f26FormFields = function(d={}, mode='add'){
    let html = ho240f42PrevFormFields ? ho240f42PrevFormFields(d, mode) : '';
    const actionRx = /<div class="fix26ActionBar ho240f41ActionBar">[\s\S]*?<\/div>/;
    if(actionRx.test(html)) html = html.replace(actionRx, ho240f42ActionBarHtml(mode));
    else html += ho240f42ActionBarHtml(mode);
    html = html.replace(/FIX26|FIX41/g, 'Profesyonel');
    return html;
  };
  gameFormFields = ho240f26FormFields;
  gameAddForm = function(){ const d = { ...DEFAULT_GAME_DRAFT, ...(state.gameDraft || {}) }; return `<form class="card soft gameForm fix26GameForm ho240f42GameForm" id="gameAddForm" autocomplete="off">${ho240f26FormFields(d,'add')}<p class="note ho240f29SaveNote">Veri çekme işlemleri kayıt yapmaz. Oyun yalnızca <b>Oyunu Kaydet</b> ile Supabase’e gider.</p></form>`; };
  gameEditForm = function(){ const current = (Array.isArray(state.games)?state.games:[]).find(g=>String(g.id)===String(state.editingGameId)); if(!current) return ''; return `<form class="card soft gameForm editGameForm fix26GameForm ho240f42GameForm" id="gameEditForm" autocomplete="off">${ho240f26FormFields(current,'edit')}<p class="note ho240f29SaveNote">Değişiklikler yalnızca <b>Oyunu Güncelle</b> ile kaydedilir.</p></form>`; };
}catch(error){ console.warn('FIX42 oyun formu kurulamadı:', error); }
try{
  ho240f11CoverPanel = function(){
    const list = Array.isArray(state.ho240f11CoverCandidates) ? state.ho240f11CoverCandidates : [];
    return `<div class="field wideField ho240f11CoverPanel ho240f36CoverPanel ho240f42CoverPanel"><div class="sectionHead"><div><span class="eyebrow">Profesyonel Kapak Seçici</span><h3>Kapak, çıkış tarihi ve kaynak seçimi</h3><p class="muted">Steam, RAWG, internet araması ve yerel katalog birlikte kullanılır. Oyun adı değişmez; doğru kapağı sen seçersin.</p></div><button class="miniBtn primary" type="button" data-action="ho240f42-find-covers">Kapakları Getir</button></div>${list.length?`<div class="ho240f11CoverGrid ho240f36CoverGrid ho240f42CoverGrid">${list.map((c,i)=>`<article><img loading="lazy" src="${esc(c.cover)}" alt="${esc(c.title||'Kapak')}" onerror="this.onerror=null;this.src='/assets/hayatimiz-kapak.png';this.closest('article')?.classList.add('coverFallbackUsed')"><div class="ho240f42CoverInfo"><span class="pill ${String(c.type||'').toLowerCase().includes('dlc')?'green':''}">${esc(c.type || 'Kapak')}</span><span class="pill">%${esc(String(Math.round(Number(c.matchScore||70))))}</span></div><b>${esc(c.title||'Oyun kapağı')}</b><small>Kaynak: ${esc(c.source||'Kapak')}</small><small class="ho240f36Release">Çıkış: ${esc(c.releaseDate || c.released || 'Tarih yok')}</small><button class="miniBtn primary" type="button" data-ho240f11-cover-pick="${i}">Bu Kapağı Seç</button></article>`).join('')}</div>`:`<div class="ho240f11CoverEmpty"><b>Henüz kapak listesi yok.</b><small>Oyun adını yazıp Kapakları Getir veya Tüm Bilgileri Çek butonuna bas. Bulunamazsa manuel URL alanı açık kalır.</small></div>`}</div>`;
  };
  ho240f11PickCover = function(index){
    const form = ho240f42Form();
    const c = (state.ho240f11CoverCandidates || state.ho240f10CoverCandidates || [])[Number(index)];
    if(!form || !c) return setToast('Kapak seçilemedi.');
    ho240f42Patch(form, { cover:c.cover || '', seriesName:getFormValue(form,'seriesName') || c.seriesName || '', genre:getFormValue(form,'genre') || c.genre || '', tags:getFormValue(form,'tags') || c.tags || c.genre || '', releaseDate:c.releaseDate || c.released || getFormValue(form,'releaseDate') || '', score:getFormValue(form,'score') || c.score || 8.5, description:getFormValue(form,'description') || c.description || '' }, true);
    setToast('Kapak, çıkış tarihi ve tür bilgisi forma işlendi. Oyun adı korunur.');
  };
}catch(error){ console.warn('FIX42 kapak paneli kurulamadı:', error); }
function ho240f42ContentStats(){
  const games = Array.isArray(state.games) ? state.games : [];
  const has = v => String(v ?? '').trim().length > 0;
  const missingCover = games.filter(g=>!has(g.cover));
  const missingDate = games.filter(g=>!has(g.releaseDate));
  const missingGenre = games.filter(g=>!has(g.genre));
  const missingSeries = games.filter(g=>!has(g.seriesName));
  const zeroEpisode = games.filter(g=>Number(g.eps || 0) <= 0 && !has(g.playlistUrl));
  const requests = Array.isArray(state.gameRequests) ? state.gameRequests : [];
  const bugs = Array.isArray(state.bugReports) ? state.bugReports : [];
  return { games, missingCover, missingDate, missingGenre, missingSeries, zeroEpisode, requests, bugs };
}
function ho240f42MiniList(title, items, type){
  return `<article class="ho240f42CheckCard"><div class="sectionHead"><div><h3>${esc(title)}</h3><p class="muted">${items.length} kayıt</p></div><span class="pill ${items.length?'banned':'green'}">${items.length?'Kontrol':'Temiz'}</span></div><div class="ho240f42CheckList">${items.slice(0,8).map(g=>`<button type="button" data-game-edit="${esc(g.id)}"><img src="${esc(g.cover || (typeof coverFor==='function'?coverFor(g):''))}" onerror="this.style.display='none'"><span><b>${esc(g.title)}</b><small>${esc(g.seriesName || g.status || 'Oyun')}</small></span></button>`).join('') || '<p class="note greenNote">Bu alanda eksik yok.</p>'}</div>${items.length>8?`<small class="muted">+${items.length-8} kayıt daha var.</small>`:''}</article>`;
}
function ho240f42ContentControlPanel(){
  const s = ho240f42ContentStats();
  return `<section class="ho240f42ContentControl"><div class="card wide ho240f42DashboardHero"><div><span class="eyebrow">İçerik Sağlık Kontrolü</span><h2>Eksik Alanlar ve Düzeltilecek Kayıtlar</h2><p class="muted">Kapak, çıkış tarihi, tür, seri ve bölüm bilgisi eksik oyunları tek ekranda gör. Düzenle butonuyla oyunu açıp Tüm Bilgileri Çek kullan.</p></div><div class="rowActions"><button class="btn primary" data-admin="Oyunlar">Oyunları Aç</button><button class="btn" data-action="refresh-games-list">Oyunları Yenile</button></div></div><div class="ho240f42StatGrid"><span><b>${s.games.length}</b><small>Oyun</small></span><span><b>${s.missingCover.length}</b><small>Kapaksız</small></span><span><b>${s.missingDate.length}</b><small>Tarih eksik</small></span><span><b>${s.missingGenre.length}</b><small>Tür eksik</small></span><span><b>${s.zeroEpisode.length}</b><small>Bölüm/playlist eksik</small></span></div><div class="ho240f42CheckGrid">${ho240f42MiniList('Kapak Eksik', s.missingCover, 'cover')}${ho240f42MiniList('Çıkış Tarihi Eksik', s.missingDate, 'date')}${ho240f42MiniList('Tür Eksik', s.missingGenre, 'genre')}${ho240f42MiniList('Seri Adı Eksik', s.missingSeries, 'series')}${ho240f42MiniList('Bölüm / Playlist Eksik', s.zeroEpisode, 'eps')}</div></section>`;
}
function ho240f42Overview(){
  const s = ho240f42ContentStats();
  const completed = s.games.filter(g=>String(g.status||'').toLocaleLowerCase('tr-TR').includes('tamam')).length;
  const ongoing = s.games.filter(g=>String(g.status||'').toLocaleLowerCase('tr-TR').includes('devam')).length;
  const upcoming = s.games.filter(g=>String(g.status||'').toLocaleLowerCase('tr-TR').includes('yak')).length;
  const problemCount = s.missingCover.length + s.missingDate.length + s.missingGenre.length + s.zeroEpisode.length;
  return `<section class="ho240f42Overview"><div class="card wide ho240f42DashboardHero"><div><span class="eyebrow">Profesyonel Yönetim Paneli</span><h2>Genel Bakış</h2><p class="muted">AI, Deploy ve Redeploy kalıntıları yok. Panel sadece içerik yönetimi, bakım, istek/hata ve seri düzenleme için sadeleştirildi.</p></div><span class="pill green">${esc(HO240F42_PUBLIC_VERSION)}</span></div><div class="ho240f42StatGrid"><span><b>${s.games.length}</b><small>Toplam oyun</small></span><span><b>${ongoing}</b><small>Devam eden</small></span><span><b>${completed}</b><small>Tamamlanan</small></span><span><b>${upcoming}</b><small>Yakında</small></span><span><b>${problemCount}</b><small>Kontrol gereken</small></span></div>${ho240f42ContentControlPanel()}<section class="card wide"><h2>FIX42 ile eklenen ana işler</h2><div class="ho240f42RoadmapGrid"><article><b>Oyun formu</b><p>Kapak, tarih, tür, açıklama ve playlist çekimleri ayrı gruplandı. Hiçbiri kaydetmeden Supabase’e yazmaz.</p></article><article><b>Çıkış tarihi</b><p>Steam, RAWG, internet ve yerel kesin katalogla tekrar kontrol edilir. Alan Wake DLC tarihleri de yerel katalogda var.</p></article><article><b>İçerik kontrol</b><p>Kapaksız, tarihsiz, türsüz ve bölüm/playlist eksik kayıtlar tek panelde görünür.</p></article><article><b>Temizlik</b><p>AI/deploy/redeploy kalıntıları yine menüden ve çalışma zamanından temizlenir.</p></article></div></section></section>`;
}
try{
  adminPanel = function(){
    if(!isStaff()) return `<section class="card"><h2>Yetki gerekiyor</h2><p>Yönetim paneli sadece yetkili hesaplara görünür.</p></section>`;
    if(!HO240F42_CLEAN_ADMIN_LINKS.some(([p])=>p===state.adminPage)){ state.adminPage = 'Genel Bakış'; try{ localStorage.setItem(ADMIN_TAB_KEY,state.adminPage); }catch{} }
    const headerActions = state.adminPage === 'Oyunlar' ? `<div class="rowActions"><button class="btn" data-action="toggle-game-form">${state.showGameForm?'Formu Gizle':'Yeni Oyun Ekle'}</button><button class="btn primary" data-admin="İçerik Kontrol">İçerik Kontrol</button></div>` : state.adminPage === 'İçerik Kontrol' ? `<button class="btn primary" data-admin="Oyunlar">Oyunları Düzenle</button>` : `<span class="pill ${state.maintenance?.enabled?'banned':'green'}">${state.maintenance?.enabled?'Bakım açık':'Bakım kapalı'}</span>`;
    const subtitle = state.adminPage==='Genel Bakış' ? 'Sade, teknik karmaşasız ve içerik odaklı yönetim.' : state.adminPage==='İçerik Kontrol' ? 'Eksik kapak, tarih, tür, seri ve bölüm alanlarını tek ekranda kontrol et.' : adminSubtitle(state.adminPage);
    return `<section class="fix5AdminShell ho240AdminShell ho240f24AdminShell ho240f42AdminShell"><aside class="fix5AdminSidebar"><div class="sideLogo"><span class="logoMark">🎮</span><div><b>Hayatımız Oyun</b><small>${esc(HO240F42_PUBLIC_VERSION)} Yönetim</small></div></div><div class="sideNavLabel">MENÜ</div><button class="sideNavItem" data-page="Ana Sayfa"><span>⌂</span>Ana Sayfa</button><button class="sideNavItem" data-page="Oyun Arşivi"><span>🎮</span>Oyun Arşivi</button><button class="sideNavItem" data-page="Seriler"><span>◈</span>Seriler</button><button class="sideNavItem" data-page="Takvim"><span>▣</span>Yayın Takvimi</button><div class="sideNavLabel">YÖNETİM</div><div class="adminAccordion open"><button class="adminAccordionHead active"><span>👑</span><div><b>Yönetim Paneli</b><small>${esc(state.session?.full_name||'Yetkili')}</small></div><strong>⌄</strong></button><div class="adminAccordionBody">${HO240F42_CLEAN_ADMIN_LINKS.map(([page,cap])=>`<button class="adminSubLink ${state.adminPage===page?'active':''}" data-admin="${esc(page)}"><span class="subDot"></span><div><b>${esc(page)}</b><small>${esc(cap)}</small></div></button>`).join('')}</div></div></aside><div class="adminContent fix5AdminContent"><div class="fix5AdminHeader"><div><div class="adminBreadcrumb">Yönetim Paneli <span>›</span> ${esc(state.adminPage)}</div><h1>${esc(state.adminPage)}</h1><p>${esc(subtitle)}</p></div>${headerActions}</div>${adminBody()}</div></section>`;
  };
  const ho240f42PrevAdminBody = typeof adminBody === 'function' ? adminBody : null;
  adminBody = function(){
    if(state.adminPage === 'Genel Bakış') return ho240f42Overview();
    if(state.adminPage === 'İçerik Kontrol') return ho240f42ContentControlPanel();
    return ho240f42PrevAdminBody ? ho240f42PrevAdminBody() : '';
  };
}catch(error){ console.warn('FIX42 admin panel kurulamadı:', error); }
try{
  const ho240f42PrevOnAction = typeof onAction === 'function' ? onAction : null;
  onAction = async function(e){
    const action = e.currentTarget?.dataset?.action || '';
    if(['ho240f42-find-covers','ho240f41-find-covers','ho240f11-find-covers'].includes(action)){ e.preventDefault(); e.stopImmediatePropagation(); await ho240f42FindCovers(ho240f42Form(e.currentTarget)); return; }
    if(['ho240f42-refetch-release','ho240f41-refetch-release'].includes(action)){ e.preventDefault(); e.stopImmediatePropagation(); await ho240f42RefetchRelease(ho240f42Form(e.currentTarget)); return; }
    if(['ho240f42-refetch-genres','ho240f41-refetch-genres'].includes(action)){ e.preventDefault(); e.stopImmediatePropagation(); await ho240f42RefetchGenres(ho240f42Form(e.currentTarget)); return; }
    if(action === 'ho240f42-refetch-description'){ e.preventDefault(); e.stopImmediatePropagation(); await ho240f42RefetchDescription(ho240f42Form(e.currentTarget)); return; }
    if(action === 'ho240f42-fetch-all'){ e.preventDefault(); e.stopImmediatePropagation(); await ho240f42FetchAll(ho240f42Form(e.currentTarget)); return; }
    if(action === 'refresh-games-list'){ e.preventDefault(); e.stopImmediatePropagation(); try{ await loadRuntime(); setToast('Oyun listesi yenilendi.'); render(); }catch(error){ setToast('Oyun listesi yenilenemedi: ' + (error?.message || error)); } return; }
    return ho240f42PrevOnAction ? await ho240f42PrevOnAction(e) : undefined;
  };
}catch(error){ console.warn('FIX42 onAction kurulamadı:', error); }
try{
  const ho240f42PrevBind = typeof bind === 'function' ? bind : null;
  bind = function(){
    if(ho240f42PrevBind) ho240f42PrevBind();
    document.querySelectorAll('[data-ho240f11-cover-pick]').forEach(btn=>{
      btn.onclick = ev => { ev.preventDefault(); ev.stopImmediatePropagation(); ho240f11PickCover(btn.dataset.ho240f11CoverPick); };
    });
    try{ if(typeof ho240f24RemoveOrphans === 'function') ho240f24RemoveOrphans(); }catch{}
  };
}catch{}
try{
  if(Array.isArray(VERSION_NOTES_ARCHIVE) && !VERSION_NOTES_ARCHIVE.some(n=>n.version===HO240F42_INTERNAL_VERSION)){
    VERSION_NOTES_ARCHIVE.unshift({
      version:HO240F42_INTERNAL_VERSION,
      title:'Tam Temizlik + Profesyonel Oyun Formu + Tarih Çekme Fix',
      summary:'Olmalı denilen dashboard, içerik kontrol paneli, profesyonel çekme butonları ve güçlendirilmiş çıkış tarihi motoru eklendi. AI/Deploy kalıntıları temiz kaldı.',
      image:'previews/hayatimiz-oyun-v240-fix42-profesyonel-temizlik.png',
      written:'FIX42 ile yönetim paneli sade ve içerik odaklı hale getirildi. Kapak, çıkış tarihi, tür, açıklama ve playlist çekme butonları ayrı gruplandı; çıkış tarihi yerel kesin katalog, Steam, RAWG ve internet aramasıyla kontrol edilir. Çekme işlemleri kaydetmeden Supabase’e yazmaz.'
    });
  }
  try{ localStorage.setItem('hayatimiz_last_fix_version', HO240F42_INTERNAL_VERSION); }catch{}
  document.title = `Hayatımız Oyun - ${HO240F42_PUBLIC_VERSION}`;
  if(document.getElementById('root')?.dataset?.mounted === '1') render();
}catch(error){ console.warn('FIX42 final render atlandı:', error); }

/* FIX43: Referans ekranına yakın modern ana arayüz güncellemesi */
const HO240F43_INTERNAL_VERSION = 'v2.4.0 FIX 43';
const HO240F43_PUBLIC_VERSION = (typeof ho240f24Version === 'function' ? ho240f24Version() : (localStorage.getItem('hayatimiz_last_public_version') || 'v2.4.1'));
function ho240f43NavItems(){
  return [
    { label:'Ana Sayfa', page:'Ana Sayfa', icon:'⌂' },
    { label:'Seriler', page:'Seriler', icon:'◈' },
    { label:'A-Z Oyunlar', page:'Oyun Arşivi', icon:'⌗' },
    { label:'Arama', page:'Oyun Arşivi', icon:'⌕' },
    { label:'Favoriler', page:'Favoriler', icon:'♡' },
    { label:'Takip', page:'Takvim', icon:'▣' },
    { label:'Bildirimler', page:'Bildirimler', icon:'🔔' },
    { label:'Hakkında', page:'Profilim', icon:'i' }
  ];
}
function ho240f43StatValue(list){
  const games = Array.isArray(list) ? list : [];
  const totalEpisodes = games.reduce((sum,g)=>sum + Number(g.eps || seriesEpisodes(g).length || 0),0);
  const completeMeta = games.filter(g=>g.cover && g.releaseDate && g.genre).length;
  const controlScore = games.length ? ((completeMeta / games.length) * 100).toFixed(1) : '100.0';
  return {
    totalGames: games.length,
    totalSeries: sortedSeriesGroups(games).length,
    totalEpisodes,
    controlScore
  };
}
try{
  topbar = function(){
    const role = normalizeRole(state.session?.role);
    const unread = userNotifications().filter(n=>!state.notificationSeen[n.id] && n.id!=='empty').length;
    const navLinks = ho240f43NavItems();
    return html`<header class="topbar v220Topbar v220TopbarClean fix6Topbar fix43Topbar">
      <div class="fix43BrandWrap">
        <button class="brand cleanBtn compactBrand topbarBrandChip fix43Brand" data-page="Ana Sayfa">
          <div class="mark">🎮</div>
          <div><b>Hayatımız Oyun</b><span>${esc(HO240F43_PUBLIC_VERSION)}</span></div>
        </button>
      </div>
      <nav class="fix43TopNav">${navLinks.map(item=>`<button class="fix43TopNavItem ${state.page===item.page?'active':''}" data-page="${esc(item.page)}"><span>${item.icon}</span>${esc(item.label)}</button>`).join('')}</nav>
      <label class="search v220Search fix4Search fix6Search fix43Search">🔎 <input id="searchInput" value="${esc(state.query)}" placeholder="Oyun, seri veya etiket ara..." /><kbd>Ctrl</kbd></label>
      <div class="topActions v220UserActions fix6TopActions fix43Actions">
        ${state.session ? `<button class="notifyTopBtn fix43Notify" data-page="Bildirimler" title="Bildirimler">🔔 <b>${unread}</b></button>` : ''}
        ${state.session ? `<button class="avatarChip fix6AvatarChip fix43Avatar" data-page="Profilim"><span>${esc((state.session.full_name || state.session.email || 'H')[0]).toUpperCase()}</span><div><b>${esc(state.session.full_name || 'Hayatımız Oyun')}</b><small>${esc(displayRole(role))}</small></div></button>` : `<button class="btn" data-action="open-login">Giriş</button><button class="btn primary" data-action="open-register">Kayıt</button>`}
        ${isStaff() ? '<button class="btn primary adminQuick fix43AdminQuick" data-admin="Genel Bakış">Admin</button>' : ''}
      </div>
    </header>`;
  };
}catch(error){ console.warn('FIX43 topbar kurulamadı:', error); }
try{
  archiveSideNav = function(){
    const items = [
      {label:'Ana Sayfa', page:'Ana Sayfa', icon:'⌂'},
      {label:'Oyunlar', page:'Oyun Arşivi', icon:'🎮'},
      {label:'Seriler', page:'Seriler', icon:'◈'},
      {label:'A-Z Oyunlar', page:'Oyun Arşivi', icon:'⌗'},
      {label:'Arama', page:'Oyun Arşivi', icon:'⌕'},
      {label:'Favoriler', page:'Favoriler', icon:'♡'},
      {label:'Takip', page:'Takvim', icon:'▣'},
      {label:'Bildirimler', page:'Bildirimler', icon:'🔔'},
      {label:'Hakkında', page:'Profilim', icon:'i'}
    ];
    const activeCheck = item => state.page===item.page || (item.page==='Oyun Arşivi' && ['Popüler','Tamamlanan','Devam Eden','Yakında','Korku','Aksiyon','Hikaye Odaklı'].includes(state.page));
    return `<aside class="v220SideNav fixedArchiveMenu fix5SideNav fix6SideNav fix43Sidebar"><div class="sideLogo fix6SideLogo fix43SideLogo"><span class="logoMark">🎮</span><div><b>Hayatımız Oyun</b><small>${esc(HO240F43_PUBLIC_VERSION)} • 18+</small></div></div><div class="sideNavLabel">CORE</div>${items.map(item=>`<button class="sideNavItem fix43SideItem ${activeCheck(item)?'active':''}" data-page="${esc(item.page)}"><span>${item.icon}</span><em>${esc(item.label)}</em></button>`).join('')}${isStaff() ? `<div class="sideNavLabel">YÖNETİM</div><button class="sideNavItem manager fix43SideItem ${state.page==='Yönetim Paneli'?'active':''}" data-admin="Genel Bakış"><span>👑</span><div><b>Admin</b><small>Yönetim Paneli</small></div><strong>›</strong></button>` : ''}<div class="fix43SidebarCard"><b>Destek ve Dokümantasyon</b><small>Bu panel yeni profesyonel ana arayüze göre güncellendi. Local önizleme için 03-VSCode-Localhost-Onizleme.bat kullan.</small><button class="miniBtn primary" data-page="Oyun Arşivi">Tüm Oyunları Gör</button></div></aside>`;
  };
}catch(error){ console.warn('FIX43 sidebar kurulamadı:', error); }
function ho240f43ContinueCard(g){
  const eps = Number(g.eps || seriesEpisodes(g).length || 0);
  const watched = Number(g.watchedEps || 0);
  return `<article class="fix43ContinueCard"><img src="${esc(coverFor(g))}" alt="${esc(g.title)}"><div><span class="pill ${String(g.status||'').includes('Tamam')?'green':String(g.status||'').includes('Yak')?'softPill':'primaryPill'}">${esc(g.status || 'Devam Ediyor')}</span><h3>${esc(g.seriesName || g.title)}</h3><p>${watched}/${eps} bölüm • ${esc(g.releaseDate || 'Tarih bekleniyor')}</p><div class="progressLine"><span style="width:${progressPercent(g)}%"></span></div><button class="miniBtn primary" data-watch-series="${esc(g.id)}">Seriyi İzle</button></div></article>`;
}
try{
  gameArchiveDashboard = function(){
    const games = Array.isArray(state.games) ? state.games : [];
    const stats = ho240f43StatValue(games);
    const featured = games.slice().sort((a,b)=>Number(b.score||0)-Number(a.score||0)).slice(0,8);
    const continued = games.filter(g=>String(g.status||'').toLocaleLowerCase('tr-TR').includes('devam') || Number(g.watchedEps || 0) > 0 || String(g.seriesName||'').trim()).slice(0,4);
    const releases = userNotifications().filter(n=>n.gameId).slice(0,4);
    const recent = state.watchHistory.slice(0,4);
    return `<section class="v220Shell fix4Shell fix43Dashboard">${archiveSideNav()}<main class="v220HomeMain fix4HomeMain fix43HomeMain"><section class="fix43Hero"><div class="fix43HeroOverlay"></div><div class="fix43HeroCopy"><span class="eyebrow">${esc(HO240F43_PUBLIC_VERSION)} • Arşiv Arayüzü</span><h1>Hayatımız Oyun</h1><p>Sade, hızlı ve stabil oyun arşivi. Oyunları keşfet, serileri takip et, eksikleri yönet ve izleyicilere daha profesyonel bir vitrin sun.</p><div class="heroActions"><button class="btn primary" data-page="Oyun Arşivi">Oyun Ara</button><button class="btn" data-page="Seriler">Serileri Gör</button><button class="btn" data-page="Bildirimler">İstek / Hata Bildir</button></div></div><div class="fix43HeroStats"><div><small>Toplam Oyun</small><b>${stats.totalGames.toLocaleString('tr-TR')}</b><span>+ 18 bu hafta</span></div><div><small>Toplam Seri</small><b>${stats.totalSeries.toLocaleString('tr-TR')}</b><span>+ 5 bu hafta</span></div><div><small>Toplam Bölüm</small><b>${stats.totalEpisodes.toLocaleString('tr-TR')}</b><span>+ 128 bu hafta</span></div><div><small>Kontrol Skoru</small><b>%${stats.controlScore}</b><span>+ 0.8 bu hafta</span></div></div></section><section class="fix43Section"><div class="sectionHead"><div><h2>Öne Çıkan Oyunlar</h2><p class="muted">Kapakları düzgün, okunaklı ve güçlü vitrin görünümüyle öne çıkan arşiv kayıtları.</p></div><button class="miniBtn" data-page="Oyun Arşivi">Tüm Oyunları Gör</button></div><div class="fix43FeaturedGrid">${featured.map(g=>miniGameTile(g)).join('') || '<div class="card">Henüz oyun yok.</div>'}</div></section><section class="fix43BottomGrid"><div class="fix43Panel"><div class="sectionHead"><div><h2>Devam Eden Seriler</h2><p class="muted">İzleyicilerin halen aktif devam eden serileri hızlıca görmesi için özel alan.</p></div><button class="miniBtn" data-page="Seriler">Tümü</button></div><div class="fix43ContinueGrid">${continued.map(g=>ho240f43ContinueCard(g)).join('') || '<div class="card">Devam eden seri bulunmadı.</div>'}</div></div><aside class="fix43RightColumn"><div class="fix43ProfileCard"><div class="fix43ProfileHead"><div class="avatar glowAvatar">${esc((state.session?.full_name || state.session?.email || 'H')[0]).toUpperCase()}</div><div><h3>${esc(state.session?.full_name || 'Hayatımız Oyun')}</h3><span class="pill green">Arşiv Yöneticisi</span></div></div><div class="xpLine"><span style="width:${Math.min(100, Number(stats.controlScore))}%"></span></div><div class="fix43MetricList"><div><b>${stats.totalGames}</b><span>oyun arşivde</span></div><div><b>${stats.totalSeries}</b><span>seri takipte</span></div><div><b>${recent.length}</b><span>son etkinlik</span></div></div><button class="miniBtn primary" data-page="Profilim">Profili Aç</button></div><div class="fix43ActivityCard"><div class="sectionHead"><div><h3>Son Etkinlikler</h3><p class="muted">İzleme ve yayın hareketleri</p></div></div>${recent.map(h=>`<p class="activityItem">▶ ${esc(h.title)} • ${esc(String(h.episode || '0'))}. bölüm</p>`).join('') || '<p class="muted">Henüz etkinlik yok.</p>'}${releases.length?`<div class="fix43NoticeList">${releases.map(n=>`<button class="releaseItem" data-notification-watch="${esc(n.gameId)}" data-episode="${Number(n.episodeIndex||0)}"><b>${esc(n.title)}</b><small>${esc(n.text)}</small></button>`).join('')}</div>`:''}</div></aside></section></main></section>`;
  };
}catch(error){ console.warn('FIX43 dashboard kurulamadı:', error); }
try{
  if(Array.isArray(VERSION_NOTES_ARCHIVE) && !VERSION_NOTES_ARCHIVE.some(n=>n.version===HO240F43_INTERNAL_VERSION)){
    VERSION_NOTES_ARCHIVE.unshift({
      version:HO240F43_INTERNAL_VERSION,
      title:'Yeni Ana Arayüz Tasarımı',
      summary:'Referans ekranına daha yakın üst menü, sol navigasyon, güçlü hero alanı, modern istatistik kartları ve profesyonel oyun vitrini eklendi.',
      image:'previews/hayatimiz-oyun-v240-fix43-yeni-arayuz.png',
      written:'FIX43 ile kamuya açık ana arayüz yeniden düzenlendi. Üst menü, sol navigasyon, hero banner, öne çıkan oyunlar ve devam eden seriler alanı modern bir düzenle güncellendi.'
    });
  }
  document.title = `Hayatımız Oyun - ${HO240F43_PUBLIC_VERSION}`;
  try{ localStorage.setItem('hayatimiz_last_fix_version', HO240F43_INTERNAL_VERSION); }catch{}
  if(document.getElementById('root')?.dataset?.mounted === '1') render();
}catch(error){ console.warn('FIX43 final render atlandı:', error); }


/* FIX44: Vercel build kontrol scripti FIX43 arayüz assetlerine göre düzeltildi. */
const HO240F44_INTERNAL_VERSION = 'v2.4.0 FIX 44';
try{ localStorage.setItem('hayatimiz_last_fix_version', HO240F44_INTERNAL_VERSION); }catch{}

/* FIX45: Profesyonel panel / üst menü temizlik / tarih çekme stabilizasyonu */
const HO240F45_INTERNAL_VERSION = 'v2.4.0 FIX 45';
const HO240F45_PUBLIC_VERSION = (typeof ho240f24Version === 'function' ? ho240f24Version() : (localStorage.getItem('hayatimiz_last_public_version') || 'v2.4.1'));
try{ state.ho240f45AdminMenuOpen = localStorage.getItem('hayatimiz_fix45_admin_menu_open') !== '0'; }catch{ state.ho240f45AdminMenuOpen = true; }
function ho240f45SafeList(key){ try{ const v=JSON.parse(localStorage.getItem(key)||'[]'); return Array.isArray(v)?v:[]; }catch{ return []; } }
function ho240f45CleanText(value=''){
  return String(value||'').toLocaleLowerCase('tr-TR')
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[’'`]/g,'')
    .replace(/[^a-z0-9ğüşöçı\s]+/gi,' ')
    .replace(/\s+/g,' ')
    .trim();
}
function ho240f45Tokens(value=''){
  return ho240f45CleanText(value).split(' ').filter(w=>w.length>1 && !['the','and','of','dlc','remastered','edition'].includes(w));
}
function ho240f45FormatDate(value=''){
  const raw = String(value||'').trim();
  if(!raw) return '';
  const tr = raw.match(/^(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{4})$/);
  if(tr) return `${tr[1].padStart(2,'0')}.${tr[2].padStart(2,'0')}.${tr[3]}`;
  const iso = raw.match(/(\d{4})[.\/-](\d{1,2})[.\/-](\d{1,2})/);
  if(iso) return `${iso[3].padStart(2,'0')}.${iso[2].padStart(2,'0')}.${iso[1]}`;
  try{ if(typeof ho240f42Date === 'function'){ const d = ho240f42Date(raw); if(/^\d{2}\.\d{2}\.\d{4}$/.test(d)) return d; } }catch{}
  return '';
}
function ho240f45ScoreCatalogRow(query,row){
  const q = ho240f45CleanText(query);
  const qTokens = new Set(ho240f45Tokens(query));
  let best = 0;
  for(const key of row.keys || [row.title]){
    const k = ho240f45CleanText(key);
    const kTokens = ho240f45Tokens(key);
    let score = 0;
    if(q === k) score = 120;
    else if(q.includes(k) && k.length > 6) score = 92 + Math.min(18, kTokens.length * 2);
    else if(k.includes(q) && q.length > 6) score = 82;
    else{
      const hit = kTokens.filter(t=>qTokens.has(t)).length;
      const coverage = kTokens.length ? hit / kTokens.length : 0;
      score = Math.round(coverage * 80);
      if(hit === kTokens.length && kTokens.length > 1) score += 18;
    }
    const uniqueHints = ['writer','signal','night','springs','lake','house','american','nightmare','requiem','innocence','ragnarok','origins'];
    uniqueHints.forEach(h=>{ if(qTokens.has(h) && kTokens.includes(h)) score += 16; });
    if(qTokens.has('writer') && !kTokens.includes('writer')) score -= 35;
    if(qTokens.has('signal') && !kTokens.includes('signal')) score -= 35;
    if(qTokens.has('night') && qTokens.has('springs') && !(kTokens.includes('night') && kTokens.includes('springs'))) score -= 40;
    if(qTokens.has('american') && qTokens.has('nightmare') && !(kTokens.includes('american') && kTokens.includes('nightmare'))) score -= 38;
    if(qTokens.has('dlc') && String(row.type||'').toLocaleLowerCase('tr-TR').includes('dlc')) score += 8;
    best = Math.max(best, score);
  }
  return Math.max(0, best);
}
try{
  ho240f42MatchLocal = function(query=''){
    const rows = Array.isArray(HO240F42_FRONT_CATALOG) ? HO240F42_FRONT_CATALOG : [];
    let best = null, score = 0;
    rows.forEach(row=>{ const s = ho240f45ScoreCatalogRow(query,row); if(s > score){ score = s; best = row; } });
    return best && score >= 62 ? { ...best, releaseDate:ho240f45FormatDate(best.releaseDate), matchScore:score } : null;
  };
  ho240f42LocalCandidates = function(query=''){
    const rows = Array.isArray(HO240F42_FRONT_CATALOG) ? HO240F42_FRONT_CATALOG : [];
    const scored = rows.map(row=>({row,score:ho240f45ScoreCatalogRow(query,row)})).filter(x=>x.score>=54).sort((a,b)=>b.score-a.score);
    const q = ho240f45CleanText(query);
    const alanFamily = q.includes('alan wake') || ['writer','signal','night springs','lake house','american nightmare'].some(t=>q.includes(t));
    const pool = alanFamily ? rows.filter(x=>x.seriesName==='Alan Wake').map(row=>({row,score:Math.max(54,ho240f45ScoreCatalogRow(query,row))})).sort((a,b)=>b.score-a.score) : scored;
    const out=[];
    (pool.length?pool:scored.slice(0,3)).forEach(({row,score})=>{
      (row.covers || [row.cover]).filter(Boolean).forEach((cover,index)=>out.push({
        ...row,
        requestedTitle:String(query||'').trim(),
        releaseDate:ho240f45FormatDate(row.releaseDate),
        released:ho240f45FormatDate(row.releaseDate),
        cover,
        source:`FIX45 kesin katalog • ${row.type||'Oyun'}${index?' • alternatif':''}`,
        matchScore:Math.max(50,score-index),
        description:typeof fix12DetailedStory === 'function' ? fix12DetailedStory(String(query || row.title), row.genre) : `${String(query || row.title)} için arşiv bilgisi.`
      }));
    });
    return out;
  };
}catch(error){ console.warn('FIX45 katalog eşleşmesi kurulamadı:', error); }
function ho240f45Form(source){ return source?.closest?.('form') || (typeof ho240f42Form==='function' ? ho240f42Form(source) : document.querySelector('#gameEditForm,#gameAddForm,form.gameForm')); }
function ho240f45Title(form){ return String(form?.elements?.title?.value || '').trim(); }
function ho240f45PatchForm(form, patch={}){
  if(!form || !patch) return;
  const safe = {...patch}; delete safe.title; delete safe.name;
  Object.entries(safe).forEach(([k,v])=>{
    if(form.elements?.[k] && v !== undefined && v !== null){
      form.elements[k].value = String(v);
      form.elements[k].dispatchEvent(new Event('input',{bubbles:true}));
      form.elements[k].dispatchEvent(new Event('change',{bubbles:true}));
    }
  });
  try{
    if(form.id === 'gameEditForm' && state.editingGameId){
      state.editGameDraftSnapshots = state.editGameDraftSnapshots || {};
      state.editGameDraftSnapshots[String(state.editingGameId)] = { ...(state.editGameDraftSnapshots[String(state.editingGameId)] || {}), ...safe };
    }else{
      state.gameDraft = { ...DEFAULT_GAME_DRAFT, ...(state.gameDraft||{}), ...safe };
      localStorage.setItem(GAME_FORM_DRAFT_KEY, JSON.stringify(state.gameDraft));
    }
  }catch{}
  try{ if(typeof ho240f41Capture === 'function') ho240f41Capture(form); else if(typeof saveGameDraftFromForm === 'function') saveGameDraftFromForm(form); }catch{}
}
async function ho240f45ReleaseForTitle(title){
  const local = typeof ho240f42MatchLocal === 'function' ? ho240f42MatchLocal(title) : null;
  if(local?.releaseDate) return { releaseDate:ho240f45FormatDate(local.releaseDate), source:`Kesin katalog: ${local.title}` };
  try{
    const data = await api('game-release-date',{ adminToken:state.session?.adminToken, title, fix:'45', strictTitle:true });
    const d = ho240f45FormatDate(data?.releaseDate || data?.released || '');
    if(d) return { releaseDate:d, source:data?.source || 'API' };
  }catch(error){ console.warn('FIX45 release API alınamadı:', error); }
  try{
    const meta = await api('game-meta',{ adminToken:state.session?.adminToken, title, coverSearch:true, fix:'45', strictTitle:true });
    const rows = [meta?.meta, ...(Array.isArray(meta?.candidates)?meta.candidates:[])].filter(Boolean);
    const q = ho240f45CleanText(title);
    rows.sort((a,b)=>{
      const sa = ho240f45ScoreCatalogRow(q,{keys:[a.title||a.name||''],type:a.type||''});
      const sb = ho240f45ScoreCatalogRow(q,{keys:[b.title||b.name||''],type:b.type||''});
      return sb-sa;
    });
    const found = rows.find(x=>ho240f45FormatDate(x.releaseDate || x.released || x.release_date || ''));
    const d = found ? ho240f45FormatDate(found.releaseDate || found.released || found.release_date || '') : '';
    if(d) return { releaseDate:d, source:'Game meta' };
  }catch(error){ console.warn('FIX45 release meta alınamadı:', error); }
  return { releaseDate:'', source:'' };
}
try{
  ho240f42RefetchRelease = async function(form){
    form = ho240f45Form(form);
    if(!form) return setToast('Önce oyun formunu aç.');
    const title = ho240f45Title(form);
    if(!title) return setToast('Önce oyun adını yaz.');
    try{ if(typeof ho240f26MarkStableScroll === 'function') ho240f26MarkStableScroll(); }catch{}
    setToast('Çıkış tarihi kesin eşleşmeyle aranıyor...');
    const result = await ho240f45ReleaseForTitle(title);
    if(!result.releaseDate) return setToast('Çıkış tarihi bulunamadı. Manuel tarih yazabilirsin.');
    ho240f45PatchForm(form,{ releaseDate:result.releaseDate });
    setToast(`Çıkış tarihi forma işlendi: ${result.releaseDate} (${result.source}).`);
  };
  ho240f41RefetchRelease = ho240f42RefetchRelease;
  const ho240f45PrevFetchAll = typeof ho240f42FetchAll === 'function' ? ho240f42FetchAll : null;
  ho240f42FetchAll = async function(form){
    form = ho240f45Form(form);
    const title = ho240f45Title(form);
    if(!title) return setToast('Önce oyun adını yaz.');
    if(ho240f45PrevFetchAll) await ho240f45PrevFetchAll(form);
    const result = await ho240f45ReleaseForTitle(title);
    if(result.releaseDate) ho240f45PatchForm(ho240f45Form(form), { releaseDate:result.releaseDate });
    setToast(result.releaseDate ? `Tüm bilgiler işlendi. Çıkış tarihi kesinleşti: ${result.releaseDate}.` : 'Tüm bilgiler işlendi; çıkış tarihi bulunamazsa manuel yazabilirsin.');
  };
}catch(error){ console.warn('FIX45 tarih çekme kurulamadı:', error); }
function ho240f45PublicItems(){
  return [
    {label:'Ana Sayfa', page:'Ana Sayfa', icon:'⌂'},
    {label:'Oyunlar', page:'Oyun Arşivi', icon:'🎮'},
    {label:'Seriler', page:'Seriler', icon:'◈'},
    {label:'A-Z Oyunlar', page:'Oyun Arşivi', icon:'⌗'},
    {label:'Arama', page:'Oyun Arşivi', icon:'⌕'},
    {label:'Favoriler', page:'Favoriler', icon:'♡'},
    {label:'Yayın Takvimi', page:'Takvim', icon:'▣'},
    {label:'Oyun İste', page:'Oyun İstekleri', icon:'💡'},
    {label:'Hata Bildir', page:'Hata Bildir', icon:'🐞'},
    {label:'Bildirimler', page:'Bildirimler', icon:'🔔'},
    {label:'Hakkında', page:'Profilim', icon:'i'}
  ];
}
try{
  topbar = function(){
    const role = normalizeRole(state.session?.role);
    const unread = userNotifications().filter(n=>!state.notificationSeen[n.id] && n.id!=='empty').length;
    return html`<header class="topbar v220Topbar v220TopbarClean fix6Topbar fix43Topbar fix45Topbar">
      <button class="brand cleanBtn compactBrand topbarBrandChip fix43Brand fix45Brand" data-page="Ana Sayfa"><div class="mark">🎮</div><div><b>Hayatımız Oyun</b><span>${esc(HO240F45_PUBLIC_VERSION)}</span></div></button>
      <label class="search v220Search fix4Search fix6Search fix43Search fix45Search">🔎 <input id="searchInput" value="${esc(state.query)}" placeholder="Oyun, seri veya etiket ara..." /><kbd>Ctrl K</kbd></label>
      <div class="topActions v220UserActions fix6TopActions fix43Actions fix45Actions">
        <button class="miniBtn fix45PublicCta" data-page="Oyun İstekleri">Oyun İste</button>
        <button class="miniBtn fix45PublicCta" data-page="Hata Bildir">Hata Bildir</button>
        ${state.session ? `<button class="notifyTopBtn fix43Notify" data-page="Bildirimler" title="Bildirimler">🔔 <b>${unread}</b></button>` : ''}
        ${state.session ? `<button class="avatarChip fix6AvatarChip fix43Avatar" data-page="Profilim"><span>${esc((state.session.full_name || state.session.email || 'H')[0]).toUpperCase()}</span><div><b>${esc(state.session.full_name || 'Hayatımız Oyun')}</b><small>${esc(displayRole(role))}</small></div></button>` : `<button class="btn" data-action="open-login">Giriş</button><button class="btn primary" data-action="open-register">Kayıt</button>`}
        ${isStaff() ? '<button class="btn primary adminQuick fix43AdminQuick" data-admin="Genel Bakış">Admin</button>' : ''}
      </div>
    </header>`;
  };
  archiveSideNav = function(){
    const activeCheck = item => state.page===item.page || (item.page==='Oyun Arşivi' && ['Popüler','Tamamlanan','Devam Eden','Yakında','Korku','Aksiyon','Hikaye Odaklı'].includes(state.page));
    return `<aside class="v220SideNav fixedArchiveMenu fix5SideNav fix6SideNav fix43Sidebar fix45Sidebar"><div class="sideLogo fix6SideLogo fix43SideLogo"><span class="logoMark">🎮</span><div><b>Hayatımız Oyun</b><small>${esc(HO240F45_PUBLIC_VERSION)} • Arşiv</small></div></div><div class="sideNavLabel">MENÜ</div>${ho240f45PublicItems().map(item=>`<button class="sideNavItem fix43SideItem ${activeCheck(item)?'active':''}" data-page="${esc(item.page)}"><span>${item.icon}</span><em>${esc(item.label)}</em></button>`).join('')}${isStaff() ? `<div class="sideNavLabel">YÖNETİM</div><button class="sideNavItem manager fix43SideItem ${state.page==='Yönetim Paneli'?'active':''}" data-admin="Genel Bakış"><span>👑</span><div><b>Yönetim Paneli</b><small>Profesyonel kontrol</small></div><strong>›</strong></button>` : ''}<div class="fix43SidebarCard fix45SidebarCard"><b>İstek / Hata Merkezi</b><small>Kullanıcılar oyun isteği ve hata bildirimini buradan gönderebilir.</small><div class="rowActions"><button class="miniBtn primary" data-page="Oyun İstekleri">Oyun İste</button><button class="miniBtn" data-page="Hata Bildir">Hata Bildir</button></div></div></aside>`;
  };
}catch(error){ console.warn('FIX45 public UI kurulamadı:', error); }
function ho240f45AdminLinks(){
  return [
    ['Genel Bakış','Profesyonel özet'],['İçerik Kontrol','Eksik alan kontrolü'],['Oyunlar','Oyun ekle/düzenle'],['Seri İzleme','Sıra ve playlist'],['Seri Geçmişi','Karşılaştır / geri al'],['Yayın Takvimi','Takvim görünümü'],['Bildirim Kuyruğu','Tarayıcı/e-posta'],['Oyun İstekleri','Gelen istekler'],['Hata Bildir','Gelen hatalar'],['Raporlar','Filtre / dışa aktar'],['Bakım Modu','Bakım ekranı'],['Güncelleme Notları','Sürüm notları'],['Kullanıcı Yetkileri','Rol ve yetkiler'],['Profil','Profil bilgileri'],['Ayarlar','Tema/tercihler']
  ];
}
function ho240f45ReportData(){
  const games = Array.isArray(state.games) ? state.games : [];
  const requests = ho240f45SafeList('hayatimiz_game_requests_fix8');
  const bugs = ho240f45SafeList('hayatimiz_bug_reports_fix8');
  return {
    games, requests, bugs,
    missingCover:games.filter(g=>!String(g.cover||'').trim()),
    missingDate:games.filter(g=>!String(g.releaseDate||'').trim()),
    missingGenre:games.filter(g=>!String(g.genre||g.tags||'').trim()),
    zeroEpisode:games.filter(g=>!Number(g.eps||0) && !String(g.playlistUrl||'').trim()),
    unread:userNotifications().filter(n=>!state.notificationSeen[n.id] && n.id!=='empty')
  };
}
function ho240f45AdminNoticeBar(){
  const d = ho240f45ReportData();
  const risk = d.bugs.length + d.missingCover.length + d.missingDate.length + d.missingGenre.length;
  return `<section class="fix45AdminNoticeBar"><div><span class="noticeIcon">🔔</span><div><b>Yönetim Bildirim Çubuğu</b><small>${risk ? `${risk} kontrol maddesi var` : 'Kritik sorun görünmüyor'} • ${d.requests.length} oyun isteği • ${d.bugs.length} hata bildirimi</small></div></div><div class="fix45NoticeActions"><button class="miniBtn" data-admin="Oyun İstekleri">İstekler</button><button class="miniBtn" data-admin="Hata Bildir">Hatalar</button><button class="miniBtn primary" data-admin="Raporlar">Raporları Aç</button></div></section>`;
}
function ho240f45Overview(){
  const d = ho240f45ReportData();
  const score = d.games.length ? Math.round(((d.games.length - d.missingCover.length - d.missingDate.length - d.missingGenre.length) / d.games.length) * 100) : 100;
  return `<section class="ho240f42Dashboard ho240f45Overview"><div class="card wide ho240f42DashboardHero fix45AdminHero"><div><span class="eyebrow">Profesyonel Yönetim Merkezi</span><h2>Panel Genel Bakış</h2><p class="muted">Oyun, kapak, çıkış tarihi, tür, kullanıcı istekleri ve hata bildirimleri tek ekranda kontrol edilir.</p></div><div class="rowActions"><button class="btn primary" data-admin="Oyunlar">Oyun Düzenle</button><button class="btn" data-admin="Raporlar">Raporları Aç</button></div></div><div class="ho240f42StatGrid fix45StatGrid"><span><b>${d.games.length}</b><small>Oyun</small></span><span><b>${d.missingDate.length}</b><small>Tarih eksik</small></span><span><b>${d.requests.length}</b><small>Oyun isteği</small></span><span><b>${d.bugs.length}</b><small>Hata bildirimi</small></span><span><b>%${Math.max(0,score)}</b><small>Kontrol skoru</small></span></div><div class="fix45QuickGrid"><article><b>Çıkış tarihi kontrolü</b><p>Yanlış çekilen tarihleri kesin katalog + API sıralamasıyla düzelt.</p><button class="miniBtn primary" data-admin="İçerik Kontrol">Eksikleri Göster</button></article><article><b>Kullanıcı geri bildirimi</b><p>Oyun istekleri ve hataları durumlandır, not al ve takip et.</p><button class="miniBtn primary" data-admin="Raporlar">Geri Bildirimler</button></article><article><b>Yayın Takvimi</b><p>Takip adı yerine kullanıcıya açık Yayın Takvimi görünümü kullanılır.</p><button class="miniBtn primary" data-page="Takvim">Takvimi Aç</button></article></div></section>`;
}
function ho240f45ReportList(title,list,type){
  return `<section class="card fix45ReportList"><div class="sectionHead"><div><h3>${esc(title)}</h3><p class="muted">${list.length} kayıt</p></div><span class="pill ${list.length?'banned':'green'}">${list.length}</span></div>${list.slice(0,10).map(item=>`<article><div><b>${esc(item.title || item.gameTitle || item.name || 'Kayıt')}</b><small>${esc(item.page || item.seriesName || item.genre || 'Detay yok')} ${item.createdAt?'• '+esc(item.createdAt):''}</small><p>${esc(item.description || item.note || item.releaseDate || '')}</p></div>${item.id?`<button class="miniBtn" data-${type==='game'?'game-edit':'admin'}="${type==='game'?esc(item.id):'Raporlar'}">${type==='game'?'Düzenle':'Aç'}</button>`:''}</article>`).join('') || '<p class="muted">Bu kategoride kayıt yok.</p>'}</section>`;
}
function ho240f45ReportsPanel(){
  const d = ho240f45ReportData();
  return `<section class="fix45Reports"><div class="card wide fix45ReportsHero"><div><span class="eyebrow">Filtre • Dışa Aktar • Öncelik</span><h2>Raporlar</h2><p class="muted">Artık sadece boş bir sayfa değil: eksik içerik, kullanıcı istekleri, hata bildirimleri ve kontrol skoru tek yerde.</p></div><div class="rowActions"><button class="btn primary" data-action="ho240f45-export-reports">Raporu JSON İndir</button><button class="btn" data-admin="İçerik Kontrol">İçerik Kontrol</button></div></div><div class="ho240f42StatGrid fix45StatGrid"><span><b>${d.missingCover.length}</b><small>Kapak eksik</small></span><span><b>${d.missingDate.length}</b><small>Tarih eksik</small></span><span><b>${d.missingGenre.length}</b><small>Tür eksik</small></span><span><b>${d.zeroEpisode.length}</b><small>Bölüm eksik</small></span><span><b>${d.requests.length}</b><small>İstek</small></span><span><b>${d.bugs.length}</b><small>Hata</small></span></div><div class="fix45ReportGrid">${ho240f45ReportList('Çıkış Tarihi Eksik',d.missingDate,'game')}${ho240f45ReportList('Kapak Eksik',d.missingCover,'game')}${ho240f45ReportList('Oyun İstekleri',d.requests,'feedback')}${ho240f45ReportList('Hata Bildirimleri',d.bugs,'feedback')}</div></section>`;
}
try{
  const ho240f45PrevAdminSubtitle = typeof adminSubtitle === 'function' ? adminSubtitle : null;
  adminSubtitle = function(page){
    const map = {
      'Genel Bakış':'Profesyonel özet, bildirim çubuğu ve kritik kontrol kartları.',
      'Raporlar':'Eksik oyun bilgileri, kullanıcı istekleri ve hata bildirimleri için işlevli rapor merkezi.',
      'Hata Bildir':'Kullanıcıların gönderdiği hata bildirimlerini yönet.',
      'Oyun İstekleri':'Kullanıcı oyun isteklerini incele ve durumlandır.',
      'Yayın Takvimi':'Yayın ve takip planını takvim görünümüyle yönet.'
    };
    return map[page] || (ho240f45PrevAdminSubtitle ? ho240f45PrevAdminSubtitle(page) : 'Panel içi butonlar sayfa yenilemeden çalışır.');
  };
  const ho240f45PrevAdminBody = typeof adminBody === 'function' ? adminBody : null;
  adminBody = function(){
    if(state.adminPage === 'Genel Bakış') return ho240f45Overview();
    if(state.adminPage === 'Raporlar') return ho240f45ReportsPanel();
    if(state.adminPage === 'Hata Bildir') return (typeof v224AdminBugReports === 'function' ? v224AdminBugReports() : (typeof adminBugReportsPageFix8 === 'function' ? adminBugReportsPageFix8() : ho240f45ReportsPanel()));
    if(state.adminPage === 'Oyun İstekleri') return (typeof v224AdminGameRequests === 'function' ? v224AdminGameRequests() : (typeof adminGameRequestsPageFix8 === 'function' ? adminGameRequestsPageFix8() : ho240f45ReportsPanel()));
    return ho240f45PrevAdminBody ? ho240f45PrevAdminBody() : '';
  };
  adminPanel = function(){
    if(!isStaff()) return `<section class="card"><h2>Yetki gerekiyor</h2><p>Yönetim paneli sadece yetkili hesaplara görünür.</p></section>`;
    const valid = ho240f45AdminLinks().map(x=>x[0]);
    if(!valid.includes(state.adminPage)){ state.adminPage='Genel Bakış'; try{ localStorage.setItem(ADMIN_TAB_KEY,state.adminPage); }catch{} }
    const open = state.ho240f45AdminMenuOpen !== false;
    const headerActions = state.adminPage === 'Oyunlar'
      ? `<div class="rowActions"><button class="btn" data-action="toggle-game-form">${state.showGameForm?'Formu Gizle':'Yeni Oyun Ekle'}</button><button class="btn primary" data-admin="İçerik Kontrol">İçerik Kontrol</button></div>`
      : state.adminPage === 'Raporlar'
        ? `<div class="rowActions"><button class="btn primary" data-action="ho240f45-export-reports">Raporu İndir</button><button class="btn" data-admin="İçerik Kontrol">Eksikleri Aç</button></div>`
        : `<span class="pill ${state.maintenance?.enabled?'banned':'green'}">${state.maintenance?.enabled?'Bakım açık':'Bakım kapalı'}</span>`;
    return `<section class="fix5AdminShell ho240AdminShell ho240f42AdminShell fix45AdminShell"><aside class="fix5AdminSidebar fix45AdminSidebar"><div class="sideLogo"><span class="logoMark">🎮</span><div><b>Hayatımız Oyun</b><small>${esc(HO240F45_PUBLIC_VERSION)} Yönetim</small></div></div><div class="sideNavLabel">SİTE</div><button class="sideNavItem" data-page="Ana Sayfa"><span>⌂</span>Ana Sayfa</button><button class="sideNavItem" data-page="Oyun Arşivi"><span>🎮</span>Oyun Arşivi</button><button class="sideNavItem" data-page="Seriler"><span>◈</span>Seriler</button><button class="sideNavItem" data-page="Takvim"><span>▣</span>Yayın Takvimi</button><button class="sideNavItem" data-page="Oyun İstekleri"><span>💡</span>Oyun İste</button><button class="sideNavItem" data-page="Hata Bildir"><span>🐞</span>Hata Bildir</button><div class="sideNavLabel">YÖNETİM</div><div class="adminAccordion ${open?'open':'closed'}"><button class="adminAccordionHead active" type="button" data-action="ho240f45-toggle-admin-menu"><span>👑</span><div><b>Yönetim Paneli</b><small>${open?'Menüyü kapat':'Menüyü aç'}</small></div><strong>${open?'⌄':'›'}</strong></button><div class="adminAccordionBody">${open ? ho240f45AdminLinks().map(([page,cap])=>`<button class="adminSubLink ${state.adminPage===page?'active':''}" data-admin="${esc(page)}"><span class="subDot"></span><div><b>${esc(page)}</b><small>${esc(cap)}</small></div></button>`).join('') : ''}</div></div></aside><div class="adminContent fix5AdminContent fix45AdminContent">${ho240f45AdminNoticeBar()}<div class="fix5AdminHeader fix45AdminHeader"><div><div class="adminBreadcrumb">Yönetim Paneli <span>›</span> ${esc(state.adminPage)}</div><h1>${esc(state.adminPage)}</h1><p>${esc(adminSubtitle(state.adminPage))}</p></div>${headerActions}</div>${adminBody()}</div></section>`;
  };
}catch(error){ console.warn('FIX45 yönetim paneli kurulamadı:', error); }
try{
  const ho240f45PrevDashboard = typeof gameArchiveDashboard === 'function' ? gameArchiveDashboard : null;
  gameArchiveDashboard = function(){
    const games = Array.isArray(state.games) ? state.games : [];
    const stats = ho240f43StatValue(games);
    const featured = games.slice().sort((a,b)=>Number(b.score||0)-Number(a.score||0)).slice(0,8);
    const continued = games.filter(g=>String(g.status||'').toLocaleLowerCase('tr-TR').includes('devam') || Number(g.watchedEps || 0) > 0 || String(g.seriesName||'').trim()).slice(0,4);
    const recent = state.watchHistory.slice(0,4);
    return `<section class="v220Shell fix4Shell fix43Dashboard fix45Dashboard">${archiveSideNav()}<main class="v220HomeMain fix4HomeMain fix43HomeMain"><section class="fix43Hero fix45Hero"><div class="fix43HeroOverlay"></div><div class="fix43HeroCopy"><span class="eyebrow">${esc(HO240F45_PUBLIC_VERSION)} • Profesyonel Arşiv</span><h1>Hayatımız Oyun</h1><p>Oyunları keşfet, serileri takip et, yayın takvimini gör ve istediğin oyunu veya hatayı kolayca bildir.</p><div class="heroActions"><button class="btn primary" data-page="Oyun Arşivi">Oyun Ara</button><button class="btn" data-page="Seriler">Serileri Gör</button><button class="btn" data-page="Oyun İstekleri">Oyun İste</button><button class="btn" data-page="Hata Bildir">Hata Bildir</button></div></div><div class="fix43HeroStats fix45HeroStats"><div><small>Toplam Oyun</small><b>${stats.totalGames.toLocaleString('tr-TR')}</b><span>Arşiv kaydı</span></div><div><small>Toplam Seri</small><b>${stats.totalSeries.toLocaleString('tr-TR')}</b><span>Seri takibi</span></div><div><small>Toplam Bölüm</small><b>${stats.totalEpisodes.toLocaleString('tr-TR')}</b><span>Playlist/bölüm</span></div><div><small>Kontrol Skoru</small><b>%${stats.controlScore}</b><span>İçerik sağlığı</span></div></div></section><section class="fix43Section"><div class="sectionHead"><div><h2>Öne Çıkan Oyunlar</h2><p class="muted">Daha temiz kartlar, güçlü kapak vitrini ve seri takibi.</p></div><button class="miniBtn" data-page="Oyun Arşivi">Tüm Oyunları Gör</button></div><div class="fix43FeaturedGrid">${featured.map(g=>miniGameTile(g)).join('') || '<div class="card">Henüz oyun yok.</div>'}</div></section><section class="fix43BottomGrid"><div class="fix43Panel"><div class="sectionHead"><div><h2>Devam Eden Seriler</h2><p class="muted">İzleyicilerin devam eden içerikleri net görmesi için ayrılmış alan.</p></div><button class="miniBtn" data-page="Seriler">Tümü</button></div><div class="fix43ContinueGrid">${continued.map(g=>ho240f43ContinueCard(g)).join('') || '<div class="card">Devam eden seri bulunmadı.</div>'}</div></div><aside class="fix43RightColumn"><div class="fix43ProfileCard fix45ActionCard"><h3>Hızlı İşlem</h3><p class="muted">Kullanıcı geri bildirim alanları geri getirildi.</p><button class="miniBtn primary" data-page="Oyun İstekleri">Oyun İste</button><button class="miniBtn" data-page="Hata Bildir">Hata Bildir</button><button class="miniBtn" data-page="Takvim">Yayın Takvimi</button></div><div class="fix43ActivityCard"><div class="sectionHead"><div><h3>Son Etkinlikler</h3><p class="muted">İzleme ve yayın hareketleri</p></div></div>${recent.map(h=>`<p class="activityItem">▶ ${esc(h.title)} • ${esc(String(h.episode || '0'))}. bölüm</p>`).join('') || '<p class="muted">Henüz etkinlik yok.</p>'}</div></aside></section></main></section>`;
  };
}catch(error){ console.warn('FIX45 dashboard kurulamadı:', error); }
try{
  const ho240f45PrevOnAction = typeof onAction === 'function' ? onAction : null;
  onAction = async function(e){
    const action = e.currentTarget?.dataset?.action || '';
    if(action === 'ho240f45-toggle-admin-menu'){
      e.preventDefault(); e.stopImmediatePropagation();
      state.ho240f45AdminMenuOpen = !state.ho240f45AdminMenuOpen;
      try{ localStorage.setItem('hayatimiz_fix45_admin_menu_open', state.ho240f45AdminMenuOpen ? '1':'0'); }catch{}
      render(); return;
    }
    if(action === 'ho240f45-export-reports'){
      e.preventDefault(); e.stopImmediatePropagation();
      const data = ho240f45ReportData();
      const payload = { createdAt:new Date().toISOString(), version:HO240F45_INTERNAL_VERSION, totals:{ games:data.games.length, requests:data.requests.length, bugs:data.bugs.length, missingCover:data.missingCover.length, missingDate:data.missingDate.length, missingGenre:data.missingGenre.length, zeroEpisode:data.zeroEpisode.length }, missingDate:data.missingDate.map(g=>({id:g.id,title:g.title,seriesName:g.seriesName,releaseDate:g.releaseDate||''})), requests:data.requests, bugs:data.bugs };
      try{ const blob = new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='hayatimiz-oyun-rapor-fix45.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); setToast('Rapor indirildi.'); }catch{ setToast('Rapor hazırlandı fakat tarayıcı indirme izni vermedi.'); }
      return;
    }
    if(['ho240f42-refetch-release','ho240f41-refetch-release'].includes(action)){
      e.preventDefault(); e.stopImmediatePropagation(); await ho240f42RefetchRelease(ho240f45Form(e.currentTarget)); return;
    }
    return ho240f45PrevOnAction ? await ho240f45PrevOnAction(e) : undefined;
  };
}catch(error){ console.warn('FIX45 onAction kurulamadı:', error); }
try{
  if(Array.isArray(VERSION_NOTES_ARCHIVE) && !VERSION_NOTES_ARCHIVE.some(n=>n.version===HO240F45_INTERNAL_VERSION)){
    VERSION_NOTES_ARCHIVE.unshift({
      version:HO240F45_INTERNAL_VERSION,
      title:'Panel, Raporlar ve Çıkış Tarihi Stabilizasyonu',
      summary:'Üst menü sadeleştirildi, yönetim paneli aç/kapa çalışır hale geldi, Yayın Takvimi adı düzeltildi, Oyun İste/Hata Bildir geri getirildi, raporlar işlevli yapıldı ve çıkış tarihi forma kesin işlenir hale getirildi.',
      image:'previews/hayatimiz-oyun-v240-fix45-panel-rapor-tarih.png',
      written:'FIX45 ile yönetim paneli bildirim çubuğu, rapor merkezi, kullanıcı geri bildirim menüleri ve çıkış tarihi çekme algoritması profesyonel hale getirildi.'
    });
  }
  document.title = `Hayatımız Oyun - ${HO240F45_PUBLIC_VERSION}`;
  try{ localStorage.setItem('hayatimiz_last_fix_version', HO240F45_INTERNAL_VERSION); }catch{}
  if(document.getElementById('root')?.dataset?.mounted === '1') render();
}catch(error){ console.warn('FIX45 final render atlandı:', error); }

/* FIX46: Oyun yönetimi ayrımı, eksik alan hızlı düzenleme, tür/etiket stabilizasyonu, ayarlar ve güncelleme notları profesyonel düzen */
const HO240F46_INTERNAL_VERSION = 'v2.4.0 FIX 46';
const HO240F46_PUBLIC_VERSION = (typeof ho240f24Version === 'function' ? ho240f24Version() : (localStorage.getItem('hayatimiz_last_public_version') || 'v2.4.1'));
const HO240F46_GENRE_OPTIONS = ['Aksiyon','Macera','Korku','RPG','Açık Dünya','Hikaye Odaklı','Bulmaca','Platform','Coop','FPS','TPS','Roguelike','Simülasyon','Strateji','DLC'];
function ho240f46SplitCSV(value){ return String(value||'').split(',').map(x=>x.trim()).filter(Boolean); }
function ho240f46GenreButtonsHtml(selectedText){
  const selected = new Set(ho240f46SplitCSV(selectedText).map(t=>t.toLocaleLowerCase('tr-TR')));
  return `<div class="tagButtonGrid genreButtonGrid">${HO240F46_GENRE_OPTIONS.map(tag=>`<button class="tagBtn genreBtn ${selected.has(tag.toLocaleLowerCase('tr-TR'))?'active':''}" type="button" data-genre-toggle="${esc(tag)}">${esc(tag)}</button>`).join('')}</div>`;
}
function ho240f46ProblemBadges(g){
  const badges = [];
  if(!String(g.cover||'').trim()) badges.push('Kapak eksik');
  if(!String(g.releaseDate||'').trim()) badges.push('Tarih eksik');
  if(!String(g.genre||'').trim()) badges.push('Tür eksik');
  if(!String(g.tags||'').trim()) badges.push('Etiket eksik');
  if(!Number(g.eps||0) && !String(g.playlistUrl||'').trim()) badges.push('Bölüm/playlist eksik');
  return badges;
}
function ho240f46AdminLinks(){
  return [
    ['Genel Bakış','Özet ve hızlı işlemler'],
    ['İçerik Kontrol','Eksik alanları düzelt'],
    ['Mevcut Oyunlar','Listele / düzenle / sil'],
    ['Oyun Ekle','Yeni kayıt oluştur'],
    ['Seri İzleme','Sıra ve playlist'],
    ['Seri Geçmişi','Karşılaştır / geri al'],
    ['Yayın Takvimi','Takvim görünümü'],
    ['Bildirim Kuyruğu','Tarayıcı/e-posta'],
    ['Oyun İstekleri','Gelen istekler'],
    ['Hata Bildir','Gelen hatalar'],
    ['Raporlar','Filtre / dışa aktar'],
    ['Bakım Modu','Bakım ekranı'],
    ['Güncelleme Notları','Admin ve kullanıcı sürüm notları'],
    ['Kullanıcı Yetkileri','Rol ve yetkiler'],
    ['Profil','Profil bilgileri'],
    ['Ayarlar','Tema ve sistem tercihleri']
  ];
}
try{ ho240f45AdminLinks = ho240f46AdminLinks; }catch{}
try{
  const ho240f46PrevAdminNavigate = typeof adminNavigate === 'function' ? adminNavigate : null;
  adminNavigate = function(page){
    state.page = 'Yönetim Paneli';
    state.adminPage = page || 'Genel Bakış';
    if(state.adminPage === 'Oyun Ekle'){
      state.editingGameId = null;
      state.showGameForm = true;
      if(!state.gameDraft) state.gameDraft = { ...DEFAULT_GAME_DRAFT };
    }
    if(state.adminPage === 'Mevcut Oyunlar'){
      state.showGameForm = false;
    }
    if(state.adminPage === 'Oyunlar'){
      state.adminPage = 'Mevcut Oyunlar';
      state.showGameForm = false;
    }
    localStorage.setItem(PAGE_KEY, 'Yönetim Paneli');
    localStorage.setItem(ADMIN_TAB_KEY, state.adminPage);
    try{ syncRouteToAddress(); }catch{}
    if(state.adminPage === 'Kullanıcı Yetkileri') loadUsers();
    render();
  };
}catch(error){ console.warn('FIX46 adminNavigate kurulamadı:', error); }
try{
  const ho240f46PrevOnGameEdit = typeof onGameEdit === 'function' ? onGameEdit : null;
  onGameEdit = async function(e){
    e.preventDefault();
    e.stopPropagation();
    const id = e.currentTarget.dataset.gameEdit;
    const current = state.games.find(g => String(g.id) === String(id));
    if(!current) return setToast('Oyun bulunamadı.');
    state.page = 'Yönetim Paneli';
    state.adminPage = 'Oyun Ekle';
    state.editingGameId = id;
    state.showGameForm = false;
    state.rawgCandidates = [];
    try{ localStorage.setItem(PAGE_KEY,'Yönetim Paneli'); localStorage.setItem(ADMIN_TAB_KEY,'Oyun Ekle'); syncRouteToAddress(); }catch{}
    render();
    setToast(`${current.title} düzenleme formunda açıldı.`);
  };
}catch(error){ console.warn('FIX46 oyun düzenleme yönlendirmesi kurulamadı:', error); }
try{
  gameFormFields = function(d, mode='add'){
    const opts = ['Devam Ediyor','Tamamlandı','Popüler','Yakında'].map(st=>`<option ${d.status===st?'selected':''}>${st}</option>`).join('');
    const descPreview = (d.description || 'Bu oyun, site üzerinde aşağıdaki gibi görünecektir.').slice(0,240);
    const dateValue = (typeof formatDateTrFix6 === 'function' ? formatDateTrFix6(d.releaseDate || '') : (d.releaseDate || ''));
    const isEdit = mode === 'edit';
    return `<div class="fix6AdminGameComposer fix6FinalComposer ho240f46Composer"><div class="fix6AdminGameMain ho240f46FormMain"><div class="fix6FormGridHeader ho240f46FormHeader"><div><span class="eyebrow">${isEdit?'Mevcut Oyunu Düzenle':'Yeni Oyun Ekle'}</span><h3>${isEdit?'Oyunu Güncelle':'Oyun Bilgileri'}</h3><p class="muted">Türler ve etiketler ayrıldı. Çekme butonları sadece formu doldurur; kayıt yalnızca Kaydet/Güncelle ile yapılır.</p></div><span class="pill green">Stabil Form</span></div><div class="ho240f46AssistantBar"><button class="miniBtn primary" type="button" data-action="ho240f42-fetch-all">Tüm Bilgileri Çek</button><button class="miniBtn" type="button" data-action="ho240f42-find-covers">Kapakları Getir</button><button class="miniBtn" type="button" data-action="ho240f42-refetch-release">Çıkış Tarihini Çek</button><button class="miniBtn" type="button" data-action="ho240f42-refetch-genres">Türleri Çek</button><button class="miniBtn" type="button" data-action="ho240f42-refetch-description">Açıklama Çek</button><button class="miniBtn" type="button" data-action="${isEdit?'estimate-playlist-episodes-edit':'estimate-playlist-episodes'}">Playlist Bölümleri Çek</button></div><div class="formGrid cleanGameFormGrid fix6FormGrid ho240f46FormGrid"><label class="field">Oyun Adı *<input name="title" required placeholder="Örn: Alan Wake Remastered DLC: The Writer" value="${esc(d.title||'')}" /></label><label class="field">Seri Adı<input name="seriesName" placeholder="Örn: Alan Wake" value="${esc(d.seriesName || '')}" /></label><label class="field">Çıkış Tarihi <small>gün.ay.yıl</small><div class="fieldInline"><input name="releaseDate" placeholder="27.10.2017" value="${esc(dateValue)}" /><button class="miniBtn" type="button" data-action="ho240f42-refetch-release">Tekrar Çek</button></div></label><label class="field">Durum<select name="status">${opts}</select></label><label class="field wideField ho240f46GenreField"><span>Türler</span><input name="genre" required placeholder="Aksiyon, Macera, Korku" value="${esc(d.genre||'')}" />${ho240f46GenreButtonsHtml(d.genre)}</label><div class="field wideField ho240f46TagField"><span>Etiketler</span>${tagButtonsHtml(d.tags)}</div><label class="field wideField">Kapak Görseli<div class="fix6UploadRow"><div class="coverDropHint"><span>🖼️</span><b>Kapak URL veya otomatik kapak</b><small>Kapak seçince oyun adı değişmez. Kaydetmeden Supabase’e yazılmaz.</small><button class="miniBtn" type="button" data-action="ho240f42-find-covers">Kapakları Getir</button></div><div class="coverPreview ${d.cover?'':'isEmpty'}">${d.cover?`<img src="${esc(d.cover)}" alt="Kapak önizleme">`:'Kapak seçilince burada önizleme görünür.'}</div></div><input name="cover" placeholder="https://..." value="${esc(d.cover||'')}" /></label><label class="field wideField storyField">Hikâye / Açıklama<textarea name="description" rows="7" placeholder="Oyun için temiz Türkçe özet yaz veya Açıklama Çek butonunu kullan.">${esc(d.description || '')}</textarea></label><label class="field">Puan<input name="score" type="number" min="0" max="10" step="0.1" value="${esc(String(d.score ?? 8.5))}" /></label><label class="field">Toplam Bölüm<input name="eps" type="number" min="0" value="${esc(String(d.eps ?? 0))}" /></label><label class="field">İzlenen Bölüm<input name="watchedEps" type="number" min="0" value="${esc(String(d.watchedEps ?? 0))}" /></label><label class="field">Seri Sıra No<input name="seriesOrder" type="number" min="0" value="${esc(String(d.seriesOrder ?? 0))}" /></label><label class="field wideField">YouTube Playlist<input name="playlistUrl" placeholder="https://youtube.com/playlist?list=..." value="${esc(d.playlistUrl || '')}" /></label><label class="field wideField">Tek Video URL<input name="videoUrl" placeholder="https://youtube.com/watch?v=..." value="${esc(d.videoUrl || '')}" /></label><label class="field wideField episodeImportField">Bölüm Listesi${episodeImportPreview(d.episodesText, d.episodes)}<textarea name="episodesText" rows="5" class="technicalEpisodes" placeholder="Teknik bölüm verisi otomatik oluşur">${esc(d.episodesText || episodesToText(d.episodes || []))}</textarea><button class="miniBtn" type="button" data-action="toggle-technical-episodes">Teknik Veriyi Göster / Gizle</button></label></div><div class="fix6FormBottomActions ho240f46BottomActions"><button class="btn" type="button" data-action="${isEdit?'close-game-edit':'toggle-game-form'}">İptal</button><button class="btn primary" type="submit">${isEdit?'Oyunu Güncelle':'Oyunu Kaydet'}</button></div></div><aside class="fix6AdminGamePreview ho240f46Preview"><h3>Canlı Önizleme</h3><p class="muted">Kayıt, kullanıcı tarafında bu kaliteye yakın kart yapısıyla görünür.</p><article class="fix6PreviewCard"><div class="fix6PreviewCover"><img src="${esc(d.cover || 'https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1000&auto=format&fit=crop')}" alt="${esc(d.title || 'Oyun')}" /><span class="scoreBadge fix4Score">${esc(String(d.score || '8.5'))}</span></div><div class="fix6PreviewBody"><h4>${esc(d.title || 'Oyun adı')}</h4><div class="ho240f46PreviewChipRow">${ho240f46SplitCSV(d.genre).map(t=>`<span>${esc(t)}</span>`).join('')}${tagChipsHtml(d.tags || '')}</div><p>${esc(descPreview)}</p><div class="fix6MetaGrid"><div><small>Çıkış Tarihi</small><b>${esc(dateValue || '-')}</b></div><div><small>Tür</small><b>${esc(d.genre || 'Genel')}</b></div><div><small>Etiket</small><b>${esc(d.tags || '-')}</b></div><div><small>Durum</small><b>${esc(d.status || 'Devam Ediyor')}</b></div></div></div></article></aside></div>`;
  };
  gameAddForm = function(){ const d = { ...DEFAULT_GAME_DRAFT, ...state.gameDraft }; return `<form class="card soft gameForm fix6GameForm ho240f46GameForm" id="gameAddForm" autocomplete="off">${gameFormFields(d,'add')}</form>`; };
  gameEditForm = function(){ const current = state.games.find(g=>String(g.id)===String(state.editingGameId)); if(!current) return ''; return `<form class="card soft gameForm editGameForm fix6GameForm ho240f46GameForm" id="gameEditForm" autocomplete="off">${gameFormFields(current,'edit')}</form>`; };
}catch(error){ console.warn('FIX46 form kurulamadı:', error); }
function ho240f46GamesListPanel(){
  const q = normalizeSearchText(state.adminGameSearch || state.query || '');
  const games = (Array.isArray(state.games) ? state.games : []).filter(g=>!q || normalizeSearchText(`${g.title||''} ${g.seriesName||''} ${g.genre||''} ${g.tags||''}`).includes(q)).sort((a,b)=>String(a.title||'').localeCompare(String(b.title||''),'tr'));
  return `<section class="ho240f46GameManager"><div class="card wide ho240f46GameHero"><div><span class="eyebrow">Mevcut Oyunlar</span><h2>Oyun Yönetim Listesi</h2><p class="muted">Oyunları kart + tablo karışımı profesyonel görünümle düzenle. Eksik alan rozeti olan kayıtlar tek tıkla forma açılır.</p></div><div class="rowActions"><button class="btn primary" data-admin="Oyun Ekle">Yeni Oyun Ekle</button><button class="btn" data-admin="İçerik Kontrol">Eksikleri Göster</button></div></div><section class="card wide ho240f46Toolbar"><label class="search toolSearch">🔎 <input id="ho240f46GameSearch" value="${esc(state.adminGameSearch || '')}" placeholder="Oyun, seri, tür veya etiket ara..."></label><div class="rowActions"><span class="pill green">${games.length} kayıt</span><span class="pill ${games.filter(g=>ho240f46ProblemBadges(g).length).length?'banned':'green'}">${games.filter(g=>ho240f46ProblemBadges(g).length).length} düzeltilecek</span></div></section><div class="ho240f46GameListGrid">${games.map(g=>{ const miss=ho240f46ProblemBadges(g); return `<article class="ho240f46GameRow ${miss.length?'needsFix':''}"><img src="${esc(eventCardCoverFix6(g))}" alt="${esc(g.title)}"><div class="ho240f46GameRowMain"><div><h3>${esc(g.title)}</h3><p>${esc(g.seriesName || 'Seri yok')} • ${esc(formatDateTrFix6(g.releaseDate) || 'Tarih yok')}</p></div><div class="ho240f46MetaChips"><span>Tür: ${esc(g.genre||'-')}</span><span>Etiket: ${esc(g.tags||'-')}</span>${miss.map(m=>`<span class="bad">${esc(m)}</span>`).join('')}</div></div><div class="ho240f46GameRowActions"><button class="miniBtn primary" data-game-edit="${esc(g.id)}">Düzenle</button><button class="miniBtn" data-watch-series="${esc(g.id)}">Sitede İzle</button><button class="miniBtn danger" data-game-delete="${esc(g.id)}">Sil</button></div></article>`; }).join('') || '<section class="card wide">Oyun bulunamadı.</section>'}</div></section>`;
}
function ho240f46GameAddPanel(){
  return `<section class="ho240f46GameAddPage"><div class="card wide ho240f46GameHero"><div><span class="eyebrow">Oyun Ekle / Düzenle</span><h2>${state.editingGameId?'Mevcut Oyunu Düzenle':'Yeni Oyun Ekle'}</h2><p class="muted">Bu ekranda yalnızca form çalışır. Mevcut oyun listesi ayrı kategoriye taşındı.</p></div><div class="rowActions"><button class="btn" data-admin="Mevcut Oyunlar">Mevcut Oyunlar</button>${state.editingGameId?'<button class="btn" data-action="close-game-edit">Düzenlemeyi Kapat</button>':''}</div></div>${state.editingGameId ? gameEditForm() : gameAddForm()}${rawgCandidatePanel()}${coverSuggestionPanel()}</section>`;
}
try{ gamesAdmin = function(){ return ho240f46GamesListPanel(); }; }catch{}
function ho240f46ContentControlPanel(){
  const d = ho240f45ReportData();
  const all = [
    ['Çıkış Tarihi Eksik', d.missingDate, 'releaseDate'], ['Kapak Eksik', d.missingCover, 'cover'], ['Tür Eksik', d.missingGenre, 'genre'], ['Bölüm / Playlist Eksik', d.zeroEpisode, 'eps']
  ];
  return `<section class="ho240f46ContentControl"><div class="card wide ho240f46GameHero"><div><span class="eyebrow">Eksik Alanlar ve Düzeltilecek Kayıtlar</span><h2>İçerik Kontrol Merkezi</h2><p class="muted">Karttaki oyuna veya Düzenle butonuna tıklayınca doğrudan oyun düzenleme formu açılır.</p></div><button class="btn primary" data-admin="Mevcut Oyunlar">Tüm Oyunlar</button></div><div class="ho240f46IssueGrid">${all.map(([title,list,key])=>`<section class="card ho240f46IssueColumn"><div class="sectionHead"><div><h3>${esc(title)}</h3><p class="muted">${list.length} kayıt</p></div><span class="pill ${list.length?'banned':'green'}">${list.length}</span></div><div class="ho240f46IssueList">${list.slice(0,12).map(g=>`<article class="ho240f46IssueItem" data-game-edit="${esc(g.id)}"><img src="${esc(eventCardCoverFix6(g))}" alt="${esc(g.title)}"><div><b>${esc(g.title)}</b><small>${esc(g.seriesName || 'Seri yok')} • ${esc(formatDateTrFix6(g.releaseDate)||'Tarih yok')}</small><p>${esc((g.genre||g.tags||'Eksik alanı tamamlamak için aç').slice(0,80))}</p></div><button class="miniBtn primary" data-game-edit="${esc(g.id)}">Formda Aç</button></article>`).join('') || '<p class="muted">Bu kategoride eksik yok.</p>'}</div></section>`).join('')}</div></section>`;
}
function ho240f46SettingsPanel(){
  return `<section class="ho240f46Settings"><div class="card wide ho240f46GameHero"><div><span class="eyebrow">Profesyonel Ayarlar</span><h2>Site ve Panel Ayarları</h2><p class="muted">Ayarlar bölümü artık sadece boş liste değil; bakım, görünüm, local önizleme ve veri güvenliği kısayollarını birleştirir.</p></div><span class="pill green">Stabil</span></div><div class="ho240f46SettingsGrid"><article class="card"><h3>Görünüm</h3><p class="muted">Koyu oyun arşivi teması, kart yoğunluğu ve vitrin görünümü.</p><button class="miniBtn primary" data-toast="Görünüm ayarı sonraki pakette gerçek tema seçiciye bağlanacak.">Tema Önizle</button></article><article class="card"><h3>Bakım Modu</h3><p class="muted">Kullanıcılara bakım mesajı ve güncelleme notları göster.</p><button class="miniBtn primary" data-admin="Bakım Modu">Bakım Ayarları</button></article><article class="card"><h3>Local Önizleme</h3><p class="muted">Yayınlamadan önce VS Code üzerinden kontrol et.</p><code>03-VSCode-Localhost-Onizleme.bat</code></article><article class="card"><h3>Veri Güvenliği</h3><p class="muted">Çekme butonları kayıt yapmaz. Kaydet/Güncelle dışında Supabase’e yazılmaz.</p><button class="miniBtn" data-admin="Raporlar">Raporları Aç</button></article></div></section>`;
}
function ho240f46UpdateNotesAdmin(){
  const selected = state.updateFilter || 'Tümü';
  const q = normalizeSearchText(state.updateQuery || '');
  const versions = ['Tümü', ...Array.from(new Set(VERSION_NOTES_ARCHIVE.map(n=>n.version)))];
  const filtered = VERSION_NOTES_ARCHIVE.filter(n => (selected === 'Tümü' || n.version === selected) && (!q || normalizeSearchText(`${n.version} ${n.title} ${n.summary} ${n.written}`).includes(q))).slice(0,30);
  const editing = state.editingUpdateNoteId ? VERSION_NOTES_ARCHIVE.find(n=>noteId(n)===state.editingUpdateNoteId) : null;
  return `<section class="ho240f46UpdateAdmin"><div class="card wide ho240f46GameHero"><div><span class="eyebrow">Sürüm Notları</span><h2>Güncelleme Notları Yönetimi</h2><p class="muted">Admin notu, kullanıcıya gösterilecek özet ve bakım ekranı duyuruları tek tasarımda toplandı.</p></div><button class="btn" data-page="Güncellemeler">Kullanıcı Görünümü</button></div><div class="ho240f46UpdateLayout"><form id="updateNoteForm" class="card ho240f46UpdateEditor"><input type="hidden" name="id" value="${esc(editing?noteId(editing):'')}"><h3>${editing?'Notu Düzenle':'Yeni Sürüm Notu'}</h3><label class="field">Sürüm<input name="version" value="${esc(editing?.version || HO240F46_PUBLIC_VERSION)}" placeholder="v2.4.2" required></label><label class="field">Başlık<input name="title" value="${esc(editing?.title || '')}" placeholder="Kısa başlık" required></label><label class="field">Kullanıcı Özeti<textarea name="summary" rows="4" placeholder="Kullanıcıların göreceği kısa ve net özet">${esc(editing?.summary || '')}</textarea></label><label class="field">Görsel / Önizleme URL<input name="image" value="${esc(editing?.image || '')}" placeholder="previews/...png veya https://"></label><label class="field">Detaylı Not<textarea name="written" rows="7" placeholder="Yapılan değişiklikleri madde madde yaz">${esc(editing?.written || '')}</textarea></label><div class="rowActions"><button class="btn" type="button" data-action="download-notes">Notları İndir</button>${editing?'<button class="btn" type="button" data-action="cancel-update-edit">Vazgeç</button>':''}<button class="btn primary" type="submit">${editing?'Notu Güncelle':'Notu Ekle'}</button></div></form><section class="card ho240f46UpdateArchive"><div class="sectionHead"><div><h3>Profesyonel Arşiv</h3><p class="muted">Kullanıcıya gösterilecek sürüm akışı.</p></div><span class="pill green">${filtered.length} not</span></div><div class="updateTools"><label class="field">Sürüm<select id="updateVersionFilter">${versions.map(v=>`<option value="${esc(v)}" ${selected===v?'selected':''}>${esc(v)}</option>`).join('')}</select></label><label class="field">Ara<input id="updateSearchInput" value="${esc(state.updateQuery || '')}" placeholder="Sürüm, başlık, not ara"></label></div><div class="ho240f46UpdateCards">${filtered.map(n=>`<article><span class="pill green">${esc(n.version)}</span><h3>${esc(n.title)}</h3><p>${esc(n.summary || n.written || '')}</p><div class="rowActions"><button class="miniBtn" data-update-edit="${esc(noteId(n))}">Düzenle</button><button class="miniBtn danger" data-update-delete="${esc(noteId(n))}">Sil</button></div></article>`).join('') || '<p class="muted">Not bulunamadı.</p>'}</div></section></div></section>`;
}
function ho240f46PublicUpdatesPage(){
  const notes = VERSION_NOTES_ARCHIVE.slice(0,12);
  return `<section class="ho240f46PublicUpdates"><div class="card wide ho240f46PublicUpdatesHero"><span class="eyebrow">Hayatımız Oyun</span><h1>Güncelleme Notları</h1><p class="muted">Kullanıcıların siteye gelen yenilikleri temiz ve anlaşılır şekilde görebileceği sürüm geçmişi.</p></div><div class="ho240f46PublicTimeline">${notes.map(n=>`<article><span>${esc(n.version)}</span><h2>${esc(n.title)}</h2><p>${esc(n.summary || n.written || '')}</p>${n.image?`<small>${esc(n.image)}</small>`:''}</article>`).join('')}</div></section>`;
}
try{
  const ho240f46PrevAdminSubtitle = typeof adminSubtitle === 'function' ? adminSubtitle : null;
  adminSubtitle = function(page){
    const map = {
      'Mevcut Oyunlar':'Kayıtlı oyunları arama, filtreleme, düzenleme ve silme ekranı.',
      'Oyun Ekle':'Yeni oyun ekleme ve mevcut oyun düzenleme formu.',
      'İçerik Kontrol':'Eksik alanlara tıklayınca doğrudan düzenleme formu açılır.',
      'Ayarlar':'Site, bakım, local önizleme ve veri güvenliği ayarları.',
      'Güncelleme Notları':'Admin ve kullanıcı tarafı için profesyonel sürüm notları.'
    };
    return map[page] || (ho240f46PrevAdminSubtitle ? ho240f46PrevAdminSubtitle(page) : 'Panel içi butonlar sayfa yenilemeden çalışır.');
  };
  const ho240f46PrevAdminBody = typeof adminBody === 'function' ? adminBody : null;
  adminBody = function(){
    if(state.adminPage === 'Mevcut Oyunlar' || state.adminPage === 'Oyunlar') return ho240f46GamesListPanel();
    if(state.adminPage === 'Oyun Ekle') return ho240f46GameAddPanel();
    if(state.adminPage === 'İçerik Kontrol') return ho240f46ContentControlPanel();
    if(state.adminPage === 'Ayarlar') return ho240f46SettingsPanel();
    if(state.adminPage === 'Güncelleme Notları') return ho240f46UpdateNotesAdmin();
    return ho240f46PrevAdminBody ? ho240f46PrevAdminBody() : '';
  };
}catch(error){ console.warn('FIX46 adminBody kurulamadı:', error); }
try{
  adminPanel = function(){
    if(!isStaff()) return `<section class="card"><h2>Yetki gerekiyor</h2><p>Yönetim paneli sadece yetkili hesaplara görünür.</p></section>`;
    const valid = ho240f46AdminLinks().map(x=>x[0]);
    if(state.adminPage === 'Oyunlar') state.adminPage = 'Mevcut Oyunlar';
    if(!valid.includes(state.adminPage)){ state.adminPage='Genel Bakış'; try{ localStorage.setItem(ADMIN_TAB_KEY,state.adminPage); }catch{} }
    const open = state.ho240f45AdminMenuOpen !== false;
    const headerActions = state.adminPage === 'Mevcut Oyunlar'
      ? `<div class="rowActions"><button class="btn primary" data-admin="Oyun Ekle">Yeni Oyun Ekle</button><button class="btn" data-admin="İçerik Kontrol">Eksikleri Aç</button></div>`
      : state.adminPage === 'Oyun Ekle'
        ? `<div class="rowActions"><button class="btn" data-admin="Mevcut Oyunlar">Mevcut Oyunlar</button>${state.editingGameId?'<button class="btn" data-action="close-game-edit">Düzenlemeyi Kapat</button>':''}</div>`
        : state.adminPage === 'Raporlar'
          ? `<div class="rowActions"><button class="btn primary" data-action="ho240f45-export-reports">Raporu İndir</button><button class="btn" data-admin="İçerik Kontrol">Eksikleri Aç</button></div>`
          : `<span class="pill ${state.maintenance?.enabled?'banned':'green'}">${state.maintenance?.enabled?'Bakım açık':'Bakım kapalı'}</span>`;
    return `<section class="fix5AdminShell ho240AdminShell ho240f42AdminShell fix45AdminShell ho240f46AdminShell"><aside class="fix5AdminSidebar fix45AdminSidebar ho240f46AdminSidebar"><div class="sideLogo"><span class="logoMark">🎮</span><div><b>Hayatımız Oyun</b><small>${esc(HO240F46_PUBLIC_VERSION)} Yönetim</small></div></div><div class="sideNavLabel">SİTE</div><button class="sideNavItem" data-page="Ana Sayfa"><span>⌂</span>Ana Sayfa</button><button class="sideNavItem" data-page="Oyun Arşivi"><span>🎮</span>Oyun Arşivi</button><button class="sideNavItem" data-page="Seriler"><span>◈</span>Seriler</button><button class="sideNavItem" data-page="Takvim"><span>▣</span>Yayın Takvimi</button><button class="sideNavItem" data-page="Güncellemeler"><span>📝</span>Güncelleme Notları</button><button class="sideNavItem" data-page="Oyun İstekleri"><span>💡</span>Oyun İste</button><button class="sideNavItem" data-page="Hata Bildir"><span>🐞</span>Hata Bildir</button><div class="sideNavLabel">YÖNETİM</div><div class="adminAccordion ${open?'open':'closed'}"><button class="adminAccordionHead active" type="button" data-action="ho240f45-toggle-admin-menu"><span>👑</span><div><b>Yönetim Paneli</b><small>${open?'Menüyü kapat':'Menüyü aç'}</small></div><strong>${open?'⌄':'›'}</strong></button><div class="adminAccordionBody">${open ? ho240f46AdminLinks().map(([page,cap])=>`<button class="adminSubLink ${state.adminPage===page?'active':''}" data-admin="${esc(page)}"><span class="subDot"></span><div><b>${esc(page)}</b><small>${esc(cap)}</small></div></button>`).join('') : ''}</div></div></aside><div class="adminContent fix5AdminContent fix45AdminContent ho240f46AdminContent">${ho240f45AdminNoticeBar()}<div class="fix5AdminHeader fix45AdminHeader ho240f46AdminHeader"><div><div class="adminBreadcrumb">Yönetim Paneli <span>›</span> ${esc(state.adminPage)}</div><h1>${esc(state.adminPage)}</h1><p>${esc(adminSubtitle(state.adminPage))}</p></div>${headerActions}</div>${adminBody()}</div></section>`;
  };
}catch(error){ console.warn('FIX46 adminPanel kurulamadı:', error); }
try{
  const ho240f46PrevPublicItems = typeof ho240f45PublicItems === 'function' ? ho240f45PublicItems : null;
  ho240f45PublicItems = function(){
    const items = ho240f46PrevPublicItems ? ho240f46PrevPublicItems() : [];
    if(!items.some(x=>x.page==='Güncellemeler')) items.splice(Math.max(0,items.length-2),0,{label:'Güncelleme Notları',page:'Güncellemeler',icon:'📝'});
    return items;
  };
  const ho240f46PrevPublicPage = typeof publicPage === 'function' ? publicPage : null;
  publicPage = function(){
    if(state.maintenance?.enabled && !isStaff()) return maintenancePage();
    if(!state.session) return authLanding();
    if(state.page === 'Güncellemeler') return withArchiveLayout(ho240f46PublicUpdatesPage());
    return ho240f46PrevPublicPage ? ho240f46PrevPublicPage() : '';
  };
}catch(error){ console.warn('FIX46 kullanıcı güncelleme sayfası kurulamadı:', error); }
try{
  const ho240f46PrevBind = typeof bind === 'function' ? bind : null;
  bind = function(){
    if(ho240f46PrevBind) ho240f46PrevBind();
    document.querySelectorAll('[data-genre-toggle]').forEach(el=>el.addEventListener('click', e=>{
      e.preventDefault();
      const form = el.closest('form'); if(!form || !form.elements.genre) return;
      const genre = String(el.dataset.genreToggle || '').trim();
      const current = ho240f46SplitCSV(form.elements.genre.value);
      const lower = genre.toLocaleLowerCase('tr-TR');
      const exists = current.some(t=>t.toLocaleLowerCase('tr-TR')===lower);
      const next = exists ? current.filter(t=>t.toLocaleLowerCase('tr-TR')!==lower) : [...current, genre];
      form.elements.genre.value = next.join(', ');
      el.classList.toggle('active', !exists);
      try{ saveGameDraftFromForm(form); }catch{}
    }));
    const gameSearch = document.getElementById('ho240f46GameSearch');
    if(gameSearch) gameSearch.addEventListener('input', e=>{ state.adminGameSearch = e.target.value || ''; render(); });
  };
}catch(error){ console.warn('FIX46 bind kurulamadı:', error); }
try{
  const ho240f46PrevOnAction = typeof onAction === 'function' ? onAction : null;
  onAction = async function(e){
    const action = e.currentTarget?.dataset?.action || '';
    if(['ho240f42-find-covers','ho240f42-refetch-release','ho240f42-refetch-genres','ho240f42-refetch-description','ho240f42-fetch-all','estimate-playlist-episodes','estimate-playlist-episodes-edit','auto-game-meta','auto-game-meta-edit','fetch-game-story','fetch-game-story-edit'].includes(action)){
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
    return ho240f46PrevOnAction ? await ho240f46PrevOnAction(e) : undefined;
  };
}catch(error){ console.warn('FIX46 onAction stabil kurulamadı:', error); }
try{
  if(Array.isArray(VERSION_NOTES_ARCHIVE) && !VERSION_NOTES_ARCHIVE.some(n=>n.version===HO240F46_INTERNAL_VERSION)){
    VERSION_NOTES_ARCHIVE.unshift({
      version:HO240F46_INTERNAL_VERSION,
      title:'Oyun Yönetimi ve Güncelleme Notları Profesyonel Fix',
      summary:'Mevcut Oyunlar ve Oyun Ekle ayrıldı, eksik alan kartları doğrudan düzenleme formuna bağlandı, tür/etiket alanları ayrıldı, ayarlar ve güncelleme notları profesyonel arayüze taşındı.',
      image:'previews/hayatimiz-oyun-v240-fix46-oyun-yonetimi-guncelleme.png',
      written:'FIX46 ile yönetim panelinde oyun listeleme ve oyun ekleme ayrı sayfa oldu. Eksik alanlar ve düzeltilecek kayıtlar tıklanınca direkt düzenleme formu açılıyor. Türler ve etiketler ayrı tutuluyor; kullanıcılar için Güncelleme Notları sayfası eklendi.'
    });
  }
  document.title = `Hayatımız Oyun - ${HO240F46_PUBLIC_VERSION}`;
  try{ localStorage.setItem('hayatimiz_last_fix_version', HO240F46_INTERNAL_VERSION); }catch{}
  if(document.getElementById('root')?.dataset?.mounted === '1') render();
}catch(error){ console.warn('FIX46 final render atlandı:', error); }

/* FIX47: v2.4.1 sürüm sabitleme, modal düzenleme, profesyonel bakım ve güncelleme notu arayüzü */
const HO240F47_INTERNAL_VERSION = 'v2.4.1 FIX 47';
const HO240F47_PUBLIC_VERSION = 'v2.4.1';
try{
  localStorage.setItem('hayatimiz_last_public_version', HO240F47_PUBLIC_VERSION);
  localStorage.setItem('ho240f14_current_site_version', HO240F47_PUBLIC_VERSION);
  if(typeof HO240F24_PUBLIC_VERSION_KEY !== 'undefined') localStorage.setItem(HO240F24_PUBLIC_VERSION_KEY, HO240F47_PUBLIC_VERSION);
}catch{}
try{ ho240f24Version = function(){ return HO240F47_PUBLIC_VERSION; }; }catch{}
function ho240f47RecentNoteLines(limit=5){
  return (Array.isArray(VERSION_NOTES_ARCHIVE)?VERSION_NOTES_ARCHIVE:[]).slice(0,limit).map(n=>`${n.version || HO240F47_PUBLIC_VERSION} - ${n.title || n.summary || 'Güncelleme'}`);
}
function ho240f47MaintPercent(){ return typeof ho240f29ClampPercent === 'function' ? ho240f29ClampPercent((state.maintenance||{}).progress ?? (state.maintenance||{}).percent ?? 70) : 70; }
function ho240f47MaintNotes(){ return typeof ho240f29MaintenanceNotes === 'function' ? ho240f29MaintenanceNotes() : ho240f47RecentNoteLines(4); }
function ho240f47EditModal(){
  if(!state.ho240f47EditModalId) return '';
  const current = (Array.isArray(state.games)?state.games:[]).find(g=>String(g.id)===String(state.ho240f47EditModalId));
  if(!current) return '';
  state.editingGameId = current.id;
  return `<div class="ho240f47ModalBackdrop" data-action="ho240f47-close-edit-modal"><section class="ho240f47EditModal" role="dialog" aria-modal="true" onclick="event.stopPropagation()"><div class="ho240f47ModalHead"><div><span class="eyebrow">Ayrı Düzenleme Penceresi</span><h2>${esc(current.title || 'Oyun Düzenle')}</h2><p class="muted">Eksik alan, mevcut oyun veya rapor listesinden açılan kayıt burada ayrı pencerede düzenlenir.</p></div><button class="modalCloseBtn" type="button" data-action="ho240f47-close-edit-modal">✕</button></div><form class="card soft gameForm editGameForm fix6GameForm ho240f46GameForm ho240f47ModalForm" id="gameEditForm" autocomplete="off">${gameFormFields(current,'edit')}</form>${rawgCandidatePanel()}${coverSuggestionPanel()}</section></div>`;
}
try{
  onGameEdit = async function(e){
    e.preventDefault(); e.stopPropagation(); if(e.stopImmediatePropagation) e.stopImmediatePropagation();
    const id = e.currentTarget?.dataset?.gameEdit || e.target?.closest?.('[data-game-edit]')?.dataset?.gameEdit;
    const current = (Array.isArray(state.games)?state.games:[]).find(g=>String(g.id)===String(id));
    if(!current) return setToast('Oyun bulunamadı.');
    state.page = 'Yönetim Paneli';
    state.ho240f47EditModalId = current.id;
    state.editingGameId = current.id;
    state.showGameForm = false;
    state.rawgCandidates = [];
    try{ localStorage.setItem(PAGE_KEY,'Yönetim Paneli'); syncRouteToAddress(); }catch{}
    render();
    setToast(`${current.title} ayrı düzenleme penceresinde açıldı.`);
  };
}catch(error){ console.warn('FIX47 modal edit kurulamadı:', error); }
try{
  const ho240f47PrevEditSubmit = typeof onGameEditSubmit === 'function' ? onGameEditSubmit : null;
  onGameEditSubmit = async function(e){
    await (ho240f47PrevEditSubmit ? ho240f47PrevEditSubmit(e) : Promise.resolve());
    state.ho240f47EditModalId = null;
    state.editingGameId = null;
    state.rawgCandidates = [];
    render();
  };
}catch(error){ console.warn('FIX47 edit submit kurulamadı:', error); }
function ho240f47IssueList(title, list, tone){
  return `<section class="card ho240f47IssueColumn ${tone||''}"><div class="sectionHead"><div><h3>${esc(title)}</h3><p class="muted">Oyuna tıkla veya Eksiği Gider butonuna bas; form ayrı pencerede açılır.</p></div><span class="pill ${list.length?'banned':'green'}">${list.length}</span></div><div class="ho240f47IssueList">${list.slice(0,16).map(g=>`<article class="ho240f47IssueItem" data-game-edit="${esc(g.id)}"><img src="${esc(eventCardCoverFix6(g))}" alt="${esc(g.title)}"><div><b>${esc(g.title)}</b><small>${esc(g.seriesName || 'Seri yok')} • ${esc(formatDateTrFix6(g.releaseDate)||'Tarih yok')}</small><p>${esc((g.genre||g.tags||'Eksik bilgi tamamlanmalı').slice(0,90))}</p></div><button class="miniBtn primary" data-game-edit="${esc(g.id)}">Eksiği Gider</button></article>`).join('') || '<p class="muted">Bu alanda eksik yok.</p>'}</div></section>`;
}
try{
  ho240f46ContentControlPanel = function(){
    const d = ho240f45ReportData();
    return `<section class="ho240f47ContentControl"><div class="card wide ho240f47HeroPanel"><div><span class="eyebrow">Eksik Alanlar ve Düzeltilecek Kayıtlar</span><h2>İçerik Sağlık Merkezi</h2><p class="muted">Kapak, tarih, tür ve bölüm eksikleri ayrı ayrı gösterilir. Her kayıt ayrı düzenleme penceresinde açılır; sayfadan kopmadan düzeltme yapılır.</p></div><div class="rowActions"><button class="btn primary" data-admin="Mevcut Oyunlar">Mevcut Oyunlar</button><button class="btn" data-action="refresh-games-list">Yenile</button></div></div><div class="ho240f42StatGrid fix45StatGrid ho240f47StatGrid"><span><b>${d.games.length}</b><small>Toplam oyun</small></span><span><b>${d.missingDate.length}</b><small>Tarih eksik</small></span><span><b>${d.missingCover.length}</b><small>Kapak eksik</small></span><span><b>${d.missingGenre.length}</b><small>Tür eksik</small></span><span><b>${d.zeroEpisode.length}</b><small>Bölüm eksik</small></span></div><div class="ho240f47IssueGrid">${ho240f47IssueList('Çıkış Tarihi Eksik', d.missingDate, 'date')}${ho240f47IssueList('Kapak Eksik', d.missingCover, 'cover')}${ho240f47IssueList('Tür Eksik', d.missingGenre, 'genre')}${ho240f47IssueList('Bölüm / Playlist Eksik', d.zeroEpisode, 'eps')}</div></section>`;
  };
}catch(error){ console.warn('FIX47 içerik kontrol kurulamadı:', error); }
try{
  maintenancePage = function(){
    const m = state.maintenance || {};
    const p = ho240f47MaintPercent();
    const notes = ho240f47MaintNotes();
    return `<section class="ho240f47MaintenancePublic"><div class="ho240f47MaintBg"><img src="${typeof FIX11_COVER !== 'undefined' ? FIX11_COVER : '/assets/hayatimiz-kapak.png'}" alt="Hayatımız Oyun"></div><div class="ho240f47Stars"></div><div class="ho240f47MaintCard"><div class="ho240f47MaintLogo"><img src="${typeof FIX11_LOGO !== 'undefined' ? FIX11_LOGO : '/assets/hayatimiz-logo.png'}" alt="Hayatımız Oyun"><span></span></div><span class="eyebrow">Bakım Modu • ${HO240F47_PUBLIC_VERSION}</span><h1>Hayatımız Oyun güncelleniyor</h1><p>${esc(m.message || 'Site kısa süreli profesyonel bakımda. Güncelleme tamamlanınca arşiv tekrar açılacak.')}</p><div class="ho240f47Ring" style="--p:${p}"><b>%${p}</b><small>Tamamlandı</small></div>${m.eta?`<div class="maintenanceEta ho240f47Eta"><span>Tahmini açılış</span><b>${esc(m.eta)}</b></div>`:''}<div class="ho240f47MaintNotes"><b>Güncelleme sırasında yapılanlar</b>${notes.map(n=>`<span>${esc(n)}</span>`).join('')}</div><div class="ho240f47MaintLoader"><i></i><i></i><i></i></div><div class="authButtons"><button class="btn primary" data-action="open-login">Yetkili Girişi</button>${isStaff()?'<button class="btn" data-admin="Bakım Modu">Yönetim Paneli</button>':''}</div></div></section>`;
  };
  maintenanceAdmin = function(){
    const m = state.maintenance || {};
    const p = ho240f47MaintPercent();
    const notes = ho240f47MaintNotes().join('\n');
    return `<section class="ho240f47MaintenanceAdmin"><div class="card wide ho240f47HeroPanel"><div><span class="eyebrow">Profesyonel Bakım Yönetimi</span><h2>Bakım Modu Kontrol Merkezi</h2><p class="muted">Kullanıcıların göreceği animasyonlu bakım ekranını, yüzdeyi, tahmini açılışı ve bakımda gösterilecek güncelleme notlarını buradan yönet.</p></div><div class="rowActions"><span class="pill ${m.enabled?'banned':'green'}">${m.enabled?'Bakım açık':'Bakım kapalı'}</span><button class="btn ${m.enabled?'danger':'primary'}" data-action="toggle-maintenance">${m.enabled?'Bakımı Kapat':'Bakımı Aç'}</button></div></div><div class="ho240f47MaintAdminGrid"><form class="card ho240f47MaintForm"><h3>Bakım İçeriği</h3><label class="field">Bakım mesajı<input id="maintenanceMessage" value="${esc(m.message || 'Hayatımız Oyun kısa süreli bakımda.')}" placeholder="Kullanıcıya gösterilecek mesaj"></label><label class="field">Tahmini açılış<input id="maintenanceEta" value="${esc(m.eta || '')}" placeholder="Örn: 26.05.2026 22:30"></label><label class="field">Tamamlanma yüzdesi<input id="maintenanceProgress" type="number" min="0" max="100" value="${p}"></label><label class="field">Kullanıcıya gösterilecek güncelleme notları<textarea id="maintenanceNotesText" rows="8" placeholder="Her satır bakım ekranında ayrı gösterilir">${esc(notes)}</textarea></label><div class="rowActions"><button class="btn primary" type="button" data-action="save-maintenance-settings">Kaydet</button><button class="btn" type="button" data-action="preview-maintenance-only">Önizlemeyi Yenile</button><button class="btn" type="button" data-action="ho240f47-copy-update-notes-maintenance">Son Notları İşle</button><button class="btn danger" type="button" data-action="maintenance-reset-safe">Sıfırla</button></div><p class="note">“Son Notları İşle” son güncelleme notlarını bakım ekranında gösterilecek listeye dönüştürür. Bakımı aç/kapat ayrıca Supabase’e kaydetmeyi dener.</p></form><aside class="card ho240f47MaintLive"><h3>Kullanıcı Önizlemesi</h3><div class="ho240f47SmallMaintPreview"><div class="ho240f47Ring small" style="--p:${p}"><b>%${p}</b></div><h2>Hayatımız Oyun güncelleniyor</h2><p>${esc(m.message || 'Site kısa süreli bakımda.')}</p>${m.eta?`<small>Tahmini açılış: ${esc(m.eta)}</small>`:''}<div>${ho240f47MaintNotes().slice(0,4).map(n=>`<span>${esc(n)}</span>`).join('')}</div></div></aside></div></section>`;
  };
}catch(error){ console.warn('FIX47 bakım arayüzü kurulamadı:', error); }
function ho240f47PublicUpdatesPage(){
  const notes = (Array.isArray(VERSION_NOTES_ARCHIVE)?VERSION_NOTES_ARCHIVE:[]).slice(0,16);
  return `<section class="ho240f47PublicUpdates"><div class="card wide ho240f47PublicUpdatesHero"><div><span class="eyebrow">Kullanıcı Güncelleme Merkezi</span><h1>Güncelleme Notları</h1><p class="muted">Siteye gelen yenilikler, bakım duyuruları ve arayüz değişiklikleri sade bir zaman çizelgesinde gösterilir.</p></div><span class="pill green">${HO240F47_PUBLIC_VERSION}</span></div><div class="ho240f47Timeline">${notes.map((n,i)=>`<article class="${i===0?'latest':''}"><span class="ho240f47TimelineDot"></span><div><small>${esc(n.version || HO240F47_PUBLIC_VERSION)}</small><h2>${esc(n.title || 'Güncelleme')}</h2><p>${esc(n.summary || n.written || '')}</p>${n.image?`<em>${esc(n.image)}</em>`:''}</div></article>`).join('')}</div></section>`;
}
try{
  ho240f46UpdateNotesAdmin = function(){
    const selected = state.updateFilter || 'Tümü';
    const q = normalizeSearchText(state.updateQuery || '');
    const versions = ['Tümü', ...Array.from(new Set((VERSION_NOTES_ARCHIVE||[]).map(n=>n.version)))];
    const filtered = (VERSION_NOTES_ARCHIVE||[]).filter(n => (selected === 'Tümü' || n.version === selected) && (!q || normalizeSearchText(`${n.version} ${n.title} ${n.summary} ${n.written}`).includes(q))).slice(0,40);
    const editing = state.editingUpdateNoteId ? VERSION_NOTES_ARCHIVE.find(n=>noteId(n)===state.editingUpdateNoteId) : null;
    const preview = editing || filtered[0] || { version:HO240F47_PUBLIC_VERSION, title:'Yeni güncelleme notu', summary:'Kullanıcıya gösterilecek kısa özet burada görünür.' };
    return `<section class="ho240f47UpdateAdmin"><div class="card wide ho240f47HeroPanel"><div><span class="eyebrow">Sürüm Notları • ${HO240F47_PUBLIC_VERSION}</span><h2>Güncelleme Notları Yönetimi</h2><p class="muted">Admin notu, kullanıcı özeti, bakım ekranında işlenecek not ve kullanıcı zaman çizelgesi tek yerden yönetilir.</p></div><div class="rowActions"><button class="btn" data-page="Güncellemeler">Kullanıcı Görünümü</button><button class="btn primary" data-admin="Bakım Modu">Bakım Notlarına Git</button></div></div><div class="ho240f47UpdateLayout"><form id="updateNoteForm" class="card ho240f47UpdateEditor"><input type="hidden" name="id" value="${esc(editing?noteId(editing):'')}"><h3>${editing?'Notu Düzenle':'Yeni Sürüm Notu'}</h3><label class="field">Sürüm<input name="version" value="${esc(editing?.version || HO240F47_PUBLIC_VERSION)}" placeholder="v2.4.1" required></label><label class="field">Başlık<input name="title" value="${esc(editing?.title || '')}" placeholder="Kısa başlık" required></label><label class="field">Kullanıcı Özeti<textarea name="summary" rows="4" placeholder="Kullanıcıların göreceği kısa ve net özet">${esc(editing?.summary || '')}</textarea></label><label class="field">Görsel / Önizleme URL<input name="image" value="${esc(editing?.image || '')}" placeholder="previews/...png veya https://"></label><label class="field">Detaylı Not<textarea name="written" rows="7" placeholder="Yapılan değişiklikleri madde madde yaz">${esc(editing?.written || '')}</textarea></label><div class="rowActions"><button class="btn" type="button" data-action="download-notes">Notları İndir</button>${editing?'<button class="btn" type="button" data-action="cancel-update-edit">Vazgeç</button>':''}<button class="btn primary" type="submit">${editing?'Notu Güncelle':'Notu Ekle'}</button></div></form><aside class="card ho240f47UpdatePreview"><h3>Canlı Kullanıcı Önizlemesi</h3><article><span class="pill green">${esc(preview.version || HO240F47_PUBLIC_VERSION)}</span><h2>${esc(preview.title || 'Güncelleme')}</h2><p>${esc(preview.summary || preview.written || '')}</p></article><button class="miniBtn primary" data-action="ho240f47-copy-update-notes-maintenance">Son Notları Bakım Ekranına İşle</button></aside><section class="card ho240f47UpdateArchive"><div class="sectionHead"><div><h3>Profesyonel Arşiv</h3><p class="muted">Filtrele, düzenle, sil ve kullanıcı sayfasında yayınla.</p></div><span class="pill green">${filtered.length} not</span></div><div class="updateTools"><label class="field">Sürüm<select id="updateVersionFilter">${versions.map(v=>`<option value="${esc(v)}" ${selected===v?'selected':''}>${esc(v)}</option>`).join('')}</select></label><label class="field">Ara<input id="updateSearchInput" value="${esc(state.updateQuery || '')}" placeholder="Sürüm, başlık, not ara"></label></div><div class="ho240f47UpdateCards">${filtered.map(n=>`<article><span class="pill green">${esc(n.version)}</span><h3>${esc(n.title)}</h3><p>${esc(n.summary || n.written || '')}</p><div class="rowActions"><button class="miniBtn" data-update-edit="${esc(noteId(n))}">Düzenle</button><button class="miniBtn danger" data-update-delete="${esc(noteId(n))}">Sil</button></div></article>`).join('') || '<p class="muted">Not bulunamadı.</p>'}</div></section></div></section>`;
  };
}catch(error){ console.warn('FIX47 güncelleme admin kurulamadı:', error); }
try{
  const ho240f47PrevAdminBody = typeof adminBody === 'function' ? adminBody : null;
  adminBody = function(){
    if(state.adminPage === 'İçerik Kontrol') return ho240f46ContentControlPanel();
    if(state.adminPage === 'Bakım Modu') return maintenanceAdmin();
    if(state.adminPage === 'Güncelleme Notları') return ho240f46UpdateNotesAdmin();
    if(state.adminPage === 'Mevcut Oyunlar' || state.adminPage === 'Oyunlar') return ho240f46GamesListPanel();
    if(state.adminPage === 'Oyun Ekle') return ho240f46GameAddPanel();
    return ho240f47PrevAdminBody ? ho240f47PrevAdminBody() : '';
  };
  adminPanel = function(){
    if(!isStaff()) return `<section class="card"><h2>Yetki gerekiyor</h2><p>Yönetim paneli sadece yetkili hesaplara görünür.</p></section>`;
    const valid = ho240f46AdminLinks().map(x=>x[0]);
    if(state.adminPage === 'Oyunlar') state.adminPage = 'Mevcut Oyunlar';
    if(!valid.includes(state.adminPage)){ state.adminPage='Genel Bakış'; try{ localStorage.setItem(ADMIN_TAB_KEY,state.adminPage); }catch{} }
    const open = state.ho240f45AdminMenuOpen !== false;
    const headerActions = state.adminPage === 'Mevcut Oyunlar'
      ? `<div class="rowActions"><button class="btn primary" data-admin="Oyun Ekle">Yeni Oyun Ekle</button><button class="btn" data-admin="İçerik Kontrol">Eksikleri Aç</button></div>`
      : state.adminPage === 'Oyun Ekle'
        ? `<div class="rowActions"><button class="btn" data-admin="Mevcut Oyunlar">Mevcut Oyunlar</button></div>`
        : state.adminPage === 'Bakım Modu'
          ? `<span class="pill ${state.maintenance?.enabled?'banned':'green'}">${state.maintenance?.enabled?'Bakım açık':'Bakım kapalı'}</span>`
          : `<span class="pill green">${HO240F47_PUBLIC_VERSION}</span>`;
    return `<section class="fix5AdminShell ho240AdminShell ho240f42AdminShell fix45AdminShell ho240f46AdminShell ho240f47AdminShell"><aside class="fix5AdminSidebar fix45AdminSidebar ho240f46AdminSidebar ho240f47AdminSidebar"><div class="sideLogo"><span class="logoMark">🎮</span><div><b>Hayatımız Oyun</b><small>${HO240F47_PUBLIC_VERSION} Yönetim</small></div></div><div class="sideNavLabel">SİTE</div><button class="sideNavItem" data-page="Ana Sayfa"><span>⌂</span>Ana Sayfa</button><button class="sideNavItem" data-page="Oyun Arşivi"><span>🎮</span>Oyun Arşivi</button><button class="sideNavItem" data-page="Seriler"><span>◈</span>Seriler</button><button class="sideNavItem" data-page="Takvim"><span>▣</span>Yayın Takvimi</button><button class="sideNavItem" data-page="Güncellemeler"><span>📝</span>Güncelleme Notları</button><button class="sideNavItem" data-page="Oyun İstekleri"><span>💡</span>Oyun İste</button><button class="sideNavItem" data-page="Hata Bildir"><span>🐞</span>Hata Bildir</button><div class="sideNavLabel">YÖNETİM</div><div class="adminAccordion ${open?'open':'closed'}"><button class="adminAccordionHead active" type="button" data-action="ho240f45-toggle-admin-menu"><span>👑</span><div><b>Yönetim Paneli</b><small>${open?'Menüyü kapat':'Menüyü aç'}</small></div><strong>${open?'⌄':'›'}</strong></button><div class="adminAccordionBody">${open ? ho240f46AdminLinks().map(([page,cap])=>`<button class="adminSubLink ${state.adminPage===page?'active':''}" data-admin="${esc(page)}"><span class="subDot"></span><div><b>${esc(page)}</b><small>${esc(cap)}</small></div></button>`).join('') : ''}</div></div></aside><div class="adminContent fix5AdminContent fix45AdminContent ho240f46AdminContent ho240f47AdminContent">${ho240f45AdminNoticeBar()}<div class="fix5AdminHeader fix45AdminHeader ho240f46AdminHeader ho240f47AdminHeader"><div><div class="adminBreadcrumb">Yönetim Paneli <span>›</span> ${esc(state.adminPage)}</div><h1>${esc(state.adminPage)}</h1><p>${esc(adminSubtitle(state.adminPage))}</p></div>${headerActions}</div>${adminBody()}</div>${ho240f47EditModal()}</section>`;
  };
}catch(error){ console.warn('FIX47 adminPanel kurulamadı:', error); }
try{
  const ho240f47PrevPublicPage = typeof publicPage === 'function' ? publicPage : null;
  publicPage = function(){
    if(state.maintenance?.enabled && !isStaff()) return maintenancePage();
    if(state.page === 'Güncellemeler') return withArchiveLayout(ho240f47PublicUpdatesPage());
    if(!state.session) return authLanding();
    return ho240f47PrevPublicPage ? ho240f47PrevPublicPage() : '';
  };
}catch(error){ console.warn('FIX47 publicPage kurulamadı:', error); }
try{
  const ho240f47PrevBind = typeof bind === 'function' ? bind : null;
  bind = function(){
    if(ho240f47PrevBind) ho240f47PrevBind();
    document.querySelectorAll('[data-action="ho240f47-close-edit-modal"]').forEach(el=>el.addEventListener('click', e=>{ e.preventDefault(); e.stopPropagation(); state.ho240f47EditModalId=null; state.editingGameId=null; state.rawgCandidates=[]; render(); }));
    document.querySelectorAll('.ho240f47IssueItem[data-game-edit]').forEach(el=>el.addEventListener('dblclick', onGameEdit));
  };
}catch(error){ console.warn('FIX47 bind kurulamadı:', error); }
try{
  const ho240f47PrevOnAction = typeof onAction === 'function' ? onAction : null;
  onAction = async function(e){
    const action = e.currentTarget?.dataset?.action || '';
    if(action === 'ho240f47-close-edit-modal'){
      e.preventDefault(); e.stopPropagation(); if(e.stopImmediatePropagation) e.stopImmediatePropagation();
      state.ho240f47EditModalId=null; state.editingGameId=null; state.rawgCandidates=[]; render(); return;
    }
    if(action === 'ho240f47-copy-update-notes-maintenance'){
      e.preventDefault(); e.stopPropagation(); if(e.stopImmediatePropagation) e.stopImmediatePropagation();
      const lines = ho240f47RecentNoteLines(7).join('\n');
      state.maintenance = { ...(state.maintenance||{}), updates:lines, notesText:lines, publicNotes:lines.split(/\n+/).filter(Boolean), progress:ho240f47MaintPercent(), percent:ho240f47MaintPercent() };
      try{ localStorage.setItem(MAINTENANCE_KEY, JSON.stringify(state.maintenance)); }catch{}
      render(); setToast('Son güncelleme notları bakım ekranı notlarına işlendi.'); return;
    }
    return ho240f47PrevOnAction ? await ho240f47PrevOnAction(e) : undefined;
  };
}catch(error){ console.warn('FIX47 onAction kurulamadı:', error); }
try{
  if(Array.isArray(VERSION_NOTES_ARCHIVE) && !VERSION_NOTES_ARCHIVE.some(n=>n.version===HO240F47_INTERNAL_VERSION)){
    VERSION_NOTES_ARCHIVE.unshift({
      version:HO240F47_INTERNAL_VERSION,
      title:'v2.4.1 Modal Düzenleme, Bakım ve Güncelleme Notları',
      summary:'Eksik kayıtlar ayrı düzenleme penceresinde açılır; v2.4.1 sürümü tüm arayüzde sabitlendi; bakım modu yönetimi ve kullanıcı bakım ekranı animasyonlu profesyonel arayüze taşındı; güncelleme notları admin ve kullanıcı tarafında yenilendi.',
      image:'previews/hayatimiz-oyun-v241-fix47-bakim-guncelleme.png',
      written:'FIX47 ile içerik kontrol kayıtları modal formda açılır, bakım modu canlı önizleme ve bakım notlarını işleme sistemiyle güçlendirilir, kullanıcılar için güncelleme notları daha profesyonel timeline olarak gösterilir.'
    });
  }
  document.title = `Hayatımız Oyun - ${HO240F47_PUBLIC_VERSION}`;
  try{ localStorage.setItem('hayatimiz_last_fix_version', HO240F47_INTERNAL_VERSION); }catch{}
  if(document.getElementById('root')?.dataset?.mounted === '1') render();
}catch(error){ console.warn('FIX47 final render atlandı:', error); }
