const express = require("express");
const authController = require("../controllers/authController.js");
const router = express.Router();
const {
  createOrder,
  verifyOrder,
} = require("../controllers/paymentController");
router
  .route("/createOrder")
  .post(
    authController.verifyJwtToken,
    authController.loggedInUser,
    createOrder
  );
router
  .route("/verifyOrder")
  .post(
    authController.verifyJwtToken,
    authController.loggedInUser,
    verifyOrder
  );
module.exports = router;
