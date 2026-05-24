Hayatımız Oyun v2.1.5 Kurulum Sırası

BU SÜRÜMÜN AMACI:
- Kurulum görselleri artık eski sürümleri taşımaz.
- ZIP içinde kurulum-gorselleri klasöründe sadece güncel v2.1.5 görselleri vardır.
- Her yeni sürümde kurulum sırası yeniden yazılacak.
- v2.1.4.9 gerçek modül fix korunur.

1) SUPABASE
Supabase SQL Editor içinde sırayla çalıştır:

1. supabase/01-GUNCELLEME-GUVENLI-KURULUM.sql
2. supabase/schema.sql
3. supabase/02-SUPABASE-RLS-GUVENLIK.sql
4. supabase/03-SUPABASE-RLS-KONTROL.sql  (kontrol amaçlı)
5. supabase/YETKI-ORNEK-SQL-v215.sql     (sadece yetki için)

Tam sıfır kurulum istiyorsan önce şunu çalıştır:
supabase/00-TUM-TABLOLARI-SIFIRLA.sql

Hesaplar kalsın ama yönetim verileri temizlensin istiyorsan:
supabase/SUPABASE-TEMIZ-BASLANGIC-HESAPLAR-KALSIN.sql

2) BİLGİSAYARDA TEMİZ KURULUM
Proje klasöründe 01 BAT dosyasını çalıştır:
01-siteyi-temizle-git-ve-bat-haric.bat

Bu dosya .git klasörünü ve .bat dosyalarını silmez.

3) ZIP İÇERİĞİNİ PROJE KLASÖRÜNE ÇIKAR
ZIP içindeki dosyaları direkt proje klasörünün içine çıkar.

4) GITHUB'A GÖNDER
02-githuba-otomatik-gonder.bat dosyasını çalıştır.

5) VERCEL
Vercel > Deployments > Redeploy > Clear Build Cache.

6) TEST
- Site açılıyor mu?
- Giriş yapınca kendiliğinden çıkış yapıyor mu?
- Akıllı Özellik Ekle çalışıyor mu?
- Oyunlar sekmesinde düzenle/sil çalışıyor mu?
- Supabase games tablosuna kayıt düşüyor mu?

GİZLİ ANAHTAR NOTU:
SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RAWG_API_KEY, YOUTUBE_API_KEY, ADMIN_PASSWORD ZIP içine yazılmaz.
Bunlar sadece Vercel Environment Variables içinde durur.
