const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: {
    data: String, // base64 string
    contentType: String, // MIME type
  },
  offer: String,
});

module.exports = mongoose.model("Menu", menuSchema);
