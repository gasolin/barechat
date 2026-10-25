# Mobile Package Design

## Context

The BareChat Mobile package provides a mobile-first implementation of the BareChat protocol. It leverages React Native for the user interface and BareKit to run the same peer-to-peer networking core used in the CLI and Web versions.

## Goals / Non-Goals

### Goals
- Provide a smooth, indigenous mobile chat experience.
- Reuse `barechat-core` for P2P networking to ensure protocol compatibility.
- Enable decentralized communication without a central server on mobile devices.
- Efficiently bridge the React Native main thread and the BareKit worklet.

### Non-Goals
- Native desktop application (handled by CLI/Web).
- Centralized message relay (maintaining decentralization).

## Decisions

### Decision: React Native with Expo
- **What**: Use React Native (Expo) for the mobile application.
- **Why**: Cross-platform (iOS/Android), large ecosystem, and fast development cycles.

### Decision: BareKit for P2P Core
- **What**: Use `react-native-bare-kit` to execute the P2P networking logic.
- **Why**: Allows running the Bare runtime (which `barechat-core` depends on) inside a mobile app as a separate worklet.

### Decision: bare-rpc over BareKit IPC
- **What**: Use `bare-rpc` (wrapped in `ChatRPC`) over `BareKit.IPC` / `worklet.IPC` for communication between the React Native UI and the P2P core worklet.
- **Why**: Lightweight, bidirectional, and natively compatible with both Bare and React Native environments.

### Decision: bare-pack for Worklet Bundling
- **What**: Use `bare-pack` to bundle the worklet code (`packages/core/main.js`) and its dependencies into `packages/core/main.bundle.js`.
- **Why**: Resolves module resolution issues in the worklet environment and allows pre-loading the core logic for iOS and Android targets.

## Architecture

### Components

#### React Native UI (Main Thread)
- **GiftedChat**: Used for the chat interface (`app/index.tsx`).
- **RPC Bridge (`packages/core/index.ts` & `packages/rpc.js`)**: Communicates with the worklet via `ChatRPC` (`bare-rpc`) to join rooms, send messages, and receive incoming swarm messages (`ON_MESSAGE`).
- **State Management**: Handles active room, message history, and connection status.

#### BareKit Worklet (Core Thread)
- **Bare Runtime**: Isolated environment for running JavaScript logic (`packages/core/main.js`).
- **barechat-core**: The actual P2P networking implementation.
- **RPC Handler**: Exposes networking methods (`JOIN_ROOM`, `SEND_MESSAGE`) to the UI and pushes incoming messages (`ON_MESSAGE`) via `rpc.emitMessage`.

### Communication Flow

1. **Initialization**: React Native starts the worklet using the bundled JS file (`packages/core/main.bundle.js`).
2. **RPC Setup**: Both sides initialize `ChatRPC` (`bare-rpc`) directly over the `IPC` channel (`worklet.IPC` / `BareKit.IPC`).
3. **Room Join**: UI calls `joinRoom` via RPC (`COMMANDS.JOIN_ROOM`); worklet initializes Hyperswarm via `barechat-core` and joins the room.
4. **Message Flow**:
   - Outgoing: UI sends message via RPC (`COMMANDS.SEND_MESSAGE`) -> Worklet broadcasts to swarm via `backend.sendMessage`.
   - Incoming: Swarm receives message -> Worklet calls `rpc.emitMessage` (`COMMANDS.ON_MESSAGE`) -> UI updates GiftedChat state.

## Resource Management

- **Background Tasks**: Handle Hyperswarm connections efficiently to prevent battery drain.
- **Addon Linking**: Native Bare addons (like `udx-native`) must be properly linked in the native mobile project.

## Security Considerations

- Same decentralized model as CLI/Web.
- End-to-end encryption via Hyperswarm.
- No local storage of private keys outside the device.
