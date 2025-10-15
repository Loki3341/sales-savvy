import { api } from './api'

export const paymentService = {
  createPayment: async (paymentData) => {
    try {
      console.log('💳 Creating payment:', paymentData)
      const response = await api.post('/payments/create', paymentData)
      console.log('✅ Payment created:', response)
      
      return response
    } catch (error) {
      console.error('❌ Error creating payment:', error)
      throw new Error(error.response?.data?.error || error.message || 'Payment creation failed')
    }
  },

  verifyPayment: async (verificationData) => {
    try {
      console.log('🔍 Verifying payment:', verificationData)
      const response = await api.post('/payments/verify', verificationData)
      console.log('✅ Payment verification:', response)
      
      return response
    } catch (error) {
      console.error('❌ Payment verification error:', error)
      throw new Error(error.response?.data?.error || error.message || 'Payment verification failed')
    }
  },

  processCardPayment: async (cardDetails) => {
    // Simulate card payment processing
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, transactionId: 'txn_' + Date.now() })
      }, 2000)
    })
  },

  processUPIPayment: async (upiId) => {
    // Simulate UPI payment processing
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, upiTransactionId: 'upi_' + Date.now() })
      }, 2000)
    })
  },

  processWalletPayment: async (walletDetails) => {
    // Simulate wallet payment processing
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, walletTransactionId: 'wallet_' + Date.now() })
      }, 2000)
    })
  }
}