const jwt = require('jsonwebtoken');
const Cart = require('../models/cart.model');
const User = require('../models/user.model');
const Product = require('../models/product.model');

// Token verification function
const verifyToken = (req) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    throw new Error('Not authorized, no token');
  }
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const decoded = verifyToken(req);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { productId, quantity } = req.body;

    // Validate product existence
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: user._id });

    if (!cart) {
      cart = new Cart({ user: user._id, cartItems: [] });
    }

    // Check if product already in cart
    const productExists = cart.cartItems.some(
      (item) => item.product.toString() === productId
    );

    if (productExists) {
      // If the product is already in the cart, update the quantity
      cart.cartItems = cart.cartItems.map(item =>
        item.product.toString() === productId
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      // Add new product to cart
      cart.cartItems.push({ product: productId, quantity });
    }

    await cart.save();

    res.status(201).json({ message: 'Product added to cart', cart });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// Get user's cart
const getCart = async (req, res) => {
  try {
    const decoded = verifyToken(req);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const cart = await Cart.findOne({ user: user._id }).populate('cartItems.product');

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const decoded = verifyToken(req);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { productId } = req.body;

    const cart = await Cart.findOne({ user: user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const productExists = cart.cartItems.some(
      (item) => item.product.toString() === productId
    );

    if (!productExists) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    cart.cartItems = cart.cartItems.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    res.status(200).json({ message: 'Item removed from cart', cart });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart
};
