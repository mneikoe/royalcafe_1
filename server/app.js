require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectToDb = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const mealRoutes = require("./routes/mealRoutes");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "dist")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
connectToDb();
app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use(
  "/invoices",
  express.static(path.join(__dirname, "public", "invoices"))
);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.get("/", (req, res) => {
  res.send("Welcome to  APi");
});
module.exports = app;
