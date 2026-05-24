import './styles.css';

const VERSION = 'v2.1.4.9 Akıllı Özellik Gerçek Modül Fix';
const STAFF_ROLES = ['kurucu', 'yonetici', 'moderator', 'editor'];
const OWNER_ROLES = ['kurucu', 'yonetici'];
const ROLE_LABELS = { kurucu:'Kurucu', yonetici:'Yönetici', moderator:'Moderatör', editor:'Editör', user:'Kullanıcı', banned:'Banlı' };
const ROLE_OPTIONS = ['kurucu','yonetici','moderator','editor','user'];
const AUTH_SESSION_KEY = 'hayatimiz_session_stable';
const MAINTENANCE_KEY = 'hayatimiz_maintenance_cache_stable';
const ADMIN_TAB_KEY = 'hayatimiz_admin_tab_stable';
const FEATURE_CACHE_KEY = 'hayatimiz_features_stable';
const SMART_FEATURE_DRAFT_KEY = 'hayatimiz_smart_feature_draft';
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
    description:'Profil bölümünde fotoğraf yükleme alanını görünür yapar. Storage bağlantısı sonraki modüldedir.',
    next:'Profil fotoğrafını profile-photos bucket içine yükle'
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


const VERSION_NOTES_ARCHIVE = [
  { version:'v2.0.6', title:'UI Safe Fix', summary:'Kategori taşma fixi, yönetim paneli düzeni ve oyun kartı kapak oranları düzenlendi.', image:'previews/hayatimiz-oyun-v206-desktop-preview.png', written:'Site bozulmadan uygulanabilecek ilk güvenli arayüz patch paketi hazırlandı.' },
  { version:'v2.0.7', title:'Otomatik Çekme Altyapısı', summary:'JSON veri sistemi, otomatik çekme paneli ve fallback yapısı eklendi.', image:'previews/hayatimiz-oyun-v207-desktop-preview.png', written:'Veri gelmezse sitenin bozulmaması için güvenli katman hazırlandı.' },
  { version:'v2.0.8', title:'Smart Archive', summary:'Akıllı filtre, kalite skoru, otomatik çekme geçmişi ve sağlık özeti eklendi.', image:'previews/hayatimiz-oyun-v208-desktop-preview.png', written:'Arşiv tarafında kontrol ve filtreleme kartları geliştirildi.' },
  { version:'v2.0.9', title:'Control Hub', summary:'Kontrol merkezi, sezon/bölüm takibi, yayın takvimi ve koleksiyon alanı eklendi.', image:'previews/hayatimiz-oyun-v209-desktop-preview.png', written:'Arşiv yönetimi sezon ve koleksiyon odaklı hale getirildi.' },
  { version:'v2.1.0', title:'AI Archive Studio', summary:'AI öneri paneli, bildirim merkezi, izleme ilerlemesi ve tema presetleri eklendi.', image:'previews/hayatimiz-oyun-v210-desktop-preview.png', written:'Büyük sürümde kişiselleştirme ve otomasyon altyapısı genişletildi.' },
  { version:'v2.1.1', title:'Test Center', summary:'Test merkezi, hata raporları, API/ENV paneli ve rollback planı eklendi.', image:'previews/hayatimiz-oyun-v211-desktop-preview.png', written:'Akşam testleri için hata yakalama ve kontrol merkezi oluşturuldu.' },
  { version:'v2.1.2', title:'Kullanıcı Menüleri + Bakım', summary:'Kullanıcıya görünmemesi gereken teknik menüler kaldırıldı ve bakım modu güçlendirildi.', image:'previews/hayatimiz-oyun-v212-desktop-preview.png', written:'Yönetim paneli kullanıcı arayüzünden ayrıldı.' },
  { version:'v2.1.3', title:'Supabase Kullanıcı + Yetki', summary:'Kayıtlar Supabase site_users tablosuna bağlandı, kurucu/yönetici/moderatör/editör rolleri eklendi.', image:'previews/hayatimiz-oyun-v213-admin-preview.png', written:'Rol yönetimi, banlama, silme ve global bakım modu altyapısı güçlendirildi.' },
  { version:'v2.1.4', title:'Otomatik Uygulama Merkezi', summary:'Özellik Planı içinden Siteye Uygula sistemi ve oyun ekleme butonu aktif etme akışı eklendi.', image:'previews/hayatimiz-oyun-v214-feature-apply-preview.png', written:'Hazır modüller panelden açılabilir hale getirildi.' },
  { version:'v2.1.4.1', title:'Arayüz Yenileme + Resimli Kurulum', summary:'Yönetim kartları, mobil görünüm ve resimli kurulum rehberi yenilendi.', image:'previews/hayatimiz-oyun-v2141-public-home-preview.png', written:'Kurulum görselleri ZIP içine alındı.' },
  { version:'v2.1.4.2', title:'Profesyonel Mobil + Güncelleme Notları', summary:'Profesyonel mobil arayüz ve admin güncelleme notu ekleme paneli eklendi.', image:'previews/hayatimiz-oyun-v2142-public-home-preview.png', written:'Güncelleme notları kullanıcı ana sayfasından kaldırıldı; yönetim panelinde yazılı ve resimli not ekleme akışı oluşturuldu.' },
  { version:'v2.1.4.3', title:'Arayüz Fix + Güncelleme Notları', summary:'Kullanıcı ana sayfasındaki gereksiz teknik alanlar kaldırıldı, mobil görünüm güçlendirildi ve güncelleme notu yönetimi düzeltildi.', image:'previews/hayatimiz-oyun-v2143-public-home-preview.png', written:'Hata düzeltme sürümü: yönetim paneli güncelleme notları, görsel/yazılı not arşivi, mobil arayüz ve temiz kullanıcı ana sayfası birleştirildi.' },
  { version:'v2.1.4.4', title:'Kalıcı Özellik + Oturum Fix', summary:'Siteden eklenen özellikler güncellemede kaybolmaz; oturum artık kullanıcı çıkış yapmadan sıfırlanmaz.', image:'previews/hayatimiz-oyun-v2144-feature-persist-preview.png', written:'site_features, site_admin_planner, site_admin_notes ve oturum anahtarları sürümden bağımsız hale getirildi. Güncelleme güvenli kurulum dosyası eklendi.' }
];

const state = {
  page: 'Ana Sayfa',
  adminPage: localStorage.getItem(ADMIN_TAB_KEY) || 'Genel Bakış',
  query: '',
  session: loadStorageWithLegacy(AUTH_SESSION_KEY, LEGACY_SESSION_KEYS, null),
  maintenance: loadStorageWithLegacy(MAINTENANCE_KEY, LEGACY_MAINTENANCE_KEYS, { enabled:false, message:'Hayatımız Oyun kısa süreli bakımda.' }),
  features: normalizeFeatureMap(loadStorageWithLegacy(FEATURE_CACHE_KEY, LEGACY_FEATURE_KEYS, {})),
  users: [],
  notes: [],
  planner: defaultPlanner(),
  toast: '',
  authMode: null,
  loading: false,
  error: '',
  runtimeLoaded: false,
  showGameForm: false,
  editingGameId: null,
  pendingFeature: safeParse(localStorage.getItem(SMART_FEATURE_DRAFT_KEY), null),
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
    { id:'p8', group:'Adminin Önerileri', text:'Benim Notlarım alanından eksik/hata girişi ekle', status:'kontrol' }
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
  return FEATURE_CATALOG
    .map(f => ({ ...f, score: featureScore(f, text) }))
    .filter(f => f.score > 0)
    .sort((a,b)=>b.score-a.score)
    .slice(0,4);
}
function rememberPendingFeature(feature){
  state.pendingFeature = feature || null;
  try{
    if(feature) localStorage.setItem(SMART_FEATURE_DRAFT_KEY, JSON.stringify(feature));
    else localStorage.removeItem(SMART_FEATURE_DRAFT_KEY);
  }catch{}
}
function featureFromPlannerItem(item){
  if(!item) return null;
  const preset = FEATURE_CATALOG.find(f => f.key === item.featureKey || f.title === item.text);
  if(preset) return preset;
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
  FEATURE_CATALOG.filter(f => featureEnabled(f.key)).forEach(f=>map.set(f.key, f));
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
  return html`<section class="hero userHero premiumHero"><div class="heroCopy"><span class="eyebrow">Profesyonel oyuncu arşivi</span><h1>Oyun arşivi, seriler ve koleksiyonlar.</h1><p>Temiz kullanıcı ana sayfası, mobil uyumlu kartlar ve kişisel koleksiyonlarla arşivini yönet.</p><div class="heroActions"><button class="btn primary" data-page="Popüler">Arşivi Keşfet</button><button class="btn" data-page="Popüler">Popüler Oyunlar</button><button class="btn" data-page="Koleksiyonlar">Koleksiyonlar</button></div></div><div class="heroShowcase"><div class="miniStat"><b>${state.games.length}</b><span>Oyun</span></div><div class="miniStat"><b>12</b><span>Seri</span></div><div class="miniStat"><b>7</b><span>Koleksiyon</span></div></div></section>`;
}
function publicStats(){ return `<section class="grid stats publicHighlights"><div class="card"><b>Devam Eden</b><h3>${state.games.filter(g=>g.status==='Devam Ediyor').length}</h3><span class="muted">aktif seri</span></div><div class="card"><b>Tamamlanan</b><h3>${state.games.filter(g=>g.status==='Tamamlandı').length}</h3><span class="muted">arşivde</span></div><div class="card"><b>Koleksiyon</b><h3>7</h3><span class="muted">özel liste</span></div><div class="card"><b>Yakında</b><h3>${state.games.filter(g=>g.status==='Yakında').length}</h3><span class="muted">planlanan</span></div></section>`; }
function coverFor(g){ return g.cover || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=900&auto=format&fit=crop'; }
function gameGrid(){
  let games = state.games.filter(g => !state.query || JSON.stringify(g).toLowerCase().includes(state.query.toLowerCase()));
  if(state.page === 'Popüler') games = games.filter(g=>g.status==='Popüler' || g.score >= 9.2);
  if(state.page === 'Tamamlanan') games = games.filter(g=>g.status==='Tamamlandı');
  if(state.page === 'Devam Eden') games = games.filter(g=>g.status==='Devam Ediyor');
  if(state.page === 'Yakında') games = games.filter(g=>g.status==='Yakında');
  if(['Korku','Aksiyon','Hikaye Odaklı'].includes(state.page)) games = games.filter(g=>g.genre.includes(state.page.replace('Hikaye Odaklı','Hikaye')));
  const adminActions = isStaff() && state.page === 'Yönetim Paneli' && state.adminPage === 'Oyunlar' && featureEnabled('game_edit_delete_buttons');
  return `<section class="games">${games.map(g=>`<article class="game"><div class="coverWrap"><img src="${esc(coverFor(g))}" alt="${esc(g.title)}">${featureEnabled('missing_cover_warning') && !g.cover ? '<span class="coverWarn">Kapak eksik</span>' : ''}</div><div><span class="pill">${esc(g.status)}</span><h3>${esc(g.title)}</h3><p>${esc(g.genre)} • ${g.eps} bölüm</p><b>⭐ ${g.score}</b>${adminActions ? `<div class="gameAdminActions"><button class="miniBtn" data-game-edit="${esc(g.id)}">Düzenle</button><button class="miniBtn danger" data-game-delete="${esc(g.id)}">Sil</button></div>` : ''}</div></article>`).join('') || '<div class="card wide">Oyun bulunamadı.</div>'}</section>`;
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
  return `<section class="grid stats adminStats"><div class="card"><b>Oyun</b><h3>${state.games.length}</h3><span class="muted">arşiv verisi</span></div><div class="card"><b>Aktif Özellik</b><h3>${activeFeatures}</h3><span class="muted">uygulandı</span></div><div class="card"><b>Güncelleme</b><h3>${state.updates.length}</h3><span class="muted">not</span></div><div class="card"><b>Veri durumu</b><h3>${state.runtimeLoaded?'Bağlandı':'Local'}</h3><span class="muted">Supabase/API</span></div></section><section class="card wide"><h2>Kalıcı özellik sistemi aktif</h2><p>Siteden eklediğin ve Siteye Uygula dediğin özellikler artık site_features ve site_admin_planner tablolarında kalır. Güncelleme güvenli kurulum kullanıldığında özellikler silinmez.</p><button class="btn primary" data-admin="Özellik Planı">Özellik Planını Aç</button><button class="btn" data-admin="Uygulama Merkezi">Uygulama Merkezi</button><button class="btn" data-admin="Oyunlar">Oyunlar Sekmesi</button></section>`;
}
function gamesAdmin(){
  const addEnabled = featureEnabled('admin_games_add_button');
  const coverEnabled = featureEnabled('auto_cover_fetch');
  const editEnabled = featureEnabled('game_edit_delete_buttons');
  const buttons = `${addEnabled ? '<button class="btn primary" data-action="toggle-game-form">+ Oyun Ekle</button>' : '<button class="btn" data-feature-apply="admin_games_add_button">Oyun Ekle özelliğini uygula</button>'}${coverEnabled ? '<button class="btn" data-action="auto-cover-fetch">Otomatik Kapak Çek</button>' : '<button class="btn" data-feature-apply="auto_cover_fetch">Kapak Çekme Özelliğini Uygula</button>'}${editEnabled ? '<span class="pill green">Düzenle/Sil aktif</span>' : '<button class="btn" data-feature-apply="game_edit_delete_buttons">Düzenle/Sil Özelliğini Uygula</button>'}`;
  return `<section class="card wide"><div class="sectionHead"><div><h2>Oyun Yönetimi</h2><p class="muted">Oyun ekleme, kapak çekme, düzenleme ve silme modülleri Özellik Planı üzerinden aktif edilir.</p></div><div class="heroActions">${buttons}</div></div>${!addEnabled?'<div class="note">Oyun Ekle butonu henüz aktif değil. Özellik Planı içinde ilgili maddeye Siteye Uygula de.</div>':''}${coverEnabled?'<div class="note greenNote">Otomatik kapak modülü aktif. Kapaksız oyunlara güvenli kapak atanabilir.</div>':''}${editEnabled?'<div class="note greenNote">Oyun düzenle/sil aktif. Kartların altında Düzenle ve Sil butonları görünür.</div>':''}${addEnabled && state.showGameForm ? gameAddForm() : ''}${gameGrid()}</section>`;
}
function gameAddForm(){
  return `<form class="card soft gameForm" id="gameAddForm"><h3>Yeni Oyun Ekle</h3><p class="muted">Oyun adını yazıp otomatik doldur dersen tür, etiket ve kapak önerisi güvenli şekilde doldurulur.</p><div class="formGrid"><label class="field">Oyun adı<input name="title" required placeholder="Örn: Red Dead Redemption 2" /></label><label class="field">Kategori / Tür<input name="genre" required placeholder="Aksiyon / Hikaye" /></label><label class="field">Etiketler<input name="tags" placeholder="açık dünya, hikaye, aksiyon" /></label><label class="field">Durum<select name="status"><option>Devam Ediyor</option><option>Tamamlandı</option><option>Popüler</option><option>Yakında</option></select></label><label class="field">Bölüm<input name="eps" type="number" min="0" value="0" /></label><label class="field">Puan<input name="score" type="number" min="0" max="10" step="0.1" value="8.5" /></label><label class="field wideField">Kapak URL<input name="cover" placeholder="https://..." /></label></div><div class="rowActions"><button class="btn" type="button" data-action="auto-game-meta">Oyun adından tür/etiket/kapak çek</button><button class="btn primary" type="submit">Supabase games tablosuna kaydet</button><button class="btn" type="button" data-action="toggle-game-form">Kapat</button></div></form>`;
}
function apiStatus(){ return `<section class="grid adminGrid"><div class="card"><h3>Vercel ENV</h3><p>Gizli keyler ekranda gösterilmez. Sadece bağlantı durumu izlenir.</p><span class="pill ${state.runtimeLoaded?'green':'banned'}">${state.runtimeLoaded?'API bağlı':'Local/Fallback'}</span></div><div class="card"><h3>Supabase Tabloları</h3><p>site_users, games, site_features, site_admin_planner, site_admin_notes, site_runtime_config, site_update_notes.</p></div><div class="card"><h3>Güvenlik</h3><p>Key/şifre GitHub dosyalarına yazılmaz; sadece Vercel Environment Variables içinde kalır.</p></div></section>`; }
function settingsPanel(){ return `<section class="card wide"><h2>Ayarlar</h2><p>Kurulum notları ZIP içindeki KURULUM-KOMUTLARI.txt dosyasındadır. Önce Supabase, sonra GitHub, sonra Vercel sırası kullanılır.</p><button class="btn" data-action="clear-local">Eski sürüm local cache temizle</button><p class="note">Bu işlem oturumu silmez; çıkış sadece sen Çıkış butonuna basınca yapılır.</p></section>`; }
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
  const inputBox = `<div class="card wide smartFeatureBox"><h2>Akıllı Özellik Ekle</h2><p class="muted">Örn: <b>otomatik kapak resmi çekme</b> yaz. Sistem hazır modülü bulur, öneriler verir ve “Bunu mu uygulayayım?” diye onay ister.</p><form id="featureIdeaForm" class="noteForm"><input name="featureText" placeholder="Örn: Oyunlara otomatik kapak resmi çekme ekle" required /><button class="btn primary" type="submit">Özelliği Anla + Ekle</button></form></div>`;
  return `<section class="plannerWrap">${inputBox}${activeFeatureManager()}<div class="grid adminGrid">${groups.map(group=>`<div class="card"><h3>${esc(group)}</h3>${state.planner.filter(p=>p.group===group).map(planItem).join('') || '<p class="muted">Madde yok.</p>'}<button class="btn" data-plan-complete="${esc(group)}">Tamamla + Yeni Madde</button></div>`).join('')}</div><div class="card wide notesCard"><h3>Benim Notlarım</h3><p class="muted">Eksik, hata ve fikirlerini buraya yaz. Supabase site_admin_notes tablosuna kaydedilir.</p><form id="adminNoteForm" class="noteForm"><textarea name="note" placeholder="Örn: Oyun düzenleme butonu eksik, mobilde buton taşmış..."></textarea><button class="btn primary" type="submit">Notu Kaydet</button></form><div class="noteList">${state.notes.map(n=>`<div class="noteLine">📝 ${esc(n.note || n.content || n.title || '')}</div>`).join('') || '<span class="muted">Henüz not yok.</span>'}</div></div></section>`;
}

function activeFeatureManager(){
  const items = getActiveFeatureItems();
  const bulkEnabled = featureEnabled('active_features_bulk_clear');
  const bulkButton = bulkEnabled
    ? '<button class="btn danger" data-action="clear-active-features">Tüm Aktif Özellikleri Pasif Yap</button>'
    : '<button class="btn" data-feature-apply="active_features_bulk_clear">Tümünü silme butonunu ekle</button>';
  return `<div class="card wide activeFeatureBox"><div class="sectionHead"><div><h2>Özellikleri Olan Özellikler</h2><p class="muted">Siteye uygulanmış modüller burada kalır; güncelleme sonrası silinmez. Düzenle, pasife al veya ilgili sekmeyi aç.</p></div><div class="rowActions"><span class="pill green">${items.length} aktif</span>${bulkButton}</div></div><div class="activeFeatureGrid">${items.map(f=>`<div class="activeFeatureItem"><b>${esc(f.title)}</b><small>${esc(f.target || 'Özellik Planı')}</small><div class="rowActions"><button class="miniBtn" data-admin="${esc(targetAdminPage(f))}">Aç</button><button class="miniBtn" data-feature-edit="${esc(f.key)}">Düzenle</button><button class="miniBtn danger" data-feature-delete="${esc(f.key)}">Sil / Pasif</button></div></div>`).join('') || '<p class="muted">Henüz siteye uygulanmış özellik yok.</p>'}</div></div>`;
}

function planItem(p){
  const feature = featureFromPlannerItem(p);
  const key = feature?.key || p.featureKey || slugifyFeature(p.text);
  const enabled = p.status === 'tamam' || featureEnabled(key);
  const target = feature?.target || 'Özellik Planı';
  return `<div class="planItem ${enabled?'done':''}"><span>${enabled?'✅':'⬜'}</span><div><b>${esc(p.text)}</b><small>${esc(target)}</small><div class="planActions">${!enabled ? `<button class="miniBtn primary" data-feature-apply="${esc(key)}" data-feature-title="${esc(p.text)}">Siteye Uygula</button>` : `<button class="miniBtn" data-admin="${esc(targetAdminPage(feature))}">Aç</button><span class="pill green">Sitede aktif</span>`}<button class="miniBtn" data-feature-edit="${esc(key)}">Düzenle</button><button class="miniBtn danger" data-feature-delete="${esc(key)}">Sil</button></div></div></div>`;
}
function applicationCenter(){
  return `<section class="grid adminGrid featureCenter">${FEATURE_CATALOG.map(f=>`<div class="card"><span class="pill ${featureEnabled(f.key)?'green':'banned'}">${featureEnabled(f.key)?'Aktif':'Bekliyor'}</span><h3>${esc(f.title)}</h3><p>${esc(f.description)}</p><p class="muted"><b>Hedef:</b> ${esc(f.target)}</p>${featureEnabled(f.key)?`<button class="btn" data-admin="${targetAdminPage(f)}">Aç</button>`:`<button class="btn primary" data-feature-apply="${esc(f.key)}">Siteye Uygula</button>`}</div>`).join('')}</section>`;
}
function updateNotes(){
  const active = featureEnabled('update_notes_editor');
  const list = VERSION_NOTES_ARCHIVE.map(n=>`<article class="updateCard"><img src="${esc(n.image)}" onerror="this.style.display='none'" alt="${esc(n.version)}"><div><span class="pill green">${esc(n.version)}</span><h3>${esc(n.title)}</h3><p>${esc(n.summary)}</p><small>${esc(n.written)}</small></div></article>`).join('');
  return `<section class="updateNotesLayout"><div class="card updateEditor"><h3>Yeni Güncelleme Notu Ekle</h3><p class="muted">Bu alan sadece yönetim panelinde görünür. Kullanıcı ana sayfasında güncelleme notu gösterilmez.</p>${active?'<span class="pill green">Editör aktif</span>':'<span class="pill banned">Editör pasif</span>'}<form id="updateNoteForm" class="stackForm"><label class="field">Sürüm<input name="version" placeholder="Örn: v2.1.4.3" required></label><label class="field">Başlık<input name="title" placeholder="Kısa güncelleme başlığı" required></label><label class="field">Kısa Özet<textarea name="summary" placeholder="Kullanıcılara gösterilecek kısa özet"></textarea></label><label class="field">Resimli Not / Kapak URL<input name="image" placeholder="https://... veya previews/...png"></label><label class="field">Yazılı Not<textarea name="written" placeholder="Detaylı yazılı güncelleme notu"></textarea></label><div class="rowActions"><button class="btn" type="button" data-action="download-notes">Yazılı Notları İndir</button><button class="btn primary" type="submit">Notu Ekle</button></div></form>${!active?'<button class="btn" data-feature-apply="update_notes_editor">Güncelleme Notu Editörünü Siteye Uygula</button>':''}</div><div class="card updateArchive"><h3>Güncelleme Notları Arşivi</h3><p class="muted">Tüm sürümler hem resimli hem yazılı olarak ZIP içinde ve panelde tutulur.</p><div class="updateList">${list}</div></div></section>`;
}
function modal(){
  if(state.pendingFeature){
    const f = state.pendingFeature;
    const suggestions = (f.suggestions || []).filter(s => s.key !== f.key).slice(0,3);
    return html`<div class="modalOverlay"><div class="modal confirmModal"><button class="close" type="button" data-action="cancel-feature-confirm">×</button><span class="eyebrow">Akıllı özellik eşleştirme</span><h2>Bunu mu uygulamamı istiyorsunuz?</h2><p><b>${esc(f.title)}</b></p><p>${esc(f.description || 'Bu özellik plan listesine eklenip siteye uygulanacak.')}</p><div class="note"><b>Hedef:</b> ${esc(f.target || 'Özellik Planı')}<br><b>Eşleşme:</b> ${f.matched ? 'Hazır modül bulundu' : 'Özel istek olarak kaydedilecek'}<br><b>Özellik anahtarı:</b> ${esc(f.key)}</div>${suggestions.length ? `<div class="suggestBox"><b>Bunu mu demek istediniz?</b>${suggestions.map(s=>`<button class="miniBtn" data-feature-apply="${esc(s.key)}" data-feature-title="${esc(s.title)}">${esc(s.title)}</button>`).join('')}</div>` : '<div class="suggestBox"><b>Öneriler:</b><span>Siteye uygula</span><span>Düzenle</span><span>Önerilere ekle</span></div>'}<div class="rowActions"><button class="btn primary" data-action="confirm-feature-apply">Evet, Siteye Uygula</button><button class="btn" data-action="confirm-feature-apply-refresh">Uygula + Siteyi Yenile</button><button class="btn" data-action="edit-pending-feature">Düzenle</button><button class="btn danger" data-action="cancel-feature-confirm">Sil / Vazgeç</button></div></div></div>`;
  }
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
  document.querySelectorAll('[data-feature-edit]').forEach(el=>el.addEventListener('click', onFeatureEdit));
  document.querySelectorAll('[data-feature-delete]').forEach(el=>el.addEventListener('click', onFeatureDelete));
  document.querySelectorAll('[data-game-edit]').forEach(el=>el.addEventListener('click', onGameEdit));
  document.querySelectorAll('[data-game-delete]').forEach(el=>el.addEventListener('click', onGameDelete));
  const idea = $('#featureIdeaForm'); if(idea) idea.addEventListener('submit', onFeatureIdeaSubmit);
  const auth = $('#authForm'); if(auth) auth.addEventListener('submit', onAuthSubmit);
  const profile = $('#profileForm'); if(profile) profile.addEventListener('submit', onProfileSubmit);
  const note = $('#adminNoteForm'); if(note) note.addEventListener('submit', onAdminNoteSubmit);
  const game = $('#gameAddForm'); if(game) game.addEventListener('submit', onGameAddSubmit);
  const updateNoteForm = $('#updateNoteForm'); if(updateNoteForm) updateNoteForm.addEventListener('submit', onUpdateNoteSubmit);
}
async function onUpdateNoteSubmit(e){
  e.preventDefault();
  const fd = new FormData(e.currentTarget);
  const note = {
    version:String(fd.get('version') || '').trim(),
    title:String(fd.get('title') || '').trim(),
    summary:String(fd.get('summary') || '').trim(),
    image:String(fd.get('image') || '').trim() || 'previews/hayatimiz-oyun-v2144-update-notes-preview.png',
    written:String(fd.get('written') || '').trim()
  };
  const line = `${note.version}: ${note.title} - ${note.summary || note.written}`;
  state.updates.unshift(line);
  try{ await api('update-note-add', { adminToken: state.session?.adminToken, ...note }); setToast('Güncelleme notu Supabase tablosuna eklendi.'); }
  catch(err){ setToast('Not panelde eklendi; Supabase kaydı başarısız: ' + err.message); }
  render();
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
  if(action === 'auto-cover-fetch'){ autoCoverFetch(); }
  if(action === 'auto-game-meta'){ autoGameMetaFill(); }
  if(action === 'edit-pending-feature'){ if(state.pendingFeature){ const v = prompt('Özellik adını düzenle', state.pendingFeature.title); if(v){ state.pendingFeature.title = v; state.pendingFeature.originalText = v; rememberPendingFeature(state.pendingFeature); setToast('Özellik taslağı güncellendi.'); } render(); } }
  if(action === 'cancel-feature-confirm'){ rememberPendingFeature(null); render(); }
  if(action === 'confirm-feature-apply'){ const pending = state.pendingFeature; rememberPendingFeature(null); if(pending) await applyFeatureObject(pending); }
  if(action === 'confirm-feature-apply-refresh'){ const pending = state.pendingFeature; rememberPendingFeature(null); if(pending){ await applyFeatureObject(pending); await loadRuntime(); setToast('Özellik uygulandı, site verileri yenilendi. Oturum korunuyor.'); } }
  if(action === 'clear-active-features'){ await clearActiveFeatures(); }
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
  if(!featureEnabled('game_edit_delete_buttons')) return setToast('Önce Oyunları düzenle ve sil butonlarını aktif et özelliğini uygula.');
  const id = e.currentTarget.dataset.gameEdit;
  const current = state.games.find(g => String(g.id) === String(id));
  if(!current) return setToast('Oyun bulunamadı.');
  const title = prompt('Oyun adı', current.title || ''); if(title === null) return;
  const genre = prompt('Kategori / Tür', current.genre || 'Genel'); if(genre === null) return;
  const status = prompt('Durum', current.status || 'Devam Ediyor'); if(status === null) return;
  const epsRaw = prompt('Bölüm sayısı', String(current.eps ?? 0)); if(epsRaw === null) return;
  const scoreRaw = prompt('Puan', String(current.score ?? 0)); if(scoreRaw === null) return;
  const cover = prompt('Kapak URL', current.cover || ''); if(cover === null) return;
  const patch = { title:title.trim(), genre:genre.trim(), status:status.trim(), eps:Number(epsRaw || 0), score:Number(scoreRaw || 0), cover:cover.trim() };
  state.games = state.games.map(g => String(g.id) === String(id) ? { ...g, ...patch } : g);
  render();
  try{ const data = await api('games-update', { adminToken: state.session?.adminToken, gameId:id, game:patch }); if(data.game) state.games = state.games.map(g => String(g.id) === String(id) ? mapGame(data.game) : g); setToast('Oyun güncellendi.'); }
  catch(err){ setToast('Oyun local güncellendi; Supabase güncelleme başarısız: ' + err.message); }
  render();
}
async function onGameDelete(e){
  e.preventDefault();
  if(!featureEnabled('game_edit_delete_buttons')) return setToast('Önce Oyunları düzenle ve sil butonlarını aktif et özelliğini uygula.');
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
  const item = state.planner.find(p=> (p.featureKey || slugifyFeature(p.text)) === key);
  const feature = FEATURE_CATALOG.find(f=>f.key===key) || featureFromPlannerItem(item);
  const title = prompt('Özellik adını düzenle', feature?.title || item?.text || key);
  if(!title) return;
  if(item){ item.text = title; item.featureKey = key; }
  if(state.pendingFeature?.key === key){ state.pendingFeature.title = title; rememberPendingFeature(state.pendingFeature); }
  setToast('Özellik adı güncellendi. İstersen Siteye Uygula ile aktif edebilirsin.');
  render();
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
function guessGameMeta(title){
  const t = String(title || '').toLowerCase();
  const map = [
    [/resident|silent hill|alan wake|outlast|evil|dead space/, ['Korku / Aksiyon', 'korku, gerilim, hayatta kalma', 'https://images.unsplash.com/photo-1500673922987-e212871fec22?q=80&w=900&auto=format&fit=crop']],
    [/red dead|gta|mafia|watch dogs/, ['Açık Dünya / Aksiyon', 'açık dünya, hikaye, aksiyon', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=900&auto=format&fit=crop']],
    [/god of war|elden ring|dark souls|sekiro|witcher/, ['Aksiyon / RPG', 'rpg, aksiyon, boss, hikaye', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=900&auto=format&fit=crop']],
    [/assassin|tomb raider|uncharted/, ['Macera / Aksiyon', 'macera, keşif, hikaye', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=900&auto=format&fit=crop']],
    [/cyberpunk|mass effect|starfield|halo/, ['Bilim Kurgu / RPG', 'bilim kurgu, rpg, aksiyon', 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=900&auto=format&fit=crop']]
  ];
  const found = map.find(([r])=>r.test(t));
  return found ? found[1] : ['Genel / Hikaye', 'oyun, seri, bölüm', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=900&auto=format&fit=crop'];
}
function autoGameMetaFill(){
  const form = document.getElementById('gameAddForm');
  if(!form) return setToast('Oyun ekleme formu açık değil.');
  const title = form.elements.title?.value || '';
  if(!title.trim()) return setToast('Önce oyun adını yaz.');
  const [genre,tags,cover] = guessGameMeta(title);
  if(form.elements.genre) form.elements.genre.value = genre;
  if(form.elements.tags) form.elements.tags.value = tags;
  if(form.elements.cover && !form.elements.cover.value) form.elements.cover.value = cover;
  setToast('Oyun adı üzerinden tür, etiket ve kapak önerisi dolduruldu.');
}

async function onFeatureIdeaSubmit(e){
  e.preventDefault();
  const fd = new FormData(e.currentTarget);
  const text = String(fd.get('featureText') || '').trim();
  if(!text) return setToast('Özellik yazısı boş olamaz.');
  const draft = proposeFeatureFromText(text);
  rememberPendingFeature(draft);
  e.currentTarget.reset();
  setToast(draft.matched ? 'Öneri bulundu. Onay penceresi açıldı.' : 'Özel özellik taslağı hazırlandı. Onay penceresi açıldı.');
  render();
}
async function onApplyFeature(e){
  e.preventDefault();
  const key = e.currentTarget.dataset.featureApply;
  const title = e.currentTarget.dataset.featureTitle || '';
  const feature = FEATURE_CATALOG.find(f => f.key === key) || proposeFeatureFromText(title || key);
  if(!feature) return setToast('Özellik bulunamadı.');
  rememberPendingFeature(feature);
  setToast('Özellik onaya hazır.');
  render();
}
async function applyFeatureObject(feature){
  if(!isOwner()) return setToast('Siteye uygulama için kurucu veya yönetici yetkisi gerekir.');
  const key = feature.key;
  state.features[key] = true;
  persistFeatures();
  let plannerItem = state.planner.find(p => (p.featureKey === key) || p.text === feature.title || p.text === feature.originalText || slugifyFeature(p.text) === key);
  if(plannerItem){ plannerItem.status = 'tamam'; plannerItem.featureKey = key; }
  else state.planner.push({ id:'local-'+Date.now(), group:feature.group || 'Adminin Önerileri', text:feature.title, status:'tamam', featureKey:key });
  if(feature.next && !state.planner.some(p => p.text === feature.next)) state.planner.push({ id:'local-'+(Date.now()+1), group:feature.group || 'Adminin Önerileri', text:feature.next, status:'plan' });
  const page = targetAdminPage(feature);
  if(page === 'Oyunlar') { state.adminPage = 'Oyunlar'; if(key === 'admin_games_add_button') state.showGameForm = false; }
  render();
  try{
    await api('feature-apply', { adminToken: state.session?.adminToken, key, title:feature.title, group:feature.group, target:feature.target, description:feature.description, next:feature.next, matched:feature.matched !== false });
    await loadPlanner(false);
    setToast(`${feature.title} siteye uygulandı.`);
  }catch(err){ setToast(`${feature.title} local aktif edildi; Supabase kaydı başarısız: ${err.message}`); }
}
function autoCoverFetch(){
  if(!featureEnabled('auto_cover_fetch')) return setToast('Önce Otomatik kapak resmi çekme özelliğini Siteye Uygula.');
  const covers = [
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1500673922987-e212871fec22?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=900&auto=format&fit=crop'
  ];
  let changed = 0;
  state.games = state.games.map((g,i)=>{ if(g.cover) return g; changed += 1; return { ...g, cover:covers[i % covers.length] }; });
  render();
  setToast(changed ? `${changed} oyun için kapak atandı.` : 'Kapaksız oyun bulunmadı.');
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
    cover:String(fd.get('cover') || '').trim(),
    tags:String(fd.get('tags') || '').trim()
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
