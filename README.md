# Hayatımız Oyun v2.1.8 - Yetki Paneli ve Kullanıcı Yönetimi

Bu paket **v2.1.8 - Yetki Paneli ve Kullanıcı Yönetimi

## Öne Çıkanlar
- Seri yönetimi ekranı daha profesyonel hale getirildi.
- Seri içindeki oyunları seçme/çıkarma güçlendirildi.
- Sürükle-bırak ve sayı ile sıra düzenleme korundu.
- Seçili oyunları A-Z, bölüm, durum ve tarih sırasına göre hızlı düzenleme eklendi.
- Seri sırası önizleme paneli eklendi.
- Tüm Seriyi İzle akışı korundu.
- Supabase kalıcı kayıt akışı güvenli çalışır.

## Schema
`schema.sql` güncellendi ve gereklidir. Sıfırlamaz, `DROP TABLE` içermez, mevcut verileri silmez. Yeni tablo/kolon eklemez; v2.1.8 - Yetki Paneli ve Kullanıcı Yönetimi

## BAT Dosyaları
Ana klasörde sadece iki BAT dosyası kalmalıdır:

- `01-siteyi-temizle-git-ve-bat-haric.bat`
- `02-githuba-otomatik-gonder.bat`
