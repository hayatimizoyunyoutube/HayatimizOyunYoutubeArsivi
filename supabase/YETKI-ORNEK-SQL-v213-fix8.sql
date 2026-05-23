-- Kendi hesabını kurucu yapmak için e-posta adresini değiştir.
update public.site_users
set role = 'kurucu',
    is_active = true,
    banned_at = null,
    ban_reason = null,
    updated_at = now()
where email = 'MAIL_ADRESINI_BURAYA_YAZ';

-- Yönetici yapmak için:
update public.site_users
set role = 'yonetici', is_active = true, banned_at = null, ban_reason = null, updated_at = now()
where email = 'MAIL_ADRESINI_BURAYA_YAZ';

-- Moderatör yapmak için:
update public.site_users
set role = 'moderator', is_active = true, banned_at = null, ban_reason = null, updated_at = now()
where email = 'MAIL_ADRESINI_BURAYA_YAZ';

-- Editör yapmak için:
update public.site_users
set role = 'editor', is_active = true, banned_at = null, ban_reason = null, updated_at = now()
where email = 'MAIL_ADRESINI_BURAYA_YAZ';
