# v4.0.0 FIX — Supabase UUID Oyun Kaydetme Kesin Düzeltme

## Sorun
Supabase `games.id` kolonu UUID olduğu için frontend tarafındaki slug/id değeri (`007-first-light-...`) doğrudan `id` kolonuna yazılınca şu hata oluşuyordu:

```text
invalid input syntax for type uuid
```

## Düzeltme
- Oyun eklerken `games.id` alanına artık gerçek UUID yazılır.
- Slug değerleri ayrı `slug` kolonunda tutulur.
- Eski frontend id/slug değerleri UUID kolonuna gönderilmez.
- Oyun güncellemede önce UUID ile, yoksa slug ile mevcut kayıt aranır.
- Kayıt yoksa update yerine güvenli yeni Supabase kaydı oluşturulur.
- Bölüm/thumbnail listesi korunur.

## Schema
Yeni tablo gerekmiyor. `slug` kolonu eski schema içinde zaten güvenli şekilde eklenmiştir.
