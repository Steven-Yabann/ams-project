import React, { useState, useEffect } from "react";
import axios from "axios";
import './css_files/verify_fees.css';

export default function VerifyFees() {
    const [admissionNumber, setAdmissionNumber] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [paymentAmount, setPaymentAmount] = useState(""); // Add state for payment amount
    const [feeStatus, setFeeStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [studentOptions, setStudentOptions] = useState([]);

    useEffect(() => {
        // Fetch all students who have paid fees
        fetchPaidStudents();

        // Fetch student options for the dropdown
        fetchStudentOptions();
    }, []);

    const fetchPaidStudents = async () => {
        try {
            const response = await axios.get("http://localhost:4000/api/verify-fees/paid-students");
            setStudents(response.data);
        } catch (err) {
            console.error("Error fetching paid students:", err);
        }
    };

    const fetchStudentOptions = async () => {
        try {
            const response = await axios.get("http://localhost:4000/api/student");
            setStudentOptions(response.data);
        } catch (err) {
            console.error("Error fetching student options:", err);
        }
    };

    const handleVerifyFees = async () => {
        console.log("Submitting:", { admissionNumber, phoneNumber, paymentAmount });
        setLoading(true);
        setError("");

        try {
            alert("Initiating fee verification process. Please wait...");

            const initiateResponse = await axios.post("http://localhost:4000/api/verify-fees/initiate-payment", {
                admissionNumber,
                phoneNumber,
                paymentAmount, // Include payment amount
            });

            const { CheckoutRequestID } = initiateResponse.data;

            setTimeout(async () => {
                try {
                    const queryResponse = await axios.post("http://localhost:4000/api/verify-fees/query-status", {
                        checkoutRequestID: CheckoutRequestID,
                        studentId: admissionNumber,
                        paymentAmount, // Include payment amount in the query
                    });

                    if (queryResponse.status === 200) {
                        setFeeStatus(queryResponse.data);
                        fetchPaidStudents(); // Update the table with the latest data

                        alert("Fee verification successful! Payment details have been updated.");
                    } else {
                        setError("Failed to verify fee payment status.");
                    }
                } catch (queryError) {
                    alert("An error occurred while querying payment status.");
                    setError("An error occurred while querying payment status.");
                    console.error(queryError);
                }
            }, 10000); // 10-second delay before querying status
        } catch (err) {
            alert("An error occurred while initiating payment.");
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
                <select
                    value={admissionNumber}
                    onChange={(e) => setAdmissionNumber(e.target.value)}
                >
                    <option value="">Select Student</option>
                    {studentOptions.map((student) => (
                        <option key={student._id} value={student.admissionNumber}>
                            {student.admissionNumber} - {student.name}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Enter Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Enter Payment Amount"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))} // Parse the amount to a number
                />

                <button onClick={handleVerifyFees} disabled={loading || !admissionNumber || !phoneNumber || !paymentAmount}>
                    {loading ? "Verifying..." : "Verify Fees"}
                </button>
            </div>

            <div className="student-table">
                <h2>Students Who Have Paid Fees</h2>
                <input
                    type="text"
                    placeholder="Search by Student ID or Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <table>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Name</th>
                            <th>Total Fees</th>
                            <th>Fees Paid</th>
                            <th>Date of Payment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students
                            .filter((student) =>
                                (student.name && student.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                                (student.studentId && student.studentId.toLowerCase().includes(searchTerm.toLowerCase()))
                            )
                            .map((student) => (
                                <tr key={student.studentId}>
                                    <td>{student.studentId}</td>
                                    <td>{student.name}</td>
                                    <td>{student.totalFees}</td>
                                    <td>{student.feesPaid}</td>
                                    <td>{new Date(student.paymentDate).toLocaleDateString()}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
