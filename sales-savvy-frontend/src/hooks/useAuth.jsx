import { useState, useEffect, createContext, useContext } from 'react'
import { authService } from '../services/authService'
import { getAuthToken, removeAuthToken } from '../utils/helpers'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      console.log('🔄 Checking auth status...')
      const token = getAuthToken()
      console.log('🔐 Current token:', token ? 'Exists' : 'None')
      
      if (!token) {
        console.log('🔴 No token found, user is not authenticated')
        setUser(null)
        setLoading(false)
        return
      }

      // Try to get user info from localStorage first (faster)
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser)
          setUser(userData)
          console.log('✅ User restored from storage:', userData.username, 'Role:', userData.role)
          setLoading(false)
          return
        } catch (e) {
          console.error('❌ Error parsing saved user:', e)
          localStorage.removeItem('user')
        }
      }

      // If no saved user but have token, validate and get user from auth endpoint
      try {
        console.log('🔄 Validating token with auth endpoint...')
        
        // Use the proper auth validation endpoint
        const response = await authService.validateToken()
        console.log('✅ Auth validation response:', response)
        
        if (response.valid && response.user) {
          setUser(response.user)
          localStorage.setItem('user', JSON.stringify(response.user))
          console.log('✅ User set from auth validation:', response.user.username, 'Role:', response.user.role)
        } else {
          console.log('🔴 Token validation failed:', response.message)
          handleLogout()
        }
      } catch (validateError) {
        console.error('❌ Token validation failed:', validateError)
        handleLogout()
      }
    } catch (err) {
      console.error('❌ Auth status check failed:', err)
      handleLogout()
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    console.log('🔄 Clearing auth data...')
    setUser(null)
    localStorage.removeItem('user')
    removeAuthToken()
    console.log('✅ Local logout completed')
  }

  const login = async (credentials) => {
    try {
      setError(null)
      setLoading(true)
      console.log('🔄 useAuth: Calling authService.login with:', credentials)
      
      const response = await authService.login(credentials)
      console.log('✅ useAuth: Received response:', response)
      
      // Check if response indicates success
      if (response && response.success !== false) {
        const userData = response.user || response
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
        console.log('✅ User logged in and stored:', userData.username, 'Role:', userData.role)
        return response
      } else {
        const errorMessage = response?.error || 'Login failed - Invalid response'
        console.error('❌ Login failed:', errorMessage)
        setError(errorMessage)
        throw new Error(errorMessage)
      }
    } catch (err) {
      console.error('❌ useAuth: Login error:', err)
      const errorMessage = err.message || 'Login failed. Please check your credentials.'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setError(null)
      setLoading(true)
      console.log('🔄 useAuth: Registering user:', userData)
      
      const response = await authService.register(userData)
      console.log('✅ useAuth: Registration response:', response)
      
      if (response && response.success !== false) {
        const userData = response.user || response
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
        console.log('✅ User registered and logged in:', userData.username, 'Role:', userData.role)
        return response
      } else {
        const errorMessage = response?.error || 'Registration failed - Invalid response'
        console.error('❌ Registration failed:', errorMessage)
        setError(errorMessage)
        throw new Error(errorMessage)
      }
    } catch (err) {
      console.error('❌ useAuth: Registration error:', err)
      const errorMessage = err.message || 'Registration failed. Please try again.'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      console.log('🔄 useAuth: Logging out...')
      await authService.logout()
    } catch (err) {
      console.error('❌ useAuth: Logout error:', err)
    } finally {
      handleLogout()
      setLoading(false)
      console.log('✅ useAuth: Logout completed')
    }
  }

  const updateProfile = async (profileData) => {
    try {
      setLoading(true)
      setError(null)
      console.log('🔄 useAuth: Updating profile with:', profileData)
      
      // For now, update local state and localStorage
      const updatedUser = {
        ...user,
        ...profileData,
        // Ensure we don't override critical fields
        userId: user.userId,
        email: user.email, // Keep original email
        role: user.role,
        username: profileData.firstName && profileData.lastName 
          ? `${profileData.firstName} ${profileData.lastName}`
          : user.username
      }
      
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      
      console.log('✅ Profile updated successfully:', updatedUser)
      return Promise.resolve(updatedUser)
    } catch (err) {
      console.error('❌ useAuth: Profile update error:', err)
      setError(err.message || 'Profile update failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => setError(null)

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    clearError,
    isAuthenticated: !!user && !!getAuthToken(),
    isAdmin: user?.role === 'ADMIN' || user?.role === 'admin'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}