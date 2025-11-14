# Project Context

## Purpose
BareChat is an anonymous, peer-to-peer chat application that runs in the terminal. It enables users to create and join chat rooms without requiring any central server, using distributed networking technology for fully decentralized communication.

## Tech Stack
- **Runtime**: Bare (JavaScript runtime for embedded systems)
- **Language**: ES Modules JavaScript
- **Networking**: Hyperswarm (P2P network discovery and connections)
- **Cryptography**: Hypercore-crypto, Bare-crypto (for key generation and hashing)
- **Terminal Interface**: Bare-readline, Bare-tty (for command-line interaction)
- **File System**: Bare-fs, Bare-path (for file operations and logging)
- **Buffer Operations**: b4a (buffer-to-string conversions)
- **Build Tools**: ShellJS (for build scripts and CLI operations)

## Project Conventions

### Code Style
- ES Modules syntax throughout (`import`/`export`)
- JSDoc comments for all public APIs with detailed examples
- camelCase for function and variable names
- PascalCase for classes
- Descriptive function names that clearly indicate purpose
- Comprehensive error handling with try-catch blocks
- Console logging with prefixed categories: `[info]`, `[error]`

### Architecture Patterns
- **Modular Design**: Core functionality separated into `chat-core.js`, helper utilities in `helper.js`
- **Functional Programming**: Heavy use of higher-order functions and closures
- **Event-Driven**: Hyperswarm event handling for peer connections and messages
- **Factory Pattern**: `getBackend()` function creates configured instances
- **Command Pattern**: CLI argument parsing and command execution
- **Observer Pattern**: Event listeners for swarm updates and peer connections

### Testing Strategy
- Manual testing through terminal interactions
- Integration testing between multiple terminal instances
- API documentation generation using JSDoc-to-markdown
- No automated test framework currently implemented

### Git Workflow
- Standard Git workflow with conventional commits
- Version management through package.json
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
- Must run on Bare runtime (not Node.js)
- Requires Bare runtime version > 1.21
- Terminal-based interface only (no GUI)
- No persistent server infrastructure
- Limited to text-based messaging

### Performance Constraints
- Minimal memory footprint for embedded systems
- Efficient peer discovery and connection management
- Fast message propagation across small groups

### Security Constraints
- Anonymous by design (no user authentication)
- End-to-end encryption through Hyperswarm
- No central data collection or storage
- Peer public keys used for identification only

## External Dependencies

### Core Dependencies
- **hyperswarm**: P2P networking and peer discovery
- **hypercore-crypto**: Cryptographic primitives for key generation
- **b4a**: Buffer utilities for data conversion
- **shelljs**: Cross-platform shell command execution

### Bare Runtime Modules
- **bare-crypto**: Cryptographic functions
- **bare-fs**: File system operations
- **bare-path**: Path manipulation
- **bare-process**: Process control
- **bare-readline**: Terminal input handling
- **bare-tty**: Terminal control

### Development Tools
- **jsdoc-to-markdown**: API documentation generation
- **npm**: Package management and distribution

### Optional External Services
- **Bootstrap Servers**: Optional DHT bootstrap nodes for peer discovery
- **NPM Registry**: For package distribution and updates
