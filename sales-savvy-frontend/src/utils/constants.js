// ✅ FIXED: Use the correct backend port
//export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://sales-savvy-production-f77a.up.railway.app/api';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
export const ROLES = {
  ADMIN: 'ADMIN',
  CUSTOMER: 'CUSTOMER'
}

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
}

export const PAYMENT_METHODS = {
  COD: 'COD',
  CARD: 'CARD',
  UPI: 'UPI',
  WALLET: 'WALLET'
}

export const CATEGORIES = [
  'All Products',
  'Shirts',
  'Pants', 
  'Accessories',
  'Mobiles',
  'Mobile Accessories',
  'Electronics',
  'Books',
  'Home & Kitchen'
]

export const CATEGORY_IDS = {
  'All Products': null,
  'Shirts': 1,
  'Pants': 2,
  'Accessories': 3,
  'Mobiles': 4,
  'Mobile Accessories': 5,
  'Electronics': 6,
  'Books': 7,
  'Home & Kitchen': 8
}

// Price ranges for filter presets (Updated to Indian Rupees)
export const PRICE_RANGES = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 - ₹1,000', min: 500, max: 1000 },
  { label: '₹1,000 - ₹2,000', min: 1000, max: 2000 },
  { label: '₹2,000 - ₹5,000', min: 2000, max: 5000 },
  { label: 'Over ₹5,000', min: 5000, max: 100000 }
]
