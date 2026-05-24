# v2.1.3 Fix-5 - Site Açılmıyor / Boş Ekran + Supabase Güncelleme

Bu paket önceki `Site yükleniyor...` ekranında kalma ve sonrasında oluşan boş gradient ekran sorununu düzeltmek için hazırlandı.

## Yapılanlar

- Eski zorunlu `Site yükleniyor...` bekleme ekranı kaldırıldı.
- `index.html` içine acil açılış sistemi eklendi. Ana JavaScript dosyası yüklenmezse site boş kalmaz.
- `render()` kök element kontrolü güçlendirildi.
- `vercel.json` sadeleştirildi; assets dosyalarının yanlış yönlenme riski kaldırıldı.
- `node_modules` ZIP dışına çıkarıldı.
- `package.json` Node `20.x` olarak sabitlendi.
- `supabase/schema.sql` baştan temiz ve tekrar çalıştırılabilir hale getirildi.
- `cover-images` ve `profile-photos` storage bucket kurulumu eklendi.

## Kurulum

1. Proje klasöründe `.git` ve BAT dosyaları kalsın, diğer eski dosyaları temizle.
2. Bu ZIP içeriğini klasörün içine çıkar.
3. `supabase/schema.sql` dosyasını Supabase SQL Editor içinde çalıştır.
4. GitHub temiz yükleme BAT dosyasını çalıştır.
5. Vercel > Deployments > Redeploy > Build Cache kapalı olacak şekilde redeploy yap.
6. Tarayıcıda Ctrl + F5 yap.
