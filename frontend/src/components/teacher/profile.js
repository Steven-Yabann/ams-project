import React, { useState, useEffect } from 'react';

const TeacherProfile = () => {
    const [teacher, setTeacher] = useState({
        profilePic: '',
        name: 'Mr. Wanjohi',
        classTaught: 'Mathematics',
        email: 'fred.wanjohi@example.com',
        department: 'Science'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate data fetch for other teacher data
        const fetchTeacherData = async () => {
            try {
                // Fetch other profile data from the backend if needed
                const data = { name: 'Mr. Wanjohi', classTaught: 'Mathematics', email: 'fred.wanjohi@example.com', department: 'Science' };
                setTeacher(data);
            } catch (error) {
                console.error("Error fetching teacher data:", error);
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

            // Here you would normally upload the file to your backend server
            // For example:
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
