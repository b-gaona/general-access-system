const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const csv = require("csv-parser");
const fs = require("fs");
const multer = require("multer");
const { saveUserByCSV, deleteUsersByCSV } = require("./models/user.model");

const path = require("path");

const api = require("./routes/api");

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(morgan("combined"));

app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/v1", api);

// Configure multer for file upload
const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("file"), (req, res) => {
  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      const users = await saveUserByCSV(results);
      // Remove the uploaded file
      console.log("File deleted if exists");
      fs.unlink(req.file.path, (err) => {
        if (err) console.error(err);
      });
      return res.status(200).json(users);
    });
});

app.post("/remove", upload.single("file"), (req, res) => {
  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      const users = await deleteUsersByCSV(results);
      // Remove the uploaded file
      console.log("File deleted if exists");
      fs.unlink(req.file.path, (err) => {
        if (err) console.error(err);
      });
      return res.status(200).json(users);
    });
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
