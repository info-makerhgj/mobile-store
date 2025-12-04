@echo off
echo ========================================
echo   تشغيل MongoDB كـ Replica Set
echo ========================================
echo.

REM أوقف MongoDB الحالي
echo [1/3] إيقاف MongoDB الحالي...
net stop MongoDB 2>nul
timeout /t 2 >nul

REM شغل MongoDB كـ Replica Set
echo.
echo [2/3] تشغيل MongoDB كـ Replica Set...
echo.
echo ملاحظة: اترك هذه النافذة مفتوحة
echo.

start "MongoDB Replica Set" mongod --replSet rs0 --port 27017 --dbpath "C:\data\db"

timeout /t 5 >nul

REM فعّل Replica Set
echo.
echo [3/3] تفعيل Replica Set...
echo.

mongosh --eval "rs.initiate()" --quiet

echo.
echo ========================================
echo   ✅ MongoDB Replica Set جاهز!
echo ========================================
echo.
echo الآن يمكنك:
echo 1. تشغيل Backend: cd backend ^&^& npm run dev
echo 2. إضافة شحنة من الواجهة
echo.
pause
