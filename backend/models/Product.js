const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  weight: { type: Number, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true }
});

module.exports = mongoose.model('Product', ProductSchema);