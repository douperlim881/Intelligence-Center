@echo off
echo =========================================
echo   Port Smart Center - Build Automation
echo =========================================
echo.

echo [1/3] Cleaning previous builds...
rd /s /q out
rd /s /q src-tauri\target

echo.
echo [2/3] Building Next.js static assets...
call npm run build

echo.
echo [3/3] Compiling Tauri Desktop Application...
call npm run tauri build

echo.
echo =========================================
echo   DONE! Check src-tauri/target/release/bundle for your .exe
echo =========================================
pause