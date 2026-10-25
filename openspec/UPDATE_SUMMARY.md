# OpenSpec Update Summary

## Updated Specifications

### Core Package (`openspec/specs/core/spec.md`)
- **Purpose**: Reusable P2P networking and chat logic (`barechat-core`)
- **Requirements**:
  - Core P2P Chat Package (`getBackend`, `getSwarm`, `createMessage`, `strToTopic`, `isHashcode`, `getMemberId`, `joinRoom`, `sendMessage`)

### CLI Package (`openspec/specs/cli/spec.md`)
- **Purpose**: Terminal-based P2P chat interface
- **Requirements**: 6 main requirement categories
  - Peer-to-Peer Chat (via `barechat-core`)
  - Command Line Interface
  - Chat Session Management
  - Optional Chat Logging
  - Cross-Platform Compatibility
  - Local RPC Server and Event Notification

### RPC Package (`openspec/specs/rpc/spec.md` & `openspec/specs/rpc/design.md`)
- **Purpose**: Terminal-to-terminal IPC communication and asynchronous swarm message notifications
- **Requirements**: 3 main requirement categories
  - Terminal-to-Terminal Communication (including server-to-client `RECEIVE_MESSAGE` notifications)
  - Command Line Interface
  - Testing Infrastructure

### Web Package (`openspec/specs/web/spec.md`)
- **Purpose**: Browser-based chat interface with WebSocket bridge
- **Requirements**: 8 main requirement categories
  - Web-Based Chat Access
  - Real-Time Chat Interface
  - Room Management
  - Server Status and Monitoring
  - Cross-Browser Compatibility
  - Integration with Core and CLI Packages
  - RPC Server Integration
  - Development and Deployment

### Desktop & Mobile Design (`openspec/specs/desktop/design.md` & `openspec/specs/mobile/design.md`)
- **Desktop**: Pear-based desktop application integrating directly with `barechat-core`
- **Mobile**: React Native (Expo) + BareKit worklet communicating via `bare-rpc` over `BareKit.IPC`

## Validation Status
✅ All specifications pass strict validation
✅ Proper Purpose and Requirements sections
✅ Correct scenario formatting with #### headers
✅ Each requirement includes at least one scenario

## Documentation Structure
```
openspec/
├── project.md              # Project conventions and context
├── deploy.md               # NPM and Pear deployment guide
├── specs/
│   ├── core/
│   │   └── spec.md         # Core P2P package requirements and scenarios
│   ├── cli/
│   │   └── spec.md         # CLI requirements and scenarios
│   ├── rpc/
│   │   ├── spec.md         # RPC requirements and scenarios
│   │   └── design.md       # RPC technical design decisions
│   ├── web/
│   │   └── spec.md         # Web requirements and scenarios
│   ├── desktop/
│   │   └── design.md       # Pear desktop package design
│   └── mobile/
│       └── design.md       # React Native + BareKit mobile package design
└── packages/
    ├── cli/
    │   ├── project.md       # CLI-specific project context
    │   └── AGENTS.md        # CLI-specific agent instructions
    └── web/
        └── project.md       # Web-specific project context
```

## Recent Changes

### RPC Event Notification for Incoming Swarm Messages (Latest)
- **Updated**: `RPCServer` (`packages/cli/lib/rpc-server.js`) to track active client connections and broadcast incoming P2P swarm messages via `notifyAll` (`RECEIVE_MESSAGE`, command ID `5`)
- **Updated**: `packages/cli/index.js` `appendMessage` to notify RPC clients while preventing loops from `'me'` and `'rpc-client'`
- **Updated**: `RPCClient` (`packages/rpc/lib/rpc.js`) to support `client.onmessage` callback for asynchronous notifications
- **Added**: `packages/cli/test/test-rpc-notify.js` test suite

### Core Package Extraction (`barechat-core`)
- **Created**: `packages/core` (`barechat-core`) with unit tests (`brittle`)
- **Updated**: CLI, Web, Desktop, and Mobile packages to share `barechat-core`

### RPC Server Integration via CLI Package
- **Created**: `packages/cli/lib/exports.js` to export RPC server and other utilities
- **Updated**: Web package to import RPC server from CLI package via `barechat/lib/exports`
- **Removed**: Duplicate RPC server code from web package

## Next Steps
- All specifications are ready for development use
- Can be used as reference for implementing new features
- Provide clear requirements and scenarios for testing
- Support change proposal workflow for future updates
- RPC integration enables new use cases for terminal-web communication