// routes/feeRoutes.js
const express = require("express");
const { initiatePayment, queryPaymentStatus, updateFeeStatusInDb } = require('../controllers/feeController');
const router = express.Router();

router.post("/initiate-payment", initiatePayment);
router.post("/query-status", queryPaymentStatus);
router.post("/update-status", updateFeeStatusInDb);

module.exports = router;
