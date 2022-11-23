const express = require("express");
const bodyParser = require("body-parser");

const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

//it will load files from public directory
// In nodejs, we can not directly use any file from the project directory
app.use(express.static("public"));

// to render ejs webpage
// ejs- embedded javascript
app.set("view engine", "ejs");

// array, empty array = [];
let items = ["Buy Food", "Cook Food", "Eat Food"];
let workItems = [];

app.get("/", function (req, res) {
  let today = new Date();
  let dateOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  let day = today.toLocaleString("en-IN", dateOptions);

  res.render("list", { kindOfList: "Default List", itemArray: items });
});

app.post("/", function (req, res) {
  //takes input from frontend and store it in the array
  items.push(req.body.newItem);

  //displays the latest array of todo list
  res.redirect("/");
});

app.get("/work", function (req, res) {
    res.render("list", { kindOfList: "Work List", itemArray : workItems});
});

app.post("/work", function(req, res){
    workItems.push(req.body.newItem);
    // console.log("work array updated");
    res.redirect("/work");
});

app.listen(port, function () {
  console.log(`Server started at ${port}`);
});
