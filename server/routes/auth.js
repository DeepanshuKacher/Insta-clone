const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const user = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SEC = process.env.JWT_SEC;
const requireLogin = require("../middleware/requiredLogin");

router.post("/signup", (req, res) => {
  const { name, email, password, profilePic } = req.body;
  if (!email || !password || !name || !profilePic) {
    return res.status(400).json({ error: "Please provide all fields" });
  }
  user.findOne({ email }).then((savedUser) => {
    if (savedUser) {
      return res
        .status(400)
        .json({ error: "User already exists with Phone Number" });
    }
    bcrypt.hash(password, 12).then((hashedPass) => {
      const User = new user({
        PhoneNumber: email,
        password: hashedPass,
        name,
        profilePic,
      });
      User.save()
        .then((result) => {
          res.json({ message: "Saved successfully" });
        })
        .catch((err) => {
          res.status(400).json({ error: err });
        });
    });
  });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(404).json({ error: "please add email or password" });
  }
  user.findOne({ PhoneNumber: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(404).json({ error: "Invalid Phone Number " });
    }
    bcrypt.compare(password, savedUser.password).then((Match) => {
      if (Match) {
        const token = jwt.sign({ _id: savedUser._id }, JWT_SEC);

        savedUser.password = undefined;
        savedUser.followers = undefined;
        savedUser.following = undefined;

        res.json({
          token,
          savedUser,
        });
      } else {
        return res.status(404).json({ error: "Invalid password " });
      }
    });
  });
});

router.post("/resetPassword", (req, res) => {
  bcrypt.hash(req.body.NewPassword, 12).then((result) => {
    user.findOneAndUpdate(
      { PhoneNumber: req.body.PhoneNumber },
      { password: result },
      (err, data) => {
        if (err) {
          return res.status(404).json({ Error: err });
        } else {
          res.json({ Message: "Yes updated" });
        }
      }
    );
  });
});

module.exports = router;
