const express = require("express");
const app = express();
const router = express.Router();
const mongoose = require("mongoose");
const postModel = require("../models/post");
const requiredLogin = require("../middleware/requiredLogin");

router.get("/allpost", requiredLogin, (req, res) => {
  postModel
    .find({ postBy: { $in: [...req.user.following, req.user._id] } })
    .populate("postBy", "_id name")
    .populate("comments.postBy", "_id name")
    .sort("-createdAt")
    .then((posts) => {
      res.send(posts);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.post("/createpost", requiredLogin, (req, res) => {
  const { title, body, picUrl, photo_name } = req.body;
  if (!title || !body || !picUrl) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  req.user.password = undefined;
  const post = new postModel({
    title,
    body,
    photo: picUrl,
    postBy: req.user,
    photo_name,
  });
  post
    .save()
    .then((result) => {
      res.json("create post successfully");
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});

// router.get("/mypost", requiredLogin, (req, res) => {
//   postModel
//     .find({ postBy: req.user._id })
//     .populate("postBy", "_id name")
//     .sort("-createdAt")
//     .then((mypost) => {
//       res.json({ mypost });
//     })
//     .catch((err) => {
//       res.json({ err });
//     });
// });

router.put("/like", requiredLogin, (req, res) => {
  postModel
    .findByIdAndUpdate(
      req.body.postId,
      {
        $push: { likes: req.user._id },
      },
      { new: true }
    )
    .populate("comments.postBy ", "_id name")
    .populate("postBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ err });
      } else {
        res.json(result);
      }
    });
});

router.put("/unlike", requiredLogin, (req, res) => {
  postModel
    .findByIdAndUpdate(
      req.body.postId,
      {
        $pull: { likes: req.user._id },
      },
      { new: true }
    )
    .populate("comments.postBy ", "_id name")
    .populate("postBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ err });
      } else {
        res.json(result);
      }
    });
});

router.put("/comment", requiredLogin, (req, res) => {
  const comment = {
    text: req.body.text,
    postBy: req.user._id,
  };
  postModel
    .findByIdAndUpdate(
      req.body.postId,
      {
        $push: { comments: comment },
      },
      { new: true }
    )
    .populate("comments.postBy ", "_id name")
    .populate("postBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ err });
      } else {
        res.json(result);
      }
    });
});

router.delete("/deletepost/:postId", requiredLogin, (req, res) => {
  postModel
    .findByIdAndDelete({ _id: req.params.postId })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      return res.status(422).send(err);
    });
});

module.exports = router;
