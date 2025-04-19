import React, { useState } from 'react'; 
import axios from 'axios'; 
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password,
            });
            
            setMessage(response.data.message);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/');
        } catch (error) {
            if (error.response?.status === 401) {
                setMessage("Invalid email or password");
            } else {
                setMessage(error.response?.data?.message || 'error occurred please check email or password');
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '700px',
            padding: '2rem',
            maxHeight: '1500px',
            fontFamily: "'Nunito', 'Segoe UI', sans-serif",
            background: 'linear-gradient(135deg, #f5f7fa 0%,rgb(210, 224, 245) 100%)'
        }}>
            {/* Login Card Container */}
            <div style={{
                display: 'flex',
                width: '100%',
                maxWidth: '900px',
                height: '500px',
                boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
                borderRadius: '16px',
                overflow: 'hidden'
            }}>
                {/* Left side - Image */}
                <div style={{
                    flex: '1',
                    backgroundImage: "url('https://i.pinimg.com/564x/99/9b/19/999b1906c651c56fc5dffd1bef58f8b2.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)'
                    }}></div>
                    <div style={{
                        position: 'absolute',
                        bottom: '2rem',
                        left: '2rem',
                        color: 'white',
                        zIndex: 1
                    }}>
                        <h2 style={{
                            fontSize: '2rem',
                            fontWeight: '800',
                            marginBottom: '0.5rem',
                            textShadow: '0 2px 4px rgba(0,0,0,0.4)'
                        }}>Event Planner</h2>
                        <p style={{
                            fontSize: '1rem',
                            maxWidth: '300px',
                            lineHeight: '1.5',
                            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                        }}>Create memorable events with our intuitive planning tools</p>
                    </div>
                </div>
                
                {/* Right side - Login form */}
                <div style={{
                    flex: '1',
                    backgroundColor: 'white',
                    padding: '3rem 2.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <h1 style={{
                            fontSize: '1.875rem',
                            fontWeight: '700',
                            color: '#333',
                            marginBottom: '0.5rem'
                        }}>Login</h1>
                        <p style={{ 
                            color: '#666', 
                            fontSize: '1rem' 
                        }}>Please enter your details to sign in</p>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                color: '#444'
                            }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    fontSize: '1rem',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '0.5rem',
                                    backgroundColor: '#f9fafb',
                                    transition: 'all 0.2s ease',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#4f46e5';
                                    e.target.style.backgroundColor = '#ffffff';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#e0e0e0';
                                    e.target.style.backgroundColor = '#f9fafb';
                                    e.target.style.boxShadow = 'none';
                                }}
                                placeholder="your@email.com"
                            />
                        </div>
                        
                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '0.5rem'
                            }}>
                                <label style={{
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    color: '#444'
                                }}>
                                    Password
                                </label>
                                <Link to="/forgot-password" style={{
                                    fontSize: '0.85rem',
                                    color: '#4f46e5',
                                    textDecoration: 'none',
                                    fontWeight: '500'
                                }}>
                                    Forgot password?
                                </Link>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    fontSize: '1rem',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '0.5rem',
                                    backgroundColor: '#f9fafb',
                                    transition: 'all 0.2s ease',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#4f46e5';
                                    e.target.style.backgroundColor = '#ffffff';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#e0e0e0';
                                    e.target.style.backgroundColor = '#f9fafb';
                                    e.target.style.boxShadow = 'none';
                                }}
                                placeholder="••••••••"
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                backgroundColor: '#4f46e5',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.5rem',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease',
                                marginBottom: '1.5rem',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                opacity: isLoading ? 0.7 : 1,
                                boxShadow: '0 4px 6px rgba(79, 70, 229, 0.12)'
                            }}
                            onMouseOver={(e) => {
                                if (!isLoading) {
                                    e.target.style.backgroundColor = '#4338ca';
                                    e.target.style.transform = 'translateY(-1px)';
                                    e.target.style.boxShadow = '0 6px 10px rgba(79, 70, 229, 0.18)';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (!isLoading) {
                                    e.target.style.backgroundColor = '#4f46e5';
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 4px 6px rgba(79, 70, 229, 0.12)';
                                }
                            }}
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>
                    
                    {message && (
                        <div style={{
                            padding: '0.75rem',
                            marginBottom: '1.5rem',
                            borderRadius: '0.5rem',
                            backgroundColor: message.toLowerCase().includes('error') ? '#fee2e2' : '#ecfdf5',
                            color: message.toLowerCase().includes('error') ? '#b91c1c' : '#047857',
                            fontSize: '0.9rem',
                            textAlign: 'center'
                        }}>
                            {message}
                        </div>
                    )}
                    
                    <div style={{
                        marginTop: '0.5rem',
                        textAlign: 'center',
                        color: '#666',
                        fontSize: '0.95rem'
                    }}>
                        <p style={{ marginBottom: '0.5rem' }}>
                            Don't have an account?{' '}
                            <Link to="/register" style={{
                                color: '#4f46e5',
                                textDecoration: 'none',
                                fontWeight: '600',
                                transition: 'color 0.2s'
                            }}>
                                Create an account
                            </Link>
                        </p>
                        
                        <p>
                            Are you a{' '}
                            <Link to="/vendor-login" style={{
                                color: '#4f46e5',
                                textDecoration: 'none',
                                fontWeight: '600',
                                transition: 'color 0.2s'
                            }}>
                                Vendor
                            </Link>
                            ?
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;