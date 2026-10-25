# Web Package Context

## Purpose
BareChat Web is the browser-based interface for the BareChat P2P chat application. It provides a web-based GUI alternative to the terminal CLI, enabling users to participate in decentralized chat rooms through their web browsers while maintaining the same peer-to-peer networking capabilities.

## Tech Stack
- **Server Runtime**: Bare (JavaScript runtime for embedded systems)
- **Client Runtime**: Browser-based JavaScript (ES Modules)
- **Language**: ES Modules JavaScript
- **Networking**: Hyperswarm via `barechat-core` (P2P network discovery via WebSocket bridge)
- **HTTP & Real-time Communication**: `bare-http1` (HTTP server) and `bare-ws` (WebSocket-to-Hyperswarm bridge)
- **UI Framework**: Vanilla JavaScript with Notion-inspired DOM manipulation
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

### Integration with Core and CLI Packages
- Depends on `barechat-core` for P2P networking capabilities (`getBackend`)
- Depends on `barechat` CLI package (`barechat/lib/exports`) for `parseArgs` and `RPCServer`
- Uses WebSocket bridge (`bare-ws`) to connect browser clients to Hyperswarm
- Shared message protocol and room identification with CLI, Desktop, and Mobile versions
- Supports bidirectional messaging between terminal RPC clients and web interface
- Eliminates code duplication by sharing core P2P logic and RPC server implementation

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
- **barechat-core**: Core P2P networking functionality (`getBackend`)
- **barechat**: CLI package for `parseArgs` and `RPCServer` (`barechat/lib/exports`)
- **bare-http1**: HTTP server implementation for Bare runtime
- **bare-ws**: WebSocket implementation for server-client communication
- **bare-process**: Process control for Bare runtime

### Development Tools
- **bun**: Package manager and bundler
- **bunfig.toml**: Bun configuration for development and build

### Browser APIs
- **WebSocket API**: Real-time communication with server
- **DOM APIs**: UI manipulation and event handling
- **Fetch API**: HTTP requests for server communication
- **LocalStorage**: Optional client-side settings persistence