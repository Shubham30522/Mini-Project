const mongoose = require("mongoose");
const newRequestTemplate = require("../mail/templates/newRequest");
const mailSender = require("../utils/mailSender");
const Donor = require("../models/Donor");

const requestSchema = new mongoose.Schema({
  Hospital_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true,
  },

  bloodGroup: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending","temporayFulfilled", "fulfill"],
    default: "pending",
  },
  
  D_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Donor",
    default: null,
  },
});

async function sendNewRequestEmail(donorName, email, bloodGroup) {
  try {
    const mailResponse = await mailSender(
      email,
      "New Blood Request Added",
      newRequestTemplate.newRequestEmail(donorName, "Kiran", bloodGroup)
    );
  } catch (error) {
    console.log("Error occurred while sending email: ", error);
    throw error;
  }
}

// Define a pre-save hook to send email for new blood requirenments
requestSchema.pre("save", async function (next) {
  console.log("New Request is saved to database");

  // Only send an email when a new document is created
  if (this.isNew) {
    const allDonors = await Donor.find({
      bloodGroup: this.bloodGroup,
    }).exec();

    allDonors.forEach(async (donor) => {
      await sendNewRequestEmail(donor.name, donor.email, this.bloodGroup);
      console.log(`Email sent successfully for this donor: ${donor.email}`);
    });
  }

  next();
});

module.exports = mongoose.model("Request", requestSchema);
