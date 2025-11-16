#!/bin/bash

# Test script for RPC server integration in web package
echo "Testing RPC server in web package..."

# Start web server in background
echo "Starting web server..."
cd ..
cd web
bare index.js &
WEB_PID=$!

# Wait for server to start
sleep 3

# Test RPC client connection
echo "Testing RPC client connection..."
cd ../rpc
bare index.js client "Hello from RPC client to web server!" &
RPC_PID=$!

# Wait for test to complete
sleep 2

# Clean up
echo "Cleaning up..."
kill $WEB_PID 2>/dev/null
kill $RPC_PID 2>/dev/null

echo "RPC integration test completed!"
