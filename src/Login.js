import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './Register.css'; // Use the same CSS file for styling

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password,
            });

            setMessage(response.data.message); // Assuming your backend returns a message

            // Store user data in localStorage (or cookies) to maintain the session
            localStorage.setItem('user', JSON.stringify(response.data.user)); // Save user details (email, token, etc.)

            // Redirect to home page after successful login
            navigate('/'); 
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
    
        <div className="register-container"> {/* Reusing the same container styles */}
            <div className="left-side">
                <h2><b>Login</b></h2> {/* Changed to Login */}
                <i>Welcome back to Event Planner</i>
                <br />
                <br />
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Enter email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="input-field"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="input-field"
                        />
                    </div>
                    <p>
                     <Link to="/forgot-password">Forgot Password?</Link>
                    </p>
                    <button type="submit" className="submit-button">Login</button> {/* Changed to Login */}
                </form>
                {message && <p className="message">{message}</p>}
                <br />
                <p>
                    Don't have an account? <Link to="/register">Sign Up</Link> {/* Changed text */}
                </p>

                <p>
                    Are you a <Link to= "/vendor-login">Vendor</Link> ?
                </p>
            </div>
            <div className="right-side">
                <img src="https://i.pinimg.com/564x/99/9b/19/999b1906c651c56fc5dffd1bef58f8b2.jpg" alt="Landscape" className="landscape-image" />
            </div>
        </div>
       
    );
};

export default Login;
