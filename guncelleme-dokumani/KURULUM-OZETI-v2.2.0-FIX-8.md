# Kurulum Özeti - v2.2.0 FIX 8

1. `.git`, `.env` ve BAT dosyalarını koru.
2. Eski site dosyalarını temizle.
3. ZIP içeriğini proje klasörüne çıkar.
4. `npm install` çalıştır.
5. `npm run build` ile test et.
6. GitHub'a temiz force push yap.
7. Vercel'de Clear Build Cache ile Redeploy yap.
8. Supabase SQL Editor içinde `supabase/schema.sql` dosyasını çalıştır.

Bu fixte yeni tablolar vardır: `site_game_requests` ve `site_bug_reports`.
