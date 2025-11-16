# BareChat CLI

Anonymous chat anywhere with commandline

|project |version |
|--------|--------|
| [terminal](https://www.npmjs.com/package/barechat) (this) | ![NPM Version](https://img.shields.io/npm/v/barechat) |
| [web](https://www.npmjs.com/package/barechat-web) | ![NPM Version](https://img.shields.io/npm/v/barechat-web) |

## Features

- IRC like anonymous chat, fully p2p, no server required
- Minimalist, single command to start
- Can public a topic with hashcode, anyone with that hashcode can join the chat, even when the origin hoster left
- With commandline UI, flexible to extend with other UI

## Prerequisite

Need bare runtime installed through npm. Could install globally using:

`npm i -g bare`

## Normal Usage with commandline

Could install with command `npm i -g barechat` or run directly with `npx barechat`.

To test this chat app, in one terminal run:

```sh
> npx barechat soccer
[info] Created new chat room: 8f27f432fcbaa4b5180a1cc7a8fa166a93cda3c1bce6f19922dd519d02f4bb39
```

You can send `soccer`, `p2p` or any string you like to discover the room.

In another terminal use the same command, or the hashcode received from the first terminal's output:

```sh
> npx barechat 8f27f432fcbaa4b5180a1cc7a8fa166a93cda3c1bce6f19922dd519d02f4bb39
[info] Joined chat room 8f27f432fcbaa4b5180a1cc7a8fa166a93cda3c1bce6f19922dd519d02f4bb39
```

> And its fully compatible to chat with [barechat-web](https://github.com/gasolin/barechat-web)


Or you can simply call

> npx barechat

Which will randomly generate a room with hashcode. By anouncing the hashcode somewhere you can chat anonymously.

### Extra arguments

If you want to record the log of this chat, can add `--store` argument to save chat into a text file.

```sh
# Store logs in default file (./barechat.txt)
npx barechat --store

# Store logs in specific file
npx barechat --store /tmp/chatlog.txt
```

If you want to disable the RPC server, can add `--no-rpc` argument:

```sh
# Start chat without RPC server
npx barechat --no-rpc soccer

# Combine with store option
npx barechat --no-rpc --store chatlog.txt
```

## Development

This package is part of the BareChat monorepo. See the [root README](../../README.md) for development setup instructions.

### Local Development

```bash
# From the packages/cli directory
npm run dev

# Or from the root directory
bun run cli:start
```

### Generate Documentation

```bash
npm run doc
```

## Using BareChat as a Package

To make variant chat experience, you can also import `barechat/lib/chat-core` in your project.

```js
import { getBackend } from 'barechat/lib/chat-core'
const {
  swarm,
  getMemberId,
  createRoom,
  joinRoom,
  sendMessage
} = getBackend()
```

Read chat-core API in [API](../../doc/api.md) doc

## Reference

- Basically followed [Making a Pear Terminal Application](https://docs.pears.com/guides/making-a-pear-terminal-app) but built with bare and distill the reusable `chat-core`

## License

MIT
