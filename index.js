const express = require("express");
const multer = require("multer")

const route= require('./src/routes/route.js');
const mongoose  = require("mongoose");
const app = express();

app.use(multer().any())
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

mongoose
  .connect(
    "mongodb+srv://kishan_31:4GdZARnCyGUbPKKw@cluster0.d5f50qs.mongodb.net/productsManagmentGroup42",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("Connected with MongoDB"))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
  console.log("Express app running on port " + (process.env.PORT || 3000));
});