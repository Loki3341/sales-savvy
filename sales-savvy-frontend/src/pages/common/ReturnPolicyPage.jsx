import React from 'react';
import Footer from '../../components/layout/Footer';
import Header from '../../components/layout/Header';
import './LegalPages.css';

const ReturnPolicyPage = () => {
    return (
        <>
            <Header />
            <div className="legal-page">
                <div className="legal-hero">
                    <div className="container">
                        <h1>Return Policy</h1>
                        <p>We want you to be completely satisfied with your purchase</p>
                    </div>
                </div>

                <div className="legal-content">
                    <div className="container">
                        <div className="return-highlights">
                            <div className="highlight-card">
                                <div className="highlight-icon">📅</div>
                                <h3>30-Day Return Window</h3>
                                <p>Return most items within 30 days of delivery</p>
                            </div>
                            <div className="highlight-card">
                                <div className="highlight-icon">🔄</div>
                                <h3>Easy Returns</h3>
                                <p>Simple and hassle-free return process</p>
                            </div>
                            <div className="highlight-card">
                                <div className="highlight-icon">💸</div>
                                <h3>Full Refunds</h3>
                                <p>Get your money back for eligible returns</p>
                            </div>
                        </div>

                        <div className="legal-section">
                            <h2>Return Eligibility</h2>
                            <p>To be eligible for a return, your item must be:</p>
                            <ul>
                                <li>In the same condition that you received it</li>
                                <li>In the original packaging</li>
                                <li>With tags still attached</li>
                                <li>Accompanied by the receipt or proof of purchase</li>
                            </ul>
                        </div>

                        <div className="legal-section">
                            <h2>Non-Returnable Items</h2>
                            <p>Certain types of items cannot be returned, including:</p>
                            <ul>
                                <li>Perishable goods (food, flowers, newspapers)</li>
                                <li>Intimate or sanitary goods, hazardous materials, or flammable liquids and gases</li>
                                <li>Gift cards</li>
                                <li>Downloadable software products</li>
                                <li>Some health and personal care items</li>
                            </ul>
                        </div>

                        <div className="legal-section">
                            <h2>Return Process</h2>
                            <ol>
                                <li>Log into your account and go to "Orders"</li>
                                <li>Select the item(s) you wish to return</li>
                                <li>Print the return label and packing slip</li>
                                <li>Package the item securely with the packing slip</li>
                                <li>Drop off the package at any authorized shipping location</li>
                            </ol>
                        </div>

                        <div className="legal-section">
                            <h2>Refunds</h2>
                            <p>
                                Once we receive your return, we will inspect it and notify you that we have received 
                                your returned item. We will immediately notify you of the status of your refund after 
                                inspecting the item.
                            </p>
                            <p>
                                If your return is approved, we will initiate a refund to your original method of payment. 
                                You will receive the credit within a certain amount of days, depending on your card issuer's policies.
                            </p>
                        </div>

                        <div className="legal-section">
                            <h2>Exchanges</h2>
                            <p>
                                The fastest way to ensure you get what you want is to return the item you have, and once 
                                the return is accepted, make a separate purchase for the new item.
                            </p>
                        </div>

                        <div className="legal-section">
                            <h2>Shipping Costs</h2>
                            <p>
                                You will be responsible for paying for your own shipping costs for returning your item. 
                                Shipping costs are non-refundable. If you receive a refund, the cost of return shipping 
                                will be deducted from your refund.
                            </p>
                        </div>

                        <div className="legal-section">
                            <h2>Contact Us</h2>
                            <p>
                                If you have any questions on how to return your item to us, contact us:
                                <br />
                                Email: returns@sales-savvy.com
                                <br />
                                Phone: +1 (555) 123-4567
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ReturnPolicyPage;