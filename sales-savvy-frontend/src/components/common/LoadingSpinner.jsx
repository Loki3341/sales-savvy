import React from 'react'


const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const getSpinnerSize = () => {
    switch (size) {
      case 'small': return '20px'
      case 'large': return '60px'
      default: return '40px'
    }
  }

  return (
    <div className="loading-spinner">
      <div
        className="spinner"
        style={{
          width: getSpinnerSize(),
          height: getSpinnerSize()
        }}
      ></div>
      {text && <p style={{ marginTop: '1rem' }}>{text}</p>}
    </div>
  )
}

export default LoadingSpinner