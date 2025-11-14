import ws from 'bare-ws'

// Broadcast message to all connected WebSocket clients
export function broadcastMessage(activeConnections, message) {
  const messageStr = JSON.stringify(message);
  for (const socket of activeConnections) {
    try {
      socket.write(messageStr);
    } catch (error) {
      console.error('Error sending to WebSocket client:', error);
    }
  }
}

// Create WebSocket server that shares the HTTP server's port
export function createWebSocketServer({
  webServer: server,
  activeConnections,
  currentRoomTopic,
  handleCommand,
  sendMessage
}) {
  const wsServer = new ws.Server({ server }, socket => {
    console.log('[WebSocket] New client connected');
    activeConnections.add(socket);

    // Send welcome message and room information
    if (currentRoomTopic) {
      socket.write(JSON.stringify({
        type: 'system',
        text: `Current room: ${currentRoomTopic}`
      }));
    } else {
      socket.write(JSON.stringify({
        type: 'system',
        text: 'No room joined yet.'
      }));
    }

    // Handle WebSocket messages from clients
    socket.on('data', data => {
      try {
        const message = JSON.parse(data.toString());

        if (message.type === 'command') {
          handleCommand(message.command, socket);
        } else if (message.type === 'chat') {
          // Handle chat message
          sendMessage(message.text)
          // Broadcast to all clients including sender (with "me" as sender)
          broadcastMessage(activeConnections, { type: 'message', sender: 'me', text: message
.text })
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });

    socket.on('close', () => {
      console.log('[WebSocket] Client disconnected');
      activeConnections.delete(socket);
    });

    socket.on('error', error => {
      console.error('[WebSocket] Error:', error);
      activeConnections.delete(socket);
    });
  });

  // Return wsServer so it can be closed on process exit
  return wsServer;
}
