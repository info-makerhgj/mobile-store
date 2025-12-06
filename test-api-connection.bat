@echo off
echo ================================
echo Testing API Connection
echo ================================
echo.

echo [1] Testing api.ab-tw.com...
curl -I https://api.ab-tw.com/api/health
echo.
echo.

echo [2] Testing api.ab-tw.com/api/products...
curl https://api.ab-tw.com/api/products
echo.
echo.

echo [3] Testing DNS Resolution...
nslookup api.ab-tw.com
echo.
echo.

echo [4] Testing Port 443 (HTTPS)...
powershell -Command "Test-NetConnection -ComputerName api.ab-tw.com -Port 443"
echo.
echo.

echo ================================
echo Test Complete!
echo ================================
pause
