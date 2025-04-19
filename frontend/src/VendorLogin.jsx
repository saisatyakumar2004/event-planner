import React, { useState } from 'react'; 
import axios from 'axios'; 
import { Link, useNavigate } from 'react-router-dom'; 
import './VendorRegister.css';  

const VendorLogin = () => {
    const [vendor_email, setVendorEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false); // NEW state
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // start loading
        try {
            const { data } = await axios.post('https://event-planner-ihsd.onrender.com/api/vendorauth/login', {
                vendor_email,
                password,
            });
            
            setMessage(data.message);
            localStorage.setItem('vendor', JSON.stringify(data.vendor));
            navigate('/vendor-dashboard');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Invalid email or password');
        } finally {
            setIsLoading(false); // end loading
        }
    };
    
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            padding: '20px'
        }}>
            <div style={{
                display: 'flex',
                maxWidth: '900px',
                width: '100%',
                boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
                borderRadius: '10px',
                overflow: 'hidden'
            }}>
                <div className="left-side" style={{
                    flex: '1',
                    padding: '30px',
                    backgroundColor: '#ffffff'
                }}>
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
                        <button type="submit" className="submit-button">
                            {isLoading ? 'Logging in...' : 'Login'}  {/* updated text */}
                        </button>
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
                <div className="right-side" style={{
                    flex: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f8f9fa'
                }}>
                    <img 
                        src="https://i.pinimg.com/564x/99/9b/19/999b1906c651c56fc5dffd1bef58f8b2.jpg" 
                        alt="Vendor login" 
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }} 
                    />
                </div>
            </div>
        </div>
    );
};

export default VendorLogin;