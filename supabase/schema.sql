-- Hayatımız Oyun v2.5.2 FIX11 - Güvenli Supabase schema/migration
-- Mevcut verileri silmez. Bakım modu enabled/message/progress/eta değerlerini sıfırlamaz.
create extension if not exists pgcrypto;
create table if not exists public.site_runtime_config (key text primary key, value jsonb, updated_at timestamptz default now());
create table if not exists public.site_update_notes (id bigserial primary key, version text, title text, summary text, note text, description text, status text default 'Tamamlandı', pinned boolean default false, created_at timestamptz default now(), updated_at timestamptz default now());
alter table if exists public.site_update_notes add column if not exists version text;
alter table if exists public.site_update_notes add column if not exists title text;
alter table if exists public.site_update_notes add column if not exists summary text;
alter table if exists public.site_update_notes add column if not exists note text;
alter table if exists public.site_update_notes add column if not exists description text;
alter table if exists public.site_update_notes add column if not exists status text default 'Tamamlandı';
alter table if exists public.site_update_notes add column if not exists pinned boolean default false;
alter table if exists public.site_update_notes add column if not exists created_at timestamptz default now();
alter table if exists public.site_update_notes add column if not exists updated_at timestamptz default now();
create table if not exists public.site_notifications (id uuid primary key default gen_random_uuid(), type text default 'system', title text, message text, status text default 'published', pinned boolean default false, created_at timestamptz default now(), updated_at timestamptz default now());
alter table if exists public.site_notifications add column if not exists type text default 'system';
alter table if exists public.site_notifications add column if not exists title text;
alter table if exists public.site_notifications add column if not exists message text;
alter table if exists public.site_notifications add column if not exists status text default 'published';
alter table if exists public.site_notifications add column if not exists pinned boolean default false;
alter table if exists public.site_notifications add column if not exists created_at timestamptz default now();
alter table if exists public.site_notifications add column if not exists updated_at timestamptz default now();
create table if not exists public.site_schema_versions (id bigserial primary key, version text, note text, created_at timestamptz default now(), updated_at timestamptz default now());
alter table if exists public.site_schema_versions add column if not exists version text;
alter table if exists public.site_schema_versions add column if not exists note text;
alter table if exists public.site_schema_versions add column if not exists created_at timestamptz default now();
alter table if exists public.site_schema_versions add column if not exists updated_at timestamptz default now();
alter table if exists public.games add column if not exists score numeric;
alter table if exists public.games add column if not exists score_source text default 'auto';
alter table if exists public.games add column if not exists manual_score numeric;
alter table if exists public.games add column if not exists series_order integer;
alter table if exists public.games add column if not exists series_name text;
alter table if exists public.games add column if not exists playlist_url text;
alter table if exists public.games add column if not exists updated_at timestamptz default now();
delete from public.site_update_notes where version in ('v2.5.2','v2.5.2 FIX11');
insert into public.site_update_notes (version,title,summary,note,description,status,pinned,created_at,updated_at) values
('v2.5.2','Bildirim ve Duyuru Merkezi','Yönetim paneline Duyuru Merkezi, kullanıcı tarafına bildirim zili, okundu/okunmadı sistemi ve bakım/yayın/seri/bölüm duyuru tipleri eklendi.','Bu ana güncelleme Güncelleme Notları panelinde en üstte gösterilir.','Duyuru Merkezi; sistem, bakım, yayın, yeni seri ve yeni bölüm duyurularını tek yerden yönetir.','Ana Güncelleme',true,now(),now()),
('v2.5.2 FIX11','Temiz Yönetim, Seri Sıralama ve Kalıcı Bakım','Eski karışan patch katmanları temizlendi; güncelleme notları, duyuru merkezi, seri sıralaması ve bakım modu stabil hale getirildi.','Kapak Galerisi Araçları ve RAWG kartları not paneline karışmaz. Ana sayfada debug bar görünmez.','Seri sıralaması series_order/seriesOrder değerleriyle gösterilir. maintenance_mode mevcut ayarları korunur.','Tamamlandı',true,now(),now());
insert into public.site_notifications (id,type,title,message,status,pinned,created_at,updated_at) values ('00000000-0000-4000-8000-000000002511'::uuid,'system','v2.5.2 Bildirim ve Duyuru Merkezi yayında','Duyurular, bakım mesajları, yayın haberleri, yeni seri ve yeni bölüm bildirimleri artık tek merkezden yönetilir.','published',true,now(),now()) on conflict (id) do update set type=excluded.type,title=excluded.title,message=excluded.message,status=excluded.status,pinned=excluded.pinned,updated_at=now();
insert into public.site_runtime_config (key,value,updated_at) values ('update_notes_center',jsonb_build_object('enabled',true,'version','v2.5.2 FIX11','main_update_visible',true,'show_on_homepage',false,'admin_button_only',true,'clean_notes_only',true,'hide_cover_gallery_tools',true,'updated_at',now()),now()) on conflict (key) do update set value=coalesce(public.site_runtime_config.value,'{}'::jsonb)||excluded.value, updated_at=now();
insert into public.site_runtime_config (key,value,updated_at) values ('notifications_center',jsonb_build_object('enabled',true,'version','v2.5.2 FIX11','admin_panel_visible',true,'main_announcement_visible',true,'single_bell',true,'types',jsonb_build_array('system','maintenance','release','series','episode'),'updated_at',now()),now()) on conflict (key) do update set value=coalesce(public.site_runtime_config.value,'{}'::jsonb)||excluded.value, updated_at=now();
insert into public.site_runtime_config (key,value,updated_at) values ('maintenance_update_notes',jsonb_build_object('version','v2.5.2 FIX11','notes',jsonb_build_array(jsonb_build_object('version','v2.5.2','title','Bildirim ve Duyuru Merkezi','summary','Yönetim paneline Duyuru Merkezi, kullanıcı tarafına bildirim zili, okundu/okunmadı sistemi ve bakım/yayın/seri/bölüm duyuru tipleri eklendi.','status','Ana Güncelleme'),jsonb_build_object('version','v2.5.2 FIX11','title','Temiz Yönetim, Seri Sıralama ve Kalıcı Bakım','summary','Eski karışan patch katmanları temizlendi; güncelleme notları, duyuru merkezi, seri sıralaması ve bakım modu stabil hale getirildi.','status','Tamamlandı'),jsonb_build_object('version','v2.5.2 FIX10','title','Ana Güncelleme ve Duyuru Merkezi Görünür','summary','v2.5.2 ana güncellemesi ve Duyuru Merkezi yönetim panelinde görünür hale getirildi.','status','Tamamlandı'),jsonb_build_object('version','v2.5.2 FIX9','title','Temiz Güncelleme Notları ve Admin Bar Fix','summary','Ana sayfadaki FIX bilgi barı kaldırıldı, Güncelleme Notları paneli sadece sürüm notlarını gösterecek şekilde temizlendi.','status','Tamamlandı'),jsonb_build_object('version','v2.5.2 FIX8','title','Güncelleme Notları ve Bildirim Paneli Stabil','summary','Yanlış admin panelleri güncelleme notlarından temizlendi, bildirim panelinin kapanması engellendi.','status','Tamamlandı')),'updated_at',now()),now()) on conflict (key) do update set value=excluded.value, updated_at=now();
update public.site_runtime_config set value=jsonb_set(coalesce(value,'{}'::jsonb),'{updateNotes}',coalesce((select value->'notes' from public.site_runtime_config where key='maintenance_update_notes'),'[]'::jsonb),true), updated_at=now() where key='maintenance_mode';
insert into public.site_runtime_config (key,value,updated_at) select 'maintenance_mode',jsonb_build_object('enabled',false,'message','Hayatımız Oyun kısa süreli bakımda.','progress',0,'percent',0,'eta','','notes',jsonb_build_array(),'updateNotes',coalesce((select value->'notes' from public.site_runtime_config where key='maintenance_update_notes'),'[]'::jsonb),'version','v2.5.2 FIX11'),now() where not exists (select 1 from public.site_runtime_config where key='maintenance_mode');
delete from public.site_schema_versions where version='v2.5.2 FIX11';
insert into public.site_schema_versions (version,note,created_at,updated_at) values ('v2.5.2 FIX11','Eski v2.5.2 patch katmanları temizlendi; yönetim paneli, seri sıralaması ve bakım modu kalıcı hale getirildi.',now(),now());
insert into public.site_runtime_config (key,value,updated_at) values ('schema_version',jsonb_build_object('version','v2.5.2 FIX11','status','Hayatımız Oyun v2.5.2 FIX11 schema hazır. Temiz yönetim, seri sıralama ve kalıcı bakım düzeltildi.','updated_at',now()),now()) on conflict (key) do update set value=excluded.value, updated_at=now();
select 'Hayatımız Oyun v2.5.2 FIX11 schema hazır. Temiz yönetim, seri sıralama ve kalıcı bakım düzeltildi.' as status;
