const io = require('socket.io');
class SocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = {};
  }

  initialize(server) {
    this.io = io(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    this.io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);

      // Handle user authentication with JWT
      socket.on('authenticate', (token) => {
        try {
          const decoded = require('./AuthService').verifyToken(token);
          this.connectedUsers[decoded.id] = socket.id;
          console.log(`User authenticated: ${decoded.id}`);
        } catch (err) {
          console.error('Authentication error:', err.message);
        }
      });

      socket.on('message', (data) => {
        console.log(`Message from userId: ${data.userId}, username: ${data.username}, message: ${data.message}`);
        this.io.emit('message', data);
      });

      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        for (const [userId, socketId] of Object.entries(this.connectedUsers)) {
          if (socketId === socket.id) {
            delete this.connectedUsers[userId];
            break;
          }
        }
      });
    });
  }

  getIO() {
    if (!this.io) {
      throw new Error('Socket.io not initialized');
    }
    return this.io;
  }

  getUserSocket(userId) {
    return this.connectedUsers[userId];
  }

  emitToUser(userId, event, data) {
    const socketId = this.getUserSocket(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
    }
  }
}

module.exports = new SocketService();