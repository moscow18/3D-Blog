const { poolPromise, sql } = require('../config/db');

const getUserStats = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id || id === 'undefined' || isNaN(Number(id))) {
            return res.status(400).json({ message: 'Invalid or missing User ID' });
        }

        const pool = await poolPromise;
        
        // standard query instead of FOR JSON PATH for better compatibility
        const result = await pool.request()
            .input('UserId', sql.Int, id)
            .query(`
                SELECT 
                    (SELECT COUNT(*) FROM Posts WHERE UserId = @UserId) as PostCount,
                    (SELECT COUNT(*) FROM Likes L JOIN Posts P ON L.PostId = P.Id WHERE P.UserId = @UserId) as TotalLikes,
                    Name,
                    Bio
                FROM Users 
                WHERE Id = @UserId
            `);

        if (result.recordset.length === 0) {
            console.warn(`[API] User stats requested for non-existent ID: ${id}`);
            return res.status(404).json({ message: `User with ID ${id} not found in database` });
        }

        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Error fetching user stats:', err);
        res.status(500).json({ message: 'Server error fetching user stats' });
    }
};

/**
 * Update current user profile
 */
const updateProfile = async (req, res) => {
    try {
        const { name, bio } = req.body;
        const userId = req.user.id; // From authMiddleware

        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        const pool = await poolPromise;
        await pool.request()
            .input('Id', sql.Int, userId)
            .input('Name', sql.NVarChar, name)
            .input('Bio', sql.NVarChar, bio || '')
            .query('UPDATE Users SET Name = @Name, Bio = @Bio WHERE Id = @Id');

        res.json({ message: 'Profile updated successfully' });
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ message: 'Server error updating profile' });
    }
};

module.exports = {
    getUserStats,
    updateProfile
};
