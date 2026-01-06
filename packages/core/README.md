# BareChat Core

Core chat functionality for BareChat - reusable P2P networking components.

## Installation

```bash
npm install barechat-core
```

## Testing

Run the tests using `brittle`:

```bash
npm test
```

## Usage

```javascript
import { getBackend } from 'barechat-core'

// Initialize the chat backend
const backend = getBackend({ bootstrap: ['192.168.0.123:55688'] })

// Join or create a chat room
const room = await backend.joinRoom('my-chat-room')

// Send a message
backend.sendMessage('Hello everyone!')

// Listen for incoming messages
backend.swarm.on('connection', (peer) => {
  const memberId = backend.getMemberId(peer)
  console.log(`New peer ${memberId} joined`)
  
  peer.on('data', (rawData) => {
    const event = JSON.parse(rawData)
    console.log(`Message from ${memberId}:`, event.message)
  })
})
```

## API

### `getBackend(opts)`

Initializes the networking layer and returns an object containing the core API functions.

**Parameters:**
- `opts` (Object, optional): Configuration options for the Hyperswarm instance
  - `bootstrap` (string[], optional): A list of bootstrap servers to use for discovering peers

**Returns:**
- `createRoom`: Function to create a new chat room
- `getMemberId`: Function to generate a short identifier for a peer
- `joinRoom`: Function to join an existing chat room using a topic string
- `sendMessage`: Function to send a message to all connected peers
- `strToTopic`: Function to convert a string to a valid topic hash
- `isHashcode`: Function to validate if a string is a valid 64-character hex hash
- `swarm`: The underlying Hyperswarm instance
- `version`: The version of the BareChat package

### `createMessage(msg, local, messageType)`

Creates a message object with timestamp and metadata.

**Parameters:**
- `msg` (string): The content of the message
- `local` (boolean, optional): Indicates whether the message is sent from a local device
- `messageType` (string, optional): The type of the message (defaults to 'text')

## Using BareChat Core as a Package

To create variant chat experiences, you can import `barechat-core` in your project:

```js
import { getBackend } from 'barechat-core'

const {
  swarm,
  getMemberId,
  createRoom,
  joinRoom,
  sendMessage
} = getBackend()
```

### Example Usage

```javascript
import { getBackend } from 'barechat-core'

// Initialize the chat backend
const backend = getBackend({ bootstrap: ['192.168.0.123:55688'] })

// Join or create a chat room
const room = await backend.joinRoom('my-chat-room')

// Send a message
backend.sendMessage('Hello everyone!')

// Listen for incoming messages
backend.swarm.on('connection', (peer) => {
  const memberId = backend.getMemberId(peer)
  console.log(`New peer ${memberId} joined`)
  
  peer.on('data', (rawData) => {
    const event = JSON.parse(rawData)
    console.log(`Message from ${memberId}:`, event.message)
  })
})
```

For detailed API documentation, see the [API documentation](../../doc/api.md).

## License

MIT