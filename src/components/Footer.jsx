import React from "react";
import "../styles/Footer.css";
import {
  FaDiscord,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaWhatsapp,
  FaCopyright,
} from "react-icons/fa";
import { MdEmail, MdCopyright } from "react-icons/md";
import logo from "../assets/logo.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content container">
        <div className="footer-logo">
          <img src={logo} alt="Company Logo" />
          <p className="slogan">Let Your Face Do the Logging</p>
        </div>
        <div className="footer-section social-section">
          <h4>Social Connections</h4>
          <ul className="social-links">
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram className="social-icon" />
                <span>Instagram</span>
              </a>
            </li>
            <li>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className="social-icon" />
                <span>LinkedIn</span>
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <FaTwitter className="social-icon" />
                <span>Twitter</span>
              </a>
            </li>
            <li>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discord"
              >
                <FaDiscord className="social-icon" />
                <span>Discord</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-section contact-section">
          <h4>Contact Us</h4>
          <ul className="contact-links">
            <li>
              <a
                href="https://wa.me/919363588662"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Bhuvanesh"
              >
                <FaWhatsapp className="contact-icon" />
                <span>+91 93635 88662</span>
              </a>
            </li>
            <li>
              <a href="mailto:pbhuvanesh345@gmail.com">
                <MdEmail className="contact-icon" />
                <span>pbhuvanesh345@gmail.com</span>
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/919363293416"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Pugazenthi"
              >
                <FaWhatsapp className="contact-icon" />
                <span>+91 93632 93416</span>
              </a>
            </li>
            <li>
              <a href="mailto:bhuvaneshpugazenthi@gmail.com">
                <MdEmail className="contact-icon" />
                <span>bhuvaneshpugazenthi@gmail.com</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-divider"></div>
      <div className="footer-bottom container">
        <p className="footer-text">
          <FaCopyright /> Trusten.Vision &nbsp;||&nbsp; All rights reserved 2025
          &nbsp;||&nbsp; A dotVision product &nbsp;||&nbsp; Designed and
          Developed by dotVision devs
        </p>
      </div>
    </footer>
  );
};

export default Footer;