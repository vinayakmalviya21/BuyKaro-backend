const express = require("express");
const router = express.Router();
const { getAllCategories } = require("../../controllers/category.controller");

// GET all categories
router.get("/", getAllCategories);

module.exports = router;
