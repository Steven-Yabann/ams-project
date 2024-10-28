const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema({
    admissionNumber: { type: String, required: true },
    totalFees: { type: Number, default: 10000 },
    feesPaid: { type: Number, default: 0 },
    isCleared: { type: Boolean, default: false },
    paymentDate: { type: Date }
});

module.exports = mongoose.model("Fee", feeSchema);
