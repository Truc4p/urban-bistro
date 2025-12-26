import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

class SocketService {
  constructor() {
    this.socket = null
  }

  connect() {
    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true
    })

    this.socket.on('connect', () => {
      console.log('✅ Socket connected')
      this.socket.emit('join-booking-updates')
    })

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected')
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
    }
  }

  onNewBooking(callback) {
    if (this.socket) {
      this.socket.on('new-booking', callback)
    }
  }

  onBookingCancelled(callback) {
    if (this.socket) {
      this.socket.on('booking-cancelled', callback)
    }
  }
}

export default new SocketService()
