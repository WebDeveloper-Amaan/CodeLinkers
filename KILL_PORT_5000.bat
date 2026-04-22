@echo off
echo ========================================
echo Kill Port 5000 Process
echo ========================================
echo.

echo Checking for processes using port 5000...
echo.

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
    echo Found process: %%a
    taskkill /PID %%a /F
    echo.
    echo Process killed successfully!
)

echo.
echo Port 5000 is now free!
echo.
pause
