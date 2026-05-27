# FIX31 - Oyun Listesi Kaybolma Koruması

Bu sürümde oyunların kaybolmuş görünmesine neden olan Supabase/API boş response sorunu için koruma eklendi.

## Yapılanlar

- `games-list` API artık tek sorguya bağlı değil; kolon farkı olursa sırasıyla `select=*` fallback sorgularına geçer.
- Supabase geçici hata verirse ön yüzde mevcut oyun listesi sıfırlanmaz.
- Son sağlam oyun listesi `localStorage` cache içine yazılır.
- API boş liste döndürürse önce son sağlam cache geri yüklenir.
- Oyun ekleme, güncelleme, silme ve bölüm ilerleme işlemlerinden sonra cache güncellenir.
- Vercel hazır `dist` dosyaları FIX31 olarak yenilendi.

## Kullanım

ZIP’i temiz kurulum yöntemiyle yükle. Vercel deploy sonrası Ctrl+F5 yap. Oyunlar Supabase’de duruyorsa tekrar görünür; Supabase geçici hata verse bile son sağlam liste korunur.
