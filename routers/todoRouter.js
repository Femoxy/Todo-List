const express = require('express');
const  {signUp, verify, logIn, signOut }  = require('../controllers/userController');
const   {newTask, allUserTask, taskUpdate, deleteTask} = require('../controllers/todoController');
const autheticator = require('../middleware/authentication');

const router = express.Router();

router.post('/signup', signUp);

router.get('/verify/:id/:token', verify);

//router.get('/getOne/:id', getOne)

 router.post('/login', logIn);

//router.post('/forgotPassword', forgotPassword);

//router.get('/resetPassword/:id/:token', resetPassword);

router.post('/signOut/:id', signOut)


// router.post('/logout', authenticate, logOut);

 //router.get('/all', getAll);

router.post('/newTodo/:id', autheticator, newTask);

router.get('/allTodo/:id',autheticator, allUserTask);

 router.put('/task/:id',autheticator, taskUpdate);

router.delete('/delete/:id',autheticator, deleteTask)




module.exports = router