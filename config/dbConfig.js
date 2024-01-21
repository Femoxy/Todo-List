const mongoose = require('mongoose');
require('dotenv').config()

const dbHost='localhost:27017'
const dbName='TodoProject'
const url = "mongodb+srv://olufemi261:ejJLARaKQ5NvfLoI@cluster0.g24dffc.mongodb.net/" 

mongoose.connect(url)
.then(()=>{
    console.log("Database connected successfully")
}) 
.catch((error)=>{
    console.log(error.message)
})