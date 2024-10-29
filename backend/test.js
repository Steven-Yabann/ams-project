const unirest = require('unirest');

// Function to get Access Token
function getAccessToken(callback) {
    const req = unirest('GET', 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials')
    .headers({ 'Authorization': 'Basic b0pwUVg3alVTY2ZHdlpmVmR6cTR2WWxFZEdRYVpFR1hJdW45RlE0TFBnTURQTWY4OmRMdTczbmZVOE9wRDdJQWZxWWFQM3NDc1hGU2hxRzFvVWNCSG5nUmxZQVFQQkhWejVBRjY3b1JHWm5KWXk0TEY=' })
    .send()
    .end(res => {
        if (res.error) throw new Error(res.error);
        
        // Parse and return the access token
        const accessToken = JSON.parse(res.raw_body).access_token;
        console.log("Access Token:", accessToken);
        
        // Pass the access token to the callback function
        callback(accessToken);
    });
}

// Function to initiate STK Push
function initiateSTKPush(accessToken) {
    const simulationReq = unirest('POST', 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest')
    .headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`  // Use the token here
    })
    .send(JSON.stringify({
        "BusinessShortCode": 174379,
        "Password": "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMjQxMDIyMjEyODIw",
        "Timestamp": "20241022212820",
        "TransactionType": "CustomerPayBillOnline",
        "Amount": 1,
        "PartyA": 254794879775,
        "PartyB": 174379,
        "PhoneNumber": 254794879775,
        "CallBackURL": "https://mydomain.com/path",
        "AccountReference": "Yabann Corp",
        "TransactionDesc": "Payment to Steven Yabann"
    }))
    .end(res => {
        if (res.error) throw new Error(res.error);
        console.log("STK Push Response:", res.raw_body);

        // Extract CheckoutRequestID from response
        const responseBody = JSON.parse(res.raw_body);
        const checkoutRequestID = responseBody.CheckoutRequestID;

        // After STK Push, wait before checking the status
        setTimeout(() => {
            querySTKPushStatus(accessToken, checkoutRequestID);
        }, 2000);
    });
}

// Function to query the status of the STK Push
function querySTKPushStatus(accessToken, checkoutRequestID) {
    const req = unirest('POST', 'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query')
    .headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    })
    .send(JSON.stringify({
        "BusinessShortCode": 174379,
        "Password": "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMjQxMDI4MTk0MTU3",
        "Timestamp": "20241028194157",
        "CheckoutRequestID": checkoutRequestID
    }))
    .end(res => {
        if (res.error) throw new Error(res.error);
        console.log("STK Push Query Response:", res.raw_body);
    });
}

// Start the process by first getting the Access Token and then initiating STK Push
getAccessToken(initiateSTKPush);
