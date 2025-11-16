#!/usr/bin/env bare
// Simple test for RPC message forwarding without TTY

import { getBackend } from './lib/chat-core.js'
import { RPCServer } from './lib/rpc-server.js'
import { createFileStore } from './lib/helper.js'

console.log('🧪 Testing RPC message forwarding...')

// Initialize file store (disabled)
const fileStore = createFileStore(null)

// Initialize chat backend
const { swarm, sendMessage, joinRoom } = getBackend()

// Create appendMessage function for testing
function appendMessage ({ memberId, event }) {
  console.log(`📨 [${memberId}] ${event?.message}`)
}

// Initialize RPC server
const rpcServer = new RPCServer({ 
  sendMessage, 
  appendMessage 
})

// Join a test room
joinRoom('test-room').then(({ done, topic }) => {
  if (done) {
    console.log(`✅ Joined room: ${topic}`)
    
    // Start RPC server
    rpcServer.start()
    
    console.log('🚀 RPC server started')
    console.log('💡 Ready to receive messages...')
    
    // Test for 15 seconds then exit
    setTimeout(() => {
      console.log('✅ Test completed')
      rpcServer.stop()
      swarm.destroy()
    }, 15000)
  } else {
    console.log('❌ Failed to join room')
  }
}).catch(err => {
  console.error('❌ Error:', err.message)
})