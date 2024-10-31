// profileModel.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the Profile model
const profileSchema = new Schema({
    // Basic Info
    admissionNumber: { type: Schema.Types.ObjectId, required: true, unique: true, ref: 'Student' },
    profilePicture: { type: String },

    // Personal Details
    dob: { type: Date },
    nationality: { type: String },
    religion: { type: String },
    gender: { type: String },
    languages: [{ type: String }],
    homeAddress: { type: String },
    city: { type: String },
    country: { type: String },
    phone: { type: String },
    email: { type: String, required: true },

    // Academic Details
    classTeacher: { type: String },
    class: { type: String },
    yearOfStudy: { type: String },
    gpa: { type: Number },
    yearOfAdmission: { type: String },
    graduation: { type: String },

    // Guardian Details
    guardianInfo: [{
        parentName: { type: String },
        relationship: { type: String },
        contactNumber: { type: String },
        email: { type: String },
        occupation: { type: String },
        address: { type: String },
        emergencyContact: { type: String },
        alternativeContact: { type: String }
    }]
}, { timestamps: true });

// Create and export the Profile model
const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;
