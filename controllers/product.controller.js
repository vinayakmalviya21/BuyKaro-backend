const Product = require("../models/product.model");

// Get products by category
const getProductByCategories = async (req, res) => {
    console.log("sbdab")
  try {
    const {id} = req.query; 
    const ProductByCategories = await Product.find({category:id},{__v:0}).populate("category").populate("reviews");
    console.log(ProductByCategories)
    res.status(200).json(ProductByCategories || []);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  getProductByCategories
};
