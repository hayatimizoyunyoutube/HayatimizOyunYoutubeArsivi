# Hayatımız Oyun - v2.1.5 FIX

Bu paket güncelleme değil, v2.1.5 üzerine stabil fix paketidir.

## Düzeltilenler

- Yönetim Paneli > Oyunlar ekranındaki kart/kapak/yazı taşmaları düzeltildi.
- Oyun kartındaki izleme akışı dışarı YouTube sekmesi açmak yerine site içi Seriyi İzle penceresine bağlandı.
- Büyük hero/kapak alanı kaldırıldı; ana ekran direkt istatistik, arama ve arşiv görünümüne döndü.
- Alfabetik başlık `A Harfinde Başlayan Seriler` biçiminde taşmadan gösteriliyor.
- Supabase `schema.sql` dönüş mesajındaki eski v2.1.3 yazısı v2.1.5 FIX olarak düzeltildi.
- `schema.sql` tekrar çalıştırıldığında schema_version ve güncelleme notları güncel kalacak şekilde düzenlendi.

## Kurulum

1. `.git` ve BAT dosyalarını koru.
2. Eski site dosyalarını temizle.
3. Bu ZIP içeriğini proje klasörüne çıkar.
4. `02-githuba-otomatik-gonder.bat` çalıştır.
5. Vercel üzerinde `Redeploy > Clear Build Cache` yap.
6. Supabase SQL Editor içinde `supabase/schema.sql` dosyasını çalıştır.
