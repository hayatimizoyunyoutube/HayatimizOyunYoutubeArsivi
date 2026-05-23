-- Hayatımız Oyun v2.1.3 Fix 14
-- HESAPLAR KALSIN TEMİZ BAŞLANGIÇ
-- site_users silinmez. Açtığın hesaplar ve roller kalır.
-- Yönetim planları, güncelleme notları, admin notları ve bakım ayarı temizlenir.

create extension if not exists pgcrypto;

-- Eksik tablolar varsa önce oluşturulur.
create table if not exists public.site_update_notes (
  id uuid primary key default gen_random_uuid(),
  version text,
  title text,
  note text,
  created_at timestamptz default now()
);

create table if not exists public.site_admin_planner (
  id uuid primary key default gen_random_uuid(),
  group_name text,
  title text,
  status text default 'plan',
  created_at timestamptz default now()
);

create table if not exists public.site_admin_notes (
  id uuid primary key default gen_random_uuid(),
  note text,
  actor_email text,
  created_at timestamptz default now()
);

create table if not exists public.site_runtime_config (
  id uuid default gen_random_uuid(),
  key text,
  value jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

alter table public.site_runtime_config add column if not exists key text;
alter table public.site_runtime_config add column if not exists value jsonb default '{}'::jsonb;
alter table public.site_runtime_config add column if not exists updated_at timestamptz default now();

-- Temizlenecek tablolar.
truncate table public.site_update_notes restart identity;
truncate table public.site_admin_planner restart identity;
truncate table public.site_admin_notes restart identity;
truncate table public.site_runtime_config restart identity;

-- Runtime key constraint.
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'site_runtime_config_key_unique') then
    drop index if exists public.site_runtime_config_key_unique;
    alter table public.site_runtime_config add constraint site_runtime_config_key_unique unique (key);
  end if;
end $$;

-- Seed veriler.
insert into public.site_runtime_config (key, value, updated_at)
values ('maintenance_mode', '{"enabled":false,"message":"Hayatımız Oyun kısa süreli bakımda."}'::jsonb, now());

insert into public.site_update_notes (version, title, note)
values
  ('v2.1.3 Fix 14', 'Temiz başlangıç uygulandı', 'Hesaplar korunarak yönetim ve güncelleme tabloları sıfırlandı.'),
  ('v2.1.3 Fix 14', 'Schema tekrar kurulabilir', 'ON CONFLICT constraint hatası giderildi.');

insert into public.site_admin_planner (group_name, title, status)
values
  ('Eklenen Özellikler', 'Kullanıcı ana sayfasından teknik istatistikleri kaldır', 'tamam'),
  ('Eklenen Özellikler', 'Profil sekmesi ekle', 'tamam'),
  ('Siteye Gelmesi Gerekenler', 'Oyun ekleme formunu Supabase games tablosuna bağla', 'plan'),
  ('Siteye Gelmesi Gerekenler', 'Güncelleme notu editörünü Supabase site_update_notes tablosuna bağla', 'plan'),
  ('Gözden Kaçanlar', 'Bakım modu açıkken guest ve normal kullanıcı kontrolünü tekrar test et', 'kontrol'),
  ('Adminin Önerileri', 'Benim Notlarım alanından eksik/hata girişi ekle', 'kontrol');

notify pgrst, 'reload schema';

select 'Temiz başlangıç tamam: site_users hesapları korundu.' as status;
