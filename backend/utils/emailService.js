const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendOrderConfirmation = async (order, user) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: user.email,
    subject: 'Order Confirmation - Royal Jewels',
    html: `
      <h1>Thank you for your order!</h1>
      <p>Order ID: ${order._id}</p>
      <p>Total Amount: ₹${order.totalValue}</p>
      <h2>Order Details:</h2>
      <ul>
        ${order.items.map(item => `
          <li>${item.product.name} x ${item.quantity} - ₹${item.price * item.quantity}</li>
        `).join('')}
      </ul>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendGiftCard = async (giftCard, recipientEmail) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: recipientEmail,
    subject: 'Your Royal Jewels Gift Card',
    html: `
      <h1>Your Gift Card Details</h1>
      <p>Amount: ₹${giftCard.amount}</p>
      <p>Code: ${giftCard.code}</p>
      <p>Valid until: ${new Date(giftCard.expiryDate).toLocaleDateString()}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendInvestmentConfirmation = async (investment, user) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: user.email,
    subject: 'Investment Confirmation - Royal Jewels',
    html: `
      <h1>Investment Confirmation</h1>
      <p>Type: ${investment.type}</p>
      <p>Amount: ${Math.abs(investment.amount)}g</p>
      <p>Value: ₹${investment.price}</p>
      <p>Transaction Type: ${investment.amount > 0 ? 'Purchase' : 'Sale'}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendOrderConfirmation,
  sendGiftCard,
  sendInvestmentConfirmation
}