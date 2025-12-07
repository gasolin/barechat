## MODIFIED Requirements
### Requirement: Web-Based Chat Access
The system SHALL provide a web-based interface for accessing BareChat P2P rooms through a browser using core package for P2P networking.

#### Scenario: Core package integration
- **WHEN** web application starts
- **THEN** system imports getBackend from barechat-core package
- **AND** system uses core package for all P2P networking operations
- **AND** system maintains compatibility with existing web interface

#### Scenario: Web server startup
- **WHEN** a user starts the barechat-web package
- **THEN** system initializes P2P backend through core package
- **AND** starts HTTP server on configurable port
- **AND** serves web interface at root path
- **AND** initializes WebSocket bridge for P2P communication

#### Scenario: WebSocket bridge connection
- **WHEN** web interface loads
- **THEN** browser establishes WebSocket connection to server
- **AND** server bridges WebSocket messages to core P2P network
- **AND** maintains bidirectional communication for chat messages

#### Scenario: Room creation and joining
- **WHEN** a user enters room name or topic hash
- **THEN** system uses core strToTopic utility for topic generation
- **AND** connects to P2P network through core joinRoom function
- **AND** displays room interface with connection status

#### Scenario: Message composition and sending
- **WHEN** a user types a message and clicks send or presses enter
- **THEN** system sends message through core sendMessage function
- **AND** displays message in local interface immediately
- **AND** clears input field for next message

#### Scenario: Integration with CLI Package
- **WHEN** web and CLI clients participate in the same room
- **THEN** both use core package for P2P networking
- **AND** messages are compatible between platforms
- **AND** peer identification works consistently through core utilities
- **AND** room topics match exactly through core topic management