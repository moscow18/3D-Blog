const { query } = require('../config/db');

const getUserStats = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id || id === 'undefined' || isNaN(Number(id))) {
            return res.status(400).json({ message: 'Invalid or missing User ID' });
        }

        // Standard Postgres query
        const result = await query(`
            SELECT 
                (SELECT COUNT(*) FROM Posts WHERE UserId = $1) as "PostCount",
                (SELECT COUNT(*) FROM Likes L JOIN Posts P ON L.PostId = P.Id WHERE P.UserId = $1) as "TotalLikes",
                Name,
                Bio
            FROM Users 
            WHERE Id = $1
        `, [id]);

        if (result.rows.length === 0) {
            console.warn(`[API] User stats requested for non-existent ID: ${id}`);
            return res.status(404).json({ message: `User with ID ${id} not found in database` });
        }

        const stats = result.rows[0];
        res.json({
            PostCount: stats.PostCount || stats.postcount || 0,
            TotalLikes: stats.TotalLikes || stats.totallikes || 0,
            Name: stats.Name || stats.name,
            Bio: stats.Bio || stats.bio
        });
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

        await query(
            'UPDATE Users SET Name = $1, Bio = $2 WHERE Id = $3', 
            [name, bio || '', userId]
        );

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
