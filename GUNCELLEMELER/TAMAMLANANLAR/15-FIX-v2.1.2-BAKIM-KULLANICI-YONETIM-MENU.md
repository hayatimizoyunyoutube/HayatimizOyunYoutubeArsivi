# 🛠️ v2.1.2 FIX - Bakım, Kullanıcı ve Yönetim Menü Düzeltmesi

## Amaç
Yeni sürüm yapmadan, v2.1.2 içinde kalan kritik arayüz ve yönetim hatalarını düzeltmek.

## Düzeltilenler
- Bakım modu kapatıldıktan sonra normal kullanıcıda/kayıtsız ziyaretçide bakım ekranının takılı kalma riski azaltıldı.
- Supabase bakım modu kapalı gelirse ziyaretçi localStorage içindeki eski açık bakım kaydıyla zorla bakımda tutulmaz.
- Bakım modu kapatma işlemi Supabase'e `enabled:false` olarak daha net kaydedilir.
- Bakım ekranındaki yeniden dene butonu yerel bakım önbelleğini temizleyip siteyi tekrar kontrol eder.
- Yeni kayıt olan kullanıcılar yerel kullanıcı listesine Supabase ID/rol bilgisiyle eklenir.
- Kullanıcılar ve Yetkiler sayfası açılınca Supabase kullanıcı listesini otomatik yeniler.
- Supabase kullanıcı listesi gelirse yerel kullanıcılarla birleştirip gösterir.
- Sol menüde yönetim alt sayfaları tek tek görünmez; sadece Yönetim Paneli kalır.
- Yönetim alt araçları Yönetim Paneli içine taşındı.

## Schema Durumu
Schema gerekli değil. Yeni tablo/kolon eklenmedi.

## Kural
Bu bir FIX paketidir, yeni sürüm değildir.
