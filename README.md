# Hayatımız Oyun - v2.0.1 Dolu Eski Taban

Bu paket boş/temiz başlangıç değildir. Önceki dolu site altyapısı korunarak görünen sürüm tekrar **v2.0.1** noktasına alınmıştır. Oyun arşivi, admin panel, oyun ekleme/düzenleme, RAWG/kapak/meta mantığı, YouTube playlist/bölüm alanları, koleksiyon/filtre yapısı, yayın takvimi, güncelleme notları ve bakım modu korunur.

Bundan sonra hatalar `v2.0.1`, `v2.0.2`, `v2.0.3` şeklinde adım adım ayrılacaktır.

---

# v2.4.0 FIX 41

- Oyun Ekle / Mevcut Oyunu Düzenle formuna Kapakları Getir, Çıkış Tarihini Tekrar Çek ve Türleri Tekrar Çek butonları eklendi.
- Steam, RAWG, internet/görsel havuzu ve yerel DLC katalog adayları birlikte kullanılır.
- Çekme işlemleri Supabase'e otomatik kayıt yapmaz; kayıt yalnızca Oyunu Kaydet / Oyunu Güncelle ile yapılır.

---

## v2.4.0 FIX 40 - Seri Durum Ekranı

- Seriler sayfasında kapak üstüne Tamamlandı / Devam Ediyor / Yakında rozetleri eklendi.
- Devam eden seriler izleyiciye üstte ayrı ve detaylı bir alanda gösterilir.
- Seri kartlarında sıradaki kayıt, bölüm ilerlemesi ve seri durumu daha profesyonel görünür.
- FIX39 sürükle bırak seri sıralama sistemi korunmuştur.


## v2.4.0 FIX 37 - Google/İnternet DLC Kapak Havuzu
- Kapakları Getir, Alan Wake DLC/Expansion aramalarında Night Springs, The Lake House, The Writer, The Signal ve tüm Alan Wake ailesini birlikte listeler.
- Night Springs görseli pakete yerel asset olarak eklendi.
- API tarafına canlı internet görsel araması eklendi; internet çalışmazsa yerel güvenli katalog devreye girer.
- Kapak seçimi oyun adını değiştirmez ve Supabase'e otomatik kayıt yapmaz.



## v2.4.0 FIX 34 - Oyun Ekleme / Oyun Tıklama Stabilizasyonu

- Oyunlara tıklayınca oluşan `Maximum call stack size exceeded` hatası düzeltildi.
- Eski FIX31 cache assetleri de yeni güvenli kodla değiştirildi.
- Oyun ekleme/meta/kapak/tür/hikaye çekme işlemleri kayıt yapmadan yalnızca formu doldurur.
- Benzer oyun adlarında farklı oyun çekme riski azaltıldı.

## v2.4.0 FIX 29 - Panel Stabilizasyonu ve Güvenli Oyun Formu

- Bakım modu stabil hale getirildi.
- Seri sıralama üst sekme + alt detay düzenine alındı.
- Oyun istekleri ve hata bildirimleri Supabase’den yenilenebilir oldu.
- Oyun Ekle formunun eski taslakla dolu gelmesi engellendi.
- Kaydet/Güncelle olmadan otomatik Supabase kaydı kapatıldı.

# Hayatımız Oyun - v2.4.0 FIX 28

Bu paket site açılışındaki `ho240DeployCenter is not defined` hatasını giderir. AI/Deploy/Redeploy sistemleri kaldırılmış durumda kalır; oyun ekle/düzenle ve local önizleme korunur.



## v2.4.0 FIX 24 - AI Özellik Sistemi Kaldırıldı
- AI ile özellik yazma, önerme, uygulama ve AI tanı panelleri kaldırıldı.
- Deploy Merkezi sade GitHub/Vercel/Supabase kontrol ekranı oldu.
- AI localStorage kayıtları ve AI API kayıt akışları pasifleştirildi.

# Hayatımız Oyun - v2.4.0 FIX 21

## FIX 21 Özeti

Özellik Yaz / AI Uygula sisteminde AI özelliklerinin yanlış panele eklenmesi düzeltildi. `v2.4.x Planı` yazısındaki Planı kelimesi artık Takvim olarak algılanmaz. AI Özellik, Özellik Yaz, Siteye Uygula ve Nereye Eklendiyse Git akışı profesyonel hedef router ile doğru panele kilitlenir.

## Deploy

FIX20 hazır `dist` deploy mantığı korunur. Vercel uzun Vite build beklemez; `dist` içindeki FIX21 assetleri yayınlanır.

# Hayatımız Oyun - v2.4.0 FIX 20

## FIX 20 Özeti

Vercel'de `Building...` ekranında takılma sorunu için deploy sistemi hazır `dist` kullanımına geçirildi. Bu pakette Vercel `npm install` ve uzun Vite build işlemi beklemez; sadece hazır dosyaları kontrol edip yayınlar.



## v2.4.0 FIX 19 - Site Yükleniyor Build/Asset Fix
- Site yükleniyor ekranında kalma sorunu düzeltildi.
- dist içindeki JS artık gerçek Vite production bundle olarak üretilir.
- Eski FIX18 asset yolu için uyumluluk dosyası eklendi.
- Vercel build/cache ayarları güncellendi.

# Hayatımız Oyun v2.4.0 FIX 17

Bu paket, Özellik Yaz alanına `v2.4.3 Planı` gibi bir metin yazıldığında site sürümünü otomatik olarak o sürüme çevirir. Üst logo, site adı, Deploy Merkezi, öneri kartı, uygulanan özellik kaydı ve F5 sonrası görünen sürüm aynı kalır; kullanıcı arayüzünde FIX etiketi gösterilmez.

# Hayatımız Oyun v2.4.0

Bu paket v2.2.6 - v2.4.0 arası planlanan tüm yeni özellikleri siteyi bozmadan modüler yönetim panelleriyle ekleyen stabil temiz pakettir.

## Kurulum
KURULUM-KOMUTLARI.txt dosyasını takip et.

## Temiz Paket
Paket içinde `node_modules` ve `dist` yoktur. Vercel deploy sırasında build alır.


# v2.4.0 FIX 11
- seriesGroups açılış hatası düzeltildi.
- Kapak Bul ve Seç paneli eklendi; bulunan kapaklardan manuel seçim yapılır.
- Meta + Kapak Çek yanlış arcade/genel görseli basmaz, güvenilir kapak seçtirir.
- AI Özellik Ekle paneline AI Özellik Yenile, hedef versiyon seçimi, uygulananı sil ve nereye eklendiyse git akışı eklendi.

# v2.4.0 FIX 13 - AI Yeni Öneriler + Redeploy Güncelleme Fix
- Redeploy / AI Tanı Merkezi içindeki Yeni Güncellemeleri Otomatik Ara butonu düzeltildi.
- Üst durum kartları artık sayfa yenilemeden Başarılı/Bekliyor durumunu doğru gösterir.
- AI Özellik Ekle ekranına Yeni Öneriler Öner alanı eklendi.
- Kategori seçip yeni öneri üretme desteği eklendi.
- Seçilen yeni güncelleme versiyonu AI önerilerine ve güncelleme notu akışına senkron bağlandı.
- FIX12 eski offset anahtarı çakışması giderildi; öneriler artık gerçekten değişir.
- Hazır dist assetleri güncellendi.


## v2.4.0 FIX 14 - Stabil Kapak + AI Uygula + Versiyon Senkron Fix
- Üst bar ve sol yönetim logosundaki sürüm yazısı artık `Yeni güncelleme versiyonu` alanıyla senkron.
- Yeni Güncellemeleri Otomatik Ara tepe kartlarını, AI önerilerini ve son durum metnini birlikte yeniler.
- Alan Wake American Nightmare ayrı oyun olarak tanındı; Alan Wake Remastered ile karışması düzeltildi.
- Kapak seçici 20 adaya kadar görsel gösterir; Steam/RAWG/API sonuçları tek listede birleşir.
- AI Siteye Uygula akışı uygulananlar listesine, local özellik durumuna, güncelleme notu taslağına ve Supabase denemesine bağlandı.
- Nereye Eklendiyse Git hedef panel eşleştirmesi güçlendirildi.

# v2.4.0 FIX 15 - Temiz Sürüm + Özellik Yaz / AI Uygula

- Site adının yanında görünen FIX etiketi kullanıcı arayüzünden kaldırıldı; üst logo ve sol yönetim adı artık sadece seçilen sürümü gösterir.
- Deploy Merkezi içine küçük **Sadece son sayı** kutusu eklendi. Örneğin kutuya `2` yazınca sürüm `v2.4.1` olarak güncellenir.
- AI özellik alanına **Özellik Yaz** bölümü eklendi. Yönetici isteğini normal cümleyle yazar, sistem hedef sayfayı ve nasıl uygulanacağını önerir.
- **Öneriyi Siteye Uygula ve Yenile** butonu eklendi. Özellik uygulananlar listesine, güncelleme notuna ve ilgili yönetim sayfasına işlenir; ardından F5 yenileme yapılır.
- Uygulanan özel özellikler hedef sayfada **AI ile Bu Alana Eklenen Özellikler** kartı altında görünür.
- Kapak/oyun/meta gibi yazılan istekler ilgili özellik anahtarlarını otomatik aktif eder.


## v2.4.0 FIX 16 - Public Sürüm Temizleme
- Üst site adındaki `public sürüm + paket FIX` birleşimi temizlendi.
- Sürüm güncelleme sonrası sadece kullanıcının seçtiği sürüm gösterilir.
- Sol yönetim başlığı ve AI/Deploy paneli aynı temiz sürümle senkron çalışır.


## v2.4.0 FIX 18 - Oyun Durum Butonları Stabil
- Oyun güncelle ekranındaki Tamamlanan / Devam Eden / Yakında butonları stabil hale getirildi.
- Seçilen durum edit formunda kaybolmadan tutulur ve Oyunu Güncelle ile kaydedilir.
- Yeni oyun formunda durum seçimi draft verisine yazılır.


## v2.4.0 FIX 24 - Sade Yönetim Paneli

- Site içindeki Deploy / Redeploy / GitHub / Vercel kontrol panelleri kaldırıldı.
- AI ile özellik yazma/önerme sistemi kapalı kalır.
- Yönetim paneli artık oyun, seri, takvim, rapor, bakım, schema ve ayar odaklı sade çalışır.
- Yeni geliştirmeler site içinden otomatik uygulanmaz; ZIP güncellemesi olarak hazırlanır.


## v2.4.0 FIX 24

- AI ile özellik yazma/önerme ekranları doğrudan silindi.
- Deploy / Redeploy / GitHub / Vercel yönetim panelleri ve API aksiyonları kaldırıldı.
- Pasif uyarı ekranı kullanılmaz; eski route gelirse sessizce Genel Bakış açılır.
- Yönetim paneli oyun, seri, takvim, rapor, bakım, güncelleme notları ve ayarlar odaklı sade çalışır.


## v2.4.0 FIX 25 - Site Açılış Import Fix
- FIX24 sonrası sitenin `Site yükleniyor...` ekranında kalmasına sebep olan `dist` JS içindeki `import './styles.css';` satırı temizlendi.
- `dist/index.html` doğrudan `hayatimiz-app-fix25.js` ve `hayatimiz-style-fix25.css` dosyalarına bağlandı.
- Vercel hazır dist kontrolü artık CSS import kalıntısını yakalar.
- AI ve Deploy/Redeploy temizlikleri korunur.

---

## v2.4.0 FIX 26

- Oyun Ekle ve Mevcut Oyunu Düzenle ekranları profesyonel editör yapısına alındı.
- Kapak/meta/hikaye/playlist çekince sayfanın üste atlama sorunu düzeltildi.
- `Kapakları Getir` butonu gerçek action bağlantısıyla çalışır hale getirildi.
- Oyun güncelleme sonrası form aynı yerde kalır; düzenlemeye devam edilebilir.
- Yayına almadan önce localde görmek için `03-VSCode-Localhost-Onizleme.bat` eklendi.

---

## v2.4.0 FIX 27 - Supabase schema.sql tekrar çalıştırma hatası düzeltildi

Bu pakette `schema.sql` idempotent hale getirildi. Aynı güncelleme notu Supabase içinde daha önce varsa artık duplicate key hatası vermez; `ON CONFLICT (version,title)` ile mevcut kayıt güncellenir.

Supabase SQL Editor içinde `supabase/schema.sql` dosyasını tekrar çalıştırabilirsin.

## v2.4.0 FIX 30 - Kayıt ve Buton Stabilizasyonu

- Yönetim panelindeki kayıt kaydetme ve durum değiştirme butonları güvenli hale getirildi.
- Oyun istekleri / hata bildirimleri Supabase hatasında paneli bozmaz; local kayıt korunur.
- Oyun düzenle ve sil butonları ek yakalama katmanına alındı.
- Form içi butonların yanlışlıkla kayıt/submit tetiklemesi engellendi.
- Oyun durumu sadece formda değişir, kaydetmeden Supabase’e gitmez.


## v2.4.0 FIX 31 - Oyun Listesi Kaybolma Koruması
- Oyunların Supabase/API hatasında boş görünmesi engellendi.
- games-list endpointine kolon farkı fallback sorguları eklendi.
- Son sağlam oyun listesi local cache ile korunur.
- Hazır Vercel dist dosyaları FIX31 olarak güncellendi.


## v2.4.0 FIX 32 - Oyun tıklama stabil fix
- Oyun kartına tıklayınca oluşan `Maximum call stack size exceeded` hatası giderildi.
- Tür üretme fonksiyonundaki sonsuz döngü kaldırıldı.
- Eski FIX31 asset dosyası da cache uyumluluğu için yamalandı.

## v2.4.0 FIX 33 - Oyun Adı Kilitli Meta / Kapak Çekme
- Meta + Kapak Çek artık yazılan oyun adını kilitler.
- Benzer oyun adı yüzünden farklı oyun kapağı/meta bilgisi çekilmesi engellendi.
- Kesin eşleşme yoksa yanlış kayıt yapılmaz; manuel kapak alanı korunur.

## v2.4.0 FIX 35
- Kapakları Getir butonu düzeltildi; yerel katalog/API/Steam yedek kapak adayları birleşik çalışır.
- Kapak seçimi oyun adını değiştirmez, sadece kapak ve eksik meta alanlarını forma işler.
- Seri Sıralama Merkezi üstte seri kartları, altta seçilen seri detayı olacak şekilde profesyonelleştirildi.


## v2.4.0 FIX 36 - Tüm Kapakları Getir + Çıkış Tarihi
- Kapakları Getir eksik sonuç sorunları düzeltildi.
- Alan Wake gibi seri aramalarında tüm seri kapakları çıkış tarihleriyle listelenir.
- Kapak seçimi oyun adını değiştirmez ve kayıt sadece Kaydet/Güncelle ile yapılır.


## FIX38
Seri Sıralama paneline sürükle bırak oyun sıralama sistemi eklendi.


## v2.4.0 FIX 39 - Seri Sıralama Sürükle Bırak Görünür

- Seri İzleme ekranındaki eski liste görünümü sürükle bırak satırlarına çevrildi.
- Sol tarafa belirgin **⠿ Sürükle** tutacağı eklendi.
- Sıra değişikliği otomatik kayıt yapmaz; kalıcı kayıt için kaydet butonu kullanılır.


## v2.4.0 FIX 42 - Profesyonel Temizlik + İçerik Kontrol + Çıkış Tarihi Fix

- AI / Deploy / Redeploy kalıntıları temiz tutuldu.
- Yönetim paneline profesyonel Dashboard ve İçerik Kontrol ekranı eklendi.
- Oyun formu veri çekme ve kayıt alanları olarak ayrıldı.
- Tüm Bilgileri Çek, Kapakları Getir, Çıkış Tarihini Çek, Türleri Çek, Açıklama Çek ve Playlist Bölümleri Çek butonları stabilize edildi.
- Çıkış tarihi çekme sistemi yerel katalog + Steam + RAWG + internet araması ile güçlendirildi.
- Kapak seçici kaynak, eşleşme yüzdesi, DLC etiketi ve çıkış tarihi gösterecek şekilde geliştirildi.
- Çekme butonları Supabase'e otomatik kayıt yapmaz; kayıt sadece Oyunu Kaydet / Oyunu Güncelle ile yapılır.
- Kontroller: node --check src/main.js, node --check api/index.js, npm run build başarılı.


## FIX43 - Yeni Arayüz Güncellemesi
- Referans ekrana daha yakın üst menü, yan menü ve ana sayfa vitrini eklendi.
- Hero banner, istatistik kartları, öne çıkan oyunlar ve devam eden seriler alanı modernleştirildi.


## FIX44 - Vercel Build Hatası
- FIX43 arayüzü korundu.
- Vercel build kontrol scripti FIX44 assetlerine göre düzeltildi.
- Deploy sırasında görünen Error sorunu için dist/index ve asset bağlantıları güncellendi.


## FIX45 - Panel, Rapor ve Çıkış Tarihi
- Yönetim paneli akordeon aç/kapat, bildirim çubuğu, işlevli raporlar, Oyun İste/Hata Bildir menüleri ve çıkış tarihi forma işleme düzeltildi.


## FIX46 - Oyun Yönetimi ve Güncelleme Notları
- Eksik Alanlar kartlarına tıklayınca oyun doğrudan düzenleme formunda açılır.
- Mevcut Oyunlar ve Oyun Ekle yönetim panelinde ayrı kategoriye ayrıldı.
- Türler ve etiketler ayrı alanlara taşındı.
- Oyun ekleme/düzenleme butonları daha stabil hale getirildi.
- Ayarlar ve Güncelleme Notları sayfaları profesyonelleştirildi.
- Kullanıcılar için Güncelleme Notları sayfası eklendi.


## v2.4.1 FIX47 - Bakım, Güncelleme Notları ve Modal Düzenleme
- Sürüm tüm yeni arayüzlerde v2.4.1 olarak sabitlendi.
- Eksik Alanlar ve Düzeltilecek Kayıtlar bölümünde oyunlar ayrı düzenleme penceresinde açılır.
- Bakım modu yönetim paneli daha profesyonel yapıldı.
- Kullanıcı bakım ekranı animasyonlu, yüzde göstergeli ve güncelleme notlu hale getirildi.
- Güncelleme notları admin ve kullanıcı tarafında daha profesyonel timeline/gösterim yapısına taşındı.


## FIX48 - v2.4.1 Sürüm Sabitleme + Modal Düzenleme Fix
- Görünen sürüm v2.4.1 olarak sabitlendi.
- Supabase schema.sql içinde site_public_version/current_site_version v2.4.1 olarak güncellenir.
- Eksik Alanlar bölümünde Eksiği Gider artık ayrı düzenleme modalını açar.
- Üst bar kaydırma davranışı düzeltildi.


## FIX49 - Açılış ve Form Buton Stabilizasyonu
- İlk açılış yükleniyor ekranı erken görünmeyecek şekilde düzeltildi.
- Eksiği Gider modalı garanti açılır hale getirildi.
- Kapak, çıkış tarihi, tür ve açıklama çekme butonları sayfa yenilemeden forma işler.
- Görünen sürüm v2.4.1 olarak sabitlendi.

## v2.4.1 FIX50 - Schema JSON + Form Buton Stabilizasyonu
- Supabase schema.sql JSONB hatası düzeltildi.
- site_public_version ve current_site_version kayıtları doğru JSONB formatına taşındı.
- Güncelleme notu schema bloğunda image/written yerine image_url/note kullanıldı.
- İlk açılışta bloklayıcı Site yükleniyor ekranı kaldırıldı.
- Oyun ekle/düzenle veri çekme butonları sayfa yenilemeden çalışacak şekilde sabitlendi.


## FIX51 - Oyun Formu Kaydet/Güncelle ve Detaylı Hikaye
- Oyun ekle/düzenle ekranlarında sayfa yenileyen form davranışı kesildi.
- Kaydet ve Oyunu Güncelle işlemleri ayrı stabil kaydetme katmanına bağlandı.
- Kapak, tarih, tür, açıklama ve playlist çekme butonları submit/reload yapmadan forma işler.
- Hikaye çekme daha detaylı Türkçe, spoiler kontrollü metin üretir.


## v2.4.1 FIX52 - Form Yenilenme Kilidi ve Kaydet/Güncelle Stabilizasyonu
- Düzenleme penceresinde formun arada bir sıfırlanması durduruldu.
- Toast/bildirim kapanınca formun yeniden render ile eski haline dönmesi engellendi.
- Oyunu Kaydet ve Oyunu Güncelle butonları direkt stabil kayıt katmanına bağlandı.
- Kapak, tarih, tür, hikaye ve playlist çekme butonları sayfayı yenilemeden çalışacak şekilde tekrar korumaya alındı.
- Detaylı hikaye çekme metinleri daha uzun, spoiler kontrollü ve arşiv kullanımına uygun hale getirildi.


## FIX53 - Üstte Oyunu Güncelle
- Oyun düzenleme penceresinde en üste ve modal başlığına Oyunu Güncelle butonu eklendi.
- Form aşağıdayken bile sticky üst kaydet barı kullanılabilir.


## FIX55 - v2.4.1 Kesin Çıkış Tarihi + Form Sıfırlama
- Avatar: Frontiers of Pandora DLC: The Sky Breaker çıkış tarihi 16.07.2024 olarak kesin katalogda sabitlendi.
- Oyun ekleme formuna Formu Sıfırla butonu eklendi.
- Kapak/tarih/tür/hikaye/tüm bilgileri çekme butonları kayıt yapmadan formu dolduracak şekilde güçlendirildi.
- Gelecek güncellemeler planı otomatik kod uygulayan sistem olmadan yeniden düzenlendi.


## FIX56 - Tüm Bilgileri Çek Recursion Fix
- Tüm Bilgileri Çek sırasında oluşan Maximum call stack size exceeded hatası giderildi.
- Tür, etiket, kapak, tarih ve detaylı hikaye çekme işlemleri formu yenilemeden güvenli hale getirildi.
- AI/deploy/redeploy sistemi eklenmedi; planlar manuel ZIP güncelleme mantığıyla devam eder.


## v2.4.1 FIX59 - Kaldığımız Bölüm

Devam eden serilerde playlistten çekilen videolara göre **Kaldığımız Bölüm** göstergesi eklendi. İzleyici ana sayfadan veya seri kartından doğrudan kaldığımız bölümü açabilir.


## v2.5.4 FIX9 Notu
Bu paket tam stabil site fix paketidir. `npm run build` src dosyalarını dist içine senkronize eder. Supabase için `supabase/schema.sql` çalıştırılmalıdır; mevcut kayıtlar ve bakım modu korunur.
