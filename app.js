//jshint esversion:6
require("dotenv").config();//----> L-3
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

/*******************************LEVEL-4(Hashing using md5)********************************
 In hashing the password is passed through the function md5(), and is changed into a hash which is not reversible
 and no can easily get in our passwords. 
 */ 
const md5 = require("md5");//---> L-4

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true, useUnifiedTopology:true});

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");



const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


const User = mongoose.model("User", userSchema);

app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
    res.render("home");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.get("/login", function(req, res){
    res.render("login");
});


//REGISTER --> when user clicks on register and submits the email and password, he will then have the access to SECRETS page.
app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)//converting to irreversible hash
    });
    newUser.save(function(err){
        if(err){
            console.log(err);
        }
        else{
            res.render("secrets");
        }

    });
});

// LOGIN --> when user clicks on login and submits the email and password, first the username is 
// checked in the database with the emails available there, if username matches with any email 
// in database then its password is matched with the email's password if that is also same, 
// he will then have the access to SECRETS page.
app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = md5(req.body.password);

  User.findOne({ email: username }, function (err, foundUser) {
    if (!err) {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        }
      }
    } else {
      console.log(err);
    }
  });
});


app.listen(3000, function(){
  console.log("server started on port 3000");
});