# BareChat Monorepo

Anonymous chat anywhere with commandline

## 📦 Packages

This monorepo contains following packages:

### `barechat-core` (packages/core)
Core P2P networking and chat logic shared across BareChat applications.

- **Features**: Hyperswarm management, room creation/joining, message formatting, topic utilities
- **Installation**: `npm i barechat-core` or `bun add barechat-core`
- **Usage**: `import { getBackend } from 'barechat-core'`

### `barechat` (packages/cli)
The main CLI application for BareChat - an anonymous, peer-to-peer chat terminal application.

- **Features**: IRC like anonymous chat, fully p2p, no server required, optional file logging & local RPC server
- **Installation**: `npm i -g barechat` or `bun add -g barechat`
- **Usage**: `barechat` or `barechat <topic-hash>`

### `barechat-web` (packages/web)
Web interface for BareChat - provides a localhost web UI for anonymous P2P chat.

- **Features**: Web-based chat interface, fully p2p, no server required
- **Installation**: `npm i -g barechat-web` or `bun add -g barechat-web`
- **Usage**: `barechat-web` or `barechat-web <topic-hash>`

### `barechat-desktop` (packages/desktop)
Desktop application for BareChat powered by the Pear platform.

- **Features**: Native desktop experience, integrated window controls, direct P2P networking
- **Usage**: `cd packages/desktop && pear run --dev .`

### `barechat-mobile` (packages/mobile)
Mobile application for BareChat built with React Native (Expo) and BareKit.

- **Features**: Native mobile UI (GiftedChat), P2P networking via BareKit worklet and `barechat-core`
- **Usage**: `cd packages/mobile && npm run bundle-core && npx expo start`

### `barechat-rpc` (packages/rpc)
Terminal-to-terminal communication using bare-rpc.

- **Features**: Fast IPC over Unix domain sockets, send/broadcast messages and receive swarm notifications
- **Usage**: `npx barechat-rpc client "Hello from terminal!"`

## 🚀 Quick Start

### Prerequisites

Need bare runtime installed through npm. Could install globally using:

```bash
npm i -g bare
```

### Using the CLI

Install the CLI package globally:

```bash
# Using npm
npm i -g barechat

# Using bun (when available)
bun add -g barechat
```

To test this chat app, in one terminal run:

```sh
> barechat
[info] Created new chat room: a1b2c35fbeb452bc900c5a1c00306e52319a3159317312f54fe5a246d634f51a
```

In another terminal use the hashcode received from the first terminal's output:

```sh
> barechat a1b2c35fbeb452bc900c5a1c00306e52319a3159317312f54fe5a246d634f51a
[info] Joined chat room a1b2c35fbeb452bc900c5a1c00306e52319a3159317312f54fe5a246d634f51a
```

## 🛠️ Development

This project uses [Bun](https://bun.sh) for package management and workspace handling.

### Setup

```bash
# Clone the repository
git clone https://github.com/gasolin/barechat.git
cd barechat

# Install dependencies
bun install
```

### Available Scripts

```bash
# Install all dependencies across workspaces
bun install

# Run all packages in development mode
bun run dev:all

# Build all packages
bun run build

# Run tests across all packages
bun run test

# Run linting across all packages
bun run lint

# Clean all build artifacts
bun run clean

# Run the CLI specifically
bun run cli

# Start the CLI application
bun run cli:start

# Start the Web application
bun run web:start

# Generate API documentation
bun run doc
```

### Working with Individual Packages

```bash
# Run commands for a specific package
bun run --filter=barechat <command>
bun run --filter=barechat-web <command>

# Example: run CLI package in development mode
bun run --filter=barechat dev

# Example: run Web package in development mode
bun run --filter=barechat-web dev
```

## 📁 Project Structure

```
barechat/
├── packages/
│   ├── core/                # Core P2P chat networking package (barechat-core)
│   │   ├── lib/            # Core chat-core.js library
│   │   ├── test/           # Brittle unit tests
│   │   ├── index.js        # Package entry point
│   │   └── package.json    # Package configuration
│   ├── cli/                 # Main CLI application (barechat)
│   │   ├── bin/            # Executable scripts
│   │   ├── lib/            # Helper, API constants, and RPC server
│   │   ├── test/           # CLI & RPC tests
│   │   ├── index.js        # Main entry point
│   │   └── package.json    # Package configuration
│   ├── web/                 # Web interface application (barechat-web)
│   │   ├── bin/            # Executable scripts
│   │   ├── lib/            # HTTP Server and WebSocket bridge logic
│   │   ├── ui/             # Web UI components
│   │   ├── test/           # Integration tests
│   │   ├── index.js        # Main entry point
│   │   └── package.json    # Package configuration
│   ├── desktop/             # Pear Desktop application (barechat-desktop)
│   │   ├── index.html      # Main UI entry point
│   │   ├── app.js          # Desktop application logic
│   │   └── package.json    # Package configuration
│   ├── mobile/              # React Native (Expo) & BareKit mobile app (barechat-mobile)
│   │   ├── app/            # Expo Router screens
│   │   ├── packages/       # BareKit worklet & RPC bridge
│   │   └── package.json    # Package configuration
│   └── rpc/                 # Terminal IPC via bare-rpc (barechat-rpc)
│       ├── lib/            # RPCServer and RPCClient implementation
│       ├── test/           # Example test scripts
│       ├── index.js        # CLI entry point
│       └── package.json    # Package configuration
├── openspec/               # OpenSpec specifications, architecture & deployment docs
├── doc/                    # Generated API documentation
│   └── api.md              # Core API documentation
├── bunfig.toml             # Bun configuration
├── package.json            # Root package.json (workspace config)
└── README.md               # This file
```

## 🔧 Technology Stack

- **Runtime**: Bare (JavaScript runtime for embedded systems)
- **Package Manager**: Bun (with workspace support)
- **Language**: ES Modules JavaScript / TypeScript (Mobile)
- **Networking**: Hyperswarm (P2P network discovery)
- **Desktop Platform**: Pear (P2P-first desktop development platform)
- **Mobile Platform**: React Native (Expo) + `react-native-bare-kit`
- **IPC / RPC**: `bare-rpc` over Unix domain sockets / BareKit IPC
- **Cryptography**: Hypercore-crypto

## 📚 Documentation

- **API Documentation**: See [`doc/api.md`](doc/api.md)
- **OpenSpec Specifications**: See [`openspec/`](openspec/project.md)
- **Deployment Guide**: See [`openspec/deploy.md`](openspec/deploy.md)
- **Package-specific READMEs**:
  - [`packages/core/README.md`](packages/core/README.md)
  - [`packages/cli/README.md`](packages/cli/README.md)
  - [`packages/web/README.md`](packages/web/README.md)
  - [`packages/desktop/README.md`](packages/desktop/README.md)
  - [`packages/mobile/README.md`](packages/mobile/README.md)
  - [`packages/rpc/README.md`](packages/rpc/README.md)

## 🤝 Contributing

1. Fork this repository
2. Create a feature branch
3. Make your changes
4. Test across all packages: `bun run test`
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Related Projects

- **barechat-web**: Web version of BareChat
- **hyperswarm**: The P2P networking library powering BareChat
- **bare**: JavaScript runtime for embedded systems
