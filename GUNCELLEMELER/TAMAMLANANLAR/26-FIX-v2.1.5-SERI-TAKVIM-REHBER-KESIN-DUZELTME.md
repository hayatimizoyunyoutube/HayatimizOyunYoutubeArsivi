# 🛠️ v2.1.5 FIX - Seri, Takvim ve Rehber Kesin Düzeltme

Bu paket yeni sürüm değildir. Mevcut v2.1.5 sürümü korunarak kullanıcıdan gelen hatalar düzeltildi.

## Düzeltilenler

- 🎬 **A Plague Tale: Innocence** için yanlış seri adı eşleşmesi engellendi.
- 🎬 Eski/local kayıtta seri adı yanlışlıkla **Avatar** gibi alakasız bir değere dönmüşse başlıktan doğru seri adı otomatik üretilir.
- 🎭 Hikaye metni bozuk veya örnek formatta gelirse profesyonel hikaye metni üretilir.
- 👑 **Yetkili Rehberi** public üst menüden kaldırıldı.
- 👑 Yetkili Rehberi yönetim paneli içindeki menüde kalmaya devam eder.
- 📅 **Yayın Takvimi** sadece yönetim panelinde kalmadı; normal kullanıcılar ve kayıt yapmayan ziyaretçiler için public sayfa eklendi.
- 📅 Yeni public rota: `/yayin-takvimi`
- 🏠 Ana sayfadaki takvim kartı public takvime bağlandı.
- 🧭 Üst menüye public **Yayın Takvimi** bağlantısı eklendi.

## Schema Durumu

Schema gerekli değildir. Yeni tablo veya kolon eklenmedi.

## Kontrol

- `npm run build` başarılı.
- `node --check src/main.js` başarılı.
- Üst menüde Yetkili Rehberi public görünmez.
- Yayın Takvimi kullanıcıya açık görünür.
