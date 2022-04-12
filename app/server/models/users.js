const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  user_count: { type: Number },
  created_at: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
