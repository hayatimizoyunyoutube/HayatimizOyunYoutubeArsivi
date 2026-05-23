-- Hayatımız Oyun v2.1.3 Fix 14
-- TAM SIFIRLAMA DOSYASI
-- UYARI: Bu dosya aşağıdaki public tabloları tamamen siler.
-- site_users dahil silinir; yani açılmış hesaplar da gider.
-- Temiz sıfır başlangıç istiyorsan EN BAŞTA bunu çalıştır, sonra schema.sql çalıştır.

begin;

drop table if exists public.admin_logs cascade;
drop table if exists public.calendar_events cascade;
drop table if exists public.comments cascade;
drop table if exists public.feedback cascade;
drop table if exists public.friends cascade;
drop table if exists public.game_requests cascade;
drop table if exists public.games cascade;
drop table if exists public.messages cascade;
drop table if exists public.site_admin_notes cascade;
drop table if exists public.site_admin_planner cascade;
drop table if exists public.site_runtime_config cascade;
drop table if exists public.site_settings cascade;
drop table if exists public.site_update_notes cascade;
drop table if exists public.site_users cascade;
drop table if exists public.update_notes cascade;
drop table if exists public.users_app cascade;

commit;

notify pgrst, 'reload schema';

select 'Tüm Hayatımız Oyun public tabloları sıfırlandı. Şimdi supabase/schema.sql çalıştır.' as status;
