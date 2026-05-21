# Hayatımız Oyun V2.0.3 Fix 2

## Düzeltilenler

- Oyunlar sekmesinde **Tüm oyunları seç** artık gerçekten seçim yapar.
- Seçili oyunlarda **durum değiştir / seri değiştir / etiket ekle** işlemleri artık “Oyun seç” hatasına düşmez.
- Admin oyun kartları yeniden düzenlendi.
- Oyun kapakları admin panelinde tam görünür hale getirildi.
- Butonlar daha düzgün grid düzenine alındı.
- Hakkında kısmında kaydetme hatası düzeltildi.
- Hakkında ek alanları güvenli şekilde saklanır; veritabanında kolon yoksa localStorage yedek kullanılır.
- `/api/settings` schema cache / bilinmeyen kolon hatasında bilinmeyen alanları çıkarıp tekrar dener.
- Güncelleme notları sürüm numarası ve tarihe göre en yeniden eskiye sıralanır.
- 1.8.0 / 1.7.4 gibi notlar artık karışık görünmez.

## Temiz Kurulum

```powershell
cd "C:\Users\Mevlüt Yeni Pc\Desktop\Youtube Yayın Hazırlıkları\Youtube\Youtube Arşiv Sitesi Güncel\hayatimiz-oyun site vercel"

Get-ChildItem -Force | Where-Object { $_.Name -ne ".git" } | Remove-Item -Recurse -Force
```

ZIP içeriğini klasöre çıkar.

```powershell
git add .
git commit -m "V2.0.3 Fix 2 admin oyunlar hakkında not sırası düzeltmeleri"
git push -f origin main
```

Sonra Vercel Redeploy yap.
