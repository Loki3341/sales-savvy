import React, { useState } from 'react';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { formatPrice } from '../../utils/helpers';

const ProductCard = ({ product }) => {
  const { addToCart, loading, success, clearError, clearSuccess, addingProductId, cartCount } = useCart();
  const { user } = useAuth();
  const [localSuccess, setLocalSuccess] = useState(null);
  const [localError, setLocalError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isAddingThisProduct = addingProductId === (product.productId || product.id);

  const handleAddToCart = async () => {
    if (!user) {
      const shouldLogin = window.confirm('Please login to add items to cart. Would you like to login now?');
      if (shouldLogin) {
        window.location.href = '/login';
      }
      return;
    }

    clearError();
    clearSuccess();
    setLocalSuccess(null);
    setLocalError(null);

    try {
      const success = await addToCart(product.productId || product.id, 1);
      
      if (success) {
        console.log('✅ Product added to cart! Current cart count:', cartCount + 1);
        setLocalSuccess('Added to cart!');
        
        setTimeout(() => {
          setLocalSuccess(null);
          clearSuccess();
        }, 2000);
      }
    } catch (err) {
      console.error('❌ Failed to add to cart:', err);
      setLocalError(err.message || 'Failed to add to cart');
      
      setTimeout(() => {
        setLocalError(null);
      }, 3000);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  // Ensure consistent product data with fallbacks
  const productName = product.name || 'Unnamed Product';
  const productDescription = product.description || 'No description available for this product.';
  const productPrice = product.price || 0;
  const productImage = product.imageUrl || product.image || 'https://via.placeholder.com/200x200?text=No+Image';

  if (!product) {
    return (
      <div className="product-card error">
        <div className="product-card-content">
          <div className="error-state">
            <p>Product not available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-card">
      <div className="product-image-container">
        {!imageLoaded && !imageError && (
          <div className="image-placeholder">
            <div className="spinner-small"></div>
          </div>
        )}
        <img 
          src={imageError ? 'https://via.placeholder.com/200x200?text=No+Image' : productImage}
          alt={productName}
          className={`product-image ${imageLoaded ? 'image-loaded' : 'image-loading'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>
      
      <div className="product-card-content">
        <h3 className="product-title text-truncate-2">
          {productName}
        </h3>
        
        <p className="product-price">
          {formatPrice(productPrice)}
        </p>
        
        <p className="product-description text-truncate-3">
          {productDescription}
        </p>
        
        {/* Success Message */}
        {(localSuccess || (success && isAddingThisProduct)) && (
          <div className="success-message">
            ✅ {localSuccess || success}
          </div>
        )}
        
        {/* Error Message */}
        {localError && (
          <div className="error-message">
            ❌ {localError}
          </div>
        )}
        
        <button 
          onClick={handleAddToCart}
          disabled={isAddingThisProduct || loading}
          className={`add-to-cart-btn ${isAddingThisProduct ? 'loading' : ''}`}
        >
          {isAddingThisProduct ? (
            <>
              <span>Adding...</span>
              <div className="button-spinner"></div>
            </>
          ) : (
            'Add to Cart'
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;