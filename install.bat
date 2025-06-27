@echo off
echo ======================================
echo  INSTALACJA KALENDARZA REZERWACJI
echo ======================================
echo.

echo Instalacja backendu...
cd backend
call npm install
echo.

echo Kopiowanie pliku konfiguracyjnego...
if not exist .env (
    copy .env.example .env
    echo Plik .env zostal utworzony - skonfiguruj swoje dane!
) else (
    echo Plik .env juz istnieje
)
echo.

echo Instalacja frontendu...
cd ..\frontend
call npm install
echo.

echo ======================================
echo  INSTALACJA ZAKONCZONA POMYSLNIE!
echo ======================================
echo.
echo Aby uruchomic aplikacje:
echo 1. Uruchom backend: run-backend.bat
echo 2. Uruchom frontend: run-frontend.bat
echo 3. Utworz dane testowe: seed-database.bat
echo.
pause
