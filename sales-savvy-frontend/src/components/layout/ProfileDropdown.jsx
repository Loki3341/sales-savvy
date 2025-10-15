import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import '../../assets/styles/components.css'

const ProfileDropdown = ({ username }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [imageError, setImageError] = useState(false)
  const dropdownRef = useRef(null)
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleDropdown = () => setIsOpen(!isOpen)

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleProfileClick = () => {
    navigate('/profile')
    setIsOpen(false)
  }

  const handleOrdersClick = () => {
    navigate('/orders')
    setIsOpen(false)
  }

  const handleAdminDashboard = () => {
    navigate('/admin-dashboard')
    setIsOpen(false)
  }

  const handleSettingsClick = () => {
    navigate('/settings')
    setIsOpen(false)
  }

  // ✅ Better role detection with debugging
  const isAdmin = user && (
    user.role === 'admin' || 
    user.role === 'ADMIN' || 
    user.role === 'ROLE_ADMIN' ||
    (user.authorities && user.authorities.includes('ADMIN'))
  )

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!username) return 'U'
    return username.charAt(0).toUpperCase()
  }

  // Reset image error when user changes
  useEffect(() => {
    setImageError(false)
  }, [user])

  console.log('👤 User role debug:', {
    user,
    role: user?.role,
    isAdmin
  })

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="profile-toggle-btn">
        <div className="avatar-container">
          {!imageError ? (
            <img
              src={user?.avatar || "/src/assets/images/user-avatar.png"}
              alt="User Avatar"
              className="user-avatar"
              onError={() => setImageError(true)}
              onLoad={() => setImageError(false)}
            />
          ) : (
            <div className="avatar-fallback">
              {getUserInitials()}
            </div>
          )}
        </div>
        <span className="username">{username || 'Guest'}</span>
        <span className={`dropdown-arrow ${isOpen ? 'rotate' : ''}`}>▼</span>
      </button>
      
      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-user-info">
            <div className="avatar-container small">
              {!imageError ? (
                <img
                  src={user?.avatar || "/src/assets/images/user-avatar.png"}
                  alt="User Avatar"
                  className="user-avatar"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="avatar-fallback">
                  {getUserInitials()}
                </div>
              )}
            </div>
            <div className="user-details">
              <div className="user-name">{username || 'Guest'}</div>
              <div className="user-email">{user?.email || ''}</div>
              {isAdmin && (
                <div className="user-badge admin">Administrator</div>
              )}
            </div>
          </div>

          <div className="dropdown-divider"></div>

          <div className="dropdown-item" onClick={handleProfileClick}>
            <span className="dropdown-icon">👤</span>
            <span>My Profile</span>
          </div>
          
          <div className="dropdown-item" onClick={handleOrdersClick}>
            <span className="dropdown-icon">📦</span>
            <span>My Orders</span>
          </div>

          <div className="dropdown-item" onClick={handleSettingsClick}>
            <span className="dropdown-icon">⚙️</span>
            <span>Settings</span>
          </div>
          
          {isAdmin && (
            <>
              <div className="dropdown-divider"></div>
              <div className="dropdown-section-label">Admin</div>
              <div className="dropdown-item" onClick={handleAdminDashboard}>
                <span className="dropdown-icon">🛠️</span>
                <span>Admin Dashboard</span>
              </div>
            </>
          )}
          
          <div className="dropdown-divider"></div>
          <div className="dropdown-item logout-item" onClick={handleLogout}>
            <span className="dropdown-icon">🚪</span>
            <span className="logout-text">Logout</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileDropdown