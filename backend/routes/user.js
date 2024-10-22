const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Order = require('../models/Order');
const Investment = require('../models/Investment');

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching profile' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, phone, address },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error updating profile' });
  }
});

// Get user orders
router.get('/orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId }).populate('items.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching orders' });
  }
});

// Get user investments
router.get('/investments', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const investments = await Investment.find({ user: req.user.userId });
    res.json({
      goldBalance: user.goldBalance,
      silverBalance: user.silverBalance,
      transactions: investments
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching investments' });
  }
});

module.exports = router;