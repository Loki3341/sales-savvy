import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { formatPrice } from '../../utils/helpers'
import '../../assets/styles/order-confirmation.css'

const OrderConfirmationPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    console.log('📍 OrderConfirmationPage mounted')
    console.log('📍 Location state:', location.state)
    
    if (!isAuthenticated) {
      navigate('/login', { 
        state: { from: '/order-confirmation' },
        replace: true
      })
      return
    }

    const orderData = location.state?.order
    
    if (orderData) {
      console.log('✅ Order data received:', orderData)
      console.log('📦 Order items:', orderData.orderItems)
      
      // FIX: Enhanced image URL extraction with better fallbacks
      const processedOrder = {
        ...orderData,
        orderItems: Array.isArray(orderData.orderItems) ? orderData.orderItems.map(item => {
          console.log('🔍 Processing order item:', item)
          
          // FIX: Enhanced image URL extraction from multiple possible sources
          let imageUrl = item.productImageUrl || 
                        item.imageUrl || 
                        item.product?.imageUrl || 
                        item.product?.image || 
                        item.product?.productImageUrl ||
                        null
          
          console.log('🖼️ Extracted image URL:', imageUrl)
          
          // FIX: Handle object-type image URLs
          if (imageUrl && typeof imageUrl === 'object') {
            imageUrl = imageUrl.url || imageUrl.imageUrl || imageUrl.path || null
          }
          
          // FIX: Validate and clean up image URL
          if (!imageUrl || imageUrl === 'null' || imageUrl === 'undefined' || imageUrl === '') {
            console.log('⚠️ No valid image URL found, using placeholder')
            imageUrl = null
          } else {
            // FIX: Ensure URL is properly formatted
            if (!imageUrl.startsWith('http') && !imageUrl.startsWith('/') && !imageUrl.startsWith('data:')) {
              imageUrl = `/${imageUrl}`.replace('//', '/')
            }
            console.log('✅ Final image URL:', imageUrl)
          }
          
          const processedItem = {
            id: item.id || `item-${Math.random()}`,
            product: {
              ...item.product,
              name: item.product?.name || item.productName || 'Product',
              price: item.product?.price || item.price || 0,
              imageUrl: imageUrl,
              description: item.product?.description || ''
            },
            productName: item.productName || item.product?.name || 'Product',
            price: item.price || item.product?.price || 0,
            quantity: item.quantity || 1,
            subtotal: item.subtotal || (item.price || 0) * (item.quantity || 1),
            productImageUrl: imageUrl // FIX: Ensure this is set
          }
          
          console.log('🔄 Processed item:', processedItem)
          return processedItem
        }) : []
      }
      
      console.log('🔄 Processed order with images:', processedOrder)
      setOrder(processedOrder)
      setLoading(false)
    } else {
      console.log('❌ No order data in location state')
      setError('No order information found. Your order was placed successfully but we could not display the confirmation. Please check your order history.')
      setLoading(false)
    }
  }, [isAuthenticated, navigate, location.state])

  if (loading) {
    return (
      <div className="App">
        <Header />
        <div style={{ 
          minHeight: 'calc(100vh - 140px)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <LoadingSpinner text="Loading order confirmation..." />
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="App">
        <Header />
        <main className="order-confirmation-container">
          <div className="error-state">
            <div className="error-icon">❌</div>
            <h2 className="error-title">Order Confirmation Issue</h2>
            <p className="error-message">{error}</p>
            <div className="action-buttons">
              <button
                onClick={() => navigate('/customer-home')}
                className="primary-button"
              >
                Continue Shopping
              </button>
              <Link to="/orders" className="secondary-button">
                View Order History
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }
  
  return (
    <div className="App">
      <Header />
      <main className="order-confirmation-container">
        <div className="confirmation-header">
          <div className="success-icon">✅</div>
          <h1 className="confirmation-title">Order Confirmed!</h1>
          <p className="confirmation-subtitle">
            Thank you for your purchase, {user?.username}! Your order has been successfully placed.
          </p>
          <div className="order-badge">
            Order ID: <strong>{order.orderId}</strong>
          </div>
        </div>

        <div className="confirmation-grid">
          <div className="confirmation-section">
            <h2>📦 Order Details</h2>
            
            <div className="order-info">
              <div className="info-row">
                <span className="info-label">Order ID:</span>
                <span className="info-value">{order.orderId}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Order Date:</span>
                <span className="info-value">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Status:</span>
                <span className={`status-badge status-${order.status?.toLowerCase()}`}>
                  {order.status || 'PENDING'}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Payment Status:</span>
                <span className={`status-badge status-${order.paymentStatus?.toLowerCase()}`}>
                  {order.paymentStatus || 'PENDING'}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Payment Method:</span>
                <span className="info-value">{order.paymentMethod || 'Cash on Delivery'}</span>
              </div>
            </div>
          </div>

          <div className="confirmation-section">
            <h2>🚚 Shipping Information</h2>
            
            <div className="shipping-info">
              <div className="info-row">
                <span className="info-label">Customer:</span>
                <span className="info-value">{user?.username}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{user?.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Shipping Address:</span>
                <span className="info-value address-text">{order.shippingAddress}</span>
              </div>
            </div>
          </div>

          <div className="confirmation-section full-width">
            <h2>🛍️ Order Items ({order.orderItems?.length || 0})</h2>
            
            <div className="order-items-list">
              {order.orderItems && order.orderItems.length > 0 ? (
                order.orderItems.map((item, index) => {
                  console.log('🛍️ Rendering order item:', {
                    productName: item.product?.name,
                    imageUrl: item.productImageUrl,
                    product: item.product
                  })
                  
                  const productName = item.product?.name || item.productName || 'Product'
                  const productPrice = item.price || item.product?.price || 0
                  const quantity = item.quantity || 1
                  const subtotal = item.subtotal || (productPrice * quantity)
                  // FIX: Use the processed image URL from our state
                  const imageUrl = item.productImageUrl || item.product?.imageUrl
                  
                  console.log('🖼️ Final image URL for rendering:', imageUrl)
                  
                  return (
                    <div key={item.id || `order-item-${index}`} className="order-item-card">
                      <div className="item-image-container">
                        {imageUrl ? (
                          <img 
                            src={imageUrl} 
                            alt={productName}
                            className="item-image"
                            onError={(e) => {
                              console.log('❌ Image failed to load:', imageUrl)
                              e.target.style.display = 'none'
                              const placeholder = e.target.nextElementSibling
                              if (placeholder) {
                                placeholder.style.display = 'flex'
                              }
                            }}
                            onLoad={(e) => {
                              console.log('✅ Image loaded successfully:', imageUrl)
                              e.target.style.display = 'block'
                              const placeholder = e.target.nextElementSibling
                              if (placeholder) {
                                placeholder.style.display = 'none'
                              }
                            }}
                          />
                        ) : null}
                        <div 
                          className="image-placeholder" 
                          style={{ display: imageUrl ? 'none' : 'flex' }}
                        >
                          📦
                        </div>
                      </div>
                      <div className="item-details">
                        <h4 className="item-name">{productName}</h4>
                        <p className="item-meta">
                          Quantity: <strong>{quantity}</strong> × <strong>{formatPrice(productPrice)}</strong>
                        </p>
                        {item.product?.description && (
                          <p className="item-description">{item.product.description}</p>
                        )}
                      </div>
                      <div className="item-subtotal">
                        {formatPrice(subtotal)}
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="no-items">
                  <p>No items found in this order.</p>
                </div>
              )}
            </div>
          </div>

          <div className="confirmation-section">
            <h2>💰 Order Summary</h2>
            
            <div className="order-summary">
              <div className="summary-row">
                <span className="summary-label">Subtotal:</span>
                <span className="summary-value">{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Shipping:</span>
                <span className="summary-value free">FREE</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Tax:</span>
                <span className="summary-value">{formatPrice(0)}</span>
              </div>
              <div className="summary-row grand-total">
                <span className="summary-label">Total Amount:</span>
                <span className="summary-value">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          <div className="confirmation-section">
            <h2>📋 What's Next?</h2>
            
            <div className="next-steps">
              <div className="step">
                <div className="step-icon">📧</div>
                <div className="step-content">
                  <h4>Order Confirmation Email</h4>
                  <p>We've sent a confirmation email to {user?.email} with all order details.</p>
                </div>
              </div>
              
              <div className="step">
                <div className="step-icon">🚚</div>
                <div className="step-content">
                  <h4>Shipping Updates</h4>
                  <p>You'll receive shipping updates and tracking information via email.</p>
                </div>
              </div>
              
              <div className="step">
                <div className="step-icon">⏰</div>
                <div className="step-content">
                  <h4>Delivery Time</h4>
                  <p>Expected delivery: 3-5 business days</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="confirmation-actions">
          <button
            onClick={() => navigate('/customer-home')}
            className="primary-button large"
          >
            Continue Shopping
          </button>
          
          <Link to="/orders" className="secondary-button large">
            View All Orders
          </Link>
          
          <button
            onClick={() => window.print()}
            className="outline-button large"
          >
            Print Receipt
          </button>
        </div>

        <div className="support-section">
          <h3>Need Help?</h3>
          <p>
            If you have any questions about your order, please contact our customer support team.
          </p>
          <div className="support-contacts">
            <div className="contact-method">
              <span className="contact-icon">📞</span>
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="contact-method">
              <span className="contact-icon">✉️</span>
              <span>support@sales-savvy.com</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default OrderConfirmationPage