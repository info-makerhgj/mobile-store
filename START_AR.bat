@echo off
chcp 65001 >nul
echo ========================================
echo    متجر أبعاد التواصل
echo    تشغيل المشروع
echo ========================================
echo.

echo [1/4] التحقق من المتطلبات...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js غير مثبت!
    echo يرجى تثبيت Node.js من: https://nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js مثبت

where mongod >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  MongoDB غير مثبت أو غير موجود في PATH
    echo تأكد من تشغيل MongoDB يدوياً
) else (
    echo ✅ MongoDB مثبت
)

echo.
echo [2/4] تشغيل Backend...
start "Backend Server" cmd /k "cd backend && npm run dev"
timeout /t 3 >nul

echo.
echo [3/4] تشغيل Frontend...
start "Frontend Server" cmd /k "cd frontend && npm run dev"
timeout /t 3 >nul

echo.
echo [4/4] فتح المتصفح...
timeout /t 5 >nul
start http://localhost:3000

echo.
echo ========================================
echo ✅ المشروع يعمل الآن!
echo ========================================
echo.
echo 🌐 الموقع: http://localhost:3000
echo 🔧 لوحة التحكم: http://localhost:3000/admin
echo 📡 Backend API: http://localhost:5000/api
echo.
echo ⚠️  لا تغلق هذه النافذة!
echo.
echo للإيقاف: اضغط Ctrl+C في نوافذ Backend و Frontend
echo ========================================
pause
