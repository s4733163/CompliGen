import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import image from '../assets/Logo.png'
import Avatar from '@mui/material/Avatar';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Logout from '@mui/icons-material/Logout';
import ListItemIcon from '@mui/material/ListItemIcon';
import { jwtDecode } from "jwt-decode";
import '../styling/AuthenticatedNavbar.css'
import { memo } from 'react'

const AuthenticatedNavbar = () => {
    const navref = useRef();
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [data, setData] = useState({})
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [logoutStatus, setLogoutStatus] = useState(false);
    const isLoggingOut = useRef(false);  
    const timeout = useRef();

    // Scrolling effect
    useEffect(() => {
        const handleScroll = () => {
            const element = navref.current
            if (window.scrollY > 50) {
                element.classList.add('navbar-scrolled')
            } else {
                element.classList.remove('navbar-scrolled')
            }
        }

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 900) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Check if the token is expired
    const isTokenExpired = (token) => {
        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            return decoded.exp < currentTime;
        } catch {
            return true;
        }
    };

    // Gives a unique color based on the username
    function stringToColor(string) {
        let hash = 0;
        let i;

        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }

        return color;
    }

    function stringAvatar(name) {
        return {
            sx: {
                bgcolor: stringToColor(name),
                cursor: 'pointer',
                '&:hover': {
                    opacity: 0.8
                }
            },
            children: `${name[0].toUpperCase()}`,
        };
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Handling of the access and the refresh token
    useEffect(() => {
        //  Skip token check if we're in the process of logging out
        if (isLoggingOut.current) {
            return;
        }

        if (!access_token) {
            navigate("/login");
            return;
        }

        const expired = isTokenExpired(access_token);

        if (!expired) {
            const cachedUser = localStorage.getItem("username");
            if (cachedUser) {
                setData({ username: cachedUser });
            } else {
                fetch("http://127.0.0.1:8000/api/credentials", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${access_token}`,
                        "Content-Type": "application/json",
                    }
                }).then((res) => res.json())
                  .then((data) => {
                      localStorage.setItem("username", data.username);
                      localStorage.setItem("isAuthenticated", "true")
                      setData({ username: data.username });
                  })
                  .catch(() => {
                      navigate("/login");
                      localStorage.removeItem("isAuthenticated")
                  });
            }
            localStorage.setItem("isAuthenticated","true")
            return;
        }

        // Refreshing the access token
        const refreshAccessToken = async () => {
            try {
                const res = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refresh: refresh_token }),
                });

                const body = await res.json();

                if (body.access) {
                    localStorage.setItem("access_token", body.access);
                } else {
                    throw new Error("Refresh failed");
                }

                // Getting the credentials with new token
                const verify = await fetch("http://127.0.0.1:8000/api/credentials", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${body.access}`,
                        "Content-Type": "application/json",
                    }
                });

                if (verify.status === 200) {
                    const userData = await verify.json();
                    localStorage.setItem("username", userData.username);
                    localStorage.setItem("isAuthenticated", "true")
                    setData(userData);

                } else {
                    throw new Error("Verification failed");
                }

            } catch {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("username");
                localStorage.removeItem("isAuthenticated")
                navigate("/login");
            }
        };

        refreshAccessToken();

    }, [access_token, refresh_token, navigate]);

    // Handles the logout
    const handleLogout = (e) => {
        // Prevent menu from closing and event bubbling
        if (e) {
            e.stopPropagation();
        }
        
        //  Set logout flag to prevent token check
        // useref is used to persist value between renders
        isLoggingOut.current = true;
        
        // Close the menu manually
        setAnchorEl(null);
        setIsMenuOpen(false);
        
        // Show logout notification
        setLogoutStatus(true);
        
        // Clear tokens immediately
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("username");
        localStorage.removeItem("isAuthenticated");

        if (timeout.current) {
            clearTimeout(timeout.current);
        }

        // Navigate after delay
        timeout.current = setTimeout(() => {
            setLogoutStatus(false);
            navigate('/login');
        }, 1500);
    }

    const handleNavigation = (path) => {
        navigate(path);
        setIsMenuOpen(false);
    };

    return (
        <>
            {/* Logout Toast Notification */}
            {logoutStatus && (
                <div className="status-message success" style={{ position: 'fixed', top: '100px', right: '2rem', zIndex: 10000 }}>
                    <svg className="status-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>Logging out...</span>
                </div>
            )}
            
            <nav className="auth-navbar" ref={navref}>
            <div className="auth-navbar-container">
                {/* Logo */}
                <div className="auth-navbar-logo" onClick={() => handleNavigation('/dashboard')}>
                    <img src={image} alt="CompliGen Logo" />
                    <span>CompliGen</span>
                </div>

                {/* Desktop Navigation Links */}
                <div className="auth-navbar-links">
                    <button 
                        className="auth-nav-link"
                        onClick={() => handleNavigation('/dashboard')}
                    >
                        Dashboard
                    </button>
                    <button 
                        className="auth-nav-link"
                        onClick={() => handleNavigation('/compliance-checker')}
                    >
                        Compliance Checker
                    </button>
                    <button 
                        className="auth-nav-link"
                        onClick={() => handleNavigation('/policy-generator')}
                    >
                        Policy Generator
                    </button>
                </div>

                {/* User Avatar & Menu */}
                <div className="auth-navbar-user">
                    {data.username && (
                        <>
                            <Avatar 
                                {...stringAvatar(data.username)}
                                onClick={handleClick}
                            />
                            <Menu
                                anchorEl={anchorEl}
                                id="account-menu"
                                open={open}
                                onClose={handleClose}
                                PaperProps={{
                                    elevation: 3,
                                    sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                                        mt: 1.5,
                                        minWidth: 180,
                                        '& .MuiAvatar-root': {
                                            width: 32,
                                            height: 32,
                                            ml: -0.5,
                                            mr: 1,
                                        },
                                    },
                                }}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                <MenuItem 
                                    sx={{ 
                                        py: 1.5, 
                                        px: 2,
                                        pointerEvents: 'none',
                                        opacity: 0.7
                                    }}
                                >
                                    <Avatar {...stringAvatar(data.username)} />
                                    <span style={{ fontWeight: 600 }}>{data.username}</span>
                                </MenuItem>
                                <MenuItem 
                                    onClick={handleLogout}
                                    sx={{ py: 1.5, px: 2 }}
                                >
                                    <ListItemIcon>
                                        <Logout fontSize="small" />
                                    </ListItemIcon>
                                    Logout
                                </MenuItem>
                            </Menu>
                        </>
                    )}
                </div>

                {/* Mobile Hamburger Menu */}
                <button 
                    className="auth-navbar-hamburger"
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`auth-mobile-menu ${isMenuOpen ? 'active' : ''}`}>
                <button 
                    className="auth-mobile-link"
                    onClick={() => handleNavigation('/dashboard')}
                >
                    Dashboard
                </button>
                <button 
                    className="auth-mobile-link"
                    onClick={() => handleNavigation('/compliance-checker')}
                >
                    Compliance Checker
                </button>
                <button 
                    className="auth-mobile-link"
                    onClick={() => handleNavigation('/policy-generator')}
                >
                    Policy Generator
                </button>
            </div>
        </nav>
        </>
    )
}

export default memo(AuthenticatedNavbar)