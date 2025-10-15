import { useState, useContext, createContext } from 'react'
import { orderService } from '../services/orderService'
import { checkoutService } from '../services/checkoutService'

const OrderContext = createContext()

export const useOrder = () => {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider')
  }
  return context
}

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([])
  const [currentOrder, setCurrentOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const createOrder = async (orderData) => {
    try {
      setLoading(true)
      setError(null)
      console.log('🔄 useOrder: Creating order with data:', orderData)
      
      const response = await orderService.createOrder(orderData)
      console.log('✅ useOrder: Order creation response:', response)
      
      if (!response) {
        throw new Error('No response received from server')
      }
      
      if (!response.success) {
        throw new Error(response.error || 'Order creation failed')
      }
      
      // Ensure order items are properly structured
      const orderWithItems = {
        ...response.order,
        orderItems: response.order?.orderItems || []
      }
      
      setCurrentOrder(orderWithItems)
      console.log('✅ useOrder: Order created successfully:', orderWithItems)
      
      return {
        ...response,
        order: orderWithItems
      }
      
    } catch (error) {
      console.error('❌ useOrder: Error creating order:', error)
      const errorMessage = error.message || 'Failed to create order'
      setError(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const testConnection = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await checkoutService.testConnection()
      return response
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const simpleTest = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await checkoutService.simpleTest()
      return response
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const fetchUserOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const orders = await orderService.getUserOrders()
      setOrders(orders)
      
      return orders
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => setError(null)

  const value = {
    orders,
    currentOrder,
    loading,
    error,
    createOrder,
    testConnection,
    simpleTest,
    fetchUserOrders,
    clearError
  }

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  )
}