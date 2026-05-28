# FIX48 - v2.4.1 Sürüm Sabitleme + Modal Düzenleme Fix

## Yapılanlar
- Üst ve sol arayüzde görünen sürüm v2.4.1 olarak sabitlendi.
- Üst barın sayfa kaydırılırken aşağı doğru yapışıp içerik üzerine gelmesi engellendi.
- Eksik Alanlar ve Düzeltilecek Kayıtlar bölümündeki Eksiği Gider / oyuna tıklama artık ayrı düzenleme penceresini gerçekten açar.
- Eski FIX30 buton yakalama katmanının modal açılışını engellemesi düzeltildi.
- Supabase schema.sql içine site_public_version ve current_site_version kayıtlarını v2.4.1 yapan güvenli blok eklendi.

## Test
- node --check src/main.js
- node --check api/index.js
- node --check dist/assets/hayatimiz-app-fix48.js
- npm run build
