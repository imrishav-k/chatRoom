const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

class AuthService {
  constructor() {
    this.secret = process.env.JWT_SECRET;
    this.expiresIn = '1h';
  }

  async register(username, email, password) {
    const userExists = await User.findByEmail(email);
    if (userExists) {
      throw new Error('User already exists');
    }

    const user = new User(username, email, password);
    const userId = await user.save();
    return { id: userId, username, email };
  }

  async login(email, password) {
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await User.comparePasswords(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user);
    return {
      user: { id: user.id, username: user.username, email: user.email },
      token
    };
  }

  generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email },
      this.secret,
      { expiresIn: this.expiresIn }
    );
  }

  verifyToken(token) {
    console.log(this);
    return jwt.verify(token, this.secret);
  }
}

module.exports = new AuthService();