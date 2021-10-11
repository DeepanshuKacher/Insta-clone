const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    photo: { type: String, required: true },
    photo_name: { type: String, required: true },
    postBy: { type: ObjectId, ref: "usersModel" },
    likes: [{ type: ObjectId, ref: "usersModel" }],
    comments: [
      {
        text: { type: String },
        postBy: { type: ObjectId, ref: "usersModel" },
      },
    ],
  },
  { timestamps: true }
);

const postModel = mongoose.model("postModel", postSchema);

module.exports = postModel;
