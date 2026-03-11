@echo off
:: Force UTF-8 encoding to prevent rendering issues
chcp 65001 >nul
title Port-as-a-Service - Engine Startup
color 0A

echo ===================================================
echo    Initializing Port-as-a-Service Engine...
echo ===================================================

:: 1. Check Node.js Environment
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [FATAL ERROR] Node.js runtime environment is missing.
    echo Please visit https://nodejs.org/ to install the LTS version.
    pause
    exit /b
)

:: 2. Resolve Dependencies
if not exist "node_modules\" (
    echo [SYSTEM] First run detected. Resolving dependency matrix...
    call npm install --silent
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to fetch dependencies. Check your network or npm config.
        pause
        exit /b
    )
) else (
    echo [SYSTEM] Core dependencies verified.
)

:: 3. Port Binding and Process Execution
echo [SYSTEM] Booting core routing process on port 14000...
echo [INFO] Do not close this console window during execution.

timeout /t 2 /nobreak >nul
start http://localhost:14000

call npm run dev

pause