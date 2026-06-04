# v2.2.3 FIX - Oyun Meta ve Tarih Çekme Kesin Düzeltme

## Yapılanlar

- 🗓️ RAWG/Steam/API tarihleri tek formata alındı: GG.AA.YYYY.
- 🎮 Oyun eklerken bilgi çekme alanı tarihleri eksik/yanlış yazmayacak.
- 🛡️ ISO tarihleri otomatik Türkçe tarihe çevrilecek.
- 💾 Supabase kayıt payload içinde release_date güvenli normalize edilecek.
- 🔁 Yerel katalog, RAWG ve Steam dönüşlerinde tarih önceliği düzeltildi.
- 🧩 Oyun düzenleme formunda eski tarih varsa korunacak, yeni çekilen güvenli tarih uygulanacak.

## Schema durumu

Schema gerekli değil. Yeni tablo/kolon yoktur; sadece tarih çekme ve kayıt mantığı düzeltilmiştir.
