// import React from 'react';
// import "bootstrap/dist/css/bootstrap.css";
// import "bootstrap/dist/js/bootstrap.bundle";

// function Footer() {
//     return (
//         <footer className="footer bg-dark text-white py-3">
//             <div className="container text-center">
//                 <p className="mb-1">&copy; 2024 Event Planner. All rights reserved.</p>
//                 <p className="mb-0">
//                     <a href="mailto:admin@eventplanner.com" className="text-white me-3">
//                         admin@eventplanner.com
//                     </a> 
//                     | 
//                     <a href="tel:+91 9876543210" className="text-white ms-3">
//                         +91 9876543210
//                     </a>
//                 </p>
//             </div>
//         </footer>
//     );
// }

// export default Footer;

import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section brand">
          <h2 className="logo">Event Planner</h2>
          <p>Creating memorable experiences tailored to your vision since 2010.</p>
          <div className="social">
            <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
            <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
            <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
            <a href="#" aria-label="LinkedIn"><Linkedin size={20} /></a>
          </div>
        </div>
        
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/services">Services</a></li>
            {/* <li><a href="/gallery">Gallery</a></li>
            <li><a href="/blog">Blog</a></li> */}
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
        
        <div className="footer-section services">
          <h3>Our Services</h3>
          <ul>
            <li><a href="/services/weddings">Weddings</a></li>
            <li><a href="/services/corporate">Corporate Events</a></li>
            <li><a href="/services/birthday">Birthday Parties</a></li>
            <li><a href="/services/social">Social Gatherings</a></li>
            <li><a href="/services/custom">Custom Events</a></li>
          </ul>
        </div>
        
        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <div className="contact-info">
            <p>
              <Mail size={16} className="icon" />
              <a href="mailto:admin@eventplanner.com">admin@eventplanner.com</a>
            </p>
            <p>
              <Phone size={16} className="icon" />
              <a href="tel:+919876543210">+91 9876543210</a>
            </p>
            <p>
              <MapPin size={16} className="icon" />
              123 Event Street, Party City
            </p>
          </div>
          {/* <div className="newsletter">
            <h3>Subscribe</h3>
            <form>
              <input type="email" placeholder="Enter your email" required />
              <button type="submit">Subscribe</button>
            </form>
          </div> */}
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Event Planner. All rights reserved.</p>
        <div className="footer-legal">
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
          <a href="/cookies">Cookies</a>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: linear-gradient(to right, #1a1a1a, #2d2d2d);
          color: #f8f9fa;
          font-family: 'Inter', sans-serif;
          width: 100%;
        }

        .footer-content {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 2rem;
          padding: 3rem 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        @media (min-width: 640px) {
          .footer-content {
            grid-template-columns: repeat(2, 1fr);
            padding: 4rem 2rem;
          }
        }

        @media (min-width: 992px) {
          .footer-content {
            grid-template-columns: repeat(4, 1fr);
            padding: 5rem 2rem;
          }
        }

        .footer-section {
          margin-bottom: 1.5rem;
        }

        .footer-section h2, 
        .footer-section h3 {
          color: #ffffff;
          margin-bottom: 1.25rem;
          font-weight: 600;
          position: relative;
          padding-bottom: 0.75rem;
        }

        .footer-section h2:after, 
        .footer-section h3:after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 50px;
          height: 2px;
          background: #3f8cf3;
        }

        /* Brand Section */
        .brand p {
          margin-bottom: 1.5rem;
          line-height: 1.6;
          color: #cccccc;
        }

        .logo {
          font-size: 1.75rem;
          color: #ffffff;
        }

        .social {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .social a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          transition: all 0.3s ease;
        }

        .social a:hover {
          background-color: #3f8cf3;
          transform: translateY(-3px);
        }

        /* Links Section */
        .links ul, .services ul {
          list-style: none;
          padding: 0;
        }

        .links ul li, .services ul li {
          margin-bottom: 0.75rem;
        }

        .links ul li a, .services ul li a {
          color: #cccccc;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-block;
          position: relative;
        }

        .links ul li a:hover, .services ul li a:hover {
          color: #3f8cf3;
          padding-left: 5px;
        }

        /* Contact Section */
        .contact-info p {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
          color: #cccccc;
        }

        .icon {
          margin-right: 0.75rem;
          color: #3f8cf3;
        }

        .contact-info a {
          color: #cccccc;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .contact-info a:hover {
          color: #3f8cf3;
        }

        /* Newsletter */
        .newsletter {
          margin-top: 2rem;
        }

        .newsletter h3 {
          margin-bottom: 1rem;
        }

        .newsletter form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        @media (min-width: 640px) {
          .newsletter form {
            flex-direction: row;
          }
        }

        .newsletter input {
          flex: 1;
          padding: 0.75rem;
          border: none;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          outline: none;
        }

        .newsletter input::placeholder {
          color: #aaaaaa;
        }

        .newsletter button {
          padding: 0.75rem 1.5rem;
          background: #3f8cf3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.3s ease;
          font-weight: 600;
        }

        .newsletter button:hover {
          background: #2a7de1;
        }

        /* Footer Bottom */
        .footer-bottom {
          background: rgba(0, 0, 0, 0.2);
          padding: 1.5rem;
          text-align: center;
          font-size: 0.875rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
        }

        @media (min-width: 768px) {
          .footer-bottom {
            flex-direction: row;
            justify-content: space-between;
            padding: 1.5rem 2rem;
          }
        }

        .footer-legal {
          display: flex;
          gap: 1.5rem;
        }

        .footer-legal a {
          color: #aaaaaa;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .footer-legal a:hover {
          color: #3f8cf3;
        }

        /* Responsive adjustments */
        @media (max-width: 639px) {
          .footer-section:not(:last-child) {
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding-bottom: 1.5rem;
          }
        }
      `}</style>
    </footer>
  );
}

export default Footer;