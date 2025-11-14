# Web Package Context

## Purpose
BareChat Web is the browser-based interface for the BareChat P2P chat application. It provides a web-based GUI alternative to the terminal CLI, enabling users to participate in decentralized chat rooms through their web browsers while maintaining the same peer-to-peer networking capabilities.

## Tech Stack
- **Runtime**: Browser-based JavaScript (ES Modules)
- **Language**: ES Modules JavaScript
- **Networking**: Hyperswarm (P2P network discovery via WebSocket bridge)
- **Real-time Communication**: WebSocket (WebSocket-to-Hyperswarm bridge)
- **UI Framework**: Vanilla JavaScript with DOM manipulation
- **Build Tools**: Bun for bundling and development
- **Package Management**: Bun package manager

## Project Conventions

### Code Style
- ES Modules syntax throughout (`import`/`export`)
- JSDoc comments for all public APIs
- camelCase for function and variable names
- PascalCase for classes
- Event-driven architecture for UI updates
- Error handling with try-catch blocks and user feedback

### Architecture Patterns
- **Client-Server Bridge**: Web UI connects to WebSocket server which bridges to Hyperswarm
- **Event-Driven UI**: DOM updates based on WebSocket events and user interactions
- **Modular Components**: Separation of concerns between UI, WebSocket handling, and server logic
- **Observer Pattern**: Event listeners for chat messages, peer connections, and UI state

### Integration with CLI Package
- Depends on `barechat` CLI package for P2P networking capabilities
- Uses WebSocket bridge to connect browser clients to Hyperswarm network
- Shared message protocol and room identification with CLI version

## Domain Context

### Web-Specific Concepts
- **WebSocket Bridge**: Server component that connects web clients to Hyperswarm
- **Session Management**: Browser-based session handling for chat participation
- **Real-time UI**: Live updates of chat messages and peer status
- **Responsive Design**: Adaptable to different screen sizes and devices

### Chat Protocol Compatibility
- Compatible message format with CLI version
- Same room topic identification (64-character hex hashes)
- Peer identification system consistent with CLI
- Maintains anonymous, decentralized nature

## Important Constraints

### Technical Constraints
- Must work through WebSocket bridge (cannot directly connect to Hyperswarm from browser)
- Requires WebSocket server component to be running
- Browser security restrictions (CORS, same-origin policies)
- Limited to browser capabilities (no file system access)

### Performance Constraints
- Efficient DOM updates for smooth chat experience
- Minimal latency in message delivery through WebSocket bridge
- Optimized for multiple concurrent users in same room

### Security Constraints
- Same anonymity guarantees as CLI version
- No persistent user data stored in browser
- Secure WebSocket connections (WSS recommended for production)
- No central data collection beyond WebSocket bridging

## External Dependencies

### Core Dependencies
- **barechat**: CLI package for P2P networking functionality
- **hyperswarm**: P2P networking (via CLI package)
- **ws**: WebSocket implementation for server-client communication

### Development Tools
- **bun**: Package manager and bundler
- **bunfig.toml**: Bun configuration for development and build

### Browser APIs
- **WebSocket API**: Real-time communication with server
- **DOM APIs**: UI manipulation and event handling
- **Fetch API**: HTTP requests for server communication
- **LocalStorage**: Optional client-side settings persistence