# v2.4.0 FIX 22 - AI Özellik Sistemi Kaldırıldı

Bu sürümde kullanıcının isteğiyle AI ile özellik yazma, önerme, siteye uygulama ve AI tanı akışları kaldırıldı.

## Yapılanlar
- AI Özellik Ekle menüsü kaldırıldı.
- AI Özellik Merkezi kaldırıldı.
- Özellik Yaz / Öner / Uygula / F5 akışı kaldırıldı.
- Yeni Özellik Önerileri, Yeni Öneriler Öner, Siteye Uygulandı ve Hazır Komut Şablonları sekmeleri kapatıldı.
- Özellik Planı ve Uygulama Merkezi gibi AI özellik yönetimi menüleri gizlendi.
- Deploy Merkezi sade hale getirildi; artık sadece sürüm, GitHub, Vercel ve Supabase durumlarını yönetir.
- AI localStorage kayıtları açılışta temizlenir.
- AI API endpointleri pasif cevap döner.
- schema.sql sonuna AI tablolarını temizleyen FIX22 bloğu eklendi.
- Hazır dist assetleri FIX22 olarak güncellendi.

## Korunanlar
- Oyun ekleme/düzenleme sistemi.
- Kapak/meta çekme alanları.
- Seri sıralama ve durum butonları.
- Yayın takvimi.
- Raporlar, hata bildirimleri ve oyun istekleri.
- GitHub/Vercel hazır dist deploy mantığı.
