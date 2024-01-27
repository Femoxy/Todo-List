const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true,
        lowercase: true
    },
    email:{
        type: String,
        required: true,
        lowercase: true
    },
    password:{
        type: String, 
        required: true
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    token:{
        type: String
    },
    // otpCode:{
    //     type: String
    // },

    // profilePicture:{
        
    //     public_id:{
    //         type:String,
    //     },
    //     url:{
    //         type:String,
            
    //     }},

    todo:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Todo',
}],
})

    const userModel = mongoose.model('User', userSchema)


    const taskSchema = new mongoose.Schema({
    title:{
        type: String
    },
    content:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: new Date
    },
    
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
},
})

const taskModel = mongoose.model('Todo', taskSchema);

module.exports = {userModel, taskModel}