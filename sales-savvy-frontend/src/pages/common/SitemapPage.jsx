import React from 'react';
import Footer from '../../components/layout/Footer';
import Header from '../../components/layout/Header';
import './SitemapPage.css';

const SitemapPage = () => {
    return (
        <>
            <Header />
            <div className="sitemap-page">
                <div className="sitemap-hero">
                    <div className="container">
                        <h1>Website Sitemap</h1>
                        <p>Navigate through all the pages of Sales Savvy</p>
                    </div>
                </div>

                <div className="sitemap-content">
                    <div className="container">
                        <div className="sitemap-grid">
                            <div className="sitemap-section">
                                <h2>🛍️ Shopping</h2>
                                <ul>
                                    <li><a href="/">Home Page</a></li>
                                    <li><a href="/products">All Products</a></li>
                                    <li><a href="/category/shirts">Shirts</a></li>
                                    <li><a href="/category/pants">Pants</a></li>
                                    <li><a href="/category/accessories">Accessories</a></li>
                                    <li><a href="/category/mobiles">Mobiles</a></li>
                                    <li><a href="/category/mobile-accessories">Mobile Accessories</a></li>
                                    <li><a href="/category/electronics">Electronics</a></li>
                                    <li><a href="/category/books">Books</a></li>
                                </ul>
                            </div>

                            <div className="sitemap-section">
                                <h2>👤 Account</h2>
                                <ul>
                                    <li><a href="/login">Login</a></li>
                                    <li><a href="/register">Register</a></li>
                                    <li><a href="/profile">My Profile</a></li>
                                    <li><a href="/orders">My Orders</a></li>
                                    <li><a href="/cart">Shopping Cart</a></li>
                                    <li><a href="/checkout">Checkout</a></li>
                                </ul>
                            </div>

                            <div className="sitemap-section">
                                <h2>⚙️ Admin</h2>
                                <ul>
                                    <li><a href="/admin/dashboard">Admin Dashboard</a></li>
                                    <li><a href="/admin/products">Product Management</a></li>
                                    <li><a href="/admin/categories">Category Management</a></li>
                                    <li><a href="/admin/orders">Order Management</a></li>
                                    <li><a href="/admin/users">User Management</a></li>
                                    <li><a href="/admin/analytics">Analytics</a></li>
                                    <li><a href="/admin/settings">Settings</a></li>
                                </ul>
                            </div>

                            <div className="sitemap-section">
                                <h2>ℹ️ Information</h2>
                                <ul>
                                    <li><a href="/about">About Us</a></li>
                                    <li><a href="/contact">Contact Us</a></li>
                                    <li><a href="/support">Support Center</a></li>
                                    <li><a href="/terms">Terms of Service</a></li>
                                    <li><a href="/privacy">Privacy Policy</a></li>
                                    <li><a href="/returns">Return Policy</a></li>
                                    <li><a href="/sitemap">Sitemap</a></li>
                                    <li><a href="/accessibility">Accessibility</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default SitemapPage;