const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const user = require("./models/users.js");

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.mongoInfo, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((i) => {
    console.log("mongoose is connected");
  })
  .catch((error) => {
    console.log(error);
  });

app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
