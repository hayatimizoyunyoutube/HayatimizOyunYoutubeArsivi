# 📝 Not Defteriyle Oyun Ekleme Rehberi — v4.0.0

Bu sistem oyunları tek tek form doldurmadan Not Defteri üzerinden toplu eklemek için hazırlandı.

## 1) Not Defterine Ne Yazacağım?

Her oyun için şu alanları yazabilirsin:

```txt
Oyun: 007 First Light
Seri: James Bond
Durum: Devam Eden
Tür: Aksiyon, Gizlilik, Macera
Etiket: Türkçe Altyazılı, Hikaye Odaklı, Aksiyon
Platform: PC, PlayStation 5, Xbox Series S/X
Tarih: 27.03.2026
Kapak: https://kapak-linki.jpg
Banner: https://banner-linki.jpg
Playlist: https://www.youtube.com/playlist?list=PLAYLIST_ID
Bölüm: 8
Kaldığımız: 0
Puan: 0
Açıklama: Genç James Bond'un MI6 içindeki ilk büyük görevini anlatan sinematik casusluk arşivi.
Hikaye: Bond, ilk resmi saha görevinde uluslararası bir tehdidin izini sürer.
---
Oyun: Alan Wake Remastered
Seri: Alan Wake
Durum: Tamamlanan
Tür: Korku, Gerilim, Hikaye
Etiket: Türkçe Altyazılı, Korku, Hikaye
Platform: PC, PlayStation, Xbox
Tarih: 05.10.2021
Playlist: https://www.youtube.com/playlist?list=PLAYLIST_ID
Bölüm: 12
Açıklama: Karanlık atmosferli psikolojik gerilim arşivi.
```

## 2) Oyunları Nasıl Ayıracağım?

Her oyunun arasına üç çizgi koy:

```txt
---
```

## 3) Siteye Nasıl Ekleyeceğim?

1. Yönetim Paneli'ne gir.
2. **Notla Oyun Ekle** sayfasını aç.
3. Not Defteri'ndeki metni kutuya yapıştır.
4. **Önizle** ile kaç oyun algılandığını kontrol et.
5. **Not Defterindeki Oyunları Supabase’ye Kaydet** butonuna bas.

## 4) Supabase Kaydı Nasıl Çalışır?

- Oyunlar yerel belleğe değil, doğrudan Supabase `games` tablosuna gönderilir.
- Supabase hata verirse “kaydedildi” mesajı gösterilmez.
- Her oyuna otomatik gerçek UUID verilir.
- `rawgSlug` alanına oyun adından slug yazılır.
- Kapak/Banner yoksa varsayılan site kapağı kullanılır.

## 5) Alanlar Zorunlu mu?

Zorunlu olan tek alan:

```txt
Oyun: Oyun Adı
```

Diğer alanlar boşsa sistem güvenli varsayılanlarla doldurur.
