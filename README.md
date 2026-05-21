# Hayatımız Oyun V2.1.0

V2.1.0, V2.0.5 planındaki fix alanlarının dışına çıkan büyük sistem güncellemesidir.

## Yeni Büyük Özellikler

### Gelişmiş Arşiv
- Seri bazlı arşiv sayfası eklendi.
- Her seri için oyun ve bölüm sayısı gösterilir.
- Seri kartlarında kapak önizlemeleri bulunur.

### Gelişmiş Arama
- Oyun, seri, açıklama ve etiket içinde arama.
- Durum, tip ve seri filtreleri.
- Kapaklı sonuç kartları.

### Oyun Detay Sayfası V2
- Büyük kapak alanı.
- Seri, tip, durum ve bölüm sayısı.
- Bölüm listesi ve izleme bağlantıları.

### Favoriler Sistemi
- Oyunları favorilere ekleme/çıkarma.
- Favoriler sayfası.
- Favoriler yerel tarayıcı hafızasında saklanır.

### İzleme Takip Sistemi
- İzledim, İzliyorum, İzleyeceğim, Yarım Kaldı durumları.
- İzleme Takibi sayfası.
- Takip kayıtları yerel tarayıcı hafızasında saklanır.

### Duyuru Sistemi
- Ana sayfaya duyuru alanı eklendi.
- Admin V2.1.0 merkezinden duyuru ekleme.

### Site Sağlık Kontrolü
- Kapaksız, hikayesiz, bölümsüz ve sosyal link eksiklerini sayar.
- Admin V2.1.0 merkezinde sağlık özeti görünür.

### Yedekleme ve Geri Yükleme V2
- Tam site yedeğini JSON olarak indirme.
- Yedeği içe aktarma önizleme/yerel yükleme.

### Admin V2.1.0 Merkez
- Yeni admin merkezi.
- Oyun, seri, bölüm, favori, takip ve sağlık istatistikleri.
- Yedek alma ve duyuru ekleme.

## Korunanlar

- V2.0.3 Fix 1 admin oyun seçimi.
- Hakkında yönetimi.
- ByNoGame ve TikTok ikon düzeltmeleri.
- Kapak görünüm fixleri.
- Mevcut API ve Supabase schema-safe düzeltmeleri.

## Temiz Kurulum

```powershell
cd "C:\Users\Mevlüt Yeni Pc\Desktop\Youtube Yayın Hazırlıkları\Youtube\Youtube Arşiv Sitesi Güncel\hayatimiz-oyun site vercel"

Get-ChildItem -Force | Where-Object { $_.Name -ne ".git" } | Remove-Item -Recurse -Force
```

ZIP içeriğini klasöre çıkar.

```powershell
git add .
git commit -m "V2.1.0 buyuk sistem guncellemesi"
git push -f origin main
```

Sonra Vercel Redeploy yap.
