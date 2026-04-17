const express = require('express');
const router = express.Router({ mergeParams: true });
const { addComment, getCommentsByPost, deleteComment } = require('../controllers/commentController');
const auth = require('../middleware/authMiddleware');

router.get('/', getCommentsByPost);
router.post('/', auth, addComment);
router.delete('/:id', auth, deleteComment);

module.exports = router;
