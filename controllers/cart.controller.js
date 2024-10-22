const Cart = require('../models/cart.model');
const mongoose = require('mongoose');

const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    // Check if the cart already exists for the user
    let cart = await Cart.findOne({ user: userId });

    // If not, create a new cart
    if (!cart) {
      cart = new Cart({ user: userId, cartItems: [] });
    }

    // Check if the product already exists in the cart
    const existingItemIndex = cart.cartItems.findIndex(item => item.product.toString() === productId);

    if (existingItemIndex > -1) {
      // If product exists, update the quantity
      cart.cartItems[existingItemIndex].quantity += quantity;
    } else {
      // If product doesn't exist, add it to the cart
      cart.cartItems.push({ product: mongoose.Types.ObjectId(productId), quantity });
    }

    // Save the cart
    await cart.save();

    res.status(200).json({ message: 'Product added to cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { addToCart };
