# FIX62 - schema.sql site_settings Hata Düzeltmesi

Bu paket, Supabase SQL Editor içinde görülen şu hatayı düzeltir:

```sql
ERROR: 42P01: relation "site_settings" does not exist
```

## Yapılan Düzeltme

- `supabase/schema.sql` içine `public.site_settings` uyumluluk tablosu eklendi.
- Eski FIX bloklarındaki `insert into site_settings` komutları `public.site_settings` olarak güvenli hale getirildi.
- `site_settings.key` için benzersiz index oluşturuldu.
- `on conflict (key)` kullanan kayıtlar artık hatasız çalışır.
- `site_runtime_config` sürüm kaydı FIX62 olarak güncellendi.

## Önemli

Bu düzeltme oyunları, serileri, kapakları, playlistleri, XP/Level kayıtlarını veya kullanıcıları silmez.
Sadece eksik tabloyu oluşturur ve schema dosyasının tekrar çalışmasını sağlar.
