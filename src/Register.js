import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css'; // Import CSS for styling

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

    const navigate = useNavigate();

    // Step 1: Send OTP to the email
    const sendOtp = async () => {
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
        }
    };

    // Step 2: Verify the OTP
    const verifyOtp = async () => {
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
        }
    };

    // Step 3: Register the user if OTP is verified
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isOtpVerified) {
            setMessage('Please verify the OTP first.');
            return;
        }

        const requestBody = {
            email,
            password,
            firstName,
            lastName,
            phoneNumber
        };

        console.log('Request Body:', requestBody); // Log the request body

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', requestBody);
            setMessage(response.data.message);
            setIsRegistered(true);
            navigate('/login'); // Navigate to login page after successful registration
        } catch (error) {
            console.error('Full Error Object:', error); // Log the full error object

            if (error.response) {
                // The request was made and the server responded with a status code
                setMessage(error.response.data.message || 'An error occurred');
            } else if (error.request) {
                // The request was made but no response was received
                setMessage('No response from the server. Please try again.');
            } else {
                // Something happened in setting up the request
                setMessage('An error occurred. Please try again.');
            }

            setIsRegistered(false);
        }
    };

    return (
        <div className="container-wrapper">
            <div className="register-container">
                <div className="left-side">
                    <h2>Sign Up</h2>
                    <br />
                    {isRegistered && <p className="success-message">Registration successful!</p>}
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

                        {/* OTP Section */}
                        {!isOtpSent && (
                            <div className="form-group">
                                <button type="button" className="submit-button" onClick={sendOtp}>
                                    Send OTP
                                </button>
                            </div>
                        )}

                        {isOtpSent && !isOtpVerified && (
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    className="input-field"
                                />
                                <button type="button" className="submit-button" onClick={verifyOtp}>
                                    Verify OTP
                                </button>
                            </div>
                        )}

                        {/* Only allow registration if OTP is verified */}
                        {isOtpVerified && (
                            <>
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
                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="Enter first name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                        className="input-field"
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="Enter last name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                        className="input-field"
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="Enter phone number"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        required
                                        className="input-field"
                                    />
                                </div>
                                <button type="submit" className="submit-button">
                                    Complete Registration
                                </button>
                            </>
                        )}
                    </form>

                    {message && <p className="message">{message}</p>}

                    <br />
                    <p>
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </div>

                <div className="right-side">
                    <img src="https://i.ibb.co/LCvDyFr/wedding-couple.png" alt="Landscape" className="landscape-image" />
                </div>
            </div>
        </div>
    );
};

export default Register;