# barechat-rpc

Terminal-to-terminal communication using bare-rpc.

## Overview

`barechat-rpc` enables inter-process communication between terminals using Unix domain sockets and the bare-rpc protocol. It provides a simple client-server architecture for sending messages and broadcasting between terminal sessions.

## Installation

```bash
npm install barechat-rpc
```

## Usage

### Basic Usage

Start a server in Terminal 1:
```bash
barechat-rpc server
```

Send messages from Terminal 2:
```bash
barechat-rpc client "Hello from terminal!"
```

### Programmatic Usage

```javascript
import { RPCServer, RPCClient } from 'barechat-rpc'

// Server
const server = new RPCServer()
server.start()

// Client
const client = new RPCClient()
await client.connect()
const result = await client.sendMessage("Hello!")
client.disconnect()
```

## API

### RPCServer

- `constructor()` - Create a new RPC server instance
- `start()` - Start listening for client connections
- `stop()` - Stop the server and close all connections

### RPCClient

- `constructor()` - Create a new RPC client instance
- `connect()` - Connect to the RPC server
- `sendMessage(message)` - Send a message and get response
- `broadcast(message)` - Broadcast a message
- `disconnect()` - Close the connection

## Testing

Run the test script:
```bash
chmod +x example.sh
./example.sh
```

The test script provides:
1. Server mode - Start RPC server
2. Automated client tests - Send multiple test messages
3. Interactive client - Send custom messages
4. Full test - Automated server + client testing

## Dependencies

- `bare-rpc` - RPC protocol implementation
- `bare-net` - Network socket support
- `bare-fs` - File system operations
- `bare-path` - Path utilities
- `bare-process` - Process management
- `bare-os` - OS utilities

## License

MIT