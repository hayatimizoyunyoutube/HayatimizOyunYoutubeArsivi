# Hayatımız Oyun v2.1.3 Fix 4 - Admin Navigation Fix

Bu sürüm yönetim panelinde butonlara basınca sürekli Genel Bakışa dönme sorununu düzeltir.

## Düzeltilenler
- Admin aktif sekmesi artık App seviyesinde tutulur.
- Aktif sekme `localStorage` içine kaydedilir.
- Toast, kullanıcı yetki işlemi, bakım modu veya veri yenileme sonrası panel Genel Bakışa sıfırlanmaz.
- `PageContent` iç component olmaktan çıkarıldı; React yeniden render sırasında admin paneli gereksiz unmount olmaz.
- Sol menü ve panel içi hızlı butonlar `preventDefault` / `stopPropagation` ile sabitlendi.
- Fix 3 yetki, ban, silme ve global bakım modu korunur.

## Kurulum
`.git` hariç eski dosyaları sil, bu ZIP içindeki dosyaları proje köküne çıkar, GitHub'a force push yap ve Vercel'de Clear Build Cache ile redeploy et.


## v2.1.3 Fix 5
Kurucu/yönetici/moderatör/editör rol sistemi, global bakım modu kilidi ve işlevli admin butonları eklendi. Supabase için önce `supabase/RUN-FIRST-v213-fix5-roles-maintenance.sql` çalıştır.
