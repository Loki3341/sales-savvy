import { api } from './api'

export const orderService = {
  createOrder: async (orderData) => {
    try {
      console.log('🛒 orderService: Creating order with data:', orderData)
      
      const response = await api.post('/checkout/process', orderData)
      console.log('✅ orderService: Response received:', response)
      
      if (!response) {
        throw new Error('No response received from server')
      }
      
      if (response.success === false) {
        throw new Error(response.error || 'Failed to create order')
      }
      
      return response
      
    } catch (error) {
      console.error('❌ orderService: Error creating order:', error)
      throw error
    }
  },

  getUserOrders: async () => {
    try {
      console.log('📦 orderService: Fetching user orders...')
      const response = await api.get('/orders/user/current')
      console.log('📦 orderService: User orders response:', response)
      
      // Handle different response formats
      if (Array.isArray(response)) {
        console.log(`✅ Found ${response.length} orders`)
        return response
      } else if (response && Array.isArray(response.orders)) {
        console.log(`✅ Found ${response.orders.length} orders in orders field`)
        return response.orders
      } else if (response && response.data) {
        console.log(`✅ Found ${response.data.length} orders in data field`)
        return response.data
      } else if (response && response.success === false) {
        console.log('❌ Server returned error:', response.error)
        throw new Error(response.error || 'Failed to fetch orders')
      }
      
      console.log('⚠️ No orders found or unexpected response format')
      return []
      
    } catch (error) {
      console.error('❌ orderService: Error fetching user orders:', error)
      // Return empty array for better UX
      return []
    }
  },

  getOrderById: async (orderId) => {
    try {
      console.log('📋 orderService: Fetching order details for:', orderId)
      const response = await api.get(`/orders/${orderId}`)
      console.log('📋 orderService: Order details response:', response)
      
      if (!response) {
        throw new Error('Order not found')
      }
      
      if (response.success === false) {
        throw new Error(response.error || 'Failed to fetch order details')
      }
      
      return response
    } catch (error) {
      console.error('❌ orderService: Error fetching order:', error)
      throw error
    }
  },

  // Additional order management methods
  cancelOrder: async (orderId) => {
    try {
      console.log('❌ orderService: Cancelling order:', orderId)
      const response = await api.put(`/orders/${orderId}/cancel`)
      console.log('✅ orderService: Order cancellation response:', response)
      return response
    } catch (error) {
      console.error('❌ orderService: Error cancelling order:', error)
      throw error
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.put(`/orders/${orderId}/status`, { status })
      console.log('🔄 orderService: Order status update response:', response)
      return response
    } catch (error) {
      console.error('❌ orderService: Error updating order status:', error)
      throw error
    }
  },

  // Get order items for a specific order
  getOrderItems: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}/items`)
      console.log('📦 orderService: Order items response:', response)
      return response
    } catch (error) {
      console.error('❌ orderService: Error fetching order items:', error)
      throw error
    }
  },

  // Track order shipping
  trackOrder: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}/track`)
      console.log('🚚 orderService: Order tracking response:', response)
      return response
    } catch (error) {
      console.error('❌ orderService: Error tracking order:', error)
      throw error
    }
  },

  // Generate invoice for order
  generateInvoice: async (orderId) => {
    try {
      console.log('🧾 orderService: Generating invoice for order:', orderId)
      const response = await api.get(`/orders/${orderId}/invoice`)
      console.log('✅ orderService: Invoice generation response:', response)
      return response
    } catch (error) {
      console.error('❌ orderService: Error generating invoice:', error)
      throw error
    }
  }
}