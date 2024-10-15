import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';   
import SignUp from './sign_in';


export default function LogIn( {onLogin} ){

    const handle_login = () => {
        onLogin();
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
                                 <Form className="mb-3">
                                 <Form.Group className="mb-3" controlId="formBasicEmail">
                                     <Form.Label className="text-center" htmlFor='email'>Email address</Form.Label>
                                     <Form.Control 
                                    //    type="email" 
                                    //    placeholder="Enter email" 
                                    //    name='email' 
                                    //    value={email}
                                    //    onChange={(e) => setEmail(e.target.value)}
                                     />
                                 </Form.Group>
    
                                 <Form.Group className="mb-3" controlId="formBasicPassword">
                                     <Form.Label htmlFor='password'>Password</Form.Label>
                                     <Form.Control 
                                    //    type="password" 
                                    //    placeholder="Password" 
                                    //    name='password'
                                    //    value={password}
                                    //    onChange={(e) => setPassword(e.target.value)}
                                     />
                                 </Form.Group>
                                 {/* {error && <p className="text-danger">{error}</p>} */}
                                 <div className="d-grid">
                                     <Button variant="primary" type="submit" onClick={handle_login}>
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
