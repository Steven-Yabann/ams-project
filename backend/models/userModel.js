// models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    admissionNumber: { type: String, required: true},
    password: { type: String, required: true },
    userCategory: { type: String, enum: ['student', 'teacher', 'admin', 'library'], required: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
