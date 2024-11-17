import axios from 'axios';
import {
  Award,
  Book,
  Calendar,
  Edit3,
  Globe,
  Home,
  Mail,
  Phone,
  Save,
  School,
  User,
  UserPlus,
  X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Nav,
  Row,
  Spinner,
  Tab
} from 'react-bootstrap';

const API_BASE_URL = 'http://localhost:4000/api/profile';

const Profile = () => {
  return (
    <div className="min-vh-100 bg-light py-4">
      <ProfileContent />
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

  if (loading) return (
    <div className="text-center mt-5">
      <Spinner animation="border" variant="primary" />
      <p className="mt-2">Loading your profile...</p>
    </div>
  );

  if (error) return (
    <Container className="text-center mt-5">
      <Alert variant="danger" className="d-inline-flex align-items-center">
        <X size={24} className="me-2" />
        {error}
      </Alert>
      <div className="mt-3">
        <Button variant="primary" onClick={() => window.location.href = '/login'}>
          Return to Login
        </Button>
      </div>
    </Container>
  );

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">
          <School className="me-2 d-inline-block" />
          Student Profile
        </h1>
        <Badge bg="primary" className="px-3 py-2">
          ID: {profileData?.admissionNumber}
        </Badge>
      </div>

      {successMessage && (
        <Alert 
          variant="success" 
          onClose={() => setSuccessMessage('')} 
          dismissible
          className="d-flex align-items-center"
        >
          <Award className="me-2" />
          {successMessage}
        </Alert>
      )}

      <Row>
        <Col md={4} className="mb-4">
          <ProfileInfo 
            profileData={profileData} 
            setProfileData={setProfileData}
            setSuccessMessage={setSuccessMessage}
            setError={setError}
          />
        </Col>
        <Col md={8}>
          <DetailsTabs 
            profileData={profileData} 
            setProfileData={setProfileData}
            setSuccessMessage={setSuccessMessage}
            setError={setError}
          />
        </Col>
      </Row>
    </Container>
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

  const getFieldIcon = (field) => {
    switch(field) {
      case 'email': return <Mail size={18} className="text-muted" />;
      case 'phone': return <Phone size={18} className="text-muted" />;
      case 'homeAddress': return <Home size={18} className="text-muted" />;
      case 'nationality': return <Globe size={18} className="text-muted" />;
      case 'dob': return <Calendar size={18} className="text-muted" />;
      default: return null;
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <div className="text-center mb-4">
          <div className="position-relative mx-auto" style={{
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            border: '4px solid #007bff',
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            {formData.profilePicture ? (
              <img 
                src={formData.profilePicture} 
                alt="Profile" 
                className="w-100 h-100 object-fit-cover"
              />
            ) : (
              <div className="d-flex align-items-center justify-content-center bg-light h-100">
                <User size={64} className="text-primary" />
              </div>
            )}
          </div>
          {isEditing && (
            <Form.Group controlId="profilePicture" className="mt-3">
              <Form.Label className="d-flex align-items-center justify-content-center">
                <Edit3 size={18} className="me-2" />
                Profile Picture URL
              </Form.Label>
              <Form.Control
                type="text"
                name="profilePicture"
                value={formData.profilePicture}
                onChange={handleInputChange}
                placeholder="Enter image URL"
                className="text-center"
              />
            </Form.Group>
          )}
        </div>
        
        <Form>
          {Object.entries(formData).map(([field, value]) => (
            field !== 'profilePicture' && (
              <Form.Group key={field} controlId={field} className="mb-3">
                <Form.Label className="d-flex align-items-center">
                  {getFieldIcon(field)}
                  <span className="ms-2">
                    {field.split(/(?=[A-Z])/).join(' ').charAt(0).toUpperCase() + 
                     field.split(/(?=[A-Z])/).join(' ').slice(1)}
                  </span>
                </Form.Label>
                <Form.Control 
                  type={field === 'dob' ? 'date' : field === 'email' ? 'email' : 'text'}
                  name={field}
                  value={value}
                  onChange={handleInputChange}
                  readOnly={readOnlyFields.includes(field)}
                  disabled={!isEditing && !readOnlyFields.includes(field)}
                  className={readOnlyFields.includes(field) ? 'bg-light' : ''}
                />
              </Form.Group>
            )
          ))}
          <div className="d-flex justify-content-between mt-4">
            <Button 
              variant={isEditing ? "outline-secondary" : "outline-primary"} 
              onClick={() => setIsEditing(!isEditing)}
              className="d-flex align-items-center"
            >
              {isEditing ? (
                <>
                  <X size={18} className="me-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit3 size={18} className="me-2" />
                  Edit Profile
                </>
              )}
            </Button>
            {isEditing && (
              <Button 
                variant="primary" 
                onClick={handleSave}
                className="d-flex align-items-center"
              >
                <Save size={18} className="me-2" />
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
      <Card className="shadow-sm">
        <Card.Header className="bg-white">
          <Nav variant="tabs" className="border-bottom-0">
            <Nav.Item>
              <Nav.Link eventKey="academic" className="d-flex align-items-center">
                <Book size={18} className="me-2" />
                Academic Details
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="personal" className="d-flex align-items-center">
                <User size={18} className="me-2" />
                Personal Details
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="guardian" className="d-flex align-items-center">
                <UserPlus size={18} className="me-2" />
                Guardian Details
              </Nav.Link>
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
      <Row>
        {Object.entries(academicData).map(([field, value]) => (
          <Col md={6} key={field}>
            <Form.Group controlId={field} className="mb-3">
              <Form.Label className="d-flex align-items-center">
                <Book size={18} className="me-2 text-primary" />
                {field.split(/(?=[A-Z])/).join(' ').charAt(0).toUpperCase() + 
                 field.split(/(?=[A-Z])/).join(' ').slice(1)}
              </Form.Label>
              <Form.Control
                type="text"
                name={field}
                value={value}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={!isEditing ? 'bg-light' : ''}
              />
            </Form.Group>
          </Col>
        ))}
      </Row>
      <div className="d-flex justify-content-between mt-3">
        <Button 
          variant={isEditing ? "outline-secondary" : "outline-primary"}
          onClick={() => setIsEditing(!isEditing)}
          className="d-flex align-items-center"
        >
          {isEditing ? (
            <>
              <X size={18} className="me-2" />
              Cancel
            </>
          ) : (
            <>
              <Edit3 size={18} className="me-2" />
              Edit Details
            </>
          )}
        </Button>
        {isEditing && (
          <Button 
            variant="primary" 
            onClick={handleSave}
            className="d-flex align-items-center"
          >
            <Save size={18} className="me-2" />
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

  const getFieldIcon = (field) => {
    switch(field) {
      case 'religion': return <Globe size={18} className="text-primary" />;
      case 'languages': return <Book size={18} className="text-primary" />;
      case 'city': return <Home size={18} className="text-primary" />;
      case 'country': return <Globe size={18} className="text-primary" />;
      default: return null;
    }
  };

  return (
    <Form>
      <Row>
        {Object.entries(personalData).map(([field, value]) => (
          <Col md={6} key={field}>
            <Form.Group controlId={field} className="mb-3">
              <Form.Label className="d-flex align-items-center">
                {getFieldIcon(field)}
                <span className="ms-2">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </span>
              </Form.Label>
              <Form.Control
                type="text"
                name={field}
                value={value}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={!isEditing ? 'bg-light' : ''}
                placeholder={field === 'languages' ? 'Enter languages separated by commas' : `Enter ${field}`}
              />
            </Form.Group>
          </Col>
        ))}
      </Row>
      <div className="d-flex justify-content-between mt-3">
        <Button 
          variant={isEditing ? "outline-secondary" : "outline-primary"}
          onClick={() => setIsEditing(!isEditing)}
          className="d-flex align-items-center"
        >
          {isEditing ? (
            <>
              <X size={18} className="me-2" />
              Cancel
            </>
          ) : (
            <>
              <Edit3 size={18} className="me-2" />
              Edit Details
            </>
          )}
        </Button>
        {isEditing && (
          <Button 
            variant="primary" 
            onClick={handleSave}
            className="d-flex align-items-center"
          >
            <Save size={18} className="me-2" />
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

  const getFieldIcon = (field) => {
    switch(field) {
      case 'parentName': return <User size={18} className="text-primary" />;
      case 'relationship': return <UserPlus size={18} className="text-primary" />;
      case 'contactNumber': 
      case 'emergencyContact':
      case 'alternativeContact':
        return <Phone size={18} className="text-primary" />;
      case 'email': return <Mail size={18} className="text-primary" />;
      case 'occupation': return <Book size={18} className="text-primary" />;
      case 'address': return <Home size={18} className="text-primary" />;
      default: return null;
    }
  };

  return (
    <Form>
      <Row>
        {Object.entries(guardianData).map(([field, value]) => (
          <Col md={6} key={field}>
            <Form.Group controlId={field} className="mb-3">
              <Form.Label className="d-flex align-items-center">
                {getFieldIcon(field)}
                <span className="ms-2">
                  {field.split(/(?=[A-Z])/).join(' ').charAt(0).toUpperCase() + 
                   field.split(/(?=[A-Z])/).join(' ').slice(1)}
                </span>
              </Form.Label>
              <Form.Control
                type={field === 'email' ? 'email' : 
                      field.includes('contact') || field === 'contactNumber' ? 'tel' : 'text'}
                name={field}
                value={value}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={!isEditing ? 'bg-light' : ''}
              />
            </Form.Group>
          </Col>
        ))}
      </Row>
      <div className="d-flex justify-content-between mt-3">
        <Button 
          variant={isEditing ? "outline-secondary" : "outline-primary"}
          onClick={() => setIsEditing(!isEditing)}
          className="d-flex align-items-center"
        >
          {isEditing ? (
            <>
              <X size={18} className="me-2" />
              Cancel
            </>
          ) : (
            <>
              <Edit3 size={18} className="me-2" />
              Edit Details
            </>
          )}
        </Button>
        {isEditing && (
          <Button 
            variant="primary" 
            onClick={handleSave}
            className="d-flex align-items-center"
          >
            <Save size={18} className="me-2" />
            Save Changes
          </Button>
        )}
      </div>
    </Form>
  );
};

export default Profile;