const Event = require("../models/eventModel");
const SubEvent = require("../models/subEventModel");
const AppError = require("../Utils/appError");
const catchAsync = require("../Utils/catchAsync");
// const ObjectsToCsv = require("objects-to-csv");

const eventsData = require("../Utils/data.json");
const User = require("../models/userModel");
const { default: mongoose } = require("mongoose");


const checkOrg = (email) => {
  const index = email.indexOf("@");
  const domain = email.substr(index);
  if (domain !== "@iitbbs.ac.in") return false;
  return true;
};

exports.createEvents = catchAsync(async (req, res, next) => {
  const events = eventsData.events;

  const event = await Event.create(events);
  res.status(201).json({
    status: "success",
    data: { event },
  });
});

exports.getAllEvents = catchAsync(async (req, res, next) => {
  const events = await Event.find();
  res.status(200).json({
    status: "success",
    data: { results: events.length, events },
  });
});

exports.createSubEvents = catchAsync(async (req, res, next) => {
  const data = eventsData.subevents;

  data.forEach(async (element) => {
    const parent = await Event.findOne({ name: element[0] });
    element[1].forEach(async (ele) => {
      const subEvent = await SubEvent.create({
        name: ele.name,
        id: ele.id,
        parentEvent: parent._id,
      });
    });
  });

  res.status(200).json({
    message: "success",
  });
});

exports.linkSubEventToEvent = catchAsync(async (req, res, next) => {
  const subEvents = await SubEvent.find();

  subEvents.forEach(async (element) => {
    const event = await Event.findByIdAndUpdate(element.parentEvent, {
      $push: { subevents: element._id },
    });
  });

  res.send("success");
});

exports.register = catchAsync(async (req, res, next) => {
  const user = req.user;

  const drones = req.body.amount;
  const orderlongitude = req.body.orderlongitude;
  const orderlatitude = req.body.orderlatitude;

  const userDb = User.findById(user._id);

    await User.findByIdAndUpdate(user._id,{drones: drones,orderlongitude: orderlongitude,orderlatitude: orderlatitude});

  res.status(200).json({
    status: "success",
    message: "You have been partially registered for this event. Now complete your payment to continue...",
  });
});
