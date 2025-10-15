import React from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import './LegalPages.css';

const PrivacyPolicyPage = () => {
    return (
        <>
            <Header />
            <div className="legal-page">
                <div className="legal-hero">
                    <div className="container">
                        <h1>Privacy Policy</h1>
                        <p>Last updated: October 13, 2024</p>
                    </div>
                </div>

                <div className="legal-content">
                    <div className="container">
                        <div className="legal-section">
                            <h2>1. Information We Collect</h2>
                            <p>
                                We collect several different types of information for various purposes to provide and 
                                improve our service to you.
                            </p>
                            <h3>Personal Data</h3>
                            <p>While using our service, we may ask you to provide us with certain personally identifiable 
                            information that can be used to contact or identify you ("Personal Data"). Personally 
                            identifiable information may include, but is not limited to:</p>
                            <ul>
                                <li>Email address</li>
                                <li>First name and last name</li>
                                <li>Phone number</li>
                                <li>Address, State, Province, ZIP/Postal code, City</li>
                                <li>Cookies and Usage Data</li>
                            </ul>
                        </div>

                        <div className="legal-section">
                            <h2>2. How We Use Your Information</h2>
                            <p>Sales Savvy uses the collected data for various purposes:</p>
                            <ul>
                                <li>To provide and maintain our service</li>
                                <li>To notify you about changes to our service</li>
                                <li>To allow you to participate in interactive features of our service</li>
                                <li>To provide customer support</li>
                                <li>To gather analysis or valuable information to improve our service</li>
                                <li>To monitor the usage of our service</li>
                                <li>To detect, prevent and address technical issues</li>
                            </ul>
                        </div>

                        <div className="legal-section">
                            <h2>3. Data Security</h2>
                            <p>
                                The security of your data is important to us. We implement appropriate technical and 
                                organizational security measures designed to protect your personal data. However, 
                                remember that no method of transmission over the Internet, or method of electronic 
                                storage is 100% secure.
                            </p>
                        </div>

                        <div className="legal-section">
                            <h2>4. Your Data Protection Rights</h2>
                            <p>You have the right to:</p>
                            <ul>
                                <li>Access, update or delete the information we have on you</li>
                                <li>Rectify inaccurate or incomplete information</li>
                                <li>Object to our processing of your personal information</li>
                                <li>Request restriction of processing your personal information</li>
                                <li>Request portability of your personal information</li>
                            </ul>
                        </div>

                        <div className="legal-section">
                            <h2>5. Cookies</h2>
                            <p>
                                We use cookies and similar tracking technologies to track the activity on our service 
                                and hold certain information. Cookies are files with small amount of data which may 
                                include an anonymous unique identifier.
                            </p>
                        </div>

                        <div className="legal-section">
                            <h2>6. Changes to This Privacy Policy</h2>
                            <p>
                                We may update our Privacy Policy from time to time. We will notify you of any changes 
                                by posting the new Privacy Policy on this page and updating the "last updated" date.
                            </p>
                        </div>

                        <div className="legal-section">
                            <h2>7. Contact Us</h2>
                            <p>
                                If you have any questions about this Privacy Policy, please contact us:
                                <br />
                                Email: privacy@sales-savvy.com
                                <br />
                                Address: 123 Commerce Street, Business City, BC 12345
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PrivacyPolicyPage;