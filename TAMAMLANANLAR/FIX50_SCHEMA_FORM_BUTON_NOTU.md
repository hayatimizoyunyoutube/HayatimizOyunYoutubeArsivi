# v2.4.1 FIX50 - Schema JSON + Form Buton Stabilizasyonu

## Düzeltilenler
- Supabase `schema.sql` içindeki `site_runtime_config.value` alanına düz metin yazan hatalı blok düzeltildi.
- `site_public_version` ve `current_site_version` kayıtları artık JSONB formatında yazılır.
- `site_update_notes` için hatalı `image/written` kolon kullanımı kaldırıldı; doğru kolonlar `image_url` ve `note` olarak kullanılır.
- İlk açılıştaki `Site yükleniyor...` bloklayıcı ekran kaldırıldı.
- Oyun ekle ve oyun düzenle formundaki veri çekme butonları erken yakalama katmanına alındı.

## Form Butonları
Aşağıdaki butonlar artık sayfa yenilemeden forma işler:
- Kapakları Getir
- Çıkış Tarihini Çek
- Türleri Çek
- Açıklama Çek
- Tüm Bilgileri Çek
- Playlist Bölümleri Çek

Bu butonlar otomatik Supabase kaydı yapmaz. Kayıt sadece `Oyunu Kaydet` veya `Oyunu Güncelle` ile yapılır.
