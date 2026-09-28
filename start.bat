@echo off
setlocal enabledelayedexpansion

:: ANSI Colors
set "GREEN=[92m"
set "YELLOW=[93m"
set "CYAN=[96m"
set "RED=[91m"
set "RESET=[0m"

echo %CYAN%================================================================%RESET%
echo %GREEN%       ZenGuard AI + Sahayak Dashboard  ^|  ADHARA Platform%RESET%
echo %CYAN%================================================================%RESET%
echo.

:: -- 1. Ollama ---------------------------------------------------------------
echo %YELLOW%[1/4] Checking AI Engine (Ollama)...%RESET%
tasklist /FI "IMAGENAME eq ollama.exe" 2>NUL | find /I "ollama.exe" >NUL
if "%ERRORLEVEL%"=="0" (
    echo %GREEN%      Ollama already running.%RESET%
) else (
    tasklist /FI "IMAGENAME eq ollama app.exe" 2>NUL | find /I "ollama app.exe" >NUL
    if "%ERRORLEVEL%"=="0" (
        echo %GREEN%      Ollama desktop already running.%RESET%
    ) else (
        echo %YELLOW%      Starting Ollama CLI serve...%RESET%
        start "Ollama Server" cmd /c "set OLLAMA_MODELS=D:\ai models\ai models&& ollama serve"
        timeout /t 5 /nobreak >nul
    )
)

echo %YELLOW%      Waiting for Ollama API (up to 15 s)...%RESET%
for /L %%i in (1,1,5) do (
    curl -s http://localhost:11434/api/tags >nul 2>&1
    if not errorlevel 1 goto OLLAMA_OK
    timeout /t 3 /nobreak >nul
)
echo %YELLOW%      Ollama not responding - ZenGuard will use offline fallback.%RESET%
goto NEXT_BACKEND
:OLLAMA_OK
echo %GREEN%      Ollama API ready.%RESET%

:NEXT_BACKEND
echo.

:: -- 2. ZenGuard Backend (Port 8000) ----------------------------------------
echo %YELLOW%[2/4] Starting ZenGuard Backend (port 8000)...%RESET%
start "ZenGuard Backend" cmd /k "cd /d "%~dp0backend" && python -m uvicorn main:app --reload --port 8000"
echo %GREEN%      Backend launched.%RESET%
timeout /t 4 /nobreak >nul
echo.

:: -- 3. Sahayak Dashboard (Port 3000) ---------------------------------------
echo %YELLOW%[3/4] Starting Sahayak Caseworker Dashboard (port 3000)...%RESET%
set "SAHAYAK=%~dp0..\..\sahayak-dashboard--main\sahayak-dashboard--main"
if exist "%SAHAYAK%\package.json" (
    if not exist "%SAHAYAK%\node_modules\" (
        echo %YELLOW%      Installing Sahayak dependencies...%RESET%
        cmd /c "cd /d "%SAHAYAK%" && npm install"
    )
    start "Sahayak Dashboard" cmd /k "cd /d "%SAHAYAK%" && npm run dev"
    echo %GREEN%      Sahayak Dashboard launched.%RESET%
) else (
    echo %RED%      Sahayak not found at: %SAHAYAK%%RESET%
    echo %YELLOW%      Run manually: cd sahayak-dashboard--main\sahayak-dashboard--main ^&^& npm run dev%RESET%
)
timeout /t 3 /nobreak >nul
echo.

:: -- 4. ZenGuard Frontend (Port 3001) ---------------------------------------
echo %YELLOW%[4/4] Starting ZenGuard Frontend (port 3001)...%RESET%
set "FRONTEND=%~dp0frontend"
if not exist "%FRONTEND%\node_modules\" (
    echo %YELLOW%      Installing ZenGuard Frontend dependencies...%RESET%
    cmd /c "cd /d "%FRONTEND%" && npm install"
)
start "ZenGuard Frontend" cmd /k "cd /d "%FRONTEND%" && npm run dev -- --port 3001"
echo %GREEN%      Frontend launched.%RESET%
echo.

echo %CYAN%================================================================%RESET%
echo %GREEN%  Services starting - allow 15-20 seconds for full boot%RESET%
echo.
echo %CYAN%  ZenGuard AI Frontend  :%RESET%  http://localhost:3001
echo %CYAN%  Sahayak Admin Panel   :%RESET%  http://localhost:3000
echo %CYAN%  ZenGuard API (Docs)   :%RESET%  http://localhost:8000/docs
echo %CYAN%================================================================%RESET%
echo.
echo %YELLOW%  Tele-MANAS: 14416  ^|  NALSA: 15100  ^|  Emergency: 112%RESET%
echo.

timeout /t 18 /nobreak >nul
start "" "http://localhost:3001"
echo %GREEN%  Browser opened. Use "Sahayak Admin" button in ZenGuard to reach port 3000.%RESET%
echo.
pause

