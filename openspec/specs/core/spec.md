# Core P2P Chat Package

## Purpose
Provide a reusable core package (`barechat-core`) containing P2P networking functionality, room management, topic hashing, and message formatting for BareChat applications across CLI, Web, Desktop, and Mobile platforms.

## Requirements

### Requirement: Core P2P Chat Package
The system SHALL provide a reusable core package containing P2P networking functionality for BareChat applications.

#### Scenario: Core package initialization
- **WHEN** an application imports from `barechat-core` package
- **THEN** the system provides access to `getBackend` and `getSwarm` functions
- **AND** the system provides access to `createMessage`, `isHashcode`, and `strToTopic` functions
- **AND** the system includes all necessary P2P networking dependencies (`hyperswarm`, `hypercore-crypto`, `b4a`)

#### Scenario: Backend factory function
- **WHEN** `getBackend` is called with optional configuration
- **THEN** the system returns a configured backend object
- **AND** the backend includes `swarm`, `getMemberId`, `joinRoom`, `createRoom`, `sendMessage` functions
- **AND** the backend includes `strToTopic` and `isHashcode` utility functions and `version` string
- **AND** the system accepts `bootstrap` configuration for custom DHT nodes

#### Scenario: Message creation utility
- **WHEN** `createMessage` is called with content and optional metadata (`local`, `messageType`)
- **THEN** the system returns a formatted message object
- **AND** the message includes `timestamp`, `message`, `local`, and `messageType` fields

#### Scenario: Topic management utilities
- **WHEN** `strToTopic` is called with a room name or hash
- **THEN** the system returns a valid 64-character hex topic
- **AND** the system generates a SHA256 hash for non-hash room names
- **AND** the system validates and returns existing 64-character hex hashes unchanged

#### Scenario: Hash validation utility
- **WHEN** `isHashcode` is called with a string input
- **THEN** the system validates the 64-character hexadecimal format
- **AND** the system returns a boolean indicating validity

#### Scenario: Peer identification utility
- **WHEN** `getMemberId` is called with a peer object
- **THEN** the system generates a 6-character hex identifier derived from `peer.remotePublicKey`
- **AND** the system returns `'invalid'` when the peer object is null or invalid

#### Scenario: Room joining and creation
- **WHEN** `joinRoom` function is called with an optional topic
- **THEN** the system joins an existing room or creates a new one via Hyperswarm
- **AND** the system generates a random 32-byte topic when none is provided
- **AND** the system awaits `discovery.flushed()` and returns `{ done, topic }`

#### Scenario: Message broadcasting
- **WHEN** `sendMessage` is called with message content
- **THEN** the system formats the message using `createMessage(message, true)`
- **AND** broadcasts the JSON-serialized message to all connected peers in `swarm.connections`
