import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import { productService } from '../../services/productService'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import CategoryNavigation from '../../components/common/CategoryNavigation'
import ProductList from '../../components/features/ProductList'
import SearchBar from '../../components/features/SearchBar'
import ProductFilter from '../../components/features/ProductFilter'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import '../../assets/styles/globals.css'
import '../../assets/styles/components.css'

const CustomerHome = () => {
  const [allProducts, setAllProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeCategory, setActiveCategory] = useState('All Products')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: 'All Products',
    priceRange: { min: 0, max: 10000 }
  })

  const { user } = useAuth()
  const { refreshCart } = useCart()

  useEffect(() => {
    loadAllProducts()
    refreshCart()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [activeCategory, searchTerm, allProducts, filters])

  const loadAllProducts = async () => {
    try {
      setLoading(true)
      setError('')
      
      const products = await productService.getAllProducts()
      console.log('📦 Loaded products:', products)
      setAllProducts(products || [])
    } catch (err) {
      console.error('Error loading products:', err)
      setError('Failed to load products. Please try again later.')
      setAllProducts([])
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let result = [...allProducts]

    console.log(`🔄 Applying filters:`, {
      category: filters.category,
      searchTerm,
      productCount: result.length
    })

    // Category filter
    if (filters.category && filters.category !== 'All Products') {
      const beforeCount = result.length
      result = productService.filterProductsByCategory(result, filters.category)
      console.log(`🎯 Category filter: ${beforeCount} -> ${result.length} products`)
    }

    // Price range filter
    if (filters.priceRange) {
      const beforeCount = result.length
      result = result.filter(product => {
        const price = product.price || 0
        return price >= (filters.priceRange.min || 0) && 
               price <= (filters.priceRange.max || 10000)
      })
      console.log(`💰 Price filter: ${beforeCount} -> ${result.length} products`)
    }

    // Search filter
    if (searchTerm.trim()) {
      const beforeCount = result.length
      const term = searchTerm.toLowerCase()
      result = result.filter(product => {
        const name = product.name?.toLowerCase() || ''
        const description = product.description?.toLowerCase() || ''
        const category = product.category?.categoryName?.toLowerCase() || ''
        
        return name.includes(term) || 
               description.includes(term) || 
               category.includes(term)
      })
      console.log(`🔍 Search filter: ${beforeCount} -> ${result.length} products`)
    }

    console.log(`✅ Final filtered results: ${result.length} products`)
    setFilteredProducts(result)
  }

  const handleCategoryClick = (category) => {
    console.log(`🎯 Category clicked: ${category}`)
    setFilters(prev => ({
      ...prev,
      category: category || 'All Products'
    }))
    setActiveCategory(category || 'All Products')
    setSearchTerm('')
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setActiveCategory(newFilters.category)
  }

  const handleClearFilters = () => {
    setFilters({
      category: 'All Products',
      priceRange: { min: 0, max: 10000 }
    })
    setActiveCategory('All Products')
    setSearchTerm('')
  }

  const handleRetryLoad = () => {
    loadAllProducts()
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  return (
    <div className="page-wrapper">
      <Header />
      
      <div className="main-content-wrapper">
        <CategoryNavigation
          onCategoryClick={handleCategoryClick}
          activeCategory={activeCategory}
        />
        
        <main className="main-content">
          <div className="container">
            {/* Welcome Message */}
            {user && (
              <div className="welcome-section">
                <h1>Welcome back, {user.username}!</h1>
                <p className="welcome-subtitle">Discover amazing products just for you</p>
              </div>
            )}

            {/* Search and Filter Controls */}
            <div className="controls-section">
              <div className="search-filter-container">
                <div className="search-wrapper">
                  <SearchBar onSearch={handleSearch} value={searchTerm} />
                </div>
                <button 
                  className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
                  onClick={toggleFilters}
                >
                  <span>Filters</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M4 6H20M7 12H17M9 18H15" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
              </div>

              {/* Filter Panel */}
              {showFilters && (
                <div className="filter-panel">
                  <ProductFilter 
                    filters={filters}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-message">
                <h3>Error Loading Products</h3>
                <p>{error}</p>
                <button onClick={handleRetryLoad} className="retry-btn">
                  Try Again
                </button>
              </div>
            )}

            {/* Active Filters */}
            {(activeCategory !== 'All Products' || searchTerm || filters.priceRange.min > 0 || filters.priceRange.max < 10000) && (
              <div className="active-filters">
                <span className="filters-label">Active Filters:</span>
                
                {activeCategory !== 'All Products' && (
                  <span className="filter-tag">
                    Category: {activeCategory}
                  </span>
                )}
                
                {searchTerm && (
                  <span className="filter-tag">
                    Search: "{searchTerm}"
                  </span>
                )}
                
                {(filters.priceRange.min > 0 || filters.priceRange.max < 10000) && (
                  <span className="filter-tag">
                    Price: ₹{filters.priceRange.min} - ₹{filters.priceRange.max}
                  </span>
                )}
                
                <button onClick={handleClearFilters} className="clear-filters-btn">
                  Clear All
                </button>
              </div>
            )}

            {/* Results Header */}
            <div className="section-header">
              {activeCategory !== 'All Products' && !searchTerm && (
                <>
                  <h2>{activeCategory}</h2>
                  <p>Showing {filteredProducts.length} products</p>
                </>
              )}
              
              {searchTerm && (
                <>
                  <h2>Search Results</h2>
                  <p>Found {filteredProducts.length} products matching "{searchTerm}"</p>
                </>
              )}
              
              {(activeCategory === 'All Products' && !searchTerm) && (
                <>
                  <h2>All Products</h2>
                  <p>Showing {filteredProducts.length} products</p>
                </>
              )}
            </div>

            {/* Products Section */}
            <div className="products-section">
              <ProductList
                products={filteredProducts}
                loading={loading}
                error={error}
              />
            </div>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  )
}

export default CustomerHome