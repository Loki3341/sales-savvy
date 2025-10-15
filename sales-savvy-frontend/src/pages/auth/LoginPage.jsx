import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import '../../assets/styles/globals.css'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const { login, error, setError } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (error) setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await login(formData)
      navigate('/')
    } catch (err) {
      console.error('Login failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-wrapper">
      <Header />
      <main className="main-content">
        <div className="page-container login-page-container">
          <div className="form-container">
            <h1 className="form-title">Welcome Back</h1>
            <p className="form-subtitle">Sign in to your account</p>
            
            {error && (
              <div className="error-message">
                {error.includes('Cannot connect to server') ? (
                  <div>
                    <strong>Connection Error:</strong> {error}
                    <div className="connection-help">
                      Please make sure:
                      <ul>
                        <li>Backend server is running on port 8080</li>
                        <li>No other applications are using port 8080</li>
                        <li>Your firewall isn't blocking the connection</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  error
                )}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="form-content">
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Username or Email
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username or email"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              
              <button
                type="submit"
                className="form-button primary"
                disabled={loading}
              >
                {loading ? <LoadingSpinner size="small" text="" /> : 'Sign In'}
              </button>
            </form>
            
            <div className="form-footer">
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="form-link">
                  Create account
                </Link>
              </p>
              <p>
                <Link to="/forgot-password" className="form-link">
                  Forgot your password?
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default LoginPage