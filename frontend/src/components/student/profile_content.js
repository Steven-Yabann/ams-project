import axios from 'axios';
import { Book, Calendar, Globe, Hash, Mail, Phone, User, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button, Card, Form, Nav, Tab } from 'react-bootstrap';

// API base URL - adjust as needed
const API_BASE_URL = 'http://localhost:4000/api/profileRoutes/admissionNumber';
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

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const admissionNumber = sessionStorage.getItem('admissionNumber');
        
        // Check if userId exists
        if (!admissionNumber) {
          setError('User ID not found. Please log in again.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_BASE_URL}`);
        //const response = await axios.get("http://localhost:4000/api/profileRoutes/admissionNumber", { admissionNumber });
        
        if (!response.data) {
          setError('No profile data received');
          setLoading(false);
          return;
        }

        setProfileData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'An error occurred while fetching profile data');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return (
    <div className="text-center mt-5">
      <div className="text-danger mb-3">{error}</div>
      <Button variant="primary" onClick={() => window.location.href = '/login'}>
        Go to Login
      </Button>
    </div>
  );
  if (!profileData) return (
    <div className="text-center mt-5">
      <div className="mb-3">No profile data found</div>
      <Button variant="primary" onClick={() => window.location.href = '/login'}>
        Go to Login
      </Button>
    </div>
  );

  return (
    <main className="container">
      <h1 className="mb-4 text-center">Profile</h1>
      <div className="row">
        <div className="col-md-4 mb-4">
          <ProfileInfo profileData={profileData} setProfileData={setProfileData} />
        </div>
        <div className="col-md-8">
          <AcademicDetails profileData={profileData} setProfileData={setProfileData} />
        </div>
      </div>
    </main>
  );
};

const ProfileInfo = ({ profileData, setProfileData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: profileData?.admissionNumber?.name || '',
    email: profileData?.email || '',
    admissionNumber: profileData?.admissionNumber?.admissionNumber || '',
    address: profileData?.homeAddress || '',
    dob: profileData?.dob ? new Date(profileData.dob).toISOString().split('T')[0] : '',
  });
  const [profilePicture, setProfilePicture] = useState(profileData?.profilePicture || null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('profilePicture', file);
        
        const admissionNumber = localStorage.getItem('userId');
        if (!admissionNumber) {
          setError('User ID not found. Please log in again.');
          return;
        }

        const response = await axios.put(`${API_BASE_URL}/picture`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        setProfilePicture(response.data.profile.profilePicture);
        setProfileData(prevData => ({ ...prevData, profilePicture: response.data.profile.profilePicture }));
        setError(null);
      } catch (error) {
        setError('Error uploading profile picture: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleSave = async () => {
    try {
      const admissionNumber = localStorage.getItem('admissionNumber');
      if (!admissionNumber) {
        setError('User ID not found. Please log in again.');
        return;
      }

      const response = await axios.put(`${API_BASE_URL}`, formData);
      setProfileData(response.data.profile);
      setIsEditing(false);
      setError(null);
    } catch (error) {
      setError('Error updating profile: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Card>
      <Card.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="text-center mb-4">
          <div className="position-relative mx-auto" style={{
            width: '150px', height: '150px', borderRadius: '50%', border: '4px solid #007bff', overflow: 'hidden'
          }}>
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="w-100 h-100 object-fit-cover" />
            ) : (
              <div className="d-flex align-items-center justify-content-center bg-light h-100">
                <User size={64} />
              </div>
            )}
          </div>
          {isEditing && (
            <Form.Group controlId="profilePicture" className="mt-2">
              <Form.Control type="file" onChange={handlePictureChange} accept="image/jpeg,image/png,image/jpg" />
            </Form.Group>
          )}
        </div>
        <Form>
          {Object.entries(formData).map(([field, value]) => (
            <Form.Group key={field} className="mb-3">
              <Form.Label className="d-flex align-items-center">
                {getFieldIcon(field)}
                <span className="ms-2">{field.charAt(0).toUpperCase() + field.slice(1)}</span>
              </Form.Label>
              <Form.Control
                name={field}
                value={value}
                onChange={handleInputChange}
                disabled={!isEditing || ['admissionNumber', 'dob'].includes(field)}
              />
            </Form.Group>
          ))}
          <Button variant={isEditing ? "primary" : "secondary"} onClick={isEditing ? handleSave : () => setIsEditing(true)} className="w-100">
            {isEditing ? 'Save' : 'Edit'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

const DetailsComponent = ({ details, setDetails, disabledFields, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(details);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await onSave(formData);
      setDetails(formData);
      setIsEditing(false);
      setError(null);
    } catch (error) {
      setError('Error saving details: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Card>
      <Card.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        <Form>
          <div className="row">
            {Object.entries(formData).map(([field, value]) => (
              <Form.Group key={field} className="col-md-6 mb-3">
                <Form.Label className="d-flex align-items-center">
                  {getFieldIcon(field)}
                  <span className="ms-2">{field.charAt(0).toUpperCase() + field.slice(1)}</span>
                </Form.Label>
                <Form.Control
                  name={field}
                  value={value || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing || disabledFields.includes(field)}
                  placeholder={`Enter ${field}`}
                />
              </Form.Group>
            ))}
          </div>
          <Button variant={isEditing ? "primary" : "secondary"} onClick={isEditing ? handleSave : () => setIsEditing(true)} className="w-100 mt-3">
            {isEditing ? 'Save' : 'Edit'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

const AcademicDetails = ({ profileData, setProfileData }) => {
  const [error, setError] = useState(null);
  const [academicDetails, setAcademicDetails] = useState({
    classTeacher: profileData?.classTeacher || '',
    class: profileData?.class || '',
    yearOfStudy: profileData?.yearOfStudy || '',
    gpa: profileData?.gpa || '',
    yearOfAdmission: profileData?.yearOfAdmission || '',
    graduation: profileData?.graduation || '',
  });

  const [guardianDetails, setGuardianDetails] = useState(profileData?.guardianInfo?.[0] || {
    parentName: '', relationship: '', contactNumber: '', email: '', occupation: '',
    address: '', emergencyContact: '', alternativeContact: '',
  });

  const [personalDetails, setPersonalDetails] = useState({
    dob: profileData?.dob ? new Date(profileData.dob).toISOString().split('T')[0] : '',
    nationality: profileData?.nationality || '', 
    religion: profileData?.religion || '',
    gender: profileData?.gender || '', 
    languages: (profileData?.languages || []).join(', '),
    homeAddress: profileData?.homeAddress || '', 
    city: profileData?.city || '',
    country: profileData?.country || '', 
    phone: profileData?.phone || '', 
    email: profileData?.email || '',
  });

  const handleSaveAcademic = async (data) => {
    try {
      const admissionNumber = sessionStorage.getItem('admissionNumber');
      if (!admissionNumber) throw new Error('User ID not found. Please log in again.');
      
      const response = await axios.put(`${API_BASE_URL}`, data);
      setProfileData(response.data.profile);
      setError(null);
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  };

  const handleSaveGuardian = async (data) => {
    try {
      const admissionNumber = sessionStorage.getItem('admissionNumber');
      if (!admissionNumber) throw new Error('User ID not found. Please log in again.');
      
      const response = await axios.put(`${API_BASE_URL}/admissionNumber/${admissionNumber}/guardian`, [data]);
      setProfileData(response.data.profile);
      setError(null);
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  };

  const handleSavePersonal = async (data) => {
    try {
      const admissionNumber = sessionStorage.getItem('admissionNumber');
      if (!admissionNumber) throw new Error('User ID not found. Please log in again.');
      
      const updatedData = { ...data, languages: data.languages.split(',').map(lang => lang.trim()) };
      const response = await axios.put(`${API_BASE_URL}`, updatedData);
      setProfileData(response.data.profile);
      setError(null);
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  };

  return (
    <Card>
      <Card.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        <Tab.Container defaultActiveKey="academic">
          <Nav variant="tabs" className="mb-3">
            <Nav.Item><Nav.Link eventKey="academic">Academic</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="guardian">Parent/Guardian details</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="personal">Personal details</Nav.Link></Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="academic">
              <DetailsComponent details={academicDetails} setDetails={setAcademicDetails} disabledFields={['classTeacher', 'class', 'yearOfStudy', 'yearOfAdmission', 'graduation', 'gpa']} onSave={handleSaveAcademic} />
            </Tab.Pane>
            <Tab.Pane eventKey="guardian">
              <DetailsComponent details={guardianDetails} setDetails={setGuardianDetails} disabledFields={[]} onSave={handleSaveGuardian} />
            </Tab.Pane>
            <Tab.Pane eventKey="personal">
              <DetailsComponent details={personalDetails} setDetails={setPersonalDetails} disabledFields={[]} onSave={handleSavePersonal} />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Card.Body>
    </Card>
  );
};

const getFieldIcon = (field) => {
  const iconProps = { size: 20, className: "text-muted" };
  switch (field.toLowerCase()) {
    case 'name': case 'parentname': return <User {...iconProps} />;
    case 'email': return <Mail {...iconProps} />;
    case 'admissionnumber': return <Hash {...iconProps} />;
    case 'address': case 'homeaddress': return <User {...iconProps} />;
    case 'dob': return <Calendar {...iconProps} />;
    case 'class': case 'yearofstudy': case 'gpa': case 'yearofadmission': case 'graduation': return <Book {...iconProps} />;
    case 'relationship': return <Users {...iconProps} />;
    case 'contactnumber': case 'phone': case 'emergencycontact': case 'alternativecontact': return <Phone {...iconProps} />;
    case 'nationality': case 'country': return <Globe {...iconProps} />;
    default: return null;
  }
};

export default Profile;