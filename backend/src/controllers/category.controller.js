const Category = require('../models/Category');

// Default categories
const DEFAULT_CATEGORIES = [
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

// @desc    Get all categories (auto-initialize defaults if none exist)
// @route   GET /api/categories
// @access  Private
const getCategories = async (req, res) => {
  try {
    let categories = await Category.find({ user: req.user._id }).sort({ name: 1 });
    
    // Auto-initialize default categories if none exist
    if (categories.length === 0) {
      const defaultCategories = DEFAULT_CATEGORIES.map(cat => ({
        ...cat,
        user: req.user._id,
      }));
      categories = await Category.insertMany(defaultCategories);
    }
    
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private
const createCategory = async (req, res) => {
  try {
    const category = await Category.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json(category);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Category name already exists' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (category.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (category.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await category.deleteOne();
    res.json({ message: 'Category removed', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};

