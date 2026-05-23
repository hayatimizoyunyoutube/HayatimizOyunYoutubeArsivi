@echo off
chcp 65001 >nul
setlocal
cls
echo =====================================================
echo  Hayatımız Oyun - Mobilden GitHub Yukleme Rehberi
 echo =====================================================
echo.
echo Not: .bat dosyalari telefonda calismaz. Bu dosya Windows'ta acilan
 echo mobil yukleme rehberidir. Telefonda GitHub web/app ile yapilacak adimlari gosterir.
echo.
echo 1. Telefonda github.com sitesine gir.
echo 2. Repo ac: hayatimizoyunyoutube/HayatimizOyunYoutubeArsivi
echo 3. Add file ^> Upload files sec.
echo 4. ZIP icindeki dosyalari telefonda cikarttiysan secip yukle.
echo 5. Commit changes butonuna bas.
echo 6. Vercel'e gir ve Redeploy ^> Clear Build Cache yap.
echo.
echo Mobilde en guvenli yontem: dosyalari bilgisayardan 02-githuba-otomatik-gonder.bat ile yollamak.
echo.
if exist "MOBILDEN-GITHUB-YUKLEME-REHBERI.txt" start notepad "MOBILDEN-GITHUB-YUKLEME-REHBERI.txt"
pause
