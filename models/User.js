const mongoose = require('mongoose')
const {isEmail} = require('validator')
const bcrypt = require("bcrypt")
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Please Enter an Email"],
        unique:true,
        lowercase:true,
        validate:[isEmail,"Please Enter a valid email"]
    },
    password:{
        type:String,
        required:[true,"Please Enter an Password"],
        minLength:[6,"Minimum Password Length is 6 characters"]
    },
})

//fire a function after doc is saved
userSchema.post('save', function(doc,next){
    console.log("new user is created",doc)
    next();
})

//fire a function before the doc is saved
userSchema.pre('save', async function(next){
    //console.log("user  about to create and save",this)
    const salt = await bcrypt.genSalt()
    console.log(salt)
    this.password = await bcrypt.hash(this.password,salt)
    next();
})

userSchema.statics.login = async function(email,password){
    
    const user = await this.findOne({email})
    if(user){
        const auth = await bcrypt.compare(password,user.password);
        if(auth){
            console.log(user)
            return user
        }
        throw Error('Incorrect Password')
    }  
    throw Error('Incorrect Email')
}
const User = mongoose.model("user",userSchema)


module.exports = User;