# Hayatımız Oyun v2.1.1 Full Merged - Supabase + Vercel Fix

Bu paket v2.0.7 ile v2.1.1 arasındaki özellikleri tek projede toplar ve iki sorunu düzeltir:

1. Vercel `404 NOT_FOUND` için `vercel.json` eklendi.
2. Supabase sürüm SQL dosyaları tek dosyada birleştirildi: `supabase/schema.sql`.

## Vercel Ayarı

- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

## Supabase Ayarı

Supabase SQL Editor içinde sadece şu dosyayı çalıştır:

```txt
supabase/schema.sql
```

Eski sürüm SQL dosyaları arşiv olarak `docs/legacy-supabase-versions/` içine taşındı.

## Temiz Kurulum

`.git` klasörünü koru, diğer eski dosyaları sil, ZIP içeriğini proje köküne çıkar ve force push yap.
