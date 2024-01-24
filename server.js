const express = require('express');
require('./config/dbConfig');
require('dotenv').config()
const cors = require("cors");

//const fileUpload=require("express-fileupload")

const app = express();
app.use(cors({origin: "*"}));
app.use(express.json());
const todoRouter = require('./routers/todoRouter')

app.get('/', (req, res)=>{
    res.send("Welcome to your todo list app")
})
app.use('/', todoRouter)

const port = process.env.port

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})