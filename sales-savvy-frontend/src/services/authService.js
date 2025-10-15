import { api } from './api'

export const authService = {
  login: async (credentials) => {
    try {
      console.log('🔄 authService: Sending login request...', credentials)
      const response = await api.post('/auth/login', credentials)
      console.log('🔄 authService: Raw response:', response)
      
      // Handle the response structure properly
      if (response.success) {
        console.log('✅ authService: Login successful - Response data:', response)
        
        // Store token in localStorage for header-based auth
        if (response.token) {
          localStorage.setItem('authToken', response.token)
          console.log('🔐 Token stored in localStorage')
        } else {
          console.warn('⚠️ No token found in response')
        }
        
        // Store user data if available
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user))
          console.log('👤 User data stored:', response.user.username, 'Role:', response.user.role)
        }
        
        return response
      } else {
        throw new Error(response.error || 'Login failed')
      }
    } catch (error) {
      console.error('🔴 authService: Login failed:', error)
      throw new Error(error.response?.data?.error || error.message || 'Login failed')
    }
  },

  register: async (userData) => {
    try {
      console.log('🔄 authService: Sending register request...', userData)
      const response = await api.post('/auth/register', userData)
      console.log('🔄 authService: Raw response:', response)
      
      if (response.success) {
        console.log('✅ authService: Register successful:', response)
        
        // Store token in localStorage for header-based auth
        if (response.token) {
          localStorage.setItem('authToken', response.token)
          console.log('🔐 Token stored in localStorage')
        }
        
        // Store user data if available
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user))
          console.log('👤 User data stored:', response.user.username)
        }
        
        return response
      } else {
        throw new Error(response.error || 'Registration failed')
      }
    } catch (error) {
      console.error('🔴 authService: Register failed:', error)
      throw new Error(error.response?.data?.error || error.message || 'Registration failed')
    }
  },

  logout: async () => {
    try {
      console.log('🔄 authService: Logging out...')
      const response = await api.post('/auth/logout')
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      console.log('✅ authService: Logout successful')
      return response
    } catch (error) {
      console.error('🔴 authService: Logout error:', error)
      // Still clear local storage even if API call fails
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      throw error
    }
  },

  validateToken: async () => {
    try {
      console.log('🔄 authService: Validating token...')
      const response = await api.get('/auth/validate')
      console.log('🔄 authService: Raw validation response:', response)
      
      if (response.success && response.valid) {
        console.log('✅ authService: Token validation successful:', response)
        return response
      } else {
        return { 
          valid: false, 
          error: response.message || 'Token validation failed'
        }
      }
    } catch (error) {
      console.error('🔴 authService: Token validation error:', error)
      return { 
        valid: false, 
        error: error.message || 'Token validation failed'
      }
    }
  },

  forgotPassword: async (email) => {
    try {
      console.log('🔄 authService: Sending forgot password request...', email)
      const response = await api.post('/auth/forgot-password', { email })
      console.log('🔄 authService: Raw forgot password response:', response)
      
      if (response.success) {
        console.log('✅ authService: Forgot password response:', response)
        return response
      } else {
        throw new Error(response.error || 'Failed to send reset email')
      }
    } catch (error) {
      console.error('🔴 authService: Forgot password error:', error)
      throw new Error(error.response?.data?.error || error.message || 'Failed to send reset email')
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      console.log('🔄 authService: Resetting password...')
      const response = await api.post('/auth/reset-password', { token, newPassword })
      console.log('🔄 authService: Raw reset password response:', response)
      
      if (response.success) {
        console.log('✅ authService: Reset password response:', response)
        return response
      } else {
        throw new Error(response.error || 'Failed to reset password')
      }
    } catch (error) {
      console.error('🔴 authService: Reset password error:', error)
      throw new Error(error.response?.data?.error || error.message || 'Failed to reset password')
    }
  },

  validateResetToken: async (token) => {
    try {
      console.log('🔄 authService: Validating reset token...')
      const response = await api.get(`/auth/validate-reset-token?token=${token}`)
      console.log('🔄 authService: Raw reset token validation response:', response)
      
      if (response.success) {
        console.log('✅ authService: Reset token validation response:', response)
        return response
      } else {
        throw new Error(response.error || 'Failed to validate reset token')
      }
    } catch (error) {
      console.error('🔴 authService: Reset token validation error:', error)
      throw new Error(error.response?.data?.error || error.message || 'Failed to validate reset token')
    }
  },

  // ✅ Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken')
    const user = localStorage.getItem('user')
    const isAuth = !!(token && user)
    console.log('🔐 Auth check - Token:', !!token, 'User:', !!user, 'Authenticated:', isAuth)
    return isAuth
  },

  // ✅ Get stored user data
  getStoredUser: () => {
    try {
      const userData = localStorage.getItem('user')
      const user = userData ? JSON.parse(userData) : null
      console.log('👤 Stored user:', user ? `${user.username} (${user.role})` : 'None')
      return user
    } catch (error) {
      console.error('🔴 Error parsing stored user:', error)
      return null
    }
  },

  // ✅ Get stored token
  getStoredToken: () => {
    const token = localStorage.getItem('authToken')
    console.log('🔐 Stored token:', token ? `${token.substring(0, 20)}...` : 'None')
    return token
  }
}