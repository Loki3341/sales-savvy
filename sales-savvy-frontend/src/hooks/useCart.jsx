import { useState, useEffect, createContext, useContext } from 'react'
import { cartService } from '../services/cartService'
import { useAuth } from './useAuth'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [cartCount, setCartCount] = useState(0)
  const [cartTotal, setCartTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [addingProductId, setAddingProductId] = useState(null)
  const { user, isAuthenticated } = useAuth()

  // Reset cart when user logs out
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('🔄 User logged in, fetching cart data... User ID:', user.userId)
      fetchCartData()
    } else {
      console.log('🔄 No user or not authenticated, resetting cart...')
      resetCart()
    }
  }, [user, isAuthenticated])

  const resetCart = () => {
    setCartItems([])
    setCartCount(0)
    setCartTotal(0)
    setError(null)
    setSuccess(null)
    setAddingProductId(null)
  }

  const fetchCartData = async () => {
    if (!isAuthenticated || !user) {
      console.log('🛒 No authenticated user, skipping cart fetch')
      resetCart()
      return
    }

    try {
      setLoading(true)
      setError(null)
      console.log('🛒 Fetching cart data for user:', user.userId)
      
      const summaryResponse = await cartService.getCartSummary()
      console.log('🛒 Cart data received:', summaryResponse)
      
      if (summaryResponse && summaryResponse.success !== false) {
        // Handle both response formats
        const items = summaryResponse.cartItems || summaryResponse.items || []
        const total = summaryResponse.totalValue || summaryResponse.total || 0
        const count = summaryResponse.totalItems || items.reduce((sum, item) => sum + (item.quantity || 0), 0)
        
        console.log('🛒 Setting cart state:', { 
          items: items.length, 
          total, 
          count 
        })
        
        setCartItems(items)
        setCartTotal(total)
        setCartCount(count)
      } else {
        throw new Error(summaryResponse?.error || 'Failed to load cart data')
      }
    } catch (error) {
      console.error('❌ Error fetching cart data:', error)
      const errorMessage = error.message || 'Failed to load cart data'
      setError(errorMessage)
      
      // Reset cart on auth errors
      if (errorMessage.includes('Authentication failed') || errorMessage.includes('401') || errorMessage.includes('login')) {
        console.log('🛒 Auth error, resetting cart')
        resetCart()
      }
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated || !user) {
      const shouldLogin = window.confirm('Please login to add items to cart. Would you like to login now?')
      if (shouldLogin) {
        window.location.href = '/login'
      }
      return false
    }

    try {
      setError(null)
      setSuccess(null)
      setAddingProductId(productId)
      console.log(`🛒 Adding product ${productId} to cart for user ${user.userId}...`)
      
      const result = await cartService.addToCart(productId, quantity)
      console.log('🛒 Add to cart result:', result)
      
      if (result) {
        console.log('🛒 Product added successfully, refreshing cart...')
        setSuccess('Product added to cart successfully!')
        
        // Refresh cart data to get updated count
        await fetchCartData()
        return true
      } else {
        throw new Error('Failed to add product to cart')
      }
      
    } catch (error) {
      console.error('❌ Error adding to cart:', error)
      const errorMessage = error.message || 'Failed to add item to cart'
      setError(errorMessage)
      setSuccess(null)
      
      if (errorMessage.includes('Authentication failed') || errorMessage.includes('401') || errorMessage.includes('login')) {
        const shouldLogin = window.confirm('Please login to add items to cart. Would you like to login now?')
        if (shouldLogin) {
          window.location.href = '/login'
        }
      }
      return false
    } finally {
      setAddingProductId(null)
    }
  }

  const updateCartItem = async (cartItemId, quantity) => {
    try {
      setError(null)
      setSuccess(null)
      console.log(`🛒 Updating cart item ${cartItemId} to quantity ${quantity}`)
      
      const success = await cartService.updateCartItem(cartItemId, quantity)
      
      if (success) {
        await fetchCartData()
        setSuccess('Cart updated successfully!')
        return true
      } else {
        throw new Error('Failed to update cart item')
      }
    } catch (error) {
      console.error('❌ Error updating cart item:', error)
      setError(error.message || 'Failed to update cart item')
      setSuccess(null)
      return false
    }
  }

  const removeFromCart = async (cartItemId) => {
    try {
      setError(null)
      setSuccess(null)
      console.log(`🛒 Removing cart item ${cartItemId}`)
      
      const success = await cartService.removeFromCart(cartItemId)
      
      if (success) {
        await fetchCartData()
        setSuccess('Item removed from cart!')
        return true
      } else {
        throw new Error('Failed to remove item from cart')
      }
    } catch (error) {
      console.error('❌ Error removing from cart:', error)
      setError(error.message || 'Failed to remove item from cart')
      setSuccess(null)
      return false
    }
  }

  const clearCart = async () => {
    try {
      setError(null)
      setSuccess(null)
      console.log('🛒 Clearing entire cart')
      
      const success = await cartService.clearCart()
      
      if (success) {
        await fetchCartData()
        setSuccess('Cart cleared successfully!')
        return true
      } else {
        throw new Error('Failed to clear cart')
      }
    } catch (error) {
      console.error('❌ Error clearing cart:', error)
      setError(error.message || 'Failed to clear cart')
      setSuccess(null)
      return false
    }
  }

  const clearError = () => setError(null)
  const clearSuccess = () => setSuccess(null)

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    loading,
    error,
    success,
    addingProductId,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart: fetchCartData,
    clearError,
    clearSuccess
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}