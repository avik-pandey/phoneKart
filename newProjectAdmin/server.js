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

var userSchema = new mongoose.Schema({
    name:String,
    phoneNo:Number,
    email:String,
    location:String,
    password:String,
    isLogged:Boolean,

  });

  var orderSchema = new mongoose.Schema({
    name:String,
    model:String,
    price:Number,
    address:String,
    date:Date,
    sellerId:String,
    buyerId:String,
    couponApplied:Boolean

});

var user = mongoose.model("user", userSchema);
var order = mongoose.model("order" , orderSchema);

app.get('/',function(req,res){
    
    res.render("index.ejs",{loggedInUsers,salesRecord});
    // res.send("sucess");
})

app.get('/home',function(req,res){
    res.render("home.ejs",{loggedInUsers,salesRecord});
})
var loggedInUsers = [];
var salesRecord = [];
app.get('/dailyLoggedIn',function(req,res){
    
    user.find({isLogged:true},function(req,res){
        console.log(res);
        loggedInUsers = res;          
    })

    if(loggedInUsers.length > 0){
    res.render("dailyLoggedIn.ejs",{loggedInUsers,salesRecord});
    }
})

app.get('/DailySaleRecord',function(req,res){

    order.find(function(req,res){
        console.log(res);
        salesRecord = res;
    })
    if(salesRecord.length > 0){
    res.render("DailySaleRecord.ejs",{loggedInUsers,salesRecord});
    }
})

app.post('/home',function(req,res){
    console.log(req.body.email);
    console.log(req.body.password);
     if(req.body.email == 'avikmika@gmail.com' && req.body.password == 'iampandey'){
         res.render('home.ejs',{loggedInUsers,salesRecord});
     }
})






app.listen(8080, function() {
    console.log("server started on");
  });