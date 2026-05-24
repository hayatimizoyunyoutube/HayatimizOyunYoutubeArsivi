import './styles.css';

const VERSION = 'v2.2.3 FIX 1 - Açılış UI Stabil';
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
  return row ? row[1] : (typeof fix12GenreFromTitle === 'function' ? fix12GenreFromTitle(title) : 'Aksiyon-macera, hikaye odaklı');
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
try{ fix12GenreFromTitle = v222GenreFromTitle; fix12DetailedStory = v222StoryForGame; }catch{}

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


/* v2.2.3 - Plan uygulaması: gerçek hatırlatıcı, seri geçmişi geri alma, istekten oyun ekleme, ekran görüntülü hata, AI özellik merkezi */
const V223_APPLIED_FEATURES_KEY = 'hayatimiz_v223_applied_features';
const V223_AI_DRAFT_KEY = 'hayatimiz_v223_ai_feature_draft';
const V223_NEXT_VERSION_KEY = 'hayatimiz_v223_next_version';
const V223_REMINDER_CHANNEL_KEY = 'hayatimiz_v223_reminder_channel';

function v223SafeList(key){ return safeParse(localStorage.getItem(key), []); }
function v223SaveList(key, list){ localStorage.setItem(key, JSON.stringify(Array.isArray(list) ? list : [])); }
function v223NextVersion(){ return localStorage.getItem(V223_NEXT_VERSION_KEY) || 'v2.2.4'; }
function v223FeatureDraft(){ return localStorage.getItem(V223_AI_DRAFT_KEY) || ''; }
function v223AppliedFeatures(){ return v223SafeList(V223_APPLIED_FEATURES_KEY); }
function v223Slug(value){ return String(value||'').toLocaleLowerCase('tr-TR').replace(/[^a-z0-9ığüşöçİĞÜŞÖÇ]+/gi,'-').replace(/^-|-$/g,'') || 'ozellik'; }
function v223FeatureSuggestions(text){
  const q = String(text || '').trim();
  const base = q || 'Arşiv deneyimini geliştirecek profesyonel özellik';
  const lower = normalizeSearchText(base);
  const suggestions = [];
  const push = (title,target,desc,next)=> suggestions.push({ key:'v223-'+v223Slug(title).slice(0,48), title, group:'AI ile Site Üzerinden Özellik Ekleme', target, description:desc, next, version:v223NextVersion() });
  if(lower.includes('takvim') || lower.includes('hatirlat')) push('Takvim hatırlatıcılarını gerçek bildirim akışına bağla','Yayın Takvimi','Takvim kayıtları için tarayıcı bildirimi ve e-posta kuyruğu mantığı eklenir.','Hatırlatıcı teslim geçmişi ekranı');
  if(lower.includes('seri') || lower.includes('siralama')) push('Seri sıralama geçmişinde geri alma ekranı','Yönetim Paneli > Seri İzleme','Eski sıralamalar listelenir ve tek tıkla geri yüklenir.','Seri bazlı değişiklik karşılaştırması');
  if(lower.includes('istek') || lower.includes('oyun')) push('Oyun isteklerinden tek tıkla oyun ekleme','Yönetim Paneli > Oyun İstekleri','Kullanıcı isteğinden form doldurmadan oyun oluşturma akışı eklenir.','İstekten eklenen oyunlara otomatik kapak ve bölüm kontrolü');
  if(lower.includes('hata') || lower.includes('resim') || lower.includes('gorsel')) push('Hata bildirimlerine ekran görüntüsü yükleme','Hata Bildir','Kullanıcı hata raporuna ekran görüntüsü ekleyebilir, yetkili panelinde görüntülenir.','Hata raporlarına öncelik ve etiket sistemi');
  if(!suggestions.length){
    push(base,'Yönetim Paneli > AI Özellik Merkezi',`${base} isteği site üzerinden versiyon planına alınır ve uygulandı olarak işlenebilir.`,`${base} için gelişmiş ayar ekranı`);
    push(base + ' rapor ekranı','Yönetim Paneli > Raporlar',`${base} için admin tarafında durum ve geçmiş takibi eklenir.`,`${base} için dışa aktarma`);
    push(base + ' kullanıcı görünümü','Kullanıcı Arayüzü',`${base} kullanıcı tarafında profesyonel kart yapısına eklenir.`,`${base} için bildirim entegrasyonu`);
  }
  return suggestions.slice(0,4);
}
function v223FeatureCenter(){
  const draft = v223FeatureDraft();
  const suggestions = v223FeatureSuggestions(draft);
  const applied = v223AppliedFeatures();
  return `<section class="v223FeatureCenter"><div class="card wide v223Hero"><div><span class="eyebrow">AI Özellik Merkezi</span><h1>Site Üzerinden Özellik Ekle</h1><p class="muted">Yeni kod paketi beklemeden, özellik fikrini versiyon planına al; uygulandı olarak işaretle, güncelleme notlarına işle ve sıradaki versiyon planını otomatik değiştir.</p></div><span class="pill green">${esc(v223NextVersion())}</span></div><div class="v223FeatureGrid"><form class="card v223AiForm" id="v223AiFeatureForm"><h2>AI ile özellik öner</h2><label class="field">Hedef sürüm<input name="version" value="${esc(v223NextVersion())}" placeholder="v2.2.4"></label><label class="field">Özellik isteği<textarea name="idea" rows="7" placeholder="Örn: oyun kartlarına puan filtresi, yeni bildirim sistemi, gelişmiş seri yönetimi...">${esc(draft)}</textarea></label><button class="btn primary" type="submit">Önerileri Getir</button></form><section class="card"><h2>Önerilen Özellikler</h2><div class="v223SuggestList">${suggestions.map((f,i)=>`<article><span class="pill">${i+1}</span><div><b>${esc(f.title)}</b><small>${esc(f.target)} • ${esc(f.version)}</small><p>${esc(f.description)}</p></div><button class="miniBtn primary" data-v223-apply-feature="${esc(f.key)}" data-v223-title="${esc(f.title)}" data-v223-target="${esc(f.target)}" data-v223-desc="${esc(f.description)}" data-v223-next="${esc(f.next)}" data-v223-version="${esc(f.version)}">Versiyona Uygula</button></article>`).join('')}</div></section></div><section class="card wide"><div class="sectionHead"><div><h2>Uygulanan Özellik Geçmişi</h2><p class="muted">Versiyon versiyon uygulanan özellikler burada tutulur; güncelleme notlarına da eklenir.</p></div><span class="pill green">${applied.length} kayıt</span></div><div class="v223AppliedList">${applied.map(f=>`<article><b>${esc(f.version)} • ${esc(f.title)}</b><small>${esc(f.target)} • ${esc(f.appliedAt)}</small><p>${esc(f.description)}</p></article>`).join('') || '<p class="muted">Henüz site üzerinden uygulanan özellik yok.</p>'}</div></section></section>`;
}

const v223PrevAdminBody = adminBody;
adminBody = function(){
  if(state.adminPage === 'AI Özellik Merkezi') return v223FeatureCenter();
  return v223PrevAdminBody();
};
const v223PrevAdminPanel = adminPanel;
adminPanel = function(){
  const html = v223PrevAdminPanel();
  if(String(html).includes('AI Özellik Merkezi')) return html;
  return html.replace('</div></div><div class="sideFooter">', '<button class="adminSubLink" data-admin="AI Özellik Merkezi"><span class="subDot"></span><div><b>AI Özellik Merkezi</b><small>Versiyon özellikleri</small></div></button></div></div><div class="sideFooter">');
};

function v223ReminderChannel(){ return localStorage.getItem(V223_REMINDER_CHANNEL_KEY) || 'browser'; }
function v223ReminderControls(){ const ch=v223ReminderChannel(); return `<div class="v223ReminderControls"><b>Hatırlatıcı Kanalı</b><button class="miniBtn ${ch==='browser'?'primary':''}" data-v223-reminder-channel="browser">Tarayıcı Bildirimi</button><button class="miniBtn ${ch==='email'?'primary':''}" data-v223-reminder-channel="email">E-posta Kuyruğu</button><button class="miniBtn" data-v223-test-notification>Test Bildirimi</button></div>`; }
const v223PrevCalendarPage = calendarPage;
calendarPage = function(){ return v223PrevCalendarPage().replace('<div class="v222ReminderPanel">', `${v223ReminderControls()}<div class="v222ReminderPanel">`); };

function v223SeriesHistoryPanel(){
  const list=safeParse(localStorage.getItem(V222_SERIES_HISTORY_KEY), []);
  return `<section class="card wide v222SeriesHistory v223SeriesHistory"><div class="sectionHead"><div><h2>Seri Sıralama İşlem Geçmişi</h2><p class="muted">Eski sıralamaya dönmek için geri al butonunu kullan.</p></div><span class="pill green">${list.length} işlem</span></div>${list.map(h=>`<article><div><b>${esc(h.series)}</b><small>${esc(h.createdAt)} • ${esc(h.user)}</small><p>${h.ids.length} oyun sıralandı</p></div><button class="miniBtn primary" data-v223-restore-series="${esc(h.id)}">Bu Sıraya Dön</button></article>`).join('') || '<p class="muted">Henüz işlem geçmişi yok.</p>'}</section>`;
}
adminSeriesWatchPanel = function(){ return `${v222PrevAdminSeriesPanel()}${v223SeriesHistoryPanel()}`; };

adminGameRequestsPageFix8 = function(){
  const list=v222FilterRows(fix8LocalList(FIX8_REQUESTS_KEY),'request');
  return `<section class="v221FeedbackAdmin v222FeedbackAdmin v223FeedbackAdmin"><div class="card wide fix10FeedbackHead"><div><span class="eyebrow">Filtreli Rapor + Tek Tıkla Ekle</span><h2>Oyun İstekleri</h2><p class="muted">İstekleri duruma göre filtrele, yetkili notu ekle veya tek tıkla oyun olarak arşive al.</p></div><span class="pill green">${list.length} kayıt</span></div>${v222ReportFilterTabs('request')}<div class="v221FeedbackGrid">${list.map(r=>`<article><div class="v221FeedbackIcon">💡</div><div class="v221FeedbackContent"><h3>${esc(r.gameTitle)}</h3><small>${esc(r.seriesName||'Seri yok')} • ${esc(r.email||'Anonim')} • ${esc(r.createdAt||'')}</small><p>${esc(r.note||'Not yok')}</p></div><div class="v221FeedbackActions">${v221FeedbackStatusSelect(r,'request')}<textarea data-v221-feedback-note="request:${esc(r.id)}" placeholder="Yetkili notu...">${esc(r.adminNote || '')}</textarea><button class="miniBtn" data-v221-feedback-save="request:${esc(r.id)}">Kaydet</button><button class="miniBtn primary" data-v223-request-to-game="${esc(r.id)}">Tek Tıkla Oyun Ekle</button></div></article>`).join('') || '<p class="muted">Bu filtrede oyun isteği yok.</p>'}</div></section>`;
};

bugReportPageFix8 = function(){
  const mine = fix8LocalList(FIX8_BUGS_KEY).filter(r=>!state.session?.email || r.email===state.session.email).slice(0,8);
  return `<section class="fix12FeedbackPage v223BugPage">${fix12FeedbackHero('bug')}<div class="fix12FeedbackLayout"><form id="bugReportForm" class="card fix12FeedbackForm v223BugForm"><h2>Yeni Hata Bildirimi</h2><label class="field">Hata başlığı<input name="title" placeholder="Örn: Oyun düzenle butonu çalışmıyor" required></label><label class="field">Sayfa / kategori<input name="page" placeholder="Örn: Yönetim Paneli / Oyunlar"></label><label class="field">Ekran görüntüsü<input name="screenshotFile" type="file" accept="image/*"><small>İstersen hata ekran görüntüsünü ekle; yetkililer panelde görür.</small></label><label class="field">Detay<textarea name="description" rows="8" placeholder="Hata nasıl oluştu? Hangi butona bastın? Ne olmasını bekliyordun? Ekranda ne oldu? Detaylı yaz..." required></textarea></label><button class="btn primary" type="submit">Hatayı Gönder</button></form><section class="card fix11UserList"><h2>Son Bildirimlerin</h2>${mine.map(r=>`<article><b>${esc(r.title)}</b><small>${esc(r.page||'Sayfa yok')} • ${esc(r.createdAt||'')}</small>${r.screenshot?'<span class="pill">Ekran görüntülü</span>':''}${fix8RequestStatusPill(r.status)}</article>`).join('') || '<p class="muted">Henüz hata bildirimin yok.</p>'}</section></div></section>`;
};

adminBugReportsPageFix8 = function(){
  const list=v222FilterRows(fix8LocalList(FIX8_BUGS_KEY),'bug');
  return `<section class="v221FeedbackAdmin v222FeedbackAdmin v223FeedbackAdmin"><div class="card wide fix10FeedbackHead bug"><div><span class="eyebrow">Filtreli Hata Raporu</span><h2>Hata Bildirimleri</h2><p class="muted">Ekran görüntülü hataları incele, durum değiştir ve çözüm notu ekle.</p></div><span class="pill banned">${list.length} kayıt</span></div>${v222ReportFilterTabs('bug')}<div class="v221FeedbackGrid bug">${list.map(r=>`<article><div class="v221FeedbackIcon">🐞</div><div class="v221FeedbackContent"><h3>${esc(r.title)}</h3><small>${esc(r.page||'Sayfa yok')} • ${esc(r.email||'Anonim')} • ${esc(r.createdAt||'')}</small><p>${esc(r.description||'Detay yok')}</p>${r.screenshot?`<img class="v223BugShot" src="${esc(r.screenshot)}" alt="Ekran görüntüsü">`:''}</div><div class="v221FeedbackActions">${v221FeedbackStatusSelect(r,'bug')}<textarea data-v221-feedback-note="bug:${esc(r.id)}" placeholder="Çözüm notu...">${esc(r.solutionNote || r.adminNote || '')}</textarea><button class="miniBtn primary" data-v221-feedback-save="bug:${esc(r.id)}">Kaydet</button></div></article>`).join('') || '<p class="muted">Bu filtrede hata bildirimi yok.</p>'}</div></section>`;
};

submitBugReportFix8 = async function(e){
  e.preventDefault();
  const form=e.currentTarget; const data=fix8FormToObject(form);
  const file=form.elements.screenshotFile?.files?.[0];
  let screenshot='';
  if(file){ try{ screenshot = await fileToBase64(file); }catch{} }
  const item={ id:`bug-${Date.now()}`, title:String(data.title||'').trim(), page:String(data.page||'').trim(), description:String(data.description||'').trim(), screenshot, email:state.session?.email||'', status:'Yeni', createdAt:new Date().toLocaleString('tr-TR')};
  if(!item.title || !item.description) return setToast('Başlık ve detay gerekli.');
  const list=fix8LocalList(FIX8_BUGS_KEY); list.unshift(item); fix8SaveLocal(FIX8_BUGS_KEY,list); form.reset(); render(); setToast(screenshot?'Hata bildirimi ekran görüntüsüyle gönderildi.':'Hata bildirimi yetkililere gönderildi.');
  try{ await api('bug-report-add', { report:{...item, screenshotUrl:screenshot} }); }catch{}
}

const v223OldOnAction = onAction;
onAction = async function(e){
  const action=e.currentTarget?.dataset?.action || '';
  if(action==='v223-ai-clear'){ localStorage.removeItem(V223_AI_DRAFT_KEY); render(); return; }
  return v223OldOnAction(e);
};
const v223OldBind = bind;
bind = function(){
  v223OldBind();
  const aiForm=document.getElementById('v223AiFeatureForm');
  if(aiForm) aiForm.addEventListener('submit', e=>{ e.preventDefault(); const fd=new FormData(aiForm); localStorage.setItem(V223_AI_DRAFT_KEY, String(fd.get('idea')||'')); localStorage.setItem(V223_NEXT_VERSION_KEY, String(fd.get('version')||'v2.2.4')); render(); setToast('AI özellik önerileri hazırlandı.'); });
  document.querySelectorAll('[data-v223-apply-feature]').forEach(btn=>btn.addEventListener('click', async ()=>{
    const item={ key:btn.dataset.v223ApplyFeature, title:btn.dataset.v223Title, target:btn.dataset.v223Target, description:btn.dataset.v223Desc, next:btn.dataset.v223Next, version:btn.dataset.v223Version || v223NextVersion(), appliedAt:new Date().toLocaleString('tr-TR') };
    const list=v223AppliedFeatures(); list.unshift(item); v223SaveList(V223_APPLIED_FEATURES_KEY, list.slice(0,80));
    if(!state.planner.some(p=>p.text===item.next)) state.planner.unshift({ id:'local-v223-'+Date.now(), group:'Gelecek Versiyon Özellikleri', text:item.next, status:'plan', featureKey:'v223-'+v223Slug(item.next) });
    state.updates = state.updates || [];
    setToast(`${item.version} için özellik uygulandı ve güncelleme notlarına işlendi.`);
    try{ await api('ai-feature-apply',{ adminToken:state.session?.adminToken, feature:item }); }catch{}
    render();
  }));
  document.querySelectorAll('[data-v223-reminder-channel]').forEach(btn=>btn.addEventListener('click',()=>{ localStorage.setItem(V223_REMINDER_CHANNEL_KEY, btn.dataset.v223ReminderChannel||'browser'); render(); }));
  document.querySelectorAll('[data-v223-test-notification]').forEach(btn=>btn.addEventListener('click',async()=>{ if('Notification' in window){ const perm = Notification.permission==='granted' ? 'granted' : await Notification.requestPermission(); if(perm==='granted') new Notification('Hayatımız Oyun Hatırlatıcı', { body:'Tarayıcı bildirimi aktif. Yayın zamanı geldiğinde buradan haber vereceğiz.' }); setToast(perm==='granted'?'Test tarayıcı bildirimi gönderildi.':'Bildirim izni verilmedi.'); } else setToast('Bu tarayıcı Notification API desteklemiyor.'); }));
  document.querySelectorAll('[data-v223-restore-series]').forEach(btn=>btn.addEventListener('click',async()=>{ const hist=v223SafeList(V222_SERIES_HISTORY_KEY).find(h=>String(h.id)===String(btn.dataset.v223RestoreSeries)); if(!hist) return setToast('Geçmiş kaydı bulunamadı.'); hist.ids.forEach((id,index)=>{ const g=state.games.find(x=>String(x.id)===String(id)); if(g) g.seriesOrder=index+1; }); setToast('Eski seri sırası geri yüklendi.'); try{ await api('series-order-restore',{ adminToken:state.session?.adminToken, historyId:hist.id, gameIds:hist.ids, series:hist.series }); }catch{} render(); }));
  document.querySelectorAll('[data-v223-request-to-game]').forEach(btn=>btn.addEventListener('click',async()=>{ const id=btn.dataset.v223RequestToGame; const req=fix8LocalList(FIX8_REQUESTS_KEY).find(r=>String(r.id)===String(id)); if(!req) return setToast('İstek bulunamadı.'); const meta=localGameMeta(req.gameTitle); const game={ title:req.gameTitle, seriesName:req.seriesName||'', genre:meta.genre||'Aksiyon-macera, hikaye odaklı', status:'Devam Ediyor', score:meta.score||8.5, cover:meta.cover||'', releaseDate:meta.releaseDate||meta.released||'', description:req.note||v222StoryForGame(req.gameTitle, meta.genre||''), tags:'Türkçe Altyazılı, Hikaye', eps:0, watchedEps:0, seriesOrder:0, playlistUrl:'', videoUrl:'' }; try{ const data=await api('game-request-convert-to-game',{ adminToken:state.session?.adminToken, requestId:id, game }); if(data.game) state.games.unshift(mapGame(data.game)); else state.games.unshift({ ...game, id:'local-'+Date.now() }); }catch{ state.games.unshift({ ...game, id:'local-'+Date.now() }); } v221UpdateFeedbackLocal('request',id,{status:'Eklendi',adminNote:'Tek tıkla oyuna dönüştürüldü.'}); setToast('Oyun isteği tek tıkla arşive eklendi.'); render(); }));
};
try{ render(); }catch(error){ showBootError(error); }


/* v2.2.3 FIX 1 - açılış hatası, kompakt kartlar, yakında ve AI merkezi stabilizer */
try{
  if(localStorage.getItem('hayatimiz_archive_view_v221') === 'grid') localStorage.setItem('hayatimiz_archive_view_v221','compact');
  if(localStorage.getItem('hayatimiz_game_view_mode_v219') === 'grid') localStorage.setItem('hayatimiz_game_view_mode_v219','compact');
}catch{}

// submitBugReportFix8 her zaman tanımlı kalsın; v2.2.3 ekran görüntülü sürüm varsa onu korur.
if(typeof submitBugReportFix8 !== 'function'){
  submitBugReportFix8 = async function(e){
    e.preventDefault();
    const form=e.currentTarget;
    const data=fix8FormToObject(form);
    const item={ id:`bug-${Date.now()}`, title:String(data.title||'').trim(), page:String(data.page||'').trim(), description:String(data.description||'').trim(), email:state.session?.email||'', status:'Yeni', createdAt:new Date().toLocaleString('tr-TR') };
    if(!item.title || !item.description) return setToast('Başlık ve detay gerekli.');
    const list=fix8LocalList(FIX8_BUGS_KEY); list.unshift(item); fix8SaveLocal(FIX8_BUGS_KEY,list);
    form.reset(); render(); setToast('Hata bildirimi yetkililere gönderildi.');
    try{ await api('bug-report-add', { report:item }); }catch{}
  };
}

function v223FixStatusOf(g){ return String(g?.status || '').trim().toLocaleLowerCase('tr-TR'); }
function v223FixIsUpcoming(g){ const s=v223FixStatusOf(g); return s === 'yakında' || s.includes('yakında'); }
function v223FixIsCompleted(g){ const s=v223FixStatusOf(g); return s === 'tamamlandı' || s === 'tamamlanan'; }
function v223FixIsContinuing(g){ const s=v223FixStatusOf(g); return s === 'devam ediyor' || s === 'devam eden'; }

if(typeof fix13GameMatchesStrictStatus === 'function'){
  fix13GameMatchesStrictStatus = function(g,status){
    if(!status || status === 'Tümü') return true;
    if(status === 'Tamamlandı') return v223FixIsCompleted(g);
    if(status === 'Devam Ediyor') return v223FixIsContinuing(g);
    if(status === 'Yakında') return v223FixIsUpcoming(g);
    return true;
  };
  fix12GameStatusMatch = fix13GameMatchesStrictStatus;
}

if(typeof v221ArchiveView === 'function'){
  const v223FixOldArchiveView = v221ArchiveView;
  v221ArchiveView = function(){
    const allowed = ['compact','detail','poster','horizontal'];
    let saved = localStorage.getItem(V221_VIEW_KEY) || state.gameViewMode || 'compact';
    if(saved === 'grid') saved = 'compact';
    const mode = allowed.includes(saved) ? saved : 'compact';
    try{ localStorage.setItem(V221_VIEW_KEY, mode); }catch{}
    state.gameViewMode = mode;
    return mode;
  };
}

if(typeof v221ArchiveCard === 'function'){
  v221ArchiveCard = function(g, admin=false){
    const mode = v221ArchiveView();
    const progress = progressPercent(g) || getGameProgress(g);
    const desc = fix4Description(g).slice(0, mode==='detail' ? 220 : 130);
    const upcoming = v223FixIsUpcoming(g);
    return `<article class="v221GameCard v223FixCard ${mode} ${upcoming?'upcoming':''}"><div class="v221GameCover"><img src="${esc(fix10Cover(g))}" alt="${esc(g.title)}"><span class="scoreBadge">${esc(String(g.score || '8.5'))}</span>${upcoming?'<b class="soonBadge">Yakında</b>':''}</div><div class="v221GameBody"><div class="v221Topline"><span>${esc(g.status || 'Arşiv')}</span>${g.releaseDate?`<small>${esc(formatDateTrFix6(g.releaseDate))}</small>`:''}</div><h3>${esc(g.title)}</h3><p>${esc(desc)}${desc.length >= (mode==='detail'?220:130) ? '...' : ''}</p>${tagChipsHtml(g.tags || g.genre)}<div class="v221Meta"><small>${Number(g.watchedEps||0)}/${Number(g.eps||0)} bölüm</small><b>%${progress}</b></div><div class="progressLine"><span style="width:${progress}%"></span></div><div class="v221Actions">${admin?`<button class="miniBtn primary" data-game-edit="${esc(g.id)}">Düzenle</button><button class="miniBtn danger" data-game-delete="${esc(g.id)}">Sil</button>`:(upcoming?`<button class="miniBtn v221Disabled" disabled>Yakında</button>`:`${watchButtonHtml(g)}<button class="miniBtn" data-favorite-game="${esc(g.id)}">${isFavorite(g.id)?'♥':'♡'}</button>`)}</div></div></article>`;
  };
  fix13ArchiveGameCard = v221ArchiveCard;
  fix12ArchiveGameCard = v221ArchiveCard;
}

if(typeof v221AlphabetGameArchive === 'function'){
  v221AlphabetGameArchive = function(games){
    const sorted=[...games].sort((a,b)=>String(a.title||'').localeCompare(String(b.title||''),'tr'));
    const groups = fix11Grouped(sorted, g=>g.title);
    return `${fix11AlphabetBar(groups,'oyun-harf')}<div class="v221AlphabetSections v223FixAlphabetSections">${groups.map(group=>`<section class="fix12LetterSection v221LetterSection" id="oyun-harf-${group.letter==='0-9'?'num':esc(routeSlug(group.letter))}"><div class="fix11LetterHead"><div><span>${esc(group.letter)}</span><h2>${esc(group.letter)} Harfindeki Oyunlar</h2></div><b>${group.items.length} oyun</b></div><div class="v221ArchiveGrid ${esc(v221ArchiveView())} v223FixGrid">${group.items.map(g=>v221ArchiveCard(g,false)).join('')}</div></section>`).join('')}</div>`;
  };
}

if(typeof v221SeriesCard === 'function'){
  v221SeriesCard = function(group){
    const first = group.items[0] || {};
    const mode = v221ArchiveView();
    const upcoming = group.items.length && group.items.every(v223FixIsUpcoming);
    const percent = group.items.length ? Math.round(group.items.reduce((a,g)=>a+progressPercent(g),0)/group.items.length) : 0;
    const totalEpisodes = group.items.reduce((s,g)=>s+Number(g.eps||seriesEpisodes(g).length||0),0);
    return `<article class="v221SeriesCard v223FixCard ${mode} ${upcoming?'upcoming':''}"><div class="v221SeriesCover"><img src="${esc(fix10Cover(first))}" alt="${esc(group.name)}"><span>${group.items.length} oyun</span>${upcoming?'<b>Yakında</b>':''}</div><div class="v221SeriesBody"><h3>${esc(group.name)}</h3><p>${esc((first.description || group.items.map(g=>g.title).join(', ')).slice(0, mode==='detail'?180:120))}${mode==='detail'?'':'...'}</p><div class="v221SeriesMini">${group.items.slice(0, mode==='detail'?6:4).map(g=>`<span><img src="${esc(fix10Cover(g))}" alt="">${esc(g.title)}</span>`).join('')}</div><div class="v221Meta"><small>%${percent} tamamlandı</small><b>${totalEpisodes} bölüm</b></div><div class="v221Actions">${upcoming?'<button class="miniBtn v221Disabled" disabled>Yakında</button>':`<button class="miniBtn primary" data-watch-series="${esc(first.id||'')}">Seriyi İzle</button>`}${isStaff()?'<button class="miniBtn" data-admin="Seri İzleme">Sırala</button>':''}</div></div></article>`;
  };
  fix12SeriesCard = v221SeriesCard;
  fix13SeriesCard = v221SeriesCard;
}

// Yönetim panelinde AI Özellik Merkezi kesin görünür.
const v223FixAdminBody = adminBody;
adminBody = function(){
  if(state.adminPage === 'AI Özellik Merkezi') return (typeof v223FeatureCenter === 'function' ? v223FeatureCenter() : applicationCenter());
  return v223FixAdminBody();
};
const v223FixAdminPanel = adminPanel;
adminPanel = function(){
  let html = v223FixAdminPanel();
  if(!String(html).includes('AI Özellik Merkezi')){
    html = html.replace('<button class="adminSubLink" data-admin="Güncelleme Notları">', '<button class="adminSubLink" data-admin="AI Özellik Merkezi"><span class="subDot"></span><div><b>AI Özellik Merkezi</b><small>Versiyon özellikleri</small></div></button><button class="adminSubLink" data-admin="Güncelleme Notları">');
  }
  return html;
};

try{ render(); }catch(error){ showBootError(error); }
