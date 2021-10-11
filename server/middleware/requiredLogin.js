const jwt = require("jsonwebtoken");
const JWT_SEC = process.env.JWT_SEC;
const mongoose = require("mongoose");
const user = require("../models/users");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  //authorization === Bearer token
  if (!authorization) {
    return res.status(404).json({ error: "you must be logged in" });
  }
  const toke = authorization.replace("Bearer ", "");

  jwt.verify(toke, JWT_SEC, (err, payload) => {
    if (err) {
      return res.status(404).json({ error: "token doesn't match" });
    }

    const { _id } = payload;
    user.findById(_id).then((userdate) => {
      req.user = userdate;
      next();
    });
  });
};
