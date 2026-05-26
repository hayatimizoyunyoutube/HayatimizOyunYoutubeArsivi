# v2.4.0 FIX 18 - Oyun Durum Butonları Stabil

## Yapılan düzeltme
- Oyun güncelle ekranındaki **Tamamlanan**, **Devam Eden** ve **Yakında** butonları düzeltildi.
- Mevcut oyun düzenleme penceresinde durum butonuna basınca seçim artık kaybolmaz.
- Buton seçimi form içindeki **Durum** select alanına yazılır.
- Form tekrar render edilse bile düzenlenen oyunun geçici state kaydı güncellenir.
- **Oyunu Güncelle** butonuna basınca seçilen durum Supabase güncelleme isteğine de gönderilir.
- Yeni oyun ekleme formunda da aynı butonlar draft kaydına yazılır.

## Kontrol
1. Yönetim Paneli > Oyunlar > Mevcut Oyunlar alanına gir.
2. Bir oyunda düzenle butonuna bas.
3. Tamamlanan / Devam Eden / Yakında seçeneklerinden birini seç.
4. Buton aktif görünmeli ve alttaki Durum alanı aynı değere dönmeli.
5. Oyunu Güncelle deyince oyun kartındaki durum değişmelidir.
