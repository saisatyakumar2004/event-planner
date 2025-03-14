import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Register.css'; // Import CSS for styling

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);

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
                setMessage('OTP verified successfully! You can now complete the registration.');
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

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', {
                email,
                password,
                firstName: "",  // Default value for firstName
                lastName: "",   // Default value for lastName
                phoneNumber: "", // Default value for phoneNumber
                orderHistory: [] // Default value for orderHistory
            });
            setMessage(response.data.messaage);
            setIsRegistered(true);
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred');
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
                        )}

                        {isOtpVerified && (
                            <button type="submit" className="submit-button">
                                Complete Registration
                            </button>
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
