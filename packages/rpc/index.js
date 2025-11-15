#!/usr/bin/env bare
// Terminal IPC using bare-rpc
// barechat-rpc - Terminal communication via RPC
// Usage:
//   Terminal 1: bare index.js server
//   Terminal 2: bare index.js client "Hello from client!"

import { RPCServer, RPCClient } from './lib/rpc.js'
import process from 'bare-process'

// Server implementation
function startServer() {
  const server = new RPCServer()
  server.start()
}

// Client implementation
async function startClient(message) {
  const client = new RPCClient()
  
  try {
    await client.connect()
    
    // Send message
    const result = await client.sendMessage(message)
    console.log(`Response:`, result)

    // Broadcast
    const broadcastResult = await client.broadcast(message)
    console.log(`Broadcast result:`, broadcastResult)

  } catch (err) {
    console.error('RPC Error:', err.message)
  } finally {
    client.disconnect()
    process.exit(0)
  }
}

// Main
const args = process.argv.slice(2)
const mode = args[0]

if (mode === 'server') {
  startServer()
} else if (mode === 'client') {
  const message = args[1] || 'Hello from terminal!'
  startClient(message).catch(err => {
    console.error('Client error:', err.message)
    process.exit(1)
  })
} else {
  console.log('Usage:')
  console.log('  Server: bare index.js server')
  console.log('  Client: bare index.js client "your message"')
  process.exit(1)
}