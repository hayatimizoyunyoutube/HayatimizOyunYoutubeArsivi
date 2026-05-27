# FIX27 - Supabase Duplicate Key Hatası Düzeltildi

## Hata
Supabase SQL Editor içinde şu hata çıkıyordu:

`duplicate key value violates unique constraint "site_update_notes_version_title_unique_idx"`

Özellikle şu kayıt daha önce eklendiği için schema tekrar çalıştırıldığında hata veriyordu:

`(v2.4.0 FIX 22, AI Özellik Sistemi Kaldırıldı)`

## Çözüm
- `supabase/schema.sql` içindeki tüm `site_update_notes` ekleme kayıtları tekrar çalıştırmaya uygun hale getirildi.
- Aynı `version + title` varsa hata vermek yerine mevcut kayıt güncellenir.
- Schema sonuna FIX27 kayıt bloğu eklendi.

## Kullanım
1. Supabase paneline gir.
2. SQL Editor aç.
3. Bu paketteki `supabase/schema.sql` içeriğini komple yapıştır.
4. Run çalıştır.

Artık aynı schema dosyasını tekrar tekrar çalıştırman sorun çıkarmaz.
