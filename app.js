
import express from "express";// const express = require("express");
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 3001;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let toDoListWork = [];
let toDoListToday = [];

//Make the get route work and render the index.ejs file.
app.get("/", (req, res) => {
  res.render("index.ejs", { todaylist: toDoListToday });
  // console.log("After initial GET req: " + toDoListToday);
});

// Post Request handler from Today Button
app.post("/today", (req, res) => {
  res.render("index.ejs", { todaylist: toDoListToday });
  // console.log("After click on TODAY Button: " + toDoListToday);
});

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

