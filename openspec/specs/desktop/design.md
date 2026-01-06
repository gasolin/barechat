# Desktop Package Design

The `barechat-desktop` package provides a native desktop experience for BareChat using the Pear platform.

## Architecture

The desktop application reuses the UI components from `packages/web` but integrates them directly with `barechat-core` to avoid the need for a separate WebSocket bridge server.

### Components

- **Pear Platform**: Provides the runtime environment, P2P-first features, and native windowing.
- **index.html**: Adapted from `packages/web/ui/index.js` (HTML string). Includes `<pear-ctrl>` for native window controls.
- **app.js**: Adapted from `packages/web/ui/index.js` (JS logic). Replaces WebSocket calls with local `barechat-core` calls.
- **barechat-core**: Direct integration for P2P networking.

## UI Adaptations

1.  **Draggable Region**: A `-webkit-app-region: drag` style is added to the header to allow moving the window.
2.  **Native Controls**: `<pear-ctrl>` is added to provide minimize/maximize/close buttons.
3.  **Layout**: The layout is optimized to fit the desktop window size.

## Module Resolution

In a monorepo setup, `barechat-core` and its dependencies (like `b4a`, `hyperswarm`) are resolved from the root `node_modules` via symbolic links in `packages/desktop/node_modules`. This ensures the Pear runtime can find all necessary modules.

## Connectivity

Unlike the web version which connects to a local bridge server, the desktop app initializes its own Hyperswarm instance via `barechat-core`. This makes it a standalone P2P node.
