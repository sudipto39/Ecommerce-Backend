const express = require("express");
const router = express.Router();
const PaymentController = require("../controllers/paymentController");
const { protect } = require("../middleware/auth");

// All routes require login
router
  .post("/order", protect, PaymentController.createOrder)
  .post("/signature", protect, PaymentController.verifySignature)
  .get("/payment/:id", protect, PaymentController.getPaymentDetails)
  .post("/refund", protect, PaymentController.refundPayment)
  .get("/frontend", protect, PaymentController.getFrontendConfig);

module.exports = router;
