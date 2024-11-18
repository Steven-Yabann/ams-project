import React, { useState, useEffect } from "react";
import axios from "axios";
import './css_files/verify_fees.css';

export default function VerifyFees() {
    const [admissionNumber, setAdmissionNumber] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [paymentAmount, setPaymentAmount] = useState("");
    const [feeStatus, setFeeStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [studentOptions, setStudentOptions] = useState([]);
    const [unpaidStudents, setUnpaidStudents] = useState([]);


    useEffect(() => {
        fetchPaidStudents();

        fetchUnpaidStudents();

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

    const fetchUnpaidStudents = async () => {
        try {
            const response = await axios.get("http://localhost:4000/api/verify-fees/unpaid-students");
            setUnpaidStudents(response.data);
        } catch (err) {
            console.error("Error fetching unpaid students:", err);
        }
    };


    const fetchStudentOptions = async () => {
        try {
            const response = await axios.get("http://localhost:4000/api/student/student");
            setStudentOptions(response.data);
            console.log(response.data);
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

            // Send admissionNumber in the payload
            const initiateResponse = await axios.post("http://localhost:4000/api/verify-fees/initiate-payment", {
                admissionNumber,
                phoneNumber,
                paymentAmount
            });

            console.log("Initiate Payment Response:", initiateResponse.data);

            const { CheckoutRequestID } = initiateResponse.data;

            setTimeout(async () => {
                try {
                    const queryResponse = await axios.post("http://localhost:4000/api/verify-fees/query-status", {
                        checkoutRequestID: CheckoutRequestID,
                        admissionNumber, // Pass admissionNumber again here
                        paymentAmount
                    });

                    console.log("Query Payment Response:", queryResponse.data);

                    if (queryResponse.status === 200 || queryResponse.status === 201) {
                        setFeeStatus(queryResponse.data);
                        fetchPaidStudents(); // Update the table with the latest data

                        alert("Fee verification successful! Payment details have been updated.");
                    } else {
                        setError("Failed to verify fee payment status.");
                    }
                } catch (queryError) {
                    console.error("Error querying payment status:", queryError);
                    alert("An error occurred while querying payment status.");
                    setError("An error occurred while querying payment status.");
                }
            }, 10000); // 10-second delay before querying status
        } catch (err) {
            console.error("Error initiating payment:", err);
            alert("An error occurred while initiating payment.");
            setError("An error occurred while initiating payment.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="content">
            <h1>Verify Student Fees</h1>
            <div className="verify-form">
                <select
                    value={admissionNumber} // Admission number state
                    onChange={(e) => setAdmissionNumber(e.target.value)} // Update admissionNumber
                >
                    <option value="">Select Student</option>
                    {studentOptions.map((student) => (
                        <option key={student._Id} value={student.admissionNumber}>
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
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
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
                                (student.admissionNumber && student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()))
                            )
                            .map((student) => (
                                <tr key={student.admissionNumber}>
                                    <td>{student.admissionNumber}</td>
                                    <td>{student.name}</td>
                                    <td>{student.totalFees}</td>
                                    <td>{student.feesPaid}</td>
                                    <td>{new Date(student.paymentDate).toLocaleDateString()}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
                <div className="student-table">
                    <h2>Students Who Have Not Paid Fees</h2>
                    {/* <input
                        type="text"
                        placeholder="Search by Student ID or Name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    /> */}
                    <table>
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {unpaidStudents
                                .filter((student) =>
                                    (student.name && student.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                                    (student.admissionNumber && student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()))
                                )
                                .map((student) => (
                                    <tr key={student.admissionNumber}>
                                        <td>{student.admissionNumber}</td>
                                        <td>{student.name}</td>
                                        <td>{student.student_email || "N/A"}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
