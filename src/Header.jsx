import React from 'react';
import { Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';

function Header() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#e82c74', height: "75px" }}>
            <div className="container-fluid">
                {/* Brand */}
                <Link className="navbar-brand fs-4" to="/"><h1>Event Planner</h1></Link>
                
                {/* Navbar Toggler */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navbar Links (Right-aligned) */}
                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item ms-3">
                            <Link className="nav-link fs-5" to="/">Home</Link> {/* Increased size to fs-4 */}
                        </li>
                        <li className="nav-item ms-3">
                            <Link className="nav-link fs-5" to="/venues">Venues</Link> {/* Increased size to fs-4 */}
                        </li>
                        <li className="nav-item ms-3">
                            <Link className="nav-link fs-5" to="/vendors">Vendors</Link> {/* Increased size to fs-4 */}
                        </li>
                        <li className="nav-item ms-3"> {/* Added extra gap after vendors */}
                            &nbsp;
                        </li>
                    </ul>
                </div>

                {/* User Profile Icon */}
                <div className="d-flex">
                    <ul className="navbar-nav">
                        <li className="nav-item text-center">
                            <Link className="nav-link fs-5" to="/profile">
                                <FontAwesomeIcon icon={faUser} size="lg" />
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Header;
