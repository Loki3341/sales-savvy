import { api } from './api'

export const checkoutService = {
  processCheckout: async (checkoutData) => {
    try {
      console.log('🛒 checkoutService: Processing checkout with data:', checkoutData)
      
      const response = await api.post('/checkout/process', checkoutData)
      console.log('✅ checkoutService: Response received:', response)
      
      if (!response) {
        throw new Error('No response received from server')
      }
      
      // Check if the response indicates success
      if (response.success === false) {
        throw new Error(response.error || 'Failed to process checkout')
      }
      
      // Ensure we have order data
      if (!response.order) {
        console.warn('⚠️ No order data in response, but request was successful')
        // We'll still return the response as the backend might have a different structure
      }
      
      return response
      
    } catch (error) {
      console.error('❌ checkoutService: Error processing checkout:', error)
      throw error // Re-throw the error to be handled by the caller
    }
  },

  validateCheckout: async () => {
    try {
      console.log('🛒 checkoutService: Validating checkout...')
      const response = await api.post('/checkout/validate')
      console.log('✅ checkoutService: Checkout validation response:', response)
      return response
    } catch (error) {
      console.error('❌ checkoutService: Checkout validation error:', error)
      throw error
    }
  },

  // Test endpoint to verify connectivity
  testConnection: async () => {
    try {
      console.log('🔗 Testing connection to checkout endpoint...')
      const response = await api.get('/checkout/test')
      console.log('✅ Connection test response:', response)
      return response
    } catch (error) {
      console.error('❌ Connection test failed:', error)
      throw error
    }
  },

  // Simple test endpoint
  simpleTest: async () => {
    try {
      console.log('🔗 Testing simple endpoint...')
      const response = await api.get('/checkout/simple-test')
      console.log('✅ Simple test response:', response)
      return response
    } catch (error) {
      console.error('❌ Simple test failed:', error)
      throw error
    }
  }
}