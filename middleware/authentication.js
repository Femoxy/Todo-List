
const jwt=require("jsonwebtoken")
const {userModel} = require("../models/todoModel")
require("dotenv").config();

const authenticator=async(req,res,next)=>{
const  newUser=await userModel.findById(req.params.id)
const token=newUser.token
 jwt.verify(token,process.env.secret,(err,payLoad)=>{
   
    if(err){res.json("you are not logged in")}
    else{
        req.user=payLoad
        next()
    }
})
}

module.exports={ authenticator}
