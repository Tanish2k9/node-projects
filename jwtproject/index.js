require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes.js");
const authUser = require("./models/User.js");
const { requireAuth } = require("./middleware/authMiddleware.js");

 
const app = express();

//middleware
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

//view engine
app.set("view engine","ejs");

//DB CONNECTIONS
main().then(()=>console.log("db connected")).catch(err => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGO_URL);
}


app.get('/', (req, res) => res.render('home'));
app.get('/smoothies',requireAuth, (req, res) => res.render('smoothies'));

app.use(authRoutes);

app.get("/set-cookies",(req,res)=>{
  // res.setHeader("set-cookie","newUser=true");

  res.cookie("newUser",false);

  //httpOnly fronted will not get that by using document.cookie
  //secure:true when connectons is https then cookie is set otherwise not
  res.cookie("isEmpoyee",true,{maxAge:1000*60*60,httpOnly:true})
  res.send("<h1>your cookies is set</h1>")
})
app.get("/read-cookies",(req,res)=>{
  const cookies = req.cookies;
  console.log(cookies.newUser);
  res.json(cookies);
})



const port = process.env.PORT||5000

app.listen(port,()=>{
    console.log("server is listening on 5000")
})