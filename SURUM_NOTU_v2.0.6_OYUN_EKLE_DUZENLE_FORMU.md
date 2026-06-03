# v2.0.6 - Oyun Ekle / Düzenle Formu

## Durum
Tamamlandı.

## Yapılanlar
- v2.0.2 stabil taban ve boş/siyah ekran koruması korundu.
- Oyun ekle formu profesyonel kartlı yapıya alındı.
- Oyun düzenleme rotası eklendi: `/yonetim/oyun-duzenle?id=...`.
- Mevcut Oyunlar tablosuna Düzenle butonu eklendi.
- Tür, etiket ve durum alanları ayrıldı.
- Türkçe Altyazılı gibi etiketlerin status/sürüm alanına karışmaması için kayıt akışı düzeltildi.
- Kapak, banner, çıkış tarihi, platform, seri, bölüm, kaldığımız bölüm, hikaye, açıklama, RAWG ID, Steam App ID ve YouTube Playlist URL alanları okunabilir bölümlere ayrıldı.
- Yeni kayıt ve mevcut kayıt güncelleme aynı güvenli formdan çalışır hale getirildi.
- Mobil form taşma ve buton hizalama düzeltmeleri eklendi.
- Güncelleme notları, versiyon ve status bilgileri güncellendi.

## Schema Durumu
- `supabase/schema.sql` güncellendi.
- Komple sıfırlama yapmaz.
- `DROP TABLE` yoktur.
- Mevcut verileri silmez.
- Yeni tablo zorunlu değil; mevcut `games`, `site_update_notes`, `site_runtime_config` ve `site_status_logs` güvenli şekilde güncellenir.

## Sıradaki Sürüm
v2.0.7 - RAWG / Steam / Kapak / Meta Geri Dönüş
