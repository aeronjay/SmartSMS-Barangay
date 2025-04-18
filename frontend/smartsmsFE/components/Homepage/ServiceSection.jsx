import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/ServiceSection.css';

const ServicesSection = () => {
    const [hoveredService, setHoveredService] = useState(null);
    const [requestSubmitted, setRequestSubmitted] = useState(false);

    const handleServiceHover = (index) => {
        setHoveredService(index);
    };

    const handleServiceLeave = () => {
        setHoveredService(null);
    };

    const handleRequestNow = (serviceName) => {
        // In the future, this could be connected to a form submission or redirection
        console.log(`Request submitted for ${serviceName}`);
        setRequestSubmitted(true);
        
        // Reset the submitted state after showing confirmation
        setTimeout(() => {
            setRequestSubmitted(false);
        }, 3000);
    };

    const services = [
        {
            id: 1,
            title: "4P's Validation",
            icon: "fas fa-check-double",
            description: "Validate registration for the government's 4P's program.",
            bgImage: "4PS.png"
        },
        {
            id: 2,
            title: "Common Law",
            icon: "fas fa-balance-scale",
            description: "Certification for common law unions and relationships.",
            bgImage: "LAW.png"
        },
        {
            id: 3,
            title: "Identification",
            icon: "fas fa-id-card",
            description: "Barangay ID issuance and verification services.",
            bgImage: "IDENTIFICATION.jpg"
        },
        {
            id: 4,
            title: "Indigency",
            icon: "fas fa-hand-holding-heart",
            description: "Certificate of indigency for qualified residents.",
            bgImage: "/images/services/indigency-bg.jpg"
        },
        {
            id: 5,
            title: "Medical Assistance",
            icon: "fas fa-medkit",
            description: "Support for medical needs and healthcare services.",
            bgImage: "MEDS.jpg"
        },
        {
            id: 6,
            title: "Other Purposes",
            icon: "fas fa-ellipsis-h",
            description: "Additional services and certifications.",
            bgImage: "OPTION.jpg"
        }
    ];

    return (
        <div className="services-section">
            <div className="services-header">
                <h2>Online Services</h2>
                <p>Barangay Certification: Medical Assistance | 4P's Validation | Indigency | More</p>
                <span className="services-subtitle">Effortless Access, One Click Away: Barangay 551 Launches Online Services for Seamless Barangay Certification</span>
            </div>

            <div className="services-grid">
                {services.map((service, index) => (
                    <div 
                        key={service.id}
                        className={`service-card ${hoveredService === index ? 'hovered' : ''}`}
                        onMouseEnter={() => handleServiceHover(index)}
                        onMouseLeave={handleServiceLeave}
                        style={{
                            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url(${service.bgImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    >
                        <div className="service-content">
                            <div className="service-icon">
                                <i className={service.icon}></i>
                            </div>
                            <h3 className="service-title">{service.title}</h3>
                            <p className="service-description">{service.description}</p>
                            <button 
                                className="request-button"
                                onClick={() => handleRequestNow(service.title)}
                            >
                                <i className="fas fa-paper-plane"></i> Request Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {requestSubmitted && (
                <div className="request-confirmation">
                    <div className="confirmation-content">
                        <i className="fas fa-check-circle"></i>
                        <p>Your request has been submitted successfully!</p>
                        <p>Please check your email for further instructions.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServicesSection;