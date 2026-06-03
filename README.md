# Hayatımız Oyun v2.2.1

# v2.2.1 - Premium Bakım Merkezi ve Sürüm Senkronizasyonu

- 🎬 Bakım ekranı 007 First Light esintili hareketli sinematik arka plana güncellendi.
- 🏷️ Sürüm etiketleri v2.2.1 olarak eşitlendi.
- 🛠️ Bakım/ban/Supabase güvenlik sistemi korunur.

# Hayatımız Oyun v2.2.1

Bu paket bakım modu, banlı kullanıcı erişimi ve Supabase kullanıcı senkronizasyonu fixidir. Yeni sürüm değildir.

# v2.2.1 - Sürüm / Vercel / Results Eşitleme

- Supabase Results çıktısı v2.2.1 olarak güncellendi.
- Vercel/GitHub commit etiketi v2.2.1 olarak düzeltildi.
- Eski v2.1.8 temiz sıfırlama schema bloğu kaldırıldı; veriler korunur.

# Hayatımız Oyun v2.1.9 - Profesyonel Yönetim Merkezi ve Takvim Sistemi

Bu paket **v2.1.9 - Profesyonel Yönetim Merkezi ve Takvim Sistemi

## Öne Çıkanlar
- Seri yönetimi ekranı daha profesyonel hale getirildi.
- Seri içindeki oyunları seçme/çıkarma güçlendirildi.
- Sürükle-bırak ve sayı ile sıra düzenleme korundu.
- Seçili oyunları A-Z, bölüm, durum ve tarih sırasına göre hızlı düzenleme eklendi.
- Seri sırası önizleme paneli eklendi.
- Tüm Seriyi İzle akışı korundu.
- Supabase kalıcı kayıt akışı güvenli çalışır.

## Schema
`schema.sql` bu FIX için gerekli değildir. Yeni tablo/kolon eklenmedi; v2.1.9 adminMetric ve deploy etiketi düzeltmesi

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

## v2.2.1

Bakım ekranı, Supabase kalıcılık ve ban güvenliği eklendi. Bu sürümde schema.sql gereklidir ama güvenli yazılmıştır; mevcut verileri silmez.
