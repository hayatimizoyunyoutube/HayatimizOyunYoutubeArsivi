# SQL Hata Düzeltme - v2.2.0 FIX 9

Supabase hatası:

```txt
ERROR: column "written" of relation "site_update_notes" does not exist
```

Çözüm:

```sql
insert into public.site_update_notes (version,title,summary,note,status,created_at)
```

`written` kolonu yerine `note` kolonu kullanıldı.
