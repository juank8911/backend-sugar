const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  created: {
    type: Date,
    default: Date.now,
  },
  accion: {
    type: String,
    required: true,
  },
});

const Activity = mongoose.model("Activity", ActivitySchema);

module.exports = Activity;
