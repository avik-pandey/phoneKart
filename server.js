  
var express = require('express');
var bodyParser  = require('body-parser');
var app = express();
var mongoose = require('mongoose');

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

  });


var user = mongoose.model("user", userSchema);
  

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
  
app.post('/submit',function(req,res){
    console.log(req.body.name);
    if(req.body != ""){
  var item = new user({
    name: req.body.name,
    phoneNo:req.body.phoneNo,
    email:req.body.email,
    location:req.body.location,

  });
}

user.create(item, function(err, user){
    if(err) console.log("err2");
    else{
      console.log("inserted item"+item);
      
    }
  });

   res.render('index.ejs');

}); 


app.listen(3000, function() {
    console.log("server started on");
  });
