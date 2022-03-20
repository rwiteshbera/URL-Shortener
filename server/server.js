const express = require("express");
const mongoose = require("mongoose");
const ShortURL = require("./models/db.js");
const http = require("https");
const dotenv = require('dotenv');
dotenv.config();
const main_app = express();
const redirection_app = express();
const server_1 = http.createServer(main_app);
const server_2 = http.createServer(redirection_app);
const cors = require("cors");
const ShortUniqueId = require("short-unique-id");
const bodyParser = require("body-parser");
const MAIN_PORT = process.env.MAIN_PORT || 8080;
const REDIRECTION_PORT = process.env.REDIRECTION_PORT;

const DB = process.env.DB;

main_app.use(bodyParser.urlencoded({ extended: true }));
main_app.use(express.json());
main_app.use(express.urlencoded({ extended: false }));

redirection_app.use(express.json());
redirection_app.use(express.urlencoded({ extended: false }));


// Create Short Unique ID
const CreateUID = new ShortUniqueId({ length: 10 });

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

main_app.get("/", (req, res) => {
  res.send("Hello Rwitesh!");
});

const io = require("socket.io")(server_1, {
  cors: {
    origin: "*",
    method: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("sendInputURL", (fullURL) => {
    try {
      const uID = CreateUID();
      ShortURL.create({ fullURL: fullURL, uID: uID })
        .then(() => {
          socket.emit("sendURLtoClient", uID);
          console.log("Data stored successfully!");
        })
        .catch((e) => {
          console.log("Something went wrong. Data cannot be submitted!");
        });
    } catch (e) {
      console.log(e);
    }
  });
});


redirection_app.get("/", (req, res) => {
  res.send("Unique id is missing from URL!")
});

redirection_app.get("/:id", (req, res) => {
  ShortURL.findOne({ uID: req.params.id }, function (err, db) {
      res.redirect(db.fullURL)
  });
});


server_1.listen(MAIN_PORT, () => {
  console.log(`Main Server is listening on: http://localhost:${MAIN_PORT}`);
});
server_2.listen(REDIRECTION_PORT, () => {
  console.log(`Redirection Server is listening on: http://localhost:${REDIRECTION_PORT}`);
});
