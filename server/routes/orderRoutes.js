const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
// const authController = require("../controllers/authController");
const { protect, restrictTo } = require("../middleware/auth");

// Customer routes
router.post("/order", protect, orderController.createOrder);
router.get("/myOrders", protect, orderController.getMyOrders);
router.patch("/:id/pay", protect, orderController.markAsPaid);

// Admin routes
router.get(
  "/admin/orders",
  protect,
  restrictTo("admin"),
  orderController.getAllOrders
);
router.patch(
  "/admin/orders/:id/deliver",
  protect,
  restrictTo("admin"),
  orderController.markAsDelivered
);

module.exports = router;
