const authUser = require("../models/User");
const jwt = require("jsonwebtoken");
//handle erros
const handleErrors = (err)=>{
    // console.log(err.message,err.code)
    let errors = {email:"",password:""};


    // incorrect email
    if (err.message === 'incorrect email') {
      errors.email = 'That email is not registered';
    }

    // incorrect password
    if (err.message === 'incorrect password') {
      errors.password = 'That password is incorrect';
    }





    //duplicate error code
    if (err.code === 11000) {
        errors.email = 'that email is already registered';
        return errors;
    }
    
      



    // validation errors
  if (err.message.includes('authUser validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }
    return errors;
}

const maxAge = 3*24*60*60;
const createToken=(id)=>{
  return jwt.sign({id},process.env.SECRET_KEY,{
    expiresIn:maxAge
  });
};



module.exports.signup_get=(req,res)=>{
res.render("signup")
};
module.exports.login_get=(req,res)=>{
res.render("login")
};

module.exports.signup_post= async(req,res)=>{
    const {email,password} = req.body;
    try {
        const user = await authUser.create({email,password});

        const token = createToken(user._id);
        res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
        res.status(201).json({user:user._id});
    } catch (error) {
        const errors = handleErrors(error);

        res.status(500).json({errors})
    }
    // res.send("<h1>signup post method</h1>")
};
module.exports.login_post=async (req,res)=>{
 const {email,password} = req.body;
 try {
  const user = await authUser.login(email,password);
  const token = createToken(user._id);
  res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
  res.status(200).json({user:user._id});
 } catch (error) {
  const errors = handleErrors(error);
  res.status(400).json({errors});
 }
};
module.exports.logout_get = (req,res)=>{
  res.cookie("jwt","",{maxAge:1});
  res.redirect("/");
};