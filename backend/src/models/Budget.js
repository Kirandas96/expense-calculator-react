const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['overall', 'category'],
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: function() {
      return this.type === 'category';
    },
  },
  amount: {
    type: Number,
    required: [true, 'Please provide a budget amount'],
    min: [0, 'Amount cannot be negative'],
  },
  period: {
    type: String,
    enum: ['monthly', 'weekly', 'yearly'],
    required: true,
    default: 'monthly',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Budget', budgetSchema);

