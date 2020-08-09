// Dependencies
// =============================================================
const express = require("express");
const path = require("path");
const fs = require("fs");

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT ||3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// to host static files on the server.js
app.use(express.static(path.join(__dirname, "./public")));
let notes = require('./db/db.json');

// Routes
// =============================================================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }
    return res.json(JSON.parse(data));
  });
});

app.post("/api/notes", (req, res) => {
    const newNote = req.body;
    console.log(notes);
    notes.push(newNote);
    fs.writeFile("./db/db.json", JSON.stringify(notes), function (err) {
      if (err) throw err;
      console.log("note saved");
    });
    res.json(newNote);
});

app.delete("/api/notes/:id", (req, res) => {
  const chosen = req.params.id;
  fs.readFile("./db/db.json", "utf8", function (err, data) {
    notes = JSON.parse(data);
    for (let i = 0; i < notes.length; i++) {
      if (notes[i].id === chosen) {
        notes.splice(i, 1);
        fs.writeFile("./db/db.json", JSON.stringify(notes), function (err) {
          if (err) throw err;
          res.send(notes);
        });
      }
    }
  });
});

//Setting up the listener on the selected port
app.listen(PORT, () => {
  console.log("App listening on PORT " + PORT);
});
