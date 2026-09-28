@echo off
setlocal enabledelayedexpansion

:: ANSI Colors
set "GREEN=[92m"
set "YELLOW=[93m"
set "RED=[91m"
set "CYAN=[96m"
set "RESET=[0m"

echo  %CYAN%========================================================%RESET%
echo  %GREEN%         ZenGuard AI - Automated Setup Wizard%RESET%
echo  %CYAN%========================================================%RESET%
echo.
echo %YELLOW%This script will automatically set up everything you need.%RESET%
echo %YELLOW%Please accept any administrative prompts that appear.%RESET%
echo.
pause

echo.
echo %CYAN%[1/5] Checking System Requirements...%RESET%

:: Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo %YELLOW%Node.js is missing. Installing automatically via winget...%RESET%
    winget install -e --id OpenJS.NodeJS --accept-source-agreements --accept-package-agreements
    if !errorlevel! neq 0 (
        echo %RED%Failed to install Node.js. Please install it manually from https://nodejs.org/%RESET%
        pause
        exit /b 1
    )
    echo %GREEN%Node.js installed successfully.%RESET%
    :: Required to refresh PATH in some environments
    set "PATH=%PATH%;C:\Program Files\nodejs\"
) else (
    echo %GREEN%Node.js is already installed.%RESET%
)

:: Check for Python
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo %YELLOW%Python is missing. Installing automatically via winget...%RESET%
    winget install -e --id Python.Python.3.11 --accept-source-agreements --accept-package-agreements
    if !errorlevel! neq 0 (
        echo %RED%Failed to install Python. Please install it manually from https://www.python.org/downloads/%RESET%
        pause
        exit /b 1
    )
    echo %GREEN%Python installed successfully.%RESET%
) else (
    echo %GREEN%Python is already installed.%RESET%
)

:: Check for Ollama
where ollama >nul 2>nul
if %errorlevel% neq 0 (
    echo %YELLOW%Ollama (AI Engine) is missing. Installing automatically via winget...%RESET%
    winget install -e --id Ollama.Ollama --accept-source-agreements --accept-package-agreements
    if !errorlevel! neq 0 (
        echo %RED%Failed to install Ollama. Please install it manually from https://ollama.com/%RESET%
        pause
        exit /b 1
    )
    echo %GREEN%Ollama installed successfully.%RESET%
    set "PATH=%PATH%;%LOCALAPPDATA%\Programs\Ollama"
) else (
    echo %GREEN%Ollama is already installed.%RESET%
)

echo.
echo %CYAN%[2/5] Assessing Hardware for AI Model...%RESET%
for /f "tokens=*" %%a in ('powershell -command "[math]::round((Get-WmiObject -Class Win32_PhysicalMemory | Measure-Object -Property Capacity -Sum).Sum / 1GB)"') do set "RAM_GB=%%a"

echo %YELLOW%System RAM detected: !RAM_GB! GB%RESET%

if !RAM_GB! GEQ 8 (
    echo %GREEN%High-performance system detected. Using Gemma-3 (High Quality).%RESET%
    set "SELECTED_MODEL=gemma3:latest"
) else (
    echo %YELLOW%Low-end system detected. Using Phi-3 Mini (Ultra Fast/Lite Mode).%RESET%
    set "SELECTED_MODEL=phi3:mini"
)

echo %YELLOW%We are downloading the AI brain (!SELECTED_MODEL!). This may take a while.%RESET%
ollama pull !SELECTED_MODEL!

echo %YELLOW%Connecting backend to !SELECTED_MODEL!...%RESET%
powershell -command "(Get-Content backend\.env) -replace '^OLLAMA_MODEL=.*', 'OLLAMA_MODEL=!SELECTED_MODEL!' | Set-Content backend\.env"
echo %GREEN%AI Model ready!%RESET%

echo.
echo %CYAN%[3/5] Setting up the Frontend Workspace...%RESET%
cd frontend
if not exist "node_modules\" (
    echo %YELLOW%Downloading frontend components...%RESET%
    call npm install
) else (
    echo %GREEN%Frontend components already exist.%RESET%
)
cd ..

echo.
echo %CYAN%[4/5] Setting up the Backend Processing Engine...%RESET%
cd backend
if not exist "venv\" (
    echo %YELLOW%Creating isolated Python environment...%RESET%
    python -m venv venv
)
echo %YELLOW%Installing backend components...%RESET%
call venv\Scripts\activate.bat
pip install -r requirements.txt
deactivate
cd ..

echo.
echo %CYAN%========================================================%RESET%
echo  %GREEN%         Installation Complete!%RESET%
echo %CYAN%========================================================%RESET%
echo.
echo %YELLOW%Everything is ready to go. The application will now start.%RESET%
echo %YELLOW%A browser window will open automatically once the servers are running.%RESET%
echo.
pause

:: Start the app
echo %GREEN%Launching ZenGuard AI...%RESET%
call start.bat

