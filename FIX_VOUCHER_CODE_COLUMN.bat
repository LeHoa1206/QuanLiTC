@echo off
echo ========================================
echo FIXING VOUCHER_CODE COLUMN IN ORDERS TABLE
echo ========================================

cd techmart\backend-laravel

echo Running migration to add voucher_code column...
php artisan migrate --path=database/migrations/2025_12_15_040000_add_voucher_code_to_orders_table.php

echo.
echo Migration completed!
echo Now you can enable notifications in OrderController.php
echo.
pause