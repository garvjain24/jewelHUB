const express = require("express");
const Stripe = require("stripe");
const auth = require("../middleware/auth");
const GiftCard = require("../models/GiftCard");
const { sendGiftCard } = require("../utils/emailService");

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Generate a new gift card
router.post("/generate", auth, async (req, res) => {
  try {
    const { amount, recipientEmail } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Gift Card",
              description: `Gift Card worth ₹${amount}`,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/gift-card?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/gift-card`,
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    res.status(500).json({ error: "Error generating gift card" });
  }
});

router.post("/verify-purchase", auth, async (req, res) => {
  try {
    const { sessionId, amount, recipientEmail } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const code = Math.random().toString(36).substring(2, 18).toUpperCase();
      const giftCard = new GiftCard({
        code,
        amount,
        user: req.user.userId,
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      });

      await giftCard.save();

      if (recipientEmail) {
        await sendGiftCard(giftCard, recipientEmail);
      }

      res.json({ success: true, code });
    } else {
      res.status(400).json({ error: "Payment not completed" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error verifying gift card purchase" });
  }
});

// Get gift card details
router.get("/:code", async (req, res) => {
  try {
    const giftCard = await GiftCard.findOne({ code: req.params.code });
    if (!giftCard)
      return res.status(404).json({ error: "Gift card not found" });
    res.json(giftCard);
  } catch (error) {
    res.status(500).json({ error: "Error fetching gift card" });
  }
});

// Redeem a gift card
router.post("/redeem", auth, async (req, res) => {
  try {
    const { code } = req.body;
    const giftCard = await GiftCard.findOne({ code });
    if (!giftCard)
      return res.status(404).json({ error: "Gift card not found" });
    if (giftCard.isRedeemed)
      return res.status(400).json({ error: "Gift card already redeemed" });
    if (giftCard.expiryDate < Date.now())
      return res.status(400).json({ error: "Gift card expired" });

    giftCard.isRedeemed = true;
    await giftCard.save();

    // Here you would apply the gift card amount to the user's order
    // For simplicity, we'll just return a success message
    res.json({
      message: "Gift card redeemed successfully",
      amount: giftCard.amount,
    });
  } catch (error) {
    res.status(500).json({ error: "Error redeeming gift card" });
  }
});

module.exports = router;
