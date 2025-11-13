import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart = ({ expenses, categories }) => {
  const categoryExpenses = {};
  
  expenses.forEach(exp => {
    const catId = exp.category?._id || 'uncategorized';
    if (!categoryExpenses[catId]) {
      categoryExpenses[catId] = {
        name: exp.category?.name || 'Uncategorized',
        color: exp.category?.color || '#94a3b8',
        amount: 0,
      };
    }
    categoryExpenses[catId].amount += exp.amount;
  });

  const categoryData = Object.values(categoryExpenses);
  const labels = categoryData.map(c => c.name);
  const data = categoryData.map(c => c.amount);
  const colors = categoryData.map(c => c.color);

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors,
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return label + ': ₹' + value.toFixed(2) + ' (' + percentage + '%)';
          },
        },
      },
    },
  };

  if (data.length === 0) {
    return (
      <div className="empty-chart">
        <p>No expenses to display</p>
      </div>
    );
  }

  return <Doughnut data={chartData} options={options} />;
};

export default ExpenseChart;

