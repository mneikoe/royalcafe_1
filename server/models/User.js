const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const shortid = require("shortid");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    //email: { type: String, unique: true },
    phone: { type: Number, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "student"], default: "student" },

    meals: [
      {
        _id: { type: String, default: shortid.generate },
        type: { type: String, required: true },
        times: { type: Number, required: true },
        duration: { type: Number, required: true },
        price: { type: Number, required: true },
        total: { type: Number, required: true },
        remainingMeals: { type: Number, required: true },
        date: { type: Date, required: true },
        validity: { type: Number },
        expiryDate: { type: Date },
        consumptions: [
          {
            consumedAt: { type: Date, default: Date.now },
          },
        ],
      },
    ],
  },

  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
