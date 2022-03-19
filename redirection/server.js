const express = require("express");
const mongoose = require("mongoose");
const ShortURL = require("./models/db");
const http = require("http");
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

const DB = "mongodb://localhost:27017/urlShortener";


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log("Failed to connect with Database: " + err);
  });

app.get("/", (req, res) => {
  res.send("Unique id is missing from URL!")
});

app.get("/:id", (req, res) => {
  ShortURL.findOne({ uID: req.params.id }, function (err, db) {
      res.redirect(db.fullURL)
  });
});

server.listen(PORT, () => {
  console.log(`Server is listening on: http://localhost:${PORT}`);
});
