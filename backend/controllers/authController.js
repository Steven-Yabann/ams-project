// controllers/authController.js

const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

exports.loginUser = async (req, res) => {
    console.log("Received login body:", req.body);
    const { admissionNumber, password } = req.body;

    try {
        // Find user by admission number
        const user = await User.findOne({ admissionNumber });
        if (!user) {
            return res.status(400).json({ message: "Invalid admission number" });
        }

        // Check password
        const isMatch = password === user.password;
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // If valid, return user data (excluding password for security)
        const userData = {
            id: user._id,
            email: user.email,
            admissionNumber: user.admissionNumber,
            userCategory: user.userCategory,
        };

        res.status(200).json(userData);
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
