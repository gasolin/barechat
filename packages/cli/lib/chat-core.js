import Hyperswarm from 'hyperswarm'   // Module for P2P networking and connecting peers
import b4a from 'b4a'                 // Module for buffer-to-string and vice-versa conversions
import { createHash } from 'bare-crypto'
import { randomBytes } from 'hypercore-crypto' // Cryptographic functions for generating the key in app
import { version } from '../package.json'

console.log(`BareChat v${version}`)

/**
 * Creates a Hyperswarm instance with optional bootstrap configuration
 * @param {Object} [opts] - Configuration options
 * @param {string[]} [opts.bootstrap] - Array of bootstrap servers for peer discovery
 * @returns {Hyperswarm} Configured Hyperswarm instance
 */
const getSwarm = (opts) => opts?.bootstrap ? new Hyperswarm({ bootstrap: opts.bootstrap }) : new Hyperswarm()

/**
 * Checks if a string is a valid 64-character hexadecimal hash (32 bytes)
 * @param {string} str - The string to validate
 * @returns {boolean} True if the string is a valid 64-character hex string
 * @example
 * isHashcode('eaabffe32a969eeae9a4588a6e088534aae8066db2c055107b9e700fd6033089') // true
 * isHashcode('hello world') // false
 * isHashcode('abc123') // false (too short)
 */
const isHashcode = (str) => {
  if (typeof str !== 'string') return false
  if (str.length !== 64) return false
  return /^[0-9a-fA-F]{64}$/.test(str)
}

/**
 * Converts a string to a topic buffer. If the string is already a valid hashcode,
 * returns it as-is. Otherwise, creates a SHA256 hash of the string.
 * @param {string} topicStr - The topic string to convert
 * @returns {string} A 64-character hex string representing the topic
 * @example
 * // Using an existing hash
 * strToTopic('eaabffe32a969eeae9a4588a6e088534aae8066db2c055107b9e700fd6033089')
 * // Returns: 'eaabffe32a969eeae9a4588a6e088534aae8066db2c055107b9e700fd6033089'
 *
 * // Converting a readable string
 * strToTopic('my-chat-room')
 * // Returns: SHA256 hash of 'my-chat-room' as hex string
 */
const strToTopic = (topicStr) => isHashcode(topicStr) ? topicStr : createHash('sha256').update(topicStr).digest('hex')

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
 * Joins or creates a chat room for the specified topic
 * @param {Hyperswarm} swarm - The Hyperswarm instance to use
 * @returns {Function} An async function that joins/creates a room
 */
const joinRoom = swarm =>
  /**
   * Joins an existing chat room or creates a new one. If no topic is provided, generates a random topic.
   * In P2P networks, joining a topic effectively creates it if it doesn't exist.
   * @param {string} [topicStr] - Optional topic string (can be human-readable text, hex-encoded hash, or omitted for random)
   * @returns {Promise<{done: boolean, topic: string}>} Promise resolving to join/create result
   * @property {boolean} done - Indicates if the swarm joining process is complete
   * @property {string} topic - The hex-encoded topic of the joined/created room, or empty string/'err' on error
   * @example
   * const { joinRoom } = getBackend();
   *
   * // Create room with random topic
   * const randomRoom = await joinRoom();
   * console.log("Joined/created random room:", randomRoom.topic);
   *
   * // Join/create room with human-readable name
   * const namedRoom = await joinRoom('general-chat');
   * console.log("Joined/created named room:", namedRoom.topic);
   *
   * // Join/create room with hex-encoded topic
   * const hashRoom = await joinRoom('a1b2c35fbeb452bc900c5a1c00306e52319a3159317312f54fe5a246d634f51a');
   *
   */
  async (topicStr) => {
    try {
      let topicBuffer
      let topic

      if (topicStr) {
        // Use provided topic string, convert to proper hash format
        topic = strToTopic(topicStr)
        topicBuffer = b4a.from(topic, 'hex')
      } else {
        // Generate a new random topic (32 byte string)
        topicBuffer = randomBytes(32)
        topic = b4a.toString(topicBuffer, 'hex')
      }

      // Join the swarm with the topic. Setting both client/server to true means that this app can act as both.
      const discovery = swarm.join(topicBuffer, { client: true, server: true })
      const done = await discovery.flushed()

      return { done, topic: done ? topic : '' }
    } catch (error) {
      console.warn(`join error: ${error}`)
      return { done: false, topic: `err` }
    }
}

/**
 * Creates a message object.
 *
 * @param {string} msg - The content of the message.
 * @param {boolean} [local=false] - Indicates whether the message is send from a local device.
 *   Defaults to `false`.
 * @returns {object} A message object with a timestamp, message content, local flag, and type.
 * @property {Date} timestamp - The date and time the message was created.
 * @property {string} message - The content of the message.
 * @property {boolean} local - Indicates if the message is send from a local device.
 * @property {string} type - The type of the message. Defaults to `text`
 */
export const createMessage = (msg, local = false, messageType = 'text') => ({
  timestamp: new Date(),
  message: msg,
  local,
  messageType,
})

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
 * @property {Function} createRoom - Creates a new chat room (alias for joinRoom for backward compatibility)
 * @property {Function} getMemberId - Generates a short identifier for a peer
 * @property {Function} joinRoom - Joins an existing chat room using a topic string
 * @property {Function} sendMessage - Sends a message to all connected peers
 * @property {Function} strToTopic - Converts a string to a valid topic hash
 * @property {Function} isHashcode - Validates if a string is a valid 64-character hex hash
 * @property {Hyperswarm} swarm - The underlying Hyperswarm instance
 * @property {string} version - The version of the BareChat package
 * @example
 * const backend = getBackend({ bootstrap: ['192.168.0.123:55688'] });
 * const room = await backend.joinRoom();
 * backend.sendMessage("Hello world!");
 */
export const getBackend = (opts) => {
  const swarm = getSwarm(opts)
  return {
    createRoom: joinRoom(swarm),
    getMemberId,
    joinRoom: joinRoom(swarm),
    sendMessage: sendMessage(swarm),
    strToTopic,
    isHashcode,
    swarm,
    version,
  }
}
