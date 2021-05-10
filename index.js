//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const inshorts = require("./DataFetcher");
const axios = require("axios");
// const NewsAPI = require("newsapi");
// const newsapi = new NewsAPI("bc1fb1c1c9f34f6ba5489540f6c8eb9f");
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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
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

app.post("/Login", (req, res) => {
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
        }
      });
    }
  });
});

app
  .post("/", (req, res) => {
    var options = {
      lang: "en",
      category: "entertainment",
      numOfResults: 25,
      click: true,
    };
    res.set({
      "Allow-access-Allow-Origin": "*",
    });
    inshorts.get(options, function (result) {
      res.send(result);
    });
    // var date = new Date();
    // async function submit() {
    //   try {
    //     const response = await axios.get(
    //       `https://newsapi.org/v2/everything?from=${date}&domains=bbc.co.uk,techcrunch.com,engadget.com&page=5&apiKey=bc1fb1c1c9f34f6ba5489540f6c8eb9f`
    //     );
    //     res.send(response.data);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // }
  })
  .listen(3000);
