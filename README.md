# BareChat Terminal

Anonymous chat anywhere with commandline

## Prerequisite

Need bare runtime installed

Could install globally using:

`npm i -g bare`

## Setup

Clone the repository or download it and navigate to the directory, then run:

```sh
npm install
```

## Run

To test this chat app, in one terminal run:

```sh
> npm run barechat
[info] Created new chat room: a1b2c35fbeb452bc900c5a1c00306e52319a3159317312f54fe5a246d634f51a
```

In another terminal use the key received from the first terminal's output:

```sh
> npm run barechat a1b2c35fbeb452bc900c5a1c00306e52319a3159317312f54fe5a246d634f51a
[info] Joined chat room a1b2c35fbeb452bc900c5a1c00306e52319a3159317312f54fe5a246d634f51a
```

Now you can use the command `npm run barechat` to start your application.

## Using as a Package

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