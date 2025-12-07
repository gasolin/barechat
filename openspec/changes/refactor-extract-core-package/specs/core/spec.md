## ADDED Requirements
### Requirement: Core P2P Chat Package
The system SHALL provide a reusable core package containing P2P networking functionality for BareChat applications.

#### Scenario: Core package initialization
- **WHEN** an application imports from barechat-core package
- **THEN** system provides access to getBackend function
- **AND** system provides access to createMessage function
- **AND** system includes all necessary P2P networking dependencies

#### Scenario: Backend factory function
- **WHEN** getBackend is called with optional configuration
- **THEN** system returns configured backend object
- **AND** backend includes swarm, getMemberId, joinRoom, sendMessage functions
- **AND** backend includes strToTopic and isHashcode utility functions
- **AND** system accepts bootstrap configuration for custom DHT nodes

#### Scenario: Message creation utility
- **WHEN** createMessage is called with content and metadata
- **THEN** system returns formatted message object
- **AND** message includes timestamp, content, and local flag
- **AND** system supports custom message types

#### Scenario: Topic management utilities
- **WHEN** strToTopic is called with room name or hash
- **THEN** system returns valid 64-character hex topic
- **AND** system generates SHA256 hash for room names
- **AND** system validates and returns existing hashes unchanged

#### Scenario: Hash validation utility
- **WHEN** isHashcode is called with string input
- **THEN** system validates 64-character hex format
- **AND** system returns boolean indicating validity
- **AND** system handles edge cases appropriately

#### Scenario: Peer identification utility
- **WHEN** getMemberId is called with peer object
- **THEN** system generates 6-character hex identifier
- **AND** system derives ID from peer public key
- **AND** system handles invalid peer objects gracefully

#### Scenario: Room joining and creation
- **WHEN** joinRoom function is called with optional topic
- **THEN** system joins existing room or creates new one
- **AND** system generates random topic when none provided
- **AND** system returns join status and topic information

#### Scenario: Message broadcasting
- **WHEN** sendMessage is called with message content
- **THEN** system broadcasts to all connected peers
- **AND** system formats message with proper metadata
- **AND** system handles connection errors gracefully

#### Scenario: Swarm management
- **WHEN** backend is initialized
- **THEN** system creates Hyperswarm instance
- **AND** system configures event handlers for connections
- **AND** system supports custom bootstrap servers

#### Scenario: Package independence
- **WHEN** barechat-core is installed as dependency
- **THEN** system includes all required dependencies
- **AND** system operates independently of other packages
- **AND** system maintains version compatibility across interfaces