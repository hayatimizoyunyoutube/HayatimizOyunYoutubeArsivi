# 🛠️ v2.1.9 FIX — Oyun Bilgisi Çekme / Seri Adı Düzeltmesi

## ✅ Yapılanlar

- 🎮 **Oyun adıyla bilgi çekme sistemi düzeltildi.**
- 🧩 **A Plague Tale: Innocence artık yanlışlıkla Avatar serisine bağlanmayacak.**
- 🛡️ RAWG/Steam/API tarafında gelen alakasız seri adı, oyun adından kesin seri anlaşılınca ezilecek.
- 🧠 Seri adı güvenli temizleme mantığı güçlendirildi.
- 🔎 `seriesName`, `franchise`, `collectionName` gibi alanlar kontrollü okunacak.
- ✅ Bilgi çekme sonrası Seri Adı alanı daha doğru doldurulacak.
- 🚫 Yeni sürüm yapılmadı; bu paket yalnızca **v2.1.9 FIX** paketidir.

## 🗄️ Schema Durumu

✅ **schema.sql gerekli değil.**  
Çünkü veritabanına yeni tablo, kolon veya view eklenmedi. Sadece frontend bilgi çekme ve form doldurma mantığı düzeltildi.
