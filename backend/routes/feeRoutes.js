// routes/feeRoutes.js
const express = require("express");
const { 

    initiatePayment, 
    queryPaymentStatus, 
    getUnpaidStudents,
    getPaidStudents 

} = require('../controllers/feeController');
const router = express.Router();

router.post("/initiate-payment", initiatePayment);

router.post("/query-status", queryPaymentStatus);

router.get("/unpaid-students", getUnpaidStudents);

router.get('/paid-students', getPaidStudents);

module.exports = router;
