require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const storyRoute = require("./routes/story");
const verifyToken = require("./middlewares/verifyToken");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["https://story-backend-rho.vercel.app/"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

mongoose
  .connect(
    process.env.MONGODB_URI ||
      "mongodb+srv://rainaveen75:dYYDMRZYIWNvBD90@cluster0.odqezql.mongodb.net/?retryWrites=true&w=majority&appName=cluster0"
  )
  .then(() => console.log("DB COnnected!"))
  .catch((error) => console.log("Db failed to connect", error));

app.get("/api/health", (req, res) => {
  res.json({
    service: "Backend server",
    status: "active",
    time: new Date(),
  });
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/story", storyRoute);

app.use("*", (req, res) => {
  res.status(404).json({ errorMessage: "Route not found!" });
});

app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).json({ errorMessage: "Something went wrong!" });
});

const PORT = process.env.port || 6000;

app.listen(PORT, () => {
  console.log(`Backend server running at port ${PORT}`);
});
