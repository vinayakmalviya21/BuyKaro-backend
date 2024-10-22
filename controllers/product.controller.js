const Product = require("../models/product.model");

// Get products by category
const getProductByCategories = async (req, res) => {
  try {
    const { id } = req.query;
    const ProductByCategories = await Product.find({ category: id }, { __v: 0 })
      .populate("category")
      .populate("reviews");
    // console.log(ProductByCategories)
    res.status(200).json(ProductByCategories || []);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get products details
const getProductDetails = async (req, res) => {
  try {
    const { id } = req.query;
    const productDetails = await Product.find({ _id: id }, { __v: 0 })
      .populate("category")
      .populate({
        path: "reviews",
        populate: {
          path: "user",
          select: "-__v",
        },
      });
    // console.log(productDetails);
    res.status(200).json(productDetails || []);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  getProductByCategories,
  getProductDetails,
};
