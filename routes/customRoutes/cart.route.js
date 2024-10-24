const express = require('express');
const router = express.Router();
const { addToCart, getCart, removeFromCart } = require('../../controllers/cart.controller');

// Route to add item to cart
router.post('/add', addToCart);

// Route to get the cart for the user
router.get('/', getCart);

// Route to remove item from cart
router.delete('/remove/:productId', removeFromCart);

module.exports = router;
