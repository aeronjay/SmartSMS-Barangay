import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import '../styles/Homepage.css';
import ServicesSection from '../components/Homepage/ServiceSection';
import { FaFacebookF, FaYoutube, FaTwitter, FaPhone, FaUsers, FaShieldAlt, FaMobileAlt, FaHeart } from 'react-icons/fa';

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
                    <div className="site-title">GOVPH | The Official Website of Barangay 551, District 4 Manila</div>                    <div className="social-icons-top">
                        <a href="https://www.facebook.com/brgy551zone54" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <FaFacebookF />
                        </a>
                        <a href="#" className="social-icon">
                            <FaYoutube />
                        </a>
                        <a href="#" className="social-icon">
                            <FaTwitter />
                        </a>
                        <a href="#" className="social-icon">
                            <FaPhone />
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
                                <h1 className="barangay-text">BARANGAY 551 Zone 54</h1>
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

            {/* About Section */}
            <section className="about-section">
                <div className="about-container">
                    <div className="about-content">
                        <div className="about-header">
                            <h2 className="about-title">About Barangay 551</h2>
                            <div className="about-divider"></div>
                        </div>
                        
                        <div className="about-grid">
                            <div className="about-text">
                                <div className="about-item">
                                    <h3>Our Community</h3>
                                    <p>
                                        Barangay 551, Zone 54, District 4 Manila serves as the smallest administrative division 
                                        and the foundation of local governance in our community. As your local government unit, 
                                        we are committed to delivering essential services and fostering community development 
                                        for all residents.
                                    </p>
                                </div>
                                
                                <div className="about-item">
                                    <h3>Our Mission</h3>
                                    <p>
                                        We strive to provide responsive, transparent, and efficient public services while 
                                        promoting peace, order, and sustainable development within our barangay. Through 
                                        innovative digital solutions like SmartSMS, we bridge the gap between traditional 
                                        governance and modern technology.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="about-features">                                <div className="feature-card">
                                    <div className="feature-icon">
                                        <FaUsers />
                                    </div>
                                    <h4>Community Service</h4>
                                    <p>Document issuance, dispute resolution, and community programs</p>
                                </div>
                                
                                <div className="feature-card">
                                    <div className="feature-icon">
                                        <FaShieldAlt />
                                    </div>
                                    <h4>Peace & Order</h4>
                                    <p>Barangay justice system and community safety initiatives</p>
                                </div>
                                
                                <div className="feature-card">
                                    <div className="feature-icon">
                                        <FaMobileAlt />
                                    </div>
                                    <h4>Digital Innovation</h4>
                                    <p>Smart communication systems and online service delivery</p>
                                </div>
                                
                                <div className="feature-card">
                                    <div className="feature-icon">
                                        <FaHeart />
                                    </div>
                                    <h4>Social Services</h4>
                                    <p>Health programs, senior citizen assistance, and youth development</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="about-footer">
                            <div className="governance-info">
                                <h4>Local Governance Structure</h4>
                                <p>
                                    Our barangay is governed by an elected Barangay Council (Sangguniang Barangay) 
                                    consisting of the Barangay Captain, seven Barangay Councilors, and the Sangguniang 
                                    Kabataan (Youth Council) Chairman, working together to serve our community's needs.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

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