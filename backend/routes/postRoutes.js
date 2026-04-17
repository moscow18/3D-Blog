const express = require('express');
const router = express.Router();
const { getAllPosts, getPostById, createPost, updatePost, deletePost } = require('../controllers/postController');
const auth = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllPosts);
router.get('/:id', getPostById);

// Protected routes
router.post('/', auth, createPost);
router.put('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);

module.exports = router;
