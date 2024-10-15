const redisClient = require('../utils/redisClient');

const cache = async (req, res, next) => {
    const { id } = req.params;

    try {
        const data = await redisClient.get(id);
        if (data) {
            return res.json(JSON.parse(data));
        } else {
            next();
        }
    } catch (err) {
        console.error('Error fetching from Redis:', err);
        next();
    }
};

module.exports = cache;
