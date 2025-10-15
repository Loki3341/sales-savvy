import React from 'react';
import Footer from '../../components/layout/Footer';
import Header from '../../components/layout/Header';
import './LegalPages.css';

const TermsOfServicePage = () => {
    return (
        <>
            <Header />
            <div className="legal-page">
                <div className="legal-hero">
                    <div className="container">
                        <h1>Terms of Service</h1>
                        <p>Last updated: October 13, 2024</p>
                    </div>
                </div>

                <div className="legal-content">
                    <div className="container">
                        <div className="legal-section">
                            <h2>1. Agreement to Terms</h2>
                            <p>
                                By accessing and using Sales Savvy, you accept and agree to be bound by the terms 
                                and provision of this agreement. Additionally, when using these particular services, 
                                you shall be subject to any posted guidelines or rules applicable to such services.
                            </p>
                        </div>

                        <div className="legal-section">
                            <h2>2. Use License</h2>
                            <p>
                                Permission is granted to temporarily use Sales Savvy for personal, non-commercial 
                                transitory viewing only. This is the grant of a license, not a transfer of title, 
                                and under this license you may not:
                            </p>
                            <ul>
                                <li>Modify or copy the materials</li>
                                <li>Use the materials for any commercial purpose</li>
                                <li>Attempt to reverse engineer any software contained on Sales Savvy</li>
                                <li>Remove any copyright or other proprietary notations from the materials</li>
                                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                            </ul>
                        </div>

                        <div className="legal-section">
                            <h2>3. User Accounts</h2>
                            <p>
                                When you create an account with us, you must provide us with information that is 
                                accurate, complete, and current at all times. Failure to do so constitutes a breach 
                                of the Terms, which may result in immediate termination of your account on our service.
                            </p>
                        </div>

                        <div className="legal-section">
                            <h2>4. Products and Pricing</h2>
                            <p>
                                All products are subject to availability. We reserve the right to discontinue any 
                                products at any time. Prices for our products are subject to change without notice. 
                                We shall not be liable to you or to any third-party for any modification, price change, 
                                suspension, or discontinuance of the service.
                            </p>
                        </div>

                        <div className="legal-section">
                            <h2>5. Limitation of Liability</h2>
                            <p>
                                In no event shall Sales Savvy, nor its directors, employees, partners, agents, suppliers, 
                                or affiliates, be liable for any indirect, incidental, special, consequential or punitive 
                                damages, including without limitation, loss of profits, data, use, goodwill, or other 
                                intangible losses, resulting from your access to or use of or inability to access or use 
                                the service.
                            </p>
                        </div>

                        <div className="legal-section">
                            <h2>6. Governing Law</h2>
                            <p>
                                These Terms shall be governed and construed in accordance with the laws of the United 
                                States, without regard to its conflict of law provisions. Our failure to enforce any 
                                right or provision of these Terms will not be considered a waiver of those rights.
                            </p>
                        </div>

                        <div className="legal-section">
                            <h2>7. Changes to Terms</h2>
                            <p>
                                We reserve the right, at our sole discretion, to modify or replace these Terms at any 
                                time. If a revision is material, we will provide at least 30 days' notice prior to any 
                                new terms taking effect. What constitutes a material change will be determined at our 
                                sole discretion.
                            </p>
                        </div>

                        <div className="legal-section">
                            <h2>8. Contact Information</h2>
                            <p>
                                If you have any questions about these Terms, please contact us at:
                                <br />
                                Email: legal@sales-savvy.com
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

export default TermsOfServicePage;