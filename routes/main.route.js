const router = require("express").Router();
const userRoutes = require('./customRoutes/user.routes');
const contactRoutes = require('./customRoutes/contact.route');
const categoryRoutes = require('./customRoutes/category.route');
const productRoutes = require('./customRoutes/product.route');
const wishlistRoutes = require('./customRoutes/wishlist.route');
const cartRoutes = require('./customRoutes/cart.route');
const orderRoutes = require('./customRoutes/order.route');

router.use('/users',userRoutes);
router.use('/contact',contactRoutes);
router.use('/categories',categoryRoutes);
router.use('/product',productRoutes);
router.use('/wishlist',wishlistRoutes);
router.use('/cart',cartRoutes);
router.use('/order',orderRoutes);

module.exports = router;