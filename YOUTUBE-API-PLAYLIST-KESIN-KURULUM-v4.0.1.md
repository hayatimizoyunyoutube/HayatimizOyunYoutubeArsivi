# YouTube Playlist Kesin Çekme Kurulumu v4.0.1

Bu paketle playlist bölümleri artık sahte/yerel liste üretmez. Bölümler yalnızca YouTube Data API v3 ile çekilir.

## Vercel Environment Variables

Vercel > Project > Settings > Environment Variables içine ekle:

```text
YOUTUBE_API_KEY=BURAYA_YOUTUBE_DATA_API_KEY
```

Alternatif isimler de desteklenir:

```text
YOUTUBE_DATA_API_KEY
GOOGLE_API_KEY
VITE_YOUTUBE_API_KEY
```

## Playlist şartları

- Playlist herkese açık olmalı.
- Linkte `list=` parametresi olmalı.
- YouTube Data API v3 Google Cloud tarafında aktif olmalı.

## Artık yapılmayacaklar

- Kanal logosu bölüm kapağı olarak yazılmaz.
- Site kapağı bölüm thumbnail üstüne yazılmaz.
- API çalışmazsa sahte bölüm listesi oluşturulmaz.
- Eski doğru bölüm listesi boş sonuçla ezilmez.
