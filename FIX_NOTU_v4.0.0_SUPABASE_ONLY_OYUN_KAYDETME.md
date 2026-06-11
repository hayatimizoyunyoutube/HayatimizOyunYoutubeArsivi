# v4.0.0 FIX — Oyun Kaydetme Supabase Only

## Yapılanlar

- Yerel kayıt fallback'i oyun ekleme/güncelleme akışından kaldırıldı.
- Oyun ekleme artık önce Supabase'e kayıt atar.
- Supabase başarılı dönerse Mevcut Oyunlar listesi Supabase'den yenilenir.
- Supabase hata verirse oyun yerel belleğe yazılmaz; kullanıcıya gerçek hata gösterilir.
- Bölüm listesi ve YouTube thumbnail verileri Supabase başarılı kayıt sonrası korunur.
- Yetkili oturum/admin token yoksa kayıt engellenir ve açık uyarı verir.

## Schema

schema.sql gerekli değil.
Yeni tablo/kolon eklenmedi.
