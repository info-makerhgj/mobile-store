@echo off
chcp 65001 >nul
echo.
echo ═══════════════════════════════════════════════════════
echo    🎯 تجهيز المشروع بالكامل
echo ═══════════════════════════════════════════════════════
echo.

echo 🛑 إيقاف جميع عمليات Node.js القديمة...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo 🗑️  مسح الكاش...
cd frontend
if exist .next rmdir /s /q .next >nul 2>&1
cd ..

echo.
echo ═══════════════════════════════════════════════════════
echo    📦 إضافة البيانات التجريبية
echo ═══════════════════════════════════════════════════════
echo.

cd backend

echo 📄 إضافة الصفحات...
call npm run init:pages

echo.
echo 📦 إضافة المنتجات والفئات...
call npm run add:demo

echo.
echo 🏠 إعداد الصفحة الرئيسية...
call npm run init:homepage

echo.
echo 🚚 تفعيل نظام الشحن...
call npm run init:shipping

cd ..

echo.
echo ✅ تم تجهيز البيانات بنجاح!
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
echo 📊 البيانات المضافة:
echo    ✅ 5 صفحات (من نحن، الشروط، الخصوصية، الضمان، الإرجاع)
echo    ✅ 5 فئات (هواتف، تابلت، إكسسوارات، ساعات، سماعات)
echo    ✅ 5 منتجات (iPhone 15 Pro Max، Galaxy S24، iPad Pro، AirPods، Apple Watch)
echo    ✅ إعدادات الصفحة الرئيسية
echo    ✅ 3 شركات شحن (سمسا، أرامكس، ريدبوكس)
echo    ✅ 20 مدينة سعودية
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
