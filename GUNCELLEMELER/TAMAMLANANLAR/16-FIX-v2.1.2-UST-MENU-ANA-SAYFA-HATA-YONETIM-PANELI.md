# v2.1.2 FIX - Üst Menü, Ana Sayfa Hata ve Yönetim Paneli

## Durum
Tamamlandı. Yeni sürüm yapılmadı; mevcut v2.1.2 sürümü üzerinde FIX uygulandı.

## Yapılanlar
1. Soldaki site menüsü tamamen kaldırıldı.
2. Ana Sayfa, Arşiv, Koleksiyonlar, Seriler, Site Durumu, Site Rehberi ve Yetkili Rehberi üst menüye taşındı.
3. Yetkili hesapta Yönetim Paneli üst barda tek giriş olarak bırakıldı.
4. Yönetim alt sayfaları yönetim panelinin içindeki menüden açılacak şekilde korundu.
5. Ana sayfada görünen localStorage kota hatası düzeltildi.
6. Güncelleme notları artık yerel depolamaya sığmazsa kompakt kayıt yapacak.
7. Ana sayfa boş/hata ekranına düşmesin diye güvenli kayıt sistemi eklendi.
8. Yönetim paneli daha profesyonel hero, metrik ve işlem kartlarıyla güçlendirildi.
9. Mobilde üst menü yatay kaydırmalı ve taşma yapmayacak hale getirildi.
10. Planlananlar klasöründeki 15 dolu plan korunmuştur.

## Schema Durumu
schema.sql gerekli değil. Yeni tablo veya kolon eklenmedi.

## Kontrol
- npm run build başarılı.
- node --check src/main.js başarılı.
- node --check api/index.js başarılı.
