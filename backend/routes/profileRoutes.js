// routes/profile.js
const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, updateProfilePicture } = require('../controllers/ProfileController');

router.get('/admissionNumber/:admissionNumber', getProfile);
router.put('/admissionNumber/:admissionNumber', updateProfile);
router.put('/admissionNumber/:admissionNumber/picture', updateProfilePicture); // No multer middleware

module.exports = router;
