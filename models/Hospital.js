const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
  hospitalName: {
    type: String,
    required: true,
  },

  hospitalID: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
  },

  Requested: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
    },
  ],

  token: {
    type: String,
  },

  accountType: {
    type: String,
    enum: ["Donor", "Hospital"],
    required: true,
  },
});

module.exports = mongoose.model("Hospital", hospitalSchema);
