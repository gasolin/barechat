# Project Context

## Purpose
BareChat is an anonymous, peer-to-peer chat application that enables users to create and join chat rooms without requiring any central server, using distributed networking technology for fully decentralized communication. The project provides terminal-based, web-based, desktop, and mobile interfaces for maximum accessibility.

## Monorepo Structure
This is a Bun-based monorepo containing:
- **packages/core**: Shared P2P networking logic and core chat functionality (`barechat-core`)
- **packages/cli**: Terminal-based BareChat application (`barechat`)
- **packages/web**: Web-based interface with WebSocket bridge (`barechat-web`)
- **packages/desktop**: Pear-based desktop application (`barechat-desktop`)
- **packages/mobile**: React Native (Expo) mobile application with BareKit worklet (`barechat-mobile`)
- **packages/rpc**: Terminal-to-terminal communication using bare-rpc (`barechat-rpc`)

## Tech Stack

### Runtime & Build
- **Package Manager**: Bun (monorepo management, bundling, development)
- **CLI & Web Server Runtime**: Bare (JavaScript runtime for embedded systems)
- **Desktop Runtime**: Pear (P2P-first runtime for desktop)
- **Mobile Runtime**: React Native (Expo) + `react-native-bare-kit` worklet
- **Web UI Runtime**: Browser ES Modules
- **Build System**: Bun workspaces and scripts

### Core Technologies
- **Networking**: Hyperswarm (P2P network discovery and connections)
- **Cryptography**: Hypercore-crypto (portable cryptographic primitives)
- **Real-time**: WebSocket (`bare-ws` web-to-P2P bridge) and `bare-rpc` (local IPC)
- **Buffer Operations**: b4a (buffer-to-string conversions)
- **Core Package**: barechat-core (shared P2P networking functionality)

### CLI Package
- **Terminal Interface**: Bare-readline, Bare-tty
- **File System**: Bare-fs, Bare-path
- **IPC / RPC**: Bare-rpc, Bare-net, Bare-os
- **Build Tools**: ShellJS

### Web Package
- **UI Framework**: Vanilla JavaScript with Notion-inspired DOM UI
- **HTTP & WebSocket**: `bare-http1` and `bare-ws` for server implementation
- **IPC / RPC**: Shared `RPCServer` from `barechat/lib/exports`

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
- Automated unit tests for `barechat-core` using `brittle`
- Automated RPC and notification tests in `packages/cli/test/` and `packages/rpc/test/`
- Integration testing between CLI, Web, and RPC (`packages/web/test/test-rpc-integration.sh`)
- Manual testing across terminal, web, desktop, and mobile interfaces
- API documentation generation using `jsdoc-to-markdown`

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
- **bare-net**: Unix domain socket server for RPC
- **bare-os**: OS utilities for socket paths
- **bare-path**: Path manipulation
- **bare-process**: Process control
- **bare-readline**: Terminal input handling
- **bare-rpc**: RPC protocol implementation for local IPC and notifications
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
- **hypercore-crypto**: Cryptographic primitives
- **hyperswarm**: P2P networking
- **pear-interface**: Pear desktop runtime interface

### Mobile Package Dependencies
- **expo / react-native**: Cross-platform mobile framework
- **react-native-bare-kit**: Bare runtime worklet integration for React Native
- **react-native-gifted-chat**: Mobile chat UI components
- **barechat-core**: Core P2P networking functionality (bundled via `bare-pack`)
- **bare-rpc**: IPC communication between React Native UI and BareKit worklet
- **b4a**: Buffer utilities

### Web Package Dependencies
- **bare-http1**: HTTP server implementation for Bare runtime
- **bare-ws**: WebSocket implementation for server-client communication
- **bare-process**: Process control
- **barechat**: CLI package for shared `RPCServer`, `parseArgs`, and helper functionality
- **barechat-core**: Core P2P networking functionality

### Development Tools
- **bun**: Package manager, bundler, and workspace runner
- **brittle**: Test runner for `barechat-core`
- **jsdoc-to-markdown**: API documentation generation
- **npm**: Package distribution

### Optional External Services
- **Bootstrap Servers**: Optional DHT bootstrap nodes for peer discovery
- **NPM Registry**: For package distribution and updates

## Package-Specific Documentation
- **Core Package**: See `openspec/specs/core/spec.md` for core P2P functionality
- **CLI Package**: See `openspec/specs/cli/spec.md` and `openspec/packages/cli/project.md` for CLI-specific details
- **Web Package**: See `openspec/specs/web/spec.md` and `openspec/packages/web/project.md` for web-specific details
- **Desktop Package**: See `openspec/specs/desktop/design.md` for desktop architecture and design
- **Mobile Package**: See `openspec/specs/mobile/design.md` for mobile architecture and design
- **RPC Package**: See `openspec/specs/rpc/spec.md` and `openspec/specs/rpc/design.md` for RPC-specific details
- **Deployment Guide**: See `openspec/deploy.md` for instructions on publishing packages to NPM
