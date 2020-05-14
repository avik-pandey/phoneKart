var express = require('express');
var bodyParser  = require('body-parser');
var app = express();
var mongoose = require('mongoose');

const url = "mongodb+srv://user:user@cluster0-6ubxg.mongodb.net/phoneKart?retryWrites=true&w=majority";

mongoose.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
 
})
.then(() => {
        console.log('Connection to the Atlas Cluster is successful!');
    })
.catch((err) => console.error(err));


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.get('/',function(req,res){
    
    res.render("index.ejs");
    // res.send("sucess");
})

app.get('/home',function(req,res){
    res.render("home.ejs");
})

app.get('/dailyLoggedIn',function(req,res){
    res.render("dailyLoggedIn.ejs");
})

app.get('/DailySaleRecord',function(req,res){
    res.render("DailySaleRecord.ejs");
})

app.post('/home',function(req,res){
    console.log(req.body.email);
    console.log(req.body.password);
     if(req.body.email == 'avikmika@gmail.com' && req.body.password == 'iampandey'){
         res.render('home.ejs');
     }
})




app.listen(8080, function() {
    console.log("server started on");
  });