@echo off
chcp 65001 >nul
echo.
echo ═══════════════════════════════════════════════════════
echo    🚀 تشغيل متجر أبعاد التواصل
echo ═══════════════════════════════════════════════════════
echo.

echo 📦 تثبيت المكتبات...
echo.

cd backend
call npm install
cd ..

cd frontend
call npm install
cd ..

echo.
echo ✅ تم تثبيت المكتبات بنجاح!
echo.
echo ═══════════════════════════════════════════════════════
echo    🎯 تشغيل السيرفرات
echo ═══════════════════════════════════════════════════════
echo.
echo 🔧 Backend: http://localhost:5000
echo 🌐 Frontend: http://localhost:3000
echo 👨‍💼 Admin: http://localhost:3000/admin
echo.
echo ═══════════════════════════════════════════════════════
echo.

start "Backend Server" cmd /k "cd backend && npm run dev"
timeout /t 5 /nobreak >nul
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ تم تشغيل المشروع بنجاح!
echo.
echo 📝 ملاحظات:
echo    - انتظر 10 ثواني حتى يكتمل التشغيل
echo    - افتح المتصفح على: http://localhost:3000
echo    - لوحة التحكم: http://localhost:3000/admin
echo.
echo 🔐 تسجيل دخول Admin:
echo    البريد: admin@example.com
echo    كلمة المرور: admin123
echo.
echo ═══════════════════════════════════════════════════════
echo.
pause
