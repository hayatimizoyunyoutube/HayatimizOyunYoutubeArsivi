# Kullanıcı ve Yetki Tablolarını Temiz Sıfırlama

Bu dosya v4.0.0 paketindeki `supabase/schema.sql` için açıklamadır.

## Ne silinir?
- `site_users`
- `site_admin_profiles`
- `site_authority_assignments`
- `site_user_role_audit`
- `site_user_watch_history`

## Ne korunur?
- Oyunlar
- Seriler
- Bölümler
- Takvim
- Bakım modu ayarı
- Güncelleme notları
- Status kayıtları

## Çalıştırma
Supabase > SQL Editor > New query alanına `schema.sql` içeriğini yapıştırıp Run yap.

## Sonra yetki verme
```sql
select * from public.set_site_user_role('mail@example.com','kurucu','Kurucu');
select * from public.set_site_user_role('moderator@example.com','moderator','Moderatör');
select * from public.set_site_user_role('editor@example.com','editor','İçerik Editörü');
```
