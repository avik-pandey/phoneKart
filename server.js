  
var express = require('express');
var bodyParser  = require('body-parser');
var app = express();
var mongoose = require('mongoose');
var ejs = require('ejs'); 
var nodemailer = require('nodemailer');

const url = "mongodb+srv://user:user@cluster0-6ubxg.mongodb.net/phoneKart?retryWrites=true&w=majority";

// const connectDB = async () => {
//     await mongoose.connect(url);
//     console.log('connection done !');
// }
// connectDB();
mongoose.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
 
})
.then(() => {
        console.log('Connection to the Atlas Cluster is successful!');
    })
.catch((err) => console.error(err));

var userSchema = new mongoose.Schema({
    name:String,
    phoneNo:Number,
    email:String,
    location:String,
    password:String,
    isLogged:Boolean,

  });


var user = mongoose.model("user", userSchema);
var temp  = 0;
  

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

//password generator

function generatePassword() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

var name = "";
//register

let transport = nodemailer.createTransport({
    // host: 'smtp.mailtrap.io',
    service: 'gmail',
    port: 2525,
    auth: {
       user: 'avikmika@gmail.com',
       pass: 'Avik@838'
    }
});

app.post('/register',function(req,res){

    
    if(req.body != ""){
    var password = generatePassword();
    console.log(password,'pass');     
    var item = new user({
    name: req.body.name,
    phoneNo:req.body.phoneNo,
    email:req.body.emailId,
    location:req.body.location,
    password:password,
    isLogged:true,

   });
   }

   user.create(item, function(err, user){
    if(err) console.log("err2");
    else{
      console.log("inserted item"+item);
      
    }
   });

   name = req.body.name;
   
   
   var message = {
    from: 'avikmika@gmail.com', // Sender address
    to: req.body.emailId,         // List of recipients
    subject: 'Login Credentials', // Subject line
    text: 'Hi, login credentials mailId  = use the mail id you registered ans password  ' + password + "!" // Plain text body
    };

    transport.sendMail(message, function(err, info) {
    if (err) {
      console.log(err)
    } else {
      console.log(info);
    }
   });
  
   res.render("register.ejs");
  
 

}); 


//tXN9tBIA
//login

app.post('/home',function(req,res){
     console.log(req.body.email);
     user.find({email:req.body.email,password:req.body.password},function(req,res){
         console.log('fine');
         console.log(res);
     });
});






app.listen(3000, function() {
    console.log("server started on");
  });
