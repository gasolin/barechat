import { getBackend } from 'barechat-core'
import * as b4a from 'b4a'


// Initialize backend functionality from chat-core
const {
    swarm,
    getMemberId,
    joinRoom,
    sendMessage,
    version
} = getBackend()

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

// Reference to the chat room topic
let currentRoomTopic = null

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

// Function to show a temporary notification
function showCopyNotification(text = 'Message copied!') {
    const notificationId = 'copy-notification';
    let notification = document.getElementById(notificationId);

    if (!notification) {
        notification = document.createElement('div');
        notification.id = notificationId;
        notification.textContent = text;
        notification.style.cssText = `
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
            box-shadow: var(--notion-shadow);
        `;
        document.body.appendChild(notification);
    } else {
        notification.textContent = text;
    }

    notification.style.transition = 'none';
    notification.style.opacity = 1;

    setTimeout(() => {
        notification.style.transition = 'opacity 0.5s ease-in-out';
        notification.style.opacity = 0;
    }, 2000);
}

// Function to add a message to the chat
function addMessageToChat(messageData) {
    const chatContent = document.getElementById('chat-content');
    const { type, sender, text } = messageData;

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
        const isMe = sender === 'me';
        messageDiv.className = 'message ' + (isMe ? 'me' : 'other');

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';

        const senderDiv = document.createElement('div');
        senderDiv.className = 'message-sender';

        const avatarSpan = document.createElement('span');
        avatarSpan.className = 'avatar';
        avatarSpan.textContent = getAvatar(sender);

        const nameSpan = document.createElement('span');
        nameSpan.textContent = isMe ? 'You' : sender;

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

    chatContent.appendChild(messageDiv);
    chatContent.scrollTop = chatContent.scrollHeight;
}

// Function to update the status bar
function updateStatusBar(text) {
    const statusBar = document.getElementById('status-bar');
    if (statusBar) {
        statusBar.textContent = text;
    }
}

// --- Networking ---

swarm.on('connection', peer => {
    const memberId = getMemberId(peer)
    console.log(`[info] New peer ${memberId} joined`)

    peer.on('data', rawData => {
        try {
            const event = JSON.parse(b4a.toString(rawData, 'utf8'))
            addMessageToChat({ type: 'message', sender: memberId, text: event.message })
        } catch (error) {
            console.error('Error processing peer data:', error)
        }
    })

    updateStatusBar(`Connected peers: ${swarm.connections.size}`)
})

swarm.on('update', () => {
    updateStatusBar(`Connected peers: ${swarm.connections.size}`)
})

async function handleJoin(roomId) {
    const { done, topic } = await joinRoom(roomId || '')
    if (done) {
        currentRoomTopic = topic
        addMessageToChat({ type: 'system', text: `Joined chat room: ${topic}` })
    } else {
        addMessageToChat({ type: 'system', text: 'Failed to join chat room' })
    }
}

// UI Setup
const sendButton = document.getElementById('send-button');
const chatInput = document.getElementById('chat-input');
const joinButton = document.getElementById('join-button');
const infoButton = document.getElementById('info-button');
const roomInput = document.getElementById('room-input');

function sendChatMessage() {
    const messageText = chatInput.value.trim();
    if (messageText) {
        sendMessage(messageText)
        addMessageToChat({ type: 'message', sender: 'me', text: messageText })
        chatInput.value = '';
    }
}

sendButton.addEventListener('click', sendChatMessage);
chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendChatMessage() });

joinButton.addEventListener('click', () => {
    const roomId = roomInput.value.trim();
    handleJoin(roomId);
    roomInput.value = '';
    updateJoinButtonState();
});

const updateJoinButtonState = () => {
    joinButton.disabled = !roomInput.value.trim();
};

roomInput.addEventListener('input', updateJoinButtonState);
updateJoinButtonState();

infoButton.addEventListener('click', () => {
    addMessageToChat({
        type: 'system',
        text: `BareChat v.${version}\nCurrent room: ${currentRoomTopic || 'None'}\nConnected peers: ${swarm.connections.size}`
    })
});

roomInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') joinButton.click() });

chatInput.focus();
updateStatusBar('Ready');
