// profileController.js
const Profile = require('../models/profileModel');
const Student = require('../models/studentModel'); // Already exists in your project

// Get profile
const getProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        const profile = await Profile.findOne({ userId }).populate('userId');
        
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }
        
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Create profile
const createProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        // Check if profile already exists
        const existingProfile = await Profile.findOne({ userId });
        if (existingProfile) {
            return res.status(400).json({ message: "Profile already exists for this user" });
        }

        // Check if student exists
        const student = await Student.findById(userId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const newProfile = new Profile({
            userId,
            email: student.student_email, // Use email from student record
            ...req.body
        });

        await newProfile.save();
        res.status(201).json({ message: "Profile created successfully", profile: newProfile });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: "Validation error", error: error.errors });
        }
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Update profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        const updates = req.body;

        // Find and update the profile
        const profile = await Profile.findOneAndUpdate(
            { userId },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.status(200).json({ message: "Profile updated successfully", profile });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: "Validation error", error: error.errors });
        }
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Update profile picture
const updateProfilePicture = async (req, res) => {
    try {
        const userId = req.params.userId;
        const profilePicture = req.file ? req.file.path : null;

        if (!profilePicture) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const profile = await Profile.findOneAndUpdate(
            { userId },
            { $set: { profilePicture } },
            { new: true }
        );

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.status(200).json({ message: "Profile picture updated successfully", profile });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Update guardian info
const updateGuardianInfo = async (req, res) => {
    try {
        const userId = req.params.userId;
        const guardianInfo = req.body;

        const profile = await Profile.findOneAndUpdate(
            { userId },
            { $set: { guardianInfo } },
            { new: true, runValidators: true }
        );

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.status(200).json({ message: "Guardian information updated successfully", profile });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: "Validation error", error: error.errors });
        }
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports = {
    getProfile,
    createProfile,
    updateProfile,
    updateProfilePicture,
    updateGuardianInfo
};