import axios from "axios";
import { useState } from "react";
import { Container, Button, Form, Modal } from "react-bootstrap";

function Create({ onCreatedUser }) {
  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isValid, setIsValid] = useState(false);

  const handleClose = () => {
    setShow(false);
    setValidated(false);
  };

  const handleShow = () => setShow(true);

  const createUser = async () => {
    try {
      const response = await axios.post("http://localhost:3004/api/users", {
        name,
        email,
        password,
      });
      
      onCreatedUser(); // Trigger any event on user creation
      setConfirm(""); // Reset confirmation field
      setValidated(false); // Reset form validation state
    } catch (error) {
      alert("Error: " + error);
    }
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false || isValid) {
      event.preventDefault();
      event.stopPropagation();
    
    } else {
      createUser();
      handleClose();
    }
    setValidated(true);
  };

  const checkMatch = () => {
    if (confirm !== password) {
      setIsValid(true); // Show validation state
    } else {
      setIsValid(false); // Hide validation state
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-start min-vh-100" style={{ maxWidth: "600px", marginTop: "2%" }}>
      <div className="p-4 border rounded-3 shadow-lg bg-light w-100">
        <h2 className="text-center mb-4">Registration</h2>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              Please enter your name.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              required
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              Please enter a valid email address.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              Please Enter a password.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              onBlur={checkMatch}
              isInvalid={isValid}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              Passwords do not match.
            </Form.Control.Feedback>
          </Form.Group>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Register
            </Button>
          </Modal.Footer>
        </Form>
      </div>
    </Container>
  );
}

export default Create;
