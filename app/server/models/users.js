const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  user: { type: Array },
  created_at: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
