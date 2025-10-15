import React, { useState } from 'react';
import Footer from '../../components/layout/Footer';
import Header from '../../components/layout/Header';
import './SupportPage.css';

const SupportPage = () => {
    const [activeFAQ, setActiveFAQ] = useState(null);

    const faqs = [
        {
            question: "How can I track my order?",
            answer: "You can track your order by logging into your account and visiting the 'Orders' page. You'll find tracking information and current status updates for all your orders."
        },
        {
            question: "What is your return policy?",
            answer: "We offer a 30-day return policy for most items. Products must be in original condition with tags attached. Some items like perishable goods and personal care products may not be eligible for return."
        },
        {
            question: "How do I reset my password?",
            answer: "Click on 'Forgot Password' on the login page. Enter your email address and we'll send you a link to reset your password. Make sure to check your spam folder if you don't see the email."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All payments are processed securely through encrypted channels."
        },
        {
            question: "Do you offer international shipping?",
            answer: "Currently, we ship within the country only. We're working on expanding our shipping options to include international destinations in the near future."
        }
    ];

    const toggleFAQ = (index) => {
        setActiveFAQ(activeFAQ === index ? null : index);
    };

    return (
        <>
            <Header />
            <div className="support-page">
                <div className="support-hero">
                    <div className="container">
                        <h1>Support Center</h1>
                        <p>Find answers to common questions or get help from our support team</p>
                    </div>
                </div>

                <div className="support-content">
                    <div className="container">
                        <div className="support-options">
                            <div className="option-card">
                                <div className="option-icon">❓</div>
                                <h3>FAQs</h3>
                                <p>Find quick answers to frequently asked questions</p>
                            </div>
                            <div className="option-card">
                                <div className="option-icon">📧</div>
                                <h3>Email Support</h3>
                                <p>Send us an email and we'll respond within 24 hours</p>
                            </div>
                            <div className="option-card">
                                <div className="option-icon">💬</div>
                                <h3>Live Chat</h3>
                                <p>Chat with our support team in real-time</p>
                            </div>
                            <div className="option-card">
                                <div className="option-icon">📞</div>
                                <h3>Phone Support</h3>
                                <p>Call us during business hours for immediate assistance</p>
                            </div>
                        </div>

                        <section className="faq-section">
                            <h2>Frequently Asked Questions</h2>
                            <div className="faq-list">
                                {faqs.map((faq, index) => (
                                    <div key={index} className="faq-item">
                                        <div 
                                            className="faq-question" 
                                            onClick={() => toggleFAQ(index)}
                                        >
                                            <h3>{faq.question}</h3>
                                            <span className={`faq-toggle ${activeFAQ === index ? 'active' : ''}`}>
                                                {activeFAQ === index ? '−' : '+'}
                                            </span>
                                        </div>
                                        {activeFAQ === index && (
                                            <div className="faq-answer">
                                                <p>{faq.answer}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="contact-support">
                            <h2>Still Need Help?</h2>
                            <p>Our support team is here to assist you with any questions or concerns.</p>
                            <div className="contact-buttons">
                                <button className="btn-primary">Email Support</button>
                                <button className="btn-secondary">Start Live Chat</button>
                                <button className="btn-outline">Call: +1 (555) 123-4567</button>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default SupportPage;