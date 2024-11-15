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
            console.log("Access Token:", accessToken);
            resolve(accessToken);
        });
    });
}

// Initiate STK Push payment
const initiatePayment = async (req, res) => {
    console.log("Received data:", req.body);
    try {
        const { studentId, phoneNumber } = req.body;
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
                    "AccountReference": "CompanyXLTD",
                    "TransactionDesc": "Payment of X" 
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
        const { checkoutRequestID, studentId } = req.body;
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
            // Attempt to find the student in the Fee collection
            let student = await Fee.findOne({ studentId });
            let studentName = student?.name;
        
            // If the name is not found in the Fee collection, query the Students collection
            if (!studentName) {
                const studentFromStudentsTable = await Student.findOne({ admissionNumber: studentId });
                studentName = studentFromStudentsTable?.name || "Unknown"; // Default to "Unknown" if not found
            }
        
            // Update or insert the fee record
            await Fee.findOneAndUpdate(
                { studentId },
                { 
                    name: studentName, // Set the name retrieved from either table
                    feesPaid: 10000, 
                    isCleared: true, 
                    paymentDate: new Date() 
                },
                { new: true, upsert: true }
            );
        
            res.json({ message: "Payment successful", feeStatus: "Cleared" });
        } else {
            res.status(400).json({ message: "Payment failed or pending", feeStatus: "Pending" });
        }
        
    } catch (error) {
        console.error("Error querying payment status:", error);
        res.status(500).json({ message: "Error querying payment status", error });
    }
};


// Callback to update payment in DB after successful payment notification
const updateFeeStatusInDb = async (req, res) => {
    try {
        const { studentId } = req.body;
        const feeRecord = await Fee.save(
            { studentId },
            { feesPaid: 10000, isCleared: true, paymentDate: new Date() },
            { new: true, upsert: true }
        );

        res.json({ message: "Fee record updated successfully", feeRecord });
    } catch (error) {
        console.error("Error updating fee record:", error);
        res.status(500).json({ message: "Error updating fee record", error });
    }
};

const getPaidStudents = async (req, res) => {
    try {
        const students = await Fee.find({ isCleared: true }).select("studentId name totalFees feesPaid paymentDate");
        res.json(students);
    } catch (err) {
        console.error("Error fetching paid students:", err);
        res.status(500).json({ message: "Error fetching paid students" });
    }
};


module.exports = { initiatePayment, queryPaymentStatus, updateFeeStatusInDb, getPaidStudents };
