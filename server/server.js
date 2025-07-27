require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const connectDB = require("./config/db");
const globalErrorHandler = require("./middleware/globalErrorHandler");
const AppError = require("./utils/appError");
// const User = require("./models/User");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const {createAdminUser} = require("./models/adminUser");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");


const app = express();

connectDB();

// Global Middlewares

app.use(express.json({ limit: "10kb" }));
app.use(morgan("dev"));
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"],
  credentials: true,
}));
app.use(helmet());                                       // Set security HTTP headers
app.use(xss());                                         // Prevent XSS attacks
app.use(mongoSanitize());                              // Prevent NoSQL injection
app.use(hpp());

// Rate limiter (prevent brute force attacks)

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,                              // 1 hour
  message: "Too many requests from this IP, please try again in an hour!"
});
app.use("/api", limiter);

createAdminUser();

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/payment", paymentRoutes);


app.all("*", (req, _res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// module.exports = express.Router();
