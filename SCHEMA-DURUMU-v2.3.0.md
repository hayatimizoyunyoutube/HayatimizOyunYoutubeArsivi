# Schema Durumu — v2.3.0

**schema.sql gerekli değil** ✅

Yeni tablo veya kolon eklenmedi. Mevcut oyunlar, kullanıcılar, takvim kayıtları ve bakım ayarları korunur.

İstersen sadece Supabase log için aşağıdaki kayıt çalıştırılabilir:

```sql
insert into public.admin_activity_logs (action, detail, actor_email)
values (
  'version_update',
  'v2.3.0 Premium Seri Sayfası ve Arşiv Deneyimi paketi yüklendi.',
  'mertdundaroyunda@gmail.com'
);
```
