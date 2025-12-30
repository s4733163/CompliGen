import React, { useRef, useState, useEffect } from 'react'
import '../styling/Auth.css'
import Navbar from './Navbar'
import { useNavigate } from 'react-router-dom'
import image from '../assets/Logo.png'

const ResendVerification = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("")
    const [status, setStatus] = useState('');
    const [statusType, setStatusType] = useState(''); // 'success' or 'error'
    const [loading, setLoading] = useState(false);
    const timeout = useRef();
    const [errors, setErrors] = useState({});
    const timestatus = useRef()

    const handleChange = (e) => {
        setEmail(e.target.value)
    }

    const checkValidEmail = (email) => {
        const error = { ...errors }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            error.email = "Please enter a valid email address."
            setErrors(error)
            return false
        }

        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const valid = checkValidEmail(email);
        if (!valid) return;

        // Call API
        setLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:8000/failed/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                // Success - display message from API
                setStatus(data.message || "Verification email sent! Please check your inbox.");
                setStatusType('success');
            } else {
                // Error - display message from API
                const errorMessage = data.message || data.error || "Failed to send verification email.";
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

    useEffect(() => {
        if (status) {
            if (timestatus.current) clearTimeout(timestatus.current);
            timestatus.current = setTimeout(() => {
                setStatus('');
                setStatusType('');
            }, 4000);
        }

        return () => {
            if (timestatus.current) clearTimeout(timestatus.current);
        };
    }, [status]);

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

    return (
        <>
            <Navbar />
            <div className="auth-container">
                <div className="auth-wrapper">
                    {/* Left Side - Branding */}
                    <div className="auth-branding">
                        <div className="branding-content">
                            <img src={image} alt="CompliGen Logo" className="branding-logo" />
                            <h1 className="branding-title">CompliGen</h1>
                            <p className="branding-subtitle">
                                Resend your verification email
                            </p>
                            
                            <div className="branding-features">
                                <div className="branding-feature">
                                    <div className="feature-icon">✓</div>
                                    <span>Enter your email address</span>
                                </div>
                                <div className="branding-feature">
                                    <div className="feature-icon">✓</div>
                                    <span>Receive new verification link</span>
                                </div>
                                <div className="branding-feature">
                                    <div className="feature-icon">✓</div>
                                    <span>Activate your account</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="auth-form-section">
                        <div className="auth-form-container">
                            <div className="auth-header">
                                <h2 className="auth-title">Resend Verification Email</h2>
                                <p className="auth-description">
                                    Enter your email address and we'll send you a new verification link.
                                </p>
                            </div>

                            {/* Status Message */}
                            {status && (
                                <div className={`status-message ${statusType}`}>
                                    <svg className="status-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                        {statusType === 'success' ? (
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                        ) : (
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                                        )}
                                    </svg>
                                    {status}
                                </div>
                            )}

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
                                        value={email}
                                        onChange={handleChange}
                                        className={`form-input ${errors.email ? 'error' : ''}`}
                                        placeholder="john@example.com"
                                        required
                                    />
                                    {errors.email && (
                                        <span className="error-message">{errors.email}</span>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button type="submit" className="submit-button" disabled={loading}>
                                    {loading ? 'Sending...' : 'Resend Verification Email'}
                                </button>
                            </form>

                            {/* Back to Login */}
                            <div className="auth-footer-text" style={{ marginTop: '1.5rem' }}>
                                Already verified?{' '}
                                <button 
                                    onClick={() => navigate('/login')} 
                                    className="auth-link"
                                    style={{ background: 'none', border: 'none', padding: 0 }}
                                >
                                    Back to Login
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ResendVerification