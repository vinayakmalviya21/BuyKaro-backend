const express = require("express");
const router = express.Router();
const { getProductByCategories} = require("../../controllers/product.controller");

// GET product for particular categories
router.get("/getProductByCategories", getProductByCategories);


module.exports = router;
