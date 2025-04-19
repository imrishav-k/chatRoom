class SocketClient {
  constructor() {
    this.socket = null;
    this.auth = new Auth();
    this.init();
  }

  init() {
    if (!this.auth.token) return;

    // Connect to Socket.IO server
    this.socket = io('localhost:3000');

    // Authenticate with JWT
    this.socket.emit('authenticate', this.auth.token);

    // Set up event listeners
    this.socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    this.socket.on('message', (data) => {
      console.log('Received message:', data);
      this.displayMessage(data);
    });

    // Test button
    document.getElementById('sendMessage').addEventListener('click', () => {
      let message = document.getElementById('messageBody').value;
      this.sendMessage(message);
    });
  }

  sendMessage(message) {
    if(this.socket && this.socket.connected) {
      this.socket.emit('message', {
        userId: this.auth.user.id,
        message: message,
        username: this.auth.user.username
      });
    }
  }

  displayMessage(data) {
    const messagesDiv = document.getElementById('chatMessages');
    if (messagesDiv) {
      const messageEl = document.createElement('div');
      messageEl.textContent = `[${new Date().toLocaleTimeString()}] ${data.username}: ${data.message}`;
      messagesDiv.appendChild(messageEl);
    }
  }
}

// Initialize SocketClient when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname === '/dashboard.html') {
    new SocketClient();
  }
});