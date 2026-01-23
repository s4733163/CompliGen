import React, { useRef, useState, useEffect } from 'react'
import '../styling/Auth.css'
import Navbar from './Navbar'
import { useNavigate } from 'react-router-dom'
import image from '../assets/Logo.png'

const Signup = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirm: '',
        company_name: '',
        industry_type: '',
        role: '',
        agree: false,
    });
    const [errors, setErrors] = useState({});
    const timeout = useRef()
    const temporary = useRef()
    const [status, setStatus] = useState('');
    const [statusType, setStatusType] = useState(''); // 'success' or 'error'
    const timestatus = useRef()
    const [loading, setLoading] = useState(false);

    // Industry options
    const industryOptions = [
        'Technology',
        'Retail & E-commerce',
        'Manufacturing',
        'Automotive',
        'Education',
        'Hospitality',
        'Government',
        'Energy',
        'Telecommunications',
        'Professional Services',
    ];

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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

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

    const checkusername = (username) => {
        const error = { ...errors }

        if (username.length < 3) {
            error.name = 'The username must have at least 3 characters.'
            setErrors(error)
            return false
        }
        else if (username.includes(" ")) {
            error.name = 'The username must not have spaces.'
            setErrors(error)
            return false
        }
        else {
            return true
        }
    }

    const checkpassword = (password, password1) => {
        const error = { ...errors }
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/\d/.test(password)) strength += 1;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 1;

        if (strength < 5) {
            error.password = 'The password is not strong.'
            setErrors(error)
            return false
        }

        else if (password !== password1) {
            error.confirm = 'The passwords do not match.'
            setErrors(error)
            return false
        }

        return true
    }

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

    const checkcompanyname = (company_name) => {
        const error = { ...errors }

        if (company_name.trim().length < 2) {
            error.company_name = "Company name must be at least 2 characters."
            setErrors(error)
            return false
        }

        return true
    }

    const checkindustry = (industry_type) => {
        const error = { ...errors }

        if (!industry_type || industry_type === '') {
            error.industry_type = "Please select an industry type."
            setErrors(error)
            return false
        }

        return true
    }

    const checkrole = (role) => {
        const error = { ...errors }

        if (role.trim().length < 2) {
            error.role = "Job title must be at least 2 characters."
            setErrors(error)
            return false
        }

        return true
    }

    const checkagree = (agree) => {
        const error = { ...errors }

        if (!agree) {
            error.agree = "You must agree to the terms and conditions."
            setErrors(error)
            return false
        }

        return true
    }

    const passwordReqs = getPasswordRequirements(form.password);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        // Validate all fields
        const valid =
            checkusername(form.name) &&
            checkvalidemail(form.email) &&
            checkpassword(form.password, form.confirm) &&
            checkcompanyname(form.company_name) &&
            checkindustry(form.industry_type) &&
            checkrole(form.role) &&
            checkagree(form.agree);

        if (!valid) return;

        // Call API
        setLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: form.name,
                    email: form.email,
                    password: form.password,
                    company_name: form.company_name,
                    industry_type: form.industry_type,
                    role: form.role
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Success - display message from API
                setStatus(data.message || "Sign Up Successful!");
                setStatusType('success');

                // clear the timeout if one exists
                if (temporary.current) {
                    clearTimeout(temporary.current)
                }

                // Redirect to login after 2 seconds
                temporary.current = setTimeout(() => {
                    navigate('/login');
                }, 2000)
            } else {
                // Error - display message from API
                const errorMessage = data.message || data.error || "Registration failed. Please try again.";
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
                        Generate legally sound policies in minutes — not weeks
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
                                <h2 className="auth-title">Create your account</h2>
                                <p className="auth-description">
                                    Already have an account?{' '}
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="auth-link"
                                    >
                                        Sign in
                                    </button>
                                </p>
                            </div>
                            <form onSubmit={handleSubmit} className="auth-form">
                                {/* Username */}
                                <div className="form-group">
                                    <label htmlFor="name" className="form-label">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        className={`form-input ${errors.name ? 'error' : ''}`}
                                        placeholder="johndoe"
                                        required
                                    />
                                    {errors.name && (
                                        <span className="error-message">{errors.name}</span>
                                    )}
                                </div>

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
                                        placeholder="john@company.com"
                                        required
                                    />
                                    {errors.email && (
                                        <span className="error-message">{errors.email}</span>
                                    )}
                                </div>

                                {/* Company Name */}
                                <div className="form-group">
                                    <label htmlFor="company_name" className="form-label">
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        id="company_name"
                                        name="company_name"
                                        value={form.company_name}
                                        onChange={handleChange}
                                        className={`form-input ${errors.company_name ? 'error' : ''}`}
                                        placeholder="Tesla Inc."
                                        required
                                    />
                                    {errors.company_name && (
                                        <span className="error-message">{errors.company_name}</span>
                                    )}
                                </div>

                                {/* Industry Type */}
                                <div className="form-group">
                                    <label htmlFor="industry_type" className="form-label">
                                        Industry Type
                                    </label>
                                    <select
                                        id="industry_type"
                                        name="industry_type"
                                        value={form.industry_type}
                                        onChange={handleChange}
                                        className={`form-input ${errors.industry_type ? 'error' : ''}`}
                                        required
                                    >
                                        <option value="">Select Industry</option>
                                        {industryOptions.map((industry, index) => (
                                            <option key={index} value={industry}>
                                                {industry}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.industry_type && (
                                        <span className="error-message">{errors.industry_type}</span>
                                    )}
                                </div>

                                {/* Job Title / Role */}
                                <div className="form-group">
                                    <label htmlFor="role" className="form-label">
                                        Job Title
                                    </label>
                                    <input
                                        type="text"
                                        id="role"
                                        name="role"
                                        value={form.role}
                                        onChange={handleChange}
                                        className={`form-input ${errors.role ? 'error' : ''}`}
                                        placeholder="Compliance Manager"
                                        required
                                    />
                                    {errors.role && (
                                        <span className="error-message">{errors.role}</span>
                                    )}
                                </div>

                                {/* Password */}
                                <div className="form-group">
                                    <label htmlFor="password" className="form-label">
                                        Password
                                    </label>
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
                                        Confirm Password
                                    </label>
                                    <div className="password-input-wrapper">
                                        <input
                                            type={showConfirm ? 'text' : 'password'}
                                            id="confirm"
                                            name="confirm"
                                            value={form.confirm}
                                            onChange={handleChange}
                                            className={`form-input ${errors.confirm ? 'error' : ''}`}
                                            placeholder="Confirm your password"
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

                                {/* Terms and Conditions */}
                                <div className="form-group-checkbox">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="agree"
                                            checked={form.agree}
                                            onChange={handleChange}
                                            className="checkbox-input"
                                        />
                                        <span className="checkbox-text">
                                            I agree to the{' '}
                                            <span
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    navigate('/terms');
                                                }}
                                                className="checkbox-link"
                                                style={{ cursor: 'pointer' }}
                                            >
                                                Terms of Service
                                            </span>
                                            {' '}and{' '}
                                            <span
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    navigate('/privacy');
                                                }}
                                                className="checkbox-link"
                                                style={{ cursor: 'pointer' }}
                                            >
                                                Privacy Policy
                                            </span>
                                        </span>
                                    </label>
                                    {errors.agree && (
                                        <span className="error-message">{errors.agree}</span>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button type="submit" className="submit-button" disabled={loading}>
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Signup