@echo off
echo ========================================
echo CodeLinkers - Server Startup Script
echo ========================================
echo.

echo [1/3] Checking if port 5000 is in use...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
    echo Found process using port 5000: %%a
    echo Killing process...
    taskkill /PID %%a /F >nul 2>&1
)
echo Port 5000 is now free!
echo.

echo [2/3] Navigating to backend folder...
cd /d "%~dp0backend"
echo.

echo [3/3] Starting server...
echo.
echo ========================================
echo Server will start now...
echo Press Ctrl+C to stop the server
echo ========================================
echo.

npm start

pause
