// db.js
require("dotenv").config();
const mongoose = require("mongoose");

const uri = process.env.DB_URL;

function connectToDb() {
  try {
    mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
    console.log(`Connected successfully to ` + uri);
  } catch (err) {
    console.error("Connection to database failed", err);
    throw err;
  }
}

module.exports = connectToDb;
