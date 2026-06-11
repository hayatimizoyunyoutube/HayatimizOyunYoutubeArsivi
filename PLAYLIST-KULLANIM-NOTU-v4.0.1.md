# v4.0.1 Playlist Kullanımı

Not defteri ile oyun ekleme kaldırıldı. Oyun ekleme artık tek ekrandan yapılır.

## YouTube Playlist
1. Oyun Ekle ekranında YouTube Playlist URL alanına bağlantıyı yapıştır.
2. Oynatma Listesi Bölümlerini Çek butonuna bas.
3. Gerçek bölüm adı ve thumbnail gelirse Supabase’ye Kaydet.
4. Gerçek bölüm çekilemezse sahte bölüm oluşturulmaz. Bu durumda YouTube API key / playlist erişimi kontrol edilmelidir.

## Hikaye Alanları
- Kısa Açıklama: Kartlarda görünen kısa metin.
- Hikaye / Arşiv Anlatımı: Oyunun hikayesi.
- Karakter/Mekan/Atmosfer: Hikayeden ayrı açıklama alanı olarak kullanılacak.

## Etiketler
Etiketler otomatik çekilmez. Sadece seçtiğin hazır etiketler veya elle yazdıkların kaydedilir.
