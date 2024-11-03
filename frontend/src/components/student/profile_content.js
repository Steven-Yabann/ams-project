import axios from 'axios';
import { User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Form } from 'react-bootstrap';

const API_BASE_URL = 'http://localhost:4000/api/profile';

const Profile = () => {
  return (
    <div className="d-flex min-vh-100">
      <div className="flex-grow-1 bg-light p-3">
        <ProfileContent />
      </div>
    </div>
  );
};

const ProfileContent = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const admissionNumber = sessionStorage.getItem('admissionNumber');
        
        if (!admissionNumber) {
          setError('Admission number not found. Please log in again.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/admissionNumber/${admissionNumber}`);
        setProfileData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Error fetching profile');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return (
    <div className="text-center mt-5">
      <Alert variant="danger">{error}</Alert>
      <Button variant="primary" onClick={() => window.location.href = '/login'}>
        Go to Login
      </Button>
    </div>
  );

  return (
    <main className="container">
      <h1 className="mb-4 text-center">Student Profile</h1>
      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
          {successMessage}
        </Alert>
      )}
      <div className="row">
        <div className="col-md-4 mb-4">
          <ProfileInfo 
            profileData={profileData} 
            setProfileData={setProfileData}
            setSuccessMessage={setSuccessMessage}
            setError={setError}
          />
        </div>
        <div className="col-md-8">
          <AcademicDetails 
            profileData={profileData} 
            setProfileData={setProfileData}
            setSuccessMessage={setSuccessMessage}
            setError={setError}
          />
        </div>
      </div>
    </main>
  );
};

const ProfileInfo = ({ profileData, setProfileData, setSuccessMessage, setError }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profileData?.name || '',
    email: profileData?.email || '',
    admissionNumber: profileData?.admissionNumber || '',
    phone: profileData?.phone || '',
    homeAddress: profileData?.homeAddress || '',
    dob: profileData?.dob ? new Date(profileData.dob).toISOString().split('T')[0] : '',
    nationality: profileData?.nationality || '',
    gender: profileData?.gender || '',
    profilePicture: profileData?.profilePicture || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const admissionNumber = sessionStorage.getItem('admissionNumber');
      const response = await axios.put(
        `${API_BASE_URL}/admissionNumber/${admissionNumber}`, 
        formData
      );
      
      setProfileData(response.data.profile);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully');
    } catch (error) {
      setError('Error updating profile: ' + (error.response?.data?.message || error.message));
    }
  };

  const readOnlyFields = ['name', 'email', 'admissionNumber'];

  return (
    <Card>
      <Card.Body>
        <div className="text-center mb-4">
          <div className="position-relative mx-auto" style={{
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            border: '4px solid #007bff',
            overflow: 'hidden'
          }}>
            {formData.profilePicture ? (
              <img 
                src={formData.profilePicture} 
                alt="Profile" 
                className="w-100 h-100 object-fit-cover"
              />
            ) : (
              <div className="d-flex align-items-center justify-content-center bg-light h-100">
                <User size={64} />
              </div>
            )}
          </div>
          {isEditing && (
            <Form.Group controlId="profilePicture" className="mt-2">
              <Form.Label>Profile Picture URL</Form.Label>
              <Form.Control
                type="text"
                name="profilePicture"
                value={formData.profilePicture}
                onChange={handleInputChange}
                placeholder="Enter image URL"
              />
            </Form.Group>
          )}
        </div>
        
        <Form>
          {Object.entries(formData).map(([field, value]) => (
            <Form.Group key={field} controlId={field} className="mb-3">
              <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
              <Form.Control 
                type={field === 'dob' ? 'date' : 'text'}
                name={field}
                value={value}
                onChange={handleInputChange}
                readOnly={readOnlyFields.includes(field)}
                disabled={!isEditing && !readOnlyFields.includes(field)}
              />
            </Form.Group>
          ))}
          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
            {isEditing && (
              <Button variant="primary" onClick={handleSave}>
                Save Changes
              </Button>
            )}
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

const AcademicDetails = ({ profileData, setProfileData, setSuccessMessage, setError }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [academicData, setAcademicData] = useState({
    class: profileData?.class || '',
    classTeacher: profileData?.classTeacher || '',
    yearOfStudy: profileData?.yearOfStudy || '',
    yearOfAdmission: profileData?.yearOfAdmission || '',
    gpa: profileData?.gpa || '',
    graduation: profileData?.graduation || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAcademicData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const admissionNumber = sessionStorage.getItem('admissionNumber');
      const response = await axios.put(
        `${API_BASE_URL}/admissionNumber/${admissionNumber}`,
        academicData
      );
      
      setProfileData(response.data.profile);
      setIsEditing(false);
      setSuccessMessage('Academic details updated successfully');
    } catch (error) {
      setError('Error updating academic details: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Card>
      <Card.Body>
        <h3 className="mb-4">Academic Details</h3>
        <Form>
          {Object.entries(academicData).map(([field, value]) => (
            <Form.Group key={field} controlId={field} className="mb-3">
              <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
              <Form.Control
                type="text"
                name={field}
                value={value}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </Form.Group>
          ))}
          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Cancel' : 'Edit Details'}
            </Button>
            {isEditing && (
              <Button variant="primary" onClick={handleSave}>
                Save Changes
              </Button>
            )}
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Profile;
