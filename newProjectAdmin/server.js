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
    console.log("ok");
    res.render("index.ejs");
    // res.send("sucess");
})


app.listen(3000, function() {
    console.log("server started on");
  });