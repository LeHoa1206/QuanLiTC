@echo off
echo ========================================
echo CHECKING LARAVEL LOG FOR NOTIFICATION ERRORS
echo ========================================

cd techmart\backend-laravel

echo Checking latest Laravel log...
echo.

if exist "storage\logs\laravel.log" (
    echo === LATEST LOG ENTRIES ===
    powershell "Get-Content 'storage\logs\laravel.log' | Select-Object -Last 20"
) else (
    echo No log file found at storage\logs\laravel.log
)

echo.
echo === LOG FILES IN STORAGE/LOGS ===
dir storage\logs\*.log

echo.
pause