const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const ROLES = {
  USER: "user",
  ADMIN: "admin",
  COMPANY: "company",
};

const userSchema = new mongoose.Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(ROLES), default: ROLES.USER },
  createdAt: { type: Date, default: Date.now },
});

userSchema.methods.generateHash = async function (password) {
  return await bcrypt.hash(password, 10);
};

userSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = {
  User,
  ROLES,
};
