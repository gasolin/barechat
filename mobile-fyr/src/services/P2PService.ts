import { Message, Peer, P2PService } from '../types';
// @ts-ignore
import { getBackend } from 'barechat/lib/chat-core';
import b4a from 'b4a';

export class MobileP2PService implements P2PService {
  private backend: any = null;
  private messageCallbacks: ((message: Message) => void)[] = [];
  private peerConnectCallbacks: ((peer: Peer) => void)[] = [];
  private peerDisconnectCallbacks: ((peerId: string) => void)[] = [];
  private topic: string = '';
  private userPeerId: string = '';

  constructor() {
    // Initialize backend with no bootstrap options for now (uses default)
    this.backend = getBackend();
    this.userPeerId = this.backend.getMemberId(null); // Initial ID might be invalid until connected
  }

  async connect(topic: string): Promise<void> {
    try {
      const { done, topic: joinedTopic } = await this.backend.joinRoom(topic);

      if (done) {
        this.topic = joinedTopic;
        console.log(`[info] Connected to topic: ${this.topic}`);

        // Setup event listeners on the swarm
        this.backend.swarm.on('connection', (peer: any) => {
          const peerId = this.backend.getMemberId(peer);

          // Update user ID if it's the first connection (approximate)
          if (this.userPeerId === 'invalid') {
            // In P2P, we don't exactly have a "self" ID in the same way, 
            // but we can derive one or just use a random one as before if needed.
            // For now, let's keep the random one from before or use a generated one.
          }

          const peerObj: Peer = {
            id: peerId,
            publicKey: peer.remotePublicKey,
            connected: true
          };

          this.peerConnectCallbacks.forEach(callback => callback(peerObj));

          peer.on('data', (data: any) => {
            try {
              const event = JSON.parse(b4a.toString(data));
              // chat-core sends { timestamp, message, local, messageType }
              // We need to map it to our Message type
              const message: Message = {
                _id: Date.now().toString() + Math.random(), // Generate unique ID
                text: event.message,
                createdAt: new Date(event.timestamp),
                user: {
                  _id: peerId,
                  name: peerId
                }
              };
              this.messageCallbacks.forEach(callback => callback(message));
            } catch (error) {
              console.error('[error] Failed to parse message:', error);
            }
          });

          peer.on('close', () => {
            this.peerDisconnectCallbacks.forEach(callback => callback(peerId));
          });
        });

        // Set user ID (chat-core doesn't expose self key easily without a connection, 
        // but we can generate a random one for UI purposes if needed, 
        // or just use "Me")
        this.userPeerId = "Me";
      } else {
        throw new Error('Failed to join room');
      }
    } catch (error) {
      console.error('[error] Failed to connect:', error);
      throw error;
    }
  }

  disconnect(): void {
    if (this.backend && this.backend.swarm) {
      this.backend.swarm.destroy();
      // Re-initialize backend for next connection
      this.backend = getBackend();
    }
    console.log('[info] Disconnected from chat room');
  }

  sendMessage(text: string): void {
    if (!this.backend) {
      throw new Error('Not connected to any chat room');
    }
    this.backend.sendMessage(text);
  }

  onMessage(callback: (message: Message) => void): void {
    this.messageCallbacks.push(callback);
  }

  onPeerConnect(callback: (peer: Peer) => void): void {
    this.peerConnectCallbacks.push(callback);
  }

  onPeerDisconnect(callback: (peerId: string) => void): void {
    this.peerDisconnectCallbacks.push(callback);
  }

  getPeers(): Peer[] {
    if (!this.backend || !this.backend.swarm) return [];

    const peers: Peer[] = [];
    for (const peer of this.backend.swarm.connections) {
      peers.push({
        id: this.backend.getMemberId(peer),
        publicKey: peer.remotePublicKey,
        connected: true
      });
    }
    return peers;
  }

  isConnected(): boolean {
    return this.backend && this.backend.swarm && this.backend.swarm.connections.size > 0;
  }

  getUserPeerId(): string {
    return this.userPeerId;
  }
}