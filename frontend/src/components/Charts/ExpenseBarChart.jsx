import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ExpenseBarChart = ({ expenses }) => {
  // Group expenses by day
  const expensesByDay = {};
  const dayDateMap = {}; // Map day labels to Date objects for sorting
  
  expenses.forEach(exp => {
    const date = new Date(exp.date);
    const dayKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    if (!expensesByDay[dayKey]) {
      expensesByDay[dayKey] = 0;
      dayDateMap[dayKey] = date;
    }
    expensesByDay[dayKey] += exp.amount;
  });

  // Sort by date
  const sortedDays = Object.keys(expensesByDay).sort((a, b) => {
    return dayDateMap[a] - dayDateMap[b];
  });

  const labels = sortedDays;
  const data = sortedDays.map(day => expensesByDay[day]);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Expense (₹)',
        data,
        backgroundColor: 'rgba(255, 107, 53, 0.6)',
        borderColor: 'rgba(255, 107, 53, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return '₹' + context.parsed.y.toFixed(2);
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + value.toFixed(0);
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

  return <Bar data={chartData} options={options} />;
};

export default ExpenseBarChart;

