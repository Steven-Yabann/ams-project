// profileRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
//const path = require('path');
const {
    getProfile,
    createProfile,
    updateProfile,
    updateProfilePicture,
    updateGuardianInfo
} = require('../controllers/ProfileController');

// Configure multer for file uploads

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/profile-pictures');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Multer instance with file size and type constraints
const upload = multer({

    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Error: Images Only!'));
    }
});

// Define profile routes
router.get('/admissionNumber', getProfile); // Route to get profile by userId
router.post('/admissionNumber', createProfile); // Route to create a new profile
router.put('/admissionNumber', updateProfile); // Route to update existing profile
router.put('/admissionNumber/picture', upload.single('profilePicture'), updateProfilePicture); // Route to update profile picture
router.put('/admissionNumber/guardian', updateGuardianInfo); // Route to update guardian information

module.exports = router;
