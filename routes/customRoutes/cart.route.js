const express = require('express');
const router = express.Router();
const { addToCart } = require('../../controllers/cart.controller');

    
// Add to cart
router.post('/add', addToCart);

module.exports = router;
