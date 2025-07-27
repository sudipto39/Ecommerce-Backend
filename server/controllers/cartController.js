const Cart = require('../models/Cart');
const Product = require('../models/Product');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Get current user's cart
exports.getCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart) return res.status(200).json({ items: [] });
  res.status(200).json(cart);
});

// Add item to cart
exports.addToCart = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;
  if (!productId || !quantity) return next(new AppError('Product and quantity required', 400));
  const product = await Product.findById(productId);
  if (!product) return next(new AppError('Product not found', 404));
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [{ product: productId, quantity }] });
  } else {
    const item = cart.items.find(i => i.product.toString() === productId);
    if (item) {
      item.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    await cart.save();
  }
  res.status(200).json(cart);
});

// Update item quantity
exports.updateCartItem = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new AppError('Cart not found', 404));
  const item = cart.items.find(i => i.product.toString() === productId);
  if (!item) return next(new AppError('Item not in cart', 404));
  item.quantity = quantity;
  await cart.save();
  res.status(200).json(cart);
});

// Remove item from cart
exports.removeFromCart = catchAsync(async (req, res, next) => {
  const { productId } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new AppError('Cart not found', 404));
  cart.items = cart.items.filter(i => i.product.toString() !== productId);
  await cart.save();
  res.status(200).json(cart);
});

// Clear cart
exports.clearCart = catchAsync(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new AppError('Cart not found', 404));
  cart.items = [];
  await cart.save();
  res.status(200).json(cart);
}); 