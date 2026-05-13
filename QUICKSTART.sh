#!/bin/bash
# ZHUST Command Center - Quick Start for macOS/Linux
# This script installs dependencies and guides you to start both backend and frontend

echo ""
echo "================================================================================"
echo "  🏛️ ZHUST Command Center - Quick Start"
echo "================================================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✓ Node.js detected: $NODE_VERSION"
echo ""

# Backend setup
echo "[1/4] Setting up backend..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend setup failed"
    exit 1
fi
cd ..
echo "✓ Backend dependencies installed"
echo ""

# Frontend setup
echo "[2/4] Setting up frontend..."
cd client
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend setup failed"
    exit 1
fi
cd ..
echo "✓ Frontend dependencies installed"
echo ""

echo "[3/4] Verifying data.json..."
if [ ! -f "server/data.json" ]; then
    echo "✓ data.json will be created on first backend start"
else
    echo "✓ data.json found"
fi
echo ""

echo "[4/4] Ready to start!"
echo ""
echo "================================================================================"
echo "   📋 Next Steps:"
echo "================================================================================"
echo ""
echo "Open TWO terminal windows:"
echo ""
echo "TERMINAL 1 (Backend):"
echo "  cd server"
echo "  npm run dev"
echo "  Expected: Backend running on http://localhost:5000"
echo ""
echo "TERMINAL 2 (Frontend):"
echo "  cd client"
echo "  npm run dev"
echo "  Expected: Frontend running on http://localhost:5173"
echo ""
echo "================================================================================"
echo "   🚀 Then open http://localhost:5173 in your browser"
echo "================================================================================"
echo ""
