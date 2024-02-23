const bcrypt = require("bcrypt");
const OTP = require("../models/OTP");
const Donor = require("../models/Donor");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender");
require("dotenv").config();


exports.sendotp = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user is already present // Find user with provided email
    const checkUserPresent = await Donor.findOne({ email });

    // If user found with provided email
    if (checkUserPresent) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is Already Registered`,
      });
    }

    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    console.log("OTP", otp);
    const otpBody = await OTP.create({
      email,
      otp,
    });
    console.log("OTP Body", otpBody);
    res.status(200).json({
      success: true,
      message: `OTP Sent Successfully`,
      otp,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};


