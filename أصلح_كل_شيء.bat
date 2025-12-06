@echo off
chcp 65001 >nul
echo ========================================
echo 🔧 إصلاح جميع مشاكل المشروع
echo ========================================
echo.

echo [1/5] حذف المجلدات القديمة...
if exist "backend\node_modules" (
    echo - حذف backend\node_modules...
    rmdir /s /q "backend\node_modules"
)
if exist "frontend\node_modules" (
    echo - حذف frontend\node_modules...
    rmdir /s /q "frontend\node_modules"
)
if exist "backend\.next" (
    echo - حذف backend\.next...
    rmdir /s /q "backend\.next"
)
if exist "frontend\.next" (
    echo - حذف frontend\.next...
    rmdir /s /q "frontend\.next"
)
echo ✅ تم حذف المجلدات القديمة

echo.
echo [2/5] تثبيت مكتبات Backend...
cd backend
call npm install
if errorlevel 1 (
    echo ❌ فشل تثبيت مكتبات Backend
    pause
    exit /b 1
)
echo ✅ تم تثبيت مكتبات Backend

echo.
echo [3/5] تثبيت مكتبات Frontend...
cd ..\frontend
call npm install
if errorlevel 1 (
    echo ❌ فشل تثبيت مكتبات Frontend
    pause
    exit /b 1
)
echo ✅ تم تثبيت مكتبات Frontend

echo.
echo [4/5] إعداد قاعدة البيانات...
cd ..\backend
call npx prisma generate
call npx ts-node setup-everything.ts
echo ✅ تم إعداد قاعدة البيانات

echo.
echo [5/5] التحقق من الإعدادات...
cd ..
echo.
echo 📋 ملف backend/.env:
type backend\.env | findstr "PORT DATABASE_URL FRONTEND_URL"
echo.
echo 📋 ملف frontend/.env:
type frontend\.env
echo.

echo ========================================
echo ✅ تم إصلاح جميع المشاكل!
echo ========================================
echo.
echo الآن يمكنك تشغيل المشروع بالأمر:
echo شغل_المشروع.bat
echo.
echo أو يدوياً:
echo 1. cd backend ^&^& npm run dev
echo 2. cd frontend ^&^& npm run dev
echo.
pause
