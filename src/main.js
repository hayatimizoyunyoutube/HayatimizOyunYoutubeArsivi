import './styles.css';

const VERSION = 'v2.2.0 - YouTube Senkron + Profesyonel Arşiv UI';
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

const DEFAULT_GAMES = [
  { id:'local-1', title:'Resident Evil 4 Remake', genre:'Korku / Aksiyon', status:'Devam Ediyor', eps:14, score:9.2, cover:'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=900&auto=format&fit=crop' },
  { id:'local-2', title:'Alan Wake 2', genre:'Korku / Hikaye', status:'Devam Ediyor', eps:8, score:9.1, cover:'https://images.unsplash.com/photo-1500673922987-e212871fec22?q=80&w=900&auto=format&fit=crop' },
  { id:'local-3', title:'The Last of Us', genre:'Hikaye Odaklı', status:'Tamamlandı', eps:11, score:9.4, cover:'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=900&auto=format&fit=crop' },
  { id:'local-4', title:'God of War', genre:'Aksiyon', status:'Popüler', eps:18, score:9.5, cover:'https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=900&auto=format&fit=crop' },
  { id:'local-5', title:'Silent Hill 2', genre:'Korku', status:'Yakında', eps:0, score:9.0, cover:'' }
];
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
  gameViewMode: localStorage.getItem('hayatimiz_game_view_mode_v219') || localStorage.getItem('hayatimiz_game_view_mode_v217') || 'grid',
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
    { id:'p7', group:'Adminin Önerileri', text:'Benim yazdığım özelliği anlayıp onay sorarak Siteye Uygula sistemine bağla', status:'plan' },
    { id:'p8', group:'Siteye Gelmesi Gerekenler', text:'Oyun adından tür, etiket ve açıklama otomatik çekme', status:'plan', featureKey:'game_auto_meta_fetch' },
    { id:'p9', group:'Eklenen Özellikler', text:'Akıllı özelliklerde düzenleme ve silme sistemi', status:'plan', featureKey:'feature_edit_delete' },

    { id:'p10', group:'Siteye Gelmesi Gerekenler', text:'Oyunları düzenle ve sil butonlarını aktif et', status:'plan', featureKey:'game_edit_delete_buttons' },
    { id:'p11', group:'Siteye Gelmesi Gerekenler', text:'Özellikleri Olan Özellikler bölümüne tümünü silme butonu ekle', status:'plan', featureKey:'active_features_bulk_clear' },
    { id:'p12', group:'Eklenen Özellikler', text:'Siteye Uygula + Siteyi Yenile akışını aktif et', status:'plan', featureKey:'apply_and_refresh_flow' },
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
  'Özellik uygulandıktan sonra geri al butonu ekle',
  'Özel özellik isteklerini GitHub/Vercel otomasyon sırasına al'
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
    if(Array.isArray(data.games) && data.games.length) state.games = data.games.map(mapGame);
  }catch(e){}
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
function adminNavigate(page){ state.page = 'Yönetim Paneli'; state.adminPage = page; localStorage.setItem(PAGE_KEY, 'Yönetim Paneli'); localStorage.setItem(ADMIN_TAB_KEY, page); syncRouteToAddress(); if(page === 'Kullanıcı Yetkileri') loadUsers(); if(page === 'Özellik Planı' || page === 'Uygulama Merkezi') loadPlanner(false); render(); }

function topbar(){
  const role = normalizeRole(state.session?.role);
  const unread = userNotifications().filter(n=>!state.notificationSeen[n.id] && n.id!=='empty').length;
  return html`<header class="topbar v220Topbar v220TopbarClean">
    <button class="brand cleanBtn" data-page="Ana Sayfa"><div class="mark">🎮</div><div><b>Hayatımız Oyun</b><span>${VERSION} • Profesyonel Arşiv UI</span></div></button>
    <label class="search v220Search">🔎 <input id="searchInput" value="${esc(state.query)}" placeholder="Oyun, seri veya etiket ara..." /><kbd>Ctrl K</kbd></label>
    <div class="topActions v220UserActions">
      ${state.session ? `<button class="notifyTopBtn" data-page="Bildirimler" title="Bildirimler">🔔 <b>${unread}</b></button>` : ''}
      ${state.session ? `<button class="avatarChip" data-page="Profilim"><span>${esc((state.session.full_name || state.session.email || 'H')[0]).toUpperCase()}</span><b>${esc(state.session.full_name || 'Profil')}</b><small>${esc(displayRole(role))}</small></button>` : `<button class="btn" data-action="open-login">Giriş</button><button class="btn primary" data-action="open-register">Kayıt</button>`}
      ${isStaff() ? '<button class="btn primary adminQuick" data-admin="Genel Bakış">Yönetim</button>' : ''}
    </div>
  </header>`;
}
function navIcon(n){ return ({'Ana Sayfa':'⌂','Oyunlar':'🎮','Seriler':'◈','Yayın Takvimi':'▣','Bildirimler':'🔔','Topluluk':'☄'}[n] || '•'); }
function categoryRail(){ return ''; }
function archiveSideNav(){
  return `<aside class="v220SideNav fixedArchiveMenu"><div class="sideLogo">🎮 <b>Arşiv Menüsü</b></div>${sideNavItems().map(item=>`<button class="sideNavItem ${state.page===item.page?'active':''}" data-page="${esc(item.page)}"><span>${item.icon}</span>${esc(item.label)}</button>`).join('')}<div class="supportBox">💜 <b>Destekle</b><small>Arşivi büyütmek için seri ve bölüm takibini güncel tut.</small></div></aside>`;
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
  const cardClass = adminActions ? 'game v214GameCard adminGameCard' : `game v214GameCard ${state.gameViewMode==='compact'?'compactGameCard':''}`;
  return `<article class="${cardClass}"><div class="coverWrap"><img src="${esc(coverFor(g))}" alt="${esc(g.title)}">${featureEnabled('missing_cover_warning') && !g.cover ? '<span class="coverWarn">Kapak eksik</span>' : ''}<div class="progressBadge"><b>%${progress}</b><span>ilerleme</span></div></div><div class="gameBody"><div class="cardTopline"><span class="pill">${esc(g.status)}</span>${g.releaseDate ? `<span class="pill softPill">${esc(g.releaseDate)}</span>` : ''}${isFavorite(g.id)?'<span class="pill green">Favori</span>':''}</div><h3>${esc(g.title)}</h3><p>${esc(g.genre)} • ${Number(g.watchedEps || 0)}/${Number(g.eps || 0)} bölüm${g.seriesName ? ` • Seri: ${esc(g.seriesName)}` : ''}</p>${tagChipsHtml(g.tags)}<div class="progressLine"><span style="width:${progress}%"></span></div><div class="gameMetaLine"><b>⭐ ${esc(g.score)}</b><small>${g.seriesName ? 'Seri sırası: '+esc(g.seriesOrder || '-') : 'Tek oyun'}</small></div>${adminActions ? `<div class="gameAdminActions"><button class="miniBtn" data-game-edit="${esc(g.id)}">Formda Düzenle</button><button class="miniBtn danger" data-game-delete="${esc(g.id)}">Sil</button></div>` : `<div class="gameAdminActions">${watchButtonHtml(g)}<button class="miniBtn" data-favorite-game="${esc(g.id)}">${isFavorite(g.id)?'Favoriden Çıkar':'Favoriye Ekle'}</button></div>`}</div></article>`;
}


function gameGrid(){
  const games = sortedVisibleGames();
  const adminActions = isStaff() && state.page === 'Yönetim Paneli' && state.adminPage === 'Oyunlar';
  if(!games.length) return '<section class="games"><div class="card wide">Oyun bulunamadı.</div></section>';
  const groups = new Map();
  games.forEach(g=>{
    const key = gameInitial(g);
    if(!groups.has(key)) groups.set(key, []);
    groups.get(key).push(g);
  });
  const sections = Array.from(groups.entries()).map(([letter,items])=>`<section class="letterSection" id="harf-${esc(routeSlug(letter))}"><div class="letterHead"><div class="letterBadge">${esc(letter)}</div><div><h2>${esc(letter)} Harfinde Başlayan Seriler</h2><span>${items.length} oyun</span></div></div><div class="games">${items.map(g=>gameCard(g, adminActions)).join('')}</div></section>`).join('');
  return `${adminActions ? seriesGroupPanel(games) : ''}${alphabetNav(games)}<div class="gameDirectory">${sections}</div>`;
}

function seriesGroupPanel(games){
  if(!state.showSeriesSortPanel) return '<section class="card wide seriesManager compactSeriesSort"><div class="sectionHead"><div><h3>Seri Sıralama</h3><p class="muted">Oyun sıralaması artık ayrı butonla açılır; yönetim panelindeki üst kategori çubukları aşağı kaydırınca ekrana yapışmaz.</p></div><button class="miniBtn primary" data-action="open-series-sort-panel">Seri Sıralamayı Aç</button></div></section>';
  const groups = sortedSeriesGroups(games);
  const blocks = groups.map(({name,items})=>`<details class="seriesGroup" open><summary><b>${esc(name)}</b><span>${items.length} kayıt</span></summary><div class="seriesOrderList">${items.map(g=>`<div><span>${esc(g.title)}</span><label>Sıra <input data-series-order-game="${esc(g.id)}" type="number" value="${esc(String(g.seriesOrder||0))}"></label></div>`).join('')}</div></details>`).join('');
  return `<section class="card wide seriesManager"><div class="sectionHead"><div><h3>Seri Gruplama ve Toplu Sıra</h3><p class="muted">Her seri kendi altında; kayıtlar verdiğin sıra numarasına göre dizilir.</p></div><div class="rowActions"><span class="pill green">v2.1.8</span><button class="miniBtn" data-action="open-series-sort-panel">Kapat</button><button class="miniBtn primary" data-action="save-series-orders">Seri Sırasını Kalıcı Kaydet</button></div></div>${blocks}</section>`;
}

function calendarPage(){ return `<section class="card wide"><h2>Yayın Takvimi</h2><p class="muted">Bu alan kullanıcı tarafında kalır. Teknik plan ve admin notları gösterilmez.</p><div class="timeline"><p><b>Bugün:</b> Alan Wake 2 bölüm kontrolü</p><p><b>Yarın:</b> Resident Evil 4 yeni bölüm</p><p><b>Hafta sonu:</b> Koleksiyon düzenleme</p></div></section>`; }
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
  if(state.page === 'Ana Sayfa') return gameArchiveDashboard();
  let content = '';
  if(state.page === 'Takvim') content = calendarPage();
  else if(state.page === 'Bildirimler') content = notificationsPage();
  else if(state.page === 'Seriler') content = publicStats() + seriesDirectoryPage();
  else if(state.page === 'Topluluk') content = communityPage();
  else if(state.page === 'Profilim') content = profilePage();
  else content = publicStats() + advancedSearchPanel() + gameGrid();
  return withArchiveLayout(content);
}

function gameArchiveDashboard(){
  const games = Array.isArray(state.games) ? state.games : [];
  const featured = games.slice().sort((a,b)=>Number(b.score||0)-Number(a.score||0)).slice(0,5);
  const continued = games.filter(g=>Number(g.eps||0)>0 || String(g.seriesName||'').trim()).slice(0,5);
  const releases = userNotifications().filter(n=>n.gameId).slice(0,4);
  const totalEpisodes = games.reduce((sum,g)=>sum + Number(g.eps || seriesEpisodes(g).length || 0),0);
  const watchedEpisodes = games.reduce((sum,g)=>sum + Number(g.watchedEps || 0),0);
  const completed = games.filter(g=>g.status==='Tamamlandı').length;
  return `<section class="v220Shell">
    ${archiveSideNav()}
    <main class="v220HomeMain">
      <section class="v220Hero"><div><span class="eyebrow">Öne Çıkan</span><h1>Oyun Arşivi, seriler ve daha fazlası.</h1><p>Oyunları keşfet, serileri takip et, bölümleri site içinden izle ve yayın takvimini kaçırma.</p><div class="heroActions"><button class="btn primary" data-page="Popüler">Arşivi Keşfet</button><button class="btn" data-page="Seriler">Popüler Seriler</button></div></div><div class="heroDots"><span></span><span></span><span></span><span></span></div></section>
      <section class="v220Shelf"><div class="sectionHead"><div><h2>Öne Çıkan Oyunlar</h2><p class="muted">Skora ve arşiv verisine göre sıralanır.</p></div><button class="miniBtn" data-page="Popüler">Tümünü Gör</button></div><div class="v220FeaturedRow">${featured.map(g=>miniGameTile(g)).join('') || '<div class="card">Henüz oyun yok.</div>'}</div></section>
      <section class="v220Shelf"><div class="sectionHead"><div><h2>Devam Eden Serilerim</h2><p class="muted">İlerleme yüzdesi ve bölüm sayısı ile.</p></div><button class="miniBtn" data-page="Seriler">Tümünü Gör</button></div><div class="v220SeriesRow">${continued.map(g=>seriesProgressTile(g)).join('') || '<div class="card">Henüz seri yok.</div>'}</div></section>
      <section class="v220Shelf"><div class="sectionHead"><div><h2>Alfabetik Oyun Arşivi</h2><p class="muted">A-Z şeritlerle hızlı erişim.</p></div><button class="miniBtn" data-page="Popüler">Arşive Git</button></div>${alphabetNav(games)}</section>
    </main>
    <aside class="v220RightRail"><div class="profilePanel"><div class="avatar glowAvatar">${esc((state.session?.full_name || state.session?.email || 'H')[0]).toUpperCase()}</div><h3>${esc(state.session?.full_name || 'HayatımızOyun')}</h3><span class="pill green">Seviye 24</span><div class="xpLine"><span style="width:64%"></span></div><div class="rightStats"><div><b>${games.length}</b><span>Oyun</span></div><div><b>${sortedSeriesGroups(games).length}</b><span>Seri</span></div><div><b>${completed}</b><span>Tamamlanan</span></div><div><b>${watchedEpisodes}/${totalEpisodes}</b><span>Bölüm</span></div></div><button class="miniBtn" data-page="Profilim">Profilime Git</button></div><div class="releasePanel"><div class="sectionHead"><h3>Yaklaşan Yayınlar</h3><button class="miniBtn" data-page="Takvim">Tümü</button></div>${releases.map(n=>`<button class="releaseItem" data-notification-watch="${esc(n.gameId)}" data-episode="${Number(n.episodeIndex||0)}"><b>${esc(n.title)}</b><small>${esc(n.text)}</small></button>`).join('') || '<p class="muted">Yaklaşan yayın bulunmadı.</p>'}</div><div class="releasePanel"><h3>Son Etkinlikler</h3>${state.watchHistory.slice(0,3).map(h=>`<p class="activityItem">▶ ${esc(h.title)} • ${h.episode}. bölüm</p>`).join('') || '<p class="muted">Henüz etkinlik yok.</p>'}</div></aside>
  </section>`;
}
function sideNavItems(){ return [
  {label:'Ana Sayfa', page:'Ana Sayfa', icon:'⌂'}, {label:'Oyun Arşivi', page:'Popüler', icon:'🎮'}, {label:'Seriler', page:'Seriler', icon:'◈'}, {label:'Yayın Takvimi', page:'Takvim', icon:'▣'}, {label:'İstek Listem', page:'Yakında', icon:'♡'}, {label:'Favoriler', page:'Popüler', icon:'☆'}, {label:'Son Eklenenler', page:'Devam Eden', icon:'⊕'}, {label:'Popüler Oyunlar', page:'Popüler', icon:'★'}, {label:'Bildirimler', page:'Bildirimler', icon:'🔔'} ]; }
function miniGameTile(g){ return `<article class="v220GameTile"><img src="${esc(coverFor(g))}" alt="${esc(g.title)}"><span class="scoreBadge">${Math.round(Number(g.score||0)*10)}</span><h3>${esc(g.title)}</h3><p>${esc(g.genre || 'Genel')}</p><div class="tileActions">${watchButtonHtml(g)}<button class="miniBtn" data-favorite-game="${esc(g.id)}">♡</button></div></article>`; }
function seriesProgressTile(g){ const eps=Number(g.eps||seriesEpisodes(g).length||0); const watched=Number(g.watchedEps||0); return `<article class="v220SeriesTile"><img src="${esc(coverFor(g))}" alt="${esc(g.title)}"><div><b>${esc(g.seriesName || g.title)}</b><small>${watched}/${eps}</small></div><div class="progressLine"><span style="width:${progressPercent(g)}%"></span></div><button class="miniBtn primary" data-watch-series="${esc(g.id)}">Sırayla İzle</button></article>`; }
function communityPage(){ return `<section class="card wide"><h2>Topluluk</h2><p class="muted">Topluluk alanı v2.2.0 arayüzüne hazırlandı. İleride yorumlar, öneriler ve seri takip bildirimleri burada genişletilecek.</p></section>`; }
function adminPanel(){
  if(!isStaff()) return `<section class="card"><h2>Yetki gerekiyor</h2><p>Yönetim paneli sadece kurucu, yönetici, moderatör ve editör hesaplarına görünür.</p></section>`;
  const pages = ['Genel Bakış','Oyunlar','Seri İzleme','Profil','Kullanıcı Yetkileri','Güncelleme Notları','Bakım Modu','API/ENV Durumu','Ayarlar'];
  if(!pages.includes(state.adminPage)){
    state.adminPage = 'Genel Bakış';
    try{ localStorage.setItem(ADMIN_TAB_KEY, state.adminPage); }catch{}
  }
  return `<section class="adminLayout"><aside class="sidebar"><h3>Yönetim Paneli</h3><span>${VERSION}</span>${pages.map(p=>`<button class="sideBtn ${state.adminPage===p?'active':''}" data-admin="${esc(p)}">${icon(p)} ${esc(p)}</button>`).join('')}</aside><div class="adminContent"><div class="adminTop"><div><h1>${esc(state.adminPage)}</h1><p>${adminSubtitle(state.adminPage)}</p></div><span class="pill ${state.maintenance?.enabled?'banned':'green'}">${state.maintenance?.enabled?'Bakım açık':'Bakım kapalı'}</span></div>${adminBody()}</div></section>`;
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
  if(state.adminPage === 'Seri İzleme') return adminSeriesWatchPanel();
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
  const buttons = `<button class="btn primary" data-action="toggle-game-form">+ Oyun Ekle</button><button class="btn" data-action="auto-cover-fetch">Kapaksızlara Kapak Öner</button><button class="btn" data-action="bulk-sync-playlists">Toplu Playlist Senkronize</button><button class="btn" data-action="open-series-sort-panel">Seri Sıralama</button><span class="pill green">v2.2.0 UI aktif</span>`;
  return `<section class="card wide"><div class="sectionHead"><div><h2>Oyun Yönetimi</h2><p class="muted">v2.1.4: oyun ekleme, formda düzenleme, RAWG çoklu kapak seçimi, seri ve playlist alanları burada.</p></div><div class="heroActions">${buttons}</div></div><div class="note greenNote">Otomatik çekme sadece formu doldurur; oyun eklemez, silmez. Supabase kaydı sadece Kaydet butonuyla yapılır.</div>${youtubeHealthPanel()}${missingCoverPanel()}${state.showGameForm ? gameAddForm() : ''}${state.editingGameId ? gameEditForm() : ''}${rawgCandidatePanel()}${coverSuggestionPanel()}${advancedSearchPanel()}${gameGrid()}</section>`;
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
  if(state.page === 'Popüler') games = games.filter(g=>g.status==='Popüler' || g.score >= 9.2);
  if(state.page === 'Tamamlanan') games = games.filter(g=>g.status==='Tamamlandı');
  if(state.page === 'Devam Eden') games = games.filter(g=>g.status==='Devam Ediyor');
  if(state.page === 'Yakında') games = games.filter(g=>g.status==='Yakında');
  if(state.page === 'Seriler') games = games.filter(g=>String(g.seriesName || '').trim() || Number(g.eps || 0) > 0);
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

function gameFormFields(d, mode='add'){
  const opts = ['Devam Ediyor','Tamamlandı','Popüler','Yakında'].map(st=>`<option ${d.status===st?'selected':''}>${st}</option>`).join('');
  return `<div class="formGrid cleanGameFormGrid"><label class="field">Oyun adı<input name="title" required placeholder="Örn: Assassin's Creed Origins" value="${esc(d.title)}" /></label><label class="field">Kategori / Tür<input name="genre" required placeholder="Aksiyon, Macera, RPG" value="${esc(d.genre)}" /></label><label class="field">Çıkış tarihi <small>gün.ay.yıl</small><input name="releaseDate" placeholder="27.10.2017" value="${esc(d.releaseDate || '')}" /></label><label class="field">Durum<select name="status">${opts}</select></label><label class="field">Toplam Bölüm<input name="eps" type="number" min="0" value="${esc(String(d.eps ?? 0))}" /></label><label class="field">İzlenen Bölüm<input name="watchedEps" type="number" min="0" value="${esc(String(d.watchedEps ?? 0))}" /></label><label class="field">Puan<input name="score" type="number" min="0" max="10" step="0.1" value="${esc(String(d.score ?? 8.5))}" /></label><label class="field">Seri adı<input name="seriesName" placeholder="Örn: Assassin's Creed" value="${esc(d.seriesName || '')}" /></label><label class="field">Seri sıra no<input name="seriesOrder" type="number" min="0" value="${esc(String(d.seriesOrder ?? 0))}" /></label><label class="field wideField">YouTube oynatma listesi<input name="playlistUrl" placeholder="https://youtube.com/playlist?list=..." value="${esc(d.playlistUrl || '')}" /></label><label class="field wideField">Tek video URL<input name="videoUrl" placeholder="https://youtube.com/watch?v=..." value="${esc(d.videoUrl || '')}" /></label><label class="field wideField">Kapak URL<input name="cover" placeholder="https://..." value="${esc(d.cover)}" /></label><label class="field wideField">Manuel kapak yükle <small>Supabase Storage bağlantısı varsa URL’ye dönüştürülür; yoksa önizleme için local data kullanılır.</small><input id="coverUpload" type="file" accept="image/*"></label><label class="field wideField storyField">Oyunun Hikayesi<textarea name="description" rows="5" placeholder="Hikaye Çek: RAWG notu eklemeden, oyun adına göre Türkçe hikaye özeti oluşturur.">${esc(d.description || '')}</textarea></label><label class="field wideField episodeImportField">Bölüm Listesi <small>Format: no|başlık|video linki|küçük kapak|yayın tarihi|not. Playlistten gelen videolar profesyonel listeye dönüşür.</small>${episodeImportPreview(d.episodesText, d.episodes)}<textarea name="episodesText" rows="7" class="technicalEpisodes" placeholder="Teknik bölüm verisi otomatik oluşur">${esc(d.episodesText || episodesToText(d.episodes || []))}</textarea><button class="miniBtn" type="button" data-action="toggle-technical-episodes">Teknik veriyi göster/gizle</button></label><div class="field wideField"><span>Etiketler</span><small class="muted">Butonlardan seç: Türkçe Altyazılı, Türkçe Dublajlı, DLC, Coop, %100...</small>${tagButtonsHtml(d.tags)}</div></div><div class="coverPreview ${d.cover?'':'isEmpty'}">${d.cover?`<img src="${esc(d.cover)}" alt="Kapak önizleme">`:'Kapak çekilince burada önizleme görünür.'}</div>`;
}

function gameAddForm(){
  const d = { ...DEFAULT_GAME_DRAFT, ...state.gameDraft };
  return `<form class="card soft gameForm" id="gameAddForm" autocomplete="off"><h3>Yeni Oyun Ekle</h3><p class="muted">Oyun adını yaz, RAWG sonuçlarını getir, doğru kapağı seç; kaydetmeden oyun eklenmez.</p>${gameFormFields(d,'add')}<div class="note greenNote">Otomatik çekme oyun eklemez, oyun silmez, sadece form alanlarını doldurur.</div><div class="formActionBar"><button class="btn" type="button" data-action="auto-game-meta">Meta / Kapak Çek</button><button class="btn storyBtn" type="button" data-action="fetch-game-story">Hikaye Çek</button><button class="btn" type="button" data-action="estimate-playlist-episodes">Playlist Videolarını Çek</button><button class="btn primary" type="submit">Oyunu Kaydet</button><button class="btn" type="button" data-action="toggle-game-form">Kapat</button></div></form>`;
}
function gameEditForm(){
  const current = state.games.find(g=>String(g.id)===String(state.editingGameId));
  if(!current) return '';
  return `<form class="card soft gameForm editGameForm" id="gameEditForm" autocomplete="off"><h3>Oyunu Formda Düzenle</h3><p class="muted">Düzenleme artık prompt değil; kapak, bölüm hedefi, izlenen bölüm, seri sıra no, video ve playlist alanları formdan güncellenir.</p>${gameFormFields(current,'edit')}<div class="formActionBar"><button class="btn" type="button" data-action="auto-game-meta-edit">Meta / Kapak Yenile</button><button class="btn storyBtn" type="button" data-action="fetch-game-story-edit">Hikaye Çek</button><button class="btn" type="button" data-action="estimate-playlist-episodes-edit">Playlist Videolarını Çek</button><button class="btn primary" type="submit">Oyunu Güncelle</button><button class="btn" type="button" data-action="close-game-edit">Kapat</button></div></form>`;
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
  const safeIndex = Math.max(0, Math.min(episodes.length - 1, Number(state.selectedEpisodeIndex || 0)));
  const active = episodes[safeIndex] || episodes[0] || null;
  const rawUrl = watchTargetUrl(g);
  const embed = active ? episodeEmbedUrl(active, rawUrl) : youtubeEmbedUrl(rawUrl);
  const player = embed ? `<iframe src="${esc(embed)}" title="${esc(g.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>` : `<div class="playerPlaceholder">Video linki eklenmemiş.</div>`;
  const noteKey = episodeNoteKey(g.id, safeIndex);
  const userNote = state.episodeNotes[noteKey] || active?.note || '';
  const nextGame = nextSeriesGame(g);
  const rows = episodes.length ? episodes.map((ep,idx)=>`<button class="episodeRow ${idx===safeIndex?'active':''} ${ep.watched||Number(ep.number)<=watched?'done':''}" data-watch-episode-index="${idx}"><img src="${esc(ep.thumbnail || g.cover || coverFor(g))}" onerror="this.style.display='none'"><span><b>${esc(ep.number)}. ${esc(cleanEpisodeTitle(ep.title, ep.number))}</b><small>${ep.publishAt?`Yayın: ${esc(ep.publishAt)} • `:''}${ep.videoUrl?'Sitede oynatmaya hazır':'Video linki eksik'}</small></span></button>`).join('') : '<div class="episodeEmpty">Bölüm hedefi eklenmemiş. Admin panelinden playlist videolarını çek.</div>';
  return `<div class="modalOverlay watchPageOverlay ${state.cinemaFullscreen?'cinemaFull':''}"><div class="modal seriesModalV216 professionalWatch v218Watch v220Watch"><button class="close" type="button" data-action="close-series-watch">×</button><div class="watchHeader"><div><span class="eyebrow">Profesyonel Sitede İzle</span><h2>${esc(g.title)}</h2><p class="muted">${esc(g.seriesName || 'Tek seri')} • ${watched}/${Number(g.eps||episodes.length||0)} bölüm • ${progressPercent(g)}%</p></div><div class="rowActions"><button class="miniBtn ${state.cinemaFullscreen?'primary':''}" data-action="toggle-cinema-fullscreen">Sinema: ${state.cinemaFullscreen?'Tam':'Normal'}</button><button class="miniBtn ${state.autoNextEpisode?'primary':''}" data-action="toggle-auto-next">Oto Sonraki: ${state.autoNextEpisode?'Açık':'Kapalı'}</button><button class="miniBtn" data-action="resume-episode">Burada Kaldım</button><button class="miniBtn" data-action="watch-all-series">Seriyi Tümünü İzle</button><button class="miniBtn primary" data-toggle-active-watched-index="${safeIndex}">${active?.watched?'İzlendi Geri Al':'Bu Bölümü İzledim'}</button></div></div><div class="watchLayout"><main class="watchCinemaStage">${player}<div class="activeEpisodeInfo"><span class="pill green">${active?`${active.number}. Bölüm`:'Bölüm yok'}</span><h3>${esc(active ? cleanEpisodeTitle(active.title, active.number) : g.title)}</h3><p class="muted">${esc(active?.description || g.description || 'Bölümü doğrudan site içinden izliyorsun.')}</p>${nextGame?`<button class="miniBtn" data-next-series-game="${esc(nextGame.id)}">Seride Sıradaki Oyun: ${esc(nextGame.title)}</button>`:''}</div><label class="field episodeNoteBox">Bölüm Yorumum / Kişisel Notum<textarea data-episode-note="${esc(noteKey)}" rows="3" placeholder="Bu bölüm için yorum veya not yaz...">${esc(userNote)}</textarea></label><div class="watchHistoryBox"><h4>İzleme Geçmişi</h4>${state.watchHistory.slice(0,5).map(h=>`<p><b>${esc(h.title)}</b> ${h.episode}. bölüm • ${new Date(h.at).toLocaleString('tr-TR')}</p>`).join('') || '<p class="muted">Henüz izleme geçmişi yok.</p>'}</div><div class="progressLine large"><span style="width:${progressPercent(g)}%"></span></div><div class="watchShortcuts">Kısayollar: ←/→ bölüm değiştir • Space izle/geri al • F sinema modu</div></main><aside class="v220EpisodePanel"><div class="sectionHead"><h3>Bölümler</h3><span class="pill">${episodes.length} bölüm</span></div><div class="episodeSidebar">${rows}</div></aside></div></div></div>`;
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
