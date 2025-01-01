const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();
connectDB();
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const authMiddleware = require('./middleware/auth');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/user', authMiddleware ,  userRoutes);
app.use('/api/post', authMiddleware, postRoutes);
app.use('/api/notification',authMiddleware, require('./routes/notificationRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});