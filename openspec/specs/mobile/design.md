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

### Decision: tiny-buffer-rpc over IPC
- **What**: Use `tiny-buffer-rpc` and `framed-stream` for communication between the UI and the P2P core.
- **Why**: Lightweight, efficient, and compatible with both Bare and React Native environments.

### Decision: bare-pack for Worklet Bundling
- **What**: Use `bare-pack` to bundle the worklet code and its dependencies.
- **Why**: Resolves module resolution issues in the worklet environment and allows pre-loading the core logic.

## Architecture

### Components

#### React Native UI (Main Thread)
- **GiftedChat**: Used for the chat interface.
- **RPC Client**: Communicates with the worklet to send/receive messages and room events.
- **State Management**: Handles active room, message history, and connection status.

#### BareKit Worklet (Core Thread)
- **Bare Runtime**: Isolated environment for running JavaScript logic.
- **barechat-core**: The actual P2P networking implementation.
- **RPC Server**: Exposes networking methods (join room, send message) to the UI.

### Communication Flow

1. **Initialization**: React Native starts the worklet using a bundled JS file (`main.bundle.js`).
2. **RPC Setup**: Both sides initialize `framed-stream` over the `IPC` channel and set up `tiny-buffer-rpc`.
3. **Room Join**: UI calls `joinRoom` via RPC; worklet initializes Hyperswarm and joins the room.
4. **Message Flow**:
   - Outgoing: UI sends message via RPC -> Worklet pushes to swarm.
   - Incoming: Swarm receives message -> Worklet emits RPC call/event to UI -> UI updates state.

## Resource Management

- **Background Tasks**: Handle Hyperswarm connections efficiently to prevent battery drain.
- **Addon Linking**: Native Bare addons (like `udx-native`) must be properly linked in the native mobile project.

## Security Considerations

- Same decentralized model as CLI/Web.
- End-to-end encryption via Hyperswarm.
- No local storage of private keys outside the device.
