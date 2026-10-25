# BareChat Mobile

Anonymous, peer-to-peer mobile chat application built with [React Native (Expo)](https://expo.dev) and [BareKit](https://github.com/holepunchto/react-native-bare-kit).

## Features

- **Decentralized P2P Networking**: Uses [`barechat-core`](../core) running inside a BareKit worklet for direct Hyperswarm P2P connections.
- **Cross-Platform Mobile UI**: Built with Expo Router and `react-native-gifted-chat` for iOS and Android.
- **IPC Bridge via `bare-rpc`**: Seamless communication between the React Native UI thread and the BareKit P2P worklet.
- **Compatible Protocol**: Chat with users on BareChat CLI, Web, and Desktop.

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Bundle the BareKit P2P Core worklet**

   Before running the mobile app, bundle `packages/core/main.js` (and `barechat-core`) into `packages/core/main.bundle.js` using `bare-pack`:

   ```bash
   npm run bundle-core
   ```

3. **Start the app**

   ```bash
   npm start
   # or run directly on a simulator/device:
   npm run ios
   npm run android
   ```

> **Note**: Because this app uses native modules (`react-native-bare-kit`), it requires an Expo development build (`expo run:ios` / `expo run:android`) rather than standard Expo Go.

## Architecture

- **`app/`**: Expo Router screens (`app/index.tsx` provides the main chat and room-joining interface).
- **`packages/core/main.js`**: The BareKit worklet entry point that loads `barechat-core` and handles Hyperswarm connections.
- **`packages/core/index.ts`**: React Native side worklet loader (`initBareKit`) and RPC bridge.
- **`packages/rpc.js`**: Shared `ChatRPC` helper built on `bare-rpc` for communication over `BareKit.IPC`.

## License

MIT
