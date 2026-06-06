# v4.0.1 Supabase Temiz Sıfırlama

Supabase ile site uyumsuz kaldıysa bu dosyayı çalıştır:

`supabase/SUPABASE-TEMIZ-SIFIRLAMA-UYUMLU-v4.0.1.sql`

Ne yapar?
- Mevcut games kayıtlarını önce `games_backup_v401_reset` içine yedekler.
- `games` tablosunu siteyle tam uyumlu hale getirir.
- Oyun tablosunu temizler.
- RLS okuma/yazma izinlerini açar.
- v4.0.1 sürüm bilgisini Supabase runtime config içine yazar.
- Bakım modunu kapalı yapar.

Dikkat: games tablosunu boşaltır. Kullanıcı/yetki kayıtlarını silmez.
