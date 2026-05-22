# v2.1.1 Full Merged - Supabase + Vercel Fix

## Düzeltmeler

- Vercel `404 NOT_FOUND` hatası için `vercel.json` eklendi.
- Vite build ayarı için `vite.config.js` eklendi.
- SPA route fallback için `public/_redirects` ve `public/404.html` eklendi.
- Supabase sürümleri tek dosyada birleştirildi: `supabase/schema.sql`.
- Eski `schema-v207` / `schema-v208` / `schema-v209` / `schema-v210` / `schema-v211` dosyaları `docs/legacy-supabase-versions/` içine taşındı.
- ZIP yapısı kök dizin uyumlu hale getirildi; Vercel'in yanlış klasörü deploy etme riski azaltıldı.

## Çalıştırılacak tek Supabase dosyası

`supabase/schema.sql`
