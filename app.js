//jshint esversion:6
require("dotenv").config();//----> L-3
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;


/*******************************LEVEL-5(Hashing and salting using bcrypt)********************************
 In salting we add some randome characters(salt) to the real pw and and then passes through hash function 
 and we can decide for how many times salting is to be done. More the salting rounds stronger the passwords
 are.
 */ 


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

  //generates hash
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User({
      email: req.body.username,
      password: hash //hashed and salted pw
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
   
});

// LOGIN --> when user clicks on login and submits the email and password, first the username is 
// checked in the database with the emails available there, if username matches with any email 
// in database then its password is matched with the email's password if that is also same, 
// he will then have the access to SECRETS page.
app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ email: username }, function (err, foundUser) {
    if (!err) {
      if (foundUser) {
        //compare pw with hash in database
        bcrypt.compare(password, foundUser.password, function (err, result) {
          // result == true
          if (result === true) {
            res.render("secrets");
          }
        });
      }
    } else {
      console.log(err);
    }
  });
});


app.listen(3000, function(){
  console.log("server started on port 3000");
});