# VERSION NOTES - v2.2.0 FIX 4

- Profesyonel arayüz yenileme fix paketi hazırlandı.
- Oyun kartları genişletildi, kapakların sıkışması azaltıldı.
- Tüm ana kategoriler için referans görseller pakete eklendi.
- Sol menü kalıcı, üst menü sade ve adres çubuğu sabit akış korunur.
- Supabase tablo değişikliği yoktur.

# VERSION NOTES - v2.2.0

## Tam Otomatik YouTube Senkron + Profesyonel Arşiv UI

- Bildirimler butonları düzeltildi.
- Ana sayfa profesyonel oyun arşivi görünümüne taşındı.
- Seriyi İzle ekranı büyütüldü ve daha profesyonel hale getirildi.
- Sol kategori menüsü ve sağ profil/istatistik paneli eklendi.
- YouTube senkron ve kullanıcı bazlı bildirim altyapısı güçlendirildi.
- Supabase schema mesajı v2.2.0 olarak güncellendi.

## v2.2.0 FIX 6 FINAL

- Ana sayfa, Seriler ve Oyun Ekleme ekranı daha profesyonel hale getirildi.
- Kapak görsellerinin sıkışması/kırpılması azaltıldı.
- Oyun ekleme formunda çıkış tarihi gün.ay.yıl formatıyla gösterildi.
- Yönetim Paneli > Yayın Takvimi düzenleme ekranı eklendi.
- Supabase schema.sql içine site_calendar_events tablosu eklendi.


## v2.2.0 FIX 13
- Yakında serileri gri/tıklanamaz yapıldı.
- Tamamlanan/Devam Eden/Yakında filtreleri net ayrıldı.
- Mevcut oyunlara ayrı profesyonel arama kutusu eklendi.
- Arama kutuları profesyonel görünüme çekildi.

## v2.2.0 FIX 14
- Çıkış tarihi çekme sistemi gün.ay.yıl formatına sabitlendi.
- Meta + Kapak Çek butonu tarih alanını da dolduracak şekilde güçlendirildi.
- RAWG aday sonuçlarında tarih gösterimi düzeltildi.


## v2.2.1 - Plan Uygulaması
- Oyun isteklerinde yetkili durum değiştirme eklendi.
- Hata bildirimlerinde durum değiştirme ve çözüm notu eklendi.
- Yayın takviminde Ay / Hafta / Gün görünümü gerçek geçişe bağlandı.
- Seri sıralamada sürükle-bırak otomatik kayıt eklendi.
- Arşiv kartlarında görünüm modları eklendi: kompakt, detaylı, poster, yatay kart.
- Hikayeyi spoilersız çekme butonu eklendi.


## v2.2.1 FIX 2
- İlk açılışta çıkan `publicHighlights is not defined` hatası düzeltildi.
- Site yenilemeye gerek kalmadan normal açılacak şekilde güvenli fallback eklendi.


## v2.2.2
- Tür önerileri güçlendirildi.
- Takvim hatırlatıcıları eklendi.
- Görünüm tercihleri Supabase profiline kaydedilecek hale getirildi.
- Seri sıralama geçmişi ve filtreli rapor ekranları eklendi.
- Spoilersız buton kaldırıldı; Hikayeyi Tekrar Çek davranışı düzeltildi.


## v2.2.3
- Plan uygulaması: hatırlatıcı, seri geri alma, istekten oyun ekleme, ekran görüntülü hata ve AI Özellik Merkezi.


## v2.2.3 FIX 3 - AI Ayrı Buton ve Oyun Ekle Stabil
- Oyun Ekle ekranı sadece oyun ekleme/düzenleme için ayrıldı.
- AI Özellik Ekle yönetim panelinde ayrı sayfa/buton olarak sabitlendi.
- Maximum call stack açılış hatası için recursive adminPanel zinciri devre dışı bırakıldı.
- Meta + Kapak Çek, Hikayeyi Tekrar Çek ve Türleri Tekrar Çek formu silmeden çalışacak şekilde yeniden bağlandı.

## v2.2.3 FIX 9 - Oyun Ekle Stabil + AI Ayrı Sayfa
- `v223FixAdminGames is not defined` hatası giderildi.
- Oyun Ekle, AI Özellik Ekle'den ayrıldı.
- AI Özellik Ekle yönetim panelinde ayrı sayfa olarak sabitlendi.
