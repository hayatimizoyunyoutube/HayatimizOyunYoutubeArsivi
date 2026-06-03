# FIX NOTU - Supabase View Column Hatası

Bu paket yeni sürüm değildir. v2.1.8 FIX olarak kalır.

## Çözülen hata
Supabase SQL Editor içinde görülen hata:

`ERROR: 42P16: cannot change name of view column "full_name" to "role_code"`

## Yapılan düzeltme
`supabase/schema.sql` içinde sadece view yapıları güvenli şekilde yeniden oluşturulacak hale getirildi:

- `drop view if exists public.site_authority_panel;` eklendi.
- `drop view if exists public.site_admin_data_health;` eklendi.

Bu işlem tablo silmez, kullanıcıları silmez, oyunları silmez. Sadece Supabase view görünümünü yeniden oluşturur.

## Kullanım
Supabase > SQL Editor içinde güncel `supabase/schema.sql` dosyasını tekrar çalıştır.
