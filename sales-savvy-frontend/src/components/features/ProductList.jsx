import React from 'react'
import ProductCard from '../common/ProductCard'
import LoadingSpinner from '../common/LoadingSpinner'

const ProductList = ({ products, loading, error }) => {
  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-message">
        <h3>Error Loading Products</h3>
        <p>{error}</p>
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="no-products">
        <h3>No products found</h3>
        <p>Try adjusting your search or filter criteria</p>
        <div className="no-products-tips">
          <p>Tips:</p>
          <ul>
            <li>• Try a different category</li>
            <li>• Clear your filters</li>
            <li>• Check your search terms</li>
            <li>• Browse all products</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="product-grid">
      {products.map((product, index) => (
        <ProductCard 
          key={product.product_id || product.id || `product-${index}`} 
          product={product} 
        />
      ))}
    </div>
  )
}

export default ProductList