const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Donor = require("../models/Donor");

exports.signup = async (req, res) => {
  try {
    let { name, email, bloodGroup } = req.body;
    console.log(name);
    console.log(email);
    console.log(bloodGroup);
    // Check if user already exists
    const existingUser = await Donor.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      });
    }

    const donor = await Donor.create({
      name,
      email,
      bloodGroup,
    });
    console.log("Hello, is this working fine");

    return res.status(200).json({
      success: true,
      donor,
      message: "Donor registered successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Donor cannot be registered. Please try again.",
    });
  }
};
