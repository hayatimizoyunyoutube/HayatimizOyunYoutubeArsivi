# FIX v2.3.0 — Playlist Bölüm Direkt Supabase Kayıt

## Yapılanlar

- 🎬 YouTube playlistten çekilen bölüm adları olduğu gibi korunur.
- 🖼️ YouTube thumbnail görselleri oyun/site kapağıyla ezilmez.
- 💾 Oyun kaydedilirken `episodes` JSON'u Supabase `games.episodes` alanına direkt gönderilir.
- 🔁 Seriler ekranı artık kayıttan sonra gerçek bölüm adı ve gerçek bölüm kapağını gösterir.
- 🛡️ Bölüm yoksa oyun kapağı; o da yoksa site kapağı son çare olarak kullanılır.

## Schema

Gerekli değil. Mevcut `games.episodes` jsonb alanı kullanılır.
