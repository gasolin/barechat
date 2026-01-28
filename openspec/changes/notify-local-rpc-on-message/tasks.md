## 1. RPC Server Enhancements

- [x] 1.1 Update `RPCServer` class to maintain a `Set` of active RPC connections.
- [x] 1.2 Modify `net.createServer` to add new RPC instances to the active set on connection.
- [x] 1.3 Ensure RPC instances are removed from the set on `socket.on('close')` and `socket.on('error')`.
- [x] 1.4 Implement a `notifyAll(message)` method in `RPCServer` to broadcast messages using command `API_RECEIVE_MESSAGE` (5).

## 2. CLI Integration and Loop Prevention

- [x] 2.1 Update `packages/cli/index.js` to trigger `rpcServer.notifyAll` within the `appendMessage` function.
- [x] 2.2 Implement filtering logic in `appendMessage` to exclude messages where `memberId` is `'me'` or `'rpc-client'`.
- [x] 2.3 Verify that `rpc Server` instance is properly passed to the backend or handler where `appendMessage` is defined.

## 3. Client Library and Testing

- [x] 3.1 Update `packages/rpc/lib/rpc.js`'s `RPCClient` to handle incoming asynchronous notifications from the server.
- [x] 3.2 Create a new test script `packages/cli/test/test-rpc-notify.js` to verify that a client receives notifications when a mock swarm message is appended.
- [x] 3.3 Update `packages/cli/lib/api.js` if necessary to include any new constant for the notification command ID.

## 4. Verification

- [x] 4.1 Run manual test with two CLI instances and one RPC client to verify end-to-end notification.
- [x] 4.2 Confirm that sending a message from the RPC client does NOT result in a duplicate notification to itself.
