const mongoose = require("mongoose");
const signupSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    password: String,
    useremail: String,
  },
  { timestamps: true }
);
const signupmodel = mongoose.model("Signup", signupSchema);
module.exports = signupmodel;
