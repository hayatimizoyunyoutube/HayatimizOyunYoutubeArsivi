# v2.4.0 FIX 21 - AI Özellik Profesyonel Hedef Router

Bu paket, Özellik Yaz / AI Uygula sisteminde özelliklerin yanlış yönetim sayfasına eklenmesini önlemek için hazırlandı.

## Düzeltilen ana sorunlar

- `v2.4.2 Planı` veya `v2.4.3 Planı` içindeki **Planı** kelimesi artık **Yayın Takvimi** olarak algılanmaz.
- `AI Özellik`, `Özellik Yaz`, `Öneriyi Siteye Uygula`, `Nereye Eklendiyse Git`, `Yeni Öneriler` gibi istekler otomatik olarak **Yönetim Paneli > AI Özellik Ekle** hedefine kilitlenir.
- Özellik uygulandıktan sonra **Siteye Uygulandı** listesi ile hedef panel kaydı aynı hedefi kullanır.
- Daha önce yanlışlıkla Yayın Takvimi gibi alana düşen AI özellik kayıtları açılışta otomatik düzeltilir.
- `Nereye Eklendiyse Git` butonu aynı profesyonel hedef router üzerinden çalışır.
- Özellik Yaz alanına hedef koruma bilgilendirme kutusu eklendi.

## Profesyonel hedef mantığı

Sistem artık önce isteğin gerçek alanını puanlar:

1. AI / Özellik istekleri
2. Oyun / Kapak / Meta istekleri
3. Seri istekleri
4. Yayın Takvimi istekleri
5. Supabase / Schema istekleri
6. Deploy / Vercel / GitHub istekleri
7. Güncelleme notu istekleri
8. Rapor / hata istekleri

Genel `plan` kelimesi tek başına takvim sayılmaz. Sadece açıkça `yayın takvimi`, `takvim`, `yayın tarihi` veya `program` yazılırsa Takvim hedefi seçilir.

## Deploy notu

FIX20'deki hazır `dist` mantığı korundu. Vercel yine uzun Vite build beklemez; `dist` içindeki FIX21 assetleri direkt yayınlanır.
