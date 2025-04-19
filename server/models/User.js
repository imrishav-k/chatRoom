const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  constructor(username, email, password) {
    this.username = username;
    this.email = email;
    this.password = password;
  }

  async save() {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    const result = await db.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [this.username, this.email, hashedPassword]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const users = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return users[0];
  }

  static async findById(id) {
    const users = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return users[0];
  }

  static async comparePasswords(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}

module.exports = User;