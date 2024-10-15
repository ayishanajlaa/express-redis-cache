// middlewares/auth.js

const auth = (req, res, next) => {
    if (req.session.userId) {
        // User is authenticated
        return next();
    }
    // User is not authenticated
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
};

module.exports = auth;
