import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/unnamed.jpg';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  // Logout function
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/logout', {}, { withCredentials: true });
      navigate('/SignIn');  // Redirect to SignIn page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className='navbar'>
      <img src={logo} alt="Iset Logo" className="logo" />
      <ul className='navbar-links'>
        <li><a href="/">Accueil</a></li>
        <li className='dropdown'>
          <span className='dropbtn'>Connection</span>
          <div className='dropdown-content'>
            <Link to="/SignIn">SignIn</Link>
            <Link to="/SignUp">SignUp</Link>
            <button onClick={handleLogout} className="logout-button">Logout</button> {/* Logout Button */}
          </div>
        </li>
        <li><a href="/Apropos">A propos</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;