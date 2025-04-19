import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const navigate = useNavigate();
    
    // Container styles
    const containerWrapperStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        minHeight: '700px',
        padding: '2rem',
        maxHeight: '1500px',
    };

    const registerContainerStyle = {
        display: 'flex',
        width: '800px',
        height: '600px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
    };

    // Image side styles
    const imageSideStyle = {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#f0f8ff',
    };

    const landscapeImageStyle = {
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain',
        borderRadius: '8px',
    };

    // Content side styles
    const contentSideStyle = {
        flex: 1,
        padding: '30px',
        display: 'flex',
        flexDirection: 'column',
    };

    const headingStyle = {
        fontSize: '28px',
        color: '#333',
        marginBottom: '20px',
        textAlign: 'center',
    };

    const formGroupStyle = {
        marginBottom: '15px',
    };

    const inputFieldStyle = {
        width: '100%',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '14px',
    };

    const submitButtonStyle = {
        width: '100%',
        padding: '12px',
        backgroundColor: '#4a90e2',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
    };

    const messageStyle = {
        marginTop: '10px',
        padding: '10px',
        borderRadius: '5px',
        textAlign: 'center',
        fontSize: '14px',
        color: 'red', // Added red color for OTP outputs
    };

    const successMessageStyle = {
        backgroundColor: '#d4edda',
        color: '#155724',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '15px',
        textAlign: 'center',
    };

    const paragraphStyle = {
        textAlign: 'center',
        fontSize: '14px',
    };

    const linkStyle = {
        color: '#4a90e2',
        textDecoration: 'none',
        fontWeight: '600',
    };
    
    // Step 1: Send OTP to the email
    const sendOtp = async () => {
        setIsSendingOtp(true);
        try {
            const response = await axios.post('http://localhost:5000/api/otp/generate', { email });
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
            const response = await axios.post('http://localhost:5000/api/otp/verify', { email, otp });
            if (response.data.success) {
                setIsOtpVerified(true);
                setMessage('OTP verified successfully! Please complete the registration.');
            } else {
                setMessage('Invalid OTP. Please try again.');
            }
        } catch (error) {
            setMessage(error.response?.data?.msg || 'Error verifying OTP');
        } finally {
            setIsVerifyingOtp(false);
        }
    };

    // Step 3: Register the user if OTP is verified
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isOtpVerified) {
            setMessage('Please verify the OTP first.');
            return;
        }
        setIsRegistering(true);
        const requestBody = {
            email,
            password,
            firstName,
            lastName,
            phoneNumber
        };
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', requestBody);
            setMessage(response.data.message);
            setIsRegistered(true);
            navigate('/login');
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred');
            setIsRegistered(false);
        } finally {
            setIsRegistering(false);
        }
    };

    return (
        <div style={containerWrapperStyle}>
            <div style={registerContainerStyle}>
                <div style={imageSideStyle}>
                    <img 
                        src="https://i.ibb.co/LCvDyFr/wedding-couple.png" 
                        alt="Landscape" 
                        style={landscapeImageStyle} 
                    />
                </div>
                
                <div style={contentSideStyle}>
                    <h2 style={headingStyle}>Sign Up</h2>
                    <br />
                    {isRegistered && <p style={successMessageStyle}>Registration successful!</p>}
                    <form onSubmit={handleSubmit}>
                        <div style={formGroupStyle}>
                            <input
                                type="email"
                                placeholder="Enter email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                    {isSendingOtp ? 'Sending OTP...' : 'Send OTP'}
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
                            <>
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
                                <div style={formGroupStyle}>
                                    <input
                                        type="text"
                                        placeholder="Enter first name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                        style={inputFieldStyle}
                                    />
                                </div>
                                <div style={formGroupStyle}>
                                    <input
                                        type="text"
                                        placeholder="Enter last name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                        style={inputFieldStyle}
                                    />
                                </div>
                                <div style={formGroupStyle}>
                                    <input
                                        type="text"
                                        placeholder="Enter phone number"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        required
                                        style={inputFieldStyle}
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    style={submitButtonStyle}
                                >
                                    {isRegistering ? 'Registering...' : 'Complete Registration'}
                                </button>
                            </>
                        )}
                    </form>

                    {message && <p style={messageStyle}>{message}</p>}

                    <br />
                    <p style={paragraphStyle}>
                        Already have an account? <Link to="/login" style={linkStyle}>Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;