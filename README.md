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


## v2.1.8 FIX - Kullanıcı ve Yetki Tabloları Temiz Sıfırlama

Bu paket yeni sürüm değildir. `supabase/schema.sql` çalıştırıldığında kullanıcı/yetki tabloları temizlenir; oyunlar, seriler, takvim, bakım modu ve güncelleme notları korunur.

## v2.1.8 FIX - Schema Results Çıktısı
Bu pakette `supabase/schema.sql` sonunda kontrol satırı döndürülür. Supabase SQL Editor Results alanında artık yalnızca `Success. No rows returned` yerine yapılan işlem, temizlenen tablolar ve korunan veriler görünür.


## v2.1.9

Profesyonel Yönetim Merkezi ve Takvim Sistemi yeni sürüm paketi eklendi.
