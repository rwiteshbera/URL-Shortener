const express = require("express");
const mongoose = require("mongoose");
const ShortURL = require("./models/db.js");
const http = require("http");
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const server = http.createServer(app);
const cors = require("cors");
const ShortUniqueId = require("short-unique-id");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8080;

const DB = process.env.DB || "mongodb://localhost:27017/urlshortener";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Create Short Unique ID
const CreateUID = new ShortUniqueId({ length: 10 });

// Connect to Database
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


// Redirection Server
app.get("/", (req, res) => {
  res.send("Unique id is missing from URL!")
});

app.get("/:id", (req, res) => {
  try {
    ShortURL.findOne({ uID: req.params.id }, function (err, db) {
      res.redirect(db.fullURL)
  });
  }catch(e) {
    console.log(e)
  }
});


// Creating Realtime Connection to provide short link instantly to client
const io = require("socket.io")(server, {
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
          console.log("Something went wrong. Data cannot be submitted!" + e);
        });
    } catch (e) {
      console.log(e);
    }
  });
});


server.listen(PORT, () => {
  console.log(`Redirection Server is listening on: http://localhost:${PORT}`);
});
