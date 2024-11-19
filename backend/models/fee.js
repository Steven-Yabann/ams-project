const mongoose = require("mongoose");
const { getAdmissionNumbers } = require("../controllers/teachersController");

const feeSchema = new mongoose.Schema({
    admissionNumber: { type: String, required: true },
    name: { type: String, required: true },
    totalFees: { type: Number, default: 10000 },
    feesPaid: { type: Number, default: 0 },
    isCleared: { type: Boolean, default: false },
    paymentDate: { type: Date }
});

const Fee = mongoose.model("Fee", feeSchema);
module.exports = Fee;
