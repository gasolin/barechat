# BareChat Monorepo

Anonymous chat anywhere with commandline

## 📦 Packages

This monorepo contains following packages:

### `barechat` (packages/cli)
The main CLI application for BareChat - an anonymous, peer-to-peer chat terminal application.

- **Features**: IRC like anonymous chat, fully p2p, no server required
- **Installation**: `npm i -g barechat` or `bun add -g barechat`
- **Usage**: `barechat` or `barechat <topic-hash>`

### `barechat-web` (packages/web)
Web interface for BareChat - provides a localhost web UI for anonymous P2P chat.

- **Features**: Web-based chat interface, fully p2p, no server required
- **Installation**: `npm i -g barechat-web` or `bun add -g barechat-web`
- **Usage**: `barechat-web` or `barechat-web <topic-hash>`

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
# bun run dev

# Build all packages
# bun run build

# Run tests across all packages
# bun run test

# Run linting across all packages
# bun run lint

# Clean all build artifacts
# bun run clean

# Run the CLI specifically
bun run cli

# Start the CLI application
bun run cli:start

# Start the Web application
bun run web:start

# Generate documentation
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

# Example: generate docs for CLI package
bun run --filter=barechat doc
```

## 📁 Project Structure

```
barechat/
├── packages/
│   ├── cli/                 # Main CLI application
│   │   ├── bin/            # Executable scripts
│   │   ├── lib/            # Core library files
│   │   ├── openspec/        # OpenSpec specifications
│   │   ├── index.js        # Main entry point
│   │   └── package.json    # Package configuration
│   └── web/                 # Web interface application
│       ├── lib/            # Server and WebSocket logic
│       ├── ui/             # Web UI components
│       ├── index.js        # Main entry point
│       └── package.json    # Package configuration
├── doc/                    # Documentation
│   └── api.md             # API documentation
├── bunfig.toml             # Bun configuration
├── package.json            # Root package.json (workspace config)
└── README.md               # This file
```

## 🔧 Technology Stack

- **Runtime**: Bare (JavaScript runtime for embedded systems)
- **Package Manager**: Bun (with workspace support)
- **Language**: ES Modules JavaScript
- **Networking**: Hyperswarm (P2P network discovery)
- **Cryptography**: Hypercore-crypto, Bare-crypto

## 📚 Documentation

- **API Documentation**: See `doc/api.md`
- **OpenSpec Specifications**: See `packages/cli/openspec/`
- **Package-specific README**: See `packages/cli/README.md`

## 🤝 Contributing

1. Fork this repository
2. Create a feature branch
3. Make your changes
4. Test across all packages: `bun run test`
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file in packages/cli for details.

## 🔗 Related Projects

- **barechat-web**: Web version of BareChat
- **hyperswarm**: The P2P networking library powering BareChat
- **bare**: JavaScript runtime for embedded systems
