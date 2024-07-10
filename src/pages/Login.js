import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }

    try {
      const response = await axios.post(
        `https://reemapp-dcca9dc801ff.herokuapp.com/api/users/${email}/${password}`,
        {
          email: email,
          password: password,
        }
      );

      if (response.data) {
        setEmail("");
        setPassword("");
        //setValidated(false);
        navigate("/products");
      } else {
        setErrorMessage("Invalid email or password");
        setValidated(false);
      }
    } catch (error) {
      setErrorMessage("Error: " + error.message);
      setValidated(false);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-start min-vh-100"
      style={{ maxWidth: "600px", marginTop: "2%" }}
    >
      <div className="p-4 border rounded-3 shadow-lg bg-light w-100">
        <h2 className="text-center mb-4">Login</h2>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              required
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!email && validated}
              className="form-control-lg"
            />
            <Form.Control.Feedback type="invalid">
              Please enter a valid email address.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formPassword" className="mt-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!password && validated}
              className="form-control-lg"
            />
            <Form.Control.Feedback type="invalid">
              Please enter a password.
            </Form.Control.Feedback>
          </Form.Group>

          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

          <Button variant="primary" type="submit" className="mt-4 w-100">
            Login
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default LoginPage;
