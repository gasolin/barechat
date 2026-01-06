const { IPC } = BareKit
const b4a = require('b4a')
const { ChatRPC, COMMANDS } = require('../rpc')


console.log('Chat Worklet starting...')

let getBackend = null
try {
  console.log('Attempting to require barechat-core...')
  const core = require('barechat-core')
  getBackend = core.getBackend
  console.log('barechat-core required successfully')
} catch (e) {
  console.error('CRITICAL: Failed to load barechat-core:', e)
}

let backend = null

const rpc = new ChatRPC(IPC, async (req) => {
  try {
    if (req.command === COMMANDS.JOIN_ROOM) {
      const topic = b4a.toString(req.data, 'utf8')
      console.log(`RPC: JOIN_ROOM requested for topic: ${topic}`)

      if (!getBackend) {
        throw new Error('Backend engine not loaded')
      }

      if (!backend) {
        console.log('Initializing backend...')
        backend = getBackend()
        console.log('Backend initialized')
      }

      console.log('Joining room...')
      const result = await backend.joinRoom(topic)
      console.log('Room join result:', result)

      // Listen for messages in the new room
      backend.swarm.on('connection', (peer) => {
        const peerId = backend.getMemberId(peer)
        console.log(`New peer connection: ${peerId}`)

        peer.on('data', (data) => {
          try {
            const msg = JSON.parse(b4a.toString(data, 'utf8'))
            console.log(`Received message from ${peerId}:`, msg.message)
            rpc.emitMessage(msg).catch(err => console.error('Emit error:', err))
          } catch (e) {
            console.error('Error parsing incoming message:', e)
          }
        })

        peer.on('error', (err) => {
          console.error(`Peer error (${peerId}):`, err)
        })
      })

      ChatRPC.reply(req, result)
    } else if (req.command === COMMANDS.SEND_MESSAGE) {
      const message = b4a.toString(req.data, 'utf8')
      console.log(`RPC: SEND_MESSAGE: ${message}`)

      if (backend) {
        backend.sendMessage(message)
        ChatRPC.reply(req, { success: true })
      } else {
        console.warn('SEND_MESSAGE failed: Backend not initialized')
        ChatRPC.reply(req, { success: false, error: 'Backend not initialized' })
      }
    }
  } catch (err) {
    console.error('RPC Handler Error:', err)
    ChatRPC.reply(req, { success: false, error: err.message })
  }
})

console.log('Chat Worklet initialized')