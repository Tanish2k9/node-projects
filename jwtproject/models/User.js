const mongoose = require("mongoose")
const {isEmail} = require("validator")
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email:{
        type:String,
        required:[true,"Please enter an email"],
        unique:true,
        lowercase:true,
        validate:[isEmail,"enter a valid Email bro "]
    },
    password:{
        type:String,
        required:[true,"Please enter a password"],
        minlength:[6,"minimum password length should be 6 character"],


        //niche wala validation true hai use kr skte ho
        // validate:[(value)=>{
        //     return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/.test(value);
        // },"enter the valid password -- a password between 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character."]
    }
})


//mongoose pre and post hooks "save" it use wnen in authcontroller data is going to create
//monngose hooks fire when certain function happen like save

// userSchema.post("save",function(doc,next){
//     console.log("user created and saved",doc);
//     next();
// })

// fire a function before doc saved to db
userSchema.pre('save', async function (next) {
//   console.log('user about to be created & saved', this);
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    next();
});

userSchema.statics.login = async function(email,password){
    const user = await this.findOne({email});
    if(user){
        const auth = await bcrypt.compare(password,user.password);
        if(auth){
            return user;
        }
        throw Error("incorrect password");
    }
    throw Error("incorrect email")
}


const authUser = mongoose.model("authUser",userSchema);
module.exports = authUser;