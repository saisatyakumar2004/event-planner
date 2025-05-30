import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css'; // Reuse the same CSS for styling

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [step, setStep] = useState(1); // 1: Enter email, 2: Enter OTP, 3: Enter new password
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Step 1: Check if user exists and send OTP
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Check if the user exists
            const userCheckResponse = await axios.post('https://event-planner-ihsd.onrender.com/api/auth/check-user', { email });
            if (userCheckResponse.data.success) {
                // If user exists, send OTP
                const otpResponse = await axios.post('https://event-planner-ihsd.onrender.com/api/otp/generate', { email });
                setMessage(otpResponse.data.msg);
                setStep(2); // Move to OTP verification step
            } else {
                setMessage('User not found. Please check your email address.');
            }
        } catch (error) {
            setMessage(error.response?.data?.msg || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post('https://event-planner-ihsd.onrender.com/api/otp/verify', { email, otp });
            setMessage(response.data.msg);
            setStep(3); // Move to new password step
        } catch (error) {
            setMessage(error.response?.data?.msg || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    // Step 3: Update password
    const handleNewPasswordSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post('https://event-planner-ihsd.onrender.com/api/auth/reset-passworduser', { email, newPassword });
            setMessage(response.data.msg);
            navigate('/login'); // Redirect to login page after successful password reset
        } catch (error) {
            setMessage(error.response?.data?.msg || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="left-side">
                <h2><b>Forgot Password</b></h2>
                {step === 1 && (
                    <form onSubmit={handleEmailSubmit}>
                        <div className="form-group">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="input-field"
                            />
                        </div>
                        <button type="submit" className="submit-button">
                            {isLoading ? "Sending OTP..." : "Send OTP"}
                        </button>
                    </form>
                )}
                {step === 2 && (
                    <form onSubmit={handleOtpSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                className="input-field"
                            />
                        </div>
                        <button type="submit" className="submit-button">
                            {isLoading ? "Verifying OTP" : "Verify OTP"}
                        </button>
                    </form>
                )}
                {step === 3 && (
                    <form onSubmit={handleNewPasswordSubmit}>
                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="input-field"
                            />
                        </div>
                        <button type="submit" className="submit-button">
                            {isLoading ? "Reseting" : "Reset Password"}
                        </button>
                    </form>
                )}
                {message && <p className="message">{message}</p>}
                <br />
                <p>
                    Remember your password? <Link to="/login">Login</Link>
                </p>
            </div>
            <div className="right-side">
                <img src="https://i.pinimg.com/564x/99/9b/19/999b1906c651c56fc5dffd1bef58f8b2.jpg" alt="Landscape" className="landscape-image" />
            </div>
        </div>
    );
};

export default ForgotPassword;