import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TeacherProfile = () => {
    const [teacher, setTeacher] = useState({
        profilePic: '',
        name: '',
        classTaught: '',
        email: '',
        department: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeacherData = async () => {
            try {
                const admissionNumber = sessionStorage.getItem('admissionNumber');
                const response = await axios.get(`http://localhost:4000/api/teacher/teacher-details/${admissionNumber}`);

                if (response.data.profile) {
                    setTeacher(response.data.profile);
                }
            } catch (error) {
                console.error('Error fetching teacher data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeacherData();
    }, []);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setTeacher(prevState => ({ ...prevState, profilePic: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    if (loading) return <p>Loading...</p>;

    const silhouetteSVG = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="gray"
            style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                objectFit: 'cover',
                backgroundColor: '#f8f9fa',
                padding: '10px'
            }}
        >
            <circle cx="12" cy="8" r="4" />
            <path d="M12 14c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4z" />
        </svg>
    );

    return (
        <div className="container mt-5">
            <div className="card mx-auto shadow-lg" style={{ maxWidth: '600px', borderRadius: '15px' }}>
                <div className="card-body text-center">
                    <div className="profile-img mb-3">
                        {teacher.profilePic ? (
                            <img
                                src={teacher.profilePic}
                                alt={`${teacher.name}'s profile`}
                                className="rounded-circle border border-primary"
                                style={{
                                    width: '150px',
                                    height: '150px',
                                    objectFit: 'cover',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                                }}
                            />
                        ) : (
                            silhouetteSVG
                        )}
                    </div>
                    <h2 className="mb-3" style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>
                        {teacher.name || "N/A"}
                    </h2>
                    {/* <p style={{ fontSize: '16px', color: '#6c757d' }}>
                        <strong>Class:</strong> {teacher.classTaught || 'N/A'}
                    </p> */}
                    <p style={{ fontSize: '16px', color: '#6c757d' }}>
                        <strong>Email:</strong> {teacher.email || 'N/A'}
                    </p>
                    <p style={{ fontSize: '16px', color: '#6c757d' }}>
                        <strong>Department:</strong> {teacher.department || 'N/A'}
                    </p>

                    <div className="mt-4">
                        <label
                            htmlFor="profilePicUpload"
                            className="btn btn-primary px-4 py-2"
                            style={{
                                borderRadius: '30px',
                                fontWeight: 'bold',
                                backgroundColor: '#007bff',
                                borderColor: '#007bff',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#0056b3';
                                e.target.style.borderColor = '#0056b3';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#007bff';
                                e.target.style.borderColor = '#007bff';
                            }}
                        >
                            Change Profile Picture
                        </label>
                        <input
                            type="file"
                            id="profilePicUpload"
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherProfile;
