const User = require("../models/User");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const {createSendToken} = require("../utils/signToken");
  // const {createAdminUser} = require("../models/adminUser");

exports.signUp = catchAsync(async (req, res, next) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return next(new AppError("Missing required fields", 400));
  }
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return next(new AppError("User already exists", 409));
  }

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  createSendToken(newUser, 201, res);
});

exports.logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Missing required fields", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new AppError("Invalid email or password", 401));
  }
  const isCorrect = await user.correctPassword(password, user.password);
  if (!isCorrect) {
    return next(new AppError("Incorrect email or password", 401));
  }

  createSendToken(user, 200, res);
});

exports.getProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  
  res.status(200).json({
    status: "success",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }
  });
});

