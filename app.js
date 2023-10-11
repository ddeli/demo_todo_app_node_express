
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const uri = process.env.KEY;

const { Schema } = mongoose;

const app = express();
const port = process.env.PORT || 3001;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(uri, {useNewUrlParser : true});

const itemsSchema = new Schema({
  _id : Number,
  name:  String,
  done: Boolean,
  category: String,
  date: Date
});

const Item = mongoose.model('Item', itemsSchema);

// let toDoListWork = [];
let toDoListToday = [];

//Delete Items older then 48h
let deletenumber = await Item.deleteMany({date: { $lt: new Date()-(1000*60*60*24*2)}});

//Delete Done Items older then two hours
deletenumber = await Item.deleteMany({date: { $lt: new Date()-(1000*60*60*2)},done:{$eq: true}});

try{
  toDoListToday = await Item.find();
}catch{
  console.log("This database contains yet not tasks");
}

//Make the get route work and render the index.ejs file.
app.get("/", (req, res) => {
  res.render("index.ejs", { todaylist: toDoListToday });
});

// Post Request handler from Today Button
app.post("/today", (req, res) => {
  res.redirect("/");
});



// Post Request handler from SubmitToday Button
app.post("/submitToday", (req, res) => {
  
  if (req.body["taskSubmitToday"] != "") {
    const newTask = new Item({
      _id : Date.now(),
      name: req.body["taskSubmitToday"],
      done:false,
      category:"work",
      date: new Date()
    })

    newTask.save();

    toDoListToday.push(newTask); 

    res.redirect("/");
  } else {
    console.log("Bitte Task Eingeben");
  }
});

// Post Request handler from Checkbox Submit
app.post("/submitchecked", async (req, res) => {

  await Item.updateOne({_id: req.body.checkboxTaskNumber},{$set: {done: true}})
  await Item.updateOne({_id: req.body.checkboxTaskNumber},{$set: {date: new Date()}})

  toDoListToday.find(e=>e._id==req.body.checkboxTaskNumber).done=true;

  res.redirect("/");
});

// Post Request handler from Work Button
// app.post("/work", (req, res) => {
//   res.render("work.ejs", { worklist: toDoListWork });
// });

// Post Request handler from SubmitWork Button
// app.post("/submitWork", (req, res) => {
//   if (req.body["taskSubmitWork"] != "") {
//     toDoListWork.push(req.body["taskSubmitWork"]);
//   }
//   res.render("work.ejs", { worklist: toDoListWork });
// });

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

