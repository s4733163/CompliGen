import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import '../styling/Auth.css'
import Navbar from './Navbar'
import image from '../assets/Logo.png'

const VerifyEmail = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [status, setStatus] = useState('verifying') // 'verifying', 'success', 'error'
    const [message, setMessage] = useState('Verifying your email...')

    useEffect(() => {
        // Get token from URL query parameter
        const token = searchParams.get('token')

        if (!token) {
            setStatus('error')
            setMessage('Invalid verification link. No token provided.')
            return
        }

        // Call verification API
        verifyEmail(token)
    }, [searchParams])

    const verifyEmail = async (token) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/user/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token })
            })

            const data = await response.json()

            if (response.ok) {
                setStatus('success')
                setMessage(data.message || 'Email verified successfully!')
                
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/login')
                }, 3000)
            } else {
                setStatus('error')
                setMessage(data.message || data.error || 'Email verification failed.')
            }
        } catch (error) {
            setStatus('error')
            setMessage('Network error. Please try again later.')
        }
    }

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
                                Email Verification
                            </p>
                            
                            <div className="branding-features">
                                <div className="branding-feature">
                                    <div className="feature-icon">✓</div>
                                    <span>Secure verification process</span>
                                </div>
                                <div className="branding-feature">
                                    <div className="feature-icon">✓</div>
                                    <span>One-time use tokens</span>
                                </div>
                                <div className="branding-feature">
                                    <div className="feature-icon">✓</div>
                                    <span>Account protection</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Status */}
                    <div className="auth-form-section">
                        <div className="auth-form-container">
                            <div className="verification-status">
                                {/* Loading State */}
                                {status === 'verifying' && (
                                    <div className="status-content">
                                        <div className="spinner"></div>
                                        <h2 className="status-title">Verifying Email</h2>
                                        <p className="status-message">{message}</p>
                                    </div>
                                )}

                                {/* Success State */}
                                {status === 'success' && (
                                    <div className="status-content">
                                        <div className="status-icon-large success">
                                            <svg width="64" height="64" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                            </svg>
                                        </div>
                                        <h2 className="status-title">Email Verified!</h2>
                                        <p className="status-message">{message}</p>
                                        <p className="status-submessage">Redirecting to login page...</p>
                                    </div>
                                )}

                                {/* Error State */}
                                {status === 'error' && (
                                    <div className="status-content">
                                        <div className="status-icon-large error">
                                            <svg width="64" height="64" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                                            </svg>
                                        </div>
                                        <h2 className="status-title">Verification Failed</h2>
                                        <p className="status-message">{message}</p>
                                        <div className="verification-actions">
                                            <button 
                                                onClick={() => navigate('/signup')} 
                                                className="submit-button"
                                                style={{ marginTop: '1.5rem' }}
                                            >
                                                Back to Sign Up
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default VerifyEmail