@echo off
chcp 65001 >nul
title OMS Demo Server
setlocal enabledelayedexpansion

echo ========================================
echo   OMS Prototype Demo - Start Script
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] Checking port 8081...
netstat -ano | findstr ":8081" | findstr "LISTENING" >nul 2>&1
if not errorlevel 1 (
    echo Port 8081 is in use, killing old process...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8081" ^| findstr "LISTENING"') do (
        taskkill /F /PID %%a >nul 2>&1
    )
    timeout /t 2 /nobreak >nul
)

echo [2/4] Detecting current IP address...
set "CURRENT_IP="
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4"') do (
    set "ip=%%a"
    set "ip=!ip: =!"
    if not defined CURRENT_IP set "CURRENT_IP=!ip!"
)
if not defined CURRENT_IP set "CURRENT_IP=127.0.0.1"
echo   Current IP: !CURRENT_IP!

echo [3/4] Starting HTTP server on port 8081...
start "OMS-Demo-Server" /min cmd /c "npx http-server -p 8081 -c-1"

echo [4/4] Waiting for server to start...
timeout /t 4 /nobreak >nul

echo.
echo ========================================
echo   Server started!
echo ========================================
echo.
echo   Local:    http://127.0.0.1:8081
echo   Network:  http://!CURRENT_IP!:8081
echo   Trade:    http://!CURRENT_IP!:8081/trade.html
echo   Product:  http://!CURRENT_IP!:8081/product.html
echo.
echo   NOTE: Do NOT close the "OMS-Demo-Server" window!
echo         Closing it will stop the server.
echo.
echo   TIP: If IP changed after reboot, send the new Network URL above.
echo.
echo ========================================
pause
