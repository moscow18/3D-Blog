require('dotenv').config({ path: './backend/.env' });
const { poolPromise, sql } = require('./backend/config/db');

async function checkUser() {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('Id', sql.Int, 1)
            .query('SELECT * FROM Users WHERE Id = @Id');
        
        console.log('User 1 query result:', result.recordset);
        
        const allUsers = await pool.request().query('SELECT Id, Name, Email FROM Users');
        console.log('All users in DB:', allUsers.recordset);
        
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkUser();
