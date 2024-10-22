const mongoose = require('mongoose');

const wishListSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  cartItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
      }
    },
  ],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Wishlist', wishListSchema);
