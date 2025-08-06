import { io, Socket } from 'socket.io-client';
import { Order } from '../types';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
    this.socket = io(socketUrl);

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onOrderCompleted(callback: (order: Order) => void) {
    if (this.socket) {
      this.socket.on('orderCompleted', callback);
    }
  }

  onOrderFailed(callback: (order: Order) => void) {
    if (this.socket) {
      this.socket.on('orderFailed', callback);
    }
  }

  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }
}

export default new SocketService();