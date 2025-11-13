import React, { useState, useEffect } from 'react';
import { expensesAPI, categoriesAPI, budgetsAPI } from '../../services/api';
import ExpenseChart from '../Charts/ExpenseChart';
import ExpenseBarChart from '../Charts/ExpenseBarChart';
import './Dashboard.css';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ startDate: '', endDate: '' });

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [expensesRes, categoriesRes, budgetsRes] = await Promise.all([
        expensesAPI.getAll(filter),
        categoriesAPI.getAll(),
        budgetsAPI.getAll(),
      ]);
      setExpenses(expensesRes.data);
      setCategories(categoriesRes.data);
      setBudgets(budgetsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    loadData();
  };

  const clearFilter = () => {
    setFilter({ startDate: '', endDate: '' });
  };

  const calculateTotal = () => {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  };

  const calculateMonthly = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    return expenses
      .filter(exp => new Date(exp.date) >= firstDay)
      .reduce((sum, exp) => sum + exp.amount, 0);
  };

  const getBudgetStatus = () => {
    const overallBudget = budgets.find(b => b.type === 'overall');
    if (!overallBudget) return { spent: 0, budget: 0, remaining: 0 };

    const now = new Date();
    let startDate;
    if (overallBudget.period === 'monthly') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (overallBudget.period === 'weekly') {
      const dayOfWeek = now.getDay();
      startDate = new Date(now);
      startDate.setDate(now.getDate() - dayOfWeek);
    } else {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    const spent = expenses
      .filter(exp => new Date(exp.date) >= startDate)
      .reduce((sum, exp) => sum + exp.amount, 0);

    return {
      spent,
      budget: overallBudget.amount,
      remaining: overallBudget.amount - spent,
    };
  };

  const getCategoryBreakdown = () => {
    const breakdown = {};
    expenses.forEach(exp => {
      const catId = exp.category?._id || 'uncategorized';
      if (!breakdown[catId]) {
        breakdown[catId] = {
          name: exp.category?.name || 'Uncategorized',
          color: exp.category?.color || '#94a3b8',
          amount: 0,
        };
      }
      breakdown[catId].amount += exp.amount;
    });
    return Object.values(breakdown).sort((a, b) => b.amount - a.amount);
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  const totalExpenses = calculateTotal();
  const monthlyExpenses = calculateMonthly();
  const budgetStatus = getBudgetStatus();
  const categoryBreakdown = getCategoryBreakdown();
  const total = totalExpenses;

  return (
    <div className="dashboard">
      <div className="section-header">
        <h2>Dashboard</h2>
        <div className="date-filter">
          <label htmlFor="filter-start">From:</label>
          <input
            type="date"
            id="filter-start"
            className="date-input"
            value={filter.startDate}
            onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
          />
          <label htmlFor="filter-end">To:</label>
          <input
            type="date"
            id="filter-end"
            className="date-input"
            value={filter.endDate}
            onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
          />
          <button onClick={applyFilter} className="btn btn-primary">
            Apply Filter
          </button>
          <button onClick={clearFilter} className="btn btn-secondary">
            Clear
          </button>
        </div>
      </div>

      <div className="summary-cards">
        <div className="card">
          <h3>Total Expenses</h3>
          <p className="amount">₹{totalExpenses.toFixed(2)}</p>
        </div>
        <div className="card">
          <h3>Budget Status</h3>
          <p className="amount">
            ₹{budgetStatus.spent.toFixed(2)} / ₹{budgetStatus.budget.toFixed(2)}
          </p>
          <p className="status-text">
            {budgetStatus.budget > 0
              ? budgetStatus.remaining >= 0
                ? `Remaining: ₹${budgetStatus.remaining.toFixed(2)}`
                : `Over budget by ₹${Math.abs(budgetStatus.remaining).toFixed(2)}`
              : 'No budget set'}
          </p>
        </div>
        <div className="card">
          <h3>Categories</h3>
          <p className="amount">{categories.length}</p>
        </div>
        <div className="card">
          <h3>This Month</h3>
          <p className="amount">₹{monthlyExpenses.toFixed(2)}</p>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-wrapper">
          <ExpenseChart expenses={expenses} categories={categories} />
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-wrapper">
          <ExpenseBarChart expenses={expenses} />
        </div>
      </div>

      <div className="category-breakdown">
        <h3>Category Breakdown</h3>
        <div className="category-list">
          {categoryBreakdown.length === 0 ? (
            <p className="empty-state">No expenses in selected period</p>
          ) : (
            categoryBreakdown.map((cat, index) => {
              const percentage = total > 0 ? ((cat.amount / total) * 100).toFixed(1) : 0;
              return (
                <div
                  key={index}
                  className="category-item"
                  style={{ borderLeftColor: cat.color }}
                >
                  <div className="category-item-info">
                    <div
                      className="category-color-dot"
                      style={{ backgroundColor: cat.color }}
                    ></div>
                    <div className="category-item-name">{cat.name}</div>
                  </div>
                  <div className="category-item-amount">
                    ₹{cat.amount.toFixed(2)} ({percentage}%)
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

export default Dashboard;

