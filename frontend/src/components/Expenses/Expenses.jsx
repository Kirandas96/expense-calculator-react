import React, { useState, useEffect } from 'react';
import { expensesAPI, categoriesAPI } from '../../services/api';
import './Expenses.css';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, [categoryFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [expensesRes, categoriesRes] = await Promise.all([
        expensesAPI.getAll({ category: categoryFilter || undefined }),
        categoriesAPI.getAll(), // This will auto-initialize default categories if none exist
      ]);
      setExpenses(expensesRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
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
      if (editingExpense) {
        await expensesAPI.update(editingExpense._id, formData);
      } else {
        await expensesAPI.create(formData);
      }
      resetForm();
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving expense');
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      amount: expense.amount,
      description: expense.description,
      category: expense.category._id,
      date: expense.date.split('T')[0],
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expensesAPI.delete(id);
        loadData();
      } catch (error) {
        alert('Error deleting expense');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      amount: '',
      description: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
    });
    setEditingExpense(null);
  };

  const filteredExpenses = expenses.filter(exp =>
    exp.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading expenses...</div>;
  }

  return (
    <div className="expenses">
      <div className="section-header">
        <h2>Manage Expenses</h2>
      </div>

      <div className="expense-form-card card">
        <h3>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="expense-amount">Amount (₹)</label>
            <input
              type="number"
              id="expense-amount"
              name="amount"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="expense-description">Description</label>
            <input
              type="text"
              id="expense-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="expense-category">Category</label>
            <select
              id="expense-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="expense-date">Date</label>
            <input
              type="date"
              id="expense-date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingExpense ? 'Update Expense' : 'Add Expense'}
            </button>
            {editingExpense && (
              <button type="button" onClick={resetForm} className="btn btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="expenses-list-card card">
        <h3>Expenses List</h3>
        <div className="list-filters">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="expenses-list">
          {filteredExpenses.length === 0 ? (
            <p className="empty-state">No expenses found. Add your first expense above!</p>
          ) : (
            filteredExpenses.map(exp => {
              const category = exp.category || { name: 'Uncategorized', color: '#94a3b8' };
              const date = new Date(exp.date).toLocaleDateString();
              return (
                <div
                  key={exp._id}
                  className="expense-item"
                  style={{ borderLeftColor: category.color }}
                >
                  <div className="expense-item-info">
                    <div className="expense-item-description">{exp.description}</div>
                    <div className="expense-item-meta">
                      <span>{category.name}</span>
                      <span>{date}</span>
                    </div>
                  </div>
                  <div className="expense-item-amount">₹{exp.amount.toFixed(2)}</div>
                  <div className="expense-item-actions">
                    <button
                      onClick={() => handleEdit(exp)}
                      className="btn btn-sm btn-primary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(exp._id)}
                      className="btn btn-sm btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Expenses;

