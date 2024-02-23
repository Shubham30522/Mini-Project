// Donor Controller for specific login and signup
const bcrypt = require("bcrypt");
const OTP = require("../models/OTP");
const Donor = require("../models/Donor");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender");
require("dotenv").config();

exports.donorSignup = async (req, res) => {
  try {
    // Destructure fields from the request body
    console.log("able to reach on donorSignup function");
    let {
      name,
      email,
      bloodGroup,
      password,
      confirmPassword,
      otp,
      accountType,
    } = req.body;

    // Check if All Details are there or not
    if (
      (!name || !email || !bloodGroup || !password || !confirmPassword || !otp,
      !accountType)
    ) {
      return res.status(403).send({
        success: false,
        message: "All Fields are required",
      });
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and Confirm Password do not match. Please try again.",
      });
    }

    // Check if user already exists
    const existingUser = await Donor.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Donor already exists. Please sign in to continue.",
      });
    }

    // Find the most recent OTP for the email
    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    console.log(response);
    if (response.length === 0) {
      // OTP not found for the email
      return res.status(400).json({
        success: false,
        message:
          "The OTP is not valid || NO OTP FOUND FOR THIS GIVEN EMAIL ADDRESS",
      });
    } else if (otp !== response[0].otp) {
      // Invalid OTP
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const donor = await Donor.create({
      name,
      email,
      password: hashedPassword,
      bloodGroup,
      accountType
    });
    console.log("SingUp Controller is working fine till now");

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

exports.donorLogin = async (req, res) => {
  try {
    // Get email and password from request body
    const { email, password, accountType } = req.body;

    // Check if email or password is missing
    if (!email || !password || !accountType) {
      // Return 400 Bad Request status code with error message
      return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      });
    }

    // Find user with provided email
    const user = await Donor.findOne({ email });

    // If user not found with provided email
    if (!user) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `Donor is not Registered with Us Please SignUp to Continue`,
      });
    }

    // First Compare Password and then Generate JWT token and
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { email: user.email, id: user._id, accountType: accountType },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );

      // Save token to user document in database
      user.token = token;
      user.password = undefined;
      // Set cookie for token and return success response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: `Donor Login Success`,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      });
    }
  } catch (error) {
    console.error(error);
    // Return 500 Internal Server Error status code with error message
    return res.status(500).json({
      success: false,
      message: `Login Failure Please Try Again`,
    });
  }
};


/* // agreeToDonate controller
exports.agreeToDonate = async (req, res, next) => {
  const { requestId } = req.params;
  const donorId = req.user.id;

  try {
    // Find the request by ID
    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    // Update the request with the donor's ID
    request.D_id = donorId;
    await request.save();

    // Notify other donors about the update (if needed)

    // Return a success message
    res.status(200).json({
      success: true,
      message: 'Donor agreed to donate successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to process the donation agreement',
      error: error.message,
    });
  }
};


// don'tWantToDonate controller
exports.dontWantToDonate = async (req, res, next) => {
  const { requestId } = req.params;
  const donorId = req.user.id;

  try {
    // Find the donor by ID
    const donor = await Donor.findById(donorId);

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found',
      });
    }

    // Add the request ID to the ignoredRequests array
    donor.ignoredRequests.push(requestId);
    await donor.save();

    // Return a success message
    res.status(200).json({
      success: true,
      message: 'Donor chose not to donate successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to process the donation preference',
      error: error.message,
    });
  }
}; */
