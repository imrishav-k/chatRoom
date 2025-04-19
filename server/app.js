const express = require('express');
const cors = require('cors');
const authRoutes = require('./controllers/AuthController');
const authService = require('./services/AuthService');
require('./config/db');

class App {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(express.static("public"));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  setupRoutes() {
    this.app.post('/api/auth/register', authRoutes.register);
    this.app.post('/api/auth/login', authRoutes.login);
    this.app.get('/api/auth/profile', authRoutes.jwtVerify, authRoutes.profile);
  }
}

module.exports = new App().app;