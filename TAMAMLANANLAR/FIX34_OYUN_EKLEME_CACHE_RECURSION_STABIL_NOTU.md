# v2.4.0 FIX 34 - Oyun Ekleme / Oyun Tıklama Stabilizasyonu

Bu sürümde oyun kartlarına tıklayınca ve oyun ekleme/meta çekme sırasında oluşan `Maximum call stack size exceeded` hatası düzeltildi.

## Düzeltilenler

- `v222GenreFromTitle` ve `fix12GenreFromTitle` arasında sonsuz çağrı oluşturabilecek eski bağlantı kaldırıldı.
- Oyun kartına tıklayınca siteyi hata ekranına atan tür/hikaye üretme döngüsü güvenli motora alındı.
- Eski `FIX31`, `FIX32`, `FIX33` asset dosyaları da aynı güvenli kodla güncellendi. Tarayıcı eski cache üzerinden `hayatimiz-app-fix31.js` çağırsa bile yeni stabil kod çalışır.
- Oyun ekleme ekranında tür çekme ve hikaye çekme işlemleri Supabase’e otomatik kayıt yapmaz; sadece formu doldurur.
- Meta + kapak çekme sırasında oyun adı korunur, farklı oyuna geçiş engellenir.
- API tarafında Alan Wake / Alan Wake 2 / Alan Wake American Nightmare gibi benzer adlar için daha güvenli eşleşme uygulanır.

## Kontrol

- `node --check src/main.js` geçti.
- `node --check api/index.js` geçti.
- `npm run build` hazır dist kontrolü geçti.
