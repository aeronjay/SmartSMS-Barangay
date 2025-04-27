const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed password
  role: { type: String, enum: ["superadmin", "admin"], default: "admin" }, // Add role field
});

module.exports = mongoose.model("Admin", UserSchema);
