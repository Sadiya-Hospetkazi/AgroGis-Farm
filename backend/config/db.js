const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is missing');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.query('select 1')
  .then(() => console.log('✅ Database connected'))
  .catch(err => {
    console.error('❌ Database connection failed', err);
    process.exit(1);
  });

module.exports = pool;