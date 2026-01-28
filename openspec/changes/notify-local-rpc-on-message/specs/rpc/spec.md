## MODIFIED Requirements

### Requirement: Terminal-to-Terminal Communication
The system SHALL provide bi-directional RPC-based communication between terminal processes using Unix domain sockets, supporting both request-response commands and asynchronous server-to-client notifications.

#### Scenario: Server starts and listens
- **WHEN** a user starts the RPC server
- **THEN** the server creates a Unix socket at the temporary directory path
- **AND** the server begins listening for client connections
- **AND** the server logs the socket path for client reference

#### Scenario: Client connects to server
- **WHEN** a client initiates connection to the RPC server
- **THEN** the client establishes a socket connection to the server
- **AND** the client confirms successful connection
- **AND** the server logs the client connection
- **AND** the server maintains the connection to allow for asynchronous notifications

#### Scenario: Message exchange
- **WHEN** a client sends a message through RPC
- **THEN** the server receives and processes the message
- **AND** the server returns a response with success status and echo
- **AND** the client receives and displays the response

#### Scenario: Broadcast communication
- **WHEN** a client broadcasts a message
- **THEN** the server receives the broadcast message
- **AND** the server processes the broadcast
- **AND** the server returns confirmation of receipt

#### Scenario: Server notification to client
- **WHEN** the server has data to push to clients (e.g. external swarm message)
- **THEN** the server SHALL send a notification to all currently connected RPC clients
- **AND** the clients SHALL receive and handle the notification asynchronously

#### Scenario: Connection cleanup
- **WHEN** a client disconnects
- **THEN** the server detects the disconnection
- **AND** the server logs the client disconnection
- **AND** the server removes the client from the notification broadcast list
- **AND** the server cleans up socket resources

#### Scenario: Error handling
- **WHEN** a connection error occurs
- **THEN** the system logs the error details
- **AND** the client gracefully handles connection failures
- **AND** the server continues operating for other clients
