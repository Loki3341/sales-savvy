import React from 'react'

const PaymentMethod = ({ selectedMethod, onMethodChange, showDetails = false, onDetailsChange }) => {
  const paymentMethods = [
    {
      id: 'COD',
      name: 'Cash on Delivery',
      description: 'Pay when you receive your order',
      icon: '💰',
      details: null
    },
    {
      id: 'CARD',
      name: 'Credit/Debit Card',
      description: 'Pay securely with your card',
      icon: '💳',
      details: {
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        nameOnCard: ''
      }
    },
    {
      id: 'UPI',
      name: 'UPI Payment',
      description: 'Fast and secure UPI payment',
      icon: '📱',
      details: {
        upiId: ''
      }
    },
    {
      id: 'WALLET',
      name: 'Digital Wallet',
      description: 'Pay using your digital wallet',
      icon: '👛',
      details: {
        walletType: '',
        mobileNumber: ''
      }
    }
  ]

  const handleDetailChange = (field, value) => {
    if (onDetailsChange) {
      onDetailsChange(selectedMethod, field, value)
    }
  }

  return (
    <div className="payment-methods">
      <h3 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>Select Payment Method</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {paymentMethods.map(method => (
          <div key={method.id} style={{ position: 'relative' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                padding: '1.5rem',
                background: selectedMethod === method.id ? 
                  'linear-gradient(135deg, #00ABE4, #0099CC)' : 'white',
                color: selectedMethod === method.id ? 'white' : '#2c3e50',
                border: `2px solid ${selectedMethod === method.id ? '#00ABE4' : '#e0e0e0'}`,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: selectedMethod === method.id ? 
                  '0 8px 25px rgba(0, 171, 228, 0.3)' : '0 2px 10px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => {
                if (selectedMethod !== method.id) {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)'
                }
              }}
              onMouseLeave={(e) => {
                if (selectedMethod !== method.id) {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)'
                }
              }}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={(e) => onMethodChange(e.target.value)}
                style={{ 
                  marginRight: '1rem', 
                  marginTop: '0.25rem',
                  accentColor: selectedMethod === method.id ? 'white' : '#00ABE4'
                }}
              />
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>{method.icon}</span>
                  <div>
                    <h4 style={{ 
                      margin: 0, 
                      fontSize: '1.1rem',
                      fontWeight: '600'
                    }}>
                      {method.name}
                    </h4>
                    <p style={{ 
                      margin: 0, 
                      fontSize: '0.9rem',
                      opacity: 0.8
                    }}>
                      {method.description}
                    </p>
                  </div>
                </div>

                {/* Payment Details Form */}
                {showDetails && selectedMethod === method.id && method.details && (
                  <div style={{ 
                    marginTop: '1rem', 
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    {method.id === 'CARD' && (
                      <div style={{ display: 'grid', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                            Card Number
                          </label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            maxLength="19"
                            style={{
                              width: '100%',
                              padding: '0.75rem',
                              border: '1px solid rgba(255, 255, 255, 0.3)',
                              borderRadius: '6px',
                              background: 'rgba(255, 255, 255, 0.1)',
                              color: 'white',
                              fontSize: '0.9rem'
                            }}
                            onChange={(e) => handleDetailChange('cardNumber', e.target.value)}
                          />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                          <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              maxLength="5"
                              style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                borderRadius: '6px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                fontSize: '0.9rem'
                              }}
                              onChange={(e) => handleDetailChange('expiryDate', e.target.value)}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                              CVV
                            </label>
                            <input
                              type="text"
                              placeholder="123"
                              maxLength="3"
                              style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                borderRadius: '6px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                fontSize: '0.9rem'
                              }}
                              onChange={(e) => handleDetailChange('cvv', e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                            Name on Card
                          </label>
                          <input
                            type="text"
                            placeholder="John Doe"
                            style={{
                              width: '100%',
                              padding: '0.75rem',
                              border: '1px solid rgba(255, 255, 255, 0.3)',
                              borderRadius: '6px',
                              background: 'rgba(255, 255, 255, 0.1)',
                              color: 'white',
                              fontSize: '0.9rem'
                            }}
                            onChange={(e) => handleDetailChange('nameOnCard', e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    {method.id === 'UPI' && (
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                          UPI ID
                        </label>
                        <input
                          type="text"
                          placeholder="yourname@upi"
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            borderRadius: '6px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '0.9rem'
                          }}
                          onChange={(e) => handleDetailChange('upiId', e.target.value)}
                        />
                      </div>
                    )}

                    {method.id === 'WALLET' && (
                      <div style={{ display: 'grid', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                            Wallet Type
                          </label>
                          <select
                            style={{
                              width: '100%',
                              padding: '0.75rem',
                              border: '1px solid rgba(255, 255, 255, 0.3)',
                              borderRadius: '6px',
                              background: 'rgba(255, 255, 255, 0.1)',
                              color: 'white',
                              fontSize: '0.9rem'
                            }}
                            onChange={(e) => handleDetailChange('walletType', e.target.value)}
                          >
                            <option value="">Select Wallet</option>
                            <option value="PAYTM">Paytm</option>
                            <option value="PHONEPE">PhonePe</option>
                            <option value="GOOGLE_PAY">Google Pay</option>
                            <option value="AMAZON_PAY">Amazon Pay</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                            Mobile Number
                          </label>
                          <input
                            type="text"
                            placeholder="9876543210"
                            style={{
                              width: '100%',
                              padding: '0.75rem',
                              border: '1px solid rgba(255, 255, 255, 0.3)',
                              borderRadius: '6px',
                              background: 'rgba(255, 255, 255, 0.1)',
                              color: 'white',
                              fontSize: '0.9rem'
                            }}
                            onChange={(e) => handleDetailChange('mobileNumber', e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PaymentMethod