# BareChat Terminal

Anonymous chat anywhere with commandline

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

You can also import `barechat` in your JavaScript files:

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
