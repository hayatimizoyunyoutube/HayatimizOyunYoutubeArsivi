-- Hayatımız Oyun v2.1.3 Fix 9
-- Güvenli tek schema: kullanıcı hesaplarını silmez, eksik tabloları/kolonları ekler.

create extension if not exists pgcrypto;

create table if not exists public.site_users (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  email text unique not null,
  password_hash text,
  password_salt text,
  role text not null default 'user',
  is_active boolean not null default true,
  banned_at timestamptz,
  ban_reason text,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.site_users add column if not exists full_name text;
alter table public.site_users add column if not exists password_hash text;
alter table public.site_users add column if not exists password_salt text;
alter table public.site_users add column if not exists role text not null default 'user';
alter table public.site_users add column if not exists is_active boolean not null default true;
alter table public.site_users add column if not exists banned_at timestamptz;
alter table public.site_users add column if not exists ban_reason text;
alter table public.site_users add column if not exists last_login_at timestamptz;
alter table public.site_users add column if not exists created_at timestamptz not null default now();
alter table public.site_users add column if not exists updated_at timestamptz not null default now();

update public.site_users set role = 'yonetici', updated_at = now() where lower(role) in ('admin','administrator','yönetici');
update public.site_users set role = 'kurucu', updated_at = now() where lower(role) in ('founder','owner','sahip');
update public.site_users set role = 'moderator', updated_at = now() where lower(role) in ('mod','moderatör');
update public.site_users set role = 'editor', updated_at = now() where lower(role) in ('editör');
update public.site_users set role = 'user', updated_at = now() where role is null or trim(role) = '';
update public.site_users set is_active = false where lower(role) = 'banned';

create unique index if not exists site_users_email_unique_idx on public.site_users (lower(email));
create index if not exists site_users_role_idx on public.site_users (role);

create table if not exists public.site_runtime_config (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.site_runtime_config (key, value, updated_at)
values ('maintenance_mode', '{"enabled":false,"message":"Hayatımız Oyun kısa süreli bakımda."}'::jsonb, now())
on conflict (key) do update
set value = coalesce(public.site_runtime_config.value, excluded.value),
    updated_at = now();

create table if not exists public.site_update_notes (
  id uuid primary key default gen_random_uuid(),
  version text not null,
  title text not null,
  note text,
  created_at timestamptz not null default now()
);
create unique index if not exists site_update_notes_version_title_unique_idx on public.site_update_notes (version, title);

insert into public.site_update_notes (version, title, note)
values
  ('v2.1.3 Fix 9', 'Kullanıcı ana sayfası temizlendi', 'Teknik kartlar yönetim paneline taşındı; profil ve admin notları eklendi.'),
  ('v2.1.3 Fix 9', 'Supabase temiz başlangıç', 'Hesapları koruyan temizlik scripti eklendi.')
on conflict (version, title) do update set note = excluded.note;

create table if not exists public.site_admin_planner (
  id uuid primary key default gen_random_uuid(),
  group_name text not null,
  title text not null,
  status text not null default 'plan',
  created_at timestamptz not null default now()
);
create unique index if not exists site_admin_planner_group_title_unique_idx on public.site_admin_planner (group_name, title);

insert into public.site_admin_planner (group_name, title, status)
values
  ('Eklenen Özellikler', 'Kullanıcı ana sayfasından teknik istatistikleri kaldır', 'kontrol'),
  ('Eklenen Özellikler', 'Profil sekmesi ekle', 'kontrol'),
  ('Siteye Gelmesi Gerekenler', 'Oyun ekleme formunu Supabase games tablosuna bağla', 'plan'),
  ('Siteye Gelmesi Gerekenler', 'Güncelleme notu editörünü Supabase site_update_notes tablosuna bağla', 'plan'),
  ('Gözden Kaçanlar', 'Bakım modu açıkken guest ve normal kullanıcı kontrolünü tekrar test et', 'kontrol'),
  ('Adminin Önerileri', 'Benim Notlarım alanından eksik/hata girişi ekle', 'kontrol')
on conflict (group_name, title) do update set status = excluded.status;

create table if not exists public.site_admin_notes (
  id uuid primary key default gen_random_uuid(),
  note text not null,
  actor_email text,
  created_at timestamptz not null default now()
);

alter table public.site_users enable row level security;
alter table public.site_runtime_config enable row level security;
alter table public.site_update_notes enable row level security;
alter table public.site_admin_planner enable row level security;
alter table public.site_admin_notes enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='site_runtime_config' and policyname='site runtime public read') then
    create policy "site runtime public read" on public.site_runtime_config for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='site_update_notes' and policyname='site update notes public read') then
    create policy "site update notes public read" on public.site_update_notes for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='site_admin_planner' and policyname='site admin planner public read') then
    create policy "site admin planner public read" on public.site_admin_planner for select using (true);
  end if;
end $$;

notify pgrst, 'reload schema';

select 'Hayatımız Oyun Supabase schema v2.1.3 Fix 9 hazır' as status;
