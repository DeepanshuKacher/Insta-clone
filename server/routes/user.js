const express = require("express");
const app = express();
const router = express.Router();
const mongoose = require("mongoose");
const postModel = require("../models/post");
const requiredLogin = require("../middleware/requiredLogin");
const user = require("../models/users");

router.get("/user/:id", requiredLogin, (req, res) => {
  user
    .findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      postModel
        .find({ postBy: req.params.id })
        .sort("-createdAt")
        //  .populate("postBy", "_id name")
        .exec((err, posts) => {
          if (err) {
            return res.statue.json(err);
          }
          res.json({ user, posts });
        });
    })
    .catch((error) => {
      return res.status(404).json(error);
    });
});

router.put("/follow", requiredLogin, (req, res) => {
  user
    .findByIdAndUpdate(
      req.body.followId,
      {
        $push: { followers: req.user._id },
      },

      { new: true }
    )
    .select("-password")
    .exec((err, result1) => {
      if (err) {
        return res.status(422).json({ err1: err });
      } else {
        user
          .findByIdAndUpdate(
            req.user._id,
            {
              $push: { following: req.body.followId },
            },
            { new: true }
          )
          .select("-password")
          .exec((err, result2) => {
            if (err) {
              return res.status(422).json({ err2: err });
            } else {
              res.json({ result1, result2 });
            }
          });
      }
    });
});
router.put("/unfollow", requiredLogin, (req, res) => {
  user
    .findByIdAndUpdate(
      req.body.followId,
      {
        $pull: { followers: req.user._id },
      },

      { new: true }
    )
    .select("-password")
    .exec((err, result1) => {
      if (err) {
        return res.status(422).json({ err1: err });
      } else {
        user
          .findByIdAndUpdate(
            req.user._id,
            {
              $pull: { following: req.body.followId },
            },
            { new: true }
          )
          .select("-password")
          .exec((err, result2) => {
            if (err) {
              return res.status(422).json({ err2: err });
            } else {
              res.json({ result1, result2 });
            }
          });
      }
    });
});

router.put("/updateprofilepic", requiredLogin, (req, res) => {
  user
    .findByIdAndUpdate(req.user._id, { profilePic: req.body.profilePic })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.post("/search-user", (req, res) => {
  user
    .find({ name: { $regex: new RegExp(req.body.query, "i") } })
    .limit(5)
    .select("name profilePic")
    .then((users) => {
      res.json({ users });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
