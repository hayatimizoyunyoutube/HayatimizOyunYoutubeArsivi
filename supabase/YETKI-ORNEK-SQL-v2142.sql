-- Hayatımız Oyun v2.1.4.3 yetki örnekleri
-- MAIL_ADRESINI_BURAYA_YAZ kısmını kendi hesabınla değiştir.

-- Kurucu yap:
update public.site_users
set role = 'kurucu', is_active = true, banned_at = null, ban_reason = null, updated_at = now()
where email = 'MAIL_ADRESINI_BURAYA_YAZ';

-- Yönetici yapmak için role = 'yonetici'
-- Moderatör yapmak için role = 'moderator'
-- Editör yapmak için role = 'editor'
-- Normal kullanıcı yapmak için role = 'user'

select email, role, is_active from public.site_users order by created_at desc;
