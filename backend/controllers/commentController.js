const { poolPromise, sql } = require('../config/db');

const addComment = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const { content } = req.body;
        const userId = req.user.id; // From authMiddleware

        if (!content) {
            return res.status(400).json({ message: 'Comment content is required' });
        }

        const pool = await poolPromise;
        await pool.request()
            .input('Content', sql.NVarChar, content)
            .input('UserId', sql.Int, userId)
            .input('PostId', sql.Int, postId)
            .query('INSERT INTO Comments (Content, UserId, PostId) VALUES (@Content, @UserId, @PostId)');

        res.status(201).json({ message: 'Comment added successfully' });
    } catch (err) {
        console.error('Error adding comment:', err);
        res.status(500).json({ message: 'Server error adding comment' });
    }
};

const getCommentsByPost = async (req, res) => {
    try {
        const { id: postId } = req.params;

        const pool = await poolPromise;
        const result = await pool.request()
            .input('PostId', sql.Int, postId)
            .query(`
                SELECT C.*, U.Name as AuthorName 
                FROM Comments C 
                JOIN Users U ON C.UserId = U.Id 
                WHERE C.PostId = @PostId 
                ORDER BY C.CreatedAt DESC
            `);

        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching comments:', err);
        res.status(500).json({ message: 'Server error fetching comments' });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { id: commentId } = req.params;
        const userId = req.user.id;

        const pool = await poolPromise;
        
        // Only allow deleted by author
        const commentCheck = await pool.request()
            .input('Id', sql.Int, commentId)
            .query('SELECT UserId FROM Comments WHERE Id = @Id');

        if (commentCheck.recordset.length === 0) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (commentCheck.recordset[0].UserId !== userId) {
            return res.status(403).json({ message: 'Unauthorized to delete this comment' });
        }

        await pool.request()
            .input('Id', sql.Int, commentId)
            .query('DELETE FROM Comments WHERE Id = @Id');

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
