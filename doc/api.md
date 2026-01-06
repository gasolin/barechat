## Constants

<dl>
<dt><a href="#getSwarm">getSwarm</a> ⇒ <code>Hyperswarm</code></dt>
<dd><p>Creates a Hyperswarm instance with optional bootstrap configuration</p>
</dd>
<dt><a href="#isHashcode">isHashcode</a> ⇒ <code>boolean</code></dt>
<dd><p>Checks if a string is a valid 64-character hexadecimal hash (32 bytes)</p>
</dd>
<dt><a href="#strToTopic">strToTopic</a> ⇒ <code>string</code></dt>
<dd><p>Converts a string to a topic buffer. If the string is already a valid hashcode,
returns it as-is. Otherwise, creates a SHA256 hash of the string.</p>
</dd>
<dt><a href="#createMessage">createMessage</a> ⇒ <code>object</code></dt>
<dd><p>Creates a message object.</p>
</dd>
<dt><a href="#getBackend">getBackend</a> ⇒ <code>Object</code></dt>
<dd><p>Initializes the networking layer and returns an object containing the core API functions for interacting with the chat swarm</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#getMemberId">getMemberId(peer)</a> ⇒ <code>string</code></dt>
<dd><p>Generates a short, human-readable identifier for a peer based on their remote public key</p>
</dd>
<dt><a href="#joinRoom">joinRoom(swarm)</a> ⇒ <code>function</code></dt>
<dd><p>Joins or creates a chat room for the specified topic</p>
</dd>
<dt><a href="#sendMessage">sendMessage(swarm)</a> ⇒ <code>function</code></dt>
<dd><p>Sends a message to all peers currently connected in the swarm</p>
</dd>
</dl>

<a name="getSwarm"></a>

## getSwarm ⇒ <code>Hyperswarm</code>
Creates a Hyperswarm instance with optional bootstrap configuration

**Kind**: global constant  
**Returns**: <code>Hyperswarm</code> - Configured Hyperswarm instance  

| Param | Type | Description |
| --- | --- | --- |
| [opts] | <code>Object</code> | Configuration options |
| [opts.bootstrap] | <code>Array.&lt;string&gt;</code> | Array of bootstrap servers for peer discovery |

<a name="isHashcode"></a>

## isHashcode ⇒ <code>boolean</code>
Checks if a string is a valid 64-character hexadecimal hash (32 bytes)

**Kind**: global constant  
**Returns**: <code>boolean</code> - True if the string is a valid 64-character hex string  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | The string to validate |

**Example**  
```js
isHashcode('eaabffe32a969eeae9a4588a6e088534aae8066db2c055107b9e700fd6033089') // true
isHashcode('hello world') // false
isHashcode('abc123') // false (too short)
```
<a name="strToTopic"></a>

## strToTopic ⇒ <code>string</code>
Converts a string to a topic buffer. If the string is already a valid hashcode,
returns it as-is. Otherwise, creates a SHA256 hash of the string.

**Kind**: global constant  
**Returns**: <code>string</code> - A 64-character hex string representing the topic  

| Param | Type | Description |
| --- | --- | --- |
| topicStr | <code>string</code> | The topic string to convert |

<a name="createMessage"></a>

## createMessage ⇒ <code>object</code>
Creates a message object.

**Kind**: global constant  
**Returns**: <code>object</code> - A message object with a timestamp, message content, local flag, and type.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| msg | <code>string</code> |  | The content of the message. |
| [local] | <code>boolean</code> | <code>false</code> | Indicates whether the message is send from a local device.   Defaults to `false`. |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| timestamp | <code>Date</code> | The date and time the message was created. |
| message | <code>string</code> | The content of the message. |
| local | <code>boolean</code> | Indicates if the message is send from a local device. |
| type | <code>string</code> | The type of the message. Defaults to `text` |

<a name="getBackend"></a>

## getBackend ⇒ <code>Object</code>
Initializes the networking layer and returns an object containing the core API functions for interacting with the chat swarm

**Kind**: global constant  
**Returns**: <code>Object</code> - An object containing core API functions and properties  

| Param | Type | Description |
| --- | --- | --- |
| [opts] | <code>Object</code> | Configuration options for the Hyperswarm instance |
| [opts.bootstrap] | <code>Array.&lt;string&gt;</code> | A list of bootstrap servers to use for discovering peers |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| createRoom | <code>function</code> | Creates a new chat room (alias for joinRoom for backward compatibility) |
| getMemberId | <code>function</code> | Generates a short identifier for a peer |
| joinRoom | <code>function</code> | Joins an existing chat room using a topic string |
| sendMessage | <code>function</code> | Sends a message to all connected peers |
| strToTopic | <code>function</code> | Converts a string to a valid topic hash |
| isHashcode | <code>function</code> | Validates if a string is a valid 64-character hex hash |
| swarm | <code>Hyperswarm</code> | The underlying Hyperswarm instance |
| version | <code>string</code> | The version of the BareChat package |

**Example**  
```js
const backend = getBackend({ bootstrap: ['192.168.0.123:55688'] });
const room = await backend.joinRoom();
backend.sendMessage("Hello world!");
```
<a name="getMemberId"></a>

## getMemberId(peer) ⇒ <code>string</code>
Generates a short, human-readable identifier for a peer based on their remote public key

**Kind**: global function  
**Returns**: <code>string</code> - A 6-character hex string representing the member ID, or 'invalid' if the peer object is not valid  

| Param | Type | Description |
| --- | --- | --- |
| peer | <code>Object</code> | The peer object from the Hyperswarm connection |

**Example**  
```js
swarm.on('connection', (peer) => {
  const memberId = getMemberId(peer);
  console.log("New peer connected with ID:", memberId);
});
```
<a name="joinRoom"></a>

## joinRoom(swarm) ⇒ <code>function</code>
Joins or creates a chat room for the specified topic

**Kind**: global function  
**Returns**: <code>function</code> - An async function that joins/creates a room  

| Param | Type | Description |
| --- | --- | --- |
| swarm | <code>Hyperswarm</code> | The Hyperswarm instance to use |

<a name="sendMessage"></a>

## sendMessage(swarm) ⇒ <code>function</code>
Sends a message to all peers currently connected in the swarm

**Kind**: global function  
**Returns**: <code>function</code> - A function that sends messages  

| Param | Type | Description |
| --- | --- | --- |
| swarm | <code>Hyperswarm</code> | The Hyperswarm instance to use |

