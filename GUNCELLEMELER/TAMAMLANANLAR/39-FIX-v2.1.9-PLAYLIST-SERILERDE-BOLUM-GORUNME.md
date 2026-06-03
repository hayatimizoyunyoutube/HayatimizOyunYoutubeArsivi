# 🎬 FIX v2.1.9 — Playlist Bölümleri Serilerde Görünme

## Yapılanlar

- ▶️ YouTube playlist çekilince bölüm listesi artık sadece geçici önizlemede kalmaz.
- 💾 Çekilen bölümler oyun kaydının içine de yazılır.
- 🎬 Seriler / Siteden İzle ekranında bölüm listesi otomatik görünür.
- 📺 Sağ taraftaki “Bölüm listesi yok” sorunu düzeltildi.
- 🔁 Eski kayıtlarda bölüm sayısı var ama bölüm JSON’u yoksa güvenli bölüm listesi otomatik oluşturulur.
- 🧩 Playlist ID, bölüm sayısı ve bölüm listesi aynı oyun kaydıyla eşleşir.
- 🛡️ Sayfa yenilenince bölümler kaybolmasın diye local kayıt + oyun kaydı birlikte güncellenir.

## Schema durumu

✅ `schema.sql` gerekli değil.  
Çünkü yeni tablo veya kolon eklenmedi; sadece playlist/bölüm kayıt mantığı düzeltildi.
