const express = require('express');
const auth = require('../middleware/auth');
const GiftCard = require('../models/GiftCard');

const router = express.Router();

// Generate a new gift card
router.post('/generate', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    if (amount < 5000 || amount > 99999) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const code = Math.random().toString(36).substring(2, 18).toUpperCase();
    const giftCard = new GiftCard({
      code,
      amount,
      user: req.user.userId,
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
    });

    await giftCard.save();
    res.status(201).json(giftCard);
  } catch (error) {
    res.status(500).json({ error: 'Error generating gift card' });
  }
});

// Get gift card details
router.get('/:code', async (req, res) => {
  try {
    const giftCard = await GiftCard.findOne({ code: req.params.code });
    if (!giftCard) return res.status(404).json({ error: 'Gift card not found' });
    res.json(giftCard);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching gift card' });
  }
});

// Redeem a gift card
router.post('/redeem', auth, async (req, res) => {
  try {
    const { code } = req.body;
    const giftCard = await GiftCard.findOne({ code });
    if (!giftCard) return res.status(404).json({ error: 'Gift card not found' });
    if (giftCard.isRedeemed) return res.status(400).json({ error: 'Gift card already redeemed' });
    if (giftCard.expiryDate < Date.now()) return res.status(400).json({ error: 'Gift card expired' });

    giftCard.isRedeemed = true;
    await giftCard.save();

    // Here you would apply the gift card amount to the user's order
    // For simplicity, we'll just return a success message
    res.json({ message: 'Gift card redeemed successfully', amount: giftCard.amount });
  } catch (error) {
    res.status(500).json({ error: 'Error redeeming gift card' });
  }
});

module.exports = router;