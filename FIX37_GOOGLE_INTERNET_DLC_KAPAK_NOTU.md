# v2.4.0 FIX 37 - Google/İnternet DLC Kapak Havuzu

## Düzeltilen Sorun
- Alan Wake DLC/Expansion isimlerinde `Kapakları Getir` az sonuç getiriyordu.
- Night Springs, The Lake House, The Writer, The Signal gibi DLC kapakları yeterince görünmüyordu.

## Yapılanlar
- Kullanıcının gönderdiği Night Springs görseli pakete yerel asset olarak eklendi:
  - `public/assets/alan-wake-night-springs.png`
  - `dist/assets/alan-wake-night-springs.png`
- Kapak havuzu genişletildi:
  - Alan Wake II: Night Springs
  - Alan Wake II: The Lake House
  - Alan Wake: The Writer
  - Alan Wake: The Signal
  - Alan Wake
  - Alan Wake Remastered
  - Alan Wake's American Nightmare
  - Alan Wake 2
- API tarafına canlı internet görsel araması eklendi. İnternet sonucu gelmezse yerel güvenli katalog çalışır.
- Kapak seçince oyun adı değişmez.
- Çıkış tarihi, seri, tür ve açıklama alanları forma işlenir.
- Supabase'e otomatik kayıt yapılmaz; kayıt yine sadece `Kaydet/Güncelle` ile yapılır.

## Kontrol
- `node --check src/main.js`
- `node --check api/index.js`
- `npm run build`
