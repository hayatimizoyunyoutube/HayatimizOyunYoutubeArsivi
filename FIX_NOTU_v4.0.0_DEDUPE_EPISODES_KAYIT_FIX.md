# v4.0.0 FIX - dedupeEpisodes kayıt hatası

## Yapılanlar

- `dedupeEpisodes is not defined` hatası düzeltildi.
- Oyun kaydetme işleminin Supabase’e gitmeden çökmesi engellendi.
- Playlistten gelen bölüm adı, thumbnail, videoId ve videoUrl korunur.
- Oyunu güncelleme sırasında bölüm listesi resetlenmez.
- Yerel kayıt devre dışı; kayıt akışı Supabase odaklıdır.

## Schema

Schema gerekli değil. Yeni tablo/kolon yok.
