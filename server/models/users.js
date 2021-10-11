const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  profilePic: { type: String, required: true },
  PhoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  followers: [{ type: ObjectId, ref: "usersModel" }],
  following: [{ type: ObjectId, ref: "usersModel" }],
});

const user = mongoose.model("usersModel", userSchema);

module.exports = user;
