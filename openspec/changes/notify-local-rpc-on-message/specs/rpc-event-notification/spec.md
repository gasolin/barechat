## ADDED Requirements

### Requirement: RPC Event Notification
The RPC server SHALL notify all connected clients when a new message is received from the P2P swarm.

#### Scenario: Swarm message notification
- **WHEN** a new message is received from the P2P swarm
- **THEN** the RPC server SHALL broadcast this message to all connected RPC clients
- **AND** the notification SHALL contain the sender ID, the topic, and the message content

### Requirement: Loop Prevention
The RPC server MUST NOT notify RPC clients about messages that originated from an RPC client to prevent feedback loops.

#### Scenario: Originator message exclusion
- **WHEN** a message is sent to the P2P swarm from an RPC client
- **THEN** the RPC server SHALL NOT broadcast a notification for this specific message back to RPC clients when it is "processed" or "echoed" locally
