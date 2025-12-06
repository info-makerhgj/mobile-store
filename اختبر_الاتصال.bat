@echo off
chcp 65001 >nul
echo ========================================
echo 🔍 اختبار اتصال API
echo ========================================
echo.

echo جاري فحص Backend...
echo.

curl -s http://localhost:5000/api/health >nul 2>&1
if errorlevel 1 (
    echo ❌ Backend غير متصل على http://localhost:5000
    echo.
    echo الحلول:
    echo 1. تأكد من تشغيل Backend بالأمر: cd backend ^&^& npm run dev
    echo 2. تحقق من ملف backend/.env أن PORT=5000
    echo 3. تأكد من عدم وجود برنامج آخر يستخدم المنفذ 5000
) else (
    echo ✅ Backend يعمل بنجاح على http://localhost:5000
)

echo.
echo جاري فحص Frontend...
echo.

curl -s http://localhost:3000 >nul 2>&1
if errorlevel 1 (
    echo ❌ Frontend غير متصل على http://localhost:3000
    echo.
    echo الحلول:
    echo 1. تأكد من تشغيل Frontend بالأمر: cd frontend ^&^& npm run dev
    echo 2. تحقق من ملف frontend/.env أن NEXT_PUBLIC_API_URL=http://localhost:5000/api
    echo 3. تأكد من عدم وجود برنامج آخر يستخدم المنفذ 3000
) else (
    echo ✅ Frontend يعمل بنجاح على http://localhost:3000
)

echo.
echo ========================================
echo 📋 ملخص الإعدادات:
echo ========================================
echo.
echo Backend Port: 5000
echo Frontend Port: 3000
echo API URL: http://localhost:5000/api
echo.
echo ========================================
echo.
pause
