import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from "axios";
import { Button, Form, Col, Row, Container, Card } from 'react-bootstrap';

export default function Login({ onLogin }) {
    const [admissionNumber, setAdmissionNumber] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const { data, status } = await axios.post("http://localhost:4000/api/auth/login", { admissionNumber, password });
            
            if (status === 200) {
                sessionStorage.setItem('admissionNumber', data.admissionNumber);
                sessionStorage.setItem('userCategory', data.userCategory);
                onLogin(data);
                navigate("/");
            } else {
                setError("Login failed. Please try again.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred during login.");
        }
    };

    return (
        <Container fluid className="vh-100 d-flex justify-content-center align-items-center">
            <Row className="w-100">
                <Col md={6} lg={4}>
                    <Card className="shadow">
                        <Card.Body>
                            <h2 className="text-center fw-bold text-uppercase">AMS</h2>
                            <p className="text-center mb-4">Please enter your admission number and password</p>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="admissionNumber">
                                    <Form.Label>Admission Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Admission Number"
                                        value={admissionNumber}
                                        onChange={(e) => setAdmissionNumber(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </Form.Group>
                                {error && <p className="text-danger">{error}</p>}
                                <div className="d-grid">
                                    <Button variant="primary" type="submit">Login</Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
