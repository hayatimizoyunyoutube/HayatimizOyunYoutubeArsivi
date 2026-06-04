# v2.2.8 FIX — Seri Bölüm Kayıt Fotoğraf/Yazı Koruma

## Yapılanlar

- 🎬 Playlist çekildikten sonra kayıt ederken bölüm başlıklarının bozulması engellendi.
- 🖼️ Bölüm fotoğrafları kayıttan sonra korunacak.
- 🧩 `thumbnail`, `thumbnailUrl`, `snippet.thumbnails`, `resourceId.videoId` gibi farklı YouTube alanları güvenli okunacak.
- 💾 Oyun düzenlemede bölüm JSON'u boş gelirse eski doğru bölüm listesi silinmeyecek.
- 🔁 Supabase'e yazarken bölüm listesi doğru foto/yazı ile kaydedilecek.

Schema durumu: schema.sql gerekli değil.
