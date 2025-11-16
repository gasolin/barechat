#!/usr/bin/env bare
// Test script to verify RPC message forwarding to chat room

import { getBackend } from './lib/chat-core.js'
import { RPCServer } from './lib/rpc-server.js'
import { randomBytes } from 'hypercore-crypto'
import b4a from 'b4a'

console.log('Testing RPC message forwarding...')

// Initialize chat backend
const backend = getBackend()

// Create appendMessage function for testing
function appendMessage ({ memberId, event }) {
  console.log(`[CHAT] [${memberId}] ${event?.message}`)
}

// Initialize RPC server
const rpcServer = new RPCServer({ 
  sendMessage: backend.sendMessage, 
  appendMessage 
})

// Join a test room
const topicBuffer = randomBytes(32)
const topic = b4a.toString(topicBuffer, 'hex')

console.log(`Joining test room: ${topic}`)

backend.joinRoom(topic).then(({ done }) => {
  if (done) {
    console.log('✓ Joined room successfully')
    
    // Start RPC server
    rpcServer.start()
    
    console.log('✓ RPC server started')
    console.log('Ready to test message forwarding...')
    console.log('Run this in another terminal:')
    console.log(`cd packages/rpc && bare index.js client "Test message to room ${topic}"`)
    
    // Test for 10 seconds then exit
    setTimeout(() => {
      console.log('Test completed')
      rpcServer.stop()
      backend.swarm.destroy()
    }, 10000)
  } else {
    console.log('✗ Failed to join room')
  }
}).catch(err => {
  console.error('Error:', err.message)
})