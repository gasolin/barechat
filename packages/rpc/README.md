# barechat-rpc

Terminal-to-terminal communication using bare-rpc.

## Overview

`barechat-rpc` enables inter-process communication between terminals using Unix domain sockets and the bare-rpc protocol. It provides a simple client-server architecture for sending messages and broadcasting between terminal sessions.

## Features

- 🚀 **Fast IPC**: Unix domain sockets for efficient local communication
- 📡 **Broadcasting**: Send messages to multiple connected clients
- 🔌 **Simple API**: Easy-to-use client-server interface
- 🛡️ **Type-safe**: Schema-based RPC with validation
- 🔧 **Cross-platform**: Works on Unix-like systems with Node.js/Bun

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

### Integration with Barechat

Start barechat on Device A (Terminal 1):
```bash
npx barechat soccer
```

Start barechat on Device B (Terminal 1):
```bash
npx barechat soccer
```

Send messages from Device A (Terminal 2):
```bash
npx barechat-rpc client "Hello from terminal!"
```

Both barechat instances will receive the broadcast message.

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

| Method | Description | Returns |
|--------|-------------|---------|
| `constructor()` | Create a new RPC client instance | `RPCClient` |
| `connect()` | Connect to the RPC server | `Promise<void>` |
| `sendMessage(message)` | Send a message and get server response | `Promise<object>` |
| `broadcast(message)` | Broadcast a message to all clients | `Promise<object>` |
| `disconnect()` | Close the connection | `void` |

### Response Format

```javascript
// sendMessage response
{
  success: true,
  echo: "your message"
}

// broadcast response
{
  received: true
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
node -e "import('./lib/rpc.js').then(m => new m.RPCServer().start())"
```

Test with client in another terminal:
```bash
node -e "
import('./lib/rpc.js').then(async m => {
  const client = new m.RPCClient()
  await client.connect()
  await client.sendMessage('Test message')
  client.disconnect()
})
"
```

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `bare-rpc` | ^1.0.0 | RPC protocol implementation |
| `bare-net` | ^1.0.0 | Network socket support |
| `bare-fs` | ^2.0.0 | File system operations |
| `bare-path` | ^2.0.0 | Path utilities |
| `bare-process` | ^4.2.1 | Process management |
| `bare-os` | ^2.0.0 | OS utilities |

## Error Handling

The library includes comprehensive error handling:

- **Connection Errors**: Failed server connections throw descriptive errors
- **Socket Errors**: Network issues are logged and handled gracefully
- **Protocol Errors**: Invalid RPC requests are rejected with proper error messages

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.
