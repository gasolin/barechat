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

### `createRoom()` `Deprecated`

> Use `joinRoom` instead

Creates a new chat room with a randomly generated topic and joins the swarm.

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

Joins an existing chat room or creates a new one. If no topic is provided, generates a random topic.
In P2P networks, joining a topic effectively creates it if it doesn't exist.

**Parameters:**

topicStr (string): Optional topic string (can be human-readable text, hex-encoded hash, or omitted for random)

**Returns:**

`Promise<Object>`: A promise that resolves to an object with the following properties:
`done` (boolean): Indicates if the swarm joining process is complete.
`topic` (string): The hex-encoded topic of the joined/created room, or an empty string or 'err' in case of an error.

**Example:**

```javascript
// Create room with random topic
const randomRoom = await joinRoom()
console.log("Joined/created random room:", randomRoom.topic)

// Join/create room with human-readable name
const namedRoom = await joinRoom('general-chat')
console.log("Joined/created named room:", namedRoom.topic)

// Join/create room with hex-encoded topic
const hashRoom = await joinRoom('a1b2c35fbeb452bc900c5a1c00306e52319a3159317312f54fe5a246d634f51a')
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

## `parseArgs(argv)`

Parses command-line arguments to extract a topic, an optional store path or an optional bootstrap string.

**Parameters:**

* `argv` (`string[]`): An array of command-line arguments, typically `process.argv`.

**Returns:**

* `{topic: string, store: string|null, bootstrap: string|null}`: An object containing the extracted params.
    * `topic`: The first non-option argument found, or an empty string if none is present.
    * `store`: The '--store' option can be followed by a path or use a default
    path if no value is provided immediately after or if the value is another
    option starting with '--'. It also supports the '--store=path' format
    * The '--bootstrap' option expects a value immediately following it.

**Examples:**

```javascript
// Example usage with typical Node.js process.argv: ['node', 'script.js', 'myTopic', '--store', '/path/to/store']
const args1 = parseArgs(['node', 'script.js', 'myTopic', '--store', '/path/to/store']);
console.log(args1); // Outputs: { topic: 'myTopic', store: '/path/to/store' }
```

Could run barechat in local network with some local DHT node(s)

```
❯ npx hyperdht --bootstrap --host [local ip] --port 55688
```

Then connect

```
> npx —barechat --bootstrap=192.168.0.123:55688
```
