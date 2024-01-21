const express = require('express');
require('./config/dbConfig');
require('dotenv').config()
const cors = require("cors");
const port = process.env.port

const todoRouter = require('./routers/todoRouter')
//const fileUpload=require("express-fileupload")


const app = express();
app.use(express.json());
app.use(cors("*"));

// app.use(fileUpload( {
//     useTempFiles:true,
//     limits: { fileSize: 5 * 1024 * 1024 },
//   }
//   ));

app.get('/', (req, res)=>{
    res.send("Welcome to your todo list app")
})
app.use('/', todoRouter)

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})