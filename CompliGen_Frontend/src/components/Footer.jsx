import React from 'react'
import '../styling/Footer.css'
import { useNavigate } from 'react-router-dom'
import image from '../assets/Logo.png'

const Footer = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login')
    }

    const handleSignup = () => {
        navigate('/signup')
    }

    const handleHome = () => {
        navigate('/')
    }

    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Brand Section */}
                <div className="footer-brand">
                    <div className="footer-logo-wrapper" onClick={handleHome}>
                        <img src={image} alt="CompliGen Logo" className="footer-logo" />
                        <span className="footer-title">CompliGen</span>
                    </div>
                    <p className="footer-description">
                        Automated compliance checking and policy generation platform.
                    </p>
                </div>

                {/* Navigation Links */}
                <div className="footer-links">
                    <div className="footer-column">
                        <h3 className="footer-heading">Navigation</h3>
                        <ul className="footer-list">
                            <li><button onClick={handleHome} className="footer-link">Home</button></li>
                            <li><button onClick={handleLogin} className="footer-link">Log In</button></li>
                            <li><button onClick={handleSignup} className="footer-link">Sign Up</button></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h3 className="footer-heading">Information</h3>
                        <ul className="footer-list">
                            <li><span className="footer-link disabled">About</span></li>
                            <li><span className="footer-link disabled">Contact</span></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom">
                <div className="footer-bottom-container">
                    <p className="footer-copyright">
                        © {new Date().getFullYear()} CompliGen. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer