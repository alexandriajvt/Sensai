import React from "react";
import SignInDialogue from "../components/SignInDialogue";
import { Container, Row, Col } from "react-bootstrap";

function SignInPage() {
  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Row>
        <Col>
          <SignInDialogue />
        </Col>
      </Row>
    </Container>
  );
}

export default SignInPage;
