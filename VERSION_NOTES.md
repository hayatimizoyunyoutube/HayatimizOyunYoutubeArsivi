# v2.1.1 Fix 2 Eklenen / Düzeltilenler

- Vercel Building kalıyor/dönüyor sorunu için temiz deploy yapısı hazırlandı.
- ZIP'ten node_modules kaldırıldı.
- ZIP'ten package-lock.json kaldırıldı.
- API/serverless function klasörü kaldırıldı.
- Vercel Hobby sınırlarına takılmayan statik Vite yapı kuruldu.
- Butonlar çalışmıyor ve aynı yerde açılıyor fixleri korundu.
- Buton taşması, mobil kategori ve kart taşma fixleri korundu.
- Supabase schema ve hotfix dosyaları korunur; arayüz testi için çalıştırmak zorunlu değildir.


## v2.1.1 Fix 3
Yönetim Paneli butonları düzeltildi. Sol menü artık dış sayfaya geçmez; modüller panel içinde sekme olarak açılır. Vercel temiz statik build yapısı korunur.


## v2.1.1 Fix 4
- Vercel ENV eklendiği halde görünen yanlış API uyarıları kaldırıldı.
- Supabase arayüz testi için zorunlu değil bilgisi eklendi.
- API/ENV paneli server-only key mantığına göre güncellendi.
