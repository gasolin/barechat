import crypto from 'hypercore-crypto';
import b4a from 'b4a';

export function generatePeerId(publicKey: Buffer): string {
  return b4a.toString(publicKey, 'hex').substring(0, 6);
}

export function generateTopicHash(roomName: string): string {
  return b4a.toString(crypto.hash(b4a.from(roomName)), 'hex');
}

export function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function isValidTopicHash(topic: string): boolean {
  return /^[a-f0-9]{64}$/i.test(topic);
}