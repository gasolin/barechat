# BareChat Desktop

Anonymous, peer-to-peer chat application for the desktop, powered by [Pear](https://pear.guide).

## Features

- **P2P Networking**: Direct connection to the Hyperswarm network.
- **No Servers**: Fully decentralized communication.
- **Web UI**: Reuses the beautiful BareChat web interface.
- **Native Window**: Integrated window controls and draggable header.

## Prerequisites

You need the Pear CLI installed:

```bash
npm install -g pear
```

## Running the App

From the root of the monorepo:

```bash
cd packages/desktop
pear run --dev .
```

## Development

The desktop app is built using ESM and integrates directly with `barechat-core`. 

Dependencies are linked from the root `node_modules` to ensure compatibility and ease of development in a monorepo structure.
