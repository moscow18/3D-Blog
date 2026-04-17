const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER || '127.0.0.1', 
    port: 1433, // استخدام المنفذ الافتراضي الذي سنثبته الآن
    database: process.env.DB_NAME,
    options: {
        encrypt: false, 
        trustServerCertificate: true,
        connectTimeout: 30000 
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('✅ Connected successfully to SQL Server');
        return pool;
    })
    .catch(err => {
        console.error('❌ Database Connection Failed! Error: ', err.message);
        process.exit(1);
    });

module.exports = {
    sql, poolPromise
};
