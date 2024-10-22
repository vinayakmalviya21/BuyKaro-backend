const express = require('express');
const router = express.Router();
const { addToWishlist,getWishlist,removeFromWishlist} = require('../../controllers/wishlist.controller');

    
// Add to wishlist
router.post('/add', addToWishlist);

// Get user's wishlist
router.get('/', getWishlist);

// Remove product from wishlist
router.delete('/remove/:productId', removeFromWishlist);

module.exports = router;
