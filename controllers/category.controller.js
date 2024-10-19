const Category = require("../models/category.model");

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate("productList");
    res.status(200).json(categories);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  getAllCategories
};
