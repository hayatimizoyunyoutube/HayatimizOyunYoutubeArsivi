# v2.4.0 FIX 14 - Stabil Kapak + AI Uygula + Versiyon Senkron Fix

## Tamamlananlar
- Üst barda Hayatımız Oyun adının altındaki sürüm yazısı artık Redeploy / AI Tanı Merkezi içindeki `Yeni güncelleme versiyonu` alanıyla senkron çalışır.
- Sol yönetim logosundaki `v2.4.0 Yönetim` yazısı sabit kalmaz; seçilen hedef sürüm ve FIX14 bilgisi görünür.
- `Yeni Güncellemeleri Otomatik Ara` butonu tepedeki güncellemeleri, son durum metnini, AI önerilerini ve marka sürümünü birlikte yeniler.
- Oyun Ekle > Kapakları Getir alanı 10 yerine 20 adaya kadar kapak gösterecek şekilde güçlendirildi.
- Alan Wake American Nightmare artık Alan Wake Remastered ile karışmaz; ayrı oyun olarak meta, tarih, tür ve kapak adaylarıyla gelir.
- Max Payne, Max Payne 2, Max Payne 3, Serious Sam 2, Crysis, Resident Evil 4 ve Tomb Raider için yerel kesin kapak/meta eşleşmeleri eklendi.
- AI Özellik Ekle > Siteye Uygula akışı güçlendirildi: özellik uygulanınca `Siteye Uygulandı` listesine taşınır, local kayıt güncellenir, Supabase kaydı denenir, güncelleme notu taslağı oluşur.
- `Nereye Eklendiyse Git` butonu hedefe göre Oyunlar, Deploy Merkezi, Schema Geçmişi, Sistem Sağlık, Raporlar, Seri İzleme, Yayın Takvimi gibi doğru panele gider.

## Not
Bu paket hazır `dist` içerir. Vercel ayarları `outputDirectory: dist`, `installCommand: echo SKIP_INSTALL_READY_DIST`, `buildCommand: echo SKIP_BUILD_READY_DIST` olacak şekilde korunmuştur.
