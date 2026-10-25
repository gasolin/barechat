# barechat-rpc

Terminal-to-terminal communication using bare-rpc.

## Overview

`barechat-rpc` enables inter-process communication between terminals using Unix domain sockets and the bare-rpc protocol. It provides a simple client-server architecture for sending messages and broadcasting between terminal sessions.

## Features

- 🚀 **Fast IPC**: Unix domain sockets for efficient local communication
- 📡 **Broadcasting**: Send messages to multiple connected clients
- 🔔 **Event Notifications**: Receive real-time notifications when new P2P swarm messages arrive
- 🔌 **Simple API**: Easy-to-use client-server interface
- 🛡️ **Type-safe**: Schema-based RPC with validation
- 🔧 **Bare Runtime**: Built on `bare-rpc` and Bare runtime modules

## Installation

```bash
npm install barechat-rpc
```

## Quick Start

### Basic Usage

Start a server in Terminal 1:
```bash
npx barechat-rpc server
```

Send messages from Terminal 2:
```bash
npx barechat-rpc client "Hello from terminal!"
```

### Integration with Barechat (Testing on the Same Machine)

When testing multiple `barechat` instances on the **same machine**, keep the RPC server enabled on the first instance and disable it (`--no-rpc`) on the second instance so they don't conflict over `/tmp/barechat-rpc.sock`:

1. Start `barechat` with RPC server enabled (Terminal 1):
   ```bash
   npx barechat soccer
   ```

2. Start a second `barechat` instance with `--no-rpc` (Terminal 2):
   ```bash
   npx barechat --no-rpc soccer
   ```

3. Send messages via RPC client (Terminal 3):
   ```bash
   npx barechat-rpc client "Hello from terminal!"
   ```

Terminal 1 receives the RPC message and broadcasts it over Hyperswarm so both `barechat` instances display the message. Conversely, when Terminal 2 sends a message in the chat room, Terminal 1's RPC server notifies any connected RPC clients via `client.onmessage`.

## Programmatic Usage

### Server Setup

```javascript
import { RPCServer } from 'barechat-rpc'

const server = new RPCServer()
server.start()

// Graceful shutdown
process.on('SIGINT', () => {
  server.stop()
  process.exit(0)
})
```

### Client Implementation

```javascript
import { RPCClient } from 'barechat-rpc'

const client = new RPCClient()

// Optional: listen for incoming P2P swarm message notifications from the server
client.onmessage = (data) => {
  console.log(`[${data.memberId}] ${data.message}`)
}

try {
  await client.connect()
  
  // Send a message and get response
  const response = await client.sendMessage("Hello!")
  console.log('Server response:', response)
  
  // Broadcast to all connected clients
  await client.broadcast("Broadcast message")
  
} catch (error) {
  console.error('Connection failed:', error.message)
} finally {
  client.disconnect()
}
```

## API Reference

### RPCServer

| Method | Description | Returns |
|--------|-------------|---------|
| `constructor()` | Create a new RPC server instance | `RPCServer` |
| `start()` | Start listening for client connections on Unix socket | `void` |
| `stop()` | Stop the server and close all connections | `void` |

### RPCClient

| Method / Property | Description | Returns / Type |
|--------|-------------|---------|
| `constructor()` | Create a new RPC client instance | `RPCClient` |
| `connect()` | Connect to the RPC server | `Promise<void>` |
| `sendMessage(message)` | Send a message and get server response | `Promise<object>` |
| `broadcast(message)` | Broadcast a message to all clients | `Promise<object>` |
| `onmessage` | Callback triggered when server pushes a `RECEIVE_MESSAGE` (command `5`) notification | `((data: { memberId: string, message: string }) => void) \| null` |
| `disconnect()` | Close the connection | `void` |

### Response & Notification Format

```javascript
// sendMessage response (Command 1)
{
  success: true,
  echo: "your message"
}

// broadcast response (Command 2)
{
  received: true
}

// onmessage notification payload (Command 5)
{
  memberId: "a1b2c3",
  message: "incoming message from P2P swarm"
}
```

## Configuration

The RPC server uses a Unix domain socket located at:
```
/tmp/barechat-rpc.sock
```

You can import the socket path for custom configurations:

```javascript
import { SOCKET_PATH } from 'barechat-rpc'
console.log('Socket path:', SOCKET_PATH)
```

## Testing

### Automated Tests

Run the comprehensive test suite:
```bash
chmod +x test/example.sh
./test/example.sh
```

The test script provides:
1. **Server Mode** - Start RPC server with logging
2. **Automated Client Tests** - Send multiple test messages
3. **Interactive Client** - Send custom messages manually
4. **Full Integration Test** - Automated server + client workflow

### Manual Testing

Start the server in one terminal:
```bash
bare index.js server
```

Test with client in another terminal:
```bash
bare index.js client "Test message"
```

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `bare-rpc` | ^1.3.8 | RPC protocol implementation |
| `bare-net` | ^2.3.3 | Network socket support |
| `bare-fs` | ^4.8.4 | File system operations |
| `bare-path` | ^3.1.2 | Path utilities |
| `bare-process` | ^4.5.1 | Process management |
| `bare-os` | ^3.9.3 | OS utilities |

## Error Handling

The library includes comprehensive error handling:

- **Connection Errors**: Failed server connections throw descriptive errors
- **Socket Errors**: Network issues are logged and handled gracefully
- **Protocol Errors**: Invalid RPC requests are rejected with proper error messages

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.
