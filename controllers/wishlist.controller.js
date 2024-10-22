const jwt = require('jsonwebtoken');
const Wishlist = require('../models/wishlist.model');
const User = require('../models/user.model');

// Token verification function
const verifyToken = (req) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    throw new Error('Not authorized, no token');
  }
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Add to wishlist
const addToWishlist = async (req, res) => {
  try {
    const decoded = verifyToken(req);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({ user: user._id });
    
    if (!wishlist) {
      wishlist = new Wishlist({ user: user._id, cartItems: [] });
    }

    const productExists = wishlist.cartItems.some(
      (item) => item.product.toString() === productId
    );

    if (productExists) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    wishlist.cartItems.push({ product: productId });
    await wishlist.save();

    res.status(201).json({ message: 'Product added to wishlist', wishlist });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// Get wishlist
const getWishlist = async (req, res) => {
  try {
    const decoded = verifyToken(req);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const wishlist = await Wishlist.findOne({ user: user._id }).populate('cartItems.product');

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist is empty' });
    }

    res.status(200).json(wishlist);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// Remove from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const decoded = verifyToken(req);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { productId } = req.params;
    const wishlist = await Wishlist.findOne({ user: user._id });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    const updatedCartItems = wishlist.cartItems.filter(
      (item) => item.product.toString() !== productId
    );

    if (wishlist.cartItems.length === updatedCartItems.length) {
      return res.status(404).json({ message: 'Product not found in wishlist' });
    }

    wishlist.cartItems = updatedCartItems;
    await wishlist.save();

    res.status(200).json({ message: 'Product removed from wishlist', wishlist });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports = { addToWishlist, getWishlist, removeFromWishlist };
