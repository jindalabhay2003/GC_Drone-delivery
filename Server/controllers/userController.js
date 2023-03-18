const User = require("../models/userModel");
const SubEvent = require("../models/subEventModel");
const AppError = require("../Utils/appError");
const catchAsync = require("../Utils/catchAsync");

exports.updateUserProfile = catchAsync(async (req, res, next) => {
  const user = req.user;
  const { institute, phoneNumber,ReferralID, branch, year, isRegistrationComplete } = req.body;

  if (!(phoneNumber)) {
    return next(new AppError("Please provide your Phone Number", 400));
  }

  const updatedUser = await User.findByIdAndUpdate(user._id, {
    institute,
    phoneNumber,
    branch,
    year,
    ReferralID,
    isRegistrationComplete
  },{new: true,
    runValidators: true
  });

  if (!updatedUser) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "User Updated Successfully",
    updatedUser,
  });
});

exports.getUserProfile = catchAsync(async (req, res, next) => {
  const user = req.user;

  const newUser = await User.findById(user._id);

  if (!newUser) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    user: newUser,
  });
});

exports.confirmPayment = catchAsync(async (req, res, next) => {
  const user = req.user;
  const { paymentConfirmation,razorpay_order_id} = req.body;

  if (!(paymentConfirmation && razorpay_order_id )) {
    return next(new AppError("Invalid Request...", 400));
  }


  res.status(200).json({
    status: "success",
    message: "payment confirmed for the user",
    updatedUser,
  });
});