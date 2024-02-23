const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
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

  bloodGroup: {
    type: String,
    required: true,
  },

  bloodDonationHistory: [
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

  ignoredRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
    },
  ],
});

module.exports = mongoose.model("Donor", donorSchema);
