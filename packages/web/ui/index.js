// HTML content
const JS = `
// User avatars mapping
const avatars = {
    me: "🧑",
    system: "⚙️",
};

// Get a default avatar for users we haven't seen before
const defaultAvatars = ["😀", "😊", "😎", "🤩", "🥳", "😇", "🤓", "🤯", "🚀", "💡"];
let avatarIndex = 0;

// Keep track of which users we've assigned avatars to
const knownUsers = {};

// Function to get avatar for a user
function getAvatar(userId) {
    if (avatars[userId]) return avatars[userId];
    if (knownUsers[userId]) return knownUsers[userId];

    const newAvatar = defaultAvatars[avatarIndex % defaultAvatars.length];
    avatarIndex++;
    knownUsers[userId] = newAvatar;
    return newAvatar;
}

// Function to format timestamp
function getFormattedTime() {
    const now = new Date();
    return now.getHours().toString().padStart(2, '0') + ':' +
            now.getMinutes().toString().padStart(2, '0');
}

// Function to copy message text to clipboard
async function copyMessageText(messageElement) {
    try {
        // Find the element containing the message text
        // This targets the div inside .message-content for both regular and system messages
        const textElement = messageElement.querySelector('.message-content div');
        if (textElement && textElement.textContent) {
            await navigator.clipboard.writeText(textElement.textContent);
            console.log('Message copied to clipboard:', textElement.textContent);
            // Notification will be shown by the caller after successful copy
            return true; // Indicate success
        }
    } catch (err) {
        console.error('Failed to copy message: ', err);
        // Optionally show an error notification here
        return false; // Indicate failure
    }
    return false; // Indicate failure (e.g., text element not found)
}

// Function to show a temporary notification
function showCopyNotification() {
    const notificationId = 'copy-notification';
    let notification = document.getElementById(notificationId);

    if (!notification) {
        notification = document.createElement('div');
        notification.id = notificationId;
        notification.textContent = 'Message copied!';
        // Basic styling, more can be added in CSS
        notification.style.cssText = \`
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background-color: var(--notion-button-bg);
            color: var(--notion-button-text);
            padding: 10px 20px;
            border-radius: var(--notion-radius);
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
            pointer-events: none; /* Allow clicks to pass through */
            box-shadow: var(--notion-shadow);
        \`;
        document.body.appendChild(notification);
    }

    // Reset transition and show the notification
    notification.style.transition = 'none';
    notification.style.opacity = 1;

    // Apply fade-out transition after a short delay
    setTimeout(() => {
        notification.style.transition = 'opacity 0.5s ease-in-out';
        notification.style.opacity = 0;
        // Optional: remove the element after it fades out completely
        // setTimeout(() => {
        //     if (notification.parentNode) {
        //         notification.parentNode.removeChild(notification);
        //     }
        // }, 500); // Matches the fade-out duration
    }, 2000); // Show for 2 seconds
}


// Function to add a message to the chat
function addMessageToChat(messageData) {
    const chatContent = document.getElementById('chat-content');
    const { type, sender, text } = messageData;

    // Check if it's a system message about connected peers or connection status
    if (type === 'system' && text.startsWith('Connected peers:')) {
        updateStatusBar(text);
        return; // Don't add this to the main chat
    }

    if (type === 'system' && (text.startsWith('WebSocket connected') ||
      text.startsWith('WebSocket Disconnected') ||
      text.startsWith('WebSocket connecting Error'))) {
        updateStatusBar('Server Status: ' + text);
        return; // Don't add this to the main chat for now, can be refined later
    }

    const messageDiv = document.createElement('div');

    if (type === 'system') {
        messageDiv.className = 'message system';

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';

        const textDiv = document.createElement('div');
        textDiv.textContent = text;

        messageContent.appendChild(textDiv);
        messageDiv.appendChild(messageContent);
    } else {
        // Determine if this is the user's message or someone else's
        const isMe = sender === 'me';
        messageDiv.className = 'message ' + (isMe ? 'me' : 'other');

        const avatarSpan = document.createElement('span');
        avatarSpan.className = 'avatar';
        avatarSpan.textContent = getAvatar(sender);

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';

        const senderDiv = document.createElement('div');
        senderDiv.className = 'message-sender';

        const nameSpan = document.createElement('span');
        nameSpan.textContent = isMe ? 'You' : sender; // Removed leading space

        senderDiv.appendChild(avatarSpan);
        senderDiv.appendChild(nameSpan);

        const textDiv = document.createElement('div');
        textDiv.textContent = text;

        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = getFormattedTime();

        messageContent.appendChild(senderDiv);
        messageContent.appendChild(textDiv);
        messageContent.appendChild(timeDiv);
        messageDiv.appendChild(messageContent);
    }

    // Add event listeners for long press to copy message
    let pressTimer;
    const longPressDuration = 500; // milliseconds

    const startPress = (e) => {
        // Prevent default context menu on right-click/long-press
        if (e.type === 'contextmenu') {
            e.preventDefault();
            copyMessageAndNotify();
            return;
        }

        pressTimer = setTimeout(async () => {
            // Long press detected
            copyMessageAndNotify();
        }, longPressDuration);
    };

    const copyMessageAndNotify = async () => {
        const copiedSuccessfully = await copyMessageText(messageDiv);
        if (copiedSuccessfully) {
            showCopyNotification();
        }
    };

    const cancelPress = () => {
        clearTimeout(pressTimer);
    };

    // For mouse events
    messageDiv.addEventListener('mousedown', startPress);
    messageDiv.addEventListener('mouseup', cancelPress);
    messageDiv.addEventListener('mouseleave', cancelPress);
    messageDiv.addEventListener('contextmenu', startPress); // Handle right-click for context menu

    // For touch events
    messageDiv.addEventListener('touchstart', startPress, { passive: true }); // Use passive: true for better scrolling performance
    messageDiv.addEventListener('touchend', cancelPress);
    messageDiv.addEventListener('touchcancel', cancelPress);

    chatContent.appendChild(messageDiv);

    // Scroll to bottom
    chatContent.scrollTop = chatContent.scrollHeight;
}

// Function to update the status bar
function updateStatusBar(text) {
    const statusBar = document.getElementById('status-bar');
    if (statusBar) {
        statusBar.textContent = text;
    }
}

// Initialize WebSocket connection
let ws = null;

function connectWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = protocol + '//' + window.location.host;

    ws = new WebSocket(wsUrl);
    console.log('linking to ' + wsUrl)

    ws.onopen = function() {
        console.log('WebSocket connected');
        addMessageToChat({
            type: 'system',
            text: 'WebSocket Connected'
        });
    };

    ws.onmessage = function(event) {
        const message = JSON.parse(event.data);
        addMessageToChat(message);
    };

    ws.onclose = function() {
        console.log('WebSocket closed');
        addMessageToChat({
            type: 'system',
            text: 'WebSocket Disconnected. Reconnecting in 5 seconds...'
        });

        // Try to reconnect after 5 seconds
        setTimeout(connectWebSocket, 5000);
    };

    ws.onerror = function(error) {
        console.error('WebSocket error:', error);
        addMessageToChat({
            type: 'system',
            text: 'WebSocket connecting Error'
        });
    };
}

// Set up UI interactions
window.onload = function() {
    // Connect to WebSocket server
    connectWebSocket();

    const sendButton = document.getElementById('send-button');
    const chatInput = document.getElementById('chat-input');
    const joinButton = document.getElementById('join-button');
    const infoButton = document.getElementById('info-button');
    const roomInput = document.getElementById('room-input');

    function sendChatMessage() {
        const messageText = chatInput.value.trim();
        if (messageText && ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'chat',
                text: messageText
            }));

            chatInput.value = '';
        }
    }

    function sendCommand(command) {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'command',
                command: command
            }));
        }
    }

    sendButton.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });

    joinButton.addEventListener('click', function() {
        const roomId = roomInput.value.trim();
        if (roomId) {
            sendCommand('join ' + roomId);
            roomInput.value = '';
        } else {
            addMessageToChat({
                type: 'system',
                text: 'Please enter a room ID to join'
            });
        }
    });

    infoButton.addEventListener('click', function() {
        sendCommand('info');
    });

    roomInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            joinButton.click();
        }
    });

    // Focus on input for better UX
    chatInput.focus();
};
`;

export const HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BareChat</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        :root {
            --notion-bg: #f7f7f7;
            --notion-text: #37352f;
            --notion-border: rgba(55, 53, 47, 0.16);
            --notion-input-bg: white;
            --notion-button-bg: #37352f;
            --notion-button-text: white;
            --notion-hover-bg: rgba(55, 53, 47, 0.08);
            --notion-active-bg: rgba(55, 53, 47, 0.16);
            --notion-message-bg-other: white;
            --notion-message-bg-me: #e0f2f7; /* Light blue for me */
            --notion-message-bg-system: #f0f0f0; /* Light grey for system */
            --notion-shadow: rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px;
            --notion-radius: 3px;
        }

        body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            font-family: 'Inter', sans-serif;
            background-color: var(--notion-bg);
            color: var(--notion-text);
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .chat-container {
            display: flex;
            flex-direction: column;
            width: 100%;
            max-width: 768px; /* Standard Notion-like width */
            height: 90vh; /* Adjust height for a more document-like feel */
            background-color: var(--notion-input-bg);
            border: 1px solid var(--notion-border);
            box-shadow: var(--notion-shadow);
            border-radius: var(--notion-radius);
            overflow: hidden; /* Ensure content stays within bounds */
        }
        .app-header {
            padding: 20px;
            text-align: center;
            font-size: 1.5em;
            font-weight: 600;
            border-bottom: 1px solid var(--notion-border);
            flex-shrink: 0;
        }
        .status-bar {
            padding: 12px 20px;
            text-align: center;
            background-color: var(--notion-message-bg-system);
            border-bottom: 1px solid var(--notion-border);
            font-size: 0.9em;
            color: var(--notion-text);
            flex-shrink: 0;
        }
        .chat-content {
            flex-grow: 1;
            overflow-y: auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px; /* Space between messages */
        }
        .chat-controls-container {
            display: flex;
            padding: 12px 20px;
            border-top: 1px solid var(--notion-border);
            gap: 10px;
            flex-shrink: 0;
        }
        .chat-input, .room-input {
            flex-grow: 1;
            padding: 10px 12px;
            border: 1px solid var(--notion-border);
            border-radius: var(--notion-radius);
            font-family: 'Inter', sans-serif;
            font-size: 0.95em;
            color: var(--notion-text);
            background-color: var(--notion-input-bg);
            outline: none;
            transition: border-color 0.2s ease;
        }
        .chat-input:focus, .room-input:focus {
            border-color: #37352f; /* Darker border on focus */
        }
        .button {
            padding: 10px 15px;
            background-color: var(--notion-button-bg);
            color: var(--notion-button-text);
            border: none;
            border-radius: var(--notion-radius);
            cursor: pointer;
            font-family: 'Inter', sans-serif;
            font-size: 0.95em;
            font-weight: 500;
            transition: background-color 0.2s ease, opacity 0.2s ease;
        }
        .button:hover {
            background-color: rgba(55, 53, 47, 0.8);
        }
        .button:active {
            background-color: rgba(55, 53, 47, 1);
        }

        .message {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            padding: 8px 0; /* Vertical padding to match Notion list items */
            max-width: calc(100% - 20px); /* Account for padding */
        }
        .message-content {
            padding: 10px 15px;
            border-radius: var(--notion-radius);
            word-wrap: break-word;
            flex-grow: 1;
            box-shadow: rgba(15, 15, 15, 0.02) 0px 1px 1px; /* Subtle Notion-like shadow */
            line-height: 1.5;
            cursor: pointer; /* Indicate it's interactive */
            transition: background-color 0.2s ease;
        }
        .message-content:hover {
            background-color: var(--notion-hover-bg) !important; /* Override background for hover */
        }

        .message-sender {
            font-weight: 600;
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 0.9em;
        }
        .avatar {
            font-size: 1.1em;
            line-height: 1; /* Align emoji better */
        }
        .message-time {
            font-size: 0.75em;
            color: rgba(55, 53, 47, 0.6);
            margin-top: 4px;
            text-align: right; /* Time on the right for all messages */
        }

        /* Other user messages */
        .message.other {
            align-self: flex-start;
        }
        .message.other .message-content {
            background-color: var(--notion-message-bg-other);
            border: 1px solid var(--notion-border);
            color: var(--notion-text);
        }
        .message.other .message-sender {
            color: var(--notion-text);
        }

        /* My messages */
        .message.me {
            align-self: flex-end;
            flex-direction: row-reverse; /* Avatar on the right */
        }
        .message.me .message-content {
            background-color: var(--notion-message-bg-me);
            border: 1px solid rgba(179, 230, 243, 0.8);
            color: var(--notion-text);
        }
        .message.me .message-sender {
            justify-content: flex-end; /* Align sender name to the right */
        }

        /* System messages */
        .message.system {
            align-self: center;
            text-align: center;
            max-width: 80%; /* Smaller width for system messages */
        }
        .message.system .message-content {
            background-color: var(--notion-message-bg-system);
            color: rgba(55, 53, 47, 0.7);
            font-size: 0.8em;
            padding: 8px 12px;
            border: 1px solid rgba(55, 53, 47, 0.08);
        }
        .message.system .message-sender,
        .message.system .message-time {
            display: none; /* Hide for system messages */
        }

        /* Notification styling */
        #copy-notification {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background-color: var(--notion-button-bg);
            color: var(--notion-button-text);
            padding: 10px 20px;
            border-radius: var(--notion-radius);
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
            pointer-events: none;
            font-size: 0.9em;
            box-shadow: var(--notion-shadow);
        }
    </style>
</head>
<body>
    <div class="chat-container">
        <div class="app-header">
            BareChat Web
        </div>

        <div class="chat-controls-container">
            <input type="text" class="room-input" id="room-input" placeholder="Enter room ID to join...">
            <button class="button" id="join-button">Join</button>
            <button class="button" id="info-button">Info</button>
        </div>

        <div class="status-bar" id="status-bar">
            Connecting WebSocket...
        </div>

        <div class="chat-content" id="chat-content">
            <div class="message system">
                <div class="message-content">
                    <div>Welcome to BareChat! Create a new room or join an existing one.</div>
                </div>
            </div>
        </div>

        <div class="chat-controls-container">
            <input type="text" class="chat-input" id="chat-input" placeholder="Type your message...">
            <button class="button" id="send-button">Send</button>
        </div>
    </div>

    <script>
        ${JS}
    </script>
</body>
</html>
`;
