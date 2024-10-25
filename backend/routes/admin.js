const express = require("express");
const adminAuth = require("../middleware/adminAuth");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const Investment = require("../models/Investment");
const GiftCard = require("../models/GiftCard");

const router = express.Router();

// Get overview data
router.get("/overview", adminAuth, async (req, res) => {
  try {
    const totalSales = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalValue" } } },
    ]);
    const activeUsers = await User.countDocuments({ isActive: true });
    const productsSold = await Order.aggregate([
      { $unwind: "$items" },
      { $group: { _id: null, total: { $sum: "$items.quantity" } } },
    ]);
    const giftCardsIssued = await GiftCard.countDocuments();

    const salesOverTime = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: "$totalValue" },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]);

    const productCategorySales = await Order.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: "$product.category",
          sales: { $sum: { $multiply: ["$items.quantity", "$product.price"] } },
        },
      },
    ]);

    const goldVsSilverSales = await Investment.aggregate([
      { $group: { _id: "$type", totalAmount: { $sum: "$amount" } } },
    ]);

    res.json({
      totalSales: totalSales[0]?.total || 0,
      activeUsers,
      productsSold: productsSold[0]?.total || 0,
      giftCardsIssued,
      salesOverTime,
      productCategorySales,
      goldVsSilverSales: {
        gold:
          goldVsSilverSales.find((item) => item._id === "Gold")?.totalAmount ||
          0,
        silver:
          goldVsSilverSales.find((item) => item._id === "Silver")
            ?.totalAmount || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching overview data" });
  }
});

// Get all products
router.get("/products", adminAuth, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products" });
  }
});

// Update a product
router.put("/products/:id", adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Error updating product" });
  }
});

// Add a new product
router.post("/products", adminAuth, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: "Error creating product" });
  }
});

// Delete a product
router.delete("/products/:id", adminAuth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting product" });
  }
});

// Get all orders
router.get("/orders", adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .populate("items.product");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Error fetching orders" });
  }
});

// Update order status
router.put("/orders/:id/status", adminAuth, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Error updating order status" });
  }
});

// Get sales data
router.get("/sales-data", adminAuth, async (req, res) => {
  try {
    const salesData = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: "$totalValue" },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]);
    res.json(salesData);
  } catch (error) {
    res.status(500).json({ error: "Error fetching sales data" });
  }
});

// Get all users
router.get("/users", adminAuth, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

// Get user details
router.get("/users/:id", adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("orders")
      .populate("investments");
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user details" });
  }
});

// Ban user
router.put("/users/:id/ban", adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBanned: true },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error banning user" });
  }
});

// Get investment data
router.get("/investments", adminAuth, async (req, res) => {
  try {
    const totalGoldBought = await Investment.aggregate([
      { $match: { type: "Gold", amount: { $gt: 0 } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalSilverBought = await Investment.aggregate([
      { $match: { type: "Silver", amount: { $gt: 0 } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalGoldSold = await Investment.aggregate([
      { $match: { type: "Gold", amount: { $lt: 0 } } },
      { $group: { _id: null, total: { $sum: { $abs: "$amount" } } } },
    ]);
    const totalSilverSold = await Investment.aggregate([
      { $match: { type: "Silver", amount: { $lt: 0 } } },
      { $group: { _id: null, total: { $sum: { $abs: "$amount" } } } },
    ]);

    const investmentTrends = await Investment.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          goldAmount: {
            $sum: { $cond: [{ $eq: ["$type", "Gold"] }, "$amount", 0] },
          },
          silverAmount: {
            $sum: { $cond: [{ $eq: ["$type", "Silver"] }, "$amount", 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]);

    res.json({
      totalGoldBought: totalGoldBought[0]?.total || 0,
      totalSilverBought: totalSilverBought[0]?.total || 0,
      totalGoldSold: totalGoldSold[0]?.total || 0,
      totalSilverSold: totalSilverSold[0]?.total || 0,
      goldRate: 5300, // Replace with actual gold rate fetching logic
      silverRate: 100, // Replace with actual silver rate fetching logic
      investmentTrends,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching investment data" });
  }
});

// Update gold/silver rates
router.put("/investments/rates", adminAuth, async (req, res) => {
  try {
    // Update the rates in your database or external service
    // For simplicity, we'll just return a success message
    res.json({ message: "Rates updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error updating rates" });
  }
});

// Generate gift card
router.post("/giftcards", adminAuth, async (req, res) => {
  try {
    const { amount } = req.body;
    const code = Math.random().toString(36).substring(2, 18).toUpperCase();
    const giftCard = new GiftCard({ code, amount });
    await giftCard.save();
    res.status(201).json(giftCard);
  } catch (error) {
    res.status(500).json({ error: "Error generating gift card" });
  }
});

// Get all gift cards
router.get("/giftcards", adminAuth, async (req, res) => {
  try {
    const giftCards = await GiftCard.find();
    res.json(giftCards);
  } catch (error) {
    res.status(500).json({ error: "Error fetching gift cards" });
  }
});

// Get gift card stats
router.get("/giftcards/stats", adminAuth, async (req, res) => {
  try {
    const totalIssued = await GiftCard.countDocuments();
    const totalRedeemed = await GiftCard.countDocuments({ isRedeemed: true });
    const totalValue = await GiftCard.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({
      totalIssued,
      totalRedeemed,
      totalValue: totalValue[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching gift card stats" });
  }
});

module.exports = router;
