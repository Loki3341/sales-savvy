import React from 'react';
import Footer from '../../components/layout/Footer';
import Header from '../../components/layout/Header';
import './AboutUsPage.css';

const AboutUsPage = () => {
    return (
        <>
            <Header />
            <div className="about-us-page">
                <div className="about-hero">
                    <div className="container">
                        <h1>About Sales Savvy</h1>
                        <p className="hero-subtitle">Your trusted partner for quality products and exceptional shopping experience</p>
                    </div>
                </div>

                <div className="about-content">
                    <div className="container">
                        <section className="mission-section">
                            <h2>Our Mission</h2>
                            <p>
                                At Sales Savvy, we believe that everyone deserves access to quality products 
                                at affordable prices. Our mission is to create a seamless shopping experience 
                                that combines convenience, reliability, and exceptional customer service.
                            </p>
                        </section>

                        <section className="story-section">
                            <h2>Our Story</h2>
                            <div className="story-content">
                                <div className="story-text">
                                    <p>
                                        Founded in 2024, Sales Savvy started as a small venture with a big vision - 
                                        to revolutionize the way people shop online. What began as a passion project 
                                        has grown into a trusted e-commerce platform serving thousands of customers 
                                        nationwide.
                                    </p>
                                    <p>
                                        Our journey has been guided by core values of integrity, innovation, and 
                                        customer-centricity. We carefully curate our product selection to ensure 
                                        that every item meets our high standards of quality and value.
                                    </p>
                                </div>
                                <div className="story-image">
                                    <div className="placeholder-image">
                                        🏢
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="values-section">
                            <h2>Our Values</h2>
                            <div className="values-grid">
                                <div className="value-card">
                                    <div className="value-icon">💎</div>
                                    <h3>Quality</h3>
                                    <p>We never compromise on the quality of our products and services</p>
                                </div>
                                <div className="value-card">
                                    <div className="value-icon">🤝</div>
                                    <h3>Trust</h3>
                                    <p>Building lasting relationships based on transparency and reliability</p>
                                </div>
                                <div className="value-card">
                                    <div className="value-icon">🚀</div>
                                    <h3>Innovation</h3>
                                    <p>Continuously improving our platform and services</p>
                                </div>
                                <div className="value-card">
                                    <div className="value-icon">❤️</div>
                                    <h3>Customer First</h3>
                                    <p>Your satisfaction is our top priority in everything we do</p>
                                </div>
                            </div>
                        </section>

                        <section className="team-section">
                            <h2>Meet Our Team</h2>
                            <div className="team-grid">
                                <div className="team-member">
                                    <div className="member-avatar">LD</div>
                                    <h3>Lokesh Domadula</h3>
                                    <p>Founder & CEO</p>
                                </div>
                                {/* Add more team members as needed */}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AboutUsPage;