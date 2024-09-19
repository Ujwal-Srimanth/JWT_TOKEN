const User = require('../models/User')
const jwt = require('jsonwebtoken')

const handleErros = (err) => {
    console.log(err.message,err.code)
    let error = {email:'',password:''}
    if(err.message==='Incorrect Password'){
        error.password = 'The Password You Entered is Wrong'
    }
    if(err.message === 'Incorrect Email'){
        console.log("hi")
        error.email = 'The Email You entered is wrong'
    }
    if(err.code === 11000){
        error.email = "The email is already registered";
        return error
    }
    if(err.message.includes("user validation failed")){
        Object.values(err.errors).forEach(({properties})=>{
            error[properties.path] = properties.message
        })
    }
    return error;
}
const maxAge = 3*24*24*60
const createToken = (id) => {
    return jwt.sign({id},'ujwal srimanth varma',{
        expiresIn:maxAge
    })
}
module.exports.signup_get = (req,res) => {
    res.render('signup')
}
module.exports.signup_post = async(req,res) => {
    const {email,password} = req.body
    try{
        const user = await User.create({email,password})
        const token = createToken(user._id)
        res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000})
        res.status(201).json({user:user._id})
    }catch(err){
        console.log(err)
        const errors = handleErros(err)
        res.status(400).json(errors)
    }
}

module.exports.login_get = (req,res) => {
   res.render('login')
}

module.exports.login_post = async (req,res) => {
   const {email,password} = req.body;
   try{
    const user = await User.login(email,password)
    const token = createToken(user._id)
    res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000})
    res.status(200).json({user:user._id})
   }catch(error){
    const errors = handleErros(error)
        res.status(400).json(errors)
   }

}

module.exports.logout_get = async (req,res) => {
    res.cookie('jwt','',{maxAge:1})
    res.redirect('/')
}

