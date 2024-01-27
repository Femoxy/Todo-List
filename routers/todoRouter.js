const express = require('express');
const  {signUp, verify, logIn, getAll,forgotPassword, resetPassword, signOut }  = require('../controllers/userController');
const   {newTask, allUserTask, taskUpdate, deleteTask} = require('../controllers/todoController');
//const {authenticator} = require('../middleware/authentication');


const router = express.Router();

router.post('/signup', signUp);

router.get('/verify/:id/:token', verify);

//router.get('/getOne/:id', getOne)

 router.post('/login', logIn);

router.post('/forgotPassword',forgotPassword);

router.get('/resetPassword/:id/:token', resetPassword);

router.post('/signOut/:id', signOut)


// router.post('/logout', authenticate, logOut);

 router.get('/all', getAll);

router.post('/newTodo/:id', newTask);

router.get('/allTodo/:id', allUserTask);

 router.put('/task/:id', taskUpdate);

router.delete('/delete/:id',deleteTask)




module.exports = router