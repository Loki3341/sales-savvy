import React from 'react'
import { CATEGORIES } from '../../utils/constants'
import '../../assets/styles/components.css'

const ProductFilter = ({ filters, onFilterChange }) => {
  const handleCategoryChange = (category) => {
    // Use "All Products" as the default instead of null
    const newCategory = filters.category === category ? 'All Products' : category
    onFilterChange({
      ...filters,
      category: newCategory
    })
  }

  const handlePriceRangeChange = (min, max) => {
    onFilterChange({
      ...filters,
      priceRange: { min: min || 0, max: max || 10000 }
    })
  }

  const clearFilters = () => {
    onFilterChange({
      category: 'All Products',
      priceRange: { min: 0, max: 10000 }
    })
  }

  // Check if any filters are active (excluding default values)
  const hasActiveFilters = filters.category !== 'All Products' || 
                          filters.priceRange?.min > 0 || 
                          filters.priceRange?.max < 10000

  return (
    <div style={{
      background: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      marginBottom: '2rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            style={{
              background: 'none',
              border: 'none',
              color: '#00ABE4',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '0.9rem'
            }}
          >
            Clear All
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: '600' }}>Category</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              style={{
                padding: '0.5rem 1rem',
                border: `2px solid ${filters.category === category ? '#00ABE4' : '#e0e0e0'}`,
                background: filters.category === category ? '#00ABE4' : 'white',
                color: filters.category === category ? 'white' : '#333',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: filters.category === category ? '600' : '400',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                if (filters.category !== category) {
                  e.target.style.background = '#f8f9fa'
                  e.target.style.borderColor = '#00ABE4'
                }
              }}
              onMouseLeave={(e) => {
                if (filters.category !== category) {
                  e.target.style.background = 'white'
                  e.target.style.borderColor = '#e0e0e0'
                }
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: '600' }}>Price Range</h4>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', color: '#666' }}>Min:</span>
            <div style={{ position: 'relative' }}>
              <span style={{ 
                position: 'absolute', 
                left: '8px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#666',
                fontSize: '0.9rem'
              }}>
                ₹
              </span>
              <input
                type="number"
                placeholder="0"
                value={filters.priceRange?.min || ''}
                onChange={(e) => handlePriceRangeChange(Number(e.target.value), filters.priceRange?.max)}
                className="form-input"
                style={{ 
                  width: '90px', 
                  padding: '0.4rem 0.4rem 0.4rem 1.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '0.9rem'
                }}
                min="0"
              />
            </div>
          </div>
          <span style={{ color: '#666' }}>-</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', color: '#666' }}>Max:</span>
            <div style={{ position: 'relative' }}>
              <span style={{ 
                position: 'absolute', 
                left: '8px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#666',
                fontSize: '0.9rem'
              }}>
                ₹
              </span>
              <input
                type="number"
                placeholder="10000"
                value={filters.priceRange?.max || ''}
                onChange={(e) => handlePriceRangeChange(filters.priceRange?.min, Number(e.target.value))}
                className="form-input"
                style={{ 
                  width: '90px', 
                  padding: '0.4rem 0.4rem 0.4rem 1.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '0.9rem'
                }}
                min="0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters Indicator */}
      {hasActiveFilters && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '0.5rem', 
          background: '#f8f9fa', 
          borderRadius: '4px',
          fontSize: '0.8rem',
          color: '#666'
        }}>
          <strong>Active:</strong>
          {filters.category !== 'All Products' && ` ${filters.category}`}
          {(filters.priceRange?.min > 0 || filters.priceRange?.max < 10000) && 
            ` Price: ₹${filters.priceRange?.min || 0}-₹${filters.priceRange?.max || 10000}`
          }
        </div>
      )}
    </div>
  )
}

export default ProductFilter