import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for HTTP requests

const TeacherProfile = () => {
    const [teacher, setTeacher] = useState({
        profilePic: '',
        name: '',
        classTaught: '',
        email: '',
        department: ''
    });
    const [loading, setLoading] = useState(true);

    // Fetch teacher data from the backend
    useEffect(() => {
        const fetchTeacherData = async () => {
            try {
                // Replace with the teacher's identification number (e.g., from session or props)
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
    }, []); // Empty dependency array to fetch only once on mount

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setTeacher(prevState => ({ ...prevState, profilePic: reader.result }));
            };
            reader.readAsDataURL(file);

            // Here you would upload the file to your backend if needed
            // const formData = new FormData();
            // formData.append('profilePic', file);
            // await fetch('/api/updateProfilePic', { method: 'POST', body: formData });
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-body text-center">
                    <div className="profile-img">
                        <img 
                            src={teacher.profilePic || "https://via.placeholder.com/150"} 
                            alt={`${teacher.name}'s profile`} 
                            className="rounded-circle" 
                            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                        />
                    </div>
                    <h2 className="mt-3">{teacher.name}</h2>
                    <p><strong>Class:</strong> {teacher.classTaught}</p>
                    <p><strong>Email:</strong> {teacher.email}</p>
                    <p><strong>Department:</strong> {teacher.department}</p>
                    
                    <div className="mt-3">
                        <label htmlFor="profilePicUpload" className="btn btn-primary">
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
