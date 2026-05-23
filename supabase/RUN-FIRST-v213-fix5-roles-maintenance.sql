-- Hayatımız Oyun v2.1.3 Fix 5 - RUN FIRST
-- Bu dosya site_settings tablosuna dokunmaz; duplicate id=1 hatasına takılmaz.
-- Yetki rolleri, site_users ve global bakım modu tablosunu güvenli şekilde hazırlar.

create extension if not exists pgcrypto;

create table if not exists public.site_users (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text unique not null,
  password_hash text,
  password_salt text,
  role text default 'user',
  provider text default 'site-form',
  is_active boolean default true,
  banned_at timestamptz,
  ban_reason text,
  last_login_at timestamptz,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.site_users add column if not exists role text default 'user';
alter table public.site_users add column if not exists is_active boolean default true;
alter table public.site_users add column if not exists banned_at timestamptz;
alter table public.site_users add column if not exists ban_reason text;
alter table public.site_users add column if not exists updated_at timestamptz default now();
create unique index if not exists site_users_email_unique_idx on public.site_users (email);
create index if not exists site_users_role_idx on public.site_users (role);

-- Eski admin/yönetici değerlerini yeni sistemle uyumlu yap.
update public.site_users set role = 'yonetici', updated_at = now() where lower(coalesce(role,'')) in ('admin','administrator','yönetici');
update public.site_users set role = 'kurucu', updated_at = now() where lower(coalesce(role,'')) in ('founder','owner','sahip');
update public.site_users set role = 'moderator', updated_at = now() where lower(coalesce(role,'')) in ('mod','moderatör');
update public.site_users set role = 'editor', updated_at = now() where lower(coalesce(role,'')) in ('editör');
update public.site_users set role = 'user', updated_at = now() where role is null or trim(role) = '';

create table if not exists public.site_runtime_config (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

insert into public.site_runtime_config (key, value, updated_at) values
  ('maintenance_mode', '{"enabled":false,"message":"Hayatımız Oyun kısa süreli bakımda."}'::jsonb, now())
on conflict (key) do nothing;

insert into public.site_runtime_config (key, value, updated_at) values
  ('role_system', '{"roles":["kurucu","yonetici","moderator","editor","user","banned"],"adminAlias":"yonetici","fullAccess":["kurucu","yonetici"]}'::jsonb, now()),
  ('current_version', '{"version":"v2.1.3-fix-5","name":"Kurucu Yetki + Bakım Kilidi + İşlevli Butonlar"}'::jsonb, now())
on conflict (key) do update set value = excluded.value, updated_at = now();

alter table public.site_users enable row level security;
alter table public.site_runtime_config enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='site_runtime_config' and policyname='site runtime config public read') then
    create policy "site runtime config public read" on public.site_runtime_config for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='site_users' and policyname='site users service role only') then
    create policy "site users service role only" on public.site_users for all using (false) with check (false);
  end if;
end $$;

notify pgrst, 'reload schema';
select 'v2.1.3 fix 5 role + maintenance hotfix hazır' as status;
