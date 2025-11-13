import React, { useState, useEffect } from 'react';
import { budgetsAPI, categoriesAPI, expensesAPI } from '../../services/api';
import './Budgets.css';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    type: 'overall',
    category: '',
    amount: '',
    period: 'monthly',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [budgetsRes, categoriesRes, expensesRes] = await Promise.all([
        budgetsAPI.getAll(),
        categoriesAPI.getAll(),
        expensesAPI.getAll(),
      ]);
      setBudgets(budgetsRes.data);
      setCategories(categoriesRes.data);
      setExpenses(expensesRes.data);
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
      // Only include category if type is 'category' and category is selected
      const budgetData = {
        type: formData.type,
        amount: formData.amount,
        period: formData.period,
      };
      
      if (formData.type === 'category' && formData.category) {
        budgetData.category = formData.category;
      }
      
      await budgetsAPI.create(budgetData);
      setFormData({
        type: 'overall',
        category: '',
        amount: '',
        period: 'monthly',
      });
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving budget');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await budgetsAPI.delete(id);
        loadData();
      } catch (error) {
        alert('Error deleting budget');
      }
    }
  };

  const calculateBudgetSpent = (budget) => {
    let filteredExpenses = [...expenses];

    const now = new Date();
    let startDate;

    if (budget.period === 'monthly') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (budget.period === 'weekly') {
      const dayOfWeek = now.getDay();
      startDate = new Date(now);
      startDate.setDate(now.getDate() - dayOfWeek);
      startDate.setHours(0, 0, 0, 0);
    } else if (budget.period === 'yearly') {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    if (startDate) {
      filteredExpenses = filteredExpenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate >= startDate && expDate <= now;
      });
    }

    if (budget.type === 'category' && budget.category) {
      filteredExpenses = filteredExpenses.filter(
        exp => exp.category?._id === budget.category._id
      );
    }

    return filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  };

  if (loading) {
    return <div className="loading">Loading budgets...</div>;
  }

  return (
    <div className="budgets">
      <div className="section-header">
        <h2>Manage Budgets</h2>
      </div>

      <div className="budget-form-card card">
        <h3>Set Budget</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="budget-type">Budget Type</label>
            <select
              id="budget-type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="overall">Overall Budget</option>
              <option value="category">Category Budget</option>
            </select>
          </div>
          {formData.type === 'category' && (
            <div className="form-group">
              <label htmlFor="budget-category">Category</label>
              <select
                id="budget-category"
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
          )}
          <div className="form-group">
            <label htmlFor="budget-amount">Budget Amount (₹)</label>
            <input
              type="number"
              id="budget-amount"
              name="amount"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="budget-period">Period</label>
            <select
              id="budget-period"
              name="period"
              value={formData.period}
              onChange={handleChange}
              required
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Set Budget
            </button>
          </div>
        </form>
      </div>

      <div className="budgets-list-card card">
        <h3>Your Budgets</h3>
        <div className="budgets-list">
          {budgets.length === 0 ? (
            <p className="empty-state">No budgets set yet. Set your first budget above!</p>
          ) : (
            budgets.map(budget => {
              const spent = calculateBudgetSpent(budget);
              const percentage = (spent / budget.amount) * 100;
              const remaining = budget.amount - spent;
              const statusClass = percentage >= 100 ? 'danger' : percentage >= 80 ? 'warning' : '';
              
              const title = budget.type === 'overall'
                ? 'Overall Budget'
                : budget.category?.name || 'Category Budget';

              return (
                <div key={budget._id} className="budget-item">
                  <div className="budget-item-header">
                    <div className="budget-item-title">{title}</div>
                    <div className="budget-item-amount">₹{budget.amount.toFixed(2)}</div>
                  </div>
                  <div className="budget-item-progress">
                    <div className="progress-bar">
                      <div
                        className={`progress-fill ${statusClass}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="budget-item-details">
                    <span>Spent: ₹{spent.toFixed(2)}</span>
                    <span>Remaining: ₹{remaining.toFixed(2)}</span>
                    <span>{budget.period}</span>
                  </div>
                  <div className="budget-item-actions">
                    <button
                      onClick={() => handleDelete(budget._id)}
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

export default Budgets;

