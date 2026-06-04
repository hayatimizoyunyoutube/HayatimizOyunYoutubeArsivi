# 🗂️ Güncellemeler Klasörü Kuralı

## Klasör Düzeni

- ✅ `GUNCELLEMELER/TAMAMLANANLAR`: Bitmiş sürüm ve fix kayıtları burada tutulur.
- 📌 `GUNCELLEMELER/PLANLANANLAR`: Sadece yapılacak sürümler burada kalır.
- 🧹 Bir sürüm tamamlanınca planlananlardan kaldırılır ve tamamlananlara eklenir.

## Bundan Sonraki Fix ve Sürüm Kuralı

- 🏷️ ZIP adı, Vercel/GitHub etiketi, siteConfig, `/api/health`, `/status`, update notes ve `schema.sql` Results aynı sürümü göstermeli.
- 🛡️ Fix paketleri yeni sürüm sayılmaz; mevcut sürümün FIX paketi olarak yazılır.
- 💾 Supabase verilerini sıfırlayan SQL yazılmayacak.
- 🛠️ Bakım modu, ban sistemi, kullanıcı/yetki kayıtları ve oyun kayıtları güncellemede korunacak.
- 👑 Kurucu hesap: `mertdundaroyunda@gmail.com` korunacak.
