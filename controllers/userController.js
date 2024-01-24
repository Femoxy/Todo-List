const { userModel, taskModel } = require('../models/todoModel')
const bcrypt = require("bcrypt");
const { userValidation, validateLogin } = require('../middleware/validator');
const { resetFunc } = require('../forgotPassword')
const jwt = require('jsonwebtoken');
const { sendMail } = require('../middleware/email');
const { generateDynamicEmail } = require('../mailer');
//const cloudinary = require('../middleware/cloudinary')
require('dotenv').config()




//signUp a user
const signUp = async (req, res) => {
    try {
        const { error } = await userValidation(req.body);
        if (error) {
            res.status(500).json({
                message: error.details[0].message,
            })
        } else {
            const username= req.body.username;
            const email= req.body.email;
            const password= req.body.password;
            const checkUser = await userModel.findOne({ email: email.toLowerCase() })
            
            if (checkUser) {
                return res.status(400).json({
                    message: 'Email already exist'
                })
            }

            const salt = bcrypt.genSaltSync(12)
            const hashPassword = bcrypt.hashSync(password, salt)

            // const fileUploader= await cloudinary.uploader.upload(req.files.profilePicture.tempFilePath,{folder:"Profile-Picture"},
            //     (err,profilePicture)=>{
            //     try{console.log("entering a try block")
            //         //Delete the temporary file
            //          fs.unlinksync(req.files.profilePicture.tempFilePath); 
            //          return profilePicture  
            //     }
            //     catch{
            //         return err

            //     }
            // },
            // )

            const user = new userModel({
                username,
                email,
                password: hashPassword
                // profilePicture:
                // {public_id:fileUploader.public_id,

                //     url:fileUploader.secure_url

                // }
            })
            const token = jwt.sign({ username: user.username, email: user.email }, process.env.secret, { expiresIn: '1d' })
            user.token = token

            const subject = "Kindly verify"
            const link = `${req.protocol}://${req.get('host')}/verify/${user.id}/${user.token}`

            const html = generateDynamicEmail(link, user.username)

            sendMail(
                {
                    email: user.email,
                    html,
                    subject
                }
            )

            await user.save();
            res.status(201).json({
                message: 'Account created successfully',
                data: user
            })

        }

    } catch (error) {
        res.status(500).json(error.message)
    }

}

const verify = async (req, res) => {
    try {

        const id = req.params.id;
        const user = await userModel.findById(id);
        if(user.isVerified){
            return res.status(201).json({
                message: "User already verified"
            })
        }
        jwt.verify(user.token, process.env.secret)
        user.isVerified=true
        await user.save()
        //const {username, Lastname, email} = user
        if (user.isVerified === true) {
            //return res.redirect("/login")
            return res.status(201).json(`Congratulations ${user.username}, you have been verified`)
        } else {
            jwt.verify(user.token, process.env.secret, (error) => {

                if (error) {

                    const token = jwt.sign({ username: user.username, email: user.email }, process.env.secret, { expiresIn: "5min" })
                    user.token = token

                    const link = `${req.protocol}://${req.get("host")}/verify/${user.id}/${user.token}`
                    sendMail({


                        email: user.email,
                        subject: `RE-VERIFY YOUR ACCOUNT`,
                        html: generateDynamicEmail(user.username, link),


                    })

                    return res.json("This link has expired. kindly check your email for another email to verify")

                }


            })
            
        }
        await user.save()
        
    } catch (error) {
        res.status(500).json(error.message)
    }

}

//Login a user
const logIn = async (req, res) => {
    try {
        const { error } = await validateLogin(req.body);
        if (error) {
            res.status(500).json({
                message: error.details[0].message,
            })
        } else {
            const { email, password } = req.body;

            //Find the user in the database
            const checkUser = await userModel.findOne({ email: email.toLowerCase() })

            //check if the user is not existing and reutrn a response
            if (!checkUser) {
                return res.status(404).json({
                    message: "User does not exist"
                })
            }
            //Verify the user's password
            const checkPassword = bcrypt.compareSync(password, checkUser.password);
            if (!checkPassword) {
                return res.status(400).json({
                    message: "Password is incorrect"
                })
            }
            if(checkUser.isVerified === true){
                //token to authenticate a user's actions
            const token = jwt.sign({
                userId: checkUser._id,
                username: checkUser.username,
                email: checkUser.email
            }, process.env.secret, { expiresIn: '1d' })
            checkUser.token = token
            await checkUser.save()
            //Return a success response
            res.status(201).json({
                message: "Login successfully",
                token: token
            })
        } else{
            res.status(400).json({
                message: 'You have not been verified'
            })
        }

            }
           
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

// //get a user
// const getOne = async (req, res) => {
//     try {
//         const checkUser = await userModel.findById(req.body.userId)
//         if (!checkUser) {
//             return res.status(404).json({
//                 message: 'User not found'
//             })
//         } else {
//             res.status(200).json({
//                 message: "User details",
//                 data: checkUser
//             })
//         }

//     } catch (error) {
//         res.status(500).json({
//             message: error.message
//         })
//     }
// }

// // Get all user in the database
const getAll = async (req, res) => {
    try {
        // Retrieve all users in the database
        const users = await userModel.find();

        if (users.length === 0) {
            return res.status(200).json({
                message: 'There are currently no user in the database'
            })
        };

        // Return a success message
        res.status(200).json({
            message: `There are ${users.length} users in the database`,
            users
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


const forgotPassword = async (req, res) => {
    try {
        const checkUser = await userModel.findOne({ email: req.body.email })
        if (!checkUser) {
            return res.status(404).json('Email does not exist')
        } else {
            const subject = "Forgot Password"
            const link = `${req.protocol}://${req.get('host')}/resetPassword/${checkUser.id}/${checkUser.token}`
            const html = resetFunc(link, checkUser.username)
            sendMail({
                email: checkUser.email,
                subject,
                html
            })

            return res.status(200).json("Kindly check your email for a link to reset password")
        }

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const resetPassword = async (req, res) => {
    try {
        const password = req.body.password
        const id = req.params.id

        const salt = bcrypt.genSaltSync(12);
        const hashPassword = bcrypt.hashSync(password, salt);

        const data = { password: hashPassword }

        const reset = await userModel.findByIdAndUpdate(id, data, { new: true })
        // await reset.save();
        res.status(200).json('Your password has been changed')

    } catch (error) {
        res.status(500).json({
            message: error.message
        })

    }
}

//User can delete their account
const deleteUser = async (req, res) => {
    try {
        // track the user id
        const userId = req.params.userId;
        //track user with the id gotten
        const user = await userModel.findById(userId);
        // check for error
        if (!user) {
            res.status(404).json({
                message: `User with id: ${userId} is not found.`
            }); return
        }
        // delete the user from the model
        await userModel.findByIdAndDelete(user)
        // Delete tasks associated with the user
        await taskModel.deleteMany({ userId: userId });
        return res.redirect('/');

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

//Signout
const signOut = async (req, res) => {
    try {
        const userId = req.params .id

        // Find the user by username
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Invalidate the token by setting it to null
        user.token = null;
        await user.save();

        res.status(200).json({ message: 'Sign-out successful' });

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}



module.exports = { signUp, verify, logIn, getAll,forgotPassword, resetPassword, signOut}