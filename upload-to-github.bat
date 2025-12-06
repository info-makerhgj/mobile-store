@echo off
echo ========================================
echo    رفع المشروع على GitHub
echo ========================================
echo.

REM التحقق من وجود Git
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git غير مثبت!
    echo قم بتحميله من: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo ✅ Git مثبت
echo.

REM إنشاء .gitignore إذا لم يكن موجود
if not exist .gitignore (
    echo 📝 إنشاء ملف .gitignore...
    (
        echo node_modules/
        echo .env
        echo .env.local
        echo .env.production
        echo dist/
        echo build/
        echo .next/
        echo *.log
        echo .DS_Store
        echo *.pem
        echo *.key
    ) > .gitignore
)

echo.
echo 🔧 تجهيز المشروع...
echo.

REM تهيئة Git إذا لم يكن مهيأ
if not exist .git (
    echo 🎯 تهيئة Git...
    git init
    git branch -M main
) else (
    echo ✅ Git مهيأ مسبقاً
)

echo.
echo 📦 إضافة الملفات...
git add .

echo.
echo 💾 حفظ التغييرات...
git commit -m "Initial commit - Clean project ready for deployment"

echo.
echo ========================================
echo    الخطوات التالية:
echo ========================================
echo.
echo 1. اذهب إلى: https://github.com/new
echo 2. أنشئ repository جديد (مثلاً: mobile-store)
echo 3. لا تضف README أو .gitignore
echo 4. انسخ رابط الـ repository
echo.
echo 5. ثم نفذ الأوامر التالية:
echo.
echo    git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
echo    git push -u origin main
echo.
echo ========================================

pause
