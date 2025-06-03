import Hyperswarm from 'hyperswarm'   // Module for P2P networking and connecting peers
import b4a from 'b4a'                 // Module for buffer-to-string and vice-versa conversions
import crypto from 'hypercore-crypto' // Cryptographic functions for generating the key in app

import { version } from '../package.json'
import { createMessage } from './api'

console.log(`BareChat v.${version}`)

/**
 * Creates a Hyperswarm instance with optional bootstrap configuration
 * @param {Object} [opts] - Configuration options
 * @param {string[]} [opts.bootstrap] - Array of bootstrap servers for peer discovery
 * @returns {Hyperswarm} Configured Hyperswarm instance
 */
const getSwarm = (opts) => opts?.bootstrap ? new Hyperswarm({ bootstrap: opts.bootstrap }) : new Hyperswarm()

/**
 * Generates a short, human-readable identifier for a peer based on their remote public key
 * @param {Object} peer - The peer object from the Hyperswarm connection
 * @returns {string} A 6-character hex string representing the member ID, or 'invalid' if the peer object is not valid
 * @example
 * swarm.on('connection', (peer) => {
 *   const memberId = getMemberId(peer);
 *   console.log("New peer connected with ID:", memberId);
 * });
 */
const getMemberId = (peer) => (
  peer ? b4a.toString(peer.remotePublicKey, 'hex')?.substring(0, 6) : 'invalid'
)

/**
 * Creates a new chat room for the topic
 * @param {Hyperswarm} swarm - The Hyperswarm instance to use
 * @returns {Function} An async function that creates a room
 */
const createRoom = swarm => async () => {
  // Generate a new random topic (32 byte string)
  const topicBuffer = crypto.randomBytes(32)

  // Join the swarm with the topic. Setting both client/server to true means that this app can act as both.
  const discovery = swarm.join(topicBuffer, { client: true, server: true })
  const done = await discovery.flushed()

  const topic = b4a.toString(topicBuffer, 'hex')
  return { done, topic }
}

/**
 * Joins an existing chat room using a provided topic string
 * @param {Hyperswarm} swarm - The Hyperswarm instance to use
 * @returns {Function} An async function that joins a room
 */
const joinRoom = swarm =>
  /**
   * Joins an existing chat room using a provided topic string
   * @param {string} topicStr - The hex-encoded topic of the room to join
   * @returns {Promise<{done: boolean, topic: string}>} Promise resolving to join result
   * @property {boolean} done - Indicates if the swarm joining process is complete
   * @property {string} topic - The hex-encoded topic of the joined room, or empty string/'err' on error
   * @example
   * const { joinRoom } = getBackend();
   * const roomToJoin = 'somehexencodedtopic';
   * const room = await joinRoom(roomToJoin);
   * if (room.done) {
   *   console.log("Joined room with topic:", room.topic);
   * } else {
   *   console.error("Failed to join room.");
   * }
   */
  async (topicStr) => {
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

/**
 * Sends a message to all peers currently connected in the swarm
 * @param {Hyperswarm} swarm - The Hyperswarm instance to use
 * @returns {Function} A function that sends messages
 */
const sendMessage = swarm =>
  /**
   * Sends a message to all peers currently connected in the swarm
   * @param {string} message - The message content to send
   * @returns {undefined}
   * @example
   * const { sendMessage } = getBackend();
   * sendMessage("Hello everyone in the room!");
   */
  (message) => {
    // Send the message to all peers (that you are connected to)
    const peers = [...swarm.connections]
    const event = createMessage(message, true)
    for (const peer of peers) peer.write(JSON.stringify(event))
  }

/**
 * Initializes the networking layer and returns an object containing the core API functions for interacting with the chat swarm
 * @param {Object} [opts] - Configuration options for the Hyperswarm instance
 * @param {string[]} [opts.bootstrap] - A list of bootstrap servers to use for discovering peers
 * @returns {Object} An object containing core API functions and properties
 * @property {Function} createRoom - Creates a new chat room with a randomly generated topic
 * @property {Function} getMemberId - Generates a short identifier for a peer
 * @property {Function} joinRoom - Joins an existing chat room using a topic string
 * @property {Function} sendMessage - Sends a message to all connected peers
 * @property {Hyperswarm} swarm - The underlying Hyperswarm instance
 * @property {string} version - The version of the BareChat application
 * @example
 * const backend = getBackend({ bootstrap: ['192.168.0.123:55688'] });
 * const room = await backend.createRoom();
 * backend.sendMessage("Hello world!");
 */
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
