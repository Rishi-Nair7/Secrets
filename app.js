//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB")

const userSchema = new mongoose.Schema({
  email: String,
  password: String
})



userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

const User = mongoose.model("User", userSchema);


app.get("/", function(req,res){
    res.render("home");
})

app.get("/login", function(req,res){
    res.render("login", {errMsg: ""});
})

app.get("/register", function(req,res){
    res.render("register");
})

app.post("/register", function(req,res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  })

  newUser.save(function(){
    res.render("secrets");
  })
})

app.post("/login", function(req,res){

  User.findOne({email: req.body.username, password: req.body.password}, function(err,result){
    if(result){
      res.render("secrets");
    }else{
      res.render("login", {errMsg: "Incorrect Email or Password"});
    }
  })
})

app.listen(3000, function() {
    console.log("Server started on port 3000.");
});
