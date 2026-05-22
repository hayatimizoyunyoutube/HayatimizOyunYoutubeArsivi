-- Hayatımız Oyun v2.1.1 Test Center schema
create table if not exists test_runs (
  id uuid primary key default gen_random_uuid(),
  version text not null default 'v2.1.1',
  score int default 0,
  critical_count int default 0,
  warning_count int default 0,
  notes text,
  created_at timestamptz default now()
);
create table if not exists error_reports (
  id uuid primary key default gen_random_uuid(),
  level text not null default 'info',
  area text,
  title text not null,
  detail text,
  status text default 'open',
  created_at timestamptz default now()
);
create table if not exists api_status_checks (
  id uuid primary key default gen_random_uuid(),
  service_name text not null,
  status text not null,
  detail text,
  checked_at timestamptz default now()
);
