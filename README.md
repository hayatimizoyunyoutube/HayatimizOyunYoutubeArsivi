# Hayatımız Oyun V2.5.1 Fix 14

## Yapılanlar

- Seriler sayfasına **A-Z alfabetik seri bölümleri** eklendi.
- A Serileri, B Serileri gibi başlıklarla seri listesi ayrıldı.
- Ana sayfa oyun/bölüm yerine seri kartı göstermeye devam eder.
- A Plague Tale gibi aynı serideki oyunlar tek kartta birleşir.
- Seri kartlarında **Tüm Seriyi İzle** butonu korundu.
- Profil sayfası geri getirildi.
- Üst menüye **Profil** eklendi.
- Üst menüye **Oyun İste / Hata Bildir** kategorisi eklendi.
- Admin panel yeniden düzenlendi.
- Admin paneline **Tüm Oyunları Sil** butonu eklendi.
- Admin paneline **Tüm Serileri Sıfırla** butonu eklendi.
- Admin panelinde Oyunlar, Seriler, Oyun İstek / Hata Bildir, Profil, Güncellemeler, Hata Kontrol ve Ayarlar bölümleri eklendi.
- Sürüm V2.5.1 Fix 14 olarak güncellendi.
- JS syntax kontrolünden geçti.

## Temiz kurulum

```powershell
cd "C:\Users\Mevlüt Yeni Pc\Desktop\Youtube Yayın Hazırlıkları\Youtube\Youtube Arşiv Sitesi Güncel\hayatimiz-oyun site vercel"
Get-ChildItem -Force | Where-Object { $_.Name -ne ".git" } | Remove-Item -Recurse -Force
```

ZIP içeriğini aynı klasöre çıkar.

```powershell
git add .
git commit -m "V2.5.1 Fix 14 temiz kurulum"
git push -f origin main
```
