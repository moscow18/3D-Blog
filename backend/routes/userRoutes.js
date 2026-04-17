const express = require('express');
const router = express.Router();
const { getUserStats, updateProfile } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

// Public route to get stats (anyone can view profile stats)
router.get('/:id/stats', getUserStats);

// Protected route to update own profile
router.put('/profile', auth, updateProfile);

module.exports = router;
