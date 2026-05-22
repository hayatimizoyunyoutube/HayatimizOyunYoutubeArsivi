-- Hayatımız Oyun v2.1.0 Supabase hazırlık şeması
-- Mevcut tabloları silmez; yeni modüller için güvenli ek tablolar oluşturur.

create table if not exists public.watch_progress (
  id uuid primary key default gen_random_uuid(),
  game_id text not null,
  user_key text default 'default',
  episode text,
  percent int default 0 check (percent >= 0 and percent <= 100),
  last_watched_at timestamptz default now(),
  next_episode text,
  created_at timestamptz default now()
);

create table if not exists public.ai_recommendations (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  reason text,
  confidence int default 0 check (confidence >= 0 and confidence <= 100),
  action text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.notification_feed (
  id uuid primary key default gen_random_uuid(),
  level text default 'bilgi',
  title text not null,
  body text,
  is_read boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.theme_presets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  preset_key text unique not null,
  accent text,
  description text,
  is_active boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.automation_rules (
  id uuid primary key default gen_random_uuid(),
  rule_key text unique not null,
  title text not null,
  is_enabled boolean default true,
  config jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);
