import Hyperswarm from 'hyperswarm'   // Module for P2P networking and connecting peers
import b4a from 'b4a'                 // Module for buffer-to-string and vice-versa conversions
import crypto from 'hypercore-crypto' // Cryptographic functions for generating the key in app

import { version } from '../package.json'
import { createMessage } from './api'

console.log(`BareChat v.${version}`)

const getSwarm = (opts) => opts?.bootstrap ? new Hyperswarm({ bootstrap: opts.bootstrap }) : new Hyperswarm()

const getMemberId = (peer) => (
  peer ? b4a.toString(peer.remotePublicKey, 'hex')?.substring(0, 6) : 'invalid'
)

// Create a new chat room for the topic
const createRoom = swarm => async () => {
  // Generate a new random topic (32 byte string)
  const topicBuffer = crypto.randomBytes(32)

  // Join the swarm with the topic. Setting both client/server to true means that this app can act as both.
  const discovery = swarm.join(topicBuffer, { client: true, server: true })
  const done = await discovery.flushed()

  const topic = b4a.toString(topicBuffer, 'hex')
  return { done, topic }
}

const joinRoom = swarm => async (topicStr) => {
  try {
    const topicBuffer = b4a.from(topicStr, 'hex')

    // Join the swarm with the topic. Setting both client/server to true means that this app can act as both.
    const discovery = swarm.join(topicBuffer, { client: true, server: true })
    const done = await discovery.flushed()

    const topic = done ? b4a.toString(topicBuffer, 'hex') : ''
    return { done, topic }
  } catch (error) {
    return { done: false, topic: 'err' }
  }
}

const sendMessage = swarm => (message) => {
  // Send the message to all peers (that you are connected to)
  const peers = [...swarm.connections]
  const event = createMessage(message, true)
  for (const peer of peers) peer.write(JSON.stringify(event))
}

export const getBackend = (opts) => {
  const swarm = getSwarm(opts)
  return {
    createRoom: createRoom(swarm),
    getMemberId,
    joinRoom: joinRoom(swarm),
    sendMessage: sendMessage(swarm),
    swarm,
    version,
  }
}
