## Barechat chat-core API

### `getBackend(opts)`

Initializes the networking layer and returns an object containing the core API functions for interacting with the chat swarm.

**Parameters:**

* `opts` (Object, optional): Configuration options for the Hyperswarm instance.
    * `bootstrap` (Array<string>, optional): A list of bootstrap servers to use for discovering peers.

**Returns:**

* `Object`: An object containing the following properties and functions:
    * `createRoom` (Function): See [`createRoom()`](#createroom)
    * `getMemberId` (Function): See [`getMemberId(peer)`](#getmemberidpeer)
    * `joinRoom` (Function): See [`joinRoom(topicStr)`](#joinroomtopicstr)
    * `sendMessage` (Function): See [`sendMessage(message)`](#sendmessagemessage)
    * `swarm` (Hyperswarm instance): The underlying Hyperswarm instance.
    * `version` (string): The version of the BareChat application.

### `createRoom()`

Creates a new chat room with a randomly generated topic and joins the swarm.

**Parameters:**

* None.

**Returns:**

* `Promise<Object>`: A promise that resolves to an object with the following properties:
    * `done` (boolean): Indicates if the swarm joining process is complete.
    * `topic` (string): The hex-encoded topic of the newly created room.

**Example:**

```javascript
const { createRoom } = getBackend();
const room = await createRoom();
console.log("Created room with topic:", room.topic);

### `getMemberId(peer)`

Generates a short, human-readable identifier for a peer based on their remote public key.

**Parameters:**

peer (Object): The peer object from the Hyperswarm connection.

**Returns:**

* `string`: A 6-character hex string representing the member ID, or 'invalid' if the peer object is not valid.

**Example:**

```javascript
swarm.on('connection', (peer) => {
  const memberId = getMemberId(peer);
  console.log("New peer connected with ID:", memberId);
});
```

### `joinRoom(topicStr)`

Joins an existing chat room using a provided topic string.

**Parameters:**

topicStr (string): The hex-encoded topic of the room to join.

**Returns:**

`Promise<Object>`: A promise that resolves to an object with the following properties:
`done` (boolean): Indicates if the swarm joining process is complete.
`topic` (string): The hex-encoded topic of the joined room, or an empty string or 'err' in case of an error.

**Example:**

```javascript
const { joinRoom } = getBackend();
const roomToJoin = 'somehexencodedtopic';
const room = await joinRoom(roomToJoin);
if (room.done) {
  console.log("Joined room with topic:", room.topic);
} else {
  console.error("Failed to join room.");
}
```

### `sendMessage(message)`

Sends a message to all peers currently connected in the swarm.

**Parameters:**

`message (string)`: The message content to send.

**Returns:**

undefined.

**Example:**

```javascript
const { sendMessage } = getBackend();
sendMessage("Hello everyone in the room!");
```
