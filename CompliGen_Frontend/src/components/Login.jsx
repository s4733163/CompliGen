import React, { useRef, useState, useEffect } from 'react'
import '../styling/Auth.css'
import Navbar from './Navbar'
import { useNavigate } from 'react-router-dom'
import image from '../assets/Logo.png'

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const timeout = useRef()
    const [status, setStatus] = useState('');
    const [statusType, setStatusType] = useState(''); // 'success' or 'error'
    const timestatus = useRef()
    const temporary = useRef()
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            if (timeout.current) {
                clearTimeout(timeout.current);
            }
            timeout.current = setTimeout(() => {
                setErrors({});
            }, 4000);
        }

        return () => {
            if (timeout.current) {
                clearTimeout(timeout.current);
            }
        };
    }, [errors]);

    useEffect(() => {
        if (status !== '') {
            if (timestatus.current) {
                clearTimeout(timestatus.current)
            }
            timestatus.current = setTimeout(() => {
                setStatus('')
                setStatusType('')
            }, 4000);
        }

        return () => {
            if (timestatus.current) {
                clearTimeout(timestatus.current)
            }
        }

    }, [status])

    const checkvalidemail = (email) => {
        const error = { ...errors }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            error.email = "The email is not valid."
            setErrors(error)
            return false
        }

        return true
    }

    const checkpassword = (password) => {
        const error = { ...errors }

        if (password.length < 1) {
            error.password = "Please enter a valid password"
            setErrors(error)
            return false
        }

        return true
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const valid = checkvalidemail(form.email) && checkpassword(form.password);

        if (!valid) return;

        // Call API
        setLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: form.email,
                    password: form.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Success - store tokens and navigate
                if (data.access && data.refresh) {
                    // Store tokens in localStorage
                    localStorage.setItem('access_token', data.access);
                    localStorage.setItem('refresh_token', data.refresh);

                    // Optionally store user info if provided
                    if (data.user) {
                        localStorage.setItem('user', JSON.stringify(data.user));
                    }
                }

                setStatus(data.message || "Login Successful!");
                setStatusType('success');

                // Redirect to home page after 1 second
                if (temporary.current) {
                    clearTimeout(temporary.current)
                }

                temporary.current = setTimeout(() => {
                    navigate('/dashboard');
                }, 1000)

            } else {
                // Error - display message from API
                const errorMessage = data.message || data.error || "Login failed. Please try again.";
                setStatus(errorMessage);
                setStatusType('error');
            }

        } catch (error) {
            // Network or other error
            setStatus("Network error. Please check your connection and try again.");
            setStatusType('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            {/* Toast Notification - Fixed Position */}
            {status && (
                <div className={`status-message ${statusType}`}>
                    <svg className="status-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        {statusType === 'success' ? (
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        ) : (
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        )}
                    </svg>
                    <span>{status}</span>
                </div>
            )}

            <div className="auth-container">
                <div className="auth-wrapper">
                    {/* Left Side - Branding */}
                    <div className="auth-branding">
                        <div className="branding-content">
                            <img src={image} alt="CompliGen Logo" className="branding-logo" />
                            <h1 className="branding-title">CompliGen</h1>
                            <p className="branding-subtitle">
                                Welcome back! Sign in to access your compliance dashboard
                            </p>

                            <div className="branding-features">
                                <div className="branding-feature">
                                    <div className="feature-icon">✓</div>
                                    <span>Privacy, Terms & policy generation</span>
                                </div>

                                <div className="branding-feature">
                                    <div className="feature-icon">✓</div>
                                    <span>Australian-law aligned documents</span>
                                </div>

                                <div className="branding-feature">
                                    <div className="feature-icon">✓</div>
                                    <span>Ready-to-download PDF policies</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="auth-form-section">
                        <div className="auth-form-container">
                            <div className="auth-header">
                                <h2 className="auth-title">Welcome back</h2>
                                <p className="auth-description">
                                    Don't have an account?{' '}
                                    <button
                                        onClick={() => navigate('/signup')}
                                        className="auth-link"
                                    >
                                        Sign up
                                    </button>
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="auth-form">
                                {/* Email */}
                                <div className="form-group">
                                    <label htmlFor="email" className="form-label">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        className={`form-input ${errors.email ? 'error' : ''}`}
                                        placeholder="john@example.com"
                                        required
                                    />
                                    {errors.email && (
                                        <span className="error-message">{errors.email}</span>
                                    )}
                                </div>

                                {/* Password */}
                                <div className="form-group">
                                    <div className="password-label-wrapper">
                                        <label htmlFor="password" className="form-label">
                                            Password
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => navigate('/forgot')}
                                            className="forgot-password-link"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                    <div className="password-input-wrapper">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            name="password"
                                            value={form.password}
                                            onChange={handleChange}
                                            className={`form-input ${errors.password ? 'error' : ''}`}
                                            placeholder="Enter your password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="password-toggle"
                                        >
                                            {showPassword ? (
                                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <span className="error-message">{errors.password}</span>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button type="submit" className="submit-button" disabled={loading}>
                                    {loading ? 'Signing In...' : 'Sign In'}
                                </button>
                            </form>

                            {/* Additional Help Text */}
                            <p className="auth-footer-text" style={{ marginTop: '2rem' }}>
                                By signing in, you agree to our{' '}
                                <span
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate('/terms');
                                    }}
                                    className="auth-footer-link"
                                    style={{ cursor: 'pointer' }}
                                >
                                    Terms of Service
                                </span>
                                {' '}and{' '}
                                <span
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate('/privacy');
                                    }}
                                    className="auth-footer-link"
                                    style={{ cursor: 'pointer' }}
                                >
                                    Privacy Policy
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login