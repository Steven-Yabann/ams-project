const express = require('express');
const router = express.Router();
const {
  getStudentAcademicRecords,

} = require('../controllers/academicRecordController');

router.get('/records', getStudentAcademicRecords);

module.exports = router;