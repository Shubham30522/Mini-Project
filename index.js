const express = require("express");
const app = express();

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 4000;

const hospitalRoutes = require("./routes/Hospital");
// const donorRoutes = require("./routes/Donor");
const userRoutes = require("./routes/User");

//database connect
database.connect();
//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/request", hospitalRoutes);
// app.use("/user", donorRoutes);
app.use("/auth", userRoutes);

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running....",
  });
});

app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
