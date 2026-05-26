# v2.4.0 FIX 42 - Profesyonel Temizlik + Çıkış Tarihi Kontrol

## Yapılanlar

- Yönetim paneli tekrar sadeleştirildi: AI / Deploy / Redeploy kalıntıları kullanıcı arayüzünden temiz tutulur.
- Profesyonel Dashboard eklendi.
- İçerik Kontrol paneli eklendi:
  - Kapaksız oyunlar
  - Çıkış tarihi eksik oyunlar
  - Türü eksik oyunlar
  - Seri adı eksik oyunlar
  - Bölüm / playlist eksik oyunlar
- Oyun Ekle / Mevcut Oyunu Düzenle ekranındaki butonlar gruplandı:
  - Tüm Bilgileri Çek
  - Kapakları Getir
  - Çıkış Tarihini Çek
  - Türleri Çek
  - Açıklama Çek
  - Playlist Bölümleri Çek
  - Oyunu Kaydet / Oyunu Güncelle
- Çıkış tarihi çekme sistemi güçlendirildi:
  - Yerel kesin katalog
  - Steam Store
  - RAWG
  - İnternet tarih araması
- Alan Wake DLC/Expansion kayıtları için tarih ve kapak katalogları güçlendirildi.
- Kapak seçince oyun adı değişmez.
- Çekme işlemleri Supabase'e otomatik kayıt yapmaz; sadece Kaydet/Güncelle butonu kayıt yapar.
- Hazır `dist` dosyaları FIX42 olarak güncellendi.

## Testler

- `node --check src/main.js`
- `node --check api/index.js`
- `npm run build`

Üç kontrol de başarılı geçti.
