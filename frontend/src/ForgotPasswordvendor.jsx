import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './VendorRegister.css';

const ForgotPasswordvendor = () => {
    const [vendor_email, setVendorEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [step, setStep] = useState(1); // 1: Request OTP, 2: Verify OTP and reset password
    const navigate = useNavigate();

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('http://localhost:5000/api/vendorauth/forgot-passwordvendor', { vendor_email });
            setMessage(data.msg);
            setStep(2);
        } catch (error) {
            setMessage(error.response?.data?.msg || 'Error requesting OTP');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('http://localhost:5000/api/vendorauth/reset-password', { vendor_email, otp, newPassword });
            setMessage(data.msg);
            if (data.msg === 'Password reset successfully') {
                navigate('/vendor-login');
            }
        } catch (error) {
            setMessage(error.response?.data?.msg || 'Error resetting password');
        }
    };

    return (
        <div className="vendor-register-container">
            <div className="left-side">
                <h2>Forgot Password</h2>
                {step === 1 ? (
                    <form onSubmit={handleRequestOTP}>
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
                        <button type="submit" className="submit-button">Request OTP</button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword}>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                className="input-field"
                                aria-label="OTP"
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="input-field"
                                aria-label="New Password"
                            />
                        </div>
                        <button type="submit" className="submit-button">Reset Password</button>
                    </form>
                )}
                {message && <p className="message">{message}</p>}
            </div>
            <div className="right-side">
                <img src="https://i.pinimg.com/564x/99/9b/19/999b1906c651c56fc5dffd1bef58f8b2.jpg" alt="Forgot Password" className="landscape-image" />
            </div>
        </div>
    );
};

export default ForgotPasswordvendor;