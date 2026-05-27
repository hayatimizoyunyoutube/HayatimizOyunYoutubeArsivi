# v2.4.0 FIX 41 - Oyun Formu Kapak / Çıkış Tarihi / Tür Butonları

## Yapılanlar

- Oyun Ekle ve Mevcut Oyunu Düzenle formunun alt buton alanına **Kapakları Getir** eklendi.
- Aynı alana **Çıkış Tarihini Tekrar Çek** eklendi.
- Aynı alana **Türleri Tekrar Çek** eklendi.
- Kapak araması RAWG, Steam Store, internet/görsel arama benzeri havuz ve yerel DLC katalog adaylarını birlikte kullanacak şekilde genişletildi.
- Kapak seçimi oyun adını değiştirmez.
- Çıkış tarihi gün.ay.yıl formatına çevrilir.
- Türler Türkçe yazılır ve etiket alanına da işlenir.
- Bu işlemlerin hiçbiri **Oyunu Kaydet / Oyunu Güncelle** demeden Supabase'e kayıt yapmaz.

## Kontrol

- `node --check src/main.js` başarılı.
- `node --check api/index.js` başarılı.
- Hazır `dist` FIX41 dosyaları oluşturuldu.
