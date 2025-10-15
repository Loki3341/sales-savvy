import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'
import { useOrder } from '../../hooks/useOrder'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import PaymentMethod from '../../components/common/PaymentMethod'
import { formatPrice } from '../../utils/helpers'
import { PAYMENT_METHODS } from '../../utils/constants'
import '../../assets/styles/checkout.css'

const CheckoutPage = () => {
  const { cartItems, cartTotal, loading: cartLoading, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const { createOrder, loading: orderLoading, error, clearError } = useOrder()
  const navigate = useNavigate()
  
  const [checkoutData, setCheckoutData] = useState({
    shippingAddress: '',
    paymentMethod: PAYMENT_METHODS.COD,
    paymentDetails: {}
  })
  const [processing, setProcessing] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } })
      return
    }

    if (user?.address) {
      setCheckoutData(prev => ({
        ...prev,
        shippingAddress: user.address
      }))
    }
  }, [user, isAuthenticated, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCheckoutData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handlePaymentMethodChange = (method) => {
    setCheckoutData(prev => ({
      ...prev,
      paymentMethod: method,
      paymentDetails: {}
    }))
  }

  const handlePaymentDetailsChange = (method, field, value) => {
    setCheckoutData(prev => ({
      ...prev,
      paymentDetails: {
        ...prev.paymentDetails,
        [field]: value
      }
    }))
  }

  const validateForm = () => {
    const errors = {}
    
    if (!checkoutData.shippingAddress.trim()) {
      errors.shippingAddress = 'Shipping address is required'
    }
    
    if (checkoutData.paymentMethod === PAYMENT_METHODS.CARD) {
      if (!checkoutData.paymentDetails.cardNumber) {
        errors.cardNumber = 'Card number is required'
      }
      if (!checkoutData.paymentDetails.expiryDate) {
        errors.expiryDate = 'Expiry date is required'
      }
      if (!checkoutData.paymentDetails.cvv) {
        errors.cvv = 'CVV is required'
      }
      if (!checkoutData.paymentDetails.nameOnCard) {
        errors.nameOnCard = 'Name on card is required'
      }
    }
    
    if (checkoutData.paymentMethod === PAYMENT_METHODS.UPI && !checkoutData.paymentDetails.upiId) {
      errors.upiId = 'UPI ID is required'
    }
    
    if (checkoutData.paymentMethod === PAYMENT_METHODS.WALLET) {
      if (!checkoutData.paymentDetails.walletType) {
        errors.walletType = 'Wallet type is required'
      }
      if (!checkoutData.paymentDetails.mobileNumber) {
        errors.mobileNumber = 'Mobile number is required'
      }
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handlePlaceOrder = async () => {
    if (!isAuthenticated || !user) {
      navigate('/login', { state: { from: '/checkout' } })
      return
    }

    if (!validateForm()) {
      return
    }

    setProcessing(true)
    clearError()

    try {
      const orderResult = await createOrder(checkoutData)
      
      if (!orderResult) {
        throw new Error('No response received from order creation')
      }
      
      if (!orderResult.success) {
        throw new Error(orderResult.error || 'Order creation failed')
      }

      if (!orderResult.order) {
        throw new Error('Order data is missing from response')
      }
      
      // Clear cart after successful order
      await clearCart()
      
      // Navigate to confirmation with order data
      navigate('/order-confirmation', { 
        state: { 
          order: orderResult.order,
          message: 'Order placed successfully!' 
        }
      })
      
    } catch (error) {
      console.error('Checkout failed:', error)
    } finally {
      setProcessing(false)
    }
  }

  const isLoading = cartLoading || orderLoading || processing

  if (cartLoading || !user) {
    return (
      <div className="App">
        <Header />
        <div style={{ minHeight: 'calc(100vh - 140px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LoadingSpinner text="Loading checkout..." />
        </div>
        <Footer />
      </div>
    )
  }

  if (cartItems.length === 0 && !cartLoading) {
    return (
      <div className="App">
        <Header />
        <main className="checkout-container">
          <div className="empty-cart-state">
            <div className="empty-cart-icon">🛒</div>
            <h2 className="empty-cart-title">Your cart is empty</h2>
            <p className="empty-cart-message">
              Add some amazing products to your cart before checking out!
            </p>
            <button
              onClick={() => navigate('/customer-home')}
              className="checkout-button"
              style={{ maxWidth: '200px', margin: '0 auto' }}
            >
              Continue Shopping
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="App">
      <Header />
      <main className="checkout-container">
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '3rem', 
          color: '#2c3e50',
          fontSize: '2.5rem',
          fontWeight: '700'
        }}>
          Secure Checkout
        </h1>
        
        {error && (
          <div className="checkout-message checkout-error">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>⚠️ {error}</span>
              <button
                onClick={clearError}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  padding: '0 0.5rem'
                }}
              >
                ×
              </button>
            </div>
          </div>
        )}

        <div className="checkout-grid">
          <div>
            <div className="checkout-section">
              <h2>🚚 Shipping Information</h2>
              
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  value={user?.username || ''}
                  className="form-input"
                  disabled
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  className="form-input"
                  disabled
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Shipping Address *</label>
                <textarea
                  name="shippingAddress"
                  value={checkoutData.shippingAddress}
                  onChange={handleInputChange}
                  placeholder="Enter your complete shipping address including street, city, state, and PIN code"
                  className="form-textarea"
                  rows="4"
                  style={{ 
                    borderColor: validationErrors.shippingAddress ? '#e74c3c' : '#e0e0e0'
                  }}
                />
                {validationErrors.shippingAddress && (
                  <span style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    {validationErrors.shippingAddress}
                  </span>
                )}
              </div>

              <div className="trust-indicators">
                <div className="trust-indicator">
                  <div className="trust-icon">🔒</div>
                  <span className="trust-text">Secure Payment</span>
                </div>
                <div className="trust-indicator">
                  <div className="trust-icon">🚚</div>
                  <span className="trust-text">Free Shipping</span>
                </div>
                <div className="trust-indicator">
                  <div className="trust-icon">↩️</div>
                  <span className="trust-text">Easy Returns</span>
                </div>
              </div>
            </div>

            <div className="checkout-section">
              <h2>💳 Payment Method</h2>
              <PaymentMethod
                selectedMethod={checkoutData.paymentMethod}
                onMethodChange={handlePaymentMethodChange}
                showDetails={true}
                onDetailsChange={handlePaymentDetailsChange}
              />
            </div>
          </div>

          <div>
            <div className="order-summary">
              <h2>📦 Order Summary</h2>
              
              <div className="order-items">
                {cartItems.map(item => (
                  <div key={item.id} className="order-item">
                    <div className="order-item-info">
                      <h4>{item.product?.name || item.name}</h4>
                      <p className="order-item-meta">
                        Qty: {item.quantity} × {formatPrice(item.product?.price || item.price)}
                      </p>
                    </div>
                    <div className="order-item-price">
                      {formatPrice((item.product?.price || item.price) * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-totals">
                <div className="order-total-row">
                  <span className="order-total-label">Subtotal:</span>
                  <span className="order-total-value">{formatPrice(cartTotal)}</span>
                </div>
                <div className="order-total-row">
                  <span className="order-total-label">Shipping:</span>
                  <span className="order-total-value" style={{ color: '#27ae60' }}>FREE</span>
                </div>
                <div className="order-total-row">
                  <span className="order-total-label">Tax:</span>
                  <span className="order-total-value">{formatPrice(0)}</span>
                </div>
                <div className="order-grand-total">
                  <span className="order-total-label">Total:</span>
                  <span className="order-total-value">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isLoading}
                className="checkout-button"
              >
                {isLoading ? (
                  <div className="checkout-loading">
                    <div className="loading-spinner"></div>
                    Processing...
                  </div>
                ) : (
                  `Place Order • ${formatPrice(cartTotal)}`
                )}
              </button>

              <button
                onClick={() => navigate('/cart')}
                className="secondary-button"
              >
                ← Back to Cart
              </button>

              <div className="security-badges">
                <div className="security-badge">
                  <span>🔒</span>
                  <span>SSL Secure</span>
                </div>
                <div className="security-badge">
                  <span>🛡️</span>
                  <span>PCI Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default CheckoutPage