const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please Provide your email!"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please provide a valid email"],
  },
  image: {
    type: String,
    default: null,
  },
  drones: {
    type: Number,
    default: 0
  },
  orderlongitude: {
    type: Number
  },
  orderlatitude: {
    type: Number
  }
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

UserSchema.index({ email: "text" });

const User = mongoose.model('User',UserSchema);

module.exports = User;