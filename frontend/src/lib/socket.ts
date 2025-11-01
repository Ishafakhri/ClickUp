import { io, Socket } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

class SocketService {
  private socket: Socket | null = null

  connect(token: string) {
    this.socket = io(SOCKET_URL, {
      auth: { token },
    })

    this.socket.on('connect', () => {
      console.log('Connected to socket server')
    })

    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server')
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  getSocket() {
    return this.socket
  }
}

export const socketService = new SocketService()
