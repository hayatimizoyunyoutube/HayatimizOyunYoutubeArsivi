import './styles.css';

const VERSION = 'v2.1.5 Fix - Gelişmiş İzleme Stabil';
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
const DEFAULT_GAME_DRAFT = { title:'', genre:'', tags:'', releaseDate:'', status:'Devam Ediyor', eps:0, watchedEps:0, score:8.5, cover:'', seriesName:'', seriesOrder:0, playlistUrl:'', videoUrl:'', description:'' };



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
  { version:'v2.1.5', title:'Gerçek Storage + Gelişmiş İzleme', summary:'Profil fotoğrafı gerçek Supabase Storage yüklemesine bağlandı, seri izleme ekranı ve gelişmiş bölüm takibi eklendi.', image:'previews/hayatimiz-oyun-v215-storage-izleme-preview.png', written:'v2.1.5 ile Seriyi İzle detay ekranı, bölüm listesi, aktif harf görünümü, A Harfinde Başlayan Seriler başlıkları, admin kapak oranı düzeltmesi ve güncelleme notu düzenle/sil altyapısı tamamlandı.' }
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
    'takvim':'Takvim','koleksiyonlar':'Koleksiyonlar','profilim':'Profilim','profil':'Profilim'
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
  try{
    const hash = state.page === 'Yönetim Paneli' ? `#/admin/${routeSlug(state.adminPage)}` : `#/kategori/${routeSlug(state.page)}`;
    if(window.location.hash !== hash) window.history.replaceState(null, '', hash);
  }catch{}
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
  const cats = ['Ana Sayfa','Popüler','Tamamlanan','Devam Eden','Yakında','Korku','Aksiyon','Hikaye Odaklı','Takvim','Profilim'];
  return `<nav class="category">${cats.map(c=>`<button class="tab ${state.page===c?'active':''}" data-page="${esc(c)}">${esc(c)}</button>`).join('')}</nav>`;
}
function maintenancePage(){
  const eta = String(state.maintenance?.eta || '').trim();
  return html`<section class="maintenanceWrap proMaintenance"><div class="pulseOrb"></div><div class="maintenanceCard"><div class="loader"></div><span class="eyebrow">Bakım Modu</span><h1>Hayatımız Oyun güncelleniyor.</h1><p>${esc(state.maintenance?.message || 'Site kısa süreli bakımda. Lütfen daha sonra tekrar dene.')}</p>${eta ? `<div class="maintenanceEta"><span>Tahmini açılış</span><b>${esc(eta)}</b></div>` : ''}<div class="maintenanceSteps"><span></span><span></span><span></span></div><div class="authButtons"><button class="btn primary" data-action="open-login">Yetkili Girişi</button>${isStaff()?'<button class="btn" data-admin="Bakım Modu">Yönetim Paneli</button>':''}</div></div></section>`;
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
  return html`<section class="hero userHero premiumHero compactHero"><div class="heroCopy"><span class="eyebrow">Profesyonel oyuncu arşivi</span><h1>Oyun arşivi ve seri takip merkezi.</h1><p>Daha küçük, daha temiz ve istatistik odaklı ana ekran. Oyunları alfabetik şeritlerle bul, serileri izle ve bölüm ilerlemesini takip et.</p><div class="heroActions"><button class="btn primary" data-page="Popüler">Arşivi Keşfet</button><button class="btn" data-page="Devam Eden">Seriyi İzle</button><button class="btn" data-page="Yakında">Yakında</button></div></div><div class="heroStatsPanel"><div class="miniStat"><b>${games.length}</b><span>Oyun</span></div><div class="miniStat"><b>${series}</b><span>Seri</span></div><div class="miniStat"><b>${active}</b><span>Devam eden</span></div><div class="miniStat"><b>${completed}</b><span>Tamamlanan</span></div><div class="miniStat"><b>${upcoming}</b><span>Yakında</span></div></div></section>`;
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
  const missing = games.filter(g=>!String(g.cover || '').trim()).length;
  const avg = games.length ? (games.reduce((a,g)=>a+Number(g.score || 0),0) / games.length).toFixed(1) : '0.0';
  return `<section class="grid stats publicHighlights proStats"><div class="card"><b>Seri</b><h3>${series}</h3><span class="muted">bölümlü içerik</span></div><div class="card"><b>Ortalama Puan</b><h3>${avg}</h3><span class="muted">arşiv kalitesi</span></div><div class="card"><b>Kapak Kontrol</b><h3>${missing}</h3><span class="muted">eksik kapak</span></div><div class="card"><b>Yakında</b><h3>${games.filter(g=>g.status==='Yakında').length}</h3><span class="muted">planlanan</span></div></section>`;
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
function progressPercent(g){ const total = Number(g.eps || 0); const watched = Number(g.watchedEps || 0); if(!total) return g.status === 'Tamamlanan' ? 100 : 0; return Math.max(0, Math.min(100, Math.round((watched / total) * 100))); }
function seriesEpisodes(g){ const total = Math.max(0, Number(g.eps || 0)); return Array.from({length: total}, (_,i)=>i+1); }
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
function watchButtonHtml(g){
  const hasSeries = Number(g.eps || 0) > 0 || String(g.seriesName || '').trim();
  if(String(g.status || '') === 'Yakında') return `<button class="miniBtn disabled" disabled>Yakında</button>`;
  if(hasSeries || watchTargetUrl(g)) return `<button class="miniBtn primary" data-watch-series="${esc(g.id)}">Seriyi İzle</button>`;
  return `<button class="miniBtn" data-toast="${esc(g.title)} için izleme bağlantısı eklenmemiş.">Seriyi İzle</button>`;
}

function gameCard(g, adminActions){
  const progress = progressPercent(g) || getGameProgress(g);
  const cardClass = adminActions ? 'game v214GameCard adminGameCard' : 'game v214GameCard';
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
  return `${alphabetNav(games)}<div class="gameDirectory">${sections}</div>`;
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
function publicPage(){
  if(state.maintenance?.enabled && !isStaff()) return maintenancePage();
  if(!state.session) return authLanding();
  if(state.page === 'Takvim') return calendarPage();
  if(state.page === 'Koleksiyonlar') state.page = 'Ana Sayfa';
  if(state.page === 'Profilim') return profilePage();
  return publicStats() + advancedSearchPanel() + gameGrid();
}
function adminPanel(){
  if(!isStaff()) return `<section class="card"><h2>Yetki gerekiyor</h2><p>Yönetim paneli sadece kurucu, yönetici, moderatör ve editör hesaplarına görünür.</p></section>`;
  const pages = ['Genel Bakış','Oyunlar','Profil','Kullanıcı Yetkileri','Güncelleme Notları','Bakım Modu','API/ENV Durumu','Ayarlar'];
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
  if(state.adminPage === 'API/ENV Durumu') return apiStatus();
  if(state.adminPage === 'Ayarlar') return settingsPanel();
  return overviewAdmin();
}
function overviewAdmin(){
  return `<section class="grid stats adminStats"><div class="card"><b>Oyun</b><h3>${state.games.length}</h3><span class="muted">arşiv verisi</span></div><div class="card"><b>Güncelleme</b><h3>${state.updates.length}</h3><span class="muted">not</span></div><div class="card"><b>Veri durumu</b><h3>${state.runtimeLoaded?'Bağlandı':'Local'}</h3><span class="muted">Supabase/API</span></div><div class="card"><b>Oyun ekleme</b><h3>Aktif</h3><span class="muted">meta/kapak/etiket</span></div></section><section class="card wide"><h2>v2.1.5 Fix paketi aktif</h2><p>Yönetim paneli oyun kartları, site içi seri izleme, alfabetik başlık görünümü ve Supabase schema dönüş mesajı düzeltildi.</p><button class="btn primary" data-admin="Oyunlar">Oyunlar Sekmesini Aç</button></section>`;
}

function missingCoverPanel(){
  const missing = state.games.filter(g=>!String(g.cover || '').trim());
  return `<div class="card soft missingCoverPanel"><div class="sectionHead"><div><h3>Eksik Kapak Kontrolü</h3><p class="muted">Kapaksız oyunlar tek ekranda listelenir. RAWG öneri sistemiyle kapak hazırlayabilirsin.</p></div><span class="pill ${missing.length?'banned':'green'}">${missing.length} eksik</span></div>${missing.length ? `<div class="missingCoverList">${missing.map(g=>`<div><b>${esc(g.title)}</b><small>${esc(g.genre || 'Genel')} • ${esc(g.status || '-')}</small><button class="miniBtn" data-game-edit="${esc(g.id)}">Düzenle</button></div>`).join('')}</div><button class="btn primary" data-action="auto-cover-fetch">Eksik Kapaklara Öneri Hazırla</button>` : '<p class="note greenNote">Tüm oyunlarda kapak var.</p>'}</div>`;
}

function gamesAdmin(){
  const buttons = `<button class="btn primary" data-action="toggle-game-form">+ Oyun Ekle</button><button class="btn" data-action="auto-cover-fetch">Kapaksızlara Kapak Öner</button><span class="pill green">Form düzenleme aktif</span>`;
  return `<section class="card wide"><div class="sectionHead"><div><h2>Oyun Yönetimi</h2><p class="muted">v2.1.4: oyun ekleme, formda düzenleme, RAWG çoklu kapak seçimi, seri ve playlist alanları burada.</p></div><div class="heroActions">${buttons}</div></div><div class="note greenNote">Otomatik çekme sadece formu doldurur; oyun eklemez, silmez. Supabase kaydı sadece Kaydet butonuyla yapılır.</div>${missingCoverPanel()}${state.showGameForm ? gameAddForm() : ''}${state.editingGameId ? gameEditForm() : ''}${rawgCandidatePanel()}${coverSuggestionPanel()}${advancedSearchPanel()}${gameGrid()}</section>`;
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
  const opts = ['Devam Ediyor','Tamamlandı','Popüler','Yakında'].map(s=>`<option ${d.status===s?'selected':''}>${s}</option>`).join('');
  return `<div class="formGrid"><label class="field">Oyun adı<input name="title" required placeholder="Örn: Assassin's Creed Origins" value="${esc(d.title)}" /></label><label class="field">Kategori / Tür<input name="genre" required placeholder="Aksiyon, Macera, RPG" value="${esc(d.genre)}" /></label><label class="field">Çıkış tarihi <small>gün.ay.yıl</small><input name="releaseDate" placeholder="27.10.2017" value="${esc(d.releaseDate || '')}" /></label><label class="field">Durum<select name="status">${opts}</select></label><label class="field">Bölüm<input name="eps" type="number" min="0" value="${esc(String(d.eps ?? 0))}" /></label><label class="field">Puan<input name="score" type="number" min="0" max="10" step="0.1" value="${esc(String(d.score ?? 8.5))}" /></label><label class="field">Seri adı<input name="seriesName" placeholder="Örn: Assassin's Creed" value="${esc(d.seriesName || '')}" /></label><label class="field">YouTube oynatma listesi<input name="playlistUrl" placeholder="https://youtube.com/playlist?list=..." value="${esc(d.playlistUrl || '')}" /></label><label class="field wideField">Kapak URL<input name="cover" placeholder="https://..." value="${esc(d.cover)}" /></label><label class="field wideField">Manuel kapak yükle <small>Supabase Storage bağlantısı varsa URL’ye dönüştürülür; yoksa önizleme için local data kullanılır.</small><input id="coverUpload" type="file" accept="image/*"></label><label class="field wideField">Açıklama<textarea name="description" rows="3" placeholder="Oyun hakkında kısa not">${esc(d.description || '')}</textarea></label><div class="field wideField"><span>Etiketler</span><small class="muted">Butonlardan seç: Türkçe Altyazılı, Türkçe Dublajlı, DLC, Coop, %100...</small>${tagButtonsHtml(d.tags)}</div></div><div class="coverPreview ${d.cover?'':'isEmpty'}">${d.cover?`<img src="${esc(d.cover)}" alt="Kapak önizleme">`:'Kapak çekilince burada önizleme görünür.'}</div>`;
}
function gameAddForm(){
  const d = { ...DEFAULT_GAME_DRAFT, ...state.gameDraft };
  return `<form class="card soft gameForm" id="gameAddForm" autocomplete="off"><h3>Yeni Oyun Ekle</h3><p class="muted">Oyun adını yaz, RAWG sonuçlarını getir, doğru kapağı seç; kaydetmeden oyun eklenmez.</p>${gameFormFields(d,'add')}<div class="note greenNote">Otomatik çekme oyun eklemez, oyun silmez, sadece form alanlarını doldurur.</div><div class="rowActions"><button class="btn" type="button" data-action="auto-game-meta">RAWG kapak/tarih/tür sonuçlarını getir</button><button class="btn" type="button" data-action="estimate-playlist-episodes">Playlist bölüm sayısını çek</button><button class="btn primary" type="submit">Supabase games tablosuna kaydet</button><button class="btn" type="button" data-action="toggle-game-form">Kapat</button></div></form>`;
}
function gameEditForm(){
  const current = state.games.find(g=>String(g.id)===String(state.editingGameId));
  if(!current) return '';
  return `<form class="card soft gameForm editGameForm" id="gameEditForm" autocomplete="off"><h3>Oyunu Formda Düzenle</h3><p class="muted">Düzenleme artık prompt değil; kapak, bölüm hedefi, izlenen bölüm, seri sıra no, video ve playlist alanları formdan güncellenir.</p>${gameFormFields(current,'edit')}<div class="rowActions"><button class="btn" type="button" data-action="auto-game-meta-edit">Meta Yenile</button><button class="btn" type="button" data-action="estimate-playlist-episodes-edit">Playlist bölüm sayısını çek</button><button class="btn primary" type="submit">Oyunu Güncelle</button><button class="btn" type="button" data-action="close-game-edit">Kapat</button></div></form>`;
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

function seriesWatchModal(){
  const g = state.watchingGameId ? state.games.find(x=>String(x.id)===String(state.watchingGameId)) : null;
  if(!g) return '';
  const rawUrl = watchTargetUrl(g);
  const embed = youtubeEmbedUrl(rawUrl);
  const episodes = seriesEpisodes(g);
  const watched = Number(g.watchedEps || 0);
  const rows = episodes.length ? episodes.map(n=>`<li class="${n<=watched?'done':''}"><span>${n}. Bölüm</span><button class="miniBtn" data-toast="${esc(g.title)} ${n}. bölüm site içi oynatıcıda açıldı.">Sitede Aç</button></li>`).join('') : '<li><span>Bölüm hedefi eklenmemiş.</span><button class="miniBtn disabled">Bekliyor</button></li>';
  const player = embed ? `<div class="sitePlayer"><iframe src="${esc(embed)}" title="${esc(g.title)} site içi oynatıcı" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>` : '<div class="sitePlayer empty"><b>Site içi oynatıcı için bağlantı yok.</b><span>Admin panelinde Tek Video URL veya YouTube oynatma listesi alanını doldur.</span></div>';
  return `<div class="modalOverlay"><div class="modal seriesModal"><button class="close" type="button" data-action="close-series-watch">×</button><span class="eyebrow">Site İçinde Seriyi İzle</span><h2>${esc(g.title)}</h2><p class="muted">${esc(g.seriesName || 'Tek seri')} • ${esc(g.genre)} • ${watched}/${Number(g.eps||0)} bölüm</p>${player}<div class="progressLine large"><span style="width:${progressPercent(g)}%"></span></div><ol class="episodeList">${rows}</ol></div></div>`;
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
  document.querySelectorAll('[data-watch-series]').forEach(el=>el.addEventListener('click', e=>{ e.preventDefault(); state.watchingGameId = el.dataset.watchSeries; render(); }));
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
  if(action === 'clear-rawg-candidates'){ state.rawgCandidates = []; render(); }
  if(action === 'estimate-playlist-episodes'){ await estimatePlaylistEpisodes('gameAddForm'); }
  if(action === 'estimate-playlist-episodes-edit'){ await estimatePlaylistEpisodes('gameEditForm'); }
  if(action === 'close-game-edit'){ state.editingGameId = null; state.rawgCandidates = []; render(); }
  if(action === 'apply-cover-suggestions'){ await applyCoverSuggestions(); }
  if(action === 'clear-cover-suggestions'){ state.coverSuggestions = []; render(); }
  if(action === 'edit-pending-feature'){ if(state.pendingFeature){ state.editingFeature = { ...state.pendingFeature }; render(); } }
  if(action === 'cancel-feature-confirm'){ rememberPendingFeature(null); render(); }
  if(action === 'confirm-feature-apply'){ const pending = state.pendingFeature; rememberPendingFeature(null); if(pending) await applyFeatureObject(pending); }
  if(action === 'confirm-feature-apply-refresh'){ const pending = state.pendingFeature; rememberPendingFeature(null); if(pending){ await applyFeatureObject(pending); await loadRuntime(); setToast('Özellik uygulandı, site verileri yenilendi. Oturum korunuyor.'); } }
  if(action === 'clear-active-features'){ await clearActiveFeatures(); }
  if(action === 'clear-ai-suggestions'){ state.aiSuggestions = null; render(); }
  if(action === 'download-notes'){ download('hayatimiz-oyun-guncelleme-notlari.json', JSON.stringify(state.updates, null, 2)); setToast('Güncelleme notları indirildi.'); }
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
    description:String(getFormValue(form, 'description')).trim()
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
  if(form?.elements?.[name]) form.elements[name].value = value ?? '';
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
  if(!form) return setToast('Oyun ekleme formu açık değil. Önce + Oyun Ekle butonuna bas.');
  const draft = readGameDraftFromForm(form);
  if(formId === 'gameAddForm'){ state.gameDraft = { ...DEFAULT_GAME_DRAFT, ...state.gameDraft, ...draft }; persistGameDraft(); }
  const title = draft.title || state.gameDraft.title || '';
  if(!title.trim()) return setToast('Önce oyun adını yaz. Otomatik çekme oyun eklemez, sadece formu doldurur.');
  setToast('Oyun bilgileri çekiliyor...');
  let meta = null;
  try{
    const data = await api('game-meta', { title, adminToken: state.session?.adminToken });
    meta = data?.meta || null;
    state.rawgCandidates = Array.isArray(data?.candidates) ? data.candidates : (meta ? [meta] : []);
  }catch(err){ meta = null; }
  if(!meta){
    const [genre,tags,cover,released,score] = guessGameMeta(title);
    meta = { genre, tags, cover, released, score };
  }
  const nextDraft = { ...DEFAULT_GAME_DRAFT, ...(formId === 'gameAddForm' ? state.gameDraft : draft), title: meta.title || draft.title || state.gameDraft.title, genre: meta.genre || draft.genre || state.gameDraft.genre, releaseDate: normalizeReleaseDate(meta.released || meta.releaseDate || draft.releaseDate || state.gameDraft.releaseDate), score: Number(meta.score || draft.score || state.gameDraft.score || 8.5), cover: meta.cover || draft.cover || state.gameDraft.cover, tags: draft.tags || state.gameDraft.tags || '', seriesName: draft.seriesName || state.gameDraft.seriesName || '', playlistUrl: draft.playlistUrl || state.gameDraft.playlistUrl || '', videoUrl: draft.videoUrl || state.gameDraft.videoUrl || '', watchedEps: draft.watchedEps || state.gameDraft.watchedEps || 0, seriesOrder: draft.seriesOrder || state.gameDraft.seriesOrder || 0, description: meta.description || draft.description || state.gameDraft.description || '' };
  if(formId === 'gameAddForm'){ state.gameDraft = nextDraft; persistGameDraft(); }
  setFormValue(form, 'title', nextDraft.title);
  setFormValue(form, 'genre', nextDraft.genre);
  setFormValue(form, 'releaseDate', nextDraft.releaseDate);
  setFormValue(form, 'score', nextDraft.score);
  setFormValue(form, 'cover', nextDraft.cover);
  setFormValue(form, 'description', nextDraft.description);
  const preview = form.querySelector('.coverPreview');
  if(preview){
    preview.classList.toggle('isEmpty', !nextDraft.cover);
    preview.innerHTML = nextDraft.cover ? `<img src="${esc(nextDraft.cover)}" alt="Kapak önizleme">` : 'Kapak çekilince burada önizleme görünür.';
  }
  setToast(state.rawgCandidates.length > 1 ? 'Birden fazla RAWG sonucu geldi. Doğru kapağı seç; form dışında oyun eklenmedi.' : 'Form dolduruldu: kapak, çıkış tarihi ve tüm türler çekildi. Etiketleri butonlardan seç; kaydetmeden oyun eklenmez.');
  render();
}


function applyRawgCandidate(index){
  const item = state.rawgCandidates?.[index];
  if(!item) return setToast('RAWG sonucu bulunamadı.');
  const form = document.getElementById(state.editingGameId ? 'gameEditForm' : 'gameAddForm');
  if(!form) return setToast('Oyun formu açık değil.');
  setFormValue(form, 'title', item.title || getFormValue(form,'title'));
  setFormValue(form, 'genre', item.genre || getFormValue(form,'genre'));
  setFormValue(form, 'releaseDate', normalizeReleaseDate(item.released || item.releaseDate || getFormValue(form,'releaseDate')));
  setFormValue(form, 'score', item.score || getFormValue(form,'score'));
  setFormValue(form, 'cover', item.cover || getFormValue(form,'cover'));
  setFormValue(form, 'description', item.description || getFormValue(form,'description'));
  const preview = form.querySelector('.coverPreview');
  const cover = getFormValue(form,'cover');
  if(preview){ preview.classList.toggle('isEmpty', !cover); preview.innerHTML = cover ? `<img src="${esc(cover)}" alt="Kapak önizleme">` : 'Kapak çekilince burada önizleme görünür.'; }
  if(form.id === 'gameAddForm') saveGameDraftFromForm(form);
  state.rawgCandidates = [];
  render();
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
    const data = await api('playlist-count', { adminToken: state.session?.adminToken, playlistUrl });
    const count = Number(data.count || 0);
    if(count > 0){ setFormValue(form, 'eps', count); if(form.id === 'gameAddForm') saveGameDraftFromForm(form); return setToast(`Playlist bölüm sayısı çekildi: ${count}`); }
    setToast('Playlist sayısı alınamadı. YouTube API key yoksa manuel sayı girebilirsin.');
  }catch(err){ setToast('Playlist sayısı alınamadı: ' + err.message); }
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
