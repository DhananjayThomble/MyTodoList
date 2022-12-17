require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const myDate = require("./dates");
const mongoose = require("mongoose"); // for database

const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

//it will load files from public directory
// In nodejs, we can not directly use any file from the project directory
app.use(express.static("public"));

// to render ejs webpage
// ejs- embedded javascript
app.set("view engine", "ejs");
let itemName = "";
/* ---------------------------------- Database ---------------------------------- */
const dbUrl = process.env.DB_URL; // get the url from .env file
mongoose.set("strictQuery", false);
async function main() {
  await mongoose.connect(dbUrl);
}

main().catch((err) => console.log(err));
// check if connection is successful
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to database");
});

// Creating Schema for todo list
const todoSchema = new mongoose.Schema({
  item: String,
});

// Creating Model for todo list : A model is a class with which we construct documents.
const Todo = mongoose.model("todolist", todoSchema);

// const list = new Todo({
//   item: "Welcome to your todolist",
// });

// const list2 = new Todo({
//   item: "Hit the + button to add a new item",
// });

// const defaultItems = [list, list2];

// // save the default items to database
// Todo.insertMany(defaultItems, function (err) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("Successfully saved default items to database");
//   }
// });

/* ---------------------------------- Database ---------------------------------- */

// array, empty array = [];
const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

app.get("/", function (req, res) {
  const today = myDate.day();
  // console.log(today);
  // gettting data from database
  let itemArray = [];

  Todo.find({}, function (err, results) {
    if (err) {
      console.log(err);
      res.send("Error in fetching data from database");
    } else {
      itemArray = results.map((result) => result.item);

      res.render("list", { kindOfList: today, itemArray: itemArray });
    }
  });
});

app.post("/", function (req, res) {
  //takes input from frontend and store it in the array
  // items.push(req.body.newItem);
  itemName = req.body.newItem;

  //displays the latest array of todo list
  res.redirect("/");
});

app.get("/work", function (req, res) {
  res.render("list", { kindOfList: "Work List", itemArray: workItems });
});

app.post("/work", function (req, res) {
  workItems.push(req.body.newItem);
  // console.log("work array updated");
  res.redirect("/work");
});

app.listen(port, function () {
  console.log(`Server started at ${port}`);
});
