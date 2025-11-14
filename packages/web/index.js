import process from 'bare-process'

import { getBackend } from 'barechat/lib/chat-core'
import { parseArgs } from 'barechat/lib/helper'

import { createChatServer } from './lib/server'
import { createWebSocketServer, broadcastMessage } from './lib/ws'
import { HTML } from './ui'

// Initialize backend functionality from chat-core
const args = parseArgs(process.argv.slice(2)); // Use parseArgs to process command line arguments
// console.log('args:', JSON.stringify(args))
const hashcode = args.topic || ''

const {
  swarm,
  getMemberId,
  joinRoom,
  sendMessage,
  version
} = getBackend(args)

// Stores active WebSocket connections
const activeConnections = new Set()

// Reference to the chat room topic
let currentRoomTopic = null
// wsServer will be init after command processed
let wsServer = null

// When there's a new peer connection in the swarm, listen for new messages
swarm.on('connection', peer => {
  const memberId = getMemberId(peer)
  console.log(`[info] New peer ${memberId} joined`)
  
  peer.on('data', rawData => {
    try {
      const event = JSON.parse(rawData)
      // Broadcast the message to all WebSocket clients
      broadcastMessage(activeConnections, { type: 'message', sender: memberId, text: event.message })
    } catch (error) {
      console.error('Error processing peer data:', error)
    }
  })
  
  peer.on('error', e => console.log(`Connection error: ${e}`))
  
  // Notify WebSocket clients about new peer
  broadcastMessage(activeConnections, { type: 'system', text: `New peer ${memberId} joined` })
})

// When there's updates to the swarm, notify about peer count
swarm.on('update', () => {
  const peerCount = swarm.connections.size
  console.log(`[info] Number of connections is now ${peerCount}`)
  broadcastMessage(activeConnections, { type: 'system', text: `Connected peers: ${peerCount}` })
})

// Handle commands from WebSocket clients
async function handleCommand(command, socket) {
  const parts = command.split(' ')
  const cmd = parts[0].toLowerCase()

  switch (cmd) {
    case 'join': {
      // create or join with a topic
      const { done: joinDone, topic: joinedTopic } = await joinRoom(parts[1] || '')

      if (joinDone) {
        currentRoomTopic = joinedTopic
        const message = `Joined chat room: ${joinedTopic}`
        console.log(`[info] ${message}`)
        // socket.write(JSON.stringify({ type: 'system', text: message }))
        broadcastMessage(activeConnections, { type: 'system', text: message })
      } else {
        socket.write(JSON.stringify({ type: 'system', text: 'Failed to join chat room' }))
      }
      break;
    }
    case 'info':
      socket.write(JSON.stringify({
        type: 'system',
        text: `BareChat v.${version}\nCurrent room: ${currentRoomTopic || 'None'}\nConnected peers: ${swarm.connections.size}`
      }))
      break;

    default:
      socket.write(JSON.stringify({ type: 'system', text: `Unknown command: ${cmd}` }))
  }
}

// Create HTTP server for serving the web interface
const webServer = createChatServer(HTML)

// Start server on a random available port
webServer.listen(0, () => {
  const { port } = webServer.address()
  console.log('==================')
  console.log(`BareChat Web server started on port ${port}`)
  console.log(`Open your browser and navigate to http://localhost:${port}`)
  console.log('==================')

  if (hashcode) { // Check if passed args with topic
    console.log(`[info] Attempting to join room with topic: ${hashcode}`);
    joinRoom(hashcode).then(({ done, topic }) => {
      if (done) {
        currentRoomTopic = topic
        console.log(`[info] Successfully joined room: ${topic}`)
        // You might want to add a mechanism to notify connected WebSocket clients here
        // using the broadcastMessage function imported from lib/ws.js
        broadcastMessage(activeConnections, { type: 'system', text: `Joined room with topic: ${hashcode}` })

      } else {
        console.error(`[error] Failed to join room with topic: ${hashcode}`)
        // You might want to add a mechanism to notify connected WebSocket clients here
        broadcastMessage(activeConnections, { type: 'system', text: `Failed to join room with topic: ${hashcode}` })
      }
    }).catch(error => {
      console.error('[error] Error joining room:', error)
      broadcastMessage(activeConnections, { type: 'system', text: `Error joining room: ${error.message}` })
    }).finally(()=> {
      // Create WebSocket server
      wsServer = createWebSocketServer({
        webServer,
        activeConnections,
        currentRoomTopic,
        handleCommand,
        sendMessage
      })
    })
  } else {
    console.log('[info] No hashcode provided, waiting for manual room creation or joining.')
    // Create WebSocket server
    wsServer = createWebSocketServer({
        webServer,
        activeConnections,
        currentRoomTopic,
        handleCommand,
        sendMessage
      })
  }
})

// Clean up on process exit
process.on('SIGINT', () => {
  console.log('\nShutting down BareChat Web...')
  broadcastMessage(activeConnections, { type: 'system', text: 'Server shutting down' })
  swarm.destroy()
  wsServer?.close()
  webServer.close()
  process.exit(0)
})
