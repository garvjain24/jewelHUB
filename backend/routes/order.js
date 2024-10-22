const express = require('express');
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

const router = express.Router();

// Create a new order
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const cart = await Cart.findOne({ user: req.user.userId }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price
    }));

    const totalValue = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const order = new Order({
      user: req.user.userId,
      items: orderItems,
      totalValue
    });

    await order.save();

    // Clear the user's cart
    await Cart.findOneAndUpdate(
      { user: req.user.userId },
      { $set: { items: [] } }
    );

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Error creating order' });
  }
});

// Get a specific order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.user.toString() !== req.user.userId) return res.status(403).json({ error: 'Not authorized' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching order' });
  }
});

module.exports = router;