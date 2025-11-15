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

export class RPCServer {
  constructor() {
    this.server = null
  }

  start() {
    console.log('Starting RPC server...')
    
    // Clean up old socket
    try {
      fs.unlinkSync(SOCKET_PATH)
    } catch (e) {}

    this.server = net.createServer((socket) => {
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

    this.server.listen(SOCKET_PATH, () => {
      console.log(`✓ Server listening on ${SOCKET_PATH}`)
      console.log('Waiting for messages...\n')
    })

    this.server.on('error', (err) => {
      console.error('Server error:', err.message)
      process.exit(1)
    })
  }

  stop() {
    if (this.server) {
      this.server.close()
    }
  }
}

export class RPCClient {
  constructor() {
    this.socket = null
    this.rpc = null
  }

  async connect() {
    console.log('Connecting to RPC server...')

    this.socket = net.createConnection(SOCKET_PATH)

    await new Promise((resolve, reject) => {
      this.socket.on('connect', resolve)
      this.socket.on('error', reject)
    })

    console.log('✓ Connected to server\n')
    this.rpc = new RPC(this.socket)
  }

  async sendMessage(message) {
    if (!this.rpc) {
      throw new Error('Client not connected')
    }

    console.log(`Sending: "${message}"`)
    const req = this.rpc.request(1)
    req.send(message)
    const result = await req.reply()
    return JSON.parse(result.toString())
  }

  async broadcast(message) {
    if (!this.rpc) {
      throw new Error('Client not connected')
    }

    console.log(`Broadcasting: "${message}"`)
    const req = this.rpc.request(2)
    req.send(message)
    const result = await req.reply()
    return JSON.parse(result.toString())
  }

  disconnect() {
    if (this.socket) {
      this.socket.destroy()
      console.log('\n✓ Disconnected')
    }
  }
}

export { SOCKET_PATH, schema }