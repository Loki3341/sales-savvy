// pages/admin/CategoryManagement.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../hooks/useAuth';
import '../../assets/styles/globals.css';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/login');
      return;
    }
    // Simulate loading categories
    setTimeout(() => {
      setCategories([
        { id: 1, name: 'Electronics', description: 'Electronic devices and accessories', productCount: 15 },
        { id: 2, name: 'Sports', description: 'Sports equipment and apparel', productCount: 8 },
        { id: 3, name: 'Home', description: 'Home and kitchen appliances', productCount: 12 },
        { id: 4, name: 'Fashion', description: 'Clothing and accessories', productCount: 20 },
        { id: 5, name: 'Books', description: 'Books and educational materials', productCount: 5 }
      ]);
      setLoading(false);
    }, 1000);
  }, [user, isAdmin, navigate]);

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategory.name.trim()) {
      const category = {
        id: categories.length + 1,
        name: newCategory.name,
        description: newCategory.description,
        productCount: 0
      };
      setCategories([...categories, category]);
      setNewCategory({ name: '', description: '' });
      setShowAddForm(false);
    }
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? Products in this category will become uncategorized.')) {
      setCategories(categories.filter(c => c.id !== categoryId));
    }
  };

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="App">
      <Header />
      <main className="admin-page">
        <div className="admin-header">
          <h1>Category Management</h1>
          <p>Organize products into categories</p>
        </div>

        <div className="admin-actions">
          <button 
            className="btn-primary" 
            onClick={() => setShowAddForm(!showAddForm)}
          >
            + Add New Category
          </button>
        </div>

        {showAddForm && (
          <div className="add-form">
            <h3>Add New Category</h3>
            <form onSubmit={handleAddCategory}>
              <div className="form-group">
                <label>Category Name *</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  rows="3"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">Add Category</button>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="admin-content">
          {loading ? (
            <div className="loading">Loading categories...</div>
          ) : (
            <div className="categories-grid">
              {categories.map(category => (
                <div key={category.id} className="category-card">
                  <div className="category-header">
                    <h3>{category.name}</h3>
                    <span className="product-count">{category.productCount} products</span>
                  </div>
                  <p className="category-description">{category.description}</p>
                  <div className="category-actions">
                    <button className="btn-secondary">Edit</button>
                    <button 
                      className="btn-danger"
                      onClick={() => handleDeleteCategory(category.id)}
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

export default CategoryManagement;