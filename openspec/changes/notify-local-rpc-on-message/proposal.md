## Why

Currently, when `barechat-cli` receives a new message from the P2P swarm, it only prints it to the terminal and optionally logs it to a file. Other local applications (like a GUI or notification helper) connecting via RPC have no way of being notified about these incoming messages unless they poll or the CLI is modified to push these events.

This change enables `barechat-cli` to act as an event source, notifying connected RPC clients whenever a message arrives from the swarm, allowing for real-time local integration.

## What Changes

- **Message Forwarding**: Update the swarm message handler to forward received messages to all connected RPC clients.
- **Loop Prevention**: Ensure that messages originating from a local RPC client (which are sent to the swarm) are not sent back to RPC clients as "new" incoming messages.
- **RPC Notification Protocol**: Define a way for the RPC server to "push" data to clients or for clients to "subscribe" to message events.
- **Client Handling**: Update the RPC server to track multiple connected clients and broadcast incoming swarm messages to them.

## Capabilities

### New Capabilities
- `rpc-event-notification`: Defines the mechanism for the RPC server to notify connected clients about external events (like incoming chat messages).

### Modified Capabilities
- `rpc`: Update the RPC specification to include event/notification support alongside the existing request-response pattern.

## Impact

- `packages/cli/lib/rpc-server.js`: Major logic changes to handle broadcasting messages to connected sockets.
- `packages/cli/index.js`: Integration logic to trigger RPC notifications when `swarm.on('data')` is called.
- `packages/rpc`: Update tests and client libraries to demonstrate receiving notifications.
