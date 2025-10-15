import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { formatPrice } from '../../utils/helpers'
import '../../assets/styles/globals.css'
import '../../assets/styles/components.css'

const UserCartPage = () => {
  const { cartItems, cartTotal, loading, error, updateCartItem, removeFromCart, clearCart, clearError, refreshCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [updatingItem, setUpdatingItem] = useState(null)

  const handleQuantityChange = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return

    try {
      setUpdatingItem(cartItemId)
      clearError()
      const success = await updateCartItem(cartItemId, newQuantity)
      if (!success) {
        alert('Failed to update quantity. Please try again.')
      }
    } catch (error) {
      alert('Failed to update quantity. Please try again.')
    } finally {
      setUpdatingItem(null)
    }
  }

  const handleRemoveItem = async (cartItemId) => {
    if (!window.confirm('Are you sure you want to remove this item from your cart?')) {
      return
    }

    try {
      clearError()
      const success = await removeFromCart(cartItemId)
      if (!success) {
        alert('Failed to remove item. Please try again.')
      }
    } catch (error) {
      alert('Failed to remove item. Please try again.')
    }
  }

  const handleClearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your entire cart? This action cannot be undone.')) {
      return
    }

    try {
      clearError()
      const success = await clearCart()
      if (!success) {
        alert('Failed to clear cart. Please try again.')
      }
    } catch (error) {
      alert('Failed to clear cart. Please try again.')
    }
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!')
      return
    }
    
    if (!user) {
      alert('Please login to proceed to checkout')
      navigate('/login')
      return
    }
    
    navigate('/checkout')
  }

  const handleContinueShopping = () => {
    navigate('/customer-home')
  }

  const handleRetry = () => {
    clearError()
    refreshCart()
  }

  // Calculate order summary values
  const calculateOrderSummary = () => {
    if (!cartItems || cartItems.length === 0) {
      return {
        subtotal: 0,
        shipping: 0,
        tax: 0,
        total: 0
      }
    }

    // Calculate subtotal from individual items
    const subtotal = cartItems.reduce((total, item) => {
      const price = item.product?.price || item.price || 0
      const quantity = item.quantity || 1
      return total + (price * quantity)
    }, 0)

    const shipping = 0 // Free shipping
    const tax = subtotal * 0.1 // 10% tax
    const total = subtotal + shipping + tax

    return {
      subtotal,
      shipping,
      tax,
      total
    }
  }

  const { subtotal, shipping, tax, total } = calculateOrderSummary()

  if (loading) {
    return (
      <div className="App">
        <Header />
        <main className="cart-loading-main">
          <LoadingSpinner text="Loading your cart..." />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="App">
      <Header />
      <main className="cart-main">
        <div className="cart-container">
          <h1 className="cart-title">
            Your Shopping Cart
          </h1>

          {/* Error Message with Retry Option */}
          {error && (
            <div className="cart-error-message">
              <div className="error-content">
                <div className="error-text">
                  <span className="error-icon">⚠️</span>
                  <span className="error-message-text">{error}</span>
                </div>
                <div className="error-actions">
                  <button
                    onClick={handleRetry}
                    className="retry-button"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={clearError}
                    className="close-error-button"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          )}

          {!cartItems || cartItems.length === 0 ? (
            <div className="empty-cart-state">
              <div className="empty-cart-icon">🛒</div>
              <h2 className="empty-cart-title">Your cart is empty</h2>
              <p className="empty-cart-message">
                {error ? 'There was an error loading your cart.' : 'Discover amazing products and add them to your cart!'}
              </p>
              <button
                onClick={error ? handleRetry : handleContinueShopping}
                className="empty-cart-button"
              >
                {error ? 'Try Again' : 'Continue Shopping'}
              </button>
            </div>
          ) : (
            <div className="cart-content-with-summary">
              {/* Cart Items Section */}
              <div className="cart-items-container">
                <div className="cart-header">
                  <h2 className="cart-items-title">
                    Cart Items ({cartItems.length})
                  </h2>
                  <button
                    onClick={handleClearCart}
                    className="clear-cart-button"
                  >
                    <span>🗑️</span>
                    Clear Cart
                  </button>
                </div>

                <div className="cart-items-list">
                  {cartItems.map(item => (
                    <div
                      key={item.id || item.cartItemId}
                      className="cart-item-card"
                    >
                      <img
                        src={item.product?.imageUrl || item.imageUrl || 'https://via.placeholder.com/120x120?text=No+Image'}
                        alt={item.product?.name || item.name}
                        className="cart-item-image"
                      />
                      <div className="cart-item-details">
                        <h3 className="cart-item-title">
                          {item.product?.name || item.name}
                        </h3>
                        <p className="cart-item-price">
                          Unit Price: {formatPrice(item.product?.price || item.price)}
                        </p>
                        <div className="cart-item-controls">
                          <div className="quantity-control">
                            <span className="quantity-label">Quantity:</span>
                            <div className="quantity-selector">
                              <button
                                onClick={() => handleQuantityChange(item.id || item.cartItemId, item.quantity - 1)}
                                disabled={updatingItem === (item.id || item.cartItemId) || item.quantity <= 1}
                                className="quantity-btn minus-btn"
                              >
                                -
                              </button>
                              <span className="quantity-display">
                                {updatingItem === (item.id || item.cartItemId) ? 
                                  <div className="quantity-spinner"></div> : 
                                  item.quantity
                                }
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.id || item.cartItemId, item.quantity + 1)}
                                disabled={updatingItem === (item.id || item.cartItemId)}
                                className="quantity-btn plus-btn"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id || item.cartItemId)}
                            className="remove-item-button"
                          >
                            <span>🗑️</span>
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="cart-item-total">
                        <p className="item-total-price">
                          {formatPrice((item.product?.price || item.price) * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="order-summary-container">
                <h2 className="order-summary-title">
                  Order Summary
                </h2>
                
                <div className="summary-row">
                  <span className="summary-label">
                    Subtotal ({cartItems.length} items):
                  </span>
                  <span className="summary-value">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                
                <div className="summary-row">
                  <span className="summary-label">Shipping:</span>
                  <span className="summary-value free-shipping">FREE</span>
                </div>

                <div className="summary-row">
                  <span className="summary-label">Tax (10%):</span>
                  <span className="summary-value">
                    {formatPrice(tax)}
                  </span>
                </div>
                
                <div className="total-row">
                  <span className="total-label">Total:</span>
                  <span className="total-value">
                    {formatPrice(total)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="checkout-button"
                >
                  🚀 Proceed to Checkout
                </button>

                <button
                  onClick={handleContinueShopping}
                  className="continue-shopping-button"
                >
                  ← Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default UserCartPage