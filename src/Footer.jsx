import React from 'react';
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";

function Footer() {
    return (
        <footer className="footer bg-dark text-white py-3">
            <div className="container text-center">
                <p className="mb-1">&copy; 2024 Event Planner. All rights reserved.</p>
                <p className="mb-0">
                    <a href="mailto:admin@eventplanner.com" className="text-white me-3">
                        admin@eventplanner.com
                    </a> 
                    | 
                    <a href="tel:+91 9876543210" className="text-white ms-3">
                        +91 9876543210
                    </a>
                </p>
            </div>
        </footer>
    );
}

export default Footer;
