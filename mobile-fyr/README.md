# BareChat Mobile

Mobile interface for BareChat P2P chat application using Expo and React Native.

## Features

- 📱 Cross-platform mobile app (iOS/Android)
- 🔗 Anonymous P2P chat using Hyperswarm
- 💬 Modern chat interface with react-native-gifted-chat
- 🔄 Compatible with existing CLI and web clients
- 🎯 No registration required - completely anonymous

## Development

### Prerequisites

- Node.js 18+
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio/Emulator (for Android development)

### Setup

```bash
# Install dependencies
bun install

# Start development server
bun run mobile:start

# Or use specific platform
bun run mobile:ios    # iOS Simulator
bun run mobile:android # Android Emulator
bun run mobile:web    # Web version
```

### Usage

1. **Join Existing Room**: Enter a room name or 64-character hex topic hash
2. **Create Random Room**: Generate a new anonymous chat room
3. **Chat**: Send and receive messages anonymously with other peers

### Project Structure

```
packages/mobile/
├── src/
│   ├── components/          # React Native components
│   │   ├── RoomJoinScreen.tsx
│   │   └── ChatScreen.tsx
│   ├── services/           # P2P networking service
│   │   └── P2PService.ts
│   ├── types/             # TypeScript type definitions
│   │   ├── index.ts
│   │   └── modules.d.ts
│   └── utils/             # Utility functions
│       └── crypto.ts
├── App.tsx               # Main application entry
├── package.json          # Dependencies and scripts
└── metro.config.js       # Metro bundler configuration
```

## Architecture

The mobile app follows the same P2P principles as the CLI and web versions:

- **Hyperswarm**: P2P network discovery and connections
- **Anonymous**: No user authentication, only peer IDs
- **Decentralized**: No central server required
- **Compatible**: Works with CLI and web clients

## Privacy & Security

- 🔒 End-to-end encryption through Hyperswarm
- 🎭 Anonymous participation (no personal data)
- 🚫 No data collection or storage
- 🔐 Peer identification via public keys only

## Building

```bash
# Build for production
bun run mobile:build

# Export for app stores
expo export
```

## Testing

```bash
# Run tests
bun run mobile:test

# Type checking
bun run mobile:typecheck

# Linting
bun run mobile:lint
```

## License

MIT License - see LICENSE file for details.