const AppError = require('../utils/appError');

module.exports = (err, _req, res, _next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Handle Mongoose validation errors, JWT errors, etc. here if needed

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message || 'Internal Server Error',
    // Optionally include stack trace in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}; 