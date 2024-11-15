// routes/feeRoutes.js
const express = require("express");
const { 

    initiatePayment, 
    queryPaymentStatus, 
    updateFeeStatusInDb,
    getPaidStudents 

} = require('../controllers/feeController');
const router = express.Router();

router.post("/initiate-payment", initiatePayment);

router.post("/query-status", queryPaymentStatus);

router.post("/update-status", updateFeeStatusInDb);

router.get('/paid-students', getPaidStudents);

module.exports = router;
