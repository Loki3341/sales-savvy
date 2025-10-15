import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { productService } from '../../services/productService'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { formatPrice } from '../../utils/helpers'
import '../../assets/styles/globals.css'

const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await productService.getProductById(id)
      setProduct(response)
      setError('')
    } catch (err) {
      setError('Product not found')
      console.error('Error fetching product:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    try {
      await addToCart(product.product_id, quantity)
      alert('Product added to cart successfully!')
    } catch (error) {
      console.error('Failed to add product to cart:', error)
      alert('Failed to add product to cart. Please try again.')
    }
  }

  const handleBuyNow = async () => {
    try {
      await addToCart(product.product_id, quantity)
      navigate('/cart')
    } catch (error) {
      console.error('Failed to add product to cart:', error)
      alert('Failed to add product to cart. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="App">
        <Header />
        <div className="main-content-wrapper">
          <main className="main-content">
            <LoadingSpinner text="Loading product details..." />
          </main>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="App">
        <Header />
        <div className="main-content-wrapper">
          <main className="main-content">
            <div className="container">
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <h2>Product Not Found</h2>
                <p style={{ marginBottom: '2rem' }}>{error || 'The product you are looking for does not exist.'}</p>
                <button
                  onClick={() => navigate('/customer-home')}
                  className="form-button"
                  style={{ maxWidth: '200px' }}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="App">
      <Header />
      
      {/* Main Content Wrapper for proper footer placement */}
      <div className="main-content-wrapper">
        <main className="main-content">
          <div className="container">
            <button
              onClick={() => navigate('/customer-home')}
              className="back-button"
            >
              ← Back to Products
            </button>

            <div className="product-detail-grid">
              {/* Product Images */}
              <div className="product-images">
                <div className="main-image">
                  <img
                    src={product.images?.[selectedImage] || 'https://via.placeholder.com/500x500?text=No+Image'}
                    alt={product.name}
                  />
                </div>
                {product.images && product.images.length > 1 && (
                  <div className="image-thumbnails">
                    {product.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        onClick={() => setSelectedImage(index)}
                        className={selectedImage === index ? 'thumbnail active' : 'thumbnail'}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="product-details">
                <h1>{product.name}</h1>
                <p className="price">{formatPrice(product.price)}</p>
                <p className="description">{product.description}</p>

                <div className="product-info">
                  <p>
                    <strong>Availability:</strong>{' '}
                    <span className={product.stock > 0 ? 'in-stock' : 'out-of-stock'}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </p>
                  <p><strong>Category:</strong> {product.category?.categoryName || 'Uncategorized'}</p>
                </div>

                {product.stock > 0 && (
                  <div className="purchase-section">
                    <div className="quantity-selector">
                      <label htmlFor="quantity">Quantity:</label>
                      <div className="quantity-controls">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="quantity-btn"
                        >
                          -
                        </button>
                        <span className="quantity-display">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                          className="quantity-btn"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="action-buttons">
                      <button
                        onClick={handleAddToCart}
                        className="form-button add-to-cart-btn"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={handleBuyNow}
                        className="buy-now-btn"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                )}

                {product.stock === 0 && (
                  <button
                    disabled
                    className="form-button out-of-stock-btn"
                  >
                    Out of Stock
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  )
}

export default ProductDetailPage