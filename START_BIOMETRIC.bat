@echo off
echo ========================================
echo   STARTING BIOMETRIC SERVICES
echo ========================================
echo.

echo [1/2] Starting Python Flask Service (Port 5001)...
start "Python Biometric Service" cmd /k "cd biometric-service && python app.py"
timeout /t 3 /nobreak >nul

echo [2/2] Starting Node.js Backend (Port 5000)...
start "Node.js Backend" cmd /k "cd backend && npm start"

echo.
echo ========================================
echo   SERVICES STARTED!
echo ========================================
echo.
echo Python Service: http://localhost:5001
echo Node.js Backend: http://localhost:5000
echo Frontend: http://localhost:5000
echo.
echo Press any key to exit...
pause >nul
