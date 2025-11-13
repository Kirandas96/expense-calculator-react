import React, { useState, useEffect } from 'react';
import { categoriesAPI } from '../../services/api';
import './Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#FF6B35',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoriesAPI.update(editingCategory._id, formData);
      } else {
        await categoriesAPI.create(formData);
      }
      resetForm();
      loadCategories();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving category');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      color: category.color,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? Expenses in this category will be uncategorized.')) {
      try {
        await categoriesAPI.delete(id);
        loadCategories();
      } catch (error) {
        alert('Error deleting category');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      color: '#FF6B35',
    });
    setEditingCategory(null);
  };

  // Initialize default categories if none exist
  const initializeDefaults = async () => {
    const defaultCategories = [
      { name: 'Food', color: '#ef4444' },
      { name: 'Fuel', color: '#f59e0b' },
      { name: 'Dress', color: '#8b5cf6' },
      { name: 'Groceries', color: '#10b981' },
      { name: 'Transport', color: '#3b82f6' },
      { name: 'Entertainment', color: '#ec4899' },
      { name: 'Bills', color: '#6366f1' },
      { name: 'Healthcare', color: '#14b8a6' },
      { name: 'Shopping', color: '#f97316' },
      { name: 'Others', color: '#94a3b8' },
    ];

    try {
      for (const cat of defaultCategories) {
        await categoriesAPI.create(cat);
      }
      loadCategories();
    } catch (error) {
      console.error('Error initializing categories:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading categories...</div>;
  }

  return (
    <div className="categories">
      <div className="section-header">
        <h2>Manage Categories</h2>
        {categories.length === 0 && (
          <button onClick={initializeDefaults} className="btn btn-secondary">
            Initialize Default Categories
          </button>
        )}
      </div>

      <div className="category-form-card card">
        <h3>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="category-name">Category Name</label>
            <input
              type="text"
              id="category-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category-color">Color</label>
            <input
              type="color"
              id="category-color"
              name="color"
              value={formData.color}
              onChange={handleChange}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingCategory ? 'Update Category' : 'Add Category'}
            </button>
            {editingCategory && (
              <button type="button" onClick={resetForm} className="btn btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="categories-list-card card">
        <h3>Your Categories</h3>
        <div className="categories-grid">
          {categories.length === 0 ? (
            <p className="empty-state">No categories yet. Add your first category above!</p>
          ) : (
            categories.map(cat => (
              <div
                key={cat._id}
                className="category-card"
                style={{ borderLeftColor: cat.color }}
              >
                <div className="category-card-header">
                  <div
                    className="category-card-color"
                    style={{ backgroundColor: cat.color }}
                  ></div>
                  <div className="category-card-name">{cat.name}</div>
                  <div className="category-card-actions">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="btn btn-sm btn-primary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="btn btn-sm btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;

