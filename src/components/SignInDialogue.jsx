import React, { useState } from "react";
import { useSignIn } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { Button, Form, Card } from "react-bootstrap";

function SignInDialogue() {
  const signIn = useSignIn();//This initializes the sign-in function, which will store authentication data upon success.
  const navigate = useNavigate();//This initializes a navigation function to redirect users after signing in.
  //state variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();//prevents the page from refreshing when the form is submitted.
    if (email === "test@example.com" && password === "password123") {//example ahrdcoded user info. replace with ikenna's backend API call
      signIn({
        token: "fake-jwt-token",//replace witk ttoken received from backend after authentication
        expiresIn: 3600,//Token expires in 1 hour
        tokenType: "Bearer",//Standard authentication token type.
        authState: { email },//Stores the user’s email in the auth state.
      });
      navigate("/calendar");//Redirects the User to the Calendar Page if login is successful.
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <Card className="p-4">
      <Card.Body>
        <h2 className="text-center mb-4">Sign In</h2>
        {error && <p className="text-danger">{error}</p>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            Sign In
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default SignInDialogue;
