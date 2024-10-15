const { createClient } = require('redis');
const dotenv = require('dotenv');

dotenv.config();

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379', // Ensure this URL is correct
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
    try {
        await redisClient.connect();
        console.log('Redis client connected successfully');
    } catch (error) {
        console.error('Error connecting to Redis:', error);
    }
})();

module.exports = redisClient;
