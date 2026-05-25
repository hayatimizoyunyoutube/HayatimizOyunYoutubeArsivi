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
