# v2.2.3 FIX - Yayın Takvimi Kapak Otomatik Eşleşme

## Yapılanlar

- 📅 Yayın takvimine oyun adı yazıldığında kapak otomatik eşleşir.
- 🎮 Oyun adı, seri adı, koleksiyon adı, slug ve ID üzerinden arama yapılır.
- 🧠 Noktalama/iki nokta/boşluk farkları temizlenir. Örn: `A Plague Tale Innocence` → `A Plague Tale: Innocence` eşleşir.
- 🖼️ Eşleşen oyunun kapak/banner görseli takvim kartında gösterilir.
- 💾 Takvim kaydına `gameId`, `seriesName` ve `cover` bilgisi de yazılır.
- 🛡️ Oyun bulunamazsa kayıt bozulmaz; sadece varsayılan kapak kullanılır.

## Schema Durumu

schema.sql gerekli değil. Yeni tablo/kolon eklenmedi.
