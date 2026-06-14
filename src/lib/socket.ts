import { io, Socket } from 'socket.io-client';
import type { Player } from '../types';

const SOCKET_URL = 'http://localhost:3001';

class SocketManager {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect() {
    if (this.socket?.connected) return this.socket;

    this.socket = io(SOCKET_URL);

    this.socket.on('connect', () => {
      console.log('%c[Socket] Connected to server', 'color:#22c55e');
    });

    this.socket.on('disconnect', () => {
      console.log('%c[Socket] Disconnected', 'color:#ef4444');
    });

    // Forward all server events to registered listeners
    const events = [
      'existing_players',
      'player_joined',
      'player_moved',
      'player_left',
      'chat_message'
    ];

    events.forEach(event => {
      this.socket?.on(event, (data) => {
        this.emit(event, data);
      });
    });

    return this.socket;
  }

  join(player: Omit<Player, 'id' | 'isLocal'>) {
    if (!this.socket) return;
    this.socket.emit('join', player);
  }

  sendMovement(position: [number, number, number], rotation: number) {
    if (!this.socket) return;
    this.socket.emit('player_move', { position, rotation });
  }

  sendChatMessage(text: string, type: 'chat' | 'emote' = 'chat') {
    if (!this.socket) return;
    this.socket.emit('chat_message', {
      text,
      timestamp: Date.now(),
      type
    });
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const callbacks = this.listeners.get(event);
    if (!callbacks) return;
    const index = callbacks.indexOf(callback);
    if (index > -1) callbacks.splice(index, 1);
  }

  private emit(event: string, data: any) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(cb => cb(data));
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
    this.listeners.clear();
  }
}

export const socketManager = new SocketManager();