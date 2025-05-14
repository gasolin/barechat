/* global Bare */
import readline from 'bare-readline'  // Module for reading user input in terminal
import tty from 'bare-tty'            // Module to control terminal behavior
import process from 'bare-process'    // Process control for Bare

import { getBackend } from './lib/chat-core'

const key = Bare.argv.length > 2 ? Bare.argv[2] : ''
const shouldCreateSwarm = !key      // Flag to determine if a new chat room should be created

Bare
  .on('suspend', () => console.log('suspended'))
  .on('resume', () => console.log('resumed'))
  .on('exit', () => {
    sendMessage('leaved')
    console.log('exited')
    swarm.destroy()
  })

const {
  swarm,
  getMemberId,
  createRoom,
  joinRoom,
  sendMessage
} = getBackend()

const rl = readline.createInterface({
  input: new tty.ReadStream(0),
  output: new tty.WriteStream(1)
})

// When there's a new connection, listen for new messages, and output them to the terminal
swarm.on('connection', peer => {
  const memberId = getMemberId(peer)
  console.log(`[info] New peer joined, ${memberId}`)
  peer.on('data', event => appendMessage({ memberId, event: JSON.parse(event) }))
  peer.on('error', e => console.log(`Connection error: ${e}`))
})

// When there's updates to the swarm, update the peers count
swarm.on('update', () => {
  console.log(`[info] Number of connections is now ${swarm.connections.size}`)
})

if (shouldCreateSwarm) {
  await createChatRoom()
} else {
  await joinChatRoom(key)
}

rl.input.setMode(tty.constants.MODE_RAW) // Enable raw input mode for efficient key reading
rl.on('data', line => {
  sendMessage(line)
  rl.prompt()
})
rl.prompt()

rl.on('close', () => {
  process.kill(process.pid, 'SIGINT')
})

async function createChatRoom () {
  const { done, topic } = await createRoom()
  if (done) {
    console.log(`[info] Created new chat room: ${topic}`)
  } else {
    console.log(`[info] Create fail`)
  }
}

async function joinChatRoom (topicStr) {
  const { done, topic } = await joinRoom(topicStr)
  if (done) {
    console.log(`[info] Joined chat room ${topic}`)
  } else {
    console.log(`[info] Joined fail`)
  }
}

function appendMessage ({ memberId, event }) {
  // Output chat msgs to terminal
  console.log(`[${memberId}] ${event?.message}`)
}
