# v4.0.2 Supabase Temiz Reset

Çalıştırılacak dosya:

`schema.sql`

veya aynı içerik:

`supabase/SUPABASE-TEMIZ-SIFIRLAMA-UYUMLU-v4.0.2.sql`

## Ne yapar?

- `games` ve `episodes` tablolarını kurar.
- Mevcut oyunları `games_reset_backup_v402` içine yedeklemeye çalışır.
- İstek üzerine temiz başlangıç için `games` ve `episodes` tablolarını sıfırlar.
- `site_users` / kullanıcı yetki kayıtlarına dokunmaz.
- Runtime sürümünü `v4.0.2` yazar.
