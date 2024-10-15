const User = require('../models/User');
const redisClient = require('../utils/redisClient');

// Create User
exports.createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get User by ID with caching
exports.getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const cachedUser = await redisClient.get(id);
        if (cachedUser) {
            return res.json(JSON.parse(cachedUser));
        }

        const user = await User.findById(id);
        if (user) {
            redisClient.setEx(id, 3600, JSON.stringify(user)); // Cache for 1 hour
            return res.json(user);
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// Update User
exports.updateUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (user) {
            redisClient.setEx(id, 3600, JSON.stringify(user));
            return res.json(user);
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

// Delete User
exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndDelete(id);
        if (user) {
            redisClient.del(id);
            return res.status(204).send();
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// Add this function to handle user login
exports.loginUser = async (req, res) => {
    const { name } = req.body;

    try {
        const user = await User.findOne({ name });
        if (user) {
            req.session.userId = user._id; // Store user ID in session
            return res.json({ message: 'Logged in successfully', user });
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// Add a logout function
exports.logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.json({ message: 'Logged out successfully' });
    });
};

