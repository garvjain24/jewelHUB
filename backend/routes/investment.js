const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User");
const Investment = require("../models/Investment");

const router = express.Router();

// Get current rates
router.get("/rates", async (req, res) => {
  try {
    // Here you would fetch the current rates from your database
    // For simplicity, we'll use hardcoded values
    res.json({ goldRate: 5300, silverRate: 100 });
  } catch (error) {
    res.status(500).json({ error: "Error fetching rates" });
  }
});

// Buy digital gold or silver
router.post("/buy", auth, async (req, res) => {
  try {
    const { type, amount } = req.body;
    const rates = { Gold: 5300, Silver: 100 };
    const price = amount * rates[type];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Digital ${type}`,
              description: `${amount}g of Digital ${type}`,
            },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/investment?session_id={CHECKOUT_SESSION_ID}&type=buy`,
      cancel_url: `${process.env.FRONTEND_URL}/investment`,
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("Error processing investment:", error);
    res.status(500).json({ error: "Error processing investment" });
  }
});

router.post("/verify-buy", auth, async (req, res) => {
  try {
    const { sessionId, type, amount } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const user = await User.findById(req.user.userId);
      const rates = { Gold: 5300, Silver: 100 };

      const investment = new Investment({
        user: req.user.userId,
        type,
        amount,
        price: amount * rates[type],
      });

      await investment.save();

      if (type === "Gold") {
        user.goldBalance += amount;
      } else {
        user.silverBalance += amount;
      }

      await user.save();

      // Send investment confirmation email
      await sendInvestmentConfirmation(investment, user);

      res.json({ success: true });
    } else {
      res.status(400).json({ error: "Payment not completed" });
    }
  } catch (error) {
    console.error("Error verifying investment:", error);
    res.status(500).json({ error: "Error verifying investment" });
  }
});

router.get("/view", auth, async (req, res) => {
  try {
    const investments = await Investment.find({ user: req.user.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(investments);
  } catch (error) {
    console.error("Error fetching investments:", error);
    res.status(500).json({ error: "Error fetching investments" });
  }
});

// Sell digital gold or silver
router.post("/sell", auth, async (req, res) => {
  try {
    const { type, amount } = req.body;
    const user = await User.findById(req.user.userId);
    const rates = { Gold: 5300, Silver: 100 }; // Fetch these from your database in a real application

    if (type === "Gold" && user.goldBalance < amount) {
      return res.status(400).json({ error: "Insufficient gold balance" });
    }
    if (type === "Silver" && user.silverBalance < amount) {
      return res.status(400).json({ error: "Insufficient silver balance" });
    }

    const price = amount * rates[type];
    if (isNaN(price)) {
      return res.status(400).json({ error: "Invalid price calculation" });
    }

    const investment = new Investment({
      user: req.user.userId,
      type,
      amount: -amount,
      price: amount * rates[type],
    });

    await investment.save();

    if (type === "Gold") {
      user.goldBalance -= amount;
    } else {
      user.silverBalance -= amount;
    }

    await user.save();

    res.status(201).json(investment);
  } catch (error) {
    console.error("Error processing investment:", error);
    res.status(500).json({ error: "Error processing investment" });
  }
});

router.get("/balances", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.json({
      goldBalance: user.goldBalance,
      silverBalance: user.silverBalance,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
