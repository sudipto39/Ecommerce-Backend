const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { createSendToken } = require("../utils/signToken");

exports.adminLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide both email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  console.log("user",user);
  if (!user) {
    return next(new AppError("Invalid email or password", 401));
  }

  const isCorrect = await user.correctPassword(password,user.password);
  console.log("user.password",user.password);
  console.log("isCorrect",isCorrect);
  if (!isCorrect) {
    return next(new AppError("Invalid email or password", 401));
  }

  if (user.role !== "admin") {
    return next(new AppError("Access denied: Admins only", 403));
  }
  createSendToken(user, 200, res);

});

exports.getAllUsers = catchAsync(async (_req, res, _next) => {
  const users = await User.find().select("+password");

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

// @desc    Update user role
// @route   PATCH /api/admin/users/:id/role
// @access  Admin
exports.updateUserRole = catchAsync(async (req, res, next) => {
  const { role } = req.body;

  if (!["user", "admin"].includes(role)) {
    return next(new AppError("Invalid role specified", 400));
  }

  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError("User not found", 404));

  if (user._id.toString() === req.user._id.toString()) {
    return next(new AppError("Admins cannot change their own role", 403));
  }

  user.role = role;
  await user.save();

  res.status(200).json({
    success: true,
    message: "User role updated successfully",
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError("User not found", 404));

  if (user._id.toString() === req.user._id.toString()) {
    return next(new AppError("Admins cannot delete themselves", 403));
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

// ------------------------------
// ORDERS
// ------------------------------

exports.getAllOrders = catchAsync(async (_req, res, _next) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

// ------------------------------
// PRODUCTS
// ------------------------------

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new AppError("Product not found", 404));

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const { name, price, stock, isActive } = req.body;

  const product = await Product.findById(req.params.id);
  if (!product) return next(new AppError("Product not found", 404));

  if (name) product.name = name;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (typeof isActive === "boolean") product.isActive = isActive;

  await product.save();

  res.status(200).json({
    success: true,
    message: "Product updated",
    data: product,
  });
});
