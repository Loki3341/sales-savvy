import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import { CartProvider } from './hooks/useCart'
import { OrderProvider } from './hooks/useOrder'
import AppRoutes from './Routes'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <Router>
            <div className="App">
              <AppRoutes />
            </div>
          </Router>
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App