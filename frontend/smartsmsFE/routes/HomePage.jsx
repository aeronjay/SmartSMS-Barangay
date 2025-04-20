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
    
    // Weather forecast data
    const weatherForecast = [
        { day: '16 Apr', temp: '+32°C', icon: '☁️' },
        { day: '17 Apr', temp: '+31°C', icon: '☁️' },
        { day: '18 Apr', temp: '+31°C', icon: '☀️' },
        { day: '19 Apr', temp: '+31°C', icon: '☁️' },
        { day: '20 Apr', temp: '+32°C', icon: '☁️' },
        { day: '21 Apr', temp: '+31°C', icon: '☁️' },
        { day: '22 Apr', temp: '+31°C', icon: '☀️' }
    ];

    // Weather scroll effect
    const [scrollPosition, setScrollPosition] = useState(0);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setScrollPosition(prevPosition => {
                // Reset position when all weather items have scrolled
                if (prevPosition <= -700) {
                    return 0;
                }
                return prevPosition - 1; // Move 1px at a time
            });
        }, 50); // Update every 50ms for smooth scrolling
        
        return () => clearInterval(interval);
    }, []);

    // API key for OpenWeatherMap
    // const apiKey = '';
    // const [currentWeather, setCurrentWeather] = useState(null);

    // useEffect(() => {
    //     // Fetch real-time weather for Manila using your API key
    //     fetch(`https://api.openweathermap.org/data/2.5/weather?q=Manila,ph&units=metric&appid=${apiKey}`)
    //         .then(response => response.json())
    //         .then(data => {
    //             setCurrentWeather(data);
    //         })
    //         .catch(error => {
    //             console.error("Error fetching weather data:", error);
    //         });
    // }, [apiKey]);

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
                        <div className="dropdown">
                            <span className="nav-item">Our Barangay ▾</span>
                            <div className="dropdown-content">
                                <Link to="/history">History</Link>
                                <Link to="/officials">Officials</Link>
                            </div>
                        </div>
                        <div className="dropdown">
                            <span className="nav-item">Services ▾</span>
                            <div className="dropdown-content">
                                <Link to="/permits">Permits</Link>
                                <Link to="/assistance">Assistance</Link>
                            </div>
                        </div>
                        <Link to="/jobs" className="nav-item">Jobs</Link>
                        <div className="dropdown">
                            <span className="nav-item">Publications ▾</span>
                            <div className="dropdown-content">
                                <Link to="/reports">Reports</Link>
                                <Link to="/announcements">Announcements</Link>
                            </div>
                        </div>
                        <Link to="/news" className="nav-item">News & Events</Link>
                        <div className="dropdown">
                            <span className="nav-item">Transparency ▾</span>
                            <div className="dropdown-content">
                                <Link to="/budget">Budget</Link>
                                <Link to="/projects">Projects</Link>
                            </div>
                        </div>
                        <Link to="/loginPage" className="nav-item login-btn">Login</Link>
                    </nav>
                </div>
            </header>

            {/* Weather forecast strip */}
            <div className="weather-forecast-container">
                <div className="weather-forecast" style={{ transform: `translateX(${scrollPosition}px)` }}>
                    {weatherForecast.map((day, index) => (
                        <div key={index} className="weather-day">
                            <span className="weather-date">{day.day}</span>
                            <span className="weather-icon">{day.icon}</span>
                            <span className="weather-temp">{day.temp}</span>
                        </div>
                    ))}
                    {/* Duplicate items for continuous scrolling */}
                    {weatherForecast.map((day, index) => (
                        <div key={`dup-${index}`} className="weather-day">
                            <span className="weather-date">{day.day}</span>
                            <span className="weather-icon">{day.icon}</span>
                            <span className="weather-temp">{day.temp}</span>
                        </div>
                    ))}
                </div>
            </div>

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
                                    <p className="website-url">www.Barangay551zone54.ph</p>
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

            {/* Announcements ticker */}
            <div className="announcements-ticker">
                <div className="announcement-label">Announcements</div>
                <div className="announcement-content">
                    <p>Barangay 551 announcements will appear here.</p>
                </div>
            </div>

            {/* Footer */}
            <footer className="footer">
                <p>© 2025 Barangay 551 Zone 54, District 4 Manila. All rights reserved.</p>
                <div className="social-links">
                    <a href="https://www.facebook.com/brgy551zone54" target="_blank" rel="noopener noreferrer" className="footer-link">FACEBOOK</a>
                    <a href="mailto:barangay551@gmail.com" className="footer-link">GMAIL</a>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;