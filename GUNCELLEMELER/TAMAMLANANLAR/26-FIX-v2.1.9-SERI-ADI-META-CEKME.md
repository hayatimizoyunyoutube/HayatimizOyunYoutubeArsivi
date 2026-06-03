# 🛠️ FIX v2.1.9 — Seri Adı / Bilgi Çekme Düzeltmesi

## ✅ Yapılanlar

- 🎮 Oyun adıyla meta bilgi çekme akışı düzeltildi.
- 🧩 A Plague Tale: Innocence için yanlış Avatar seri eşleşmesi engellendi.
- 🛡️ API/RAWG/Steam tarafından gelen alakasız seri adı, oyun adından kesin seri anlaşılınca otomatik düzeltiliyor.
- 🧠 `cleanSeriesName` ve form doldurma mantığı daha güvenli hale getirildi.
- 🔎 Seri adı artık `seriesName`, `franchise`, `collectionName` alanları üzerinden kontrollü okunuyor.
- ✅ Yeni sürüm yapılmadı, v2.1.9 FIX olarak işlendi.

## 🗄️ Schema Durumu

✅ **schema.sql gerekli değil.**  
Veritabanı yapısına dokunulmadı; sadece arayüz ve bilgi çekme mantığı düzeltildi.
