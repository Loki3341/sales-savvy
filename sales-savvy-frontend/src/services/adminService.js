// services/adminService.js
import { api } from './api';

export const adminService = {
  // Get dashboard statistics - handle empty database case
  getDashboardStats: async () => {
    try {
      console.log('🔄 [adminService] Fetching REAL dashboard stats from backend...');
      
      // Try endpoints in correct order (without double /api)
      const endpoints = [
        '/dashboard/stats',           // Correct: /api/dashboard/stats
        '/admin/dashboard/stats',     // Correct: /api/admin/dashboard/stats
        '/dashboard/test-data',       // Correct: /api/dashboard/test-data
        '/admin/test-data'           // Correct: /api/admin/test-data
      ];

      for (const endpoint of endpoints) {
        try {
          console.log(`🔄 Trying endpoint: ${endpoint}`);
          const response = await api.get(endpoint);
          console.log(`✅ ${endpoint} response:`, response);
          
          if (response && response.success !== false) {
            // Map backend fields to frontend expected fields
            const stats = {
              totalProducts: response.totalProducts || response.products || response.productCount || 0,
              totalUsers: response.totalUsers || response.users || response.userCount || 0,
              pendingOrders: response.pendingOrders || response.pending || response.pendingOrdersCount || 0,
              revenue: response.revenue || response.totalRevenue || 0,
              success: true,
              source: endpoint,
              isFallback: false // Real data from database
            };
            
            // Check if database has data
            if (stats.totalProducts === 0 && stats.totalUsers === 0 && stats.pendingOrders === 0 && stats.revenue === 0) {
              console.log('📭 Database appears to be empty - showing zeros from real database');
              stats.message = 'Database is empty - Add some products and users to see statistics';
            } else {
              console.log('✅ Database has real data:', stats);
            }
            
            return stats;
          }
        } catch (error) {
          console.log(`⚠️ ${endpoint} failed:`, error.message);
          // Continue to next endpoint
        }
      }
      
      // If all endpoints fail, throw error - no fallback data
      console.error('❌ All dashboard endpoints failed - no fallback data');
      throw new Error('Could not fetch data from backend. Please check if backend endpoints are correct.');
      
    } catch (error) {
      console.error('❌ Final error fetching dashboard stats:', error);
      
      // Check if it's a network error vs empty database
      if (error.message.includes('Cannot connect to server') || error.message.includes('Network Error')) {
        throw new Error('Backend server is not running. Please start the Spring Boot application.');
      } else if (error.message.includes('401') || error.message.includes('403')) {
        throw new Error('Authentication failed. Please login again.');
      } else {
        throw error; // Propagate other errors
      }
    }
  },

  // Individual stat methods for useAdmin hook
  getProductCount: async () => {
    try {
      const stats = await adminService.getDashboardStats();
      return stats.totalProducts || 0;
    } catch (error) {
      console.error('Error getting product count:', error);
      throw error;
    }
  },

  getUserCount: async () => {
    try {
      const stats = await adminService.getDashboardStats();
      return stats.totalUsers || 0;
    } catch (error) {
      console.error('Error getting user count:', error);
      throw error;
    }
  },

  getPendingOrdersCount: async () => {
    try {
      const stats = await adminService.getDashboardStats();
      return stats.pendingOrders || 0;
    } catch (error) {
      console.error('Error getting pending orders count:', error);
      throw error;
    }
  },

  getTotalRevenue: async () => {
    try {
      const stats = await adminService.getDashboardStats();
      return stats.revenue || 0;
    } catch (error) {
      console.error('Error getting total revenue:', error);
      throw error;
    }
  },

  getPopularProducts: async () => {
    try {
      const response = await api.get('/admin/dashboard/popular-products');
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Error fetching popular products:', error);
      return [];
    }
  },

  getAllUsers: async () => {
    try {
      const response = await api.get('/admin/users');
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }
};