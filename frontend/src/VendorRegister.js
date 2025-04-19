import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const VendorRegister = () => {
    const [vendor_email, setVendorEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [isRegistered, setIsRegistered] = useState(false); 
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    // Container styles
    const containerWrapperStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '750px',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ed 100%)',
        padding: '20px',
    };

    const vendorRegisterContainerStyle = {
        display: 'flex',
        height: '500px',
        width: '800px',
        background: '#fff',
        borderRadius: '10px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
        overflow: 'hidden',
    };

    // Left side (image) styles
    const leftSideStyle = {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #f0e6fa 0%, #e5d0f9 100%)',
        position: 'relative',
    };

    const landscapeImageStyle = {
        maxWidth: '90%',
        height: 'auto',
        borderRadius: '8px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    };

    // Right side (content) styles
    const rightSideStyle = {
        flex: 1,
        padding: '30px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    };

    const headingStyle = {
        fontSize: '28px',
        color: '#333',
        marginBottom: '25px',
        textAlign: 'center',
        fontWeight: '600',
    };

    const formGroupStyle = {
        marginBottom: '20px',
    };

    const inputFieldStyle = {
        width: '100%',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
        fontSize: '14px',
        transition: 'all 0.3s ease',
    };

    const submitButtonStyle = {
        width: '100%',
        padding: '12px',
        backgroundColor: '#800080',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '500',
        letterSpacing: '0.5px',
        transition: 'background-color 0.3s',
        boxShadow: '0 3px 10px rgba(128, 0, 128, 0.2)',
    };

    const messageStyle = {
        color: 'red',
        marginTop: '10px',
        fontSize: '14px',
        textAlign: 'center',
    };

    const successMessageStyle = {
        color: '#4caf50',
        fontWeight: 'bold',
        marginBottom: '20px',
        textAlign: 'center',
        padding: '10px',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        borderRadius: '5px',
    };

    const linkTextStyle = {
        textAlign: 'center',
        marginTop: '20px',
        fontSize: '14px',
    };

    const linkStyle = {
        color: '#800080',
        textDecoration: 'none',
        fontWeight: '500',
    };

    // Step 1: Send OTP to the email
    const sendOtp = async () => {
        setIsSendingOtp(true);
        try {
            const response = await axios.post('https://event-planner-ihsd.onrender.com/api/otp/generate', { email: vendor_email });
            if (response.data.success) {
                setIsOtpSent(true);
                setMessage('OTP sent to your email address.');
            } else {
                setMessage('Failed to send OTP.');
            }
        } catch (error) {
            setMessage(error.response?.data?.msg || 'Error sending OTP');
        } finally {
            setIsSendingOtp(false);
        }
    };

    // Step 2: Verify the OTP
    const verifyOtp = async () => {
        setIsVerifyingOtp(true);
        try {
            const response = await axios.post('https://event-planner-ihsd.onrender.com/api/otp/verify', { email: vendor_email, otp });
            if (response.data.success) {
                setIsOtpVerified(true);
                setMessage('OTP verified successfully! You can now complete the registration.');
            } else {
                setMessage('Invalid OTP. Please try again.');
            }
        } catch (error) {
            setMessage(error.response?.data?.msg || 'Error verifying OTP');
        } finally {
            setIsVerifyingOtp(false);
        }
    };

    // Step 3: Register the vendor if OTP is verified
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isOtpVerified) {
            setMessage('Please verify the OTP first.');
            return;
        }
        setIsRegistering(true);
        try {
            const response = await axios.post('https://event-planner-ihsd.onrender.com/api/vendorauth/register', {
                vendor_email,
                password,
                name,
                phone
            });
            setMessage(response.data.msg); // Assuming your backend returns a message
            setIsRegistered(true); // Set registration status to true
        } catch (error) {
            setMessage(error.response.data.msg || 'An error occurred');
            setIsRegistered(false); // Reset registration status on error
        } finally {
            setIsRegistering(false);
        }
    };

    return (
        <div style={containerWrapperStyle}>
            <div style={vendorRegisterContainerStyle}>
                <div style={leftSideStyle}>
                    <img 
                        src="https://i.ibb.co/LCvDyFr/wedding-couple.png" 
                        alt="Wedding Couple" 
                        style={landscapeImageStyle} 
                    />
                </div>
                <div style={rightSideStyle}>
                    <h2 style={headingStyle}>Vendor Sign Up</h2>
                    {isRegistered && <p style={successMessageStyle}>Registration successful!</p>}
                    <form onSubmit={handleSubmit}>
                        <div style={formGroupStyle}>
                            <input
                                type="email"
                                placeholder="Enter email address"
                                value={vendor_email}
                                onChange={(e) => setVendorEmail(e.target.value)}
                                required
                                style={inputFieldStyle}
                            />
                        </div>
                        <div style={formGroupStyle}>
                            <input
                                type="text"
                                placeholder="Enter vendor name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                style={inputFieldStyle}
                            />
                        </div>
                        <div style={formGroupStyle}>
                            <input
                                type="text"
                                placeholder="Enter phone number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                style={inputFieldStyle}
                            />
                        </div>

                        {/* OTP Section */}
                        {!isOtpSent && (
                            <div style={formGroupStyle}>
                                <button 
                                    type="button" 
                                    style={submitButtonStyle} 
                                    onClick={sendOtp}
                                >
                                    {isSendingOtp ? 'OTP sending...' : 'Send OTP'}
                                </button>
                            </div>
                        )}

                        {isOtpSent && !isOtpVerified && (
                            <div style={formGroupStyle}>
                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    style={inputFieldStyle}
                                />
                                <button 
                                    type="button" 
                                    style={{...submitButtonStyle, marginTop: '10px'}} 
                                    onClick={verifyOtp}
                                >
                                    {isVerifyingOtp ? 'Verifying...' : 'Verify OTP'}
                                </button>
                            </div>
                        )}

                        {/* Only allow registration if OTP is verified */}
                        {isOtpVerified && (
                            <div style={formGroupStyle}>
                                <input
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={inputFieldStyle}
                                />
                            </div>
                        )}

                        {isOtpVerified && (
                            <button 
                                type="submit" 
                                style={submitButtonStyle}
                            >
                                {isRegistering ? 'Registering...' : 'Complete Registration'}
                            </button>
                        )}
                    </form>

                    {message && <p style={messageStyle}>{message}</p>}
                    <p style={linkTextStyle}>
                        Already have an account? <Link to="/vendor-login" style={linkStyle}>Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VendorRegister;