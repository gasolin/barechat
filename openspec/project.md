# Project Context

## Purpose
BareChat is an anonymous, peer-to-peer chat application that enables users to create and join chat rooms without requiring any central server, using distributed networking technology for fully decentralized communication. The project provides both terminal-based and web-based interfaces for maximum accessibility.

## Monorepo Structure
This is a Bun-based monorepo containing:
- **packages/cli**: Terminal-based BareChat application
- **packages/web**: Web-based interface with WebSocket bridge
- **packages/core**: Shared P2P networking logic and core chat functionality
- **packages/desktop**: Pear-based desktop application (P2P-first)
- **packages/rpc**: Terminal-to-terminal communication using bare-rpc
- **packages/ui**: (Future) Shared UI components

## Tech Stack

### Runtime & Build
- **Package Manager**: Bun (monorepo management, bundling, development)
- **CLI Runtime**: Bare (JavaScript runtime for embedded systems)
- **Desktop Runtime**: Pear (P2P-first runtime for desktop)
- **Web Runtime**: Browser ES Modules
- **Build System**: Bun workspaces and scripts

### Core Technologies
- **Networking**: Hyperswarm (P2P network discovery and connections)
- **Cryptography**: Hypercore-crypto (portable cryptographic primitives)
- **Real-time**: WebSocket (web-to-P2P bridge)
- **Buffer Operations**: b4a (buffer-to-string conversions)
- **Core Package**: barechat-core (shared P2P networking functionality)

### CLI Package
- **Terminal Interface**: Bare-readline, Bare-tty
- **File System**: Bare-fs, Bare-path
- **Build Tools**: ShellJS

### Web Package
- **UI Framework**: Vanilla JavaScript with DOM manipulation
- **WebSocket**: ws library for server implementation
- **Development**: Hot reload and development server

## Project Conventions

### Code Style (All Packages)
- ES Modules syntax throughout (`import`/`export`)
- JSDoc comments for all public APIs with detailed examples
- camelCase for function and variable names
- PascalCase for classes
- Descriptive function names that clearly indicate purpose
- Comprehensive error handling with try-catch blocks
- Console logging with prefixed categories: `[info]`, `[error]`

### Monorepo Conventions
- **Workspace Management**: Bun workspaces with shared dependencies
- **Versioning**: Independent package versions with coordinated releases
- **Cross-Package Dependencies**: Local imports using workspace protocol
- **Development**: Root-level scripts for common operations
- **Publishing**: Individual package publishing to NPM

### Architecture Patterns
- **Modular Design**: Clear separation between CLI, web, and shared logic
- **Event-Driven**: Hyperswarm event handling for P2P communication
- **Bridge Pattern**: WebSocket server bridging web clients to P2P network
- **Factory Pattern**: Configurable instances for different environments
- **Observer Pattern**: Event listeners for real-time updates

### Testing Strategy
- Manual testing through terminal and web interfaces
- Integration testing between CLI and web clients
- Cross-package compatibility testing
- API documentation generation using JSDoc-to-markdown
- Future: Automated test framework implementation

### Git Workflow
- Standard Git workflow with conventional commits
- Version management through individual package.json files
- NPM publishing for distribution
- MIT License for open source distribution

## Domain Context

### P2P Networking Concepts
- **Swarm**: Collection of peers connected through Hyperswarm
- **Topic**: 64-character hex hash identifying a chat room (SHA256 of room name or random)
- **Peer**: Individual participant in the network identified by public key
- **Bootstrap Servers**: Optional servers for peer discovery (can operate without them)

### Chat Protocol
- Messages are JSON-encoded with timestamp, content, and metadata
- Each peer gets a 6-character hex identifier derived from public key
- Rooms are created implicitly when first peer joins a topic
- Fully decentralized - any peer can host or join any room

### File Storage
- Optional chat logging to text files
- Timestamped entries with member IDs
- Session-based logging with start/end markers

## Important Constraints

### Technical Constraints
- **CLI Package**: Must run on Bare runtime (not Node.js), requires Bare runtime version > 1.21
- **Web Package**: Requires WebSocket bridge server, browser security restrictions
- **Network**: No persistent server infrastructure (except optional WebSocket bridge)
- **Messaging**: Limited to text-based messaging
- **Compatibility**: Cross-platform compatibility (CLI and web)

### Performance Constraints
- **CLI**: Minimal memory footprint for embedded systems
- **Web**: Efficient DOM updates and WebSocket communication
- **Network**: Efficient peer discovery and connection management
- **Latency**: Fast message propagation across small groups

### Security Constraints
- **Anonymity**: Anonymous by design (no user authentication)
- **Encryption**: End-to-end encryption through Hyperswarm
- **Privacy**: No central data collection or storage
- **Identification**: Peer public keys used for identification only
- **Web Security**: Secure WebSocket connections (WSS for production)

## External Dependencies

### Core Package Dependencies
- **barechat-core**: Shared P2P networking and chat functionality
- **hyperswarm**: P2P networking and peer discovery (via core package)
- **hypercore-crypto**: Cryptographic primitives for key generation (via core package)
- **b4a**: Buffer utilities for data conversion (via core package)

### CLI Package Dependencies
- **barechat-core**: Core P2P networking functionality
- **shelljs**: Cross-platform shell command execution
- **bare-fs**: File system operations
- **bare-path**: Path manipulation
- **bare-process**: Process control
- **bare-readline**: Terminal input handling
- **bare-tty**: Terminal control

### RPC Package Dependencies
- **bare-rpc**: RPC protocol implementation for IPC
- **bare-net**: Network socket support for Unix domain sockets
- **bare-fs**: File system operations for socket management
- **bare-path**: Path manipulation for socket paths
- **bare-process**: Process control and signal handling
- **bare-os**: OS utilities for temporary directory access

### Desktop Package Dependencies
- **barechat-core**: Core P2P networking functionality
- **b4a**: Buffer utilities
- **hyperswarm**: P2P networking

### Web Package Dependencies
- **ws**: WebSocket implementation for server-client communication
- **barechat**: CLI package for RPC and helper functionality
- **barechat-core**: Core P2P networking functionality

### Development Tools
- **bun**: Package manager, bundler, and development server
- **jsdoc-to-markdown**: API documentation generation
- **npm**: Package distribution

### Optional External Services
- **Bootstrap Servers**: Optional DHT bootstrap nodes for peer discovery
- **NPM Registry**: For package distribution and updates

## Package-Specific Documentation
- **Core Package**: See `openspec/specs/core/spec.md` for core P2P functionality
- **CLI Package**: See `openspec/specs/cli/spec.md` for CLI-specific details
- **Web Package**: See `openspec/specs/web/spec.md` for web-specific details
- **RPC Package**: See `openspec/specs/rpc/spec.md` and `openspec/specs/rpc/design.md` for RPC-specific details
