const express = require("express");
const router = express.Router();

const { createRequest } = require("../controllers/Hospital");

router.post("/createRequest", createRequest);

module.exports = router;
