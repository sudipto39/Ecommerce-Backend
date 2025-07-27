const jwt = require('jsonwebtoken');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { promisify } = require('util');

exports.protect = catchAsync(async (req, _res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not logged in", 401));
  }
  const decorded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const userId = decorded.id;

  const currentUser = await User.findById(userId);

  if (!currentUser) {
    return next(new AppError("The user not found", 401));
  }
  req.user = currentUser;
  next();
});

exports.admin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Please login to access this resource'
    });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  next();
};

exports.restrictTo = (...roles) => {
  return (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission', 403));
    }
    next();
  };
};
