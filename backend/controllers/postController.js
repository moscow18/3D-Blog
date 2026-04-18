const { query } = require('../config/db');

const getAllPosts = async (req, res) => {
    try {
        const { search, tag, userId } = req.query;
        let params = [];
        let queryStr = `
            SELECT 
                p.Id AS "Id", 
                p.Title AS "Title", 
                p.Content AS "Content", 
                p.ImageUrl AS "ImageUrl", 
                p.Tags AS "Tags", 
                p.UserId AS "UserId", 
                p.CreatedAt AS "CreatedAt", 
                p.UpdatedAt AS "UpdatedAt",
                u.Name as "AuthorName" 
            FROM Posts p 
            JOIN Users u ON p.UserId = u.Id 
            WHERE 1=1
        `;

        if (search) {
            params.push(`%${search}%`);
            queryStr += ` AND (p.Title ILIKE $${params.length} OR p.Content ILIKE $${params.length})`;
        }

        if (tag) {
            params.push(`%${tag}%`);
            queryStr += ` AND p.Tags ILIKE $${params.length}`;
        }

        if (userId) {
            params.push(userId);
            queryStr += ` AND p.UserId = $${params.length}`;
        }

        queryStr += ` ORDER BY p.CreatedAt DESC`;

        const result = await query(queryStr, params);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ message: 'Server error fetching posts' });
    }
};

const getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query(`
            SELECT 
                p.Id AS "Id", 
                p.Title AS "Title", 
                p.Content AS "Content", 
                p.ImageUrl AS "ImageUrl", 
                p.Tags AS "Tags", 
                p.UserId AS "UserId", 
                p.CreatedAt AS "CreatedAt", 
                p.UpdatedAt AS "UpdatedAt",
                u.Name as "AuthorName" 
            FROM Posts p 
            JOIN Users u ON p.UserId = u.Id 
            WHERE p.Id = $1
        `, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching post:', err);
        res.status(500).json({ message: 'Server error fetching post' });
    }
};

const createPost = async (req, res) => {
    try {
        const { title, content, imageUrl, tags } = req.body;
        const userId = req.user.id; 

        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        await query(
            'INSERT INTO Posts (Title, Content, ImageUrl, Tags, UserId) VALUES ($1, $2, $3, $4, $5)', 
            [title, content, imageUrl || '', tags || '', userId]
        );

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

        const postCheck = await query('SELECT UserId FROM Posts WHERE Id = $1', [id]);

        if (postCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const row = postCheck.rows[0];
        const postOwnerId = row.UserId || row.userid;

        if (postOwnerId !== userId) {
            return res.status(403).json({ message: 'Not authorized to update this post' });
        }

        await query(
            'UPDATE Posts SET Title = $1, Content = $2, ImageUrl = $3, Tags = $4, UpdatedAt = NOW() WHERE Id = $5', 
            [title, content, imageUrl, tags || '', id]
        );

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

        const postCheck = await query('SELECT UserId FROM Posts WHERE Id = $1', [id]);

        if (postCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const row = postCheck.rows[0];
        const postOwnerId = row.UserId || row.userid;

        if (postOwnerId !== userId) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }

        await query('DELETE FROM Posts WHERE Id = $1', [id]);

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
