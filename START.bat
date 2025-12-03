@echo off
chcp 65001 >nul
echo ========================================
echo   KHOI DONG TECHMART SYSTEM
echo ========================================
echo.

REM Kiem tra PHP
where php >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] PHP chua duoc cai dat hoac chua them vao PATH!
    echo Vui long cai dat PHP va thu lai.
    pause
    exit /b 1
)

REM Kiem tra Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js chua duoc cai dat hoac chua them vao PATH!
    echo Vui long cai dat Node.js va thu lai.
    pause
    exit /b 1
)

REM Kiem tra thu muc backend
if not exist "backend-laravel" (
    echo [ERROR] Thu muc backend-laravel khong ton tai!
    pause
    exit /b 1
)

REM Kiem tra thu muc frontend
if not exist "frontend" (
    echo [ERROR] Thu muc frontend khong ton tai!
    pause
    exit /b 1
)

echo [1/3] Kiem tra dependencies...
echo.

REM Kiem tra composer dependencies
if not exist "backend-laravel\vendor" (
    echo [WARNING] Backend dependencies chua duoc cai dat!
    echo Dang cai dat composer dependencies...
    cd backend-laravel
    call composer install
    cd ..
    echo.
)

REM Kiem tra npm dependencies
if not exist "frontend\node_modules" (
    echo [WARNING] Frontend dependencies chua duoc cai dat!
    echo Dang cai dat npm dependencies...
    cd frontend
    call npm install
    cd ..
    echo.
)

echo [2/3] Starting Backend Laravel...
start "Backend Laravel - TechMart" cmd /k "cd backend-laravel && php artisan serve"
timeout /t 3 /nobreak >nul

echo [3/3] Starting Frontend React...
start "Frontend React - TechMart" cmd /k "cd frontend && npm run dev"
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo   HE THONG DA KHOI DONG THANH CONG!
echo ========================================
echo.
echo Backend API:  http://localhost:8000
echo Frontend App: http://localhost:5173
echo.
echo Admin Login:
echo   Email: admin@techmart.com
echo   Password: admin123
echo.
echo Hai cua so terminal moi da duoc mo:
echo   - Backend Laravel (cong 8000)
echo   - Frontend React (cong 5173)
echo.
echo De dung he thong, dong hai cua so terminal do.
echo.
pause
