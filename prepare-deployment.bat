@echo off
echo ========================================
echo تحضير المشروع للنشر على AWS
echo ========================================
echo.

echo [1/5] بناء Backend...
cd backend
call npm run build
if errorlevel 1 (
    echo ❌ فشل بناء Backend
    pause
    exit /b 1
)
echo ✅ تم بناء Backend بنجاح
echo.

echo [2/5] إنشاء ملف package للنشر...
mkdir deploy 2>nul
xcopy /E /I /Y dist deploy\dist
copy package.json deploy\
copy package-lock.json deploy\ 2>nul
echo ✅ تم إنشاء مجلد deploy
echo.

echo [3/5] إنشاء ملف .env.example...
(
echo # Server Configuration
echo PORT=5000
echo NODE_ENV=production
echo.
echo # Database
echo DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/dbname
echo.
echo # JWT
echo JWT_SECRET=change-this-to-random-secret
echo.
echo # Payment
echo TAP_SECRET_KEY=your_tap_secret_key
echo TAP_PUBLIC_KEY=your_tap_public_key
echo.
echo # CORS
echo FRONTEND_URL=https://your-frontend-domain.com
) > deploy\.env.example
echo ✅ تم إنشاء .env.example
echo.

echo [4/5] إنشاء ecosystem.config.js لـ PM2...
(
echo module.exports = {
echo   apps: [{
echo     name: 'backend',
echo     script: './dist/server.js',
echo     instances: 1,
echo     autorestart: true,
echo     watch: false,
echo     max_memory_restart: '1G',
echo     env: {
echo       NODE_ENV: 'production',
echo       PORT: 5000
echo     }
echo   }]
echo };
) > deploy\ecosystem.config.js
echo ✅ تم إنشاء ecosystem.config.js
echo.

echo [5/5] إنشاء دليل النشر...
(
echo # دليل النشر السريع
echo.
echo ## 1. رفع الملفات للسيرفر
echo ```bash
echo scp -r deploy/* ubuntu@your-server-ip:~/backend/
echo ```
echo.
echo ## 2. على السيرفر
echo ```bash
echo cd ~/backend
echo npm install --production
echo cp .env.example .env
echo nano .env  # عدل المتغيرات
echo pm2 start ecosystem.config.js
echo pm2 save
echo ```
echo.
echo ## 3. تحقق من التشغيل
echo ```bash
echo pm2 status
echo pm2 logs backend
echo curl http://localhost:5000/api/health
echo ```
) > deploy\DEPLOY.md
echo ✅ تم إنشاء DEPLOY.md
echo.

cd ..

echo ========================================
echo ✅ تم التحضير بنجاح!
echo ========================================
echo.
echo الملفات الجاهزة في: backend\deploy\
echo.
echo الخطوات التالية:
echo 1. راجع ملف backend\deploy\.env.example
echo 2. ارفع محتويات backend\deploy\ للسيرفر
echo 3. اتبع التعليمات في backend\deploy\DEPLOY.md
echo.
pause
