import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './VendorRegister.css';

const VendorLogin = () => {
    const [vendor_email, setVendorEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('http://localhost:5000/api/vendorauth/login', {
                vendor_email,
                password,
            });

            setMessage(data.message);
            localStorage.setItem('vendor', JSON.stringify(data.vendor));
            navigate('/vendor-dashboard');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Invalid email or password');
        }
    };

    return (
        <div className="vendor-register-container">
            <div className="left-side">
                <h2>Vendor Login</h2>
                <i>Welcome back to Event Planner</i>
                <br />
                <br />
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Enter vendor email address"
                            value={vendor_email}
                            onChange={(e) => setVendorEmail(e.target.value)}
                            required
                            className="input-field"
                            aria-label="Vendor Email"
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
                            aria-label="Password"
                        />
                    </div>
                    <p>
                    <Link to="/forgot-passwordvendor">Forgot Password?</Link>
                   </p>
                    <button type="submit" className="submit-button">Login</button>
                </form>
                {message && <p className="message">{message}</p>}
                <br />
                <p>
                    Don't have an account? <Link to="/vendor-register">Sign Up</Link>
                </p>
                <p>
                    Are you a <Link to="/login">Customer</Link> ?
                </p>
                
            </div>
            <div className="right-side">
                <img src="https://i.pinimg.com/564x/99/9b/19/999b1906c651c56fc5dffd1bef58f8b2.jpg" alt="Vendor login" className="landscape-image" />
            </div>
        </div>
    );
};

export default VendorLogin;