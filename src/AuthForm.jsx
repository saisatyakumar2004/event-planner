import React, { useState } from 'react';
import axios from 'axios';
import './AuthForm.css'; // Assuming you have a CSS file for styling


const AuthForm = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleToggle = () => {
    setIsSignIn(!isSignIn);
    setEmail('');
    setPassword('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      email,
      password,
    };

    try {
      if (isSignIn) {
        const response = await axios.post('http://localhost:5000/api/auth/login', formData);
        console.log('Login Successful:', response.data);
      } else {
        const response = await axios.post('http://localhost:5000/api/auth/register', formData);
        console.log('Registration Successful:', response.data);
      }
    } catch (err) {
      setError(err.response ? err.response.data.message : 'An error occurred');
    }
  };

  return (
    <div className="container">
      <div className="form-box">
        {isSignIn ? (
          <>
            <h2>Sign In</h2>
            <p>Welcome back to Event Planner!</p>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter email address"
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter password"
                />
              </div>
              {error && <p className="error">{error}</p>}
              <button type="submit" className="btn">Sign In</button>
            </form>
            <p className="toggle-link" onClick={handleToggle}>
              Don't have an account? Sign Up
            </p>
          </>
        ) : (
          <>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email"
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                />
              </div>
              {error && <p className="error">{error}</p>}
              <button type="submit" className="btn">Sign Up</button>
            </form>
            <p className="toggle-link" onClick={handleToggle}>
              Already have an account? Sign In
            </p>
          </>
        )}
      </div>
      <div className="image-container">
        <img
          src="https://i.pinimg.com/564x/99/9b/19/999b1906c651c56fc5dffd1bef58f8b2.jpg"
          alt="Event Planner Image"
        />
      </div>
    </div>
  );
};

export default AuthForm;
