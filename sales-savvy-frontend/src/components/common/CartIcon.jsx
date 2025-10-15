import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/components.css';

const CartIcon = ({ count = 0 }) => {
  return (
    <Link to="/cart" className="cart-icon" style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textDecoration: 'none',
      color: '#333',
      padding: '0.5rem',
      borderRadius: '8px',
      transition: 'all 0.2s ease',
      background: 'transparent'
    }}>
      {/* Cart SVG Icon */}
	  <svg 
	    width="24" 
	    height="24" 
	    viewBox="0 0 24 24" 
	    fill="none" 
	    stroke="currentColor" 
	    strokeWidth="2" 
	    strokeLinecap="round" 
	    strokeLinejoin="round"
	  >
	    <path d="M5 8H19L17 21H7L5 8Z" />
	    <path d="M8.5 11V6C8.5 4.34315 9.84315 3 11.5 3H12.5C14.1569 3 15.5 4.34315 15.5 6V11" />
	  </svg>
      
      {/* Cart Count Badge */}
      {count > 0 && (
        <span className="cart-count" style={{
          position: 'absolute',
          top: '-5px',
          right: '-5px',
          background: '#00ABE4',
          color: 'white',
          borderRadius: '50%',
          width: '20px',
          height: '20px',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;