#!/bin/bash
# example.sh - Test script for barechat-rpc
# This script demonstrates server and client communication

echo "================================================"
echo "  barechat-rpc Test Script"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if bare is installed
if ! command -v bare &> /dev/null; then
    echo "Error: 'bare' command not found. Please install Bare runtime first."
    echo "Visit: https://github.com/holepunchto/bare"
    exit 1
fi

# Function to run server
run_server() {
    echo -e "${GREEN}[SERVER]${NC} Starting RPC server..."
    echo -e "${YELLOW}Note: Keep this terminal open${NC}"
    echo ""
    bare index.js server
}

# Function to run client with multiple test messages
run_client_tests() {
    echo -e "${BLUE}[CLIENT]${NC} Waiting for server to start..."
    sleep 2
    
    echo ""
    echo -e "${BLUE}[CLIENT TEST 1]${NC} Sending: 'Hello from Terminal 2!'"
    bare index.js client "Hello from Terminal 2!"
    
    echo ""
    echo "----------------------------------------"
    sleep 1
    
    echo ""
    echo -e "${BLUE}[CLIENT TEST 2]${NC} Sending: 'Testing bare-rpc communication'"
    bare index.js client "Testing bare-rpc communication"
    
    echo ""
    echo "----------------------------------------"
    sleep 1
    
    echo ""
    echo -e "${BLUE}[CLIENT TEST 3]${NC} Sending: 'This is message number 3'"
    bare index.js client "This is message number 3"
    
    echo ""
    echo "----------------------------------------"
    echo ""
    echo -e "${GREEN}✓ All client tests completed!${NC}"
}

# Function to run interactive client
run_client_interactive() {
    echo -e "${BLUE}[CLIENT]${NC} Interactive mode"
    echo "Type your message (or 'quit' to exit):"
    read -p "> " message
    
    while [ "$message" != "quit" ]; do
        bare index.js client "$message"
        echo ""
        echo "Type your message (or 'quit' to exit):"
        read -p "> " message
    done
    
    echo "Goodbye!"
}

# Main menu
echo "Choose mode:"
echo "  1) Run server (Terminal 1)"
echo "  2) Run automated client tests (Terminal 2)"
echo "  3) Run interactive client (Terminal 2)"
echo "  4) Run full test (server + client in background)"
echo ""
read -p "Enter choice [1-4]: " choice

case $choice in
    1)
        run_server
        ;;
    2)
        run_client_tests
        ;;
    3)
        run_client_interactive
        ;;
    4)
        echo ""
        echo -e "${YELLOW}Running full automated test...${NC}"
        echo ""
        
        # Start server in background
        bare index.js server &
        SERVER_PID=$!
        
        # Run client tests
        run_client_tests
        
        # Kill server
        echo ""
        echo "Stopping server..."
        kill $SERVER_PID 2>/dev/null
        wait $SERVER_PID 2>/dev/null
        
        echo ""
        echo -e "${GREEN}✓ Full test completed!${NC}"
        ;;
    *)
        echo "Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "================================================"
