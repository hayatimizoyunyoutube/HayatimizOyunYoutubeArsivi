-- Kurucu yetkisi ver
update public.site_users
set role = 'kurucu', is_active = true, banned_at = null, ban_reason = null, updated_at = now()
where email = 'SENIN_MAIL_ADRESIN';

-- Yönetici yetkisi ver
update public.site_users
set role = 'yonetici', is_active = true, banned_at = null, ban_reason = null, updated_at = now()
where email = 'SENIN_MAIL_ADRESIN';

-- Moderatör yetkisi ver
update public.site_users
set role = 'moderator', is_active = true, banned_at = null, ban_reason = null, updated_at = now()
where email = 'KULLANICI_MAILI';

-- Editör yetkisi ver
update public.site_users
set role = 'editor', is_active = true, banned_at = null, ban_reason = null, updated_at = now()
where email = 'KULLANICI_MAILI';

-- Kullanıcıya düşür
update public.site_users set role = 'user', updated_at = now() where email = 'KULLANICI_MAILI';

-- Banla
update public.site_users
set role = 'banned', is_active = false, banned_at = now(), ban_reason = 'Yetkili panelinden banlandı', updated_at = now()
where email = 'KULLANICI_MAILI';

-- Bakım modunu aç
insert into public.site_runtime_config (key, value, updated_at)
values ('maintenance_mode', '{"enabled":true,"message":"Hayatımız Oyun kısa süreli bakımda."}'::jsonb, now())
on conflict (key) do update set value = excluded.value, updated_at = now();

-- Bakım modunu kapat
insert into public.site_runtime_config (key, value, updated_at)
values ('maintenance_mode', '{"enabled":false,"message":"Hayatımız Oyun yayında."}'::jsonb, now())
on conflict (key) do update set value = excluded.value, updated_at = now();

notify pgrst, 'reload schema';
