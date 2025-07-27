const Product = require("../models/Product");

exports.createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(200).json({
      status: "success",
      message: "product created successfully",
      data: newProduct,
    });
    console.log("Product has created");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.getAllProducts = async (_req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      status: "success",
      message: "All products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }
    res.status(200).json({
      status: "Success",
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }
    res.status(200).json({
      status: "Success",
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id, req.body);
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }
    res.status(204).json({
      status: "Success",
      message: "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};    