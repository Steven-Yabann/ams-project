const Profile = require('../models/profileModel');
const Student = require('../models/studentModel');
const fs = require('fs').promises;
const path = require('path');

const getProfile = async (req, res) => {
    try {
        const { admissionNumber } = req.params;
        
        if (!admissionNumber) {
            return res.status(400).json({ message: "Admission number is required" });
        }

        const student = await Student.findOne({ admissionNumber });
        
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        let profile = await Profile.findOne({ admissionNumber: student._id });
        
        // If no profile exists, return an empty profile structure
        if (!profile) {
            const emptyProfile = {
                name: student.name,
                email: student.student_email,
                admissionNumber: student.admissionNumber,
                profilePicture: '',
                bio: '',
                phoneNumber: '',
                address: '',
                socialLinks: {
                    facebook: '',
                    twitter: '',
                    linkedin: '',
                    instagram: ''
                },
                interests: [],
                skills: []
            };
            return res.status(200).json(emptyProfile);
        }

        const profileData = {
            ...profile.toObject(),
            name: student.name,
            email: student.student_email,
            admissionNumber: student.admissionNumber
        };

        res.status(200).json(profileData);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { admissionNumber } = req.params;
        const updates = req.body;

        const student = await Student.findOne({ admissionNumber });
        
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Remove read-only fields from updates
        delete updates.name;
        delete updates.email;
        delete updates.admissionNumber;

        const profile = await Profile.findOneAndUpdate(
            { admissionNumber: student._id },
            { $set: updates },
            { new: true, runValidators: true, upsert: true } // Added upsert: true to create if doesn't exist
        );

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        const updatedProfileData = {
            ...profile.toObject(),
            name: student.name,
            email: student.student_email,
            admissionNumber: student.admissionNumber
        };

        res.status(200).json({ message: "Profile updated successfully", profile: updatedProfileData });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: "Validation error", error: error.errors });
        }
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const updateProfilePicture = async (req, res) => {
    try {
        const { admissionNumber } = req.params;
        const { profilePictureUrl } = req.body;

        if (!profilePictureUrl) {
            return res.status(400).json({ message: "Profile picture URL is required" });
        }

        const student = await Student.findOne({ admissionNumber });
        
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const profile = await Profile.findOneAndUpdate(
            { admissionNumber: student._id },
            { $set: { profilePicture: profilePictureUrl } },
            { new: true, upsert: true } // Added upsert: true to create if doesn't exist
        );

        const updatedProfileData = {
            ...profile.toObject(),
            name: student.name,
            email: student.student_email,
            admissionNumber: student.admissionNumber
        };

        res.status(200).json({ message: "Profile picture updated successfully", profile: updatedProfileData });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    updateProfilePicture
};