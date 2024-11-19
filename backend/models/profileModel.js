const mongoose = require('mongoose');

const guardianInfoSchema = new mongoose.Schema({
    parentName: {
        type: String,
        trim: true
    },
    relationship: {
        type: String,
        trim: true
    },
    contactNumber: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    occupation: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    emergencyContact: {
        type: String,
        trim: true
    },
    alternativeContact: {
        type: String,
        trim: true
    }
});

const profileSchema = new mongoose.Schema({
    admissionNumber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    // Basic Info
    phone: {
        type: String,
        trim: true
    },
    homeAddress: {
        type: String,
        trim: true
    },
    dob: {
        type: Date
    },
    nationality: {
        type: String,
        trim: true
    },
    gender: {
        type: String,
        trim: true,
        enum: ['male', 'female', 'other', '']
    },
    profilePicture: {
        type: String,
        trim: true
    },

    // Academic Details
    class: {
        type: String,
        trim: true
    },
    classTeacher: {
        type: String,
        trim: true
    },
    yearOfStudy: {
        type: String,
        trim: true
    },
    yearOfAdmission: {
        type: String,
        trim: true
    },
    gpa: {
        type: String,
        trim: true
    },
    graduation: {
        type: String,
        trim: true
    },

    // Personal Details
    religion: {
        type: String,
        trim: true
    },
    languages: [{
        type: String,
        trim: true
    }],
    city: {
        type: String,
        trim: true
    },
    country: {
        type: String,
        trim: true
    },

    // Guardian Info
    guardianInfo: [guardianInfoSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Profile', profileSchema);