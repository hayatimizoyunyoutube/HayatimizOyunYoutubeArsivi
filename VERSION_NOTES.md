# Hayatımız Oyun v2.1.3

## Yeni Özellikler
- Supabase kullanıcı kayıtları: `Kayıt Ol` formu `public.site_users` tablosuna kayıt gönderir.
- Giriş yap sistemi Supabase tablosundan hash kontrolü yapar.
- Admin girişinde test şifresi artık ekranda görünmez.
- Admin parolası Vercel `ADMIN_PASSWORD` üzerinden kontrol edilir.
- Yönetim Paneline `Özellik Planı` eklendi.
- Özellik Planında dört alan var: eklenen özellikler, siteye gelmesi gerekenler, gözden kaçanlar, adminin önerileri.
- `schema.sql` v2.1.3 için güncellendi ve eski sürümlerle tek dosyada kaldı.
- Tek `api/index.js` kullanıldığı için Vercel Hobby planında function limiti aşılmaz.

## Supabase
Çalıştırılacak tek dosya: `supabase/schema.sql`

Yeni tablo: `public.site_users`

## v2.1.3 Fix 1

- Vercel `404: NOT_FOUND` için API route düzeltmesi yapıldı.
- Kayıt/giriş istekleri artık `/api` üzerinden çalışır.
- SPA rewrite ile API rewrite çakışması azaltıldı.
- Service role key ve admin password güvenlik uyarıları eklendi.

## v2.1.3 Fix 2 - Supabase Schema Cache Fix

- `site_settings_pkey id=1 duplicate` hatası düzeltildi.
- `public.site_users schema cache içinde bulunamadı` hatası için PostgREST cache reload eklendi.
- `SUPABASE-HOTFIX-v213-fix2-site-users-cache.sql` dosyası eklendi.
- Ana `supabase/schema.sql` tekrar çalıştırılabilir hale getirildi.
