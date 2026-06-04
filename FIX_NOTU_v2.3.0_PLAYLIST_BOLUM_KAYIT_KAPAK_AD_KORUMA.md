# FIX v2.3.0 — Playlist Bölüm Kayıt Kapak/Ad Koruma

## Yapılanlar

- 🎬 Playlist çekilince gelen gerçek bölüm adları korunur.
- 🖼️ Playlist çekilince gelen gerçek YouTube bölüm kapakları korunur.
- 💾 Oyun kaydedildiğinde Supabase dönüşü boş/eksik episode verisiyle doğru listeyi ezmez.
- 🔁 Seri sayfasında site kapağı yerine bölüm thumbnail görselleri gösterilir.
- 🛡️ `videoId`, `videoUrl`, `thumbnail`, `title`, `number` alanları birleştirilerek güvenli saklanır.
- 🚫 `hayatimiz-kapak` sadece son çare olarak kullanılır.

## Schema Durumu

schema.sql gerekli değil. Yeni tablo/kolon yoktur.
