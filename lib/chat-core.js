import Hyperswarm from 'hyperswarm'   // Module for P2P networking and connecting peers
import b4a from 'b4a'                 // Module for buffer-to-string and vice-versa conversions
import crypto from 'hypercore-crypto' // Cryptographic functions for generating the key in app

import { version } from '../package.json'
import { createMessage } from './api'

const swarm = new Hyperswarm()

console.log(`barechat v.${version}`)

const getMemberId = (peer) => (
  peer ? b4a.toString(peer.remotePublicKey, 'hex')?.substring(0, 6) : 'invalid'
)

const joinSwarm = async (topicBuffer) => {
  // Join the swarm with the topic. Setting both client/server to true means that this app can act as both.
  const discovery = swarm.join(topicBuffer, { client: true, server: true })
  return await discovery.flushed()
}

const createRoom = async () => {
  // Generate a new random topic (32 byte string)
  const topicBuffer = crypto.randomBytes(32)
  // Create a new chat room for the topic
  const done = await joinSwarm(topicBuffer)
  const topic = b4a.toString(topicBuffer, 'hex')
  return { done, topic }
}

const joinRoom = async (topicStr) => {
  try {
    const topicBuffer = b4a.from(topicStr, 'hex')
    const done = await joinSwarm(topicBuffer)
    const topic = done ? b4a.toString(topicBuffer, 'hex') : ''
    return { done, topic }
  } catch (error) {
    return { done: false, topic: 'err' }
  }
}

function sendMessage (message) {
  // Send the message to all peers (that you are connected to)
  const peers = [...swarm.connections]
  const event = createMessage(message, true)
  for (const peer of peers) peer.write(JSON.stringify(event))
}

export const getBackend = () => ({
  version,
  swarm,
  getMemberId,
  createRoom,
  joinRoom,
  sendMessage,
})
