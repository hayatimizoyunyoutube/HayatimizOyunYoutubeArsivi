# Hayatımız Oyun v2.1.3 Fix 9

Bu sürüm kullanıcı ana sayfasını temizler, teknik/yönetim ekranlarını sadece Yönetim Paneli içine taşır, profil sekmesi ekler ve Supabase temiz başlangıç scripti getirir.

## Önemli
- Ekranda hiçbir gizli key veya şifre yazmaz.
- Ayrı yetkili/admin giriş ekranı yoktur.
- Yetki normal giriş yapan hesabın `site_users.role` alanından okunur.
- Rollerde `kurucu`, `yonetici`, `moderator`, `editor`, `user`, `banned` kullanılır.

## Supabase
Önce `supabase/schema.sql` çalıştır.
Temiz başlangıç istersen hesapları koruyarak şu dosyayı çalıştır:
`supabase/SUPABASE-TEMIZ-BASLANGIC-HESAPLAR-KALSIN.sql`
