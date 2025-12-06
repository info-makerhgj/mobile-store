@echo off
chcp 65001 >nul
echo ========================================
echo 🚀 رفع المشروع على Vercel
echo ========================================
echo.

echo 📦 التحقق من Vercel CLI...
where vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI غير مثبت
    echo.
    echo 📥 جاري التثبيت...
    npm install -g vercel
    if %errorlevel% neq 0 (
        echo ❌ فشل التثبيت
        pause
        exit /b 1
    )
    echo ✅ تم التثبيت بنجاح
    echo.
)

echo ✅ Vercel CLI موجود
echo.

echo 📂 الانتقال لمجلد Frontend...
cd frontend
if %errorlevel% neq 0 (
    echo ❌ مجلد frontend غير موجود
    pause
    exit /b 1
)
echo.

echo 🔐 تسجيل الدخول...
echo (راح يفتح المتصفح، سجل دخول وارجع هنا)
echo.
vercel login
if %errorlevel% neq 0 (
    echo ❌ فشل تسجيل الدخول
    cd ..
    pause
    exit /b 1
)
echo.

echo 🚀 رفع المشروع...
echo.
vercel --prod
if %errorlevel% neq 0 (
    echo ❌ فشل الرفع
    cd ..
    pause
    exit /b 1
)
echo.

echo ========================================
echo ✅ تم الرفع بنجاح!
echo ========================================
echo.
echo 📝 ملاحظات مهمة:
echo 1. احفظ الرابط اللي طلع لك
echo 2. لازم تضيف Environment Variable:
echo    - Key: NEXT_PUBLIC_API_URL
echo    - Value: رابط Backend الخاص بك
echo.
echo 3. روح لـ https://vercel.com/dashboard
echo    واضبط الإعدادات
echo.
echo ========================================

cd ..
pause
