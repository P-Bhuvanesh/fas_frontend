import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaHome, FaUserPlus, FaUsers, FaCogs, FaInfoCircle } from "react-icons/fa";
import "../styles/Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <nav className="navContainer">
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      <div className="nav-left">
        <img src="./src/assets/logo.png" alt="Trusten Vision Logo" className="nav-logo" />
        Trusten.Vision
      </div>

      <ul ref={menuRef} className={`nav-links ${menuOpen ? "active" : ""}`}>
        
        <li>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <FaHome className="nav-icon" />
            Home
          </Link>
        </li>
        <li>
          <Link to="/adduser" onClick={() => setMenuOpen(false)}>
            <FaUserPlus className="nav-icon" />
            Add User
          </Link>
        </li>
        <li>
          <Link to="/activeuser" onClick={() => setMenuOpen(false)}>
            <FaUsers className="nav-icon" />
            Active Users
          </Link>
        </li>
        <li>
          <Link to="/admin" onClick={() => setMenuOpen(false)}>
            <FaCogs className="nav-icon" />
            Admin
          </Link>
        </li>
        <li>
          <Link to="/about" onClick={() => setMenuOpen(false)}>
            <FaInfoCircle className="nav-icon" />
            About
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
