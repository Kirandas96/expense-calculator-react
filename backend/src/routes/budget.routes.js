const express = require('express');
const router = express.Router();
const {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} = require('../controllers/budget.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/').get(protect, getBudgets).post(protect, createBudget);
router.route('/:id').put(protect, updateBudget).delete(protect, deleteBudget);

module.exports = router;

