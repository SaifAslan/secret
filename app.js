require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const md5 = require('md5');
const bcrypt = require('bcrypt');
const saltRounds = 10;
// const encrypt = require('mongoose-encryption');

const app = express();

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  userName: String,
  password: String
});



// userSchema.plugin(encrypt, {secret: process.env.secret, encryptedFields: ["password"] });

const USER = new mongoose.model("USER", userSchema);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));



app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  USER.findOne({
    userName: username
  }, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      bcrypt.compare(password, foundUser.password, function(err, result) {
        if (result === true) {
          res.render("secrets");
        }
      });
    }
  });
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new USER({
      userName: req.body.username,
      password: hash
    });
    newUser.save(function(err) {
      if (!err) {
        console.log("no errors");
        res.render("secrets");
      } else {
        console.log(err);
      }
    });
  });


});


app.listen(3000, function() {
  console.log("the server is up on the port 3000.");
});
