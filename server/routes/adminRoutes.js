const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { protect, restrictTo } = require("../middleware/auth");

router.post("/login", adminController.adminLogin);

// Middleware: only authenticated and role = admin
router.use(protect);
router.use(restrictTo("admin"));

// User Management
router.get("/users", adminController.getAllUsers);
router.patch("/users/:id/role", adminController.updateUserRole);
router.delete("/users/:id", adminController.deleteUser);

// Order Management
router.get("/orders", adminController.getAllOrders);

// Product Management
router.patch("/products/:id", adminController.updateProduct);
router.delete("/products/:id", adminController.deleteProduct);

module.exports = router;
