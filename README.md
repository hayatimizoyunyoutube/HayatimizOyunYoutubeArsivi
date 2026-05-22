# Hayatımız Oyun V2.5.1 Fix 15 - Admin Tools Restore

## Yapılanlar

- Oyun İste / Hata Bildir bölümü admin panelden çıkarılıp kullanıcı tarafına alındı.
- Admin panelde sadece gelen istek/hata kayıtlarını yönetme bölümü bırakıldı.
- Üst menü taşma sorunu için butonlar küçültüldü ve tek satır davranışı düzeltildi.
- Eski panel kalıntıları gizlendi, admin panel yeni tek yapıya toplandı.
- Otomatik kapak çekme bölümü geri eklendi.
- Hataları düzeltme / tüm oyunları onarma bölümü geri eklendi.
- YouTube kanalından / oynatma listesinden veri çekme paneli geri eklendi.
- Tüm oyunları sil ve tüm serileri sıfırla araçları admin panelde korundu.
- Seriler A-Z alfabetik mantıkla ve akıllı seri birleştirme ile yeniden düzenlendi.
- A Plague Tale gibi aynı seri olan oyunlar tek seri kartında birleşir.
- Profil sayfası ve kullanıcı katkı sayfası üst menüde korunur.

## Temiz kurulum

```powershell
cd "C:\Users\Mevlüt Yeni Pc\Desktop\Youtube Yayın Hazırlıkları\Youtube\Youtube Arşiv Sitesi Güncel\hayatimiz-oyun site vercel"
Get-ChildItem -Force | Where-Object { $_.Name -ne ".git" } | Remove-Item -Recurse -Force
```

ZIP içeriğini bu klasörün içine çıkar.

```powershell
git add .
git commit -m "V2.5.1 Fix 15 temiz kurulum"
git push -f origin main
```
