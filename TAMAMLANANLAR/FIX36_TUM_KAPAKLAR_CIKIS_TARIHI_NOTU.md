# FIX36 - Tüm Kapakları Getir + Çıkış Tarihi Fix

Bu pakette Kapakları Getir sistemi genişletildi.

## Yapılanlar
- Kapakları Getir artık 8 adayla sınırlı kalmaz; 60 adaya kadar listeleyebilir.
- Alan Wake aramalarında aynı seri ailesindeki kapaklar birlikte listelenir.
- `Alan Wake Remastered DLC: The Writer` yazıldığında The Writer, The Signal, Alan Wake, Alan Wake Remastered, American Nightmare ve Alan Wake 2 adayları çıkar.
- Her kapak kartında çıkış tarihi gösterilir.
- Kapak seçince oyun adı değişmez.
- Kapak seçince çıkış tarihi, tür, seri adı ve açıklama form alanlarına güvenli şekilde işlenir.
- Kaydet/Güncelle demeden Supabase’e otomatik kayıt yapılmaz.
- Eski FIX31-FIX35 assetleri de cache ihtimaline karşı güncel kodla değiştirildi.
