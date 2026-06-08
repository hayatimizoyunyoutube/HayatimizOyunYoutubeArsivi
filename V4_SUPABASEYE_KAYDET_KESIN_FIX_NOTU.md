# v4.0.0 Fix - Supabase’ye Kaydet Kesin Onarım

- Oyun formundaki buton Supabase’ye Kaydet olarak güncellendi.
- Yerel kayıt mantığı devre dışı bırakıldı; kayıt sadece Supabase games tablosuna yazılır.
- Kurucu hesabında eski oturumda adminToken yoksa otomatik session-refresh ile token alınır.
- Supabase INSERT başarılı olmazsa oyun kaydedildi gibi gösterilmez.
- Başarılı kayıt sonrası oyun listesi Supabase’den yeniden çekilir.

Schema gerekli değildir.
