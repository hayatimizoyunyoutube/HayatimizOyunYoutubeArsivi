# 🗄️ v2.1.2 FIX - Schema Supabase Yetki Verme

## Durum
✅ Tamamlandı

## Yapılanlar
- Yeni sürüm yapılmadı; v2.1.2 FIX olarak işlendi.
- `supabase/schema.sql` güvenli şekilde güncellendi.
- `DROP TABLE` yok; mevcut kullanıcı, oyun, bakım ve not verileri silinmez.
- Supabase Table Editor üzerinden yetki verilebilmesi için `site_authority_assignments` tablosu eklendi.
- Rol sözlüğü için `site_role_definitions` tablosu eklendi.
- SQL Editor üzerinden hızlı yetki vermek için `public.set_site_user_role(...)` fonksiyonu eklendi.
- Kurucu, Yönetici, Moderatör, İçerik Editörü, Üye ve Banlı rolleri Türkçe/emojili açıklamalarla tutuldu.
- Yetki tablosuna girilen e-posta otomatik `site_users` tablosuna işlenir.
- Yetkili roller otomatik `site_admin_profiles` tablosuna da senkronlanır.

## SQL örneği
```sql
select * from public.set_site_user_role('ornek@mail.com','moderator','Yetkili Adı');
```

## Schema Durumu
✅ schema.sql gerekli.
✅ Sıfırlamaz.
✅ Mevcut verileri silmez.
