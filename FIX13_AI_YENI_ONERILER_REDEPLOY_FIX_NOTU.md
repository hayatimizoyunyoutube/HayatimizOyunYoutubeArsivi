# v2.4.0 FIX 13 - AI Yeni Öneriler + Redeploy Güncelleme Fix

## Yapılan Düzeltmeler
- Redeploy / AI Tanı Merkezi içindeki **Yeni Güncellemeleri Otomatik Ara** butonu düzeltildi.
- Butona basınca üstteki durum kartları artık anında **Başarılı** durumuna geçer.
- Son durum metni gerçek tarih/saat ile güncellenir.
- Seçilen **Yeni güncelleme versiyonu** AI önerilerine senkron bağlanır.
- FIX12'deki eski offset/localStorage anahtarı çakışması giderildi; öneriler artık gerçekten değişir.

## AI Özellik Ekle Yenilikleri
- AI Özellik Ekle ekranına yeni **Yeni Öneriler Öner** alanı eklendi.
- Kategori seçerek öneri üretme desteği eklendi.
- 10 öneriyi toplu değiştirme akışı korundu.
- Her kartta **Siteye Uygulandı** ve **Öneri Değiştir** çalışır.
- Öneriler seçili sürümle birlikte local changelog/güncelleme notu akışına işlenir.

## Deploy Merkezi Yenilikleri
- **Tepedeki Güncellemeler** listesi eklendi.
- Yeni Güncellemeleri Otomatik Ara işlemi sonrası seçili sürüm için 10 planlanan öneri görünür.
- GitHub, Supabase ve AI öneri durumları ayrı ayrı takip edilir.

## Supabase
- `site_ai_suggestion_scans` tablosu eklendi.
- `site_ai_feature_registry` için `suggestion_source` ve `focus_category` kolonları eklendi.
- `schema_version` kaydı v2.4.0 FIX 13 olarak güncellendi.
