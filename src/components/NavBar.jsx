import React from 'react';
import './NavBar.css'; // Add styles for the navbar
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
            <img src="/images/FamilyMe_templogo.png" alt="Logo" />
        </Link>
      </div>
      <div className="navbar-user">
        <img src="/images/person_icon.svg" alt="User" />
      </div>
    </nav>
  );
};

export default NavBar;