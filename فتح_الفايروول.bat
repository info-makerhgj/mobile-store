@echo off
echo ========================================
echo فتح البورتات في الفايروول للجوال
echo Opening Firewall Ports for Mobile Access
echo ========================================
echo.

netsh advfirewall firewall add rule name="Next.js Dev Server" dir=in action=allow protocol=TCP localport=3000
netsh advfirewall firewall add rule name="Backend API Server" dir=in action=allow protocol=TCP localport=4000

echo.
echo ========================================
echo تم فتح البورتات بنجاح!
echo Ports opened successfully!
echo ========================================
echo.
echo يمكنك الآن الوصول من الجوال على:
echo You can now access from mobile at:
echo http://192.168.1.111:3000
echo.
pause
