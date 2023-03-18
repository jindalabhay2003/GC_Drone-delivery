const mongoose = require("mongoose");

const subEventSchema = mongoose.Schema({
  name: {
    type: String,
  },
  id: {
    type: String,
  },
  incharges: [{ name: String, email: String, phoneNumber: String }],
  description: {
    type: String,
  },
  fee: {
    type: Number
  },
  ruleBook: {
    type: String,
  },
  razorpayPageID: {
    type: String,
  },
  parentEvent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
  partialRegistrations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
  }
  ],
  registrations: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
  ],
});

const SubEvent = mongoose.model("SubEvent", subEventSchema);
module.exports = SubEvent;