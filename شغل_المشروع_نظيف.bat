@echo off
chcp 65001 >nul
echo.
echo ═══════════════════════════════════════════════════════
echo    🧹 تنظيف وتشغيل المشروع
echo ═══════════════════════════════════════════════════════
echo.

echo 🛑 إيقاف جميع عمليات Node.js القديمة...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo 🗑️  مسح الكاش...
cd frontend
if exist .next rmdir /s /q .next >nul 2>&1
cd ..

echo 📄 التأكد من وجود الصفحات في قاعدة البيانات...
cd backend
call npm run init:pages >nul 2>&1
cd ..

echo.
echo ✅ تم التنظيف بنجاح!
echo.
echo ═══════════════════════════════════════════════════════
echo    🚀 تشغيل السيرفرات
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
echo    - اختبار الاتصال: افتح test-connection.html
echo.
echo 🔐 تسجيل دخول Admin:
echo    البريد: admin@example.com
echo    كلمة المرور: admin123
echo.
echo ═══════════════════════════════════════════════════════
echo.
pause
