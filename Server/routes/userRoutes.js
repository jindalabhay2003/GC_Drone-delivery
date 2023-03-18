const express = require("express");
const authController = require("../controllers/authController.js");
const userController = require("../controllers/userController.js");
const eventController = require("../controllers/eventController.js");
const router = express.Router();

router.post("/login", authController.googleLogin);
router.post(
  "/finish-registration",
  authController.verifyJwtToken,
  authController.loggedInUser,
  userController.updateUserProfile
);
router.post(
  "/getuser",
  authController.verifyJwtToken,
  authController.loggedInUser,
  userController.getUserProfile
);
router.post(
  "/paymentsuccess",
  authController.verifyJwtToken,
  authController.loggedInUser,
  userController.confirmPayment
);
router.post("/logout", authController.logout);

router.post(
  "/register",
  authController.verifyJwtToken,
  authController.loggedInUser,
  eventController.register
);

module.exports = router;
