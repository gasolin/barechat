#!/usr/bin/env bare
// Terminal IPC using bare-rpc
// barechat-rpc - Terminal communication via RPC
// Usage:
//   Terminal 1: bare rpc.js server
//   Terminal 2: bare rpc.js client "Hello from client!"

import RPC from 'bare-rpc'
import net from 'bare-net'
import fs from 'bare-fs'
import path from 'bare-path'
import os from 'bare-os'
import process from 'bare-process'

const SOCKET_PATH = path.join(os.tmpdir(), 'bare-rpc.sock')

// Define RPC interface
const schema = {
  id: 'terminal-rpc',
  methods: {
    sendMessage: {
      request: { type: 'string' },
      response: { type: 'object', properties: { success: { type: 'boolean' }, echo: { type: 'string' } } }
    },
    broadcast: {
      request: { type: 'string' },
      response: { type: 'object', properties: { received: { type: 'boolean' } } }
    }
  }
}

// Server implementation
function startServer() {
  console.log('Starting RPC server...')
  
  // Clean up old socket
  try {
    fs.unlinkSync(SOCKET_PATH)
  } catch (e) {}

  const server = net.createServer((socket) => {
    console.log('Client connected')

    const rpc = new RPC(socket, (req) => {
      if (req.command === 1) {
        // sendMessage command
        const message = req.data.toString()
        console.log(`\n📨 Received: "${message}"`)
        req.reply(JSON.stringify({ success: true, echo: message }))
      } else if (req.command === 2) {
        // broadcast command
        const message = req.data.toString()
        console.log(`\n📢 Broadcast: "${message}"`)
        req.reply(JSON.stringify({ received: true }))
      }
    })

    socket.on('close', () => {
      console.log('Client disconnected')
    })

    socket.on('error', (err) => {
      console.error('Socket error:', err.message)
    })
  })

  server.listen(SOCKET_PATH, () => {
    console.log(`✓ Server listening on ${SOCKET_PATH}`)
    console.log('Waiting for messages...\n')
  })

  server.on('error', (err) => {
    console.error('Server error:', err.message)
    process.exit(1)
  })
}

// Client implementation
async function startClient(message) {
  console.log('Connecting to RPC server...')

  const socket = net.createConnection(SOCKET_PATH)

  await new Promise((resolve, reject) => {
    socket.on('connect', resolve)
    socket.on('error', reject)
  })

  console.log('✓ Connected to server\n')

  // Create RPC instance
  const rpc = new RPC(socket)

  try {
    // Send message
    console.log(`Sending: "${message}"`)
    const req1 = rpc.request(1)
    req1.send(message)
    const result = await req1.reply()
    console.log(`Response:`, JSON.parse(result.toString()))

    // Broadcast
    console.log(`\nBroadcasting: "${message}"`)
    const req2 = rpc.request(2)
    req2.send(message)
    const broadcastResult = await req2.reply()
    console.log(`Broadcast result:`, JSON.parse(broadcastResult.toString()))

  } catch (err) {
    console.error('RPC Error:', err.message)
  } finally {
    socket.destroy()
    console.log('\n✓ Disconnected')
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
  console.log('  Server: bare rpc.js server')
  console.log('  Client: bare rpc.js client "your message"')
  process.exit(1)
}
