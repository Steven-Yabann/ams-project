import { Book, Calendar, Globe, Hash, Mail, MProfilein, Phone, User, Users } from 'lucide-react';
import { useState } from 'react';
import { Button, Card, Form, Nav, Tab } from 'react-bootstrap';

const Profile = () => {
  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar component would go here */}
      <div className="flex-grow-1 bg-light p-3">
        <ProfileContent />
      </div>
    </div>
  );
};

const ProfileContent = () => {
  return (
    <main className="container">
      <h1 className="mb-4 text-center">Profile</h1>
      <div className="row">
        <div className="col-md-4 mb-4">
          <ProfileInfo />
        </div>
        <div className="col-md-8">
          <AcademicDetails />
        </div>
      </div>
    </main>
  );
};

const ProfileInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Student Name',
    email: 'student@example.com',
    admissionNumber: '123456',  // Admin/Teacher-only field
    address: '1234 School St.',
    dob: '01-01-2000',  // Admin/Teacher-only field
  });
  const [profilePicture, setProfilePicture] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    console.log('Profile data saved:', profileData);
    setIsEditing(false);
  };

  return (
    <Card>
      <Card.Body>
        <div className="text-center mb-4">
          <div style={{
            width: '150px',
            height: '150px',
            margin: '0 auto',
            borderRadius: '50%',
            border: '4px solid #007bff',
            overflow: 'hidden'
          }}>
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div className="d-flex align-items-center justify-content-center bg-light h-100">
                <User size={64} />
              </div>
            )}
          </div>
          {isEditing && (
            <Form.Group controlId="profilePicture" className="mt-2">
              <Form.Control type="file" onChange={handlePictureChange} />
            </Form.Group>
          )}
        </div>
        <Form>
          {Object.entries(profileData).map(([field, value]) => (
            <Form.Group key={field} className="mb-3">
              <Form.Label className="d-flex align-items-center">
                {getFieldIcon(field)}
                <span className="ms-2">{field.charAt(0).toUpperCase() + field.slice(1)}</span>
              </Form.Label>
              <Form.Control
                name={field}
                value={value}
                onChange={handleInputChange}
                disabled={!isEditing || ['admissionNumber', 'dob'].includes(field)}  // Disable admin/teacher fields
              />
            </Form.Group>
          ))}
          <Button
            variant={isEditing ? "primary" : "secondary"}
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            className="w-100"
          >
            {isEditing ? 'Save' : 'Edit'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

const DetailsComponent = ({ details, setDetails, disabledFields }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleSave = () => {
    console.log('Details saved:', details);
    setIsEditing(false);
  };

  return (
    <Card>
      <Card.Body>
        <Form>
          <div className="row">
            {Object.entries(details).map(([field, value]) => (
              <Form.Group key={field} className="col-md-6 mb-3">
                <Form.Label className="d-flex align-items-center">
                  {getFieldIcon(field)}
                  <span className="ms-2">{field.charAt(0).toUpperCase() + field.slice(1)}</span>
                </Form.Label>
                <Form.Control
                  name={field}
                  value={value}
                  onChange={handleInputChange}
                  disabled={!isEditing || disabledFields.includes(field)}  // Disable admin/teacher fields
                  placeholder={`Enter ${field}`}
                />
              </Form.Group>
            ))}
          </div>
          <Button
            variant={isEditing ? "primary" : "secondary"}
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            className="w-100 mt-3"
          >
            {isEditing ? 'Save' : 'Edit'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

const AcademicDetails = () => {
  const [academicDetails, setAcademicDetails] = useState({
    classTeacher: '',  // Admin/Teacher-only field
    class: '',         // Admin/Teacher-only field
    yearOfStudy: '',   // Admin/Teacher-only field
    gpa: '',
    yearOfAdmission: '',  // Admin/Teacher-only field
    graduation: '',    // Admin/Teacher-only field
  });

  const [guardianDetails, setGuardianDetails] = useState({
    parentName: '',
    relationship: '',
    contactNumber: '',
    email: '',
    occupation: '',
    address: '',
    emergencyContact: '',
    alternativeContact: '',
  });

  const [personalDetails, setPersonalDetails] = useState({
    dob: '',
    nationality: '',
    religion: '',
    gender: '',
    languages: '',
    homeAddress: '',
    city: '',
    country: '',
    phone: '',
    email: '',
  });

  return (
    <Card>
      <Card.Body>
        <Tab.Container defaultActiveKey="academic">
          <Nav variant="tabs" className="mb-3">
            <Nav.Item>
              <Nav.Link eventKey="academic">Academic</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="guardian">Parent/Guardian details</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="personal">Personal details</Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="academic">
              <DetailsComponent
                details={academicDetails}
                setDetails={setAcademicDetails}
                disabledFields={['classTeacher', 'class', 'yearOfStudy', 'yearOfAdmission', 'graduation', 'gpa']}  // Disable these fields
              />
            </Tab.Pane>
            <Tab.Pane eventKey="guardian">
              <DetailsComponent details={guardianDetails} setDetails={setGuardianDetails} disabledFields={[]} />
            </Tab.Pane>
            <Tab.Pane eventKey="personal">
              <DetailsComponent details={personalDetails} setDetails={setPersonalDetails} disabledFields={[]} />
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
    case 'name':
    case 'parentname':
      return <User {...iconProps} />;
    case 'email':
      return <Mail {...iconProps} />;
    case 'admissionnumber':
      return <Hash {...iconProps} />;
    case 'address':
    case 'homeaddress':
      return <MProfilein {...iconProps} />;
    case 'dob':
      return <Calendar {...iconProps} />;
    case 'class':
    case 'yearofstudy':
    case 'gpa':
    case 'yearofadmission':
    case 'graduation':
      return <Book {...iconProps} />;
    case 'relationship':
      return <Users {...iconProps} />;
    case 'contactnumber':
    case 'phone':
    case 'emergencycontact':
    case 'alternativecontact':
      return <Phone {...iconProps} />;
    case 'nationality':
    case 'country':
      return <Globe {...iconProps} />;
    default:
      return null;
  }
};

export default Profile;
