const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

const router = express.Router();

// Add product to cart
router.post("/", auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.user.userId);
    const product = await Product.findById(productId);

    if (!product) return res.status(404).json({ error: "Product not found" });

    let cart = await Cart.findOne({ user: user._id });

    if (!cart) {
      cart = new Cart({ user: user._id, items: [] });
    }

    const cartItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (cartItemIndex > -1) {
      cart.items[cartItemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.json(cart.items);
  } catch (error) {
    res.status(500).json({ error: "Error adding to cart" });
  }
});

// Get user's cart
router.get("/", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId }).populate(
      "items.product"
    );
    if (!cart) return res.status(404).json({ error: "Cart not found" });
    res.json(cart.items);
  } catch (error) {
    res.status(500).json({ error: "Error fetching cart" });
  }
});

// Remove product from cart
router.delete("/:productId", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== req.params.productId
    );
    await cart.save();
    res.json(cart.items);
  } catch (error) {
    res.status(500).json({ error: "Error removing from cart" });
  }
});

module.exports = router;
