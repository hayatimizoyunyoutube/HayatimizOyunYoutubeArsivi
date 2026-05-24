-- Kendini kurucu yapmak için e-posta adresini değiştirip çalıştır.
update public.site_users
set role = 'kurucu',
    is_active = true,
    banned_at = null,
    ban_reason = null,
    updated_at = now()
where email = 'MAIL_ADRESINI_BURAYA_YAZ';

-- Rol örnekleri:
-- kurucu, yonetici, moderator, editor, user, banned
