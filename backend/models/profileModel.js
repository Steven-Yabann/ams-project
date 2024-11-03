const mongoose = require('mongoose');

// Schema for guardian information
const guardianSchema = new mongoose.Schema({
  parentName: {
    type: String,
    required: true,
    trim: true
  },
  relationship: {
    type: String,
    required: true,
    trim: true
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
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

// Schema for the main profile
const profileSchema = new mongoose.Schema({
  admissionNumber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  profilePicture: {
    type: String,
    default: null
  },
  dob: {
    type: Date
  },
  nationality: {
    type: String,
    trim: true
  },
  religion: {
    type: String,
    trim: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    trim: true
  },
  languages: [{
    type: String,
    trim: true
  }],
  homeAddress: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  // Academic fields
  classTeacher: {
    type: String,
    trim: true
  },
  class: {
    type: String,
    trim: true
  },
  yearOfStudy: {
    type: String,
    trim: true
  },
  gpa: {
    type: Number,
    min: 0,
    max: 4
  },
  yearOfAdmission: {
    type: String,
    trim: true
  },
  graduation: {
    type: String,
    trim: true
  },
  // Guardian information
  guardianInfo: [guardianSchema]
}, {
  timestamps: true
});

const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;