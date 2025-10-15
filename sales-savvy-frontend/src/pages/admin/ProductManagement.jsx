// pages/admin/ProductManagement.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../hooks/useAuth';
import '../../assets/styles/globals.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/login');
      return;
    }
    // Simulate loading products
    setTimeout(() => {
      setProducts([
        {
          id: 1,
          name: 'Wireless Headphones',
          price: 99.99,
          category: 'Electronics',
          stock: 45,
          image: '/images/headphones.jpg',
          status: 'active'
        },
        {
          id: 2,
          name: 'Running Shoes',
          price: 129.99,
          category: 'Sports',
          stock: 23,
          image: '/images/shoes.jpg',
          status: 'active'
        },
        {
          id: 3,
          name: 'Coffee Maker',
          price: 79.99,
          category: 'Home',
          stock: 0,
          image: '/images/coffee-maker.jpg',
          status: 'out-of-stock'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, [user, isAdmin, navigate]);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'all' || product.category === selectedCategory)
  );

  const handleAddProduct = () => {
    navigate('/admin/products/new');
  };

  const handleEditProduct = (productId) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const categories = ['all', 'Electronics', 'Sports', 'Home', 'Fashion', 'Books'];

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="App">
      <Header />
      <main className="admin-page">
        <div className="admin-header">
          <h1>Product Management</h1>
          <p>Manage your product inventory</p>
        </div>

        <div className="admin-actions">
          <div className="search-filter">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            <button className="btn-primary" onClick={handleAddProduct}>
              + Add New Product
            </button>
          </div>
        </div>

        <div className="admin-content">
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                    <div className={`stock-badge ${product.stock === 0 ? 'out-of-stock' : 'in-stock'}`}>
                      {product.stock === 0 ? 'Out of Stock' : `${product.stock} in stock`}
                    </div>
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="category">{product.category}</p>
                    <p className="price">${product.price}</p>
                  </div>
                  <div className="product-actions">
                    <button 
                      className="btn-secondary"
                      onClick={() => handleEditProduct(product.id)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn-danger"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductManagement;