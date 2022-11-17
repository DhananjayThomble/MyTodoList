const express = require('express');
const bodyParser = require('body-parser');

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

app.get("/", function(req, res){

    let today = new Date();
    let dateOptions = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    let day = today.toLocaleString("en-IN", dateOptions);

    res.render("list", {kindOfDay : day , itemArray: items});

});

app.post("/",function(req, res){

    //takes input from frontend and store it in the array
    items.push(req.body.newItem);
    
    //displays the latest array of todo list
    res.redirect("/");
});


app.listen(port, function(){
    console.log(`Server started at ${port}`);
});