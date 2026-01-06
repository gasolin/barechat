/* global Bare */
const RPC = require('bare-rpc')
const b4a = require('b4a')


/**
 * Shared RPC definitions and helper class for BareChat Mobile
 * used to communicate between React Native UI and BareKit Worklet
 */

const COMMANDS = {
    JOIN_ROOM: 1,
    SEND_MESSAGE: 2,
    ON_MESSAGE: 3,
    GET_MEMBER_ID: 4
}

class ChatRPC {
    constructor(stream, onrequest) {
        this.rpc = new RPC(stream, onrequest)
    }

    /**
     * Send an RPC request
     * @param {number} command - Command ID from COMMANDS
     * @param {any} data - Data to send (will be JSON stringified if not a string/buffer)
     * @returns {Promise<string>} Response from the other side
     */
    request(command, data) {
        const req = this.rpc.request(command)
        if (data === undefined) data = null
        const payload = (typeof data === 'string' || data instanceof Uint8Array) ? data : JSON.stringify(data)
        req.send(payload)
        return req.reply('utf8')
    }

    /**
     * Helper to respond to a request
     * @param {Object} req - The incoming request object
     * @param {any} data - Data to reply with
     */
    static reply(req, data) {
        const payload = (typeof data === 'string' || data instanceof Uint8Array) ? data : JSON.stringify(data)
        req.reply(payload)
    }

    // --- Convenience methods for the Client (UI side) ---

    async joinRoom(topic) {
        const res = await this.request(COMMANDS.JOIN_ROOM, topic)
        return JSON.parse(res)
    }

    async sendMessage(message) {
        const res = await this.request(COMMANDS.SEND_MESSAGE, message)
        return JSON.parse(res)
    }

    async getMemberId(peerKey) {
        const res = await this.request(COMMANDS.GET_MEMBER_ID, peerKey)
        return JSON.parse(res)
    }

    // --- Convenience methods for the Server (Worklet side) ---

    /**
     * Notify the UI about a new message
     * @param {Object} message - The message object
     */
    async emitMessage(message) {
        const res = await this.request(COMMANDS.ON_MESSAGE, message)
        return JSON.parse(res)
    }
}

module.exports = {
    ChatRPC,
    COMMANDS
}
