import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Header from '../../components/layout/Header'; // ADD HEADER IMPORT
import Footer from '../../components/layout/Footer'; // ADD FOOTER IMPORT
import './UserSettingsPage.css';

const UserSettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: '',
    notifications: true,
    newsletter: false,
    securityAlerts: true
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log('Saving settings:', formData);
    // Add your save logic here
    alert('Settings saved successfully!');
  };

  return (
    <div className="page-wrapper">
      {/* ADD HEADER COMPONENT */}
      <Header />
      
      <main className="main-content">
        <div className="user-settings-page">
          <div className="settings-container">
            <div className="settings-header">
              <h1>Account Settings</h1>
              <p>Manage your account preferences and personal information</p>
            </div>

            <div className="settings-layout">
              {/* Mobile Tab Navigation */}
              <div className="mobile-tabs">
                <button 
                  className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  👤 Profile
                </button>
                <button 
                  className={`tab-button ${activeTab === 'preferences' ? 'active' : ''}`}
                  onClick={() => setActiveTab('preferences')}
                >
                  ⚙️ Preferences
                </button>
                <button 
                  className={`tab-button ${activeTab === 'security' ? 'active' : ''}`}
                  onClick={() => setActiveTab('security')}
                >
                  🔒 Security
                </button>
              </div>

              {/* Desktop Sidebar */}
              <div className="settings-sidebar">
                <div className="sidebar-section">
                  <h3>Settings</h3>
                  <nav className="sidebar-nav">
                    <button 
                      className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                      onClick={() => setActiveTab('profile')}
                    >
                      <span className="nav-icon">👤</span>
                      <span>Profile</span>
                    </button>
                    <button 
                      className={`nav-item ${activeTab === 'preferences' ? 'active' : ''}`}
                      onClick={() => setActiveTab('preferences')}
                    >
                      <span className="nav-icon">⚙️</span>
                      <span>Preferences</span>
                    </button>
                    <button 
                      className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
                      onClick={() => setActiveTab('security')}
                    >
                      <span className="nav-icon">🔒</span>
                      <span>Security</span>
                    </button>
                  </nav>
                </div>

                <div className="user-info-card">
                  <div className="user-avatar-large">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="user-details">
                    <div className="user-name">{user?.username || 'Guest'}</div>
                    <div className="user-email">{user?.email || 'No email'}</div>
                    <div className="user-role">{user?.role || 'User'}</div>
                  </div>
                </div>
              </div>

              {/* Settings Content */}
              <div className="settings-content">
                <form onSubmit={handleSave}>
                  {/* Profile Tab */}
                  {activeTab === 'profile' && (
                    <div className="tab-content">
                      <div className="content-header">
                        <h2>Profile Information</h2>
                        <p>Update your personal details</p>
                      </div>
                      
                      <div className="settings-card">
                        <div className="form-group">
                          <label htmlFor="username">Username</label>
                          <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="Enter your username"
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="email">Email Address</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="phone">Phone Number</label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Enter your phone number"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Preferences Tab */}
                  {activeTab === 'preferences' && (
                    <div className="tab-content">
                      <div className="content-header">
                        <h2>Notification Preferences</h2>
                        <p>Choose how you want to be notified</p>
                      </div>
                      
                      <div className="settings-card">
                        <div className="preference-item">
                          <div className="preference-info">
                            <label htmlFor="notifications">Email Notifications</label>
                            <p>Receive updates about your orders and account</p>
                          </div>
                          <div className="toggle-switch">
                            <input
                              type="checkbox"
                              id="notifications"
                              name="notifications"
                              checked={formData.notifications}
                              onChange={handleInputChange}
                            />
                            <span className="slider"></span>
                          </div>
                        </div>

                        <div className="preference-item">
                          <div className="preference-info">
                            <label htmlFor="newsletter">Marketing Newsletter</label>
                            <p>Get the latest news and promotions</p>
                          </div>
                          <div className="toggle-switch">
                            <input
                              type="checkbox"
                              id="newsletter"
                              name="newsletter"
                              checked={formData.newsletter}
                              onChange={handleInputChange}
                            />
                            <span className="slider"></span>
                          </div>
                        </div>

                        <div className="preference-item">
                          <div className="preference-info">
                            <label htmlFor="securityAlerts">Security Alerts</label>
                            <p>Important notifications about your account security</p>
                          </div>
                          <div className="toggle-switch">
                            <input
                              type="checkbox"
                              id="securityAlerts"
                              name="securityAlerts"
                              checked={formData.securityAlerts}
                              onChange={handleInputChange}
                            />
                            <span className="slider"></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Security Tab */}
                  {activeTab === 'security' && (
                    <div className="tab-content">
                      <div className="content-header">
                        <h2>Security Settings</h2>
                        <p>Manage your account security</p>
                      </div>
                      
                      <div className="settings-card">
                        <div className="security-item">
                          <div className="security-info">
                            <h4>Change Password</h4>
                            <p>Update your password regularly to keep your account secure</p>
                          </div>
                          <button type="button" className="change-password-btn">
                            Change Password
                          </button>
                        </div>

                        <div className="security-item">
                          <div className="security-info">
                            <h4>Two-Factor Authentication</h4>
                            <p>Add an extra layer of security to your account</p>
                          </div>
                          <button type="button" className="enable-2fa-btn">
                            Enable 2FA
                          </button>
                        </div>

                        <div className="security-item">
                          <div className="security-info">
                            <h4>Login Activity</h4>
                            <p>Review recent login attempts on your account</p>
                          </div>
                          <button type="button" className="view-activity-btn">
                            View Activity
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Save Button */}
                  <div className="settings-actions">
                    <button type="submit" className="save-btn">
                      Save Changes
                    </button>
                    <button type="button" className="cancel-btn">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ADD FOOTER COMPONENT */}
      <Footer />
    </div>
  );
};

export default UserSettingsPage;