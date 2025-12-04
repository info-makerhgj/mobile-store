@echo off
echo ========================================
echo    Mobile Store - Starting Project
echo ========================================
echo.

echo [1/3] Stopping old processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/3] Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm run dev"
timeout /t 5 /nobreak >nul

echo [3/3] Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo    Project Started Successfully!
echo ========================================
echo.
echo Backend:  http://localhost:4000
echo Frontend: http://localhost:3000
echo Admin:    http://localhost:3000/admin
echo.
echo Press any key to exit...
pause >nul
