// Donor Controller for specific login and signup

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Donor = require("../models/Donor");

exports.donorSignup = async (req, res) => {
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

exports.donorlogin = async (req, res) => {
  try {
    // Get email and password from request body
    const { email, password } = req.body;

    // Check if email or password is missing
    if (!email || !password) {
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
        message: `User is not Registered with Us Please SignUp to Continue`,
      });
    }

    // First Compare Password and then Generate JWT token and
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { email: user.email, id: user._id },
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
        message: `User Login Success`,
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
