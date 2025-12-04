@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   🔍 اختبار نظام الشحن
echo ========================================
echo.

cd backend
call npx ts-node test-shipping-api.ts

echo.
pause
