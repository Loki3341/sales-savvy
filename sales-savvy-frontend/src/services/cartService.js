import { api } from './api'

export const cartService = {
  getCartItems: async () => {
    try {
      console.log('🛒 Fetching cart items...');
      const response = await api.get('/cart');
      console.log('🛒 Cart items response:', response);
      
      // Handle response properly
      if (response.success === false) {
        throw new Error(response.error || 'Failed to fetch cart items');
      }
      
      return response.cartItems || response.items || [];
    } catch (error) {
      console.error('❌ Error fetching cart items:', error);
      if (error.message?.includes('Authentication') || error.message?.includes('401')) {
        throw new Error('Authentication failed - Please login again');
      }
      throw new Error(error.message || 'Failed to fetch cart items');
    }
  },

  getCartSummary: async () => {
    try {
      console.log('🛒 Fetching cart summary...');
      const response = await api.get('/cart/summary');
      console.log('🛒 Cart summary response:', response);
      
      if (response.success === false) {
        throw new Error(response.error || 'Failed to fetch cart summary');
      }
      
      return {
        cartItems: response.cartItems || response.items || [],
        totalValue: response.totalValue || response.total || 0,
        total: response.totalValue || response.total || 0,
        totalItems: response.totalItems || (response.cartItems ? response.cartItems.length : 0),
        ...response
      };
    } catch (error) {
      console.error('❌ Error fetching cart summary:', error);
      if (error.message?.includes('Authentication') || error.message?.includes('401')) {
        throw new Error('Authentication failed - Please login again');
      }
      throw new Error(error.message || 'Failed to fetch cart summary');
    }
  },

  addToCart: async (productId, quantity = 1) => {
    try {
      console.log('🛒 Starting add to cart process...');
      console.log('🛒 Raw productId:', productId, 'Type:', typeof productId);
      
      const productIdNum = Number(productId);
      console.log('🛒 Converted productId:', productIdNum, 'Type:', typeof productIdNum);
      
      if (isNaN(productIdNum) || productIdNum <= 0) {
        throw new Error(`Invalid product ID: ${productId}`);
      }
      
      const quantityNum = Number(quantity);
      if (quantityNum <= 0) {
        throw new Error('Quantity must be positive');
      }
      
      const requestBody = {
        productId: productIdNum,
        quantity: quantityNum
      };
      
      console.log('🛒 Sending request to backend:', requestBody);
      const response = await api.post('/cart/add', requestBody);
      console.log('🛒 Add to cart response:', response);
      
      // Check if the operation was successful
      if (response.success === false) {
        throw new Error(response.error || 'Failed to add item to cart');
      }
      
      console.log('✅ Product added to cart successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      
      if (error.message?.includes('Authentication') || error.message?.includes('401')) {
        throw new Error('Please login to add items to cart');
      } else if (error.message?.includes('404')) {
        throw new Error('Product not found');
      } else if (error.message?.includes('400')) {
        throw new Error(error.message || 'Invalid request');
      } else if (error.message?.includes('Network Error') || error.message?.includes('Failed to fetch')) {
        throw new Error('Cannot connect to server. Please check if backend is running.');
      } else {
        throw new Error(error.message || 'Failed to add item to cart');
      }
    }
  },

  updateCartItem: async (cartItemId, quantity) => {
    try {
      console.log('🛒 Updating cart item:', { cartItemId, quantity });
      
      const quantityNum = Number(quantity);
      if (quantityNum < 0) {
        throw new Error('Quantity cannot be negative');
      }
      
      const response = await api.put('/cart/update', { 
        cartItemId: Number(cartItemId), 
        quantity: quantityNum 
      });
      
      console.log('🛒 Cart item update response:', response);
      
      if (response.success === false) {
        throw new Error(response.error || 'Failed to update cart item');
      }
      
      return true;
    } catch (error) {
      console.error('❌ Error updating cart item:', error);
      throw new Error(error.message || 'Failed to update cart item');
    }
  },

  removeFromCart: async (cartItemId) => {
    try {
      console.log('🛒 Removing cart item:', cartItemId);
      const response = await api.delete(`/cart/remove/${Number(cartItemId)}`);
      
      console.log('🛒 Cart item remove response:', response);
      
      if (response.success === false) {
        throw new Error(response.error || 'Failed to remove item from cart');
      }
      
      return true;
    } catch (error) {
      console.error('❌ Error removing from cart:', error);
      throw new Error(error.message || 'Failed to remove item from cart');
    }
  },

  clearCart: async () => {
    try {
      console.log('🛒 Clearing cart...');
      const response = await api.delete('/cart/clear');
      
      console.log('🛒 Cart clear response:', response);
      
      if (response.success === false) {
        throw new Error(response.error || 'Failed to clear cart');
      }
      
      return true;
    } catch (error) {
      console.error('❌ Error clearing cart:', error);
      throw new Error(error.message || 'Failed to clear cart');
    }
  }
};