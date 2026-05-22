# Hayatımız Oyun v2.1.1 Full Merged - Hobby Function Fix

Bu sürüm, v2.1.1 Full Merged + Supabase Key Fix üzerine hazırlanmıştır.

## Düzeltme

- Vercel Hobby planındaki 12 Serverless Function sınırı aşıldığı için deploy Error veriyordu.
- `api/` klasöründeki 13 ayrı API dosyası tek dosyada birleştirildi.
- Yeni API router: `api/index.js`
- Vercel rewrite ayarı güncellendi.
- Supabase tek schema sistemi korunmuştur.
- `site_settings.key` hotfix dosyası korunmuştur.

## Kullanılacak Supabase dosyaları

Önce gerekirse:

```txt
supabase/SUPABASE-HOTFIX-site-settings-key.sql
```

Sonra ana birleşik schema:

```txt
supabase/schema.sql
```
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


## v2.1.1 Supabase Key Hotfix
- `site_settings` eski tablo yapısında `key` kolonu yoksa otomatik eklenir.
- Tek schema dosyası güncellendi: `supabase/schema.sql`.
- Hızlı düzeltme dosyası eklendi: `supabase/SUPABASE-HOTFIX-site-settings-key.sql`.
