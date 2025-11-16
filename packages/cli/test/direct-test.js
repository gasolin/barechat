#!/usr/bin/env bare
// Direct test to verify RPC message forwarding

import { getBackend } from './lib/chat-core.js'
import { RPCServer } from './lib/rpc-server.js'

console.log('🧪 Direct RPC test...')

// Initialize chat backend
const { swarm, sendMessage, joinRoom } = getBackend()

// Track received messages
let receivedMessages = []

// Create appendMessage function for testing
function appendMessage ({ memberId, event }) {
  const msg = `[${memberId}] ${event?.message}`
  console.log('📨 Received:', msg)
  receivedMessages.push(msg)
}

// Initialize RPC server
const rpcServer = new RPCServer({ 
  sendMessage, 
  appendMessage 
})

// Join a test room
joinRoom('direct-test').then(({ done, topic }) => {
  if (done) {
    console.log(`✅ Joined room: ${topic}`)
    
    // Start RPC server
    rpcServer.start()
    
    console.log('🚀 RPC server started')
    console.log('⏳ Waiting 10 seconds for messages...')
    
    // Test for 10 seconds then exit
    setTimeout(() => {
      console.log(`✅ Test completed. Received ${receivedMessages.length} messages:`)
      receivedMessages.forEach((msg, i) => console.log(`  ${i + 1}. ${msg}`))
      rpcServer.stop()
      swarm.destroy()
    }, 10000)
  } else {
    console.log('❌ Failed to join room')
  }
}).catch(err => {
  console.error('❌ Error:', err.message)
})