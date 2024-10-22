let unirest = require('unirest');

function initiateSTKPush() {
    let simulationReq = unirest('POST', 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest')
    .headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 8mNgnvjTHYENKiw8AaHQdLWZXs99'
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
        console.log("STK Push response: ", res.raw_body);

        let responseBody = JSON.parse(res.raw_body)
        let CheckoutRequestID = responseBody.CheckoutRequestID
        console.log( "checkoutID: ", CheckoutRequestID )

        setTimeout(() => {
            querySTKPushStatus(CheckoutRequestID)
        }, 10000)
    });

}


function querySTKPushStatus( CheckoutRequestID ){

    let queryReq = unirest('POST', 'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query')
    .headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer e8JRBgxBpkbQLEFD4mXkMBBG2RUM'
    })
    .send(JSON.stringify({
        "BusinessShortCode": 174379,
        "Password": "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMjQxMDIyMjE1NTQ0",
        "Timestamp": "20241022215544",
        "CheckoutRequestID": CheckoutRequestID,
    }))
    .end(res => {
        if (res.error) throw new Error(res.error);
        console.log("STK Push Query Response: ", res.raw_body);
        let responseBody = JSON.parse(res.raw_body)
        let resultCode = responseBody.ResultCode
        let resultMessage = responseBody.ResultDesc

        console.log("Result code: ", resultCode)
        console.log("Result mssg: ", resultMessage)
    });

}

initiateSTKPush();
