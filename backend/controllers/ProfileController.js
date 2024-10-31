// profileController.js

const Profile = require('../models/profileModel');
const Student = require('../models/studentModel'); // Ensure Student model is correctly imported

// Get profile by userId
const getProfile = async (req, res) => {
    try {
        const admissionNumber = req.params.admissionNumber;
        if (!admissionNumber) {
            return res.status(400).json({ message: "User ID is required" });
        }
        const profile = await Profile.findOne({ admissionNumber }).populate('userId');
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


// Create a new profile for a user
const createProfile = async (req, res) => {
    try {
        const admissionNumber = req.params.userId;
        
        // Check if profile already exists
        const existingProfile = await Profile.findOne({ admissionNumber });
        if (existingProfile) {
            return res.status(400).json({ message: "Profile already exists for this user" });
        }

        // Check if student exists
        const student = await Student.findById(admissionNumber);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const newProfile = new Profile({
            admissionNumber,
            email: student.student_email, // Set email from student data
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

// Update profile for a user
const updateProfile = async (req, res) => {
    try {
        const admissionNumber = req.params.admissionNumber;
        const updates = req.body;

        // Find and update the profile
        const profile = await Profile.findOneAndUpdate(
            { admissionNumber },
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
        const admissionNumber = req.params.admissionNumber;
        const profilePicture = req.file ? req.file.path : null;

        if (!profilePicture) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const profile = await Profile.findOneAndUpdate(
            { admissionNumber },
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

// Update guardian information for a user
const updateGuardianInfo = async (req, res) => {
    try {
        const admissionNumber = req.params.admissionNumber;
        const guardianInfo = req.body;

        const profile = await Profile.findOneAndUpdate(
            { admissionNumber },
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

// Export the controller functions
module.exports = {
    getProfile,
    createProfile,
    updateProfile,
    updateProfilePicture,
    updateGuardianInfo
};
