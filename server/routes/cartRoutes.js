const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const auth = require("../middleware/auth");

router.use(auth.protect);

router
  .get("/", auth.protect, cartController.getCart)
  .post("/add", auth.protect, cartController.addToCart)
  .patch("/update", auth.protect, cartController.updateCartItem)
  .delete("/remove", auth.protect, cartController.removeFromCart)
  .delete("/clear", auth.protect, cartController.clearCart);

module.exports = router;
