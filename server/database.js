const Pool = require('pg').Pool;
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'sql',
  database: process.env.DATABASE || 'male',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || '5430',
});

console.log(process.env.DB_HOST)
console.log(process.env.DB_PORT)

module.exports = { pool };
