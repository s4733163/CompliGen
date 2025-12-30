import React, { useRef, useState, useEffect } from 'react'
import '../styling/Auth.css'
import Navbar from './Navbar'
import { useNavigate, useParams } from 'react-router-dom'
import image from '../assets/Logo.png'

const ResetPassword = () => {
    const { uid, token } = useParams();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [form, setForm] = useState({
        password: '',
        confirm: ''
    });
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('');
    const [statusType, setStatusType] = useState(''); // 'success' or 'error'
    const [loading, setLoading] = useState(false);
    const timeout = useRef();
    const timestatus = useRef();
    const temporary = useRef();

    // Password strength validation function
    const getPasswordRequirements = (password) => {
        return {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        };
    };

    const passwordReqs = getPasswordRequirements(form.password);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const checkPassword = (password, confirm) => {
        const error = { ...errors }
        let strength = 0;

        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/\d/.test(password)) strength += 1;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 1;

        if (strength < 5) {
            error.password = 'The password is not strong enough.'
            setErrors(error)
            return false
        }

        if (password !== confirm) {
            error.confirm = 'The passwords do not match.'
            setErrors(error)
            return false
        }

        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const valid = checkPassword(form.password, form.confirm);
        if (!valid) return;

        // Call API
        setLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/user/password/new/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uid: uid,
                    token: token,
                    new_password: form.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Success
                setStatus(data.message || "Password reset successful!");
                setStatusType('success');

                // Redirect to login after 2 seconds
                if (temporary.current) {
                    clearTimeout(temporary.current)
                }

                temporary.current = setTimeout(() => {
                    navigate('/login');
                }, 2000)

            } else {
                // Error
                const errorMessage = data.message || data.error || "Failed to reset password.";
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
        return () => clearTimeout(timestatus.current);
    }, [status]);

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            if (timeout.current) clearTimeout(timeout.current);
            timeout.current = setTimeout(() => setErrors({}), 4000);
        }
        return () => clearTimeout(timeout.current);
    }, [errors]);

    return (
        <>
            <Navbar />
            {/* Status Message */}
            {status && (
                <div className={`status-message ${statusType}`}>
                    <svg className="status-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        {statusType === 'success' ? (
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        ) : (
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        )}
                    </svg>
                    {status}
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
                                Create a strong new password for your account
                            </p>

                            <div className="branding-features">
                                <div className="branding-feature">
                                    <div className="feature-icon">✓</div>
                                    <span>At least 8 characters</span>
                                </div>
                                <div className="branding-feature">
                                    <div className="feature-icon">✓</div>
                                    <span>Mix of letters and numbers</span>
                                </div>
                                <div className="branding-feature">
                                    <div className="feature-icon">✓</div>
                                    <span>Include special characters</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="auth-form-section">
                        <div className="auth-form-container">
                            <div className="auth-header">
                                <h2 className="auth-title">Reset Your Password</h2>
                                <p className="auth-description">
                                    Enter your new password below
                                </p>
                            </div>



                            <form onSubmit={handleSubmit} className="auth-form">
                                {/* New Password */}
                                <div className="form-group">
                                    <label htmlFor="password" className="form-label">
                                        New Password
                                    </label>
                                    <div className="password-input-wrapper">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            name="password"
                                            value={form.password}
                                            onChange={handleChange}
                                            className={`form-input ${errors.password ? 'error' : ''}`}
                                            placeholder="Enter your new password"
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

                                    {/* Password Requirements */}
                                    {form.password && (
                                        <div className="password-requirements">
                                            <div className={`requirement ${passwordReqs.length ? 'met' : ''}`}>
                                                <span className="req-icon">{passwordReqs.length ? '✓' : '○'}</span>
                                                At least 8 characters
                                            </div>
                                            <div className={`requirement ${passwordReqs.uppercase ? 'met' : ''}`}>
                                                <span className="req-icon">{passwordReqs.uppercase ? '✓' : '○'}</span>
                                                One uppercase letter
                                            </div>
                                            <div className={`requirement ${passwordReqs.lowercase ? 'met' : ''}`}>
                                                <span className="req-icon">{passwordReqs.lowercase ? '✓' : '○'}</span>
                                                One lowercase letter
                                            </div>
                                            <div className={`requirement ${passwordReqs.number ? 'met' : ''}`}>
                                                <span className="req-icon">{passwordReqs.number ? '✓' : '○'}</span>
                                                One number
                                            </div>
                                            <div className={`requirement ${passwordReqs.special ? 'met' : ''}`}>
                                                <span className="req-icon">{passwordReqs.special ? '✓' : '○'}</span>
                                                One special character
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div className="form-group">
                                    <label htmlFor="confirm" className="form-label">
                                        Confirm New Password
                                    </label>
                                    <div className="password-input-wrapper">
                                        <input
                                            type={showConfirm ? 'text' : 'password'}
                                            id="confirm"
                                            name="confirm"
                                            value={form.confirm}
                                            onChange={handleChange}
                                            className={`form-input ${errors.confirm ? 'error' : ''}`}
                                            placeholder="Confirm your new password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirm(!showConfirm)}
                                            className="password-toggle"
                                        >
                                            {showConfirm ? (
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
                                    {errors.confirm && (
                                        <span className="error-message">{errors.confirm}</span>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button type="submit" className="submit-button" disabled={loading}>
                                    {loading ? 'Resetting Password...' : 'Reset Password'}
                                </button>
                            </form>

                            {/* Back to Login */}
                            <div className="auth-footer-text" style={{ marginTop: '1.5rem' }}>
                                Remember your password?{' '}
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

export default ResetPassword