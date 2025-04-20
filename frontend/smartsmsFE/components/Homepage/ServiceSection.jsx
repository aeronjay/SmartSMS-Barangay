import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/ServiceSection.css';
import RequestModal from './RequestModal'; // Import the new modal component

const ServicesSection = () => {
    const [hoveredService, setHoveredService] = useState(null);
    const [requestSubmitted, setRequestSubmitted] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    const handleServiceHover = (index) => {
        setHoveredService(index);
    };

    const handleServiceLeave = () => {
        setHoveredService(null);
    };

    const handleRequestNow = (service) => {
        setSelectedService(service);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleRequestSuccess = () => {
        setRequestSubmitted(true);
        
        // Reset the submitted state after showing confirmation
        setTimeout(() => {
            setRequestSubmitted(false);
        }, 3000);
    };

    const services = [
        {
            id: 1,
            title: "Barangay Clearance",
            icon: "fas fa-file-alt",
            description: "Proof of good standing within the barangay; required for employment, business, and other legal purposes.",
            bgImage: "cert1.jpg"
        },
        {
            id: 2,
            title: "Certificate of Residency",
            icon: "fas fa-map-marker-alt",
            description: "Certification proving residency within the barangay for various legal and government requirements.",
            bgImage: "cert2.jpg"
        },
        {
            id: 4,
            title: "Certificate of Indigency",
            icon: "fas fa-hand-holding-heart",
            description: "Document issued to low-income individuals for access to social welfare and financial aid programs.",
            bgImage: "cert3.jpg"
        },
        {
            id: 5,
            title: "Medical Assistance",
            icon: "fas fa-medkit",
            description: "Endorsement and support for healthcare and medical-related concerns.",
            bgImage: "MEDS.jpg"
        },
        {
            id: 6,
            title: "Health Certificate",
            icon: "fas fa-notes-medical",
            description: "Certificate issued after a barangay-level health screening, commonly required for work or school.",
            bgImage: "cert4.jpg"
        },
        {
            id: 7,
            title: "Barangay Blotter Certificate",
            icon: "fas fa-clipboard-list",
            description: "Documentation of incidents or filed complaints within the barangay for legal and record purposes.",
            bgImage: "cert5.jpg"
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
                                onClick={() => handleRequestNow(service)}
                            >
                                <i className="fas fa-paper-plane"></i> Request Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Component */}
            {selectedService && (
                <RequestModal 
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    documentType={selectedService.title}
                    onSubmit={handleRequestSuccess}
                />
            )}

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