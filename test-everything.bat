@echo off
echo ========================================
echo Testing Mobile Store Setup
echo ========================================
echo.

echo 1. Testing Backend API...
curl http://localhost:4000/api/homepage
echo.
echo.

echo 2. Testing Products API...
curl http://localhost:4000/api/products
echo.
echo.

echo 3. Opening test page...
start http://localhost:3000
echo.

echo ========================================
echo Test Complete!
echo ========================================
echo.
echo If you see JSON data above, the backend is working!
echo If the browser opens, the frontend should be working!
echo.
pause
