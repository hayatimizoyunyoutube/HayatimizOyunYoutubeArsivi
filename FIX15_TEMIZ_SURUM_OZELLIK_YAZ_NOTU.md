# v2.4.0 FIX 15 - Temiz Sürüm + Özellik Yaz / AI Uygula

- Site adının yanında görünen FIX etiketi kullanıcı arayüzünden kaldırıldı; üst logo ve sol yönetim adı artık sadece seçilen sürümü gösterir.
- Deploy Merkezi içine küçük **Sadece son sayı** kutusu eklendi. Örneğin kutuya `2` yazınca sürüm `v2.4.2` olarak güncellenir.
- AI özellik alanına **Özellik Yaz** bölümü eklendi. Yönetici isteğini normal cümleyle yazar, sistem hedef sayfayı ve nasıl uygulanacağını önerir.
- **Öneriyi Siteye Uygula ve Yenile** butonu eklendi. Özellik uygulananlar listesine, güncelleme notuna ve ilgili yönetim sayfasına işlenir; ardından F5 yenileme yapılır.
- Uygulanan özel özellikler hedef sayfada **AI ile Bu Alana Eklenen Özellikler** kartı altında görünür.
- Kapak/oyun/meta gibi yazılan istekler ilgili özellik anahtarlarını otomatik aktif eder.

## Kullanım

1. Yönetim Paneli > Deploy Merkezi ekranına gir.
2. Yeni sürümü tam yazabilir veya **Sadece son sayı** kutusuna sayı girebilirsin.
3. Yönetim Paneli > Özellik Yaz / AI Uygula alanına gir.
4. İstediğin özelliği normal cümleyle yaz.
5. **Özelliği Analiz Et ve Öner** butonuna bas.
6. Öneri doğruysa **Öneriyi Siteye Uygula ve Yenile** butonuna bas.
7. Site F5 yapar ve özellik ilgili yönetim alanında kart olarak görünür.
