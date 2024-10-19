const mongoose = require("mongoose");
const Product = require("./product.model");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  productList:[
    {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: Product.modelName,
  }
],
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;