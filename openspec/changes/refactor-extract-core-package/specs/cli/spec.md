## MODIFIED Requirements
### Requirement: Peer-to-Peer Chat
The system SHALL provide anonymous, peer-to-peer chat functionality through a terminal interface using the core package for P2P networking.

#### Scenario: Core package integration
- **WHEN** CLI application starts
- **THEN** system imports getBackend from barechat-core package
- **AND** system uses core package for all P2P networking operations
- **AND** system maintains compatibility with existing CLI interface

#### Scenario: Room creation and joining
- **WHEN** a user starts barechat with a room name
- **THEN** system generates or resolves topic hash for room using core utilities
- **AND** creates Hyperswarm instance through core package
- **AND** begins listening for peer connections on that topic

#### Scenario: Message sending and receiving
- **WHEN** a user types a message and presses enter
- **THEN** system formats message using core createMessage function
- **AND** broadcasts message through core sendMessage function
- **AND** displays message in local chat interface
- **AND** displays received messages from other peers in real-time

#### Scenario: Peer identification
- **WHEN** a peer connects to chat room
- **THEN** system generates identifier using core getMemberId function
- **AND** displays connection notifications with the peer ID
- **AND** maintains a list of active peers in session

#### Scenario: Anonymous participation
- **WHEN** users participate in chat rooms
- **THEN** core package handles all cryptographic operations
- **AND** only public keys are used for identification through core utilities
- **AND** all communication remains end-to-end encrypted through core package