const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const inshorts = require("./DataFetcher");
const axios = require("axios");
var nodemailer = require("nodemailer");

mongoose.connect("mongodb://localhost:27017/mydb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const schema = new mongoose.Schema({
  username: String,
  email: String,
  pno: Number,
  password: String,
});
const user = mongoose.model("user", schema);
var app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
  return res.render("index");
});

app.get("/login", function (req, res) {
  return res.render("login");
});

app.get("/sign_up", function (req, res) {
  return res.render("register");
});

app.get("/applyloan", function (req, res) {
  return res.render("contactform");
});
app.post("/sign_up", (req, res) => {
  user.exists({ email: req.body.email }, (err, result) => {
    if (err) {
      console.log(err);
      return;
    } else {
      if (result) {
        res.send(false);
        console.log("Not Added");
      } else {
        const newUser = new user({
          username: req.body.username,
          email: req.body.email,
          pno: req.body.pno,
          password: req.body.password,
        });
        newUser.save();
        res.send(true);
        console.log("Added");
      }
    }
  });
});
app.post("/login", (req, res) => {
  user.exists({ email: req.body.email }, (err, result) => {
    if (err) {
      console.log(err);
      return;
    } else {
      user.findOne({ email: req.body.email }, (err, resultFind) => {
        if (err) {
          console.log(err);
        } else {
          res.send(req.body.password === resultFind.password);
          console.log("You logged In");
        }
      });
    }
  });
});

app.post("/index", (req, res) => {
  var options = {
    lang: "en",
    category: "entertainment",
    numOfResults: 25,
    click: true,
  };
  inshorts.get(options, function (result) {
    res.send(result);
  });
});

var transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "deorasakshi@gmail.com",
    pass: "23091999",
  },
});

app.post("/applyloan", (req, res) => {
  var fname = req.body.fname;
  var lname = req.body.lname;
  var email = req.body.email;
  var pno = req.body.pno;
  var loantype = req.body.loantype;
  var textmsg = req.body.textmsg;

  var data = {
    fname: fname,
    lname: lname,
    email: email,
    pno: pno,
    loantype: loantype,
    textmsg: textmsg,
  };
  console.log("Hello");
  var db = mongoose.connection;
  db.collection("contact").insertOne(data, (err, collection) => {
    if (err) {
      // throw err;
      console.log("Error");
    }
    console.log("Record Inserted Successfully");
  });

  var mailOptions = {
    from: "deorasakshi@gmail.com",
    to: req.body.email,
    subject: "Registered",
    text: "You applied for a loan",
  };
  transport.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Error");
    } else {
      console.log("Email sent" + info.response);
    }
  });

  return res.redirect("/index.html");
});

// app.get("/", (req, res) => {
//   res.set({
//     "Allow-access-Allow-Origin": "*",
//   });
//   return res.redirect("index.html");
// });

app.listen(3000, () => {
  console.log("server is start");
});
