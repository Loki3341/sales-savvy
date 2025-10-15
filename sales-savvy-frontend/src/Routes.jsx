import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import LoginPage from './pages/auth/LoginPage'
import RegistrationPage from './pages/auth/RegistrationPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import CustomerHome from './pages/customer/CustomerHome'
import UserCartPage from './pages/customer/UserCartPage'
import ProductDetailPage from './pages/customer/ProductDetailPage'
import CheckoutPage from './pages/customer/CheckoutPage'
import OrderConfirmationPage from './pages/customer/OrderConfirmationPage'
import OrdersPage from './pages/customer/OrdersPage'
import OrderDetailsPage from './pages/customer/OrderDetailsPage'
import AdminDashboard from './pages/admin/AdminDashboard'

// Import new admin management pages
import ProductManagement from './pages/admin/ProductManagement'
import CategoryManagement from './pages/admin/CategoryManagement'
import UserManagement from './pages/admin/UserManagement'
import OrderManagement from './pages/admin/OrderManagement'
import Analytics from './pages/admin/Analytics'
import Settings from './pages/admin/Settings'

// Import new common pages
import AboutUsPage from './pages/common/AboutUsPage'
import ContactPage from './pages/common/ContactPage'
import SupportPage from './pages/common/SupportPage'
import TermsOfServicePage from './pages/common/TermsOfServicePage'
import PrivacyPolicyPage from './pages/common/PrivacyPolicyPage'
import ReturnPolicyPage from './pages/common/ReturnPolicyPage'
import SitemapPage from './pages/common/SitemapPage'
import AccessibilityPage from './pages/common/AccessibilityPage'
import UserSettingsPage from './pages/common/UserSettingsPage' // ADD THIS IMPORT

// Import new customer pages
import ProfilePage from './pages/customer/ProfilePage'

const ProtectedAdminRoute = ({ children }) => {
  const { user } = useAuth()
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  if (user.role !== 'admin' && user.role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }
  
  return children
}

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

const AppRoutes = () => {
  return (
    <Routes>
      {/* Authentication Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Customer Routes */}
      <Route path="/" element={<CustomerHome />} />
      <Route path="/customer-home" element={<CustomerHome />} />
      <Route path="/cart" element={<UserCartPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/order-details/:orderId" element={<OrderDetailsPage />} />
      
      {/* Protected Customer Routes */}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />
      
      {/* ADD USER SETTINGS ROUTE */}
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <UserSettingsPage />
          </ProtectedRoute>
        } 
      />

      {/* Information Pages (Public) */}
      <Route path="/about" element={<AboutUsPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/terms" element={<TermsOfServicePage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/returns" element={<ReturnPolicyPage />} />
      <Route path="/sitemap" element={<SitemapPage />} />
      <Route path="/accessibility" element={<AccessibilityPage />} />
      
      {/* Admin Routes */}
      <Route 
        path="/admin-dashboard" 
        element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        } 
      />
      
      {/* New Admin Management Routes */}
      <Route 
        path="/admin/products" 
        element={
          <ProtectedAdminRoute>
            <ProductManagement />
          </ProtectedAdminRoute>
        } 
      />
      
      <Route 
        path="/admin/categories" 
        element={
          <ProtectedAdminRoute>
            <CategoryManagement />
          </ProtectedAdminRoute>
        } 
      />
      
      <Route 
        path="/admin/users" 
        element={
          <ProtectedAdminRoute>
            <UserManagement />
          </ProtectedAdminRoute>
        } 
      />
      
      <Route 
        path="/admin/orders" 
        element={
          <ProtectedAdminRoute>
            <OrderManagement />
          </ProtectedAdminRoute>
        } 
      />
      
      <Route 
        path="/admin/analytics" 
        element={
          <ProtectedAdminRoute>
            <Analytics />
          </ProtectedAdminRoute>
        } 
      />
      
      <Route 
        path="/admin/settings" 
        element={
          <ProtectedAdminRoute>
            <Settings />
          </ProtectedAdminRoute>
        } 
      />

      {/* 404 Page */}
      <Route path="*" element={
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h2>Page Not Found</h2>
          <p>The page you are looking for does not exist.</p>
          <a href="/" style={{ color: '#00ABE4', textDecoration: 'underline' }}>Go Home</a>
        </div>
      } />
    </Routes>
  )
}

export default AppRoutes