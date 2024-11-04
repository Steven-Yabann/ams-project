import axios from 'axios';
import { User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Form, Nav, Tab } from 'react-bootstrap';

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
          <DetailsTabs 
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

const DetailsTabs = ({ profileData, setProfileData, setSuccessMessage, setError }) => {
  return (
    <Tab.Container defaultActiveKey="academic">
      <Card>
        <Card.Header>
          <Nav variant="tabs">
            <Nav.Item>
              <Nav.Link eventKey="academic">Academic Details</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="personal">Personal Details</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="guardian">Guardian Details</Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
        <Card.Body>
          <Tab.Content>
            <Tab.Pane eventKey="academic">
              <AcademicDetails 
                profileData={profileData}
                setProfileData={setProfileData}
                setSuccessMessage={setSuccessMessage}
                setError={setError}
              />
            </Tab.Pane>
            <Tab.Pane eventKey="personal">
              <PersonalDetails 
                profileData={profileData}
                setProfileData={setProfileData}
                setSuccessMessage={setSuccessMessage}
                setError={setError}
              />
            </Tab.Pane>
            <Tab.Pane eventKey="guardian">
              <GuardianDetails 
                profileData={profileData}
                setProfileData={setProfileData}
                setSuccessMessage={setSuccessMessage}
                setError={setError}
              />
            </Tab.Pane>
          </Tab.Content>
        </Card.Body>
      </Card>
    </Tab.Container>
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
  );
};

const PersonalDetails = ({ profileData, setProfileData, setSuccessMessage, setError }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [personalData, setPersonalData] = useState({
    religion: profileData?.religion || '',
    languages: profileData?.languages?.join(', ') || '',
    city: profileData?.city || '',
    country: profileData?.country || '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPersonalData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const admissionNumber = sessionStorage.getItem('admissionNumber');
      const formattedData = {
        ...personalData,
        languages: personalData.languages.split(',').map(lang => lang.trim())
      };
      
      const response = await axios.put(
        `${API_BASE_URL}/admissionNumber/${admissionNumber}`,
        formattedData
      );
      
      setProfileData(response.data.profile);
      setIsEditing(false);
      setSuccessMessage('Personal details updated successfully');
    } catch (error) {
      setError('Error updating personal details: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Form>
      {Object.entries(personalData).map(([field, value]) => (
        <Form.Group key={field} controlId={field} className="mb-3">
          <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
          <Form.Control
            type="text"
            name={field}
            value={value}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder={field === 'languages' ? 'Enter languages separated by commas' : `Enter ${field}`}
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
  );
};

const GuardianDetails = ({ profileData, setProfileData, setSuccessMessage, setError }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [guardianData, setGuardianData] = useState({
    parentName: profileData?.guardianInfo?.[0]?.parentName || '',
    relationship: profileData?.guardianInfo?.[0]?.relationship || '',
    contactNumber: profileData?.guardianInfo?.[0]?.contactNumber || '',
    email: profileData?.guardianInfo?.[0]?.email || '',
    occupation: profileData?.guardianInfo?.[0]?.occupation || '',
    address: profileData?.guardianInfo?.[0]?.address || '',
    emergencyContact: profileData?.guardianInfo?.[0]?.emergencyContact || '',
    alternativeContact: profileData?.guardianInfo?.[0]?.alternativeContact || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGuardianData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const admissionNumber = sessionStorage.getItem('admissionNumber');
      const response = await axios.put(
        `${API_BASE_URL}/admissionNumber/${admissionNumber}`,
        { guardianInfo: [guardianData] }
      );
      
      setProfileData(response.data.profile);
      setIsEditing(false);
      setSuccessMessage('Guardian details updated successfully');
    } catch (error) {
      setError('Error updating guardian details: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Form>
      {Object.entries(guardianData).map(([field, value]) => (
        <Form.Group key={field} controlId={field} className="mb-3">
          <Form.Label>
            {field.split(/(?=[A-Z])/).join(' ').charAt(0).toUpperCase() + 
             field.split(/(?=[A-Z])/).join(' ').slice(1)}
          </Form.Label>
          <Form.Control
            type={field === 'email' ? 'email' : 'text'}
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
  );
};

export default Profile;