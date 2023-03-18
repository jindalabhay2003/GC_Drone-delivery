const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  fee: {
    type: Number,
  },
  subevents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubEvent",
    },
  ],
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;