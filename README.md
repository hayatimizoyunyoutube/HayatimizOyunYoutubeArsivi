

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
- Deploy Merkezi içine küçük **Sadece son sayı** kutusu eklendi. Örneğin kutuya `2` yazınca sürüm `v2.4.2` olarak güncellenir.
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
