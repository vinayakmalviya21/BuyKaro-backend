const router = require("express").Router();
const userRoutes = require('./customRoutes/user.routes');
const contactRoutes = require('./customRoutes/contact.route');

router.use('/users',userRoutes);
router.use('/contact',contactRoutes);

module.exports = router;