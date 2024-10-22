const express = require('express');
const Stripe = require('stripe');
const auth = require('../middleware/auth');
const Order = require('../models/Order');

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/checkout', auth, async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId).populate('items.product');
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: order.items.map(item => ({
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.product.name,
          },
          unit_amount: item.price * 100, // Stripe expects amount in cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/order/cancel`,
    });

    // Update the order with the Stripe session ID
    order.stripeSessionId = session.id;
    await order.save();

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: 'Error processing payment' });
  }
});

// Webhook to handle successful payments
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Update the order status to 'Completed'
    const order = await Order.findOne({ stripeSessionId: session.id });
    if (order) {
      order.status = 'Completed';
      await order.save();
    }
  }

  res.json({received: true});
});

module.exports = router;