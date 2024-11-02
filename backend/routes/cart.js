const express = require("express");
const auth = require("../middleware/auth");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const router = express.Router();

// Get cart
router.get("/", auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.userId }).populate('items.product');
    
    if (!cart) {
      cart = new Cart({ user: req.user.userId, items: [] });
      await cart.save();
    }
    
    res.json(cart.items);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Error fetching cart' });
  }
});

// Add/Update cart item
router.post("/", auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      cart = new Cart({ user: req.user.userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    
    // Populate the product details before sending response
    await cart.populate('items.product');
    res.json(cart.items);
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'Error updating cart' });
  }
});

// Update item quantity
router.put("/:itemId", auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user.userId });
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => 
      item._id.toString() === req.params.itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    
    await cart.populate('items.product');
    res.json(cart.items);
  } catch (error) {
    console.error('Error updating quantity:', error);
    res.status(500).json({ error: 'Error updating quantity' });
  }
});

// Remove item from cart
router.delete("/:itemId", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId });
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => 
      item._id.toString() !== req.params.itemId
    );
    
    await cart.save();
    await cart.populate('items.product');
    res.json(cart.items);
  } catch (error) {
    console.error('Error removing item:', error);
    res.status(500).json({ error: 'Error removing item' });
  }
});

module.exports = router;