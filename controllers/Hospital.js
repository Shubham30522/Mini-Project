const Request = require("../models/Request");

exports.createRequest = async (req, res, next) => {
  //   const hospitalId = req.user.id;

  try {
    let { bloodGroup } = req.body;

    if (!bloodGroup) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      });
    }

    const newRequest = await Request.create({
      bloodGroup,
    });

    console.log("This is blood group: ", bloodGroup);

    // Return the new request and a success message
    res.status(200).json({
      success: true,
      // data: newRequest,
      message: "New Request Created Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create Request for Blood",
      error: error.message,
    });
  }
};
