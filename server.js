  
var express = require('express');
var bodyParser  = require('body-parser');
var app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.get('/home',function(req,res) {
    res.render("index.ejs");
  });
app.get('/login',function(req,res) {
    res.render("login.ejs");
  });
app.get('/register',function(req,res) {
    res.render("register.ejs");
  });  

app.listen(3000, function() {
    console.log("server started on");
  });
