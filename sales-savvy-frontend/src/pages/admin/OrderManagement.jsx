// pages/admin/OrderManagement.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../hooks/useAuth';
import '../../assets/styles/globals.css';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/login');
      return;
    }
    // Simulate loading orders
    setTimeout(() => {
      setOrders([
        {
          id: 'ORD001',
          customer: 'John Doe',
          email: 'john@example.com',
          date: '2024-10-13',
          total: 199.98,
          status: 'pending',
          items: 2,
          paymentStatus: 'paid'
        },
        {
          id: 'ORD002',
          customer: 'Jane Smith',
          email: 'jane@example.com',
          date: '2024-10-12',
          total: 79.99,
          status: 'processing',
          items: 1,
          paymentStatus: 'paid'
        },
        {
          id: 'ORD003',
          customer: 'Bob Wilson',
          email: 'bob@example.com',
          date: '2024-10-11',
          total: 299.97,
          status: 'shipped',
          items: 3,
          paymentStatus: 'paid'
        },
        {
          id: 'ORD004',
          customer: 'Alice Brown',
          email: 'alice@example.com',
          date: '2024-10-10',
          total: 129.99,
          status: 'delivered',
          items: 1,
          paymentStatus: 'paid'
        },
        {
          id: 'ORD005',
          customer: 'Charlie Davis',
          email: 'charlie@example.com',
          date: '2024-10-09',
          total: 59.99,
          status: 'cancelled',
          items: 1,
          paymentStatus: 'refunded'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, [user, isAdmin, navigate]);

  const filteredOrders = orders.filter(order => 
    statusFilter === 'all' || order.status === statusFilter
  );

  const handleViewOrder = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffc107',
      processing: '#17a2b8',
      shipped: '#007bff',
      delivered: '#28a745',
      cancelled: '#dc3545'
    };
    return colors[status] || '#6c757d';
  };

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="App">
      <Header />
      <main className="admin-page">
        <div className="admin-header">
          <h1>Order Management</h1>
          <p>View and process customer orders</p>
        </div>

        <div className="admin-actions">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="admin-content">
          {loading ? (
            <div className="loading">Loading orders...</div>
          ) : (
            <div className="orders-table">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id}>
                      <td>
                        <strong>{order.id}</strong>
                      </td>
                      <td>
                        <div className="customer-info">
                          <strong>{order.customer}</strong>
                          <span>{order.email}</span>
                        </div>
                      </td>
                      <td>{order.date}</td>
                      <td>{order.items} items</td>
                      <td>${order.total}</td>
                      <td>
                        <select 
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                          style={{ borderColor: getStatusColor(order.status) }}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <span className={`payment-status ${order.paymentStatus}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn-primary"
                          onClick={() => handleViewOrder(order.id)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderManagement;