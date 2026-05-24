-- Hayatımız Oyun v2.1.4.8
-- RLS kontrol sorgusu. Sadece kontrol için çalıştırılır.

select
  schemaname,
  tablename,
  rowsecurity as rls_aktif
from pg_tables
where schemaname = 'public'
  and tablename in (
    'games',
    'site_users',
    'site_features',
    'site_admin_planner',
    'site_admin_notes',
    'site_runtime_config',
    'site_update_notes',
    'update_notes',
    'users_app'
  )
order by tablename;
