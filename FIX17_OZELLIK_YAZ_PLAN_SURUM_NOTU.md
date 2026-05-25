# FIX 17 - Özellik Yaz Plan Sürümü Otomatik Algılama

## Yapılanlar

- Özellik Yaz alanına `v2.4.3 Planı` yazıldığında sürüm otomatik `v2.4.3` yapılır.
- Üst logo/site adı, sol yönetim adı, Deploy Merkezi, AI öneri kartı ve uygulanan özellik kayıtları aynı sürüme bağlanır.
- FIX paket etiketi kullanıcı arayüzünde gizli kalır.
- F5 sonrası seçilen public sürüm korunur.
- Özellik isteği uygulanırken algılanan sürüm güncelleme notuna ve hedef panele işlenir.

## Kullanım

1. Yönetim Paneli > Deploy Merkezi > Özellik Yaz / Öner aç.
2. Metnin başına örnek olarak `v2.4.3 Planı` yaz.
3. Özelliği Analiz Et ve Öner butonuna bas.
4. Kartta sürüm `v2.4.3` görünür.
5. Öneriyi Siteye Uygula ve Yenile deyince site F5 sonrası da bu sürümle devam eder.
