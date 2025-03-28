import React, { useState } from "react";
import "../styles/Navbar.css";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navContainer">
      <div className="nav-left">Facial Attendance</div>

      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
        <li><Link to="/adduser" onClick={() => setMenuOpen(false)}>Add User</Link></li>
        <li><Link to="/activeuser" onClick={() => setMenuOpen(false)}>Active Users</Link></li>
        <li><Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link></li>
        <li><Link to="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
