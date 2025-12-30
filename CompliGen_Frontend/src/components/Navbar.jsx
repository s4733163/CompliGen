import React, { useEffect, useRef, useState } from 'react'
import '../styling/Navbar.css'
import image from '../assets/Logo.png'
import { memo } from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const navRef = useRef();
    const navigate = useNavigate()
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        // handle the scrolling effect
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        }

        window.addEventListener('scroll', handleScroll)

        // unmounting the component
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }

    }, [])


    const takehome = () => {
        navigate('/')
    }

    const signup = () => {
        navigate('/signup')
    }

    const login = () => {
        navigate('/login')
    }

    useEffect(() => {
        // If user already authenticated, skip guest navbar and redirect
        if (localStorage.getItem("isAuthenticated") === "true") {
            navigate("/dashboard");
        }
    }, [navigate]);


    return (
        <nav
            ref={navRef}
            className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}
        >
            <div className="navbar-container">
                <div className="navbar-brand" onClick={takehome}>
                    <img src={image} alt="CompliGen Logo" className="navbar-logo" />
                    <span className="navbar-title">CompliGen</span>
                </div>

                <div className="navbar-actions">
                    <button onClick={signup} className="btn-signup">
                        Sign Up
                    </button>
                    <button onClick={login} className="btn-login">
                        Log In
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default memo(Navbar)