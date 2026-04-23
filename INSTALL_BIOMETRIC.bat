@echo off
echo ========================================
echo   BIOMETRIC INTEGRATION SETUP
echo ========================================
echo.

echo [1/3] Installing Node.js dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Node.js installation failed!
    pause
    exit /b 1
)
cd ..
echo ✓ Node.js dependencies installed
echo.

echo [2/3] Installing Python dependencies...
cd biometric-service
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Python installation failed!
    echo.
    echo Try installing manually:
    echo   pip install flask flask-cors numpy scikit-learn librosa resemblyzer
    echo.
    echo For dlib issues on Windows:
    echo   pip install cmake
    echo   pip install dlib
    pause
    exit /b 1
)
cd ..
echo ✓ Python dependencies installed
echo.

echo [3/3] Checking face recognition models...
if not exist "biometric-service\models" mkdir biometric-service\models
if not exist "biometric-service\models\shape_predictor_68_face_landmarks.dat" (
    echo.
    echo ⚠ WARNING: Face recognition models not found!
    echo.
    echo Please download these files:
    echo   1. shape_predictor_68_face_landmarks.dat
    echo   2. dlib_face_recognition_resnet_model_v1.dat
    echo.
    echo From: http://dlib.net/files/
    echo.
    echo Place them in: biometric-service\models\
    echo.
) else (
    echo ✓ Face recognition models found
)

echo.
echo ========================================
echo   SETUP COMPLETE!
echo ========================================
echo.
echo Next steps:
echo   1. Download face models (if not done)
echo   2. Run START_BIOMETRIC.bat
echo   3. Open http://localhost:5000
echo.
echo For detailed instructions, see:
echo   BIOMETRIC_SETUP_GUIDE.md
echo.
pause
