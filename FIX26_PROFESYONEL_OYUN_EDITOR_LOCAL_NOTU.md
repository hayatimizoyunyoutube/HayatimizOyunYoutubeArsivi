# v2.4.0 FIX 26 - Profesyonel Oyun Editörü + Local Önizleme

## Yapılanlar

- **Oyun Ekle** formu profesyonel adım yapısına alındı.
- **Mevcut Oyunu Düzenle** ekranı ayrı ve daha düzenli editör yapısına alındı.
- Kapak/meta/hikaye/playlist çekme işlemlerinde sayfanın yukarı atması engellendi.
- `Kapakları Getir` butonu için eksik action bağlantısı tamamlandı.
- Oyun düzenleme sonrası form aynı yerde kalır; düzenlemeye devam edilebilir.
- Yeni oyun kaydedince form temizlenir ama sayfa konumu korunur.
- Canlı kapak/kart önizleme alanı eklendi.
- VS Code üzerinden yayınlamadan önce siteyi görmek için `03-VSCode-Localhost-Onizleme.bat` eklendi.
- Hazır `dist` dosyaları FIX26 assetlerine bağlandı.

## Localde Siteyi Görme

1. ZIP dosyasını proje klasörüne temiz kurulum yöntemiyle çıkar.
2. `03-VSCode-Localhost-Onizleme.bat` dosyasına çift tıkla.
3. İlk açılışta `npm install` çalışır.
4. VS Code açılır ve site `http://localhost:5173` adresinde çalışır.
5. Düzenlemeleri yaptıktan sonra GitHub/Vercel gönderimini yine kendi temiz yükleme BAT dosyanla yap.

## Not

Vercel tarafı yine hazır `dist` klasörünü yayınlar. Bu yüzden deploy sırasında uzun build beklememek için `buildCommand` sadece dist kontrolü yapar.
