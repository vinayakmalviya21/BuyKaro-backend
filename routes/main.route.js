const router = require("express").Router();
const userRoutes = require('./customRoutes/user.routes');

router.use('/users',userRoutes);

module.exports = router;