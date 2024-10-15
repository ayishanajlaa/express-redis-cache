const express = require('express');
const connectDB = require('./config/db');
const sessionConfig = require('./config/session');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const redisClient = require('./utils/redisClient');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(sessionConfig);

// Routes
app.use('/users', userRoutes);
app.use('/products', productRoutes);

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('Shutting down gracefully...');
    await redisClient.quit();
    process.exit(0);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
