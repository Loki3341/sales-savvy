import React from 'react';
import '../../assets/styles/components.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-brand">
            <h3 className="footer-title">Sales Savvy</h3>
            <p className="footer-description">
              Your trusted partner for quality products and exceptional shopping experience.
            </p>
          </div>
        </div>
        
        <div className="footer-columns">
          <div className="footer-column">
            <h4 className="footer-heading">Quick Links</h4>
            <div className="footer-links">
              <a href="/about" className="footer-link">About Us</a>
              <a href="/contact" className="footer-link">Contact</a>
              <a href="/support" className="footer-link">Support</a>
            </div>
          </div>
          
          <div className="footer-column">
            <h4 className="footer-heading">Legal</h4>
            <div className="footer-links">
              <a href="/terms" className="footer-link">Terms of Service</a>
              <a href="/privacy" className="footer-link">Privacy Policy</a>
              <a href="/returns" className="footer-link">Return Policy</a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="copyright">
            &copy; 2024 Sales Savvy. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <a href="/sitemap" className="footer-bottom-link">Sitemap</a>
            <a href="/accessibility" className="footer-bottom-link">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;