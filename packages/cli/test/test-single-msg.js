#!/usr/bin/env bare
// Test to verify single message processing

import { getBackend } from 'barechat-core'
import { RPCServer } from '../lib/rpc-server.js'

console.log('🧪 Testing single message processing...')

// Initialize chat backend
const { swarm, sendMessage, joinRoom } = getBackend()

// Track received messages
let messageCount = 0

// Create appendMessage function for testing
function appendMessage ({ memberId, event }) {
  messageCount++
  console.log(`📨 Message ${messageCount}: [${memberId}] ${event?.message}`)
}

// Initialize RPC server
const rpcServer = new RPCServer({ 
  sendMessage, 
  appendMessage 
})

// Join a test room
joinRoom('single-msg-test').then(({ done, topic }) => {
  if (done) {
    console.log(`✅ Joined room: ${topic}`)
    
    // Start RPC server
    rpcServer.start()
    
    console.log('🚀 RPC server started')
    console.log('⏳ Waiting 8 seconds for messages...')
    
    // Test for 8 seconds then exit
    setTimeout(() => {
      console.log(`✅ Test completed. Total messages received: ${messageCount}`)
      rpcServer.stop()
      swarm.destroy()
    }, 8000)
  } else {
    console.log('❌ Failed to join room')
  }
}).catch(err => {
  console.error('❌ Error:', err.message)
})