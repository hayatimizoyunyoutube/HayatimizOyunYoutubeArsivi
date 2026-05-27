# v2.4.1 FIX64 - Seri Kartları, Bakım Modu ve Paket Temizliği

## Tamamlanan Düzeltmeler

- Tamamlanan serilerde **Kaldığımız Bölüm** alanı gizlendi.
- Yakında / başlanmamış serilerde **Kaldığımız Bölüm** alanı gizlendi.
- **Kaldığımız Bölüm** artık sadece aktif **Devam Eden Seriler** bölümünde görünür.
- Seriler sayfasında Alan Wake gibi çok oyunlu serilerde `+2 oyun` diye gizleme kaldırıldı; alt oyunlar kaydırmalı şekilde tam listelenir.
- Üst menüde kategori yazılarının üst üste binmesi ve arama kutusuna taşması için kompakt kırılım eklendi.
- Bildirim, profil ve Admin alanı dar ekranda taşmayacak şekilde kısaltıldı.
- Bakım modu yönetim paneli sadeleştirildi.
- Bakım modu yüzde alanı kötü görünen büyük blok yerine profesyonel ilerleme çubuğuna taşındı.
- Güncelleme notları satır satır girilip kullanıcı bakım ekranında kartlı görünür hale getirildi.
- Public bakım ekranı sade ve profesyonel hale getirildi.
- Paket boyutunu artıran eski `dist/assets/hayatimiz-app-fixXX.js` ve `hayatimiz-style-fixXX.css` kopyaları temizlendi.
- Sadece güncel `fix64` yayın assetleri ve genel `hayatimiz-app.js / hayatimiz-style.css` dosyaları bırakıldı.

## Korunanlar

- Oyun kayıtları silinmez.
- Kapaklar silinmez.
- Supabase şeması korunur.
- 15 adet planlanan gelecek güncelleme dosyası korunur.
- Git ve BAT temiz kurulum mantığı korunur.
