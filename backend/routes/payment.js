const express = require("express");
const Stripe = require("stripe");
const auth = require("../middleware/auth");
const Order = require("../models/Order");
const User = require("../models/User");
const GiftCard = require("../models/GiftCard");
const { sendOrderConfirmation } = require("../utils/emailService");

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/checkout", auth, async (req, res) => {
  try {
    const { orderId, giftCardCode } = req.body;
    const order = await Order.findById(orderId).populate("items.product");
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    let finalAmount = order.totalValue;

    // Apply gift card if provided
    if (giftCardCode) {
      const giftCard = await GiftCard.findOne({
        code: giftCardCode,
        isRedeemed: false,
      });
      if (giftCard) {
        finalAmount = Math.max(0, finalAmount - giftCard.amount);
        giftCard.isRedeemed = true;
        await giftCard.save();
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: order.items.map((item) => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: item.product.name,
          },
          unit_amount: item.product.price * 100, // Stripe expects amount in cents
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/checkout?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
    });

    // Update the order with the Stripe session ID
    order.stripeSessionId = session.id;
    await order.save();

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ error: "Error processing payment" });
  }
});

router.post("/verify", auth, async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const order = await Order.findOne({
        stripeSessionId: sessionId,
      }).populate("items.product");
      const user = await User.findById(req.user.userId);

      order.status = "Processing";
      await order.save();

      // Send order confirmation email
      await sendOrderConfirmation(order, user);

      res.json({ success: true });
    } else {
      res.status(400).json({ error: "Payment not completed" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: "Error verifying payment" });
  }
});

module.export = router;
