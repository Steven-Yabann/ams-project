const express = require('express');
const { getStudents } = require('../controllers/studentController');
const router = express.Router();

router.get('/student', getStudents);

module.exports = router;