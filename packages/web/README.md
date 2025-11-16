# BareChat Web

Anonymous chat anywhere with localhost web interface

|project |version |
|--------|--------|
| [terminal](https://www.npmjs.com/package/barechat) | ![NPM Version](https://img.shields.io/npm/v/barechat) |
| [web](https://www.npmjs.com/package/barechat-web) (this) | ![NPM Version](https://img.shields.io/npm/v/barechat-web) |

## Features

- Instant chat with localhost web UI
- Fully p2p as barechat, no server required
- Modern web interface with real-time messaging
- Compatible with barechat CLI clients

## Prerequisite

Need bare runtime installed through npm. Could install globally using:

`npm i -g bare`

## Normal Usage with Web Interface

Could install with command `npm i -g barechat-web` or run directly with `npx barechat-web`.

To test this chat app, in one terminal run:

```sh
> npx barechat-web soccer
==================
BareChat Web server started on port 54321
Open your browser and navigate to http://localhost:54321
==================
[info] Attempting to join room with topic: 8f27f432fcbaa4b5180a1cc7a8fa166a93cda3c1bce6f19922dd519d02f4bb39
[info] Successfully joined room: 8f27f432fcbaa4b5180a1cc7a8fa166a93cda3c1bce6f19922dd519d02f4bb39
```

You can send `soccer`, `p2p` or any string you like to discover the room.

In another terminal use the same command, or the hashcode received from the first terminal's output:

```sh
> npx barechat-web 8f27f432fcbaa4b5180a1cc7a8fa166a93cda3c1bce6f19922dd519d02f4bb39
==================
BareChat Web server started on port 54322
Open your browser and navigate to http://localhost:54322
==================
[info] Attempting to join room with topic: 8f27f432fcbaa4b5180a1cc7a8fa166a93cda3c1bce6f19922dd519d02f4bb39
[info] Successfully joined room: 8f27f432fcbaa4b5180a1cc7a8fa166a93cda3c1bce6f19922dd519d02f4bb39
```

> And it's fully compatible to chat with [barechat](https://github.com/gasolin/barechat) CLI clients

Or you can simply call:

> npx barechat-web

Which will randomly generate a room with hashcode. By announcing the hashcode somewhere you can chat anonymously through the web interface.

## Web Interface Features

- **Real-time Messaging**: Messages appear instantly without page refresh
- **Peer Status**: See when peers join or leave the chat
- **Room Information**: Display current room topic and connected peers count
- **Command Support**: Use commands like `join <topic>` and `info`
- **Responsive Design**: Works on desktop and mobile browsers

## Development

This package is part of the BareChat monorepo. See the [root README](../../README.md) for development setup instructions.

### Local Development

```bash
# From the packages/web directory
npm run dev

# Or from the root directory
bun run web:start
```

The web server will start on a random available port and you can open your browser to access it.

### Using BareChat Web as a Package

You can also import and use the web server functionality in your project:

```js
import { createChatServer } from 'barechat-web/lib/server'
import { createWebSocketServer } from 'barechat-web/lib/ws'
import { getBackend } from 'barechat/lib/chat-core'

// Create your own web chat interface
const backend = getBackend()
const server = createChatServer(htmlContent)
const wsServer = createWebSocketServer({
  webServer: server,
  // ... your configuration
})
```

## Reference

- Built on top of [barechat](https://github.com/gasolin/barechat) core functionality
- Uses [RPGUI](https://github.com/RonenNess/RPGUI#rpgui) for UI components
- WebSocket implementation for real-time communication

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.
