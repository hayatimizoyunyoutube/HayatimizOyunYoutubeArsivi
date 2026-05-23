-- Hayatımız Oyun v2.1.3 Fix 14
-- Hatasız schema: ON CONFLICT constraint hatası düzeltildi.
-- SIRA: Tam sıfırlama istiyorsan önce 00-TUM-TABLOLARI-SIFIRLA.sql çalıştır, sonra bu dosyayı çalıştır.

create extension if not exists pgcrypto;

-- =========================================================
-- 1) KULLANICILAR / ROLLER
-- =========================================================
create table if not exists public.site_users (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  email text,
  password_hash text,
  password_salt text,
  role text default 'user',
  is_active boolean default true,
  banned_at timestamptz,
  ban_reason text,
  last_login_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.site_users add column if not exists full_name text;
alter table public.site_users add column if not exists email text;
alter table public.site_users add column if not exists password_hash text;
alter table public.site_users add column if not exists password_salt text;
alter table public.site_users add column if not exists role text default 'user';
alter table public.site_users add column if not exists is_active boolean default true;
alter table public.site_users add column if not exists banned_at timestamptz;
alter table public.site_users add column if not exists ban_reason text;
alter table public.site_users add column if not exists last_login_at timestamptz;
alter table public.site_users add column if not exists created_at timestamptz default now();
alter table public.site_users add column if not exists updated_at timestamptz default now();

update public.site_users set role = 'yonetici', updated_at = now() where lower(coalesce(role,'')) in ('admin','administrator','yönetici');
update public.site_users set role = 'kurucu', updated_at = now() where lower(coalesce(role,'')) in ('founder','owner','sahip');
update public.site_users set role = 'moderator', updated_at = now() where lower(coalesce(role,'')) in ('mod','moderatör');
update public.site_users set role = 'editor', updated_at = now() where lower(coalesce(role,'')) in ('editör');
update public.site_users set role = 'user', updated_at = now() where role is null or trim(role) = '';
update public.site_users set is_active = false where lower(coalesce(role,'')) = 'banned';
update public.site_users set is_active = true where is_active is null;

with ranked_users as (
  select ctid,
         row_number() over (partition by lower(email) order by created_at desc nulls last, ctid desc) as rn
  from public.site_users
  where email is not null and trim(email) <> ''
)
delete from public.site_users u
using ranked_users r
where u.ctid = r.ctid and r.rn > 1;

create unique index if not exists site_users_email_unique_idx on public.site_users (lower(email)) where email is not null;
create index if not exists site_users_role_idx on public.site_users (role);

-- =========================================================
-- 2) GLOBAL BAKIM MODU / RUNTIME CONFIG
-- =========================================================
create table if not exists public.site_runtime_config (
  id uuid default gen_random_uuid(),
  key text,
  value jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

alter table public.site_runtime_config add column if not exists id uuid default gen_random_uuid();
alter table public.site_runtime_config add column if not exists key text;
alter table public.site_runtime_config add column if not exists value jsonb default '{}'::jsonb;
alter table public.site_runtime_config add column if not exists updated_at timestamptz default now();

delete from public.site_runtime_config where key is null;
with ranked_runtime as (
  select ctid,
         row_number() over (partition by key order by updated_at desc nulls last, ctid desc) as rn
  from public.site_runtime_config
  where key is not null
)
delete from public.site_runtime_config t
using ranked_runtime r
where t.ctid = r.ctid and r.rn > 1;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'site_runtime_config_key_unique') then
    drop index if exists public.site_runtime_config_key_unique;
    alter table public.site_runtime_config add constraint site_runtime_config_key_unique unique (key);
  end if;
end $$;

insert into public.site_runtime_config (key, value, updated_at)
values ('maintenance_mode', '{"enabled":false,"message":"Hayatımız Oyun kısa süreli bakımda."}'::jsonb, now())
on conflict (key) do update
set value = coalesce(public.site_runtime_config.value, excluded.value),
    updated_at = now();

-- =========================================================
-- 3) GÜNCELLEME NOTLARI
-- =========================================================
create table if not exists public.site_update_notes (
  id uuid primary key default gen_random_uuid(),
  version text,
  title text,
  note text,
  created_at timestamptz default now()
);

alter table public.site_update_notes add column if not exists version text;
alter table public.site_update_notes add column if not exists title text;
alter table public.site_update_notes add column if not exists note text;
alter table public.site_update_notes add column if not exists created_at timestamptz default now();

with ranked_update_notes as (
  select ctid,
         row_number() over (partition by version, title order by created_at desc nulls last, ctid desc) as rn
  from public.site_update_notes
  where version is not null and title is not null
)
delete from public.site_update_notes t
using ranked_update_notes r
where t.ctid = r.ctid and r.rn > 1;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'site_update_notes_version_title_unique') then
    drop index if exists public.site_update_notes_version_title_unique_idx;
    alter table public.site_update_notes add constraint site_update_notes_version_title_unique unique (version, title);
  end if;
end $$;

delete from public.site_update_notes where version = 'v2.1.3 Fix 14';
insert into public.site_update_notes (version, title, note)
values
  ('v2.1.3 Fix 14', 'Schema ON CONFLICT hatası düzeltildi', 'Unique constraint kurulumu eklendi; schema.sql tekrar çalıştırılabilir.'),
  ('v2.1.3 Fix 14', 'Tam tablo sıfırlama dosyası eklendi', 'İstenirse tüm proje tabloları Supabase Table Editor tarafında temiz başlangıç için silinip yeniden kurulur.'),
  ('v2.1.3 Fix 14', 'Kurulum sırası madde madde yazıldı', 'Önce Supabase, sonra GitHub temiz kurulum, sonra Vercel redeploy sırası netleştirildi.');

-- =========================================================
-- 4) ADMIN PLANNER / ÖZELLİK PLANI
-- =========================================================
create table if not exists public.site_admin_planner (
  id uuid primary key default gen_random_uuid(),
  group_name text,
  title text,
  status text default 'plan',
  created_at timestamptz default now()
);

alter table public.site_admin_planner add column if not exists group_name text;
alter table public.site_admin_planner add column if not exists title text;
alter table public.site_admin_planner add column if not exists status text default 'plan';
alter table public.site_admin_planner add column if not exists created_at timestamptz default now();

with ranked_admin_planner as (
  select ctid,
         row_number() over (partition by group_name, title order by created_at desc nulls last, ctid desc) as rn
  from public.site_admin_planner
  where group_name is not null and title is not null
)
delete from public.site_admin_planner t
using ranked_admin_planner r
where t.ctid = r.ctid and r.rn > 1;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'site_admin_planner_group_title_unique') then
    drop index if exists public.site_admin_planner_group_title_unique_idx;
    alter table public.site_admin_planner add constraint site_admin_planner_group_title_unique unique (group_name, title);
  end if;
end $$;

delete from public.site_admin_planner where group_name in ('Eklenen Özellikler','Siteye Gelmesi Gerekenler','Gözden Kaçanlar','Adminin Önerileri')
  and title in (
    'Kullanıcı ana sayfasından teknik istatistikleri kaldır',
    'Profil sekmesi ekle',
    'Oyun ekleme formunu Supabase games tablosuna bağla',
    'Güncelleme notu editörünü Supabase site_update_notes tablosuna bağla',
    'Bakım modu açıkken guest ve normal kullanıcı kontrolünü tekrar test et',
    'Benim Notlarım alanından eksik/hata girişi ekle'
  );

insert into public.site_admin_planner (group_name, title, status)
values
  ('Eklenen Özellikler', 'Kullanıcı ana sayfasından teknik istatistikleri kaldır', 'tamam'),
  ('Eklenen Özellikler', 'Profil sekmesi ekle', 'tamam'),
  ('Siteye Gelmesi Gerekenler', 'Oyun ekleme formunu Supabase games tablosuna bağla', 'plan'),
  ('Siteye Gelmesi Gerekenler', 'Güncelleme notu editörünü Supabase site_update_notes tablosuna bağla', 'plan'),
  ('Gözden Kaçanlar', 'Bakım modu açıkken guest ve normal kullanıcı kontrolünü tekrar test et', 'kontrol'),
  ('Adminin Önerileri', 'Benim Notlarım alanından eksik/hata girişi ekle', 'kontrol');

-- =========================================================
-- 5) ADMIN NOTLARI
-- =========================================================
create table if not exists public.site_admin_notes (
  id uuid primary key default gen_random_uuid(),
  note text,
  actor_email text,
  created_at timestamptz default now()
);

alter table public.site_admin_notes add column if not exists note text;
alter table public.site_admin_notes add column if not exists actor_email text;
alter table public.site_admin_notes add column if not exists created_at timestamptz default now();

-- =========================================================
-- 6) OYUN / TAKVIM / İLETİŞİM TABLOLARI
-- Bu tablolar Supabase Table Editor tarafında temiz ve tek yapı görünsün diye oluşturulur.
-- =========================================================
create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  title text,
  genre text,
  status text,
  cover_url text,
  score numeric,
  episode_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  title text,
  event_date date,
  description text,
  created_at timestamptz default now()
);

create table if not exists public.game_requests (
  id uuid primary key default gen_random_uuid(),
  user_email text,
  game_title text,
  note text,
  status text default 'bekliyor',
  created_at timestamptz default now()
);

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_email text,
  message text,
  created_at timestamptz default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  user_email text,
  game_id uuid,
  comment text,
  created_at timestamptz default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  from_email text,
  to_email text,
  message text,
  created_at timestamptz default now()
);

create table if not exists public.admin_logs (
  id uuid primary key default gen_random_uuid(),
  actor_email text,
  action text,
  detail jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Eski isimler varsa boş/uyumlu kalsın diye oluşturulur.
create table if not exists public.update_notes (
  id uuid primary key default gen_random_uuid(),
  version text,
  title text,
  note text,
  created_at timestamptz default now()
);

create table if not exists public.users_app (
  id uuid primary key default gen_random_uuid(),
  email text,
  full_name text,
  role text default 'user',
  created_at timestamptz default now()
);

-- =========================================================
-- 7) RLS / POLİTİKALAR
-- =========================================================
alter table public.site_users enable row level security;
alter table public.site_runtime_config enable row level security;
alter table public.site_update_notes enable row level security;
alter table public.site_admin_planner enable row level security;
alter table public.site_admin_notes enable row level security;
alter table public.games enable row level security;
alter table public.calendar_events enable row level security;
alter table public.update_notes enable row level security;

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
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='games' and policyname='games public read') then
    create policy "games public read" on public.games for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='calendar_events' and policyname='calendar events public read') then
    create policy "calendar events public read" on public.calendar_events for select using (true);
  end if;
end $$;

notify pgrst, 'reload schema';

select 'Hayatımız Oyun Supabase schema v2.1.3 Fix 14 hazır.' as status;
