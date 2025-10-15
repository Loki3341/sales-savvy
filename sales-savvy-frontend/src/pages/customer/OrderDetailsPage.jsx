import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { orderService } from '../../services/orderService';
import { formatPrice } from '../../utils/helpers';
import '../../assets/styles/order-details.css';

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/order-details/${orderId}` } });
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError('');
        console.log('📋 Fetching order details for:', orderId);
        
        const orderData = await orderService.getOrderById(orderId);
        console.log('📦 Received order details:', orderData);
        
        if (orderData) {
          setOrder(orderData);
        } else {
          setError('Order not found');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('❌ Error fetching order details:', err);
        setError('Failed to load order details. Please try again.');
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, isAuthenticated, navigate]);

  const getStatusIcon = (status) => {
    if (!status) return '📋';
    switch (status.toLowerCase()) {
      case 'pending': return '⏳';
      case 'confirmed': return '✅';
      case 'shipped': return '🚚';
      case 'delivered': return '📦';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  const getStatusColor = (status) => {
    if (!status) return 'status-pending';
    switch (status.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'confirmed': return 'status-confirmed';
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  const getPaymentStatusColor = (status) => {
    if (!status) return 'payment-pending';
    switch (status.toLowerCase()) {
      case 'paid': return 'payment-paid';
      case 'pending': return 'payment-pending';
      case 'failed': return 'payment-failed';
      case 'refunded': return 'payment-refunded';
      default: return 'payment-pending';
    }
  };

  const getPaymentMethodText = (method) => {
    if (!method) return 'Not specified';
    switch (method.toLowerCase()) {
      case 'credit_card': return 'Credit Card';
      case 'debit_card': return 'Debit Card';
      case 'paypal': return 'PayPal';
      case 'cash_on_delivery': return 'Cash on Delivery';
      default: return method;
    }
  };

  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await orderService.cancelOrder(orderId);
        // Refresh order details after cancellation
        const updatedOrder = await orderService.getOrderById(orderId);
        setOrder(updatedOrder);
      } catch (error) {
        console.error('Error cancelling order:', error);
        setError('Failed to cancel order. Please try again.');
      }
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      setDownloadingInvoice(true);
      
      // Create invoice content
      const invoiceContent = generateInvoiceContent();
      
      // Create blob and download
      const blob = new Blob([invoiceContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${order?.orderId || order?.id}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setDownloadingInvoice(false);
      
      // Show success message
      alert('Invoice downloaded successfully!');
      
    } catch (error) {
      console.error('Error downloading invoice:', error);
      setError('Failed to download invoice. Please try again.');
      setDownloadingInvoice(false);
    }
  };

  const generateInvoiceContent = () => {
    const orderData = order;
    let content = `INVOICE\n`;
    content += `====================\n\n`;
    content += `Order ID: ${orderData?.orderId || orderData?.id}\n`;
    content += `Order Date: ${new Date(orderData?.createdAt || orderData?.orderDate).toLocaleDateString()}\n`;
    content += `Status: ${orderData?.status || 'PENDING'}\n`;
    content += `Payment Status: ${orderData?.paymentStatus || 'PENDING'}\n\n`;
    
    content += `BILLING INFORMATION\n`;
    content += `====================\n`;
    content += `Customer: ${user?.username || 'Customer'}\n`;
    content += `Email: ${user?.email || 'N/A'}\n`;
    content += `Shipping Address: ${orderData?.shippingAddress || 'N/A'}\n\n`;
    
    content += `ORDER ITEMS\n`;
    content += `====================\n`;
    
    if (orderData?.orderItems && orderData.orderItems.length > 0) {
      orderData.orderItems.forEach((item, index) => {
        const productName = item.productName || item.product?.name || 'Product';
        const price = item.price || item.product?.price || 0;
        const quantity = item.quantity || 1;
        const subtotal = price * quantity;
        
        content += `${index + 1}. ${productName}\n`;
        content += `   Price: ${formatPrice(price)}\n`;
        content += `   Quantity: ${quantity}\n`;
        content += `   Subtotal: ${formatPrice(subtotal)}\n\n`;
      });
    }
    
    content += `ORDER SUMMARY\n`;
    content += `====================\n`;
    content += `Subtotal: ${formatPrice(orderData?.totalAmount || orderData?.totalPrice || 0)}\n`;
    content += `Shipping: FREE\n`;
    content += `Tax: INCLUDED\n`;
    content += `Total: ${formatPrice(orderData?.totalAmount || orderData?.totalPrice || 0)}\n\n`;
    
    content += `Thank you for your purchase!\n`;
    content += `Sales Savvy\n`;
    
    return content;
  };

  const handleContactSupport = () => {
    const subject = `Support Request for Order #${order?.orderId || order?.id}`;
    const body = `Hello Support Team,\n\nI need assistance with my order #${order?.orderId || order?.id}.\n\nOrder Details:\n- Status: ${order?.status || 'PENDING'}\n- Payment Status: ${order?.paymentStatus || 'PENDING'}\n- Order Date: ${new Date(order?.createdAt || order?.orderDate).toLocaleDateString()}\n\nPlease provide assistance with the following issue:\n\n`;
    
    window.location.href = `mailto:support@sales-savvy.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleRateAndReview = () => {
    navigate('/customer-home', { 
      state: { 
        showReviewModal: true,
        orderId: order?.orderId || order?.id 
      } 
    });
  };

  const getEstimatedDelivery = (status) => {
    if (status === 'DELIVERED') return 'Delivered';
    if (status === 'SHIPPED') return '1-2 business days';
    return '3-5 business days';
  };

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
          <LoadingSpinner text="Loading order details..." />
        </div>
        <Footer />
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="App">
        <Header />
        <main className="order-details-container">
          <div className="error-state">
            <div className="error-icon">❌</div>
            <h2>Order Not Found</h2>
            <p>{error}</p>
            <button onClick={() => navigate('/orders')} className="primary-button">
              Back to Orders
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      <main className="order-details-container">
        {/* Header with Back Button */}
        <div className="order-details-header">
          <button onClick={() => navigate('/orders')} className="back-button">
            ← Back to Orders
          </button>
          <h1 className="order-details-title">Order Details</h1>
          <p className="order-details-subtitle">
            Order #{order?.orderId || order?.id}
          </p>
        </div>

        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {order && (
          <div className="order-details-content">
            {/* Order Summary Card */}
            <div className="order-summary-card">
              <div className="order-status-section">
                <div className="status-info">
                  <h3>Order Status</h3>
                  <span className={`status-badge large ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)} {order.status || 'PENDING'}
                  </span>
                </div>
                <div className="payment-info">
                  <h3>Payment Status</h3>
                  <span className={`payment-badge large ${getPaymentStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus || 'PENDING'}
                  </span>
                </div>
                <div className="order-date">
                  <h3>Order Date</h3>
                  <p>{new Date(order.createdAt || order.orderDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
              </div>

              {/* Order Actions */}
              <div className="order-actions-section">
                {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                  <button 
                    onClick={handleCancelOrder}
                    className="action-btn warning"
                    disabled={order.status === 'CANCELLED'}
                  >
                    {order.status === 'CANCELLED' ? 'Order Cancelled' : 'Cancel Order'}
                  </button>
                )}
                {order.status === 'DELIVERED' && (
                  <button 
                    onClick={handleRateAndReview}
                    className="action-btn secondary"
                  >
                    Rate & Review Products
                  </button>
                )}
                <button 
                  onClick={handleDownloadInvoice}
                  className="action-btn primary"
                  disabled={downloadingInvoice}
                >
                  {downloadingInvoice ? 'Downloading...' : 'Download Invoice'}
                </button>
                <button 
                  onClick={handleContactSupport}
                  className="action-btn secondary"
                >
                  Contact Support
                </button>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="order-details-grid">
              {/* Left Column - Order Items */}
              <div className="order-items-section">
                <h3>Order Items ({order.orderItems?.length || 0})</h3>
                <div className="order-items-list">
                  {order.orderItems && order.orderItems.length > 0 ? (
                    order.orderItems.map((item, index) => (
                      <div key={index} className="order-item-card">
                        <div className="item-image">
                          <img 
                            src={item.productImageUrl || item.product?.imageUrl || 'https://via.placeholder.com/80x80?text=No+Image'} 
                            alt={item.productName || item.product?.name || 'Product'}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                            }}
                          />
                        </div>
                        <div className="item-details">
                          <h4 className="item-name">
                            {item.productName || item.product?.name || 'Product'}
                          </h4>
                          <p className="item-price">
                            {formatPrice(item.price || item.product?.price || 0)} each
                          </p>
                          <p className="item-quantity">
                            Quantity: {item.quantity || 1}
                          </p>
                        </div>
                        <div className="item-subtotal">
                          <strong>{formatPrice(
                            item.subtotal || (item.price || item.product?.price || 0) * (item.quantity || 1)
                          )}</strong>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-items">
                      <p>No items information available</p>
                    </div>
                  )}
                </div>

                {/* Order Total */}
                <div className="order-total-section">
                  <div className="total-line">
                    <span>Subtotal:</span>
                    <span>{formatPrice(order.totalAmount || order.totalPrice || 0)}</span>
                  </div>
                  <div className="total-line">
                    <span>Shipping:</span>
                    <span>Free</span>
                  </div>
                  <div className="total-line">
                    <span>Tax:</span>
                    <span>Included</span>
                  </div>
                  <div className="total-line grand-total">
                    <span>Total:</span>
                    <span>{formatPrice(order.totalAmount || order.totalPrice || 0)}</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Shipping and Payment Info */}
              <div className="order-info-section">
                {/* Shipping Information */}
                <div className="info-card">
                  <h3>Shipping Information</h3>
                  <div className="info-content">
                    <p><strong>Address:</strong></p>
                    <p className="shipping-address">
                      {order.shippingAddress || 'No shipping address provided'}
                    </p>
                    <p><strong>Shipping Method:</strong> Standard Delivery</p>
                    <p><strong>Estimated Delivery:</strong> 
                      {getEstimatedDelivery(order.status)}
                    </p>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="info-card">
                  <h3>Payment Information</h3>
                  <div className="info-content">
                    <p><strong>Payment Method:</strong></p>
                    <p>{getPaymentMethodText(order.paymentMethod)}</p>
                    <p><strong>Payment Status:</strong></p>
                    <span className={`payment-badge ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus || 'PENDING'}
                    </span>
                  </div>
                </div>

                {/* Order Timeline */}
                <div className="info-card">
                  <h3>Order Timeline</h3>
                  <div className="timeline">
                    <div className={`timeline-item ${['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'].includes(order.status) ? 'completed' : ''}`}>
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <strong>Order Placed</strong>
                        <span>Order received and confirmed</span>
                      </div>
                    </div>
                    <div className={`timeline-item ${['CONFIRMED', 'SHIPPED', 'DELIVERED'].includes(order.status) ? 'completed' : ''}`}>
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <strong>Order Confirmed</strong>
                        <span>Payment verified and processing</span>
                      </div>
                    </div>
                    <div className={`timeline-item ${['SHIPPED', 'DELIVERED'].includes(order.status) ? 'completed' : ''}`}>
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <strong>Shipped</strong>
                        <span>Order dispatched for delivery</span>
                      </div>
                    </div>
                    <div className={`timeline-item ${order.status === 'DELIVERED' ? 'completed' : ''}`}>
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <strong>Delivered</strong>
                        <span>Order delivered successfully</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default OrderDetailsPage;