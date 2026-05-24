@echo off
chcp 65001 >nul
setlocal
cls
echo =====================================================
echo  Hayatımız Oyun - Temiz Kurulum Temizleyici
echo =====================================================
echo.
echo Bu dosya .git ve .bat dosyalari haric her seyi siler.
echo node_modules, dist ve eski build dosyalari da silinir.
echo.
if not exist ".git" (
  echo UYARI: Bu klasorde .git bulunamadi. Yanlis klasorde olabilirsin.
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
echo Simdi ZIP icindeki dosyalari bu klasore cikar.
pause
