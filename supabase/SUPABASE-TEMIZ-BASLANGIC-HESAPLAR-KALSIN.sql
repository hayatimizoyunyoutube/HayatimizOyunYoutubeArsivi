-- Hayatımız Oyun temiz başlangıç scripti
-- Bu dosya site_users tablosundaki hesapları SİLMEZ.
-- Açtığın hesaplar kalır; yönetim notları, planlar, güncelleme notları ve bakım ayarı temizlenip yeniden hazırlanır.

create extension if not exists pgcrypto;

-- Hesapları koru, sadece rol/aktiflik yapısını düzelt.
update public.site_users set role = 'yonetici', updated_at = now() where lower(role) in ('admin','administrator','yönetici');
update public.site_users set role = 'kurucu', updated_at = now() where lower(role) in ('founder','owner','sahip');
update public.site_users set role = 'user', updated_at = now() where role is null or trim(role) = '';
update public.site_users set is_active = true where is_active is null;

truncate table public.site_update_notes restart identity cascade;
truncate table public.site_admin_planner restart identity cascade;
truncate table public.site_admin_notes restart identity cascade;
truncate table public.site_runtime_config restart identity cascade;

insert into public.site_runtime_config (key, value, updated_at)
values ('maintenance_mode', '{"enabled":false,"message":"Hayatımız Oyun kısa süreli bakımda."}'::jsonb, now())
on conflict (key) do update set value = excluded.value, updated_at = now();

insert into public.site_update_notes (version, title, note)
values
  ('v2.1.3 Fix 9', 'Temiz başlangıç', 'Kullanıcı hesapları korunarak yönetim tabloları temizlendi.'),
  ('v2.1.3 Fix 9', 'Profil ve admin notları', 'Profil sekmesi ve benim notlarım alanı hazırlandı.');

insert into public.site_admin_planner (group_name, title, status)
values
  ('Eklenen Özellikler', 'Kullanıcı ana sayfasından teknik istatistikleri kaldır', 'kontrol'),
  ('Eklenen Özellikler', 'Profil sekmesi ekle', 'kontrol'),
  ('Siteye Gelmesi Gerekenler', 'Oyun ekleme formunu Supabase games tablosuna bağla', 'plan'),
  ('Siteye Gelmesi Gerekenler', 'Güncelleme notu editörünü Supabase site_update_notes tablosuna bağla', 'plan'),
  ('Gözden Kaçanlar', 'Bakım modu açıkken guest ve normal kullanıcı kontrolünü tekrar test et', 'kontrol'),
  ('Adminin Önerileri', 'Benim Notlarım alanından eksik/hata girişi ekle', 'kontrol');

notify pgrst, 'reload schema';

select 'Temiz başlangıç tamam: site_users hesapları korundu, diğer yönetim tabloları yenilendi.' as status;
