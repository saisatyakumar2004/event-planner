// import React from 'react';
// import { Link } from 'react-router-dom';
// import "bootstrap/dist/css/bootstrap.css";
// import "bootstrap/dist/js/bootstrap.bundle";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faUser } from '@fortawesome/free-regular-svg-icons';

// function Header() {
//     return (
//         <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#e82c74', height: "75px" }}>
//             <div className="container-fluid">
//                 {/* Brand */}
//                 <Link className="navbar-brand fs-4" to="/"><h1>Event Planner</h1></Link>
                
//                 {/* Navbar Toggler */}
//                 <button
//                     className="navbar-toggler"
//                     type="button"
//                     data-bs-toggle="collapse"
//                     data-bs-target="#navbarNav"
//                     aria-controls="navbarNav"
//                     aria-expanded="false"
//                     aria-label="Toggle navigation"
//                 >
//                     <span className="navbar-toggler-icon"></span>
//                 </button>

//                 {/* Navbar Links (Right-aligned) */}
//                 <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
//                     <ul className="navbar-nav">
//                         <li className="nav-item ms-3">
//                             <Link className="nav-link fs-5" to="/">Home</Link> {/* Increased size to fs-4 */}
//                         </li>
//                         <li className="nav-item ms-3">
//                             <Link className="nav-link fs-5" to="/venues">Venues</Link> {/* Increased size to fs-4 */}
//                         </li>
//                         <li className="nav-item ms-3">
//                             <Link className="nav-link fs-5" to="/vendors">Vendors</Link> {/* Increased size to fs-4 */}
//                         </li>
//                         <li className="nav-item ms-3"> {/* Added extra gap after vendors */}
//                             &nbsp;
//                         </li>
//                     </ul>
//                 </div>

//                 {/* User Profile Icon */}
//                 <div className="d-flex">
//                     <ul className="navbar-nav">
//                         <li className="nav-item text-center">
//                             <Link className="nav-link fs-5" to="/profile">
//                                 <FontAwesomeIcon icon={faUser} size="lg" />
//                             </Link>
//                         </li>
//                     </ul>
//                 </div>
//             </div>
//         </nav>
//     );
// }

// export default Header;

import React from 'react';
import { Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';

function Header() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ 
            background: 'linear-gradient(135deg, #e82c74 0%, #ff6a5b 100%)',
            height: "auto",
            minHeight: "85px",
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            padding: '10px 20px'
        }}>
            <div className="container-fluid">
                {/* Brand */}
                <Link className="navbar-brand" to="/" style={{
                    fontWeight: '700',
                    letterSpacing: '0.5px',
                    position: 'relative',
                    paddingBottom: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    // Responsive font size
                    '@media (max-width: 768px)': {
                        fontSize: '24px'
                    }
                }}>
                    <h1 style={{
                        margin: '0',
                        fontSize: 'clamp(22px, 4vw, 28px)', // Responsive font size
                        textShadow: '1px 1px 3px rgba(0, 0, 0, 0.2)',
                        position: 'relative',
                        whiteSpace: 'nowrap'
                    }}>
                        Event Planner
                        <span style={{
                            position: 'absolute',
                            bottom: '-5px',
                            left: '0',
                            width: '40%',
                            height: '3px',
                            background: 'rgba(255, 255, 255, 0.8)',
                            borderRadius: '2px'
                        }}></span>
                    </h1>
                </Link>
                
                {/* Navbar Toggler */}
                <div className="d-flex align-items-center d-lg-none" style={{ gap: '15px' }}>
                    {/* Mobile Profile Icon - Shown only on small screens */}
                    <div className="d-lg-none">
                        <Link to="/profile" style={{
                            background: 'rgba(255, 255, 255, 0.15)',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                            color: 'white'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                            e.currentTarget.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}>
                            <FontAwesomeIcon icon={faUser} size="lg" />
                        </Link>
                    </div>
                    
                    {/* Hamburger Menu */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                        style={{
                            border: '1px solid rgba(255,255,255,0.3)',
                            padding: '6px 10px',
                            borderRadius: '5px',
                            backgroundColor: 'rgba(255,255,255,0.1)'
                        }}
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>
                
                {/* Navbar Links (Right-aligned) */}
                <div className="collapse navbar-collapse justify-content-end" id="navbarNav" style={{
                    marginTop: 'clamp(0px, 2vw, 10px)'
                }}>
                    <ul className="navbar-nav" style={{
                        // Responsive padding for mobile
                        '@media (max-width: 991px)': {
                            padding: '10px 0'
                        }
                    }}>
                        <li className="nav-item ms-lg-3 mt-2 mt-lg-0">
                            <Link className="nav-link fs-5" to="/" style={{
                                fontWeight: '500',
                                position: 'relative',
                                padding: '8px 12px',
                                transition: 'all 0.3s ease',
                                textAlign: 'center'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.textShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.textShadow = 'none';
                            }}>Home</Link>
                        </li>
                        <li className="nav-item ms-lg-3 mt-2 mt-lg-0">
                            <Link className="nav-link fs-5" to="/venues" style={{
                                fontWeight: '500',
                                position: 'relative',
                                padding: '8px 12px',
                                transition: 'all 0.3s ease',
                                textAlign: 'center'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.textShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.textShadow = 'none';
                            }}>Venues</Link>
                        </li>
                        <li className="nav-item ms-lg-3 mt-2 mt-lg-0">
                            <Link className="nav-link fs-5" to="/vendors" style={{
                                fontWeight: '500',
                                position: 'relative',
                                padding: '8px 12px',
                                transition: 'all 0.3s ease',
                                textAlign: 'center'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.textShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.textShadow = 'none';
                            }}>Vendors</Link>
                        </li>
                        <li className="nav-item ms-lg-3 d-none d-lg-block">
                            &nbsp;
                        </li>
                    </ul>
                </div>
                
                {/* User Profile Icon - Shown only on large screens */}
                <div className="d-none d-lg-flex">
                    <ul className="navbar-nav">
                        <li className="nav-item text-center">
                            <Link className="nav-link fs-5" to="/profile" style={{
                                background: 'rgba(255, 255, 255, 0.15)',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                                e.currentTarget.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                                e.currentTarget.style.transform = 'scale(1)';
                            }}>
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