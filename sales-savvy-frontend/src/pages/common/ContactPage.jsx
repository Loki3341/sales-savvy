import React, { useState } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import './ContactPage.css';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log('Contact form submitted:', formData);
        alert('Thank you for your message! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <>
            <Header />
            <div className="contact-page">
                <div className="contact-hero">
                    <div className="container">
                        <h1>Contact Us</h1>
                        <p>We're here to help! Get in touch with us.</p>
                    </div>
                </div>

                <div className="contact-content">
                    <div className="container">
                        <div className="contact-grid">
                            <div className="contact-info">
                                <h2>Get In Touch</h2>
                                <div className="contact-method">
                                    <div className="contact-icon">📧</div>
                                    <div>
                                        <h3>Email</h3>
                                        <p>support@sales-savvy.com</p>
                                    </div>
                                </div>
                                <div className="contact-method">
                                    <div className="contact-icon">📞</div>
                                    <div>
                                        <h3>Phone</h3>
                                        <p>+1 (555) 123-4567</p>
                                    </div>
                                </div>
                                <div className="contact-method">
                                    <div className="contact-icon">📍</div>
                                    <div>
                                        <h3>Address</h3>
                                        <p>123 Commerce Street<br />Business City, BC 12345</p>
                                    </div>
                                </div>
                                <div className="contact-method">
                                    <div className="contact-icon">🕒</div>
                                    <div>
                                        <h3>Business Hours</h3>
                                        <p>Monday - Friday: 9:00 AM - 6:00 PM<br />Saturday: 10:00 AM - 4:00 PM</p>
                                    </div>
                                </div>
                            </div>

                            <div className="contact-form-container">
                                <form onSubmit={handleSubmit} className="contact-form">
                                    <div className="form-group">
                                        <label htmlFor="name">Full Name *</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email Address *</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="subject">Subject *</label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="message">Message *</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows="5"
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn-primary">Send Message</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ContactPage;