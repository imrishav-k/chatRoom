const mysql = require('mysql2/promise');
require('dotenv').config();

class Database {
	constructor() {
		this.pool = mysql.createPool({
			host: process.env.DB_HOST || 'localhost',
			user: process.env.DB_USER || 'root',
			password: process.env.DB_PASSWORD || '',
			database: process.env.DB_NAME || 'auth',
			waitForConnections: true,
			connectionLimit: 10,
			queueLimit: 0
		});
	}

	async query(sql, params) {
		const [rows] = await this.pool.execute(sql, params);
		return rows;
	}
}

module.exports = new Database();