const express = require("express");
const router = express.Router();
const { auth, isHospital } = require("../middleware/auth");

const { createRequest } = require("../controllers/Hospital");

router.post("/createRequest", auth, isHospital, createRequest);

module.exports = router;
