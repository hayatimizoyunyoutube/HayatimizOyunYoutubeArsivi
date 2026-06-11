# YouTube Playlist Kesin Çekme Kurulumu v4.0.2

Vercel Environment Variables içine `YOUTUBE_API_KEY` ekle.

Bu sürüm playlist videolarını `playlistItems.list` mantığıyla çeker. Sonuçlar:

- `games.episodes` JSON alanına yazılır.
- `episodes` tablosuna `game_id + episode_number` unique olacak şekilde kaydedilir.
- Sahte/not defteri fallback bölüm üretilmez.
