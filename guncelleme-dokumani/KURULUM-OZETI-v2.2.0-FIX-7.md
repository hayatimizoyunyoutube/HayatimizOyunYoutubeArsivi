# KURULUM ÖZETİ - v2.2.0 FIX 7

1. `.git`, `.env` ve BAT dosyalarını silme.
2. Eski site dosyalarını temizle.
3. Bu ZIP içeriğini proje klasörüne çıkar.
4. `npm install`
5. `npm run build`
6. GitHub'a force push yap.
7. Vercel > Redeploy > Clear Build Cache ile yeniden yayınla.
8. Supabase SQL Editor içinde `supabase/schema.sql` dosyasını çalıştır.

## Supabase Notu
Bu fixte `site_calendar_events` tablosuna yeni takvim alanları eklendiği için schema.sql çalıştırılmalıdır.
