const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router  
    .route("/signup")   
    .post(authController.signUp);

router  
    .route("/login")   
    .post(authController.logIn);

router  
    .route("/profile")   
    .get(authMiddleware.protect, authController.getProfile);

module.exports = router;
