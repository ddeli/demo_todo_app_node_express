
import express from "express";// const express = require("express");
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 3001;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let toDoListWork = [];
let toDoListToday = [];

app.get("/", (req, res) => {
  res.render("index.ejs");
  console.log("Render of Root");
});

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

