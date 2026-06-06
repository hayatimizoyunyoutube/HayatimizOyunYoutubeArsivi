# Not Defteriyle Oyun Ekleme Rehberi - v4.0.1

Yönetim Paneli > Notla Oyun Ekle sayfasına aşağıdaki formatı yapıştır. Her oyun arasına `---` koy.

## Şablon

```txt
OYUN: 007 First Light
STEAM APP ID: 3123790
STEAMDB: https://steamdb.info/app/3123790/
DURUM: Devam Eden
SERİ: James Bond
TÜR: Aksiyon, Macera, Gizlilik
ETİKET: Türkçe Altyazılı, Hikaye Odaklı, Playlist
PLATFORM: PC, PlayStation 5, Xbox Series S/X, Nintendo Switch
ÇIKIŞ TARİHİ: 2026
TOPLAM BÖLÜM: 2
KALDIĞIMIZ BÖLÜM: 0
PLAYLIST: https://www.youtube.com/playlist?list=PLAYLIST_ID_BURAYA
KAPAK: https://...
BANNER: https://...
KISA AÇIKLAMA: Kartlarda görünecek kısa açıklama.
HİKAYE: Karakter, görev, mekan, atmosfer ve bölüm akışı odaklı arşiv anlatımı.
---
OYUN: Alan Wake Remastered
STEAM APP ID: 108710
STEAMDB: https://steamdb.info/app/108710/
DURUM: Tamamlanan
SERİ: Alan Wake
TÜR: Psikolojik Korku, Gerilim, Hikaye Odaklı
ETİKET: Türkçe Altyazılı, %100
PLATFORM: PC, PlayStation 5, Xbox Series S/X
ÇIKIŞ TARİHİ: 05.10.2021
TOPLAM BÖLÜM: 12
KALDIĞIMIZ BÖLÜM: 12
PLAYLIST: https://www.youtube.com/playlist?list=PLAYLIST_ID_BURAYA
KISA AÇIKLAMA: Alan Wake'in karanlık atmosferli hikaye arşivi.
HİKAYE: Bright Falls çevresinde geçen psikolojik gerilim, karakter çatışması ve gizemli olay örgüsüyle arşivlenir.
```

## Kurallar
- `OYUN` zorunlu.
- `STEAM APP ID` veya `STEAMDB` yazarsan SteamDB bağlantısı saklanır.
- `PLAYLIST` yazarsan bölüm çekme için kullanılır.
- `KAPAK` ve `BANNER` boş bırakılabilir.
- Kaydetme işlemi yerel değil Supabase içindir. Supabase boş dönerse mevcut oyunlar silinmez.
