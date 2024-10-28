const unirest = require("unirest");
const Fee = require("../models/fee");

let accessToken = "";

// Generate an access token
async function getAccessToken() {
    return new Promise((resolve, reject) => {
        unirest("GET", "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials")
            .headers({ 'Authorization': 'Basic b0pwUVg3alVTY2ZHdlpmVmR6cTR2WWxFZEdRYVpFR1hJdW45RlE0TFBnTURQTWY4OmRMdTczbmZVOE9wRDdJQWZxWWFQM3NDc1hGU2hxRzFvVWNCSG5nUmxZQVFQQkhWejVBRjY3b1JHWm5KWXk0TEY=' })
            .end(res => {
                if (res.error) {
                    console.error("Error getting access token:", res.error);
                    return reject(res.error);
                }
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
                    "Password": "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMjQxMDIyMjEyODIw", // Replace with your generated password
                    "Timestamp": "20241028194157", // Use a dynamically generated timestamp in production
                    "TransactionType": "CustomerPayBillOnline",
                    "Amount": 1,
                    "PartyA": phoneNumber,
                    "PartyB": 174379,
                    "CallBackURL": "https://mydomain.com/path", // Update your callback URL here
                    "AccountReference": "Yabann Corp",
                    "TransactionDesc": "Payment for Fees"
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
                    "Password": "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMjQxMDI4MTk0MTU3", // Replace with your generated password
                    "Timestamp": "20241028194157", // Use a dynamically generated timestamp in production
                    "CheckoutRequestID": checkoutRequestID
                }))
                .end(res => res.error ? reject(res.error) : resolve(res.raw_body));
        });

        const statusData = JSON.parse(statusResponse);
        console.log("Payment status response:", statusData);
        if (statusData.ResultCode === "0") {
            await Fee.findOneAndUpdate(
                { studentId },
                { feesPaid: 10000, isCleared: true, paymentDate: new Date() },
                { new: true }
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
        const feeRecord = await Fee.findOneAndUpdate(
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

module.exports = { initiatePayment, queryPaymentStatus, updateFeeStatusInDb };
