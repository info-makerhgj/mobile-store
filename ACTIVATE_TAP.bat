@echo off
chcp 65001 >nul
echo ========================================
echo    تفعيل Tap Payments
echo ========================================
echo.

cd backend
echo [1/2] تهيئة إعدادات الدفع...
call npm run init:payment
echo.

echo [2/2] تفعيل Tap Payments...
call npm run enable:tap
echo.

echo ========================================
echo ✅ تم تفعيل Tap Payments بنجاح!
echo ========================================
echo.
echo 📝 الخطوات التالية:
echo   1. افتح لوحة التحكم: http://localhost:3000/admin/login
echo   2. اذهب إلى الإعدادات ^> إعدادات الدفع
echo   3. أدخل مفاتيح Tap API
echo   4. احفظ التغييرات
echo.
echo 💡 احصل على المفاتيح من: https://www.tap.company/ar-sa
echo.
pause
