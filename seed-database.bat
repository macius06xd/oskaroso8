@echo off
echo ======================================
echo  TWORZENIE DANYCH TESTOWYCH
echo ======================================
echo.
echo UWAGA: To usunie wszystkie istniejace dane!
echo.
set /p confirm=Czy chcesz kontynuowac? (y/N): 

if /i "%confirm%" neq "y" (
    echo Anulowano.
    pause
    exit /b
)

echo.
echo Tworzenie danych testowych...
cd backend
npm run seed

echo.
echo ======================================
echo  DANE TESTOWE ZOSTALY UTWORZONE!
echo ======================================
echo.
echo Dane logowania:
echo   Admin: admin@example.com / admin123
echo   User:  user@example.com / user123
echo.
pause
