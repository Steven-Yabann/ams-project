const Profile = require('../models/profileModel');
const Student = require('../models/studentModel');

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
                phone: '',
                homeAddress: '',
                dob: '',
                nationality: '',
                gender: '',
                profilePicture: '',
                class: '',
                classTeacher: '',
                yearOfStudy: '',
                yearOfAdmission: '',
                gpa: '',
                graduation: '',
                religion: '',
                languages: [],
                city: '',
                country: '',
                guardianInfo: [{
                    parentName: '',
                    relationship: '',
                    contactNumber: '',
                    email: '',
                    occupation: '',
                    address: '',
                    emergencyContact: '',
                    alternativeContact: ''
                }]
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
        console.error('Profile fetch error:', error);
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

        // Remove read-only fields
        delete updates.name;
        delete updates.email;
        delete updates.admissionNumber;

        // Data preprocessing
        const processedUpdates = { ...updates };

        // Handle date format for DOB if it exists
        if (updates.dob) {
            processedUpdates.dob = new Date(updates.dob);
        }

        // Handle languages array
        if (updates.languages) {
            if (typeof updates.languages === 'string') {
                processedUpdates.languages = updates.languages.split(',').map(lang => lang.trim());
            } else if (Array.isArray(updates.languages)) {
                processedUpdates.languages = updates.languages.map(lang => lang.trim());
            }
        }

        // Handle guardian info
        if (updates.guardianInfo) {
            if (!Array.isArray(updates.guardianInfo)) {
                processedUpdates.guardianInfo = [updates.guardianInfo];
            }
        }

        // Ensure student ID is properly set
        processedUpdates.admissionNumber = student._id;

        const profile = await Profile.findOneAndUpdate(
            { admissionNumber: student._id },
            { $set: processedUpdates },
            { 
                new: true, 
                runValidators: true, 
                upsert: true,
                setDefaultsOnInsert: true 
            }
        );

        const updatedProfileData = {
            ...profile.toObject(),
            name: student.name,
            email: student.student_email,
            admissionNumber: student.admissionNumber
        };

        res.status(200).json({ 
            message: "Profile updated successfully", 
            profile: updatedProfileData 
        });

    } catch (error) {
        console.error('Profile update error:', error);
        
        if (error.name === 'ValidationError') {
            const validationErrors = Object.keys(error.errors).reduce((acc, key) => {
                acc[key] = error.errors[key].message;
                return acc;
            }, {});
            
            return res.status(400).json({ 
                message: "Validation error", 
                errors: validationErrors 
            });
        }

        res.status(500).json({ 
            message: "Internal server error", 
            error: error.message 
        });
    }
};

const updateProfilePicture = async (req, res) => {
    try {
        const { admissionNumber } = req.params;
        const { profilePicture } = req.body;

        if (!profilePicture) {
            return res.status(400).json({ message: "Profile picture URL is required" });
        }

        const student = await Student.findOne({ admissionNumber });
        
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const profile = await Profile.findOneAndUpdate(
            { admissionNumber: student._id },
            { $set: { profilePicture } },
            { 
                new: true, 
                runValidators: true, 
                upsert: true 
            }
        );

        const updatedProfileData = {
            ...profile.toObject(),
            name: student.name,
            email: student.student_email,
            admissionNumber: student.admissionNumber
        };

        res.status(200).json({ 
            message: "Profile picture updated successfully", 
            profile: updatedProfileData 
        });
    } catch (error) {
        console.error('Profile picture update error:', error);
        res.status(500).json({ 
            message: "Internal server error", 
            error: error.message 
        });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    updateProfilePicture
};