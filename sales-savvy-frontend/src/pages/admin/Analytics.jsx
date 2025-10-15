// pages/admin/Analytics.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../hooks/useAuth';
import '../../assets/styles/globals.css';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({});
  const [timeRange, setTimeRange] = useState('7days');
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/login');
      return;
    }
    // Simulate loading analytics
    setTimeout(() => {
      setAnalytics({
        salesData: [
          { date: '10-07', sales: 1200 },
          { date: '10-08', sales: 1800 },
          { date: '10-09', sales: 1500 },
          { date: '10-10', sales: 2200 },
          { date: '10-11', sales: 1900 },
          { date: '10-12', sales: 2500 },
          { date: '10-13', sales: 2100 }
        ],
        topProducts: [
          { name: 'Wireless Headphones', sales: 45, revenue: 4499.55 },
          { name: 'Running Shoes', sales: 32, revenue: 4159.68 },
          { name: 'Coffee Maker', sales: 28, revenue: 2239.72 },
          { name: 'Smart Watch', sales: 25, revenue: 3749.75 },
          { name: 'Backpack', sales: 22, revenue: 1099.78 }
        ],
        customerStats: {
          totalCustomers: 89,
          newThisMonth: 12,
          returningRate: '68%'
        },
        revenueStats: {
          totalRevenue: 15748.48,
          averageOrder: 124.75,
          growth: '+12.5%'
        }
      });
      setLoading(false);
    }, 1500);
  }, [user, isAdmin, navigate, timeRange]);

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="App">
      <Header />
      <main className="admin-page">
        <div className="admin-header">
          <h1>Analytics Dashboard</h1>
          <p>Sales reports and business insights</p>
        </div>

        <div className="admin-actions">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
        </div>

        <div className="admin-content">
          {loading ? (
            <div className="loading">Loading analytics...</div>
          ) : (
            <>
              {/* Overview Cards */}
              <div className="analytics-overview">
                <div className="stat-card">
                  <h3>Total Revenue</h3>
                  <p className="stat-number">${analytics.revenueStats?.totalRevenue?.toLocaleString()}</p>
                  <span className="stat-growth positive">{analytics.revenueStats?.growth}</span>
                </div>
                <div className="stat-card">
                  <h3>Average Order</h3>
                  <p className="stat-number">${analytics.revenueStats?.averageOrder}</p>
                </div>
                <div className="stat-card">
                  <h3>Total Customers</h3>
                  <p className="stat-number">{analytics.customerStats?.totalCustomers}</p>
                </div>
                <div className="stat-card">
                  <h3>Returning Rate</h3>
                  <p className="stat-number">{analytics.customerStats?.returningRate}</p>
                </div>
              </div>

              {/* Sales Chart */}
              <div className="analytics-section">
                <h3>Sales Overview</h3>
                <div className="sales-chart">
                  {analytics.salesData?.map((day, index) => (
                    <div key={index} className="chart-bar">
                      <div 
                        className="bar-fill"
                        style={{ height: `${(day.sales / 3000) * 100}%` }}
                      ></div>
                      <span className="bar-label">{day.date}</span>
                      <span className="bar-value">${day.sales}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Products */}
              <div className="analytics-section">
                <h3>Top Selling Products</h3>
                <div className="top-products">
                  {analytics.topProducts?.map((product, index) => (
                    <div key={index} className="product-row">
                      <span className="rank">#{index + 1}</span>
                      <span className="product-name">{product.name}</span>
                      <span className="sales">{product.sales} sold</span>
                      <span className="revenue">${product.revenue}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Export Options */}
              <div className="analytics-actions">
                <button className="btn-primary">Export Report</button>
                <button className="btn-secondary">Generate PDF</button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Analytics;