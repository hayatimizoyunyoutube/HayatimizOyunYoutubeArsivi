# v2.4.0 FIX 35 - Kapakları Getir + Profesyonel Seri Sıralama

## Düzeltilenler
- Oyun ekle/düzenle ekranında **Kapakları Getir** butonu yeniden stabil hale getirildi.
- Kapak çekme artık yerel katalog + API + Steam yedek aramasıyla aday üretir.
- Kapak seçimi oyun adını değiştirmez; yanlış oyun çekme riski azaltıldı.
- Kapak/meta çekme sadece formu doldurur; Kaydet/Güncelle demeden Supabase kaydı yapılmaz.

## Geliştirilenler
- **Seri Sıralama Merkezi** profesyonel görünüme taşındı.
- Seriler üstte kapaklı kartlar olarak gösterilir.
- Seçilen seri aşağıda detay, ilerleme, bölüm sayısı, sıra inputu ve hızlı düzenleme butonlarıyla açılır.
- Seri arama, yenileme ve kalıcı sıra kaydetme akışı korundu.

## Kontrol
- `node --check src/main.js` başarılı.
- `node --check api/index.js` başarılı.
- Hazır `dist` dosyaları FIX35 olarak güncellendi.
