// hooks/useAdmin.jsx
import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';

export const useAdmin = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    pendingOrders: 0,
    revenue: 0,
    loading: true,
    error: null,
    isFallback: false,
    isEmptyDatabase: false
  });

  const [users, setUsers] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);

  // Load dashboard statistics
  const loadDashboardStats = async () => {
    try {
      setDashboardStats(prev => ({ ...prev, loading: true, error: null, isEmptyDatabase: false }));
      
      console.log('🔄 [useAdmin] Loading REAL dashboard statistics...');
      
      const stats = await adminService.getDashboardStats();
      
      console.log('📊 [useAdmin] REAL Dashboard stats loaded:', stats);

      // Check if database is empty (all zeros)
      const isEmptyDatabase = stats.totalProducts === 0 && 
                             stats.totalUsers === 0 && 
                             stats.pendingOrders === 0 && 
                             stats.revenue === 0;

      setDashboardStats({
        totalProducts: stats.totalProducts || 0,
        totalUsers: stats.totalUsers || 0,
        pendingOrders: stats.pendingOrders || 0,
        revenue: stats.revenue || 0,
        loading: false,
        error: null,
        isFallback: false,
        isEmptyDatabase: isEmptyDatabase,
        message: stats.message
      });

    } catch (error) {
      console.error('❌ [useAdmin] Error loading REAL dashboard stats:', error);
      setDashboardStats({
        totalProducts: 0,
        totalUsers: 0,
        pendingOrders: 0,
        revenue: 0,
        loading: false,
        error: error.message || 'Failed to load real statistics from database',
        isFallback: false,
        isEmptyDatabase: false
      });
    }
  };

  // Load all users
  const loadUsers = async () => {
    try {
      console.log('🔄 [useAdmin] Loading users...');
      const usersData = await adminService.getAllUsers();
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (error) {
      console.error('❌ [useAdmin] Error loading users:', error);
      setUsers([]);
    }
  };

  // Load popular products
  const loadPopularProducts = async () => {
    try {
      console.log('🔄 [useAdmin] Loading popular products...');
      const popularProductsData = await adminService.getPopularProducts();
      setPopularProducts(Array.isArray(popularProductsData) ? popularProductsData : []);
    } catch (error) {
      console.error('❌ [useAdmin] Error loading popular products:', error);
      setPopularProducts([]);
    }
  };

  const refreshData = async () => {
    console.log('🔄 [useAdmin] Refreshing all data...');
    await Promise.all([
      loadDashboardStats(),
      loadUsers(),
      loadPopularProducts()
    ]);
  };

  useEffect(() => {
    loadDashboardStats();
    loadUsers();
    loadPopularProducts();
  }, []);

  return {
    dashboardStats,
    users,
    popularProducts,
    refreshData,
    loadDashboardStats,
    loadUsers,
    loadPopularProducts
  };
};