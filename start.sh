#!/bin/bash

# ANSI Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================================${NC}"
echo -e "${GREEN}         Starting ZenGuard AI (macOS)${NC}"
echo -e "${CYAN}========================================================${NC}"
echo ""

# Check if Ollama is running, if not start it
if ! curl -s http://localhost:11434 > /dev/null; then
    echo -e "${YELLOW}Starting Ollama...${NC}"
    open -a Ollama
    sleep 3
fi

# Start Backend
echo -e "${GREEN}Starting Data Privacy Engine (Backend :8000)...${NC}"
cd backend || exit
source venv/bin/activate 2>/dev/null || true
python -m uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

# Start Sahayak Dashboard
SAHAYAK_DIR="../../sahayak-dashboard--main/sahayak-dashboard--main"
if [ -d "$SAHAYAK_DIR" ]; then
    echo -e "${GREEN}Starting Sahayak Dashboard (:3000)...${NC}"
    cd "$SAHAYAK_DIR" && npm run dev &
    SAHAYAK_PID=$!
    cd - > /dev/null || true
fi

# Start Frontend
echo -e "${GREEN}Starting ZenGuard Frontend (:3001)...${NC}"
cd frontend || exit
npm run dev -- --port 3001 &
FRONTEND_PID=$!
cd ..

echo ""
echo -e "${GREEN}All systems operational!${NC}"
echo -e "${CYAN}ZenGuard Frontend : http://localhost:3001${NC}"
echo -e "${CYAN}Sahayak Dashboard : http://localhost:3000${NC}"
echo -e "${CYAN}ZenGuard API      : http://localhost:8000/docs${NC}"
echo -e "${YELLOW}Press [CTRL+C] to gracefully shut down the servers.${NC}"
echo ""

# Give it a moment to boot up
sleep 5
open http://localhost:3001 2>/dev/null || xdg-open http://localhost:3001 2>/dev/null || true

# Cleanup function to kill processes on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down ZenGuard AI & Sahayak gracefully...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    kill $SAHAYAK_PID 2>/dev/null
    exit 0
}

# Trap CTRL+C
trap cleanup SIGINT SIGTERM

# Wait for background processes
wait
