# BareChat Terminal

Anonymous chat anywhere with commandline

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
> npx barechat
[info] Created new chat room: a1b2c35fbeb452bc900c5a1c00306e52319a3159317312f54fe5a246d634f51a
```

In another terminal use the hashcode received from the first terminal's output:

```sh
> npx barechat a1b2c35fbeb452bc900c5a1c00306e52319a3159317312f54fe5a246d634f51a
[info] Joined chat room a1b2c35fbeb452bc900c5a1c00306e52319a3159317312f54fe5a246d634f51a
```

By anouncing the hashcode somewhere you can chat anonymously.

> And its fully compatible to chat with [barechat-web](https://github.com/gasolin/barechat-web)

### Extra arguments

If you want to record the log of this chat, can add `--store` argument to save chat into a text file.

```sh
# Store logs in default file (./barechat.txt)
npx barechat --store

# Store logs in specific file
npx barechat --store /tmp/chatlog.txt
```

## Clone and Setup

Clone the repository or download it and navigate to the directory, then run:

```sh
npm install
```

## Run

To test this chat app, in one terminal run:

```sh
> bare index.js
[info] Created new chat room: a1b2c35fbeb452bc900c5a1c00306e52319a3159317312f54fe5a246d634f51a
```

In another terminal use the hashcode received from the first terminal's output:

```sh
> bare index.js a1b2c35fbeb452bc900c5a1c00306e52319a3159317312f54fe5a246d634f51a
[info] Joined chat room a1b2c35fbeb452bc900c5a1c00306e52319a3159317312f54fe5a246d634f51a
```

By anouncing the hashcode somewhere you can chat anonymously.

## Using BareChat as a Package

To make varient chat experience, you can also import `barechat/lib/chat-core` in your project.

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

## Reference

- Basically followed [Making a Pear Terminal Application](https://docs.pears.com/guides/making-a-pear-terminal-app) but built with bare and distill the reusable `chat-core`

## License

MIT
