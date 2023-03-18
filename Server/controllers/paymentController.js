const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/userModel");
const SubEvent = require("../models/subEventModel");
const AppError = require("../Utils/appError");
const catchAsync = require("../Utils/catchAsync");

const checkOrg = (email) => {
  const index = email.indexOf("@");
  const domain = email.substr(index);
  if (domain !== "@iitbbs.ac.in") return false;
  return true;
};

exports.createOrder = async (req, res, next) => {

  const user = req.user;

  if (!user?.isRegistrationComplete) {
    return next(new AppError("Please complete the registration", 400));
  }

  // const subEventId = req.body.id;
  // const subEvent = await SubEvent.findOne({ id: subEventId });

  // if (!subEvent) {
  //   return next(new AppError("No subEvent found with that ID", 404));
  // }

  // if (subEvent.registrations.includes(user._id)) {
  //   return next(new AppError("You are already registered for this event", 400));
  // }
  if(user.PaymentStatusForEvents === true || user.paymentStatusForAccommodation === true){
    return next(new AppError("Chill... You have already registered and your payment was successfull",400));
  }
  
  const fees = req.body.id==="1"?30000:110000;

  try {
    var instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    var options = {
      amount: fees,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };
    await instance.orders.create(options, (error, order) => {
      if(error)
      {
        console.log(error);
        return res.status(500).json({ message: "Something Went Wrong While Creating the Order" });
      }
      res.status(200).json({message: "Success", order});
    });
  } 
  catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.verifyOrder = async (req, res) => {
  try{
    const {
    order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  let pre_signature = order_id + "|" + razorpay_payment_id;
  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(pre_signature.toString())
    .digest("hex");

    const user = req.user;
    const idType = req.body.id;
    // const subevent = await SubEvent.findOne({ id: subEventId });
    if(generated_signature == razorpay_signature){
      // await User.findByIdAndUpdate(user._id,{$pull: {partialRegistrations: subevent._id}});
      // await SubEvent.findByIdAndUpdate(subevent._id,{$pull: {partialRegistrations: user._id}});
      // const updatedSubEvent = await SubEvent.findByIdAndUpdate(subevent._id,{$push: {registrations: user._id},});
      // const updatedUser = await User.findByIdAndUpdate(user._id,{$push: {registrations: subevent._id},});
      if(idType == "1"){
        await User.findByIdAndUpdate(user._id,{PaymentStatusForEvents: true});
      }
      else{
        await User.findByIdAndUpdate(user._id,{PaymentStatusForEvents: true});
        await User.findByIdAndUpdate(user._id,{paymentStatusForAccommodation: true});
      }
    } 
    
    if (generated_signature != razorpay_signature) {
    return res
      .status(400)
      .json({ signal : false, message: "Verification Failed" });
    } else
    res
    .status(200)
    .json({ signal : true, message: "Success" });
  }
  catch(error)
  {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};