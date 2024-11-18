// fee model
const mongoose = require("mongoose");
// controller modifications
const unirest = require("unirest");
const Fee = require("../models/fee");
const Student = require("../models/studentModel");
let accessToken = "";

// Generate an access token
async function getAccessToken() {
    return new Promise((resolve, reject) => {
        let unirest = require('unirest');
        let req = unirest('GET', 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials')
        .headers({ 'Authorization': 'Basic b0pwUVg3alVTY2ZHdlpmVmR6cTR2WWxFZEdRYVpFR1hJdW45RlE0TFBnTURQTWY4OmRMdTczbmZVOE9wRDdJQWZxWWFQM3NDc1hGU2hxRzFvVWNCSG5nUmxZQVFQQkhWejVBRjY3b1JHWm5KWXk0TEY=' })
        .send()
        .end(res => {
            if (res.error) throw new Error(res.error);
            console.log(res.raw_body);
            accessToken = JSON.parse(res.raw_body).access_token;
            // console.log("Access Token:", accessToken);
            resolve(accessToken);
        });
    });
}

// Initiate STK Push payment
const initiatePayment = async (req, res) => {
    console.log("Received data:", req.body);
    try {
        const { admissionNumber, phoneNumber, paymentAmount } = req.body;
        console.log('Parsed data:', admissionNumber, phoneNumber, paymentAmount);
        await getAccessToken();

        const mpesaResponse = await new Promise((resolve, reject) => {
            unirest("POST", "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest")
                .headers({
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                })
                .send(JSON.stringify({
                    "BusinessShortCode": 174379,
                    "Password": "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMjQxMDI4MjIyMzU1",
                    "Timestamp": "20241028222355",
                    "TransactionType": "CustomerPayBillOnline",
                    "Amount": 1,
                    "PartyA": 254794879775,
                    "PartyB": 174379,
                    "PhoneNumber": phoneNumber,
                    "CallBackURL": "https://mydomain.com/path",
                    "AccountReference": admissionNumber,
                    "TransactionDesc": "Payment of fees to Bidii Primary" 
                }))
                .end(res => res.error ? reject(res.error) : resolve(res.raw_body));
        });

        console.log("M-Pesa Response:", mpesaResponse);
        const { CheckoutRequestID } = JSON.parse(mpesaResponse);
        res.json({ CheckoutRequestID });
    } catch (error) {
        console.error("Error initiating payment:", error);
        res.status(500).json({ message: "Error initiating payment", error: error.message || error });
    }
};

// Query payment status
const queryPaymentStatus = async (req, res) => {
    console.log("Querying payment status for:", req.body);
    try {
        const { checkoutRequestID, admissionNumber, paymentAmount } = req.body;
        await getAccessToken();

        const statusResponse = await new Promise((resolve, reject) => {
            unirest("POST", "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query")
                .headers({
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                })
                .send(JSON.stringify({
                    "BusinessShortCode": 174379,
                    "Password": "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMjQxMDI4MTk0MTU3",
                    "Timestamp": "20241028194157",
                    "CheckoutRequestID": checkoutRequestID
                }))
                .end(res => res.error ? reject(res.error) : resolve(res.raw_body));
        });

        const statusData = JSON.parse(statusResponse);
        console.log("Payment status response:", statusData);

        if (statusData.ResultCode === "0") {
            // Check if the student exists in the Fee collection
            let student = await Fee.findOne({ admissionNumber });

            if (!student) {
                // Student not found in the Fee collection, check the Student collection
                const studentFromStudentsTable = await Student.findOne({ admissionNumber });
                
                if (!studentFromStudentsTable) {
                    // Student not found in either collection
                    return res.status(404).json({
                        message: `No student found with admission number ${admissionNumber}. Please check and try again.`
                    });
                }

                // Create a new Fee document
                const newFee = new Fee({
                    admissionNumber,
                    name: studentFromStudentsTable.name,
                    feesPaid: paymentAmount,
                    isCleared: paymentAmount >= 10000, // Check if fees are fully paid
                    paymentDate: new Date()
                });

                await newFee.save();

                return res.status(201).json({
                    message: "New fee record created successfully.",
                    feeStatus: newFee.isCleared ? "Cleared" : "Pending",
                    updatedFee: newFee
                });
            } else {
                // Student exists, update the fee record
                student.feesPaid += paymentAmount;
                student.isCleared = student.feesPaid >= 10000; // Check if fees are fully paid
                student.paymentDate = new Date();

                const updatedFee = await student.save();

                return res.status(200).json({
                    message: "Payment successful.",
                    feeStatus: updatedFee.isCleared ? "Cleared" : "Pending",
                    updatedFee
                });
            }
        } else {
            res.status(400).json({ message: "Payment failed or pending", feeStatus: "Pending" });
        }
    } catch (error) {
        console.error("Error querying payment status:", error);
        res.status(500).json({ message: "Error querying payment status", error });
    }
};


const getPaidStudents = async (req, res) => {
    try {
        const students = await Fee.find().select("admissionNumber name totalFees feesPaid paymentDate");
        res.json(students);
    } catch (err) {
        console.error("Error fetching paid students:", err);
        res.status(500).json({ message: "Error fetching paid students" });
    }
};

module.exports = { initiatePayment, queryPaymentStatus, getPaidStudents };
