import RPC from 'bare-rpc'
import net from 'bare-net'
import fs from 'bare-fs'
import path from 'bare-path'
import os from 'bare-os'
import process from 'bare-process'

const SOCKET_PATH = path.join(os.tmpdir(), 'barechat-rpc.sock')
const RPC_MEMBER_ID = 'rpc-client'

export class RPCServer {
  constructor(chatBackend) {
    this.server = null
    this.chatBackend = chatBackend
  }

  start() {
    console.log('[rpc] Starting RPC server for chat integration...')
    
    // Clean up old socket
    try {
      fs.unlinkSync(SOCKET_PATH)
    } catch (e) {}

    this.server = net.createServer((socket) => {
      console.log('[rpc] Client connected')

      new RPC(socket, (req) => {
        if (req.command === 1) {
          // sendMessage command
          const message = req.data.toString()
          console.log(`[rpc] Received message: "${message}"`)
          
          // Send message to chat room
          this.chatBackend.sendMessage(message)
          
          // Store the message locally
          if (this.chatBackend.appendMessage) {
            this.chatBackend.appendMessage({ memberId: RPC_MEMBER_ID, event: { message } })
          }
          
          req.reply(JSON.stringify({ success: true, echo: message }))
        } else if (req.command === 2) {
          // broadcast command (same as sendMessage for chat)
          const message = req.data.toString()
          console.log(`[rpc] Broadcasting message: "${message}"`)
          
          // Send message to chat room
          this.chatBackend.sendMessage(message)
          
          // Store the message locally
          if (this.chatBackend.appendMessage) {
            this.chatBackend.appendMessage({ memberId: RPC_MEMBER_ID, event: { message } })
          }
          
          req.reply(JSON.stringify({ received: true }))
        }
      })

      socket.on('close', () => {
        console.log('[rpc] Client disconnected')
      })

      socket.on('error', (err) => {
        console.error('[rpc] Socket error:', err.message)
      })
    })

    this.server.listen(SOCKET_PATH, () => {
      console.log(`[rpc] ✓ Server listening on ${SOCKET_PATH}`)
      console.log('[rpc] Ready to receive messages from RPC clients...\n')
    })

    this.server.on('error', (err) => {
      console.error('[rpc] Server error:', err.message)
      process.exit(1)
    })
  }

  stop() {
    if (this.server) {
      this.server.close()
      console.log('[rpc] Server stopped')
    }
  }
}

export { SOCKET_PATH }