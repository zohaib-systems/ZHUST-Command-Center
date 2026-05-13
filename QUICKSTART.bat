@echo off
REM ZHUST Command Center - Quick Start for Windows
REM This script installs dependencies and starts both backend and frontend

echo.
echo ================================================================================
echo   🏛️ ZHUST Command Center - Quick Start
echo ================================================================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js detected: %node --version%
echo.

REM Backend setup
echo [1/4] Setting up backend...
cd server
call npm install
if errorlevel 1 (
    echo ❌ Backend setup failed
    pause
    exit /b 1
)
cd ..
echo ✓ Backend dependencies installed
echo.

REM Frontend setup
echo [2/4] Setting up frontend...
cd client
call npm install
if errorlevel 1 (
    echo ❌ Frontend setup failed
    pause
    exit /b 1
)
cd ..
echo ✓ Frontend dependencies installed
echo.

echo [3/4] Verifying data.json...
if not exist "server\data.json" (
    echo ✓ data.json will be created on first backend start
) else (
    echo ✓ data.json found
)
echo.

echo [4/4] Ready to start!
echo.
echo ================================================================================
echo   🚀 Launching dev servers
echo ================================================================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to start both servers in separate terminals...
pause >nul

start "ZHUST Backend" cmd /k "cd /d %~dp0server && npm run dev"
start "ZHUST Frontend" cmd /k "cd /d %~dp0client && npm run dev"

echo.
echo Both servers are starting.
echo Open http://localhost:5173 in your browser once Vite is ready.
echo.
pause
