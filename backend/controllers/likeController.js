const { query } = require('../config/db');

const toggleLike = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const userId = req.user.id;

        // Check if like already exists
        const likeCheck = await query(
            'SELECT * FROM Likes WHERE UserId = $1 AND PostId = $2', 
            [userId, postId]
        );

        if (likeCheck.rows.length > 0) {
            // Unlike
            await query(
                'DELETE FROM Likes WHERE UserId = $1 AND PostId = $2', 
                [userId, postId]
            );
            
            return res.json({ message: 'Unliked', liked: false });
        } else {
            // Like
            await query(
                'INSERT INTO Likes (UserId, PostId) VALUES ($1, $2)', 
                [userId, postId]
            );
            
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

        const result = await query(
            'SELECT COUNT(*) as count FROM Likes WHERE PostId = $1', 
            [postId]
        );

        let userLiked = false;
        if (userId) {
            const userCheck = await query(
                'SELECT * FROM Likes WHERE UserId = $1 AND PostId = $2', 
                [userId, postId]
            );
            userLiked = userCheck.rows.length > 0;
        }

        res.json({ count: parseInt(result.rows[0].count), userLiked });
    } catch (err) {
        console.error('Error fetching likes:', err);
        res.status(500).json({ message: 'Server error fetching likes' });
    }
};

module.exports = {
    toggleLike,
    getPostLikes
};
