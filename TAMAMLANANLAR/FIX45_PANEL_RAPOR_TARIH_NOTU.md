# FIX45 - Panel, Rapor ve Çıkış Tarihi Düzeltmeleri

## Yapılanlar
- Yönetim paneli akordeon menüsü aç/kapat çalışır hale getirildi.
- Üstteki gereksiz kategori menüsü kaldırıldı; sol kategori paneli korundu.
- Takip adı Yayın Takvimi olarak düzeltildi.
- Kullanıcı tarafına Oyun İste ve Hata Bildir bağlantıları geri eklendi.
- Yönetim Paneli Bildirim Çubuğu profesyonel hale getirildi.
- Raporlar sayfası işlevli hale getirildi: eksik kapak, eksik çıkış tarihi, eksik tür, bölüm eksiği, oyun istekleri ve hata bildirimleri birlikte görünür.
- Raporu JSON olarak indirme butonu eklendi.
- Çıkış tarihi çekme sistemi daha sıkı eşleşme kullanır ve tarihi doğrudan forma işler.
- Alan Wake DLC / The Writer / The Signal / Night Springs gibi kayıtların yanlış tarih çekmesi azaltıldı.

## Test
- node --check src/main.js
- node --check dist/assets/hayatimiz-app-fix45.js
- node scripts/vercel-static-build-check.mjs
