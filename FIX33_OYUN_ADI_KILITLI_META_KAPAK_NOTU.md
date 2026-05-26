# FIX 33 - Oyun Adı Kilitli Meta / Kapak Çekme

- Oyun adı yazılıp **Meta + Kapak Çek** denildiğinde artık benzer ama farklı oyun forma işlenmez.
- RAWG/API sonuçları tam başlık, sayı ve alt başlık kontrolünden geçirilir.
- `Alan Wake 2`, `Alan Wake American Nightmare`, `Max Payne`, `Max Payne 2`, `Max Payne 3` gibi benzer isimler birbirine karışmaz.
- Kesin eşleşme yoksa sistem yanlış oyun yazmak yerine sadece yerel tür/hikaye önerisi doldurur ve kapak URL alanını manuel bırakır.
- Kapak seçiminde de formdaki oyun adı korunur; aday başlığı eşleşmiyorsa oyun adı değiştirilmez.
