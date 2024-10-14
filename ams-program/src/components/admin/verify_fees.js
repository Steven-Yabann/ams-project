import React, { useState } from "react";
import '../css_files/verify_fees.css';

export default function Verify_fees() {
    const [studentId, setStudentId] = useState("");
    const [feeStatus, setFeeStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleVerifyFees = async () => {
        setLoading(true);
        setError("");
        try {
            // Simulate fetching fee data from the backend
            const response = await fetch(`/api/verify-fees/${studentId}`);
            if (response.ok) {
                const data = await response.json();
                setFeeStatus(data);
            } else {
                setError("Failed to fetch fee details. Please check the student ID.");
            }
        } catch (err) {
            setError("An error occurred while fetching fee details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <div className="content">
            <h1>Verify Student Fees</h1>
            <div className="verify-form">
                <input 
                    type="text" 
                    placeholder="Enter Student ID" 
                    value={studentId} 
                    onChange={(e) => setStudentId(e.target.value)} 
                />
                <button onClick={handleVerifyFees} disabled={loading || !studentId}>
                    {loading ? "Verifying..." : "Verify Fees"}
                </button>
            </div>
            {feeStatus && (
                <div className="fee-status">
                    <h2>Fee Details</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Admission No</th>
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
                                <td>{feeStatus.paymentDate}</td>
                            </tr>
                        </tbody>
                    </table>
                    <p>Status: {feeStatus.isCleared ? "Cleared" : "Pending"}</p>
                </div>
            )}
            {error && <p className="error">{error}</p>}
        </div>
        </>
    );
}
