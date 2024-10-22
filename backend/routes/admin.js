const express = require('express');
const adminAuth = require('../middleware/adminAuth');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

const router = express.Router();

// Get all orders
router.get('/orders', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('items.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching orders' });
  }
});

// Get all products
router.get('/products', adminAuth, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products' });
  }
});

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// Update investment rates
router.post('/investment/rates', adminAuth, async (req, res) => {
  try {
    const { goldRate, silverRate } = req.body;
    // Here you would update the rates in your database or a separate collection
    // For simplicity, we'll just send a success message
    res.json({ message: 'Rates updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating rates' });
  }
});

module.exports = router;