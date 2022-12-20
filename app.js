require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const myDate = require("./dates");
const mongoose = require("mongoose"); // for database

const port = 3001;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

//it will load files from public directory
// In nodejs, we can not directly use any file from the project directory
app.use(express.static("public"));

// to render ejs webpage
// ejs- embedded javascript
app.set("view engine", "ejs");
let itemName = "";
let listName;
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

const listCategorySchema = new mongoose.Schema({
  listCategory: String,
  items: [todoSchema],
});

// Creating Model for todo list : A model is a class with which we construct documents.
const Todo = mongoose.model("todolist", todoSchema);

const ListCategory = mongoose.model("todoListCategory", listCategorySchema);
const list1 = new Todo({
  item: "Welcome to your todolist",
});
const list2 = new Todo({
  item: "Hit the + button to add a new item",
});
const defaultItems = [list1, list2];

/* ---------------------------------- Database ---------------------------------- */

// array, empty array = [];
const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

app.get("/", function (req, res) {
  const today = myDate.day();
  // gettting data from database
  let itemArray = [];
  listName = today;
  Todo.find({}, function (err, results) {
    if (err) {
      console.log(err);
      res.send("Error in fetching data from database");
    } else {
      // data is fetched from database.
      if (results.length === 0) {
        // no list in the collections. Inserting default list
        Todo.insertMany(defaultItems, function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("Successfully saved default items to database");
          }
        });

        res.redirect("/");
        return;
      }

      itemArray = results.map((result) => result);
      res.render("list", { kindOfList: today, itemArray: itemArray });
    }
  });
});

app.post("/", function (req, res) {
  //takes input from frontend and store it in the array
  // items.push(req.body.newItem);
  itemName = req.body.newItem;
  // console.log(listName);
  const item = new Todo({
    item: itemName,
  });
  if (listName === myDate.day()) {
    // its default list

    // saving root/main list to database
    item.save();
    //displays the updated todo list
    res.redirect("/");
  } else {
    // another todolist

    // find the corresponding list category and insert the item in it
    ListCategory.findOne({ listCategory: listName }, (err, foundList) => {
      foundList.items.push(item);
      foundList.save((err, result) => {
        if (err) console.error("Error while saving the list: ", err);
        else {
          // redirect user to the corresponding page to view the updated list.
          res.redirect("/" + listName);
        }
      });
    });
  }
});

// to delete list
app.post("/delete", (req, res) => {
  const deletedItemId = req.body.itemId;
  const listName = req.body.listName;

  if (listName === myDate.day()) {
    // default list
    Todo.deleteOne({ _id: deletedItemId }, (err) => {
      if (err) console.error(err);
      // else console.log("deleted!");
      res.redirect("/");
    });
  } else {
    // find the list category, then find the item name, and remove it.
    ListCategory.findOneAndUpdate(
      { listCategory: listName },
      { $pull: { items: { _id: deletedItemId } } },
      (err) => {
        if (err) console.error(err);
        else {
          // deleted
          res.redirect("/" + listName);
        }
      }
    );
  }
});

// auto create route and provide list category feature to the user
app.get("/:listCategory", (req, res) => {
  // console.log(req.params.category);
  let itemArray = [];
  const listCategory = req.params.listCategory;
  listName = listCategory;
  // check whether the list category exists or not
  ListCategory.findOne({ listCategory: listCategory }, (err, results) => {
    if (results) {
      // if category is found in collection
      res.render("list", { kindOfList: listName, itemArray: results.items });
    } else {
      // category not exist yet, creating new category
      const list = new ListCategory({
        listCategory: listCategory,
        items: defaultItems,
      });
      list.save();
      res.render("list", { kindOfList: listName, itemArray: itemArray });
    }
  });
});

app.listen(port, function () {
  console.log(`Server started at ${port}`);
});
