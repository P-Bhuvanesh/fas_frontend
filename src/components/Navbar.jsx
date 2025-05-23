import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaUserPlus,
  FaThLarge,
  FaTachometerAlt,
  FaChartBar,
  FaUsers,
  FaUserCog,
  FaCogs,
  FaInfoCircle,
} from "react-icons/fa";
import "../styles/Navbar.css";
import logo from "../assets/logo.png";

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
        <img src={logo} alt="Trusten Vision Logo" className="nav-logo" />
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
          <Link to="/activeuser" onClick={() => setMenuOpen(false)}>
            <FaUsers className="nav-icon" />
            Active Users
          </Link>
        </li>
        <li>
          <Link to="/about" onClick={() => setMenuOpen(false)}>
            <FaInfoCircle className="nav-icon" />
            About
          </Link>
        </li>
        <li>
          <Link to="/admin/login" onClick={() => setMenuOpen(false)}>
            <FaUserCog className="nav-icon" />
            Admin
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
