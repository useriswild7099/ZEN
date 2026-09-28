#!/bin/bash

# ANSI Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================================${NC}"
echo -e "${GREEN}         ZenGuard AI - macOS Setup Wizard${NC}"
echo -e "${CYAN}========================================================${NC}"
echo ""
echo -e "${YELLOW}This script will automatically set up everything you need.${NC}"
echo -e "${YELLOW}You may be prompted for your Mac password during installation.${NC}"
echo ""
read -p "Press [Enter] to begin..."

echo ""
echo -e "${CYAN}[1/5] Checking System Requirements...${NC}"

# Check for Homebrew, install if we don't have it
if test ! $(which brew); then
    echo -e "${YELLOW}Homebrew is missing. Installing Homebrew...${NC}"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Configure Homebrew in PATH for Apple Silicon/Intel
    if [[ $(uname -m) == 'arm64' ]]; then
        eval "$(/opt/homebrew/bin/brew shellenv)"
    else
        eval "$(/usr/local/bin/brew shellenv)"
    fi
else
    echo -e "${GREEN}Homebrew is already installed.${NC}"
fi

# Check for Node.js
if test ! $(which node); then
    echo -e "${YELLOW}Node.js is missing. Installing via Homebrew...${NC}"
    brew install node
else
    echo -e "${GREEN}Node.js is already installed.${NC}"
fi

# Check for Python
if test ! $(which python3); then
    echo -e "${YELLOW}Python is missing. Installing via Homebrew...${NC}"
    brew install python
else
    echo -e "${GREEN}Python is already installed.${NC}"
fi

# Check for Ollama
if test ! $(which ollama); then
    echo -e "${YELLOW}Ollama (AI Engine) is missing. Installing via Homebrew...${NC}"
    brew install --cask ollama
    
    # Start Ollama service
    echo -e "${YELLOW}Starting Ollama service...${NC}"
    brew services start ollama
    sleep 3
else
    echo -e "${GREEN}Ollama is already installed.${NC}"
    # Verify it's actually running
    if ! curl -s http://localhost:11434 > /dev/null; then
        echo -e "${YELLOW}Starting Ollama app...${NC}"
        open -a Ollama
        sleep 5
    fi
fi

echo ""
echo -e "${CYAN}[2/5] Assessing Hardware for AI Model...${NC}"

# Get RAM in GB
if [[ "$OSTYPE" == "darwin"* ]]; then
    RAM_BYTES=$(sysctl -n hw.memsize)
else
    RAM_BYTES=$(free -b | awk '/^Mem:/{print $2}')
fi
RAM_GB=$(( RAM_BYTES / 1024 / 1024 / 1024 ))

echo -e "${YELLOW}System RAM detected: ${RAM_GB} GB${NC}"

if [ "$RAM_GB" -ge 8 ]; then
    echo -e "${GREEN}High-performance system detected. Using Gemma-3 (High Quality).${NC}"
    SELECTED_MODEL="gemma3:latest"
else
    echo -e "${YELLOW}Low-end system detected. Using Phi-3 Mini (Ultra Fast/Lite Mode).${NC}"
    SELECTED_MODEL="phi3:mini"
fi

echo -e "${YELLOW}We are downloading the AI brain (${SELECTED_MODEL}). This may take a while.${NC}"
ollama pull "$SELECTED_MODEL"

echo -e "${YELLOW}Connecting backend to ${SELECTED_MODEL}...${NC}"
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/^OLLAMA_MODEL=.*/OLLAMA_MODEL=$SELECTED_MODEL/" backend/.env
else
    sed -i "s/^OLLAMA_MODEL=.*/OLLAMA_MODEL=$SELECTED_MODEL/" backend/.env
fi
echo -e "${GREEN}AI Model ready!${NC}"

echo ""
echo -e "${CYAN}[3/5] Setting up the Frontend Workspace...${NC}"
cd frontend
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Downloading frontend components...${NC}"
    npm install
else
    echo -e "${GREEN}Frontend components already exist.${NC}"
fi
cd ..

echo ""
echo -e "${CYAN}[4/5] Setting up the Backend Processing Engine...${NC}"
cd backend
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Creating isolated Python environment...${NC}"
    python3 -m venv venv
fi
echo -e "${YELLOW}Installing backend components...${NC}"
source venv/bin/activate
pip install -r requirements.txt
deactivate
cd ..

echo ""
echo -e "${CYAN}========================================================${NC}"
echo -e "${GREEN}         Installation Complete!${NC}"
echo -e "${CYAN}========================================================${NC}"
echo ""
echo -e "${YELLOW}Everything is ready to go. The application will now start.${NC}"
echo -e "${YELLOW}A browser window will open automatically once the servers are running.${NC}"
echo ""
read -p "Press [Enter] to launch..."

# Make start script executable and run it
chmod +x start.sh
./start.sh
