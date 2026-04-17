const { Pool } = require('pg');
require('dotenv').config();

// Use DATABASE_URL from environment variables
const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isProduction ? { rejectUnauthorized: false } : false
});

// Test connection
pool.connect()
    .then(() => console.log('✅ Connected successfully to PostgreSQL (Supabase)'))
    .catch(err => {
        console.error('❌ PostgreSQL Connection Failed! Error: ', err.message);
        // Don't exit process in dev if possible, but for server it's critical
        if (isProduction) process.exit(1);
    });

module.exports = {
    query: (text, params) => pool.query(text, params),
    poolPromise: Promise.resolve(pool) // Helper for transitioning from mssql code
};
