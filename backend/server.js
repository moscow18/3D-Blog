const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { poolPromise } = require('./config/db');

dotenv.config();
const app = express();

// Routes
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const likeRoutes = require('./routes/likeRoutes');
const commentRoutes = require('./routes/commentRoutes');
const userRoutes = require('./routes/userRoutes');

// Middleware
app.use(cors());
app.use(express.json());

// Routes Middleware
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/posts/:id/likes', likeRoutes);
app.use('/api/posts/:id/comments', commentRoutes);
app.use('/api/users', userRoutes);

// Test Route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to 3D Blog API' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
