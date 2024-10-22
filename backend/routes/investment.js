const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Investment = require('../models/Investment');

const router = express.Router();

// Get current rates
router.get('/rates', async (req, res) => {
  try {
    // Here you would fetch the current rates from your database
    // For simplicity, we'll use hardcoded values
    res.json({ goldRate: 5500, silverRate: 70 });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching rates' });
  }
});

// Buy digital gold or silver
router.post('/buy', auth, async (req, res) => {
  try {
    const { type, amount } = req.body;
    const user = await User.findById(req.user.userId);
    const rates = { Gold: 5500, Silver: 70 }; // Fetch these from your database in a real application

    const investment = new Investment({
      user: req.user.userId,
      type,
      amount,
      price: amount * rates[type]
    });

    await investment.save();

    if (type === 'Gold') {
      user.goldBalance += amount;
    } else {
      user.silverBalance += amount;
    }

    await user.save();

    res.status(201).json(investment);
  } catch (error) {
    res.status(500).json({ error: 'Error processing investment' });
  }
});

// Sell digital gold or silver
router.post('/sell', auth, async (req, res) => {
  try {
    const { type, amount } = req.body;
    const user = await User.findById(req.user.userId);
    const rates = { Gold: 5500, Silver: 70 }; // Fetch these from your database in a real application

    if (type === 'Gold' && user.goldBalance < amount) {
      return res.status(400).json({ error: 'Insufficient gold balance' });
    }
    if (type === 'Silver' && user.silverBalance < amount) {
      return res.status(400).json({ error: 'Insufficient silver balance' });
    }

    const investment = new Investment({
      user: req.user.userId,
      type,
      amount: -amount,
      price: amount * rates[type]
    });

    await investment.save();

    if (type === 'Gold') {
      user.goldBalance -= amount;
    } else {
      user.silverBalance -= amount;
    }

    await user.save();

    res.status(201).json(investment);
  } catch (error) {
    res.status(500).json({ error: 'Error processing investment' });
  }
});

module.exports = router;