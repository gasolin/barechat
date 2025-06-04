/**
 * Creates a Hyperswarm instance with optional bootstrap configuration
 * @param [opts] - Configuration options
 * @param [opts.bootstrap] - Array of bootstrap servers for peer discovery
 * @returns Configured Hyperswarm instance
 */
declare function getSwarm(opts?: {
    bootstrap?: string[];
}): Hyperswarm;

/**
 * Checks if a string is a valid 64-character hexadecimal hash (32 bytes)
 * @example
 * isHashcode('eaabffe32a969eeae9a4588a6e088534aae8066db2c055107b9e700fd6033089') // true
 * isHashcode('hello world') // false
 * isHashcode('abc123') // false (too short)
 * @param str - The string to validate
 * @returns True if the string is a valid 64-character hex string
 */
declare function isHashcode(str: string): boolean;

/**
 * Converts a string to a topic buffer. If the string is already a valid hashcode,
 * returns it as-is. Otherwise, creates a SHA256 hash of the string.
 * @example
 * // Using an existing hash
 * strToTopic('eaabffe32a969eeae9a4588a6e088534aae8066db2c055107b9e700fd6033089')
 * // Returns: 'eaabffe32a969eeae9a4588a6e088534aae8066db2c055107b9e700fd6033089'
 *
 * // Converting a readable string
 * strToTopic('my-chat-room')
 * // Returns: SHA256 hash of 'my-chat-room' as hex string
 * @param topicStr - The topic string to convert
 * @returns A 64-character hex string representing the topic
 */
declare function strToTopic(topicStr: string): string;

/**
 * Generates a short, human-readable identifier for a peer based on their remote public key
 * @example
 * swarm.on('connection', (peer) => {
 *   const memberId = getMemberId(peer);
 *   console.log("New peer connected with ID:", memberId);
 * });
 * @param peer - The peer object from the Hyperswarm connection
 * @returns A 6-character hex string representing the member ID, or 'invalid' if the peer object is not valid
 */
declare function getMemberId(peer: any): string;

/**
 * Joins or creates a chat room for the specified topic
 * @param swarm - The Hyperswarm instance to use
 * @returns An async function that joins/creates a room
 */
declare function joinRoom(swarm: Hyperswarm): (...params: any[]) => any;

/**
 * Sends a message to all peers currently connected in the swarm
 * @param swarm - The Hyperswarm instance to use
 * @returns A function that sends messages
 */
declare function sendMessage(swarm: Hyperswarm): (...params: any[]) => any;

/**
 * Initializes the networking layer and returns an object containing the core API functions for interacting with the chat swarm
 * @example
 * const backend = getBackend({ bootstrap: ['192.168.0.123:55688'] });
 * const room = await backend.joinRoom();
 * backend.sendMessage("Hello world!");
 * @property createRoom - Creates a new chat room (alias for joinRoom for backward compatibility)
 * @property getMemberId - Generates a short identifier for a peer
 * @property joinRoom - Joins an existing chat room using a topic string
 * @property sendMessage - Sends a message to all connected peers
 * @property strToTopic - Converts a string to a valid topic hash
 * @property isHashcode - Validates if a string is a valid 64-character hex hash
 * @property swarm - The underlying Hyperswarm instance
 * @property version - The version of the BareChat application
 */
declare const getBackend: {
    createRoom: (...params: any[]) => any;
    getMemberId: (...params: any[]) => any;
    joinRoom: (...params: any[]) => any;
    sendMessage: (...params: any[]) => any;
    strToTopic: (...params: any[]) => any;
    isHashcode: (...params: any[]) => any;
    swarm: Hyperswarm;
    version: string;
};

