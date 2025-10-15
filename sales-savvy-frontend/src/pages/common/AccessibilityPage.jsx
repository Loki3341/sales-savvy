import React from 'react';
import Footer from '../../components/layout/Footer';
import Header from '../../components/layout/Header';
import './AccessibilityPage.css';

const AccessibilityPage = () => {
    return (
        <>
            <Header />
            <div className="accessibility-page">
                <div className="accessibility-hero">
                    <div className="container">
                        <h1>Accessibility Statement</h1>
                        <p>Committed to providing an accessible shopping experience for all users</p>
                    </div>
                </div>

                <div className="accessibility-content">
                    <div className="container">
                        <div className="accessibility-intro">
                            <h2>Our Commitment</h2>
                            <p>
                                At Sales Savvy, we are committed to ensuring digital accessibility for people with 
                                disabilities. We are continually improving the user experience for everyone and 
                                applying the relevant accessibility standards.
                            </p>
                        </div>

                        <div className="accessibility-section">
                            <h2>Conformance Status</h2>
                            <p>
                                The Web Content Accessibility Guidelines (WCAG) defines requirements for designers 
                                and developers to improve accessibility for people with disabilities. It defines three 
                                levels of conformance: Level A, Level AA, and Level AAA. Sales Savvy is partially 
                                conformant with WCAG 2.1 level AA. Partially conformant means that some parts of the 
                                content do not fully conform to the accessibility standard.
                            </p>
                        </div>

                        <div className="accessibility-section">
                            <h2>Accessibility Features</h2>
                            <div className="features-grid">
                                <div className="feature-card">
                                    <h3>Keyboard Navigation</h3>
                                    <p>Our website can be navigated using keyboard-only commands</p>
                                </div>
                                <div className="feature-card">
                                    <h3>Screen Reader Compatibility</h3>
                                    <p>Compatible with popular screen readers like JAWS, NVDA, and VoiceOver</p>
                                </div>
                                <div className="feature-card">
                                    <h3>Alt Text for Images</h3>
                                    <p>All meaningful images include descriptive alt text</p>
                                </div>
                                <div className="feature-card">
                                    <h3>Color Contrast</h3>
                                    <p>Sufficient color contrast ratios for text and background elements</p>
                                </div>
                                <div className="feature-card">
                                    <h3>Resizable Text</h3>
                                    <p>Text can be resized using browser text size options</p>
                                </div>
                                <div className="feature-card">
                                    <h3>Form Labels</h3>
                                    <p>All form fields have associated labels for better accessibility</p>
                                </div>
                            </div>
                        </div>

                        <div className="accessibility-section">
                            <h2>Feedback</h2>
                            <p>
                                We welcome your feedback on the accessibility of Sales Savvy. Please let us know if 
                                you encounter accessibility barriers:
                            </p>
                            <ul>
                                <li>Email: accessibility@sales-savvy.com</li>
                                <li>Phone: +1 (555) 123-4567</li>
                                <li>Visitor Address: 123 Commerce Street, Business City, BC 12345</li>
                            </ul>
                            <p>
                                We try to respond to feedback within 2 business days.
                            </p>
                        </div>

                        <div className="accessibility-section">
                            <h2>Technical Specifications</h2>
                            <p>
                                Accessibility of Sales Savvy relies on the following technologies to work with the 
                                particular combination of web browser and any assistive technologies or plugins 
                                installed on your computer:
                            </p>
                            <ul>
                                <li>HTML</li>
                                <li>CSS</li>
                                <li>JavaScript</li>
                                <li>WAI-ARIA</li>
                            </ul>
                        </div>

                        <div className="accessibility-section">
                            <h2>Assessment Approach</h2>
                            <p>
                                Sales Savvy assessed the accessibility of this website through the following approaches:
                            </p>
                            <ul>
                                <li>Self-evaluation</li>
                                <li>External evaluation by accessibility experts</li>
                                <li>Continuous monitoring and testing</li>
                            </ul>
                        </div>

                        <div className="accessibility-section">
                            <h2>Formal Complaints</h2>
                            <p>
                                If you are not satisfied with our response to your accessibility feedback, you can 
                                contact us through the channels mentioned above. We will make every reasonable effort 
                                to address your concerns.
                            </p>
                        </div>

                        <div className="accessibility-update">
                            <p><strong>Date:</strong> October 13, 2024</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AccessibilityPage;