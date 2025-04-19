const app = require('./app');
const http = require('http');
const SocketService = require('./services/SocketService');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

// Initialize Socket.io
SocketService.initialize(server);

server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});