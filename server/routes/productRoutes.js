const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
// const authController = require("../controllers/authController");
const { protect, restrictTo } = require("../middleware/auth");

router
  .route("/")
  .post(protect, restrictTo("admin"), productController.createProduct)
  .get(productController.getAllProducts);

router
  .route("/:id")
  .get(productController.getProductById)
  .patch(protect, restrictTo("admin"), productController.updateProduct)
  .delete(protect, restrictTo("admin"), productController.deleteProduct);

module.exports = router;
