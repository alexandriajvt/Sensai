//navigation bar with links to different pages
import React from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import logo from '/Users/segun/sensai/Sensai/my-app/src/Sensei_Logo.png' 
//import './Navbar.css';


function MainNavBar() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary w-100" >
      <Container>
        <Navbar.Brand href="/calendar"> 
          <img
            src={logo}
            width="75"
            height="75"
            alt="Sensei Logo"
          />
        </Navbar.Brand> 
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="justify-content-between w-100">
            <Nav.Link as={Link} to="/calendar">Calendar</Nav.Link> 
            <Nav.Link as={Link} to="/explore">Explore</Nav.Link> 
            <NavDropdown title="Me" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to ="/profile">Profile</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/events">Schedule an Event </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/settings">Settings </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/logout">Log Out </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MainNavBar;
