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

const defaultStorePath = './barechat.txt'

// A simple command-line argument parser
export function parseArgs(argv) {
  const result = { topic: '', store: null, bootstrap: null }

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]

    if (arg === '--store') {
      // Handle --store option without value (use default)
      if (i + 1 >= argv.length || argv[i + 1].startsWith('--')) {
        result.store = defaultStorePath
      } else {
        // Handle --store with value
        result.store = argv[i + 1]
        i++ // Skip the next argument as it's the value
      }
    } else if (arg.startsWith('--store=')) {
      // Handle --store=path format
      const value = arg.substring('--store='.length)
      result.store = value || defaultStorePath
    } else if (arg === '--bootstrap') {
      // Handle --bootstrap option with value
      if (i + 1 < argv.length && !argv[i + 1].startsWith('--')) {
        result.bootstrap = argv[i + 1];
        i++; // Skip the next argument as it's the value
      } else {
        // If --bootstrap is the last arg or next arg starts with '--', value is null
        result.bootstrap = null;
      }
    } else if (!arg.startsWith('--') && !result.topic) {
      // First non-option argument is treated as the topic
      result.topic = arg
    }
  }
  return result
}
