## Context

The existing `RPCServer` in `barechat-cli` operates on a transient request-response model. While it receives commands from local clients and forwards them to the P2P swarm, it lacks a mechanism to push P2P swarm events back to those local clients. To support real-time local integrations (like GUI updates or system notifications), the server must maintain a list of active connections and broadcast incoming swarm messages to them.

## Goals / Non-Goals

**Goals:**
- Enable `RPCServer` to track multiple concurrent local connections.
- Implement an asynchronous notification mechanism to push swarm messages to connected RPC clients.
- Prevent message loops (messages originating from RPC should not be broadcast back to RPC).
- Ensure graceful handling of client disconnections to prevent memory leaks.

**Non-Goals:**
- Implementing a full Pub/Sub system with topics (broadcast to all handles it).
- Modifying the P2P protocol itself.
- Persisting RPC peer states across CLI restarts.

## Decisions

### 1. Active Client Tracking
**Decision**: Maintain a `Set` of active `BareRPC` instances within the `RPCServer` class.
**Rationale**: Using a `Set` allows for efficient addition and removal of connection objects. Since `bare-rpc` is built on streams, we will store the RPC wrapper to easily send notifications.
**Alternatives**:
- Storing raw `net.Socket` objects: Rejected, as we'd have to wrap them in `bare-rpc` logic every time we want to send a message.

### 2. Notification Protocol
**Decision**: Use a new command ID (`API_RECEIVE_MESSAGE` or similar) for pushed notifications.
**Rationale**: Modern RPC patterns distinguish between requests (expecting a reply) and notifications (fire-and-forget). `bare-rpc` supports sending data without a specific request context if managed correctly, or we can use a "pushed" request format. We'll use a specific command ID for events.

### 3. Loop Prevention
**Decision**: Filter messages in `appendMessage` based on `memberId`.
**Rationale**: Messages from local CLI are `'me'`, and messages from RPC are `'rpc-client'`. By only triggering RPC notifications when `memberId` is neither of these, we ensure only truly "external" messages are pushed to the local system.

### 4. Integration Point
**Decision**: Inject the notification trigger into the `appendMessage` function in `index.js`.
**Rationale**: `appendMessage` is already the central bottleneck for all incoming messages (local and remote) that need to be "displayed" or "stored". It is the most logical place to add "notify" logic.

## Risks / Trade-offs

- **Memory Leak** → [Mitigation] Wrapped sockets MUST be removed from the tracking `Set` on both `close` and `error` events.
- **Protocol Incompatibility** → [Mitigation] Update `packages/rpc` library to handle the new asynchronous message event so existing clients don't crash on unexpected data.
- **Race Condition** → [Mitigation] Ensure `JOIN` events or initialization messages are handled correctly if a client connects while a swarm message is in flight.
