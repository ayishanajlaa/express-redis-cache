const session = require('express-session');
const RedisStore = require('connect-redis').default; // Use .default for newer versions
const redisClient = require('../utils/redisClient');
const dotenv = require('dotenv');

dotenv.config();

const sessionConfig = session({
    store: new RedisStore({ client: redisClient }), // Ensure the client is connected
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60, // 1 hour
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    },
});

module.exports = sessionConfig;
