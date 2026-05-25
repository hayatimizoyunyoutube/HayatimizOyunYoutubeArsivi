@echo off
setlocal EnableExtensions
chcp 65001 >nul
cd /d "%~dp0"
cls
echo ================================================
echo HAYATIMIZ OYUN - TEMIZ KURULUM 01
echo ================================================
echo.
echo Bu islem .git, .env ve .bat dosyalarini korur.
echo Diger dosya ve klasorleri siler.
echo.
set /p ONAY=Devam etmek icin EVET yaz: 
if /I not "%ONAY%"=="EVET" (
  echo Islem iptal edildi.
  pause
  exit /b 0
)
echo.
echo Eski dosyalar temizleniyor...
for /d %%D in (*) do (
  if /I not "%%D"==".git" (
    echo Klasor siliniyor: %%D
    rmdir /s /q "%%D"
  )
)
for %%F in (*) do (
  if /I not "%%~xF"==".bat" (
    if /I not "%%F"==".env" (
      if /I not "%%F"==".env.local" (
        echo Dosya siliniyor: %%F
        del /f /q "%%F"
      )
    )
  )
)
echo.
echo Temizlik tamamlandi. Simdi yeni ZIP dosyalarini bu klasore direkt cikar.
pause
