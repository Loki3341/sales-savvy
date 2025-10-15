// pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import { useAdmin } from '../../hooks/useAdmin'
import { useAuth } from '../../hooks/useAuth'
import '../../assets/styles/globals.css'

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const { dashboardStats, refreshData } = useAdmin()
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()

  // Redirect if not admin
  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    
    if (!isAdmin) {
      navigate('/')
      return
    }
  }, [user, isAdmin, navigate])

  const dashboardCards = [
    {
      id: 1,
      title: 'Manage Products',
      description: 'Add, edit, or remove products from your inventory',
      icon: '📦',
      action: () => navigate('/admin/products')
    },
    {
      id: 2,
      title: 'Category Management',
      description: 'Organize products into categories and subcategories',
      icon: '📑',
      action: () => navigate('/admin/categories')
    },
    {
      id: 3,
      title: 'User Management',
      description: 'Manage user accounts and permissions',
      icon: '👥',
      action: () => navigate('/admin/users')
    },
    {
      id: 4,
      title: 'Order Management',
      description: 'View and process customer orders',
      icon: '📋',
      action: () => navigate('/admin/orders')
    },
    {
      id: 5,
      title: 'Analytics',
      description: 'View sales reports and business insights',
      icon: '📊',
      action: () => navigate('/admin/analytics')
    },
    {
      id: 6,
      title: 'Settings',
      description: 'Configure store settings and preferences',
      icon: '⚙️',
      action: () => navigate('/admin/settings')
    }
  ]

  const filteredCards = dashboardCards.filter(card =>
    card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleRefresh = async () => {
    await refreshData()
  }

  const handleAddProduct = () => {
    navigate('/admin/products/new')
  }

  const handleViewOrders = () => {
    navigate('/admin/orders')
  }

  const handleGenerateReport = () => {
    alert('Report generation feature coming soon!')
  }

  // Format currency in Indian Rupees
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  if (!user || !isAdmin) {
    return (
      <div className="App">
        <Header />
        <main className="admin-dashboard">
          <div className="dashboard-header">
            <h1>Access Denied</h1>
            <p>You do not have permission to access the admin dashboard.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="App">
      <Header />
      <main className="admin-dashboard">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <h1>Sales Savvy</h1>
          <p>Welcome, {user.username || 'Admin'}! Manage your store efficiently.</p>
          {dashboardStats.isFallback && (
            <div className="fallback-warning">
              ⚠️ Showing sample data - Connect to backend for real statistics
            </div>
          )}
          {dashboardStats.error && (
            <div className="error-warning">
              ❌ Error: {dashboardStats.error}
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="admin-search">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search management options..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="stats-overview">
          {dashboardStats.loading ? (
            <>
              <div className="stat-card loading">
                <h3>TOTAL PRODUCTS</h3>
                <p className="stat-number">--</p>
              </div>
              <div className="stat-card loading">
                <h3>TOTAL USERS</h3>
                <p className="stat-number">--</p>
              </div>
              <div className="stat-card loading">
                <h3>PENDING ORDERS</h3>
                <p className="stat-number">--</p>
              </div>
              <div className="stat-card loading">
                <h3>REVENUE</h3>
                <p className="stat-number">--</p>
              </div>
            </>
          ) : (
            <>
              <div className="stat-card">
                <h3>TOTAL PRODUCTS</h3>
                <p className="stat-number">{dashboardStats.totalProducts.toLocaleString()}</p>
                {dashboardStats.isFallback && <div className="fallback-badge">Sample</div>}
              </div>
              <div className="stat-card">
                <h3>TOTAL USERS</h3>
                <p className="stat-number">{dashboardStats.totalUsers.toLocaleString()}</p>
                {dashboardStats.isFallback && <div className="fallback-badge">Sample</div>}
              </div>
              <div className="stat-card">
                <h3>PENDING ORDERS</h3>
                <p className="stat-number">{dashboardStats.pendingOrders.toLocaleString()}</p>
                {dashboardStats.isFallback && <div className="fallback-badge">Sample</div>}
              </div>
              <div className="stat-card">
                <h3>REVENUE</h3>
                <p className="stat-number">{formatCurrency(dashboardStats.revenue)}</p>
                {dashboardStats.isFallback && <div className="fallback-badge">Sample</div>}
              </div>
            </>
          )}
        </div>

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          {filteredCards.map(card => (
            <div 
              key={card.id} 
              className="dashboard-card" 
              onClick={card.action}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && card.action()}
            >
              <div className="card-icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <button className="card-button">Manage</button>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button 
              className="action-button primary" 
              onClick={handleAddProduct}
            >
              Add New Product
            </button>
            <button 
              className="action-button secondary" 
              onClick={handleViewOrders}
            >
              View Recent Orders
            </button>
            <button 
              className="action-button secondary" 
              onClick={handleGenerateReport}
            >
              Generate Report
            </button>
            <button 
              className="action-button secondary" 
              onClick={handleRefresh}
              disabled={dashboardStats.loading}
            >
              {dashboardStats.loading ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default AdminDashboard