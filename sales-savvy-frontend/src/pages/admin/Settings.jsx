// pages/admin/Settings.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../hooks/useAuth';
import '../../assets/styles/globals.css';

const Settings = () => {
  const [settings, setSettings] = useState({});
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/login');
      return;
    }
    // Simulate loading settings
    setTimeout(() => {
      setSettings({
        general: {
          storeName: 'Sales Savvy',
          storeEmail: 'admin@sales-savvy.com',
          currency: 'USD',
          timezone: 'UTC-5',
          maintenanceMode: false
        },
        payment: {
          stripeEnabled: true,
          paypalEnabled: true,
          cashOnDelivery: true,
          testMode: true
        },
        shipping: {
          freeShippingThreshold: 50,
          shippingCost: 5.99,
          handlingFee: 2.50,
          estimatedDelivery: '3-5 business days'
        },
        notifications: {
          emailNotifications: true,
          lowStockAlerts: true,
          newOrderAlerts: true,
          salesReports: true
        }
      });
      setLoading(false);
    }, 1000);
  }, [user, isAdmin, navigate]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="App">
      <Header />
      <main className="admin-page">
        <div className="admin-header">
          <h1>Store Settings</h1>
          <p>Configure store settings and preferences</p>
        </div>

        <div className="settings-container">
          <div className="settings-sidebar">
            <button 
              className={`tab-button ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              General
            </button>
            <button 
              className={`tab-button ${activeTab === 'payment' ? 'active' : ''}`}
              onClick={() => setActiveTab('payment')}
            >
              Payment
            </button>
            <button 
              className={`tab-button ${activeTab === 'shipping' ? 'active' : ''}`}
              onClick={() => setActiveTab('shipping')}
            >
              Shipping
            </button>
            <button 
              className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              Notifications
            </button>
          </div>

          <div className="settings-content">
            {loading ? (
              <div className="loading">Loading settings...</div>
            ) : (
              <form onSubmit={handleSaveSettings}>
                {activeTab === 'general' && (
                  <div className="settings-section">
                    <h3>General Settings</h3>
                    <div className="form-group">
                      <label>Store Name</label>
                      <input
                        type="text"
                        value={settings.general?.storeName || ''}
                        onChange={(e) => handleInputChange('general', 'storeName', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Store Email</label>
                      <input
                        type="email"
                        value={settings.general?.storeEmail || ''}
                        onChange={(e) => handleInputChange('general', 'storeEmail', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Currency</label>
                      <select
                        value={settings.general?.currency || 'USD'}
                        onChange={(e) => handleInputChange('general', 'currency', e.target.value)}
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="INR">INR (₹)</option>
                      </select>
                    </div>
                    <div className="form-group checkbox-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={settings.general?.maintenanceMode || false}
                          onChange={(e) => handleInputChange('general', 'maintenanceMode', e.target.checked)}
                        />
                        Enable Maintenance Mode
                      </label>
                    </div>
                  </div>
                )}

                {activeTab === 'payment' && (
                  <div className="settings-section">
                    <h3>Payment Settings</h3>
                    <div className="form-group checkbox-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={settings.payment?.stripeEnabled || false}
                          onChange={(e) => handleInputChange('payment', 'stripeEnabled', e.target.checked)}
                        />
                        Enable Stripe Payments
                      </label>
                    </div>
                    <div className="form-group checkbox-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={settings.payment?.paypalEnabled || false}
                          onChange={(e) => handleInputChange('payment', 'paypalEnabled', e.target.checked)}
                        />
                        Enable PayPal
                      </label>
                    </div>
                    <div className="form-group checkbox-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={settings.payment?.cashOnDelivery || false}
                          onChange={(e) => handleInputChange('payment', 'cashOnDelivery', e.target.checked)}
                        />
                        Enable Cash on Delivery
                      </label>
                    </div>
                    <div className="form-group checkbox-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={settings.payment?.testMode || false}
                          onChange={(e) => handleInputChange('payment', 'testMode', e.target.checked)}
                        />
                        Test Mode
                      </label>
                    </div>
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="settings-section">
                    <h3>Shipping Settings</h3>
                    <div className="form-group">
                      <label>Free Shipping Threshold ($)</label>
                      <input
                        type="number"
                        value={settings.shipping?.freeShippingThreshold || 0}
                        onChange={(e) => handleInputChange('shipping', 'freeShippingThreshold', parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="form-group">
                      <label>Standard Shipping Cost ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={settings.shipping?.shippingCost || 0}
                        onChange={(e) => handleInputChange('shipping', 'shippingCost', parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="form-group">
                      <label>Handling Fee ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={settings.shipping?.handlingFee || 0}
                        onChange={(e) => handleInputChange('shipping', 'handlingFee', parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="form-group">
                      <label>Estimated Delivery</label>
                      <input
                        type="text"
                        value={settings.shipping?.estimatedDelivery || ''}
                        onChange={(e) => handleInputChange('shipping', 'estimatedDelivery', e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="settings-section">
                    <h3>Notification Settings</h3>
                    <div className="form-group checkbox-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={settings.notifications?.emailNotifications || false}
                          onChange={(e) => handleInputChange('notifications', 'emailNotifications', e.target.checked)}
                        />
                        Email Notifications
                      </label>
                    </div>
                    <div className="form-group checkbox-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={settings.notifications?.lowStockAlerts || false}
                          onChange={(e) => handleInputChange('notifications', 'lowStockAlerts', e.target.checked)}
                        />
                        Low Stock Alerts
                      </label>
                    </div>
                    <div className="form-group checkbox-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={settings.notifications?.newOrderAlerts || false}
                          onChange={(e) => handleInputChange('notifications', 'newOrderAlerts', e.target.checked)}
                        />
                        New Order Alerts
                      </label>
                    </div>
                    <div className="form-group checkbox-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={settings.notifications?.salesReports || false}
                          onChange={(e) => handleInputChange('notifications', 'salesReports', e.target.checked)}
                        />
                        Daily Sales Reports
                      </label>
                    </div>
                  </div>
                )}

                <div className="settings-actions">
                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Settings'}
                  </button>
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => window.location.reload()}
                  >
                    Reset
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Settings;