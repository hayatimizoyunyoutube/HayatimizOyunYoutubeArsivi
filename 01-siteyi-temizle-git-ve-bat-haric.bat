@echo off
chcp 65001 >nul
setlocal
cls
echo =====================================================
echo  Hayatımız Oyun - Temiz Kurulum Temizleyici
echo =====================================================
echo.
echo Bu dosya calistigi klasorde .git ve .bat dosyalari haric
echo tum site dosyalarini silecek.
echo.
echo DIKKAT: Bu BAT dosyasini proje klasorunun icinde calistir:
echo C:\Users\Mevlüt Yeni Pc\Desktop\Youtube Yayın Hazırlıkları\Youtube\Youtube Arşiv Sitesi Güncel\hayatimiz-oyun site vercel
echo.
if not exist ".git" (
  echo UYARI: Bu klasorde .git bulunamadi.
  echo Yanlis klasorde olabilirsin. Yine de devam edersen proje dosyalari silinir.
  echo.
)
set /p ONAY=Devam edip .git ve .bat haric her seyi silmek istiyor musun? EVET yaz: 
if /I not "%ONAY%"=="EVET" (
  echo Islem iptal edildi.
  pause
  exit /b 0
)
echo.
echo Temizleme basladi...
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-ChildItem -LiteralPath . -Force | Where-Object { $_.Name -ne '.git' -and $_.Extension -ne '.bat' } | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue"
echo.
echo Tamamlandi. .git ve .bat dosyalari korundu.
echo Simdi yeni ZIP icindeki dosyalari bu klasore cikar.
pause
