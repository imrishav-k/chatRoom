const AuthService = require('../services/AuthService');
const User = require('../models/User');

class AuthController {
  async register(req, res) {
    try {
      const { username, email, password } = req.body;
      const user = await AuthService.register(username, email, password);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      console.log('password: ', password);
      const result = await AuthService.login(email, password);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(401).json({ success: false, error: error.message });
    }
  }

  async profile(req, res) {
    try {
      const user = await User.findById(req.query.user.id);
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      res.json({
        success: true,
        data: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
  
  async jwtVerify(req, res, next) {
    try {
      const token = req.headers['authorization'].split(' ')[1];
      const decoded = AuthService.verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ success: false, error: error.message });
    }
  }
}

module.exports = new AuthController();