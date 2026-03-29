@echo off
echo ==============================================
echo  Robo's Hygiene Adventure - Build Server
echo ==============================================
echo.

echo [1/3] Installing dependencies (if needed)...
call npm install --no-fund --no-audit --legacy-peer-deps

echo.
echo [2/3] Building the production assets...
call npm run build

echo.
echo [3/3] Starting the local production server...
echo ==============================================
echo  CLICK HERE =^> http://localhost:4173
echo ==============================================
echo Press Ctrl+C to stop the server.
echo.

:: Wait 2 seconds then open browser
timeout /t 2 /nobreak > nul
start http://localhost:4173

call npm run preview

pause
