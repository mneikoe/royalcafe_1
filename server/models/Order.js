// models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
    },
    subtotal: { type: Number, required: true },

    total: { type: Number, required: true },
    orderId: { type: String, unique: true },
    invoice: {
      data: Buffer,
      contentType: String,
    },
    qrCode: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
