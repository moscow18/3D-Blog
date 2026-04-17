const { query } = require('../config/db');

const addComment = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const { content } = req.body;
        const userId = req.user.id; 

        if (!content) {
            return res.status(400).json({ message: 'Comment content is required' });
        }

        await query(
            'INSERT INTO Comments (Content, UserId, PostId) VALUES ($1, $2, $3)', 
            [content, userId, postId]
        );

        res.status(201).json({ message: 'Comment added successfully' });
    } catch (err) {
        console.error('Error adding comment:', err);
        res.status(500).json({ message: 'Server error adding comment' });
    }
};

const getCommentsByPost = async (req, res) => {
    try {
        const { id: postId } = req.params;

        const result = await query(`
            SELECT C.*, U.Name as "AuthorName" 
            FROM Comments C 
            JOIN Users U ON C.UserId = U.Id 
            WHERE C.PostId = $1 
            ORDER BY C.CreatedAt DESC
        `, [postId]);

        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching comments:', err);
        res.status(500).json({ message: 'Server error fetching comments' });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { id: commentId } = req.params;
        const userId = req.user.id;
        
        // Only allow deleted by author
        const commentCheck = await query('SELECT UserId FROM Comments WHERE Id = $1', [commentId]);

        if (commentCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (commentCheck.rows[0].userid !== userId && commentCheck.rows[0].UserId !== userId) {
            return res.status(403).json({ message: 'Unauthorized to delete this comment' });
        }

        await query('DELETE FROM Comments WHERE Id = $1', [commentId]);

        res.json({ message: 'Comment deleted successfully' });
    } catch (err) {
        console.error('Error deleting comment:', err);
        res.status(500).json({ message: 'Server error deleting comment' });
    }
};

module.exports = {
    addComment,
    getCommentsByPost,
    deleteComment
};
