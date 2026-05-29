# v2.4.0 FIX 39 - Seri Sıralama Sürükle Bırak Görünür Fix

## Yapılanlar

- Kullanıcının gördüğü **Yönetim Paneli > Seri İzleme / Seri Sıralama** ekranı da gerçek sürükle bırak motoruna bağlandı.
- Satırların soluna belirgin **⠿ Sürükle** alanı eklendi.
- Oyunu tutup yukarı/aşağı taşıyınca sıra numarası ekranda anında değişir.
- Alternatif olarak **↑ / ↓** butonlarıyla da sıra değiştirilebilir.
- Değişiklikler otomatik Supabase kaydı yapmaz. Kalıcı kayıt için **Seri Sırasını Kalıcı Kaydet** butonuna basılır.
- Eski FIX31-FIX38 cache JS dosyaları da FIX39 koduyla değiştirildi.

## Kontrol

- `node --check src/main.js` başarılı.
- `npm run build` hazır dist kontrolü başarılı.
