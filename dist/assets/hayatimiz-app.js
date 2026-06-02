const VERSION = 'v2.1.2';
const FIX_NAME = 'v2.1.2 FIX - Üst Menü, Ana Sayfa Hata ve Profesyonel Yönetim Düzeltmesi';
const ADMIN_EMAILS = ['mertdundaroyunda@gmail.com','mertdundar05@outlook.com'];
const STORAGE = {
  games: 'hayatimiz_games_v204_canonical',
  gamesInitialized: 'hayatimiz_games_v204_initialized',
  events: 'hayatimiz_events_v204_canonical',
  notes: 'hayatimiz_update_notes_v204_canonical',
  maintenance: 'hayatimiz_maintenance_v204_canonical',
  users: 'hayatimiz_auth_users_v204',
  session: 'hayatimiz_auth_session_v204',
  maintenanceFix: 'hayatimiz_maintenance_fix_applied_v204',
  episodes: 'hayatimiz_game_episodes_v208_canonical',
  supabaseSync: 'hayatimiz_supabase_sync_v211',
  lastRemoteSync: 'hayatimiz_supabase_last_sync_v212',
  watchSettings: 'hayatimiz_watch_quality_settings_v211_fix' 
};
const GAME_KEYS = [STORAGE.games,'hayatimiz_games_cache_stable_v31','hayatimiz_games_cache_stable_v30','hayatimiz_games_cache_stable_v24','hayatimiz_games_cache_stable','hayatimiz_games_v2'];
const EVENTS_KEYS = [STORAGE.events,'hayatimiz_v202_calendar_events','hayatimiz_v254_fix2_calendar_events','hayatimiz_calendar_events_stable_v253f4'];
const NOTES_KEYS = [STORAGE.notes,'hayatimiz_update_notes_local_v204','hayatimiz_update_notes_local_v203','hayatimiz_update_notes_local_v202','hayatimiz_update_notes_local_v254f8','hayatimiz_update_notes_local_v251','hayatimiz_update_notes_local'];
const MAINTENANCE_KEYS = [STORAGE.maintenance,'hayatimiz_maintenance_cache_stable','hayatimiz_v254_maintenance','hayatimiz_site_runtime_config_maintenance'];

const DEFAULT_GAMES = [
  {id:'alan-wake-remastered',title:'Alan Wake Remastered',status:'Devam Eden',genre:'Korku',seriesName:'Alan Wake',cover:'/assets/alan-wake-night-springs.png',releaseDate:'2010',description:'Korku ve hikaye odaklı yayın arşivi. Bölüm bölüm takip için hazır kart yapısı.',episodeCount:8,tags:'Türkçe Altyazılı, Hikaye, Korku'},
  {id:'assassins-creed-directors-cut',title:'Assassin’s Creed Director’s Cut',status:'Tamamlanan',genre:'Aksiyon',seriesName:'Assassin’s Creed',cover:'/assets/assassins-creed-directors-cut.png',releaseDate:'2008',description:'Tamamlanan seri arşivi, bölüm sayısı ve koleksiyon görünümü için örnek kayıt.',episodeCount:14,tags:'Türkçe, Seri, Tarihi'},
  {id:'hayatimiz-oyun-arsiv',title:'Hayatımız Oyun Arşivi',status:'Yakında',genre:'YouTube Arşivi',seriesName:'Genel Arşiv',cover:'/assets/hayatimiz-kapak.png',releaseDate:'2026',description:'YouTube oynatma listesi, bölüm ve oyun koleksiyonu merkezi.',episodeCount:0,tags:'Arşiv, Plan, YouTube'},
  {id:'a-plague-tale-innocence',title:'A Plague Tale: Innocence',status:'Planlandı',genre:'Macera',seriesName:'A Plague Tale',cover:'/assets/hayatimiz-kapak.png',releaseDate:'2019',description:'Hikaye odaklı seri için gelecek yayın planı ve kart/filtre örneği.',episodeCount:0,tags:'Türkçe Altyazılı, Hikaye, Macera'},
  {id:'control-ultimate-edition',title:'Control Ultimate Edition',status:'Ara Verildi',genre:'Aksiyon',seriesName:'Remedy Evreni',cover:'/assets/hayatimiz-kapak.png',releaseDate:'2019',description:'Ara verilen seriler için durum rozeti ve koleksiyon sayacı örneği.',episodeCount:5,tags:'Aksiyon, Bilim Kurgu, Seri'}
];
const DEFAULT_NOTES = [
  {id:"fix-v212-ust-menu-ana-sayfa-hata-yonetim-ui",version:"v2.1.2 FIX",title:"🧭 Üst Menü, Ana Sayfa Hata ve Profesyonel Yönetim Paneli Fix",summary:"Yeni sürüm yapılmadan sol menü tamamen kaldırıldı; tüm site bağlantıları üst bara taşındı. Ana sayfadaki yerel depolama kota hatası güvenli kayıt sistemiyle düzeltildi. Yönetim paneli daha profesyonel yönetim merkezi görünümüne alındı.",status:"Tamamlandı"},
  {id:"fix-v212-bakim-kullanici-yonetim-menu",version:"v2.1.2 FIX",title:"🛠️ Bakım Kapatma, Kullanıcı Yetki Listesi ve Yönetim Menü Fix",summary:"Yeni sürüm yapılmadan bakım modu kapalıyken ziyaretçiye bakım ekranı göstermeme sorunu düzeltildi. Kayıt olan kullanıcılar Kullanıcılar ve Yetkiler ekranında görünür hale getirildi. Sol menüde sadece Yönetim Paneli bırakıldı; yönetim içeriği panele tıklayınca açılır.",status:"Tamamlandı"},
  {id:"fix-v212-planlananlar-15-adim-sabitleme",version:"v2.1.2 FIX",title:"📌 Planlananlar 15 Adım Sabitleme Fix",summary:"Yeni sürüm yapılmadan PLANLANANLAR klasörü tam 15 dolu plana tamamlandı. Her planın içine amaç, yapılacaklar, kontrol adımları ve schema durumu eklendi. Bundan sonra plan klasörü boş kalmayacak; tamamlanan her planın yerine yeni plan eklenecek.",status:"Tamamlandı"},
  {id:"fix-v212-profesyonel-menu-bakim-ui",version:"v2.1.2 FIX",title:"✨ Profesyonel Menü ve Bakım Modu Tasarım Fix",summary:"Yeni sürüm yapılmadan sol menü, üst bar, yönetim ayrımı ve bakım modu ziyaretçi ekranı profesyonel hale getirildi. Bakım kapatma/açma davranışı güçlendirildi. Schema gerekli değildir.",status:"Tamamlandı"},
  {id:"v212-public-yayin-oncesi-stabilite",version:"v2.1.2",title:"🚀 Public Yayın Öncesi Stabilite",summary:"Ana sayfa, oyun arşivi, seriler, koleksiyonlar, siteden izleme, rehberler, bakım modu ve boş ekran koruması yayın öncesi kontrol edildi. /status site durum sayfası eklendi.",status:"Tamamlandı"},
  {id:"plan-v213",version:"v2.1.3",title:"🛠️ Supabase Veri Fix ve Admin Güçlendirme",summary:"Supabase kayıt, yenileme, admin kullanıcı kayıtları ve yetki denetimlerini stabil hale getirmek. Supabase oyun ekle/düzenle/sil işlemleri tek veri mantığına bağlanacak.",status:"Planlandı"},
  {id:"plan-v214",version:"v2.1.4",title:"🏠 Profesyonel Ana Sayfa Final Cila",summary:"Ana sayfayı yayıncı/video arşivi havasına daha yakın, premium ve okunabilir hale getirmek. Hero, arama, öne çıkan seri, son eklenenler ve hızlı erişimler daha düzenli yerleşecek.",status:"Planlandı"},
  {id:"plan-v215",version:"v2.1.5",title:"▶️ Oyun Detay ve Siteden İzleme Geliştirme",summary:"Oyun detay sayfası ve siteden izleme ekranını daha profesyonel ve kullanışlı hale getirmek. Oyun detayında kapak, banner, hikaye, bölüm ilerlemesi ve oynatma bağlantıları düzenlenecek.",status:"Planlandı"},
  {id:"plan-v216",version:"v2.1.6",title:"🎬 Seri Yönetimi Gelişmiş Sıralama",summary:"Seri içindeki oyunları seçme, sıralama ve tüm seriyi izleme akışını daha güçlü hale getirmek. Seri düzenleme ekranında oyun seçme/çıkarma daha anlaşılır olacak.",status:"Planlandı"},
  {id:"plan-v217",version:"v2.1.7",title:"👤 Kullanıcı Profili ve İzleme Geçmişi",summary:"Üye profilini, izleme ilerlemesini ve kişisel arşiv deneyimini geliştirmek. Profil sayfasında kullanıcı adı, rol, kayıt tarihi ve izleme özeti gösterilecek.",status:"Planlandı"},
  {id:"plan-v218",version:"v2.1.8",title:"👑 Yetki Paneli ve Kullanıcı Yönetimi",summary:"Kurucu, moderatör, içerik editörü, üye ve banlı rollerini net yönetilebilir hale getirmek. Kayıtlı kullanıcıları görme ekranı daha okunabilir tabloya alınacak.",status:"Planlandı"},
  {id:"plan-v219",version:"v2.1.9",title:"🚧 Bakım Modu, Duyuru ve Bildirim Sistemi",summary:"Bakım modu ekranını, duyuruları ve ziyaretçi bilgilendirme akışını profesyonelleştirmek. Bakım modu aç/kapat işlemi Supabase değerini yanlışlıkla tersine çevirmeyecek.",status:"Planlandı"},
  {id:"plan-v220",version:"v2.2.0",title:"🗄️ Supabase Veri Sağlığı ve Yedek Planı",summary:"Canlı veri kaybı riskini azaltmak ve admin için veri kontrol araçları eklemek. Veri sağlık kontrol paneli eklenecek.",status:"Planlandı"},
  {id:"plan-v221",version:"v2.2.1",title:"🎮 RAWG / Steam / YouTube API Dayanıklılık",summary:"Harici API hatalarında sitenin bozulmamasını ve formların düzgün çalışmasını sağlamak. RAWG arama sonucunda kapak, tür, tarih ve açıklama daha güvenli doldurulacak.",status:"Planlandı"},
  {id:"plan-v222",version:"v2.2.2",title:"📱 Mobil, PWA ve Performans İyileştirme",summary:"Telefon, tablet ve masaüstünde arayüzü daha hızlı ve düzgün çalışır hale getirmek. Mobil menü ve üst bar taşmaları düzeltilecek.",status:"Planlandı"},
  {id:"plan-v223",version:"v2.2.3",title:"🔎 Arama, Filtre ve Alfabetik Sıralama Geliştirme",summary:"Arama ve sıralamayı hem oyunlar hem seriler içinde daha güçlü hale getirmek. A-Z, Z-A ve 0-9 grupları oyun arşivi içinde korunacak.",status:"Planlandı"},
  {id:"plan-v224",version:"v2.2.4",title:"📘 Site Rehberi ve Yardım Merkezi Geliştirme",summary:"Siteyi ilk kez giren kullanıcıya ve yetkili ekibe anlaşılır rehber sunmak. Site Rehberi daha adım adım anlatımlı hale getirilecek.",status:"Planlandı"},
  {id:"plan-v225",version:"v2.2.5",title:"📊 Admin Dashboard İstatistikleri",summary:"Yönetim panelinde arşivin genel durumunu daha güçlü göstermek. Toplam oyun, seri, bölüm, kullanıcı ve güncelleme notu metrikleri güçlendirilecek.",status:"Planlandı"},
  {id:"plan-v226",version:"v2.2.6",title:"🌐 SEO, Sitemap ve Paylaşım Görselleri",summary:"Public yayın öncesi arama motoru ve paylaşım görünümünü güçlendirmek. Sayfa başlıkları ve açıklamaları Türkçe ve temiz hale getirilecek.",status:"Planlandı"},
  {id:"plan-v227",version:"v2.2.7",title:"✅ Yayın Öncesi Genel Stabilite",summary:"Büyük yayın öncesi tüm sayfaları, yönetim akışını ve public kullanıcı deneyimini kontrol etmek. Ana sayfa, oyun arşivi, seriler, koleksiyonlar, izleme, rehberler ve status sayfası test edilecek.",status:"Planlandı"},
  {id:"fix-v211-rehber-yetkili-alfabetik-entegre",version:"v2.1.1 FIX",title:"📘 Site Rehberi, 👑 Yetkili Rehberi ve 🔤 Entegre Alfabetik Sıralama Fix",summary:"Yeni sürüm yapılmadan site rehberi ve yetkili rehberi eklendi. Yetki rollerinin ne anlama geldiği Türkçe ve emojili anlatıldı. Alfabetik sıralama ayrı bölüm olmaktan çıkarılıp oyun arşivi ve seriler içine taşındı.",status:"Tamamlandı"},
  {id:"fix-v211-seri-izleme-siralama-supabase",version:"v2.1.1 FIX",title:"Seri İzleme, Seri Yönetimi ve Supabase Kayıt Fix",summary:"Yeni sürüm yapılmadan Tüm Seriyi İzle, seri içindeki oyunları seçme, seri adını düzenleme, sürükle-bırak ve sayı ile sıralama, Supabase kalıcı seri kayıt akışı eklendi. Schema sıfırlanmadı; mevcut games alanları kullanıldı.",status:"Tamamlandı"},
  {id:"fix-v211-izleme-kalite-alfabetik-yetki-bakim",version:"v2.1.1 FIX",title:"Site İçi İzleme, Kalite, Alfabetik Sıralama, Yetki ve Bakım Fix",summary:"Yeni sürüm yapılmadan site içinden izleme sayfası, kalite tercihi paneli, A/B/0-9 alfabetik sıralama, profesyonel hikaye oluşturma, kayıtlı kullanıcıları görme ve yetki verme ekranı eklendi. Bakım modunda Supabase yenileme kapalı değeri zorla basmayacak şekilde düzeltildi.",status:"Tamamlandı"},
  {id:"fix-v211-profesyonel-arayuz-turkce",version:"v2.1.1 FIX",title:"Profesyonel Arayüz ve Türkçe Menü Fix",summary:"Yönetim butonları solda bırakıldı; profil, çıkış yap, giriş yap ve kayıt ol işlemleri sağ üst alana taşındı. Kurucu, Moderatör, İçerik Editörü ve Üye rol adları Türkçeleştirildi. Yeni sürüm yapılmadı.",status:"Tamamlandı"},
  {id:"v211-takvim-notlar-bakim",version:"v2.1.1",title:"Takvim, Güncelleme Notları ve Bakım Modu",summary:"Yayın takvimi, güncelleme notları ve bakım modu Supabase kalıcı veri bağlantısına kontrollü şekilde taşındı. Servis veya ortam ayarı hata verirse yerel güvenli mod korunur; yetkili geçişi ve ziyaretçi bakım ekranı bozulmaz.",status:"Tamamlandı"},
  {id:"v210-supabase-kalici-veri",version:"v2.1.0",title:"Supabase Kalıcı Veri Geri Dönüş",summary:"Yerel stabil sistem bozulmadan Supabase kalıcı veri bağlantısı geri eklendi. Oyun listeleme, ekleme, düzenleme, silme ve toplu silme işlemleri servis üzerinden Supabase ile senkron çalışır; servis veya ortam ayarı hata verirse site yerel güvenli moda düşer.",status:"Tamamlandı"},
  {id:"v209-koleksiyon-seri-durum",version:"v2.0.9",title:"Koleksiyon, Seri, Durum ve Sayaçlar",summary:"Koleksiyonlar, seri grupları, durum sayaçları ve arşiv istatistikleri aynı veri kaynağından beslenen stabil yapıya alındı.",status:"Tamamlandı"},
  {id:"v208-youtube-playlist-bolum",version:"v2.0.8",title:"YouTube Oynatma Listesi ve Bölüm Takibi",summary:"YouTube oynatma listesi otomasyonu, bölüm listesi ve kaldığımız bölüm takibi kontrollü şekilde geri eklendi.",status:"Tamamlandı"},
  {id:"v207-rawg-steam-kapak-meta",version:"v2.0.7",title:"RAWG / Steam / Kapak / Bilgi Geri Dönüş",summary:"RAWG / Steam bilgi paneli oyun ekle ve düzenle formuna kontrollü şekilde geri eklendi.",status:"Tamamlandı"},
  {id:"v206-oyun-ekle-duzenle-formu",version:"v2.0.6",title:"Oyun Ekle / Düzenle Formu",summary:"Oyun ekleme ve düzenleme formu profesyonel kartlı yapıya alındı.",status:"Tamamlandı"}
];

function $(sel, root=document){ return root.querySelector(sel); }
function esc(v){ return String(v ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
function readJson(key, fallback){ try{ const raw=localStorage.getItem(key); return raw === null ? fallback : JSON.parse(raw); }catch{ return fallback; } }
function compactForStorage(value){
  if(!Array.isArray(value)) return value;
  return value.slice(0,60).map(item=>{
    if(!item || typeof item!=='object') return item;
    const out={...item};
    for(const key of ['summary','description','note','storyText','story_text','message']){
      if(typeof out[key] === 'string' && out[key].length > 450) out[key] = out[key].slice(0,450) + '...';
    }
    return out;
  });
}
function writeJson(key, value){
  try{ localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch(err){
    console.warn('Yerel depolama dolu, kompakt kayıt deneniyor:', key, err && err.message ? err.message : err);
    try{ localStorage.setItem(key, JSON.stringify(compactForStorage(value))); return true; }
    catch(err2){
      console.warn('Kompakt kayıt da başarısız, eski anahtar temizlendi:', key, err2 && err2.message ? err2.message : err2);
      try{ localStorage.removeItem(key); }catch{}
      return false;
    }
  }
}
function keyExists(key){ return localStorage.getItem(key) !== null; }
function firstStoredArray(keys){
  for(const key of keys){
    if(keyExists(key)){
      const val = readJson(key, null);
      if(Array.isArray(val)) return val;
    }
  }
  return null;
}
function slugify(v){ return String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || ('item-'+Date.now()); }
function normalizeGame(g,i){
  const title = g.title || g.name || g.game_title || `Oyun ${i+1}`;
  const episodeCount = Math.max(0, Number(g.episodeCount || g.episode_count || g.totalEpisodes || 0));
  const watchedEpisodeCount = Math.max(0, Math.min(episodeCount || 9999, Number(g.watchedEpisodeCount || g.watched_episode_count || 0)));
  return {
    id: g.id || g.slug || slugify(title),
    title,
    status: g.status || g.progress_status || g.state || 'Devam Eden',
    genre: g.genre || g.category || (Array.isArray(g.genres)?g.genres[0]:'Arşiv'),
    tags: Array.isArray(g.tags) ? g.tags.join(', ') : (g.tags || ''),
    seriesName: g.seriesName || g.series_name || g.series || '',
    cover: g.cover || g.coverUrl || g.cover_url || g.image || g.image_url || g.background_image || '/assets/hayatimiz-kapak.png',
    banner: g.banner || g.bannerUrl || g.banner_url || g.background || g.background_image || '',
    releaseDate: g.releaseDate || g.release_date || g.released || '',
    platforms: Array.isArray(g.platforms) ? g.platforms.join(', ') : (g.platforms || g.platform || ''),
    description: g.description || g.summary || 'Açıklama eklenmedi.',
    storyText: g.storyText || g.story_text || g.story || g.hikaye || '',
    youtubePlaylistUrl: g.youtubePlaylistUrl || g.youtube_playlist_url || g.playlistUrl || g.playlist_url || '',
    youtubePlaylistId: g.youtubePlaylistId || g.youtube_playlist_id || extractYoutubePlaylistId(g.youtubePlaylistUrl || g.youtube_playlist_url || g.playlistUrl || g.playlist_url || ''),
    episodeSyncSource: g.episodeSyncSource || g.episode_sync_source || '',
    episodeSyncedAt: g.episodeSyncedAt || g.episode_synced_at || '',
    rawgId: g.rawgId || g.rawg_id || '',
    rawgSlug: g.rawgSlug || g.rawg_slug || g.slug || '',
    steamAppId: g.steamAppId || g.steam_app_id || '',
    score: Number(g.score || g.rating || 0),
    metaSource: g.metaSource || g.meta_source || '',
    metaCheckedAt: g.metaCheckedAt || g.meta_checked_at || '',
    coverSource: g.coverSource || g.cover_source || '',
    episodeCount,
    watchedEpisodeCount,
    collectionName: g.collectionName || g.collection_name || g.collection || '',
    seriesOrder: Number(g.seriesOrder ?? g.series_order ?? g.sortOrder ?? g.sort_order ?? i ?? 0),
    sortOrder: Number(g.sortOrder ?? g.sort_order ?? g.seriesOrder ?? g.series_order ?? i ?? 0),
    statusBucket: g.statusBucket || g.status_bucket || statusBucket(g.status || 'Devam Eden'),
    isFeatured: g.isFeatured === true || g.is_featured === true || g.featured === true
  };
}

const LOCAL_META_CATALOG = [
  {rx:/007|first\s*light|james\s*bond/i,title:'007 First Light',seriesName:'James Bond',genre:'Aksiyon, Gizlilik, Macera',releaseDate:'2026-03-27',platforms:'PC, PlayStation 5, Xbox Series S/X, Nintendo Switch',tags:'Türkçe Altyazılı, Sinematik, Aksiyon',score:0,steamAppId:'',rawgSlug:'007-first-light',cover:'/assets/hayatimiz-kapak.png',banner:'/assets/hayatimiz-kapak.png',description:`James Bond'un MI6 içindeki ilk büyük operasyonunu, gizli yapılanmalar ve yüksek riskli ajanlık görevleri üzerinden takip eden sinematik aksiyon arşivi.`,storyText:`Görevin henüz başında, çiçeği burnunda bir ajan olan James Bond, MI6 tarafından küresel dengeleri tehdit eden gizli bir yapılanmayı çökertmekle görevlendirilir. First Light operasyonu, Bond'un sadece fiziksel sınırlarını değil, aynı zamanda bir ajan olarak ahlaki sınırlarını ve sadakatini de ilk kez ciddi şekilde test edeceği bir vaftiz törenine dönüşür.`},
  {rx:/plague.*innocence|innocence/i,title:'A Plague Tale: Innocence',seriesName:'A Plague Tale',genre:'Macera, Gizlilik, Hikaye',releaseDate:'2019-05-14',platforms:'PC, PlayStation, Xbox, Nintendo Switch',tags:'Türkçe Altyazılı, Hikaye, Macera',score:8.3,steamAppId:'752590',rawgSlug:'a-plague-tale-innocence',cover:'https://cdn.akamai.steamstatic.com/steam/apps/752590/header.jpg',banner:'https://cdn.akamai.steamstatic.com/steam/apps/752590/capsule_616x353.jpg'},
  {rx:/alan\s*wake/i,title:'Alan Wake Remastered',seriesName:'Alan Wake',genre:'Korku, Gerilim, Hikaye',releaseDate:'2021-10-05',platforms:'PC, PlayStation, Xbox, Nintendo Switch',tags:'Türkçe Altyazılı, Korku, Hikaye',score:8.0,steamAppId:'108710',rawgSlug:'alan-wake-remastered',cover:'https://cdn.akamai.steamstatic.com/steam/apps/108710/header.jpg',banner:'https://cdn.akamai.steamstatic.com/steam/apps/108710/capsule_616x353.jpg'},
  {rx:/cyberpunk\s*2077/i,title:'Cyberpunk 2077',seriesName:'Cyberpunk',genre:'Aksiyon RPG, Açık Dünya, Bilim Kurgu',releaseDate:'2020-12-10',platforms:'PC, PlayStation 5, Xbox Series S/X',tags:'Türkçe Altyazılı, RPG, Açık Dünya',score:9.1,steamAppId:'1091500',rawgSlug:'cyberpunk-2077',cover:'https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg',banner:'https://cdn.akamai.steamstatic.com/steam/apps/1091500/capsule_616x353.jpg'},
  {rx:/witcher\s*3|wild\s*hunt/i,title:'The Witcher 3: Wild Hunt',seriesName:'The Witcher',genre:'RPG, Açık Dünya, Fantastik',releaseDate:'2015-05-19',platforms:'PC, PlayStation, Xbox, Nintendo Switch',tags:'Türkçe Altyazılı, RPG, Açık Dünya',score:9.6,steamAppId:'292030',rawgSlug:'the-witcher-3-wild-hunt',cover:'https://cdn.akamai.steamstatic.com/steam/apps/292030/header.jpg',banner:'https://cdn.akamai.steamstatic.com/steam/apps/292030/capsule_616x353.jpg'},
  {rx:/red\s*dead|rdr\s*2/i,title:'Red Dead Redemption 2',seriesName:'Red Dead',genre:'Aksiyon, Macera, Açık Dünya, Western',releaseDate:'2019-12-05',platforms:'PC, PlayStation, Xbox',tags:'Türkçe Altyazılı, Açık Dünya, Hikaye',score:9.7,steamAppId:'1174180',rawgSlug:'red-dead-redemption-2',cover:'https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg',banner:'https://cdn.akamai.steamstatic.com/steam/apps/1174180/capsule_616x353.jpg'}
];
function localGameMetaCandidate(title){
  const q=String(title||'').trim();
  if(!q) return null;
  const row=LOCAL_META_CATALOG.find(x=>x.rx.test(q));
  if(row) return {...row, source:'Yerel güvenli bilgi kataloğu'};
  const slug=slugify(q);
  return {title:q,seriesName:q.split(':')[0],genre:'Aksiyon, Macera, Hikaye',releaseDate:'',platforms:'PC, PlayStation 5, Xbox Series S/X',tags:'Türkçe Altyazılı, Hikaye',score:0,rawgSlug:slug,cover:'/assets/hayatimiz-kapak.png',banner:'/assets/hayatimiz-kapak.png',source:'Yerel güvenli varsayılan'};
}
async function apiJson(action, payload){
  const res = await fetch(`/api?action=${encodeURIComponent(action)}`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload||{})});
  const data = await res.json().catch(()=>({ok:false}));
  if(!res.ok || data.ok===false) throw new Error(data.error || data.message || 'Servis cevap vermedi.');
  return data;
}
function syncState(){ return readJson(STORAGE.supabaseSync, {mode:'local', status:'Yerel güvenli mod', message:'Supabase henüz denenmedi.', checkedAt:''}); }
function saveSyncState(v){ writeJson(STORAGE.supabaseSync, {...syncState(), ...(v||{}), checkedAt:new Date().toISOString()}); }
function sessionToken(){ const u=currentUser(); return String(u?.adminToken || u?.token || ''); }
function splitMaybeArray(v){ return Array.isArray(v) ? v : splitText(v); }
function normalizeRemoteGame(g,i=0){
  return normalizeGame({
    id:g.id, title:g.title, status:g.status || g.status_label || g.status_slug, genre:g.genre || g.genre_label || g.genre_slug,
    tags:Array.isArray(g.tags) ? g.tags.join(', ') : (g.tags || ''), seriesName:g.series_name || g.seriesName, collectionName:g.collection_name || g.collectionName,
    cover:g.cover_url || g.cover, banner:g.banner_url || g.banner, releaseDate:g.release_date || g.releaseDate,
    platforms:Array.isArray(g.platforms) ? g.platforms.join(', ') : (g.platforms || ''), description:g.description, storyText:g.story_text || g.storyText,
    youtubePlaylistUrl:g.youtube_playlist_url || g.playlist_url || g.youtubePlaylistUrl, youtubePlaylistId:g.youtube_playlist_id || g.youtubePlaylistId,
    episodeCount:g.episode_count ?? g.episodeCount, watchedEpisodeCount:g.watched_episode_count ?? g.watchedEpisodeCount,
    rawgId:g.rawg_id || g.rawgId, rawgSlug:g.rawg_slug || g.rawgSlug, steamAppId:g.steam_app_id || g.steamAppId, score:g.score,
    metaSource:g.meta_source || g.metaSource, metaCheckedAt:g.meta_checked_at || g.metaCheckedAt, coverSource:g.cover_source || g.coverSource,
    sortOrder:g.sort_order ?? g.series_order ?? i, statusBucket:g.status_bucket || g.statusBucket, isFeatured:g.is_featured === true || g.isFeatured === true
  }, i);
}
function gameToRemotePayload(g){
  const game=normalizeGame(g,0);
  return {
    id:game.id, title:game.title, status:game.status, genre:game.genre, tags:splitMaybeArray(game.tags), seriesName:game.seriesName, collectionName:collectionName(game),
    cover:game.cover, banner:game.banner, releaseDate:game.releaseDate, platforms:splitMaybeArray(game.platforms), description:game.description, storyText:game.storyText,
    youtubePlaylistUrl:game.youtubePlaylistUrl, youtubePlaylistId:game.youtubePlaylistId || extractYoutubePlaylistId(game.youtubePlaylistUrl),
    episode_count:Number(game.episodeCount||0), watched_episode_count:Number(game.watchedEpisodeCount||0),
    rawgId:game.rawgId, rawgSlug:game.rawgSlug, steamAppId:game.steamAppId, score:Number(game.score||0),
    metaSource:game.metaSource, metaCheckedAt:game.metaCheckedAt, coverSource:game.coverSource,
    sortOrder:Number(game.sortOrder||0), seriesOrder:Number(game.seriesOrder ?? game.sortOrder ?? 0), statusBucket:statusBucket(game.status), isFeatured:game.isFeatured === true
  };
}
async function refreshGamesFromSupabase({force=false}={}){
  if(window.__HAYATIMIZ_SUPABASE_SYNCING__) return;
  window.__HAYATIMIZ_SUPABASE_SYNCING__=true;
  try{
    const data=await apiJson('games-list',{});
    const remote=(Array.isArray(data.games)?data.games:[]).map(normalizeRemoteGame);
    if(remote.length){ saveGames(remote); localStorage.setItem(STORAGE.lastRemoteSync,new Date().toISOString()); }
    saveSyncState({mode:'supabase', status:remote.length?'Supabase aktif':'Supabase aktif ama oyun tablosu boş', message:data.warning || `${remote.length} oyun Supabase üzerinden okundu.`, remoteCount:remote.length, recovered:data.recovered===true});
    if(force) { toast(remote.length?'Supabase verileri yenilendi.':'Supabase bağlı ama oyun yok.'); render(); }
  }catch(err){
    saveSyncState({mode:'local', status:'Yerel güvenli mod', message:err?.message || 'Supabase bağlantısı kurulamadı.', remoteCount:0});
    if(force) { toast('Supabase bağlanamadı, yerel güvenli mod açık.'); render(); }
  }finally{ window.__HAYATIMIZ_SUPABASE_SYNCING__=false; }
}
async function persistGameToSupabase(game, editId=''){
  const token=sessionToken();
  if(!token){ saveSyncState({mode:'local', status:'Yetkili Supabase oturumu yok', message:'Oyun yerel kaydedildi. Supabase için kurucu hesabıyla tekrar giriş yap.'}); return null; }
  const action=editId?'games-update':'games-add';
  const data=await apiJson(action,{adminToken:token, gameId:editId, game:gameToRemotePayload(game)});
  if(data?.game){
    const remote=normalizeRemoteGame(data.game);
    const rows=loadGames();
    saveGames(rows.map(g=>String(g.id)===String(editId||game.id)?remote:g));
  }
  saveSyncState({mode:'supabase', status:'Supabase kayıt aktif', message:editId?'Oyun Supabase üzerinde güncellendi.':'Oyun Supabase üzerine kaydedildi.'});
  return data;
}
async function deleteGameRemote(id){ const token=sessionToken(); if(!token) return null; await apiJson('games-delete',{adminToken:token, gameId:id}); saveSyncState({mode:'supabase', status:'Supabase silme aktif', message:'Oyun Supabase üzerinden silindi.'}); }
async function clearAllGamesRemote(){ const token=sessionToken(); if(!token) return null; await apiJson('games-delete-all',{adminToken:token}); saveSyncState({mode:'supabase', status:'Supabase toplu silme aktif', message:'Supabase games tablosu boşaltıldı.'}); }

function normalizeRemoteEvent(e,i=0){
  return {
    id:e.id || `event-${Date.now()}-${i}`,
    title:e.title || 'Yayın',
    date:e.date || e.event_date || '',
    time:e.time || e.event_time || '20:00',
    type:e.type || e.event_type || 'Ana Yayın',
    gameId:e.gameId || e.game_id || '',
    gameTitle:e.gameTitle || e.game_title || '',
    episodeNumber:e.episodeNumber || e.episode_number || '',
    episodeTitle:e.episodeTitle || e.episode_title || '',
    cover:e.cover || e.cover_url || '',
    videoUrl:e.videoUrl || e.video_url || '',
    note:e.note || '',
    isActive:e.isActive !== false,
    source:e.source || 'supabase'
  };
}
function normalizeRemoteNote(n,i=0){
  const rawStatus=String(n.status || '').toLocaleLowerCase('tr');
  const status = rawStatus.includes('plan') ? 'Planlandı' : rawStatus.includes('deleted') ? 'Silindi' : (n.status==='Tamamlandı' || n.status==='Planlandı' ? n.status : 'Tamamlandı');
  return {
    id:n.id || `note-${Date.now()}-${i}`,
    version:n.version || VERSION,
    title:n.title || 'Güncelleme Notu',
    summary:n.summary || n.description || n.note || '',
    description:n.description || n.note || n.summary || '',
    status,
    pinned:n.pinned === true,
    planned:status === 'Planlandı' || n.planned === true,
    source:n.source || 'supabase'
  };
}
async function refreshSiteRuntimeFromSupabase({force=false}={}){
  try{
    const localBefore=loadMaintenance();
    const data=await apiJson('settings-get',{});
    if(data && data.maintenance){
      const remote=sanitizeMaintenance({...data.maintenance, source:'supabase'});
      const localUpdated=Date.parse(localBefore.updatedAt||0)||0;
      const remoteUpdated=Date.parse(remote.updatedAt||remote.updated_at||0)||0;
      const publicRoute=!isYönetim();
      const remoteKapali=remote.enabled !== true;
      const localAdminEdit=isYönetim() && String(localBefore.source||'')==='admin-form' && localUpdated && remoteUpdated && localUpdated > remoteUpdated + 1000;
      if(localAdminEdit && !remoteKapali){
        saveMaintenance({...localBefore, source:'local-newer-preserved'});
        saveSyncState({mode:'local', status:'Bakım modu yerel güncel kayıt korundu', message:'Yerel bakım ayarı Supabase kaydından daha yeni olduğu için üstüne yazılmadı.'});
        if(force){ toast('Yerel bakım ayarı daha güncel; Supabase eski kayıtla kapatıp/açmadı.'); render(); }
        return data;
      }
      if(publicRoute || remoteKapali || force){
        saveMaintenance({...remote, enabled:remote.enabled === true, source:'supabase', updatedAt:remote.updatedAt || remote.updated_at || new Date().toISOString()});
      }else{
        saveMaintenance(remote);
      }
    }
    saveSyncState({mode:'supabase', status:'Supabase site ayarları aktif', message:'Bakım modu Supabase runtime config üzerinden okundu.'});
    if(force){ toast('Bakım modu Supabase üzerinden yenilendi.'); render(); }
    return data;
  }catch(err){
    saveSyncState({mode:'local', status:'Bakım modu yerel güvenli modda', message:err?.message || 'Çalışma ayarı okunamadı.'});
    if(force){ toast('Bakım modu Supabase bağlanamadı, yerel güvenli mod açık.'); render(); }
    return null;
  }
}
async function refreshEventsFromSupabase({force=false}={}){
  try{
    const data=await apiJson('calendar-events-list',{});
    const rows=(Array.isArray(data.events)?data.events:[]).map(normalizeRemoteEvent);
    saveEvents(rows);
    saveSyncState({mode:'supabase', status:'Supabase takvim aktif', message:`${rows.length} yayın takvimi kaydı Supabase üzerinden okundu.`});
    if(force){ toast(rows.length?'Takvim Supabase üzerinden yenilendi.':'Takvim Supabase bağlı ama kayıt yok.'); render(); }
    return rows;
  }catch(err){
    saveSyncState({mode:'local', status:'Takvim yerel güvenli modda', message:err?.message || 'Takvim okunamadı.'});
    if(force){ toast('Takvim Supabase bağlanamadı, yerel güvenli mod açık.'); render(); }
    return loadEvents();
  }
}
async function refreshNotesFromSupabase({force=false}={}){
  try{
    const data=await apiJson('update-notes-list',{});
    const rows=(Array.isArray(data.notes)?data.notes:[]).map(normalizeRemoteNote).filter(n=>n.status!=='Silindi');
    saveNotes(mergeDefaultNotes(rows));
    saveSyncState({mode:'supabase', status:'Supabase güncelleme notları aktif', message:`${rows.length} not Supabase üzerinden okundu.`});
    if(force){ toast(rows.length?'Güncelleme notları yenilendi.':'Supabase bağlı ama not yok.'); render(); }
    return rows;
  }catch(err){
    saveSyncState({mode:'local', status:'Güncelleme notları yerel güvenli modda', message:err?.message || 'Notlar okunamadı.'});
    if(force){ toast('Güncelleme notları Supabase bağlanamadı, yerel güvenli mod açık.'); render(); }
    return loadNotes();
  }
}
async function refreshSiteDataFromSupabase({force=false}={}){
  await Promise.allSettled([
    refreshGamesFromSupabase({force:false}),
    refreshEventsFromSupabase({force:false}),
    refreshNotesFromSupabase({force:false}),
    refreshSiteRuntimeFromSupabase({force:false})
  ]);
  if(force){ toast('Supabase site verileri yenilendi.'); render(); }
}
async function persistEventToSupabase(event){
  const token=sessionToken();
  if(!token){ saveSyncState({mode:'local', status:'Takvim yerel kayıt aktif', message:'Supabase takvim kaydı için kurucu hesabıyla giriş yap.'}); return null; }
  const data=await apiJson('calendar-events-upsert',{adminToken:token,event});
  if(data?.event){
    const remote=normalizeRemoteEvent(data.event);
    const rows=loadEvents();
    const exists=rows.some(e=>String(e.id)===String(event.id));
    saveEvents(exists?rows.map(e=>String(e.id)===String(event.id)?remote:e):[remote,...rows]);
  }
  saveSyncState({mode:'supabase', status:'Supabase takvim kayıt aktif', message:'Yayın takvimi Supabase üzerinde kaydedildi.'});
  return data;
}
async function deleteEventRemote(event){
  const token=sessionToken();
  if(!token || !event?.id) return null;
  await apiJson('calendar-events-delete',{adminToken:token,id:event.id});
  saveSyncState({mode:'supabase', status:'Supabase takvim silme aktif', message:'Yayın takvimi kaydı Supabase üzerinde pasife alındı.'});
}
async function persistNoteToSupabase(note){
  const token=sessionToken();
  if(!token){ saveSyncState({mode:'local', status:'Not yerel kayıt aktif', message:'Supabase not kaydı için kurucu hesabıyla giriş yap.'}); return null; }
  const data=await apiJson('update-note-save',{adminToken:token,id:note.id,version:note.version,title:note.title,summary:note.summary,status:note.status});
  if(data?.note){
    const remote=normalizeRemoteNote(data.note);
    const rows=loadNotes();
    const exists=rows.some(n=>String(n.id)===String(note.id));
    saveNotes(exists?rows.map(n=>String(n.id)===String(note.id)?remote:n):[remote,...rows]);
  }
  saveSyncState({mode:'supabase', status:'Supabase not kayıt aktif', message:'Güncelleme notu Supabase üzerinde kaydedildi.'});
  return data;
}
async function deleteNoteRemote(note){
  const token=sessionToken();
  if(!token || !note?.id) return null;
  await apiJson('update-note-delete',{adminToken:token,id:note.id});
  saveSyncState({mode:'supabase', status:'Supabase not silme aktif', message:'Güncelleme notu Supabase üzerinde silindi.'});
}
async function persistMaintenanceToSupabase(maintenance){
  const token=sessionToken();
  const stamp=new Date().toISOString();
  const payload={...maintenance, enabled:maintenance.enabled === true, adminBypass:true, updatedAt:stamp, updated_at:stamp};
  if(!token){ saveSyncState({mode:'local', status:'Bakım yerel kayıt aktif', message:'Supabase bakım kaydı için kurucu hesabıyla giriş yap.'}); return null; }
  const data=await apiJson('maintenance-save',{adminToken:token,key:'maintenance_mode',maintenance:payload});
  if(data?.maintenance) saveMaintenance({...payload, ...data.maintenance, enabled:(data.maintenance.enabled === true), source:'supabase'});
  else saveMaintenance({...payload, source:'supabase'});
  saveSyncState({mode:'supabase', status:'Supabase bakım modu aktif', message:payload.enabled ? 'Bakım modu Supabase üzerinde açıldı.' : 'Bakım modu Supabase üzerinde kapatıldı.'});
  return data;
}
function mapMeta(raw, title){
  const m = raw?.meta || raw?.steam || raw || {};
  const local = localGameMetaCandidate(title) || {};
  const steamId = m.steamAppId || m.steam_app_id || m.appid || m.appId || local.steamAppId || '';
  return {
    title: m.title || local.title || title,
    genre: m.genre || local.genre || '',
    seriesName: m.seriesName || m.series_name || local.seriesName || '',
    releaseDate: m.releaseDate || m.release_date || m.released || local.releaseDate || '',
    platforms: Array.isArray(m.platforms) ? m.platforms.join(', ') : (m.platforms || local.platforms || ''),
    tags: Array.isArray(m.tags) ? m.tags.join(', ') : (m.tags || local.tags || ''),
    score: m.score || m.rating || local.score || 0,
    rawgId: m.rawgId || m.rawg_id || m.id || '',
    rawgSlug: m.rawgSlug || m.rawg_slug || m.slug || local.rawgSlug || '',
    steamAppId: steamId,
    cover: m.cover || m.cover_url || m.background_image || m.image || (steamId ? `https://cdn.akamai.steamstatic.com/steam/apps/${steamId}/header.jpg` : local.cover),
    banner: m.banner || m.banner_url || m.background || (steamId ? `https://cdn.akamai.steamstatic.com/steam/apps/${steamId}/capsule_616x353.jpg` : local.banner),
    description: m.description || m.summary || local.description || `${m.title || title} için RAWG/Steam bilgi alanları hazırlandı. Tür, kapak, tarih, platform ve seri bilgileri kontrol edilerek kaydedilebilir.`,
    storyText: m.storyText || m.story_text || local.storyText || professionalStoryText({title:m.title || local.title || title, genre:m.genre || local.genre, seriesName:m.seriesName || m.series_name || local.seriesName}),
    source: raw?.source || m.source || local.source || 'Bilgi paneli'
  };
}
function setField(form, name, value, onlyEmpty=false){
  const el=form?.elements?.[name];
  if(!el || value===undefined || value===null || value==='') return;
  if(onlyEmpty && String(el.value||'').trim()) return;
  el.value=String(value);
  el.dispatchEvent(new Event('input',{bubbles:true}));
}
function fillMetaToForm(form, meta, mode='safe'){
  const onlyEmpty = mode === 'empty';
  setField(form,'title',meta.title, onlyEmpty);
  setField(form,'genre',meta.genre, onlyEmpty);
  setField(form,'seriesName',meta.seriesName, onlyEmpty);
  setField(form,'releaseDate',meta.releaseDate, onlyEmpty);
  setField(form,'platforms',meta.platforms, onlyEmpty);
  setField(form,'tags',meta.tags, onlyEmpty);
  setField(form,'cover',meta.cover, onlyEmpty);
  setField(form,'banner',meta.banner, onlyEmpty);
  setField(form,'description',meta.description, onlyEmpty);
  setField(form,'storyText',meta.storyText, onlyEmpty);
  setField(form,'rawgId',meta.rawgId, onlyEmpty);
  setField(form,'rawgSlug',meta.rawgSlug, onlyEmpty);
  setField(form,'steamAppId',meta.steamAppId, onlyEmpty);
  setField(form,'score',meta.score, onlyEmpty);
  setField(form,'metaSource',meta.source || 'v2.1.1 meta paneli', false);
  setField(form,'metaCheckedAt',new Date().toISOString(), false);
  const box=form.querySelector('[data-meta-status]');
  if(box) box.innerHTML=`<b>Bilgi hazır:</b> ${esc(meta.source || 'v2.0.8')} • ${esc(meta.title || '')}`;
  const img=document.querySelector('.previewBox img');
  if(img && meta.cover) img.src=meta.cover;
}
async function resolveMetaForForm(form, source){
  const title=String(form?.elements?.title?.value || '').trim();
  if(!title){ toast('Önce oyun adını yaz.'); return; }
  const statusBox=form.querySelector('[data-meta-status]');
  if(statusBox) statusBox.textContent='Bilgi çekiliyor...';
  let raw=null;
  try{
    raw = await apiJson(source==='steam'?'steam-meta-lite':'game-meta-lite', {title, releaseDate:form?.elements?.releaseDate?.value || '', cover:form?.elements?.cover?.value || ''});
  }catch(err){
    raw = {ok:true, meta:localGameMetaCandidate(title), source:'Servis yok / yerel güvenli bilgi'};
  }
  const meta=mapMeta(raw, title);
  fillMetaToForm(form, meta, 'safe');
  toast(source==='steam'?'Steam bilgileri uygulandı.':'RAWG/Bilgi uygulandı.');
}

function loadGames(){
  const stored = firstStoredArray(GAME_KEYS);
  if(stored !== null){
    const normalized = stored.map(normalizeGame);
    if(!keyExists(STORAGE.games)) writeJson(STORAGE.games, normalized);
    localStorage.setItem(STORAGE.gamesInitialized,'1');
    return normalized;
  }
  if(localStorage.getItem(STORAGE.gamesInitialized)==='1') return [];
  const initial = DEFAULT_GAMES.map(normalizeGame);
  saveGames(initial);
  return initial;
}
function saveGames(rows){
  const normalized = (Array.isArray(rows)?rows:[]).map(normalizeGame);
  for(const key of GAME_KEYS) writeJson(key, normalized);
  localStorage.setItem(STORAGE.gamesInitialized,'1');
  localStorage.setItem('hayatimiz_games_last_saved_at', new Date().toISOString());
}
function deleteGame(id){ saveGames(loadGames().filter(g=>String(g.id)!==String(id))); }
function clearAllGames(){ saveGames([]); }
function restoreDemoGames(){ saveGames(DEFAULT_GAMES.map(normalizeGame)); }
function firstArray(keys, fallback=[]){ const stored=firstStoredArray(keys); return stored === null ? fallback : stored; }
function loadEvents(){ return firstArray(EVENTS_KEYS, []); }
function saveEvents(rows){ for(const k of EVENTS_KEYS) writeJson(k, Array.isArray(rows)?rows:[]); }
function mergeDefaultNotes(rows){
  const list = Array.isArray(rows) ? rows : [];
  const has = note => list.some(n => String(n.id||'')===String(note.id||'') || (String(n.version||'')===String(note.version||'') && String(n.title||'')===String(note.title||'')));
  const additions = DEFAULT_NOTES.filter(note => !has(note));
  return [...additions, ...list];
}
function loadNotes(){
  const local=firstArray(NOTES_KEYS, []);
  const rows = Array.isArray(local) ? local : [];
  const merged = mergeDefaultNotes(rows);
  if(JSON.stringify(merged)!==JSON.stringify(rows)) saveNotes(merged);
  return merged.length ? merged : DEFAULT_NOTES;
}
function saveNotes(rows){ const list=Array.isArray(rows)?rows:[]; const compact=compactForStorage(list); for(const k of NOTES_KEYS) writeJson(k, compact); }
function sanitizeMaintenance(raw){
  const base = {enabled:false,message:'Hayatımız Oyun kısa süreli bakımda.',eta:'',percent:0,adminBypass:true,managedBy:'v2.1.1-supabase-runtime'};
  const cfg = {...base, ...(raw && typeof raw==='object' ? raw : {})};
  if(localStorage.getItem(STORAGE.maintenanceFix)!=='1' && cfg.enabled === true && cfg.adminBypass !== true){
    cfg.enabled = false;
    cfg.repairedFromLegacy = true;
    cfg.repairedAt = new Date().toISOString();
    cfg.message = cfg.message || base.message;
    saveMaintenance(cfg);
    localStorage.setItem(STORAGE.maintenanceFix,'1');
  }
  return cfg;
}
function loadMaintenance(){
  let found = null;
  for(const key of MAINTENANCE_KEYS){ if(keyExists(key)){ found = readJson(key, null); break; } }
  return sanitizeMaintenance(found || {enabled:false,message:'Hayatımız Oyun kısa süreli bakımda.',eta:'',percent:0,adminBypass:true,managedBy:'v2.1.1-supabase-runtime'});
}
function saveMaintenance(v){
  const cfg = {...v, enabled: v.enabled === true, percent: Number(v.percent||0), managedBy:'v2.1.1-supabase-runtime', updatedAt:new Date().toISOString()};
  for(const key of MAINTENANCE_KEYS) writeJson(key, cfg);
  localStorage.setItem(STORAGE.maintenanceFix,'1');
}
function loadUsers(){ return readJson(STORAGE.users, []); }
function saveUsers(rows){ writeJson(STORAGE.users, rows); }
function isYönetimEmail(email){ return ADMIN_EMAILS.includes(String(email||'').trim().toLowerCase()); }
function currentUser(){ return readJson(STORAGE.session, null); }
function isLoggedIn(){ return !!currentUser(); }
function isYönetim(){ const u=currentUser(); return !!u && (['owner','admin','kurucu','yonetici','yönetici','moderator','editor'].includes(String(u.role||'').toLocaleLowerCase('tr')) || isYönetimEmail(u.email)); }
function roleLabel(role, email=''){
  const r=String(role||'user').toLocaleLowerCase('tr');
  if(isYönetimEmail(email) || ['owner','admin','kurucu','yonetici','yönetici'].includes(r)) return 'Kurucu';
  if(r === 'moderator' || r === 'moderatör') return 'Moderatör';
  if(r === 'editor' || r === 'editör') return 'İçerik Editörü';
  if(r === 'banned' || r === 'banlı') return 'Banlı';
  return 'Üye';
}
function userTopbar(){
  const user=currentUser();
  const role=user ? roleLabel(user.role, user.email) : 'Üye';
  const publicLinks = [
    ['/ana-sayfa','🏠 Ana Sayfa'],['/oyun-arsivi','🎮 Arşiv'],['/koleksiyonlar','🗂️ Koleksiyonlar'],['/seriler','🎬 Seriler'],['/status','📡 Site Durumu'],['/site-rehberi','📘 Site Rehberi'],['/yetkili-rehberi','👑 Yetkili Rehberi']
  ];
  const auth = user
    ? `<div class="topUser"><span class="roleChip">${esc(role)}</span><a class="topBtn" href="/hesabim">👤 Profil</a><button class="topBtn dangerSoft" data-action="logout">🚪 Çıkış Yap</button></div>`
    : `<div class="topUser"><span class="roleChip">👤 Üye</span><a class="topBtn" href="/giris-yap">🔐 Giriş Yap</a><a class="topBtn primarySoft" href="/kayit-ol">📝 Kayıt Ol</a></div>`;
  return `<header class="topBar proStickyTop topOnlyBar"><div class="topIdentity"><b>🎮 Hayatımız Oyun</b><small>${VERSION} • ✨ Profesyonel FIX</small></div><nav class="topQuickNav fullTopNav">${publicLinks.map(([href,label])=>`<a class="${active(href)?'active':''}" href="${href}">${label}</a>`).join('')}</nav>${isYönetim()?'<a class="topAdminOpen" href="/yonetim">🛡️ Yönetim Paneli</a>':''}${auth}</header>`;
}

function signOut(){ localStorage.removeItem(STORAGE.session); }
function route(){ return decodeURI(location.pathname || '/'); }
function isAuthRoute(p=route()){ return ['/giris-yap','/kayit-ol','/auth/login','/auth/register'].includes(p); }
function setRoute(path){ history.pushState({},'',path); render(); window.scrollTo(0,0); }
function toast(msg){ const old=$('.toast'); if(old) old.remove(); const t=document.createElement('div'); t.className='toast'; t.textContent=msg; document.body.appendChild(t); setTimeout(()=>t.remove(),3000); }
function active(path){ const p=route(); return p===path || (path!=='/' && p.startsWith(path)); }
function countBy(rows, key){ return rows.reduce((acc,item)=>{ const k=item[key] || 'Diğer'; acc[k]=(acc[k]||0)+1; return acc; },{}); }
function statusClass(status){ const s=String(status||'').toLowerCase(); return s.includes('tamam')?'green':s.includes('yak')||s.includes('plan')?'amber':s.includes('ara')?'red':''; }
function tagList(g){ return String(g.tags||'').split(',').map(x=>x.trim()).filter(Boolean); }
function splitText(v){ return String(v||'').split(',').map(x=>x.trim()).filter(Boolean); }
function fieldValue(obj, key, fallback=''){ return esc(obj && obj[key] !== undefined && obj[key] !== null ? obj[key] : fallback); }
function uniqueValues(rows, getter){ return Array.from(new Set(rows.map(getter).flat().map(x=>String(x||'').trim()).filter(Boolean))).sort((a,b)=>a.localeCompare(b,'tr')); }
function queryParams(){ return new URLSearchParams(location.search || ''); }
function selectedOption(current, value){ return String(current||'')===String(value||'') ? 'selected' : ''; }
function clearTextMatch(g, q){ if(!q) return true; return [g.title,g.genre,g.seriesName,g.description,g.tags,g.status].join(' ').toLocaleLowerCase('tr').includes(String(q).toLocaleLowerCase('tr')); }
function filterGames(rows, filters){
  return rows.filter(g => clearTextMatch(g, filters.q)
    && (!filters.status || filters.status==='Tümü' || g.status===filters.status)
    && (!filters.genre || filters.genre==='Tümü' || g.genre===filters.genre)
    && (!filters.series || filters.series==='Tümü' || (g.seriesName||'Serisiz')===filters.series)
    && (!filters.tag || filters.tag==='Tümü' || tagList(g).includes(filters.tag))
  );
}
function progressPercent(g){ const total=Number(g.episodeCount||0); const watched=Number(g.watchedEpisodeCount||0); if(!total) return g.status==='Tamamlanan'?100:0; return Math.max(0, Math.min(100, Math.round((watched/total)*100))); }

function watchSettings(){ return readJson(STORAGE.watchSettings, {quality:'Otomatik', theater:true}); }
function saveWatchSettings(patch){ writeJson(STORAGE.watchSettings, {...watchSettings(), ...(patch||{})}); }
function videoIdFromUrl(raw){
  const value=String(raw||'').trim();
  if(!value) return '';
  try{ const u=new URL(value); if(u.hostname.includes('youtu.be')) return u.pathname.replace('/','').slice(0,11); const v=u.searchParams.get('v'); if(v) return v.slice(0,11); const m=u.pathname.match(/\/embed\/([a-zA-Z0-9_-]{11})|\/shorts\/([a-zA-Z0-9_-]{11})/); if(m) return (m[1]||m[2]||'').slice(0,11); }catch{}
  const m=value.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/) || value.match(/^([a-zA-Z0-9_-]{11})$/);
  return m ? m[1] : '';
}
function videoEmbedSrc(game, episode){
  const videoId = videoIdFromUrl(episode?.videoUrl) || episode?.videoId || videoIdFromUrl(game?.videoUrl || game?.youtubeUrl || '');
  if(videoId) return `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?rel=0&modestbranding=1&playsinline=1`;
  const playlistId = game?.youtubePlaylistId || extractYoutubePlaylistId(game?.youtubePlaylistUrl || '');
  if(playlistId) return `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(playlistId)}&rel=0&modestbranding=1&playsinline=1`;
  return '';
}
function alphaKey(title){
  const t=String(title||'').trim();
  if(!t) return '#';
  const ch=t[0].toLocaleUpperCase('tr');
  if(/[0-9]/.test(ch)) return '0-9';
  return ch.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleUpperCase('tr');
}
function alphabetGroups(rows){
  const groups=new Map();
  [...(rows||[])].sort((a,b)=>String(a.title).localeCompare(String(b.title),'tr')).forEach(g=>{ const k=alphaKey(g.title); if(!groups.has(k)) groups.set(k, []); groups.get(k).push(g); });
  const order=[...'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map(x=>x==='0'?'0-9':x);
  return Array.from(groups.entries()).sort((a,b)=>{ const ia=order.indexOf(a[0]); const ib=order.indexOf(b[0]); return (ia<0?999:ia)-(ib<0?999:ib) || a[0].localeCompare(b[0],'tr'); });
}

function sortGamesForView(rows, sort='akilli'){
  const arr=[...(rows||[])];
  const mode=String(sort||'akilli');
  if(mode==='az') return arr.sort((a,b)=>String(a.title||'').localeCompare(String(b.title||''),'tr'));
  if(mode==='za') return arr.sort((a,b)=>String(b.title||'').localeCompare(String(a.title||''),'tr'));
  if(mode==='series') return arr.sort((a,b)=>String(a.seriesName||'Serisiz').localeCompare(String(b.seriesName||'Serisiz'),'tr') || Number(a.seriesOrder ?? a.sortOrder ?? 0)-Number(b.seriesOrder ?? b.sortOrder ?? 0) || String(a.title||'').localeCompare(String(b.title||''),'tr'));
  if(mode==='status') return arr.sort((a,b)=>statusBucket(a.status).localeCompare(statusBucket(b.status),'tr') || String(a.title||'').localeCompare(String(b.title||''),'tr'));
  if(mode==='new') return arr.sort((a,b)=>String(b.releaseDate||'').localeCompare(String(a.releaseDate||''),'tr') || String(a.title||'').localeCompare(String(b.title||''),'tr'));
  if(mode==='numeric') return arr.sort((a,b)=>{ const an=alphaKey(a.title)==='0-9'?0:1; const bn=alphaKey(b.title)==='0-9'?0:1; return an-bn || String(a.title||'').localeCompare(String(b.title||''),'tr'); });
  return arr.sort((a,b)=>Number(a.sortOrder||0)-Number(b.sortOrder||0) || String(a.title||'').localeCompare(String(b.title||''),'tr'));
}
function sortSelectOptions(current){
  const options=[['akilli','🎯 Akıllı sıra'],['az','🔤 A’dan Z’ye'],['za','🔡 Z’den A’ya'],['numeric','🔢 0-9 önce'],['series','🎬 Seri sırasına göre'],['status','📌 Duruma göre'],['new','🗓️ Yeni çıkış önce']];
  return options.map(([value,label])=>`<option value="${value}" ${String(current)===value?'selected':''}>${label}</option>`).join('');
}
function alphabetMiniIndex(rows, base='/oyun-arsivi'){
  const groups=alphabetGroups(rows);
  if(!groups.length) return '';
  return `<section class="alphaMini"><div class="sectionHead compact"><div><h2>🔤 Alfabetik hızlı geçiş</h2><p>Alfabetik sıralama artık ayrı sayfa değil; oyunların ve serilerin içinde çalışır.</p></div></div><div class="alphaIndex">${groups.map(([k,items])=>`<a href="#harf-${encodeURIComponent(k)}"><b>${esc(k)}</b><span>${items.length}</span></a>`).join('')}</div></section>`;
}
function alphabetGroupedCards(rows){
  const groups=alphabetGroups(rows);
  if(!groups.length) return '';
  return groups.map(([k,items])=>`<section class="alphaGroup" id="harf-${encodeURIComponent(k)}"><div class="sectionHead"><div><h2>🔤 ${esc(k)} ile başlayan oyunlar</h2><p>🎮 ${items.length} oyun bu grupta listeleniyor.</p></div></div><div class="grid archiveGrid">${items.map(gameCard).join('')}</div></section>`).join('');
}
function seriesLetterIndex(items){
  const groups=new Map();
  for(const item of items||[]){ const name=String(item?.[0]||'Serisiz'); const k=alphaKey(name); if(!groups.has(k)) groups.set(k,0); groups.set(k,groups.get(k)+1); }
  const order=[...'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map(x=>x==='0'?'0-9':x);
  const rows=Array.from(groups.entries()).sort((a,b)=>{ const ia=order.indexOf(a[0]); const ib=order.indexOf(b[0]); return (ia<0?999:ia)-(ib<0?999:ib) || a[0].localeCompare(b[0],'tr'); });
  if(!rows.length) return '';
  return `<section class="alphaMini"><div class="sectionHead compact"><div><h2>🎬🔤 Seri alfabetik geçişi</h2><p>A serisi, B serisi ve 0-9 ile başlayan seri grupları artık Seriler sayfasının içinde.</p></div></div><div class="alphaIndex">${rows.map(([k,count])=>`<a href="#seri-harf-${encodeURIComponent(k)}"><b>${esc(k)}</b><span>${count}</span></a>`).join('')}</div></section>`;
}
function professionalStoryText(gameOrTitle, genre='', seriesName=''){
  const g=typeof gameOrTitle==='object' ? gameOrTitle : {title:gameOrTitle, genre, seriesName};
  const title=String(g.title||'Bu oyun').trim();
  const lower=`${title} ${g.genre||''} ${g.seriesName||''}`.toLocaleLowerCase('tr');
  if(/007|first light|james bond/.test(lower)) return 'Görevin henüz başında, çiçeği burnunda bir ajan olan James Bond, MI6 tarafından küresel dengeleri tehdit eden gizli bir yapılanmayı çökertmekle görevlendirilir. First Light operasyonu, Bond’un sadece fiziksel sınırlarını değil, aynı zamanda bir ajan olarak ahlaki sınırlarını ve sadakatini de ilk kez ciddi şekilde test edeceği bir vaftiz törenine dönüşür.';
  if(/plague.*innocence|innocence/.test(lower)) return `${title}, salgın ve savaşın gölgesindeki Orta Çağ Fransa’sında Amicia ile küçük kardeşi Hugo’nun hayatta kalma mücadelesini takip eder. Yolculuk, iki kardeşin hem peşlerindeki karanlık güçlerden kaçmasını hem de Hugo’nun taşıdığı gizemli tehdidin gerçek yüzünü anlamaya çalışmasını merkezine alır. Bu arşiv anlatımı spoiler vermeden atmosferi, karakterlerin motivasyonunu ve bölüm bölüm ilerleyen hikaye takibini öne çıkarır.`;
  const type=String(g.genre||'hikaye odaklı macera').trim();
  const series=String(g.seriesName||title).trim();
  return `${title}, ${series} evreninde geçen ${type.toLocaleLowerCase('tr')} yapısıyla oyuncuyu karakterlerin hedeflerine, çatışmalarına ve bölüm bölüm büyüyen hikaye akışına odaklayan bir arşiv deneyimi sunar. Anlatım; sadece tür ve platform bilgisi vermek yerine oyunun atmosferini, ana motivasyonunu, karşılaşılan tehdidi ve izleyicinin seriden ne beklemesi gerektiğini spoiler vermeden açıklar.`;
}
function publicStoryForGame(g){ const raw=String(g.storyText||'').trim(); if(raw.length>120 && !/Platform bilgisi:|Türkçe gösterim için hazırlanmıştır|RAWG meta/i.test(raw)) return raw; return professionalStoryText(g); }
function shortStoryForGame(g){ return publicStoryForGame(g).split('. ').slice(0,2).join('. ') + (publicStoryForGame(g).split('. ').length>2?'.':''); }
function localUserRows(){ const local=loadUsers().map((u,i)=>({id:u.id||`local-${i}`,email:u.email,displayName:u.displayName||u.full_name||u.email,role:u.role||'user',is_active:u.is_active!==false,source:'Yerel'})); const current=currentUser(); if(current && !local.some(u=>String(u.email).toLowerCase()===String(current.email).toLowerCase())) local.unshift({id:'current-session',email:current.email,displayName:current.displayName||current.email,role:current.role||'user',is_active:true,source:'Oturum'}); return local; }


function statusBucket(status){
  const s=String(status||'').toLocaleLowerCase('tr');
  if(s.includes('tamam')) return 'Tamamlanan';
  if(s.includes('devam')) return 'Devam Eden';
  if(s.includes('yak') || s.includes('plan')) return 'Planlanan / Yakında';
  if(s.includes('ara')) return 'Ara Verildi';
  return 'Diğer';
}
function collectionName(g){
  return String(g.collectionName || g.seriesName || g.genre || statusBucket(g.status) || 'Genel Koleksiyon').trim() || 'Genel Koleksiyon';
}
function buildArchiveModel(rows){
  const games=(Array.isArray(rows)?rows:[]).map(normalizeGame).sort((a,b)=>Number(a.sortOrder||0)-Number(b.sortOrder||0) || String(a.title).localeCompare(String(b.title),'tr'));
  const statuses=countBy(games.map(g=>({...g,statusBucket:statusBucket(g.status)})),'statusBucket');
  const series=new Map(); const collections=new Map();
  for(const g of games){
    const sk=g.seriesName || 'Serisiz Oyunlar';
    if(!series.has(sk)) series.set(sk, []);
    series.get(sk).push(g);
    const ck=collectionName(g);
    if(!collections.has(ck)) collections.set(ck, []);
    collections.get(ck).push(g);
  }
  const episodeTotal=games.reduce((sum,g)=>sum+Number(g.episodeCount||0),0);
  const watchedTotal=games.reduce((sum,g)=>sum+Number(g.watchedEpisodeCount||0),0);
  return {games,statuses,series,collections,episodeTotal,watchedTotal};
}
function seriesBucket(rows){
  const buckets=rows.map(g=>statusBucket(g.status));
  if(buckets.every(x=>x==='Tamamlanan')) return 'Tamamlanan Seriler';
  if(buckets.some(x=>x==='Devam Eden')) return 'Devam Eden Seriler';
  if(buckets.some(x=>x==='Planlanan / Yakında')) return 'Planlanan / Yakında';
  if(buckets.some(x=>x==='Ara Verildi')) return 'Ara Verilen Seriler';
  return 'Diğer Seriler';
}
function collectionCard(name, rows){
  const total=rows.length; const episodes=rows.reduce((sum,g)=>sum+Number(g.episodeCount||0),0); const watched=rows.reduce((sum,g)=>sum+Number(g.watchedEpisodeCount||0),0); const pct=episodes?Math.round((watched/episodes)*100):0;
  const main=rows[0] || {};
  return `<article class="collectionCard"><div class="collectionCover"><img src="${esc(main.cover||'/assets/hayatimiz-kapak.png')}" onerror="this.src='/assets/hayatimiz-kapak.png'" alt="${esc(name)}"><span class="pill ${statusClass(main.status)}">${esc(statusBucket(main.status))}</span></div><div class="collectionBody"><h3>${esc(name)}</h3><p>${total} oyun • ${episodes} bölüm • ${pct}% takip</p><div class="progressMini"><i><span style="width:${pct}%"></span></i><small>${watched}/${episodes} bölüm izlendi</small></div><div class="collectionMiniList">${rows.slice(0,4).map(g=>`<span>${esc(g.title)}</span>`).join('')}</div><div class="collectionActions"><a class="miniBtn primary" href="/oyun-arsivi?series=${encodeURIComponent(name)}">Koleksiyonu Aç</a><a class="miniBtn" href="${seriesWatchHref(name)}">Tüm Seriyi İzle</a></div></div></article>`;
}
function moveGameOrder(id, delta){
  const rows=loadGames().map((g,i)=>({...g, sortOrder:Number(g.sortOrder||i)})).sort((a,b)=>Number(a.sortOrder)-Number(b.sortOrder));
  const idx=rows.findIndex(g=>String(g.id)===String(id));
  if(idx<0) return [];
  const target=idx+Number(delta||0);
  if(target<0 || target>=rows.length) return rows;
  const tmp=rows[idx]; rows[idx]=rows[target]; rows[target]=tmp;
  const next=rows.map((g,i)=>({...g, sortOrder:i, seriesOrder:Number(g.seriesOrder ?? g.sortOrder ?? i)}));
  saveGames(next);
  return next;
}
function orderedSeriesRows(rows){
  return (Array.isArray(rows)?rows:[]).map((g,i)=>normalizeGame(g,i)).sort((a,b)=>Number(a.seriesOrder ?? a.sortOrder ?? 0)-Number(b.seriesOrder ?? b.sortOrder ?? 0) || String(a.title).localeCompare(String(b.title),'tr'));
}
function getSeriesRows(name){
  const key=String(name||'').trim();
  if(!key) return [];
  return orderedSeriesRows(loadGames().filter(g=>String(g.seriesName||'Serisiz Oyunlar')===key));
}
function seriesWatchHref(name){
  return `/izle?series=${encodeURIComponent(name)}`;
}
function seriesTotals(rows){
  const games=orderedSeriesRows(rows);
  const episodes=games.reduce((sum,g)=>sum+(loadEpisodes(g.id).length || Number(g.episodeCount||0)),0);
  const watched=games.reduce((sum,g)=>sum+Number(g.watchedEpisodeCount||0),0);
  const pct=episodes?Math.round((watched/episodes)*100):0;
  return {games, episodes, watched, pct};
}
async function persistSeriesUpdateToSupabase(seriesName, updates){
  const token=sessionToken();
  if(!token){ saveSyncState({mode:'local', status:'Seri yerel kaydedildi', message:'Supabase seri kaydı için kurucu/moderatör hesabıyla giriş yap.'}); return null; }
  const data=await apiJson('series-games-save',{adminToken:token, seriesName, updates});
  saveSyncState({mode:'supabase', status:'Supabase seri kayıt aktif', message:`${data.updated||0} oyun seri düzeni Supabase üzerine kaydedildi.`});
  return data;
}
function renumberSeriesEditor(form){
  if(!form) return;
  const rows=[...form.querySelectorAll('[data-series-dnd-item]')];
  let n=0;
  for(const row of rows){
    const cb=row.querySelector('input[type="checkbox"][name="gameIds"]');
    const input=row.querySelector('[data-series-order-input]');
    if(cb?.checked && input) input.value=String(++n);
  }
}


function extractYoutubePlaylistId(raw){
  const value=String(raw||'').trim();
  if(!value) return '';
  try{ const u=new URL(value); const list=u.searchParams.get('list'); if(list) return list; }catch{}
  const m=value.match(/[?&]list=([^&\s]+)/)||value.match(/playlist\?list=([^&\s]+)/)||value.match(/list=([^&\s]+)/)||value.match(/^(PL|UU|OL)[a-zA-Z0-9_-]{10,}$/);
  return m ? decodeURIComponent(m[1] || m[0]) : '';
}
function episodeStoreKey(gameId){ return `${STORAGE.episodes}:${String(gameId||'global')}`; }
function normalizeEpisode(ep, i){
  const n=Number(ep.number || ep.episodeNumber || ep.episode_number || i+1);
  const videoId=String(ep.videoId || ep.youtubeVideoId || ep.youtube_video_id || '').trim();
  const url=ep.videoUrl || ep.video_url || (videoId?`https://www.youtube.com/watch?v=${videoId}`:'');
  return {id:ep.id || (videoId?`yt-${videoId}`:`ep-${n}`), number:n, title:ep.title || `${n}. Bölüm`, description:ep.description || '', thumbnail:ep.thumbnail || ep.thumbnailUrl || ep.thumbnail_url || (videoId?`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`:'/assets/hayatimiz-kapak.png'), videoId, videoUrl:url, watched:ep.watched === true || ep.is_watched === true};
}
function loadEpisodes(gameId){
  const direct=readJson(episodeStoreKey(gameId), null);
  if(Array.isArray(direct)) return direct.map(normalizeEpisode);
  const game=loadGames().find(g=>String(g.id)===String(gameId));
  if(game && Array.isArray(game.episodes)) return game.episodes.map(normalizeEpisode);
  return [];
}
function saveEpisodes(gameId, episodes){
  const list=(Array.isArray(episodes)?episodes:[]).map(normalizeEpisode);
  writeJson(episodeStoreKey(gameId), list);
  localStorage.setItem('hayatimiz_episodes_last_saved_at', new Date().toISOString());
  return list;
}
function makeLocalEpisodes(title, playlistUrl, count=8){
  const playlistId=extractYoutubePlaylistId(playlistUrl);
  const safeTitle=String(title||'Seri').trim() || 'Seri';
  const n=Math.max(1, Math.min(24, Number(count||8)));
  return Array.from({length:n}, (_,i)=>({id:`local-${slugify(safeTitle)}-${i+1}`, number:i+1, title:`${safeTitle} ${i+1}. Bölüm`, description:playlistId?`Oynatma listesi ID: ${playlistId}`:'Yerel güvenli bölüm', thumbnail:'/assets/hayatimiz-kapak.png', videoId:'', videoUrl:playlistUrl || '', watched:false}));
}
async function fetchPlaylistEpisodes(playlistUrl, title){
  const playlistId=extractYoutubePlaylistId(playlistUrl);
  if(!playlistId) throw new Error('Geçerli playlist linki gerekli.');
  try{
    const data=await apiJson('playlist-items', {playlistUrl});
    const episodes=Array.isArray(data.episodes) ? data.episodes.map(normalizeEpisode) : [];
    if(episodes.length) return {episodes, count:data.count || episodes.length, source:'YouTube API / güvenli tarama'};
  }catch(err){ console.warn('Oynatma listesi servisi yedek moda geçti:', err); }
  const fallback=makeLocalEpisodes(title, playlistUrl, 8);
  return {episodes:fallback, count:fallback.length, source:'Yerel güvenli bölüm listesi'};
}
function renderEpisodeList(episodes, watched=0){
  const list=(Array.isArray(episodes)?episodes:[]).slice(0,12);
  if(!list.length) return '<div class="empty compactEmpty">Henüz bölüm listesi yok. Oynatma listesi bağlantısı ekleyip bölümleri çekebilirsin.</div>';
  return `<div class="episodeList">${list.map(ep=>`<article class="episodeItem ${Number(ep.number)<=Number(watched)?'watched':''}"><img src="${esc(ep.thumbnail||'/assets/hayatimiz-kapak.png')}" onerror="this.src='/assets/hayatimiz-kapak.png'" alt="${esc(ep.title)}"><div><span class="pill">${esc(ep.number)}. Bölüm</span><h4>${esc(ep.title)}</h4>${ep.videoUrl?`<a class="miniBtn" href="${esc(ep.videoUrl)}" target="_blank" rel="noreferrer">YouTube Aç</a>`:''}</div></article>`).join('')}</div>`;
}
function updateGamePatch(id, patch){
  const next=loadGames().map(g=>String(g.id)===String(id)?normalizeGame({...g,...patch},0):g);
  saveGames(next);
  return next.find(g=>String(g.id)===String(id));
}
async function syncPlaylistForForm(form){
  const playlistUrl=String(form?.elements?.youtubePlaylistUrl?.value||'').trim();
  const title=String(form?.elements?.title?.value||'').trim();
  if(!playlistUrl){ toast('Önce YouTube oynatma listesi URL gir.'); return; }
  const box=form.querySelector('[data-youtube-status]');
  if(box) box.textContent='Oynatma listesi bölümleri çekiliyor...';
  const result=await fetchPlaylistEpisodes(playlistUrl, title || 'Oyun');
  setField(form,'episodeCount',result.count || result.episodes.length, false);
  const hidden=form.elements?.episodesJson;
  if(hidden) hidden.value=JSON.stringify(result.episodes);
  const pid=extractYoutubePlaylistId(playlistUrl);
  setField(form,'youtubePlaylistId',pid,false);
  const editId=String(form.elements?.gameId?.value||'').trim();
  if(editId){
    saveEpisodes(editId, result.episodes);
    updateGamePatch(editId,{episodeCount:result.count || result.episodes.length, youtubePlaylistUrl:playlistUrl, youtubePlaylistId:pid, episodeSyncSource:result.source, episodeSyncedAt:new Date().toISOString()});
  }
  const preview=form.querySelector('[data-youtube-preview]');
  if(preview) preview.innerHTML=renderEpisodeList(result.episodes, Number(form.elements?.watchedEpisodeCount?.value||0));
  if(box) box.innerHTML=`<b>${result.count || result.episodes.length} bölüm hazır.</b> ${esc(result.source)}`;
  toast('Oynatma listesi bölümleri hazırlandı.');
}
async function syncPlaylistForGame(id){
  const game=loadGames().find(g=>String(g.id)===String(id));
  if(!game){ toast('Oyun bulunamadı.'); return; }
  if(!game.youtubePlaylistUrl){ toast('Bu oyunda playlist URL yok. Düzenle sayfasından ekle.'); return; }
  const result=await fetchPlaylistEpisodes(game.youtubePlaylistUrl, game.title);
  saveEpisodes(game.id, result.episodes);
  updateGamePatch(game.id,{episodeCount:result.count || result.episodes.length, youtubePlaylistId:extractYoutubePlaylistId(game.youtubePlaylistUrl), episodeSyncSource:result.source, episodeSyncedAt:new Date().toISOString()});
  toast(`${game.title}: ${result.count || result.episodes.length} bölüm senkronize edildi.`);
  render();
}
function setWatchedForGame(id, value){
  const game=loadGames().find(g=>String(g.id)===String(id));
  if(!game) return;
  const total=Number(game.episodeCount||loadEpisodes(id).length||0);
  const watched=Math.max(0, Math.min(total || 9999, Number(value||0)));
  updateGamePatch(id,{watchedEpisodeCount:watched});
  const eps=loadEpisodes(id).map(ep=>({...ep, watched:Number(ep.number)<=watched}));
  if(eps.length) saveEpisodes(id, eps);
}
function canShowYönetimLinks(){ return isYönetim(); }
function nav(){ return ''; }

function adminDock(){
  if(!isYönetim() || !route().startsWith('/yonetim')) return '';
  const items=[['/yonetim','🛡️ Panel'],['/yonetim/oyun-ekle','➕ Oyun Ekle'],['/yonetim/mevcut-oyunlar','🎮 Oyunlar'],['/yonetim/seriler','🎬 Seriler'],['/yonetim/bolum-takibi','▶️ Bölümler'],['/yonetim/yayin-takvimi','📅 Takvim'],['/yonetim/guncelleme-notlari','📝 Notlar'],['/yonetim/bakim-modu','🛠️ Bakım'],['/yonetim/kullanicilar','👥 Yetkiler']];
  return `<section class="adminDock proAdminDock"><div><b>🛡️ Yönetim Paneli</b><small>Alt yönetim araçları burada. Sol menüde sadece ana panel kalır.</small></div><nav>${items.map(([href,label])=>`<a class="${active(href)?'active':''}" href="${href}">${label}</a>`).join('')}</nav></section>`;
}
function layout(content){ return `<main class="app noSideApp"><section class="main fullMain">${userTopbar()}${adminDock()}${content}</section></main>`; }
function adminOnly(contentFn){
  if(isYönetim()) return contentFn();
  return layout(`<section class="panel authPanel"><span class="badge red">Yetki gerekli</span><h1>Yönetim alanı gizli</h1><p class="muted">Yönetim paneli, oyun ekleme, mevcut oyunlar ve bakım modu artık herkese görünmez. Devam etmek için 👑 Kurucu, 🛡️ Moderatör veya ✍️ İçerik Editörü hesabıyla giriş yap.</p><div class="actions"><a class="btn primary" href="/giris-yap">Giriş Yap</a><a class="btn secondary" href="/kayit-ol">Kayıt Ol</a></div><p class="muted small">Kurucu e-posta: ${esc(ADMIN_EMAILS[0])}</p></section>`);
}
function maintenanceZiyaretçi(){
  const m=loadMaintenance();
  const pct=Math.max(0, Math.min(100, Number(m.percent||0)));
  return `<main class="maintenanceZiyaretçi proMaintenance"><section class="maintenanceCard proMaintenanceCard"><div class="maintenanceGlow"></div><span class="badge amber">🛠️ Bakım Modu Aktif</span><h1>Hayatımız Oyun yenileniyor</h1><p>${esc(m.message || 'Siteyi daha profesyonel ve stabil hale getirmek için kısa süreli bakım yapılıyor.')}</p><div class="maintenanceProgress"><i><span style="width:${pct}%"></span></i><b>%${pct}</b></div><p class="muted">${esc(m.eta || 'Tahmini açılış bilgisi güncellendiğinde burada görünecek.')}</p><div class="maintenancePublicActions"><a class="btn primary" href="/giris-yap">🔐 Giriş Yap</a><a class="btn secondary" href="/kayit-ol">📝 Kayıt Ol</a><button class="btn ghost" type="button" data-maintenance-retry>🔄 Yeniden Dene</button></div><small class="maintenanceNote">Bakım kapatıldıysa Yeniden Dene butonu yerel bakım önbelleğini temizleyip siteyi tekrar kontrol eder.</small></section></main>`;
}
function gameCard(g){
  const cls=statusClass(g.status); const tags=tagList(g).slice(0,4); const episodes=loadEpisodes(g.id); const total=episodes.length || Number(g.episodeCount||0); const watched=Number(g.watchedEpisodeCount||0); const pct=total?Math.max(0,Math.min(100,Math.round((watched/total)*100))):progressPercent(g); const episodeText=total?`${total} bölüm`:'Bölüm bekliyor';
  const nextEp=episodes.find(ep=>Number(ep.number)>watched) || episodes[0];
  return `<article class="gameCard proGameCard"><div class="posterWrap"><img src="${esc(g.cover)}" alt="${esc(g.title)}" onerror="this.src='/assets/hayatimiz-kapak.png'"><span class="statusBadge ${cls}">${esc(g.status)}</span></div><div class="cardBody"><div class="cardTop"><span class="pill ${cls}">${esc(g.genre||'Arşiv')}</span><span class="pill">${esc(episodeText)}</span></div><h3>${esc(g.title)}</h3><p>${esc(g.description)}</p><div class="progressMini"><i><span style="width:${pct}%"></span></i><small>${watched}/${total || 0} bölüm • ${pct}% takip</small></div><div class="storyPreview">${esc(shortStoryForGame(g))}</div>${nextEp?`<div class="nextEpisodeLine"><b>Sıradaki:</b> ${esc(nextEp.title)} </div>`:''}<div class="cardActions"><a class="miniBtn primary" href="/izle?id=${encodeURIComponent(g.id)}">Siteden İzle</a>${nextEp?.videoUrl?`<a class="miniBtn" href="${esc(nextEp.videoUrl)}" target="_blank" rel="noreferrer">YouTube Aç</a>`:''}</div>${tags.length?`<div class="tags">${tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div>`:''}<div class="metaLine"><span>${g.seriesName?`🎬 ${esc(g.seriesName)}`:'🎬 Serisiz'}</span><span>${g.releaseDate?`📅 ${esc(g.releaseDate)}`:'📅 Tarih yok'}</span></div></div></article>`;
}
function quickCard(href, icon, title, text){ return `<a class="quickCard" href="${href}"><span class="quickIcon">${icon}</span><b>${esc(title)}</b><small>${esc(text)}</small></a>`; }
function statusBar(label,count,total,cls=''){ const pct=total?Math.round((count/total)*100):0; return `<div class="statusBar"><div><span class="pill ${cls}">${esc(label)}</span><b>${count}</b></div><i><span style="width:${pct}%"></span></i></div>`; }
function oldHomeTile(g){
  const pct = progressPercent(g);
  const cls = statusClass(g.status);
  return `<article class="oldHomeTile"><div class="oldHomePoster"><img src="${esc(g.cover)}" alt="${esc(g.title)}" onerror="this.src='/assets/hayatimiz-kapak.png'"><span class="pill ${cls}">${esc(g.status || 'Arşiv')}</span></div><div class="oldHomeTileBody"><h3>${esc(g.title)}</h3><p>${esc(g.description || 'Açıklama eklenmedi.')}</p><div class="oldHomeMeta"><span>🎮 ${esc(g.genre || 'Kategori yok')}</span><span>🎬 ${esc(g.seriesName || 'Serisiz')}</span><span>📅 ${esc(g.releaseDate || 'Tarih yok')}</span></div><div class="progressMini"><i><span style="width:${pct}%"></span></i><small>%${pct} takip / ${Number(g.episodeCount||0)} bölüm</small></div><div class="cardActions"><a class="miniBtn primary" href="/izle?id=${encodeURIComponent(g.id)}">Siteden İzle</a><a class="miniBtn" href="/oyun-arsivi?q=${encodeURIComponent(g.title)}">Detay</a></div></div></article>`;
}
function oldContinueCard(g){
  const total = Number(g.episodeCount || 0);
  const watched = Number(g.watchedEpisodeCount || 0);
  const pct = progressPercent(g);
  return `<article class="oldContinueCard"><img src="${esc(g.cover)}" alt="${esc(g.title)}" onerror="this.src='/assets/hayatimiz-kapak.png'"><div><span class="pill ${statusClass(g.status)}">${esc(g.status || 'Devam Eden')}</span><h3>${esc(g.seriesName || g.title)}</h3><p>${esc(g.title)} • ${watched}/${total || 0} bölüm</p><div class="progressMini"><i><span style="width:${pct}%"></span></i></div><a class="miniBtn primary" href="/oyun-arsivi?q=${encodeURIComponent(g.title)}">Seriyi Aç</a></div></article>`;
}
function oldHomeAction(href, icon, title, text){ return `<a class="oldActionCard" href="${href}"><span>${icon}</span><b>${esc(title)}</b><small>${esc(text)}</small></a>`; }

function home(){
  const games=loadGames(), notes=loadNotes(), events=loadEvents();
  const series=new Set(games.map(g=>g.seriesName).filter(Boolean));
  const genres=new Set(games.map(g=>g.genre).filter(Boolean));
  const episodeTotal=games.reduce((sum,g)=>sum+Number(g.episodeCount||0),0);
  const completed=games.filter(g=>String(g.status||'').toLocaleLowerCase('tr').includes('tamam')).length;
  const active=games.filter(g=>String(g.status||'').toLocaleLowerCase('tr').includes('devam')).length;
  const planned=games.filter(g=>/yak|plan/i.test(String(g.status||''))).length;
  const featured=games.slice(0,3);
  const continued=games.filter(g=>String(g.status||'').toLocaleLowerCase('tr').includes('devam')).slice(0,4);
  const latestNote=notes[0] || DEFAULT_NOTES[0];
  const recentEvents=events.slice(0,4);
  const controlScore=Math.min(100, Math.max(72, 72 + Math.min(18,games.length*2) + Math.min(10,notes.length)));
  const user=currentUser();
  return layout(`<section class="oldHomeFull"><div class="oldHomeTop"><div class="oldHomeBrand"><span>🎮</span><div><b>Hayatımız Oyun</b><small>${VERSION} • Yayın öncesi stabilite</small></div></div><form class="oldHomeSearch" data-search-form><span>🔎</span><input name="q" placeholder="Oyun, seri, tür veya etiket ara..."><button class="btn primary" type="submit">Ara</button></form><div class="oldHomeInfo"><span>✨ Profil ve yönetim işlemleri artık sabit üst bardadır.</span></div></div><section class="oldHero"><div class="oldHeroOverlay"></div><div class="oldHeroCopy"><span class="badge">🚀 Arşiv Hazır • Yayın Öncesi Stabilite</span><h1>Oyun Arşivi, seriler ve daha fazlası.</h1><p>Yayın öncesi stabilite kontrolü yapıldı: ana sayfa, arşiv, seriler, izleme, rehberler, bakım modu ve yönetim bağlantıları tek profesyonel akışta korunuyor.</p><div class="actions"><a class="btn primary" href="/oyun-arsivi">Arşivi Keşfet</a><a class="btn secondary" href="/seriler">Serileri Gör</a><a class="btn secondary" href="/site-rehberi">Site Rehberi</a><a class="btn secondary" href="/status">Site Durumu</a></div></div><div class="oldHeroStats"><article><small>Toplam Oyun</small><b>${games.length.toLocaleString('tr-TR')}</b><span>Koleksiyon</span></article><article><small>Seri Takibi</small><b>${series.size.toLocaleString('tr-TR')}</b><span>Gruplanmış seri</span></article><article><small>Toplam Bölüm</small><b>${episodeTotal.toLocaleString('tr-TR')}</b><span>Oynatma listesi / bölüm</span></article><article><small>Kontrol Skoru</small><b>%${controlScore}</b><span>Site sağlığı</span></article></div></section><section class="oldQuickStrip">${oldHomeAction('/oyun-arsivi','🎮','Oyun Arşivi','Kartlar, filtreler ve koleksiyon')}${oldHomeAction('/seriler','🎬','Seriler','Devam eden ve tamamlanan seriler')}${oldHomeAction('/oyun-arsivi?sort=az','🔤','A-Z Oyunlar','Oyun arşivi içinde sıralama')}${oldHomeAction('/status','📡','Site Durumu','Yayın öncesi kontrol raporu')}${oldHomeAction('/site-rehberi','📘','Site Rehberi','Site ne hale geldi?')}${oldHomeAction('/yetkili-rehberi','👑','Yetkili Rehberi','Roller ve anlamları')}${oldHomeAction('/izle','▶️','Siteden İzle','Playlist ve bölüm oynatıcı')}${oldHomeAction('/koleksiyonlar','🗂️','Koleksiyonlar','Seri ve oyun grupları')}${oldHomeAction('/giris-yap','🔐','Giriş Yap','Hesabına giriş yap')}${oldHomeAction('/kayit-ol','📝','Kayıt Ol','Yeni hesap oluştur')}</section><section class="oldMetricRibbon"><div><b>${active}</b><span>Devam Eden</span></div><div><b>${completed}</b><span>Tamamlanan</span></div><div><b>${planned}</b><span>Plan/Yakında</span></div><div><b>${genres.size}</b><span>Kategori</span></div><div><b>${notes.length}</b><span>Güncelleme</span></div></section><section class="oldSection"><div class="sectionHead"><div><h2>Öne Çıkan Oyunlar</h2><p class="muted">Eski ana sayfadaki büyük kartlı vitrin geri geldi.</p></div><a class="btn secondary" href="/oyun-arsivi">Tüm Oyunları Gör</a></div>${featured.length?`<div class="oldFeaturedGrid">${featured.map(oldHomeTile).join('')}</div>`:'<div class="empty">Henüz oyun yok. Yönetim girişiyle oyun ekleyebilir veya örnekleri geri yükleyebilirsin.</div>'}</section><section class="oldBottomGrid"><div class="oldPanel"><div class="sectionHead compact"><div><h2>Devam Eden Seriler</h2><p>İzleyicilerin aktif içerikleri ana sayfada görmesi için geri eklendi.</p></div><a class="btn secondary" href="/seriler">Tümü</a></div><div class="oldContinueGrid">${continued.length?continued.map(oldContinueCard).join(''):'<div class="empty">Devam eden seri bulunmadı.</div>'}</div></div><aside class="oldRightRail"><article class="oldProfileCard"><h3>Hızlı İşlem</h3><p class="muted">Eski ana sayfadaki sağ aksiyon alanı geri alındı.</p><div class="oldStackActions"><a class="miniBtn primary" href="/oyun-arsivi">Arşive Git</a><a class="miniBtn" href="/site-rehberi">Site Rehberi</a><a class="miniBtn" href="/status">Site Durumu</a></div></article><article class="oldActivityCard"><h3>Son Güncelleme</h3><span class="pill green">${esc(latestNote.version || VERSION)}</span><h4>${esc(latestNote.title)}</h4><p>${esc(latestNote.summary || latestNote.description || '')}</p></article><article class="oldActivityCard"><h3>Yaklaşan Yayınlar</h3>${recentEvents.length?recentEvents.map(e=>`<p class="activityItem">📅 ${esc(e.title||'Yayın')} • ${esc(e.date||'Tarih yok')} ${esc(e.time||'')}</p>`).join(''):'<p class="muted">Henüz takvim kaydı yok.</p>'}</article></aside></section></section>`);
}

function archive(){
  const model=buildArchiveModel(loadGames());
  const games=model.games; const params=queryParams();
  const filters={q:params.get('q')||'',status:params.get('status')||'Tümü',genre:params.get('genre')||'Tümü',series:params.get('series')||'Tümü',tag:params.get('tag')||'Tümü',sort:params.get('sort')||'akilli'};
  const statuses=['Tümü',...uniqueValues(games,g=>g.status)]; const genres=['Tümü',...uniqueValues(games,g=>g.genre)]; const series=['Tümü',...uniqueValues(games,g=>g.seriesName||'Serisiz')]; const tags=['Tümü',...uniqueValues(games,g=>tagList(g))];
  const filteredRaw=filterGames(games, filters); const filtered=sortGamesForView(filteredRaw, filters.sort); const filteredModel=buildArchiveModel(filtered); const activeFilterCount=Object.entries(filters).filter(([k,v])=>k==='sort'?v && v!=='akilli':(k==='q'?String(v).trim():v && v!=='Tümü')).length;
  const alphabetMode=['az','za','numeric'].includes(filters.sort);
  return layout(`<section class="archiveHero v209Hero"><div><span class="badge">🎮 ${VERSION} • 🔤 Sıralama arşiv içinde</span><h1>🎮 Oyun Arşivi</h1><p>🔎 Oyunlar, kartlar, filtreler, koleksiyon sayaçları ve alfabetik sıralama artık tek sayfada. 🔤 Ayrı “Alfabetik Sıralama” bölümü kaldırıldı; A serisi, B serisi ve 0-9 sıralaması oyun arşivinin içinde çalışır.</p></div>${isYönetim()?'<a class="btn primary" href="/yonetim/oyun-ekle">➕ Yeni Oyun Ekle</a>':'<a class="btn secondary" href="/giris-yap">🔐 Yetkili Girişi</a>'}</section><section class="archiveStats"><article><b>${games.length}</b><span>🎮 Toplam Oyun</span></article><article><b>${filtered.length}</b><span>🔎 Filtre Sonucu</span></article><article><b>${filteredModel.collections.size}</b><span>🗂️ Koleksiyon</span></article><article><b>${filteredModel.episodeTotal}</b><span>▶️ Bölüm</span></article></section><section class="statusDashboard">${['Devam Eden','Tamamlanan','Planlanan / Yakında','Ara Verildi','Diğer'].map(label=>{ const count=Number(model.statuses[label]||0); const cls=statusClass(label); return `<a class="statusBigChip" href="/oyun-arsivi?status=${encodeURIComponent(label==='Planlanan / Yakında'?'Yakında':label)}"><span class="pill ${cls}">📌 ${esc(label)}</span><b>${count}</b><small>📊 ${games.length?Math.round((count/games.length)*100):0}% arşiv payı</small></a>`; }).join('')}</section><form class="filterPanel" data-search-form><label>🔎 Arama<input class="input" name="q" placeholder="Oyun, tür, seri, etiket ara" value="${esc(filters.q)}"></label><label>📌 Durum<select name="status">${statuses.map(s=>`<option ${selectedOption(filters.status,s)}>${esc(s)}</option>`).join('')}</select></label><label>🎭 Tür<select name="genre">${genres.map(s=>`<option ${selectedOption(filters.genre,s)}>${esc(s)}</option>`).join('')}</select></label><label>🎬 Seri<select name="series">${series.map(s=>`<option ${selectedOption(filters.series,s)}>${esc(s)}</option>`).join('')}</select></label><label>🏷️ Etiket<select name="tag">${tags.map(s=>`<option ${selectedOption(filters.tag,s)}>${esc(s)}</option>`).join('')}</select></label><label>🔤 Sıralama<select name="sort">${sortSelectOptions(filters.sort)}</select></label><div class="filterActions"><button class="btn primary" type="submit">🔎 Filtrele</button><a class="btn secondary" href="/oyun-arsivi">🧹 Temizle</a></div></form>${activeFilterCount?`<p class="muted"><b>${activeFilterCount}</b> aktif filtre/sıralama var. 🔤 Alfabetik düzen artık bu sayfanın içinde.</p>`:''}${alphabetMiniIndex(filtered)}<div class="sectionHead"><div><h2>🎮 Arşiv Kartları</h2><p>📦 ${filtered.length} sonuç / ${games.length} toplam oyun. 🗂️ Koleksiyon sayısı: ${filteredModel.collections.size}. 🔤 Sıralama: ${esc(filters.sort)}</p></div><div class="actions"><a class="btn secondary" href="/koleksiyonlar">🗂️ Koleksiyonları Gör</a><a class="btn secondary" href="/seriler">🎬 Seriler</a></div></div>${filtered.length?(alphabetMode?alphabetGroupedCards(filtered):`<section class="grid archiveGrid">${filtered.map(gameCard).join('')}</section>`):'<div class="empty">⚠️ Bu filtreyle oyun bulunamadı. Oyunların hepsini sildiysen buranın boş kalması artık normaldir.</div>'}`);
}
function collectionsPage(){
  const model=buildArchiveModel(loadGames());
  const byCollection=Array.from(model.collections.entries()).sort((a,b)=>b[1].length-a[1].length || a[0].localeCompare(b[0],'tr'));
  const byGenre=new Map();
  for(const g of model.games){ const key=g.genre || 'Kategori Yok'; if(!byGenre.has(key)) byGenre.set(key, []); byGenre.get(key).push(g); }
  return layout(`<section class="archiveHero v209Hero"><div><span class="badge green">${VERSION} • Koleksiyon Merkezi</span><h1>Koleksiyonlar</h1><p>Koleksiyonlar artık boş görünmez; seri, tür ve durum sayaçları aynı oyun listesinden beslenir. Oyun silme/ekleme sonrası sayılar otomatik yenilenir.</p></div>${isYönetim()?'<a class="btn primary" href="/yonetim/mevcut-oyunlar">Sıralamayı Yönet</a>':'<a class="btn secondary" href="/oyun-arsivi">Arşive Dön</a>'}</section><section class="archiveStats"><article><b>${model.collections.size}</b><span>Koleksiyon</span></article><article><b>${model.series.size}</b><span>Seri</span></article><article><b>${model.games.length}</b><span>Oyun</span></article><article><b>${model.episodeTotal}</b><span>Bölüm</span></article></section><section class="statusDashboard">${Object.entries(model.statuses).map(([label,count])=>`<a class="statusBigChip" href="/oyun-arsivi?status=${encodeURIComponent(label)}"><span class="pill ${statusClass(label)}">${esc(label)}</span><b>${count}</b><small>Durum sayacı</small></a>`).join('')}</section><div class="sectionHead"><div><h2>Seri / Koleksiyon Grupları</h2><p>${byCollection.length} grup listeleniyor.</p></div></div>${byCollection.length?`<section class="collectionGrid">${byCollection.map(([name,rows])=>collectionCard(name, rows)).join('')}</section>`:'<div class="empty">Koleksiyon oluşturmak için önce oyun ekle.</div>'}<div class="sectionHead"><div><h2>Tür Koleksiyonları</h2><p>Kategori bazlı hızlı koleksiyon özetleri.</p></div></div>${byGenre.size?`<section class="genreCollectionGrid">${Array.from(byGenre.entries()).map(([name,rows])=>`<a class="genreBubble" href="/oyun-arsivi?genre=${encodeURIComponent(name)}"><b>${esc(name)}</b><span>${rows.length} oyun</span><small>${rows.reduce((sum,g)=>sum+Number(g.episodeCount||0),0)} bölüm</small></a>`).join('')}</section>`:''}`);
}
function seriesPage(){
  const model=buildArchiveModel(loadGames());
  const params=queryParams();
  const sort=params.get('sort')||'az';
  const groups={};
  for(const [name, rows] of model.series.entries()){
    const ordered=orderedSeriesRows(sortGamesForView(rows, sort==='az'||sort==='za'||sort==='numeric'?sort:'series'));
    const bucket=seriesBucket(ordered);
    if(!groups[bucket]) groups[bucket]=[];
    groups[bucket].push([name, ordered]);
  }
  for(const bucket of Object.keys(groups)){
    groups[bucket].sort((a,b)=>{
      if(sort==='za') return String(b[0]).localeCompare(String(a[0]),'tr');
      if(sort==='numeric') return (alphaKey(a[0])==='0-9'?0:1)-(alphaKey(b[0])==='0-9'?0:1) || String(a[0]).localeCompare(String(b[0]),'tr');
      return String(a[0]).localeCompare(String(b[0]),'tr');
    });
  }
  const order=['Devam Eden Seriler','Tamamlanan Seriler','Planlanan / Yakında','Ara Verilen Seriler','Diğer Seriler'];
  const flatGroups=order.flatMap(bucket=>groups[bucket]||[]);
  return layout(`<section class="archiveHero v209Hero seriesHeroPro"><div><span class="badge green">🎬 v2.1.1 FIX • 🔤 Seri içi sıralama</span><h1>🎬 Seriler</h1><p>🎮 Her seri kendi oyunlarıyla listelenir. 🔤 Alfabetik sıralama artık ayrı bölüm değil; seriler ve seri içindeki oyunlar burada A-Z, Z-A veya 0-9 önce düzenlenebilir. 👑 Yetkili girişinde seri adını, oyunlarını ve sırasını yönetebilirsin.</p></div><div class="actions"><a class="btn secondary" href="/koleksiyonlar">🗂️ Koleksiyon Merkezi</a>${isYönetim()?'<a class="btn primary" href="/yonetim/seriler">🛠️ Serileri Yönet</a>':''}</div></section><section class="archiveStats"><article><b>${model.series.size}</b><span>🎬 Toplam Seri</span></article><article><b>${Number(model.statuses['Devam Eden']||0)}</b><span>🟢 Devam Eden Oyun</span></article><article><b>${Number(model.statuses['Tamamlanan']||0)}</b><span>✅ Tamamlanan Oyun</span></article><article><b>${model.episodeTotal}</b><span>▶️ Toplam Bölüm</span></article></section><form class="filterPanel seriesSortPanel" data-series-sort-form><label>🔤 Seri / oyun sıralaması<select name="sort">${sortSelectOptions(sort)}</select></label><div class="filterActions"><button class="btn primary" type="submit">🔤 Sırala</button><a class="btn secondary" href="/seriler?sort=az">🧹 A-Z Varsayılan</a></div></form>${seriesLetterIndex(flatGroups)}${model.games.length?order.map(bucket=>{ const items=groups[bucket]||[]; if(!items.length) return ''; return `<section class="seriesBucket" id="seri-harf-${encodeURIComponent(alphaKey(items[0]?.[0]||''))}"><div class="sectionHead"><div><h2>🎬 ${esc(bucket)}</h2><p>📦 ${items.length} seri grubu. 🔤 Bu alan seri adlarına göre sıralandı.</p></div></div><div class="seriesGrid proSeriesGrid">${items.map(([name,rows])=>{ const totals=seriesTotals(rows); const main=totals.games[0]||{}; return `<article class="seriesPanel proSeriesPanel"><div class="seriesCoverLine"><img src="${esc(main.cover||'/assets/hayatimiz-kapak.png')}" onerror="this.src='/assets/hayatimiz-kapak.png'" alt="${esc(name)}"><div><span class="pill ${statusClass(bucket)}">📌 ${esc(bucket)}</span><h3>🎬 ${esc(name)}</h3><p>🎮 ${rows.length} oyun • ▶️ ${totals.episodes} bölüm • 📊 ${totals.pct}% takip</p></div></div><div class="progressMini"><i><span style="width:${totals.pct}%"></span></i><small>✅ ${totals.watched}/${totals.episodes} bölüm izlendi</small></div><div class="seriesGameList">${totals.games.map((g,i)=>`<a href="/izle?series=${encodeURIComponent(name)}&id=${encodeURIComponent(g.id)}" class="seriesGameLine"><b>${i+1}</b><span>🎮 ${esc(g.title)}</span><small>▶️ ${Number(g.watchedEpisodeCount||0)}/${loadEpisodes(g.id).length || Number(g.episodeCount||0)} bölüm</small></a>`).join('')}</div><div class="seriesActions"><a class="miniBtn primary" href="${seriesWatchHref(name)}">▶️ Tüm Seriyi İzle</a><a class="miniBtn" href="/oyun-arsivi?series=${encodeURIComponent(name)}&sort=${encodeURIComponent(sort)}">🎮 Oyunları Aç</a>${isYönetim()?`<a class="miniBtn" href="/yonetim/seriler?series=${encodeURIComponent(name)}">🛠️ Seriyi Düzenle</a>`:''}</div></article>`; }).join('')}</div></section>`; }).join(''):'<div class="empty">⚠️ Seri oluşturmak için önce oyun ekle.</div>'}`);
}

function watchPage(){
  const params=queryParams();
  const id=params.get('id') || '';
  const seriesName=String(params.get('series')||'').trim();
  const epNo=Number(params.get('ep')||0);
  const games=buildArchiveModel(loadGames()).games;
  const seriesGames=seriesName ? orderedSeriesRows(games.filter(g=>String(g.seriesName||'Serisiz Oyunlar')===seriesName)) : [];
  const game=(id ? games.find(g=>String(g.id)===String(id)) : null) || seriesGames[0] || games[0];
  if(!game) return layout(`<section class="panel authPanel"><span class="badge amber">İzleme</span><h1>Henüz izlenecek oyun yok</h1><p class="muted">Önce yönetimden oyun ve YouTube bağlantısı ekle.</p><a class="btn primary" href="/yonetim/oyun-ekle">Oyun Ekle</a></section>`);
  const activeSeries=seriesName || game.seriesName || '';
  const activeSeriesRows=activeSeries ? orderedSeriesRows(games.filter(g=>String(g.seriesName||'Serisiz Oyunlar')===activeSeries)) : [game];
  const totals=seriesTotals(activeSeriesRows);
  const episodes=loadEpisodes(game.id);
  const watched=Number(game.watchedEpisodeCount||0);
  const current=episodes.find(e=>Number(e.number)===epNo) || episodes.find(e=>Number(e.number)>watched) || episodes[0] || null;
  const embed=videoEmbedSrc(game,current); const settings=watchSettings(); const story=publicStoryForGame(game);
  const seriesTitle=activeSeries ? `${activeSeries} Serisi` : game.title;
  return layout(`<section class="watchHero seriesWatchHero"><div><span class="badge green">${activeSeries?'Tüm Seriyi İzle':'Site İçi İzleme'}</span><h1>${esc(seriesTitle)}</h1><p>${esc(activeSeries?`${activeSeries} içindeki oyunları sırayla izleyebilir, bölüm ilerlemesini takip edebilir ve listedeki oyunlar arasında geçiş yapabilirsin.`:story)}</p><div class="actions"><a class="btn secondary" href="/seriler">Serilere Dön</a><a class="btn secondary" href="/oyun-arsivi">Arşive Dön</a>${isYönetim()?`<a class="btn secondary" href="/yonetim/oyun-duzenle?id=${encodeURIComponent(game.id)}">Oyunu Düzenle</a>`:''}</div></div><aside><b>${esc(settings.quality)} kalite tercihi</b><span>${activeSeriesRows.length} oyun • ${totals.episodes} bölüm • ${totals.watched} izlendi</span><small>Aktif oyun: ${esc(game.title)}. YouTube oynatıcısında kaliteyi ayrıca dişli simgesinden değiştirebilirsin.</small></aside></section>${activeSeriesRows.length>1?`<section class="seriesWatchStrip">${activeSeriesRows.map((g,i)=>`<a class="seriesWatchGame ${String(g.id)===String(game.id)?'active':''}" href="/izle?series=${encodeURIComponent(activeSeries)}&id=${encodeURIComponent(g.id)}"><b>${i+1}</b><span>${esc(g.title)}</span><small>${Number(g.watchedEpisodeCount||0)}/${loadEpisodes(g.id).length || Number(g.episodeCount||0)} bölüm</small></a>`).join('')}</section>`:''}<section class="watchLayout"><article class="watchPlayer">${embed?`<iframe src="${esc(embed)}" title="${esc(game.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`:`<div class="empty playerEmpty">Bu oyun için video veya playlist bağlantısı yok. Düzenleme ekranından YouTube video/playlist URL ekle.</div>`}<div class="qualityPanel"><b>Kalite Ayarları</b><div class="qualityButtons">${['Otomatik','1080p','720p','480p','360p'].map(q=>`<button class="miniBtn ${settings.quality===q?'primary':''}" data-quality="${q}">${q}</button>`).join('')}</div><p class="muted">Tercih siteye kaydedilir. YouTube iframe içinde gerçek kalite seçimi oynatıcının kendi ayarlarından yapılır.</p></div></article><aside class="episodeSidebar"><h2>${esc(game.title)} Bölümleri</h2>${episodes.length?episodes.map(ep=>`<a class="watchEpisode ${current && String(current.id)===String(ep.id)?'active':''} ${Number(ep.number)<=watched?'watched':''}" href="/izle?${activeSeries?`series=${encodeURIComponent(activeSeries)}&`:''}id=${encodeURIComponent(game.id)}&ep=${encodeURIComponent(ep.number)}"><img src="${esc(ep.thumbnail||'/assets/hayatimiz-kapak.png')}" onerror="this.src='/assets/hayatimiz-kapak.png'" alt="${esc(ep.title)}"><span><b>${esc(ep.number)}. Bölüm</b><small>${esc(ep.title)}</small></span></a>`).join(''):`<div class="empty compactEmpty">Bölüm listesi yok. Playlist çekilirse burada görünür.</div>`}</aside></section><section class="panel storyPanel"><span class="badge">Hikaye</span><h2>${esc(game.title)} Hikaye Anlatımı</h2><p>${esc(story)}</p></section>`);
}

function alphabetPage(){
  return layout(`<section class="archiveHero alphaHero"><div><span class="badge green">🔤 Alfabetik sıralama taşındı</span><h1>🔤 Artık ayrı bölüm yok</h1><p>🎮 A-Z, Z-A ve 0-9 önce sıralama artık Oyun Arşivi ve Seriler sayfalarının içinde çalışıyor. Menüden ayrı “Alfabetik Sıralama” bölümü kaldırıldı.</p></div><div class="actions"><a class="btn primary" href="/oyun-arsivi?sort=az">🎮 Oyunlarda A-Z Aç</a><a class="btn secondary" href="/seriler?sort=az">🎬 Serilerde A-Z Aç</a></div></section>`);
}
function siteGuidePage(){
  const games=loadGames(); const notes=loadNotes(); const events=loadEvents(); const model=buildArchiveModel(games);
  return layout(`<section class="guideHero"><div><span class="badge green">📘 Site Rehberi • v2.1.1 FIX</span><h1>📘 Hayatımız Oyun artık ne hale geldi?</h1><p>🎮 Site artık oyun arşivi, seri takibi, site içi izleme, kalite tercihi, Supabase kalıcı veri, bakım modu, yayın takvimi ve güncelleme notlarını tek profesyonel panelde toplayan bir YouTube oyun arşivi merkezidir.</p></div><div class="guideScore"><b>✅ ${model.games.length}</b><span>🎮 oyun kaydı</span><b>🎬 ${model.series.size}</b><span>seri grubu</span><b>▶️ ${model.episodeTotal}</b><span>bölüm kapasitesi</span></div></section><section class="guideGrid"><article class="guideCard"><h2>🏠 Ana Sayfa</h2><p>✨ Büyük vitrin, hızlı arama, öne çıkan oyunlar, devam eden seriler, son güncelleme ve hızlı işlem kartları burada görünür.</p><a class="miniBtn primary" href="/ana-sayfa">🏠 Aç</a></article><article class="guideCard"><h2>🎮 Oyun Arşivi</h2><p>🔎 Arama, durum, tür, seri, etiket ve 🔤 A-Z / Z-A / 0-9 önce sıralama burada çalışır. Alfabetik sıralama artık ayrı menü değildir.</p><a class="miniBtn primary" href="/oyun-arsivi?sort=az">🎮 Aç</a></article><article class="guideCard"><h2>🎬 Seriler</h2><p>▶️ Tüm Seriyi İzle, seri içindeki oyunları sıralı görme ve seri durumlarına göre gruplama burada bulunur.</p><a class="miniBtn primary" href="/seriler?sort=az">🎬 Aç</a></article><article class="guideCard"><h2>▶️ Siteden İzle</h2><p>📺 YouTube video veya oynatma listesi site içinde açılır. Kalite tercihi Otomatik / 1080p / 720p / 480p / 360p olarak saklanır.</p><a class="miniBtn primary" href="/izle">▶️ Aç</a></article><article class="guideCard"><h2>🗂️ Koleksiyonlar</h2><p>📦 Seri, tür ve koleksiyon grupları aynı oyun verisinden hesaplanır. Sayaçlar oyun silme/ekleme sonrası otomatik güncellenir.</p><a class="miniBtn primary" href="/koleksiyonlar">🗂️ Aç</a></article><article class="guideCard"><h2>🛠️ Bakım ve Güvenlik</h2><p>🧰 Bakım modu açıldığında ziyaretçi bakım ekranı görür; yetkili giriş yapan kullanıcı siteyi ve yönetim panelini görebilir.</p>${isYönetim()?'<a class="miniBtn primary" href="/yonetim/bakim-modu">🛠️ Aç</a>':'<a class="miniBtn" href="/giris-yap">🔐 Yetkili Girişi</a>'}</article></section><section class="guideTimeline"><div class="sectionHead"><div><h2>📝 Son durum özeti</h2><p>📌 Güncelleme notları ve status her FIX ile güncel tutulur.</p></div></div>${notes.slice(0,5).map(n=>`<article class="guideNote"><span class="pill green">${esc(n.version||VERSION)} • ${esc(n.status||'Tamamlandı')}</span><h3>🧩 ${esc(n.title)}</h3><p>${esc(n.summary||n.description||'')}</p></article>`).join('')}<article class="guideNote"><span class="pill amber">📅 Takvim</span><h3>📅 ${events.length} yayın kaydı</h3><p>Yayın takvimi Supabase bağlıysa kalıcı kaydedilir; bağlantı yoksa yerel güvenli mod devrededir.</p></article></section>`);
}
function authorityGuidePage(){
  const roles=[['👑 Kurucu','Sitenin sahibi. Tüm yönetim alanlarını, kullanıcı yetkilerini, bakım modunu, oyunları, serileri, takvimi ve güncelleme notlarını yönetir.'],['🛡️ Moderatör','Yönetim paneline girebilir. Oyun/seri takibi, takvim ve temel düzenleme işlerinde yardımcı olur. Kurucu ayarlarını bozmayacak şekilde destek rolüdür.'],['✍️ İçerik Editörü','Oyun ekleme, hikaye metni, bölüm/playlist ve içerik düzenleme işlerinde kullanılır. Yayın arşivini içerik tarafında büyütür.'],['👤 Üye','Siteyi izleyen normal kullanıcıdır. Oyunları, serileri, arşivi ve siteden izleme alanlarını görür; yönetim alanlarına giremez.'],['🚫 Banlı','Güvenlik veya kullanım sebebiyle kısıtlanmış kullanıcıdır. Yönetim ve üyelik işlemlerine erişimi kapatılabilir.']];
  return layout(`<section class="guideHero authorityHero"><div><span class="badge green">👑 Yetkili Rehberi • Türkçe Roller</span><h1>👑 Yetkiler ne anlama geliyor?</h1><p>🛡️ Sitedeki roller tamamen Türkçe gösterilir. Kurucu, Moderatör, İçerik Editörü, Üye ve Banlı rolleri farklı erişim seviyeleri için kullanılır.</p></div><div class="actions"><a class="btn primary" href="/site-rehberi">📘 Site Rehberi</a>${isYönetim()?'<a class="btn secondary" href="/yonetim/kullanicilar">👥 Kullanıcıları Yönet</a>':'<a class="btn secondary" href="/giris-yap">🔐 Giriş Yap</a>'}</div></section><section class="roleGuideGrid">${roles.map(([title,text])=>`<article class="roleGuideCard"><h2>${title}</h2><p>${text}</p></article>`).join('')}</section><section class="panel guideRules"><h2>✅ Yetki kullanım kuralı</h2><p>👑 Kurucu ana karar rolüdür. 🛡️ Moderatör ve ✍️ İçerik Editörü içerik düzenlemeye yardımcı olur. 👤 Üyeler public siteyi kullanır. 🚫 Banlı rolü erişimi sınırlamak için saklanır.</p><p>🔐 Yönetim linkleri normal ziyaretçiye gösterilmez. 🛠️ Bakım modu açıkken ziyaretçi bakım ekranı görür, yetkili kullanıcı siteye devam eder.</p><p>🧾 Bu FIX ile İngilizce rol adları kullanıcı arayüzünde Türkçe/emojili hale getirildi.</p></section>`);
}
function usersPage(){ return adminOnly(()=>{ const local=localUserRows(); return layout(`<section class="archiveHero userHero"><div><span class="badge green">Kullanıcılar ve Yetkiler</span><h1>Kayıtlı Kullanıcıları Gör ve Yetki Ver</h1><p>Kurucu, Moderatör, İçerik Editörü ve Üye rolleri Türkçe gösterilir. Supabase bağlıysa kullanıcılar yenilenir; bağlı değilse yerel kayıtlar yönetilir.</p></div><button class="btn secondary" type="button" data-refresh-users>Supabase Kullanıcılarını Yenile</button></section><section class="panel"><h2>Kullanıcı Listesi</h2><div class="userList" data-user-list data-auto-users="1">${renderUserRows(local)}</div></section>`); }); }
function renderUserRows(rows){
  const list=Array.isArray(rows)?rows:[]; if(!list.length) return '<div class="empty">Henüz kayıtlı kullanıcı yok.</div>';
  const roles=[['user','Üye'],['editor','İçerik Editörü'],['moderator','Moderatör'],['kurucu','Kurucu'],['banned','Banlı']];
  return list.map(u=>`<article class="userRow" data-user-id="${esc(u.id)}" data-user-source="${esc(u.source||'Yerel')}"><div><b>${esc(u.displayName||u.full_name||u.email)}</b><small>${esc(u.email||'')} • ${esc(u.source||'Supabase/Yerel')}</small></div><span class="roleChip">${esc(roleLabel(u.role,u.email))}</span><select data-role-select>${roles.map(([value,label])=>`<option value="${value}" ${String(u.role)===value?'selected':''}>${label}</option>`).join('')}</select><button class="miniBtn primary" data-user-role-save>Yetkiyi Kaydet</button><button class="miniBtn danger" data-user-delete>Kullanıcıyı Sil</button></article>`).join('');
}
async function refreshUsersPanel(){
  const target=document.querySelector('[data-user-list]'); if(!target) return;
  target.innerHTML='<div class="empty">Kullanıcılar yükleniyor...</div>';
  try{
    const data=await apiJson('users-list',{adminToken:sessionToken()});
    const remote=(data.users||[]).map(u=>({id:u.id,email:u.email,displayName:u.full_name||u.displayName||u.email,role:u.role,is_active:u.is_active,source:'Supabase'}));
    const merged=[...remote];
    for(const u of localUserRows()){
      if(u.email && !merged.some(x=>String(x.email).toLowerCase()===String(u.email).toLowerCase())) merged.push(u);
    }
    saveUsers(merged.map(u=>({id:u.id,email:u.email,displayName:u.displayName,role:u.role,is_active:u.is_active,source:u.source})));
    target.innerHTML=renderUserRows(merged);
    toast('Kullanıcı listesi yenilendi.');
  }
  catch(err){ target.innerHTML=renderUserRows(localUserRows()); toast('Supabase kullanıcıları alınamadı, yerel liste gösteriliyor.'); }
}


function loginPage(){ return layout(`<section class="panel authPanel"><span class="badge">Üyelik geri geldi</span><h1>Giriş Yap</h1><p class="muted">Kurucu veya yetkili hesabıyla giriş yapınca yönetim paneli, mevcut oyunlar ve bakım modu görünür.</p><form class="formGrid" data-login-form><label class="field full">E-posta<input class="input" type="email" name="email" required placeholder="${esc(ADMIN_EMAILS[0])}"></label><label class="field full">Şifre<input class="input" type="password" name="password" required placeholder="Yerel şifren"></label><div class="full actions"><button class="btn primary" type="submit">Giriş Yap</button><a class="btn secondary" href="/kayit-ol">Kayıt Ol</a></div></form><p class="muted small">Bu paket yerel üyelik kabuğudur. Supabase üyelik sistemi v2.1.x adımında kalıcı sunucu auth sistemine taşınacak.</p></section>`); }
function registerPage(){ return layout(`<section class="panel authPanel"><span class="badge">Kayıt ol geri geldi</span><h1>Kayıt Ol</h1><p class="muted">Kurucu e-postasıyla kayıt olursan yönetim alanları açılır. Normal kullanıcıda yönetim bağlantıları gizli kalır.</p><form class="formGrid" data-register-form><label class="field full">Ad / Kanal Adı<input class="input" name="displayName" required placeholder="Hayatımız Oyun"></label><label class="field full">E-posta<input class="input" type="email" name="email" required placeholder="${esc(ADMIN_EMAILS[0])}"></label><label class="field full">Şifre<input class="input" type="password" name="password" required placeholder="Yerel şifre belirle"></label><div class="full actions"><button class="btn primary" type="submit">Kayıt Ol</button><a class="btn secondary" href="/giris-yap">Giriş Yap</a></div></form></section>`); }
function accountPage(){ const u=currentUser(); if(!u) return loginPage(); return layout(`<section class="panel authPanel"><span class="badge green">Oturum açık</span><h1>${esc(u.displayName||u.email)}</h1><p class="muted">Rol: <b>${esc(roleLabel(u.role, u.email))}</b></p><div class="actions">${isYönetim()?'<a class="btn primary" href="/yonetim">Yönetim Paneli</a>':''}<button class="btn danger" data-action="logout">Çıkış Yap</button></div></section>`); }
function adminMetric(label, value, hint, cls=''){
  return `<article class="adminMetric ${cls}"><span>${esc(label)}</span><b>${esc(value)}</b><small>${esc(hint)}</small></article>`;
}
function adminActionCard(href, icon, title, text, state='Hazır'){
  return `<a class="adminActionCard" href="${href}"><span class="adminActionIcon">${icon}</span><strong>${esc(title)}</strong><em>${esc(text)}</em><small>${esc(state)}</small></a>`;
}
function safeErrorPanel(message='Sayfa güvenli moda geçti.'){
  return layout(`<section class="adminSafeError"><span class="badge red">Güvenli Hata Ekranı</span><h1>Sayfa boş kalmadı</h1><p>${esc(message)}</p><div class="actions"><a class="btn primary" href="/yonetim">Yönetim Paneli</a><a class="btn secondary" href="/ana-sayfa">Ana Sayfa</a><button class="btn secondary" data-action="hard-refresh">Sayfayı Yenile</button></div></section>`);
}
function admin(){ return adminOnly(()=>{
  try{
    const games=loadGames();
    const events=loadEvents();
    const notes=loadNotes();
    const maintenance=loadMaintenance();
    const user=currentUser() || {};
    const sync=syncState();
    const statusCounts=countBy(games,'status');
    const completed=Number(statusCounts['Tamamlanan']||0);
    const active=Number(statusCounts['Devam Eden']||0);
    const planned=Number(statusCounts['Yakında']||0) + Number(statusCounts['Planlandı']||0);
    const episodeTotal=games.reduce((sum,g)=>sum+Number(g.episodeCount||0),0);
    const cards=[
      ['/yonetim/oyun-ekle','➕','Oyun Ekle','Profesyonel kartlı form, RAWG/Steam ve YouTube oynatma listesi alanları.','v2.0.8 aktif'],
      ['/yonetim/mevcut-oyunlar','🎮','Mevcut Oyunlar','Kayıtlı oyunları kontrol et, tek tek veya toplu sil.','Kalıcı silme aktif'],
      ['/yonetim/bolum-takibi','▶️','Bölüm Takibi','Oynatma listesi bölümleri, kaldığımız bölüm ve +1/-1 takip.','Aktif'],
      ['/koleksiyonlar','🗂️','Koleksiyonlar','Seri, tür, durum ve koleksiyon sayaçlarını ziyaretçi tarafta kontrol et.','v2.0.9'],
      ['/yonetim/yayin-takvimi','📅','Yayın Takvimi','Manuel yayın tarihleri ve video linkleri.','Korundu'],
      ['/yonetim/guncelleme-notlari','📝','Güncelleme Notları','Tamamlanan ve planlanan notları düzenle.','v2.0.9 işlendi'],
      ['/yonetim/bakim-modu','🛠️','Bakım Modu','Ziyaretçi siteyi bakım ekranına al, admin bypass korunsun.','Yetki korumalı'],
      ['/oyun-arsivi','🗂️','Ziyaretçi Arşiv','Kullanıcı tarafındaki kartları ve filtreleri kontrol et.','Açık']
    ];
    return layout(`<section class="adminDashboardHero"><div><span class="badge green">${VERSION} • Supabase Kalıcı Veri</span><h1>🛡️ Profesyonel Yönetim Merkezi</h1><p>Yönetim paneli artık tek profesyonel merkez olarak çalışır. Sol menü kaldırıldı; oyun ekleme, mevcut oyunlar, seriler, bölüm takibi, takvim, notlar, bakım modu ve yetkiler panel içinden açılır. Hata olursa güvenli ekran devreye girer.</p><div class="adminHeroActions"><a class="btn primary" href="/yonetim/oyun-ekle">Yeni Oyun Ekle</a><a class="btn secondary" href="/yonetim/mevcut-oyunlar">Mevcut Oyunlar</a><a class="btn secondary" href="/yonetim/bolum-takibi">Bölüm Takibi</a><button class="btn secondary" type="button" data-supabase-refresh>Supabase Yenile</button></div></div><aside><b>${esc(roleLabel(user.role, user.email))}</b><span>${esc(user.email||ADMIN_EMAILS[0])}</span><small>${maintenance.enabled?'Bakım modu açık, yetkili geçişi aktif.':'Bakım modu kapalı, site ziyaretçilere açık.'}</small><small>Veri: ${esc(sync.status||sync.mode)}</small></aside></section><section class="adminMetricGrid">${adminMetric('Toplam Oyun',games.length,'Kalıcı kayıt sayısı')}${adminMetric('Devam Eden',active,'Aktif seri/oyun')}${adminMetric('Tamamlanan',completed,'Biten arşivler')}${adminMetric('Plan/Yakında',planned,'Gelecek içerikler')}${adminMetric('Bölüm',episodeTotal,'Toplam bölüm alanı')}${adminMetric('Koleksiyon',buildArchiveModel(games).collections.size,'Seri/tür koleksiyonu')}${adminMetric('Takvim',events.length,'Manuel yayın kaydı')}${adminMetric('Not',notes.length,'Güncelleme notu')}${adminMetric('Bakım',maintenance.enabled?'Açık':'Kapalı',maintenance.enabled?'Ziyaretçi bakım ekranı görür':'Site normal açılır',maintenance.enabled?'danger':'ok')}</section><div class="sectionHead"><div><h2>Hızlı İşlemler</h2><p>Tüm yönetim araçları artık tek panel içinden açılır; sol menü kullanılmaz, üst menü sabit kalır.</p></div></div><section class="adminActionGrid">${cards.map(c=>adminActionCard(...c)).join('')}</section><section class="adminStatusGrid"><article class="panel"><h2>Sistem Sağlığı</h2><div class="roadList"><span class="done">Boş/siyah ekran koruması aktif</span><span class="done">Yönetim bağlantıları sadece yetkili hesapta görünür</span><span class="done">Kayıt ol / giriş yap sayfaları korunuyor</span><span class="done">Bakım modu ziyaretçi kullanıcıya ayrı ekran gösterir</span><span class="done">Şema artık tablo/veri sıfırlamaz</span><span class="done">YouTube oynatma listesi ve bölüm takibi aktif</span><span class="done">Supabase oyun/takvim/not/bakım köprüsü aktif: ${esc(sync.status||'yerel')}</span></div></article><article class="panel"><h2>Sıradaki Adım</h2><article class="note"><span class="pill green">v2.1.2 • Tamamlandı</span><h3>Public Yayın Öncesi Stabilite</h3><p>Public açılış, mobil/tablet/masaüstü görünüm, güvenli hata ekranı, boş ekran koruması ve site durum raporu tamamlandı. Sıradaki paket Supabase veri/admin güçlendirme olacak.</p></article></article></section>`);
  }catch(err){
    console.error('Yönetim paneli güvenli hata:', err);
    return safeErrorPanel(err && err.message ? err.message : 'Yönetim paneli oluşturulurken hata yakalandı.');
  }
}); }
function gameForm(){ return adminOnly(()=>{
  const params=queryParams();
  const editId=params.get('id') || '';
  const rows=loadGames();
  const existing=editId ? rows.find(g=>String(g.id)===String(editId)) : null;
  const editing=!!existing;
  const game=existing || {title:'',status:'Devam Eden',genre:'',tags:'',seriesName:'',cover:'/assets/hayatimiz-kapak.png',banner:'',releaseDate:'',platforms:'',description:'',storyText:'',youtubePlaylistUrl:'',youtubePlaylistId:'',rawgId:'',steamAppId:'',episodeCount:0,watchedEpisodeCount:0};
  const episodes=editing ? loadEpisodes(game.id) : [];
  const statusOptions=['Devam Eden','Tamamlanan','Yakında','Planlandı','Ara Verildi'];
  const quickTags=['Türkçe Altyazılı','Türkçe Dublaj','Hikaye','Canlı Yayın','Playlist','Korku','Aksiyon','Macera'];
  const quickGenres=['Aksiyon','Macera','Korku','RPG','Bilim Kurgu','Simülasyon','YouTube Arşivi'];
  return layout(`<section class="gameEditorHero"><div><span class="badge green">${VERSION} • Supabase Kalıcı Veri</span><h1>${editing?'Oyunu Düzenle':'Oyun Ekle'}</h1><p>Oyun formu korunuyor. Bu sürümde kayıtlar önce local güvenli alana yazılır, yetkili Supabase oturumu varsa API üzerinden kalıcı veriye senkronlanır.</p><div class="actions"><a class="btn secondary" href="/yonetim/mevcut-oyunlar">Mevcut Oyunlar</a><a class="btn secondary" href="/yonetim/bolum-takibi">Bölüm Takibi</a><a class="btn secondary" href="/oyun-arsivi">Arşivi Gör</a></div></div><aside><b>${editing?'Düzenleme modu':'Yeni kayıt modu'}</b><span>${editing?esc(game.title):'Kayıt local + Supabase senkron sistemiyle oluşturulur.'}</span><small>Boş/siyah ekran koruması aktif kalır.</small></aside></section><form class="gameEditorLayout" data-game-form><input type="hidden" name="gameId" value="${fieldValue(game,'id')}"><input type="hidden" name="youtubePlaylistId" value="${fieldValue(game,'youtubePlaylistId')}"><textarea hidden name="episodesJson">${esc(JSON.stringify(episodes))}</textarea><section class="gameEditorMain"><article class="formSection"><div class="formSectionTitle"><span>01</span><div><h2>Temel Bilgiler</h2><p>Oyun adı, durum, tür ve seri alanları ayrı tutulur.</p></div></div><div class="formGrid pro"><label class="field full">Oyun Adı<input class="input" name="title" required value="${fieldValue(game,'title')}" placeholder="Örn: 007 First Light"></label><label class="field">Durum<select name="status">${statusOptions.map(s=>`<option ${selectedOption(game.status,s)}>${esc(s)}</option>`).join('')}</select></label><label class="field">Tür / Kategori<input class="input" name="genre" value="${fieldValue(game,'genre')}" placeholder="Korku, Aksiyon, Macera" list="genreSuggestions"></label><label class="field">Seri Adı<input class="input" name="seriesName" value="${fieldValue(game,'seriesName')}" placeholder="Örn: James Bond"></label><label class="field">Çıkış Tarihi<input class="input" name="releaseDate" value="${fieldValue(game,'releaseDate')}" placeholder="2026-05-27 veya 2026"></label><label class="field">Toplam Bölüm<input class="input" type="number" min="0" name="episodeCount" value="${fieldValue(game,'episodeCount',0)}"></label><label class="field">Kaldığımız Bölüm<input class="input" type="number" min="0" name="watchedEpisodeCount" value="${fieldValue(game,'watchedEpisodeCount',0)}"></label><label class="field">Platformlar<input class="input" name="platforms" value="${fieldValue(game,'platforms')}" placeholder="PC, PlayStation 5, Xbox"></label></div></article><article class="formSection"><div class="formSectionTitle"><span>02</span><div><h2>Görseller</h2><p>Kapak ve banner alanları ayrı tutulur.</p></div></div><div class="formGrid pro"><label class="field full">Kapak URL<input class="input" name="cover" value="${fieldValue(game,'cover','/assets/hayatimiz-kapak.png')}" placeholder="/assets/hayatimiz-kapak.png veya https://..."></label><label class="field full">Banner URL<input class="input" name="banner" value="${fieldValue(game,'banner')}" placeholder="Hero/banner görseli URL"></label></div></article><article class="formSection"><div class="formSectionTitle"><span>03</span><div><h2>Etiketler ve Kaynaklar</h2><p>Etiketler status/sürüm alanına karışmaz. RAWG, Steam ve YouTube alanları güvenli panelle yönetilir.</p></div></div><div class="formGrid pro"><label class="field full">Etiketler<input class="input" name="tags" value="${fieldValue(game,'tags')}" placeholder="Türkçe Altyazılı, Hikaye, Playlist"></label><label class="field full">YouTube Playlist URL<input class="input" name="youtubePlaylistUrl" value="${fieldValue(game,'youtubePlaylistUrl')}" placeholder="https://youtube.com/playlist?list=..."></label><div class="youtubeToolbox full"><div><b>v2.0.8 YouTube Playlist Paneli</b><p>Playlist linkinden bölüm listesini çek, toplam bölüm sayısını doldur ve kaldığımız bölüm takibini güncelle. API hata verse bile yerel güvenli liste oluşturulur.</p></div><div class="metaToolActions"><button class="btn primary" type="button" data-youtube-action="sync-form">Oynatma Listesi Bölümlerini Çek</button><button class="btn secondary" type="button" data-youtube-action="count-form">Sadece Bölüm Sayısını Doldur</button></div><small data-youtube-status>${episodes.length?`${episodes.length} bölüm kayıtlı.`:'Playlist bekleniyor.'}</small><div data-youtube-preview>${renderEpisodeList(episodes, Number(game.watchedEpisodeCount||0))}</div></div><label class="field">RAWG ID<input class="input" name="rawgId" value="${fieldValue(game,'rawgId')}" placeholder="RAWG ID"></label><label class="field">RAWG Slug<input class="input" name="rawgSlug" value="${fieldValue(game,'rawgSlug')}" placeholder="rawg-slug"></label><label class="field">Steam App ID<input class="input" name="steamAppId" value="${fieldValue(game,'steamAppId')}" placeholder="Steam ID"></label><label class="field">Puan<input class="input" name="score" value="${fieldValue(game,'score',0)}" placeholder="8.5"></label><label class="field full">Meta Kaynağı<input class="input" name="metaSource" value="${fieldValue(game,'metaSource')}" placeholder="RAWG / Steam / Yerel meta"></label><input type="hidden" name="metaCheckedAt" value="${fieldValue(game,'metaCheckedAt')}"><div class="metaToolbox full"><div><b>v2.0.7 Meta Paneli</b><p>Oyun adından kapak, banner, tarih, tür, seri, platform ve puan önerisi çek.</p></div><div class="metaToolActions"><button class="btn primary" type="button" data-meta-action="rawg">RAWG / Meta Çek</button><button class="btn secondary" type="button" data-meta-action="steam">Steam Kontrol</button><button class="btn secondary" type="button" data-meta-action="local">Yerel Güvenli Doldur</button></div><small data-meta-status>Meta bekleniyor.</small></div></div></article><article class="formSection"><div class="formSectionTitle"><span>04</span><div><h2>Hikaye ve Açıklama</h2><p>Kısa açıklama kartlarda, hikaye alanı detay anlatımında kullanılacak.</p></div></div><div class="formGrid pro"><label class="field full">Kısa Açıklama<textarea name="description" class="textareaTall" placeholder="Kartlarda görünecek kısa açıklama">${fieldValue(game,'description')}</textarea></label><label class="field full">Hikaye / Arşiv Anlatımı<textarea name="storyText" class="textareaTall" placeholder="Örn: Görevin henüz başında, çiçeği burnunda bir ajan olan James Bond...">${fieldValue(game,'storyText')}</textarea></label><div class="storyToolbox full"><div><b>Profesyonel Hikaye Oluştur</b><p>Tür ve platform saymak yerine karakter, görev, atmosfer ve bölüm takibi odaklı Türkçe hikaye metni üretir.</p></div><button class="btn secondary" type="button" data-story-action="generate">Hikayeyi Düzgün Oluştur</button></div></div></article><div class="formSaveBar"><button class="btn primary" type="submit">${editing?'Oyunu Güncelle':'Oyunu Kaydet'}</button><a class="btn secondary" href="/yonetim/mevcut-oyunlar">Vazgeç</a></div></section><aside class="editorSide"><article class="previewBox"><img src="${esc(game.cover||'/assets/hayatimiz-kapak.png')}" onerror="this.src='/assets/hayatimiz-kapak.png'" alt="Önizleme"><span class="pill ${statusClass(game.status)}">${esc(game.status||'Devam Eden')}</span><h3>${esc(game.title||'Oyun önizleme')}</h3><p>${esc(game.description||'Kayıt sonrası arşiv kartlarında görünecek açıklama.')}</p></article><article class="editorHint"><h3>Bölüm Durumu</h3><p>${Number(game.watchedEpisodeCount||0)} / ${episodes.length || Number(game.episodeCount||0)} bölüm takip ediliyor.</p><a class="miniBtn" href="/yonetim/bolum-takibi">Bölüm Takibini Aç</a></article><article class="editorHint"><h3>Hızlı Tür Önerileri</h3><div class="tags">${quickGenres.map(t=>`<span>${esc(t)}</span>`).join('')}</div></article><article class="editorHint"><h3>Kural</h3><p>YouTube oynatma listesi sistemi kontrollü geri geldi. Eski kırık otomasyon aynen basılmadı; boş ekran koruması korunuyor.</p></article></aside><datalist id="genreSuggestions">${quickGenres.map(t=>`<option value="${esc(t)}"></option>`).join('')}</datalist></form>`);
}); }
function seriesManager(){ return adminOnly(()=>{
  const games=buildArchiveModel(loadGames()).games;
  const model=buildArchiveModel(games);
  const params=queryParams();
  const selected=String(params.get('series') || Array.from(model.series.keys())[0] || '').trim();
  const seriesNames=Array.from(model.series.keys()).sort((a,b)=>a.localeCompare(b,'tr'));
  const selectedRows=selected ? orderedSeriesRows(games.filter(g=>String(g.seriesName||'Serisiz Oyunlar')===selected)) : [];
  const totals=seriesTotals(selectedRows);
  const allRows=games.map((g,i)=>({...g, _seriesChecked:String(g.seriesName||'Serisiz Oyunlar')===selected, _seriesOrder:Number(g.seriesOrder ?? g.sortOrder ?? i)}));
  return layout(`<section class="archiveHero seriesAdminHero"><div><span class="badge green">v2.1.1 FIX • Serileri Yönet</span><h1>Seri Yönetimi</h1><p>Seri içindeki oyunları seç, seri adını düzenle, oyun sırasını sürükle-bırak veya sayı yazarak değiştir. Kaydet dediğinde yerel kayıt ve Supabase kalıcı kayıt birlikte denenir.</p></div><div class="actions"><a class="btn secondary" href="/seriler">Seriler</a><a class="btn secondary" href="/yonetim/mevcut-oyunlar">Mevcut Oyunlar</a><a class="btn primary" href="${selected?seriesWatchHref(selected):'/izle'}">Tüm Seriyi İzle</a></div></section><section class="seriesAdminGrid"><aside class="panel seriesAdminList"><h2>Seri Listesi</h2><div class="miniList">${seriesNames.length?seriesNames.map(name=>{ const rows=orderedSeriesRows(model.series.get(name)||[]); const t=seriesTotals(rows); return `<a class="seriesAdminLink ${name===selected?'active':''}" href="/yonetim/seriler?series=${encodeURIComponent(name)}"><b>${esc(name)}</b><small>${rows.length} oyun • ${t.episodes} bölüm • ${t.pct}% takip</small></a>`; }).join(''):'<div class="empty compactEmpty">Henüz seri yok.</div>'}</div></aside><form class="panel seriesEditor" data-series-form><input type="hidden" name="oldSeriesName" value="${esc(selected)}"><div class="sectionHead compact"><div><h2>${selected?esc(selected):'Yeni Seri'} Düzenle</h2><p>${selectedRows.length} oyun seçili • ${totals.episodes} bölüm • ${totals.pct}% takip</p></div><button class="btn primary" type="submit">Seriyi Kalıcı Kaydet</button></div><label class="field full">Seri Adı<input class="input" name="seriesName" required value="${esc(selected)}" placeholder="Örn: Alan Wake"></label><div class="seriesEditorHelp"><span>Sürükle-bırak: satırı tutup taşı</span><span>Sayı ile sıra: Sıra alanına 1, 2, 3 yaz</span><span>Seçim: oyunu seriye dahil et / çıkar</span></div><div class="seriesDndList" data-series-dnd-list>${allRows.map((g,i)=>{ const order=selectedRows.findIndex(x=>String(x.id)===String(g.id)); const value=order>=0?order+1:(i+1); return `<article class="seriesDndItem ${g._seriesChecked?'selected':''}" draggable="true" data-series-dnd-item data-game-id="${esc(g.id)}"><div class="dragHandle" title="Sürükle bırak">☰</div><label class="checkLine"><input type="checkbox" name="gameIds" value="${esc(g.id)}" ${g._seriesChecked?'checked':''}> <span>Seriye dahil</span></label><img src="${esc(g.cover||'/assets/hayatimiz-kapak.png')}" onerror="this.src='/assets/hayatimiz-kapak.png'" alt="${esc(g.title)}"><div class="seriesDndTitle"><b>${esc(g.title)}</b><small>${esc(g.seriesName||'Serisiz')} • ${esc(g.status||'Durum yok')}</small></div><label class="orderField">Sıra<input class="input" type="number" min="1" name="order__${esc(g.id)}" value="${esc(value)}" data-series-order-input></label><div class="tableActions"><button class="miniBtn" type="button" data-series-row-up>↑</button><button class="miniBtn" type="button" data-series-row-down>↓</button><a class="miniBtn" href="/yonetim/oyun-duzenle?id=${encodeURIComponent(g.id)}">Oyun</a></div></article>`; }).join('')}</div><div class="formSaveBar"><button class="btn primary" type="submit">Seriyi ve Sıralamayı Kaydet</button><a class="btn secondary" href="/seriler">Seriler Sayfası</a></div></form></section>`);
}); }

function currentGamesYönetim(){ return adminOnly(()=>{ const games=buildArchiveModel(loadGames()).games; const sync=syncState(); return layout(`<div class="sectionHead"><div><h2>Mevcut Oyunlar</h2><p>${games.length} kayıt listeleniyor. Veri durumu: ${esc(sync.status||sync.mode)}. v2.1.1 ile Supabase kalıcı site verileri kontrollü geri geldi.</p></div><div class="actions"><a class="btn primary" href="/yonetim/oyun-ekle">Yeni Oyun</a><a class="btn secondary" href="/koleksiyonlar">Koleksiyonlar</a><a class="btn secondary" href="/yonetim/seriler">Serileri Yönet</a><a class="btn secondary" href="/yonetim/bolum-takibi">Bölüm Takibi</a><button class="btn danger" data-delete-all-games>Tüm Oyunları Sil</button><button class="btn secondary" data-reset-demo-games>Örnekleri Geri Yükle</button></div></div><div class="panel tablePanel">${games.length?`<table class="table adminGamesTable"><thead><tr><th>Sıra</th><th>Oyun</th><th>Durum</th><th>Koleksiyon</th><th>Bölüm</th><th>İşlem</th></tr></thead><tbody>${games.map((g,i)=>{ const eps=loadEpisodes(g.id); const total=eps.length || Number(g.episodeCount||0); return `<tr><td><b>#${i+1}</b><div class="tableActions"><button class="miniBtn" data-move-game="${esc(g.id)}" data-delta="-1">↑</button><button class="miniBtn" data-move-game="${esc(g.id)}" data-delta="1">↓</button></div></td><td><b>${esc(g.title)}</b><small>${esc(g.releaseDate||'Tarih yok')} • ${g.youtubePlaylistUrl?'Oynatma listesi var':'Oynatma listesi yok'}</small></td><td><span class="pill ${statusClass(g.status)}">${esc(g.status)}</span><small>${esc(statusBucket(g.status))}</small></td><td><b>${esc(collectionName(g))}</b><small>${esc(g.genre||'-')} • ${esc(g.seriesName||'Serisiz')}</small></td><td><b>${Number(g.watchedEpisodeCount||0)} / ${total}</b><small>${g.episodeSyncedAt?'Senkronlandı':'Bekliyor'}</small></td><td><div class="tableActions"><a class="miniBtn" href="/yonetim/oyun-duzenle?id=${encodeURIComponent(g.id)}">Düzenle</a><button class="miniBtn" data-sync-game-playlist="${esc(g.id)}">Oynatma Listesi Çek</button><button class="miniBtn danger" data-delete-game="${esc(g.id)}">Sil</button></div></td></tr>`; }).join('')}</tbody></table>`:'<div class="empty">Kayıtlı oyun yok. Bu durum artık korunur; sayfa yenilenince demo oyunlar geri gelmez.</div>'}</div>`); }); }

function episodeTracker(){ return adminOnly(()=>{ const games=loadGames(); return layout(`<div class="sectionHead"><div><h2>Bölüm Takibi</h2><p>YouTube oynatma listesiten çekilen bölümler ve kaldığımız bölüm kontrolü.</p></div><div class="actions"><a class="btn primary" href="/yonetim/oyun-ekle">Oyun Ekle</a><a class="btn secondary" href="/yonetim/mevcut-oyunlar">Mevcut Oyunlar</a></div></div><section class="episodeYönetimGrid">${games.length?games.map(g=>{ const eps=loadEpisodes(g.id); const total=eps.length || Number(g.episodeCount||0); const watched=Number(g.watchedEpisodeCount||0); return `<article class="episodeGamePanel"><div class="episodeGameHead"><img src="${esc(g.cover||'/assets/hayatimiz-kapak.png')}" onerror="this.src='/assets/hayatimiz-kapak.png'" alt="${esc(g.title)}"><div><span class="pill ${statusClass(g.status)}">${esc(g.status)}</span><h3>${esc(g.title)}</h3><p>${esc(g.seriesName||'Serisiz')} • ${watched}/${total} bölüm</p></div></div><div class="progressMini"><i><span style="width:${total?Math.round((watched/total)*100):0}%"></span></i><small>Kaldığımız bölüm: ${watched}</small></div><div class="episodeActions"><button class="miniBtn primary" data-sync-game-playlist="${esc(g.id)}">Oynatma Listesi Bölümlerini Çek</button><button class="miniBtn" data-progress-game="${esc(g.id)}" data-delta="1">+1 Bölüm</button><button class="miniBtn" data-progress-game="${esc(g.id)}" data-delta="-1">-1 Bölüm</button><a class="miniBtn" href="/yonetim/oyun-duzenle?id=${encodeURIComponent(g.id)}">Düzenle</a></div>${renderEpisodeList(eps, watched)}</article>`; }).join(''):'<div class="empty">Bölüm takibi için önce oyun ekle.</div>'}</section>`); }); }
function calendar(){ return adminOnly(()=>{ const rows=loadEvents(); const sync=syncState(); return layout(`<div class="sectionHead"><div><h2>Yayın Takvimi</h2><p>Yayın kayıtları Supabase <b>site_calendar_events</b> tablosuna kaydedilir. Servis veya ortam ayarı yoksa yerel güvenli mod korunur.</p><small class="muted">Veri durumu: ${esc(sync.status||sync.mode)}</small></div><div class="actions"><button class="btn secondary" type="button" data-refresh-calendar>Supabase Takvimi Yenile</button></div></div><section class="panels"><form class="panel formGrid" data-event-form><label class="field full">Başlık<input class="input" name="title" required placeholder="Örn: Alan Wake 2 Bölüm 3"></label><label class="field">Tarih<input class="input" type="date" name="date" required></label><label class="field">Saat<input class="input" name="time" value="20:00"></label><label class="field">Tür<select name="type"><option>Ana Yayın</option><option>Video</option><option>Canlı Yayın</option><option>Plan</option></select></label><label class="field">Oyun / Seri<input class="input" name="gameTitle" placeholder="Oyun adı"></label><label class="field">Bölüm<input class="input" name="episodeNumber" placeholder="2. Bölüm"></label><label class="field full">Video URL<input class="input" name="videoUrl" placeholder="https://youtube.com/..."></label><label class="field full">Not<textarea name="note" placeholder="Yayın notu, yapılacaklar veya açıklama"></textarea></label><div class="full"><button class="btn primary" type="submit">Yayını Kalıcı Kaydet</button></div></form><div class="panel"><h2>Kayıtlı Yayınlar</h2><div class="miniList">${rows.length?rows.map((e,i)=>`<article class="event"><span class="pill">${esc(e.date||'Tarih yok')} • ${esc(e.time||'20:00')} • ${esc(e.type||'Yayın')}</span><h3>${esc(e.title||'Yayın')}</h3><p>${esc(e.gameTitle||'')} ${e.episodeNumber?`• ${esc(e.episodeNumber)}`:''}</p><p>${esc(e.note||e.videoUrl||'')}</p><button class="btn danger" data-delete-event="${i}">Sil</button></article>`).join(''):'<div class="empty">Henüz yayın kaydı yok.</div>'}</div></div></section>`); }); }
function updateNotes(){ return adminOnly(()=>{ const rows=loadNotes(); const sync=syncState(); return layout(`<div class="sectionHead"><div><h2>Güncelleme Notları</h2><p>Notlar Supabase <b>site_update_notes</b> tablosundan okunur/yazılır. Local güvenli mod korunur.</p><small class="muted">Veri durumu: ${esc(sync.status||sync.mode)}</small></div><div class="actions"><button class="btn secondary" type="button" data-refresh-notes>Supabase Notlarını Yenile</button></div></div><section class="panels"><form class="panel formGrid" data-note-form><label class="field">Sürüm<input class="input" name="version" value="v2.1.2"></label><label class="field">Durum<select name="status"><option>Tamamlandı</option><option>Planlandı</option></select></label><label class="field full">Başlık<input class="input" name="title" required placeholder="Güncelleme başlığı"></label><label class="field full">Özet<textarea name="summary" required placeholder="Bu sürümde yapılanları yaz..."></textarea></label><div class="full"><button class="btn primary" type="submit">Notu Kalıcı Kaydet</button></div></form><div class="panel"><h2>Kayıtlı Notlar</h2><div class="miniList">${rows.map((n,i)=>`<article class="note"><span class="pill ${String(n.status).includes('Plan')?'amber':'green'}">${esc(n.version||VERSION)} • ${esc(n.status||'Tamamlandı')}</span><h3>${esc(n.title)}</h3><p>${esc(n.summary||n.description||'')}</p><button class="btn danger" data-delete-note="${i}">Sil</button></article>`).join('')}</div></div></section>`); }); }
function maintenance(){ return adminOnly(()=>{ const m=loadMaintenance(); const sync=syncState(); return layout(`<div class="sectionHead"><div><h2>Bakım Modu</h2><p>Bakım modu Supabase <b>site_runtime_config.maintenance_mode</b> kaydından okunur/yazılır. Yetkili geçişi korunur.</p><small class="muted">Veri durumu: ${esc(sync.status||sync.mode)}</small></div><div class="actions"><button class="btn secondary" type="button" data-refresh-maintenance>Supabase Bakımı Yenile</button></div></div><form class="panel formGrid" data-maint-form><label class="field">Durum<select name="enabled"><option value="false" ${!m.enabled?'selected':''}>Kapalı</option><option value="true" ${m.enabled?'selected':''}>Açık</option></select></label><label class="field">Yüzde<input class="input" type="number" min="0" max="100" name="percent" value="${esc(m.percent||0)}"></label><label class="field full">Mesaj<input class="input" name="message" value="${esc(m.message||'Hayatımız Oyun kısa süreli bakımda.')}"></label><label class="field full">Tahmini Açılış<input class="input" name="eta" value="${esc(m.eta||'')}"></label><div class="full actions"><button class="btn primary" type="submit">Bakım Ayarını Kalıcı Kaydet</button><button type="button" class="btn secondary" data-action="maintenance-off">Bakımı Kapat</button></div></form><section class="panel" style="margin-top:16px"><h2>Önizleme</h2><p><b>Durum:</b> ${m.enabled?'<span class="pill red">Açık - ziyaretçi kullanıcı bakım ekranı görür</span>':'<span class="pill green">Kapalı - site normal açılır</span>'}</p><p>${esc(m.message||'Mesaj yok')}</p><p class="muted">${esc(m.eta||'Tahmini açılış girilmedi')} • ${esc(m.percent||0)}%</p></section>`); }); }
function notFound(){ return layout(`<section class="panel"><h1>Sayfa bulunamadı</h1><p class="muted">Bu rota stabil kabukta bulunamadı.</p><a class="btn primary" href="/ana-sayfa">Ana Sayfaya Dön</a></section>`); }

function publicStatusPage(){
  const games=loadGames();
  const model=buildArchiveModel(games);
  const notes=loadNotes();
  const events=loadEvents();
  const maintenance=loadMaintenance();
  const sync=syncState();
  const checks=[
    ['🏠 Ana Sayfa','Hazır','Profesyonel vitrin, arama, hızlı menü ve güncelleme paneli çalışıyor.'],
    ['🎮 Oyun Arşivi','Hazır','Arama, filtre, koleksiyon sayacı ve alfabetik sıralama arşiv içinde.'],
    ['🎬 Seriler','Hazır','Tüm seriyi izle, seri içi oyun listesi ve sıralama korunuyor.'],
    ['▶️ Siteden İzle','Hazır','YouTube video/playlist oynatıcı ve kalite tercihi güvenli modda.'],
    ['📘 Rehberler','Hazır','Site rehberi ve yetkili rehberi public kullanıcıya açık.'],
    ['🛠️ Bakım Modu', maintenance.enabled?'Açık':'Kapalı', maintenance.enabled?'Ziyaretçi bakım ekranı görür; yetkili bypass korunur.':'Site public kullanıma açık görünüyor.'],
    ['💾 Veri Durumu', sync.status||sync.mode, sync.message||'Supabase yoksa local güvenli mod çalışır.'],
    ['🛡️ Boş Ekran Koruması','Aktif','JS hata verse bile güvenli hata ekranı ve HTML açılışı devrede.']
  ];
  return layout(`<section class="archiveHero statusHero"><div><span class="badge green">🚀 ${VERSION} • Public Yayın Öncesi Stabilite</span><h1>📡 Site Durumu</h1><p>Bu sayfa yayın öncesi kontrol özetidir. Ana sayfa, oyun arşivi, seriler, site içi izleme, rehberler, bakım modu ve Supabase güvenli mod tek ekranda takip edilir.</p></div><div class="actions"><a class="btn primary" href="/ana-sayfa">🏠 Ana Sayfa</a><a class="btn secondary" href="/oyun-arsivi">🎮 Arşiv</a><a class="btn secondary" href="/site-rehberi">📘 Rehber</a></div></section><section class="archiveStats"><article><b>${games.length}</b><span>🎮 Oyun</span></article><article><b>${model.series.size}</b><span>🎬 Seri</span></article><article><b>${model.episodeTotal}</b><span>▶️ Bölüm</span></article><article><b>${notes.length}</b><span>📝 Not</span></article></section><section class="publicStatusGrid">${checks.map(([title,status,text])=>`<article class="statusCheckCard"><span class="pill ${String(status).includes('Hazır')||String(status).includes('Aktif')||String(status).includes('Kapalı')?'green':'amber'}">${esc(status)}</span><h3>${esc(title)}</h3><p>${esc(text)}</p></article>`).join('')}</section><section class="panel publishChecklist"><h2>✅ Yayın Öncesi Kontrol Listesi</h2><div class="roadList"><span class="done">Ana sayfa boş ekrana düşmez</span><span class="done">Mobil/tablet/masaüstü buton taşmaları azaltıldı</span><span class="done">Kayıt ol / giriş yap / profil / çıkış bağlantıları korunuyor</span><span class="done">Yönetim bağlantıları yetkisiz kullanıcıya gizli</span><span class="done">Bakım modu açıkken yetkili giriş bypass korunuyor</span><span class="done">Güncelleme notları ve status v2.1.2 olarak güncel</span></div></section><section class="panel"><h2>📝 Son Güncellemeler</h2><div class="miniList">${notes.slice(0,6).map(n=>`<article class="note"><span class="pill ${String(n.status).includes('Plan')?'amber':'green'}">${esc(n.version||VERSION)} • ${esc(n.status||'Tamamlandı')}</span><h3>${esc(n.title)}</h3><p>${esc(n.summary||n.description||'')}</p></article>`).join('')}</div></section><section class="panel"><h2>📅 Takvim Özeti</h2>${events.length?events.slice(0,4).map(e=>`<p class="activityItem">📅 ${esc(e.title||'Yayın')} • ${esc(e.date||'Tarih yok')} ${esc(e.time||'')}</p>`).join(''):'<p class="muted">Henüz yayın kaydı yok. Yönetimden takvim eklenebilir.</p>'}</section>`);
}

function pageHtml(){ const p=route(); const m=loadMaintenance(); if(m.enabled && !isYönetim() && !isAuthRoute(p)) return maintenanceZiyaretçi(); if(p==='/'||p==='/ana-sayfa') return home(); if(p.startsWith('/oyun-arsivi')) return archive(); if(p.startsWith('/izle')) return watchPage(); if(p.startsWith('/alfabetik-siralama')) return alphabetPage(); if(p.startsWith('/koleksiyonlar')) return collectionsPage(); if(p.startsWith('/seriler')) return seriesPage(); if(p==='/status'||p==='/durum') return publicStatusPage(); if(p==='/site-rehberi') return siteGuidePage(); if(p==='/yetkili-rehberi') return authorityGuidePage(); if(p==='/giris-yap'||p==='/auth/login') return loginPage(); if(p==='/kayit-ol'||p==='/auth/register') return registerPage(); if(p==='/hesabim') return accountPage(); if(p==='/yonetim') return admin(); if(p==='/yonetim/oyun-ekle'||p==='/yonetim/oyun-duzenle') return gameForm(); if(p==='/yonetim/mevcut-oyunlar') return currentGamesYönetim(); if(p==='/yonetim/seriler') return seriesManager(); if(p==='/yonetim/yayin-takvimi') return calendar(); if(p==='/yonetim/guncelleme-notlari' || p==='/guncellemeler') return updateNotes(); if(p==='/yonetim/bolum-takibi') return episodeTracker(); if(p==='/yonetim/bakim-modu') return maintenance(); if(p==='/yonetim/kullanicilar') return usersPage(); return notFound(); }
function bind(){
  document.body.addEventListener('click', e=>{
    const a=e.target.closest('a[href]'); if(a && a.origin===location.origin && !a.hasAttribute('download') && a.target !== '_blank' && !a.dataset.newTab){ e.preventDefault(); setRoute(a.pathname + a.search); return; }
    if(e.target.closest('[data-supabase-refresh]')){ e.preventDefault(); refreshSiteDataFromSupabase({force:true}).catch(err=>{ console.error(err); toast('Supabase yenileme hatası.'); }); return; }
    if(e.target.closest('[data-refresh-calendar]')){ e.preventDefault(); refreshEventsFromSupabase({force:true}).catch(()=>{}); return; }
    if(e.target.closest('[data-refresh-notes]')){ e.preventDefault(); refreshNotesFromSupabase({force:true}).catch(()=>{}); return; }
    if(e.target.closest('[data-maintenance-retry]')){ e.preventDefault(); for(const key of MAINTENANCE_KEYS) localStorage.removeItem(key); refreshSiteRuntimeFromSupabase({force:true}).then(()=>setRoute('/ana-sayfa')).catch(()=>setRoute('/ana-sayfa')); return; }
    if(e.target.closest('[data-refresh-maintenance]')){ e.preventDefault(); refreshSiteRuntimeFromSupabase({force:true}).catch(()=>{}); return; }
    const metaBtn=e.target.closest('[data-meta-action]'); if(metaBtn){ e.preventDefault(); const form=metaBtn.closest('[data-game-form]'); const action=metaBtn.getAttribute('data-meta-action'); (async()=>{ if(action==='local'){ const title=String(form?.elements?.title?.value||'').trim(); if(!title){ toast('Önce oyun adını yaz.'); return; } fillMetaToForm(form, mapMeta({meta:localGameMetaCandidate(title), source:'Yerel güvenli bilgi'}, title), 'safe'); toast('Yerel güvenli bilgi uygulandı.'); return; } await resolveMetaForForm(form, action); })().catch(err=>{ console.error(err); toast('Bilgi çekilemedi, yerel güvenli seçenek denenebilir.'); }); return; }
    const ytBtn=e.target.closest('[data-youtube-action]'); if(ytBtn){ e.preventDefault(); const form=ytBtn.closest('[data-game-form]'); syncPlaylistForForm(form).catch(err=>{ console.error(err); toast(err.message || 'Oynatma listesi bölümleri çekilemedi.'); }); return; }
    const syncBtn=e.target.closest('[data-sync-game-playlist]'); if(syncBtn){ e.preventDefault(); syncPlaylistForGame(syncBtn.dataset.syncGamePlaylist).catch(err=>{ console.error(err); toast(err.message || 'Oynatma listesi çekilemedi.'); }); return; }
    const progressBtn=e.target.closest('[data-progress-game]'); if(progressBtn){ e.preventDefault(); const id=progressBtn.dataset.progressGame; const delta=Number(progressBtn.dataset.delta||0); const game=loadGames().find(g=>String(g.id)===String(id)); if(game){ setWatchedForGame(id, Number(game.watchedEpisodeCount||0)+delta); toast('Bölüm ilerlemesi güncellendi.'); render(); } return; }
    const moveBtn=e.target.closest('[data-move-game]'); if(moveBtn){ e.preventDefault(); const next=moveGameOrder(moveBtn.dataset.moveGame, Number(moveBtn.dataset.delta||0)); const changed=(Array.isArray(next)?next:[]).map((g,i)=>({...g, sortOrder:i, seriesOrder:Number(g.seriesOrder ?? g.sortOrder ?? i)})); persistSeriesUpdateToSupabase('Genel sıralama', changed).catch(err=>console.warn('Supabase genel sıralama yerel modda kaldı:', err.message)); toast('Sıralama güncellendi.'); render(); return; }
    const rowUp=e.target.closest('[data-series-row-up]'); if(rowUp){ e.preventDefault(); const row=rowUp.closest('[data-series-dnd-item]'); const prev=row?.previousElementSibling; if(row && prev){ row.parentNode.insertBefore(row, prev); renumberSeriesEditor(row.closest('form')); } return; }
    const rowDown=e.target.closest('[data-series-row-down]'); if(rowDown){ e.preventDefault(); const row=rowDown.closest('[data-series-dnd-item]'); const next=row?.nextElementSibling; if(row && next){ row.parentNode.insertBefore(next, row); renumberSeriesEditor(row.closest('form')); } return; }
    const delGame=e.target.closest('[data-delete-game]'); if(delGame){ if(confirm('Bu oyunu kalıcı olarak silmek istiyor musun?')){ const id=delGame.dataset.deleteGame; deleteGame(id); deleteGameRemote(id).catch(err=>{ console.warn('Supabase silme yerel modda kaldı:', err.message); }); toast('Oyun kalıcı olarak silindi.'); render(); } return; }
    if(e.target.closest('[data-delete-all-games]')){ if(confirm('Tüm oyunları kalıcı olarak silmek istiyor musun? Bu işlemden sonra demo oyunlar geri gelmez.')){ clearAllGames(); clearAllGamesRemote().catch(err=>{ console.warn('Supabase toplu silme yerel modda kaldı:', err.message); }); toast('Tüm oyunlar kalıcı olarak silindi.'); render(); } return; }
    if(e.target.closest('[data-reset-demo-games]')){ if(confirm('Örnek oyunları geri yüklemek istiyor musun?')){ restoreDemoGames(); toast('Örnek oyunlar geri yüklendi.'); render(); } return; }
    const delEvent=e.target.closest('[data-delete-event]'); if(delEvent){ const rows=loadEvents(); const idx=Number(delEvent.dataset.deleteEvent); const event=rows[idx]; rows.splice(idx,1); saveEvents(rows); deleteEventRemote(event).catch(err=>{ console.warn('Supabase takvim silme yerel modda kaldı:', err.message); }); toast('Yayın silindi.'); render(); return; }
    const delNote=e.target.closest('[data-delete-note]'); if(delNote){ const rows=loadNotes(); const idx=Number(delNote.dataset.deleteNote); const note=rows[idx]; rows.splice(idx,1); saveNotes(rows); deleteNoteRemote(note).catch(err=>{ console.warn('Supabase not silme yerel modda kaldı:', err.message); }); toast('Not silindi.'); render(); return; }
    if(e.target.closest('[data-action="maintenance-off"]')){ const stamp=new Date().toISOString(); const m={...loadMaintenance(), enabled:false, percent:0, source:'admin-form', updatedAt:stamp, updated_at:stamp, adminBypass:true}; saveMaintenance(m); persistMaintenanceToSupabase(m).then(()=>refreshSiteRuntimeFromSupabase({force:false})).catch(err=>{ console.warn('Supabase bakım kapatma yerel modda kaldı:', err.message); }); toast('Bakım modu kapatıldı.'); render(); return; }
    if(e.target.closest('[data-action="logout"]')){ signOut(); toast('Çıkış yapıldı.'); setRoute('/ana-sayfa'); return; }
    if(e.target.closest('[data-action="hard-refresh"]')) location.reload();
    const quality=e.target.closest('[data-quality]'); if(quality){ saveWatchSettings({quality:quality.dataset.quality}); toast(`Kalite tercihi ${quality.dataset.quality} olarak kaydedildi.`); render(); return; }
    if(e.target.closest('[data-refresh-users]')){ e.preventDefault(); refreshUsersPanel(); return; }
    const roleSave=e.target.closest('[data-user-role-save]'); if(roleSave){ const row=roleSave.closest('[data-user-id]'); const id=row?.dataset?.userId||''; const role=row?.querySelector('[data-role-select]')?.value||'user'; const email=row?.querySelector('small')?.textContent?.split('•')?.[0]?.trim()||''; if((row?.dataset?.userSource||'')!=='Supabase' || id.startsWith('local') || id==='current-session'){ let users=loadUsers(); if(!users.some(u=>String(u.email)===email)) users.push({id:id||('user-'+Date.now()),email,displayName:email,role}); users=users.map(u=>String(u.id)===id||String(u.email)===email?{...u,role}:u); saveUsers(users); const session=currentUser(); if(session && String(session.email)===email){ localStorage.setItem(STORAGE.session, JSON.stringify({...session,role})); } toast('Yerel kullanıcı yetkisi güncellendi.'); render(); } else { apiJson('user-role-set',{adminToken:sessionToken(),userId:id,role}).then(()=>refreshUsersPanel()).then(()=>toast('Supabase kullanıcı yetkisi güncellendi.')).catch(err=>toast('Yetki güncellenemedi: '+err.message)); } return; }
    const userDel=e.target.closest('[data-user-delete]'); if(userDel){ const row=userDel.closest('[data-user-id]'); const id=row?.dataset?.userId||''; if(!confirm('Kullanıcıyı silmek istiyor musun?')) return; if((row?.dataset?.userSource||'')!=='Supabase' || id.startsWith('local') || id==='current-session'){ const email=row?.querySelector('small')?.textContent?.split('•')?.[0]?.trim()||''; saveUsers(loadUsers().filter(u=>String(u.id)!==id && String(u.email)!==email)); toast('Yerel kullanıcı silindi.'); render(); } else { apiJson('user-delete',{adminToken:sessionToken(),userId:id}).then(()=>refreshUsersPanel()).then(()=>toast('Supabase kullanıcısı silindi.')).catch(err=>toast('Kullanıcı silinemedi: '+err.message)); } return; }
    const storyBtn=e.target.closest('[data-story-action]'); if(storyBtn){ const form=storyBtn.closest('form'); if(form){ const game={title:form.elements?.title?.value, genre:form.elements?.genre?.value, seriesName:form.elements?.seriesName?.value}; setField(form,'storyText',professionalStoryText(game),false); toast('Profesyonel hikaye metni oluşturuldu.'); } return; }
  });
  document.body.addEventListener('dragstart', e=>{ const row=e.target.closest('[data-series-dnd-item]'); if(row){ row.classList.add('dragging'); e.dataTransfer?.setData('text/plain', row.dataset.gameId||''); } });
  document.body.addEventListener('dragend', e=>{ const row=e.target.closest('[data-series-dnd-item]'); if(row){ row.classList.remove('dragging'); renumberSeriesEditor(row.closest('form')); } });
  document.body.addEventListener('dragover', e=>{ const list=e.target.closest('[data-series-dnd-list]'); if(!list) return; e.preventDefault(); const dragging=list.querySelector('.dragging'); const target=e.target.closest('[data-series-dnd-item]'); if(dragging && target && dragging!==target){ const rect=target.getBoundingClientRect(); const after=(e.clientY-rect.top) > rect.height/2; list.insertBefore(dragging, after?target.nextSibling:target); } });
  document.body.addEventListener('drop', e=>{ const list=e.target.closest('[data-series-dnd-list]'); if(list){ e.preventDefault(); renumberSeriesEditor(list.closest('form')); } });
  document.body.addEventListener('submit', e=>{
    const ssf=e.target.closest('[data-series-sort-form]'); if(ssf){ e.preventDefault(); const fd=new FormData(ssf); setRoute('/seriler?sort='+encodeURIComponent(String(fd.get('sort')||'az'))); return; }
    const sf=e.target.closest('[data-series-form]'); if(sf){ e.preventDefault(); const fd=new FormData(sf); const oldSeries=String(fd.get('oldSeriesName')||'').trim(); const newSeries=String(fd.get('seriesName')||'').trim(); if(!newSeries){ toast('Seri adı boş olamaz.'); return; } const selected=new Set(fd.getAll('gameIds').map(String)); const rows=loadGames(); const updates=[]; const next=rows.map((g,i)=>{ const id=String(g.id); const wasIn=String(g.seriesName||'Serisiz Oyunlar')===oldSeries; const isIn=selected.has(id); if(isIn){ const order=Math.max(1, Number(fd.get('order__'+id)||i+1)); const patched=normalizeGame({...g, seriesName:newSeries, collectionName:newSeries, seriesOrder:order-1, sortOrder:order-1}, i); updates.push(patched); return patched; } if(wasIn && oldSeries){ const patched=normalizeGame({...g, seriesName:'', collectionName:g.genre||'Genel Koleksiyon', seriesOrder:9999, sortOrder:Number(g.sortOrder||i)}, i); updates.push(patched); return patched; } return normalizeGame(g,i); }); saveGames(next); persistSeriesUpdateToSupabase(newSeries, updates).then(()=>toast('Seri Supabase ile kalıcı kaydedildi.')).catch(err=>{ console.warn('Supabase seri kayıt yerel modda kaldı:', err.message); toast('Seri yerel kaydedildi, Supabase bağlantısı sonra yenilenebilir.'); }); setRoute('/yonetim/seriler?series='+encodeURIComponent(newSeries)); return; }
    const search=e.target.closest('[data-search-form]'); if(search){ e.preventDefault(); const fd=new FormData(search); const qs=new URLSearchParams(); for(const key of ['q','status','genre','series','tag','sort']){ const val=String(fd.get(key)||'').trim(); if(val && val!=='Tümü') qs.set(key,val); } setRoute('/oyun-arsivi'+(qs.toString()?('?'+qs.toString()):'')); return; }
    const login=e.target.closest('[data-login-form]'); if(login){ e.preventDefault(); (async()=>{ const fd=new FormData(login); const email=String(fd.get('email')||'').trim().toLowerCase(); const password=String(fd.get('password')||''); try{ const data=await apiJson('login',{email,password}); const u=data.user||{}; localStorage.setItem(STORAGE.session, JSON.stringify({email:u.email||email,displayName:u.full_name||u.displayName||'Hayatımız Oyun',role:isYönetimEmail(email)?'owner':(u.role||'user'),adminToken:data.adminToken||''})); toast('Supabase giriş başarılı.'); await refreshGamesFromSupabase({force:false}); setRoute(isYönetimEmail(email)?'/yonetim':'/ana-sayfa'); return; }catch(err){ console.warn('Supabase login yok, yerel deneniyor:', err.message); } let users=loadUsers(); let user=users.find(u=>String(u.email).toLowerCase()===email); if(!user && isYönetimEmail(email)){ user={id:'user-'+Date.now(),email,displayName:'Hayatımız Oyun Yönetim',password,role:'owner',createdAt:new Date().toISOString()}; users.push(user); saveUsers(users); } if(!user || String(user.password||'')!==password){ toast('E-posta veya şifre hatalı. Kayıt olmayı dene.'); return; } localStorage.setItem(STORAGE.session, JSON.stringify({email:user.email,displayName:user.displayName,role:isYönetimEmail(user.email)?'owner':(user.role||'user'),adminToken:user.adminToken||''})); toast('Yerel giriş başarılı. Supabase için şema ve kayıt gerekebilir.'); setRoute(isYönetimEmail(user.email)?'/yonetim':'/ana-sayfa'); })(); return; }
    const register=e.target.closest('[data-register-form]'); if(register){ e.preventDefault(); (async()=>{ const fd=new FormData(register); const email=String(fd.get('email')||'').trim().toLowerCase(); const displayName=String(fd.get('displayName')||'').trim(); const password=String(fd.get('password')||''); if(password.length<3){ toast('Şifre en az 3 karakter olsun.'); return; } let adminToken=''; let remoteUser=null; try{ const data=await apiJson('register',{email,password,fullName:displayName}); adminToken=data.adminToken||''; remoteUser=data.user||null; toast('Supabase kayıt oluşturuldu.'); }catch(err){ console.warn('Supabase kayıt yok, yerel kayıt:', err.message); toast('Yerel kayıt oluşturuldu. Supabase daha sonra bağlanabilir.'); } let users=loadUsers().filter(u=>String(u.email).toLowerCase()!==email); const role=isYönetimEmail(email)?'owner':(remoteUser?.role||'user'); const user={id:remoteUser?.id || 'user-'+Date.now(),email:remoteUser?.email || email,displayName:remoteUser?.full_name || displayName || email, password, role, adminToken, is_active:remoteUser?.is_active !== false, source:remoteUser?'Supabase':'Yerel',createdAt:remoteUser?.created_at || new Date().toISOString()}; users.push(user); saveUsers(users); localStorage.setItem(STORAGE.session, JSON.stringify({email:user.email,displayName:user.displayName,role:user.role,adminToken})); setRoute(isYönetimEmail(user.email)?'/yonetim':'/ana-sayfa'); })(); return; }
    const gf=e.target.closest('[data-game-form]'); if(gf){ e.preventDefault(); const fd=new FormData(gf); const rows=loadGames(); const editId=String(fd.get('gameId')||'').trim(); const title=String(fd.get('title')||'').trim(); if(!title){ toast('Oyun adı boş olamaz.'); return; } const episodeCount=Math.max(0, Number(fd.get('episodeCount')||0)); const watchedEpisodeCount=Math.max(0, Math.min(episodeCount || 9999, Number(fd.get('watchedEpisodeCount')||0))); const payload=normalizeGame({id:editId || slugify(title)+'-'+Date.now(),title,status:fd.get('status'),genre:fd.get('genre'),seriesName:fd.get('seriesName'),cover:fd.get('cover')||'/assets/hayatimiz-kapak.png',banner:fd.get('banner'),releaseDate:fd.get('releaseDate'),platforms:fd.get('platforms'),description:fd.get('description'),storyText:String(fd.get('storyText')||'').trim() || professionalStoryText({title, genre:fd.get('genre'), seriesName:fd.get('seriesName')}),youtubePlaylistUrl:fd.get('youtubePlaylistUrl'),youtubePlaylistId:fd.get('youtubePlaylistId') || extractYoutubePlaylistId(fd.get('youtubePlaylistUrl')),tags:fd.get('tags'),rawgId:fd.get('rawgId'),rawgSlug:fd.get('rawgSlug'),steamAppId:fd.get('steamAppId'),score:fd.get('score'),metaSource:fd.get('metaSource'),metaCheckedAt:fd.get('metaCheckedAt'),coverSource:fd.get('metaSource'),episodeCount,watchedEpisodeCount},0); const next=editId ? rows.map(g=>String(g.id)===editId ? {...g,...payload,id:g.id} : g) : [payload, ...rows]; saveGames(next); try{ const eps=JSON.parse(String(fd.get('episodesJson')||'[]')); if(Array.isArray(eps) && eps.length) saveEpisodes(payload.id, eps.map(ep=>({...ep, watched:Number(ep.number)<=Number(payload.watchedEpisodeCount||0)}))); }catch{} persistGameToSupabase(payload, editId).then(()=>{ render(); }).catch(err=>{ console.warn('Supabase kayıt yerel modda kaldı:', err.message); saveSyncState({mode:'local', status:'Yerel kayıt aktif', message:err.message}); }); toast(editId?'Oyun güncellendi.':'Oyun kaydedildi.'); setRoute('/yonetim/mevcut-oyunlar'); return; }
    const ef=e.target.closest('[data-event-form]'); if(ef){ e.preventDefault(); const fd=new FormData(ef); const rows=loadEvents(); const event={id:'event-'+Date.now(),title:fd.get('title'),date:fd.get('date'),time:fd.get('time'),type:fd.get('type'),gameTitle:fd.get('gameTitle'),episodeNumber:fd.get('episodeNumber'),videoUrl:fd.get('videoUrl'),note:fd.get('note'),source:'local'}; rows.unshift(event); saveEvents(rows); persistEventToSupabase(event).then(()=>render()).catch(err=>{ console.warn('Supabase takvim kayıt yerel modda kaldı:', err.message); saveSyncState({mode:'local', status:'Takvim yerel kayıt aktif', message:err.message}); }); toast('Yayın kaydedildi.'); render(); return; }
    const nf=e.target.closest('[data-note-form]'); if(nf){ e.preventDefault(); const fd=new FormData(nf); const rows=loadNotes(); const note={id:'note-'+Date.now(),version:fd.get('version'),status:fd.get('status'),title:fd.get('title'),summary:fd.get('summary'),source:'local'}; rows.unshift(note); saveNotes(rows); persistNoteToSupabase(note).then(()=>render()).catch(err=>{ console.warn('Supabase not kayıt yerel modda kaldı:', err.message); saveSyncState({mode:'local', status:'Not yerel kayıt aktif', message:err.message}); }); toast('Güncelleme notu kaydedildi.'); render(); return; }
    const mf=e.target.closest('[data-maint-form]'); if(mf){ e.preventDefault(); const fd=new FormData(mf); const maintenance={enabled:fd.get('enabled')==='true',percent:Number(fd.get('percent')||0),message:fd.get('message'),eta:fd.get('eta'),adminBypass:true,source:'admin-form',updatedAt:new Date().toISOString()}; saveMaintenance(maintenance); persistMaintenanceToSupabase(maintenance).catch(err=>{ console.warn('Supabase bakım kayıt yerel modda kaldı:', err.message); saveSyncState({mode:'local', status:'Bakım yerel kayıt aktif', message:err.message}); }); toast('Bakım modu kaydedildi.'); render(); return; }
  });
}
function render(){
  const root=document.getElementById('root');
  if(!root) return;
  try{
    root.innerHTML=pageHtml();
  }catch(err){
    console.error('Güvenli render hata ekranı:', err);
    root.innerHTML=safeErrorPanel(err && err.message ? err.message : 'Sayfa oluşturulurken hata yakalandı.');
  }
  document.title='Hayatımız Oyun - '+VERSION;
  if(route()==='/yonetim/kullanicilar' && document.querySelector('[data-auto-users="1"]') && !window.__HAYATIMIZ_USERS_AUTO_REFRESHED__){
    window.__HAYATIMIZ_USERS_AUTO_REFRESHED__=true;
    setTimeout(()=>refreshUsersPanel().catch(()=>{}), 120);
  }
}
window.addEventListener('popstate', render);
window.addEventListener('error', ev=>{ console.error('v2.1.2 hata:', ev.message); const root=document.getElementById('root'); if(root && (root.textContent||'').trim().length<40) root.innerHTML=home(); });
document.addEventListener('DOMContentLoaded', ()=>{ bind(); render(); refreshSiteDataFromSupabase({force:false}).then(()=>render()).catch(()=>{}); setTimeout(()=>{ const r=document.getElementById('root'); if(!r || (r.textContent||'').trim().length<40) render(); }, 300); });
window.addEventListener('unhandledrejection', ev=>{ console.error('v2.1.2 promise hata:', ev.reason); const root=document.getElementById('root'); if(root && (root.textContent||'').trim().length<40) root.innerHTML=safeErrorPanel('Beklenmeyen işlem hatası yakalandı.'); });
window.HAYATIMIZ_OYUN_VERSION = VERSION;
window.HAYATIMIZ_OYUN_FIX = FIX_NAME;
