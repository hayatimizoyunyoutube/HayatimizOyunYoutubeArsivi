@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

title Hayatımız Oyun - Temiz GitHub Yükleme

echo.
echo ======================================================
echo   HAYATIMIZ OYUN - TEMIZ GITHUB YUKLEME BAT
echo ======================================================
echo.
echo Bu BAT dosyasi proje klasorundeki dosyalari GitHub'a temiz yollar.
echo node_modules, dist, .next, .vercel ve env dosyalari GitHub'a GONDERILMEZ.
echo.

set "REPO_URL=https://github.com/hayatimizoyunyoutube/test.git"
set "COMMIT_MSG=v2.0.1 profesyonel ui temiz baslangic"

if not exist package.json (
  echo HATA: package.json bulunamadi.
  echo Bu BAT dosyasini proje ana klasorunde calistir.
  pause
  exit /b 1
)

echo [1/8] .gitignore guncelleniyor...
(
 echo node_modules/
 echo .next/
 echo .vercel/
 echo dist/
 echo build/
 echo out/
 echo .env
 echo .env.local
 echo .env.*.local
 echo npm-debug.log*
 echo yarn-debug.log*
 echo yarn-error.log*
 echo pnpm-debug.log*
 echo .DS_Store
 echo Thumbs.db
) > .gitignore

echo [2/8] Buyuk/gecici klasorler temizleniyor...
if exist node_modules rmdir /s /q node_modules
if exist .next rmdir /s /q .next
if exist .vercel rmdir /s /q .vercel
if exist dist rmdir /s /q dist

echo [3/8] Git gecmisi temiz sifirlaniyor...
if exist .git rmdir /s /q .git

echo [4/8] Git yeniden baslatiliyor...
git init
if errorlevel 1 goto git_error

git branch -M main

git remote add origin %REPO_URL%
if errorlevel 1 (
  git remote set-url origin %REPO_URL%
)

echo [5/8] Dosyalar kontrol ediliyor...
git status

echo.
echo node_modules listede gorunmemeli. Devam ediliyor...
echo.

echo [6/8] Commit hazirlaniyor...
git add .
git commit -m "%COMMIT_MSG%"
if errorlevel 1 (
  echo Commit olusturulamadi veya degisiklik yok. Push denenecek.
)

echo [7/8] GitHub'a force push yapiliyor...
git push -u origin main --force
if errorlevel 1 goto push_error

echo [8/8] TAMAMLANDI.
echo.
echo GitHub'a temiz yukleme basarili.
echo Vercel otomatik deploy baslatacak.
echo.
echo Kontrol sayfalari:
echo   /
echo   /series
echo   /categories
echo   /channels
echo   /updates
echo   /status
echo.
pause
exit /b 0

:git_error
echo.
echo HATA: Git komutu calismadi. Bilgisayarda Git kurulu mu kontrol et.
echo Git indirme: https://git-scm.com/download/win
pause
exit /b 1

:push_error
echo.
echo HATA: GitHub'a push basarisiz oldu.
echo Muhtemel nedenler:
echo - GitHub token yanlis veya suresi dolmus
echo - Internet baglantisi yok
echo - Repo yetkisi yok
echo - GitHub kullanici adi/parola ekrani bekliyor olabilir
echo.
echo Manuel kontrol icin su komutlari deneyebilirsin:
echo git remote -v
echo git status
echo git push -u origin main --force
echo.
pause
exit /b 1
