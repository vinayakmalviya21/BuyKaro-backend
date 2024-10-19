const router = require("express").Router();
const userRoutes = require('./customRoutes/user.routes');
const contactRoutes = require('./customRoutes/contact.route');
const categoryRoutes = require('./customRoutes/category.route');
const productRoutes = require('./customRoutes/product.route');

router.use('/users',userRoutes);
router.use('/contact',contactRoutes);
router.use('/categories',categoryRoutes);
router.use('/product',productRoutes);

module.exports = router;