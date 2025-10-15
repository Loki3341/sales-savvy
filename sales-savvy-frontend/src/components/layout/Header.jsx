import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import CartIcon from '../common/CartIcon';
import ProfileDropdown from './ProfileDropdown';
import '../../assets/styles/components.css';

const Header = () => {
  const { user } = useAuth();
  const { cartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const showCart = !isAuthPage;

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <a 
            href="/" 
            className="logo"
          >
            {/* Add logo image here */}
            <img 
              src="/src/assets/images/logo.png" 
              alt="Sales Savvy Logo" 
              className="logo-image"
              onError={(e) => {
                // Fallback to text if logo image fails to load
                e.target.style.display = 'none';
                const textFallback = e.target.parentNode.querySelector('.logo-text');
                if (textFallback) textFallback.style.display = 'inline';
              }}
            />
            <span className="logo-text">Sales Savvy</span>
          </a>
        </div>
        
        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        <div className={`header-actions ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          {showCart && (
            <div className="cart-action">
              <CartIcon count={cartCount} />
            </div>
          )}
          
          {user ? (
            <div className="profile-action">
              <ProfileDropdown username={user.username} />
            </div>
          ) : (
            <div className="auth-buttons">
              <a 
                href="/login" 
                className="login-btn"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </a>
              <a 
                href="/register" 
                className="register-btn"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Register
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;