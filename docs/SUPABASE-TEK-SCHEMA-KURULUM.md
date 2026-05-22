# Supabase Tek Schema Kurulumu

Bu pakette Supabase tarafı tek dosyada birleştirildi:

```txt
supabase/schema.sql
```

## Önemli

Eski dosyaları tek tek çalıştırma:

- `schema-v207.sql`
- `schema-v208.sql`
- `schema-v209.sql`
- `schema-v210.sql`
- `schema-v211.sql`

Bunlar sadece arşiv için `docs/legacy-supabase-versions/` içine taşındı.

## Çalıştırma

1. Supabase panelini aç.
2. SQL Editor bölümüne gir.
3. `supabase/schema.sql` içeriğini komple yapıştır.
4. Run çalıştır.

Bu dosya mevcut veriyi silmez. Tablo varsa kolonları güvenli şekilde ekler.

## İçinde birleşenler

- v2.0.7: games + update_notes
- v2.0.8: sync_sources + sync_logs + site_settings
- v2.0.9: koleksiyon + sezon/bölüm + takvim
- v2.1.0: AI öneri + izleme ilerleme + bildirim + tema + otomasyon
- v2.1.1: test merkezi + hata raporu + API durum

## 404 NOT_FOUND Fix

Bu pakette Vercel için `vercel.json` eklendi.
Ayrıca ZIP artık proje dosyalarını kök dizinde verir; tek klasör içine gömülü değildir.
