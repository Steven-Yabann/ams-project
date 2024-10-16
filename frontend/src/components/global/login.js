import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';   
import SignUp from './sign_in';
import { useState } from 'react';


export default function Login({ onLogin }){
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    function handleSubmit(event) {
        event.preventDefault()
    }
    
       
    return(   
            <>
              <form>
                 <Container>
                     <Row className="vh-100 d-flex justify-content-center align-items-center">
                         <Col md={8} lg={6} xs={12}>
                         <Card className="shadow">
                             <Card.Body>
                             <div className="mb-3 mt-4">
                                 <h2 className="fw-bold text-uppercase mb-2">AMS</h2>
                                 <p className="mb-5">Please enter your email and password!</p>
                                 <Form className="mb-3" onSubmit={handleSubmit}>
                                 <Form.Group className="mb-3" controlId="formBasicEmail">
                                     <Form.Label className="text-center" htmlFor='email'>Email address</Form.Label>
                                     <Form.Control 
                                       type="email" 
                                       placeholder="Email" 
                                       name='email'
                                       onChange={e => setEmail(e.target.value)} 
                                     />
                                 </Form.Group>
    
                                 <Form.Group className="mb-3" controlId="formBasicPassword">
                                     <Form.Label htmlFor='password'>Password</Form.Label>
                                     <Form.Control 
                                       type="password" 
                                       placeholder="Password" 
                                       name='password'
                                       onChange={e => setPassword(e.target.value)}
                                     />
                                 </Form.Group>
                                 {/* {error && <p className="text-danger">{error}</p>} */}
                                 <div className="d-grid">
                                     <Button variant="primary" type="submit" onClick={onLogin}>
                                     Login
                                     </Button>
                                 </div>
                                 </Form>
                             </div>
                             </Card.Body>
                         </Card>
                         </Col>
                     </Row>
                 </Container>
              </form>
            </>
    )

}
