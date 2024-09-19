const jwt = require('jsonwebtoken')
const User = require('../models/User')
const requireAuth = (req,res,next) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,'ujwal srimanth varma',(err,decodedToken)=>{
            if(err){
                res.redirect('/login')
            }else{
                next();
            }
        })
    }else{
        res.redirect('/login',)
    }

}

const checkUser = (req,res,next)=>{
    const token = req.cookies.jwt;
    console.log(token)
    if(token){
        jwt.verify(token,'ujwal srimanth varma',async (err,decodedToken)=>{
            if(err){
                res.locals.user = null;
                next()
            }else{
                let user = await User.findById(decodedToken.id)
                res.locals.user = user;
                next();
            }
        })
    }else{
        console.log("hi")
        res.locals.user = null;
        next();
    }

}
module.exports = {requireAuth,checkUser}