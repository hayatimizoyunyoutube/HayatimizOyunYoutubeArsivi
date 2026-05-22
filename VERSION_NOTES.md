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
