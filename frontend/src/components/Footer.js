import React from "react";
import "../styles/Footer.css";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* About Section */}
        <div className="footer-about">
          <h3>About Us</h3>
          <p>
            We are a collectible figurine store passionate about bringing you
            the best items from your favorite series. Quality and service are
            our top priorities.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/checkout">Checkout</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="footer-social">
          <h3>Follow Us</h3>
          <div className="social-icons">
<a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebookF /></a>
<a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
<a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
<a href="https://linkedin.com" target="_blank" rel="noreferrer"><FaLinkedinIn /></a>

          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Mono-Fig. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
