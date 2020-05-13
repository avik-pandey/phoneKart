  
var express = require('express');
var bodyParser  = require('body-parser');
var app = express();
var mongoose = require('mongoose');
var ejs = require('ejs'); 
var nodemailer = require('nodemailer');
var Publishable_key  = "pk_test_JmvcFBxXBX3bHfZkcEDJG38A00PnhiAfhG";
var Stripe_key = "sk_test_V1jI1mtBnnn11EqTh3OOEQ3o00YA0BzOCY";
var stripe = require('stripe')(Stripe_key);

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

var productSchema = new mongoose.Schema({
    model:String,
    price:Number,
    phoneImage:Buffer,
    sellerId:String,

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
var product = mongoose.model("product", productSchema);
var order = mongoose.model("order" , orderSchema);
var temp  = 0;
  

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
var name = "";
var productDetail = [];
var fPrice = "";
app.get('/home',function(req,res) {

    product.find({},function(req,res,err){
       if(err){
           console.log(err);
       }
       else{
           productDetail = res;
        //    console.log(productDetail);
       }
    });
    res.render("index.ejs",{name,productDetail,key:Publishable_key,fPrice});
  });

app.get('/login',function(req,res) {
    res.render("login.ejs",{name,productDetail,key:Publishable_key,fPrice});
  });


app.get('/register',function(req,res) {
    res.render("register.ejs",{name,productDetail,key:Publishable_key,fPrice});
  });

app.get('/productSell',function(req,res){
    res.render("productSell.ejs",{name,productDetail,key:Publishable_key,fPrice});
  }); 

app.get('/bought',function(req,res){
    res.render("bought.ejs",{name,productDetail,key:Publishable_key,fPrice}); 
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
    isLogged:false,

   });
   }

   user.create(item, function(err, user){
    if(err) console.log("err2");
    else{
      console.log("inserted item"+item);
      
    }
   });

  
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
  
   res.render("register.ejs",{name,productDetail,key:Publishable_key,fPrice});
  
 

}); 


//tXN9tBIA
//login
var sellerId = "";
app.post('/home',function(req,res){
     console.log(req.body.email);
     
     user.find({email:req.body.email,password:req.body.password},function(req,res){
         
        //  console.log(res);
         name = res[0].name;
         sellerId = res[0]._id;
         console.log(name);
       
     });
     
     if(name != ""){
        user.updateOne({email:req.body.email,password:req.body.password},{$set:{isLogged:true}},function(req,res){
            console.log(res);
        });
        res.render("index.ejs",{name,productDetail,key:Publishable_key,fPrice});
      }
     
});

//products

app.post('/productSell',function(req,res){
     
    if(res.body!=""){

        var phoneItem = new product({
            model: req.body.model,
            price:req.body.price,
            phoneImage:req.body.phoneImage,
            sellerId:sellerId,
        
           });

    }
    console.log(req.body);
    product.create(phoneItem, function(err, user){
        if(err) console.log("err2");
        else{
          console.log("inserted item"+phoneItem);
          
        }
       });

     res.render('productSell.ejs',{name,productDetail,key:Publishable_key,fPrice});  

});

//orders
var productId = "";
app.post("/test",function(req,res){
  // console.log("ppp");
  productId = req.body;
  console.log("stsID "+productId.str );
});
var buyerId = sellerId;
var couponCode = "avik"; //coupon

// var fPrice = "";
var fAddress = "";
var fName = "";
app.post('/bought',function(req,res){
      var orderedProductDetails = productDetail[productId.str];
      console.log(orderedProductDetails);
      var couponStatus = false;
      if(req.body.coupon!=""){
         if(req.body.coupon == couponCode ){
           orderedProductDetails.price = orderedProductDetails.price - 0.2*orderedProductDetails.price;
           couponStatus = true;
         }
         else{
           couponStatus = false;
         }
      }

      if(req.body != "" ){
        fPrice = orderedProductDetails.price;
        fAddress = req.body.address;
        fName = req.body.name;

        var boughtItem = new order({
          name:req.body.name,
          model:orderedProductDetails.model,
          price:orderedProductDetails.price,
          address:req.body.address,
          date:req.body.date,
          sellerId:orderedProductDetails.sellerId,
          buyerId:sellerId,
          couponApplied:couponStatus,

        });
      }

      order.create(boughtItem,function(err){
          if(err){
            console.log(err);
          }
          else{
            fPrice = fPrice*100;
            console.log("inserted ",boughtItem);

          }
      })

      res.render("payment.ejs",{name,productDetail,key:Publishable_key,fPrice});

});




app.post('/payment', function(req, res){ 
  
  // Moreover you can take more details from user 
  // like Address, Name, etc from form 
  
  // console.log(fPrice);
  // console.log(fName);
  // console.log(fAddress);
  stripe.customers.create({ 
      email: req.body.stripeEmail, 
      source: req.body.stripeToken, 
      name: fName, 
      address: { 
        line1: 'TC 9/4 Old MES colony', 
        postal_code: '452331', 
        city: 'Indore', 
        state: 'Madhya Pradesh', 
        country: 'India', 
    } 
  }) 
  .then((customer) => { 

      return stripe.charges.create({ 
          amount: fPrice,
          description:"phone product",  
          currency: 'INR', 
          customer: customer.id 
      }); 
  }) 
  .then((charge) => { 
      
      res.send("<h1>success!</h1><a href = '/home' >go to home</a>")
                         // If no error occurs 
  }) 
  .catch((err) => { 
      console.log(err);
      res.send(err)       // If some error occurs 
  }); 
}) 









app.listen(3000, function() {
    console.log("server started on");
  });
