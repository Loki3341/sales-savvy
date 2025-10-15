import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { orderService } from '../../services/orderService';
import { formatPrice } from '../../utils/helpers';
import '../../assets/styles/orders.css';

const OrdersPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/orders' } });
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError('');
        console.log('🔄 Fetching orders for user...');
        
        const ordersData = await orderService.getUserOrders();
        console.log('📦 Received orders data:', ordersData);
        
        if (ordersData && Array.isArray(ordersData)) {
          setOrders(ordersData);
          console.log(`✅ Loaded ${ordersData.length} orders`);
        } else {
          setOrders([]);
          console.log('⚠️ No orders data received');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('❌ Error fetching orders:', err);
        setError('Failed to load orders. Please try again.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, navigate]);

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status?.toLowerCase() === filter.toLowerCase();
  });

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '⏳';
      case 'confirmed': return '✅';
      case 'shipped': return '🚚';
      case 'delivered': return '📦';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'confirmed': return 'status-confirmed';
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'payment-paid';
      case 'pending': return 'payment-pending';
      case 'failed': return 'payment-failed';
      case 'refunded': return 'payment-refunded';
      default: return 'payment-pending';
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await orderService.cancelOrder(orderId);
        // Refresh orders after cancellation
        const updatedOrders = await orderService.getUserOrders();
        setOrders(updatedOrders);
      } catch (error) {
        console.error('Error cancelling order:', error);
        setError('Failed to cancel order. Please try again.');
      }
    }
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
          <LoadingSpinner text="Loading your orders..." />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      <main className="orders-container">
        <div className="orders-header">
          <h1 className="orders-title">My Orders</h1>
          <p className="orders-subtitle">
            View and manage all your orders in one place
          </p>
        </div>

        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {/* Debug Info */}
        <div style={{ 
          background: '#f8f9fa', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '1rem',
          fontSize: '0.9rem',
          border: '1px solid #e9ecef'
        }}>
          <strong>Debug Info:</strong> User: {user?.username} | Orders Found: {orders.length} | Filter: {filter}
        </div>

        {/* Filter Section */}
        <div className="filters-section">
          <h3>Filter by Status:</h3>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              📋 All Orders
            </button>
            <button
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              ⏳ Pending
            </button>
            <button
              className={`filter-btn ${filter === 'confirmed' ? 'active' : ''}`}
              onClick={() => setFilter('confirmed')}
            >
              ✅ Confirmed
            </button>
            <button
              className={`filter-btn ${filter === 'shipped' ? 'active' : ''}`}
              onClick={() => setFilter('shipped')}
            >
              🚚 Shipped
            </button>
            <button
              className={`filter-btn ${filter === 'delivered' ? 'active' : ''}`}
              onClick={() => setFilter('delivered')}
            >
              📦 Delivered
            </button>
            <button
              className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
              onClick={() => setFilter('cancelled')}
            >
              ❌ Cancelled
            </button>
          </div>
        </div>

        {/* Orders Count */}
        <div className="orders-count">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>

        {/* Orders List */}
        <div className="orders-list">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div key={order.orderId || order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3 className="order-id">Order #{order.orderId || order.id}</h3>
                    <p className="order-date">
                      Placed on {new Date(order.createdAt || order.orderDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="order-status">
                    <span className={`status-badge ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)} {order.status || 'PENDING'}
                    </span>
                    <span className={`payment-badge ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus || 'PENDING'}
                    </span>
                  </div>
                </div>

                <div className="order-items-preview">
                  {order.orderItems && order.orderItems.length > 0 ? (
                    <>
                      {order.orderItems.slice(0, 2).map((item, index) => (
                        <div key={index} className="preview-item">
                          <span className="item-name">
                            {item.product?.name || item.productName || 'Product'} × {item.quantity || 1}
                          </span>
                          <span className="item-price">
                            {formatPrice((item.price || item.product?.price || 0) * (item.quantity || 1))}
                          </span>
                        </div>
                      ))}
                      {order.orderItems.length > 2 && (
                        <div className="more-items">
                          +{order.orderItems.length - 2} more items
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="no-items">
                      <p>No items information available</p>
                    </div>
                  )}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    Total: <strong>{formatPrice(order.totalAmount || order.totalPrice || 0)}</strong>
                  </div>
                  <div className="order-actions">
                    <button
                      onClick={() => navigate(`/order-details/${order.orderId || order.id}`)}
                      className="action-btn primary"
                    >
                      View Details
                    </button>
                    {order.status === 'DELIVERED' && (
                      <button className="action-btn secondary">
                        Buy Again
                      </button>
                    )}
                    {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                      <button 
                        onClick={() => handleCancelOrder(order.orderId || order.id)}
                        className="action-btn warning"
                      >
                        Cancel Order
                      </button>
                    )}
                    {order.status === 'DELIVERED' && (
                      <button className="action-btn secondary">
                        Rate & Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-orders">
              <div className="no-orders-icon">📦</div>
              <h3>No orders found</h3>
              <p>
                {filter === 'all' 
                  ? "You haven't placed any orders yet."
                  : `No ${filter} orders found.`
                }
              </p>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="primary-button"
                >
                  View All Orders
                </button>
              )}
              {filter === 'all' && (
                <button
                  onClick={() => navigate('/customer-home')}
                  className="primary-button"
                >
                  Start Shopping
                </button>
              )}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {filteredOrders.length > 0 && (
          <div className="orders-stats">
            <h3>Order Summary</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-info">
                  <div className="stat-number">{orders.length}</div>
                  <div className="stat-label">Total Orders</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <div className="stat-number">
                    {orders.filter(o => o.status === 'DELIVERED').length}
                  </div>
                  <div className="stat-label">Delivered</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🚚</div>
                <div className="stat-info">
                  <div className="stat-number">
                    {orders.filter(o => o.status === 'SHIPPED').length}
                  </div>
                  <div className="stat-label">In Transit</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏳</div>
                <div className="stat-info">
                  <div className="stat-number">
                    {orders.filter(o => o.status === 'PENDING' || o.status === 'CONFIRMED').length}
                  </div>
                  <div className="stat-label">Processing</div>
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

export default OrdersPage;