const mongoose = require('mongoose');
require('dotenv').config()

const dbHost='localhost:27017'
const dbName='TodoProject'
const url = process.env.database

mongoose.connect(url)
.then(()=>{
    console.log("Database connected successfully")
}) 
.catch((error)=>{
    console.log(error.message)
})