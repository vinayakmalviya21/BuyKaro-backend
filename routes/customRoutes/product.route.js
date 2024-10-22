const express = require("express");
const router = express.Router();
const { getProductByCategories, getProductDetails} = require("../../controllers/product.controller");

// GET product for particular categories
router.get("/getProductByCategories", getProductByCategories);
router.get("/getProductDetails", getProductDetails);


module.exports = router;
