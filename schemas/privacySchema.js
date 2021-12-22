const mongoose = require("mongoose");

const Privacychema = new mongoose.Schema({
  // _id: mongoose.Schema.Types.ObjectId,
  show_search: {
    type: Boolean,
    required: true,
  },
  status_conn: {
    type: Boolean,
    required: true,
  },
  view: {
    type: Boolean,
    required: true,
  },
  call_block: {
    type: Boolean,
    required: true,
  },
  call_matchuq: {
    type: Boolean,
    required: true,
  },
});

const Privacy = mongoose.model("Privacy", Privacychema);

module.exports = Privacy;
