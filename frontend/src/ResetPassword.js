import React, { useState } from 'react';
import axios from 'axios';
import {Link, useNavigate, useLocation } from 'react-router-dom';
import './Register.css';

const ResetPassword = () => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get('email');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/otp/resetpassword', {
        email,
        otp,
        newPassword,
      });
      setMessage(response.data.msg);
      navigate('/login'); // Redirect to login page after successful reset
    } catch (error) {
      setMessage(error.response?.data?.msg || 'An error occurred');
    }
  };

  return (
    <div className="register-container">
      <div className="left-side">
        <h2><b>Reset Password</b></h2>
        <i>Enter the OTP and your new password</i>
        <br />
        <br />
        <form onSubmit={handleSubmit}>
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
          <button type="submit" className="submit-button">Reset Password</button>
        </form>
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

export default ResetPassword;