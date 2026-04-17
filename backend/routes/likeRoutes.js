const express = require('express');
const router = express.Router({ mergeParams: true });
const { toggleLike, getPostLikes } = require('../controllers/likeController');
const auth = require('../middleware/authMiddleware');

router.get('/', getPostLikes);
router.post('/', auth, toggleLike);

module.exports = router;
