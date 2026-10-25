export interface Message {
  _id: string | number;
  text: string;
  createdAt: Date;
  user: {
    _id: string | number;
    name: string;
    avatar?: string;
  };
}

export interface Peer {
  id: string;
  publicKey: Buffer;
  connected: boolean;
}

export interface ChatRoom {
  topic: string;
  name?: string;
  peers: Peer[];
  messages: Message[];
}

export interface P2PService {
  connect(topic: string): Promise<void>;
  disconnect(): void;
  sendMessage(message: string): void;
  onMessage(callback: (message: Message) => void): void;
  onPeerConnect(callback: (peer: Peer) => void): void;
  onPeerDisconnect(callback: (peerId: string) => void): void;
  getPeers(): Peer[];
  isConnected(): boolean;
}