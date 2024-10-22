const mongoose = require('mongoose');

const GiftCardSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  expiryDate: { type: Date },
  isRedeemed: { type: Boolean, default: false }
});

module.exports = mongoose.model('GiftCard', GiftCardSchema);