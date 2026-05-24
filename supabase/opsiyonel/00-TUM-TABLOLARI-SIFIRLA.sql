-- Hayatımız Oyun v2.1.3 TAM SIFIRLAMA
-- DİKKAT: Bu dosya siteye ait tabloları siler. site_users dahil hesaplar da silinir.
-- Normal güncellemede çalıştırma. Tam temiz başlangıç için çalıştırılır.
-- Sonra mutlaka supabase/schema.sql çalıştır.

drop table if exists public.game_edit_history cascade;
drop table if exists public.site_favorites cascade;
drop table if exists public.game_episodes cascade;
drop table if exists public.site_admin_notes cascade;
drop table if exists public.site_admin_planner cascade;
drop table if exists public.site_features cascade;
drop table if exists public.site_update_notes cascade;
drop table if exists public.site_runtime_config cascade;
drop table if exists public.site_settings cascade;
drop table if exists public.games cascade;
drop table if exists public.site_users cascade;

notify pgrst, 'reload schema';
select 'v2.1.3 tum site tablolari sifirlandi. Simdi supabase/schema.sql calistir.' as status;
