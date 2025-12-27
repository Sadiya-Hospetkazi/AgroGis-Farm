const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.query('SELECT 1')
    .then(() => console.log('✅ Database connected'))
    .catch(err => console.error('❌ Database error:', err));

module.exports = pool;