//navigation bar with links to different pages
import React from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import logo from '/Users/kumuluvv/sensai-react-frame/src/Sensei Logo.png' // Replace with your logo's path
//import './Navbar.css';


function MainNavBar() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary w-100">
      <Container>
        <Navbar.Brand href="/home"> 
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
            <NavDropdown title="Me" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}


// function Navbar() {
//   return (
//     <nav className="navbar">
//       <Link to="/">Home</Link>
//       <Link to="/calendar">Calendar</Link>
//     </nav>
//   );
// }

export default MainNavBar;
