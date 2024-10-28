import React, { useState } from "react";
import axios from "axios";
import './css_files/verify_fees.css';

export default function Verify_fees() {
    const [studentId, setStudentId] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [feeStatus, setFeeStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleVerifyFees = async () => {
        console.log("Submitting:", { studentId, phoneNumber });
        setLoading(true);
        setError("");
        
        try {
            // Step 1: Initiate the payment request using axios
            const initiateResponse = await axios.post("http://localhost:4000/api/verify-fees/initiate-payment", {
                studentId,
                phoneNumber
            });

            const { CheckoutRequestID } = initiateResponse.data;

            // Step 2: Query payment status after some delay
            setTimeout(async () => {
                try {
                    const queryResponse = await axios.post("http://localhost:4000/api/verify-fees/query-status", {
                        checkoutRequestID: CheckoutRequestID,
                        studentId
                    });

                    if (queryResponse.status === 200) {
                        setFeeStatus(queryResponse.data);
                    } else {
                        setError("Failed to verify fee payment status.");
                    }
                } catch (queryError) {
                    setError("An error occurred while querying payment status.");
                    console.error(queryError);
                }
            }, 10000); // 2.5-second delay before querying status

        } catch (err) {
            setError("An error occurred while initiating payment.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="content">
            <h1>Verify Student Fees</h1>
            <div className="verify-form">
                <input 
                    type="text" 
                    placeholder="Enter Student ID" 
                    value={studentId} 
                    onChange={(e) => setStudentId(e.target.value)} 
                />
                <input 
                    type="text" 
                    placeholder="Enter Phone Number" 
                    value={phoneNumber} 
                    onChange={(e) => setPhoneNumber(e.target.value)} 
                />
                <button onClick={handleVerifyFees} disabled={loading || !studentId || !phoneNumber}>
                    {loading ? "Verifying..." : "Verify Fees"}
                </button>
            </div>
            {feeStatus && (
                <div className="fee-status">
                    <h2>Fee Details</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Total Fees</th>
                                <th>Fees Paid</th>
                                <th>Date of Payment</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{feeStatus.studentId}</td>
                                <td>{feeStatus.totalFees}</td>
                                <td>{feeStatus.feesPaid}</td>
                                <td>{new Date(feeStatus.paymentDate).toLocaleDateString()}</td>
                            </tr>
                        </tbody>
                    </table>
                    <p>Status: {feeStatus.isCleared ? "Cleared" : "Pending"}</p>
                </div>
            )}
            {error && <p className="error">{error}</p>}
        </div>
    );
}
