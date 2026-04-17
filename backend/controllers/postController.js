const { poolPromise, sql } = require('../config/db');

const getAllPosts = async (req, res) => {
    try {
        const { search, tag, userId } = req.query;
        const pool = await poolPromise;
        const request = pool.request();
        
        let query = `
            SELECT P.*, U.Name as AuthorName 
            FROM Posts P 
            JOIN Users U ON P.UserId = U.Id 
            WHERE 1=1
        `;

        if (search) {
            request.input('Search', sql.NVarChar, `%${search}%`);
            query += ` AND (P.Title LIKE @Search OR P.Content LIKE @Search)`;
        }

        if (tag) {
            request.input('Tag', sql.NVarChar, `%${tag}%`);
            query += ` AND P.Tags LIKE @Tag`;
        }

        if (userId) {
            request.input('UserId', sql.Int, userId);
            query += ` AND P.UserId = @UserId`;
        }

        query += ` ORDER BY P.CreatedAt DESC`;

        const result = await request.query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ message: 'Server error fetching posts' });
    }
};

const getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await poolPromise;
        const result = await pool.request()
            .input('Id', sql.Int, id)
            .query(`
                SELECT P.*, U.Name as AuthorName 
                FROM Posts P 
                JOIN Users U ON P.UserId = U.Id 
                WHERE P.Id = @Id
            `);
        
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Error fetching post:', err);
        res.status(500).json({ message: 'Server error fetching post' });
    }
};

const createPost = async (req, res) => {
    try {
        const { title, content, imageUrl, tags } = req.body;
        const userId = req.user.id; // From authMiddleware

        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        const pool = await poolPromise;
        await pool.request()
            .input('Title', sql.NVarChar, title)
            .input('Content', sql.NVarChar, content)
            .input('ImageUrl', sql.NVarChar, imageUrl || '')
            .input('Tags', sql.NVarChar, tags || '')
            .input('UserId', sql.Int, userId)
            .query('INSERT INTO Posts (Title, Content, ImageUrl, Tags, UserId) VALUES (@Title, @Content, @ImageUrl, @Tags, @UserId)');

        res.status(201).json({ message: 'Post created successfully' });
    } catch (err) {
        console.error('Error creating post:', err);
        res.status(500).json({ message: 'Server error creating post' });
    }
};

const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, imageUrl, tags } = req.body;
        const userId = req.user.id;

        const pool = await poolPromise;
        
        // Check if post belongs to user
        const postCheck = await pool.request()
            .input('Id', sql.Int, id)
            .query('SELECT UserId FROM Posts WHERE Id = @Id');

        if (postCheck.recordset.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (postCheck.recordset[0].UserId !== userId) {
            return res.status(403).json({ message: 'Not authorized to update this post' });
        }

        await pool.request()
            .input('Id', sql.Int, id)
            .input('Title', sql.NVarChar, title)
            .input('Content', sql.NVarChar, content)
            .input('ImageUrl', sql.NVarChar, imageUrl)
            .input('Tags', sql.NVarChar, tags || '')
            .query('UPDATE Posts SET Title = @Title, Content = @Content, ImageUrl = @ImageUrl, Tags = @Tags, UpdatedAt = GETDATE() WHERE Id = @Id');

        res.json({ message: 'Post updated successfully' });
    } catch (err) {
        console.error('Error updating post:', err);
        res.status(500).json({ message: 'Server error updating post' });
    }
};

const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const pool = await poolPromise;
        
        // Check if post belongs to user
        const postCheck = await pool.request()
            .input('Id', sql.Int, id)
            .query('SELECT UserId FROM Posts WHERE Id = @Id');

        if (postCheck.recordset.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (postCheck.recordset[0].UserId !== userId) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }

        await pool.request()
            .input('Id', sql.Int, id)
            .query('DELETE FROM Posts WHERE Id = @Id');

        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        console.error('Error deleting post:', err);
        res.status(500).json({ message: 'Server error deleting post' });
    }
};

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
};
