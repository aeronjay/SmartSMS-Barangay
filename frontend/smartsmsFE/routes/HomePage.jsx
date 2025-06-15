import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import '../styles/Homepage.css';
import ServicesSection from '../components/Homepage/ServiceSection'; 

const HomePage = () => {

    
    const today = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    const dateTimeString = today.toLocaleString('en-US', options);
    
    return (
        <div className="site-container">
            {/* Top header with official website text and social links */}
            <div className="top-header">
                <div className="top-header-content">
                    <div className="site-title">GOVPH | The Official Website of Barangay 551, District 4 Manila</div>
                    <div className="social-icons-top">
                        <a href="https://www.facebook.com/brgy551zone54" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="#" className="social-icon">
                            <i className="fab fa-youtube"></i>
                        </a>
                        <a href="#" className="social-icon">
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="#" className="social-icon">
                            <i className="fas fa-phone"></i>
                        </a>
                    </div>
                    <div className="date-time">
                        Philippine Standard Time:<br />
                        {dateTimeString}
                    </div>
                </div>
            </div>

            {/* Main na`vi`gation header */}
            <header className="header">
                <div className="header-content">
                    <div className="logo-container">
                        
                        <div className="logo-text">
                            <h1>Barangay 551</h1>
                            <h2>District 4 Manila</h2>
                        </div>
                    </div>
                      <nav className="navbar">
                        <Link to="/" className="nav-item">Home</Link>
                        <Link to="/about" className="nav-item">About</Link>
                        <Link to="/contact" className="nav-item">Contact</Link>
                        <Link to="/loginPage" className="nav-item admin-login-btn">Admin Login</Link>
                    </nav>
                </div>
            </header>

            {/* Main banner section */}
            <main className="main-content">
                <div className="banner">
                    <div className="banner-content">
                        <div className="banner-left">
                            <div className="city-logo">
                                <img src="MANILA_LOGO.png" alt="Manila City Logo" />
                            </div>
                            <div className="smart-barangay">
                                <h2 className="smart-text">Smart</h2>
                                <h1 className="barangay-text">BARANGAY 551</h1>
                                <div className="slogan">
                                    <p className="slogan-line">TODAY'S INNOVATIONS,</p>
                                    <p className="slogan-line">TOMORROW'S COMMUNITY.</p>
                                    <p className="website-url">smartsms-barangay.onrender.com</p>
                                </div>
                            </div>
                        </div>
                       
                        <div className="banner-center">
                            <div className="barangay-seal">
                                <img src="BRGY_BG.png" alt="Barangay 551 Seal" className='brgylogo'/>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            {/* Services Section - New Component Added Here */}
            <ServicesSection />

            {/* Footer */}
            <footer className="footer">
                <p>© 2025 Barangay 551 Zone 54, District 4 Manila. All rights reserved.</p>
                <div className="social-links">
                    <a href="https://www.facebook.com/brgy551zone54" target="_blank" rel="noopener noreferrer" className="footer-link">FACEBOOK</a>
                    
                </div>
            </footer>
        </div>
    );
};

export default HomePage;