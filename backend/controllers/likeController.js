const { poolPromise, sql } = require('../config/db');

const toggleLike = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const userId = req.user.id;

        const pool = await poolPromise;
        
        // Check if like already exists
        const likeCheck = await pool.request()
            .input('UserId', sql.Int, userId)
            .input('PostId', sql.Int, postId)
            .query('SELECT * FROM Likes WHERE UserId = @UserId AND PostId = @PostId');

        if (likeCheck.recordset.length > 0) {
            // Unlike
            await pool.request()
                .input('UserId', sql.Int, userId)
                .input('PostId', sql.Int, postId)
                .query('DELETE FROM Likes WHERE UserId = @UserId AND PostId = @PostId');
            
            return res.json({ message: 'Unliked', liked: false });
        } else {
            // Like
            await pool.request()
                .input('UserId', sql.Int, userId)
                .input('PostId', sql.Int, postId)
                .query('INSERT INTO Likes (UserId, PostId) VALUES (@UserId, @PostId)');
            
            return res.json({ message: 'Liked', liked: true });
        }
    } catch (err) {
        console.error('Error toggling like:', err);
        res.status(500).json({ message: 'Server error toggling like' });
    }
};

const getPostLikes = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const userId = req.user ? req.user.id : null;

        const pool = await poolPromise;
        const result = await pool.request()
            .input('PostId', sql.Int, postId)
            .query('SELECT COUNT(*) as count FROM Likes WHERE PostId = @PostId');

        let userLiked = false;
        if (userId) {
            const userCheck = await pool.request()
                .input('UserId', sql.Int, userId)
                .input('PostId', sql.Int, postId)
                .query('SELECT * FROM Likes WHERE UserId = @UserId AND PostId = @PostId');
            userLiked = userCheck.recordset.length > 0;
        }

        res.json({ count: result.recordset[0].count, userLiked });
    } catch (err) {
        console.error('Error fetching likes:', err);
        res.status(500).json({ message: 'Server error fetching likes' });
    }
};

module.exports = {
    toggleLike,
    getPostLikes
};
