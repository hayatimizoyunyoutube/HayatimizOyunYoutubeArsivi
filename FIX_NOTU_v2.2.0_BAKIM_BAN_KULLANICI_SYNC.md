# v2.2.0 FIX - Bakım, Ban ve Kullanıcı Senkronizasyonu

Yeni sürüm değildir. v2.2.0 üzerinde güvenlik ve Supabase kayıt fixidir.

## Yapılanlar

- 🛠️ Bakım modu public kullanıcı ve giriş yapmayan ziyaretçiye Supabase’den okunarak gösterilecek.
- 🚫 Banlı kullanıcı oturumu açmış olsa bile Supabase kaydı yenilenince site yerine ban ekranı görecek.
- 👥 Kullanıcı listesine tarayıcı oturumundan sahte kullanıcı eklenmesi durduruldu.
- ☁️ Kullanıcı listesi Supabase Auth + site_users + yetki tablosundan çekilecek.
- 💾 Yeni Auth kullanıcıları kullanıcı yenileme sırasında site_users tablosuna işlenecek.
- 🗑️ Kullanıcı silme işlemi site_users, yetki kaydı ve mümkünse Supabase Auth kaydını birlikte temizleyecek.
- 👑 Kurucu hesaplar Supabase site_users tablosuna güvenli şekilde tekrar işlenecek.
- 🏷️ Cache etiketi yenilendi; Vercel eski JS dosyasını tutmasın diye asset query güncellendi.

## Schema Durumu

Schema.sql gerekli değil. Mevcut v2.2.0 schema çalıştıysa yeni tablo/kolon eklenmedi.
