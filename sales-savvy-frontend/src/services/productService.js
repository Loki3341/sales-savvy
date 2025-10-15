import { api } from './api'
import { CATEGORY_IDS } from '../utils/constants'

export const productService = {
  getAllProducts: async () => {
    try {
      console.log('🔄 Fetching all products...')
      const response = await api.get('/products')
      console.log('✅ Products API response:', response)
      
      let products = []
      
      if (Array.isArray(response.data)) {
        products = response.data
      } else if (response.data && Array.isArray(response.data.products)) {
        products = response.data.products
      } else if (Array.isArray(response)) {
        products = response
      } else if (response && Array.isArray(response.products)) {
        products = response.products
      }
      
      console.log(`✅ Found ${products.length} products`)
      return products
    } catch (error) {
      console.error('❌ Error fetching products:', error)
      return []
    }
  },

  filterProductsByCategory: (products, categoryName) => {
    if (!categoryName || categoryName === 'All Products') {
      return products
    }
    
    const categoryId = CATEGORY_IDS[categoryName]
    console.log(`🔄 Filtering by category: ${categoryName}, ID: ${categoryId}`)
    
    const filteredProducts = products.filter(product => {
      const productName = product.name?.toLowerCase() || ''
      const productDesc = product.description?.toLowerCase() || ''
      const productCategory = product.category?.categoryName?.toLowerCase() || ''
      
      // First try exact category match
      if (product.category_category_id === categoryId || 
          productCategory === categoryName.toLowerCase()) {
        console.log(`✅ Exact category match: ${product.name}`)
        return true
      }
      
      // Then try keyword matching for specific categories
      switch(categoryName) {
        case 'Electronics':
          const isElectronics = productName.includes('laptop') || 
                               productName.includes('camera') || 
                               productName.includes('tablet') || 
                               productName.includes('tv') ||
                               productName.includes('headphone') ||
                               productName.includes('speaker') ||
                               productName.includes('monitor') ||
                               productName.includes('computer') ||
                               productName.includes('electronic') ||
                               productDesc.includes('electronic') ||
                               productDesc.includes('gadget') ||
                               productDesc.includes('digital') ||
                               productCategory.includes('electronic')
          if (isElectronics) console.log(`✅ Electronics match: ${product.name}`)
          return isElectronics
        
        case 'Home & Kitchen':
          const isHomeKitchen = productName.includes('kitchen') || 
                               productName.includes('home') || 
                               productName.includes('appliance') || 
                               productName.includes('cooker') ||
                               productName.includes('furniture') ||
                               productName.includes('decor') ||
                               productName.includes('utensil') ||
                               productName.includes('cookware') ||
                               productName.includes('bed') ||
                               productName.includes('sofa') ||
                               productName.includes('chair') ||
                               productDesc.includes('home') ||
                               productDesc.includes('kitchen') ||
                               productDesc.includes('household') ||
                               productCategory.includes('home') ||
                               productCategory.includes('kitchen')
          if (isHomeKitchen) console.log(`✅ Home & Kitchen match: ${product.name}`)
          return isHomeKitchen
        
        case 'Shirts':
          return productName.includes('shirt') || productName.includes('t-shirt') || productName.includes('formal') || productDesc.includes('shirt')
        case 'Pants':
          return productName.includes('pant') || productName.includes('jean') || productName.includes('trouser') || productName.includes('chino') || productDesc.includes('pant')
        case 'Accessories':
          return productName.includes('belt') || productName.includes('watch') || productName.includes('bag') || productName.includes('wallet') || productName.includes('jewelry') || productDesc.includes('accessory')
        case 'Mobiles':
          return productName.includes('phone') || productName.includes('mobile') || productName.includes('smartphone') || productDesc.includes('phone') || productDesc.includes('mobile')
        case 'Mobile Accessories':
          return productName.includes('charger') || productName.includes('earphone') || productName.includes('case') || productName.includes('headphone') || productName.includes('power bank') || productDesc.includes('mobile accessory')
        case 'Books':
          return productName.includes('book') || productDesc.includes('book') || productCategory.includes('book') || productDesc.includes('novel') || productDesc.includes('literature')
        default:
          return false
      }
    })
    
    console.log(`✅ Filtered ${filteredProducts.length} products for ${categoryName}`)
    return filteredProducts
  },

  filterProductsByPrice: (products, minPrice, maxPrice) => {
    return products.filter(product => {
      const price = product.price || 0
      return price >= minPrice && price <= maxPrice
    })
  }
}