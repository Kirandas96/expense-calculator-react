import React, { useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import Dashboard from '../components/Dashboard/Dashboard';
import Expenses from '../components/Expenses/Expenses';
import Budgets from '../components/Budgets/Budgets';
import './Home.css';

const Home = () => {
  const { user, logout } = React.useContext(AuthContext);
  const [activeSection, setActiveSection] = useState('dashboard');

  return (
    <div className="home-container">
      <header className="app-header">
        <h1>💰 Expense Calculator</h1>
        <p className="subtitle">Track your spending with beautiful insights</p>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={logout} className="btn btn-sm btn-secondary">
            Logout
          </button>
        </div>
      </header>

      <nav className="sidebar">
        <button
          className={`nav-btn ${activeSection === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveSection('dashboard')}
        >
          📊 Dashboard
        </button>
        <button
          className={`nav-btn ${activeSection === 'expenses' ? 'active' : ''}`}
          onClick={() => setActiveSection('expenses')}
        >
          💸 Expenses
        </button>
        <button
          className={`nav-btn ${activeSection === 'budgets' ? 'active' : ''}`}
          onClick={() => setActiveSection('budgets')}
        >
          🎯 Budgets
        </button>
      </nav>

      <main className="main-content">
        {activeSection === 'dashboard' && <Dashboard />}
        {activeSection === 'expenses' && <Expenses />}
        {activeSection === 'budgets' && <Budgets />}
      </main>
    </div>
  );
};

export default Home;

