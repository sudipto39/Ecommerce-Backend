const Order = require("../models/Order");
const Product = require("../models/Product");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.createOrder = catchAsync(async (req, res, next) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    return next(new AppError('No items in order', 400));
  }

  // Validate all products exist
  const productIds = items.map(i => i.productId);
  const products = await Product.find({ _id: { $in: productIds } });

  if (products.length !== items.length) {
    return next(new AppError('One or more products not found', 404));
  }

  const orderItems = items.map(item => {
    const product = products.find(p => p._id.toString() === item.productId);
    return {
      product: product._id,
      name: product.name,
      qty: item.qty,
      price: product.price
    };
  });

  const totalAmount = orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    totalAmount,
    isPaid: false
  });

  res.status(201).json({
    success: true,
    data: order
  });
});

exports.getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id }).populate('orderItems.product', 'name price');

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// @desc    Get all orders (Admin only)
// @route   GET /api/admin/orders
// @access  Admin
exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find().populate('user', 'name email');

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// @desc    Update order to delivered (Admin only)
// @route   PATCH /api/admin/orders/:id/deliver
// @access  Admin
exports.markAsDelivered = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();

  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order marked as delivered'
  });
});

// @desc    Update order to paid (Payment callback handler)
// @route   PATCH /api/orders/:id/pay
// @access  Private
exports.markAsPaid = catchAsync(async (req, res, next) => {
  const { paymentResult } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = paymentResult; // should contain paymentId, status, etc.

  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order marked as paid'
  });
});
