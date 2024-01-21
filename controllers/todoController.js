const {userModel, taskModel} = require('../models/todoModel')

//create a task
const newTask = async(req, res)=>{
    try {
        const taskOwner = await userModel.findById(req.params.id)
        const { content, date}=req.body;
        const newTask =  new taskModel({user:taskOwner._id, content, date});
        
       taskOwner.todo.push(newTask);
       newTask.save();
        taskOwner.save()
        res.status(201).json(newTask)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

//get a user task
const userTask= async (req, res)=>{
    try {
        const userId = req.params.id
        const checkUser = await userModel.findById(userId);
        if(checkUser){
            return res.status(404).json({
                message: "User not Found"
            })
        }
        const oneTask = await taskModel.findById({user:userId});
        res.status(200).json({
            message: "A user particular task",
            data: oneTask
        })
        
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

//getAll user task
  const allUserTask = async(req, res)=>{
    try {
        const userId = req.params.id;
        const checkUser = await userModel.findById(userId);
        if(!checkUser){
           return res.status(404).json({
                message: 'User not Found'
            })
        }
        const userTask = await taskModel.find({user:userId});
        res.status(200).json({
            message: "All user's task",
            data: userTask
        })

        
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
  }

//update/Edit a Task
const taskUpdate = async (req, res)=>{
    try {
        const taskId = req.params.id;
        const task = await taskModel.findById(taskId);
        //check for entity and replace with existing data
        const Data = {
            content: req.body.content || task.content,
            date: req.body.date || task.date,
        }
        const update = await taskModel.findByIdAndUpdate(taskId, req.body, {new: true});
       
        res.status(200).json({
            message: 'Updated successfully',
            data: Data
        });
    } catch (error) {
        res.status(500).json({ 
            message: error.message
         });
    }
  }

  //delete a Task
  const deleteTask = async (req, res)=>{
    try {
        const taskId = req.params.id
        const task = await taskModel.findByIdAndDelete(req.params.userId);
        res.json({message: 'Task deleted successfully'})
        
    } catch (error) {
        res.status(500).json(error.message)
    }
  }


  module.exports = {newTask, userTask, allUserTask, taskUpdate, deleteTask}
